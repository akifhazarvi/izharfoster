# Izhar Foster — Claude Code Instructions

## Active growth plan — read before making changes

**The canonical roadmap is [GROWTH-PLAN.md](GROWTH-PLAN.md).** Source-of-truth resolutions for conflicting facts are in [DECISIONS.md](DECISIONS.md). Both files are checked into the repo and referenced by every PR.

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
│   ├── style.css               # Full design system (~3900 lines)
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
| `html` and `body` both have `overflow-x: clip` + `max-width: 100vw` | Stops phantom scroll from off-screen drawers (`.cc-panel`, `.calc-modal`) without breaking sticky | `style.css` reset |
| `img, video, iframe, svg { max-width: 100%; height: auto }` global | Belt-and-braces for rich content | `style.css` reset |
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

- Root pages (`about.html` etc.): `css/style.css`, `js/main.js`, `images/`
- Subdirectory (`services/`, `blog/`, `tools/`): `../css/style.css`, `../js/main.js`, `../images/`

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
