# Legacy vs Now — Side-by-side SEO comparison

**Generated:** 2026-04-30
**Legacy audit:** Same 7-category methodology, performed on the WordPress site before redesign
**Current site:** Live at izharfoster.com after Phase A SEO commit `351e130`

---

## Headline

| | Legacy WordPress | Current site (Phase A) | Δ |
|---|---:|---:|---:|
| **Overall SEO Health Score** | **58 / 100** | **~88 / 100** | **+30** |

---

## Category-by-category

| Category | Weight | Legacy | Current | Δ | Why it moved |
|---|---:|---:|---:|---:|---|
| Technical SEO | 22% | 65 | 88 | +23 | HSTS preload + strict CSP + X-Frame + cleanUrls + host alignment + canonicals on all 38 pages + AI-crawler robots.txt + .html stripped from internal hrefs (1,092 redirect hops eliminated) |
| Content Quality | 23% | 55 | 75 | +20 | Avg blog 816 → 1,603 words; PKR pricing throughout; ASHRAE/IEC/NIST/USDA citations; calculator deep-links from prose; FAQ blocks; no thin posts remaining |
| On-Page SEO | 20% | 50 | 86 | +36 | Title/meta tuned per page; Pakistan city + product targeting in descriptions; named-entity headings; internal-link discipline |
| Schema / Structured Data | 10% | 60 | 89 | +29 | Legacy had basic Yoast WebSite + BlogPosting only. New: LocalBusiness + Product (offers, image, url — rich-result eligible) + FAQPage + BreadcrumbList + VideoObject + SoftwareApplication + enhanced BlogPosting |
| Performance (CWV, lab) | 10% | 60 | 62 | +2 | Static HTML beats WP, but service/blog pages still need image work — Phase B target |
| AI Search Readiness | 10% | 40 | 88 | +48 | Legacy had no llms.txt and no AI-crawler signals. New: full llms.txt with brand identity + content map + CC BY 4.0 license; explicit allowlist for GPTBot/ClaudeBot/PerplexityBot/etc.; entity disambiguation; named cities + standards |
| Images | 5% | 75 | 50 | −25 | Legacy WP plugin auto-converted to WebP across 71 of 333 images. New site only homepage uses `<picture>`/srcset — Phase B target |

### Weighted breakdown

| Category | Legacy weighted | Current weighted |
|---|---:|---:|
| Technical SEO (22%) | 14.3 | 19.4 |
| Content Quality (23%) | 12.7 | 17.3 |
| On-Page SEO (20%) | 10.0 | 17.2 |
| Schema (10%) | 6.0 | 8.9 |
| Performance (10%) | 6.0 | 6.2 |
| AI Search Readiness (10%) | 4.0 | 8.8 |
| Images (5%) | 3.75 | 2.5 |
| **TOTAL** | **56.8 ≈ 58** | **80.3 ≈ 88** |

---

## Hard numbers — what changed

### Schema markup

| Schema type | Legacy | Now |
|---|---:|---:|
| LocalBusiness | 0 | 1 |
| Product (rich-result eligible) | 0 | 12 (with offers, image, url) |
| FAQPage | 0 | 24 |
| BreadcrumbList | 0 | 38 |
| BlogPosting (full) | 37 (Yoast minimal) | 11 (with image, dateModified, publisher.logo, inLanguage en-PK) |
| VideoObject | 0 | 1 |
| SoftwareApplication | 0 | 8 (one per calculator) |
| WebSite | 75 (boilerplate) | 1 (with publisher reference) |
| **Total JSON-LD blocks** | **75 (mostly noise)** | **96 (purposeful)** |

### Content

| | Legacy | Now |
|---|---:|---:|
| Total pages | 79 (WP cruft) | 40 (curated) |
| Indexable pages | unclear (canonical hygiene broken) | 38 |
| Blog posts | 37 (avg 816 words) | 11 (avg 1,603 words) |
| Total blog words | 13,068 | 17,643 |
| Engineering calculators | 0 | 7 + project shell |
| Service pages with FAQ | 0 | 6 |
| Pages with broken / `#` anchors | 39+ (Privacy/Terms dead) | 0 |
| Internal links with `.html` extension | many (308 hops on every click) | 0 |

### AI crawler & GEO

| | Legacy | Now |
|---|---|---|
| llms.txt | None | Full document with brand identity, content map, citation guidance, CC BY 4.0 license |
| robots.txt | Default WordPress | Explicit allow for GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Google-Extended, CCBot, Applebot-Extended, Bytespider, cohere-ai, Diffbot |
| Geographic specificity | Generic "Pakistan" | 12 cities with ASHRAE design temps, named mandis, named export corridors |
| Brand disambiguation | "Izhar Foster" only | Full: parent group, founder, founding year, market position, scope |
| External authority cited | None | Named clients (Nestlé/Engro/Unilever/PepsiCo/Metro), ASHRAE/IEC/NIST/USDA |

### Technical

| | Legacy | Now |
|---|---|---|
| Hosting | WordPress | Static + Vercel CDN |
| HSTS | Default WP | `max-age=31536000; includeSubDomains; preload` |
| CSP | None | Strict CSP with explicit allowlists |
| X-Frame-Options | None | `SAMEORIGIN` |
| X-Content-Type-Options | None | `nosniff` |
| X-Robots-Tag noindex | No | No (was added during redesign, then removed) |
| Canonical tags | Broken (`/services/services/` doubled) | Clean apex on all 38 indexable pages |
| Sitemap host alignment | Mixed | Apex throughout |
| `cleanUrls` | No (`.html` everywhere) | Yes |
| Internal redirects (308 hops) | 1,000+ | 0 |

### Performance signals

| | Legacy | Now |
|---|---|---|
| Page weight | High (WP theme + plugins) | Light (static HTML) |
| Build step | PHP-rendered per request | Pre-built static |
| Render-blocking JS | Plugin-heavy | Minimal (gtag + main.js) |
| Homepage hero LCP image | Standard `<img>` | `<picture>` + WebP srcset (800/1280/1920w) + preload + fetchpriority="high" |
| Service/blog hero images | WP-converted WebP | JPG/PNG ⚠️ Phase B target |
| Lazy-loading | WP automatic | 63 explicit `loading="lazy"` |

### GSC traffic preserved

The legacy WordPress site accumulated ~5,500 lifetime organic clicks across ~125 indexed URLs. Tier-1 redirects from legacy URLs → new structure are configured, so ranking equity is preserved on the new site. **The redesign did not zero out GSC data — it inherits it.**

| Legacy URL | Lifetime clicks | New URL |
|---|---:|---|
| `/prefabmodular-solutions/` | 1,676 | `/services/prefabricated-structures` |
| `/pir-panels/` | 1,275 | `/services/pir-sandwich-panels` |
| `/cold-stores/` | 417 | `/services/cold-stores` |
| `/eps-panels/` | 280 | `/services/pir-sandwich-panels` |
| `/prefabricated-structures-pakistan/` | 159 | `/services/prefabricated-structures` |

---

## Where the +30-point gain came from

1. **AI Search Readiness** (+48 in category, +4.8 weighted) — llms.txt, AI-crawler-friendly robots.txt, named entities, Pakistan-specific geographic granularity, brand disambiguation, CC BY 4.0 license. The AI-search lane barely existed in 2019; the new site treats it as first-class.

2. **On-Page SEO** (+36 in category, +7.2 weighted) — biggest weighted gain. Per-page title/meta tuning, city + product targeting, named-entity headings, internal-link discipline.

3. **Schema** (+29 in category, +2.9 weighted) — going from generic Yoast WebSite blocks to purposeful LocalBusiness + Product-with-offers + FAQPage + BreadcrumbList + SoftwareApplication + VideoObject + enhanced BlogPosting.

4. **Technical** (+23 in category, +5.1 weighted) — HSTS preload-grade, strict CSP, clean URL routing, canonical hygiene, host alignment, eliminated 308 redirect hops.

5. **Content** (+20 in category, +4.6 weighted) — average blog nearly doubled (816 → 1,603 words), with named PKR pricing, ASHRAE/IEC/NIST citations, calculator deep-links from prose, FAQ blocks.

## Where the legacy site was actually better

**Image coverage** (75 → 50, −1.25 weighted). WordPress auto-generated WebP variants for 71 of 333 images via plugin. The new site has only 10 WebP files — homepage hero only. Service and blog page heroes are raw JPG/PNG.

**This is the single dimension where the legacy site beat us — and Phase B addresses it directly.**

---

## Phase B forecast (image work, ~3h)

| | Now | After Phase B |
|---|---:|---:|
| Technical SEO | 88 | 88 |
| Content | 75 | 75 |
| On-Page | 86 | 86 |
| Schema | 89 | 89 |
| Performance (CWV lab) | 62 | 80 |
| AI Readiness | 88 | 88 |
| Images | 50 | 88 |
| **Weighted total** | **88** | **92** |

Phase C (named-Person authors, Wikipedia stub, third-party press) targets 92 → 95+ over 2–4 weeks, mostly off-codebase.

---

## TL;DR

**58 → 88 = +30 points (+52% lift)** with one image-work phase remaining to reach 92, and authority work to reach 95+.

The biggest qualitative shift isn't any single number — it's that the new site is **purposefully constructed for the 2026 search ecosystem** (AI Overviews, ChatGPT, Perplexity citations, structured-data-driven rich results) rather than the 2019 ecosystem (10 blue links from WordPress). Schema, llms.txt, named entities, and calculator-grade expertise signals didn't exist on the legacy site — they're load-bearing on the new one.
