/* Izhar Foster — Walk-in builder.
   Deliberately shows NO price: a walk-in is quoted on site conditions, power
   supply and access, and a headline number set against those is misleading.
   The trade for the visitor is engineering data instead — which is the thing
   competitors gate behind a form.

   Constants are the ones already verified elsewhere in this repo (see
   CLAUDE.md "Engineering constants"): PIR lambda 0.022 W/m.K aged per
   BS EN 14509; strip-curtain F 0.10 / air-curtain 0.50 per ASHRAE Ref Ch.24;
   infiltration buoyancy F_m 1.0 cooler -> 1.45 at -25C; on-grade floors sit
   against 18C soil, above-grade floors against ambient air. */
(function () {
  'use strict';

  var LAMBDA = 0.022;          // W/m.K, aged PIR (BS EN 14509)
  var SOIL_C = 18;             // on-grade floor boundary
  var $ = function (id) { return document.getElementById(id); };

  var state = {
    temp: 'chiller', preset: '2.4,3.0',
    w: 2.4, l: 3.0, h: 2.4,
    doorPos: 'front', module: 1.15
  };

  function roomC() { return state.temp === 'chiller' ? 4 : -22; }

  // Buoyancy factor on infiltration — colder rooms pull air harder.
  function buoyancy(t) {
    if (t >= 0) return 1.0;
    if (t >= -10) return 1.20;
    if (t >= -25) return 1.45;
    return 1.55;
  }

  function readForm() {
    state.w = parseFloat($('wib-w').value) || 2.4;
    state.l = parseFloat($('wib-l').value) || 3.0;
    state.h = parseFloat($('wib-h').value) || 2.4;
    state.amb = parseFloat($('wib-city').value) || 45;
    state.panel = parseFloat($('wib-panel').value) || 0.100;
    state.curtain = parseFloat($('wib-curtain').value);
    state.floor = $('wib-floor').value;
    state.door = $('wib-door').value;
    state.ref = $('wib-ref').value;
    state.loc = $('wib-loc').value;
    state.doorPos = $('wib-doorpos') ? $('wib-doorpos').value : state.doorPos;
    state.module = $('wib-module') ? parseFloat($('wib-module').value) || 1.15 : state.module;
  }

  /* Panel schedule. Wall panels are vertical and run full height, so the count
     per wall is the span divided by the module width, rounded up — the last
     panel on each run is cut to suit. This is the number a buyer actually
     needs, and it is why the module width is an input rather than a constant:
     it is confirmed per order, not a fixed Izhar spec. */
  function schedule() {
    var m = state.module;
    var nW = Math.max(1, Math.ceil(state.w / m));
    var nL = Math.max(1, Math.ceil(state.l / m));
    var wallArea = 2 * (state.w + state.l) * state.h;
    var ceilPanels = Math.max(1, Math.ceil(state.w / m));
    return {
      module: m,
      perWidthWall: nW, perLengthWall: nL,
      wallPanels: 2 * nW + 2 * nL,
      ceilPanels: ceilPanels,
      floorPanels: (state.floor === 'insulated') ? ceilPanels : 0,
      wallArea: wallArea,
      ceilArea: state.w * state.l,
      totalArea: wallArea + state.w * state.l + ((state.floor === 'insulated') ? state.w * state.l : 0)
    };
  }

  function compute() {
    var w = state.w, l = state.l, h = state.h;
    var vol = w * l * h;
    var floorA = w * l;
    var wallA = 2 * (w + l) * h;
    var U = LAMBDA / state.panel;                       // W/m2.K

    var tIn = roomC();
    // Outdoor location adds a solar gain allowance on the envelope.
    var ambEff = state.amb + (state.loc === 'outdoor' ? 5 : -3);
    var dT = ambEff - tIn;

    // Transmission: walls + ceiling against ambient; floor per boundary rule.
    var floorDT = (state.floor === 'suspended') ? (ambEff - tIn) : (SOIL_C - tIn);
    var floorU  = (state.floor === 'screed') ? 0.7 : U;   // bare screed U ~ 0.7
    var qWall   = U * (wallA + floorA) * dT;              // walls + ceiling
    var qFloor  = floorU * floorA * Math.max(floorDT, 0);
    var qTrans  = qWall + qFloor;

    // Infiltration: mass-flow form. ACH24 falls with volume (ASHRAE air-change
    // tables); dh is ambient-to-room enthalpy difference; F_m is buoyancy.
    var ach24 = 70 / Math.sqrt(Math.max(vol, 1));         // air changes per 24 h
    var dh = (tIn < 0) ? 95 : 45;                         // kJ/kg at PK summer ambient
    var qInf = ach24 * vol * 1.2 * dh * 1000 / 86400 * buoyancy(tIn) * state.curtain;

    // Internal: lights, fans, and an occupancy allowance.
    var qLight = 6 * floorA;                              // W
    var qFan   = 0.12 * (qTrans + qInf);
    var qPeople = 270 * (floorA > 20 ? 2 : 1) * (2 / 24);

    var subtotal = qTrans + qInf + qLight + qFan + qPeople;
    var total = subtotal * 1.10;                          // 10% safety

    // Compressor duty at 18 h/day running time.
    var comp = total * 24 / 18;

    // Annual energy: duty over run hours at a temperature-appropriate COP,
    // derated for ambient (condensers lose capacity as it gets hotter).
    var cop = (tIn < 0) ? 1.5 : 2.6;
    var derate = Math.max(0.6, 1 - ((tIn < 0 ? 0.027 : 0.020) * Math.max(state.amb - 32, 0)));
    var kwh = (total / 1000) * 18 * 365 / (cop * derate);

    return { vol: vol, floorA: floorA, U: U, total: total, comp: comp, kwh: kwh,
             qTrans: qTrans, qInf: qInf, qInt: qLight + qFan + qPeople, dT: dT };
  }

  function fmt(n, d) { return n.toLocaleString('en-PK', { maximumFractionDigits: d === undefined ? 0 : d }); }
  function m2ft(m) { return (m * 3.28084).toFixed(1); }

  function render() {
    readForm();
    var r = compute();

    $('wib-load').textContent = fmt(r.total / 1000, 2) + ' kW';
    $('wib-vol').textContent = fmt(r.vol, 1) + ' m³';
    $('wib-area').textContent = fmt(r.floorA, 1) + ' m² floor · ' +
      m2ft(state.w) + ' × ' + m2ft(state.l) + ' × ' + m2ft(state.h) + ' ft';
    $('wib-comp').textContent = fmt(r.comp / 1000, 2) + ' kW';
    $('wib-kwh').textContent = fmt(r.kwh) + ' kWh/yr';
    $('wib-u').textContent = r.U.toFixed(3) + ' W/m²K · ' + (state.panel * 1000) + ' mm';
    $('wib-dims-ft').textContent = m2ft(state.w) + ' × ' + m2ft(state.l) + ' × ' + m2ft(state.h) + ' ft internal';

    var pc = function (v) { return Math.round(v / (r.qTrans + r.qInf + r.qInt) * 100); };
    $('wib-split').textContent =
      'Transmission ' + fmt(r.qTrans) + ' W (' + pc(r.qTrans) + '%) · ' +
      'Infiltration ' + fmt(r.qInf) + ' W (' + pc(r.qInf) + '%) · ' +
      'Internal ' + fmt(r.qInt) + ' W (' + pc(r.qInt) + '%)';

    $('wib-floor-hint').textContent = state.floor === 'suspended'
      ? 'Above grade: the floor sees ambient air, not 18 °C soil — it becomes a real load. Insulate.'
      : (state.floor === 'screed'
         ? 'Screed on grade: ground settles near 18 °C and acts as a sink. Acceptable for chiller duty; not for a freezer.'
         : 'Insulated floor on grade, against an 18 °C soil boundary.');

    renderSchedule();
    push3D();

    var spec = specText(r);
    $('wib-spec').textContent = 'Spec: ' + spec.short;
    var wa = (window.Izhar && Izhar.whatsappUrl)
      ? Izhar.whatsappUrl(spec.full)
      : 'https://wa.me/' + ((window.IzharWA && IzharWA.number()) || '923215383544') +
        '?text=' + encodeURIComponent(spec.full);
    /* Both copies: the aside one for desktop, the in-form one for mobile,
       where the aside is hidden outright. */
    ['wib-wa', 'wib-wa-m'].forEach(function (id) {
      if ($(id)) $(id).setAttribute('href', wa);
    });
    if (window.Izhar && Izhar.writeState) Izhar.writeState({ tool: 'walkin-builder', state: state, result: r });
  }

  /* Hand the current configuration to the 3D viewer. Kept to one call site so
     the geometry can never drift from the numbers in the result panel. */
  function push3D() {
    if (!window.IzharRoom3D) return;
    IzharRoom3D.update({
      w: state.w, l: state.l, h: state.h,
      panel: state.panel, module: state.module,
      doorPos: state.doorPos, doorType: state.door,
      temp: state.temp, loc: state.loc, ref: state.ref, floor: state.floor
    });
  }

  function renderSchedule() {
    var body = $('wib-sched-body');
    if (!body) return;
    var s = schedule();
    var mm = Math.round(state.module * 1000);
    var rows = [
      ['Wall panels — ' + state.w + ' m walls (×2)', s.perWidthWall + ' × ' + mm + ' mm', s.perWidthWall * 2],
      ['Wall panels — ' + state.l + ' m walls (×2)', s.perLengthWall + ' × ' + mm + ' mm', s.perLengthWall * 2],
      ['Ceiling panels', s.ceilPanels + ' × ' + mm + ' mm', s.ceilPanels],
      ['Floor panels', s.floorPanels ? (s.floorPanels + ' × ' + mm + ' mm') : 'none — slab/screed', s.floorPanels]
    ];
    body.innerHTML = rows.map(function (r) {
      return '<tr><th scope="row">' + r[0] + '</th><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>';
    }).join('') +
      '<tr><th scope="row"><strong>Total panel area</strong></th><td>envelope</td><td><strong>' +
      fmt(s.totalArea, 1) + ' m²</strong></td></tr>';

    var note = $('wib-sched-note');
    if (note) {
      note.textContent = 'Counts assume ' + mm + ' mm module width with the last panel on each ' +
        'run cut to suit. Module width is confirmed per order — change it above to match your quote.';
    }
  }

  function specText(r) {
    var t = state.temp === 'chiller' ? 'Chiller +2/+5 °C'
          : state.temp === 'freezer' ? 'Freezer −18/−25 °C' : 'Dual-zone';
    var short = t + ' · ' + state.w + '×' + state.l + '×' + state.h + ' m · ' +
                (state.panel * 1000) + ' mm PIR · ' + fmt(r.total / 1000, 2) + ' kW';
    var full = 'Hi Izhar Foster — walk-in builder spec.\n\n' +
      'Type: ' + t + '\n' +
      'Internal: ' + state.w + ' × ' + state.l + ' × ' + state.h + ' m (' + fmt(r.vol, 1) + ' m³)\n' +
      'Panel: ' + (state.panel * 1000) + ' mm PIR, U ' + r.U.toFixed(3) + ' W/m²K\n' +
      'Door: ' + state.door + ' · protection ' + (state.curtain === 1 ? 'none' : state.curtain === 0.5 ? 'air curtain' : 'strip curtain') + '\n' +
      'Floor: ' + state.floor + '\n' +
      'Refrigeration: ' + state.ref + ' · ' + state.loc + '\n' +
      'Design ambient: ' + state.amb + ' °C\n' +
      'Heat load: ' + fmt(r.total / 1000, 2) + ' kW · compressor ' + fmt(r.comp / 1000, 2) + ' kW\n' +
      'Estimated energy: ' + fmt(r.kwh) + ' kWh/yr\n\n' +
      '— Sent via izharfoster.com/tools/walkin-builder';
    return { short: short, full: full };
  }

  /* Four panes, one visible at a time. Keeping the form short is the point:
     the model stays on screen, so the controls have to fit beside it rather
     than run past it. */
  function wireTabs() {
    var tabs = [].slice.call(document.querySelectorAll('[data-wib-tab]'));
    var panes = [].slice.call(document.querySelectorAll('[data-wib-pane]'));
    if (!tabs.length) return;
    var body = document.querySelector('.wib-body');
    var prev = document.querySelector('[data-wib-nav="prev"]');
    var next = document.querySelector('[data-wib-nav="next"]');
    var at = 0;

    function show(i) {
      at = Math.max(0, Math.min(tabs.length - 1, i));
      tabs.forEach(function (t, n) { t.setAttribute('aria-selected', String(n === at)); });
      panes.forEach(function (p, n) { p.hidden = (n !== at); p.classList.toggle('is-active', n === at); });
      if (prev) prev.disabled = (at === 0);
      if (next) {
        next.disabled = (at === tabs.length - 1);
        next.textContent = (at === tabs.length - 2) ? 'See result' : 'Next';
      }
      if (body) body.scrollTop = 0;
    }

    tabs.forEach(function (t) {
      t.addEventListener('click', function () { show(+t.dataset.wibTab); });
    });
    if (prev) prev.addEventListener('click', function () { show(at - 1); });
    if (next) next.addEventListener('click', function () { show(at + 1); });

    /* Left/right arrows move between steps when a tab has focus. */
    document.querySelector('.wib-tabs').addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      var i = at + (e.key === 'ArrowRight' ? 1 : -1);
      show(i);
      if (tabs[at]) tabs[at].focus();
    });

    show(0);
  }

  function wireTiles(gid, onPick) {
    var box = $(gid);
    if (!box) return;
    box.addEventListener('click', function (e) {
      var tile = e.target.closest('.calc-radio-tile');
      if (!tile) return;
      [].forEach.call(box.querySelectorAll('.calc-radio-tile'), function (t) { t.classList.remove('is-active'); });
      tile.classList.add('is-active');
      onPick(tile.getAttribute('data-v'));
      render();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    wireTiles('wib-temp', function (v) {
      state.temp = v;
      // Nudge panel thickness to something sane for the duty.
      $('wib-panel').value = (v === 'chiller') ? '0.080' : '0.100';
    });
    wireTiles('wib-preset', function (v) {
      if (v === 'custom') return;
      var p = v.split(',');
      $('wib-w').value = p[0];
      $('wib-l').value = p[1];
    });
    ['wib-w','wib-l','wib-h','wib-city','wib-panel','wib-curtain','wib-floor','wib-door',
     'wib-ref','wib-loc','wib-doorpos','wib-module']
      .forEach(function (id) {
        var el = $(id);
        if (el) el.addEventListener('input', render);
      });

    wireTabs();

    /* Mount the 3D viewer before the first render so push3D() has something to
       talk to. It degrades to a static note if the browser cannot do preserve-3d. */
    var viz = document.getElementById('wib-3d');
    if (viz && window.IzharRoom3D) {
      try { IzharRoom3D.mount(viz); }
      catch (e) { if (window.console) console.warn('[walkin-builder] 3D unavailable:', e); }
    }

    render();   // paint before anything optional can fail

    if (window.Izhar && Izhar.wireToolChrome) {
      try {
        Izhar.wireToolChrome({
          toolId: 'walkin-builder',
          toolName: 'Walk-in Builder',
          title: 'Build your own walk-in',
          subtitle: 'Configured spec sheet — no pricing',
          /* generatePDF() in _shared.js consumes { sections, math, sources }.
             The previous shape here ({ title, subtitle, rows, note }) was
             silently dropped, so Print PDF produced an empty report and the
             methodology panel never injected — it bails when sources is empty. */
          buildPDF: function () {
            var r = compute();
            var s = schedule();
            var protection = state.curtain === 1 ? 'none'
                           : state.curtain === 0.5 ? 'air curtain' : 'strip curtain';
            return {
              projectName: specText(r).short,
              sections: [
                { title: 'Configuration', kv: [
                  ['Type', state.temp === 'chiller' ? 'Chiller +2/+5 °C' : state.temp === 'freezer' ? 'Freezer −18/−25 °C' : 'Dual-zone'],
                  ['Internal dimensions', state.w + ' × ' + state.l + ' × ' + state.h + ' m'],
                  ['Internal volume', fmt(r.vol, 1) + ' m³'],
                  ['Floor area', fmt(r.floorA, 1) + ' m²'],
                  ['Panel', (state.panel * 1000) + ' mm FireSafe PIR · U ' + r.U.toFixed(3) + ' W/m²K · λ 0.022 W/m·K'],
                  ['Door', state.door + ' on the ' + state.doorPos + ' wall · protection: ' + protection],
                  ['Floor build-up', state.floor],
                  ['Refrigeration', state.ref + ' · ' + state.loc],
                  ['Design ambient', state.amb + ' °C']
                ]},
                { title: 'Panel schedule (indicative)', kv: [
                  ['Module width assumed', Math.round(state.module * 1000) + ' mm'],
                  ['Wall panels', s.wallPanels + ' (' + s.perWidthWall + ' per ' + state.w + ' m wall, ' + s.perLengthWall + ' per ' + state.l + ' m wall)'],
                  ['Ceiling panels', String(s.ceilPanels)],
                  ['Floor panels', s.floorPanels ? String(s.floorPanels) : 'none — slab / screed'],
                  ['Total panel area', fmt(s.totalArea, 1) + ' m²']
                ]},
                { title: 'Heat load', kv: [
                  ['Transmission', fmt(r.qTrans) + ' W'],
                  ['Infiltration', fmt(r.qInf) + ' W'],
                  ['Internal (lights, fans, people)', fmt(r.qInt) + ' W'],
                  ['Total refrigeration duty', fmt(r.total / 1000, 2) + ' kW'],
                  ['Compressor duty at 18 h/day', fmt(r.comp / 1000, 2) + ' kW'],
                  ['Estimated annual energy', fmt(r.kwh) + ' kWh/yr']
                ]},
                { title: 'Scope note', html:
                  '<p>This is the <strong>holding</strong> load — envelope, infiltration and internal gains. ' +
                  'It does <strong>not</strong> include product pull-down, which dominates if warm product is ' +
                  'loaded daily. For the full ASHRAE Chapter 24 five-component calculation including pull-down, ' +
                  'use the cold room heat load calculator at izharfoster.com/tools/load-calculator.</p>' +
                  '<p>No price is quoted here on purpose: a walk-in is priced on site conditions, power supply ' +
                  'and access, and a headline figure set against those misleads.</p>' }
              ],
              math:
                'U = λ / t = 0.022 / ' + state.panel.toFixed(3) + ' = ' + r.U.toFixed(3) + ' W/m²K\n' +
                'Q_transmission = ' + fmt(r.qTrans) + ' W   (walls + ceiling against ambient; floor per boundary rule)\n' +
                'Q_infiltration = ACH24 · V · ρ · Δh · F_m · F_protection = ' + fmt(r.qInf) + ' W\n' +
                '    F_protection = ' + state.curtain + ' (' + protection + ')\n' +
                'Q_internal = ' + fmt(r.qInt) + ' W   (6 W/m² lighting + 12% fan + occupancy allowance)\n' +
                'Q_total = (ΣQ) × 1.10 safety = ' + fmt(r.total) + ' W = ' + fmt(r.total / 1000, 2) + ' kW\n' +
                'Compressor = Q_total × 24 / 18 = ' + fmt(r.comp / 1000, 2) + ' kW',
              sources: [
                'ASHRAE Handbook — Refrigeration, Chapter 24 (Refrigerated-Facility Load Calculations): transmission, infiltration and internal load method; door-protection F-factors (strip curtain 0.10, air curtain 0.50).',
                'BS EN 14509: factory-made double-skin metal-faced insulating panels — aged thermal conductivity. λ 0.022 W/m·K used throughout.',
                'ASHRAE Handbook — Refrigeration, Chapter 35: condenser capacity and ambient derate (MT 2.0 %/K, LT 2.7 %/K).',
                'Infiltration buoyancy factor F_m by room temperature: 1.0 cooler, 1.20 at −10 °C, 1.45 at −25 °C, 1.55 at or below −30 °C.',
                'Floor boundary: on-grade and insulated-slab floors against an 18 °C soil sink; above-grade/suspended floors against ambient air.'
              ]
            };
          },
          serialize: function () { return state; },
          deserialize: function (o) {
            if (!o) return;
            Object.keys(o).forEach(function (k) { state[k] = o[k]; });
            if ($('wib-w')) { $('wib-w').value = state.w; $('wib-l').value = state.l; $('wib-h').value = state.h; }
            render();
          },
          capacityKwHint: function () { return compute().total / 1000; }
        });
      } catch (e) {
        if (window.console) console.warn('[walkin-builder] tool chrome unavailable:', e);
      }
    }
  });
})();
