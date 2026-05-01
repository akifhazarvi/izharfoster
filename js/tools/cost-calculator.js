/* ==========================================================================
   COLD STORE COST CALCULATOR — Tool 8
   "World's First Intelligent Cold Store Cost Calculator"
   Engineering + Financial + Commercial in one tool. Pakistan-tuned.

   This tool sits ON TOP of the existing 7 calculators (load, capacity,
   refrigerant-charge, condenser-sizing, a2l, energy-cost, ca-atmosphere)
   and adds a cost layer using js/tools/data-pricing.json.

   Two output modes:
     1. Quick mode — capacity + temp + city → cost band (10 seconds)
     2. Detailed mode — full 3-step form → deep outputs incl.
        cost per ton/pallet/m³, diesel vs solar, PEB vs RCC, payback

   Inline-editable cost cells: every default value can be overridden by the
   user; overrides persist via localStorage.izhar_cost_overrides.
   ========================================================================== */

(async function () {
  if (!window.Izhar) await new Promise(r => setTimeout(r, 50));
  const { fmt, getData, readState, writeState, quoteUrl, whatsappUrl } = Izhar;

  // ---------- load pricing data + apply user overrides ----------
  const pricingDefault = await getData('data-pricing');
  const OVERRIDES_KEY = 'izhar_cost_overrides';

  function getOverrides() {
    try { return JSON.parse(localStorage.getItem(OVERRIDES_KEY) || '{}'); }
    catch { return {}; }
  }
  function setOverride(path, value) {
    const o = getOverrides();
    o[path] = value;
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(o));
  }
  function clearOverrides() {
    localStorage.removeItem(OVERRIDES_KEY);
    document.dispatchEvent(new CustomEvent('izhar:cost-overrides-cleared'));
  }
  function pricingValue(path) {
    // path = 'panel_pkr_per_m2.100mm' etc.  Look up in overrides first, then defaults.
    const overrides = getOverrides();
    if (path in overrides) return overrides[path];
    return path.split('.').reduce((o, k) => o?.[k], pricingDefault);
  }

  // ---------- core inputs (state) ----------
  const state = {
    // Step 1 — basics
    city: 'Lahore',
    commodity: 'mango',
    capacityM3: 1000,           // primary capacity (we accept tons/pallets/m³ and convert)
    capacityUnit: 'm3',         // 'm3' | 'tons' | 'pallets'
    setpointC: 0,               // °C
    setpointPreset: 'cold_store',

    // Step 2 — building
    panelMm: 100,               // 50/60/80/100/125/150/200
    siteClass: 'greenfield',    // greenfield | inside_existing_shed | multi_zone | brownfield_demolition
    envelopeChoice: 'PEB',      // PEB | RCC

    // Step 3 — refrigeration & power
    refrigArchitecture: 'cdu',  // cdu | rack | nh3_glycol | nh3_dx
    isCAStore: false,
    powerBackup: 'diesel',      // diesel | solar | none
    loadShedHoursPerDay: 4,
    operatingHoursPerDay: 24,

    // metadata
    mode: 'quick',              // 'quick' | 'detailed'
  };

  // ---------- conversions ----------
  function tonsToM3(tons, commodity) {
    const density = pricingValue(`commodity_density_kg_per_m3.${commodity}`)
                 || pricingValue('commodity_density_kg_per_m3.default');
    // Useful storage utilisation 0.55 (subtract aisles, racks, air gaps)
    return (tons * 1000 / density) / 0.55;
  }
  function palletsToM3(pallets) {
    return pallets * pricingValue('pallet_position_factor.m3_per_pallet_position');
  }
  function m3ToPallets(m3) {
    return m3 / pricingValue('pallet_position_factor.m3_per_pallet_position');
  }
  function m3ToTons(m3, commodity) {
    const density = pricingValue(`commodity_density_kg_per_m3.${commodity}`)
                 || pricingValue('commodity_density_kg_per_m3.default');
    return (m3 * 0.55 * density) / 1000;
  }

  function normalisedCapacityM3() {
    if (state.capacityUnit === 'm3') return state.capacityM3;
    if (state.capacityUnit === 'tons') return tonsToM3(state.capacityM3, state.commodity);
    if (state.capacityUnit === 'pallets') return palletsToM3(state.capacityM3);
    return state.capacityM3;
  }

  // ---------- engineering quick-estimate (we don't re-implement ASHRAE Ch.24
  // here; we take a simplified scaling that matches the load calculator's
  // typical kW/m³ output across Pakistani cold rooms). The user can switch
  // to the full load-calculator tool for precise numbers. ----------
  function estimateRefrigerationKw(volM3, setpointC, panelMm) {
    // Empirical band: cold rooms in Pakistan typically need 0.04 – 0.12 kW per m³
    // depending on temperature, panel thickness, ambient, and infiltration.
    // Cold-store typical: 0.06 kW/m³ at +0°C with 100mm panel, 35°C ambient.
    // Freezer typical: 0.10 kW/m³ at -22°C.
    // Blast freezer: 0.18 kW/m³.
    // We scale both by setpoint depth and panel-thickness inverse-relative.
    let baseline;
    if (setpointC >= 10) baseline = 0.04;
    else if (setpointC >= 0) baseline = 0.06;
    else if (setpointC >= -10) baseline = 0.08;
    else if (setpointC >= -22) baseline = 0.10;
    else if (setpointC >= -30) baseline = 0.13;
    else baseline = 0.18;

    // Panel correction — 100mm is the baseline. Thicker panels reduce load.
    const panelFactor = 100 / Math.max(50, panelMm);  // 50mm=2.0, 100mm=1.0, 150mm=0.67
    return volM3 * baseline * panelFactor;
  }

  function refrigerationHpFromKw(kw) {
    // For installed-capacity sizing (not motor nameplate) we use 0.85 kW/HP
    // approximation typical for industrial refrigeration plant.
    return kw / 0.85;
  }

  // Surface area approximation — assume cube root for m³ → side, surface = 6L²
  // gives wall+roof+floor m². Useful for panel cost.
  function surfaceAreaM2(volM3) {
    const side = Math.cbrt(volM3);
    // Wall + roof + floor combined (we count floor separately as civil, but PIR
    // is wall + roof). 5 surfaces = 5L². Add 15% for door frames, partitions.
    return side * side * 5 * 1.15;
  }
  function footprintM2(volM3) {
    const side = Math.cbrt(volM3);
    return side * side;
  }

  // ---------- door count heuristic ----------
  function doorCountForVolume(volM3, isMultiZone) {
    if (isMultiZone) return Math.max(2, Math.ceil(volM3 / 800));
    return volM3 < 200 ? 1 : volM3 < 1500 ? 2 : Math.ceil(volM3 / 1500);
  }

  // ---------- main cost engine ----------
  function compute() {
    const volM3 = normalisedCapacityM3();
    const refrigKw = estimateRefrigerationKw(volM3, state.setpointC, state.panelMm);
    const refrigHp = refrigerationHpFromKw(refrigKw);
    const panelArea = surfaceAreaM2(volM3);
    const footprint = footprintM2(volM3);
    const doorCount = doorCountForVolume(volM3, state.siteClass === 'multi_zone');
    const pallets = m3ToPallets(volM3);
    const tons = m3ToTons(volM3, state.commodity);

    // 1) Panel cost
    const panelKey = `${state.panelMm}mm`;
    const panelPkrPerM2 = pricingValue(`panel_pkr_per_m2.${panelKey}`)
                       || pricingValue('panel_pkr_per_m2.100mm');
    const panelCost = panelArea * panelPkrPerM2;

    // 2) Civil cost
    const civilBaseRate = pricingValue(`civil_pkr_per_m2.${state.siteClass}`)
                       || pricingValue('civil_pkr_per_m2.greenfield');
    const civilCost = footprint * civilBaseRate
                    + doorCount * pricingValue('civil_pkr_per_m2.elevated_dock_per_door');

    // 3) Refrigeration cost
    const refrigPkrPerHp = pricingValue(`refrigeration_pkr_per_HP.${state.refrigArchitecture}`)
                        || pricingValue('refrigeration_pkr_per_HP.cdu');
    let refrigCost = refrigHp * refrigPkrPerHp;
    if (state.isCAStore) refrigCost += refrigHp * pricingValue('refrigeration_pkr_per_HP.ca_store_extra');

    // 4) Doors
    let doorCost = 0;
    const doorKey = state.setpointC <= -25 ? 'blast_freezer_2x2_150mm_heated'
                  : state.setpointC <= -10 ? 'sliding_4x4_150mm'
                  : state.panelMm >= 125 ? 'sliding_3x3_125mm'
                  : 'sliding_2x2_100mm';
    doorCost = doorCount * pricingValue(`door_pkr.${doorKey}`);

    // 5) Electrical (panels, cabling, distribution)
    const electricalCost = refrigKw * pricingValue('electrical_pkr_per_kw_load.baseline_per_kw');

    // 6) Controls
    const controlsCost = state.siteClass === 'multi_zone'
      ? pricingValue('controls_pkr.multi_zone_scada')
      : pricingValue('controls_pkr.single_room_basic');

    // 7) Direct subtotal
    let directSubtotal = panelCost + civilCost + refrigCost + doorCost + electricalCost + controlsCost;

    // 8) Envelope choice (PEB vs RCC)
    const envelopeMul = state.envelopeChoice === 'RCC'
      ? pricingValue('envelope_choice_uplift.RCC_multiplier')
      : pricingValue('envelope_choice_uplift.PEB_baseline');
    directSubtotal *= envelopeMul;

    // 9) Engineering, PM, commissioning, contingency, margin
    const epcUplift = (
      pricingValue('engineering_install_pct.engineering_design_pct') +
      pricingValue('engineering_install_pct.project_management_pct') +
      pricingValue('engineering_install_pct.commissioning_pct') +
      pricingValue('engineering_install_pct.contingency_pct') +
      pricingValue('engineering_install_pct.izhar_overhead_margin_pct')
    ) / 100;

    const total = directSubtotal * (1 + epcUplift);

    // ±20% band
    const band = pricingDefault.uncertainty_band_pct / 100;
    const totalLow = total * (1 - band);
    const totalHigh = total * (1 + band);

    // 10) Annual energy cost
    const tariff = pricingValue(`city_tariff_pkr_per_kwh.${state.city}`)
                || pricingValue('city_tariff_pkr_per_kwh._default');
    const annualKwh = refrigKw * state.operatingHoursPerDay * 365 * 0.65; // 0.65 part-load factor
    const annualEnergyPkr = annualKwh * tariff;

    // 11) Diesel vs Solar OPEX comparison
    const dieselCfg = pricingDefault.diesel;
    const solarCfg = pricingDefault.solar;
    const loadShedHrs = state.loadShedHoursPerDay
                     ?? (pricingDefault.load_shedding.by_city_hours_per_day[state.city]
                       || pricingDefault.load_shedding.default_hours_per_day);
    const dieselKwhPerYear = refrigKw * loadShedHrs * 365 * 0.65;
    const dieselLitresPerYear = dieselKwhPerYear / dieselCfg.kwh_per_litre;
    const dieselAnnualPkr = dieselLitresPerYear * dieselCfg.pkr_per_litre;
    const dieselGensetCapex = refrigKw * 1.4 * dieselCfg.genset_capex_per_kw;

    const solarPvKw = refrigKw * 1.4; // size to peak load
    const solarCapex = solarPvKw * solarCfg.capex_pkr_per_kw_pv_only;
    const solarYieldKwhPerYear = solarPvKw * solarCfg.annual_yield_kwh_per_kw_pakistan_avg;
    const solarOffsetKwh = Math.min(annualKwh, solarYieldKwhPerYear);
    const solarOpexSaving = solarOffsetKwh * tariff;
    const solarPaybackYears = solarCapex / Math.max(solarOpexSaving, 1);
    const solarOandM = solarPvKw * solarCfg.annual_o_and_m_pkr_per_kw;

    // 12) Commercial metrics
    const costPerTon = total / Math.max(tons, 1);
    const costPerPallet = total / Math.max(pallets, 1);
    const costPerM3 = total / Math.max(volM3, 1);

    return {
      // engineering
      volM3, tons, pallets, footprint, panelArea, doorCount,
      refrigKw, refrigHp, setpointC: state.setpointC,
      // costs
      panelCost, civilCost, refrigCost, doorCost, electricalCost, controlsCost,
      directSubtotal, total, totalLow, totalHigh,
      // operating
      annualKwh, annualEnergyPkr, tariff,
      dieselAnnualPkr, dieselGensetCapex, loadShedHrs,
      solarPvKw, solarCapex, solarYieldKwhPerYear, solarOpexSaving, solarPaybackYears, solarOandM,
      // commercial
      costPerTon, costPerPallet, costPerM3,
      // metadata
      panelMm: state.panelMm, panelPkrPerM2,
      city: state.city, commodity: state.commodity,
      envelopeChoice: state.envelopeChoice, envelopeMul,
      epcUplift,
    };
  }

  // ---------- DOM rendering ----------
  const $ = (id) => document.getElementById(id);

  function pkr(n) {
    if (n == null || isNaN(n)) return 'PKR —';
    if (n >= 1e7) return `PKR ${(n / 1e7).toFixed(2)} crore`;
    if (n >= 1e5) return `PKR ${(n / 1e5).toFixed(1)} lakh`;
    return `PKR ${fmt(Math.round(n))}`;
  }
  function pkrAnnual(n) {
    if (n == null || isNaN(n)) return 'PKR —/yr';
    if (n >= 1e7) return `PKR ${(n / 1e7).toFixed(2)} crore/yr`;
    if (n >= 1e5) return `PKR ${(n / 1e5).toFixed(1)} lakh/yr`;
    return `PKR ${fmt(Math.round(n))}/yr`;
  }

  function bindSeg(el, key, parser) {
    el?.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        el.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');
        const v = btn.dataset.val;
        state[key] = parser ? parser(v) : v;
        recompute();
      });
    });
  }

  function bindInput(id, key, parser) {
    const el = $(id);
    if (!el) return;
    el.addEventListener('input', () => {
      const v = parser ? parser(el.value) : el.value;
      state[key] = v;
      recompute();
    });
    el.addEventListener('change', () => {
      const v = parser ? parser(el.value) : el.value;
      state[key] = v;
      recompute();
    });
  }

  function bindSelect(id, key) { bindInput(id, key); }

  function applyPresetFromSetpoint() {
    const presets = pricingDefault.preset_temperature_setpoints_C;
    state.setpointC = presets[state.setpointPreset] ?? 0;
    if ($('setpointC')) $('setpointC').value = state.setpointC;
  }

  function recompute() {
    const r = compute();
    renderResults(r);
    persistState();
  }

  function persistState() {
    writeState({
      city: state.city,
      cmd: state.commodity,
      cap: state.capacityM3,
      unit: state.capacityUnit,
      sp: state.setpointPreset,
      pnl: state.panelMm,
      sc: state.siteClass,
      env: state.envelopeChoice,
      arc: state.refrigArchitecture,
      ca: state.isCAStore ? 1 : 0,
      pwr: state.powerBackup,
      ls: state.loadShedHoursPerDay,
      mode: state.mode,
    });
  }

  function loadStateFromUrl() {
    const s = readState();
    if (s.city) state.city = s.city;
    if (s.cmd) state.commodity = s.cmd;
    if (s.cap) state.capacityM3 = parseFloat(s.cap);
    if (s.unit) state.capacityUnit = s.unit;
    if (s.sp) state.setpointPreset = s.sp;
    if (s.pnl) state.panelMm = parseInt(s.pnl, 10);
    if (s.sc) state.siteClass = s.sc;
    if (s.env) state.envelopeChoice = s.env;
    if (s.arc) state.refrigArchitecture = s.arc;
    if (s.ca) state.isCAStore = s.ca === '1';
    if (s.pwr) state.powerBackup = s.pwr;
    if (s.ls) state.loadShedHoursPerDay = parseFloat(s.ls);
    if (s.mode) state.mode = s.mode;
    applyPresetFromSetpoint();
  }

  function renderResults(r) {
    if ($('result-band'))    $('result-band').textContent    = `${pkr(r.totalLow)} – ${pkr(r.totalHigh)}`;
    if ($('result-mid'))     $('result-mid').textContent     = pkr(r.total);
    if ($('result-low'))     $('result-low').textContent     = pkr(r.totalLow);
    if ($('result-high'))    $('result-high').textContent    = pkr(r.totalHigh);

    if ($('out-volume'))     $('out-volume').textContent     = `${fmt(r.volM3, 0)} m³`;
    if ($('out-tons'))       $('out-tons').textContent       = `${fmt(r.tons, 0)} tons`;
    if ($('out-pallets'))    $('out-pallets').textContent    = `${fmt(r.pallets, 0)} pallets`;
    if ($('out-refrig-kw'))  $('out-refrig-kw').textContent  = `${fmt(r.refrigKw, 1)} kW`;
    if ($('out-refrig-hp'))  $('out-refrig-hp').textContent  = `${fmt(r.refrigHp, 1)} HP`;
    if ($('out-panel-m2'))   $('out-panel-m2').textContent   = `${fmt(r.panelArea, 0)} m²`;
    if ($('out-doors'))      $('out-doors').textContent      = `${r.doorCount}`;
    if ($('out-footprint'))  $('out-footprint').textContent  = `${fmt(r.footprint, 0)} m²`;

    if ($('out-cost-ton'))     $('out-cost-ton').textContent   = pkr(r.costPerTon);
    if ($('out-cost-pallet'))  $('out-cost-pallet').textContent = pkr(r.costPerPallet);
    if ($('out-cost-m3'))      $('out-cost-m3').textContent     = pkr(r.costPerM3);

    if ($('out-energy-annual')) $('out-energy-annual').textContent = pkrAnnual(r.annualEnergyPkr);
    if ($('out-tariff'))        $('out-tariff').textContent        = `PKR ${fmt(r.tariff, 2)}/kWh`;
    if ($('out-diesel-annual')) $('out-diesel-annual').textContent = pkrAnnual(r.dieselAnnualPkr);
    if ($('out-genset-capex'))  $('out-genset-capex').textContent  = pkr(r.dieselGensetCapex);
    if ($('out-loadshed'))      $('out-loadshed').textContent      = `${r.loadShedHrs} hrs/day`;
    if ($('out-solar-kw'))      $('out-solar-kw').textContent      = `${fmt(r.solarPvKw, 1)} kW`;
    if ($('out-solar-capex'))   $('out-solar-capex').textContent   = pkr(r.solarCapex);
    if ($('out-solar-saving'))  $('out-solar-saving').textContent  = pkrAnnual(r.solarOpexSaving);
    if ($('out-solar-payback')) $('out-solar-payback').textContent = `${fmt(r.solarPaybackYears, 1)} years`;

    // Cost breakdown
    if ($('cb-panel'))     $('cb-panel').textContent     = pkr(r.panelCost);
    if ($('cb-civil'))     $('cb-civil').textContent     = pkr(r.civilCost);
    if ($('cb-refrig'))    $('cb-refrig').textContent    = pkr(r.refrigCost);
    if ($('cb-doors'))     $('cb-doors').textContent     = pkr(r.doorCost);
    if ($('cb-electrical'))$('cb-electrical').textContent = pkr(r.electricalCost);
    if ($('cb-controls'))  $('cb-controls').textContent  = pkr(r.controlsCost);
    if ($('cb-direct'))    $('cb-direct').textContent    = pkr(r.directSubtotal);
    if ($('cb-epc-pct'))   $('cb-epc-pct').textContent   = `${(r.epcUplift * 100).toFixed(1)}%`;
    if ($('cb-total'))     $('cb-total').textContent     = pkr(r.total);
    if ($('cb-low'))       $('cb-low').textContent       = pkr(r.totalLow);
    if ($('cb-high'))      $('cb-high').textContent      = pkr(r.totalHigh);

    // Build lead-capture summary
    const summary = `${r.commodity} cold store · ${state.city} · ${fmt(r.volM3,0)} m³ · ${fmt(r.tons,0)} t · ${state.setpointC}°C · cost ${pkr(r.totalLow)} – ${pkr(r.totalHigh)} · ${fmt(r.refrigKw,1)} kW refrig · ${fmt(r.panelArea,0)} m² panel`;
    const longSummary = summary
      + `\n\n— Quote Snapshot —\nPanel ${r.panelMm} mm: ${pkr(r.panelCost)}\nCivil (${state.siteClass}): ${pkr(r.civilCost)}\nRefrigeration (${state.refrigArchitecture}): ${pkr(r.refrigCost)}\nDoors: ${pkr(r.doorCost)}\nElectrical: ${pkr(r.electricalCost)}\nControls: ${pkr(r.controlsCost)}\nEPC + margin: ${(r.epcUplift*100).toFixed(1)}%\nTOTAL (mid): ${pkr(r.total)}\nBand ±20%: ${pkr(r.totalLow)} – ${pkr(r.totalHigh)}\n\nAnnual energy: ${pkrAnnual(r.annualEnergyPkr)} (${state.city} tariff PKR ${fmt(r.tariff,2)}/kWh)\nDiesel backup OPEX: ${pkrAnnual(r.dieselAnnualPkr)} (${r.loadShedHrs} h/day load-shed)\nSolar option: ${fmt(r.solarPvKw,1)} kW PV → ${pkrAnnual(r.solarOpexSaving)} saved · payback ${fmt(r.solarPaybackYears,1)} years\n\nCost per ton: ${pkr(r.costPerTon)}\nCost per pallet: ${pkr(r.costPerPallet)}\nCost per m³: ${pkr(r.costPerM3)}`;

    if ($('cta-quote')) $('cta-quote').href = quoteUrl('cost-calculator', summary);
    if ($('cta-wa'))    $('cta-wa').href    = whatsappUrl(longSummary);
    if ($('cta-pdf'))   $('cta-pdf').onclick = () => buildPdfProposal(r, longSummary);

    if ($('result-summary')) $('result-summary').textContent = summary;
  }

  // ---------- PDF proposal (uses _shared.js Print pipeline) ----------
  function buildPdfProposal(r, longSummary) {
    // Trigger the shared chrome's Print PDF button if present, otherwise
    // window.print(). The page has a print stylesheet that hides
    // non-essential UI and renders a clean report layout.
    if (Izhar.printPDF) Izhar.printPDF({ title: 'Cold Store Cost Proposal', summary: longSummary });
    else window.print();
  }

  // ---------- inline-edit cost cells ----------
  function makeCellEditable(cell, path, formatter = pkr) {
    cell.classList.add('editable');
    cell.title = 'Click to edit. Saved per-session.';
    cell.addEventListener('click', () => {
      const cur = pricingValue(path);
      const v = prompt(`Override ${path}\nCurrent: ${cur}\n\nEnter new PKR value (or blank to reset):`, cur);
      if (v === null) return;
      if (v === '') {
        const o = getOverrides();
        delete o[path];
        localStorage.setItem(OVERRIDES_KEY, JSON.stringify(o));
      } else {
        const num = parseFloat(v);
        if (!isNaN(num)) setOverride(path, num);
      }
      recompute();
    });
  }

  // ---------- mode toggle ----------
  function setMode(mode) {
    state.mode = mode;
    document.body.dataset.mode = mode;
    document.querySelectorAll('[data-mode-tab]').forEach(b => {
      b.setAttribute('aria-pressed', b.dataset.modeTab === mode ? 'true' : 'false');
    });
    persistState();
    recompute();
  }

  // ---------- wire up DOM ----------
  function init() {
    // Mode tabs
    document.querySelectorAll('[data-mode-tab]').forEach(b => {
      b.addEventListener('click', () => setMode(b.dataset.modeTab));
    });

    // Step 1
    bindSelect('city', 'city');
    bindSelect('commodity', 'commodity');
    bindInput('capacityM3', 'capacityM3', parseFloat);
    bindSeg($('capacityUnit-seg'), 'capacityUnit');
    bindSelect('setpointPreset', 'setpointPreset');
    if ($('setpointPreset')) {
      $('setpointPreset').addEventListener('change', () => {
        applyPresetFromSetpoint();
        recompute();
      });
    }

    // Step 2
    bindSeg($('panelMm-seg'), 'panelMm', parseInt);
    bindSeg($('siteClass-seg'), 'siteClass');
    bindSeg($('envelopeChoice-seg'), 'envelopeChoice');

    // Step 3
    bindSeg($('refrigArchitecture-seg'), 'refrigArchitecture');
    bindSeg($('powerBackup-seg'), 'powerBackup');
    bindInput('loadShedHoursPerDay', 'loadShedHoursPerDay', parseFloat);
    if ($('isCAStore')) {
      $('isCAStore').addEventListener('change', () => {
        state.isCAStore = $('isCAStore').checked;
        recompute();
      });
    }

    // Reset overrides
    if ($('reset-overrides')) {
      $('reset-overrides').addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Reset all cost overrides to default Izhar Foster indicative bands?')) {
          clearOverrides();
          recompute();
          alert('Cost defaults restored.');
        }
      });
    }

    // Inline-editable cost cells (set up after first render)
    document.querySelectorAll('[data-edit-path]').forEach(cell => {
      makeCellEditable(cell, cell.dataset.editPath);
    });

    loadStateFromUrl();
    setMode(state.mode || 'quick');
    syncFormToState();
    recompute();
  }

  // Sync DOM controls to state (after URL load)
  function syncFormToState() {
    if ($('city')) $('city').value = state.city;
    if ($('commodity')) $('commodity').value = state.commodity;
    if ($('capacityM3')) $('capacityM3').value = state.capacityM3;
    if ($('setpointPreset')) $('setpointPreset').value = state.setpointPreset;
    if ($('isCAStore')) $('isCAStore').checked = state.isCAStore;
    if ($('loadShedHoursPerDay')) $('loadShedHoursPerDay').value = state.loadShedHoursPerDay;

    // segs
    const segs = [
      ['capacityUnit-seg', state.capacityUnit],
      ['panelMm-seg', String(state.panelMm)],
      ['siteClass-seg', state.siteClass],
      ['envelopeChoice-seg', state.envelopeChoice],
      ['refrigArchitecture-seg', state.refrigArchitecture],
      ['powerBackup-seg', state.powerBackup],
    ];
    segs.forEach(([segId, val]) => {
      const seg = $(segId);
      if (!seg) return;
      seg.querySelectorAll('button').forEach(b => {
        b.setAttribute('aria-pressed', b.dataset.val === val ? 'true' : 'false');
      });
    });
  }

  init();
})();
