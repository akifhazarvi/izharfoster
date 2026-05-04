# Izhar Foster — Claude Code Instructions

## Active growth plan — read before making changes

**The canonical roadmap is [GROWTH-PLAN.md](GROWTH-PLAN.md).** Source-of-truth resolutions for conflicting facts are in [DECISIONS.md](DECISIONS.md). Both files are checked into the repo and referenced by every PR.

**Day-to-day work queue: [DAILY-TASKS.md](DAILY-TASKS.md)** — sequenced by impact÷effort, with done/not-done markers. Always update it when you ship a task.

**Priority pillars (grow):** Cold Stores · PIR Sandwich Panels (FireSafe PIR) · Refrigeration Systems
**Secondary:** CA Stores · Insulated Doors · Refrigerated Vehicles · CEA Greenhouses
**Deprioritize (keep on site, low visibility):** Plant Factories · Smart Cabins · Prefabricated Steel Buildings (PEB)

**Headline diagnosis:** impressions-rich, click-poor (5,490 clicks / 179,453 impressions / pos 21.7 over 16 months). Growth lever is CTR on existing rankings, not new keywords. Pharmaceutical cold storage is the single biggest opportunity (16,740 imp, pos 59).

**Active commitments:**
- Website remodel to lead with cold-store funnel (see GROWTH-PLAN §13)
- Cost Calculator (Tool 8) integration on top of existing 7 calculators (see GROWTH-PLAN §14)
- 14 named case studies queued (5 from Downloads/, 9 from brochure)
- λ value standardised to 0.022 W/m·K (BS EN 14509 aged) across site, llms.txt, and schema
- "FireSafe PIR" sub-brand adopted

When picking work, every PR title should reference a GROWTH-PLAN section. Do not drift.

---

## Project overview

Premium redesign of izharfoster.com — Pakistan's largest sandwich panel manufacturer and cold-chain provider since 1959 (division of Izhar Engineering). Static HTML + CSS + vanilla JS. **No build step.** Served via `python3 -m http.server 8090` from `~/projects/izharfoster/`. Port 8080 is taken by a separate project — always use 8090. Vercel deploys directly from `main`.

## Architecture

```
izharfoster/
├── index.html                  # Homepage (approved — do not regress)
├── about.html · contact.html · faqs.html · clients.html · projects.html · blog.html
├── tools.html                  # Engineering calculator suite index
├── sitemap.xml · robots.txt · llms.txt
├── vercel.json · .vercelignore · package.json · DEPLOY.md
│
├── services/                   # 6 product pages
│   ├── cold-stores.html
│   ├── pir-sandwich-panels.html
│   ├── refrigeration-systems.html
│   ├── prefabricated-structures.html
│   ├── ca-stores.html
│   └── insulated-doors.html
│
├── blog/                       # 9 long-form posts
│   ├── cold-storage-solutions-pakistan-demand-rising.html
│   ├── pir-panels-thermal-efficiency-smart-building.html
│   ├── refrigeration-systems-cold-chain-pakistan.html
│   ├── ca-stores-game-changer-pakistan-agriculture.html
│   ├── insulated-doors-energy-efficiency-cold-storage.html
│   ├── prefabricated-structures-smart-construction-pakistan.html
│   ├── green-refrigeration-energy-carbon-footprint.html
│   ├── cold-storage-pakistan-export-growth.html
│   └── insulated-industrial-doors-types-benefits-guide.html
│
├── tools/                      # Engineering calculator suite (post-launch)
│   ├── project.html            # Multi-system project shell
│   ├── load-calculator.html    # Tool 1 — ASHRAE Ch. 24
│   ├── energy-cost.html        # Tool 2 — A vs B panel comparison
│   ├── a2l-room-area.html      # Tool 3 — IEC 60335-2-89:2019
│   ├── refrigerant-charge.html # Tool 4 — NIST REFPROP densities
│   ├── condenser-sizing.html   # Tool 5 — ASHRAE Ch. 35 + NEW JOB chooser
│   ├── capacity-planner.html   # Tool 6 — 24 PK crops, 3D visualiser
│   └── ca-atmosphere.html      # Tool 7 — USDA Handbook 66
│
├── js/
│   ├── main.js                 # Scrubber + counters + rail pin
│   └── tools/
│       ├── _shared.js          # Izhar global; unit conversion, PDF, save/open, project session
│       ├── visualiser.js       # IzharViz; 3D model-viewer mount + heat-flow overlay
│       ├── <tool>.js           # one per tool
│       └── data-*.json         # 12 data files (refrigerants, cities, panels, crops, equipment...)
│
├── css/
│   ├── style.v2.css            # Full design system (~5800 lines) — THE LIVE STYLESHEET. Every HTML page links this. Legacy `style.css` was deleted; do not recreate it.
│   └── consultant.css          # Cold Consultant drawer (linked from CTAs)
│
└── images/
    ├── *.jpg / *.png / *.webp  # Curated production photography
    └── applications/           # 15 K-RP application tiles for Tool 1
```

`_scrape/` (39 MB) — full scrape of legacy site (gitignored).
`_kr_scrape/` (research + audits) — K-RP teardown, RESEARCH.md, VALIDATION.md, CROSS-VALIDATION.md, GAP-AUDIT.md, E2E-AUDIT.md, mobile-deep-audit/ (gitignored).

## Critical rules — never regress

### CSS layout

| Rule | Why | Where |
|---|---|---|
| Grid columns must use `minmax(0, Nfr)` not bare `Nfr` | Children with long text collapse otherwise | every `grid-template-columns` |
| Rail is `position: fixed` — never inside a grid | Double-counts width and breaks responsive | `.rail` + `.shell` |
| `html` and `body` both have `overflow-x: clip` + `max-width: 100vw` | Stops phantom scroll from off-screen drawers (`.cc-panel`, `.calc-modal`) without breaking sticky | `style.v2.css` reset |
| `img, video, iframe, svg { max-width: 100%; height: auto }` global | Belt-and-braces for rich content | `style.v2.css` reset |
| Header phone + brand-tag must `white-space: nowrap; flex-shrink: 0` | Layout breaks on narrow tablets | `.nav-phone`, `.nav-cta` |
| Italic gradient text needs `padding-right: .14em` + `display: inline-block` | `-webkit-background-clip: text` clips italic tails — "cold" → "cola" | `.em` |

### Mobile breakpoints

The site uses a 4-breakpoint scheme:
- **≤480 px** — iPhone SE; nav-CTA collapses to a 36×36 ember pill, hero rules tighten
- **≤720 px** — phones in general; rail hides, hamburger appears, calc-grid stacks
- **≤900 px** — small tablets / large phones landscape; calc-grid switches to single column
- **≤1100 px** — narrow desktop / iPad; rail shrinks to 56 px, hero/scrub stacks

**Tap targets ≥44×44 px** (WCAG 2.5.5). Body text ≥14 px on mobile. Footer links must use `padding: 8px 0` to reach 36+ px tall.

### Path depth for assets

- Root pages (`about.html` etc.): `css/style.v2.css`, `js/main.js`, `images/`
- Subdirectory (`services/`, `blog/`, `tools/`): `../css/style.v2.css`, `../js/main.js`, `../images/`

## Engineering calculator suite

7 tools + project shell, all client-side, no backend. Cross-validated within ±20% of Heatcraft NROES, Copeland AE-103, Bitzer Software, Coolselector®2.

**Authoritative engineering math** lives in:
- `js/tools/load-calculator.js` — ASHRAE Ch. 24 5-component method
- `js/tools/condenser-sizing.js` — THR factor + ambient derate (MT 2.0%/K, LT 2.7%/K)
- `js/tools/a2l.js` — IEC 60335-2-89:2019 leakable charge
- `js/tools/refrigerant-charge.js` — NIST REFPROP saturated-liquid densities

**Engineering constants — verified against ASHRAE / IEC / NIST. Don't change without a citation.**
- Strip-curtain F_Protection = **0.10** (ASHRAE Ref Ch. 24 — F=0.9 reduction). Was wrong at 0.5 originally.
- Air-curtain F_Protection = 0.50.
- Above-grade floor uses **ambient air** as boundary (not soil 18°C); on-grade and insulated-slab use 18°C soil.
- Bare-concrete floor U = **0.7 W/m²K** (concrete + screed over compacted earth, with 18°C soil sink already capturing ground coupling).
- Buoyancy F_m by box temp: 1.0 (cooler) → 1.20 (−10°C) → 1.45 (−25°C) → 1.55 (≤−30°C).
- Condenser ambient derate: MT 2.0%/K, LT 2.7%/K, hard floor 0.6 (60%).
- Door geometry tracked but does NOT scale ACH-24 (already empirical).

**Shared chrome** (`Izhar.wireToolChrome` in `_shared.js`) auto-injects:
- Save (.json) / Open (.json) / Print PDF buttons in the titlebar
- Email CTA mirroring the quote summary
- Methodology + citations panel below the result aside
- Project-session banner if user came from `tools/project.html`

**Project shell** (`tools/project.html`):
- "Add System" → set `localStorage.izhar_active_project_session` → tool detects → orange banner "Adding zone to: <name>" → "Attach & return" writes back to `localStorage.izhar_project.systems[]`.
- Edit zone reopens tool with hash + `editingZoneIndex` so attach overwrites.
- Aggregate roll-up uses `raw.capacityKw` from each saved system.

## Brand system

See [DESIGN.md](DESIGN.md) for the full visual specification. Locked palette / type / spacing — do not change without explicit instruction.

---

## Token discipline — read before any non-trivial task

This repo has 23+ static HTML pages, ~3,900 lines of CSS, ~30 JS files, and a `_scrape/` directory of 39 MB. Reading "everything" once will burn 100k+ tokens and leave nothing for the actual work. The rules below are not optional.

### The 5 token rules

1. **Read what you'll edit, not what you might edit.** Use `Read` on the specific file(s) the task names. Use `Grep` to confirm a pattern exists before opening a second file. Never `Read` a file >800 lines without an `offset/limit` window unless the task is a full-file rewrite.

2. **`_scrape/`, `_kr_scrape/`, `_audit/`, `_scrape_coldstore/` are gitignored research dumps — never read them in full.** If you need a fact from them, `Grep` for the keyword and read only the matched window. These directories exist to be searched, not loaded.

3. **Reuse the architecture diagram in this file as the file-finder.** The directory tree above already names every page, tool, JS module, and CSS file. When the user says "the cold stores page" or "Tool 6", resolve to the path from the tree — do NOT `Glob` or `find` to discover it.

4. **One pass per concern.** Edit, verify, ship. Don't re-read the file you just edited unless a tool error suggests the diff failed. The Edit tool returns enough confirmation.

5. **Stop reading when the answer is in DECISIONS.md, GROWTH-PLAN.md, ACTION-PLAN.md, or DAILY-TASKS.md.** Those four files are the source of truth for facts (λ value, partner names, priority pillars, work queue). Reading the actual HTML pages to "double-check" a fact those files already canonicalise is duplicate work.

### Cheap vs expensive operations (rough token cost)

| Operation | Cost | When to use |
|---|---|---|
| `Grep` with `-l` (filenames only) | ~50 tok | Finding which files contain a string |
| `Grep` with `-c` (count) | ~50 tok | "Is this pattern used widely?" |
| `Grep` with `-n` + small `head_limit` | ~200-500 tok | Locating exact lines before editing |
| `Read` with `offset` + `limit` | ~200-1500 tok | Reading the specific section you need |
| `Read` whole file (<300 lines) | 1-3k tok | Editing across the whole file |
| `Read` whole file (300-1500 lines) | 3-15k tok | Justified only for full rewrites |
| `Read` whole file (>1500 lines) | 15k+ tok | **Stop. Use `offset/limit`.** |
| Spawning a subagent | 10-30k tok minimum | Only when listed below |
| Reading a directory listing via `Bash ls` | ~100 tok | Confirming a path exists |
| `Glob` with broad pattern (`**/*.html`) | ~500 tok | Finding all pages of a type |
| `find` from `/` or huge tree | 5k+ tok | **Don't.** Search from `.` or the specific subtree. |

### Standard task algorithms (follow these literally)

These are the recipes for the recurring task types in this repo. Each is the lowest-token correct approach.

#### A. "Edit one HTML page" (e.g. ACTION-PLAN items)

```
1. Resolve the path from the architecture diagram (no Glob).
2. Grep -n for the unique anchor string near the edit site (~50 tok).
3. Read that file with offset = match - 5, limit = 30-60 lines (~500 tok).
4. Edit with old_string = the exact matched window.
5. If the same change applies to N pages, write a single Bash sed/awk one-liner
   instead of N Edit calls. Always preview with grep -l first to confirm the
   target set, then run the sed in place.
```

#### B. "Site-wide pattern fix" (e.g. async Google Fonts on every page)

```
1. Grep -lr 'fonts.googleapis.com' . --include='*.html'  → list of N files.
2. Read ONE representative file (limit 80 lines around the <head>) to confirm
   the exact pattern.
3. Run a single Bash sed -i over the whole list. Verify with a second
   grep that the count of old pattern is 0 and new pattern is N.
4. Spot-check 1 file with Read offset/limit. Do not re-read all N.
```

#### C. "New service or projects/case-study page"

```
1. Read the closest existing sibling (e.g. for projects/foo.html, read
   projects/bar.html) — limit 200 lines if needed.
2. Read DECISIONS.md only for the specific fact you need (offset/limit).
3. Write the new file with the same structure, schema block, and footer.
4. Add the URL to sitemap.xml (Edit, single line append before </urlset>).
5. Update DAILY-TASKS.md to mark [x] with the commit hash.
```

#### D. "GSC-driven content rewrite" (striking-distance fix)

```
1. The query, page, and target are already in GROWTH-PLAN §6 — re-read
   only that section (offset).
2. Grep -n for the H1 / title / meta description on the target page.
3. Read 40-line windows for each. Edit each with one call.
4. No need to read the page in full.
```

#### E. "Schema / JSON-LD edit"

```
1. Grep -n 'application/ld+json' on the target page.
2. Read the matched <script> block with offset/limit.
3. Edit just the property being changed. Do not rewrite the whole block.
4. If the change applies to many pages, use Bash sed for the literal value
   (e.g. telephone E.164) — sed handles JSON strings fine when you anchor
   on the unique key.
```

#### F. "Audit / research / unknown question"

```
1. Try Grep first. Most factual questions resolve in one Grep.
2. If you need to scan multiple files, use a subagent (see playbook below)
   — not 10 sequential Reads.
3. Always state the question to yourself in one sentence before searching.
   Vague searches return vague results and waste tokens.
```

### Subagent playbook — when to spawn, who to spawn, and what to ask

Subagents are expensive (10-30k tok floor) but they're the right tool when the alternative is reading 5+ files into the main context. The rule: **a subagent should reduce, not duplicate, the main thread's token spend.**

Each entry below = role · trigger · prompt template · expected return.

---

**🔍 Explore-agent (subagent_type: `Explore`)**
- **Role:** read-only locator for files, symbols, references.
- **Trigger:** "where does X live?", "which pages use Y?", "which case studies mention Z?"
- **Don't use for:** code review, design audits, anything requiring synthesis.
- **Prompt shape:**  
  *"Find all HTML files under `services/` and `projects/` that reference the partner brand 'Bitzer' or 'Heatcraft'. Return file paths + the exact line, quick search."*
- **Returns:** a punch list of paths + line numbers. Main thread does the edits.

---

**🧭 Plan-agent (subagent_type: `Plan`)**
- **Role:** architect — produces a step-by-step plan before code.
- **Trigger:** any task touching ≥3 files OR any new feature OR any change crossing CSS/JS/HTML boundaries (e.g. Cost Calculator integration).
- **Prompt shape:**  
  *"Plan the implementation for adding a quick-mode Cost Calculator embed to the homepage second-fold. Constraints: no build step; reuse existing `js/tools/_shared.js`; brand tokens from DESIGN.md. Output: file list with diffs described, step order, and rollback plan."*
- **Returns:** plan markdown. Main thread executes.

---

**🌐 SEO-content / SEO-technical / SEO-schema (subagent_type: `seo-content`, `seo-technical`, `seo-schema`)**
- **Role:** specialist auditors. Use exactly one at a time, against exactly one page or pattern.
- **Trigger:** "audit X", "check schema on Y", "is page Z citable by AI?"
- **Don't use for:** edits. They report; we ship.
- **Prompt shape:**  
  *"Run an E-E-A-T + AI citation readiness audit on `services/pharmaceutical-cold-storage.html`. Compare against ACTION-PLAN #13. Return: a bulleted gap list + the smallest passage that needs to be added/changed for citation. Under 400 words."*
- **Returns:** bullet list. Main thread edits.

---

**📊 SEO-google / SEO-dataforseo (subagent_type: `seo-google`, `seo-dataforseo`)**
- **Role:** live-data agents. They call Composio/DataForSEO MCP, return numbers.
- **Trigger:** "what's the current GSC position for X?", "which striking-distance queries moved this week?"
- **Prompt shape:**  
  *"Pull last-7-day GSC data via Composio for the queries listed in GROWTH-PLAN §6. Return a delta table: query · pos before · pos now · clicks delta. Under 300 words."*
- **Returns:** numbers table. Main thread decides what to ship.

---

**📝 SEO-image-gen / Visual-designer (subagent_type: `seo-image-gen`, `visual-designer`)**
- **Role:** generate OG / social / case-study images.
- **Trigger:** "make hero / OG image for X page" — only after copy is final.
- **Prompt shape:**  
  *"Generate a 1200×630 OG image for `services/refrigerated-vehicles.html`. Brand tokens: `--t-cold` `#0A1F3D`, `--t-warm` `#E36A1E`, JetBrains Mono for numbers. Subject: a refrigerated truck with the JetBrains-mono `−18°C` chip and the line 'Engineered cold. Since 1959.' No stock imagery feel."*
- **Returns:** path to image + alt-text suggestion.

---

**🎯 General-purpose agent (subagent_type: `general-purpose`)**
- **Role:** the catch-all. Use only when none of the specialists fit AND the task is open-ended enough that 3+ tool calls in the main thread would exceed a subagent's floor.
- **Trigger:** "compare brochure pp.31-39 to refrigeration page", "which 14 case studies are missing schema fields?"
- **Prompt shape:** must be **self-contained** — explain the goal, the constraints, the deliverable shape, and the word cap. The agent has no memory of this conversation.

---

### When NOT to spawn a subagent

- Single-file edit. Just do it.
- Reading a file under 300 lines. Just read it.
- A question DECISIONS.md / GROWTH-PLAN.md / ACTION-PLAN.md already answers.
- "Confirm X works" — that's a Bash test, not a subagent.
- Anything urgent (the user is watching). Subagents have latency.

### Parallel work

When two or more independent searches/reads are needed, **batch them into a single message with multiple tool calls**. Same applies to subagents that don't depend on each other. Sequential calls double wall-clock and don't save tokens.

### Background work

Use `run_in_background: true` for:
- Long Playwright runs in `_kr_scrape/` (CLS/LCP audits, mobile audits)
- `vercel deploy --prod` waits
- Any subagent whose result is not blocking the next step

Don't poll. The runtime notifies on completion.

### Self-check before each task

Before any non-trivial task, write down (in 1-2 sentences in your reply):
1. Which file(s) you'll edit (resolved path, not "the cold-stores page").
2. Which doc(s) you'll consult (specific section, e.g. "GROWTH-PLAN §6 only").
3. Whether a subagent is justified (default: no).

If you can't answer those three in two sentences, the task is underspecified — ask the user one targeted clarifying question instead of guessing.

## Audit + verification scripts

`_kr_scrape/` (gitignored) holds Playwright scripts:
- `mobile-deep-audit.mjs` — drives all 23 pages × 3 viewports, logs overflow / tap-targets / font sizes / dense sections
- `cls-lcp-audit.mjs` — measures CLS + LCP via PerformanceObserver
- `e2e-deep.mjs` — drives every tool with realistic Pakistan scenarios
- `audit-izhar.mjs` — quick smoke test: load every tool, capture screenshots, log console errors

Run from `_kr_scrape/` directory (Playwright is in `_kr_scrape/node_modules/`).

## What's not built yet

Tracked in [GROWTH-PLAN.md](GROWTH-PLAN.md) §10 (phasing). Highlights:

- **Cost Calculator (Tool 8)** — PKR cost estimator on top of the existing 7 calculators (GROWTH-PLAN §14)
- **14 case studies** — 5 from Downloads/ (TCCEC Coca-Cola, Naubahar Pepsi, Connect Logistics, Haier Lab, USAID Banana Ripening), 9 from brochure (Sharaf 50ft, Iceland Raiwand -28°C, HAC Agri 3000-ton, Gourmet, Emirates Logistics, Metro Ravi, United Snacks, Oye Hoye, Engro/Angro)
- **Pharmaceutical cold storage page rebuild** — biggest single GSC opportunity (16,740 imp, pos 59)
- **City landing pages** — `/cold-storage-karachi`, `/cold-storage-lahore`, `/cold-storage-multan`, `/cold-storage-faisalabad`
- **Industry vertical pages** — beverage, pharma, dairy, agri-export, 3PL logistics
- **Refrigerated Vehicles service page** — currently no page exists
- **Open Spec Sheet Library** (downloadable PDFs, no email gate)
- **HAC Agri 3,000-ton CA store floor plan PDF** (brochure pp.63-64)
- **Cold Map of Pakistan** (filterable interactive project map)
- **WhatsApp click-to-chat button** site-wide

Off-strategy capabilities (Plant Factories, Smart Cabins, full Prefab/PEB) stay on site but are visually demoted per GROWTH-PLAN §3.

## Deploy

```bash
git push origin main          # auto-deploys via Vercel
# or
vercel deploy --prod
```

`.vercelignore` excludes `_scrape/`, `_kr_scrape/`, `node_modules/`, internal docs (`CLAUDE.md`, `DESIGN.md`, `DEPLOY.md`), Playwright artefacts.
