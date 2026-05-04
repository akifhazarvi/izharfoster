# Izhar Foster — Daily Task List

**Last updated:** 2026-05-03
**Score baseline:** 78/100 (ACTION-PLAN.md, 2026-05-02)
**Canonical roadmap:** [GROWTH-PLAN.md](GROWTH-PLAN.md) | Resolved conflicts: [DECISIONS.md](DECISIONS.md)

Work top-to-bottom. Mark done with `[x]`. Each PR title must reference the GROWTH-PLAN section it implements.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| `[x]` | Shipped — commit exists |
| `[ ]` | Not started |
| `[~]` | In progress |
| `AP#N` | ACTION-PLAN.md item number |
| `GP§N` | GROWTH-PLAN.md section number |

---

## Week 1 (2026-05-03 → 09) — Strike-distance + trust signals

### Day 1 — Quick wins (≤2 hr total)

- [x] `AP#4` Add 74-word AI-citation passage to homepage hero (`index.html`) — commit `a9ca809`
- [x] `AP#5` Standardise all schema `telephone` to E.164 `+924235383543` — commit `7a81618`
- [x] `AP#6` Add `IndexNow:` directive to `robots.txt` — commit `7a81618`
- [x] `AP#9` Claim GBP, add Maps embed to `contact.html` + `cold-storage-lahore.html` — commit `bc78be6`
- [x] `AP#10` Add `openingHoursSpecification` to LocalBusiness schema — commit `7a81618`
- [x] `AP#11` Long-cache CSS/JS with versioned filenames + immutable headers in `vercel.json` — commit `f5ed784`
- [x] `AP#12` Static "How this calculator works" sections on all 8 tool pages — commit `a759232`
- [x] `AP#13` MKT equation + WHO PQS E003 + excursion protocol on pharma page — commit `c4d614a`
- [x] `AP#14` Expand 2 thin blog posts above 1,500 words — commit `c4d614a`
- [x] `AP#15` Move GA4 `gtag` block below `<meta charset>` + `<meta viewport>` — commit `a9ca809`
- [x] `AP#18` Add Karachi geo coordinates + `branchOf` schema to karachi page — commit `7a81618`

### Day 2 — Content + schema (3-4 hr)

- [ ] `AP#1` Link `/services/pharmaceutical-cold-storage` from homepage hero scrubber + products grid  
  **Files:** `index.html`  
  **Why:** 16,740 imp at pos 59 — no homepage internal-link equity flows to it yet.

- [ ] `AP#2` De-anonymise pharma page reference projects — name real clients or remove the placeholder entries  
  **Files:** `services/pharmaceutical-cold-storage.html`  
  **Options:** "Tier-1 multinational pharma, Karachi, 2023, 800 m³" or delete

- [ ] `AP#7` Fix `refrigerated-vehicles.html` og:image — replace pharma room image with `og-default.jpg`  
  **Files:** `services/refrigerated-vehicles.html`  
  **Why:** Wrong social preview; 5-min fix.

- [ ] `AP#8` Convert blog post `author` schema from `Organization` → `Person` (Muhammad Anwar Inayat) on top-3 posts  
  **Files:**  
  - `blog/cold-storage-cost-pakistan-2026-buyers-guide.html`  
  - `blog/cold-storage-solutions-pakistan-demand-rising.html`  
  - `blog/cold-storage-pakistan-export-growth.html`  
  **Why:** LLMs prefer human-attributed sources; also add one-line in-text bio.

- [ ] `AP#3` Async-load Google Fonts (`rel="preload"` + `onload`) on all pages  
  **Files:** all `<head>` blocks (13 services, 9 blog, 5 tools, root pages)  
  **Why:** 300–600 ms LCP gain on 3G; system-font fallbacks already exist.

### Day 3 — Striking-distance page rewrites (GP§6)

- [ ] **`GP§6 #1`** Rewrite `services/ca-stores.html` H1 + add factual abstract under H1  
  Current: pos 5.6, 0.2% CTR on "controlled atmosphere storage" (2,268 imp)  
  Action: one-sentence factual abstract para immediately under H1; add 12-month storage claim above fold

- [ ] **`GP§6 #2`** Rewrite `services/cold-stores.html` title + meta + add city-tag chips  
  Current: pos 8.9, 0.7% CTR on "cold storage" (3,556 imp)  
  Action: new `<title>` + `<meta description>` targeting "cold storage Pakistan"; add 5 city chips (Lahore, Karachi, Multan, Faisalabad, Islamabad) to hero trust band

- [ ] **`GP§6 #3 + #4`** Add price band table to PIR page + rewrite `<title>`  
  Current: pos 5.8, 0.9% CTR on "sandwich panel" (2,863 imp)  
  Action: 5-row thickness/U-value/price-band table (50–150 mm); quote-driven CTA; title → "FireSafe PIR Sandwich Panels — Pakistan Manufacturer | Izhar Foster"

---

## Week 2 (2026-05-10 → 16) — Trust band + content depth

### Day 4 — Homepage visual hierarchy (GP§13.2)

- [ ] Move Cold Stores card to **position 1** in homepage product grid (currently position 3–4)
- [ ] Add logo strip (Coca-Cola · Pepsi · Nestlé · Engro · Pak Army · Hyperstar) **above the fold** on homepage
- [ ] Add 4-chip trust band (1959 · 277,460 sqft · ISO 9001 · 2,100+ projects) to homepage hero
- [ ] Demote prefab / cabin / plant-factory cards to "Other capabilities" section below cold-chain trio

### Day 5 — Refrigeration + PIR depth (GP§4.2, GP§4.3)

- [ ] Add named partners table to `services/refrigeration-systems.html`: Zanotti · Heatcraft · LU-VE · Bitzer  
  **Source:** DECISIONS.md confirmed partners
- [x] Add PIR vs PU vs EPS comparison table with λ values to `services/pir-sandwich-panels.html` — already on page (line 138 spec table)
- [x] Add WHO-banned PU foam differentiation callout to PIR page hero — already on page (hero + body)
- [x] Add pentane blowing-agent callout (eco-friendly; 141B replacement) — already on page (hero + spec table)
- [x] Add industrial-construction depth section to `services/pir-sandwich-panels.html` (targets GSC orphan "construction using pir panels", 475 imp pos 19.1) — d78e440

### Day 6 — CA Stores depth (GP§4.4)

- [ ] Add ULO / ILOS / Swinglos (DCA) comparison table to `services/ca-stores.html`
- [ ] Name Fruit Control Italiana as CA equipment partner
- [ ] Add named equipment: GAC 5000, Swingtherm-BS, Fighter PSA nitrogen generators
- [ ] Extend crop callouts: mango (Sindh export), pomegranate (Balochistan), citrus

---

## Week 3 (2026-05-17 → 23) — Case studies batch 1 (GP§5)

5 case studies from `~/Downloads/` project folders. Each page: `projects/<slug>.html`, 600–800 words, `Article` schema, `mentions` for equipment partners, WebP-optimised photos.

- [ ] `projects/tccec-coca-cola-lahore.html` — Coca-Cola TCCEC Lahore (6 photos)
- [ ] `projects/naubahar-bottling-gujranwala.html` — Naubahar (Pepsi) Gujranwala (11 photos)
- [ ] `projects/connect-logistics-karachi.html` — Connect Logistics multi-temp (12 photos)
- [ ] `projects/haier-lab-lahore.html` — Haier climate-chamber lab (8 photos)
- [ ] `projects/usaid-banana-ripening-sindh.html` — USAID-funded banana ripening rooms (7 photos)

**Rules (DECISIONS.md):** No invented specs. If a fact is visible in a photo, describe it visually. Industry-standard ranges stated as context, not as the project's spec.

---

## Week 4 (2026-05-24 → 30) — Case studies batch 2 (GP§5)

9 case studies from brochure. Same template as Week 3.

- [ ] `projects/sharaf-logistics-50ft.html` — Sharaf Logistics 50-ft cold store
- [ ] `projects/iceland-cold-chain-raiwand.html` — Iceland Cold Chain −28°C
- [ ] `projects/hac-agri-bhai-pheru-3000ton.html` — HAC Agri 3,000-ton CA store + ammonia-glycol (+ floor plan PDF)
- [ ] `projects/gourmet-ice-cream-plant.html` — Gourmet IQF glycol-ammonia
- [ ] `projects/emirates-logistics-lahore.html` — Emirates Logistics multi-purpose
- [ ] `projects/metro-ravi-lahore.html` — Metro Ravi retail logistics
- [ ] `projects/united-snacks.html` — United Snacks cold storage
- [ ] `projects/oye-hoye-chips.html` — Oye Hoye CO2 control storage
- [ ] `projects/engro-angro-milk-collection.html` — Engro/Angro milk collection centre

---

## Month 2 — City landing pages (GP§4.1)

Each page: 800–1,200 words. Named local project, city-specific design notes, LocalBusiness schema with correct geo.

- [x] `cold-storage-lahore.html` — exists, has geo + Maps embed (commit `bc78be6`)
- [x] `cold-storage-karachi.html` — exists, has geo + branchOf (commit `7a81618`)
- [ ] `cold-storage-multan.html` — mango / dates / ASHRAE 50°C / MEPCO / HAC Agri tie-in (`AP#20`)
- [ ] `cold-storage-faisalabad.html` — dairy belt / Interloop / FESCO (`AP#21`)

---

## Month 2 — Schema + SEO polish (AP#19-39)

- [ ] `AP#22` Image sitemap + video sitemap entries (`sitemap.xml`)
- [ ] `AP#23` Upgrade homepage schema subtype to `["LocalBusiness", "GeneralContractor"]`
- [ ] `AP#25` Name SGS (actual registrar) on `certifications.html`
- [ ] `AP#26` Service-page heroes → `<picture>` + multi-width WebP srcset (all 13 services)
- [ ] `AP#27` `llms.txt` polish — add vertical sub-pages, freshness line, flagship case studies block, fix λ annotation
- [ ] `AP#28` Case-study schema upgrade → `["Article","CaseStudy"]` with `industry`, `client` fields (all 14 in `projects/`)
- [ ] `AP#33` CLS hygiene — explicit width/height on 9 client-carousel SVGs; RAF on scrubber
- [ ] `AP#34` `<link rel="preload" as="font">` for heaviest Inter weights (after Google Fonts async fix)
- [ ] `AP#35` `speakable` schema on FAQ blocks (pharma + cost guide pages first)
- [ ] `AP#36` ImageObject + HowTo schema on hero images and calculator pages
- [ ] `AP#37` Find one press citation (Dawn / Express Tribune / USAID) for `projects.html` or `about.html`
- [ ] `AP#38` Crunchbase profile + add URL to homepage `sameAs`

---

## Month 3 — Cost Calculator (Tool 8) build (GP§14, DECISIONS.md §CEO)

Sequence fixed by DECISIONS.md:

1. [ ] Backend formulas + `js/tools/data-pricing.json` (PKR bands, placeholder ±20%, gitignore if sensitive)
2. [ ] Extend `energy-cost.js` with Pakistan city tariff table (LESCO / K-Electric / IESCO etc.)
3. [ ] Quick-mode UI (`tools/cost-calculator.html` skeleton, 10-second path)
4. [ ] Detailed-mode UI (3-step form at `/tools/cost-calculator`)
5. [ ] Margin slider (editable 0–50%, default 18%, persists in URL hash `#mp=18`) — DECISIONS.md CEO directive
6. [ ] PDF proposal template via existing `_shared.js` print pipeline
7. [ ] Lead-capture: 3 CTAs after result (PDF / Site Visit / WhatsApp Consultation) — NOT gated before result
8. [ ] Schema: `SoftwareApplication` + `FAQPage` + `HowTo` + `Action`
9. [ ] Homepage quick-mode embed (second fold, GP§13.2 block 3)
10. [ ] Preset deep-link URLs (`?preset=mango-multan-2000ton`) for case-study + city page CTAs

**Framing (DECISIONS.md):** Internal sales-engineer tool. Hero: "Cold store cost estimator — rough estimate · exact cost will differ." Disclaimer in yellow band on hero, result band, breakdown table, and every lead-capture summary.

---

## Backlog — do when relevant

- [ ] `AP#19` Wikipedia entity for Izhar Engineering / Izhar Foster (needs 4-6 third-party citations first)
- [ ] `AP#24` Review-collection CTA on `contact.html` footer (after GBP verified + first reviews in)
- [ ] `AP#29` PEC contractor registry citation — verify address/phone match, add URL to `sameAs`
- [ ] `AP#30` Vehicle hero photo for `services/refrigerated-vehicles.html` (once photo sourced)
- [ ] `AP#31` Wire `lastmod` to per-file git log (before site hits 100+ URLs)
- [ ] `AP#32` `noindex,nofollow` on `_scrape_coldstore/` HTML files (belt-and-braces)
- [ ] `AP#39` Industry vertical pages: beverage, dairy, agri-export, 3PL (GP§10 phase 2)
- [ ] Open Spec Sheet Library — downloadable PDFs with `DataDownload` schema (GP§10 month 3)
- [ ] HAC Agri floor-plan PDF download — confirm publication-readiness with user (DECISIONS.md #8)
- [ ] WhatsApp site-wide sticky pill (`.fab-wa`) on remaining pages not yet covered

---

## How to use this file

1. **Pick the first unchecked `[ ]` item** in the current week's section.
2. Read the referenced GROWTH-PLAN section and ACTION-PLAN item before writing code.
3. After each commit, mark the item `[x]` with the commit hash in a parenthetical.
4. Update "Last updated" at the top of this file in the same commit.
5. At the end of each week, move any incomplete items to the next week and add a note why they slipped.

**Every PR title format:** `Type: description (GROWTH-PLAN §N / ACTION-PLAN #N)`

---

## Completed log

| Date | Commit | Items |
|------|--------|-------|
| 2026-05-03 | `bc78be6` | AP#9 GBP entity link, geo coordinates, Maps embed |
| 2026-05-03 | `a9ca809` | AP#4 AI-citation passage, AP#15 GA4 head order, AP#2 (partial) pharma ref projects |
| 2026-05-03 | `f5ed784` | AP#11 long-cache versioned CSS/JS |
| 2026-05-03 | `c4d614a` | AP#13 pharma MKT+WHO PQS+excursion, AP#14 thin blog posts |
| 2026-05-03 | `a759232` | AP#12 static methodology on 8 tool pages |
| 2026-05-03 | `7a81618` | AP#5 E.164 schema, AP#6 IndexNow, AP#10 openingHours, AP#18 Karachi geo |
