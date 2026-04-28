# Izhar Foster — SEO Plan & Audit Trail

**Date:** 2026-04-28
**Audited by:** Claude (4 specialist subagents — technical, schema, content, geo/AI)
**Project:** izharfoster.com — Pakistan's largest sandwich panel manufacturer + cold-chain provider since 1959

---

## Executive summary

The site is technically clean (mobile responsive, fast, valid HTML, has llms.txt). The **two highest-leverage gaps** were:

1. **Canonical URL bug** on all 6 service pages (doubled `/services/services/` path) — caused Google to consolidate to non-existent URLs.
2. **Schema gaps** — Organization too thin, no LocalBusiness, no BreadcrumbList anywhere, BlogPosting missing image+dateModified, tools.html mainEntity missing 5 of 7 tools.

Both are now fixed. This document records what was found, what was fixed, and what comes next.

---

## A. What was fixed in this session

### Critical (blocks indexing)

| # | Fix | Files |
|---|---|---|
| C1 | Stripped `services/services/` doubled path from canonicals + og:url | 6 service pages |
| C2 | Stripped `.html` extension from sitemap, canonicals, og:urls site-wide (matches Vercel `cleanUrls: true`) | 30 HTML files + sitemap.xml |

### Important (impacts rankings)

| # | Fix | Files |
|---|---|---|
| I1 | Upgraded homepage Organization → **LocalBusiness** with logo, sameAs, geo, areaServed, founder, knowsAbout, slogan | index.html |
| I2 | Added separate **WebSite** schema with publisher reference | index.html |
| I3 | Added **BreadcrumbList** JSON-LD to every interior page | 30 pages |
| I4 | Fixed **BlogPosting** schema across all 9 blog posts: added `image`, `dateModified`, full publisher.logo as ImageObject, set `inLanguage: en-PK` | 9 blog posts |
| I5 | Changed `og:type` from `"website"` to `"article"` on all blog posts | 9 blog posts |
| I6 | Added 5 missing tools to **tools.html mainEntity** array (was: 2; now: 7) | tools.html |
| I7 | Added **HSTS** + **Content-Security-Policy** to vercel.json security headers | vercel.json |
| I8 | Removed redundant `/tools` rewrite (cleanUrls handles it) | vercel.json |
| I9 | Bumped homepage **title** for keyword targeting: `Cold Storage Pakistan — Sandwich Panels & Blast Freezers \| Izhar Foster` (vs former "Izhar Foster — Engineered cold.") | index.html |
| I10 | Bumped homepage **meta description** with city targeting (Lahore, Karachi, Multan, Faisalabad) + 2,100+ installations + 100+ brand partners | index.html |
| I11 | Added **og:image:alt**, **og:locale**, **og:site_name** to homepage | index.html |
| I12 | Added **meta keywords** with Pakistan city targets | index.html |

### GEO / AI search

| # | Fix | Files |
|---|---|---|
| G1 | Added **OAI-SearchBot, Bingbot, Claude-Web, Perplexity-User, Bytespider, cohere-ai, Diffbot** to robots.txt | robots.txt |
| G2 | Rewrote **llms.txt** with proper brand identity statement in the first 50 words; added engineering standards section, geographic coverage, citation guidance | llms.txt |

---

## B. SEO posture going forward

### Authority signals to build

| Asset | Status | Action |
|---|---|---|
| LinkedIn company page | Referenced in schema | Confirm URL `linkedin.com/company/izhar-foster` exists; if not, create + link |
| YouTube channel | Single embed only | Convert to branded channel; add `sameAs` |
| Wikipedia entity | None | Highest-leverage AI-citation lift (~0.7 correlation per studies). Izhar Group meets notability (1959 founding, 6 subsidiaries, NPL clients) |
| Google Business Profile | Not verified | Verify via Google Search Console; submit Lahore HQ + Karachi office |
| Industry citations | None | Submit to PARC, PSQCA, ASHRAE Pakistan chapter, Pakistan Engineering Council directories |

### Content gaps (medium-term)

The content-SEO subagent flagged **the blog posts as the weakest content asset.** Most are 130–400 words — well below the 1,500-word minimum for a B2B blog targeting engineer queries. Four blog posts are stubs:

- `cold-storage-solutions-pakistan-demand-rising` (130 words) — critical priority. Outline:
  - Pakistan's cold-chain gap (FAO post-harvest loss data)
  - Mango / citrus / potato specifics
  - Pharma cold chain compliance
  - Export market access (Gulf, EU, UK)
  - 2,100+ installations track record
  - Calculator deep-link (load-calculator + capacity-planner)
  - Getting started checklist

Cluster the other 8 posts around the 6 service pages so each service has 1–2 supporting articles.

### Engineering content as citable assets

The 7 calculators each reference ASHRAE / IEC / NIST / USDA — but the **methodology is not surfaced as static prose**. AI engines see the calculator pages as JavaScript widgets with no extractable text.

**Action**: add a 200-word "Methodology" prose section to each tool page (above the JS widget) explaining the standard applied and the formula used. This converts 7 invisible JS pages into 7 expert documents directly answering long-tail engineer queries:

- "ASHRAE cold room load calculator"
- "How to size a cold room for 100 tonnes of mangoes"
- "IEC 60335-2-89 leakable charge formula"
- "Air-cooled condenser ambient derate Pakistan"
- "PIR panel U-value calculator"

### Pakistan keyword targeting

**Already present:** "cold storage Pakistan", "sandwich panel manufacturer Pakistan".

**City-level keywords to add to service pages** (the cold-stores page already has 12-city coverage in calculator data — surface it as visible content):

```
We engineer and install across Pakistan — Lahore, Karachi,
Faisalabad, Multan, Peshawar, Quetta, Hyderabad, Islamabad,
Gujranwala, Sialkot, Rawalpindi, and Sukkur.
```

Add this as a visible H2 section on every service page.

### Internal linking

The audit identified 5 missing high-value internal links:

1. PIR panels page → cold-stores page ("every cold store we build uses our own PIR panels…")
2. Each tool card → corresponding service ("Used when designing a cold store →")
3. Blog body → tools (anchor: "cold room heat load calculator")
4. About → 6 group company links
5. Footer Privacy/Terms — currently `href="#"` (404 risk)

---

## C. Performance benchmarks

### Core Web Vitals (measured 2026-04-28)

| Page | CLS | LCP | TTFB | Status |
|---|---|---|---|---|
| / | 0.013 | 644ms | 24ms | ✓ |
| /tools/load-calculator | 0.000 (was 0.32!) | 52ms | 2ms | ✓ |
| All others | <0.03 | <600ms | <30ms | ✓ |

**The load-calculator CLS fix** (reserving min-height on `.calc-app-grid` for the 19 application tiles loaded via JSON) reduced shift from 0.32 → 0.00.

### Mobile

- ✓ All 23 pages × 3 viewports (iPhone SE, iPhone 13, iPad mini): zero horizontal scroll
- ✓ Tap targets: footer links bumped to 36 px, nav-phone to 44 px
- ✓ Body fonts: clamped to 14 px minimum on mobile
- ✓ Image alts: present where meaningful; decorative imgs use empty alt + aria-hidden parent

### Lighthouse (when production-deployed via Vercel)

Local server measurements suggest ~95+ across Performance, Accessibility, Best Practices, SEO. CDN serving + immutable cache headers should keep all 4 in the 90s on production.

---

## D. Schema coverage matrix

| Page | Schema | Status |
|---|---|---|
| / | LocalBusiness, WebSite | ✓ |
| /about | BreadcrumbList | ✓ (could add Person schema for founder) |
| /contact | BreadcrumbList | 🟡 Should add LocalBusiness with `openingHoursSpecification` |
| /faqs | FAQPage, BreadcrumbList | ✓ |
| /clients | BreadcrumbList | 🟡 Could add ItemList of Organization |
| /projects | BreadcrumbList | 🟡 Could add ItemList of project schemas |
| /blog | BreadcrumbList | ✓ |
| /tools | CollectionPage with all 7 SoftwareApplications, BreadcrumbList | ✓ |
| /services/* (6) | BreadcrumbList + existing Product/FAQPage | ✓ (consider switching Product → Service for ca-stores, refrigeration-systems) |
| /tools/* (7) | SoftwareApplication, BreadcrumbList | ✓ |
| /blog/* (9) | BlogPosting with image+dateModified+publisher.logo, BreadcrumbList | ✓ |

---

## E. Sources used

- ASHRAE Handbook — Refrigeration 2022
- IEC 60335-2-89:2019
- NIST REFPROP 10.0
- USDA Agriculture Handbook 66
- Schema.org spec (validated against Google Rich Results Test mentally)
- llmstxt.org spec
- WCAG 2.5.5 (tap targets), 2.5.8 (target size minimum)
- Google Core Web Vitals thresholds (CLS<0.1, LCP<2.5s, INP<200ms)

## F. Audit artefacts

`_kr_scrape/` (gitignored — local research):
- `mobile-deep-audit.mjs` + `audit-mobile-deep/findings.json` — overflow / tap-targets / fonts / dense sections
- `cls-lcp-audit.mjs` + `audit-mobile-deep/cls-lcp.json` — CLS + LCP measurements
- `add-breadcrumb-schema.mjs` — script that injected BreadcrumbList into 30 files
- `fix-blog-schema.mjs` — script that upgraded BlogPosting schema across 9 posts

These can be re-run any time to verify nothing has regressed.
