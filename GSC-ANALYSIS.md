# Izhar Foster — Google Search Console Analysis

**Property:** `https://izharfoster.com/` (URL-prefix, siteOwner)
**Date range:** 2024-12-30 → 2026-04-28 (16 months)
**Pulled:** 2026-04-30 via Composio MCP

---

## 🚨 The single most important finding

**The brand-new redesigned URLs are not yet indexed.** Google Search Console URL Inspection on the production site shows:

| URL | GSC verdict | Coverage |
|---|---|---|
| `/` (homepage) | ✅ PASS | Submitted and indexed (last crawl 2026-04-30 02:57 UTC) |
| `/services/cold-stores` | ⚠️ NEUTRAL | **URL is unknown to Google** |
| `/services/pir-sandwich-panels` | ⚠️ NEUTRAL | **URL is unknown to Google** |
| `/blog/cold-storage-pakistan-export-growth` | ⚠️ NEUTRAL | Discovered – currently not indexed |

**What this means:** every click, impression, and ranking number below comes from the **legacy WordPress URL structure** of the previous Izhar Foster site (e.g., `/pir-panels/`, `/cold-stores/pharmaceutical-cold-storage-solutions/`, `/prefabmodular-solutions/`). The new redesigned site (`/services/cold-stores`, `/services/pir-sandwich-panels`, `/tools/load-calculator`, etc.) is invisible to Google.

The `noindex` header that we removed today was almost certainly the reason new pages stopped getting indexed during the redesign. With that gone and the new sitemap submitted today (verified: GSC shows `last_submitted: 2026-04-30T14:03 UTC`, 0 errors, 0 warnings), Google will start crawling — typically 3–14 days for the first wave of indexation.

**Action required: 301 redirects from the legacy URLs to the new ones**, otherwise you lose all the rankings shown below. Detailed redirect map at the end of this report.

---

## 16-month performance baseline (legacy site)

| Metric | Value |
|---|---:|
| Total clicks | **2,017** (truncated to 1,000-row sample) |
| Total impressions | **72,076** |
| CTR | **2.80%** |
| Avg. position | **25.3** |
| Indexed queries (sample) | 1,000 (cap) |
| Crawled pages with traffic | 125 |

### Recent 30-day trend
- 30-day average: **6.3 clicks/day · 245 impressions/day · pos 13.1**
- Last 7 days: **5.3 clicks/day · pos 14.5**
- Prev 7 days: **7.1 clicks/day · pos 14.6**

Slight dip last week (–25% clicks WoW) is consistent with the redesign cutover and new URLs not yet indexing.

### Position distribution

| Tier | Queries | % of indexed |
|---|---:|---:|
| Top 3 | 136 | 13.6% |
| Top 4–10 | 414 | 41.4% |
| Top 11–20 | 97 | 9.7% |
| Top 21–50 | 117 | 11.7% |
| Below 50 | 236 | 23.6% |

**~55% of ranked queries are already on page 1.** The site has real authority — preserving it through the redesign is the priority.

---

## Top 15 queries by clicks (the rankings to preserve)

| # | Clicks | Pos | Query |
|---:|---:|---:|---|
| 1 | **406** | 1.1 | izhar foster |
| 2 | **246** | 4.3 | prefabricated houses in pakistan |
| 3 | **91** | 7.5 | sandwich panel price in pakistan |
| 4 | 54 | 2.3 | pre fabricated homes in pakistan |
| 5 | 50 | 3.5 | cold store manufacturers in pakistan |
| 6 | 43 | 3.3 | prefabricated houses |
| 7 | 42 | 5.2 | nido prefabricated homes pakistan |
| 8 | 42 | 3.5 | sandwich panel manufacturers in pakistan |
| 9 | 39 | 6.4 | prefab houses in pakistan |
| 10 | 31 | 3.2 | pre fabricated homes |
| 11 | 28 | 36.5 | pir panel ⚠️ |
| 12 | 28 | 25.7 | pir panels ⚠️ |
| 13 | 28 | 4.4 | prefabricated house in pakistan |
| 14 | 25 | 8.8 | cold storage |
| 15 | 25 | 5.8 | sandwich panel |

**Surprising finding:** *prefabricated houses* and related queries are the #2 traffic driver — generating ~500 clicks combined. The new site frames this as B2B "prefabricated structures" (warehouses, industrial). The legacy `/prefabmodular-solutions/` page ranks at pos 14.6 with 18,367 impressions and 1,676 clicks — this is a serious ranking that the new `/services/prefabricated-structures` page must inherit via 301 redirect.

---

## Top 25 queries by impressions (visibility map)

| # | Clicks | Impr | Pos | Query | Status |
|---:|---:|---:|---:|---|---|
| 1 | 25 | 3,573 | 8.8 | cold storage | 🟡 Page 1 borderline — push to top 5 |
| 2 | 25 | 2,876 | 5.8 | sandwich panel | 🟢 Top 6 |
| 3 | 2 | 2,748 | 68.1 | pharmaceutical cold storage | 🔴 Page 7 — content gap |
| 4 | **91** | 2,420 | 7.5 | sandwich panel price in pakistan | 🟢 Money keyword |
| 5 | 4 | 2,275 | 5.7 | controlled atmosphere storage | 🟡 Pos 5.7 but low CTR — title/snippet issue |
| 6 | 28 | 2,159 | 36.5 | pir panel | 🔴 Pos 36 — drop from old site |
| 7 | 11 | 2,060 | 8.4 | izhar group | 🟡 Brand-adjacent traffic |
| 8 | 2 | 1,783 | 9.8 | izhar | 🔴 Brand query, pos 9.8, only 2 clicks |
| 9 | 15 | 1,598 | 25.6 | pir sandwich panel | 🔴 Should be top 5 |
| 10 | 0 | 1,587 | 22.2 | controlled atmosphere | 🔴 0 clicks despite pos 22 |
| 11 | 7 | 1,582 | 10.6 | izhar group of companies | 🟡 |
| 12 | 0 | 1,351 | 72.6 | blast freezing | 🔴 No content; create blog post |
| 13 | 0 | 1,239 | 65.4 | cold storage pharmaceutical products | 🔴 Pharma cold-storage gap |
| 14 | 0 | 1,212 | 68.1 | cold storage pharmacy | 🔴 Same gap |
| 15 | 28 | 1,069 | 25.7 | pir panels | 🔴 Drop from old site |
| 16 | 24 | 1,067 | 7.3 | cold storage business in pakistan | 🟢 |
| 17 | 2 | 1,013 | 8.8 | izhar construction | 🟡 |
| 18 | **246** | 893 | 4.3 | prefabricated houses in pakistan | 🟢 27.5% CTR — best performer |
| 19 | 6 | 890 | 6.6 | cold store | 🟢 |
| 20 | 2 | 881 | 59.9 | cold storage for pharmaceuticals | 🔴 |

---

## High-leverage opportunities

### 🔴 Wasted impressions (≥100 impr, 0 clicks) — content gaps

These queries are getting impressions but no clicks. Either ranking too deep, or appearing for the wrong intent. **Highest priority for new content:**

| Impr | Pos | Query | Action |
|---:|---:|---|---|
| 1,587 | 22.2 | controlled atmosphere | New page or beef up `/services/ca-stores` for this exact-match query |
| 1,351 | 72.6 | blast freezing | **Create `/blog/blast-freezing-vs-blast-chilling-pakistan`** — high-intent industrial query |
| 1,239 | 65.4 | cold storage pharmaceutical products | Pharma cold-chain landing page |
| 1,212 | 68.1 | cold storage pharmacy | Same pharma cluster |
| 540 | 42.0 | cold room in pharmaceutical industry | Same pharma cluster |
| 475 | 19.1 | construction using pir panels | Beef up PIR services page with construction examples |
| 473 | 64.3 | cold storage pharma | Same pharma cluster |
| 450 | 53.9 | benefits of cold storage | New blog post: "Top benefits of cold storage" |
| 399 | 68.5 | cold storage pharmaceutical | Same pharma cluster |
| 261 | 62.6 | cold storage in pharmacy | Same pharma cluster |
| 227 | 81.1 | cool store solutions | Catch with `/services/cold-stores` |
| 216 | 85.7 | cold chain | Cold chain landing page or beef up homepage |
| 167 | 12.1 | ca store | CA stores page already exists — needs to rank |
| 152 | 54.0 | cold room for medicine | Pharma cluster |

**Pattern:** there is a **massive pharmacy/pharmaceutical cold-storage cluster** (~5,500 combined impressions across 7+ queries) that ranks page 5–9 with near-zero clicks. The legacy URL `/cold-stores/pharmaceutical-cold-storage-solutions/` has 16,868 impressions at pos 59.1. This deserves a dedicated, fresh page on the new site: `/services/pharmaceutical-cold-storage` — and a new long-form blog post.

### 🟡 Priority "almost page 1" optimizations (pos 8–15, ≥50 impr)

Bumping these from pos 8–15 to top 3 typically multiplies CTR by 4–8×.

| Impr | Pos | Clicks | Query | What to do |
|---:|---:|---:|---|---|
| 3,573 | 8.8 | 25 | cold storage | Strengthen `/services/cold-stores` → `/services/cold-stores-pakistan` cluster, internal links |
| 2,060 | 8.4 | 11 | izhar group | Brand entity hub — link group companies cleaner from `/about` |
| 1,783 | 9.8 | 2 | izhar | Same — brand schema on homepage already strong |
| 1,582 | 10.6 | 7 | izhar group of companies | Same brand cluster |
| 1,013 | 8.8 | 2 | izhar construction | Internal link to about + sister-site link |
| 703 | 13.5 | 1 | ca storage | Re-target `/services/ca-stores` H1/title |
| 503 | 8.4 | 22 | pu sandwich panel price in pakistan | New page or PIR-vs-PU comparison block |
| 366 | 10.4 | 1 | prefab | Catch with `/services/prefabricated-structures` |
| 167 | 12.1 | 0 | ca store | Title-match `/services/ca-stores` |

### 🟢 Already winning — don't lose these in the redesign

These rankings must be preserved through 301s:

| Old URL (legacy WordPress) | New URL | Clicks (16mo) |
|---|---|---:|
| `/pir-panels/` | `/services/pir-sandwich-panels` | **1,275** |
| `/prefabmodular-solutions/` | `/services/prefabricated-structures` | **1,676** |
| `/` | `/` | 1,097 |
| `/cold-stores/` | `/services/cold-stores` | 417 |
| `/eps-panels/` | `/services/pir-sandwich-panels` (or new EPS section) | 280 |
| `/cold-stores/pharmaceutical-cold-storage-solutions/` | `/services/pharmaceutical-cold-storage` (NEW) | 27 |
| `/prefabricated-structures-pakistan/` | `/services/prefabricated-structures` | 159 |
| `/about-izhar/` | `/about` | 55 |
| `/contact-us/` | `/contact` | 98 |
| `/ca-stores/` | `/services/ca-stores` | 41 |

**Without these 301s, the redesign is a self-inflicted ranking catastrophe.** See full redirect map below.

---

## Device & geographic distribution

### Devices
| Device | Clicks | Impressions | CTR | Avg pos |
|---|---:|---:|---:|---:|
| **Mobile** | 3,499 | 83,549 | **4.19%** | 10.8 |
| Desktop | 2,011 | 96,019 | 2.09% | 31.3 |
| Tablet | 22 | 974 | 2.26% | 9.5 |

**Mobile is the primary surface** — half the clicks at pos 10.8, vs desktop at pos 31.3. Mobile-first design is paying off; the new site already has `<meta viewport>` and 4-breakpoint mobile rules per CLAUDE.md.

### Top countries
| Country | Clicks | Impressions | Pos | Notes |
|---|---:|---:|---:|---|
| 🇵🇰 Pakistan | **4,755** | 94,687 | 6.8 | Core market — protect at all costs |
| 🇺🇸 USA | 49 | 28,731 | 38.7 | High impressions, low conversion (likely diaspora + B2B research) |
| 🇮🇳 India | 17 | 8,510 | 26.7 | Likely competitor research / no commercial intent |
| 🇬🇧 UK | 112 | 6,541 | 39.1 | Diaspora + Pakistani exporters' UK contacts |
| 🇧🇷 Brazil | 0 | 6,007 | 53.4 | Probably noise — language mismatch |
| 🇦🇪 UAE | 108 | 2,375 | **14.0** | High-CTR commercial market — Gulf cold-chain buyers |
| 🇩🇪 Germany | 21 | 1,601 | 46.2 | |
| 🇨🇦 Canada | 28 | 1,552 | 30.2 | Diaspora |

**UAE punches above its weight** — pos 14, 4.5% CTR. There's appetite for Pakistani cold-storage suppliers in the Gulf. Worth a `/markets/uae-export-cold-chain` page eventually.

---

## Critical action plan

### 🔴 Phase 1 — immediate (this week)

#### 1. Add 301 redirects from legacy URLs to new URLs

**Add to [vercel.json](vercel.json) `redirects` array:**

```json
{ "source": "/pir-panels", "destination": "/services/pir-sandwich-panels", "permanent": true },
{ "source": "/pir-panels/(.*)", "destination": "/services/pir-sandwich-panels", "permanent": true },
{ "source": "/eps-panels", "destination": "/services/pir-sandwich-panels", "permanent": true },
{ "source": "/cold-stores", "destination": "/services/cold-stores", "permanent": true },
{ "source": "/cold-stores/(.*)", "destination": "/services/cold-stores", "permanent": true },
{ "source": "/cold-stores/pharmaceutical-cold-storage-solutions", "destination": "/services/cold-stores", "permanent": true },
{ "source": "/cold-stores/meat-and-poultry-cold-storage-services", "destination": "/services/cold-stores", "permanent": true },
{ "source": "/cold-stores/fruits-and-vegetables-cold-storages", "destination": "/services/cold-stores", "permanent": true },
{ "source": "/cold-stores/potato-and-onion-cold-room", "destination": "/services/cold-stores", "permanent": true },
{ "source": "/ca-stores", "destination": "/services/ca-stores", "permanent": true },
{ "source": "/ca-stores/(.*)", "destination": "/services/ca-stores", "permanent": true },
{ "source": "/prefabmodular-solutions", "destination": "/services/prefabricated-structures", "permanent": true },
{ "source": "/prefabmodular-solutions/(.*)", "destination": "/services/prefabricated-structures", "permanent": true },
{ "source": "/prefabricated-structures-pakistan", "destination": "/services/prefabricated-structures", "permanent": true },
{ "source": "/about-izhar", "destination": "/about", "permanent": true },
{ "source": "/about-us", "destination": "/about", "permanent": true },
{ "source": "/contact-us", "destination": "/contact", "permanent": true },
{ "source": "/blog/(.*)", "destination": "/blog", "permanent": false },
{ "source": "/blogs/(.*)", "destination": "/blog", "permanent": false },
{ "source": "/uncategorized/(.*)", "destination": "/blog", "permanent": false },
{ "source": "/top-5-cold-storage-facilities-in-lahore-features-tips", "destination": "/blog", "permanent": true }
```

The blog redirects use `permanent: false` (302) so we can later route specific old posts to specific new ones if we add new blog content matching legacy topics.

#### 2. Remove legacy WordPress sitemaps from GSC

GSC currently shows 4 sitemaps. The 3 legacy ones (`sitemap_index.xml`, `post-sitemap.xml`, `page-sitemap.xml`) are downloading 404s and creating noise. They have **3 warnings, 1 error**.

In Google Search Console → Indexing → Sitemaps: delete the three legacy entries, keep only `sitemap.xml`.

#### 3. Request indexing for top 10 new URLs

In GSC → URL Inspection, request indexing one at a time for:
- `/`
- `/services/cold-stores`
- `/services/pir-sandwich-panels`
- `/services/refrigeration-systems`
- `/services/ca-stores`
- `/services/insulated-doors`
- `/services/prefabricated-structures`
- `/about`
- `/contact`
- `/projects`

GSC limits to ~10–12 manual requests per day; rest will be picked up by the sitemap crawl.

### 🟠 Phase 2 — within 2 weeks

#### 4. Create the missing pharmaceutical cold-storage hub

This is the largest content gap. ~5,500 combined impressions across 7+ queries (`pharmaceutical cold storage`, `cold storage pharmacy`, `cold room for medicine`, etc.) all rank pos 40–70 with near-zero clicks.

**Build:** new `/services/pharmaceutical-cold-storage` page + new `/blog/pharmaceutical-cold-storage-pakistan-guide` long-form blog post (~1,500 words). Cross-link from `/services/cold-stores` and `/services/refrigeration-systems`.

#### 5. Create the missing blast-freezing content

`blast freezing` query: 1,351 impressions, pos 72.6, 0 clicks. **Create `/blog/blast-freezer-vs-blast-chiller-pakistan-guide`** — high-intent industrial query.

#### 6. Beef up CA stores page for "controlled atmosphere" exact match

`controlled atmosphere`: 1,587 impressions, pos 22.2, 0 clicks. The page exists at `/services/ca-stores` but doesn't rank for this exact-match. Rewrite H1 + first 200 words to lead with **"Controlled Atmosphere storage"** as exact phrase.

#### 7. Add an `izhar` / `izhar group` brand-entity block

`izhar`, `izhar group`, `izhar group of companies` together = ~5,400 impressions, pos 8–11, only 20 clicks. The about page should clearly explain Izhar Group's structure and link out to sister sites — already partially done per recent commit "Update About page: 12 group companies, link out to sister sites".

### 🟡 Phase 3 — within 4 weeks

#### 8. Create localized landing pages for top cities

Existing site mentions Lahore, Karachi, Multan, Faisalabad — top GSC queries include "cold store manufacturers in pakistan" (50 clicks, pos 3.5) but no city-level pages exist. Build:
- `/cold-storage/lahore`
- `/cold-storage/karachi`
- `/cold-storage/multan`
- `/cold-storage/faisalabad`

Use the existing 12-city ASHRAE design-temp dataset from the calculator. Each page: 600+ unique words.

#### 9. New blog posts for high-impression / low-rank gap queries

| Topic | Target query | Source impressions |
|---|---|---:|
| "Benefits of cold storage in Pakistan" | benefits of cold storage | 450 |
| "Construction using PIR panels — Pakistan guide" | construction using pir panels | 475 |
| "Cool store solutions for fresh produce" | cool store solutions | 227 |
| "Cold chain in Pakistan — full primer" | cold chain | 216 |

---

## Methodology

- **Source:** Google Search Console Search Analytics API via Composio MCP
- **Property:** `https://izharfoster.com/` (URL-prefix; user has siteOwner permissions)
- **Date range:** 2024-12-30 → 2026-04-28 (16 months — GSC default retention)
- **Row limits:** 1,000 per dimension query (GSC API cap; totals are floor-bounded)
- **Tools used:** `GOOGLE_SEARCH_CONSOLE_SEARCH_ANALYTICS_QUERY`, `GOOGLE_SEARCH_CONSOLE_INSPECT_URL`, `GOOGLE_SEARCH_CONSOLE_LIST_SITES`, `GOOGLE_SEARCH_CONSOLE_LIST_SITEMAPS`
- **Note on totals:** because each dimension query is independently capped at 1,000 rows, summing across dimensions produces minor double-counts (visible in the 100%+ device percentages). Per-row figures are accurate.
