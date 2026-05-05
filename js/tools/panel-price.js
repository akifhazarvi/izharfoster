/* ==========================================================================
   PANEL PRICE ESTIMATOR — Tool 9
   Indicative PKR price for FireSafe PIR sandwich panels — Pakistan, Q2 2026.
   Live updates as user changes thickness / facing / length / quantity / city.
   ========================================================================== */

(async function () {
  if (!window.Izhar) await new Promise(r => setTimeout(r, 50));
  const { fmt, getData, readState, writeState, quoteUrl, whatsappUrl } = Izhar;

  const $ = (id) => document.getElementById(id);

  const els = {
    thickness: $('thickness'),
    facing: $('facing'),
    length: $('length'),
    qty: $('qty'),
    qtyUnit: $('qty-unit-seg'),
    city: $('city'),

    bigMin: $('big-min'),
    bigMid: $('big-mid'),
    bigMax: $('big-max'),
    perM2Range: $('per-m2-range'),
    perSqftRange: $('per-sqft-range'),

    barMin: $('bar-min'),
    barMid: $('bar-mid'),
    barMax: $('bar-max'),

    lineSubtotal: $('line-subtotal'),
    lineFreight: $('line-freight'),
    lineDiscount: $('line-discount'),
    lineTotal: $('line-total'),
    lineQty: $('line-qty'),
    lineSpec: $('line-spec'),
    lineU: $('line-u'),

    summaryLine: $('summary-line'),
    confidenceNote: $('confidence-note'),
    publishWarning: $('publish-warning'),

    ctaQuote: $('cta-quote'),
    ctaWa: $('cta-wa'),
    ctaEmail: $('cta-email'),

    mathBody: $('math-body'),
  };

  const data = await getData('data-panel-prices');

  // Populate thickness dropdown — all 6 thicknesses, marked publishable vs project-priced
  data.panels.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.thicknessMm;
    opt.textContent = `${p.thicknessMm} mm — U = ${p.uValueSI.toFixed(2)} W/m²K — ${p.label}`;
    if (p.thicknessMm === 100) opt.selected = true;
    els.thickness.appendChild(opt);
  });

  // Populate facing dropdown
  Object.entries(data.facing_multipliers).forEach(([key, v]) => {
    if (key.startsWith('$')) return;
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = v.label;
    if (key === 'standard') opt.selected = true;
    els.facing.appendChild(opt);
  });

  // Populate length dropdown
  Object.entries(data.length_uplifts).forEach(([key, v]) => {
    if (key.startsWith('$')) return;
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = v.label;
    if (key === 'standard') opt.selected = true;
    els.length.appendChild(opt);
  });

  // Populate city dropdown
  const cities = [
    { value: 'lahore_local', label: 'Lahore (ex-works — no freight)' },
    { value: 'punjab_intercity', label: 'Punjab intercity (Faisalabad, Multan, Sialkot…)' },
    { value: 'karachi_islamabad', label: 'Karachi / Islamabad / Rawalpindi' },
    { value: 'kpk_balochistan', label: 'KPK / Balochistan (Peshawar, Quetta…)' },
  ];
  cities.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.value;
    opt.textContent = c.label;
    els.city.appendChild(opt);
  });

  // Bind segmented control for qty unit toggle (m² vs sqft)
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
  bindSeg(els.qtyUnit);

  // Listeners on every input
  ['thickness', 'facing', 'length', 'qty', 'city'].forEach(id => {
    const el = $(id);
    if (el) el.addEventListener('input', compute);
    if (el) el.addEventListener('change', compute);
  });

  // ---------- math ----------
  function compute() {
    const thicknessMm = parseInt(els.thickness.value);
    const panel = data.panels.find(p => p.thicknessMm === thicknessMm);
    if (!panel) return;

    const facingKey = els.facing.value;
    const facingMult = data.facing_multipliers[facingKey].multiplier;
    const lengthKey = els.length.value;
    const lengthMult = data.length_uplifts[lengthKey].multiplier;

    // qty unit
    const qtyUnit = getSeg(els.qtyUnit) || 'm2';
    let qtyM2 = parseFloat(els.qty.value) || 100;
    if (qtyUnit === 'sqft') qtyM2 = qtyM2 / 10.764;

    // Volume tier
    const tier = data.volume_discounts.tiers.find(t => qtyM2 >= t.minM2 && qtyM2 < t.maxM2);
    const volumeDiscount = tier?.discount || 0;

    // Freight
    const cityKey = els.city.value;
    const freightPerM2 = data.freight_pkr_per_m2[cityKey] || 0;

    // Compute PKR/m² band
    const minBase = panel.priceMin * facingMult * lengthMult * (1 - volumeDiscount);
    const midBase = panel.priceMid * facingMult * lengthMult * (1 - volumeDiscount);
    const maxBase = panel.priceMax * facingMult * lengthMult * (1 - volumeDiscount);

    // Final per-m² band (incl freight)
    const minPerM2 = minBase + freightPerM2;
    const midPerM2 = midBase + freightPerM2;
    const maxPerM2 = maxBase + freightPerM2;

    // Total PKR for the order
    const totalMin = minPerM2 * qtyM2;
    const totalMid = midPerM2 * qtyM2;
    const totalMax = maxPerM2 * qtyM2;

    // Outputs — big numbers (PKR total)
    els.bigMin.textContent = `Rs ${fmt(totalMin)}`;
    els.bigMid.textContent = `Rs ${fmt(totalMid)}`;
    els.bigMax.textContent = `Rs ${fmt(totalMax)}`;

    // Per-unit ranges
    els.perM2Range.textContent = `Rs ${fmt(minPerM2)} – ${fmt(maxPerM2)}`;
    els.perSqftRange.textContent = `Rs ${fmt(minPerM2 / 10.764)} – ${fmt(maxPerM2 / 10.764)}`;

    // Visual bar — relative widths so mid is centered, min/max flank it
    const widthMid = 60;
    const widthMin = (minPerM2 / midPerM2) * widthMid;
    const widthMax = (maxPerM2 / midPerM2) * widthMid;
    els.barMin.style.width = `${widthMin}%`;
    els.barMid.style.width = `${widthMid}%`;
    els.barMax.style.width = `${widthMax}%`;

    // Line items breakdown
    els.lineQty.textContent = qtyUnit === 'sqft'
      ? `${fmt(qtyM2 * 10.764, 0)} sqft (${fmt(qtyM2, 0)} m²)`
      : `${fmt(qtyM2, 0)} m² (${fmt(qtyM2 * 10.764, 0)} sqft)`;
    els.lineSpec.textContent = `${thicknessMm} mm FireSafe PIR · ${data.facing_multipliers[facingKey].label.split(':')[0]} facing · ${data.length_uplifts[lengthKey].label.split(' —')[0]}`;
    els.lineU.textContent = `${panel.uValueSI.toFixed(2)} W/m²K`;

    const subtotalMid = panel.priceMid * facingMult * lengthMult * qtyM2;
    const discountAmt = subtotalMid * volumeDiscount;
    const freightAmt = freightPerM2 * qtyM2;
    const totalNet = subtotalMid - discountAmt + freightAmt;

    els.lineSubtotal.textContent = `Rs ${fmt(subtotalMid)}`;
    els.lineDiscount.textContent = volumeDiscount > 0
      ? `−Rs ${fmt(discountAmt)} (${(volumeDiscount * 100).toFixed(0)}% — ${tier.label})`
      : '—';
    els.lineFreight.textContent = freightPerM2 > 0
      ? `Rs ${fmt(freightAmt)} (Rs ${freightPerM2}/m²)`
      : '—';
    els.lineTotal.textContent = `Rs ${fmt(totalNet)}`;

    // Confidence note
    if (!panel.publishable) {
      els.publishWarning.style.display = 'block';
      els.publishWarning.textContent = `${thicknessMm} mm is marked "Project-priced" — public market data is thin for this thickness. The estimate above uses our internal sales-team band, but the final number is confirmed by quote.`;
    } else {
      els.publishWarning.style.display = 'none';
    }

    els.confidenceNote.textContent = panel.confidence === 'medium'
      ? 'Indicative band ±15%. Anchored to current Pakistan market data and a steel-coil cost build.'
      : 'Indicative band ±20%. Quote-confirmed for this thickness.';

    // Summary line for CTAs
    const summary = `${thicknessMm} mm FireSafe PIR · ${data.facing_multipliers[facingKey].label.split(':')[0]} facing · ${fmt(qtyM2, 0)} m² · ${cities.find(c => c.value === cityKey)?.label || ''} → indicative Rs ${fmt(totalMin)} – ${fmt(totalMax)} (mid Rs ${fmt(totalMid)})`;
    els.summaryLine.textContent = summary;

    // CTA URLs
    if (els.ctaQuote) {
      els.ctaQuote.href = quoteUrl
        ? quoteUrl('panel-price', summary)
        : `../contact?subject=${encodeURIComponent('Sandwich panel quote')}&note=${encodeURIComponent(summary)}`;
    }
    if (els.ctaWa) {
      els.ctaWa.href = whatsappUrl
        ? whatsappUrl(summary)
        : `https://wa.me/923215383544?text=${encodeURIComponent('Sandwich panel quote: ' + summary)}`;
    }
    if (els.ctaEmail) {
      els.ctaEmail.href = `mailto:info@izharfoster.com?subject=${encodeURIComponent('Sandwich panel quote — ' + thicknessMm + ' mm')}&body=${encodeURIComponent(summary)}`;
    }

    // Show-the-math
    if (els.mathBody) {
      els.mathBody.innerHTML = `
        <p><strong>Step 1 — Base PKR/m² for ${thicknessMm} mm FireSafe PIR (Q2 2026 market data):</strong><br>
        Min ${fmt(panel.priceMin)} · Mid ${fmt(panel.priceMid)} · Max ${fmt(panel.priceMax)}</p>

        <p><strong>Step 2 — Facing multiplier (${facingKey}):</strong> × ${facingMult.toFixed(2)}</p>
        <p><strong>Step 3 — Length multiplier (${lengthKey}):</strong> × ${lengthMult.toFixed(2)}</p>

        <p><strong>Step 4 — Volume discount tier:</strong> ${tier?.label || '—'} ${volumeDiscount > 0 ? `(−${(volumeDiscount * 100).toFixed(0)}%)` : ''}</p>

        <p><strong>Step 5 — Freight from Lahore (${cityKey.replace(/_/g, ' ')}):</strong> + Rs ${freightPerM2}/m²</p>

        <p><strong>Step 6 — Per-m² band after all factors:</strong><br>
        Min Rs ${fmt(minPerM2)} · Mid Rs ${fmt(midPerM2)} · Max Rs ${fmt(maxPerM2)}</p>

        <p><strong>Step 7 — Total for ${fmt(qtyM2, 0)} m²:</strong><br>
        Rs ${fmt(totalMin)} – Rs ${fmt(totalMax)}</p>

        <p style="font-size:.75em;color:var(--ink-2);margin-top:1em;border-top:1px solid var(--paper-3);padding-top:.75em;">
        Methodology: bands derived from current Pakistan market data plus a steel-coil cost build (PPGI ~PKR 197,000/ton + PIR foam + 35% manufacturing/margin). Izhar premium positioning over PU public median justified by FireSafe PIR specification (B1 fire class, λ 0.022 W/m·K aged BS EN 14509, eco-pentane blowing agent). Indicative — final quote on application.
        </p>
      `;
    }

    // URL state
    writeState({
      t: thicknessMm,
      f: facingKey,
      l: lengthKey,
      q: parseFloat(els.qty.value),
      u: qtyUnit,
      c: cityKey,
    });
  }

  // Restore from URL
  const state = readState();
  if (state.t) els.thickness.value = state.t;
  if (state.f) els.facing.value = state.f;
  if (state.l) els.length.value = state.l;
  if (state.q) els.qty.value = state.q;
  if (state.u) {
    const btn = els.qtyUnit.querySelector(`button[data-val="${state.u}"]`);
    if (btn) {
      els.qtyUnit.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
    }
  }
  if (state.c) els.city.value = state.c;

  // Initial compute
  compute();

  // Wire shared chrome (Save/Open/Print + methodology)
  if (Izhar.wireToolChrome) {
    Izhar.wireToolChrome({
      toolId: 'panel-price',
      toolName: 'Sandwich Panel Price Estimator',
      getState: () => ({
        thickness: parseInt(els.thickness.value),
        facing: els.facing.value,
        length: els.length.value,
        qty: parseFloat(els.qty.value),
        qtyUnit: getSeg(els.qtyUnit),
        city: els.city.value,
      }),
      setState: (s) => {
        if (s.thickness) els.thickness.value = s.thickness;
        if (s.facing) els.facing.value = s.facing;
        if (s.length) els.length.value = s.length;
        if (s.qty) els.qty.value = s.qty;
        if (s.city) els.city.value = s.city;
        if (s.qtyUnit) {
          const btn = els.qtyUnit.querySelector(`button[data-val="${s.qtyUnit}"]`);
          if (btn) {
            els.qtyUnit.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', 'false'));
            btn.setAttribute('aria-pressed', 'true');
          }
        }
        compute();
      },
    });
  }
})();
