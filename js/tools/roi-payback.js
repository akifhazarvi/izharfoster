/* Cold Store ROI & Payback Calculator — Tool 10
   Loads /js/tools/data-roi.json + /js/tools/data-pricing.json + /js/tools/data-cities.json.
   Computes spoilage loss, capex band, payback, 10-yr cash chart. WhatsApp deep-link handoff.
   No frameworks. No backend. ±25% honesty band on outputs. */
(function(){
  'use strict';
  var WA = '923215383544';
  var BAND = 0.20; // capex ±20% per data file uncertainty_band_pct
  var CURRENCY_KEY = 'izhar_roi_currency_v1';
  var CITY_OVERRIDE_KEY = 'izhar_roi_currency_override_v1';

  // ----- state -----
  var state = {
    commodity: null,
    throughputTonnes: 100,
    throughputUnit: 'tonnes',
    pricePkrKg: null,    // canonical price in PKR/kg; UI input may be in display currency
    cityId: 'lahore',
    turnover: 1.0,
    currency: 'PKR',     // active display currency
    userOverrodeCurrency: false, // if true, city changes don't auto-switch
    data: null
  };

  // ----- currency helpers -----
  function curMeta(code){
    var fx = state.data && state.data.roi.fx;
    if (!fx || !fx.rates[code]) return { code: 'PKR', symbol: 'Rs', per_pkr: 1, decimals: 0 };
    return fx.rates[code];
  }
  function pkrToDisplay(pkr){
    return pkr * curMeta(state.currency).per_pkr;
  }
  function displayToPkr(displayVal){
    return displayVal / (curMeta(state.currency).per_pkr || 1);
  }

  // ----- helpers -----
  // PKR formatter — uses Indian Lakh/Cr abbreviation (familiar for PK buyers)
  function fmtPkr(n){
    if (!isFinite(n) || isNaN(n)) return '—';
    n = Math.round(n);
    if (Math.abs(n) >= 1e7) return (n/1e7).toFixed(2).replace(/\.?0+$/,'') + ' Cr';
    if (Math.abs(n) >= 1e5) return (n/1e5).toFixed(2).replace(/\.?0+$/,'') + ' Lakh';
    return n.toLocaleString('en-IN');
  }
  // International formatter — used for SAR/USD/AED/QAR/OMR
  function fmtIntl(n, decimals){
    if (!isFinite(n) || isNaN(n)) return '—';
    var d = decimals || 0;
    var abs = Math.abs(n);
    if (abs >= 1e9) return (n/1e9).toFixed(2).replace(/\.?0+$/,'') + ' B';
    if (abs >= 1e6) return (n/1e6).toFixed(2).replace(/\.?0+$/,'') + ' M';
    if (abs >= 1e3) return (n/1e3).toFixed(d > 0 ? d : (abs < 1e4 ? 1 : 0)).replace(/\.?0+$/,'') + ' K';
    return n.toFixed(d).replace(/\.?0+$/,'');
  }
  // unified formatter — converts PKR amount → display currency → formatted string
  function fmt(pkrAmount){
    if (!isFinite(pkrAmount) || isNaN(pkrAmount)) return '—';
    if (state.currency === 'PKR') return fmtPkr(pkrAmount);
    var meta = curMeta(state.currency);
    return fmtIntl(pkrAmount * meta.per_pkr, meta.decimals);
  }
  function fmtMonths(n){
    if (!isFinite(n) || isNaN(n) || n <= 0) return '∞';
    if (n > 999) return '> 999';
    if (n < 1) return '< 1';
    return Math.round(n).toString();
  }
  function $(id){ return document.getElementById(id); }
  function el(tag, attrs, text){
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  }

  // ----- temp class selector -----
  function tempClassFor(commId){
    // map commodity → opex/capex temp class keys (must match data-roi.json keys)
    var map = {
      'mango':'chilled_above_zero',
      'banana':'chilled_above_zero',
      'tomato':'chilled_above_zero',
      'citrus':'chilled_zero_to_four',
      'dates':'ca_store',
      'potato':'chilled_zero_to_four',
      'onion':'chilled_zero_to_four',
      'dairy':'chilled_zero_to_four',
      'meat-poultry':'frozen_minus_eighteen',
      'seafood':'blast_freezer_minus_thirty',
      'pharma':'pharma_validated',
      'fmcg-frozen':'frozen_minus_eighteen'
    };
    return map[commId] || 'chilled_zero_to_four';
  }
  function tempLabel(cls){
    return ({
      'chilled_above_zero':'+10 to +13°C chilled',
      'chilled_zero_to_four':'0 to +4°C chilled',
      'frozen_minus_eighteen':'−18 to −25°C frozen',
      'blast_freezer_minus_thirty':'−30 to −40°C blast',
      'ca_store':'CA store (+0.5°C, controlled O₂/CO₂)',
      'pharma_validated':'+2 to +8°C pharma-validated'
    })[cls] || '—';
  }
  function classLabel(cls){
    return ({
      'chilled_above_zero':'Chilled',
      'chilled_zero_to_four':'Chilled',
      'frozen_minus_eighteen':'Frozen',
      'blast_freezer_minus_thirty':'Blast freezer',
      'ca_store':'CA store',
      'pharma_validated':'Pharma'
    })[cls] || '—';
  }

  // ----- math -----
  function compute(){
    var d = state.data;
    if (!d || !state.commodity) return null;
    var comm = d.roi.commodities.find(function(c){ return c.id === state.commodity; });
    if (!comm) return null;

    // throughput → tonnes/month
    var tonnesMonth = state.throughputUnit === 'tonnes' ? state.throughputTonnes : (state.throughputTonnes / comm.m3_per_tonne);

    // selling price (use user value, else default)
    var price = state.pricePkrKg != null ? state.pricePkrKg : comm.default_price_pkr_per_kg;

    // 1. LOSS YOU ARE ABSORBING NOW
    var diffPct = Math.max(0, (comm.spoilage_no_chain_pct - comm.spoilage_with_chain_pct) / 100);
    var lossMonthlyPkr = tonnesMonth * 1000 * diffPct * price; // kg × PKR/kg
    var lossAnnualPkr = lossMonthlyPkr * 12;
    var lossPctOfThroughput = diffPct * 100; // simple %, no recursion

    // 2. CAPEX BAND
    var tempClass = tempClassFor(state.commodity);
    var requiredCapacityTonnes = tonnesMonth * state.turnover; // average held
    var volumeM3 = requiredCapacityTonnes * comm.m3_per_tonne;
    // safety floor — no store smaller than 25 m³ makes sense
    volumeM3 = Math.max(25, volumeM3);
    var capexPerM3 = d.roi.capex_pkr_per_m3[tempClass];
    var capexMid = volumeM3 * capexPerM3;
    var capexLow = capexMid * (1 - BAND);
    var capexHigh = capexMid * (1 + BAND);

    // 3. OPEX
    var kwhPerM3Year = d.roi.opex_kwh_per_m3_per_year[tempClass];
    var tariff = d.roi.cities_tariff[state.cityId] || d.roi.cities_tariff.lahore;
    var elecAnnual = volumeM3 * kwhPerM3Year * tariff;
    var extrasPct = (state.commodity === 'pharma') ? d.roi.opex_extras_pct_of_capex.pharma : d.roi.opex_extras_pct_of_capex.default;
    var nonElecAnnual = capexMid * extrasPct;
    var opexMonthly = (elecAnnual + nonElecAnnual) / 12;
    var netMonthly = lossMonthlyPkr - opexMonthly;

    // 4. PAYBACK
    var paybackMonths = (netMonthly > 0) ? (capexMid / netMonthly) : Infinity;

    // 5. 10-YEAR CASH (non-discounted, simple)
    var months = [];
    var cumulative = -capexMid;
    for (var m = 0; m <= 120; m++){
      months.push({ m: m, cash: cumulative });
      cumulative += netMonthly;
    }

    return {
      comm: comm,
      tempClass: tempClass,
      tonnesMonth: tonnesMonth,
      volumeM3: volumeM3,
      lossMonthly: lossMonthlyPkr,
      lossAnnual: lossAnnualPkr,
      lossPct: lossPctOfThroughput,
      capexMid: capexMid, capexLow: capexLow, capexHigh: capexHigh,
      opexMonthly: opexMonthly,
      netMonthly: netMonthly,
      paybackMonths: paybackMonths,
      months: months,
      tariff: tariff,
      price: price
    };
  }

  // ----- render -----
  function render(){
    var r = compute();
    if (!r) return;

    $('loss-monthly').textContent = fmt(r.lossMonthly);
    $('loss-annual').textContent = fmt(r.lossAnnual) + ' PKR';
    $('loss-pct').textContent = r.lossPct.toFixed(1) + '%';

    $('capex-low').textContent = fmt(r.capexLow);
    $('capex-high').textContent = fmt(r.capexHigh);
    $('store-volume').textContent = Math.round(r.volumeM3).toLocaleString('en-IN');
    $('store-temp').textContent = tempLabel(r.tempClass);
    $('store-class').textContent = classLabel(r.tempClass) + ' class';

    $('payback-months').textContent = fmtMonths(r.paybackMonths);
    $('opex-monthly').textContent = fmt(r.opexMonthly);
    $('net-monthly').textContent = fmt(r.netMonthly);

    drawChart(r);
    updateWhatsApp(r);
  }

  function drawChart(r){
    var svg = $('roi-chart');
    if (!svg) return;
    // clear
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var W = 480, H = 220, PAD_L = 50, PAD_R = 12, PAD_T = 12, PAD_B = 30;
    var innerW = W - PAD_L - PAD_R, innerH = H - PAD_T - PAD_B;

    var maxCash = Math.max.apply(null, r.months.map(function(p){return p.cash;}));
    var minCash = Math.min.apply(null, r.months.map(function(p){return p.cash;}));
    if (maxCash === minCash){ maxCash = 1; minCash = -1; }
    var range = maxCash - minCash || 1;

    function xFor(m){ return PAD_L + (m / 120) * innerW; }
    function yFor(c){ return PAD_T + innerH - ((c - minCash) / range) * innerH; }

    // axes / grid
    var gAxis = el('g');
    // x-axis ticks every 12 months
    for (var yr = 0; yr <= 10; yr++){
      var xx = xFor(yr * 12);
      var tk = el('line', { x1: xx, y1: PAD_T, x2: xx, y2: H - PAD_B, stroke: '#EEE', 'stroke-width': '1' });
      gAxis.appendChild(tk);
      if (yr % 2 === 0){
        var lbl = el('text', { x: xx, y: H - 10, 'text-anchor': 'middle', 'font-size': '10', 'font-family': "var(--font-mono,'JetBrains Mono',ui-monospace,monospace)", fill: '#6E6F73' }, 'Yr ' + yr);
        gAxis.appendChild(lbl);
      }
    }
    // zero line
    if (minCash < 0 && maxCash > 0){
      var zy = yFor(0);
      gAxis.appendChild(el('line', { x1: PAD_L, y1: zy, x2: W - PAD_R, y2: zy, stroke: '#B0B0B0', 'stroke-dasharray': '3 3', 'stroke-width': '1' }));
      gAxis.appendChild(el('text', { x: PAD_L - 6, y: zy + 4, 'text-anchor': 'end', 'font-size': '10', 'font-family': "var(--font-mono,'JetBrains Mono',ui-monospace,monospace)", fill: '#6E6F73' }, '0'));
    }
    // y labels (just min/max)
    gAxis.appendChild(el('text', { x: PAD_L - 6, y: PAD_T + 8, 'text-anchor': 'end', 'font-size': '10', 'font-family': "var(--font-mono,'JetBrains Mono',ui-monospace,monospace)", fill: '#6E6F73' }, fmt(maxCash)));
    gAxis.appendChild(el('text', { x: PAD_L - 6, y: H - PAD_B - 2, 'text-anchor': 'end', 'font-size': '10', 'font-family': "var(--font-mono,'JetBrains Mono',ui-monospace,monospace)", fill: '#6E6F73' }, fmt(minCash)));
    svg.appendChild(gAxis);

    // area fill
    var pathPos = 'M' + xFor(0) + ',' + yFor(Math.max(0, minCash));
    var pathNeg = '';
    r.months.forEach(function(p, i){
      pathPos += ' L' + xFor(p.m) + ',' + yFor(p.cash);
    });
    pathPos += ' L' + xFor(120) + ',' + yFor(Math.max(0, minCash)) + ' Z';

    // line
    var line = el('path', { d: 'M' + r.months.map(function(p){return xFor(p.m) + ',' + yFor(p.cash);}).join(' L'), fill: 'none', stroke: '#E36A1E', 'stroke-width': '2.5' });

    // area
    var area = el('path', { d: pathPos, fill: 'rgba(227,106,30,.12)' });

    svg.appendChild(area);
    svg.appendChild(line);

    // payback marker
    if (isFinite(r.paybackMonths) && r.paybackMonths <= 120){
      var px = xFor(r.paybackMonths);
      var marker = el('g');
      marker.appendChild(el('line', { x1: px, y1: PAD_T, x2: px, y2: H - PAD_B, stroke: '#0A1F3D', 'stroke-width': '1.5', 'stroke-dasharray': '4 3' }));
      var labelBg = el('rect', { x: px + 4, y: PAD_T + 4, width: '110', height: '24', rx: '4', fill: '#0A1F3D' });
      marker.appendChild(labelBg);
      marker.appendChild(el('text', { x: px + 10, y: PAD_T + 20, 'font-size': '11', 'font-weight': '600', 'font-family': "var(--font-mono,'JetBrains Mono',ui-monospace,monospace)", fill: '#F5F2EC' }, 'Payback: ' + fmtMonths(r.paybackMonths) + ' mo'));
      svg.appendChild(marker);
    }
  }

  function updateWhatsApp(r){
    var a = $('cta-whatsapp');
    if (!a) return;
    var cityName = ($('city').selectedOptions[0] || {}).text || state.cityId;
    var cur = state.currency;
    var meta = curMeta(cur);
    // helper to render an amount with chosen currency + PKR reference in brackets if different
    function ref(pkrAmount){
      var display = cur + ' ' + fmt(pkrAmount);
      if (cur !== 'PKR') display += ' (PKR ' + fmtPkr(pkrAmount) + ')';
      return display;
    }
    // price was entered in display currency; round-trip for clean display
    var priceDisplay = (r.price * meta.per_pkr);
    var priceStr = cur + ' ' + (cur === 'OMR' ? priceDisplay.toFixed(2) : Math.round(priceDisplay).toLocaleString('en-IN')) + '/kg';
    if (cur !== 'PKR') priceStr += ' (PKR ' + Math.round(r.price).toLocaleString('en-IN') + '/kg)';

    var msg =
      'Hi Izhar Foster — ROI calculator result.\n\n' +
      '*Inputs*\n' +
      '• Commodity: ' + r.comm.label + '\n' +
      '• Throughput: ' + Math.round(r.tonnesMonth).toLocaleString('en-IN') + ' tonnes/month\n' +
      '• Selling price: ' + priceStr + '\n' +
      '• City: ' + cityName + '\n' +
      '• Currency: ' + cur + (cur !== 'PKR' ? ' (rates as of ' + state.data.roi.fx.rates_as_of + ')' : '') + '\n\n' +
      '*Result*\n' +
      '• Spoilage loss now: ' + ref(r.lossMonthly) + ' / month  (≈ ' + ref(r.lossAnnual) + '/yr)\n' +
      '• Required store: ' + Math.round(r.volumeM3).toLocaleString('en-IN') + ' m³  (' + classLabel(r.tempClass) + ')\n' +
      '• Capex band: ' + ref(r.capexLow) + ' – ' + ref(r.capexHigh) + '\n' +
      '• Opex: ' + ref(r.opexMonthly) + '/month\n' +
      '• Payback: ' + fmtMonths(r.paybackMonths) + ' months\n\n' +
      'Please send back a sized concept and a precise quote.\n— Sent via izharfoster.com/tools/roi-payback';
    a.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);

    // GA4 event when CTA is rendered ready (cheap impression-marker)
    if (window.gtag){
      // do not spam — only when clicked
      a.onclick = function(){
        try { gtag('event', 'roi_whatsapp_click', { commodity: r.comm.id, city: state.cityId, payback_months: isFinite(r.paybackMonths) ? Math.round(r.paybackMonths) : -1 }); } catch(_){}
      };
    }
  }

  // ----- bootstrap -----
  function populateCommoditySelect(){
    var sel = $('commodity');
    state.data.roi.commodities.forEach(function(c){
      var o = document.createElement('option');
      o.value = c.id;
      o.textContent = c.label;
      sel.appendChild(o);
    });
    sel.value = state.commodity = state.commodity || state.data.roi.commodities[0].id;
    var c = state.data.roi.commodities.find(function(x){return x.id===sel.value;});
    $('commodity-help').textContent = c ? ('Pakistan default: ~' + c.spoilage_no_chain_pct + '% loss without cold chain → ~' + c.spoilage_with_chain_pct + '% with. Temperature band: ' + c.temp_band + '.') : '';
    if (state.pricePkrKg == null && c) {
      state.pricePkrKg = c.default_price_pkr_per_kg;
      // display in active currency
      var meta = curMeta(state.currency);
      var displayPrice = state.pricePkrKg * meta.per_pkr;
      var rounded = state.currency === 'OMR' ? Math.round(displayPrice * 100) / 100 : Math.round(displayPrice * 10) / 10;
      $('price').value = rounded;
    }
  }
  function populateCitySelect(){
    var sel = $('city');
    Object.keys(state.data.roi.cities_tariff).forEach(function(k){
      if (k.startsWith('$')) return;
      var o = document.createElement('option');
      o.value = k;
      o.textContent = k.replace('saudi_','Saudi ').replace('uae_','UAE ').replace(/^./, function(s){return s.toUpperCase();}).replace(/_/g,' ');
      // prettify
      var nameMap = { 'lahore':'Lahore', 'karachi':'Karachi', 'islamabad':'Islamabad', 'faisalabad':'Faisalabad', 'multan':'Multan', 'rawalpindi':'Rawalpindi', 'gujranwala':'Gujranwala', 'sialkot':'Sialkot', 'hyderabad':'Hyderabad', 'sukkur':'Sukkur', 'peshawar':'Peshawar', 'quetta':'Quetta', 'gwadar':'Gwadar', 'jacobabad':'Jacobabad', 'saudi_riyadh':'Riyadh (Saudi Arabia)', 'saudi_jeddah':'Jeddah (Saudi Arabia)', 'saudi_dammam':'Dammam (Saudi Arabia)', 'uae_dubai':'Dubai (UAE)' };
      if (nameMap[k]) o.textContent = nameMap[k];
      sel.appendChild(o);
    });
    sel.value = state.cityId;
  }
  function wireInputs(){
    $('commodity').addEventListener('change', function(e){
      state.commodity = e.target.value;
      var c = state.data.roi.commodities.find(function(x){return x.id===e.target.value;});
      $('commodity-help').textContent = c ? ('Pakistan default: ~' + c.spoilage_no_chain_pct + '% loss without cold chain → ~' + c.spoilage_with_chain_pct + '% with. Temperature band: ' + c.temp_band + '.') : '';
      // reset price to default — display in active currency
      state.pricePkrKg = c ? c.default_price_pkr_per_kg : 100;
      var meta = curMeta(state.currency);
      var displayPrice = state.pricePkrKg * meta.per_pkr;
      var rounded = state.currency === 'OMR' ? Math.round(displayPrice * 100) / 100 : Math.round(displayPrice * 10) / 10;
      $('price').value = rounded;
      render();
    });
    $('throughput').addEventListener('input', function(e){
      var v = parseFloat(e.target.value);
      state.throughputTonnes = isNaN(v) ? 0 : v;
      render();
    });
    $('price').addEventListener('input', function(e){
      var v = parseFloat(e.target.value);
      // user-entered price is in the display currency — convert to canonical PKR
      state.pricePkrKg = isNaN(v) ? 0 : displayToPkr(v);
      render();
    });
    $('city').addEventListener('change', function(e){
      state.cityId = e.target.value;
      // auto-switch display currency if the user hasn't manually overridden
      if (!state.userOverrodeCurrency){
        var fx = state.data.roi.fx;
        var country = fx.city_to_country[e.target.value];
        var preferred = fx.default_currency_by_country[country] || 'PKR';
        if (preferred !== state.currency){
          state.currency = preferred;
          saveCurrencyState();
          applyCurrencyUI();
        }
      }
      render();
    });
    $('turnover').addEventListener('change', function(e){
      state.turnover = parseFloat(e.target.value) || 1.0;
      render();
    });
    // unit toggle
    document.querySelectorAll('.roi-unit-toggle button').forEach(function(b){
      b.addEventListener('click', function(){
        document.querySelectorAll('.roi-unit-toggle button').forEach(function(x){ x.classList.remove('is-active'); });
        b.classList.add('is-active');
        state.throughputUnit = b.getAttribute('data-unit');
        render();
      });
    });
    // currency tabs
    document.querySelectorAll('#roi-currency-tabs button').forEach(function(b){
      b.addEventListener('click', function(){
        var code = b.getAttribute('data-currency');
        if (code === state.currency) return;
        state.currency = code;
        state.userOverrodeCurrency = true;
        saveCurrencyState();
        applyCurrencyUI();
        render();
      });
    });
  }

  // ----- currency UI + persistence -----
  function saveCurrencyState(){
    try {
      localStorage.setItem(CURRENCY_KEY, state.currency);
      localStorage.setItem(CITY_OVERRIDE_KEY, state.userOverrodeCurrency ? '1' : '');
    } catch(_){}
  }
  function loadCurrencyState(){
    try {
      var c = localStorage.getItem(CURRENCY_KEY);
      if (c && state.data.roi.fx.rates[c]) state.currency = c;
      state.userOverrodeCurrency = !!localStorage.getItem(CITY_OVERRIDE_KEY);
    } catch(_){}
  }
  function applyCurrencyUI(){
    // active tab
    document.querySelectorAll('#roi-currency-tabs button').forEach(function(b){
      b.classList.toggle('is-active', b.getAttribute('data-currency') === state.currency);
    });
    // price-field label
    var pl = $('price-currency-label');
    if (pl) pl.textContent = state.currency;
    // result-card currency labels
    document.querySelectorAll('.cur-label').forEach(function(el){
      el.textContent = state.currency;
    });
    // fx as-of date
    var d = $('roi-fx-date');
    if (d && state.data) d.textContent = state.data.roi.fx.rates_as_of;
    var note = $('roi-fx-note');
    if (note && state.data){
      if (state.currency === 'PKR'){
        note.innerHTML = 'Base currency &middot; no FX applied';
      } else {
        var meta = curMeta(state.currency);
        note.innerHTML = 'Rates as of <span id="roi-fx-date">' + state.data.roi.fx.rates_as_of + '</span> &middot; 1 ' + state.currency + ' &asymp; ' + Math.round(1/meta.per_pkr) + ' PKR';
      }
    }
    // update price input value (re-displayed in new currency)
    if (state.pricePkrKg != null){
      var meta = curMeta(state.currency);
      var displayPrice = state.pricePkrKg * meta.per_pkr;
      // round to sensible precision: PKR=integer; SAR/AED/QAR=integer; USD=integer; OMR=2dp
      var rounded = state.currency === 'OMR' ? Math.round(displayPrice * 100) / 100 : Math.round(displayPrice * 10) / 10;
      $('price').value = rounded;
    }
  }

  // ----- URL pre-fill (allows ?commodity=mango&city=karachi&currency=SAR from CTAs) -----
  function applyUrlParams(){
    try {
      var p = new URLSearchParams(location.search);
      if (p.get('commodity')) state.commodity = p.get('commodity');
      if (p.get('city')) state.cityId = p.get('city');
      if (p.get('throughput')) state.throughputTonnes = parseFloat(p.get('throughput')) || state.throughputTonnes;
      if (p.get('currency')){
        var c = p.get('currency').toUpperCase();
        if (state.data && state.data.roi.fx.rates[c]){
          state.currency = c;
          state.userOverrodeCurrency = true;
        }
      }
    } catch(_){}
  }

  function init(){
    fetch('../js/tools/data-roi.json')
      .then(function(r){ return r.json(); })
      .then(function(roiData){
        state.data = { roi: roiData };
        loadCurrencyState();
        applyUrlParams();
        // if no override and city is KSA/GCC, prefer the regional currency
        if (!state.userOverrodeCurrency){
          var country = roiData.fx.city_to_country[state.cityId];
          var preferred = roiData.fx.default_currency_by_country[country];
          if (preferred && roiData.fx.rates[preferred]) state.currency = preferred;
        }
        populateCommoditySelect();
        populateCitySelect();
        applyCurrencyUI();
        wireInputs();
        render();
      })
      .catch(function(err){
        console.error('ROI calculator data load failed', err);
        var inputs = document.querySelector('.roi-inputs');
        if (inputs) inputs.insertAdjacentHTML('afterbegin', '<div style="background:#FFE0E0;padding:12px;border-radius:8px;margin-bottom:16px;color:#8B0000">Data file failed to load — refresh the page, or <a href="../contact">contact us directly</a>.</div>');
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
