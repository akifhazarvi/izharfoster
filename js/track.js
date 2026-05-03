// Izhar Foster — custom lead-funnel events on top of Vercel Web Analytics.
// Vercel auto-injects its own pageview script via the dashboard integration;
// this file only adds custom events: lead intent (WhatsApp / phone / email),
// form submission, and the tool funnel. Mirrors every event to dataLayer
// for GA4 (G-PLY0DZWNEM) too. Pure-vanilla, no build step.
(function () {
  'use strict';

  // Vercel Analytics + Speed Insights are auto-injected by the Vercel build
  // (Web Analytics integration is enabled in the dashboard). We only need the
  // window.va queue stub so custom events queued before the CDN script loads
  // are flushed once it arrives. Do NOT inject the CDN scripts here — that
  // would double-count pageviews.
  if (!window.va) {
    window.va = function () { (window.vaq = window.vaq || []).push(arguments); };
  }
  if (!window.si) {
    window.si = function () { (window.siq = window.siq || []).push(arguments); };
  }

  // ------------------------------------------------------------- track() API
  // Single funnel of named events. Sends to Vercel Analytics (window.va) AND
  // to dataLayer (gtag/GTM-compatible) + a debug log when ?debug_track=1.
  var DEBUG = /[?&]debug_track=1/.test(location.search);
  window.dataLayer = window.dataLayer || [];

  function pageType() {
    var p = location.pathname.replace(/\/$/, '') || '/';
    if (p === '' || p === '/' || /\/index(\.html)?$/.test(p)) return 'home';
    if (/\/contact/.test(p)) return 'contact';
    if (/\/services\//.test(p)) return 'service';
    if (/\/blog(\/|\.html$)/.test(p)) return 'blog';
    if (/\/tools\//.test(p)) return 'tool';
    if (/\/tools(\.html)?$/.test(p)) return 'tools-index';
    if (/\/projects/.test(p)) return 'projects';
    if (/\/clients/.test(p)) return 'clients';
    if (/\/about/.test(p)) return 'about';
    if (/\/faqs/.test(p)) return 'faqs';
    return 'other';
  }

  function track(event, props) {
    var payload = Object.assign({
      page: location.pathname,
      page_type: pageType(),
      ts: Date.now()
    }, props || {});

    // Vercel Analytics custom event.
    try { window.va('event', { name: event, data: payload }); } catch (e) { /* noop */ }

    // GTM dataLayer push (active if a tag manager is ever added).
    try { window.dataLayer.push(Object.assign({ event: event }, payload)); } catch (e) { /* noop */ }

    // GA4 direct event (gtag.js is loaded on every page as G-PLY0DZWNEM).
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', event, payload);
      }
    } catch (e) { /* noop */ }

    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.log('[track]', event, payload);
    }
  }

  window.IzharTrack = { track: track, pageType: pageType };

  // -------------------------------------------------- Auto: lead-intent links
  // Delegated click handler — fires for every WhatsApp / phone / email link.
  // Captures the page section so we know which CTA converted.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var label = (a.textContent || '').trim().slice(0, 80);
    var location_id = a.closest('[data-track-section]') ? a.closest('[data-track-section]').dataset.trackSection
      : a.closest('.lc-root') ? 'live-chat-fab'
      : a.closest('.fab-wa') ? 'fab'
      : a.closest('header') ? 'header'
      : a.closest('footer') ? 'footer'
      : a.closest('form') ? 'form'
      : 'body';

    if (/^https?:\/\/(api\.)?wa\.me\//i.test(href) || /^https?:\/\/(www\.)?whatsapp\.com\//i.test(href)) {
      track('whatsapp_click', { href: href, label: label, location: location_id });
      track('lead_intent', { channel: 'whatsapp', location: location_id });
      return;
    }
    if (/^tel:/i.test(href)) {
      track('phone_click', { href: href, label: label, location: location_id });
      track('lead_intent', { channel: 'phone', location: location_id });
      return;
    }
    if (/^mailto:/i.test(href)) {
      track('email_click', { href: href, label: label, location: location_id });
      track('lead_intent', { channel: 'email', location: location_id });
      return;
    }
    // "Get a quote" / contact CTA — top-of-funnel intent (not a lead yet).
    if (/contact(\.html)?($|[?#])/.test(href) || /(quote|contact|get in touch|talk to|consult)/i.test(label)) {
      track('cta_quote_click', { href: href, label: label, location: location_id });
    }
  }, { capture: true });

  // --------------------------------------------- Auto: contact form milestones
  // form_start (first interaction) → form_submit (validation passed).
  document.addEventListener('focusin', function (e) {
    var f = e.target.closest && e.target.closest('form#quote-form');
    if (!f || f.dataset.trackStarted) return;
    f.dataset.trackStarted = '1';
    track('form_start', { form: 'quote' });
  });

  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || f.id !== 'quote-form') return;
    // Form sends to WhatsApp on success (see contact.html). Fire after
    // checkValidity() would have passed — replicate the gate.
    if (typeof f.checkValidity === 'function' && !f.checkValidity()) {
      track('form_submit_invalid', { form: 'quote' });
      return;
    }
    var data = {};
    try {
      ['industry', 'product', 'location'].forEach(function (n) {
        if (f.elements[n] && f.elements[n].value) data[n] = String(f.elements[n].value).trim();
      });
    } catch (err) { /* noop */ }
    track('form_submit', Object.assign({ form: 'quote' }, data));
    track('lead_submitted', Object.assign({ channel: 'whatsapp_form' }, data));
  }, { capture: true });

  // ------------------------------------------ Auto: tool funnel (calc pages)
  // Tools live under /tools/. Hook the standard Save / Open / Print / Email /
  // Quote / Attach buttons so we know which tool converted.
  function wireToolFunnel() {
    if (!/\/tools\//.test(location.pathname)) return;
    var toolId = (location.pathname.split('/').pop() || '').replace(/\.html$/, '') || 'tools-index';

    track('tool_open', { tool: toolId });

    function bindClick(id, eventName, extra) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('click', function () {
        track(eventName, Object.assign({ tool: toolId }, extra || {}));
      });
    }

    bindClick('job-save', 'tool_save_json');
    bindClick('job-open', 'tool_open_json');
    bindClick('job-print', 'tool_print_pdf');
    bindClick('cta-email', 'tool_email_quote');
    bindClick('cta-quote', 'tool_quote_whatsapp');
    bindClick('proj-sess-attach', 'tool_attach_to_project');

    // First successful calculation (we don't know the exact button across
    // tools, but the tool surfaces results via .calc-result. Watch for the
    // first time a result number appears.)
    var aside = document.querySelector('.calc-result');
    if (aside) {
      var calculated = false;
      var mo = new MutationObserver(function () {
        if (calculated) return;
        // Result is "ready" when a number/value is rendered.
        var hasResult = aside.querySelector('.calc-headline-value, .result-value, [data-result]');
        var txt = aside.textContent || '';
        if (hasResult || /\d+\s*(kW|m³|kg|TR|BTU)/i.test(txt)) {
          calculated = true;
          track('tool_calculated', { tool: toolId });
          mo.disconnect();
        }
      });
      mo.observe(aside, { childList: true, subtree: true, characterData: true });
    }
  }

  // ----------------------------------------------- Page load + visibility
  // Note: pageviews are auto-tracked by Vercel Web Analytics — no custom
  // page_view event here, otherwise the dashboard double-counts.
  function onReady() {
    wireToolFunnel();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

  // Engaged-session signal — fires once when the user has spent ≥30s on page
  // OR has scrolled past 50% of document height. Helps separate bouncers
  // from real prospects.
  (function engagement() {
    var fired = false;
    function fire(reason) {
      if (fired) return;
      fired = true;
      track('engaged_session', { reason: reason });
    }
    setTimeout(function () { fire('30s'); }, 30000);
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking || fired) return;
      ticking = true;
      requestAnimationFrame(function () {
        var h = document.documentElement;
        var pct = (h.scrollTop + window.innerHeight) / h.scrollHeight;
        if (pct >= 0.5) fire('scroll-50');
        ticking = false;
      });
    }, { passive: true });
  })();
})();
