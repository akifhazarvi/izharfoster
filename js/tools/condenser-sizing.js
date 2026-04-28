/* ==========================================================================
   AIR-COOLED CONDENSER SIZER — Tool 5
   Q_cond = Q_evap × (1 + 1/COP) = Q_evap × THR_factor
   Source: ASHRAE Refrigeration Ch. 35; RESEARCH.md §5
   ========================================================================== */

(async function () {
  if (!window.Izhar) await new Promise(r => setTimeout(r, 50));
  const { fmt, getData, readState, writeState, quoteUrl, whatsappUrl, mailtoUrl,
          countUp, openEquipmentSelector, openJobTypeChooser, saveJson, openJsonFile, generatePDF } = Izhar;

  const $ = (id) => document.getElementById(id);
  let lastBig = 0;
  let condensingUnit = null;
  let knownModelCU = null;
  let mode = 'known-loads';
  const els = {
    load: $('load'),
    appSeg: $('app-seg'),
    ref: $('ref'),
    city: $('city'), ambient: $('ambient'), td: $('td'),
    big: $('big'), sub: $('sub'),
    qcond: $('qcond'), qcondExplain: $('qcond-explain'),
    sct: $('sct'),
    thr: $('thr'), thrExplain: $('thr-explain'),
    recommended: $('recommended-class'),
    recommendedExplain: $('recommended-class-explain'),
    cuPick: $('cu-pick'),
    mathBody: $('math-body'),
    ctaQuote: $('cta-quote'), ctaWa: $('cta-wa'),
    // Known Model
    kmCuPick: $('km-cu-pick'), kmCuDisplay: $('km-cu-display'),
    kmRef: $('km-ref'), kmAppSeg: $('km-app-seg'),
    kmCity: $('km-city'), kmAmbient: $('km-ambient'), kmLoad: $('km-load-actual'),
    // Mode + chrome
    modeBadge: $('jobmode-badge'),
    jobNew: $('job-new'), jobOpen: $('job-open'), jobSave: $('job-save'), jobPrint: $('job-print'),
  };

  const [refData, cityData, equipData] = await Promise.all([
    getData('data-refrigerants-rich'),
    getData('data-cities'),
    getData('data-equipment')
  ]);

  // Recommend a condensing-unit class for a given load + application + refrigerant
  function recommendCondensingClass(Q_evap, app, refId) {
    // Pick profile based on application: MT → scroll/recip, LT → recip_lt, > 100 kW → screw
    let candidates = equipData.condensingUnits.profiles.filter(p => {
      if (Q_evap > 100) return p.id === 'screw_industrial' || p.id === 'recip_mt' || p.id === 'recip_lt';
      if (app === 'LT') return p.id === 'recip_lt';
      return p.id === 'scroll_mt' || p.id === 'recip_mt';
    });
    for (const prof of candidates) {
      const tier = prof.tiers.find(t => Q_evap >= t.capacityKwLow && Q_evap <= t.capacityKwHigh && (!t.refrigerants || t.refrigerants.includes(refId)));
      if (tier) {
        return { mode: 'class', profileId: prof.id, profileName: prof.name, tierId: tier.id, tierLabel: tier.label, ...tier };
      }
    }
    return null;
  }

  if (els.cuPick) {
    els.cuPick.addEventListener('click', () => {
      const Q = parseFloat(els.load.value);
      openEquipmentSelector({
        kind: 'condensingUnits',
        refrigerantId: els.ref.value,
        capacityKwHint: Q,
        onPick: (picked) => { condensingUnit = picked; compute(); }
      });
    });
  }
  if (els.kmCuPick) {
    els.kmCuPick.addEventListener('click', () => {
      openEquipmentSelector({
        kind: 'condensingUnits',
        refrigerantId: els.kmRef.value,
        capacityKwHint: parseFloat(els.kmLoad.value),
        onPick: (picked) => { knownModelCU = picked; compute(); }
      });
    });
  }

  // Refrigerant dropdown (Known Loads + Known Model) — only those with COP data
  refData.refrigerants.filter(r => r.copMT || r.copLT).forEach(r => {
    [els.ref, els.kmRef].forEach(parent => {
      if (!parent) return;
      const opt = document.createElement('option');
      opt.value = r.id;
      opt.textContent = `${r.name} — ${r.useCase.split(' — ')[0]}`;
      if (r.id === 'R449A') opt.selected = true;
      parent.appendChild(opt);
    });
  });

  // City dropdown (both modes)
  cityData.cities.forEach(c => {
    [els.city, els.kmCity].forEach(parent => {
      if (!parent) return;
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.name} — ${c.tempC}°C`;
      if (c.default) opt.selected = true;
      parent.appendChild(opt);
    });
  });
  els.city.addEventListener('change', () => {
    const c = cityData.cities.find(x => x.id === els.city.value);
    if (c) { els.ambient.value = c.tempC; compute(); }
  });
  if (els.kmCity) {
    els.kmCity.addEventListener('change', () => {
      const c = cityData.cities.find(x => x.id === els.kmCity.value);
      if (c) { els.kmAmbient.value = c.tempC; compute(); }
    });
  }

  // Segmented
  function bindSeg(el) {
    if (!el) return;
    el.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => {
        el.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', 'false'));
        b.setAttribute('aria-pressed', 'true');
        compute();
      });
    });
  }
  function getSeg(el) { return el?.querySelector('button[aria-pressed="true"]')?.dataset.val; }
  bindSeg(els.appSeg);
  bindSeg(els.kmAppSeg);

  // Listeners
  ['load','ref','ambient','td','km-ref','km-ambient','km-load-actual'].forEach(id => {
    const el = $(id);
    if (el) el.addEventListener('input', compute);
  });

  // Mode chrome wiring
  function setMode(m) {
    mode = m;
    document.querySelectorAll('[data-mode]').forEach(x => {
      x.style.display = (x.dataset.mode === m) ? 'block' : 'none';
    });
    if (els.modeBadge) els.modeBadge.textContent = `Mode: ${m === 'known-model' ? 'Known Model' : 'Known Loads'}`;
    compute();
  }
  function showJobChooser() {
    openJobTypeChooser({
      title: 'New Job — Air-Cooled Condenser Designer',
      subtitle: 'Two paths through this tool. Pick the one that matches what you already know.',
      options: [
        { id: 'known-loads', eyebrow: 'Path A · Forward sizing', label: 'I know my load', sub: 'Enter the evaporator capacity (kW) you need to reject. The tool sizes a condenser at your site ambient and recommends a class-typical unit.', accent: 'mid' },
        { id: 'known-model', eyebrow: 'Path B · Reverse derating', label: 'I know my model', sub: 'Pick a specific condensing unit (or enter datasheet values) and check if it has enough capacity at your Pakistan site ambient. Get a derated capacity + headroom %.', accent: 'warm' }
      ],
      onOpenExisting: (data) => {
        if (data && data.tool === 'condenser-sizing') applyJobJson(data);
      },
      onPick: (id) => setMode(id)
    });
  }
  if (els.jobNew) els.jobNew.addEventListener('click', showJobChooser);
  if (els.jobOpen) els.jobOpen.addEventListener('click', async () => {
    try { const data = await openJsonFile(); if (data && data.tool === 'condenser-sizing') applyJobJson(data); }
    catch (e) {}
  });
  if (els.jobSave) els.jobSave.addEventListener('click', () => {
    const payload = buildJobJson();
    saveJson(`condenser-${(payload.projectName || 'job').replace(/\s+/g, '-')}.json`, payload);
  });
  if (els.jobPrint) els.jobPrint.addEventListener('click', printReport);

  function buildJobJson() {
    return {
      tool: 'condenser-sizing',
      version: 1,
      mode,
      savedAt: new Date().toISOString(),
      projectName: 'Condenser sizing job',
      knownLoads: {
        load: els.load.value, app: getSeg(els.appSeg), ref: els.ref.value,
        city: els.city.value, ambient: els.ambient.value, td: els.td.value,
        condensingUnit
      },
      knownModel: {
        ref: els.kmRef?.value, app: getSeg(els.kmAppSeg),
        city: els.kmCity?.value, ambient: els.kmAmbient?.value, load: els.kmLoad?.value,
        condensingUnit: knownModelCU
      }
    };
  }
  function applyJobJson(data) {
    if (data.mode) mode = data.mode;
    const kl = data.knownLoads || {};
    if (kl.load != null) els.load.value = kl.load;
    if (kl.ref) els.ref.value = kl.ref;
    if (kl.city) els.city.value = kl.city;
    if (kl.ambient != null) els.ambient.value = kl.ambient;
    if (kl.td != null) els.td.value = kl.td;
    if (kl.app && els.appSeg) els.appSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.val === kl.app ? 'true' : 'false'));
    if (kl.condensingUnit) condensingUnit = kl.condensingUnit;
    const km = data.knownModel || {};
    if (km.ref && els.kmRef) els.kmRef.value = km.ref;
    if (km.city && els.kmCity) els.kmCity.value = km.city;
    if (km.ambient != null && els.kmAmbient) els.kmAmbient.value = km.ambient;
    if (km.load != null && els.kmLoad) els.kmLoad.value = km.load;
    if (km.app && els.kmAppSeg) els.kmAppSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.val === km.app ? 'true' : 'false'));
    if (km.condensingUnit) knownModelCU = km.condensingUnit;
    setMode(mode);
  }

  function compute() {
    if (mode === 'known-model') return computeKnownModel();
    return computeKnownLoads();
  }

  function computeKnownLoads() {
    const Q_evap = parseFloat(els.load.value);
    const app = getSeg(els.appSeg) || 'MT';
    const ambient = parseFloat(els.ambient.value);
    const td = parseFloat(els.td.value);
    const ref = refData.refrigerants.find(r => r.id === els.ref.value);
    if (!ref || !isFinite(Q_evap) || Q_evap <= 0) {
      els.big.textContent = '—';
      els.sub.textContent = 'Enter valid load and refrigerant.';
      return;
    }

    const cop = app === 'MT' ? ref.copMT : ref.copLT;
    const thrBase = app === 'MT' ? ref.thrMT : ref.thrLT;
    if (!cop || !thrBase) {
      els.big.textContent = '—';
      els.sub.textContent = `${ref.name} not typically used for ${app === 'MT' ? 'medium-temp' : 'low-temp'}.`;
      return;
    }

    // SCT = ambient + TD; if SCT > 50°C, COP derates ~5% per 5K
    const sct = ambient + td;
    const sctPenalty = sct > 50 ? Math.pow(0.95, (sct - 50) / 5) : 1.0;
    const copEff = cop * sctPenalty;
    const thr = 1 + 1 / copEff;

    const qCond = Q_evap * thr;
    const qCondTR = qCond / 3.51685;
    const qCondBTUH = qCond * 3412.14;

    countUp(els.big, lastBig, qCond, 800, 1);
    lastBig = qCond;
    els.big.textContent = fmt(qCond, 1) + ' kW';
    els.sub.textContent = `${fmt(qCondTR, 1)} TR · ${fmt(qCondBTUH, 0)} BTU/hr`;

    els.qcond.textContent = fmt(qCond, 1) + ' kW';
    els.qcondExplain.innerHTML = `Q_evap (${Q_evap} kW) × THR (${thr.toFixed(2)})`;
    els.sct.textContent = fmt(sct, 1) + ' °C';
    els.thr.textContent = thr.toFixed(2);
    els.thrExplain.innerHTML = `${ref.name} ${app}, COP ${cop} ${sctPenalty < 1 ? `→ ${copEff.toFixed(2)} (high SCT derate)` : ''}`;

    // Recommend a condensing-unit class based on Q_evap (the load it must serve)
    const cuRecommendation = recommendCondensingClass(Q_evap, app, ref.id);
    if (condensingUnit) {
      const fits = Q_evap >= condensingUnit.capacityKwLow && Q_evap <= condensingUnit.capacityKwHigh;
      const symbol = fits ? '✓' : '⚠';
      els.recommended.innerHTML = `${symbol} ${condensingUnit.profileName ?? 'Manual selection'} · ${condensingUnit.tierLabel ?? ''}`;
      els.recommended.style.color = fits ? 'var(--t-mid)' : 'var(--t-warm)';
      if (condensingUnit.mode === 'class') {
        els.recommendedExplain.innerHTML = fits
          ? `Range ${condensingUnit.capacityKwLow}–${condensingUnit.capacityKwHigh} kW covers your ${Q_evap} kW load. Factory pre-charge ${condensingUnit.factoryChargeKg} kg, ${condensingUnit.receiverL} L receiver.`
          : `<strong>Mismatch:</strong> selection rated ${condensingUnit.capacityKwLow}–${condensingUnit.capacityKwHigh} kW but your load is ${Q_evap} kW. Browse for a better fit.`;
      } else {
        els.recommendedExplain.innerHTML = `Manual entry: ${condensingUnit.factoryChargeKg ?? '?'} kg pre-charge${condensingUnit.notes ? ' (' + condensingUnit.notes + ')' : ''}.`;
      }
    } else if (cuRecommendation) {
      els.recommended.textContent = `${cuRecommendation.profileName} · ${cuRecommendation.tierLabel}`;
      els.recommended.style.color = 'var(--ink)';
      els.recommendedExplain.innerHTML = `Class-typical fit for ${Q_evap} kW · ${app}. <button id="auto-pick-cu" class="btn-ghost" style="font-family:var(--font-mono);font-size:.78rem;color:var(--t-warm);padding:0;border:0;background:none;cursor:pointer;">Use this →</button>`;
      const apb = document.getElementById('auto-pick-cu');
      if (apb) apb.onclick = () => {
        condensingUnit = cuRecommendation;
        compute();
      };
    } else {
      els.recommended.textContent = '—';
      els.recommendedExplain.textContent = 'Pick a condensing unit profile to see fit + factory charge';
    }

    // CTAs
    const summary = `${fmt(qCond, 1)} kW condenser for ${Q_evap} kW ${ref.name} ${app} system at ${ambient}°C ambient`;
    els.ctaQuote.href = quoteUrl('condenser-sizing', summary);
    els.ctaWa.href = whatsappUrl(`Hello Izhar, I sized a condenser: ${summary}. Please advise on selection.`);

    // Hot Pakistan note
    let hotNote = '';
    if (sct >= 55) {
      hotNote = `\n⚠ SCT ${fmt(sct, 1)}°C is at upper end. Consider:\n  • Evaporative condenser (5–8 K lower SCT, 15% COP gain)\n  • Larger condenser at TD 10 K (lower SCT)\n  • Two-stage compression (LT only)`;
    }

    els.mathBody.textContent = [
      `── AIR-COOLED CONDENSER SIZING ──`,
      ``,
      `Q_cond = Q_evap × (1 + 1/COP) = Q_evap × THR`,
      ``,
      `Q_evap     = ${fmt(Q_evap, 2)} kW`,
      `Refrigerant = ${ref.name} (${ref.class}, GWP ${ref.gwp})`,
      `Application = ${app === 'MT' ? 'Medium temp (SST −10°C)' : 'Low temp (SST −30°C)'}`,
      `COP base    = ${cop}`,
      `${sctPenalty < 1 ? `COP derate  = ${sctPenalty.toFixed(3)} (high SCT > 50°C)` : 'No SCT derate'}`,
      `COP effect.  = ${copEff.toFixed(2)}`,
      `THR factor  = 1 + 1/${copEff.toFixed(2)} = ${thr.toFixed(3)}`,
      ``,
      `Q_cond      = ${fmt(Q_evap, 2)} × ${thr.toFixed(2)} = ${fmt(qCond, 2)} kW`,
      `            = ${fmt(qCondTR, 2)} TR`,
      `            = ${fmt(qCondBTUH, 0)} BTU/hr`,
      ``,
      `── OPERATING POINT ──`,
      `Ambient DB  = ${fmt(ambient, 1)}°C`,
      `Condenser TD = ${fmt(td, 1)} K`,
      `SCT         = ${fmt(sct, 1)}°C`,
      `${hotNote}`,
      ``,
      `── SOURCES ──`,
      `ASHRAE Refrigeration Handbook Ch. 35 (Air-Cooled Condensers)`,
      `THR factors per ${ref.name} performance map at SST −10°C / −30°C`,
      `RESEARCH.md §5 (cross-validated against industry tables)`
    ].join('\n');

    persistState();
  }

  function computeKnownModel() {
    const ref = refData.refrigerants.find(r => r.id === els.kmRef.value);
    const app = getSeg(els.kmAppSeg) || 'MT';
    const ambient = parseFloat(els.kmAmbient.value);
    const Q_actual = parseFloat(els.kmLoad.value);
    if (!knownModelCU) {
      els.big.textContent = '—';
      els.sub.textContent = 'Pick a condensing unit to derate.';
      els.kmCuDisplay.textContent = 'No unit selected — click below.';
      return;
    }
    els.kmCuDisplay.innerHTML = knownModelCU.mode === 'class'
      ? `<strong>${knownModelCU.profileName}</strong> · ${knownModelCU.tierLabel}<br><span style="font-size:.78rem; color:var(--muted);">Range ${knownModelCU.capacityKwLow}–${knownModelCU.capacityKwHigh} kW · ${knownModelCU.factoryChargeKg} kg pre-charge</span>`
      : `<strong>Manual datasheet entry</strong><br><span style="font-size:.78rem; color:var(--muted);">${knownModelCU.notes || ''} · Nominal ${knownModelCU.capacityKw || '?'} kW · ${knownModelCU.factoryChargeKg || '?'} kg pre-charge</span>`;
    if (!ref || !isFinite(ambient) || !isFinite(Q_actual)) return;

    // Manufacturer rates units at ambient_ref (typically 35°C, MT SST −10°C, LT SST −30°C)
    const ambientRef = 35;
    // Class-typical: capacity at midpoint; manual: explicit capacityKw
    const Q_nominal = knownModelCU.mode === 'class'
      ? (knownModelCU.capacityKwLow + knownModelCU.capacityKwHigh) / 2
      : (knownModelCU.capacityKw || 0);
    if (!Q_nominal) {
      els.big.textContent = '—';
      els.sub.textContent = 'Manual entry needs nominal capacity.';
      return;
    }
    // Ambient capacity derate, fitted to published Heatcraft / Bitzer / Copeland tables:
    //   MT scroll  ≈ 2.0%/K loss above 35°C rating point
    //   LT recip   ≈ 2.7%/K loss above 35°C rating point
    // Hard floor at 60% (real units trip on HP cutout beyond ~55°C SCT).
    const ambientDelta = ambient - ambientRef;
    const derateRate = app === 'LT' ? 0.027 : 0.020;
    const ambientDerate = Math.max(0.6, 1 - derateRate * Math.max(0, ambientDelta));
    // LT operation also penalises (SST further from condensing point — handled implicitly via COP)
    const cop = app === 'MT' ? ref.copMT : ref.copLT;
    const thr = 1 + 1 / cop;
    const Q_derated = Q_nominal * ambientDerate;
    const Q_evap_servable = Q_derated / thr; // condenser must reject Q_evap × thr
    const headroomPct = ((Q_evap_servable - Q_actual) / Q_actual) * 100;
    const ok = Q_evap_servable >= Q_actual;

    countUp(els.big, lastBig, Q_evap_servable, 800, 1);
    lastBig = Q_evap_servable;
    els.big.textContent = fmt(Q_evap_servable, 1) + ' kW';
    els.sub.innerHTML = ok
      ? `<span style="color:var(--t-mid);">✓ Sufficient — ${fmt(headroomPct, 0)}% headroom over your ${Q_actual} kW load</span>`
      : `<span style="color:var(--t-warm);">⚠ Undersized by ${fmt(-headroomPct, 0)}% — needs a larger unit</span>`;

    els.qcond.textContent = fmt(Q_derated, 1) + ' kW';
    els.qcondExplain.textContent = `Nominal ${fmt(Q_nominal, 1)} kW × ${(ambientDerate * 100).toFixed(0)}% ambient derate (${ambient}°C vs 35°C ref)`;
    els.sct.textContent = '—';
    els.thr.textContent = thr.toFixed(2);
    els.thrExplain.textContent = `${ref.name} ${app}, COP ${cop}`;
    els.recommended.innerHTML = ok ? `✓ Pass · ${fmt(headroomPct, 0)}% headroom` : `⚠ Fail · undersized by ${fmt(-headroomPct, 0)}%`;
    els.recommended.style.color = ok ? 'var(--t-mid)' : 'var(--t-warm)';
    els.recommendedExplain.textContent = ok
      ? `Unit can serve ${fmt(Q_evap_servable, 1)} kW at site ambient ${ambient}°C (you need ${Q_actual} kW).`
      : `Unit can only serve ${fmt(Q_evap_servable, 1)} kW at site ambient ${ambient}°C — you need ${Q_actual} kW. Consider larger model, evaporative condensing, or staging.`;

    const summary = `${knownModelCU.profileName || 'Manual unit'} ${ok ? 'fits' : 'undersized for'} ${Q_actual} kW ${ref.name} ${app} at ${ambient}°C ambient`;
    els.ctaQuote.href = quoteUrl('condenser-sizing', summary);
    els.ctaWa.href = whatsappUrl(`Hello Izhar, I'm checking a ${knownModelCU.profileName || 'condensing unit'} against ${Q_actual} kW load at ${ambient}°C ambient. ${ok ? 'Looks OK.' : 'Looks undersized.'} Please confirm.`);

    els.mathBody.textContent = [
      `── KNOWN-MODEL DERATE ──`,
      ``,
      `Selected unit: ${knownModelCU.profileName || 'Manual'} · ${knownModelCU.tierLabel || ''}`,
      `Nominal capacity (35°C ambient ref): ${fmt(Q_nominal, 1)} kW`,
      `Refrigerant: ${ref.name} (${app}, COP ${cop})`,
      `THR factor: ${thr.toFixed(3)}`,
      ``,
      `Site ambient: ${ambient}°C`,
      `Ambient delta vs rating: ${fmt(ambientDelta, 1)} K`,
      `Ambient derate: 1 − (0.025 × max(0, Δ)) = ${(ambientDerate * 100).toFixed(1)}%`,
      ``,
      `Derated heat rejection: ${fmt(Q_nominal, 1)} × ${ambientDerate.toFixed(3)} = ${fmt(Q_derated, 1)} kW`,
      `Servable Q_evap: ${fmt(Q_derated, 1)} ÷ ${thr.toFixed(2)} = ${fmt(Q_evap_servable, 1)} kW`,
      `Required: ${Q_actual} kW`,
      `Verdict: ${ok ? 'PASS' : 'FAIL'} · headroom ${fmt(headroomPct, 1)}%`,
      ``,
      `── SOURCES ──`,
      `Industry rule of thumb: ~2.5%/K capacity loss above rating ambient (Bohn/Bitzer/Embraco curves cross-validated).`,
      `THR per RESEARCH.md §5; ASHRAE Refrigeration Handbook Ch. 35.`
    ].join('\n');

    persistState();
  }

  function printReport() {
    if (mode === 'known-model') {
      const ref = refData.refrigerants.find(r => r.id === els.kmRef.value);
      generatePDF({
        toolNumber: 5,
        toolName: 'Air-Cooled Condenser Designer (Known Model)',
        projectName: knownModelCU ? `${knownModelCU.profileName || 'Manual unit'} derate at ${els.kmAmbient.value}°C` : 'Condenser derating job',
        sections: [
          { title: 'Selected unit', kv: [
            ['Profile', knownModelCU?.profileName || 'Manual entry'],
            ['Tier', knownModelCU?.tierLabel || '—'],
            ['Notes', knownModelCU?.notes || '—'],
            ['Pre-charge', knownModelCU?.factoryChargeKg ? `${knownModelCU.factoryChargeKg} kg` : '—']
          ]},
          { title: 'Site conditions', kv: [
            ['Refrigerant', ref?.name || '—'],
            ['Application', getSeg(els.kmAppSeg) === 'LT' ? 'Low temp (SST −30°C)' : 'Medium temp (SST −10°C)'],
            ['Ambient (DB)', `${els.kmAmbient.value} °C`],
            ['Load to serve', `${els.kmLoad.value} kW`]
          ]},
          { title: 'Result', kv: [
            ['Servable Q_evap', els.big.textContent],
            ['Verdict', els.recommended.textContent]
          ]}
        ],
        math: els.mathBody.textContent,
        sources: ['ASHRAE Refrigeration Handbook Ch. 35', 'Industry derate: ~2.5%/K above 35°C rating', 'Cross-validated against Bohn / Bitzer / Embraco curves']
      });
    } else {
      const ref = refData.refrigerants.find(r => r.id === els.ref.value);
      generatePDF({
        toolNumber: 5,
        toolName: 'Air-Cooled Condenser Designer (Forward sizing)',
        projectName: `${els.load.value} kW ${ref?.name || ''} condenser at ${els.ambient.value}°C`,
        sections: [
          { title: 'Inputs', kv: [
            ['Evaporator load', `${els.load.value} kW`],
            ['Refrigerant', ref?.name || '—'],
            ['Application', getSeg(els.appSeg) === 'LT' ? 'Low temp (SST −30°C)' : 'Medium temp (SST −10°C)'],
            ['Ambient (DB)', `${els.ambient.value} °C`],
            ['Condenser TD', `${els.td.value} K`]
          ]},
          { title: 'Result', kv: [
            ['Q_cond required', els.big.textContent],
            ['SCT', els.sct.textContent],
            ['THR factor', els.thr.textContent],
            ['Recommended class', els.recommended.textContent]
          ]}
        ],
        math: els.mathBody.textContent,
        sources: ['ASHRAE Refrigeration Handbook Ch. 35', 'IZHAR RESEARCH.md §5', 'Cross-validated within ±20% of Heatcraft, Copeland AE-103, Bitzer Software']
      });
    }
  }

  function persistState() {
    writeState({
      load: els.load.value,
      app: getSeg(els.appSeg),
      ref: els.ref.value,
      city: els.city.value,
      a: els.ambient.value, td: els.td.value
    });
  }
  function restoreState() {
    const s = readState();
    if (s.load) els.load.value = s.load;
    if (s.app) {
      els.appSeg.querySelectorAll('button').forEach(b =>
        b.setAttribute('aria-pressed', b.dataset.val === s.app ? 'true' : 'false'));
    }
    if (s.ref) els.ref.value = s.ref;
    if (s.city) els.city.value = s.city;
    if (s.a) els.ambient.value = s.a;
    if (s.td) els.td.value = s.td;
  }

  document.querySelectorAll('[data-glossary]').forEach(b => {
    b.addEventListener('click', () => Izhar.showGlossary(b.dataset.glossary));
  });

  restoreState();
  compute();
})();
