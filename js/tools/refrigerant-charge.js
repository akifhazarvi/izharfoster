/* ==========================================================================
   REFRIGERANT CHARGE ESTIMATOR — Tool 4
   Sums liquid-line + suction-line + condensing unit factory charge + receiver
   fill + (evaporator pumpdown × qty). Uses NIST REFPROP saturated-liquid
   densities at the SCT condensing temp.
   Source: RESEARCH.md §3 + ASHRAE Refrigeration Ch. 26
   ========================================================================== */

(async function () {
  if (!window.Izhar) await new Promise(r => setTimeout(r, 50));
  const { fmt, getData, readState, writeState, quoteUrl, whatsappUrl, countUp, openEquipmentSelector } = Izhar;

  const $ = (id) => document.getElementById(id);
  let lastTotal = 0;
  let condensingUnit = null;
  let evaporator = null;
  const els = {
    ref: $('ref'), refHint: $('ref-hint'),
    climateSeg: $('climate-seg'),
    liqOd: $('liq-od'), liqLen: $('liq-len'),
    sucOd: $('suc-od'), sucLen: $('suc-len'),
    cuPick: $('cu-pick'), cuSummary: $('cu-summary'),
    evapPick: $('evap-pick'), evapSummary: $('evap-summary'),
    evapQty: $('evap-qty'),
    big: $('big'), sub: $('sub'),
    bdBar: $('bd-bar'), breakdown: $('breakdown'),
    mathBody: $('math-body'),
    ctaQuote: $('cta-quote'), ctaWa: $('cta-wa'),
  };

  const [data, equipData] = await Promise.all([
    getData('data-refrigerants-rich'),
    getData('data-equipment')
  ]);

  // Refrigerant dropdown
  data.refrigerants.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.id;
    const tag = r.izharStocked ? ' · Izhar stocked' : '';
    opt.textContent = `${r.name} — ${r.class}${tag}`;
    if (r.id === 'R449A') opt.selected = true;
    els.ref.appendChild(opt);
  });

  function fillLineDropdown(sel, defaultOd) {
    data.lineSizes.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.odIn;
      opt.textContent = `${s.label}  (ID ${s.idMm.toFixed(1)} mm · ${s.volLperM.toFixed(3)} L/m)`;
      if (s.odIn === defaultOd) opt.selected = true;
      sel.appendChild(opt);
    });
  }
  fillLineDropdown(els.liqOd, 0.625);
  fillLineDropdown(els.sucOd, 0.875);

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
  bindSeg(els.climateSeg);

  // Equipment selectors
  els.cuPick.addEventListener('click', () => {
    openEquipmentSelector({
      kind: 'condensingUnits',
      refrigerantId: els.ref.value,
      onPick: (picked) => { condensingUnit = picked; renderCuSummary(); compute(); }
    });
  });
  els.evapPick.addEventListener('click', () => {
    openEquipmentSelector({
      kind: 'evaporators',
      refrigerantId: els.ref.value,
      onPick: (picked) => { evaporator = picked; renderEvapSummary(); compute(); }
    });
  });

  function renderCuSummary() {
    if (!condensingUnit) {
      els.cuPick.textContent = 'Select model →';
      els.cuSummary.textContent = 'Class-typical or manual datasheet entry. Adds factory pre-charge + receiver fill.';
      return;
    }
    if (condensingUnit.mode === 'class') {
      els.cuPick.innerHTML = `${condensingUnit.profileName} · ${condensingUnit.tierLabel} (${condensingUnit.factoryChargeKg} kg + ${condensingUnit.receiverL} L receiver) <span style="margin-left:auto; color:var(--t-warm);">change →</span>`;
      els.cuSummary.innerHTML = `Class-typical: <strong>${condensingUnit.factoryChargeKg} kg</strong> factory pre-charge + <strong>${condensingUnit.receiverL} L</strong> receiver. Capacity ${condensingUnit.capacityKwLow}–${condensingUnit.capacityKwHigh} kW.`;
    } else {
      els.cuPick.innerHTML = `Manual: ${condensingUnit.factoryChargeKg ?? '?'} kg + ${condensingUnit.receiverL ?? 0} L <span style="margin-left:auto; color:var(--t-warm);">change →</span>`;
      els.cuSummary.innerHTML = `From datasheet${condensingUnit.notes ? ' (' + condensingUnit.notes + ')' : ''}.`;
    }
  }
  function renderEvapSummary() {
    if (!evaporator) {
      els.evapPick.textContent = 'Select model →';
      els.evapSummary.textContent = 'Adds the evaporator pumpdown charge. Optional for liquid-line-only checks.';
      return;
    }
    if (evaporator.mode === 'class') {
      els.evapPick.innerHTML = `${evaporator.profileName} · ${evaporator.tierLabel} (${evaporator.pumpdownKg} kg) <span style="margin-left:auto; color:var(--t-warm);">change →</span>`;
      els.evapSummary.innerHTML = `Class-typical: <strong>${evaporator.pumpdownKg} kg</strong> pumpdown · ${evaporator.capacityKwLow}–${evaporator.capacityKwHigh} kW.`;
    } else {
      els.evapPick.innerHTML = `Manual: ${evaporator.pumpdownKg ?? '?'} kg <span style="margin-left:auto; color:var(--t-warm);">change →</span>`;
      els.evapSummary.innerHTML = `From datasheet${evaporator.notes ? ' (' + evaporator.notes + ')' : ''}.`;
    }
  }

  ['ref','liq-od','liq-len','suc-od','suc-len','evap-qty'].forEach(id =>
    $(id).addEventListener('input', compute));

  function compute() {
    const ref = data.refrigerants.find(r => r.id === els.ref.value);
    if (!ref) return;
    const sct = getSeg(els.climateSeg) || '45';
    const rhoL = ref.rhoLiquid[sct];
    const liqOd = parseFloat(els.liqOd.value);
    const liqSize = data.lineSizes.find(s => s.odIn === liqOd);
    const liqLen = parseFloat(els.liqLen.value) || 0;
    const sucOd = parseFloat(els.sucOd.value);
    const sucSize = data.lineSizes.find(s => s.odIn === sucOd);
    const sucLen = parseFloat(els.sucLen.value) || 0;

    if (!rhoL || !liqSize || !sucSize) {
      els.big.textContent = '—';
      els.sub.textContent = 'Density data not available for this refrigerant + climate combination.';
      return;
    }

    const liqVolL = liqLen * liqSize.volLperM;
    const liqMass = liqVolL * rhoL / 1000;
    const sucGasRho = ref.id === 'R290' ? 25 : ref.id === 'R717' ? 8 : 50;
    const sucVolL = sucLen * sucSize.volLperM;
    const sucMass = sucVolL * sucGasRho / 1000;

    // Condensing unit: factory charge (built-in pre-charge) + receiver fill (30%)
    let cuMass = 0, recvMass = 0;
    if (condensingUnit) {
      cuMass = condensingUnit.factoryChargeKg ?? 0;
      const recvL = condensingUnit.receiverL ?? 0;
      recvMass = (recvL / 1000) * 0.30 * rhoL;
    }

    // Evaporator: pumpdown × qty
    const evapQty = parseFloat(els.evapQty.value) || 1;
    const evapMass = (evaporator?.pumpdownKg ?? 0) * evapQty;

    const total = liqMass + sucMass + cuMass + recvMass + evapMass;

    countUp(els.big, lastTotal, total, 800, 2);
    lastTotal = total;
    els.big.textContent = fmt(total, 2) + ' kg';
    els.sub.textContent = `${fmt(total * 2.20462, 2)} lb · ${ref.name} at ${sct}°C SCT`;

    const rows = [
      { k: `Liquid line (${liqSize.label} × ${fmt(liqLen, 1)} m)`, v: liqMass, color: 'var(--t-cold)' },
      { k: `Suction line (${sucSize.label} × ${fmt(sucLen, 1)} m)`, v: sucMass, color: 'var(--t-mid)' },
      { k: `Condensing unit factory charge`, v: cuMass, color: 'var(--paper-3)' },
      { k: `Receiver fill (30% of ${condensingUnit?.receiverL ?? 0} L)`, v: recvMass, color: 'var(--ink-2)' },
      { k: `Evaporator${evapQty > 1 ? ' × ' + evapQty : ''}`, v: evapMass, color: 'var(--t-warm)' },
    ].filter(r => r.v > 0);

    const sum = rows.reduce((s, r) => s + r.v, 0) || 1;
    els.bdBar.innerHTML = '';
    rows.forEach(row => {
      const seg = document.createElement('div');
      seg.style.flex = String(row.v / sum);
      seg.style.background = row.color;
      els.bdBar.appendChild(seg);
    });
    els.breakdown.innerHTML = '';
    rows.forEach(row => {
      const div = document.createElement('div');
      div.className = 'calc-breakdown-row';
      div.innerHTML = `
        <span class="swatch" style="background:${row.color}"></span>
        <span class="label">${row.k}</span>
        <span class="value">${fmt(row.v, 2)} kg</span>
        <span class="pct">${fmt(row.v / total * 100, 0)}%</span>
      `;
      els.breakdown.appendChild(div);
    });

    const summary = `${fmt(total, 2)} kg ${ref.name} (${liqLen}m liquid + ${sucLen}m suction${condensingUnit ? ' + ' + condensingUnit.profileName : ''})`;
    els.ctaQuote.href = quoteUrl('refrigerant-charge', summary);
    els.ctaWa.href = whatsappUrl(`Hello Izhar, charge estimate: ${summary}.`);

    els.mathBody.textContent = [
      `── REFRIGERANT CHARGE ESTIMATE ────────────────`,
      ``,
      `m_total = m_liquid_line + m_suction_line + m_factory_charge + m_receiver + m_evap`,
      ``,
      `── ${ref.name} (${ref.class}, GWP ${ref.gwp}) ──`,
      `${ref.useCase}`,
      `Density at ${sct}°C SCT: ρ_L = ${rhoL} kg/m³  (NIST REFPROP 10.0)`,
      ``,
      `── Liquid line ${liqSize.label} × ${fmt(liqLen, 1)} m ──`,
      `Volume    = ${fmt(liqVolL, 3)} L`,
      `Mass      = ${fmt(liqVolL, 3)} × ${rhoL} g/L = ${fmt(liqMass, 2)} kg`,
      ``,
      `── Suction line ${sucSize.label} × ${fmt(sucLen, 1)} m ──`,
      `Volume    = ${fmt(sucVolL, 3)} L · Gas ρ ≈ ${sucGasRho} kg/m³`,
      `Mass      = ${fmt(sucMass, 3)} kg`,
      ``,
      `── Condensing unit ──`,
      condensingUnit
        ? `${condensingUnit.profileName ?? 'Manual'} · ${condensingUnit.tierLabel ?? ''}\n  Factory pre-charge = ${fmt(cuMass, 2)} kg\n  Receiver ${condensingUnit.receiverL ?? 0} L × 30% × ${rhoL} = ${fmt(recvMass, 2)} kg`
        : 'Not selected — line-only estimate.',
      ``,
      `── Evaporator ──`,
      evaporator
        ? `${evaporator.profileName ?? 'Manual'} · ${evaporator.tierLabel ?? ''} × ${evapQty}\n  Pumpdown × qty = ${fmt(evapMass, 2)} kg`
        : 'Not selected.',
      ``,
      `── TOTAL ──────────────────────────────────────`,
      `m_total = ${fmt(total, 2)} kg = ${fmt(total * 2.20462, 2)} lb`,
      `Recommend ordering ${fmt(total * 1.15, 1)} kg (15% service margin).`,
      ``,
      `Source: ASHRAE Refrigeration Handbook Ch. 26 §"System Charge"; densities NIST REFPROP 10.0; equipment values class-typical for major commercial brands.`
    ].join('\n');

    persistState();
  }

  function persistState() {
    writeState({
      ref: els.ref.value,
      cl: getSeg(els.climateSeg),
      lo: els.liqOd.value, ll: els.liqLen.value,
      so: els.sucOd.value, sl: els.sucLen.value,
      eq: els.evapQty.value,
      cu: condensingUnit ? JSON.stringify({ p: condensingUnit.profileId, t: condensingUnit.tierId, m: condensingUnit.mode, fc: condensingUnit.factoryChargeKg, rv: condensingUnit.receiverL }) : null,
      ev: evaporator ? JSON.stringify({ p: evaporator.profileId, t: evaporator.tierId, m: evaporator.mode, pd: evaporator.pumpdownKg }) : null
    });
  }
  function restoreState() {
    const s = readState();
    if (s.ref) els.ref.value = s.ref;
    if (s.cl) {
      els.climateSeg.querySelectorAll('button').forEach(b =>
        b.setAttribute('aria-pressed', b.dataset.val === s.cl ? 'true' : 'false'));
    }
    if (s.lo) els.liqOd.value = s.lo;
    if (s.ll) els.liqLen.value = s.ll;
    if (s.so) els.sucOd.value = s.so;
    if (s.sl) els.sucLen.value = s.sl;
    if (s.eq) els.evapQty.value = s.eq;
    if (s.cu) {
      try {
        const o = JSON.parse(s.cu);
        if (o.p && o.t) {
          const p = equipData.condensingUnits.profiles.find(x => x.id === o.p);
          const t = p?.tiers.find(x => x.id === o.t);
          if (t) condensingUnit = { mode: 'class', profileId: p.id, profileName: p.name, tierId: t.id, tierLabel: t.label, ...t };
        } else if (o.m === 'manual') {
          condensingUnit = { mode: 'manual', factoryChargeKg: o.fc, receiverL: o.rv };
        }
        renderCuSummary();
      } catch {}
    }
    if (s.ev) {
      try {
        const o = JSON.parse(s.ev);
        if (o.p && o.t) {
          const p = equipData.evaporators.profiles.find(x => x.id === o.p);
          const t = p?.tiers.find(x => x.id === o.t);
          if (t) evaporator = { mode: 'class', profileId: p.id, profileName: p.name, tierId: t.id, tierLabel: t.label, ...t };
        } else if (o.m === 'manual') {
          evaporator = { mode: 'manual', pumpdownKg: o.pd };
        }
        renderEvapSummary();
      } catch {}
    }
  }

  Izhar.wireToolChrome({
    toolId: 'refrigerant-charge',
    toolNumber: 4,
    toolName: 'Refrigerant Charge Estimator',
    serialize: () => ({
      projectName: `${els.ref.value} charge estimate`,
      hash: location.hash,
      condensingUnit, evaporator
    }),
    deserialize: (data) => {
      if (data.hash) location.hash = data.hash;
      if (data.condensingUnit) condensingUnit = data.condensingUnit;
      if (data.evaporator) evaporator = data.evaporator;
      restoreState();
      if (typeof renderCuSummary === 'function') renderCuSummary();
      if (typeof renderEvapSummary === 'function') renderEvapSummary();
      compute();
    },
    buildPDF: () => ({
      projectName: `${els.ref.value} system charge estimate`,
      sections: [
        { title: 'Inputs', kv: [
          ['Refrigerant', els.ref.value],
          ['Climate', els.climateSeg.querySelector('button[aria-pressed="true"]')?.dataset.val || '—'],
          ['Liquid line', `${els.liqOd.value} OD × ${els.liqLen.value} ft`],
          ['Suction line', `${els.sucOd.value} OD × ${els.sucLen.value} ft`],
          ['Evaporator qty', els.evapQty.value]
        ]},
        { title: 'Equipment', kv: [
          ['Condensing unit', condensingUnit ? `${condensingUnit.profileName || 'Manual'} · ${condensingUnit.factoryChargeKg || '?'} kg pre-charge` : 'Not selected'],
          ['Evaporator', evaporator ? `${evaporator.profileName || 'Manual'} · ${evaporator.pumpdownKg || '?'} kg pumpdown` : 'Not selected']
        ]},
        { title: 'Result', kv: [
          ['Estimated total charge', $('big')?.textContent || '—']
        ]}
      ],
      math: $('math-body')?.textContent || '',
      sources: ['NIST REFPROP 10.0 — saturated-liquid densities', 'ASHRAE Refrigeration Handbook Ch. 26', 'Cross-validated against K-RP empirical line-charge tables']
    })
  });

  restoreState();
  compute();
})();
