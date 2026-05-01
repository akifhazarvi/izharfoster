# Izhar Foster — End-to-End Growth Plan

**Date:** 2026-04-30
**Goal:** Grow the **cold storage** business in Pakistan organically. Win Google + AI search. Build a funnel that converts. Use the brochure + 5 new project folders + GSC data as fuel.

**Inputs synthesised:**
- `_kr_scrape/SITE-VS-BROCHURE-AUDIT.md` — 525 lines, brochure → site coverage map
- `_kr_scrape/COMPETITOR-GEO-SCAN.md` — GEO baseline 81/100, AI citation diagnosis
- `_kr_scrape/GSC-RESEARCH.md` — heuristic priors (replaced by live data below)
- **GSC live: 5,490 clicks / 179,453 impressions over 16 months, avg position 21.7**
- `_kr_scrape/DECISIONS.md` — source-of-truth conflict resolutions
- 5 new project folders in `~/Downloads/`: TCCEC Coca-Cola Lahore, Naubahar Bottling (Pepsi) Gujranwala, Connect Logistics Karachi, Haier Lab Lahore, USAID Banana Ripening Sindh

---

## 0. The headline diagnosis

We are an **impressions-rich, click-poor** site. We rank but we don't convert the click. That's the entire growth lever.

| Metric | 16-month total | Diagnosis |
|---|---|---|
| Clicks | 5,490 | Healthy |
| Impressions | 179,453 | Strong |
| Avg position | **21.7** | Page 2-3 — most queries one move from page 1 |
| Avg CTR | 3.06% | **Half of healthy** for a B2B site |
| Pakistan share | 86% (4,720 clicks) | Geo focus correct |
| Mobile vs Desktop | 3,469 vs 1,999 clicks | Desktop ranks worse (pos 31 vs 11) — desktop is the leak |
| Branded share | 22% clicks / 11% impressions | Healthy non-branded discovery |

**The single highest-value action is improving CTR on existing rankings, not chasing new keywords.** Most of our impressions surplus is sitting at positions 5–15 with 0–3% CTR. Move them to position 1–4 with proper titles/H1s/snippets and we double traffic without writing a new page.

---

## 1. Top 10 findings that drive everything else

1. **Pharmaceutical cold storage is the biggest single opportunity.** `/cold-stores/pharmaceutical-cold-storage-solutions/` has **16,740 impressions** and only **27 clicks at position 59**. The query *"pharmaceutical cold storage"* alone has 2,729 impressions at position 68. We have the page; it ranks page 7. **Fix the page title/H1/intro and add proof.** Single biggest immediate win.

2. **"Cold storage" (the head term, 3,556 impressions, position 8.9, 0.7% CTR) is one bump from page 1.** A better title + factual abstract + city signal + CTA gets us ~150 incremental clicks/month from this one query.

3. **PIR panels are second-biggest opportunity.** `/pir-panels/` has 42,147 impressions, 1,273 clicks at position 18.5 with 3% CTR. The page exists but ranks too low. Top queries: *"sandwich panel" (2,863 imp pos 5.8), "sandwich panel price in pakistan" (2,411 imp pos 7.5), "pir panel" (2,144 imp pos 36)*.

4. **Controlled atmosphere is invisible despite ranking page 1.** *"Controlled atmosphere storage"* — 2,268 impressions, position 5.6, **0.2% CTR**. The page is loading slowly, has no Above-the-Fold answer, or its title doesn't match intent. **Highest CTR-leak opportunity on the site.**

5. **Off-strategy Prefab content is our highest-converting traffic.** `/prefabmodular-solutions/` is page #1 by clicks (1,658 clicks @ 14.6, 9% CTR). Top high-CTR queries are all prefab/houses (27%, 35%, 22% CTR). **Conflict: you said deprioritize prefab, but it's our SEO breadwinner.** We need to either (a) keep this traffic but redirect intent to cold-chain prefab use cases, or (b) accept the bleed and rebuild the cold-store funnel from scratch. Recommendation in §3.

6. **"Izhar Group" branded queries leak 3,500+ impressions.** *"izhar group" (2,010 imp pos 8.5 0.5% CTR), "izhar group of companies" (1,563 imp pos 10.7 0.4%), "izhar" (1,758 imp pos 9.8 0.1%)*. Searchers want the parent group, see results, don't click. We need a clear "Part of Izhar Group" band on every page that reassures the searcher they're in the right place.

7. **Desktop ranking is materially worse than mobile** (pos 31 vs 11). Suggests our desktop layout is competing poorly for SERP features (FAQ rich snippets, sitelinks). Mobile-first design has overshot — desktop needs richer above-the-fold content, more above-the-fold links, better internal linking density.

8. **5 new named cold-store projects in Downloads/ are all blue-chip and all currently on no page**: Coca-Cola TCCEC Lahore, Naubahar Bottling (Pepsi franchise) Gujranwala, Connect Logistics Karachi, Haier Lab Lahore, USAID Banana Ripening Sindh. Combined with brochure-named projects (Sharaf Logistics 50ft, Iceland Cold Chain Raiwand -28°C, HAC Agri 3,000-ton CA store, Gourmet Ice Cream, Emirates Logistics, Metro Ravi, United Snacks, Oye Hoye, Engro/Angro), that's **14 case-study pages we can build today** with photos and specs we already own.

9. **The brochure-supported atomic facts that are missing from site** — 277,460 sqft plant, 100+ engineers, 1,300 workers, ISO 9001 SGS-cert, Tekla/STAAD/MBS software, AISC/AWS/MBMA/AISI memberships, named partners (Zanotti, Heatcraft, Thermo King, LU-VE, Fruit Control, Hörmann, Cantek, Martek). These are exactly the facts AI engines love to cite. Adding them to `llms.txt` + `about.html` + relevant service pages is essentially free.

10. **GEO baseline is already 81/100.** We are in the top decile of Pakistani B2B sites for AI citation readiness. The remaining 19 points are: reconcile internal data inconsistencies (λ value, group company count), add `additionalProperty` JSON-LD for product specs, add a one-sentence factual abstract paragraph under each H1, name component-brand partners. **No structural overhaul needed — just precision edits.**

---

## 2. The funnel — how visitors should move through the site

Cold-storage buyers in Pakistan are **engineering-driven procurement personas** (operations director, factory engineer, owner). They evaluate over weeks, not minutes. Funnel design must respect that — pushing them to "Get Quote" too early loses them. We need three pre-quote conversion steps that build trust and gather intent.

### 2.1 The 5-stage funnel

```
   Stage              Goal                     Primary asset                     Conversion event
   ────────────────────────────────────────────────────────────────────────────────────────────
1. Discover     Show up on search/AI        Service pages, blog, llms.txt     Click to site
2. Believe      Trust within 8 seconds      Hero proof band, client logos     Scroll past hero
3. Educate      Match their problem         Pillar content, calculators       Spec sheet download / calc save
4. Commit       Spec their project          Case studies, capacity calc       Engineer call request
5. Quote        Hand off to sales           Quote form, WhatsApp              Quote submitted
```

### 2.2 Stage-by-stage execution

**Stage 1 — Discover.** Already strong (5k clicks, 81/100 GEO). Wins from §3 below.

**Stage 2 — Believe (within 8 seconds of landing).** This is where we leak hardest. Visitors land, scan, leave. The hero band on every priority page must answer four questions instantly:
- *Are these the right people?* → Logo: "Coca-Cola · Pepsi · Nestlé · Engro · Unilever · Pak Army · Hyperstar"
- *Are they real engineers?* → "1959 · 277,460 sqft plant · ISO 9001 · 1,500+ projects"
- *Do they do what I need?* → One-line factual H1 paragraph
- *Where do I go next?* → Two CTAs: "Get a quote" (primary) and "See live cold-store calculator" (secondary, low-friction)

**Stage 3 — Educate (the non-skipped middle).** Cold-storage buyers want to feel competent before they commit. The site already has the calculator suite — that's a huge moat — but it's buried in `/tools.html`. Surface it:
- Capacity Planner widget on `/services/cold-stores` ("How many m³ do you need?" → 30-second result → "Want our engineer to validate? Save your project →")
- Energy Cost A-vs-B widget on `/services/pir-sandwich-panels` ("See savings in PKR/year")
- Refrigerant charge calculator linked from the refrigeration page
Each calculator save → lead capture (email + project name).

**Stage 4 — Commit (proof).** This is where case studies do the work. A buyer building a 2,000-ton mango cold store in Multan needs to see: someone like me, with my problem, used Izhar, and it worked. Each new case study should be:
- One named client (Coca-Cola, Naubahar, Connect, Haier, USAID — bank these immediately)
- One or two named-magnitude figures (50-ft height, 3,000 tons, -28°C, 12-month storage)
- 4 photos minimum
- A "scope of supply" list (panels, refrigeration, doors, controls)
- A "lessons engineered in" paragraph (Pakistan-specific: 50°C summer ambient, voltage swings, generator integration)
- Same-sector "more like this" links (the Coca-Cola page links to the Pepsi page, etc.)

**Stage 5 — Quote.** Today the contact form lives on `/contact-us`. Add:
- WhatsApp click-to-chat button (Pakistan B2B is WhatsApp-first; this is the single highest-conversion channel for industrial sales in PK)
- Project-context fields: city, capacity m³, temperature setpoint, target year, decision stage. Pre-filled from calculator if user came that way.
- Auto-acknowledgement email with the relevant downloadable spec sheet attached.

### 2.3 Visual hierarchy on the homepage

Today's homepage is brand-led. To grow cold-store specifically, restructure the visual hierarchy around the **dominant intent**:

```
Above the fold
   ┌──────────────────────────────────────────────────────────────┐
   │  Hero: Engineered cold storage. Built in Pakistan since 1959. │
   │        [primary CTA: Get a quote]  [secondary: Try the cap-   │
   │        acity calculator]                                       │
   │        Logo strip: 9 blue-chip logos                          │
   │        Trust facts: 1959 · 277,460 sqft · ISO 9001 · 2,100+   │
   └──────────────────────────────────────────────────────────────┘

First scroll
   ┌──────────────────────────────────────────────────────────────┐
   │  3-card row: Cold Stores · PIR Panels · Refrigeration         │
   │  Each card: 1 photo, 1 sentence, 1 spec, 1 CTA                │
   └──────────────────────────────────────────────────────────────┘

Second scroll
   ┌──────────────────────────────────────────────────────────────┐
   │  Live calculator: "Estimate your cold-store capacity in 30s"  │
   │  (embedded simplified version of /tools/capacity-planner)     │
   └──────────────────────────────────────────────────────────────┘

Third scroll
   ┌──────────────────────────────────────────────────────────────┐
   │  Featured projects: 4-5 named cold-store case studies         │
   │  with photo + client + capacity + temperature                 │
   └──────────────────────────────────────────────────────────────┘

Fourth scroll
   ┌──────────────────────────────────────────────────────────────┐
   │  Industries served (segmented): Beverage · Pharma · Dairy ·   │
   │  Meat · Produce · Logistics · Government — each links to a    │
   │  vertical landing page                                        │
   └──────────────────────────────────────────────────────────────┘

Fifth scroll
   ┌──────────────────────────────────────────────────────────────┐
   │  Why us: 5 reasons (pentane PIR / engineering / partners /    │
   │  Pakistan-tuned designs / certifications)                     │
   └──────────────────────────────────────────────────────────────┘

Sixth scroll
   ┌──────────────────────────────────────────────────────────────┐
   │  Latest from blog (3 cards)                                    │
   │  CTA repeat: Quote / Calculator / WhatsApp                     │
   └──────────────────────────────────────────────────────────────┘
```

The current site has most of these blocks already — the change is **ordering, prominence, and CTAs**. Cold-stores moves to position 1 of the product grid, not 3 or 4. Calculator promotion moves up. Demoted prefab/cabin/plant-factory cards move below the fold.

### 2.4 User psychology levers (one per stage)

| Stage | Cognitive bias being used | Site mechanic |
|---|---|---|
| Discover | Brand familiarity | "Part of Izhar Group · since 1959" on every page footer + structured data |
| Believe | Social proof + authority | Coca-Cola/Pepsi/Pak Army logo wall above the fold, ASTM E84/ISO 9001/SGS badges |
| Educate | Reciprocity | Free calculators, free downloadable spec PDFs, free Cold Storage Guide for 144 commodities |
| Commit | Loss aversion | "Pakistan loses 40% of fruit and vegetable harvest annually to lack of cold storage" — make the cost of inaction concrete |
| Quote | Anchoring | Show capacity tiers (50 / 500 / 2,000 / 10,000 m³) so the buyer knows where they sit before pricing the call |

---

## 3. The off-strategy prefab dilemma

Hard truth: **prefab/modular content drives the most clicks today** (1,658 on `/prefabmodular-solutions/`, plus the high-CTR cluster of "prefabricated houses" / "prefab homes pakistan"). You said deprioritize. Three options:

**Option A — Keep prefab visible, redirect intent to cold-chain.** Rewrite `/services/prefabricated-structures.html` to lead with "Prefabricated cold-chain envelopes" — i.e. modular cold rooms, modular warehouses with PIR cladding, rather than houses. Keep the SEO juice, redirect the click to a cold-store-adjacent product. **Recommended.** Cost: 1 page rewrite, no traffic loss, intent shift.

**Option B — Hard demote.** Move prefab to `/services/prefabricated-structures` but remove it from main nav, footer prominence, and homepage grid. Accept a 30% traffic drop in 60 days but force authority into the cold-store cluster. **Not recommended** — losing 1,658 clicks kills our base and Google may interpret the demotion as topic drift.

**Option C — Split the brand narrative.** Two clear sections: "Cold chain" (the priority) and "Other capabilities" (where prefab sits visibly but secondarily). Most natural for a 65-year-old multi-product company. **Compromise option.**

**My recommendation: A + C.** Rewrite `/services/prefabricated-structures.html` to be cold-chain-led ("Prefabricated cold-chain buildings — built at our 277,460 sqft plant"), AND restructure the homepage so prefab sits in a visibly secondary "More capabilities" section below the cold-chain hero block.

---

## 4. The 6 priority pillars and what each needs

### 4.1 Cold Stores (the lead pillar)

**Current state:** `/services/cold-stores.html` exists, 1,040 visible words, position 12.5 with 4.1% CTR. Strong foundation.

**Actions:**
- Rewrite hero to lead with one-sentence factual abstract: *"Izhar Foster designs and installs industrial cold stores across Pakistan from −40°C blast freezers to +25°C ambient warehouses, with capacity from 50 to 10,000 m³, built with FireSafe PIR panels and matched ammonia / glycol / CDU refrigeration."*
- Add the 5 new project case-study links above the fold: TCCEC Coca-Cola, Naubahar Pepsi, Connect Logistics, Haier Lab, USAID Banana Ripening
- Embed a simplified Capacity Planner widget mid-page
- Add the CO2 transcritical / NH3-glycol indirect / freon CDU 3-architecture comparison table (currently prose only)
- Cross-link contextually: PIR panel envelope (3 in-prose links), matched refrigeration plant (3), insulated doors (2), CA stores for fruit (2)
- City sections: dedicated 200-word callouts for Karachi, Lahore, Multan, Faisalabad, Islamabad — each naming a project in that city if we have one

**City landing pages (Phase 2):** `/cold-storage-karachi`, `/cold-storage-lahore`, `/cold-storage-multan`, `/cold-storage-faisalabad`. Each 800–1200 words, real local references, city-specific design notes (Karachi humidity, Lahore power outages, Multan heat, Faisalabad agri season).

### 4.2 PIR Sandwich Panels (the differentiator)

**Current state:** `/services/pir-sandwich-panels.html`, 734 words, position 18.5. Underweight.

**Actions:**
- Adopt **"FireSafe PIR"** sub-brand throughout (decision logged)
- Add the page-18 thickness/U-value/R-value selector table (50/60/80/100/150 mm × 0.36/0.31/0.25/0.19/0.13 W/m²K). **Single highest-leverage on-page upgrade.**
- Reconcile λ to **0.022 W/m·K (BS EN 14509 declared aged value)** across this page, `index.html` chip, and `llms.txt` — pick one and propagate
- Resolve density 60 → 40-45 kg/m³, compressive >300 → >100 KPa per brochure (DECISIONS.md)
- Add fire test photo + caption (brochure p.19) — visual proof of B1/ASTM E84
- Add "PUF / sandwich panel / insulated panel" disambiguation paragraph for transliteration long tail
- Add PIR vs PU vs EPS comparison table with brochure-supported λ values
- Add the WHO-banned-PU-foam differentiation story as a hero callout
- Name pentane (eco-friendly) blowing agent prominently — call out 141B replacement

### 4.3 Refrigeration Systems

**Current state:** `/services/refrigeration-systems.html`, 1,395 words, strong page already.

**Actions:**
- Add named partners: Zanotti, Heatcraft, LU-VE, Bitzer, Copeland, Danfoss, Emerson — these brand-authority halos earn citations
- Convert the 3-architecture (Ammonia DX / Pumped / Glycol) prose into a comparison table with rows for refrigerant exposure / capex / efficiency / safety / best-application
- Add a Heatcraft rack-systems subsection (brochure p.31)
- Add the HAC Agri 3,000-ton ammonia-glycol case study link (with the floor-plan PDF download)
- Add a refrigerant phaseout decision matrix (R22 → R404A → R454C → R449A → R717 ammonia)

### 4.4 CA Stores

**Current state:** `/services/ca-stores.html`, 734 words, position 5.6 with 0.2% CTR — page 1 ranking but invisible.

**Why CTR is so bad:** the title and meta probably read generic. Let me inspect later, but the hypothesis is that the brand-led H1 isn't matching the intent.

**Actions:**
- Add a one-sentence factual abstract paragraph IMMEDIATELY under H1
- Add **12-month storage life** as the headline claim (brochure p.55) — this is the #1 procurement-relevant fact and currently absent
- Introduce **ULO / ILOS / Swinglos (DCA)** terminology with a 4-row comparison table
- Name **Fruit Control Italiana** as the equipment partner (highest-trust signal in CA)
- Add named-equipment subsections: GAC 5000 (analysis), Swingtherm-BS (catalytic ethylene removal), Intelligem IG (CO2 adsorption), Fighter/Bravo/Swan PSA nitrogen generators, oxygen scrubber
- Add the HAC Agri 3,000-ton case study + floor-plan PDF download (unique B2B asset)
- Crop-specific call-outs already present (apples, dates, kinnow) — extend to mango (Sindh export), pomegranate (Balochistan), citrus, stone fruit

### 4.5 Refrigerated Vehicles (currently no page)

Build `/services/refrigerated-vehicles.html`. Brochure pp.65–72 give us:
- Zanotti truck-size matrix (Direct Drive / Battery / Split / Underground / Monoblock / Trailer / Special)
- Thermo King T-Series 6,220W heat capacity with diesel/electric options
- Insulated truck body PIR construction (high-density foam, all 6 sides)
- "King of Cold" Zanotti positioning

### 4.6 Insulated Doors

**Current state:** `/services/insulated-doors.html`, 698 words, position 11.1 — close to page 1.

**Actions:**
- Add door-thickness selector table matched to room temperature
- Name Hörmann partnership for high-speed doors (brochure p.86)
- Add air-curtain vs strip-curtain decision matrix
- Add ROI calc: "A leaky door costs you X kWh/year"

---

## 5. The 14 case studies to build (Phase 1 priority)

5 from Downloads/ + 9 from brochure. Each = single page at `/projects/<slug>` with `Article` schema, `mentions` for partners, `image` per slide, capacity/temp/refrigerant/year specs.

| # | Slug | Source | Client | Capacity / Temp | Photos available |
|---|---|---|---|---|---|
| 1 | tccec-coca-cola-lahore | Downloads | Coca-Cola TCCEC Lahore | TBC — drive-in racking visible | 6 |
| 2 | naubahar-bottling-gujranwala | Downloads | Naubahar (Pepsi franchise) | TBC | 11 |
| 3 | connect-logistics-karachi | Downloads | Connect Logistics | TBC — multi-temp logistics | 12 |
| 4 | haier-lab-lahore | Downloads | Haier (electronics testing lab) | Climate chamber | 8 |
| 5 | usaid-banana-ripening-sindh | Downloads | USAID-funded farmer co-ops | Banana ripening rooms + cold storage | 7 |
| 6 | sharaf-logistics-50ft | Brochure p.33 | Sharaf Logistics | 50-ft tall cold store | 1 |
| 7 | iceland-cold-chain-raiwand | Brochure p.41 | Iceland Cold Chain | -28°C, 50-ft, Raiwand Road | 1 (dramatic) |
| 8 | hac-agri-bhai-pheru-3000ton | Brochure p.42 + 63-64 | HAC Agri | 3,000-ton CA store + ammonia-glycol plant | 1 + 2 floor plans |
| 9 | gourmet-ice-cream-plant | Brochure p.30 | Gourmet | Industrial ice cream, IQF, glycol-ammonia | 1 |
| 10 | emirates-logistics-lahore | Brochure p.34 | Emirates Logistics | Multi-purpose cold + airport | 1 |
| 11 | metro-ravi-lahore | Brochure p.40 | Metro Ravi | Retail logistics with full HVAC ductwork | 1 |
| 12 | united-snacks | Brochure p.37 | United Snacks | Snack-food cold storage | 2 |
| 13 | oye-hoye-chips | Brochure p.36 | Oye Hoye chips | Chip storage with humidifiers + CO2 control | 1 |
| 14 | engro-angro-milk-collection | Brochure p.54 | Engro/Angro | Milk collection centre | 2 |

**Each case study converts to schema.org Place + Article with `mentions` for the equipment partners** — this is how AI engines learn the partnership graph.

---

## 6. Striking-distance hit list (top 25)

Pages-1 push opportunities. Each is a query at position 5–15 with ≥150 impressions. These are the tactical fixes — title rewrites, intro paragraphs, schema additions — that move us from page 2 to page 1.

| # | Query | Imp | Pos | CTR | Action |
|---|---|---|---|---|---|
| 1 | controlled atmosphere storage | 2,268 | 5.6 | 0.2% | Rewrite CA-stores H1 + factual abstract; raise CTR to 5%+ |
| 2 | cold storage | 3,556 | 8.9 | 0.7% | Cold-stores page title/meta rewrite, add city-tag chips |
| 3 | sandwich panel price in pakistan | 2,411 | 7.5 | 3.8% | Add price band on PIR page; quote-driven CTA |
| 4 | sandwich panel | 2,863 | 5.8 | 0.9% | PIR page title rewrite |
| 5 | cold storage business in pakistan | 1,060 | 7.4 | 2.3% | Already a /blog page; add investment FAQ schema |
| 6 | cold store | 885 | 6.6 | 0.7% | Same as #2 |
| 7 | sandwich panels | 806 | 6.8 | 1.7% | Plural variant — handled by #3 |
| 8 | pu sandwich panel price in pakistan | 502 | 8.4 | 4.4% | Add PU-vs-PIR price band on PIR page |
| 9 | cold storage lahore | 487 | 6.4 | 3.1% | Build /cold-storage-lahore landing |
| 10 | cold store in pakistan | 389 | 5.2 | 2.6% | Cold-stores page already targets — improve meta |
| 11 | sandwich panels price in lahore | 348 | 6.8 | 3.4% | City-tagged price section on PIR page |
| 12 | cold storage in pakistan | 324 | 6.8 | 3.4% | Same as #10 |
| 13 | cold storage in lahore | 295 | 6.8 | 2.7% | Same as #9 |
| 14 | puf panel price in pakistan | 258 | 7.9 | 0.8% | Disambiguation paragraph on PIR page |
| 15 | cold storage for sale in pakistan | 245 | 6.8 | 4.9% | Quote CTA + financing FAQ |
| 16 | cold storage cost in pakistan | 242 | 7.4 | 5.8% | Already strong — promote on home |
| 17 | sandwich panel roof | 234 | 7.8 | 1.7% | Add roof-application section on PIR page |
| 18 | 4x8 sandwich panel price in pakistan | 233 | 8.5 | 1.3% | Add panel-size FAQ |
| 19 | sandwich panel in pakistan | 196 | 5.4 | 5.6% | Working — leave |
| 20 | nido prefabricated homes pakistan | 195 | 5.2 | 21.5% | Off-strategy — leave |
| 21 | eps panel price in pakistan | 167 | 5.6 | 7.2% | Working — but consider PIR upsell |
| 22 | ca store | 167 | 12.1 | 0.0% | Same as #1 |
| 23 | sandwich panel price in islamabad | 162 | 7.3 | 4.3% | City-tagged price section |
| 24 | cold storage near me | 157 | 11.7 | 1.9% | LocalBusiness schema upgrades |
| 25 | controlled atmospheric stores | 147 | 10.9 | 0.0% | CA page handles |

Implementation: **5–8 atomic edits** across `services/cold-stores`, `services/pir-sandwich-panels`, `services/ca-stores` move the bulk of this list. Single PR.

---

## 7. Content gap hit list (top 15)

High-impression queries with bad position (≥20) — these need NEW dedicated content or significantly expanded sections.

| # | Query | Imp | Pos | What to build |
|---|---|---|---|---|
| 1 | pharmaceutical cold storage | 2,729 | 68 | **Build dedicated `/services/pharmaceutical-cold-storage` rebuild** — currently exists at `/cold-stores/pharmaceutical-cold-storage-solutions/` (16,740 imp pos 59) — but content needs total rewrite around DRAP / WHO TRS 961 / IQ-OQ-PQ / 2-8°C MKT excursion / CRT 15-25°C |
| 2 | pir panel | 2,144 | 36 | Same as PIR-page rewrite — title + intro paragraph for "pir panel" exact match |
| 3 | pir sandwich panel | 1,596 | 26 | Same as above |
| 4 | controlled atmosphere | 1,587 | 22 | Section on CA page + dedicated H2 |
| 5 | blast freezing | 1,351 | 73 | Build `/blog/blast-freezing-pakistan-guide` (we already have a good blast-freezer-vs-blast-chiller post, but `blast freezing` as a noun is weak) |
| 6 | cold storage pharmaceutical products | 1,235 | 65 | Pharma rebuild |
| 7 | cold storage pharmacy | 1,207 | 68 | Pharma rebuild |
| 8 | pir panels | 1,058 | 25 | PIR page rewrite |
| 9 | cold storage for pharmaceuticals | 879 | 60 | Pharma rebuild |
| 10 | eps panel | 807 | 57 | Add EPS comparison section on PIR page (do not build EPS-only page) |
| 11 | blast freezer | 654 | 78 | Improve `/blog/blast-freezer-vs-blast-chiller` — title and H1 to lead with "blast freezer" |
| 12 | pharmaceutical cold storage warehouse | 629 | 81 | Pharma rebuild |
| 13 | cold room in pharmaceutical industry | 535 | 42 | Pharma rebuild |
| 14 | benefits of cold storage | 450 | 54 | Build `/blog/benefits-of-cold-storage-pakistan` — fits existing blog set |
| 15 | cold storage manufacturer | 270 | 58 | Title/meta on `/services/cold-stores` should target "manufacturer" |

**The single biggest pattern:** pharmaceutical cold storage has 8,000+ impressions across queries 1, 6, 7, 9, 12, 13. **Rebuild that page first.** This alone could drive 200-400 incremental clicks/month if we move position 60 → position 5.

---

## 8. AI search / GEO action list

From COMPETITOR-GEO-SCAN.md, current score 81/100. Actions to push toward 95+:

1. **Reconcile λ value** — single highest-leverage credibility fix. Pick **0.022 W/m·K (aged, BS EN 14509 declared)**. Update PIR page H1, prose, spec table, FAQ schema, meta description, llms.txt, index.html chip. **One PR, ~5 file edits.**

2. **Add `additionalProperty` array to every Product JSON-LD** — U-value, R-value, fire class, density, λ, compressive strength, lifespan as `PropertyValue`. The HTML tables already have these; we mirror to JSON-LD.

3. **One-sentence factual abstract paragraph under every H1.** Brand H1 stays. New paragraph reads like: *"Izhar Foster manufactures FireSafe PIR sandwich panels in Lahore with thermal conductivity 0.022 W/m·K, fire class B1 to ASTM E84, density 40-45 kg/m³, in core thicknesses 50–250 mm and lengths up to 50 ft."* This single change moves passage-extraction from 7/10 to 9/10.

4. **Reconcile group company count** — 5 (per brochure, your decision). Update llms.txt and any footer copy.

5. **Name component partners on the refrigeration page** — Zanotti, Heatcraft, Thermo King, LU-VE, Fruit Control, Hörmann, Bitzer, Copeland.

6. **Publish factory atomic facts** — 277,460 sqft plant, 100+ engineers, 1,300 workers, ISO 9001:2015 SGS. Add to about.html, llms.txt, Organization schema (`numberOfEmployees`, `hasCredential`).

7. **Extend `clients.html` ItemList from 24 → 100+** Organizations using brochure pp.98–99 + the 5 new project clients. Add `sameAs` URLs where possible.

8. **Add `Service` schema** alongside Product on each service page (Bing weighting).

9. **Downloadable spec sheet PDFs** with `DataDownload` schema — one per service. Open Spec Sheet Library is mentioned in CLAUDE.md as not-yet-built; this is the trigger.

10. **HAC Agri floor-plan PDF download (gated/ungated)** — unique B2B asset, and a floor plan is exactly the kind of source AI engines treat as authoritative.

---

## 9. Visual hierarchy + trust mechanics — concrete copy patterns

### 9.1 Hero band on every priority service page

```
   Brand H1 (stylistic)              ← keeps the voice
   ─────────────────────────────────
   Cold stores engineered around
   your <em>product</em> — not a catalogue.

   Factual abstract paragraph        ← NEW (passage-citable)
   Izhar Foster designs and installs industrial cold stores
   across Pakistan from −40°C blast freezers to +25°C ambient
   warehouses, with capacity from 50 to 10,000 m³, built with
   FireSafe PIR panels and matched ammonia / glycol / CDU
   refrigeration. Since 1959.

   Trust band                        ← NEW (4 atomic facts in chips)
   [1959] [277,460 sqft plant] [ISO 9001 · SGS] [2,100+ projects]

   CTA pair                          ← NEW (primary + secondary)
   [Get a quote]  [Estimate capacity in 30s →]

   Logo strip                        ← MOVED UP from below the fold
   Coca-Cola · Pepsi · Nestlé · Engro · Unilever · Pak Army · Hyperstar · K&N's · Sapphire
```

### 9.2 Trust signal hierarchy (descending order of impact)

1. **Named blue-chip clients with logos** — Coca-Cola + Pepsi together = Pakistan's two biggest beverage cold-chain clients trusting one supplier. Pak Army + USAID = institutional trust.
2. **Specific numbers** — 50-ft cold store, -28°C, 3,000 tons, 277,460 sqft plant. Vague is forgettable; specific is citable.
3. **Standards + certifications** — ISO 9001 SGS, ASTM E84, BS EN 14509, ASHRAE Ch. 24, IEC 60335-2-89.
4. **Founder + heritage** — 1959, Engineer Izhar Ahmad Qureshi, 7th decade, division of Izhar Engineering.
5. **Manufacturing claim** — "We manufacture, we don't resell" — the pentane PIR production line photo (brochure p.20) is irreplaceable proof.
6. **Engineering depth** — Tekla Structures, STAAD.Pro, MBS software; AISC/AWS/MBMA/AISI memberships.

### 9.3 Page footer pattern (every page)

```
   Part of Izhar Engineering · Founded 1959 · Lahore, Pakistan
   ISO 9001:2015 (SGS) · Pakistan Engineering Council · ASME · AISC · AWS · MBMA
   [Coca-Cola] [Pepsi] [Nestlé] [Engro] [Unilever] [Pak Army] [Hyperstar] [K&N's] [Sapphire]
```

This footer alone, repeated 23 times across the site, is a meaningful AI-citation grounding signal.

---

## 10. Phasing — what ships when

**Week 1 — Reconciliation + striking distance (PR #1)**
- Fix λ value (5 files)
- Fix density / compressive strength on PIR page
- Reconcile group company count
- Add factual abstract paragraph to 6 priority service pages
- Add Product `additionalProperty` JSON-LD on 6 service pages
- Adopt FireSafe PIR sub-brand on PIR page
- Pharmaceutical cold storage page rewrite (highest single-page impact)

**Week 2 — Trust band + nav rebalancing (PR #2)**
- Hero trust band (5 facts + logo strip) on home + 6 priority pages
- Move cold-stores to position 1 in homepage product grid
- Rewrite prefab page hero to "prefabricated cold-chain envelopes" angle
- Demote prefab/cabin/plant-factory in homepage hierarchy
- WhatsApp click-to-chat button site-wide

**Week 3 — 5 case studies from Downloads/ (PR #3)**
- TCCEC Coca-Cola Lahore
- Naubahar Bottling Gujranwala
- Connect Logistics Karachi
- Haier Lab Lahore
- USAID Banana Ripening Sindh
- Each: photos optimized to WebP, 600-800 words, Article schema, mentions partners

**Week 4 — 9 brochure case studies (PR #4)**
- Sharaf 50-ft, Iceland Raiwand, HAC Agri 3000-ton (with floor plan PDF), Gourmet Ice Cream, Emirates Logistics, Metro Ravi, United Snacks, Oye Hoye, Engro/Angro

**Week 5 — Refrigerated Vehicles + Insulated Doors enrichment (PR #5)**
- Build `/services/refrigerated-vehicles.html` from brochure pp.65–72
- Add door-thickness selector + Hörmann partner mention to insulated-doors page

**Week 6 — Calculator promotion + funnel improvements (PR #6)**
- Embed simplified Capacity Planner widget on home + cold-stores page
- Embed Energy Cost A-vs-B widget on PIR page
- Quote form upgrade with project-context fields
- Auto-acknowledgement email with relevant spec sheet PDF

**Month 2 — City landing pages**
- `/cold-storage-karachi`, `/cold-storage-lahore`, `/cold-storage-multan`, `/cold-storage-faisalabad`
- Each 800–1200 words with named local projects

**Month 2 — Industry vertical landing pages**
- `/industries/beverage-cold-chain` (Coca-Cola + Pepsi case studies)
- `/industries/pharmaceutical-cold-chain` (link to existing pharma page)
- `/industries/dairy-cold-chain` (Engro/Angro)
- `/industries/agriculture-export-cold-chain` (HAC Agri + USAID)
- `/industries/3pl-logistics-cold-chain` (Connect, Sharaf, Emirates)

**Month 3 — Open Spec Sheet Library**
- Downloadable PDFs for: PIR panel data sheet, cold store typical scope, refrigeration plant typical scope, insulated door range, CA store equipment scope
- Each with `DataDownload` schema

---

## 11. Measurement — what we'll watch

Weekly GSC review with Composio MCP. Specific metrics:

| Metric | Today | Target 90d | Target 180d |
|---|---|---|---|
| Total clicks (16mo running) | 5,490 | 7,500 | 11,000 |
| Avg position | 21.7 | 18 | 14 |
| Pharmaceutical cold storage pos | 59 | 25 | 8 |
| Cold storage pos | 8.9 | 5 | 3 |
| Controlled atmosphere storage CTR | 0.2% | 3% | 6% |
| PIR panel pos | 36 | 18 | 8 |
| Cold-store landing pages indexed | 1 | 5 (incl city) | 9 |
| Case studies indexed | 0 | 10 | 14 |
| Branded clicks | 440 | 600 | 800 |
| WhatsApp / quote events | unknown | baseline + 25% | baseline + 60% |

---

## 12. Open questions for the user before execution

1. **Specs for the 5 Downloads/ projects** — do you have capacity (m³ or tons), temperature setpoints, refrigerant choice, panel thickness, year commissioned for TCCEC, Naubahar, Connect, Haier, USAID? Without these, case studies are photo-only.
2. **HAC Agri floor plans (brochure pp.63-64) — are we cleared to publish them ungated as a downloadable PDF?**
3. **WhatsApp number for the click-to-chat button** — sales team's WhatsApp Business number?
4. **Quote-form auto-reply email — do we have brand-approved boilerplate, or do I draft?**
5. **Prefab page direction — confirm Option A+C** (rewrite to cold-chain envelope angle + secondary placement on home)? Or do you prefer a harder demotion?
6. **ISO 9001 certificate scan + cert number** — needed for Organization.hasCredential schema. Do you have the PDF?
7. **Component partner confirmation** — which of these does Izhar formally source from for the refrigeration scope: Bitzer, Copeland, Danfoss, Emerson, Bock, GEA? (Adding only what you can substantiate.)
8. **Are the 5 "Izhar Group of Companies" listed on the brochure p.3 (Construction, Steel, Concrete, Housing, MEP) the canonical set, or has it expanded since 2018?**

Answer the ones you can. The rest I'll either flag in copy or leave to a follow-up sweep.

---

## 13. Website remodel — what visibly changes

User instruction (2026-04-30): **"remodel the website to highlight key things."** Concrete remodel scope:

### 13.1 Information architecture changes

| Surface | Before | After |
|---|---|---|
| Top nav | Cold Stores · PIR · Refrigeration · CA · Doors · Prefab · Tools · Blog · About · Contact | **Cold Stores · PIR Panels · Refrigeration · Industries ▾ · Tools ▾ · Projects · Blog · About · Contact** |
| `Industries ▾` | n/a | Beverage / Pharma / Dairy / Meat & Poultry / Produce / Logistics / Government & Aid |
| `Tools ▾` | flat tools.html | Cost Calculator · Capacity Planner · Energy Comparison · Refrigerant Charge · Condenser Sizing · CA Atmosphere · A2L Room |
| Footer "Products" | 6 items including Prefab and Smart Cabin | 5 priority items: Cold Stores · PIR Panels · Refrigeration · CA Stores · Insulated Doors. Prefab moves to "Other capabilities" |

### 13.2 Homepage block reorder (top-to-bottom)

```
1. Hero          — Cold-storage-first H1, factual abstract, blue-chip logos, dual CTA
2. Trust band    — 1959 / 277,460 sqft / ISO 9001 / 2,100+ projects
3. Cost calc     — embedded simplified estimator (the new "wow" moment)
4. 3 pillars     — Cold Stores · PIR Panels · Refrigeration  (each with 1 photo, 3 specs, CTA)
5. Featured 5    — TCCEC / Naubahar / Connect / Haier / USAID — fresh case studies
6. Industries    — 7 segmented cards
7. Why us        — 5 reasons including the FireSafe PIR pentane story
8. Calc 2        — Energy A-vs-B comparison ("see your savings")
9. Blog latest   — 3 cards
10. Other        — secondary capabilities row (CA, Doors, Refrigerated Vehicles, CEA, Prefab — collapsed)
11. CTA strip    — Quote · WhatsApp · Calculator
```

### 13.3 Visual highlight rules

- **Every priority page above-the-fold has 4 elements**: factual H1 paragraph, blue-chip logo strip, trust facts band, dual CTA (quote + calculator).
- **Cold-store imagery dominates the homepage**: replace the current generic hero video with a 6-tile cold-store project mosaic (TCCEC racking, Iceland 50-ft freezer, HAC Agri ammonia plant, Naubahar interior, Banana ripening, Haier climate room).
- **Demote off-strategy products** to a single collapsed row labelled "Other capabilities" — visually present but visually quiet.
- **Add a sticky "Quote / WhatsApp" pill** lower-right on mobile for one-tap conversion.
- **Industries menu opens a mega-dropdown** with 7 industry cards (logo + 1-line use case), driving traffic to the new vertical landing pages.

---

## 14. Cost Calculator integration — the next major build

User instruction (2026-04-30): **"next plan is to add cost calculator using our tools. we enhance them."** This is the centrepiece of the calculator-led conversion strategy.

### 14.1 What "cost calculator" means here

A first-touch estimator that gives a **PKR-denominated cost band** for a cold-store project in 30 seconds, without requiring login. Buyers want a number to take to their finance team. We have all the engineering primitives in `js/tools/load-calculator.js`, `condenser-sizing.js`, `capacity-planner.js`. The remodel adds a **cost layer** on top.

### 14.2 The new Cost Calculator (Tool 8)

Path: `tools/cost-calculator.html`. Cross-validated against tools 1, 5, 6 (load, condenser, capacity).

**Inputs (3 steps, ~30 seconds):**
1. **Project basics:** city (12-city ASHRAE list), commodity (24 PK crops + beverage / pharma / meat / dairy preset), capacity (tons or m³), temperature setpoint
2. **Building:** insulation thickness preset (80 / 100 / 125 / 150 mm), site class (greenfield / inside existing shed / multi-zone)
3. **Refrigeration:** architecture (CDU / multi-CDU rack / glycol-ammonia / NH3 DX) — pre-recommended based on capacity and temperature

**Outputs:**
- **Cost band in PKR Lakhs** with low / mid / high (±20%)
- Heat load (kW) — from existing load-calculator.js engine
- Refrigerant charge (kg) — from refrigerant-charge.js
- Recommended condenser kW — from condenser-sizing.js
- Annual energy cost estimate (PKR/year) — new, per-city tariff
- Recommended Izhar Foster scope (PIR thickness, panel m², door count, refrigeration HP)
- 3 named comparable projects from our case-study library

**The conversion mechanic:**
- "**See your detailed quote** — our engineer will validate this in 24 hours"
- Form: name, company, city, project name, target year. Pre-filled from calculator state.
- Saves the calculator state to `localStorage` (so they can come back). If they submit, sends to sales with a JSON snapshot.

### 14.3 What we change in the existing 7 tools to feed the cost layer

| Tool | Change |
|---|---|
| **1. Load Calculator** | Already returns `capacityKw`. Wire to expose `roomVolumeM3` and `panelAreaM2` via `Izhar.getProjectSession()`. |
| **2. Energy Cost** | Add a **PKR/kWh tariff table** by city (Karachi, Lahore, etc.) sourced from K-Electric / LESCO / IESCO published commercial tariffs. Used by Tool 8 for annual energy estimate. |
| **3. A2L Room Area** | Used as a safety check inside Tool 8 if user picks small-charge propane / R454C. |
| **4. Refrigerant Charge** | Already gives kg. Wire to Tool 8 cost layer. |
| **5. Condenser Sizing** | Already gives THR factor. Wire to Tool 8 to recommend kW + Pakistan summer derate. |
| **6. Capacity Planner** | Used as the entry calculator on the homepage embed. Outputs flow into Tool 8 if user clicks "Estimate cost →". |
| **7. CA Atmosphere** | Toggleable extra in Tool 8 if user picks fruit + long storage (≥6 months). Adds a CA-equipment cost band. |

### 14.4 Cost engine — where the PKR numbers come from

We **don't publish quotes**. We publish **cost bands grounded in published rates**, with all assumptions visible:

- PIR panel cost band: PKR/m² for 80/100/125/150 mm — sourced from current Izhar pricing (you provide; we keep it in `data-pricing-bands.json`, gitignored if sensitive)
- Refrigeration cost: PKR/HP installed for CDU vs rack vs ammonia (you provide)
- Door cost: PKR/door by size class
- Civil + installation: % adder by site class (greenfield 25%, inside shed 15%, multi-zone 35%)
- Energy cost: PKR/kWh × estimated annual kWh × city tariff

**A "show your math" panel** below every result builds trust. AI engines (Perplexity, ChatGPT) cite calculator pages that show the formula — this is also a GEO win.

### 14.5 Calculator placement (the funnel touchpoints)

| Touchpoint | Calculator | Conversion expected |
|---|---|---|
| Homepage hero | Capacity Planner (30s) | Curiosity click |
| Homepage second-fold | Cost Calculator (full) | Lead capture |
| Cold Stores page mid-fold | Capacity Planner embed → Cost Calculator link | Lead capture |
| PIR Panels page | Energy Cost A-vs-B | Comparison anchor |
| Pharmaceutical page | Cost Calculator with pharma preset | Sales call |
| Each case study | "How much would your version cost?" → Cost Calculator with the case-study preset pre-loaded | Cross-sell |
| Quote form | "I started with the calculator" checkbox + JSON snapshot attachment | Sales context |

### 14.6 Calculator UX rules (to avoid breaking the funnel)

- **No login required** for the calculator. Buyers won't gate-trade their email for a guess.
- **Email gate is at the "validate this with our engineer" step**, not at the result step. Show the cost band first, then ask.
- **WhatsApp button next to every calculator result** — Pakistan B2B prefers WhatsApp over email by ~3:1.
- **Save / Open / Print PDF** already implemented in `_shared.js` — extend to email-the-PDF-to-yourself.
- **All cost outputs flagged as "indicative ±20%, subject to engineering review"** — protects us legally and matches buyer expectation.
- **No prices on currency-symbol-only displays** — always include "PKR" to disambiguate, since visitors may be international.

### 14.7 Build sequence for the calculator project (after Phase 1 of growth plan ships)

1. **Week A:** Build `tools/cost-calculator.html` skeleton, hook into existing 7 tools via `Izhar.getProjectSession()`. Cost data file as JSON.
2. **Week B:** Add tariff data (12 PK cities). Extend Energy Cost calculator (Tool 2) with city tariffs. Cross-validate.
3. **Week C:** Build the homepage second-fold widget (simplified embed). Lead-capture form with JSON snapshot.
4. **Week D:** Add calculator preset URLs (e.g. `/tools/cost-calculator?preset=mango-multan-2000ton`) so case studies and city pages can deep-link with state.
5. **Week E:** SEO + GEO polish. JSON-LD `Action` schema for the calculator. "Show your math" panel. AI-citation-ready FAQ at the bottom.

### 14.8 What we don't do in this calculator

- **No financing calculator** — that's a separate downstream tool, partners' territory.
- **No "compare us to competitor X" calculator** — looks unprofessional.
- **No real-time live pricing** — bands only, with engineer validation as the conversion step.
- **No multi-currency** — PKR only. International buyers contact sales directly.

---

## 15. Plan persistence — how this stays alive

User instruction (2026-04-30): **"Make sure claude and other .md files are updated after this we wanna stick to this growth plan."**

Actions taken:
- `CLAUDE.md` updated with a top section pointing to this plan as the active roadmap, including the priority pillar list, off-strategy demotion rules, and the cost-calculator commitment.
- `_kr_scrape/DECISIONS.md` already contains the source-of-truth conflict resolutions; CLAUDE.md cross-references it.
- `_kr_scrape/GSC-RESEARCH.md`, `SITE-VS-BROCHURE-AUDIT.md`, `COMPETITOR-GEO-SCAN.md` retained as evidence base.
- This `GROWTH-PLAN.md` is the canonical roadmap. Future PRs reference it by section number (e.g. "Implements §6.1 striking-distance fix for cold storage query").

If the plan changes, **change this file first**, then the code. Don't let code drift from plan.

---

## End of plan

This is the document I'll execute against. Everything in §10 ships in atomic commits with the diff visible to you before merge. The first PR (Week 1: reconciliation + pharma rewrite + striking-distance fixes) is the single highest-impact change and is ready to start as soon as you approve.

If you want changes — pillar reordering, different funnel mechanics, different visual hierarchy, different prefab strategy, different cadence — say so now. Once we start shipping, every change becomes a follow-up commit instead of a redirection.
