// Izhar Foster — minimal, premium-feel JS
(function () {
  'use strict';

  // Tracking is loaded directly via <script src="js/track.js" defer> on every
  // page (see vercel.json + page templates). Do not inject here — the prior
  // fallback double-loaded the script (~12 KB wasted per visit).

  // --- Live chat widget (single FAB → expanding contact panel)
  (function buildLiveChat() {
    if (document.querySelector('.lc-root')) return;
    // Path prefix for the Quote link based on directory depth
    const inSubdir = /\/(services|blog|tools)\//.test(location.pathname);
    const quoteHref = inSubdir ? '../contact.html' : 'contact.html';

    // Replace any legacy .fab-wa first
    const legacy = document.querySelector('.fab-wa');
    if (legacy) legacy.remove();

    const root = document.createElement('div');
    root.className = 'lc-root';
    root.innerHTML = `
      <div class="lc-panel" role="dialog" aria-label="Contact options" aria-hidden="true">
        <div class="lc-head">
          <span class="lc-head-eyebrow">Live · We reply fast</span>
          <h3>How can we help?</h3>
          <p>Engineering reply within 24 hours. Pick the channel that suits you.</p>
        </div>
        <div class="lc-options">
          <a href="https://wa.me/923215383544?text=${encodeURIComponent("Hi Izhar Foster — I'd like to discuss a cold-chain project.\n\n— Sent via izharfoster.com")}" target="_blank" rel="noopener" class="lc-opt lc-opt-wa" data-track-section="live-chat-wa">
            <span class="lc-opt-ico"><svg viewBox="0 0 32 32"><path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.4-.545-.489-1.09-1.07-1.52-1.652-.043-.067-.087-.124-.13-.198l-.13-.198a.602.602 0 0 1-.13-.272c0-.196.39-.35.532-.45a3.038 3.038 0 0 0 .7-.778c.097-.187.13-.418.066-.62-.064-.207-.49-1.235-.665-1.673-.176-.422-.422-.844-.99-.844-.27 0-.539-.063-.81-.063-.43 0-.879.095-1.219.41-.39.358-.81 1.057-.81 2.275 0 1.183.85 2.32 1.55 3.14 1.286 1.7 2.74 3.022 4.55 3.96.628.336 1.301.616 2.014.812.547.142 1.115.236 1.679.247.547 0 1.135-.246 1.5-.66.224-.272.32-.598.32-.953 0-.157-.063-.305-.13-.46-.16-.295-.694-.495-.69-.495z"/><path d="M16.005 2.07C8.351 2.07 2.137 8.276 2.137 15.93c0 2.45.624 4.853 1.808 6.969L2 30l7.272-1.91a13.96 13.96 0 0 0 6.733 1.722c7.654 0 13.868-6.215 13.868-13.882C29.873 8.275 23.659 2.07 16.005 2.07zm0 25.392a11.534 11.534 0 0 1-5.85-1.598l-.42-.252-4.366 1.146 1.166-4.27-.273-.443A11.477 11.477 0 0 1 4.512 15.93c0-6.34 5.156-11.49 11.493-11.49 6.337 0 11.493 5.15 11.493 11.49 0 6.34-5.156 11.532-11.493 11.532z"/></svg></span>
            <div class="lc-opt-body">
              <div class="lc-opt-title">Chat on WhatsApp</div>
              <div class="lc-opt-sub">+92 321 5383544 · fastest reply</div>
            </div>
            <span class="lc-opt-arrow">→</span>
          </a>
          <a href="tel:+924235383543" class="lc-opt lc-opt-call" data-track-section="live-chat-call">
            <span class="lc-opt-ico"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            <div class="lc-opt-body">
              <div class="lc-opt-title">Call us</div>
              <div class="lc-opt-sub">+92 42 3538 3543 · Lahore</div>
            </div>
            <span class="lc-opt-arrow">→</span>
          </a>
          <a href="${quoteHref}" class="lc-opt lc-opt-quote" data-track-section="live-chat-quote">
            <span class="lc-opt-ico"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-linecap="round" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" stroke-linecap="round" stroke-linejoin="round"/><line x1="9" y1="13" x2="15" y2="13" stroke-linecap="round"/><line x1="9" y1="17" x2="15" y2="17" stroke-linecap="round"/></svg></span>
            <div class="lc-opt-body">
              <div class="lc-opt-title">Request a written quote</div>
              <div class="lc-opt-sub">Form · 24-hour engineering reply</div>
            </div>
            <span class="lc-opt-arrow">→</span>
          </a>
          <a href="mailto:info@izharfoster.com" class="lc-opt lc-opt-email" data-track-section="live-chat-email">
            <span class="lc-opt-ico"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke-linecap="round" stroke-linejoin="round"/><polyline points="22,6 12,13 2,6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            <div class="lc-opt-body">
              <div class="lc-opt-title">Email us</div>
              <div class="lc-opt-sub">info@izharfoster.com</div>
            </div>
            <span class="lc-opt-arrow">→</span>
          </a>
        </div>
        <div class="lc-social-row">
          <span class="lc-social-label">Follow us</span>
          <div class="lc-social-icons">
            <a href="https://www.facebook.com/izharfosterofficial" target="_blank" rel="noopener" aria-label="Facebook" class="lc-social lc-social-fb"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94z"/></svg></a>
            <a href="https://www.instagram.com/izharfosterofficial" target="_blank" rel="noopener" aria-label="Instagram" class="lc-social lc-social-ig"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.34 4.14.63a5.86 5.86 0 0 0-2.13 1.38A5.86 5.86 0 0 0 .63 4.14C.34 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.27 2.15.56 2.91.3.78.7 1.45 1.38 2.13a5.86 5.86 0 0 0 2.13 1.38c.76.29 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.27 2.91-.56a5.86 5.86 0 0 0 2.13-1.38 5.86 5.86 0 0 0 1.38-2.13c.29-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.27-2.15-.56-2.91a5.86 5.86 0 0 0-1.38-2.13A5.86 5.86 0 0 0 19.86.63c-.76-.29-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM19.85 5.6a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg></a>
            <a href="https://www.youtube.com/@izharfoster" target="_blank" rel="noopener" aria-label="YouTube" class="lc-social lc-social-yt"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1c.4-1.9.5-3.8.5-5.8a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg></a>
            <a href="https://www.linkedin.com/company/izhar-foster" target="_blank" rel="noopener" aria-label="LinkedIn" class="lc-social lc-social-li"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg></a>
          </div>
        </div>
        <div class="lc-foot">
          <span class="lc-foot-hours">Mon–Sat · 9am–6pm PKT</span>
          <a href="${quoteHref}">All channels →</a>
        </div>
      </div>
      <button class="lc-trigger" type="button" aria-label="Open contact options" aria-expanded="false">
        <span class="lc-trigger-pulse" aria-hidden="true"></span>
        <svg class="lc-trigger-ico chat" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <svg class="lc-trigger-ico close" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">
          <line x1="6" y1="6" x2="18" y2="18"/>
          <line x1="18" y1="6" x2="6" y2="18"/>
        </svg>
      </button>
    `;
    document.body.appendChild(root);

    const backdrop = document.createElement('div');
    backdrop.className = 'lc-backdrop';
    document.body.appendChild(backdrop);

    const trigger = root.querySelector('.lc-trigger');
    const panel = root.querySelector('.lc-panel');
    const setOpen = (open) => {
      root.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.classList.toggle('lc-open', open);
    };
    trigger.addEventListener('click', () => setOpen(!root.classList.contains('is-open')));
    backdrop.addEventListener('click', () => setOpen(false));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && root.classList.contains('is-open')) setOpen(false);
    });
    // Close after a tap on any contact option (so the user sees the panel collapse)
    panel.addEventListener('click', (e) => {
      if (e.target.closest('.lc-opt')) setTimeout(() => setOpen(false), 150);
    });
  })();

  // --- Footer social row (injected on every page that has .site-footer)
  (function wireFooterSocial() {
    const footer = document.querySelector('.site-footer');
    if (!footer || footer.querySelector('.footer-social')) return;
    const bottom = footer.querySelector('.footer-bottom');
    if (!bottom) return;
    const wrap = document.createElement('div');
    wrap.className = 'footer-social';
    wrap.innerHTML =
      '<span class="footer-social-label">Follow us</span>' +
      '<div class="footer-social-icons">' +
      '<a href="https://www.facebook.com/izharfosterofficial" target="_blank" rel="noopener" aria-label="Facebook on Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94z"/></svg></a>' +
      '<a href="https://www.instagram.com/izharfosterofficial" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.34 4.14.63a5.86 5.86 0 0 0-2.13 1.38A5.86 5.86 0 0 0 .63 4.14C.34 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.27 2.15.56 2.91.3.78.7 1.45 1.38 2.13a5.86 5.86 0 0 0 2.13 1.38c.76.29 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.27 2.91-.56a5.86 5.86 0 0 0 2.13-1.38 5.86 5.86 0 0 0 1.38-2.13c.29-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.27-2.15-.56-2.91a5.86 5.86 0 0 0-1.38-2.13A5.86 5.86 0 0 0 19.86.63c-.76-.29-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM19.85 5.6a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg></a>' +
      '<a href="https://www.youtube.com/@izharfoster" target="_blank" rel="noopener" aria-label="YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1c.4-1.9.5-3.8.5-5.8a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg></a>' +
      '<a href="https://www.linkedin.com/company/izhar-foster" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg></a>' +
      '</div>';
    footer.insertBefore(wrap, bottom);
  })();

  // --- Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-center');
  if (toggle && menu) {
    // Inject phone + WhatsApp action block at the bottom of the drawer
    if (!menu.querySelector('.nav-mobile-actions')) {
      const actions = document.createElement('div');
      actions.className = 'nav-mobile-actions';
      actions.innerHTML =
        '<a href="tel:+924235383543" class="call">Call · +92 42 3538 3543</a>' +
        '<a href="https://wa.me/923215383544?text=Hi%20Izhar%20Foster%20%E2%80%94%20sent%20via%20izharfoster.com" target="_blank" rel="noopener" class="wa">WhatsApp our team</a>';
      menu.appendChild(actions);
    }
    // Teleport the drawer to <body> on mobile so it escapes the header's stacking context.
    // On desktop the nav must stay inline inside <header>.
    const anchor = document.createComment('nav-center-anchor');
    menu.parentNode.insertBefore(anchor, menu);
    const mqMobile = window.matchMedia('(max-width: 720px)');
    const syncTeleport = (m) => {
      const matches = m.matches !== undefined ? m.matches : mqMobile.matches;
      if (matches && menu.parentElement !== document.body) {
        document.body.appendChild(menu);
      } else if (!matches && menu.parentElement === document.body) {
        anchor.parentNode.insertBefore(menu, anchor.nextSibling);
      }
    };
    syncTeleport(mqMobile);
    mqMobile.addEventListener('change', syncTeleport);

    let savedScrollY = 0;
    const setOpen = (open) => {
      menu.classList.toggle('open', open);
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      const b = document.body;
      if (open) {
        savedScrollY = window.scrollY;
        b.style.position = 'fixed';
        b.style.top = `-${savedScrollY}px`;
        b.style.left = '0';
        b.style.right = '0';
        b.style.width = '100%';
        b.style.overflow = 'hidden';
      } else {
        b.style.position = '';
        b.style.top = '';
        b.style.left = '';
        b.style.right = '';
        b.style.width = '';
        b.style.overflow = '';
        if (savedScrollY) window.scrollTo(0, savedScrollY);
      }
    };
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
    // Close on link tap (drawer should not linger after navigating)
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });
    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) setOpen(false);
    });
    // Auto-close if viewport grows past mobile breakpoint
    const mq = window.matchMedia('(min-width: 721px)');
    mq.addEventListener('change', (e) => { if (e.matches) setOpen(false); });
  }

  // --- The Temperature Scrubber: signature interaction
  // Click any stop on the spectrum scale → product display swaps.
  // Keyboard arrows step through. Auto-cycles every 6s on first idle minute.
  const stops = document.querySelectorAll('.scrub-scale .stop');
  const display = document.querySelector('.scrub-display');
  if (stops.length && display) {
    const setActive = (idx) => {
      stops.forEach((s, i) => s.classList.toggle('active', i === idx));
      const data = stops[idx].dataset;
      // Update display
      const img = display.querySelector('.scrub-image img');
      const newSrc = data.img;
      if (img.src !== new URL(newSrc, window.location.href).href) {
        img.classList.remove('shown');
        const next = new Image();
        next.onload = () => {
          img.src = newSrc;
          requestAnimationFrame(() => img.classList.add('shown'));
        };
        next.src = newSrc;
      }
      const badge = display.querySelector('.scrub-image .badge');
      badge.innerHTML = `<span class="dot"></span>${data.label}`;
      badge.style.setProperty('--badge-color', data.color);

      display.querySelector('.scrub-info h3').textContent = data.title;
      display.querySelector('.scrub-info p').textContent = data.desc;
      const specs = display.querySelector('.scrub-info .specs');
      specs.innerHTML = `
        <div><div class="k">Range</div><div class="v">${data.range}</div></div>
        <div><div class="k">Best for</div><div class="v">${data.best}</div></div>
        <div><div class="k">Capacity</div><div class="v">${data.cap}</div></div>
      `;
      const link = display.querySelector('.scrub-info .more');
      if (link) link.href = data.href;
      // Update rail pin position
      const pin = document.querySelector('.rail .pin');
      if (pin) {
        const pct = idx / (stops.length - 1);
        pin.style.top = `calc(24px + (100% - 48px) * ${pct})`;
        pin.dataset.active = '1';
      }
    };

    stops.forEach((s, i) => {
      s.addEventListener('click', () => { setActive(i); userInteracted = true; });
    });

    document.addEventListener('keydown', (e) => {
      if (!stops.length) return;
      const cur = [...stops].findIndex(s => s.classList.contains('active'));
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setActive(Math.min(stops.length - 1, cur + 1));
        userInteracted = true;
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setActive(Math.max(0, cur - 1));
        userInteracted = true;
      }
    });

    // Auto-cycle until user touches it
    let userInteracted = false;
    let idx = 0;
    setActive(0);
    const cycle = setInterval(() => {
      if (userInteracted) { clearInterval(cycle); return; }
      idx = (idx + 1) % stops.length;
      setActive(idx);
    }, 4500);
  }

  // --- Impact counter animation (fires once on enter)
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const duration = 1600;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        const value = target * eased;
        el.textContent = decimals > 0
          ? value.toFixed(decimals)
          : Math.floor(value).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => io.observe(c));
  }

  // --- Pin tracker: when scrolling general sections, move the rail pin to a sensible place
  const sections = document.querySelectorAll('[data-temp]');
  const pin = document.querySelector('.rail .pin');
  if (sections.length && pin && 'IntersectionObserver' in window) {
    const tempToPct = (t) => {
      // map -40..+25 to 0..1 on the rail
      const min = -40, max = 25;
      return Math.min(1, Math.max(0, (max - t) / (max - min)));
    };
    const setPin = (t) => {
      const pct = tempToPct(t);
      pin.style.top = `calc(24px + (100% - 48px) * ${pct})`;
      pin.dataset.active = '1';
    };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const t = parseFloat(e.target.dataset.temp);
          if (!Number.isNaN(t)) setPin(t);
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => obs.observe(s));
  }

  // ─────────────────────────────────────────────────────────────────
  // Cinematic facility-video click-to-play (homepage §⑤)
  // ─────────────────────────────────────────────────────────────────
  document.querySelectorAll('.hp-video-frame[data-yt]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.yt;
      if (!id || btn.dataset.playing === '1') return;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
      iframe.title = btn.getAttribute('aria-label') || 'Facility tour';
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.loading = 'lazy';
      btn.appendChild(iframe);
      btn.dataset.playing = '1';
    }, { once: true });
  });
})();
