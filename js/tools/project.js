/* ==========================================================================
   MULTI-SYSTEM PROJECT SHELL — Tool 0
   One project = many systems. Save/load .json. Aggregate roll-up.
   Each system stored as the same .json a tool exports (so you can mix-and-match).
   ========================================================================== */

(async function () {
  if (!window.Izhar) await new Promise(r => setTimeout(r, 50));
  const { fmt, saveJson, openJsonFile, generatePDF } = Izhar;
  const KEY = 'izhar_project';
  const $ = (id) => document.getElementById(id);

  let project = {
    version: 1,
    name: '',
    site: '',
    customerInfo: '',
    myInfo: '',
    systems: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const TOOLS = [
    { id: 'load-calculator', name: 'Cold Room Heat Load', href: 'load-calculator.html', icon: '🧊' },
    { id: 'condenser-sizing', name: 'Air-Cooled Condenser', href: 'condenser-sizing.html', icon: '🌬' },
    { id: 'a2l-room-area', name: 'A2L Min Room Area', href: 'a2l-room-area.html', icon: '⚠' },
    { id: 'refrigerant-charge', name: 'Refrigerant Charge', href: 'refrigerant-charge.html', icon: '🧪' },
    { id: 'energy-cost', name: 'Energy Cost & Payback', href: 'energy-cost.html', icon: '⚡' },
    { id: 'capacity-planner', name: 'Capacity Planner', href: 'capacity-planner.html', icon: '📦' },
    { id: 'ca-atmosphere', name: 'CA Atmosphere', href: 'ca-atmosphere.html', icon: '🍎' }
  ];

  // ---------- restore from localStorage ----------
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) project = JSON.parse(raw);
  } catch (e) {}

  function persist() {
    project.updatedAt = new Date().toISOString();
    try { localStorage.setItem(KEY, JSON.stringify(project)); } catch (e) {}
  }

  function render() {
    $('proj-name').value = project.name || '';
    $('proj-site').value = project.site || '';
    $('proj-customer').value = project.customerInfo || '';
    $('proj-engineer').value = project.myInfo || '';

    const list = $('systems-list');
    list.innerHTML = '';
    if (!project.systems || project.systems.length === 0) {
      $('systems-empty').style.display = 'block';
    } else {
      $('systems-empty').style.display = 'none';
      project.systems.forEach((sys, idx) => list.appendChild(renderSystemRow(sys, idx)));
    }

    // Aggregate
    $('agg-count').textContent = project.systems?.length || 0;
    let totalCapKw = 0, totalVolM3 = 0, totalPanelM2 = 0;
    (project.systems || []).forEach(s => {
      // Capacity: prefer explicit capacityKw from tool payload, fall back to regex on summary
      const rawCap = s.raw?.capacityKw;
      if (typeof rawCap === 'number' && isFinite(rawCap)) {
        totalCapKw += rawCap;
      } else if (s.summary) {
        const m = (s.summary.match(/(\d+\.?\d*)\s*kW/) || [])[1];
        if (m) totalCapKw += parseFloat(m);
      }
      if (s.dims) {
        totalVolM3 += (s.dims.l || 0) * (s.dims.w || 0) * (s.dims.h || 0);
        const sa = 2 * ((s.dims.l * s.dims.w) + (s.dims.l * s.dims.h) + (s.dims.w * s.dims.h));
        totalPanelM2 += sa;
      }
    });
    $('agg-cap').textContent = totalCapKw > 0 ? `${fmt(totalCapKw, 1)} kW` : '—';
    $('agg-vol').textContent = totalVolM3 > 0 ? `${fmt(totalVolM3, 0)} m³` : '—';
    $('agg-panel').textContent = totalPanelM2 > 0 ? `${fmt(totalPanelM2, 0)} m²` : '—';
  }

  function renderSystemRow(sys, idx) {
    const row = document.createElement('div');
    row.style.cssText = 'display:grid; grid-template-columns: 36px minmax(0, 1fr) auto auto; gap:14px; align-items:center; padding:14px 18px; background:var(--paper-2); border:1px solid var(--line-2); border-radius:4px;';
    const tool = TOOLS.find(t => t.id === sys.tool) || { name: sys.tool, icon: '·' };
    row.innerHTML = `
      <span style="font-size:1.4rem;">${tool.icon}</span>
      <div>
        <div style="font-family:var(--font-display); font-weight:600; color:var(--ink); margin-bottom:2px;">${sys.name || tool.name}</div>
        <div style="font-size:.82rem; color:var(--muted); font-family:var(--font-mono);">${tool.name} · ${sys.summary || 'no summary'}</div>
      </div>
      <button type="button" class="btn btn-outline btn-sm" data-edit="${idx}">Edit</button>
      <button type="button" class="btn btn-ghost btn-sm" data-remove="${idx}" style="color:var(--t-warm);">Remove</button>
    `;
    row.querySelector('[data-edit]').addEventListener('click', () => {
      // Open the tool with the saved hash AND mark this zone as the editing target
      Izhar.setProjectSession({
        projectName: project.name || 'Untitled project',
        returnUrl: location.href,
        editingZoneIndex: idx
      });
      const url = `${tool.href}${sys.hash || ''}`;
      window.location.href = url;
    });
    row.querySelector('[data-remove]').addEventListener('click', () => {
      project.systems.splice(idx, 1);
      persist(); render();
    });
    return row;
  }

  // ---------- Add system: pick a tool ----------
  function pickTool() {
    let modal = document.getElementById('proj-toolpick');
    if (modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'proj-toolpick';
    modal.className = 'calc-modal';
    modal.innerHTML = `
      <div class="calc-modal-card" style="max-width:760px;">
        <div class="calc-modal-head">
          <h3>Pick a tool to add a system</h3>
          <button class="calc-modal-close" aria-label="Close">×</button>
        </div>
        <div class="calc-modal-body">
          <p style="font-size:.92rem; color:var(--muted); margin-bottom:18px; line-height:1.55;">Each tool calculates one system. After computing, return here — you can save the project file and the system list grows.</p>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:10px;">
            ${TOOLS.map(t => `
              <button type="button" data-tool="${t.id}" data-href="${t.href}" class="proj-tool-tile" style="padding:18px; background:var(--paper-2); border:1px solid var(--line-2); border-radius:4px; cursor:pointer; transition:all .15s; display:flex; flex-direction:column; gap:6px; text-align:left; font-family:inherit;">
                <span style="font-size:1.6rem;">${t.icon}</span>
                <strong style="font-family:var(--font-display); color:var(--ink); font-size:.95rem;">${t.name}</strong>
                <span style="font-size:.78rem; color:var(--muted); font-family:var(--font-mono);">tool/${t.id}</span>
              </button>
            `).join('')}
          </div>
          <p style="font-size:.78rem; color:var(--muted); margin-top:18px; padding-top:14px; border-top:1px solid var(--line-2); line-height:1.55;"><strong>How it works:</strong> the tool opens, you compute, then click <strong>Attach &amp; return to project</strong> in the orange banner — the system attaches automatically and you come back here. No file shuffling.</p>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector('.calc-modal-close').onclick = () => modal.classList.remove('is-open');
    modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('is-open'); };
    modal.querySelectorAll('.proj-tool-tile').forEach(t => {
      t.onmouseenter = () => { t.style.borderColor = 'var(--t-warm)'; t.style.transform = 'translateY(-2px)'; };
      t.onmouseleave = () => { t.style.borderColor = 'var(--line-2)'; t.style.transform = 'translateY(0)'; };
      t.onclick = () => {
        // Save project state first (in case unsaved name/site/customer)
        persist();
        // Set the active session so the tool can detect it
        Izhar.setProjectSession({
          projectName: project.name || 'Untitled project',
          returnUrl: location.href
        });
        window.location.href = t.dataset.href;
      };
    });
    modal.classList.add('is-open');
  }

  // ---------- Wiring ----------
  ['proj-name', 'proj-site', 'proj-customer', 'proj-engineer'].forEach(id => {
    $(id).addEventListener('input', (e) => {
      const map = { 'proj-name': 'name', 'proj-site': 'site', 'proj-customer': 'customerInfo', 'proj-engineer': 'myInfo' };
      project[map[id]] = e.target.value;
      persist();
    });
  });

  $('btn-new').addEventListener('click', () => {
    if (project.systems?.length && !confirm('Discard current project? Save first if you want to keep it.')) return;
    project = { version: 1, name: '', site: '', customerInfo: '', myInfo: '', systems: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    persist(); render();
  });

  $('btn-open').addEventListener('click', async () => {
    try {
      const data = await openJsonFile();
      // Two flavours: full project (data.systems is array) or a single tool save (data.tool)
      if (Array.isArray(data?.systems)) {
        project = data;
        persist(); render();
      } else if (data?.tool) {
        // Attach as a system
        project.systems = project.systems || [];
        project.systems.push({
          tool: data.tool,
          name: data.projectName || data.tool,
          summary: data.projectName || '',
          hash: data.hash || '',
          dims: data.dims || null,
          raw: data
        });
        persist(); render();
      }
    } catch (e) { /* user cancelled */ }
  });

  $('btn-save').addEventListener('click', () => {
    const safeName = (project.name || 'izhar-project').toString().replace(/\s+/g, '-').toLowerCase();
    saveJson(`${safeName}.json`, project);
  });

  $('btn-print').addEventListener('click', () => {
    generatePDF({
      toolNumber: 0,
      toolName: 'Multi-System Project Summary',
      projectName: project.name || 'Untitled project',
      customerInfo: project.customerInfo,
      myInfo: project.myInfo,
      sections: [
        { title: 'Project metadata', kv: [
          ['Project', project.name || '—'],
          ['Site', project.site || '—'],
          ['Created', new Date(project.createdAt).toLocaleDateString('en-GB')],
          ['Last updated', new Date(project.updatedAt).toLocaleDateString('en-GB')],
          ['Systems', String(project.systems?.length || 0)]
        ]},
        ...(project.systems || []).map((s, i) => ({
          title: `Zone ${i + 1}: ${s.name || s.tool}`,
          kv: [
            ['Tool', (TOOLS.find(t => t.id === s.tool) || { name: s.tool }).name],
            ['Summary', s.summary || '—']
          ]
        }))
      ],
      sources: [
        'ASHRAE Handbook — Refrigeration 2022',
        'IEC 60335-2-89:2019',
        'NIST REFPROP 10.0',
        'USDA Agriculture Handbook 66'
      ]
    });
  });

  $('btn-add-system').addEventListener('click', pickTool);

  render();
})();
