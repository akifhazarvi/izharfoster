// Izhar Foster — minimal, premium-feel JS
(function () {
  'use strict';

  // --- Floating action stack (WhatsApp + Call + Quote)
  // Replace the legacy single .fab-wa anchor with a stack of three FABs.
  (function buildFabStack() {
    if (document.querySelector('.fab-stack')) return;
    const legacy = document.querySelector('.fab-wa');
    // Determine the contact-page path prefix for the Quote link
    const quoteHref = location.pathname.includes('/services/') || location.pathname.includes('/blog/') || location.pathname.includes('/tools/')
      ? '../contact.html'
      : 'contact.html';
    const stack = document.createElement('div');
    stack.className = 'fab-stack';
    stack.setAttribute('aria-label', 'Quick contact');
    stack.innerHTML =
      '<a href="' + quoteHref + '" class="fab-quote" data-label="Request a quote" aria-label="Request a quote"></a>' +
      '<a href="tel:+924235383543" class="fab-call" data-label="Call · +92 42 3538 3543" aria-label="Call Izhar Foster"></a>' +
      '<a href="https://wa.me/923215383544" target="_blank" rel="noopener" class="fab-wa" data-label="WhatsApp our team" aria-label="WhatsApp Izhar Foster"></a>';
    if (legacy) legacy.replaceWith(stack);
    else document.body.appendChild(stack);
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
        '<a href="https://wa.me/923215383544" target="_blank" rel="noopener" class="wa">WhatsApp our team</a>';
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
})();
