/* ============================================================
   Cold Storage Guide — interactive commodity reference table.
   Renders a searchable, filterable list of 144 commodities with
   storage temperature (°F), relative humidity, and shelf life.
   Each row deep-links into the load calculator pre-filled with
   that commodity's temperature and humidity targets.

   Wired up against #csg-app on services/cold-stores.html.
============================================================ */
(function () {
  const app = document.getElementById('csg-app');
  if (!app) return;

  const search = document.getElementById('csg-search');
  const clear = document.getElementById('csg-clear');
  const chips = app.querySelectorAll('.csg-chip');
  const rowsEl = document.getElementById('csg-rows');
  const countEl = document.getElementById('csg-count');
  const totalEl = document.getElementById('csg-total');
  const emptyEl = document.getElementById('csg-empty');
  const emptyQ = document.getElementById('csg-empty-q');

  const state = {
    items: [],
    q: '',
    cls: 'all',
  };

  // --- Helpers --------------------------------------------------

  // Pull the first integer from a temp string for the calculator deep-link.
  // Excel temps are in °F. We pass °F to the calculator and let it convert.
  const firstInt = (s) => {
    if (!s) return null;
    const m = String(s).match(/-?\d+/);
    return m ? parseInt(m[0], 10) : null;
  };

  const f2c = (f) => Math.round(((f - 32) * 5) / 9);

  // Build the calculator deep-link URL. The load calculator already
  // accepts ?commodity=X&temp=Y&rh=Z (added in the same change).
  const calcUrl = (item) => {
    const params = new URLSearchParams();
    params.set('commodity', item.name);
    const tF = firstInt(item.temp);
    if (tF !== null) {
      params.set('tempF', tF);
      params.set('temp', f2c(tF)); // °C for the calculator's native unit
    }
    const rh = firstInt(item.rh);
    if (rh !== null) params.set('rh', rh);
    return `../tools/load-calculator.html?${params.toString()}`;
  };

  const escapeHtml = (s) =>
    String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  // ---- Category icons (line-art SVG, 18px, ink) ----
  // Tag is derived purely from the commodity name — does not modify the
  // source data, only used as a visual cue in the name column.
  const ICONS = {
    fruit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 6c-3-3-7-1-7 3 0 4 3 9 7 9s7-5 7-9c0-4-4-6-7-3Z"/><path d="M12 6V3"/><path d="M12 3c1-1 2-1 3 0"/></svg>',
    vegetable: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 11c0-3 3-5 7-5s7 2 7 5c0 6-3 10-7 10s-7-4-7-10Z"/><path d="M9 6V3"/><path d="M12 6V2"/><path d="M15 6V3"/></svg>',
    meat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 13c0-4 3-7 7-7s8 3 8 7-3 6-6 6c-1 0-2 0-3 1l-2 2c-2 1-4-1-3-3l1-2c1-1 1-2 0-3l-2-1Z"/><circle cx="9" cy="15" r="1"/></svg>',
    poultry: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 17c0-5 3-9 7-9 3 0 5 2 5 5 0 2-1 4-3 5"/><path d="M14 18l3-1"/><path d="M5 17c-1 1-1 3 1 3h8"/><circle cx="14" cy="9" r="1"/></svg>',
    seafood: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12c3-5 8-6 13-4 4 1 5 4 5 4s-1 3-5 4c-5 2-10 1-13-4Z"/><path d="M3 12l-2-2v4Z"/><circle cx="17" cy="11" r="0.8"/></svg>',
    dairy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3h8v3l1 3v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9l1-3V3Z"/><path d="M7 9h10"/></svg>',
    'dry-goods': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8c2-3 4-3 6-3s4 0 6 3l1 11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L6 8Z"/><path d="M9 8h6"/></svg>',
    beverage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4h10l-1 16a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2L7 4Z"/><path d="M7 9h10"/></svg>',
    'non-food': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="6" width="16" height="14" rx="1"/><path d="M8 6V4h8v2"/></svg>',
  };

  const categorize = (name) => {
    const n = (name || '').toLowerCase();
    if (n.startsWith('meat:') || /\b(beef|pork|lamb|veal|bacon|ham|sausage|liver|game)\b/.test(n)) return 'meat';
    if (/(fish|salmon|tuna|haddock|cod|shellfish)/.test(n)) return 'seafood';
    if (n.startsWith('milk') || /\b(dairy|cheese|butter|cream|ice cream|yogurt)\b/.test(n)) return 'dairy';
    if (/(poultry|chicken|goose|turkey|rabbit|egg)/.test(n)) return 'poultry';
    if (/(beer|orange juice|bottle)/.test(n)) return 'beverage';
    if (/(bread|dough|yeast|coffee|cocoa|chocolate|honey|maple|sugar|syrup|nut|raisin|dried fruit|figs, dried|popcorn|oleomargarine|cured)/.test(n)) return 'dry-goods';
    if (/(tobacco|cigar|fur|fabric)/.test(n)) return 'non-food';
    const fruits = /(apple|apricot|avocado|banana|blackberr|blueberr|cantaloupe|cherr|coconut|cranberr|currant|date|dewberr|fig|gooseberr|grape|guava|lemon|lime|mango|melon|nectarin|olive|orange|papaya|peach|pear|persimmon|pineapple|plum|pomegranate|quince|raspberr|rhubarb|strawberr|tangerine|watermelon|honeydew)/;
    if (fruits.test(n)) return 'fruit';
    return 'vegetable';
  };

  // --- Filtering ------------------------------------------------

  const matches = (item) => {
    if (state.cls !== 'all' && item.class !== state.cls) return false;
    if (!state.q) return true;
    const q = state.q.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      (item.shelf || '').toLowerCase().includes(q)
    );
  };

  // --- Render ---------------------------------------------------

  const renderRow = (item) => {
    const url = calcUrl(item);
    const name = escapeHtml(item.name);
    const temp = escapeHtml(item.temp || '—');
    const rh = escapeHtml(item.rh || '—');
    const shelf = escapeHtml(item.shelf || '—');
    const classBadge = {
      frozen: '<span class="csg-class csg-class-lt mono" title="Low-temperature / frozen">LT</span>',
      chilled: '<span class="csg-class csg-class-mt mono" title="Medium-temperature / chilled">MT</span>',
      cool: '<span class="csg-class csg-class-ht mono" title="High-temperature / cool">HT</span>',
      unspecified: '<span class="csg-class csg-class-na mono" title="Storage class not specified">—</span>',
    }[item.class] || '';
    const cat = categorize(item.name);
    const iconSvg = ICONS[cat] || ICONS.vegetable;
    const iconHtml = `<span class="csg-cat-icon csg-cat-${cat}" title="${cat.replace('-', ' ')}">${iconSvg}</span>`;
    return (
      `<tr class="csg-row" data-name="${name}" data-category="${cat}">` +
      `<td class="csg-c-name">${classBadge}${iconHtml}<span class="csg-name">${name}</span></td>` +
      `<td class="csg-c-temp mono">${temp}</td>` +
      `<td class="csg-c-rh mono">${rh}</td>` +
      `<td class="csg-c-shelf">${shelf}</td>` +
      `<td class="csg-c-action"><a class="csg-size mono" href="${url}">Size a room <span aria-hidden="true">→</span></a></td>` +
      `</tr>`
    );
  };

  const render = () => {
    const filtered = state.items.filter(matches);
    countEl.textContent = filtered.length;
    if (filtered.length === 0) {
      rowsEl.innerHTML = '';
      emptyQ.textContent = state.q ? `"${state.q}"` : 'the current filter';
      emptyEl.hidden = false;
    } else {
      emptyEl.hidden = true;
      rowsEl.innerHTML = filtered.map(renderRow).join('');
    }
    if (clear) clear.hidden = !state.q;
  };

  // --- Wiring ---------------------------------------------------

  search.addEventListener('input', (e) => {
    state.q = e.target.value.trim();
    render();
  });

  if (clear) {
    clear.addEventListener('click', () => {
      search.value = '';
      state.q = '';
      render();
      search.focus();
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => {
        c.classList.remove('is-active');
        c.setAttribute('aria-selected', 'false');
      });
      chip.classList.add('is-active');
      chip.setAttribute('aria-selected', 'true');
      state.cls = chip.dataset.class;
      render();
    });
  });

  // Mobile / touch: whole row navigates. The action link is hidden on
  // small viewports, so we delegate row clicks to the embedded calc URL.
  rowsEl.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) return; // don't double-fire on inner links
    const tr = e.target.closest('.csg-row');
    if (!tr) return;
    const a = tr.querySelector('a.csg-size');
    if (!a) return;
    // Only intercept when the action link is visually hidden (mobile)
    if (getComputedStyle(a).display === 'none') {
      window.location.href = a.href;
    }
  });

  // --- Load data and boot --------------------------------------

  const dataUrl = app.dataset.source || '../js/tools/data-cold-storage-guide.json';
  fetch(dataUrl, { cache: 'force-cache' })
    .then((r) => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then((data) => {
      state.items = data.commodities || [];
      totalEl.textContent = state.items.length;
      render();
    })
    .catch((err) => {
      rowsEl.innerHTML = `<tr><td colspan="5" class="csg-loading mono">Failed to load commodity data. ${escapeHtml(err.message)}</td></tr>`;
    });
})();
