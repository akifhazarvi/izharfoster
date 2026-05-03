# Izhar Foster — SEO Action Plan

**Generated:** 2026-05-02 — Overall score: **78 / 100**
Reference: [FULL-AUDIT-REPORT.md](FULL-AUDIT-REPORT.md) for full findings per category. Per-category deep-dives in `_audit/*.md`.

This plan is sequenced by **impact ÷ effort**, not by category. Items are grouped by deadline, not by domain — that is how shipping actually works on this codebase. Every item references which GROWTH-PLAN section it serves.

---

## Critical — fix this week

These are the blockers. Each is high-impact, low-effort, and should ship before any other SEO work.

### 1. Internal-link the pharmaceutical cold storage page from the homepage
**Impact:** High (the #1 GSC opportunity — 16,740 imp, pos 59 — currently has no homepage link). Expected: 5-10 position uplift from internal-link equity alone.
**Effort:** 10 min
**Files:** `index.html` (hero scrubber, products grid)
**GROWTH-PLAN:** §4 (priority pillars), §10 (pharma rebuild)

Add `/services/pharmaceutical-cold-storage` to:
- The hero scrubber rotation
- The products / services grid below the hero
- Any "What we do" sticky module

### 2. De-anonymise the pharma page reference projects
**Impact:** Critical trust signal on the highest-GSC page. Anonymous "GMP Pharmaceutical Cold Room — Karachi" + "Vaccine Distribution Cold Chain — Multan" reads as fictional.
**Effort:** 30 min if names exist; 3-4 hr to ship a real case study page if needed
**Files:** `services/pharmaceutical-cold-storage.html`
**GROWTH-PLAN:** §10 (case studies queue), §13 (cold-store funnel)

Either name the clients (even partially: "Tier-1 multinational pharma, Karachi, 2023, 800 m³") or delete the bullet.

### 3. Render-blocking Google Fonts → async
**Impact:** 300-600 ms LCP gain on 3G; affects every page.
**Effort:** 15 min
**Files:** every `<head>` block (consider a shared header partial if not already)

```html
<!-- BEFORE -->
<link rel="stylesheet" href="https://fonts.googleapis.com/...">

<!-- AFTER -->
<link rel="preload" as="style" href="https://fonts.googleapis.com/..."
      onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/..."></noscript>
```

System-font fallbacks already exist in `css/style.css` CSS variables — text remains readable while fonts load.

### 4. Add 74-word "what we do" passage to homepage hero
**Impact:** Closes the homepage AI-citation gap. Current first extractable prose is the 24-word meta description; LLMs need 50-80 words to cite confidently.
**Effort:** 15 min
**Files:** `index.html` (insert into `.hp-hero-inner`)

Drafted by the GEO agent (full text in `_audit/geo-findings` agent output): leads with "Izhar Foster (Pvt) Limited is Pakistan's largest manufacturer of PIR sandwich panels…", names temperature range, key product set, founding year, plant size, project count.

### 5. Standardise telephone schema values to E.164
**Impact:** NAP consistency for local pack eligibility and citation matching.
**Effort:** 15 min
**Files:** `index.html`, `contact.html`, `cold-storage-lahore.html`, `cold-storage-karachi.html`

Three formats currently appear in JSON-LD: `+92-42-35383543`, `+92 42 3538 3543`, `+92-42-3538-3543`. All schema `telephone` values → `+924235383543`. Display HTML can stay human-readable.

### 6. Add `IndexNow:` directive to robots.txt
**Impact:** Bing recrawl latency on publish.
**Effort:** 2 min
**Files:** `robots.txt`

Append:
```
IndexNow: https://izharfoster.com/36864c9bc2a84d3ab82c3601af63361e.txt
```

### 7. Fix `refrigerated-vehicles.html` og:image (currently the pharma room image)
**Impact:** Wrong preview in social shares + AI tools. AI tools cite with the wrong visual.
**Effort:** 5 min
**Files:** `services/refrigerated-vehicles.html`

Until a real reefer vehicle photo exists, point `og:image` to `og-default.jpg`. Remove the duplicate `og:image:alt`.

### 8. Convert author schema on top-3 blog posts from `Organization` to `Person`
**Impact:** ChatGPT and Perplexity prefer human-attributed sources; uplifts citation confidence on the three highest-traffic posts.
**Effort:** 45 min
**Files:**
- `blog/cold-storage-cost-pakistan-2026-buyers-guide.html`
- `blog/cold-storage-solutions-pakistan-demand-rising.html`
- `blog/cold-storage-pakistan-export-growth.html`

Use Muhammad Anwar Inayat (GM Business Development & Marketing) as the named author. Schema snippet:

```json
"author": {
  "@type": "Person",
  "name": "Muhammad Anwar Inayat",
  "jobTitle": "General Manager, Business Development & Marketing",
  "worksFor": {"@type": "Organization", "name": "Izhar Foster (Pvt) Limited"},
  "url": "https://izharfoster.com/about"
}
```

Add a one-sentence in-text bio at the bottom of each post — schema alone isn't what LLMs extract for "according to" citations.

---

## High — fix this sprint (next 2 weeks)

### 9. Claim and verify Google Business Profile at the Lahore HQ
**Impact:** Currently zero GBP signals on the entire site for a B2B manufacturer with a 277,460 sqft physical plant. Single highest-impact local action.
**Effort:** Initial claim + 1-2 weeks postcard verification, then ~30 min to embed
**Files:** Off-site (Google Business Profile dashboard) + `contact.html`, `cold-storage-lahore.html` (Maps embed once verified)

Primary category: "Refrigeration Contractor" or "Cold Storage Facility" (whichever Google's taxonomy currently exposes). Secondary categories: "General Contractor", "Manufacturer". Add 8-12 photos (plant exterior, panel manufacturing line, finished cold rooms, certifications). Set hours, areas served, services.

### 10. Add `openingHoursSpecification` to LocalBusiness schema
**Impact:** Recommended property for local pack eligibility.
**Effort:** 30 min
**Files:** `index.html` (homepage Organization/LocalBusiness block), `contact.html`, `cold-storage-lahore.html`, `cold-storage-karachi.html`

```json
"openingHoursSpecification": [
  {"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "09:00", "closes": "18:00"},
  {"@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "09:00", "closes": "13:00"}
]
```

### 11. Long-cache CSS / JS with versioned filenames
**Impact:** 50-200 ms saving on repeat visits site-wide.
**Effort:** 30 min
**Files:** `vercel.json`, `style.css → style.v2.css`, `main.js → main.v2.js`, `track.js → track.v2.js`, plus every `<link>` and `<script>` reference

Add to `vercel.json` headers:
```json
{ "source": "/css/(.*).css", "headers": [{"key": "Cache-Control", "value": "public, max-age=31536000, immutable"}]},
{ "source": "/js/(.*).js",   "headers": [{"key": "Cache-Control", "value": "public, max-age=31536000, immutable"}]}
```

### 12. Add static "How this calculator works" section to all 8 tool pages
**Impact:** Tool pages currently render to `title + schema + 1 disclaimer line` for non-JS crawlers. Adds ~125 words of indexable, citable methodology per tool.
**Effort:** 3-4 hr
**Files:** all 8 in `tools/`

Priority order: `load-calculator`, `energy-cost`, `capacity-planner`, `ca-atmosphere` (highest AI-query relevance), then `condenser-sizing`, `refrigerant-charge`, `a2l-room-area`, `cost-calculator`.

Template (full text in `_audit/geo-findings` GEO agent output): a `<section class="section section-soft">` between the `calc-grid` and `<footer>` with H2 + 100-150 word methodology paragraph naming the engineering standard, the inputs, the outputs, and the cross-validation reference (e.g., "validated within ±20% of Heatcraft NROES").

### 13. Add MKT explanation + WHO PQS reference + excursion protocol to pharma page
**Impact:** Closes three named gaps on the highest-GSC page; each maps to a specific search query (mean kinetic temperature cold storage, WHO PQS vaccine cold storage, GMP excursion protocol).
**Effort:** 1.5 hr
**Files:** `services/pharmaceutical-cold-storage.html`

- 100-word MKT section with the Haynes (1971) equation
- Reference to WHO PQS (E003 catalogue) for vaccine procurement
- 150-word excursion-response protocol (DRAP GSDP)
- Cite DRAP by document number, not just acronym

### 14. Expand the two thin blog posts above 1,500 words
**Impact:** Closes the content-floor gap.
**Effort:** 3 hr total
**Files:**
- `blog/insulated-doors-energy-efficiency-cold-storage.html` (1,340 → 1,550)
- `blog/green-refrigeration-energy-carbon-footprint.html` (1,429 → 1,600)

### 15. Move GA4 inline gtag block below `<meta charset>` and `<meta name="viewport">`
**Impact:** Removes FOUC tick risk. ~10-30 ms.
**Effort:** 5 min
**Files:** every `<head>` (find/replace)

### 16. Self-host or downgrade YouTube poster image
**Impact:** 50-120 ms + 80-150 KB on homepage LCP.
**Effort:** 30 min
**Files:** `index.html`

Either: (a) keep `i.ytimg.com` but switch from `maxresdefault.jpg` to `hqdefault.jpg` (already the `onerror` fallback) and add `width="480" height="360" fetchpriority="low"`; or (b) self-host a WebP and reference it locally.

### 17. Declare `<script src="../js/track.js" defer>` directly on service / blog pages
**Impact:** 100-300 ms saving on 3G on those pages — preload scanner can't discover dynamically-injected scripts.
**Effort:** 30 min
**Files:** all 13 services, 9 blog, 14 projects, 2 city pages, plus remove the `loadTracker()` IIFE from `js/main.js`

### 18. Add Karachi office `geo` and `branchOf` schema
**Impact:** Karachi city page lacks geo coordinates; Lahore has them. Karachi office is also absent from any JSON-LD entity site-wide.
**Effort:** 30 min
**Files:** `cold-storage-karachi.html`, `contact.html`

Add `~24.87660, 67.06370` (PECHS) to the Karachi city page LocalBusiness block. Add a second PostalAddress / `branchOf` node on `contact.html`.

---

## Medium — fix this month

### 19. Wikipedia entity for Izhar Engineering / Izhar Foster
**Impact:** Single biggest entity gap for ChatGPT / Perplexity / Google KG citation. Notability defensible from 1959 founding, Coca-Cola / Nestlé / Pakistan Army client list, USAID delivery, Pakistan's-largest-PIR-manufacturer claim.
**Effort:** 6-8 hr (article draft + finding 4-6 third-party sources)

Build the third-party citation inventory first: Dawn / Express Tribune / Business Recorder / Bloomberg coverage of any client project, USAID project documentation, TDAP cold-chain reports. The article is rejected without third-party citations regardless of how strong the company is.

Add the Wikipedia URL to homepage Organization `sameAs` once live.

### 20. Build `/cold-storage-multan` page
**Impact:** Local organic on the city with Pakistan's strongest engineering story (mango, dates, ASHRAE 0.4% DB ~50°C, MEPCO, HAC Agri at Phool Nagar in arm's reach).
**Effort:** 6-8 hr (target 2,800+ words on the same plan as Lahore/Karachi)
**Files:** new `cold-storage-multan.html` + sitemap + GROWTH-PLAN tick
**GROWTH-PLAN:** §10 (planned city pages)

### 21. Build `/cold-storage-faisalabad` page
**Impact:** Dairy belt + Interloop tie-in (already on client carousel).
**Effort:** 6-8 hr
**Files:** new `cold-storage-faisalabad.html` + sitemap

### 22. Image sitemap + video sitemap entries
**Impact:** Free Google Image and Google Video discovery.
**Effort:** 1.5 hr
**Files:** `sitemap.xml`

Add `<image:image>` for the 6 core service pages (cold-stores, pir-sandwich-panels, pharmaceutical-cold-storage, refrigeration-systems, ca-stores, homepage). Add `<video:video>` for the YouTube facility tour on the homepage entry.

### 23. Upgrade homepage schema subtype to `["LocalBusiness", "GeneralContractor"]`
**Effort:** 5 min
**Files:** `index.html`

### 24. Add review-collection CTA to contact page footer
**Effort:** 30 min after GBP verified
**Files:** `contact.html`, footer partial if exists

"Review us on Google" button → GBP short URL.

### 25. Name SGS (or actual registrar) on certifications page
**Impact:** Trust signal on the page procurement teams use to verify.
**Effort:** 10 min (assuming the certificates name SGS)
**Files:** `certifications.html`

### 26. Service-page heroes → `<picture>` + multi-width WebP srcset
**Impact:** Performance + image SEO consistency with homepage.
**Effort:** 2-3 hr
**Files:** all 13 services

### 27. llms.txt polish
**Effort:** 30 min
**Files:** `llms.txt`

- Add the 5 vertical sub-pages (dairy, meat/poultry, fruit/veg, potato/onion, banana ripening) to citation URLs
- Add "Last verified: 2026-05-02" freshness line at top
- Add a "Flagship case studies" block (TCCEC Coca-Cola, USAID Banana Ripening, HAC Agri, Iceland Raiwand, Connect Logistics)
- Change `λ ≈ 0.022` to `λ = 0.022 (BS EN 14509 declared aged value)`
- Annotate PUR comparison λ with "(ISO 8301 typical)"

### 28. Project case-study schema upgrade
**Effort:** 1 hr
**Files:** all 14 in `projects/`

Use `["Article", "CaseStudy"]` or add a dedicated CaseStudy block with `industry`, `applicationCategory`, `client` fields.

### 29. PEC contractor registry citation
**Effort:** 1 hr (off-site)

Verify the listed address and phone match site canonical exactly. Add the PEC profile URL to homepage `sameAs`.

### 30. Vehicle hero photo for `/services/refrigerated-vehicles`
**Effort:** depends on photo source
**Files:** `services/refrigerated-vehicles.html`

Once a real reefer photo exists, replace the placeholder and the og:image.

---

## Low — backlog

### 31. Wire `lastmod` to per-file git log
Becomes important before site reaches 100+ URLs.

### 32. Add `<meta name="robots" content="noindex,nofollow">` to `_scrape_coldstore/` HTML files
Belt-and-braces in case `.vercelignore` ever changes.

### 33. CLS hygiene
- Explicit `width`/`height` on the 9 client-carousel SVGs
- Wrap scrubber `setActive()` in `requestAnimationFrame` + `IntersectionObserver` pause when off-screen
- Remove `decoding="async"` from the LCP hero `<img>` only

### 34. `<link rel="preload" as="font">` for the two heaviest Inter weights
After the Google Fonts async fix is in.

### 35. `speakable` schema on FAQ blocks
Pharma + cost guide pages first.

### 36. ImageObject + HowTo schema additions
ImageObject on hero images; HowTo on the 8 calculator pages.

### 37. Press citations
Find one Dawn / Express Tribune / Business Recorder mention of a client project (USAID banana, TCCEC Coca-Cola, HAC Agri) and link it from `projects.html` or `about.html`.

### 38. Crunchbase profile + sameAs
~20 min profile setup; add to `sameAs` once live.

### 39. Industry vertical pages (beverage, dairy, agri-export, 3PL)
Per GROWTH-PLAN §10. Hold until current sprint commitments ship.

---

## What's intentionally NOT on this plan

- Full re-architecture of the homepage. The current hero/scrubber/products grid works; the only homepage change here is the pharma link + the 74-word static passage.
- Ripping out GA4 in favour of something else. GA4 + Vercel Analytics is fine.
- Migrating the static HTML to a build step. The "no build step" choice in CLAUDE.md is a deliberate constraint. Long-cache filename versioning can be done by hand on three files; it doesn't justify a build pipeline.
- Anything for the deprioritised pillars (Plant Factories, Smart Cabins, full PEB) per GROWTH-PLAN §3.

---

## Score trajectory

If items 1-18 ship cleanly, expected next-audit score: **84-86 / 100** (Technical 90+, Content 82+, AI Search 82+, Performance 75+, Local — once GBP verified — 70+). Items 19-30 are the path from 86 to 90+.
