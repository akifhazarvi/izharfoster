/* ==========================================================================
   ENERGY COST & PAYBACK CALCULATOR — Tool 2
   Compares two panel-thickness scenarios. Annual PKR cost, savings, payback,
   10-year NPV. Pakistan-specific.
   ========================================================================== */

(async function () {
  if (!window.Izhar) await new Promise(r => setTimeout(r, 50));
  const { fmt, getData, readState, writeState, quoteUrl, whatsappUrl, countUp } = Izhar;

  const $ = (id) => document.getElementById(id);
  let lastSavings = 0;
  const els = {
    loadKw: $('load-kw'),
    sysSeg: $('systype-seg'),
    opHours: $('op-hours'), opDays: $('op-days'), loadFactor: $('load-factor'),
    copA: $('cop-a'), copB: $('cop-b'),
    thickA: $('thick-a'), thickB: $('thick-b'),
    labelA: $('label-a'), labelB: $('label-b'),
    costDelta: $('cost-delta'),
    tariff: $('tariff-e'),
    inflation: $('inflation'), discount: $('discount'),
    bigSavings: $('big-savings'), subSavings: $('sub-savings'),
    lblA: $('lbl-a'), lblB: $('lbl-b'),
    costA: $('cost-a'), costB: $('cost-b'),
    kwhA: $('kwh-a'), kwhB: $('kwh-b'),
    payback: $('payback'), npv: $('npv'),
    mathBody: $('math-body'),
    ctaQuote: $('cta-quote'), ctaWa: $('cta-wa'),
  };

  const panels = await getData('data-pir-panels');
  panels.panels.forEach(p => {
    const optA = document.createElement('option');
    optA.value = p.thicknessMm;
    optA.textContent = `${p.thicknessMm} mm — U = ${p.uValueSI.toFixed(2)} W/m²K`;
    if (p.thicknessMm === 75) optA.selected = true;
    els.thickA.appendChild(optA);

    const optB = document.createElement('option');
    optB.value = p.thicknessMm;
    optB.textContent = `${p.thicknessMm} mm — U = ${p.uValueSI.toFixed(2)} W/m²K`;
    if (p.thicknessMm === 150) optB.selected = true;
    els.thickB.appendChild(optB);
  });

  function bindSeg(el) {
    el.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => {
        el.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', 'false'));
        b.setAttribute('aria-pressed', 'true');
        // Update default COP based on system type
        if (el === els.sysSeg) {
          if (b.dataset.val === 'freezer') {
            els.copA.value = 1.5;
            els.copB.value = 1.6;
          } else {
            els.copA.value = 2.5;
            els.copB.value = 2.6;
          }
        }
        compute();
      });
    });
  }
  function getSeg(el) { return el.querySelector('button[aria-pressed="true"]')?.dataset.val; }
  bindSeg(els.sysSeg);
  // Period toggle for the A-vs-B chart
  const compareToggle = document.getElementById('compare-toggle');
  if (compareToggle) bindSeg(compareToggle);

  // Listeners
  ['load-kw','op-hours','op-days','load-factor','cop-a','cop-b','thick-a','thick-b',
   'label-a','label-b','cost-delta','tariff-e','inflation','discount'].forEach(id => {
    const el = $(id);
    if (el) el.addEventListener('input', compute);
  });

  // ---------- math ----------
  function compute() {
    const Q_kw = parseFloat(els.loadKw.value);
    const opH = parseFloat(els.opHours.value);
    const opD = parseFloat(els.opDays.value);
    const LF = parseFloat(els.loadFactor.value) / 100;
    const copA = parseFloat(els.copA.value);
    const copB = parseFloat(els.copB.value);
    const thickA = parseInt(els.thickA.value);
    const thickB = parseInt(els.thickB.value);
    const tariff = parseFloat(els.tariff.value);
    const inflation = parseFloat(els.inflation.value) / 100;
    const discount = parseFloat(els.discount.value) / 100;
    const costDelta = parseFloat(els.costDelta.value) || 0;

    if (![Q_kw, opH, opD, LF, copA, copB, tariff].every(x => x > 0 && isFinite(x))) {
      els.bigSavings.textContent = '—';
      els.subSavings.textContent = 'Enter all required values.';
      return;
    }

    // Wall-thickness affects ENVELOPE load only — not full Q. Approximate impact:
    // U(thinner) - U(thicker) over the same surface; for a typical 100 m² envelope
    // and 30 K dT this swings ~10–25% of the envelope component. We model the
    // net Q as: Q' = Q × (Uthick / UbaseRef), where UbaseRef = U at thickA.
    const pA = panels.panels.find(p => p.thicknessMm == thickA);
    const pB = panels.panels.find(p => p.thicknessMm == thickB);
    const ratio = pB && pA ? pB.uValueSI / pA.uValueSI : 1;
    // Envelope is ~30% of total typical load; the ratio multiplies just that fraction.
    const envFraction = 0.35;
    const Q_kw_B = Q_kw * (1 - envFraction + envFraction * ratio);

    // Annual electric kWh
    const kWh_A = (Q_kw / copA) * LF * opH * opD;
    const kWh_B = (Q_kw_B / copB) * LF * opH * opD;

    const cost_A = kWh_A * tariff;
    const cost_B = kWh_B * tariff;
    const savings = cost_A - cost_B;

    // Payback
    const payback = savings > 0 ? costDelta / savings : Infinity;

    // 10-year NPV
    let npv = -costDelta;
    for (let n = 1; n <= 10; n++) {
      const yearSavings = savings * Math.pow(1 + inflation, n - 1);
      npv += yearSavings / Math.pow(1 + discount, n);
    }

    // Render
    countUp(els.bigSavings, lastSavings, savings, 900, 0);
    lastSavings = savings;
    els.bigSavings.textContent = 'Rs ' + fmt(savings, 0);
    els.subSavings.textContent = `${fmt(kWh_A - kWh_B, 0)} kWh saved per year`;

    els.lblA.textContent = els.labelA.value || 'Scenario A';
    els.lblB.textContent = els.labelB.value || 'Scenario B (Izhar)';
    els.kwhA.textContent = fmt(kWh_A, 0) + ' kWh/yr';
    els.kwhB.textContent = fmt(kWh_B, 0) + ' kWh/yr';

    // 25-year cumulative cost for the period toggle (uses inflation-grown costs)
    let cum_A = 0, cum_B = 0;
    for (let n = 1; n <= 25; n++) {
      const inflMul = Math.pow(1 + inflation, n - 1);
      cum_A += cost_A * inflMul;
      cum_B += cost_B * inflMul;
    }
    // Drive the bars based on the active period
    const periodBtn = document.querySelector('#compare-toggle button[aria-pressed="true"]');
    const period = periodBtn?.dataset.period || 'year1';
    const a = period === 'year25' ? cum_A : cost_A;
    const b = period === 'year25' ? cum_B : cost_B;
    const max = Math.max(a, b, 1);
    document.getElementById('bar-a').style.width = `${(a / max) * 100}%`;
    document.getElementById('bar-b').style.width = `${(b / max) * 100}%`;
    els.costA.textContent = 'Rs ' + fmt(a, 0);
    els.costB.textContent = 'Rs ' + fmt(b, 0);
    const sav = a - b;
    const savEl = document.getElementById('bar-savings-amt');
    if (savEl) {
      const savPct = a > 0 ? (sav / a) * 100 : 0;
      savEl.innerHTML = `Rs ${fmt(sav, 0)} <span style="color:var(--muted); font-weight:400;">(${fmt(savPct, 0)}% lower)</span>`;
    }

    els.payback.textContent = isFinite(payback) ? fmt(payback, 1) + ' years' : '—';
    els.npv.textContent = 'Rs ' + fmt(npv, 0);

    // CTAs
    const summary = `${thickA} → ${thickB} mm upgrade · saves Rs ${fmt(savings, 0)}/year · payback ${fmt(payback, 1)} years`;
    els.ctaQuote.href = quoteUrl('energy-cost', summary);
    els.ctaWa.href = whatsappUrl(`Hello Izhar, I ran the Energy Cost calculator: ${summary}. Please send a quote on the panel upgrade.`);

    // Math body
    els.mathBody.textContent = [
      `── ANNUAL ENERGY ─────────────────────────`,
      `kWh = (Q_load / COP) × LoadFactor × hours × days`,
      ``,
      `Scenario A (${thickA} mm, U=${pA?.uValueSI.toFixed(2)} W/m²K):`,
      `  Q_load    = ${Q_kw} kW`,
      `  COP       = ${copA}`,
      `  kWh       = (${Q_kw}/${copA}) × ${LF} × ${opH} × ${opD} = ${fmt(kWh_A, 0)} kWh/year`,
      `  Cost      = ${fmt(kWh_A, 0)} × Rs ${tariff} = Rs ${fmt(cost_A, 0)} /year`,
      ``,
      `Scenario B (${thickB} mm, U=${pB?.uValueSI.toFixed(2)} W/m²K):`,
      `  Q_load_B  = ${Q_kw} × (1 − ${envFraction} + ${envFraction} × ${ratio.toFixed(3)}) = ${fmt(Q_kw_B, 2)} kW`,
      `  COP       = ${copB}`,
      `  kWh       = ${fmt(kWh_B, 0)} kWh/year`,
      `  Cost      = Rs ${fmt(cost_B, 0)} /year`,
      ``,
      `── SAVINGS & PAYBACK ────────────────────`,
      `Savings     = Rs ${fmt(cost_A, 0)} − Rs ${fmt(cost_B, 0)} = Rs ${fmt(savings, 0)} /year`,
      `Payback     = Rs ${fmt(costDelta, 0)} / Rs ${fmt(savings, 0)} = ${fmt(payback, 1)} years`,
      `10-yr NPV   = Σ savings(year n) / (1+${discount})^n − cost = Rs ${fmt(npv, 0)}`,
      ``,
      `Source: ASHRAE Handbook—Refrigeration Ch. 24; standard NPV math; Izhar PIR U-values per BS EN 14509.`
    ].join('\n');
    persist();
  }

  // ---------- URL state ----------
  function persist() {
    writeState({
      load: els.loadKw.value,
      sys: getSeg(els.sysSeg),
      ta: els.thickA.value,
      tb: els.thickB.value,
      tariff: els.tariff.value
    });
  }
  function restore() {
    const s = readState();
    if (s.load) els.loadKw.value = s.load;
    if (s.sys) {
      els.sysSeg.querySelectorAll('button').forEach(b =>
        b.setAttribute('aria-pressed', b.dataset.val === s.sys ? 'true' : 'false'));
      if (s.sys === 'freezer') { els.copA.value = 1.5; els.copB.value = 1.6; }
    }
    if (s.ta) els.thickA.value = s.ta;
    if (s.tb) els.thickB.value = s.tb;
    if (s.tariff) els.tariff.value = s.tariff;
    // Tool 1 deep-link convention: load=, isFreezer=, wall=
    if (s.isFreezer === '1') {
      els.sysSeg.querySelectorAll('button').forEach(b =>
        b.setAttribute('aria-pressed', b.dataset.val === 'freezer' ? 'true' : 'false'));
      els.copA.value = 1.5; els.copB.value = 1.6;
    }
    if (s.wall) {
      els.thickA.value = s.wall;
      // Suggest the next-thicker step for B
      const next = panels.panels.find(p => p.thicknessMm > parseInt(s.wall));
      if (next) els.thickB.value = next.thicknessMm;
    }
  }

  Izhar.wireToolChrome({
    toolId: 'energy-cost',
    toolNumber: 2,
    toolName: 'Energy Cost & Payback',
    serialize: () => ({ projectName: `${els.thickA.value}mm vs ${els.thickB.value}mm panel comparison`, hash: location.hash }),
    deserialize: (data) => { if (data.hash) { location.hash = data.hash; restore(); compute(); } },
    buildPDF: () => ({
      projectName: `${els.thickA.value}mm vs ${els.thickB.value}mm panel comparison`,
      sections: [
        { title: 'Inputs', kv: [
          ['Cold-room load', `${els.loadKw.value} kW`],
          ['Operating profile', `${els.opHours.value} hr/day × ${els.opDays.value} days/yr × ${els.loadFactor.value}% LF`],
          ['Scenario A', `${els.thickA.value}mm panel · COP ${els.copA.value} · ${els.labelA.value}`],
          ['Scenario B', `${els.thickB.value}mm panel · COP ${els.copB.value} · ${els.labelB.value}`],
          ['Tariff', `${els.tariff.value} PKR/kWh`],
          ['Inflation', `${els.inflation.value}%/yr`],
          ['Discount rate', `${els.discount.value}%/yr`]
        ]},
        { title: 'Result', kv: [
          ['Annual savings', $('big-savings')?.textContent || '—'],
          ['Payback', $('payback')?.textContent || '—'],
          ['25-yr NPV', $('npv')?.textContent || '—']
        ]}
      ],
      math: $('math-body')?.textContent || '',
      sources: ['Izhar PIR panel U-values', 'NPV/IRR per standard DCF', 'Pakistan kWh tariff inputs as of 2026']
    })
  });

  restore();
  compute();
})();
