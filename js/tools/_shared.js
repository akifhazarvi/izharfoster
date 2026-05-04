/* ==========================================================================
   IZHAR CALCULATOR SUITE — shared utilities
   Used by every tool. No framework, no dependencies.
   ========================================================================== */

const Izhar = (() => {
  // ---------- unit system ----------
  const UNITS_KEY = 'izhar_units';
  let unitSystem = localStorage.getItem(UNITS_KEY) || 'SI'; // 'SI' | 'IP'

  const setUnitSystem = (s) => {
    unitSystem = s;
    localStorage.setItem(UNITS_KEY, s);
    document.dispatchEvent(new CustomEvent('izhar:units', { detail: { system: s } }));
  };
  const getUnitSystem = () => unitSystem;

  // SI primary internal storage. Convert at display time.
  const conv = {
    // length
    m_to_ft: (m) => m * 3.28084,
    ft_to_m: (ft) => ft * 0.3048,
    // temperature
    c_to_f: (c) => c * 9/5 + 32,
    f_to_c: (f) => (f - 32) * 5/9,
    k_to_r: (k) => k * 9/5,           // K (delta) to °F (delta)
    r_to_k: (r) => r * 5/9,
    // mass
    kg_to_lb: (kg) => kg * 2.20462,
    lb_to_kg: (lb) => lb / 2.20462,
    // power / energy
    kw_to_btuh: (kw) => kw * 3412.14,
    btuh_to_kw: (btuh) => btuh / 3412.14,
    kw_to_tr: (kw) => kw / 3.51685,
    tr_to_kw: (tr) => tr * 3.51685,
    // volume
    m3_to_ft3: (m3) => m3 * 35.3147,
    ft3_to_m3: (ft3) => ft3 / 35.3147,
  };

  // formatter — n decimals, with commas for thousands, mono-friendly
  const fmt = (n, dec = 0) => {
    if (n == null || Number.isNaN(n)) return '—';
    if (!isFinite(n)) return '∞';
    return n.toLocaleString('en-GB', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  };

  // ---------- data fetchers ----------
  const dataCache = {};
  async function getData(name) {
    if (dataCache[name]) return dataCache[name];
    const res = await fetch(`../js/tools/${name}.json`);
    const data = await res.json();
    dataCache[name] = data;
    return data;
  }

  // ---------- URL state encoding ----------
  // Encodes { k: v, ... } as #key=v;key2=v2... — short-form, share-friendly
  function readState() {
    const h = location.hash.replace(/^#/, '');
    if (!h) return {};
    const out = {};
    h.split(';').forEach(kv => {
      const [k, v] = kv.split('=');
      if (!k) return;
      out[decodeURIComponent(k)] = decodeURIComponent(v ?? '');
    });
    return out;
  }
  function writeState(obj) {
    const parts = Object.entries(obj)
      .filter(([_, v]) => v != null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    history.replaceState(null, '', '#' + parts.join(';'));
  }

  // ---------- CTA helpers ----------
  // Build a quote URL with form state pre-filled
  function quoteUrl(toolName, summary) {
    const url = new URL('../contact.html', location.href);
    url.searchParams.set('tool', toolName);
    url.searchParams.set('summary', summary.slice(0, 500));
    return url.toString();
  }
  function whatsappUrl(message) {
    const phone = '923215383544';
    const tagged = `${message}\n\n— Sent via izharfoster.com (${location.href})`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(tagged)}`;
  }
  function mailtoUrl(toolName, summary, body) {
    const subject = `[Izhar Tool · ${toolName}] ${summary.slice(0, 80)}`;
    const fullBody = `Hello Izhar Foster engineering team,\n\n${body || summary}\n\n— Sent from ${location.href}`;
    return `mailto:info@izharfoster.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`;
  }
  function copyShareLink() {
    return navigator.clipboard.writeText(location.href);
  }

  // ---------- Active project session (multi-system flow) ----------
  // Stored in localStorage as { projectName, returnUrl, editingZoneIndex? }
  // Set by project.html when "Add System" is clicked → tool detects + shows banner.
  const SESSION_KEY = 'izhar_active_project_session';
  const PROJECT_KEY = 'izhar_project';
  function getProjectSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch (e) { return null; }
  }
  function setProjectSession(s) {
    if (!s) localStorage.removeItem(SESSION_KEY);
    else localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  }
  function attachSystemToProject(systemPayload) {
    let proj = {};
    try { proj = JSON.parse(localStorage.getItem(PROJECT_KEY) || '{}'); } catch (e) {}
    proj.systems = proj.systems || [];
    const sess = getProjectSession();
    const sys = {
      tool: systemPayload.tool,
      name: systemPayload.projectName || systemPayload.tool,
      summary: systemPayload.projectName || '',
      hash: systemPayload.hash || '',
      dims: systemPayload.dims || null,
      raw: systemPayload,
      attachedAt: new Date().toISOString()
    };
    if (sess && Number.isInteger(sess.editingZoneIndex) && proj.systems[sess.editingZoneIndex]) {
      proj.systems[sess.editingZoneIndex] = sys;
    } else {
      proj.systems.push(sys);
    }
    proj.updatedAt = new Date().toISOString();
    localStorage.setItem(PROJECT_KEY, JSON.stringify(proj));
  }

  // ---------- Save / open .json ----------
  function saveJson(filename, payload) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.json') ? filename : `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }
  function openJsonFile() {
    return new Promise((resolve, reject) => {
      const inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = 'application/json,.json';
      inp.style.display = 'none';
      document.body.appendChild(inp);
      inp.onchange = () => {
        const f = inp.files && inp.files[0];
        document.body.removeChild(inp);
        if (!f) return reject(new Error('no file'));
        const r = new FileReader();
        r.onload = () => { try { resolve(JSON.parse(r.result)); } catch (e) { reject(e); } };
        r.onerror = () => reject(r.error);
        r.readAsText(f);
      };
      inp.click();
    });
  }

  // ---------- Print / PDF report ----------
  // Build a self-contained printable doc and open native print dialog ⇒ Save as PDF
  function generatePDF(opts) {
    const { toolNumber, toolName, projectName, customerInfo, myInfo, sections, math, sources } = opts;
    const today = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    const win = window.open('', '_blank', 'width=800,height=900');
    if (!win) { alert('Allow popups to save the report'); return; }
    const sectionsHtml = (sections || []).map(s => `
      <section class="rep-section">
        <h2>${s.title}</h2>
        ${s.kv ? `<table class="rep-kv"><tbody>${s.kv.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</tbody></table>` : ''}
        ${s.html ? `<div class="rep-html">${s.html}</div>` : ''}
      </section>`).join('');
    const mathHtml = math ? `<section class="rep-section rep-math"><h2>Calculation</h2><pre>${math.replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</pre></section>` : '';
    const sourcesHtml = sources && sources.length
      ? `<section class="rep-section rep-sources"><h2>Sources & methodology</h2><ul>${sources.map(s => `<li>${s}</li>`).join('')}</ul></section>` : '';
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${toolName} — ${projectName || 'Report'} · Izhar Foster</title>
<style>
@page { size: A4; margin: 18mm 16mm; }
* { box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif; color: #0A1F3D; line-height: 1.5; margin: 0; padding: 0; font-size: 11pt; }
.rep-head { border-bottom: 3px solid #E36A1E; padding-bottom: 12px; margin-bottom: 22px; display: flex; justify-content: space-between; align-items: flex-end; }
.rep-brand { font-size: 22pt; font-weight: 700; letter-spacing: -.02em; color: #0A1F3D; }
.rep-tag { font-size: 8.5pt; color: #4FC3D9; letter-spacing: .12em; text-transform: uppercase; margin-top: 2px; font-weight: 600; }
.rep-meta { font-size: 9pt; color: #555; text-align: right; line-height: 1.55; font-family: 'JetBrains Mono', ui-monospace, monospace; }
.rep-title { font-size: 16pt; font-weight: 600; margin: 18px 0 6px; }
.rep-eyebrow { font-size: 8.5pt; letter-spacing: .14em; text-transform: uppercase; color: #E36A1E; font-weight: 600; }
.rep-project { font-size: 10pt; color: #444; margin: 0 0 24px; }
.rep-section { margin-bottom: 18px; page-break-inside: avoid; }
.rep-section h2 { font-size: 11pt; font-weight: 600; color: #0A1F3D; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin: 0 0 10px; }
.rep-kv { width: 100%; border-collapse: collapse; font-size: 10pt; }
.rep-kv th { text-align: left; font-weight: 500; color: #555; padding: 5px 12px 5px 0; width: 38%; vertical-align: top; }
.rep-kv td { padding: 5px 0; font-family: 'JetBrains Mono', ui-monospace, monospace; color: #0A1F3D; vertical-align: top; }
.rep-math pre { background: #F5F2EC; padding: 14px; font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 8.5pt; white-space: pre-wrap; line-height: 1.4; border-left: 3px solid #4FC3D9; margin: 0; }
.rep-sources ul { padding-left: 18px; font-size: 9pt; color: #555; }
.rep-sources li { margin-bottom: 4px; }
.rep-footer { border-top: 1px solid #ddd; margin-top: 30px; padding-top: 12px; font-size: 8pt; color: #777; display: flex; justify-content: space-between; }
.rep-disclaimer { font-size: 8pt; color: #888; font-style: italic; margin-top: 14px; line-height: 1.5; }
@media print { .rep-noprint { display: none; } }
.rep-noprint { position: fixed; top: 12px; right: 12px; background: #E36A1E; color: white; border: 0; padding: 10px 18px; cursor: pointer; font-family: inherit; font-weight: 600; border-radius: 4px; font-size: 10pt; }
</style></head><body>
<button class="rep-noprint" onclick="window.print()">Save as PDF / Print</button>
<header class="rep-head">
  <div>
    <div class="rep-brand">Izhar Foster</div>
    <div class="rep-tag">Engineered cold · Cold-chain division of Izhar Group</div>
  </div>
  <div class="rep-meta">
    Report date: ${today}<br>
    Tool: ${String(toolNumber).padStart(2, '0')} of 07<br>
    +92 42 3538 3543 · info@izharfoster.com
  </div>
</header>
<div class="rep-eyebrow">Tool · ${String(toolNumber).padStart(2, '0')} · ${toolName}</div>
<h1 class="rep-title">${projectName || toolName + ' Report'}</h1>
${customerInfo ? `<p class="rep-project"><strong>Customer:</strong> ${customerInfo}</p>` : ''}
${myInfo ? `<p class="rep-project"><strong>Engineer:</strong> ${myInfo}</p>` : ''}
${sectionsHtml}
${mathHtml}
${sourcesHtml}
<p class="rep-disclaimer">This calculation is engineering reference only. Final equipment selection, refrigerant charge and compliance verification must be performed by a qualified refrigeration engineer using actual equipment datasheets and on-site verification. Izhar Foster (Pvt) Limited does not warrant any specific number until a procurement-grade selection is performed.</p>
<footer class="rep-footer">
  <span>© ${new Date().getFullYear()} Izhar Foster (Pvt) Limited · Lahore, Pakistan</span>
  <span>${location.host}</span>
</footer>
<script>setTimeout(()=>window.print(), 500);<\/script>
</body></html>`);
    win.document.close();
  }

  // ---------- NEW JOB / Job Type chooser (K-RP-style) ----------
  // openJobTypeChooser({
  //   toolName: 'Air-Cooled Condenser Designer',
  //   options: [
  //     { id: 'known-loads', label: 'I know my load', sub: '...', accent: 'mid' },
  //     { id: 'known-model', label: 'I know my model', sub: '...', accent: 'warm' }
  //   ],
  //   onOpenExisting: () => {},  // optional — show "Open existing project" button
  //   onPick: (id) => {}
  // })
  function openJobTypeChooser(opts) {
    let modal = document.getElementById('izhar-jobtype-modal');
    if (modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'izhar-jobtype-modal';
    modal.className = 'calc-modal';
    const tilesHtml = (opts.options || []).map(o => {
      const accent = o.accent === 'warm' ? 'var(--t-warm)' : (o.accent === 'cold' ? 'var(--t-cold)' : 'var(--t-mid)');
      return `<button type="button" data-pick="${o.id}" class="job-tile" style="text-align:left; padding:22px; background:var(--paper-2); border:2px solid var(--line-2); border-radius:6px; cursor:pointer; transition:all .15s; display:flex; flex-direction:column; gap:8px; min-height:170px;">
        <span class="calc-eyebrow" style="color:${accent};">${o.eyebrow || 'Path'}</span>
        <strong style="font-family:var(--font-display); font-size:1.05rem; color:var(--ink); line-height:1.3;">${o.label}</strong>
        <span style="font-size:.84rem; color:var(--muted); line-height:1.55;">${o.sub || ''}</span>
        <span style="margin-top:auto; color:${accent}; font-family:var(--font-mono); font-size:.78rem; letter-spacing:.06em;">CHOOSE THIS PATH →</span>
      </button>`;
    }).join('');
    modal.innerHTML = `
      <div class="calc-modal-card" style="max-width:760px;">
        <div class="calc-modal-head">
          <h3>${opts.title || 'New Job'}</h3>
          <button class="calc-modal-close" aria-label="Close">×</button>
        </div>
        <div class="calc-modal-body">
          ${opts.subtitle ? `<p style="font-size:.92rem; color:var(--muted); margin-bottom:20px; line-height:1.55;">${opts.subtitle}</p>` : ''}
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:14px;">
            ${tilesHtml}
          </div>
          ${opts.onOpenExisting ? `
            <div style="border-top:1px solid var(--line-2); margin-top:22px; padding-top:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
              <span style="font-size:.84rem; color:var(--muted);">Resuming earlier work?</span>
              <button type="button" id="job-open-existing" class="btn btn-outline btn-sm">Open existing job (.json) →</button>
            </div>` : ''}
        </div>
      </div>`;
    document.body.appendChild(modal);
    const close = () => modal.classList.remove('is-open');
    modal.querySelector('.calc-modal-close').onclick = close;
    modal.onclick = (e) => { if (e.target === modal) close(); };
    modal.querySelectorAll('[data-pick]').forEach(b => {
      b.onmouseenter = () => { b.style.borderColor = 'var(--t-warm)'; b.style.transform = 'translateY(-2px)'; };
      b.onmouseleave = () => { b.style.borderColor = 'var(--line-2)'; b.style.transform = 'translateY(0)'; };
      b.onclick = () => { close(); opts.onPick(b.dataset.pick); };
    });
    if (opts.onOpenExisting) {
      modal.querySelector('#job-open-existing').onclick = async () => {
        try {
          const data = await openJsonFile();
          close();
          opts.onOpenExisting(data);
        } catch (e) { /* user cancelled */ }
      };
    }
    modal.classList.add('is-open');
  }

  // ---------- live count-up animation ----------
  function countUp(el, from, to, ms = 1200, decimals = 1) {
    const start = performance.now();
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
    function step(now) {
      const t = Math.min(1, (now - start) / ms);
      const v = from + (to - from) * easeOutQuart(t);
      el.textContent = fmt(v, decimals);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---------- glossary tooltip ----------
  let glossaryData = null;
  async function showGlossary(termId) {
    if (!glossaryData) glossaryData = (await getData('data-glossary')).terms;
    const t = glossaryData[termId];
    if (!t) return;
    let modal = document.getElementById('izhar-glossary-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'izhar-glossary-modal';
      modal.className = 'calc-modal';
      modal.innerHTML = `
        <div class="calc-modal-card">
          <div class="calc-modal-head">
            <h3 id="izhar-glossary-title"></h3>
            <button class="calc-modal-close" aria-label="Close">×</button>
          </div>
          <div class="calc-modal-body" id="izhar-glossary-body"></div>
        </div>`;
      document.body.appendChild(modal);
      modal.querySelector('.calc-modal-close').onclick = () => modal.classList.remove('is-open');
      modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('is-open'); };
    }
    document.getElementById('izhar-glossary-title').textContent = t.term;
    document.getElementById('izhar-glossary-body').innerHTML = `
      <p>${t.def}</p>
      <p style="margin-top:14px;"><span class="calc-eyebrow">Typical</span><br>${t.typical}</p>
      <p style="margin-top:14px;color:var(--muted);font-family:var(--font-mono);font-size:.78rem;">Source: ${t.source}</p>`;
    modal.classList.add('is-open');
  }

  // ---------- ESC key closes modals ----------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.calc-modal.is-open').forEach(m => m.classList.remove('is-open'));
    }
  });

  // ---------- Equipment Selector (shared) ----------
  // openEquipmentSelector({ kind: 'evaporators' | 'condensingUnits',
  //                         refrigerantId?: 'R449A',
  //                         capacityKwHint?: 28,
  //                         onPick: ({mode:'class'|'manual', model}) => {} })
  let equipmentData = null;
  async function openEquipmentSelector(opts) {
    if (!equipmentData) equipmentData = await getData('data-equipment');
    const data = equipmentData[opts.kind];
    if (!data) return;
    const fieldsByKind = {
      evaporators: [
        { key: 'pumpdownKg', label: 'Pumpdown charge (kg)', step: 0.1, min: 0, max: 100 },
        { key: 'capacityKw', label: 'Capacity (kW)', step: 0.1, min: 0, max: 1000 },
        { key: 'fanW', label: 'Fan power (W)', step: 10, min: 0, max: 20000 }
      ],
      condensingUnits: [
        { key: 'factoryChargeKg', label: 'Factory pre-charge (kg)', step: 0.5, min: 0, max: 1000 },
        { key: 'receiverL', label: 'Receiver volume (L)', step: 1, min: 0, max: 5000 },
        { key: 'capacityKw', label: 'Nominal capacity (kW)', step: 0.5, min: 0, max: 5000 },
        { key: 'powerKw', label: 'Power input (kW)', step: 0.1, min: 0, max: 1000 }
      ]
    };
    const manualFields = fieldsByKind[opts.kind] || [];
    const heading = opts.kind === 'evaporators' ? 'Choose an evaporator' : 'Choose a condensing unit';

    let modal = document.getElementById('izhar-equip-modal');
    if (modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'izhar-equip-modal';
    modal.className = 'calc-modal';
    modal.innerHTML = `
      <div class="calc-modal-card" style="max-width:820px;">
        <div class="calc-modal-head">
          <h3>${heading}</h3>
          <button class="calc-modal-close" aria-label="Close">×</button>
        </div>
        <div class="calc-modal-body">
          <div style="display:flex; gap:8px; margin-bottom:18px; padding:3px; background:var(--paper-2); border-radius:4px;" role="tablist">
            <button data-tab="class"  class="btn" style="flex:1; padding:10px; border-radius:3px; font-family:var(--font-mono); font-size:.82rem; letter-spacing:.04em; text-transform:uppercase; background:var(--ink); color:var(--paper);">Class-typical picker</button>
            <button data-tab="manual" class="btn" style="flex:1; padding:10px; border-radius:3px; font-family:var(--font-mono); font-size:.82rem; letter-spacing:.04em; text-transform:uppercase; background:transparent; color:var(--muted); border:0;">Manual datasheet entry</button>
          </div>

          <div data-pane="class">
            <p style="font-size:.85rem; color:var(--muted); margin-bottom:14px; line-height:1.55;">Pick a profile + capacity tier — values are class-typical for the major commercial brands (Bohn, Bitzer, Embraco, Kelvion). Final selection must be verified against your actual equipment datasheet.</p>
            <div id="izhar-equip-tree" style="display:grid; gap:8px;"></div>
          </div>

          <div data-pane="manual" style="display:none;">
            <p style="font-size:.85rem; color:var(--muted); margin-bottom:14px; line-height:1.55;">Enter values directly from your equipment datasheet. Use this for accuracy on engineering-grade projects.</p>
            <div id="izhar-equip-manual" style="display:flex; flex-direction:column; gap:12px;">
              ${manualFields.map(f => `
                <div class="calc-field" style="grid-template-columns: minmax(0, 200px) minmax(0, 1fr);">
                  <label class="calc-field-label">${f.label}</label>
                  <input class="calc-num" type="number" data-mfield="${f.key}" min="${f.min}" max="${f.max}" step="${f.step}" placeholder="from datasheet">
                </div>
              `).join('')}
              <div class="calc-field" style="grid-template-columns: minmax(0, 200px) minmax(0, 1fr);">
                <label class="calc-field-label">Notes (optional)</label>
                <input class="calc-num" type="text" data-mfield="notes" placeholder="e.g. Bohn ADT063, Bitzer 4FES-3Y">
              </div>
              <button type="button" id="izhar-equip-manual-apply" class="btn btn-primary" style="margin-top:8px; align-self:flex-end;">Apply manual values</button>
            </div>
          </div>

          <p style="font-size:.7rem; font-family:var(--font-mono); color:var(--muted); margin-top:18px; padding-top:14px; border-top:1px solid var(--line-2); line-height:1.5;">
            <strong>Disclaimer:</strong> Class-typical values for engineering reference only. Final equipment selection and refrigerant charge must be verified against the actual manufacturer datasheet at procurement. Izhar Foster does not warrant any specific number until a procurement-grade selection is performed by a qualified refrigeration engineer.
          </p>
        </div>
      </div>`;
    document.body.appendChild(modal);

    const closeModal = () => modal.classList.remove('is-open');
    modal.querySelector('.calc-modal-close').onclick = closeModal;
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };

    // Tab switcher
    const tabs = modal.querySelectorAll('[data-tab]');
    tabs.forEach(t => t.onclick = () => {
      tabs.forEach(x => {
        const active = x.dataset.tab === t.dataset.tab;
        x.style.background = active ? 'var(--ink)' : 'transparent';
        x.style.color = active ? 'var(--paper)' : 'var(--muted)';
      });
      modal.querySelectorAll('[data-pane]').forEach(p => {
        p.style.display = p.dataset.pane === t.dataset.tab ? 'block' : 'none';
      });
    });

    // Render tree of profiles + tiers
    const tree = modal.querySelector('#izhar-equip-tree');
    data.profiles.forEach(prof => {
      // Filter tiers by refrigerant compatibility if hinted
      const tiers = (opts.refrigerantId)
        ? prof.tiers.filter(t => t.refrigerants && t.refrigerants.includes(opts.refrigerantId))
        : prof.tiers;
      if (tiers.length === 0) return;
      const profDiv = document.createElement('div');
      profDiv.style.cssText = 'border:1px solid var(--line); border-radius:4px;';
      profDiv.innerHTML = `
        <button type="button" class="izhar-equip-profile" style="width:100%; text-align:left; padding:12px 14px; background:transparent; border:0; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-family:var(--font-display); font-weight:600; font-size:.95rem; color:var(--ink);">${prof.name}</div>
            <div style="font-size:.78rem; color:var(--muted); margin-top:2px;">${prof.description}</div>
          </div>
          <span style="font-family:var(--font-mono); color:var(--t-warm); font-size:1rem;" data-arrow>▶</span>
        </button>
        <div data-tier-list style="display:none; padding:0 14px 12px; gap:6px; flex-direction:column;"></div>
      `;
      const list = profDiv.querySelector('[data-tier-list]');
      const arrow = profDiv.querySelector('[data-arrow]');
      profDiv.querySelector('.izhar-equip-profile').onclick = () => {
        const open = list.style.display === 'flex';
        list.style.display = open ? 'none' : 'flex';
        arrow.textContent = open ? '▶' : '▼';
      };
      // Auto-expand if a tier matches the capacityKwHint
      let autoExpand = false;
      tiers.forEach(t => {
        const tierBtn = document.createElement('button');
        tierBtn.type = 'button';
        const isHinted = opts.capacityKwHint && opts.capacityKwHint >= t.capacityKwLow && opts.capacityKwHint <= t.capacityKwHigh;
        if (isHinted) autoExpand = true;
        tierBtn.style.cssText = `text-align:left; padding:10px 14px; background:${isHinted ? 'rgba(227,106,30,.08)' : 'var(--paper-2)'}; border:1px solid ${isHinted ? 'var(--t-warm)' : 'var(--line-2)'}; border-radius:3px; cursor:pointer; font-family:var(--font-mono); font-size:.82rem; color:var(--ink); display:grid; grid-template-columns: 90px 1fr auto; gap:14px; align-items:center;`;
        const refList = (t.refrigerants || []).join(' · ');
        tierBtn.innerHTML = `
          <strong style="color:${isHinted ? 'var(--t-warm)' : 'var(--ink)'};">${t.label}</strong>
          <span style="color:var(--ink-2);">${t.capacityKwLow}–${t.capacityKwHigh} kW · ${refList}</span>
          <span style="color:var(--t-warm); font-weight:500;">${opts.kind === 'evaporators' ? `${t.pumpdownKg} kg pumpdown` : `${t.factoryChargeKg} kg pre-charge`}</span>
        `;
        tierBtn.onclick = () => {
          const picked = {
            mode: 'class',
            profileId: prof.id,
            profileName: prof.name,
            tierId: t.id,
            tierLabel: t.label,
            capacityKwMid: (t.capacityKwLow + t.capacityKwHigh) / 2,
            capacityKwLow: t.capacityKwLow,
            capacityKwHigh: t.capacityKwHigh,
            ...t
          };
          opts.onPick(picked);
          closeModal();
        };
        list.appendChild(tierBtn);
      });
      if (autoExpand) {
        list.style.display = 'flex';
        arrow.textContent = '▼';
      }
      tree.appendChild(profDiv);
    });

    // Manual apply
    modal.querySelector('#izhar-equip-manual-apply').onclick = () => {
      const out = { mode: 'manual' };
      manualFields.forEach(f => {
        const inp = modal.querySelector(`[data-mfield="${f.key}"]`);
        const v = inp.value === '' ? null : parseFloat(inp.value);
        if (v != null && isFinite(v)) out[f.key] = v;
      });
      const notes = modal.querySelector('[data-mfield="notes"]').value.trim();
      if (notes) out.notes = notes;
      opts.onPick(out);
      closeModal();
    };

    modal.classList.add('is-open');
  }

  // ---------- Wire shared chrome (Open / Save / Print PDF) ----------
  // wireToolChrome({ toolId, toolNumber, toolName, serialize: ()=>{...}, deserialize: (data)=>{...}, buildPDF: ()=>({sections,math,sources}) })
  function wireToolChrome(opts) {
    const open = document.getElementById('job-open');
    const save = document.getElementById('job-save');
    const print = document.getElementById('job-print');
    // Email CTA: mirror the quote summary
    const ctaEmail = document.getElementById('cta-email');
    const ctaQuote = document.getElementById('cta-quote');
    if (ctaEmail && ctaQuote) {
      // Sync mailto: from cta-quote summary every time it changes
      const update = () => {
        try {
          const url = new URL(ctaQuote.href, location.href);
          const summary = url.searchParams.get('summary') || `${opts.toolName} calculation`;
          ctaEmail.href = mailtoUrl(opts.toolName, summary, summary);
        } catch (e) { ctaEmail.href = mailtoUrl(opts.toolName, opts.toolName, opts.toolName); }
      };
      update();
      // Patch ctaQuote's href setter — wrap with a MutationObserver-free polling on click
      const obs = new MutationObserver(update);
      obs.observe(ctaQuote, { attributes: true, attributeFilter: ['href'] });
    }
    if (open) open.addEventListener('click', async () => {
      try {
        const data = await openJsonFile();
        if (data && data.tool === opts.toolId) opts.deserialize(data);
        else if (data) alert(`This file is for ${data.tool || 'another tool'}, not ${opts.toolId}.`);
      } catch (e) { /* user cancelled */ }
    });
    if (save) save.addEventListener('click', () => {
      const payload = { tool: opts.toolId, version: 1, savedAt: new Date().toISOString(), ...opts.serialize() };
      const safeName = (payload.projectName || opts.toolId).toString().replace(/\s+/g, '-').toLowerCase();
      saveJson(`${opts.toolId}-${safeName}.json`, payload);
    });
    if (print) print.addEventListener('click', () => {
      const built = opts.buildPDF();
      generatePDF({
        toolNumber: opts.toolNumber,
        toolName: opts.toolName,
        projectName: built.projectName,
        sections: built.sections,
        math: built.math,
        sources: built.sources
      });
    });
    // Methodology panel — appended automatically inside the result aside if not present
    appendMethodologyPanel(opts);
    // Active project session banner — shown if user came from project.html
    renderProjectSessionBanner(opts);
  }

  function renderProjectSessionBanner(opts) {
    const sess = getProjectSession();
    if (!sess) return;
    if (document.getElementById('izhar-proj-session')) return;

    const titlebar = document.querySelector('.calc-titlebar');
    if (!titlebar) return;

    const banner = document.createElement('div');
    banner.id = 'izhar-proj-session';
    banner.style.cssText = 'display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 18px; background:linear-gradient(90deg, var(--t-warm) 0%, #f08544 100%); color:white; font-family:var(--font-mono); font-size:.86rem;';
    const editingLabel = Number.isInteger(sess.editingZoneIndex)
      ? `Editing zone ${sess.editingZoneIndex + 1} of`
      : 'Adding zone to';
    banner.innerHTML = `
      <div style="flex:1;">
        <strong style="color:white;">${editingLabel}:</strong>
        <span style="opacity:.95;">${sess.projectName || 'Untitled project'}</span>
      </div>
      <div style="display:flex; gap:8px; flex-shrink:0;">
        <button type="button" id="proj-sess-cancel" class="btn btn-sm" style="background:rgba(255,255,255,.15); color:white; border:1px solid rgba(255,255,255,.3);">Cancel</button>
        <button type="button" id="proj-sess-attach" class="btn btn-sm" style="background:white; color:var(--t-warm); border:0; font-weight:600;">Attach &amp; return to project →</button>
      </div>
    `;
    titlebar.parentNode.insertBefore(banner, titlebar.nextSibling);

    document.getElementById('proj-sess-cancel').addEventListener('click', () => {
      if (!confirm('Discard this calculation and return to the project? It will not be attached.')) return;
      setProjectSession(null);
      window.location.href = sess.returnUrl || '../tools/project.html';
    });
    document.getElementById('proj-sess-attach').addEventListener('click', () => {
      const built = opts.buildPDF();
      const payload = {
        tool: opts.toolId,
        projectName: built.projectName,
        hash: location.hash,
        dims: built.dims || null,
        ...opts.serialize()
      };
      attachSystemToProject(payload);
      setProjectSession(null);
      window.location.href = sess.returnUrl || '../tools/project.html';
    });
  }

  function appendMethodologyPanel(opts) {
    const result = document.querySelector('.calc-result');
    if (!result || result.querySelector('.calc-methodology')) return;
    const built = opts.buildPDF();
    const sources = built?.sources || [];
    if (sources.length === 0) return;
    const det = document.createElement('details');
    det.className = 'calc-methodology';
    det.style.cssText = 'margin-top:18px; padding:14px 16px; background:var(--paper-2); border:1px solid var(--line-2); border-radius:4px;';
    det.innerHTML = `
      <summary style="cursor:pointer; font-family:var(--font-mono); font-size:.78rem; letter-spacing:.08em; text-transform:uppercase; color:var(--ink); list-style:none;">
        <span style="color:var(--t-warm); font-weight:600;">▸</span> Methodology &amp; citations
      </summary>
      <div style="margin-top:14px; padding-top:14px; border-top:1px solid var(--line-2);">
        <p style="font-size:.84rem; color:var(--muted); margin:0 0 10px; line-height:1.6;">This calculator implements the following standards. Each result is reproducible from public sources.</p>
        <ul style="font-size:.82rem; color:var(--ink-2); padding-left:18px; line-height:1.65; margin:0;">
          ${sources.map(s => `<li style="margin-bottom:4px;">${s}</li>`).join('')}
        </ul>
        <p style="font-size:.74rem; color:var(--muted); margin-top:14px; font-family:var(--font-mono);">Cross-validated within ±20% of Heatcraft NROES, Copeland AE-103, Danfoss Coolselector®2, Bitzer Software, UVM ageng, Engineering Mindset.</p>
      </div>`;
    // Open on click toggles arrow rotation
    det.addEventListener('toggle', () => {
      const arrow = det.querySelector('summary span');
      if (arrow) arrow.textContent = det.open ? '▾' : '▸';
    });
    // Insert before the disclaimer
    const disclaimer = result.querySelector('.calc-disclaimer');
    if (disclaimer) result.insertBefore(det, disclaimer);
    else result.appendChild(det);
  }

  return {
    setUnitSystem, getUnitSystem,
    conv, fmt,
    getData,
    readState, writeState,
    quoteUrl, whatsappUrl, mailtoUrl, copyShareLink,
    countUp, showGlossary,
    openEquipmentSelector,
    saveJson, openJsonFile, generatePDF, openJobTypeChooser,
    wireToolChrome,
    getProjectSession, setProjectSession, attachSystemToProject
  };
})();

window.Izhar = Izhar;
