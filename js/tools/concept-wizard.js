/* Cold Storage Concept Wizard
   5 questions → structured WhatsApp message → engineer.
   No backend, localStorage persistence, URL-prefill for sector/country.
   GA4 events: wizard_start, wizard_step, wizard_submit, wizard_abandon. */
(function(){
  'use strict';
  var WA = '923215383544';
  var STORAGE_KEY = 'izhar_wizard_v1';
  var TOTAL_STEPS = 5;
  var state = { step: 1, answers: {} };

  function $(id){ return document.getElementById(id); }
  function $$(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // ----- persistence -----
  function save(){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(_){}
  }
  function load(){
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw){
        var s = JSON.parse(raw);
        if (s && s.step >= 1 && s.step <= TOTAL_STEPS) state = s;
      }
    } catch(_){}
  }
  function clear(){
    try { localStorage.removeItem(STORAGE_KEY); } catch(_){}
  }

  // ----- URL prefill -----
  function applyUrlParams(){
    try {
      var p = new URLSearchParams(location.search);
      var sector = p.get('sector');
      var country = p.get('country');
      var city = p.get('city');
      if (sector) state.answers.sector = sector;
      if (country) state.answers.country = country;
      if (city) state.answers.site_detail = city;
    } catch(_){}
  }

  // ----- rendering -----
  function renderProgress(){
    var pct = state.step === 'done' ? 100 : (state.step / TOTAL_STEPS) * 100;
    $('wiz-progress-fill').style.width = pct + '%';
    $$('.wiz-step').forEach(function(s){
      var n = parseInt(s.getAttribute('data-step'), 10);
      s.classList.remove('is-active','is-done');
      if (n < state.step || state.step === 'done') s.classList.add('is-done');
      if (n === state.step) s.classList.add('is-active');
    });
  }
  function renderPanels(){
    $$('.wiz-step-panel').forEach(function(p){
      var key = p.getAttribute('data-step');
      p.classList.toggle('is-active', String(key) === String(state.step));
    });
  }
  function restoreInputs(){
    var a = state.answers;
    if (a.sector){
      var r = document.querySelector('input[name="sector"][value="' + a.sector + '"]');
      if (r) r.checked = true;
    }
    if (a.capacity_tier){
      var c = document.querySelector('input[name="capacity_tier"][value="' + a.capacity_tier + '"]');
      if (c) c.checked = true;
    }
    if (a.capacity_note) $('capacity_note').value = a.capacity_note;
    if (a.country){
      $('country').value = a.country;
      toggleCityFields();
    }
    if (a.pk_city) $('pk_city').value = a.pk_city;
    if (a.ksa_city) $('ksa_city').value = a.ksa_city;
    if (a.site_detail) $('site_detail').value = a.site_detail;
    if (a.timeline){
      var t = document.querySelector('input[name="timeline"][value="' + a.timeline + '"]');
      if (t) t.checked = true;
    }
    ['role','name','company','phone','email'].forEach(function(f){
      if (a[f] && $(f)) $(f).value = a[f];
    });
  }
  function captureInputs(){
    var f = $('wizard');
    var get = function(name){ var el = f.elements[name]; return el && el.value ? String(el.value).trim() : ''; };
    state.answers.sector = (document.querySelector('input[name="sector"]:checked') || {}).value || state.answers.sector || '';
    state.answers.capacity_tier = (document.querySelector('input[name="capacity_tier"]:checked') || {}).value || state.answers.capacity_tier || '';
    state.answers.capacity_note = get('capacity_note');
    state.answers.country = get('country');
    state.answers.pk_city = get('pk_city');
    state.answers.ksa_city = get('ksa_city');
    state.answers.site_detail = get('site_detail');
    state.answers.timeline = (document.querySelector('input[name="timeline"]:checked') || {}).value || state.answers.timeline || '';
    state.answers.role = get('role');
    state.answers.name = get('name');
    state.answers.company = get('company');
    state.answers.phone = get('phone');
    state.answers.email = get('email');
    save();
  }

  // ----- step navigation -----
  function go(toStep){
    captureInputs();
    if (toStep === 'done' || toStep <= TOTAL_STEPS){
      state.step = toStep;
      save();
      renderProgress();
      renderPanels();
      window.scrollTo({ top: $('wizard').offsetTop - 100, behavior: 'smooth' });
      track('wizard_step', { step: toStep, sector: state.answers.sector });
    }
  }

  // ----- validation (light — only phone is hard-required on step 5) -----
  function validateStep5(){
    var ok = true;
    var nameEl = $('name'), phoneEl = $('phone');
    if (!nameEl.value.trim()){ nameEl.focus(); ok = false; }
    if (ok && !phoneEl.value.trim()){ phoneEl.focus(); ok = false; }
    if (!ok){
      // light feedback
      [nameEl, phoneEl].forEach(function(el){
        if (!el.value.trim()) el.style.borderColor = '#C0392B';
      });
    }
    return ok;
  }

  // ----- country → city toggle -----
  function toggleCityFields(){
    var c = $('country').value;
    $('pk-city-wrap').hidden = c !== 'PK';
    $('ksa-city-wrap').hidden = c !== 'SA';
  }

  // ----- format prettifiers -----
  var sectorLabels = {
    'pharma':'Pharma & vaccines',
    'fresh-produce':'Fresh fruit & vegetables',
    'frozen':'Frozen food / meat / seafood',
    'dairy-beverage':'Dairy & beverage',
    'ca':'Dates / CA storage',
    '3pl':'3PL / multi-temp warehouse',
    'industrial':'Industrial / process',
    'unsure':'Not sure / mixed'
  };
  var capacityLabels = {
    'micro':'Walk-in room (< 50 m³ / < 25 t)',
    'small':'Small cold store (50–500 m³ / 25–250 t)',
    'medium':'Mid-size facility (500–3,000 m³ / 250–1,500 t)',
    'large':'Large warehouse (3,000–10,000 m³ / 1,500–5,000 t)',
    'mega':'Mega facility (10,000+ m³)',
    'unsure':'Not sure yet'
  };
  var timelineLabels = {
    '30d':'Within 30 days — READY TO BUILD',
    '1-3m':'1–3 months',
    '3-6m':'3–6 months',
    '6-12m':'6–12 months',
    'research':'Exploring / researching'
  };
  var countryLabels = {
    'PK':'Pakistan','SA':'Saudi Arabia','AE':'UAE','QA':'Qatar','OM':'Oman','BH':'Bahrain','KW':'Kuwait','OTHER':'Other'
  };

  // ----- submission -----
  function buildMessage(){
    var a = state.answers;
    var loc = countryLabels[a.country] || a.country;
    if (a.country === 'PK' && a.pk_city) loc = a.pk_city + ', Pakistan';
    if (a.country === 'SA' && a.ksa_city) loc = a.ksa_city + ', Saudi Arabia';
    if (a.site_detail) loc += ' (' + a.site_detail + ')';

    var lines = [
      'Hi Izhar Foster — concept wizard brief.',
      '',
      '*Project*',
      '• Sector: ' + (sectorLabels[a.sector] || a.sector || '—'),
      '• Capacity: ' + (capacityLabels[a.capacity_tier] || a.capacity_tier || '—'),
    ];
    if (a.capacity_note) lines.push('• Detail: ' + a.capacity_note);
    lines.push('• Location: ' + loc);
    lines.push('• Timeline: ' + (timelineLabels[a.timeline] || a.timeline || '—'));
    lines.push('');
    lines.push('*Contact*');
    if (a.name) lines.push('• Name: ' + a.name);
    if (a.role) lines.push('• Role: ' + a.role);
    if (a.company) lines.push('• Company: ' + a.company);
    if (a.phone) lines.push('• Phone/WhatsApp: ' + a.phone);
    if (a.email) lines.push('• Email: ' + a.email);
    lines.push('');
    lines.push('Please send back a sized concept design and an indicative budget within 24 hours.');
    lines.push('— Sent via izharfoster.com/tools/concept-wizard');
    return lines.join('\n');
  }

  function submit(){
    if (!validateStep5()) return;
    captureInputs();
    var msg = buildMessage();
    var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
    track('wizard_submit', {
      sector: state.answers.sector,
      capacity_tier: state.answers.capacity_tier,
      country: state.answers.country,
      timeline: state.answers.timeline
    });
    // open WhatsApp
    var w = window.open(url, '_blank', 'noopener');
    if (!w) window.location.href = url;
    // confirmation panel
    state.step = 'done';
    save();
    renderProgress();
    renderPanels();
    window.scrollTo({ top: $('wizard').offsetTop - 100, behavior: 'smooth' });
  }

  // ----- analytics -----
  function track(event, params){
    if (!window.gtag) return;
    try { gtag('event', event, params || {}); } catch(_){}
  }

  // ----- bootstrap -----
  function init(){
    load();
    applyUrlParams();
    save();
    // honour saved step but always rerender chrome
    renderProgress();
    renderPanels();
    restoreInputs();
    toggleCityFields();

    // wire navigation
    $$('[data-action="next"]').forEach(function(b){
      b.addEventListener('click', function(){
        // skip-step validation: at least one option chosen on radio panels (except step 1 where unsure is an option)
        if (state.step === 5){ submit(); return; }
        go(Math.min(TOTAL_STEPS, state.step + 1));
      });
    });
    $$('[data-action="prev"]').forEach(function(b){
      b.addEventListener('click', function(){
        go(Math.max(1, state.step - 1));
      });
    });
    $('country').addEventListener('change', function(){
      toggleCityFields();
      captureInputs();
    });
    // form submit (Enter key on last input)
    $('wizard').addEventListener('submit', function(e){
      e.preventDefault();
      submit();
    });
    // capture on any input change for live persistence
    $('wizard').addEventListener('change', captureInputs);
    $('wizard').addEventListener('input', captureInputs);

    // fire start event once
    if (!sessionStorage.getItem('wizard_start_fired')){
      track('wizard_start', { entry: location.search || '(direct)' });
      try { sessionStorage.setItem('wizard_start_fired', '1'); } catch(_){}
    }

    // abandonment beacon
    window.addEventListener('pagehide', function(){
      if (state.step !== 'done' && state.step > 1){
        track('wizard_abandon', { step: state.step });
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
