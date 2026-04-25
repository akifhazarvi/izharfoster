// Izhar Foster — minimal, premium-feel JS
(function () {
  'use strict';

  // --- Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-center');
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.toggle('open'));
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
