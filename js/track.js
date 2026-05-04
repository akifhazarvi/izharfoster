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

  // ----------------------------------------------- Referrer attribution
  // Captures the *original* referrer + UTM block on the very first pageview
  // of the session and stashes it in sessionStorage so every subsequent event
  // can attach it. This fixes three real-world tracking gaps:
  //
  //   1. Legacy WP URLs (e.g. /pir-panels/ -> /services/pir-sandwich-panels)
  //      go through 308 redirects. Some browsers (Safari iOS, FB/IG in-app)
  //      strip the Referer header on the final hop, so Google search clicks
  //      land as "direct". We capture document.referrer BEFORE the page
  //      JS-redirects, on the first hit that does have it.
  //
  //   2. AI assistants (ChatGPT, Perplexity, Claude, Copilot, Gemini) ship
  //      links with referrerpolicy="no-referrer" so document.referrer is
  //      empty. We infer the source via a heuristic on referrer + UA + URL
  //      patterns and tag the session as `ai_<engine>`.
  //
  //   3. Direct-traffic over-counting. Without UTMs and without a referer,
  //      everything looks "direct". We classify as one of:
  //        google_organic | bing_organic | duckduckgo_organic |
  //        ai_chatgpt | ai_perplexity | ai_claude | ai_copilot | ai_gemini |
  //        social_<network> | utm:<source> | direct
  function detectSource() {
    var url = new URL(location.href);
    var ref = document.referrer || '';
    var refHost = '';
    try { refHost = ref ? new URL(ref).hostname.toLowerCase() : ''; } catch (e) {}
    var ua = (navigator.userAgent || '').toLowerCase();

    // Detect "I came in via a 308 from a legacy WP URL" using PerformanceNavigation
    // redirect count. Vercel redirects show up as redirectCount >= 1.
    var redirectedFromLegacy = false;
    try {
      var nav = (performance.getEntriesByType('navigation') || [])[0];
      if (nav && nav.redirectCount > 0) redirectedFromLegacy = true;
    } catch (e) {}

    // 1. UTM wins — explicit beats inferred.
    var utmSource = url.searchParams.get('utm_source');
    var utmMedium = url.searchParams.get('utm_medium');
    var utmCampaign = url.searchParams.get('utm_campaign');
    if (utmSource) {
      return {
        source: 'utm:' + utmSource.toLowerCase(),
        medium: utmMedium || '',
        campaign: utmCampaign || '',
        referrer: ref
      };
    }

    // 2. AI assistant detection — ordered by specificity.
    // Some AI engines DO leak referrer; others leave document.referrer empty
    // but the click came from an in-app browser whose UA is identifiable.
    var aiHosts = {
      'chat.openai.com': 'chatgpt',
      'chatgpt.com': 'chatgpt',
      'openai.com': 'chatgpt',
      'perplexity.ai': 'perplexity',
      'www.perplexity.ai': 'perplexity',
      'claude.ai': 'claude',
      'anthropic.com': 'claude',
      'copilot.microsoft.com': 'copilot',
      'bing.com/chat': 'copilot',
      'gemini.google.com': 'gemini',
      'bard.google.com': 'gemini',
      'you.com': 'you',
      'phind.com': 'phind',
      'kagi.com': 'kagi'
    };
    for (var host in aiHosts) {
      if (refHost.indexOf(host) !== -1 || ref.indexOf(host) !== -1) {
        return { source: 'ai_' + aiHosts[host], medium: 'ai-search', campaign: '', referrer: ref };
      }
    }
    // UA-based AI in-app browsers (rare but exists for OpenAI's Atlas / etc.)
    if (/openai\/|chatgpt|gptbot/.test(ua)) {
      return { source: 'ai_chatgpt', medium: 'ai-search', campaign: '', referrer: ref };
    }
    if (/perplexity/.test(ua)) {
      return { source: 'ai_perplexity', medium: 'ai-search', campaign: '', referrer: ref };
    }

    // 3. Search engines.
    if (/google\./.test(refHost)) return { source: 'google_organic', medium: 'organic', campaign: '', referrer: ref };
    if (/bing\.com$/.test(refHost) || refHost === 'bing.com') return { source: 'bing_organic', medium: 'organic', campaign: '', referrer: ref };
    if (/duckduckgo\.com$/.test(refHost)) return { source: 'duckduckgo_organic', medium: 'organic', campaign: '', referrer: ref };
    if (/yandex\./.test(refHost)) return { source: 'yandex_organic', medium: 'organic', campaign: '', referrer: ref };
    if (/yahoo\./.test(refHost)) return { source: 'yahoo_organic', medium: 'organic', campaign: '', referrer: ref };

    // 4. Social — common in Pakistan: WhatsApp, FB, IG, LinkedIn, X, TikTok.
    var socialHosts = {
      'l.facebook.com': 'facebook', 'm.facebook.com': 'facebook', 'facebook.com': 'facebook', 'www.facebook.com': 'facebook',
      'l.instagram.com': 'instagram', 'instagram.com': 'instagram', 'www.instagram.com': 'instagram',
      'lm.facebook.com': 'facebook',
      'wa.me': 'whatsapp', 'web.whatsapp.com': 'whatsapp', 'api.whatsapp.com': 'whatsapp', 'whatsapp.com': 'whatsapp',
      'linkedin.com': 'linkedin', 'www.linkedin.com': 'linkedin', 'lnkd.in': 'linkedin',
      't.co': 'twitter', 'twitter.com': 'twitter', 'x.com': 'twitter',
      'youtube.com': 'youtube', 'm.youtube.com': 'youtube', 'youtu.be': 'youtube',
      'tiktok.com': 'tiktok', 'www.tiktok.com': 'tiktok',
      'reddit.com': 'reddit', 'old.reddit.com': 'reddit',
      'pinterest.com': 'pinterest'
    };
    for (var sh in socialHosts) {
      if (refHost === sh || refHost.endsWith('.' + sh)) {
        return { source: 'social_' + socialHosts[sh], medium: 'social', campaign: '', referrer: ref };
      }
    }

    // 5. WhatsApp / FB in-app browser detection (UA-based — these often have empty referrer).
    if (/fban|fbav|fb_iab|fbios|fb4a/i.test(ua)) {
      return { source: 'social_facebook', medium: 'social-iab', campaign: '', referrer: ref };
    }
    if (/instagram/i.test(ua)) {
      return { source: 'social_instagram', medium: 'social-iab', campaign: '', referrer: ref };
    }
    if (/whatsapp/i.test(ua)) {
      return { source: 'social_whatsapp', medium: 'social-iab', campaign: '', referrer: ref };
    }
    if (/linkedinapp/i.test(ua)) {
      return { source: 'social_linkedin', medium: 'social-iab', campaign: '', referrer: ref };
    }

    // 6. Generic referrer (someone linking from a blog, etc.)
    if (refHost && refHost !== location.hostname) {
      return { source: 'referral:' + refHost, medium: 'referral', campaign: '', referrer: ref };
    }

    // 7. Direct (or unknown). If we came via a 308 from a legacy URL but the
    // referrer was stripped, mark it explicitly so we can audit the gap.
    if (redirectedFromLegacy) {
      return { source: 'direct_via_legacy_redirect', medium: 'none', campaign: '', referrer: ref };
    }
    return { source: 'direct', medium: 'none', campaign: '', referrer: ref };
  }

  function getOrSetSession() {
    var KEY = 'izhar_session_attribution';
    try {
      var existing = sessionStorage.getItem(KEY);
      if (existing) return JSON.parse(existing);
    } catch (e) {}
    var fresh = detectSource();
    fresh.first_landing = location.pathname;
    fresh.first_seen = Date.now();
    try {
      var nav = (performance.getEntriesByType('navigation') || [])[0];
      fresh.redirect_count = nav ? (nav.redirectCount || 0) : 0;
    } catch (e) { fresh.redirect_count = 0; }
    try { sessionStorage.setItem(KEY, JSON.stringify(fresh)); } catch (e) {}

    // Fire a one-shot session_start event with our enriched attribution.
    // Param names are prefixed so they never overwrite GA4 reserved
    // attribution params (source/medium/campaign) on this event.
    track('session_start', {
      izhar_source: fresh.source,
      izhar_medium: fresh.medium,
      izhar_campaign: fresh.campaign,
      referrer_host: (function () {
        try { return new URL(fresh.referrer || '').hostname; } catch (e) { return ''; }
      })(),
      first_landing: fresh.first_landing,
      redirect_count: fresh.redirect_count,
      via_legacy_redirect: fresh.redirect_count > 0
    });

    // Mirror to GA4 as CUSTOM user properties (prefixed `izhar_*` so they
    // never collide with GA4 reserved attribution keys like source/medium/
    // campaign). GA4's native channel grouping is the source of truth for the
    // Acquisition reports; this block only adds our extra detection (AI
    // assistants, legacy-redirect flag, in-app browsers) as additional dims.
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('set', 'user_properties', {
          izhar_source: fresh.source,
          izhar_medium: fresh.medium,
          izhar_campaign: fresh.campaign
        });
      }
    } catch (e) {}

    return fresh;
  }
  // Run attribution detection on first call to track() — done lazily so it
  // only fires once per session.
  var _attribution = null;
  var _origTrack = track;
  track = function (event, props) {
    if (!_attribution) _attribution = getOrSetSession();
    // Prefixed keys so per-event params never overwrite GA4 reserved
    // dimensions (source, medium, campaign) on the auto-detected channel.
    var enriched = Object.assign({
      izhar_source: _attribution.source,
      izhar_medium: _attribution.medium,
      izhar_campaign: _attribution.campaign
    }, props || {});
    return _origTrack(event, enriched);
  };
  window.IzharTrack.track = track;

  // ----------------------------------------------- Page load + visibility
  // Note: pageviews are auto-tracked by Vercel Web Analytics — no custom
  // page_view event here, otherwise the dashboard double-counts.
  function onReady() {
    // Force attribution detection on every page (idempotent thanks to
    // sessionStorage). This guarantees session_start fires even if no other
    // track() call happens before the user bounces.
    if (!_attribution) _attribution = getOrSetSession();
    wireToolFunnel();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

  // Case-study deep-read signal — fires once when the user scrolls past 75%
  // of a /projects/<slug>.html page. Distinct from engaged_session (which
  // fires at 30s OR 50% scroll) — case studies are bottom-loaded with
  // scope-of-supply tables and "more like this" cross-links, so 75% is the
  // strong purchase-intent signal for B2B buyers reading a named case study.
  (function caseStudyDepth() {
    if (!/\/projects\//.test(location.pathname)) return;
    if (/\/projects\.html?$/.test(location.pathname)) return; // index page, not a study
    var slug = (location.pathname.split('/').pop() || '').replace(/\.html$/, '');
    if (!slug) return;
    var fired = false;
    var ticking = false;
    function check() {
      if (fired || ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var h = document.documentElement;
        var pct = (h.scrollTop + window.innerHeight) / h.scrollHeight;
        if (pct >= 0.75) {
          fired = true;
          track('case_study_read', { slug: slug, depth: '75' });
          window.removeEventListener('scroll', check);
        }
        ticking = false;
      });
    }
    window.addEventListener('scroll', check, { passive: true });
  })();

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
