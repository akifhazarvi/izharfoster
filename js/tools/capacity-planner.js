/* ==========================================================================
   COLD STORAGE CAPACITY PLANNER — Tool 6
   Convert tonnes → m³ → room dimensions → panel SQM → indicative project value.
   For non-engineer buyers (mango farmer, restaurant chain, dairy operator).
   ========================================================================== */

(async function () {
  if (!window.Izhar) await new Promise(r => setTimeout(r, 50));
  const { fmt, getData, readState, writeState, quoteUrl, whatsappUrl, countUp } = Izhar;

  const $ = (id) => document.getElementById(id);
  let lastBig = 0;
  const els = {
    crop: $('crop'),
    tonnage: $('tonnage'),
    duration: $('duration'),
    stackSeg: $('stack-seg'),
    aisle: $('aisle'),
    heightPref: $('height-pref'),
    big: $('big'), sub: $('sub'),
    dims: $('dims'), dimsExplain: $('dims-explain'),
    panels: $('panels'), panelsExplain: $('panels-explain'),
    project: $('project'),
    conditions: $('conditions'),
    mathBody: $('math-body'),
    ctaQuote: $('cta-quote'), ctaWa: $('cta-wa'), ctaLoad: $('cta-load'),
    visualiser: $('visualiser'),
  };

  const stacking = await getData('data-stacking');

  stacking.crops.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.name} — ${c.boxC}°C, ${c.kgPerM3} kg/m³`;
    if (c.id === 'mango') opt.selected = true;
    els.crop.appendChild(opt);
  });

  function bindSeg(el) {
    el.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => {
        el.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', 'false'));
        b.setAttribute('aria-pressed', 'true');
        compute();
      });
    });
  }
  function getSeg(el) { return el.querySelector('button[aria-pressed="true"]')?.dataset.val; }
  bindSeg(els.stackSeg);

  ['crop','tonnage','duration','aisle','height-pref'].forEach(id => $(id).addEventListener('input', compute));

  function compute() {
    const crop = stacking.crops.find(c => c.id === els.crop.value);
    if (!crop) return;
    const T = parseFloat(els.tonnage.value);
    const dur = parseFloat(els.duration.value);
    const stack = getSeg(els.stackSeg);
    const aisle = parseFloat(els.aisle.value);
    const H = parseFloat(els.heightPref.value);

    if (!T || T <= 0) {
      els.big.textContent = '—'; els.sub.textContent = 'Enter tonnage to plan.';
      return;
    }

    // Net product volume from crop density
    const netVolM3 = (T * 1000) / crop.kgPerM3;

    // Stacking-fraction: how much of the gross room volume is actual product
    // Bulk: 80% of room is product (high density storage)
    // Crate/pallet: 55% (standard rack utilisation)
    // Rack: 40% (high-bay rack with aisles)
    const stackFraction = stack === 'bulk' ? 0.80 : (stack === 'rack' ? 0.40 : 0.55);

    // Aisle factor: more aisle width = lower stack fraction (already partly in above)
    // Use aisle adjustment of 0.95 for 1.2 m, 1.0 for 1.5 m, 1.05 for 1.8 m, 1.10 for 2.4 m
    const aisleAdj = aisle <= 1.2 ? 0.95 : aisle <= 1.5 ? 1.00 : aisle <= 1.8 ? 1.05 : 1.10;

    // Duration buffer: longer storage needs more rotational buffer
    const durBuffer = 1 + 0.10 * dur; // +10% per duration tier

    const grossVolM3 = (netVolM3 / stackFraction) * aisleAdj * durBuffer;

    // Pick a sensible aspect ratio — depth-to-length 0.6, height = user pref
    const floorArea = grossVolM3 / H;
    // L × W with L = sqrt(area / 0.6), W = 0.6 × L  → ratio 1:0.6
    const L = Math.sqrt(floorArea / 0.6);
    const W = floorArea / L;

    // Panel area: 4 walls + ceiling + floor
    const A_walls = 2 * (L * H + W * H);
    const A_ceiling = L * W;
    const A_floor = L * W;
    const totalPanelM2 = A_walls + A_ceiling + A_floor;

    // Door count: 1 per 100 m² floor + 1 base
    const doorCount = Math.max(1, Math.ceil(floorArea / 200));

    // Indicative project value (Rs)
    // Rough rule: panels Rs 5500/m², refrigeration Rs 35,000/kW, civil Rs 25,000/m² floor
    // For a typical mango store at +13°C: load ~ 30 W/m² × volume → very rough
    const load_kW_estimate = grossVolM3 * 0.04; // 40 W/m³ rule for cooler
    const panelCost = totalPanelM2 * 5500;
    const refrigCost = load_kW_estimate * 35000;
    const civilCost = floorArea * 25000;
    const totalLow = (panelCost + refrigCost + civilCost) * 0.85;
    const totalHigh = (panelCost + refrigCost + civilCost) * 1.15;

    countUp(els.big, lastBig, grossVolM3, 800, 0);
    lastBig = grossVolM3;
    els.big.textContent = fmt(grossVolM3, 0) + ' m³';
    els.sub.textContent = `Gross volume — ${fmt(netVolM3, 0)} m³ product + ${fmt(grossVolM3 - netVolM3, 0)} m³ aisles & buffer`;

    els.dims.textContent = `${fmt(L, 1)} × ${fmt(W, 1)} × ${fmt(H, 1)} m`;
    els.dimsExplain.textContent = `Floor area ${fmt(floorArea, 0)} m² · ${doorCount} door${doorCount > 1 ? 's' : ''} recommended`;

    els.panels.textContent = fmt(totalPanelM2, 0) + ' m²';
    els.panelsExplain.textContent = `Walls ${fmt(A_walls, 0)} m² · Ceiling ${fmt(A_ceiling, 0)} m² · Floor ${fmt(A_floor, 0)} m²`;

    els.project.textContent = `Rs ${fmt(totalLow / 1000000, 1)}M – Rs ${fmt(totalHigh / 1000000, 1)}M`;

    els.conditions.innerHTML = `${crop.boxC}°C · ${crop.rh}% RH · ${crop.shelfMonths < 1 ? Math.round(crop.shelfMonths * 30) + ' days' : crop.shelfMonths + ' months'} typical shelf life`;

    // CTAs
    const summary = `${T} tonnes ${crop.name} → ${fmt(grossVolM3, 0)} m³ room (${fmt(L, 1)}×${fmt(W, 1)}×${fmt(H, 1)} m, ${fmt(totalPanelM2, 0)} m² panels)`;
    els.ctaQuote.href = quoteUrl('capacity-planner', summary);
    els.ctaWa.href = whatsappUrl(`Hello Izhar, I'm planning a cold store: ${summary}. Indicative project value Rs ${fmt(totalLow/1e6, 1)}–${fmt(totalHigh/1e6, 1)}M. Please send a quote.`);
    els.ctaLoad.href = `../tools/load-calculator.html#l=${L.toFixed(1)};w=${W.toFixed(1)};h=${H.toFixed(1)};ti=${crop.boxC};app=pk_${crop.id}`;

    // Math
    els.mathBody.textContent = [
      `── COLD STORAGE CAPACITY PLANNING ──`,
      ``,
      `Net product volume:`,
      `  V_net = (${T} t × 1000) / ${crop.kgPerM3} kg/m³ = ${fmt(netVolM3, 1)} m³`,
      ``,
      `Stacking factor:`,
      `  ${stack} → ${(stackFraction * 100).toFixed(0)}% of gross volume is product`,
      ``,
      `Aisle adjustment (${aisle} m wide): ×${aisleAdj}`,
      `Duration buffer (${dur === 0.5 ? '≤1 mo' : dur + ' tier'}): ×${durBuffer.toFixed(2)}`,
      ``,
      `Gross volume = ${fmt(netVolM3, 1)} / ${stackFraction} × ${aisleAdj} × ${durBuffer.toFixed(2)}`,
      `             = ${fmt(grossVolM3, 1)} m³`,
      ``,
      `── DIMENSIONS (1.66 : 1 ratio) ──`,
      `Floor area  = ${fmt(grossVolM3, 0)} / ${H} = ${fmt(floorArea, 0)} m²`,
      `Length × Width = ${fmt(L, 1)} × ${fmt(W, 1)} m`,
      `Height       = ${fmt(H, 1)} m`,
      ``,
      `── PANEL AREA ──`,
      `Walls (4)  = 2 × (L×H + W×H) = ${fmt(A_walls, 0)} m²`,
      `Ceiling    = L × W = ${fmt(A_ceiling, 0)} m²`,
      `Floor      = L × W = ${fmt(A_floor, 0)} m²`,
      `── Total   = ${fmt(totalPanelM2, 0)} m² Izhar PIR sandwich panels`,
      ``,
      `── INDICATIVE PROJECT VALUE (range) ──`,
      `Panels (Rs 5,500/m²)        ≈ Rs ${fmt(panelCost / 1e6, 2)}M`,
      `Refrigeration (Rs 35k/kW)   ≈ Rs ${fmt(refrigCost / 1e6, 2)}M`,
      `Civil + electrical          ≈ Rs ${fmt(civilCost / 1e6, 2)}M`,
      `── Range = Rs ${fmt(totalLow / 1e6, 1)}M – Rs ${fmt(totalHigh / 1e6, 1)}M`,
      ``,
      `Final quote depends on site, panel SKU, refrigerant, and equipment specs.`,
      `Source: USDA Agriculture Handbook 66 + ASHRAE Refrigeration Ch. 21–22; Izhar Pakistan pricing 2026.`
    ].join('\n');

    // Visualiser
    if (window.IzharViz) {
      const state = {
        lengthM: L, widthM: W, heightM: H,
        panelMm: 100, roofMm: 100,
        interiorC: crop.boxC, exteriorC: 43,
        location: 'indoor',
        respiration: ['mango','apple','kinnow','banana','pomegranate','grape','guava','tomato','potato_seed','potato_table','onion','garlic','leafy','dates'].includes(crop.id),
        isFreezer: crop.boxC < 0
      };
      if (!window._vizMounted) {
        window._vizMounted = true;
        IzharViz.mount(els.visualiser, state);
      } else {
        IzharViz.update(state);
      }
    }
    // Stat strip below visualiser
    const setStat = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setStat('viz-stat-crop', crop.name);
    setStat('viz-stat-tonnage', `${fmt(T, 0)} t`);
    setStat('viz-stat-foot', `${L.toFixed(1)} × ${W.toFixed(1)} × ${H.toFixed(1)} m`);
    setStat('viz-stat-temp', `${crop.boxC}°C · ${crop.rh ?? 90}% RH`);

    persistState();
  }

  function persistState() {
    writeState({
      crop: els.crop.value,
      t: els.tonnage.value,
      d: els.duration.value,
      st: getSeg(els.stackSeg),
      a: els.aisle.value, h: els.heightPref.value
    });
  }
  function restoreState() {
    const s = readState();
    if (s.crop) els.crop.value = s.crop;
    if (s.t) els.tonnage.value = s.t;
    if (s.d) els.duration.value = s.d;
    if (s.st) {
      els.stackSeg.querySelectorAll('button').forEach(b =>
        b.setAttribute('aria-pressed', b.dataset.val === s.st ? 'true' : 'false'));
    }
    if (s.a) els.aisle.value = s.a;
    if (s.h) els.heightPref.value = s.h;
  }

  Izhar.wireToolChrome({
    toolId: 'capacity-planner',
    toolNumber: 6,
    toolName: 'Cold Storage Capacity Planner',
    serialize: () => ({ projectName: `${els.tonnage.value} t ${els.crop.value} cold store`, hash: location.hash }),
    deserialize: (data) => { if (data.hash) location.hash = data.hash; restoreState(); compute(); },
    buildPDF: () => ({
      projectName: `${els.tonnage.value} t ${els.crop.value} cold store sizing`,
      sections: [
        { title: 'Inputs', kv: [
          ['Crop', els.crop.value],
          ['Tonnage', `${els.tonnage.value} t`],
          ['Storage duration', `${els.duration.value} days`],
          ['Aisle space', `${els.aisle.value}%`],
          ['Height preference', els.heightPref.value]
        ]},
        { title: 'Result', kv: [
          ['Required volume', $('big')?.textContent || '—'],
          ['Indicative dimensions', $('dims')?.textContent || '—'],
          ['Panel area required', $('panels')?.textContent || '—']
        ]}
      ],
      math: $('math-body')?.textContent || '',
      sources: ['Stacking densities per Pakistan crop research', 'Aisle/access ratios per cold-chain standard']
    })
  });

  restoreState();
  compute();
})();
