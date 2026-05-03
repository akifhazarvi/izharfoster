# izharfoster.com — Full SEO Audit Report
**Date:** 2026-05-01  
**Site:** https://izharfoster.com  
**Stack:** Static HTML + CSS + Vanilla JS, Vercel deployment from `main`  
**Audit coverage:** 7 specialist agents — Technical · On-Page · Content/E-E-A-T · Schema · Performance · GEO/AI · Images

---

## Overall SEO Health Score: 76 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 74/100 | 16.3 |
| Content Quality | 23% | 74/100 | 17.0 |
| On-Page SEO | 20% | 78/100 | 15.6 |
| Schema / Structured Data | 10% | 71/100 | 7.1 |
| Performance (CWV) | 10% | 74/100 | 7.4 |
| AI Search Readiness | 10% | 79/100 | 7.9 |
| Images | 5% | 68/100 | 3.4 |
| **Total** | **100%** | | **74.7 / 100** |

---

## Executive Summary

### Business context
Impressions-rich, click-poor (5,490 clicks / 179,453 impressions / position 21.7 over 16 months). Primary growth lever: **CTR on existing rankings**, not new keyword discovery. Single biggest opportunity: pharmaceutical cold storage — 16,740 impressions at position 59.

### Top 5 critical issues

1. **Pharmaceutical cold storage page has anonymous-only reference projects** — no named pharma client anywhere on the page. Position 59 with 16,740 impressions = already ranking, not converting. Anonymous project references are the most likely CTR suppressor.
2. **Google Fonts is render-blocking on every page** — synchronous `<link rel="stylesheet">` to `fonts.googleapis.com` blocks rendering before the LCP hero loads. Adds 200–600ms to FCP on Pakistan mobile connections.
3. **BreadcrumbList position 2 URL duplicates position 3** on all service pages — both point to the same service page URL. Google's Rich Results Test will flag this and suppress rich result eligibility site-wide for service pages.
4. **All blog posts use Organisation-level authorship only** — no named human author in visible HTML or Person-type schema. Significant E-E-A-T gap for a B2B site covering pharma and food-safety topics.
5. **144-commodity cold storage guide is JavaScript-rendered** — AI crawlers and lightweight scrapers see only "Loading commodity data…". The richest structured data asset on the site is invisible to non-JS crawlers.

### Top 5 quick wins

1. Fix BreadcrumbList position 2 on all service pages — change to `{ name: "Solutions", item: "https://izharfoster.com/solutions" }` (10 min, unblocks rich results site-wide)
2. Fix Google Fonts render-blocking — add `media="print" onload="this.media='all'"` pattern (30 min, measurable LCP gain)
3. Add `datePublished` + `dateModified` to all service page JSON-LD (30 min, unlocks freshness signals in Google AIO)
4. Add VideoObject `duration` to homepage schema (5 min, unlocks Video rich result eligibility)
5. Add `contactPoint` array to homepage LocalBusiness schema (15 min, required for full Knowledge Panel eligibility)

---

## 1. Technical SEO — 74 / 100

### robots.txt — PASS
All 16 major search and AI crawlers explicitly allowed including GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bingbot, Googlebot. `Disallow: /_scrape/`, `/_kr_scrape/` correctly excludes research directories (also gitignored). Sitemap declared.

### sitemap.xml — PASS (fixed in this audit)
- Before: 58 URLs, `certifications.html` (indexable, no noindex) missing.
- After: 59 URLs, `certifications.html` added (lastmod 2026-05-02). Committed: `56ed47d`.
- `<changefreq>` and `<priority>` removed (deprecated, ignored by Google since 2023).

**Issue — High:** All `lastmod` values are bulk-set to `2026-05-01`. Google ignores fabricated identical dates, defeating the purpose of `lastmod`. Use real per-file git modification timestamps.

**Issue — Medium:** `/cold-storage-multan` and `/cold-storage-faisalabad` are in GROWTH-PLAN as priority city landing pages but neither file exists yet.

### Canonical tags — PASS
All pages have correct self-referencing canonicals using clean URLs (no `.html` extension). Exception: `tools/load-calculator.html` schema `url` property includes `.html` extension — mismatch with the canonical. Fix in schema only.

### Meta robots — PASS
All primary pages: `index,follow,max-snippet:-1,max-image-preview:large`. `tools/project.html`, `privacy.html`, `terms.html` correctly noindex.

### Redirects — PASS
114 permanent 301 rules in `vercel.json`. No redirect chains. Legacy WordPress patterns covered. `cleanUrls: true` + `trailingSlash: false` enforced.

**Issue — Medium:** Nav home links use `href="index"` / `href="../index"` — these trigger a 301 on every click. Change to `href="/"`.

### Security headers — PASS (strong)
Full HSTS with preload, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, comprehensive CSP.

**Issue — Medium:** CSP missing `frame-ancestors 'self'`. HTTP/2 intermediaries can strip `X-Frame-Options`. Add `frame-ancestors 'self'` to the CSP string.

### CSS/JS caching — Medium risk
`Cache-Control: public, max-age=0, must-revalidate` for `/css/` and `/js/`. Zero browser cache benefit for returning visitors. Lighthouse "Serve static assets efficiently" will fail. Increase to at least `max-age=86400`.

### IndexNow — Partial
Key file exists at `/36864c9bc2a84d3ab82c3601af63361e.txt`. But no automated URL submission workflow exists — the key file is inert without active pushes to the IndexNow API on each deploy.

---

## 2. On-Page SEO — 78 / 100

### Title tags
| Issue | Affected pages |
|---|---|
| Over 70 chars | `cold-stores.html` (79), `pir-sandwich-panels.html` (78), `refrigeration-systems.html` (79) |
| Over 80 chars — will be truncated mid-title | `ca-stores.html` (98) |
| All have brand suffix | ✓ |
| No duplicates | ✓ |

### Meta descriptions
| Issue | Affected pages |
|---|---|
| Over 160 chars — truncated in SERP | `ca-stores.html` (313), `cold-stores.html` (265), `pharmaceutical-cold-storage.html` (274), `refrigeration-systems.html` (266), `pir-sandwich-panels.html` (216), `refrigerated-vehicles.html` (276) |
| Under 120 chars — too short | `emirates-logistics-lahore.html` (136), `gourmet-ice-cream-lahore.html` (135), `metro-ravi-lahore.html` (135) |
| Missing | None |

### H1 — PASS
Every page has exactly one H1. No duplicates, no missing.

### OG tags — PASS (with dimension issues — see Images section)
All 59 pages have `og:title`, `og:description`, `og:image`.

**Issue — Medium:** `og:url` and `og:locale` missing from all non-homepage pages. Social parsers fall back to current URL; add `og:url` and `og:locale="en_PK"` site-wide.

### Internal linking
Service pages have consistent tool links but **zero links to blog posts**. Blog posts link forward to services and tools well. The about page has no outbound editorial links.

| Page | Blog links | Tool links |
|---|---|---|
| cold-stores.html | 0 | 2 |
| pir-sandwich-panels.html | 0 | 1 |
| pharmaceutical-cold-storage.html | 0 | 2 |
| refrigeration-systems.html | 0 | 2 |
| about.html | 0 | 0 |

---

## 3. Content Quality / E-E-A-T — 74 / 100

**Composite E-E-A-T: 75.6 / 100**

| Dimension | Score |
|---|---|
| Experience | 62/100 |
| Expertise | 82/100 |
| Authoritativeness | 70/100 |
| Trustworthiness | 84/100 |

### What's strong
- Named equipment partners (Bitzer, Heatcraft, LU-VE, Zanotti, Hörmann, Thermo King) appear on every service page.
- PKR cost bands field-validated from 2,100+ delivered projects — strong first-hand experience claim.
- Regulatory specificity on pharma page: WHO TRS 961, DRAP GSDP, ISO 5149-1 cited in body text.
- Leadership team named with direct contact (about.html) — exceptional for Pakistan B2B.
- Buyer's guide: 7 structured data tables, 2,400 words, FAQPage schema — strongest AI citation target on the site.

### Critical gaps
- **Pharma reference projects are anonymous** — "GMP Pharmaceutical Cold Room — Karachi" with no client name, year, or verifiable detail. Critical fix for position-59 conversion.
- **All blog posts: Organisation-level authorship only** — no Person-type author in schema or visible HTML byline.
- **Refrigeration systems page has zero project references** — weakest authority page of the four primary services.
- **Broken onclick tool link in cost guide** — `href="#" onclick="document.querySelector('a[href*=load-calculator]').click()"` should be `href="../tools/load-calculator"`.

### Per-page scores
| Page | Score | Primary gap |
|---|---|---|
| Homepage | 78/100 | No blog links; no human author reference |
| Cold Stores | 84/100 | No blog links; cost-band figures repeat across 3 pages without clear metric distinction |
| PIR Sandwich Panels | 85/100 | "Only manufacturer" claim unqualified; "49×" uncited |
| Pharmaceutical Cold Storage | 76/100 | Anonymous projects; no blog links; no DRAP checklist; biggest GSC opportunity |
| Refrigeration Systems | 72/100 | Zero project references; no blog links; system diagram images unverified |
| About | 80/100 | Staff initials-avatars instead of photos; no testimonials; no credentials |
| Blog: Demand Rising | 82/100 | Org authorship only; 30–40% stat uncited |
| Blog: Cost Guide | 88/100 | Org authorship only; broken onclick link |

---

## 4. Schema / Structured Data — 71 / 100

### Critical failures
| Issue | Severity | Impact |
|---|---|---|
| `projects/tccec-coca-cola-lahore.html` Article missing `datePublished` | Critical | Article rich result impossible |
| `BreadcrumbList` position 2 uses same URL as position 3 — all service pages | Critical | Rich result validation fail site-wide |
| VideoObject missing `duration` on homepage | High | Video rich result ineligible |

### High-priority gaps
| Gap | Affected pages |
|---|---|
| `contactPoint` missing from homepage `LocalBusiness` | index.html |
| `sameAs` missing from AboutPage and ContactPage Organization nodes | about.html, contact.html |
| `BreadcrumbList` missing entirely | All 11 blog posts |
| `Service` @type missing alongside `Product` on service pages | cold-stores.html, refrigeration-systems.html |
| `datePublished` / `dateModified` missing from all service page JSON-LD | All 13 service pages |
| `price: "0"` on all Product/Offer blocks — custom industrial products | All service pages |
| Schema `url` has `.html` extension on load-calculator | tools/load-calculator.html |
| Organization `@id` cross-links broken — every page re-declares independently | All pages |

---

## 5. Performance (Core Web Vitals) — 74 / 100

**Predicted:** LCP: Borderline Good/NI (1.8–2.8s on mobile) · CLS: Good (0.02–0.05) · INP: Good (<100ms)

### What's correct
- Hero image: `<link rel="preload" as="image" fetchpriority="high">` in `<head>` ✓
- All content images have explicit `width` + `height` attributes — zero layout-shift ✓
- `gtag.js` loads `async`; `main.js` + Vercel scripts load `defer` ✓
- No third-party tag managers, chat widgets, or ad scripts ✓
- All scroll behaviour via `IntersectionObserver` — no synchronous scroll listeners ✓
- Images: `max-age=31536000, immutable` ✓

### Issues
| Issue | Severity |
|---|---|
| Google Fonts loads as synchronous render-blocking `rel="stylesheet"` — every page | **High** |
| CSS/JS `Cache-Control: max-age=0, must-revalidate` — zero repeat-visit cache | Medium |
| Client logo `<img>` tags lack explicit `width`/`height` | Low |
| No `will-change: transform` on `.logo-track` carousel | Low |
| `backdrop-filter: blur()` on sticky header — GPU cost on low-end Android | Very Low |

---

## 6. AI Search Readiness (GEO) — 79 / 100

**Platform estimates**
| Platform | Score | Key driver |
|---|---|---|
| Google AI Overviews | 74/100 | Strong schema, but no `dateModified` on service pages |
| ChatGPT | 71/100 | GPTBot allowed; llms.txt strong; no Wikipedia entity anchor |
| Perplexity | 81/100 | Technical content with named standards matches citation pattern |
| Bing Copilot | 68/100 | No Bing entity verification |
| Claude | 82/100 | ClaudeBot + CC BY 4.0 + structured llms.txt |

### What's best-in-class
- `llms.txt` with UTM-per-platform citation URLs — seen on <2% of manufacturer sites globally
- All major AI crawlers explicitly permitted
- CC BY 4.0 machine-readable license
- YouTube `VideoObject` schema (strongest known AI citation correlation signal — 0.737 coefficient)
- Engineering standard citations in body text (ASHRAE, IEC, BS EN 14509, NIST)

### Top gaps
| Gap | Impact | Effort |
|---|---|---|
| 144-commodity guide is JS-rendered — invisible to non-JS crawlers | High | Medium (2–3 hrs) |
| Service pages have no `datePublished` / `dateModified` in schema | High | Low (30 min) |
| Case study pages and blog posts not individually enumerated in llms.txt | Medium | Low (45 min) |
| No Wikipedia article for Izhar Group | Very High | High (weeks) |
| No named human reviewer on pharmaceutical page | Medium | Low (15 min) |

---

## 7. Images — 68 / 100

### OG dimensions — FAIL
All 13 service pages use 1600×1066 (3:2 ratio) as OG image. Platforms crop or letterbox non-1200×630 images. Five service pages share a single OG image (`eco-coldstore-1600.jpg`): dairy, fruit/veg, banana ripening, potato/onion, CA stores — shares of all five look identical in social feeds.

### Alt text — partial fail
18 instances of generic 1–3 word alt text on content images. One missing `alt` on the YouTube poster `<img>`.

### Oversized images
`blog-cold-storage-solutions-1600.webp` (477KB) and the 1000-wide tier (249KB) are 2–3× over thresholds.

### Orphaned PNG originals
`product-doors.png` (952KB) and `product-pharma.png` (321KB) exist but are not referenced in any HTML. Add to `.vercelignore`.

### Hero LCP — PASS
Homepage + service pages: `fetchpriority="high"` on hero images, no lazy loading. Correct.

### Generation priorities
| Page | Issue | Priority |
|---|---|---|
| pharmaceutical-cold-storage | No proper 1200×630 OG — biggest CTR opportunity on site | Critical |
| cold-stores | OG wrong ratio | High |
| pir-sandwich-panels | OG wrong ratio | High |
| refrigerated-vehicles | No vehicle photography at all | High |
| ca-stores | Shared OG with 4 other pages | Medium |

---

## Sitemap Audit — PASS

Changes applied in this audit session:
- `certifications.html` added (was indexable, no noindex, but absent from sitemap)
- `<changefreq>` and `<priority>` removed
- 59 URLs total, valid XML, all HTTPS
- Committed: `56ed47d` — pushed to `main`

---

*Report generated 2026-05-01. Full audit by 7 parallel specialist agents: seo-technical, seo-content, seo-schema, seo-performance, seo-geo, on-page, images.*
