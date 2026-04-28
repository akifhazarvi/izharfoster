/* ==========================================================================
   A2L MIN ROOM AREA CALCULATOR — Tool 3
   IEC 60335-2-89:2019 leakable-charge method.
   Leakable charge = evaporator pumpdown + liquid line + suction line (in-room).
   ========================================================================== */

(async function () {
  if (!window.Izhar) await new Promise(r => setTimeout(r, 50));
  const { fmt, getData, readState, writeState, quoteUrl, whatsappUrl, openEquipmentSelector } = Izhar;

  const $ = (id) => document.getElementById(id);
  let evaporator = null;  // either {mode:'class', pumpdownKg, ...} or {mode:'manual', pumpdownKg, ...}

  const els = {
    ref: $('ref'), refHint: $('ref-hint'),
    evapPick: $('evap-pick'), evapSummary: $('evap-summary'),
    liqOd: $('liq-od'), liqLen: $('liq-len'),
    sucOd: $('suc-od'), sucLen: $('suc-len'),
    area: $('area'),
    ceiling: $('ceiling'),
    occupancy: document.getElementsByName('occ'),
    verdict: $('verdict'), verdictSub: $('verdict-sub'),
    minArea: $('min-area'), minAreaExplain: $('min-area-explain'),
    userArea: $('user-area'),
    options: $('options'),
    mathBody: $('math-body'),
    ctaQuote: $('cta-quote'), ctaWa: $('cta-wa'),
  };

  const [refData, equipData] = await Promise.all([
    getData('data-refrigerants-rich'),
    getData('data-equipment')
  ]);
  const a2lRefs = refData.refrigerants.filter(r => r.class === 'A2L');

  // Refrigerant dropdown
  a2lRefs.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.id;
    opt.textContent = `${r.name} — LFL ${r.lflVolPct}% (${r.lflKgPerM3} kg/m³) · GWP ${r.gwp}`;
    if (r.id === 'R454C') opt.selected = true;
    els.ref.appendChild(opt);
  });

  // Line-size dropdowns
  function fillLineSize(sel, defaultOd) {
    refData.lineSizes.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.odIn;
      opt.textContent = `${s.label} (ID ${s.idMm.toFixed(1)} mm · ${s.volLperM.toFixed(3)} L/m)`;
      if (s.odIn === defaultOd) opt.selected = true;
      sel.appendChild(opt);
    });
  }
  fillLineSize(els.liqOd, 0.625);  // 5/8"
  fillLineSize(els.sucOd, 0.875);  // 7/8"

  // Equipment selector
  els.evapPick.addEventListener('click', () => {
    openEquipmentSelector({
      kind: 'evaporators',
      refrigerantId: els.ref.value,
      onPick: (picked) => {
        evaporator = picked;
        renderEvapSummary();
        compute();
      }
    });
  });

  function renderEvapSummary() {
    if (!evaporator) {
      els.evapPick.textContent = 'Select model →';
      els.evapSummary.textContent = 'Pick a class-typical evaporator profile, or enter pumpdown manually from your datasheet.';
      return;
    }
    if (evaporator.mode === 'class') {
      els.evapPick.innerHTML = `${evaporator.profileName} · ${evaporator.tierLabel} (${evaporator.pumpdownKg} kg) <span style="margin-left:auto; color:var(--t-warm);">change →</span>`;
      els.evapSummary.innerHTML = `Class-typical: <strong>${evaporator.pumpdownKg} kg</strong> pumpdown · ${evaporator.capacityKwLow}–${evaporator.capacityKwHigh} kW capacity range. <em style="color:var(--muted);">Verify against your actual datasheet at procurement.</em>`;
    } else {
      els.evapPick.innerHTML = `Manual: ${evaporator.pumpdownKg ?? '?'} kg pumpdown <span style="margin-left:auto; color:var(--t-warm);">change →</span>`;
      els.evapSummary.innerHTML = `From datasheet: <strong>${evaporator.pumpdownKg ?? '?'} kg</strong>${evaporator.notes ? ' · ' + evaporator.notes : ''}.`;
    }
  }

  // Listeners
  ['ref','liq-od','liq-len','suc-od','suc-len','area','ceiling'].forEach(id => $(id).addEventListener('input', compute));
  Array.from(els.occupancy).forEach(r => r.addEventListener('change', compute));

  els.ref.addEventListener('change', () => {
    // If user changed refrigerant and selected evaporator doesn't support new one, show warning
    if (evaporator?.mode === 'class' && evaporator.refrigerants && !evaporator.refrigerants.includes(els.ref.value)) {
      els.evapSummary.innerHTML = `<span style="color:var(--t-warm);">⚠ Selected evaporator class doesn't list compatibility with ${els.ref.value} — re-pick to be safe.</span>`;
    }
  });

  function getOcc() { return Array.from(els.occupancy).find(r => r.checked)?.value || 'B'; }

  // Liquid + suction in-room volumes (kg of refrigerant inside the room)
  function inRoomLineCharge() {
    const ref = a2lRefs.find(r => r.id === els.ref.value);
    if (!ref) return { liq: 0, suc: 0, total: 0 };
    const sct = '45';  // assume Plains for the SCT density basis
    const rhoL = ref.rhoLiquid?.[sct] ?? 950;
    const rhoVap = 50; // approx
    const liqOd = parseFloat(els.liqOd.value);
    const liqSize = refData.lineSizes.find(s => s.odIn === liqOd);
    const liqLen = parseFloat(els.liqLen.value) || 0;
    const sucOd = parseFloat(els.sucOd.value);
    const sucSize = refData.lineSizes.find(s => s.odIn === sucOd);
    const sucLen = parseFloat(els.sucLen.value) || 0;
    const liqMass = (liqLen * (liqSize?.volLperM ?? 0) / 1000) * rhoL;
    const sucMass = (sucLen * (sucSize?.volLperM ?? 0) / 1000) * rhoVap;
    return { liq: liqMass, suc: sucMass, total: liqMass + sucMass };
  }

  function compute() {
    const ref = a2lRefs.find(r => r.id === els.ref.value);
    if (!ref) return;
    const A = parseFloat(els.area.value);
    const h = parseFloat(els.ceiling.value);
    const occ = getOcc();
    if (![A, h].every(x => x > 0 && isFinite(x))) {
      els.verdict.textContent = '—';
      els.verdictSub.textContent = 'Enter valid room area and ceiling height.';
      return;
    }

    // Leakable charge = evaporator pumpdown + lines inside the room
    const lines = inRoomLineCharge();
    const evapKg = (evaporator?.pumpdownKg) ?? 0;
    const m = evapKg + lines.total;

    if (m <= 0) {
      els.verdict.textContent = '—';
      els.verdictSub.textContent = 'Pick an evaporator (or enter pumpdown manually) and set in-room line lengths.';
      els.minArea.textContent = '—';
      els.userArea.textContent = `${fmt(A, 1)} m²`;
      els.options.innerHTML = '';
      return;
    }

    const LFL = ref.lflKgPerM3;
    let aMinBase = (4 * m) / (LFL * h);
    let occMultiplier = 1.0;
    if (occ === 'A') occMultiplier = 2.0;
    const aMin = aMinBase * occMultiplier;

    const compliant = A >= aMin;
    const margin = ((A - aMin) / aMin * 100);
    const mMax = (LFL * h * A) / (4 * occMultiplier);

    els.userArea.textContent = `${fmt(A, 1)} m²`;
    els.minArea.textContent = `${fmt(aMin, 1)} m²`;
    els.minAreaExplain.innerHTML = `For <strong>${fmt(m, 2)} kg</strong> leakable ${ref.name} at ${fmt(h, 1)} m ceiling · class ${occ}`;

    if (compliant) {
      els.verdict.textContent = '✓ Compliant';
      els.verdict.style.color = 'var(--t-mid)';
      els.verdictSub.textContent = `${fmt(margin, 0)}% margin above the minimum required area.`;
    } else if (m <= mMax * 4) {
      els.verdict.textContent = '⚠ Increase room or charge';
      els.verdict.style.color = 'var(--t-warm)';
      els.verdictSub.textContent = `Falls short by ${fmt(aMin - A, 1)} m². Mechanical ventilation + leak detection may compensate (IEC 60335-2-89 Annex HH).`;
    } else {
      els.verdict.textContent = '✗ Non-compliant';
      els.verdict.style.color = 'var(--t-warm)';
      els.verdictSub.textContent = 'Charge exceeds 4× max even with ventilation. Split system or non-flammable refrigerant required.';
    }

    const opts = [];
    if (!compliant) {
      opts.push(`Increase room area to ≥ ${fmt(aMin, 1)} m²`);
      opts.push(`Reduce leakable charge to ≤ ${fmt(mMax, 2)} kg (shorter in-room piping or smaller evaporator)`);
      opts.push(`Raise ceiling to ${fmt((4 * m) / (LFL * A) * occMultiplier, 1)} m`);
      opts.push(`Add mechanical ventilation interlocked with leak detection (IEC 60335-2-89 Annex HH)`);
      opts.push(`Switch to a Class A1 refrigerant (R-449A, R-448A) — no charge limit`);
    } else {
      opts.push(`Margin OK. Best practice: install a leak detector at < 25% LFL threshold.`);
      opts.push(`Document compliance for Pakistani factory regulator + insurance audit.`);
    }
    els.options.innerHTML = `
      <div class="calc-eyebrow" style="display:block; margin-bottom:8px;">Compliance options</div>
      <ul style="font-size:.88rem; line-height:1.5; padding-left:20px; margin:0;">
        ${opts.map(o => `<li>${o}</li>`).join('')}
      </ul>
    `;

    const summary = `${fmt(m, 2)} kg leakable ${ref.name} (${evapKg} evap + ${fmt(lines.total, 2)} lines) · ${fmt(A, 1)} m² room (${compliant ? 'compliant' : 'NOT compliant'}, min ${fmt(aMin, 1)} m²)`;
    els.ctaQuote.href = quoteUrl('a2l-room-area', summary);
    els.ctaWa.href = whatsappUrl(`Hello Izhar, A2L compliance: ${summary}. Please advise.`);

    els.mathBody.textContent = [
      `── A2L MIN ROOM AREA — IEC 60335-2-89:2019 ────`,
      ``,
      `Step 1 — Leakable charge (refrigerant inside the room):`,
      `  Evaporator pumpdown   = ${fmt(evapKg, 2)} kg ${evaporator ? `(${evaporator.mode === 'class' ? evaporator.profileName + ' · ' + evaporator.tierLabel : 'manual entry'})` : ''}`,
      `  Liquid line in-room   = ${fmt(lines.liq, 3)} kg (${els.liqLen.value} m × line vol × ρ_L ${ref.rhoLiquid?.['45'] ?? '?'} kg/m³)`,
      `  Suction line in-room  = ${fmt(lines.suc, 3)} kg (${els.sucLen.value} m × line vol × ρ_vapor)`,
      `  ── Total leakable     = ${fmt(m, 2)} kg`,
      ``,
      `Step 2 — Min room area:`,
      `  A_min = (4 × m) / (LFL × h) × occ_factor`,
      `  LFL ${ref.name}        = ${LFL} kg/m³ (${ref.lflVolPct}%)`,
      `  Ceiling height         = ${fmt(h, 2)} m`,
      `  Occupancy class ${occ}        = ×${occMultiplier}`,
      `  A_min = (4 × ${fmt(m, 2)}) / (${LFL} × ${fmt(h, 2)}) × ${occMultiplier}`,
      `        = ${fmt(aMin, 2)} m²`,
      ``,
      `Step 3 — Reverse: max charge in your ${fmt(A, 1)} m² room:`,
      `  m_max = (LFL × h × A) / (4 × occ_factor)`,
      `        = ${fmt(mMax, 2)} kg`,
      ``,
      `── SOURCES ────────────────────────────────────`,
      `IEC 60335-2-89:2019 (2nd ed.) Annex GG`,
      `ISO 5149-1 — Refrigerating systems and heat pumps, safety`,
      `ASHRAE Standard 15-2022 — occupancy classification`,
      `LFL data: IEC 60335-2-40 Annex GG, ASHRAE 34-2022`,
      `Refrigerant density: NIST REFPROP 10.0`,
    ].join('\n');

    persistState();
  }

  function persistState() {
    writeState({
      ref: els.ref.value,
      liqOd: els.liqOd.value, liqLen: els.liqLen.value,
      sucOd: els.sucOd.value, sucLen: els.sucLen.value,
      a: els.area.value, h: els.ceiling.value, occ: getOcc(),
      ev: evaporator ? JSON.stringify({ p: evaporator.profileId, t: evaporator.tierId, m: evaporator.mode, pd: evaporator.pumpdownKg }) : null
    });
  }
  function restoreState() {
    const s = readState();
    if (s.ref) els.ref.value = s.ref;
    if (s.liqOd) els.liqOd.value = s.liqOd;
    if (s.liqLen) els.liqLen.value = s.liqLen;
    if (s.sucOd) els.sucOd.value = s.sucOd;
    if (s.sucLen) els.sucLen.value = s.sucLen;
    if (s.a) els.area.value = s.a;
    if (s.h) els.ceiling.value = s.h;
    if (s.occ) Array.from(els.occupancy).forEach(r => r.checked = (r.value === s.occ));
    if (s.ev) {
      try {
        const ev = JSON.parse(s.ev);
        if (ev.p && ev.t) {
          const prof = equipData.evaporators.profiles.find(p => p.id === ev.p);
          const tier = prof?.tiers.find(t => t.id === ev.t);
          if (tier) {
            evaporator = { mode: 'class', profileId: prof.id, profileName: prof.name, tierId: tier.id, tierLabel: tier.label, ...tier };
          }
        } else if (ev.m === 'manual' && ev.pd) {
          evaporator = { mode: 'manual', pumpdownKg: ev.pd };
        }
        renderEvapSummary();
      } catch {}
    }
  }

  document.querySelectorAll('[data-glossary]').forEach(b => {
    b.addEventListener('click', () => Izhar.showGlossary(b.dataset.glossary));
  });

  Izhar.wireToolChrome({
    toolId: 'a2l-room-area',
    toolNumber: 3,
    toolName: 'A2L Min Room Area',
    serialize: () => ({
      projectName: `${els.ref.value} A2L check · ${els.area.value} m² room`,
      hash: location.hash,
      evaporator
    }),
    deserialize: (data) => {
      if (data.hash) location.hash = data.hash;
      if (data.evaporator) evaporator = data.evaporator;
      restoreState();
      if (typeof renderEvapSummary === 'function') renderEvapSummary();
      compute();
    },
    buildPDF: () => ({
      projectName: `${els.ref.value} A2L safety check`,
      sections: [
        { title: 'Inputs', kv: [
          ['Refrigerant', els.ref.value],
          ['Liquid line (in-room)', `${els.liqOd.value} OD × ${els.liqLen.value} ft`],
          ['Suction line (in-room)', `${els.sucOd.value} OD × ${els.sucLen.value} ft`],
          ['Room area', `${els.area.value} m²`],
          ['Ceiling height', `${els.ceiling.value} m`]
        ]},
        { title: 'Result', kv: [
          ['Verdict', $('verdict')?.textContent || '—'],
          ['Minimum room area', $('min-area')?.textContent || '—']
        ]}
      ],
      math: $('math-body')?.textContent || '',
      sources: ['IEC 60335-2-89:2019 §GG — Indoor (leakable) charge method', 'ASHRAE Standard 15 — occupancy classification', 'NIST REFPROP 10.0 — refrigerant LFL data']
    })
  });

  restoreState();
  // Default evaporator if nothing restored
  if (!evaporator) {
    evaporator = {
      mode: 'class',
      profileId: 'medium_profile', profileName: 'Medium Profile',
      tierId: 'tier_m', tierLabel: 'Medium',
      capacityKwLow: 5, capacityKwHigh: 12,
      pumpdownKg: 1.4, fanW: 530,
      refrigerants: ['R449A','R448A','R454C','R454A','R717']
    };
    renderEvapSummary();
  }
  compute();
})();
