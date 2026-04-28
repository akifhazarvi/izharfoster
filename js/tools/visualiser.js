/* ==========================================================================
   IZHAR COLD ROOM VISUALISER
   Procedurally generates a glTF 2.0 model from form state and feeds it to
   <model-viewer>. Izhar brand palette: paper panels, ember outdoor, glacier
   interior. Uses the existing model-viewer web component (loaded from CDN).

   Public API:
     IzharViz.mount(containerEl, initialState)
     IzharViz.update(newState)            // partial updates
     IzharViz.destroy()
   ========================================================================== */

const IzharViz = (() => {
  // Brand tokens (sync with css/style.css :root)
  const COLOR = {
    paper:   [0.96, 0.95, 0.92],   // --paper      #F5F2EC
    paper2:  [0.93, 0.91, 0.86],   // --paper-2    #ECE7DC
    paper3:  [0.88, 0.86, 0.80],   // --paper-3    #E2DCCC
    ink:     [0.05, 0.06, 0.07],   // --ink        #0E0F11
    cold:    [0.04, 0.12, 0.24],   // --t-cold     #0A1F3D
    mid:     [0.31, 0.76, 0.85],   // --t-mid      #4FC3D9
    warm:    [0.89, 0.42, 0.12],   // --t-warm     #E36A1E
  };

  let viewer = null;          // <model-viewer> element
  let container = null;
  let overlay = null;
  let chipInside = null;
  let chipOutside = null;
  let sunIcon = null;
  let currentState = null;
  let currentBlobUrl = null;

  // ----- glTF builder ---------------------------------------------------
  // Generates a procedural box model with:
  //  - 4 walls (panel thickness affects wall depth)
  //  - 1 ceiling (roof thickness)
  //  - 1 floor
  //  - 1 door cut-out on the front face
  //  - subtle interior glow color
  //
  // The trick: glTF doesn't natively cut a hole in a face, so we build the
  // door as 4 small surrounding rectangles (top jamb, two side jambs, no
  // bottom because door reaches floor) and the door panel itself (recessed).
  function buildGltf(state) {
    const {
      lengthM, widthM, heightM,
      panelMm = 100,
      roofMm = panelMm,
      doorWM = 1.0,
      doorHM = 2.0,
      location = 'indoor',         // 'indoor' | 'outdoor' | 'sun'
    } = state;

    const t = panelMm / 1000;       // wall thickness in metres
    const r = roofMm / 1000;        // roof thickness
    const L = Math.max(0.5, lengthM);
    const W = Math.max(0.5, widthM);
    const H = Math.max(0.5, heightM);

    // door clamp
    const dW = Math.min(doorWM, W * 0.6);
    const dH = Math.min(doorHM, H * 0.85);
    const dXc = 0;                  // centred on front
    const dY0 = 0;                  // door starts at floor
    const dXl = -dW / 2;
    const dXr = dW / 2;
    const dYt = dH;

    // We'll build geometry using simple box meshes.
    // Each mesh becomes one node, each node references its own primitive.
    // To keep file size down, we'll author boxes via index buffers.
    const meshes = [];               // array of { name, vertices[], indices[], color, opacity? }

    // ===== Outer envelope =====
    // Floor (slightly thinner concrete look)
    meshes.push(makeBox(0, -0.05, 0, L + 0.2, 0.1, W + 0.2, COLOR.paper3, 'floor'));

    // Ceiling
    meshes.push(makeBox(0, H + r/2, 0, L, r, W, COLOR.paper2, 'ceiling'));

    // Back wall (full)
    meshes.push(makeBox(0, H/2, -W/2 - t/2, L, H, t, COLOR.paper2, 'back-wall'));

    // Left wall
    meshes.push(makeBox(-L/2 - t/2, H/2, 0, t, H, W, COLOR.paper2, 'left-wall'));

    // Right wall
    meshes.push(makeBox(L/2 + t/2, H/2, 0, t, H, W, COLOR.paper2, 'right-wall'));

    // Front wall — built as 3 strips around the door cut-out
    // Top jamb
    if (dYt < H) {
      meshes.push(makeBox(0, (H + dYt)/2, W/2 + t/2, L, H - dYt, t, COLOR.paper2, 'front-top'));
    }
    // Left jamb
    if (-L/2 < dXl) {
      meshes.push(makeBox((-L/2 + dXl)/2, dYt/2, W/2 + t/2, dXl - (-L/2), dYt, t, COLOR.paper2, 'front-left'));
    }
    // Right jamb
    if (dXr < L/2) {
      meshes.push(makeBox((dXr + L/2)/2, dYt/2, W/2 + t/2, L/2 - dXr, dYt, t, COLOR.paper2, 'front-right'));
    }

    // Door (recessed slightly into the opening, darker)
    meshes.push(makeBox(0, dYt/2, W/2 + t/2 - 0.015, dW * 0.96, dYt * 0.97, t * 0.6, COLOR.ink, 'door'));
    // Door handle dot
    meshes.push(makeBox(dW * 0.35, dYt * 0.5, W/2 + t/2 + 0.005, 0.05, 0.05, 0.02, COLOR.warm, 'handle'));

    // Interior glow plane — a thin pale-blue rectangle hovering inside the
    // doorway so when you peek in the room reads "cold"
    meshes.push(makeBox(0, dYt/2, W/2 + t/2 - 0.06, dW * 0.85, dYt * 0.9, 0.005,
      [...COLOR.mid, 0.5], 'glow', true));

    // Outdoor "sun side" tint — a translucent ember plane next to outside walls
    if (location === 'outdoor' || location === 'sun') {
      meshes.push(makeBox(L/2 + t + 0.5, H/2, 0, 0.05, H * 1.1, W * 1.1,
        [...COLOR.warm, 0.16], 'sun-tint', true));
      meshes.push(makeBox(0, H/2, -W/2 - t - 0.5, L * 1.1, H * 1.1, 0.05,
        [...COLOR.warm, 0.10], 'sun-tint-back', true));
    }

    return assembleGltf(meshes);
  }

  // ----- box primitive helper ------------------------------------------
  function makeBox(cx, cy, cz, sx, sy, sz, color, name = 'box', translucent = false) {
    const hx = sx / 2, hy = sy / 2, hz = sz / 2;
    const v = [
      // 8 corners
      [cx - hx, cy - hy, cz - hz],
      [cx + hx, cy - hy, cz - hz],
      [cx + hx, cy + hy, cz - hz],
      [cx - hx, cy + hy, cz - hz],
      [cx - hx, cy - hy, cz + hz],
      [cx + hx, cy - hy, cz + hz],
      [cx + hx, cy + hy, cz + hz],
      [cx - hx, cy + hy, cz + hz],
    ];
    // 6 faces × 2 tris × 3 verts = 36 indices, with shared corners
    const idx = [
      0,1,2, 0,2,3,        // back  -Z
      4,6,5, 4,7,6,        // front +Z
      0,3,7, 0,7,4,        // left  -X
      1,5,6, 1,6,2,        // right +X
      3,2,6, 3,6,7,        // top   +Y
      0,4,5, 0,5,1,        // bot   -Y
    ];
    const positions = [];
    v.forEach(p => positions.push(...p));
    return { name, positions: new Float32Array(positions), indices: new Uint16Array(idx), color, translucent };
  }

  // ----- assembleGltf: pack meshes into a glTF 2.0 binary blob ---------
  function assembleGltf(meshes) {
    // Build a single binary buffer: [pos1][idx1][pos2][idx2]...
    const accessors = [];
    const bufferViews = [];
    const gMeshes = [];
    const materials = [];
    const nodes = [];
    const matIndex = {}; // dedupe materials by hex
    let bufferOffset = 0;
    const chunks = [];

    meshes.forEach((m, i) => {
      const colorKey = m.color.join(',') + (m.translucent ? '|t' : '');
      let matIdx = matIndex[colorKey];
      if (matIdx == null) {
        const baseColorFactor = m.color.length === 4 ? m.color : [...m.color, 1];
        materials.push({
          name: 'mat-' + colorKey,
          pbrMetallicRoughness: {
            baseColorFactor,
            metallicFactor: m.name === 'handle' ? 0.6 : 0.0,
            roughnessFactor: m.name === 'glow' || m.translucent ? 0.85 : 0.6
          },
          alphaMode: m.translucent || baseColorFactor[3] < 1 ? 'BLEND' : 'OPAQUE',
          doubleSided: true
        });
        matIdx = materials.length - 1;
        matIndex[colorKey] = matIdx;
      }

      // Position accessor
      const posOffset = bufferOffset;
      const posByteLen = m.positions.byteLength;
      // Pad to 4-byte alignment for index that follows
      const posAligned = Math.ceil(posByteLen / 4) * 4;
      const posPad = posAligned - posByteLen;
      chunks.push(m.positions.buffer);
      if (posPad > 0) chunks.push(new Uint8Array(posPad).buffer);
      bufferViews.push({ buffer: 0, byteOffset: posOffset, byteLength: posByteLen, target: 34962 /* ARRAY_BUFFER */ });
      const posBVIdx = bufferViews.length - 1;
      accessors.push({
        bufferView: posBVIdx, componentType: 5126 /* FLOAT */,
        count: m.positions.length / 3, type: 'VEC3',
        min: minVec3(m.positions), max: maxVec3(m.positions)
      });
      const posAccIdx = accessors.length - 1;
      bufferOffset += posAligned;

      // Index accessor
      const idxOffset = bufferOffset;
      const idxByteLen = m.indices.byteLength;
      const idxAligned = Math.ceil(idxByteLen / 4) * 4;
      const idxPad = idxAligned - idxByteLen;
      chunks.push(m.indices.buffer);
      if (idxPad > 0) chunks.push(new Uint8Array(idxPad).buffer);
      bufferViews.push({ buffer: 0, byteOffset: idxOffset, byteLength: idxByteLen, target: 34963 /* ELEMENT_ARRAY_BUFFER */ });
      const idxBVIdx = bufferViews.length - 1;
      accessors.push({
        bufferView: idxBVIdx, componentType: 5123 /* UNSIGNED_SHORT */,
        count: m.indices.length, type: 'SCALAR'
      });
      const idxAccIdx = accessors.length - 1;
      bufferOffset += idxAligned;

      gMeshes.push({
        name: m.name,
        primitives: [{
          attributes: { POSITION: posAccIdx },
          indices: idxAccIdx,
          material: matIdx,
          mode: 4 /* TRIANGLES */
        }]
      });
      nodes.push({ name: m.name, mesh: gMeshes.length - 1 });
    });

    // Concatenate buffer chunks
    const totalLen = chunks.reduce((s, c) => s + c.byteLength, 0);
    const out = new Uint8Array(totalLen);
    let off = 0;
    chunks.forEach(c => {
      out.set(new Uint8Array(c), off);
      off += c.byteLength;
    });
    const bufferB64 = uint8ToBase64(out);

    const gltf = {
      asset: { version: '2.0', generator: 'IzharViz' },
      scene: 0,
      scenes: [{ nodes: nodes.map((_, i) => i) }],
      nodes,
      meshes: gMeshes,
      materials,
      accessors,
      bufferViews,
      buffers: [{ byteLength: totalLen, uri: 'data:application/octet-stream;base64,' + bufferB64 }]
    };
    return gltf;
  }

  function minVec3(arr) {
    const m = [Infinity, Infinity, Infinity];
    for (let i = 0; i < arr.length; i += 3) {
      if (arr[i] < m[0]) m[0] = arr[i];
      if (arr[i+1] < m[1]) m[1] = arr[i+1];
      if (arr[i+2] < m[2]) m[2] = arr[i+2];
    }
    return m;
  }
  function maxVec3(arr) {
    const m = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < arr.length; i += 3) {
      if (arr[i] > m[0]) m[0] = arr[i];
      if (arr[i+1] > m[1]) m[1] = arr[i+1];
      if (arr[i+2] > m[2]) m[2] = arr[i+2];
    }
    return m;
  }
  function uint8ToBase64(u8) {
    let s = '';
    const chunk = 0x8000;
    for (let i = 0; i < u8.length; i += chunk) {
      s += String.fromCharCode.apply(null, u8.subarray(i, i + chunk));
    }
    return btoa(s);
  }

  // ----- mount ---------------------------------------------------------
  function mount(containerEl, initialState) {
    container = containerEl;
    container.innerHTML = '';

    // Skip 3D entirely if model-viewer not present (very old browser fallback)
    if (typeof customElements === 'undefined' || !customElements.get('model-viewer')) {
      // Defer briefly in case model-viewer script is still loading
      setTimeout(() => {
        if (typeof customElements !== 'undefined' && customElements.get('model-viewer')) {
          mount(containerEl, initialState);
        } else {
          container.innerHTML = '<div class="calc-visualiser-fallback">3D preview unavailable in this browser.</div>';
        }
      }, 1000);
      return;
    }

    viewer = document.createElement('model-viewer');
    viewer.style.width = '100%';
    viewer.style.height = '100%';
    viewer.setAttribute('camera-controls', '');
    viewer.setAttribute('disable-pan', '');
    viewer.setAttribute('interaction-prompt', 'none');
    viewer.setAttribute('shadow-intensity', '0.7');
    viewer.setAttribute('shadow-softness', '0.95');
    viewer.setAttribute('exposure', '1.05');
    viewer.setAttribute('environment-image', 'neutral');
    viewer.setAttribute('camera-orbit', '35deg 70deg auto');
    viewer.setAttribute('field-of-view', '30deg');
    viewer.setAttribute('ar', '');
    viewer.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
    viewer.setAttribute('ar-scale', 'fixed');
    viewer.setAttribute('reveal', 'auto');
    container.appendChild(viewer);

    // Overlay for chips and AR button
    overlay = document.createElement('div');
    overlay.className = 'calc-visualiser-overlay';
    container.appendChild(overlay);

    chipOutside = document.createElement('div');
    chipOutside.className = 'calc-visualiser-chip is-warm';
    chipOutside.style.cssText = 'top:12px; right:12px;';
    overlay.appendChild(chipOutside);

    chipInside = document.createElement('div');
    chipInside.className = 'calc-visualiser-chip is-cold';
    chipInside.style.cssText = 'bottom:12px; right:12px;';
    overlay.appendChild(chipInside);

    sunIcon = document.createElement('div');
    sunIcon.className = 'calc-visualiser-chip is-warm';
    sunIcon.style.cssText = 'top:12px; left:12px; width:22px; height:22px; padding:0; display:flex; align-items:center; justify-content:center; border-radius:50%;';
    sunIcon.innerHTML = '☀';
    sunIcon.style.display = 'none';
    overlay.appendChild(sunIcon);

    // AR button
    const arBtn = document.createElement('button');
    arBtn.slot = 'ar-button';
    arBtn.className = 'btn btn-outline btn-sm';
    arBtn.style.cssText = 'position:absolute; bottom:12px; right:12px; pointer-events:auto;';
    arBtn.textContent = 'View in your space →';
    viewer.appendChild(arBtn);

    // Heat-flow animation overlay (Phase 2 v1.5 wow)
    mountHeatflow();

    update(initialState);
  }

  // ----- heat-flow overlay --------------------------------------------
  let heatflowEl = null;
  function mountHeatflow() {
    if (!container) return;
    heatflowEl = document.createElement('div');
    heatflowEl.className = 'calc-heatflow';
    container.appendChild(heatflowEl);

    // Transmission arrows (drift right from outdoor side, hot)
    for (let i = 0; i < 5; i++) {
      const a = document.createElement('div');
      a.className = 'calc-heatflow-arrow';
      a.textContent = '→';
      a.style.top = (15 + i * 14) + '%';
      a.style.left = (8 + (i % 2) * 4) + '%';
      a.style.animationDelay = (i * 0.6) + 's';
      heatflowEl.appendChild(a);
    }
    // Cold-air particles (fall down inside the room area)
    for (let i = 0; i < 6; i++) {
      const a = document.createElement('div');
      a.className = 'calc-heatflow-arrow cold';
      a.textContent = '·';
      a.style.top = (35 + (i % 3) * 8) + '%';
      a.style.left = (40 + i * 5) + '%';
      a.style.animationDelay = (i * 0.4) + 's';
      heatflowEl.appendChild(a);
    }
    // Respiration glow (only visible when produce app)
    const glow = document.createElement('div');
    glow.className = 'calc-heatflow-arrow glow';
    glow.dataset.role = 'respiration';
    glow.textContent = '●';
    glow.style.top = '55%';
    glow.style.left = '55%';
    glow.style.display = 'none';
    heatflowEl.appendChild(glow);

    // Door infiltration burst (every ~5s)
    const burst = document.createElement('div');
    burst.className = 'calc-heatflow-burst';
    burst.dataset.role = 'door-burst';
    burst.style.top = '50%';
    burst.style.right = '15%';
    heatflowEl.appendChild(burst);

    // Defrost flash (only freezer)
    const defrost = document.createElement('div');
    defrost.className = 'calc-heatflow-defrost';
    defrost.dataset.role = 'defrost';
    defrost.style.top = '20%';
    defrost.style.left = '50%';
    defrost.style.display = 'none';
    heatflowEl.appendChild(defrost);
  }

  function setHeatflowMode(mode) {
    if (!heatflowEl) return;
    heatflowEl.classList.remove('is-static', 'is-slow');
    if (mode === 'static') heatflowEl.classList.add('is-static');
    else if (mode === 'slow') heatflowEl.classList.add('is-slow');
  }

  // ----- update --------------------------------------------------------
  function update(state) {
    if (!viewer) return;
    currentState = { ...currentState, ...state };

    const gltf = buildGltf(currentState);
    const blob = new Blob([JSON.stringify(gltf)], { type: 'model/gltf+json' });
    if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = URL.createObjectURL(blob);
    viewer.src = currentBlobUrl;

    // Update chips
    if (chipInside && currentState.interiorC != null) {
      chipInside.textContent = `inside ${formatTemp(currentState.interiorC)}`;
    }
    if (chipOutside && currentState.exteriorC != null) {
      chipOutside.textContent = `ambient ${formatTemp(currentState.exteriorC)}`;
    }

    // Sun icon visibility
    if (sunIcon) {
      sunIcon.style.display = (currentState.location === 'outdoor' || currentState.location === 'sun')
        ? 'flex' : 'none';
    }

    // Heat-flow animation conditional layers
    if (heatflowEl) {
      const respGlow = heatflowEl.querySelector('[data-role="respiration"]');
      if (respGlow) {
        respGlow.style.display = currentState.respiration ? 'block' : 'none';
      }
      const defrost = heatflowEl.querySelector('[data-role="defrost"]');
      if (defrost) {
        defrost.style.display = currentState.isFreezer ? 'block' : 'none';
      }
    }
  }

  function formatTemp(c) {
    if (window.Izhar && window.Izhar.getUnitSystem() === 'IP') {
      return Math.round(c * 9/5 + 32) + ' °F';
    }
    return Math.round(c) + ' °C';
  }

  function destroy() {
    if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
    if (container) container.innerHTML = '';
    viewer = null; container = null; currentState = null;
  }

  return { mount, update, destroy, setHeatflowMode };
})();

window.IzharViz = IzharViz;
