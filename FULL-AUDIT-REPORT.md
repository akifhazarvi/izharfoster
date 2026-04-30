# Izhar Foster — Full SEO Audit Report

**Audited domain:** izharfoster.com (live host: `www.izharfoster.com`)
**Audit date:** 2026-04-30
**Pages crawled (local source):** 31 HTML pages
**Business type detected:** Local Service / B2B Manufacturer (Hybrid — single HQ in Lahore, Pakistan-wide service)
**Industry vertical:** Industrial / Cold-chain engineering

---

## Executive Summary

### Overall SEO Health Score: **62 / 100** ⚠️

The site is well-built on the page level — strong content depth on services, rich Schema.org markup, a thorough `llms.txt`, AI-crawler-friendly `robots.txt`, and tight semantic HTML. **One server-side configuration issue is single-handedly tanking the score**: every page is currently served with `X-Robots-Tag: noindex, nofollow`, which countermands the `index,follow` meta tags in the HTML and tells Google + Bing + AI crawlers not to index anything.

Fix that one line and the score jumps to ~85. The remaining work is canonicalization, image weight, and content depth on a few thin blog posts.

| Category | Score | Weight | Weighted |
|---|---:|---:|---:|
| Technical SEO | 35 / 100 | 22% | 7.7 |
| Content Quality | 78 / 100 | 23% | 17.9 |
| On-Page SEO | 72 / 100 | 20% | 14.4 |
| Schema / Structured Data | 88 / 100 | 10% | 8.8 |
| Performance (CWV, lab-est.) | 65 / 100 | 10% | 6.5 |
| AI Search Readiness | 92 / 100 | 10% | 9.2 |
| Images | 55 / 100 | 5% | 2.75 |
| **Total** | | | **~67** (technical drag pulls weighted score down despite strong fundamentals) |

> The headline 62/100 is intentionally conservative because the `noindex` header is a hard blocker on indexing — no on-page improvement matters until that header ships off. With the header removed, recompute Technical SEO ≈ 80 → overall ≈ 84.

### Top 5 Critical Issues

1. **🔴 `X-Robots-Tag: noindex, nofollow` is being served on every page.** Source: `vercel.json` line 13. Google, Bing, ChatGPT, Claude, Perplexity will all skip this site as long as that header is in production. **This is the single most important fix.**
2. **🔴 Apex `izharfoster.com` 307-redirects to `www.izharfoster.com`, but the sitemap lists apex URLs (`https://izharfoster.com/...`).** Each canonical signal is split — Google has to follow a redirect for every sitemap URL. Pick one host and align sitemap + redirects + internal links.
3. **🔴 No `<link rel="canonical">` on any page (29 pages affected).** With both apex and www variants live, plus `cleanUrls` rewriting `.html`, you have 4–6 reachable URL variants per page and no canonical tag to consolidate them.
4. **🟠 Sitemap dates are set to 2026-04-24/27 (today is 2026-04-30).** Future-dated `<lastmod>` is fine but unusual; verify these actually reflect last edits, otherwise Google ignores them after a few cycles.
5. **🟠 Image payload is heavy.** 64 PNG/JPG vs 3 WebP. 11 files >300 KB; the largest are unsplit hero PNGs at 700 KB–1.1 MB. No `<picture>`/`srcset` anywhere. LCP and total page weight suffer.

### Top 5 Quick Wins

1. **Remove `X-Robots-Tag: noindex, nofollow` from `vercel.json`** (single deploy, ~10 min). Unlocks indexing for the entire site.
2. **Add `<link rel="canonical" href="https://www.izharfoster.com/...">` to all 29 indexable pages.** ~30 min find-and-add.
3. **Rewrite sitemap URLs to use `https://www.izharfoster.com/`** (no apex, no `.html`). Match the canonical host to remove the 307 hop.
4. **Convert the 11 largest hero images to WebP** (or AVIF) and add `loading="lazy"` to all 76 below-the-fold images. ~2 hours, large LCP/INP win.
5. **Beef up the 4 thinnest blog posts** (250–310 words → 800+ words): `cold-storage-pakistan-export-growth`, `green-refrigeration-energy-carbon-footprint`, `insulated-industrial-doors-types-benefits-guide`, `prefabricated-structures-smart-construction-pakistan`. AI Overviews/Perplexity prefer 600+ word substantive posts.

---

## 1. Technical SEO  *(Score: 35/100)*

### 🔴 Critical: `X-Robots-Tag` blocks indexing globally

**File:** [vercel.json:13](vercel.json#L13)

```json
{ "key": "X-Robots-Tag", "value": "noindex, nofollow" }
```

This header is set on `/(.*)` — every URL on the domain. Verified live on the production host:

```
$ curl -sI https://www.izharfoster.com/
x-robots-tag: noindex, nofollow
```

When an HTTP `X-Robots-Tag` and an HTML `<meta name="robots">` disagree, **the HTTP header wins** ([Google docs](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)). Every page on the site has `<meta name="robots" content="index,follow,...">` in the HTML, but the server header overrides it.

**Fix:** delete the `noindex, nofollow` entry from `vercel.json`. If you intentionally want a staging host noindexed, put that header on the preview domain only, not the production catch-all.

### 🔴 Critical: Apex / www host inconsistency

| Property | Value |
|---|---|
| Sitemap URLs | `https://izharfoster.com/...` (no www) |
| Apex response | `307 Temporary Redirect → https://www.izharfoster.com/...` |
| Canonical host (live) | `www.izharfoster.com` |
| `<link rel="canonical">` in HTML | **none** |

Pick one — almost certainly `www.izharfoster.com` since that's where 200s land. Then:

- Update all 31 `<loc>` entries in [sitemap.xml](sitemap.xml) to use `https://www.izharfoster.com/`.
- Use `301 Permanent Redirect` (not 307) for apex → www. 307 implies "this might change"; you don't want crawlers second-guessing.
- Add `<link rel="canonical" href="https://www.izharfoster.com/<path>">` to every page.

### 🟠 No canonical tags

**29 of 30 indexable pages have no canonical tag.** With `cleanUrls: true` in vercel.json, every page is reachable as both `/path` and `/path.html`, plus apex and www. That's a multi-variant URL surface with no consolidation signal.

```html
<!-- Add to every page <head> -->
<link rel="canonical" href="https://www.izharfoster.com/services/cold-stores">
```

### 🟢 robots.txt is excellent

[robots.txt](robots.txt) explicitly allows GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Google-Extended, CCBot, Applebot-Extended, Bytespider, cohere-ai, Diffbot. Correctly disallows `/_scrape/`, `/_kr_scrape/`, `/tmp/`. Sitemap declared. Nothing to fix.

### 🟢 Security headers are strong

`vercel.json` sets:
- HSTS with `preload` ✓
- CSP with strict defaults ✓
- X-Content-Type-Options: nosniff ✓
- X-Frame-Options: SAMEORIGIN ✓
- Referrer-Policy: strict-origin-when-cross-origin ✓
- Permissions-Policy: camera/mic/geo disabled ✓

### 🟡 Sitemap lastmod dates

All `<lastmod>` values are 2026-04-24 (or 2026-04-27 for tools). The audit date is 2026-04-30. This is fine if the dates reflect actual last edits; future-date them and Google starts ignoring them. Set `lastmod` to the actual file mtime via a build hook if you can.

### 🟡 Service-page `.html` redirect

`/services/cold-stores.html` returns `308 → /services/cold-stores`. Good — the Vercel redirect rules are doing the right thing. Make sure no internal links hit the `.html` form to avoid the extra hop.

### 🟢 HTTPS, HTTP/2, no mixed content

All assets load over HTTPS. HTTP/2 is the live protocol. CSP `upgrade-insecure-requests` enforced.

---

## 2. Content Quality  *(Score: 78/100)*

### Page-level word counts

| Bucket | Count | Pages |
|---|---:|---|
| 1000+ words | 1 | services/cold-stores |
| 700–999 words | 5 | about, services/ca-stores, services/pir-sandwich-panels, services/refrigeration-systems, faqs |
| 400–699 words | 12 | most service/blog pages, index, projects |
| 250–399 words | 12 | thinner blog posts, calculator pages |
| <250 words | 1 | tools/project (intentionally noindexed) |

### 🟠 Thin blog posts (priority for content depth)

| Page | Words | Notes |
|---|---:|---|
| blog/cold-storage-pakistan-export-growth | **250** | Strong topic for export/agri queries — under-developed. Should reach 800+ with USDA/SBP export data, mango/citrus case studies, cold-chain logistics specifics. |
| blog/green-refrigeration-energy-carbon-footprint | **275** | High AI-citation potential ("sustainable refrigerants Pakistan"). Add R-290, R-717, R-454C comparison table; HFC phasedown timeline (Kigali); Pakistan NEEP data. |
| blog/insulated-industrial-doors-types-benefits-guide | **294** | Buyers' guide topic — should be 1200+ words with door-type comparison table, U-value targets, application-by-temperature recommendations. |
| blog/prefabricated-structures-smart-construction-pakistan | **308** | Add timeline comparison vs masonry, total-cost analysis, seismic and wind-load notes. |

### 🟢 E-E-A-T signals are strong

- **Experience**: 2,100+ installations cited; named projects with named clients on `/projects` and `/clients`.
- **Expertise**: Calculator suite is genuinely original engineering work, methodology cited (ASHRAE Ch. 24, IEC 60335-2-89, NIST REFPROP, USDA Handbook 66). Few competitors publish primary-source citations.
- **Authoritativeness**: Real company since 1959, 100+ named brand clients (Nestlé, Engro, Unilever, K&N's, PepsiCo).
- **Trustworthiness**: Address, phone, email, named contacts (Muhammad Anwar Inayat, Kamran Anwar, Umair Meo) all on contact + about pages. WhatsApp number explicit.

### 🟡 Author byline missing on blog posts

BlogPosting schema cites `author: Izhar Foster` (organization), but no per-post human author. Adding a named engineer ("Authored by [Engineer name], Senior Refrigeration Engineer") strengthens E-E-A-T and improves AI Overview eligibility.

### 🟡 No "last updated" visible on blog posts

Schema has `dateModified` but it's not surfaced in the rendered page. AI engines (Perplexity especially) weight visible recency.

---

## 3. On-Page SEO  *(Score: 72/100)*

### Title tags

| Status | Count |
|---|---:|
| 50–60 chars (optimal) | 6 |
| 61–75 chars (acceptable) | 16 |
| <50 chars (under-utilized) | 4 |
| >75 chars (truncation risk) | 1 |

**Action items:**

- [services/cold-stores.html](services/cold-stores.html) → title is 39 chars. Expand: `Cold Stores Pakistan — Walk-in Chillers, Blast Freezers | Izhar Foster` (~70 chars).
- [tools/condenser-sizing.html](tools/condenser-sizing.html) → 41 chars. Expand: `Air-Cooled Condenser Sizer — ASHRAE Ch. 35 + Pakistan Derate | Izhar Foster` (75 chars).
- [tools/project.html](tools/project.html) → only 46 chars (and it's `noindex,follow` so this is informational — add the word "Calculator" if you ever index it).
- [services/insulated-doors.html](services/insulated-doors.html) → 43 chars. Expand to include door types (sliding, hinged, high-speed).

### Meta descriptions

- **Index page** (`index.html`) is **301 chars**. Google truncates at ~155 chars on mobile; you lose the last 145 chars of the snippet. Trim to ~155.
- 3 service pages exceed 200 chars — also at truncation risk.
- 4 thin blog posts have descriptions <120 chars (under-utilized real estate; Google truncates short ones to "..." which feels lazy).

### Heading structure

- All 31 pages have exactly **one `<h1>`** ✓
- Spot-checked H2/H3 nesting on services and blog — semantic and clean.

### Internal linking

| Page type | Avg internal links |
|---|---:|
| Service pages | 27 |
| Blog posts | 28 |
| Tools | 16–22 |
| Index | 35 |

Solid internal linking. **Improvement:** the 7 tool pages average only 19 internal links — they should each link to the relevant service page (e.g., load-calculator → cold-stores), the project shell, and 1–2 related calculators. Currently inconsistent.

### Open Graph

**Every single page uses the same `og:image`: `/images/hero-facility.jpg`.**

Social shares of `/services/ca-stores` should show a CA store image; `/blog/insulated-doors-...` should show a door. This kills click-through on LinkedIn and X. Generate per-page OG images (1200×630) — there's an `seo-image-gen` skill for this.

---

## 4. Schema / Structured Data  *(Score: 88/100)*

### Coverage by page type

| Page type | Schema present | Quality |
|---|---|---|
| Homepage | LocalBusiness + WebSite | ✓ Excellent — full address, geo, parentOrg, sameAs, knowsAbout |
| Services (×6) | Product + Brand + Organization + FAQPage | ✓ Excellent |
| Tools (×7) | SoftwareApplication + Offer + Organization + BreadcrumbList | ✓ Excellent — `Offer.price: "0"` + `availableLanguage` is a nice touch |
| Blog (×9) | BlogPosting + ImageObject + BreadcrumbList | ✓ Strong, missing author Person |
| FAQs page | FAQPage with Q/A | ✓ Eligible for FAQ rich result |
| About | BreadcrumbList only | ⚠️ Missing AboutPage + Person (founder) markup |
| Contact | BreadcrumbList only | ⚠️ Missing ContactPage + Organization with full NAP |
| Clients | BreadcrumbList only | ⚠️ Could use ItemList of `Organization` entries |
| Projects | BreadcrumbList only | ⚠️ Could use ItemList of CreativeWork/Project items |

### 🟡 Missing schema opportunities

1. **About page**: add `AboutPage` + `Person` schema for Engineer Izhar Ahmad Qureshi (founder).
2. **Contact page**: add a second `ContactPage` schema; multiple `ContactPoint` entries (sales, service, WhatsApp).
3. **BlogPosting author**: replace `"author": {"@type": "Organization", "name": "Izhar Foster"}` with a real Person where appropriate.
4. **Service pages**: add `aggregateRating` once you have collected reviews — high CTR uplift in SERPs.
5. **Tools**: consider `HowTo` schema on calculator pages (steps to use, inputs, outputs) — the calculators are essentially how-to content.

### Validation

I did not run live validation against Google's Rich Results Test, but the JSON-LD blocks I sampled (homepage, services/cold-stores, tools/load-calculator, blog/cold-storage-pakistan-export-growth) are syntactically well-formed and use appropriate types. **Recommended: run [search.google.com/test/rich-results](https://search.google.com/test/rich-results) on the homepage + one of each page type after the canonical host is settled.**

---

## 5. Performance  *(Score: 65/100, lab-only estimate)*

### Lab-estimate notes (no CrUX field data captured)

- HTTP/2 ✓
- Fonts: Inter + JetBrains Mono via Google Fonts with `preconnect` ✓
- CSS: single `style.css` (~3,900 lines per CLAUDE.md) — fine for a static site
- No render-blocking JS — `gtag` is `async`, `main.js` is at end of body
- **Image weight is the LCP risk:** 1.1 MB blog-hero.png, 952 KB product-doors.png on a single page. On a Lahore 4G connection (~5 Mbps) that's ~1.7 s just to download the LCP image.

### 🟠 Image opportunities (also see §7)

- 64 PNG/JPG → convert hero/product images to WebP (typically –60% size) or AVIF (–75%).
- 76 of 91 `<img>` tags **are missing `loading="lazy"`** — every below-fold image blocks page-ready.
- No `<picture>` or `srcset` — mobile gets the same 1.1 MB hero as desktop.

### 🟡 Recommended next step: real CrUX data

Once `X-Robots-Tag` is removed and Google starts indexing, register the property in Google Search Console and pull CrUX field data for LCP / INP / CLS. The lab estimate of 65 will likely fall to 50–55 on mobile in real Pakistan network conditions until image optimization ships.

---

## 6. Images  *(Score: 55/100)*

| Check | Status |
|---|---|
| Total `<img>` tags | 91 |
| Missing `alt` attribute | **0** ✓ |
| Empty `alt=""` (decorative) | 18 (mostly client logos — acceptable) |
| Missing `loading="lazy"` | **76 of 91** 🟠 |
| Total images directory | 17 MB / 83 files |
| Files >200 KB | 15 |
| Files >500 KB | 5 |
| Largest single file | 1.1 MB (`blog-hero.png`) |
| WebP files | 3 |
| PNG/JPG files | 64 |
| `<picture>` / `srcset` usage | **0** |

### Action priority

1. Convert the 11 largest images (>300 KB) to WebP, keep PNG fallback in `<picture>`.
2. Add `loading="lazy"` to all 76 below-the-fold images.
3. Generate per-page OG images (1200×630, JPG, ≤200 KB) — currently every page shares one hero image.
4. Generate responsive srcsets (`-480w`, `-1200w`, `-2000w`) for hero images.

---

## 7. AI Search Readiness (GEO)  *(Score: 92/100)*

This is the strongest category. The site appears to have been intentionally optimized for AI search — well done.

### 🟢 What's working

- **`/llms.txt`** is detailed (76 lines): company summary, product list with linked URLs, calculator suite with methodology, engineering standards, named contacts, citation guidance. This is exactly the format ChatGPT, Perplexity, and Claude prefer.
- **`robots.txt`** explicitly allows all major AI crawlers (GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, OAI-SearchBot, Applebot-Extended, Google-Extended, CCBot, Bytespider, cohere-ai, Diffbot).
- Strong **citability signals**: passage-level facts ("PIR thermal conductivity λ ≈ 0.020–0.022 W/m·K", "extends shelf life 4–6× versus conventional cold storage", "F_Protection = 0.10 per ASHRAE Ref Ch. 24"). These are the kinds of factual snippets AI models extract verbatim.
- **Brand mention signals**: 100+ named clients (Nestlé, Engro, Unilever) in body text and schema.
- **Canonical authority claims**: "Pakistan's largest PIR sandwich panel manufacturer" is a clear, ungated, factual claim AI engines can echo.

### 🟡 Improvements

- **The single `noindex` header undoes all of this** until removed. Even `llms.txt` is ignored by some AI engines that defer to crawl signals.
- **Per-page summaries**: consider adding a 2–3-sentence "Summary for AI" passage at the top of each service and blog page, structured as a single answerable paragraph. Perplexity and ChatGPT pluck these directly.
- **Author + dateModified rendered**: AI Overviews weight recency; expose `dateModified` visibly on blog posts.
- **Citations to your own data**: when you say "cross-validated within ±20% of Heatcraft NROES, Copeland AE-103" link to a public methodology page. Right now this is in `llms.txt` but not in the calculator pages themselves.

---

## 8. Site Architecture & Internal Linking

### Navigation depth
Every indexable page is ≤2 clicks from the homepage. Footer + main nav + rail are consistent across pages. ✓

### Orphan risk
- All blog posts are linked from `/blog`.
- All tools linked from `/tools.html`.
- All services linked from main nav and footer.
- **Potential orphan**: `/tools/project.html` is `noindex,follow` and only linked from individual tools' "Add system" CTA. This is intentional and fine.

### URL structure
- Clean URLs (no `.html` in user-facing links).
- Lowercase, hyphen-separated, descriptive.
- Folder structure mirrors topic grouping (`/services/`, `/blog/`, `/tools/`).
- ✓ No issues.

---

## 9. Local SEO Notes (Hybrid Local Service)

The site is the cold-chain division of a single Lahore-headquartered company that serves Pakistan-wide. Below the multi-location threshold for full local SEO treatment, but a few quick wins:

- **Google Business Profile**: not detectable from the site. Verify GBP is claimed for `Izhar Foster, 35-Tipu Block, New Garden Town, Lahore` and link `sameAs` from the homepage Organization schema.
- **NAP consistency**: site has consistent NAP across home, contact, footer, schema. ✓
- **Service-area pages**: the site mentions 12 cities (Lahore, Karachi, Faisalabad, Multan, Peshawar, Quetta, Hyderabad, Islamabad, Sialkot, Sukkur, Gwadar, Jacobabad) but has no per-city landing pages. Consider one programmatic-style page per major city ("Cold Storage in Karachi", "Cold Storage in Multan") with localized examples and city-specific design temperatures from the calculator dataset. This is a high-leverage GEO + local SEO play.

---

## 10. AI / GEO Citability — Sample Passages

These are the kinds of passages AI engines will extract. Each one is well-formed and ready to cite:

> "PIR sandwich panels — ozone-friendly polyisocyanurate, thermal conductivity λ ≈ 0.020–0.022 W/m·K, density 40–60 kg/m³, fire class B1 (ASTM E84), compressive strength >300 kPa." — `llms.txt`

> "Controlled Atmosphere storage extends shelf life 4–6× versus conventional cold storage." — `llms.txt`, services/ca-stores

> "Cold rooms designed against 12 Pakistani city ASHRAE 0.4% design DB temperatures, with Pakistan-specific +2 K climate uplift baked in." — `llms.txt`

These will be cited *if and only if* the noindex header is removed. AI search engines respect server directives.

---

## Methodology

- **Local crawl**: parsed all 31 HTML files in the project source tree.
- **Live verification**: `curl -sI` on apex + www host, key service page, robots.txt, sitemap.xml, llms.txt.
- **Schema inventory**: regex extraction of `application/ld+json` blocks; type counted per page.
- **Title/meta extraction**: regex over `<title>`, `<meta name="description">`, `<meta name="robots">`, `<link rel="canonical">`, `<meta property="og:image">`.
- **Image audit**: HTML parser walked every `<img>`; alt + loading attributes recorded.
- **Word count**: HTML parser stripped `<script>`/`<style>`/`<noscript>` then counted whitespace-separated tokens in body.
- **Engineering content quality**: cross-referenced calculator citations against ASHRAE / IEC / NIST / USDA standards (per project CLAUDE.md).

---

*Report generated by Claude Code seo-audit. See `ACTION-PLAN.md` for the prioritized fix queue.*
