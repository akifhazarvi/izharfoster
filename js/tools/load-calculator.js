/* ==========================================================================
   COLD ROOM HEAT LOAD CALCULATOR
   ASHRAE Handbook—Refrigeration 2022, Chapter 24 — 5-component method.
   Validated against K-RP loadcalc.k-rp.com within ±20% (see VALIDATION.md).
   ========================================================================== */

(async function () {
  // Wait for shared utilities
  if (!window.Izhar) {
    await new Promise(r => setTimeout(r, 50));
  }
  const { conv, fmt, getData, readState, writeState, quoteUrl, whatsappUrl, copyShareLink, countUp } = Izhar;

  // ---------- module-level state ----------
  let lastBigVal = 0;
  let productItems = [];   // [{ productId, massKg, inletC, finalC, pullDownH }]
  let wallOverrides = {};  // { Front: { thickMm, sun, adjT }, ... }
  let products = null;
  let productGroups = null;
  let equipData = null;
  let evaporator = null;
  let condensingUnit = null;

  // ---------- DOM refs ----------
  const $ = (id) => document.getElementById(id);
  const els = {
    appGrid: $('app-grid'),
    length: $('length'), width: $('width'), height: $('height'),
    boxLoc: () => document.querySelector('input[name="loc"]:checked')?.value || 'indoor',
    city: $('city'), ambient: $('ambient'), ambientRh: $('ambient-rh'),
    interior: $('interior'), interiorRh: $('interior-rh'),
    wallT: $('wall-thickness'), roofT: $('roof-thickness'), floorT: $('floor-thickness'),
    lighting: $('lighting'), lightingHrs: $('lighting-hours'),
    people: $('people'), peopleHrs: $('people-hours'),
    motors: $('motors'),
    defrostSeg: $('defrost-seg'),
    safetySeg: $('safety-seg'),
    runHours: $('run-hours'),
    usageSeg: $('usage-seg'),
    bigNum: $('big-num'), subNum: $('sub-num'),
    breakdown: $('breakdown'), bdBar: $('bd-bar'),
    annualCost: $('annual-cost'), tariff: $('tariff'),
    mathBody: $('math-body'),
    ctaQuote: $('cta-quote'), ctaWa: $('cta-wa'), ctaEnergy: $('cta-energy'),
    btnShare: $('btn-share'),
    visualiser: $('visualiser'),
    unitsSi: $('units-si'), unitsIp: $('units-ip'),
    unitsAll: document.querySelectorAll('[data-unit-type]'),
    wallUHint: $('wall-u-hint'),
    productToggle: $('product-toggle'), productBody: $('product-body'),
    productList: $('product-list'), productAdd: $('product-add'),
    wallSectionsToggle: $('wall-sections-toggle'),
    wallSectionsBody: $('wall-sections-body'),
    wallSectionsList: $('wall-sections-list'),
    equipSuggested: $('equip-suggested'),
    equipSuggestedExplain: $('equip-suggested-explain'),
    evapPick: $('evap-pick'),
    cuPick: $('cu-pick'),
  };

  // ---------- Load static data ----------
  const [apps, cities, panels, productsData, equipDataRaw] = await Promise.all([
    getData('data-applications'),
    getData('data-cities'),
    getData('data-pir-panels'),
    getData('products'),
    getData('data-equipment')
  ]);
  products = productsData;
  equipData = equipDataRaw;
  // Build groups → subgroups → products tree for the picker
  productGroups = {};
  products.forEach(p => {
    if (!productGroups[p.group]) productGroups[p.group] = {};
    if (!productGroups[p.group][p.subGroup]) productGroups[p.group][p.subGroup] = [];
    productGroups[p.group][p.subGroup].push(p);
  });

  // ---------- Populate static UI: app tiles, city dropdown, panel dropdowns ----------
  // App tiles
  apps.applications.forEach((a, i) => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'calc-app-tile';
    tile.dataset.appId = a.id;
    tile.setAttribute('role', 'radio');
    tile.setAttribute('aria-checked', 'false');
    const tdF = (a.tdK * 9/5).toFixed(1);
    const boxF = Math.round(a.boxC * 9/5 + 32);
    const isPk = a.pk;
    tile.innerHTML = `
      ${a.image ? `<div class="img"><img src="../images/applications/${a.image}" alt="" loading="lazy"></div>` : `<div class="img" style="background:linear-gradient(135deg, var(--paper-2), var(--paper-3));"></div>`}
      <span class="name">${a.name}</span>
      <span class="preview" data-app-preview>${a.boxC}°C · ${a.rh}% RH · TD ${a.tdK} K</span>
      ${isPk ? '<span class="badge-pk">PK</span>' : ''}
    `;
    els.appGrid.appendChild(tile);
    tile.addEventListener('click', () => selectApp(a.id));
  });

  // City dropdown
  cities.cities.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.name} — ${c.tempC}°C, ${c.rh}% RH`;
    if (c.default) opt.selected = true;
    els.city.appendChild(opt);
  });
  els.city.addEventListener('change', () => {
    const c = cities.cities.find(x => x.id === els.city.value);
    if (c) {
      els.ambient.value = c.tempC;
      els.ambientRh.value = c.rh;
      compute();
    }
  });

  // Panel dropdowns
  panels.panels.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.thicknessMm;
    opt.textContent = `${p.thicknessMm} mm — ${p.tier} (U = ${p.uValueSI.toFixed(2)} W/m²K)`;
    if (p.default) opt.selected = true;
    els.wallT.appendChild(opt);
  });
  panels.panels.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.thicknessMm;
    opt.textContent = `${p.thicknessMm} mm`;
    if (p.default) opt.selected = true;
    els.roofT.appendChild(opt);
  });

  // ---------- Segmented controls (defrost, safety, usage) ----------
  function bindSegmented(el) {
    el.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => {
        el.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', 'false'));
        b.setAttribute('aria-pressed', 'true');
        compute();
      });
    });
  }
  function getSegmented(el) {
    return el.querySelector('button[aria-pressed="true"]')?.dataset.val;
  }
  bindSegmented(els.defrostSeg);
  bindSegmented(els.safetySeg);
  bindSegmented(els.usageSeg);

  // ---------- App selection ----------
  let selectedAppId = 'general_cooler';
  function selectApp(id) {
    selectedAppId = id;
    const a = apps.applications.find(x => x.id === id);
    if (!a) return;
    document.querySelectorAll('.calc-app-tile').forEach(t => {
      t.classList.toggle('is-active', t.dataset.appId === id);
      t.setAttribute('aria-checked', t.dataset.appId === id ? 'true' : 'false');
    });
    // Seed defaults — interior temp + RH only. User keeps geometry & ambient.
    els.interior.value = a.boxC;
    els.interiorRh.value = a.rh;
    // Run-time default by app
    const isFreezer = a.boxC < 0;
    els.runHours.value = isFreezer ? 18 : (a.runHours || 16);
    // Defrost default
    if (isFreezer) {
      setSegValue(els.defrostSeg, 'electric');
    } else {
      setSegValue(els.defrostSeg, 'none');
    }
    // Seed a starter product if the preset suggests one
    if (a.defaultProductId) {
      seedDefaultProduct(a.defaultProductId, a.boxC);
    }
    compute();
  }
  function seedDefaultProduct(productId, targetC) {
    const p = products.find(x => x.id === productId || x.id === String(productId));
    if (!p) return;
    // Replace presets if all current items are app-seeded (or empty);
    // never overwrite user-edited mass/temps unless they untouched defaults.
    const allArePresetSeeded = productItems.every(it => it._appSeeded);
    if (productItems.length === 0 || allArePresetSeeded) {
      productItems = [{
        group: p.group,
        subGroup: p.subGroup,
        productId: p.id,
        massKg: 5000,
        inletC: 30,
        finalC: targetC,
        pullDownH: 24,
        _appSeeded: true
      }];
      // Reveal the section + render
      els.productBody.style.display = 'block';
      els.productToggle.textContent = '— Hide products';
      renderProductList();
    }
  }
  function setSegValue(el, val) {
    el.querySelectorAll('button').forEach(b => {
      b.setAttribute('aria-pressed', b.dataset.val === val ? 'true' : 'false');
    });
  }

  // Default selection
  selectApp(selectedAppId);

  // ---------- Box location radio ----------
  document.querySelectorAll('input[name="loc"]').forEach(r => {
    r.addEventListener('change', compute);
  });

  // ---------- Generic input listeners ----------
  ['length','width','height','ambient','ambient-rh','interior','interior-rh',
   'wall-thickness','roof-thickness','floor-thickness',
   'lighting','lighting-hours','people','people-hours','motors','run-hours','tariff',
   'door-w','door-h','door-n'].forEach(id => {
    const el = $(id);
    if (el) el.addEventListener('input', () => { compute(); });
  });
  document.querySelectorAll('input[name="floor-type"]').forEach(r => r.addEventListener('change', compute));
  const doorCurtainEl = $('door-curtain');
  if (doorCurtainEl) doorCurtainEl.addEventListener('change', compute);

  // ---------- Unit toggle ----------
  function applyUnits() {
    const sys = Izhar.getUnitSystem();
    els.unitsSi.setAttribute('aria-pressed', sys === 'SI' ? 'true' : 'false');
    els.unitsIp.setAttribute('aria-pressed', sys === 'IP' ? 'true' : 'false');
    // We keep state in SI internally, but show units differently in chips.
    // For now, only flip the unit-chip text (input values stay SI; flip optional in v1.5)
    document.querySelectorAll('[data-unit-type="length"]').forEach(s => s.textContent = sys === 'SI' ? 'm' : 'ft');
    document.querySelectorAll('[data-unit-type="temp"]').forEach(s => s.textContent = sys === 'SI' ? '°C' : '°F');
    compute();
  }
  els.unitsSi.addEventListener('click', () => { Izhar.setUnitSystem('SI'); applyUnits(); });
  els.unitsIp.addEventListener('click', () => { Izhar.setUnitSystem('IP'); applyUnits(); });

  // ---------- Share link ----------
  els.btnShare.addEventListener('click', async () => {
    await copyShareLink();
    els.btnShare.textContent = 'Copied ✓';
    setTimeout(() => els.btnShare.textContent = 'Copy share link', 1800);
  });

  // ---------- Engineering math (all SI internally) ----------

  // Magnus enthalpy of moist air (kJ/kg dry air)
  function enthalpyKJperKg(tempC, rhPct) {
    const Psat = 610.78 * Math.exp(17.27 * tempC / (237.3 + tempC));
    const Pw = (rhPct / 100) * Psat;
    const W = 0.622 * Pw / Math.max(101325 - Pw, 1);
    return 1.006 * tempC + W * (2501 + 1.86 * tempC);
  }

  // ACH-24 from ASHRAE Ch. 24 Table 5
  function ach24(volumeM3, isFreezer) {
    const tbl = isFreezer
      ? [[5,29],[10,20],[15,16],[20,14],[30,11.5],[50,8.8],[75,7.1],[100,6.1],[150,5],[200,4.2],[300,3.4],[500,2.6],[1000,1.8],[3000,1.0]]
      : [[5,38],[10,26],[15,21],[20,18],[30,15],[50,11.5],[75,9.3],[100,8.0],[150,6.5],[200,5.5],[300,4.5],[500,3.4],[1000,2.4],[3000,1.4]];
    if (volumeM3 <= tbl[0][0]) return tbl[0][1];
    if (volumeM3 >= tbl.at(-1)[0]) return tbl.at(-1)[1];
    for (let i = 0; i < tbl.length-1; i++) {
      if (volumeM3 >= tbl[i][0] && volumeM3 < tbl[i+1][0]) {
        const t = (volumeM3 - tbl[i][0]) / (tbl[i+1][0] - tbl[i][0]);
        return tbl[i][1] + t * (tbl[i+1][1] - tbl[i][1]);
      }
    }
    return tbl.at(-1)[1];
  }

  // People sensible+latent heat in W (ASHRAE Ch. 24 Table 8)
  function peopleHeatW(tempC) {
    return Math.max(150, 272 - 6 * tempC);
  }

  // Solar uplift K added to outside-wall ΔT (ASHRAE Ch. 24 Table 3)
  // Indoor=0, Outdoor=+5K (light wall avg), Sun=+9K (medium).
  function solarUpliftK(boxLoc) {
    return boxLoc === 'sun' ? 9 : (boxLoc === 'outdoor' ? 5 : 0);
  }

  function uPanel(thicknessMm) {
    if (thicknessMm == 0) {
      // 100 mm dense concrete + 50 mm screed over compacted earth, R ≈ 1.4 m²K/W → U ≈ 0.7
      // Soil thermal mass + ground coupling already captured via 18°C boundary in surfaceQ('Floor').
      return 0.7;
    }
    const p = panels.panels.find(x => x.thicknessMm == thicknessMm);
    return p ? p.uValueSI : 0.21;
  }

  // ---------- Product Load UI ----------
  function renderProductRow(item, idx) {
    const row = document.createElement('div');
    row.className = 'calc-section-body';
    row.style.cssText = 'border:1px solid var(--line); border-radius:4px; padding:14px; margin-bottom:10px;';
    const groupOpts = Object.keys(productGroups).map(g => `<option value="${g}" ${g===item.group?'selected':''}>${g}</option>`).join('');
    const subOpts = item.group ? Object.keys(productGroups[item.group] || {}).map(s => `<option value="${s}" ${s===item.subGroup?'selected':''}>${s}</option>`).join('') : '';
    const prodOpts = (item.group && item.subGroup) ? (productGroups[item.group][item.subGroup] || []).map(p => `<option value="${p.id}" ${p.id===item.productId?'selected':''}>${p.name}</option>`).join('') : '';
    row.innerHTML = `
      <div class="calc-field">
        <label class="calc-field-label">Group</label>
        <select class="calc-select" data-prole="group">${groupOpts}</select>
      </div>
      <div class="calc-field">
        <label class="calc-field-label">Subgroup</label>
        <select class="calc-select" data-prole="subgroup">${subOpts}</select>
      </div>
      <div class="calc-field">
        <label class="calc-field-label">Product</label>
        <select class="calc-select" data-prole="product">${prodOpts}</select>
      </div>
      <div class="calc-field">
        <label class="calc-field-label">Daily mass</label>
        <div class="calc-num-with-unit">
          <input class="calc-num" type="number" data-prole="mass" min="0" max="500000" step="10" value="${item.massKg ?? 1000}">
          <span class="calc-num-unit">kg/day</span>
        </div>
      </div>
      <div class="calc-field">
        <label class="calc-field-label">Inlet temp</label>
        <div class="calc-num-with-unit">
          <input class="calc-num" type="number" data-prole="inlet" min="-40" max="60" step="0.5" value="${item.inletC ?? 30}">
          <span class="calc-num-unit">°C</span>
        </div>
      </div>
      <div class="calc-field">
        <label class="calc-field-label">Final temp</label>
        <div class="calc-num-with-unit">
          <input class="calc-num" type="number" data-prole="final" min="-40" max="25" step="0.5" value="${item.finalC ?? ''}" placeholder="(= room)">
          <span class="calc-num-unit">°C</span>
        </div>
      </div>
      <div class="calc-field">
        <label class="calc-field-label">Pull-down</label>
        <div class="calc-num-with-unit">
          <input class="calc-num" type="number" data-prole="pull" min="1" max="48" step="1" value="${item.pullDownH ?? 24}">
          <span class="calc-num-unit">h</span>
        </div>
      </div>
      <div style="display:flex; justify-content:flex-end; margin-top:8px;">
        <button type="button" data-prole="remove" class="btn-ghost" style="font-family:var(--font-mono);font-size:.78rem;color:var(--t-warm);padding:4px 8px;">✕ Remove</button>
      </div>
    `;
    // Wire events
    const groupSel = row.querySelector('[data-prole="group"]');
    const subSel = row.querySelector('[data-prole="subgroup"]');
    const prodSel = row.querySelector('[data-prole="product"]');
    groupSel.addEventListener('change', () => {
      productItems[idx].group = groupSel.value;
      productItems[idx].subGroup = Object.keys(productGroups[groupSel.value])[0];
      productItems[idx].productId = productGroups[groupSel.value][productItems[idx].subGroup][0]?.id;
      renderProductList();
      compute();
    });
    subSel.addEventListener('change', () => {
      productItems[idx].subGroup = subSel.value;
      productItems[idx].productId = productGroups[productItems[idx].group][subSel.value][0]?.id;
      renderProductList();
      compute();
    });
    prodSel.addEventListener('change', () => {
      productItems[idx].productId = parseInt(prodSel.value);
      compute();
    });
    ['mass','inlet','final','pull'].forEach(role => {
      const inp = row.querySelector(`[data-prole="${role}"]`);
      inp.addEventListener('input', () => {
        const v = inp.value === '' ? null : parseFloat(inp.value);
        if (role === 'mass') productItems[idx].massKg = v;
        else if (role === 'inlet') productItems[idx].inletC = v;
        else if (role === 'final') productItems[idx].finalC = v;
        else if (role === 'pull') productItems[idx].pullDownH = v;
        compute();
      });
    });
    row.querySelector('[data-prole="remove"]').addEventListener('click', () => {
      productItems.splice(idx, 1);
      renderProductList();
      compute();
    });
    return row;
  }
  function renderProductList() {
    els.productList.innerHTML = '';
    productItems.forEach((item, i) => els.productList.appendChild(renderProductRow(item, i)));
  }
  function addProduct() {
    // Default to first group → first subgroup → first product
    const firstGroup = Object.keys(productGroups)[0];
    const firstSub = Object.keys(productGroups[firstGroup])[0];
    const firstProd = productGroups[firstGroup][firstSub][0];
    productItems.push({
      group: firstGroup,
      subGroup: firstSub,
      productId: firstProd.id,
      massKg: 1000,
      inletC: 30,
      finalC: null,
      pullDownH: 24
    });
    renderProductList();
    compute();
  }

  // ---------- Wall Sections UI ----------
  const SURFACES = ['Front', 'Rear', 'Left', 'Right', 'Ceiling', 'Floor'];
  function renderWallSections() {
    els.wallSectionsList.innerHTML = '';
    SURFACES.forEach(name => {
      const ov = wallOverrides[name] || {};
      const row = document.createElement('div');
      row.style.cssText = 'border:1px solid var(--line); border-radius:4px; padding:12px 14px; margin-bottom:8px; display:grid; grid-template-columns:90px 1fr 1fr 1fr; gap:10px; align-items:center; font-family:var(--font-mono); font-size:.82rem;';
      const thickOpts = ['<option value="">— default</option>'].concat(panels.panels.map(p => `<option value="${p.thicknessMm}" ${ov.thickMm==p.thicknessMm?'selected':''}>${p.thicknessMm} mm</option>`)).join('');
      row.innerHTML = `
        <strong style="color:var(--ink);">${name}</strong>
        <select class="calc-select" data-srole="thick" style="padding:6px 10px; min-height:36px;">${thickOpts}</select>
        <select class="calc-select" data-srole="sun" style="padding:6px 10px; min-height:36px;">
          <option value="">—</option>
          <option value="0" ${ov.sun=='0'?'selected':''}>Shaded</option>
          <option value="5" ${ov.sun=='5'?'selected':''}>+5 K (light wall)</option>
          <option value="9" ${ov.sun=='9'?'selected':''}>+9 K (medium)</option>
          <option value="11" ${ov.sun=='11'?'selected':''}>+11 K (dark)</option>
        </select>
        <input class="calc-num" type="number" data-srole="adj" placeholder="adj. T °C" value="${ov.adjT ?? ''}" style="padding:6px 10px; min-height:36px;">
      `;
      ['thick','sun','adj'].forEach(role => {
        const el = row.querySelector(`[data-srole="${role}"]`);
        el.addEventListener('input', () => {
          if (!wallOverrides[name]) wallOverrides[name] = {};
          if (role === 'thick') wallOverrides[name].thickMm = el.value || null;
          else if (role === 'sun') wallOverrides[name].sun = el.value || null;
          else if (role === 'adj') wallOverrides[name].adjT = el.value === '' ? null : parseFloat(el.value);
          // Cleanup empty entries
          const ov = wallOverrides[name];
          if (!ov.thickMm && !ov.sun && (ov.adjT == null || isNaN(ov.adjT))) delete wallOverrides[name];
          compute();
        });
      });
      els.wallSectionsList.appendChild(row);
    });
  }

  // ---------- Equipment suggestion + selector wiring ----------
  function suggestEvaporator(kW, isFreezer) {
    if (!equipData || !kW) return null;
    // Pick Medium Profile by default (most common); Extended Profile for warehouse > 30 kW
    const profileId = kW > 30 ? 'extended_profile' : 'medium_profile';
    const prof = equipData.evaporators.profiles.find(p => p.id === profileId);
    if (!prof) return null;
    const tier = prof.tiers.find(t => kW >= t.capacityKwLow && kW <= t.capacityKwHigh);
    if (!tier) return null;
    return { mode: 'class', profileId: prof.id, profileName: prof.name, tierId: tier.id, tierLabel: tier.label, ...tier };
  }
  function suggestCondensingUnit(kW, isFreezer) {
    if (!equipData || !kW) return null;
    let profileId;
    if (kW > 100) profileId = 'screw_industrial';
    else if (isFreezer) profileId = 'recip_lt';
    else profileId = kW < 12 ? 'scroll_mt' : 'recip_mt';
    const prof = equipData.condensingUnits.profiles.find(p => p.id === profileId);
    if (!prof) return null;
    const tier = prof.tiers.find(t => kW >= t.capacityKwLow && kW <= t.capacityKwHigh);
    if (!tier) return null;
    return { mode: 'class', profileId: prof.id, profileName: prof.name, tierId: tier.id, tierLabel: tier.label, ...tier };
  }

  if (els.evapPick) {
    els.evapPick.addEventListener('click', () => {
      const kW = lastBigVal;
      Izhar.openEquipmentSelector({
        kind: 'evaporators',
        capacityKwHint: kW,
        onPick: (picked) => { evaporator = picked; compute(); }
      });
    });
  }
  if (els.cuPick) {
    els.cuPick.addEventListener('click', () => {
      const kW = lastBigVal;
      Izhar.openEquipmentSelector({
        kind: 'condensingUnits',
        capacityKwHint: kW,
        onPick: (picked) => { condensingUnit = picked; compute(); }
      });
    });
  }

  // Wire toggles + add button
  els.productToggle.addEventListener('click', () => {
    const open = els.productBody.style.display !== 'none';
    els.productBody.style.display = open ? 'none' : 'block';
    els.productToggle.textContent = open ? 'Add products →' : '— Hide products';
    if (!open && productItems.length === 0) addProduct();
  });
  els.productAdd.addEventListener('click', addProduct);
  els.wallSectionsToggle.addEventListener('click', () => {
    const open = els.wallSectionsBody.style.display !== 'none';
    els.wallSectionsBody.style.display = open ? 'none' : 'block';
    els.wallSectionsToggle.textContent = open ? 'Override per surface →' : '— Hide overrides';
    if (!open) renderWallSections();
  });

  function compute() {
    // Read state
    const L = parseFloat(els.length.value) || 0;
    const W = parseFloat(els.width.value) || 0;
    const H = parseFloat(els.height.value) || 0;
    const Tint = parseFloat(els.interior.value);
    const RHint = parseFloat(els.interiorRh.value);
    const Text = parseFloat(els.ambient.value);
    const RHext = parseFloat(els.ambientRh.value);
    const wallMm = parseInt(els.wallT.value);
    const roofMm = parseInt(els.roofT.value);
    const floorMm = parseInt(els.floorT.value);
    const loc = els.boxLoc();
    const dT_basic = Text - Tint;
    const dT_solar = dT_basic + solarUpliftK(loc);

    if (!isFinite(L) || !isFinite(W) || !isFinite(H) || L < 1 || W < 1 || H < 2) {
      showError('Enter valid room dimensions.');
      return;
    }
    if (!isFinite(Tint) || !isFinite(Text) || Text <= Tint) {
      showError('Ambient temperature must be above room temperature.');
      return;
    }

    // Areas
    const A_walls = 2 * (L * H + W * H);
    const A_ceiling = L * W;
    const A_floor = L * W;
    const V = L * W * H;

    // U-values
    const Uw = uPanel(wallMm);
    const Ur = uPanel(roofMm);
    const Uf = floorMm == 0 ? 0.7 : uPanel(floorMm);
    const Tsoil = 18; // damped soil temperature C, Pakistan plain (ASHRAE Ref Ch. 24)
    // Floor boundary temp depends on floor type:
    //   on-grade        → soil sink (18°C)
    //   above-grade     → ambient air on underside (Text), no solar (sheltered)
    //   insulated-slab  → soil sink (18°C) but with the chosen panel thickness as primary R
    const floorTypeRadio = document.querySelector('input[name="floor-type"]:checked')?.value || 'on-grade';
    const Tfloor = floorTypeRadio === 'above-grade' ? Text : Tsoil;
    const floorBoundaryName = floorTypeRadio === 'above-grade' ? 'ambient air' : `soil ${Tsoil}°C`;

    // 1. Transmission (W)
    // Per-surface override support (Phase 3): each wall can have its own
    // panelMm, sun K uplift, adjacent-room temp.
    function surfaceQ(name, area, defaultU, useFloorTemp) {
      const ov = wallOverrides[name] || {};
      const U = ov.thickMm ? uPanel(parseInt(ov.thickMm)) : defaultU;
      const sunK = ov.sun ? parseFloat(ov.sun) : (loc === 'sun' ? 9 : (loc === 'outdoor' ? 5 : 0));
      const tOuter = ov.adjT != null && ov.adjT !== '' ? parseFloat(ov.adjT) :
                     (useFloorTemp ? Tfloor : Text);
      const dt = (tOuter - Tint) + (useFloorTemp ? 0 : sunK);
      return U * area * Math.max(0, dt);
    }
    // Split: Front = L×H, Rear = L×H, Left = W×H, Right = W×H
    const A_front = L * H, A_rear = L * H, A_left = W * H, A_right = W * H;
    const Q_front   = surfaceQ('Front',  A_front,   Uw, false);
    const Q_rear    = surfaceQ('Rear',   A_rear,    Uw, false);
    const Q_left    = surfaceQ('Left',   A_left,    Uw, false);
    const Q_right   = surfaceQ('Right',  A_right,   Uw, false);
    const Q_ceiling = surfaceQ('Ceiling', A_ceiling, Ur, false);
    const Q_floor   = surfaceQ('Floor',  A_floor,   Uf, true);
    const Q_walls = Q_front + Q_rear + Q_left + Q_right;
    const Q_envelope = Q_walls + Q_ceiling + Q_floor;

    // 2. Infiltration (W) — ASHRAE Ch. 24 Table 5 ACH-24 method
    const isFreezer = Tint < 0;
    const ach = ach24(V, isFreezer);
    const usage = parseFloat(getSegmented(els.usageSeg) || '1.0');

    // Buoyancy uplift for the ACH-24 method, calibrated against ASHRAE Ref Ch. 24 Table 5
    // (which lists separate ACH for cooler vs freezer at the same volume — the difference
    // implies ~1.3-1.5× freezer uplift). We linearly interpolate by box-temp:
    //   T_int >= 0°C        → 1.00
    //   T_int = -10°C       → 1.20  (chiller / Halal meat)
    //   T_int = -25°C       → 1.45  (general freezer)
    //   T_int <= -30°C      → 1.55  (deep freezer / ice cream)
    const F_m = Tint >= 0 ? 1.0
              : Tint > -10 ? 1.0 + (0 - Tint) * 0.020
              : Tint > -25 ? 1.20 + (-10 - Tint) * (0.25 / 15)
              : Tint > -30 ? 1.45 + (-25 - Tint) * (0.10 / 5)
              : 1.55;

    const rho = 1.10;
    const dh = enthalpyKJperKg(Text, RHext) - enthalpyKJperKg(Tint, RHint);

    // Door protection (ASHRAE Ref Ch. 24, F_Protection):
    //   strip curtain → F = 0.9 (post-protection multiplier 0.10)
    //   air curtain   → F = 0.5 (post-protection multiplier 0.50)
    //   none          → F = 0   (multiplier 1.00)
    const doorCurtain = $('door-curtain')?.checked || false;
    const E_factor = doorCurtain ? 0.10 : 1.0;

    // Door geometry is captured for the report but does NOT scale ACH-24 (which is already
    // empirical and includes typical door usage). Scaling it again would double-count.
    const doorW = parseFloat($('door-w')?.value) || 1.2;
    const doorH = parseFloat($('door-h')?.value) || 2.1;
    const doorN = parseInt($('door-n')?.value) || 1;
    const doorAreaTotal = doorW * doorH * doorN;

    const Q_infil = (ach * usage * F_m * E_factor * V * rho * dh / 86400) * 1000;

    // Floor type already applied via boundary-temp swap (Tfloor) at the transmission step.
    // No post-hoc multiplier needed.
    const Q_envelopeFinal = Q_walls + Q_ceiling + Q_floor;

    // 3. Product load — sum across configured product items
    // Math per RESEARCH.md §1.2 + ASHRAE Ref Ch. 19 (BTU/lb·°F properties from K-RP database)
    let Q_product = 0;
    productItems.forEach(item => {
      const p = products.find(x => x.id === item.productId);
      if (!p || !item.massKg || !item.pullDownH) return;
      const mLb = item.massKg * 2.20462;
      const tInF = item.inletC * 9/5 + 32;
      const tOutF = (item.finalC ?? Tint) * 9/5 + 32;
      const tFreezeF = p.freeze;
      const pullSec = item.pullDownH * 3600;
      // Sensible above freezing
      const tHi = Math.max(tInF, tFreezeF);
      const tLoSensible = Math.max(tOutF, tFreezeF);
      let Q_BTUperHour = 0;
      if (tHi > tLoSensible) {
        const Q_above_BTU = mLb * p.spHAF * (tHi - tLoSensible);
        Q_BTUperHour += Q_above_BTU / item.pullDownH;
      }
      // Latent through freezing
      if (tInF > tFreezeF && tOutF < tFreezeF) {
        // Latent heat of fusion ≈ moisture% × 144 BTU/lb (water fusion = 144 BTU/lb)
        const Lf_BTU = mLb * (p.moisture / 100) * 144;
        Q_BTUperHour += Lf_BTU / item.pullDownH;
      }
      // Sensible below freezing
      if (tOutF < tFreezeF && tFreezeF > tInF) {
        // already-frozen incoming stock
      } else if (tOutF < tFreezeF) {
        const Q_below_BTU = mLb * p.spHBF * (tFreezeF - tOutF);
        Q_BTUperHour += Q_below_BTU / item.pullDownH;
      }
      // Respiration (24 h average, applied to STORED inventory not just throughput)
      // Approximate: stored mass = throughput × pullDownH/24 × 5 (bulk inventory factor)
      const storedLb = mLb * 5; // ASHRAE convention: stored ≈ 5× daily throughput
      const Q_resp_BTUperHour = storedLb * (p.hor || 0) / 24;
      Q_BTUperHour += Q_resp_BTUperHour;

      Q_product += Q_BTUperHour / 3.41214 * 1000; // BTU/h → kW × 1000 = W
      Q_product += 0; // (already in W)
      // Note: above conversion is W = BTU/h × 0.293
    });
    // Convert all to W (the loop above mixes — fix to W consistently)
    // Recompute clean for clarity:
    Q_product = 0;
    productItems.forEach(item => {
      const p = products.find(x => x.id === item.productId);
      if (!p || !item.massKg || !item.pullDownH) return;
      const mLb = item.massKg * 2.20462;
      const tInF = item.inletC * 9/5 + 32;
      const tOutF = (item.finalC ?? Tint) * 9/5 + 32;
      const tFreezeF = p.freeze;
      let Q_BTUperHour = 0;
      const tHi = Math.max(tInF, tFreezeF);
      const tLoSensible = Math.max(tOutF, tFreezeF);
      if (tHi > tLoSensible) {
        Q_BTUperHour += (mLb * p.spHAF * (tHi - tLoSensible)) / item.pullDownH;
      }
      if (tInF > tFreezeF && tOutF < tFreezeF) {
        Q_BTUperHour += (mLb * (p.moisture / 100) * 144) / item.pullDownH;
      }
      if (tOutF < tFreezeF) {
        Q_BTUperHour += (mLb * p.spHBF * (Math.min(tFreezeF, tInF) - tOutF)) / item.pullDownH;
      }
      // Respiration (always-on)
      const storedLb = mLb * 5;
      Q_BTUperHour += (storedLb * (p.hor || 0)) / 24;
      Q_product += Q_BTUperHour * 0.293; // BTU/h → W
    });

    // 4. Internal (lights + people + motors)
    const lightW = parseFloat(els.lighting.value) || 0;
    const lightHrs = parseFloat(els.lightingHrs.value) || 0;
    const Q_light = lightW * A_floor * (lightHrs / 24);
    const peopleN = parseFloat(els.people.value) || 0;
    const peopleHrs = parseFloat(els.peopleHrs.value) || 0;
    const Q_people = peopleN * peopleHeatW(Tint) * (peopleHrs / 24);
    const motorsKW = parseFloat(els.motors.value) || 0;
    const Q_motors = motorsKW * 1000 * 0.85; // assume 85% duty
    const Q_internal = Q_light + Q_people + Q_motors;

    // 5. Defrost uplift (freezer only)
    const defrost = getSegmented(els.defrostSeg);
    let defrostMul = 0;
    if (defrost === 'electric') defrostMul = 0.08;
    else if (defrost === 'hot-gas') defrostMul = 0.05;
    const baseRunning = Q_envelopeFinal + Q_infil + Q_product + Q_internal;
    const Q_defrost = baseRunning * defrostMul;

    // Sum + safety + run-time
    const Q_total = baseRunning + Q_defrost;
    const SF = parseFloat(getSegmented(els.safetySeg) || '10') / 100;
    const Q_required = Q_total * (1 + SF);
    const runHours = parseFloat(els.runHours.value);
    const Q_capacity = Q_required * 24 / runHours;
    const Q_safetyComponent = Q_total * SF;
    const Q_runUplift = Q_required * (24 / runHours - 1);

    // Display
    renderResult({
      Q_envelope: Q_envelopeFinal, Q_infil, Q_product, Q_internal, Q_defrost,
      Q_safetyComponent, Q_runUplift, Q_total, Q_required, Q_capacity,
      L, W, H, V, A_walls, A_ceiling, A_floor,
      Uw, Ur, Uf, dT_basic, dT_solar, ach, usage, isFreezer,
      Tint, Text, RHint, RHext,
      wallMm, roofMm, floorMm, loc, SF, runHours, defrost,
      doorW, doorH, doorN, doorCurtain, floorTypeRadio,
      F_m, E_factor, Tfloor, floorBoundaryName
    });
    persistState();
    updateVisualiser({ Tint, Text, L, W, H, wallMm, roofMm, loc });
  }

  function showError(msg) {
    els.bigNum.textContent = '—';
    els.subNum.textContent = msg;
    els.subNum.style.color = 'var(--t-warm)';
  }

  // ---------- Result rendering ----------
  function renderResult(r) {
    els.subNum.style.color = '';
    const kW = r.Q_capacity / 1000;
    const TR = kW / 3.51685;
    const BTUH = kW * 3412.14;

    // Animate big number
    countUp(els.bigNum, lastBigVal, kW, 900, 1);
    lastBigVal = kW;
    els.subNum.textContent = `${fmt(TR, 1)} TR · ${fmt(BTUH, 0)} BTU/hr`;

    // Breakdown
    const rows = [
      { k: 'Envelope (transmission)', short: 'Envelope', v: r.Q_envelope, color: 'var(--t-cold)', textColor: '#fff' },
      { k: 'Infiltration', short: 'Infiltration', v: r.Q_infil, color: 'var(--t-mid)', textColor: '#0a1f3d' },
      { k: 'Product (sensible + latent)', short: 'Product', v: r.Q_product, color: '#7BA86E', textColor: '#fff' },
      { k: 'Internal (people + lights + motors)', short: 'Internal', v: r.Q_internal, color: 'var(--paper-3)', textColor: '#0a1f3d' },
      { k: 'Defrost uplift', short: 'Defrost', v: r.Q_defrost, color: 'var(--ink-2)', textColor: '#fff' },
      { k: 'Safety + run-time', short: 'Safety', v: r.Q_safetyComponent + r.Q_runUplift, color: 'var(--t-warm)', textColor: '#fff' },
    ];
    const total = rows.reduce((s, x) => s + Math.max(0, x.v), 0);
    // Largest contributor call-out
    const largest = rows.slice().sort((a, b) => b.v - a.v)[0];
    const largestPct = total > 0 ? (largest.v / total * 100) : 0;
    const largestEl = document.getElementById('bd-largest');
    if (largestEl) {
      largestEl.innerHTML = total > 0
        ? `Largest: <strong style="color:var(--ink);">${largest.short}</strong> (${fmt(largestPct, 0)}%)`
        : '';
    }
    els.bdBar.innerHTML = '';
    rows.forEach(row => {
      const pct = total > 0 ? (row.v / total * 100) : 0;
      const seg = document.createElement('div');
      seg.style.flex = String(Math.max(0.001, row.v / total));
      seg.style.background = row.color;
      seg.style.color = row.textColor;
      // Only show inline label if segment is wide enough (≥6%)
      seg.setAttribute('data-pct', pct >= 6 ? Math.round(pct) : 0);
      seg.setAttribute('data-row', row.short);
      seg.title = `${row.k}: ${fmt(row.v / 1000, 2)} kW (${fmt(pct, 1)}%)`;
      els.bdBar.appendChild(seg);
    });
    els.breakdown.innerHTML = '';
    rows.forEach(row => {
      const pct = total > 0 ? (row.v / total * 100) : 0;
      const div = document.createElement('div');
      div.className = 'calc-breakdown-row';
      div.dataset.row = row.short;
      div.innerHTML = `
        <span class="swatch" style="background:${row.color}"></span>
        <span class="label">${row.k}</span>
        <span class="value">${fmt(row.v / 1000, 2)} kW</span>
        <span class="pct">${fmt(pct, 0)}%</span>
      `;
      els.breakdown.appendChild(div);
    });

    // Annual cost
    const tariff = parseFloat(els.tariff.value) || 35;
    const cop = r.isFreezer ? 1.6 : 2.5;
    const electricKW = kW / cop;
    const annualKWh = electricKW * 24 * 365 * 0.7; // 70% load factor
    const annualPKR = annualKWh * tariff;
    els.annualCost.textContent = 'Rs ' + fmt(annualPKR, 0);

    // Suggested equipment class
    if (els.equipSuggested) {
      const evapSuggest = suggestEvaporator(kW, r.isFreezer);
      const cuSuggest = suggestCondensingUnit(kW, r.isFreezer);
      const lines = [];
      if (evaporator) {
        lines.push(`Evap: ${evaporator.profileName ?? 'Manual'}${evaporator.tierLabel ? ' · ' + evaporator.tierLabel : ''}`);
      } else if (evapSuggest) {
        lines.push(`Evap: ${evapSuggest.profileName} · ${evapSuggest.tierLabel} (auto)`);
      }
      if (condensingUnit) {
        lines.push(`Unit: ${condensingUnit.profileName ?? 'Manual'}${condensingUnit.tierLabel ? ' · ' + condensingUnit.tierLabel : ''}`);
      } else if (cuSuggest) {
        lines.push(`Unit: ${cuSuggest.profileName} · ${cuSuggest.tierLabel} (auto)`);
      }
      els.equipSuggested.innerHTML = lines.length ? lines.join('<br>') : '—';
      els.equipSuggestedExplain.textContent = (evaporator || condensingUnit)
        ? 'Selected. Browse to change. Values are class-typical until verified against actual datasheet.'
        : 'Auto-suggested from your computed load. Browse to refine.';
    }

    // CTAs
    const summary = `${fmt(kW, 1)} kW load · ${r.L}×${r.W}×${r.H} m · ${r.Tint}°C / ${r.Text}°C ambient · ${r.wallMm}mm PIR`;
    els.ctaQuote.href = quoteUrl('load-calculator', summary);
    els.ctaWa.href = whatsappUrl(`Hello Izhar, I sized a cold room on your calculator: ${summary}. Please send a quote.`);
    els.ctaEnergy.href = `../tools/energy-cost.html#load=${(kW).toFixed(2)};isFreezer=${r.isFreezer ? 1 : 0};wall=${r.wallMm}`;
    const ctaCondenser = $('cta-condenser'); if (ctaCondenser) ctaCondenser.href = `../tools/condenser-sizing.html#load=${(kW).toFixed(2)};app=${r.isFreezer ? 'LT' : 'MT'};a=${r.Text}`;
    const ctaCharge = $('cta-charge'); if (ctaCharge) ctaCharge.href = `../tools/refrigerant-charge.html#climate=${r.Text > 47 ? 'coastal' : (r.Text > 42 ? 'plains' : 'highland')}`;
    const ctaA2l = $('cta-a2l'); if (ctaA2l) ctaA2l.href = `../tools/a2l-room-area.html#area=${(r.L * r.W).toFixed(1)};h=${r.H}`;

    // Show the math
    els.mathBody.textContent = formatMath(r);
  }

  function formatMath(r) {
    const Q_floor_only = r.Uf * r.A_floor * Math.max(0, (r.Tfloor ?? 18) - r.Tint);
    const protectionTxt = r.E_factor === 1.0 ? 'no protection (F=0)'
      : r.E_factor === 0.10 ? 'strip curtain (F=0.9, ASHRAE Ref Ch. 24)'
      : `multiplier ${r.E_factor}`;
    return [
      `── ENVELOPE TRANSMISSION ─────────────────────────`,
      `Walls + ceiling (Q = U × A × ΔT):`,
      `  U_wall    = ${r.Uw.toFixed(3)} W/m²·K   (${r.wallMm} mm PIR, λ=0.020)`,
      `  A_walls   = ${r.A_walls.toFixed(1)} m²   A_ceiling = ${r.A_ceiling.toFixed(1)} m²`,
      `  ΔT        = ${r.dT_solar.toFixed(1)} K  (${r.dT_basic.toFixed(1)} K + ${(r.dT_solar - r.dT_basic).toFixed(1)} K solar uplift, location: ${r.loc})`,
      `Floor (Q = U_f × A_f × (T_floor − T_int)):`,
      `  U_floor   = ${r.Uf.toFixed(3)} W/m²·K   (${r.floorMm == 0 ? 'concrete on grade' : r.floorMm + ' mm PIR'})`,
      `  A_floor   = ${r.A_floor.toFixed(1)} m²`,
      `  Boundary  = ${r.floorBoundaryName ?? 'soil 18°C'}  (floor type: ${r.floorTypeRadio ?? 'on-grade'})`,
      `  Q_floor   = ${Q_floor_only.toFixed(0)} W`,
      `  ── Q_envelope = ${(r.Q_envelope/1000).toFixed(2)} kW`,
      ``,
      `── INFILTRATION (Gosney-Olama) ───────────────────`,
      `Q_inf = ACH × usage × F_m × E × V × ρ × Δh / 86400`,
      `  ACH       = ${r.ach.toFixed(1)}/24h  (V = ${r.V.toFixed(0)} m³, ${r.isFreezer ? 'freezer' : 'cooler'} — ASHRAE Ch. 24 Table 5)`,
      `  usage     = ${r.usage} ×  (${r.usage === 1.0 ? 'normal' : (r.usage === 0.6 ? 'light' : 'heavy')})`,
      `  F_m       = ${(r.F_m ?? 1).toFixed(3)}  (buoyancy uplift, by box temp ${r.Tint}°C; ASHRAE Ref Ch. 24)`,
      `  E         = ${r.E_factor ?? 1}  ${protectionTxt}`,
      `  Δh        = ${(enthalpyKJperKg(r.Text, r.RHext) - enthalpyKJperKg(r.Tint, r.RHint)).toFixed(1)} kJ/kg`,
      `  Doors     = ${r.doorN ?? 1} × ${r.doorW ?? 1.2}m × ${r.doorH ?? 2.1}m (geometry tracked, not double-counted)`,
      `  ── Q_infiltration = ${(r.Q_infil/1000).toFixed(2)} kW`,
      ``,
      `── INTERNAL ──────────────────────────────────────`,
      `  ── Q_internal = ${(r.Q_internal/1000).toFixed(2)} kW (lights + people + motors)`,
      ``,
      `── TOTALS ────────────────────────────────────────`,
      `Total hourly      = ${((r.Q_total)/1000).toFixed(2)} kW`,
      `× (1 + SF=${r.SF.toFixed(2)})  → ${(r.Q_required/1000).toFixed(2)} kW`,
      `× 24h / ${r.runHours}h run    → ${(r.Q_capacity/1000).toFixed(2)} kW required capacity`,
      ``,
      `Sources:`,
      `  ASHRAE Handbook—Refrigeration 2022, Chapter 24 §"Refrigeration Load"`,
      `  Buoyancy uplift F_m calibrated by box temp (ASHRAE Ref Ch. 24 Table 5)`,
      `  ASHRAE F_Protection: 0.9 strip curtain · 0.5 air curtain · 0 none`,
      `  PIR λ = 0.020 W/m·K (BS EN 14509 declared, aged 25 years at 23°C)`,
      `  Cross-validated against Heatcraft NROES, Copeland AE-103, Coolselector®2, K-RP`,
    ].join('\n');
  }

  // ---------- Persist URL state ----------
  function persistState() {
    writeState({
      app: selectedAppId,
      l: els.length.value,
      w: els.width.value,
      h: els.height.value,
      ti: els.interior.value,
      te: els.ambient.value,
      cy: els.city.value,
      wt: els.wallT.value
    });
  }
  function restoreState() {
    const s = readState();
    if (s.app) selectApp(s.app);
    if (s.l) els.length.value = s.l;
    if (s.w) els.width.value = s.w;
    if (s.h) els.height.value = s.h;
    if (s.ti) els.interior.value = s.ti;
    if (s.te) els.ambient.value = s.te;
    if (s.cy) els.city.value = s.cy;
    if (s.wt) els.wallT.value = s.wt;
  }

  // ---------- Visualiser binding ----------
  function updateVisualiser({ Tint, Text, L, W, H, wallMm, roofMm, loc }) {
    if (!window.IzharViz) return;
    // Respiration glow only for produce-class apps (live produce shows hor > 0)
    const app = apps.applications.find(a => a.id === selectedAppId);
    const isProduce = app && /produce|mango|citrus|onion|potato|floral/i.test(app.id + ' ' + app.name);
    const isFreezer = Tint < 0;
    const state = {
      lengthM: L, widthM: W, heightM: H,
      panelMm: wallMm, roofMm: roofMm,
      interiorC: Tint, exteriorC: Text,
      location: loc,
      respiration: isProduce,
      isFreezer
    };
    if (!window._vizMounted) {
      window._vizMounted = true;
      IzharViz.mount(els.visualiser, state);
    } else {
      IzharViz.update(state);
    }
  }

  // ---------- Glossary triggers ----------
  document.querySelectorAll('[data-glossary]').forEach(b => {
    b.addEventListener('click', () => Izhar.showGlossary(b.dataset.glossary));
  });

  // ---------- Shared chrome (Open / Save / Print PDF) ----------
  Izhar.wireToolChrome({
    toolId: 'load-calculator',
    toolNumber: 1,
    toolName: 'Cold Room Heat Load',
    serialize: () => {
      const big = $('big-num')?.textContent || '';
      const kwMatch = big.match(/(\d+\.?\d*)/);
      const kw = kwMatch ? parseFloat(kwMatch[1]) : null;
      return {
        projectName: kw
          ? `${kw.toFixed(1)} kW · ${els.length.value}×${els.width.value}×${els.height.value}m`
          : `${els.length.value}×${els.width.value}×${els.height.value}m cold room`,
        hash: location.hash,
        productItems, wallOverrides,
        dims: {
          l: parseFloat(els.length.value),
          w: parseFloat(els.width.value),
          h: parseFloat(els.height.value)
        },
        capacityKw: kw
      };
    },
    deserialize: (data) => {
      if (data.hash) { location.hash = data.hash; }
      if (Array.isArray(data.productItems)) { productItems = data.productItems; }
      if (data.wallOverrides && typeof data.wallOverrides === 'object') { wallOverrides = data.wallOverrides; }
      restoreState();
      compute();
    },
    buildPDF: () => {
      const big = $('big-num')?.textContent || $('big')?.textContent || '—';
      const sub = $('sub-num')?.textContent || $('sub')?.textContent || '—';
      return {
        projectName: `${els.length.value}×${els.width.value}×${els.height.value}m cold room`,
        sections: [
          { title: 'Geometry', kv: [
            ['Dimensions (L×W×H)', `${els.length.value} × ${els.width.value} × ${els.height.value} m`],
            ['Volume', `${(parseFloat(els.length.value) * parseFloat(els.width.value) * parseFloat(els.height.value)).toFixed(0)} m³`],
            ['Box location', els.boxLoc()]
          ]},
          { title: 'Conditions', kv: [
            ['Ambient', `${els.ambient.value} °C / ${els.ambientRh.value}% RH`],
            ['Interior', `${els.interior.value} °C / ${els.interiorRh.value}% RH`]
          ]},
          { title: 'Envelope (Izhar PIR)', kv: [
            ['Walls', `${els.wallT.value} mm`],
            ['Roof', `${els.roofT.value} mm`],
            ['Floor', `${els.floorT.value} mm`]
          ]},
          { title: 'Result', kv: [
            ['Required capacity', big],
            ['Annual operating cost', $('annual-cost')?.textContent || '—'],
            ['Sub', sub]
          ]}
        ],
        math: $('math-body')?.textContent || '',
        sources: [
          'ASHRAE Handbook — Refrigeration 2022, Chapter 24 "Refrigerated Facility Loads"',
          'Izhar PIR panel U-values per RESEARCH.md §2 (λ = 0.020 W/m·K aged)',
          'Cross-validated within ±20% of Heatcraft NROES, Copeland AE-103, Danfoss Coolselector®2'
        ]
      };
    }
  });

  // ---------- Init ----------
  applyUnits();
  restoreState();
  compute();
})();
