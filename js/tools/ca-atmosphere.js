/* ==========================================================================
   CA ATMOSPHERE DESIGNER — Tool 7
   Controlled Atmosphere recipe + chamber sizing for premium long-storage crops.
   Source: USDA Agriculture Handbook 66; ASHRAE Refrigeration Ch. 25.
   ========================================================================== */

(async function () {
  if (!window.Izhar) await new Promise(r => setTimeout(r, 50));
  const { fmt, getData, readState, writeState, quoteUrl, whatsappUrl, countUp } = Izhar;

  const $ = (id) => document.getElementById(id);
  let lastBig = 0;
  const els = {
    crop: $('crop'),
    tonnage: $('tonnage'),
    months: $('months'),
    tightness: document.getElementsByName('tight'),
    big: $('big'), sub: $('sub'),
    o2: $('o2'), co2: $('co2'), n2: $('n2'),
    temp: $('temp'), tempExplain: $('temp-explain'),
    chamber: $('chamber'), chamberExplain: $('chamber-explain'),
    n2gen: $('n2gen'),
    extension: $('extension'),
    mathBody: $('math-body'),
    ctaQuote: $('cta-quote'), ctaWa: $('cta-wa'),
    visualiser: $('visualiser'),
  };

  const data = await getData('data-ca');

  data.crops.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.name} — ${c.tempC}°C, O₂ ${c.o2}% / CO₂ ${c.co2}%`;
    if (c.id === 'apple') opt.selected = true;
    els.crop.appendChild(opt);
  });

  function getTight() {
    return Array.from(els.tightness).find(r => r.checked)?.value || 'high';
  }

  ['crop','tonnage','months'].forEach(id => $(id).addEventListener('input', compute));
  Array.from(els.tightness).forEach(r => r.addEventListener('change', compute));

  function compute() {
    const crop = data.crops.find(c => c.id === els.crop.value);
    if (!crop) return;
    const T = parseFloat(els.tonnage.value);
    const months = parseFloat(els.months.value);
    const tightId = getTight();
    const tight = data.tightness[tightId];

    if (!T || !months) {
      els.big.textContent = '—'; els.sub.textContent = 'Enter tonnage + storage target.';
      return;
    }

    // Chamber size — apple typical 350 kg/m³ density × 0.55 stacking fraction
    // For CA, use slightly looser stacking (need access for sensor pots, sealed door)
    const cropDensity = {
      apple: 350, pear: 380, kiwi: 300, pomegranate: 480, persimmon: 380,
      mango_ca: 280, banana_ca: 250, onion_ca: 580, potato_ca: 600, garlic_ca: 550, tomato_ca: 550, stonefruit: 350
    }[crop.id] || 350;
    const stackFraction = 0.50;  // CA wants more headroom than standard
    const grossM3 = (T * 1000) / cropDensity / stackFraction;

    // Multi-chamber rec — CA chambers should be ≤ 200 t each for management
    let chambers = 1;
    if (T > 500) chambers = Math.ceil(T / 250);
    else if (T > 250) chambers = Math.ceil(T / 200);
    const perChamberM3 = grossM3 / chambers;

    // N₂ generator sizing (Nm³/h)
    // Initial pull-down: room volume × (78% N₂ - 0%) × 1.5 buffer over 24h
    // Plus continuous leak make-up
    const initialN2_m3 = grossM3 * 0.78 * 1.5;  // need to push 78% above ambient
    const initialN2_per_h = initialN2_m3 / 24;
    const leakageN2_per_h = grossM3 * (tight.leakageMaxPctPerDay / 100) / 24 * 0.78;
    const n2GenRate = (initialN2_per_h + leakageN2_per_h * 4) * tight.n2GenSizingFactor;

    // Render
    countUp(els.big, lastBig, crop.o2, 700, 1);
    lastBig = crop.o2;
    els.big.textContent = `${crop.name}`;
    els.big.style.fontSize = 'clamp(1.4rem, 3vw, 2rem)';
    els.sub.textContent = `${months} months target · ${T} t · ${chambers} chamber${chambers > 1 ? 's' : ''}`;

    els.o2.textContent = `${crop.o2}%`;
    els.co2.textContent = `${crop.co2}%`;
    els.n2.textContent = `${(100 - crop.o2 - crop.co2).toFixed(1)}%`;

    els.temp.textContent = `${crop.tempC}°C`;
    els.tempExplain.textContent = `Range ${crop.tempLow}°C – ${crop.tempHigh}°C · ${crop.rh}% RH`;

    els.chamber.textContent = chambers === 1 ? `${fmt(grossM3, 0)} m³` : `${chambers} × ${fmt(perChamberM3, 0)} m³`;
    els.chamberExplain.textContent = `${tight.description}`;

    els.n2gen.textContent = `${fmt(n2GenRate, 1)} Nm³/h`;

    els.extension.textContent = crop.extension;

    // CTAs
    const summary = `${T} t ${crop.name} CA store, ${chambers} chamber${chambers > 1 ? 's' : ''} × ${fmt(perChamberM3, 0)} m³, ${months} months target`;
    els.ctaQuote.href = quoteUrl('ca-atmosphere', summary);
    els.ctaWa.href = whatsappUrl(`Hello Izhar, I'm planning a CA store: ${summary}. O₂ ${crop.o2}% / CO₂ ${crop.co2}%. Please advise.`);
    const ctaLoad = $('cta-load');
    if (ctaLoad) {
      // Pass approximate dims for a square room of perChamberM3 with 6m ceiling
      const dim = Math.sqrt(perChamberM3 / 6);
      ctaLoad.href = `../tools/load-calculator.html#l=${dim.toFixed(1)};w=${dim.toFixed(1)};h=6;ti=${crop.tempC};app=ca`;
    }

    // Math body
    els.mathBody.textContent = [
      `── CA RECIPE: ${crop.name} ──`,
      ``,
      `Atmosphere targets (USDA Handbook 66, ASHRAE Ch. 25):`,
      `  O₂        = ${crop.o2}% (vs 21% ambient)`,
      `  CO₂       = ${crop.co2}% (vs 0.04% ambient)`,
      `  N₂ (bal.) = ${(100 - crop.o2 - crop.co2).toFixed(1)}%`,
      `  Temp      = ${crop.tempC}°C (range ${crop.tempLow}–${crop.tempHigh}°C)`,
      `  RH        = ${crop.rh}%`,
      ``,
      `── CHAMBER SIZING ──`,
      `Density   = ${cropDensity} kg/m³`,
      `Stacking  = 50% (CA needs sensor / monitoring access)`,
      `Gross V   = (${T} × 1000) / ${cropDensity} / 0.50 = ${fmt(grossM3, 1)} m³`,
      ``,
      chambers > 1
        ? `Recommend ${chambers} chambers × ${fmt(perChamberM3, 0)} m³ each`
        : `Single chamber sufficient.`,
      ``,
      `── SEALING TIER: ${tightId.toUpperCase()} ──`,
      `${tight.description}`,
      `Max leak  = ${tight.leakageMaxPctPerDay}% room volume per day`,
      ``,
      `── N₂ GENERATOR (PSA) SIZING ──`,
      `Initial pull-down (24h):`,
      `  V × 78% × 1.5 buffer / 24h = ${fmt(initialN2_per_h, 1)} Nm³/h`,
      `Leak make-up:`,
      `  V × ${tight.leakageMaxPctPerDay}%/day × 78% / 24h × 4 reserve = ${fmt(leakageN2_per_h * 4, 1)} Nm³/h`,
      `Sizing factor (${tightId}): ×${tight.n2GenSizingFactor}`,
      `── Generator size = ${fmt(n2GenRate, 1)} Nm³/h`,
      ``,
      `── STORAGE LIFE ──`,
      `Cold-only       = ${crop.shelfMonths} months typical`,
      `With CA         = ${crop.extension}`,
      ``,
      `── REFERENCES ──`,
      `USDA Agriculture Handbook 66 — Commercial Storage`,
      `ASHRAE Refrigeration Handbook Ch. 25 — Controlled Atmosphere Storage`,
      `Izhar Foster CA chamber installations (Pakistan apple, kiwi, pomegranate)`
    ].join('\n');

    // Visualiser
    if (window.IzharViz) {
      // Single representative chamber
      const Hc = 6;
      const floorArea = perChamberM3 / Hc;
      const Lc = Math.sqrt(floorArea * 1.5);
      const Wc = floorArea / Lc;
      const state = {
        lengthM: Lc, widthM: Wc, heightM: Hc,
        panelMm: 150, roofMm: 150,  // CA chambers always premium-insulated
        interiorC: crop.tempC,
        exteriorC: 43,
        location: 'indoor',
        respiration: true,
        isFreezer: false
      };
      if (!window._vizMounted) {
        window._vizMounted = true;
        IzharViz.mount(els.visualiser, state);
      } else {
        IzharViz.update(state);
      }
    }

    persistState();
  }

  function persistState() {
    writeState({
      crop: els.crop.value,
      t: els.tonnage.value,
      m: els.months.value,
      tg: getTight()
    });
  }
  function restoreState() {
    const s = readState();
    if (s.crop) els.crop.value = s.crop;
    if (s.t) els.tonnage.value = s.t;
    if (s.m) els.months.value = s.m;
    if (s.tg) {
      Array.from(els.tightness).forEach(r => r.checked = (r.value === s.tg));
    }
  }

  Izhar.wireToolChrome({
    toolId: 'ca-atmosphere',
    toolNumber: 7,
    toolName: 'CA Atmosphere Designer',
    serialize: () => ({ projectName: `${els.tonnage.value}t ${els.crop.value} CA store`, hash: location.hash }),
    deserialize: (data) => { if (data.hash) location.hash = data.hash; restoreState(); compute(); },
    buildPDF: () => ({
      projectName: `${els.tonnage.value} t ${els.crop.value} CA atmosphere recipe`,
      sections: [
        { title: 'Inputs', kv: [
          ['Crop', els.crop.value],
          ['Tonnage', `${els.tonnage.value} t`],
          ['Storage duration', `${els.months.value} months`],
          ['Chamber sealing', getTight()]
        ]},
        { title: 'Atmosphere recipe', kv: [
          ['O₂', $('o2')?.textContent || '—'],
          ['CO₂', $('co2')?.textContent || '—'],
          ['N₂', $('n2')?.textContent || '—'],
          ['Temperature', $('temp')?.textContent || '—']
        ]},
        { title: 'Result', kv: [
          ['Required chamber volume', $('big')?.textContent || '—'],
          ['Recommended N₂ generator', $('n2gen')?.textContent || '—'],
          ['Storage extension vs cold-only', $('extension')?.textContent || '—']
        ]}
      ],
      math: $('math-body')?.textContent || '',
      sources: ['USDA Agriculture Handbook 66 — CA storage recipes', 'ASHRAE Refrigeration Handbook Ch. 25']
    })
  });

  restoreState();
  compute();
})();
