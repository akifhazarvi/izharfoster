# Izhar Foster — SEO Growth Plan (90-day roadmap)

**Compiled:** 2026-04-30 from 16 months of GSC data + redesign-vs-legacy URL audit
**Property:** `https://izharfoster.com/`
**Baseline:** 2,017 clicks · 72,076 impressions · CTR 2.80% · avg pos 25.3

---

## Executive read

You're sitting on a 16-month moat: ~5,500 organic clicks lifetime spread across ~125 indexed legacy URLs. **None of that traffic currently lands on the new redesigned site** — every ranked URL is a WordPress-era page (`/pir-panels/`, `/prefabmodular-solutions/`, `/cold-stores/...`, etc.). The new structure (`/services/...`, `/tools/...`, `/blog/...`) is unknown to Google.

You have two simultaneous problems:
1. **Preserve** the existing rankings via 301 redirects from legacy URLs to new ones.
2. **Capture** the visible content gaps the GSC data exposes — pharma cold-chain, blast freezing, controlled-atmosphere terminology variants, and city-level intent.

If both ship in the next 30 days, projected **3× organic clicks within 6 months** (5,500 → 16,000+) is realistic. The math is below.

### Topic-cluster scoreboard (16 months)

| Cluster | Queries | Clicks | Impr | CTR | Diagnosis |
|---|---:|---:|---:|---:|---|
| **PREFAB** | 238 | **630** | 10,849 | 5.8% | 🥇 Highest-performing cluster — protect via /services/prefabricated-structures redirects |
| **COLD STORAGE** | 552 | 274 | **30,148** | 0.9% | 🟡 Largest visibility, weak conversion — pos 11.5 average; needs page-1 push |
| **BRAND (Izhar)** | 96 | 439 | 10,917 | 4.0% | 🟢 Strong; minor cleanup needed |
| **GEO/LOCAL** | 208 | 1,054 | 15,831 | 6.7% | 🥈 Highest-CTR cluster — Pakistan/Lahore signals work |
| **PIR/SANDWICH PANEL** | 173 | 378 | 19,660 | 1.9% | 🔴 Lost ranks during redesign — rebuild required |
| **PHARMA COLD CHAIN** | 48 | **3** | **16,011** | 0.0% | 🚨 **Largest single content gap** — 16k impressions, 3 clicks |
| **PRICING** | 173 | 312 | 7,956 | 3.9% | 🟢 Money keywords ranking; protect |
| **CA STORE** | 34 | 9 | 5,295 | 0.2% | 🔴 Pos 22 average; needs exact-match optimization |
| **BLAST FREEZER** | 58 | **1** | 2,508 | 0.0% | 🚨 Zero clicks in 16 months — content gap |
| **REFRIGERATION** | 34 | 1 | 420 | 0.2% | 🟡 Low visibility — emerging |
| **INSULATED DOORS** | 2 | 0 | 7 | 0.0% | 🟡 Untapped category |

**Implication:** total addressable impressions in the data already = ~120,000 over 16 months (~7,500/month). Conservative CTR uplift from 2.8% → 5.0% via better titles, content depth, and rich results = **+1,650 incremental clicks/year just from existing demand**.

---

## Part 1 — preserve every ranked URL via 301 redirects

This is the highest-priority work. The redirect map shipped in commit `be4a60e` is good, but the GSC data lets us refine it precisely.

### Tier 1 — must-redirect URLs (≥50 lifetime clicks)

| # | Legacy URL | Lifetime clicks | Lifetime impr | Avg pos | Redirect → |
|---:|---|---:|---:|---:|---|
| 1 | `/prefabmodular-solutions/` | **1,676** | 18,367 | 14.6 | `/services/prefabricated-structures` ✅ already configured |
| 2 | `/pir-panels/` | **1,275** | 42,313 | 18.5 | `/services/pir-sandwich-panels` ✅ |
| 3 | `/` | 1,097 | 26,541 | 11.5 | (homepage; no redirect needed) |
| 4 | `/cold-stores/` | 417 | 14,692 | 12.5 | `/services/cold-stores` ✅ |
| 5 | `/eps-panels/` | 280 | 7,278 | 23.0 | `/services/pir-sandwich-panels` ✅ |
| 6 | `/prefabricated-structures-pakistan/` | 159 | 5,831 | 9.4 | `/services/prefabricated-structures` ✅ |
| 7 | `/contact-us/` | 98 | 6,923 | 8.4 | `/contact` ✅ |
| 8 | `/pir-insulation-board/` | 57 | 1,107 | 11.0 | `/services/pir-sandwich-panels` ⚠️ NOT YET configured |
| 9 | `/top-5-cold-storage-facilities-in-lahore-features-tips/` | 57 | 3,055 | 7.7 | `/blog/cold-storage-solutions-pakistan-demand-rising` ✅ |
| 10 | `/about-izhar/` | 55 | 10,424 | 8.7 | `/about` ✅ |

### Tier 2 — high-impression URLs (zero clicks but indexed; preserve crawl signal)

| Legacy URL | Lifetime impr | Avg pos | Redirect → |
|---|---:|---:|---|
| `/cold-stores/pharmaceutical-cold-storage-solutions/` | **16,868** | 59.1 | `/services/cold-stores` (interim — see new page below) |
| `/blogs/what-is-cold-storage-advantage-of-cold-storage-in-food-and-pharmaceutical-industry/` | 4,046 | 59.0 | `/blog/cold-storage-solutions-pakistan-demand-rising` ✅ |
| `/uncategorized/what-is-a-blast-freezer-advantages-of-blast-freezer/` | 3,585 | 67.6 | `/blog/refrigeration-systems-cold-chain-pakistan` ✅ |
| `/cold-stores/meat-and-poultry-cold-storage-services/` | 2,339 | 32.2 | `/services/cold-stores` ✅ |
| `/about-us/` | 2,185 | 16.0 | `/about` ✅ |
| `/cold-stores/fruits-and-vegetables-cold-storages/` | 1,841 | 35.6 | `/services/cold-stores` ✅ |
| `/cold-stores/potato-and-onion-cold-room/` | 1,831 | 17.8 | `/services/cold-stores` ✅ |
| `/blogs/what-is-cold-chain-importance-and-advantages-of-cold-chain-in-food-and-pharma-industry/` | 1,438 | 68.3 | `/blog/cold-storage-pakistan-export-growth` ✅ |
| `/blogs/temperature-for-the-preservation-of-food-products/` | 1,268 | 11.9 | `/blog` ⚠️ specific redirect could improve |
| `/blogs/reducing-post-harvest-losses-and-strengthening-food-security/` | 1,040 | 4.3 | **specific redirect needed** — `/blog/cold-storage-pakistan-export-growth` |
| `/blogs/importance-of-cold-storage-in-ice-cream-industry/` | 1,015 | 19.6 | `/blog` ⚠️ |
| `/board-of-directors/` | 823 | 16.6 | `/about` ⚠️ NOT configured |
| `/our-products/` | 959 | 5.7 | `/services/cold-stores` (or `/tools` for hub) ⚠️ NOT configured |
| `/cold-stores-pakistan/` | 766 | 25.3 | `/services/cold-stores` ⚠️ NOT configured |
| `/refrigerated-sea-water-system/` | 905 | 36.5 | `/services/refrigeration-systems` ⚠️ NOT configured |
| `/blog/top-7-applications-of-pir-sandwich-panels-in-industry/` | 2,502 | 33.4 | `/blog/pir-panels-thermal-efficiency-smart-building` ✅ |
| `/blogs/applications-of-pir-sandwich-panels-in-industry/` | 539 | 22.1 | `/blog/pir-panels-thermal-efficiency-smart-building` ⚠️ NOT configured |
| `/cold-store/cold-store-in-pakistan/` | 578 | 7.1 | `/services/cold-stores` ⚠️ NOT configured (`/cold-store/*` not in current map) |
| `/blogs/controlled-atmospheric-stores-requirements-and-their-benefits-for-the-farmers/` | 656 | 12.1 | `/blog/ca-stores-game-changer-pakistan-agriculture` ⚠️ NOT configured |

### Tier 3 — orphaned legacy URLs to redirect (low impr, but referenced from the wider web)

These show 0 clicks but indexed pages can have backlinks from forums, supplier directories, and old press mentions. A 301 forwards link equity:

```
/insulated-doors-pakistan/                       → /services/insulated-doors
/refrigeration-systems/                          → /services/refrigeration-systems
/cold-stores/banana-ripening-storage-cold-rooms/ → /services/cold-stores
/cold-stores/milk-and-dairy-cold-storage-services/ → /services/cold-stores
/cold-stores/cold-stores-for-fruit-pulp/         → /services/cold-stores
/uncategorized/cold-storage-solutions-in-pakistan-why-demand-is-rising-and-how-businesses-can-benefit/ → /blog/cold-storage-solutions-pakistan-demand-rising
/uncategorized/cold-storage-cost-in-pakistan/    → /blog/cold-storage-solutions-pakistan-demand-rising
/uncategorized/controlled-atmosphere-storage/    → /services/ca-stores
/uncategorized/green-refrigeration-technologies/ → /blog/green-refrigeration-energy-carbon-footprint
/uncategorized/insulated-doors-improving-energy-efficiency-in-cold-storage-facilities/ → /blog/insulated-doors-energy-efficiency-cold-storage
/uncategorized/insulated-industrial-doors/       → /blog/insulated-industrial-doors-types-benefits-guide
/uncategorized/pir-panels-meeting-pakistans-need-for-thermal-efficiency-and-smart-building-design/ → /blog/pir-panels-thermal-efficiency-smart-building
/uncategorized/prefabricated-industrial-structures/ → /blog/prefabricated-structures-smart-construction-pakistan
/uncategorized/refrigeration-systems-the-core-of-pakistans-cold-chain-infrastructure/ → /blog/refrigeration-systems-cold-chain-pakistan
/uncategorized/ca-stores-a-game-changer-for-pakistans-agriculture-sector/ → /blog/ca-stores-game-changer-pakistan-agriculture
/uncategorized/real-world-cold-chain-projects-case-studies-from-pakistan/ → /projects
/uncategorized/cold-storage-infrastructure/      → /services/cold-stores
/uncategorized/sustainable-cold-chain-a-key-to-pakistans-food-security/ → /blog/cold-storage-pakistan-export-growth
/why-cold-chain-is-critical-for-food-safety-in-pakistan/ → /blog/cold-storage-pakistan-export-growth
/cold-store/                                     → /services/cold-stores
/cold-store/:rest*                               → /services/cold-stores
/our-company/                                    → /about
/our-clients/                                    → /clients
/news-and-events/                                → /blog
/category/:rest*                                 → /blog
/portfolio/:rest*                                → /projects
/portfolio_category/:rest*                       → /projects
/sandwhich-panels/:rest*                         → /services/pir-sandwich-panels
/dairy-cold-store/                               → /services/cold-stores
/controlled-atmosphere-stores-for-fruit-export-in-pakistan/ → /services/ca-stores
/choosing-the-right-refrigeration-system-for-your-warehouse/ → /blog/refrigeration-systems-cold-chain-pakistan
/how-pir-sandwich-panels-cut-energy-costs-in-cold-storage/ → /blog/pir-panels-thermal-efficiency-smart-building
/pallet-racking/                                 → /services/cold-stores
/mezzanine-racking/                              → /services/cold-stores
/steel-racks/                                    → /services/cold-stores
/our-services-2/                                 → /services/cold-stores
/home-2/                                         → /
/?page_id=:id                                    → /
/test-page/                                      → /
/tcg_teb/:rest*                                  → /
/wp-content/uploads/:rest*                       → /  (404→200; alternative: leave 404)
/author/admin/                                   → /
/faqs/                                           → /faqs
```

---

## Part 2 — capture the visible content gaps

### Gap 1: 🚨 **Pharmaceutical cold-chain hub** — 16,011 impressions / 3 clicks

This is the single biggest content gap on the entire site. **8 separate pharma queries** rank pos 40–80 with virtually zero clicks:

| Query | Impr | Pos |
|---|---:|---:|
| pharmaceutical cold storage | 2,748 | 68.1 |
| cold storage pharmaceutical products | 1,239 | 65.4 |
| cold storage pharmacy | 1,212 | 68.1 |
| cold room in pharmaceutical industry | 540 | 42.0 |
| cold storage for pharmaceuticals | 881 | 59.9 |
| cold storage pharma | 473 | 64.3 |
| cold storage in pharmacy | 261 | 62.6 |
| cold room for medicine | 152 | 54.0 |

**Action:** create a dedicated `/services/pharmaceutical-cold-storage` page (1,500+ words). Plus a long-form blog post: `/blog/pharmaceutical-cold-storage-pakistan-guide` (2,000+ words covering GMP/GDP, IQ/OQ/PQ qualification, +2/+8°C zoning, redundant refrigeration, validated logging, common Pakistani regulators — DRAP).

**Conservative target:** if these queries move from pos 60+ to top 10 after focused content, ~600 impressions/month at 3% CTR = **18 clicks/month** from this cluster alone (currently 3 lifetime).

### Gap 2: 🚨 **Blast freezer / blast freezing** — 2,508 impressions / 1 click

| Query | Impr | Pos |
|---|---:|---:|
| blast freezing | 1,351 | 72.6 |
| blast freezer | (in long tail) | varies |

**Action:** new `/blog/blast-freezer-vs-blast-chiller-pakistan-guide` (1,500+ words) covering the −40°C air / −18°C core threshold, 90-min pull-down, applications (poultry, seafood, ice cream, ready meals), capital cost vs return, and how the Izhar Foster `condenser-sizing` and `load-calculator` tools can be used.

Backlink internal from `/services/cold-stores` and `/services/refrigeration-systems`.

### Gap 3: 🟠 **CA store / Controlled Atmosphere** terminology drift

`controlled atmosphere`: 1,587 impressions, pos 22.2, **0 clicks**. `ca storage`: 703 impressions, pos 13.5, 1 click. `controlled atmosphere storage`: 2,275 impressions, pos 5.7, 4 clicks (CTR 0.2% — should be ~6%).

The `/services/ca-stores` page exists but the title doesn't lead with "Controlled Atmosphere storage". **Rewrite H1 + page title:**

```html
<title>Controlled Atmosphere Storage Pakistan — CA Stores for Apples, Dates | Izhar Foster</title>
<h1>Controlled Atmosphere storage that holds fruit fresh for months — not weeks</h1>
```

That single change should lift CTR on a ranking that's already pos 5.7.

### Gap 4: 🟠 PIR panel ranking decay

| Query | Pos (legacy) | Pos (recent 28d) | Implication |
|---|---:|---:|---|
| pir panel | (was top 5) | 36.3 | Lost ground during redesign |
| pir panels | (was top 5) | 25.3 | Same |
| pir sandwich panel | — | 25.6 | Should be top 5 |
| construction using pir panels | — | 19.1 (0 clicks) | Content gap on "construction" angle |
| pir sandwich panel suppliers | — | 12.6 (0 clicks) | Easy uplift |
| pir sandwich panel factory | — | 13.0 (0 clicks) | Easy uplift |
| pir sandwich panel manufacturer | — | 14.9 (0 clicks) | Easy uplift |

**Action:** the new `/services/pir-sandwich-panels` page is good but needs:
- H2 sections explicitly titled "PIR Sandwich Panel Suppliers in Pakistan", "PIR Panel Manufacturer Lahore", "Construction Using PIR Panels"
- Add a comparison block: PIR vs PUR vs EPS (all have residual queries)
- Add a price-range/pricing block — `pir sandwich panel price`, `pu sandwich panel price in pakistan` together = ~600 impressions

### Gap 5: 🟠 Geo-local long-tail

`prefabricated houses lahore` (118i, pos 2.1, only 8.5% CTR), `cold storage lahore`, `cold storage karachi`, `sandwich panel price in lahore`, `sandwich panel price in karachi`, `sandwich panel price in islamabad` — all have measurable demand and the site has no city-level pages.

**Action (Phase 2):** build city landing pages following programmatic-SEO discipline:
- `/cold-storage/lahore`
- `/cold-storage/karachi`
- `/cold-storage/multan`
- `/cold-storage/faisalabad`
- `/cold-storage/islamabad`
- `/cold-storage/peshawar`

Each with 600+ unique words (city-specific design temperatures from your existing dataset, real local installations from `/projects`, GMaps embed, LocalBusiness schema with `areaServed: City`).

### Gap 6: 🟡 Brand-entity reinforcement

`izhar`, `izhar group`, `izhar group of companies`, `izhar construction`, `izhar engineering`, `izhar steel`, `izhar group owner`, `izhar group contact number`, `izhar group of companies latest projects` — combined ~10,000 impressions, mostly pos 8–11.

These are people researching the parent group. The `/about` page now has Person + AboutPage schema (shipped today), but it should also include:
- A clear "Group structure" section listing all 12 group companies with outbound links (already partially done per recent commit)
- An entity-clarification block: "Izhar Foster is the cold-chain division of Izhar Engineering, part of the Izhar Group founded 1959"
- A "Latest projects" block linking to `/projects`

This will improve CTR on already-ranked brand queries (currently 0.5% CTR at pos 9.8 for "izhar" — should be ~2.5%).

### Gap 7: 🟡 CTR optimization — quick fixes for already-ranked queries

| Query | Pos | Actual CTR | Expected | Lost clicks (estimated) | Fix |
|---|---:|---:|---:|---:|---|
| sandwich panel | 5.8 | 0.9% | ~6% | -133 | Service page title doesn't include exact phrase "Sandwich Panel" — already fixed today |
| controlled atmosphere storage | 5.7 | 0.2% | ~6% | -121 | Title mismatch — see Gap 3 |
| cold storage | 8.8 | 0.7% | ~3% | -71 | New `/services/cold-stores` title is strong now (shipped today) |
| izhar group | 8.4 | 0.5% | ~4% | -61 | About-page schema improvements (done today) |
| prefabricated houses | 3.3 | 6.0% | ~13% | -51 | "Houses" suggests residential intent; need a B2C-friendly section |
| izhar | 9.8 | 0.1% | ~2% | -34 | Brand-entity reinforcement |
| izhar construction | 8.8 | 0.2% | ~3% | -25 | Same |

**Estimated total recoverable clicks from CTR fixes alone: ~600 over 12 months.**

---

## Part 3 — quantified opportunity model

### Conservative 12-month projection

| Source | Lift | Mechanism |
|---|---:|---|
| Recover legacy rankings via 301s | **+3,500 clicks/yr** | Preserve existing 2,017c/yr baseline + gain back from PIR-panel ranking decay |
| Pharmaceutical cold-chain hub | +200 clicks/yr | Move pharma cluster from pos 60+ to pos 10 |
| Blast freezer content | +50 clicks/yr | Capture currently-unaddressed query |
| CA store title fix | +120 clicks/yr | Move pos 5.7 ranking from 0.2% → 5% CTR |
| PIR panel page enhancements | +300 clicks/yr | Lift pos 25 → top 10 on multiple queries |
| 6 city landing pages | +400 clicks/yr | Capture geo-local long tail |
| CTR fixes on existing rankings | +500 clicks/yr | Title/snippet improvements on page-1 queries |
| Brand-entity reinforcement | +250 clicks/yr | Entity Knowledge Graph signals |
| **TOTAL projection** | **+5,300 clicks/yr** | (vs current 2,017 baseline) |

**Aggressive 12-month projection** (fully ranked content + AI Overview citations from new 1,200-word blog posts + UAE/Gulf market expansion): **+8,000 to +12,000 clicks/yr**.

---

## 90-day execution roadmap

### Week 1 (this week — partially shipped)
- [x] Remove `noindex` header — **done**
- [x] Add canonical tags to 30 pages — **done**
- [x] Add Tier-1 redirects (10 highest-traffic legacy URLs) — **done**
- [x] Expand 4 thin blog posts to 1,000+ words — **done**
- [x] Submit new sitemap to GSC — **done (verified live: last_submitted 2026-04-30 14:03 UTC)**
- [ ] Add Tier-2 + Tier-3 redirects (next deploy — see Part 1)
- [ ] Delete legacy WordPress sitemaps from GSC (`sitemap_index.xml`, `post-sitemap.xml`, `page-sitemap.xml`)
- [ ] Request indexing on top 10 new URLs in GSC URL Inspection (10/day cap)

### Week 2-3
- [ ] **Build `/services/pharmaceutical-cold-storage` page** (1,500+ words, GMP/GDP/DRAP coverage, FAQ schema) — biggest single ROI
- [ ] **Write `/blog/pharmaceutical-cold-storage-pakistan-guide`** (2,000+ words)
- [ ] Rewrite `/services/ca-stores` H1/title to lead with "Controlled Atmosphere"
- [ ] Add Suppliers/Manufacturer/Factory H2 sections to `/services/pir-sandwich-panels`
- [ ] Add price-range block to `/services/pir-sandwich-panels` (PIR/PU/EPS comparison)
- [ ] Convert top 11 hero PNGs to WebP (`blog-hero.png`, `product-doors.png`, etc.) → `<picture>` tags
- [ ] Generate 25 unique 1200×630 OG images (one per indexable page)

### Week 4-6
- [ ] **Write `/blog/blast-freezer-vs-blast-chiller-pakistan-guide`** (1,500+ words)
- [ ] Build city landing pages: Lahore, Karachi, Multan, Faisalabad (600+ unique words each, real installations, LocalBusiness schema)
- [ ] Add `aggregateRating` schema once you have 10+ Google Business Profile reviews
- [ ] About page: add Group structure + "Latest projects" block
- [ ] First-pass internal linking audit — every service page links to 3+ blog posts and 2+ tools

### Week 7-9
- [ ] Build remaining city pages: Islamabad, Peshawar, Sialkot
- [ ] Two more deep blog posts targeting still-uncovered demand:
  - `/blog/cold-storage-cost-pakistan-2026-pricing-guide` (catches "cold storage cost" queries)
  - `/blog/sandwich-panel-price-pakistan-2026-buyers-guide` (catches all the price-in-pakistan tail)
- [ ] Refresh `dateModified` on all blog posts (recency signal for AI Overviews)
- [ ] Submit Indexing API for new URLs (Vercel function or cron-driven)

### Week 10-12
- [ ] Outreach: 5–10 backlink targets (Pakistan trade associations, food-industry publications, supplier directories)
- [ ] Add HowTo schema to the 7 calculator tools (huge AI Overview opportunity)
- [ ] Knowledge Panel research: claim Wikidata entry for Izhar Foster + Izhar Group founder
- [ ] Quarterly content update: refresh top 10 blog posts with 2026 data and new internal links

---

## Measurement & checkpoints

### Weekly (Mondays)
Pull these GSC metrics:
- Total clicks (last 7 days vs prev 7)
- Total impressions (last 7 vs prev 7)
- Average position
- Top 5 rising queries (delta clicks vs prev 28)
- Top 5 falling queries

### Monthly
- Indexed page count (URL Inspection batch)
- Number of redirected legacy URLs Google has acknowledged (Coverage report)
- New ranking queries in top 10 (track cumulative count)
- AI Overview citations (Perplexity, ChatGPT, Google AI Overviews — manual sample queries)

### KPIs at 90 days
| Metric | Today | 90-day target |
|---|---:|---:|
| Indexed new-URL pages | 1 | 30 |
| Monthly clicks | ~190 | **≥350** |
| Monthly impressions | ~7,400 | **≥12,000** |
| Avg position | 25.3 | **≤18** |
| Page-1 queries | 550 | **≥700** |
| Pharma-cluster impressions ranked top 20 | 0 | **≥3,000** |
| City-page indexed | 0 | **≥4** |

---

## Competitive positioning notes

Based on top-query SERP intent (not yet validated against live competitor pages):
- **PIR/sandwich panel** queries skew B2B-construction; competitors include Pakistani panel manufacturers and construction-supply portals. Izhar's manufacturing-since-1959 angle is the durable advantage.
- **Cold storage** queries split between cold-storage-as-business (e.g., "cold storage business in pakistan") and cold-storage-as-rental ("cold storage for rent in lahore"). Izhar serves the former; the latter is rental marketplaces (different intent — don't chase).
- **Prefab houses** queries are surprisingly residential-oriented. Izhar serves industrial, but the prefab pages should keep a residential FAQ section to retain that traffic and convert it to commercial leads via "we also do labour camps and modular accommodation" framing.

---

## Risks & dependencies

1. **Index latency** — Google may take 3–6 weeks to fully crawl and re-rank the new URLs even with sitemap submission and URL Inspection requests. Don't panic if traffic dips for a month.
2. **301 chain length** — currently `/cold-stores/pharmaceutical-cold-storage-solutions/` → `/services/cold-stores`. When we build the new pharma hub, that should re-target to `/services/pharmaceutical-cold-storage` instead. Plan for the rewrite.
3. **Brand consolidation** — Izhar Group has multiple sister sites. Make sure cross-links from `/about` to sister sites use `rel="nofollow"` if there's any risk of negative SEO transfer (probably not needed, but worth a 10-min audit).
4. **WordPress sitemap cleanup** — must remove the 3 legacy sitemaps from GSC manually; otherwise Google keeps trying to crawl 404s and may slow down the new sitemap's processing.

---

*Plan compiled from 16 months of GSC data (2024-12-30 → 2026-04-28) via Composio MCP. See [GSC-ANALYSIS.md](GSC-ANALYSIS.md) for raw query/page data.*
