/* ==========================================================================
   COLD CONSULTANT — lead capture with WhatsApp handoff
   4-step intake, rotating teaser, ember pill launcher.
   ========================================================================== */
(function () {
  'use strict';

  const WHATSAPP = '923215383544'; // +92 321 5383544
  const STORAGE_KEY = 'izf_consultant_v1';

  const TEASERS = [
    'Need −18°C blast freeze?',
    'Specifying a 2,000 m³ chiller?',
    'PIR panel quote in 24 hours.',
    'CA store for produce export?',
    'Talk to an engineer — direct line.',
  ];

  const PRODUCTS = [
    { id: 'pharma',    label: 'Pharma & vaccines',  temp: '+2 to +8°C',  pin: 0.62 },
    { id: 'dairy',     label: 'Dairy',              temp: '+2 to +6°C',  pin: 0.60 },
    { id: 'produce',   label: 'Fruit & vegetables', temp: '0 to +12°C',  pin: 0.55 },
    { id: 'meat',      label: 'Meat & seafood',     temp: '−18 to −25°C',pin: 0.18 },
    { id: 'icecream',  label: 'Ice cream',          temp: '−25 to −30°C',pin: 0.10 },
    { id: 'panels',    label: 'PIR panels only',    temp: 'Any range',   pin: 0.50 },
    { id: 'other',     label: 'Something else',     temp: '—',           pin: 0.50 },
  ];

  const CAPACITY = [
    { id: 'xs', label: 'Under 500 m³' },
    { id: 's',  label: '500 – 2,000 m³' },
    { id: 'm',  label: '2,000 – 5,000 m³' },
    { id: 'l',  label: '5,000 m³ +' },
    { id: 'na', label: 'Not sure yet' },
  ];

  const STAGE = [
    { id: 'explore', label: 'Just exploring' },
    { id: 'spec',    label: 'Specifying now' },
    { id: 'procure', label: 'Ready to procure' },
    { id: 'service', label: 'Operational issue' },
  ];

  const state = {
    step: 0,
    product: null,
    capacity: null,
    stage: null,
    name: '',
    company: '',
    phone: '',
    email: '',
  };

  // ---------- DOM scaffolding ----------
  const root = document.createElement('div');
  root.className = 'cc-root';
  root.innerHTML = `
    <div class="cc-launcher" aria-live="polite">
      <div class="cc-teaser" id="cc-teaser"></div>
      <button class="cc-pill" type="button" aria-haspopup="dialog" aria-controls="cc-panel">
        <span class="cc-pill-num">01</span>
        <span class="cc-pill-label">Talk to an engineer</span>
        <span class="cc-pill-arrow" aria-hidden="true">→</span>
      </button>
    </div>
    <div class="cc-backdrop" hidden></div>
    <aside class="cc-panel" id="cc-panel" role="dialog" aria-modal="true"
           aria-labelledby="cc-title" hidden>
      <header class="cc-panel-head">
        <div class="cc-panel-eyebrow">
          <span class="cc-panel-stepnum" id="cc-stepnum">01 / 04</span>
          <span class="cc-panel-eyebrow-line"></span>
          <span>Cold consultant</span>
        </div>
        <button class="cc-close" type="button" aria-label="Close">×</button>
      </header>
      <div class="cc-progress"><span id="cc-progress-bar"></span></div>
      <div class="cc-body" id="cc-body"></div>
      <footer class="cc-foot">
        <button class="cc-back" type="button" hidden>← Back</button>
        <span class="cc-foot-spacer"></span>
        <span class="cc-foot-meta">No spam. Direct to engineering.</span>
      </footer>
    </aside>
  `;
  document.body.appendChild(root);

  const $ = (sel) => root.querySelector(sel);
  const panel = $('.cc-panel');
  const backdrop = $('.cc-backdrop');
  const launcher = $('.cc-launcher');
  const teaserEl = $('#cc-teaser');
  const body = $('#cc-body');
  const stepNum = $('#cc-stepnum');
  const progressBar = $('#cc-progress-bar');
  const backBtn = $('.cc-back');

  // ---------- Teaser rotation ----------
  let teaserIdx = 0;
  function showTeaser(i) {
    teaserEl.style.opacity = '0';
    setTimeout(() => {
      teaserEl.textContent = TEASERS[i];
      teaserEl.style.opacity = '1';
    }, 240);
  }
  showTeaser(0);
  setInterval(() => {
    teaserIdx = (teaserIdx + 1) % TEASERS.length;
    showTeaser(teaserIdx);
  }, 4000);

  // ---------- Open / close ----------
  function open() {
    panel.hidden = false;
    backdrop.hidden = false;
    requestAnimationFrame(() => {
      panel.classList.add('is-open');
      backdrop.classList.add('is-open');
    });
    document.body.style.overflow = 'hidden';
    render();
  }
  function close() {
    panel.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      panel.hidden = true;
      backdrop.hidden = true;
    }, 280);
  }
  $('.cc-pill').addEventListener('click', open);
  $('.cc-close').addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) close();
  });
  backBtn.addEventListener('click', () => {
    if (state.step > 0) { state.step--; render(); }
  });

  // ---------- Auto-open once per session, after 8s ----------
  try {
    const seen = sessionStorage.getItem(STORAGE_KEY + '_seen');
    if (!seen) {
      setTimeout(() => {
        if (panel.hidden) { open(); }
        sessionStorage.setItem(STORAGE_KEY + '_seen', '1');
      }, 8000);
    }
  } catch (e) { /* sessionStorage blocked — skip */ }

  // ---------- Renderer ----------
  function render() {
    const totalSteps = 5;
    const labels = ['What are you storing?', 'Capacity needed?', 'Project stage?', 'Your details', 'Summary'];
    const stepDisplay = String(Math.min(state.step + 1, 4)).padStart(2, '0');
    stepNum.textContent = `${stepDisplay} / 04`;
    progressBar.style.width = `${((state.step) / 4) * 100}%`;
    backBtn.hidden = state.step === 0 || state.step === 4;

    if (state.step === 0) renderChoice('product', PRODUCTS, labels[0], 'Pick the closest match — we tune the recommendation to your temperature band.');
    else if (state.step === 1) renderChoice('capacity', CAPACITY, labels[1], 'Approximate is fine. We size precisely after a callback.');
    else if (state.step === 2) renderChoice('stage', STAGE, labels[2], 'So we route you to the right engineer, not a sales queue.');
    else if (state.step === 3) renderForm();
    else if (state.step === 4) renderSummary();
  }

  function renderChoice(key, options, title, hint) {
    body.innerHTML = `
      <h2 class="cc-title" id="cc-title">${title}</h2>
      <p class="cc-hint">${hint}</p>
      <div class="cc-grid">
        ${options.map(o => `
          <button class="cc-chip ${state[key] === o.id ? 'is-on' : ''}" data-id="${o.id}">
            <span class="cc-chip-label">${o.label}</span>
            ${o.temp ? `<span class="cc-chip-meta mono">${o.temp}</span>` : ''}
          </button>`).join('')}
      </div>
    `;
    body.querySelectorAll('.cc-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        state[key] = btn.dataset.id;
        state.step++;
        render();
      });
    });
  }

  function renderForm() {
    body.innerHTML = `
      <h2 class="cc-title" id="cc-title">Your details</h2>
      <p class="cc-hint">We reply on WhatsApp within working hours. Phone or email — your pick.</p>
      <form class="cc-form" id="cc-form" novalidate>
        <label class="cc-field">
          <span>Name</span>
          <input name="name" type="text" autocomplete="name" value="${esc(state.name)}" required>
        </label>
        <label class="cc-field">
          <span>Company <em>optional</em></span>
          <input name="company" type="text" autocomplete="organization" value="${esc(state.company)}">
        </label>
        <div class="cc-field-row">
          <label class="cc-field">
            <span>Phone / WhatsApp</span>
            <input name="phone" type="tel" autocomplete="tel" placeholder="+92 ___ _______" value="${esc(state.phone)}">
          </label>
          <label class="cc-field">
            <span>Email</span>
            <input name="email" type="email" autocomplete="email" value="${esc(state.email)}">
          </label>
        </div>
        <p class="cc-validation" id="cc-validation"></p>
        <button class="cc-submit" type="submit">
          <span>Send to engineering</span>
          <span class="cc-submit-arrow" aria-hidden="true">→</span>
        </button>
      </form>
    `;
    const form = body.querySelector('#cc-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      state.name = (fd.get('name') || '').toString().trim();
      state.company = (fd.get('company') || '').toString().trim();
      state.phone = (fd.get('phone') || '').toString().trim();
      state.email = (fd.get('email') || '').toString().trim();
      const v = body.querySelector('#cc-validation');
      if (!state.name) { v.textContent = 'Please add your name.'; return; }
      if (!state.phone && !state.email) { v.textContent = 'We need either a phone or an email to reach you.'; return; }
      state.step++;
      render();
    });
  }

  function renderSummary() {
    const product = PRODUCTS.find(p => p.id === state.product);
    const capacity = CAPACITY.find(c => c.id === state.capacity);
    const stage = STAGE.find(s => s.id === state.stage);
    const msg = buildWhatsAppMessage(product, capacity, stage);
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

    body.innerHTML = `
      <div class="cc-summary-head">
        <span class="cc-eyebrow mono">Brief ready</span>
        <h2 class="cc-title">Thanks, ${esc(state.name.split(' ')[0])}.</h2>
        <p class="cc-hint">Here's what we'll bring to the call. Send it on WhatsApp and an engineer picks it up — usually within an hour, working days.</p>
      </div>
      <div class="cc-summary-card">
        <div class="cc-sum-row">
          <span class="cc-sum-key">Storing</span>
          <span class="cc-sum-val">${esc(product.label)}</span>
        </div>
        <div class="cc-sum-row">
          <span class="cc-sum-key">Temperature</span>
          <span class="cc-sum-val mono">${esc(product.temp)}</span>
        </div>
        <div class="cc-sum-row">
          <span class="cc-sum-key">Capacity</span>
          <span class="cc-sum-val">${esc(capacity.label)}</span>
        </div>
        <div class="cc-sum-row">
          <span class="cc-sum-key">Stage</span>
          <span class="cc-sum-val">${esc(stage.label)}</span>
        </div>
        <div class="cc-sum-row">
          <span class="cc-sum-key">Contact</span>
          <span class="cc-sum-val">${esc(state.phone || state.email)}</span>
        </div>
      </div>
      <a class="cc-whatsapp" href="${url}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
          <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.8-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4 0-.1-.2-.2-.5-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3c-.9-1.4-1.4-3-1.4-4.6 0-4.6 3.7-8.4 8.4-8.4 4.6 0 8.4 3.7 8.4 8.4 0 4.6-3.7 8.5-8.2 8.5z"/>
        </svg>
        Send brief on WhatsApp
      </a>
      <div class="cc-summary-alt">
        Prefer email? Write to
        <a href="mailto:info@izharfoster.com?subject=${encodeURIComponent('Cold consultant brief — ' + state.name)}&body=${encodeURIComponent(msg)}">info@izharfoster.com</a>
        or call <a href="tel:+924235383543" class="mono">+92 42 3538 3543</a>.
      </div>
    `;
    // Fire-and-forget local log
    try {
      const log = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      log.push({ ...state, ts: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
    } catch (e) { /* ignore */ }
  }

  function buildWhatsAppMessage(product, capacity, stage) {
    return [
      `Hi Izhar Foster — cold consultant brief:`,
      ``,
      `• Storing: ${product.label} (${product.temp})`,
      `• Capacity: ${capacity.label}`,
      `• Stage: ${stage.label}`,
      ``,
      `From: ${state.name}${state.company ? ' / ' + state.company : ''}`,
      state.phone ? `Phone: ${state.phone}` : '',
      state.email ? `Email: ${state.email}` : '',
    ].filter(Boolean).join('\n');
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
})();
