# Izhar Foster — Full SEO Audit Report

**Audit date:** 2026-05-02
**Audited domain:** https://izharfoster.com (apex canonical; .html URLs 308 → clean URLs)
**Pages on disk:** 62 HTML files (13 services, 9 blog posts, 14 project case studies, 9 tools + project shell, 2 city pages, 9 root pages, 1 GSC verification, 1 noindex'd privacy, 1 noindex'd terms)
**Pages in sitemap:** 58 (privacy, terms, project shell, GSC verification correctly excluded)
**Business type:** Local Service / B2B Manufacturer (Hybrid — Lahore HQ, Pakistan-wide service)
**Industry:** Industrial / cold-chain engineering
**Auditor:** 7 parallel specialist agents (technical, content, schema, sitemap, performance, GEO, local) + manual technical spot-checks
**Prior report:** 2026-04-30 — score 78/100 (~73 conservative)

---

## Executive Summary

### Overall SEO Health Score: **78 / 100** ✅ (unchanged headline; component shifts)

The technical foundation is solid and the writing is genuinely strong. Since the prior audit two days ago, several non-trivial wins shipped: every service page now carries a valid `Product → offers` block (was the prior critical schema gap), the homepage hero now uses `<picture>` + WebP srcset + `<link rel="preload">` + `fetchpriority="high"` (image weight gap closed), llms.txt was rewritten with CC BY 4.0 license + per-engine UTM citation URLs, IndexNow key file is live, and Vercel Web Analytics + GA4 tracking is wired up across all pages.

The score holds at 78 because the gains are offset by a clearer view of three structural weaknesses the prior audit underweighted:

1. **Pharmaceutical cold storage page — the #1 GSC opportunity (16,740 imp, pos 59) — is not linked from the homepage.** The hero scrubber + product cards link to 5 services and 2 city pages, but not to pharma. Pharma sits one click deeper than it should.
2. **Local SEO is the single weakest pillar at 54/100.** Zero GBP signals on any page — no map embed, no "Get directions" link, no review CTA, no Place ID. For a Lahore-headquartered B2B manufacturer with a 277,460 sqft physical plant, this is unforced error.
3. **Authority signals remain thin.** No Wikipedia entity, no third-party press citations linked from the site, all blog posts authored by `Organization` rather than a named `Person`. ChatGPT entity resolution and Perplexity source-chaining both penalise this.

### Component scores

| Category | Weight | Score | Weighted | Δ from prior |
|---|---:|---:|---:|---:|
| Technical SEO | 22% | 88 / 100 | 19.4 | +7 |
| Content Quality | 23% | 76 / 100 | 17.5 | +9 |
| On-Page SEO | 20% | 80 / 100 | 16.0 | 0 |
| Schema / Structured Data | 10% | 79 / 100 | 7.9 | 0 |
| Performance (CWV, lab) | 10% | 65 / 100 | 6.5 | +3 |
| AI Search Readiness | 10% | 74 / 100 | 7.4 | −5 |
| Images | 5% | 72 / 100 | 3.6 | +34 |
| **Total** | | | **78.3** | unchanged |

**On the AI score drop:** the prior 79 was scored before the deeper structural pass surfaced the missing Person author schema, missing Wikipedia entity, and the static-HTML gap on the 8 calculator pages (form labels are JS-injected, so a non-JS crawler reads only title + schema + 1 disclaimer line per tool page). The AI substantive content is strong; the *citation-readiness scaffolding* is what's at 74.

**On the Local pillar:** Local was scored separately this round (it wasn't a category in the prior weighted total). At 54/100 it pulls hard but isn't in the 7-category weighted score above. If we added it as a 5% slice it would knock the headline to ~76. Treating it as a sidecar score reflects that this is a B2B manufacturer where local *organic* (city pages, schema, NAP) is healthy while local *pack* (GBP, reviews) is barely instrumented.

### Top 5 critical issues

1. **Homepage does not internally link to `/services/pharmaceutical-cold-storage`** — the highest-impressions page in GSC is starved of internal link equity. Add it to the hero scrubber and the products grid. Effort: 10 min.
2. **Zero Google Business Profile signals on any page** — no Maps embed, no GBP URL, no review CTA, no Place ID. A B2B manufacturer with a physical plant should be claiming the local pack for "cold storage Lahore" / "PIR panels Lahore" / "cold room contractor Pakistan". Effort: claim + verify GBP (1-2 weeks postcard), then 30 min to embed.
3. **No Wikipedia entity for Izhar Foster / Izhar Engineering** — single highest-impact entity gap for ChatGPT / Perplexity / Google KG citation. Notability supportable from 1959 founding, named global clients (Coca-Cola, Nestlé, Pakistan Army), USAID delivery, group scale. Effort: 6-8 hr to draft with third-party citations.
4. **Two pharmaceutical "Reference projects" are anonymous on the highest-GSC page** — the pharma page lists "GMP Pharmaceutical Cold Room — Karachi" and "Vaccine Distribution Cold Chain — Multan" with no client name, no date, no link. They read as fictional placeholders on the page that most needs trust signals. Either name them (even partially anonymised: "Tier-1 multinational pharma, Karachi, 2023") or remove them. Effort: 30 min if names exist; 3-4 hr if a real case study page is needed.
5. **Render-blocking Google Fonts stylesheet on every page** — costs 300-600 ms LCP on slow connections. System-font fallbacks already exist in the CSS, so converting to async `<link rel="preload" as="style" onload>` pattern is safe and immediate. Effort: 15 min.

### Top 5 quick wins

1. **Add 74-word "what we do" passage to homepage hero static HTML** — the current first-paragraph extractable text is 24 words (the meta description). LLMs need 50-80 word self-contained passages to cite confidently. Exact text is in `_audit/geo-findings` (returned inline by the GEO agent). Effort: 15 min.
2. **Standardise telephone schema values to E.164 format `+924235383543`** — three different hyphenation patterns currently across `index.html`, `contact.html`, `cold-storage-lahore.html`, `cold-storage-karachi.html`. Display format in HTML can stay human-readable. Effort: 15 min.
3. **Add `IndexNow:` directive to robots.txt** — IndexNow key file already exists at root; just needs to be advertised. One line in `robots.txt`. Effort: 2 min.
4. **Change CSS/JS `Cache-Control` to `max-age=31536000, immutable` with versioned filenames** — `style.css`, `main.js`, `track.js` currently force a revalidation round-trip on every page view. Effort: 30 min (vercel.json + filename rewrite).
5. **Convert author schema on top-3 blog posts from `Organization` to `Person`** — use Muhammad Anwar Inayat (GM Business Development) on `cold-storage-cost-pakistan-2026-buyers-guide`, `cold-storage-solutions-pakistan-demand-rising`, `cold-storage-pakistan-export-growth`. Add a one-sentence in-text bio at post end. Effort: 45 min.

---

## Technical SEO — 88/100

**Sources:** specialist agent + manual spot-checks of canonical tags, noindex headers, redirect behaviour, internal linking on 12 representative pages.

### What's correct
- All audited pages carry a single `<link rel="canonical">` pointing to the apex clean URL.
- `.html` URLs 308-redirect to clean URLs on Vercel (verified `services/cold-stores.html → services/cold-stores`); no duplicate-content risk.
- `privacy.html`, `terms.html`, `tools/project.html` correctly carry `<meta name="robots" content="noindex,follow">` and are correctly absent from `sitemap.xml`.
- Security headers all present: HSTS with `preload`, CSP (tight script-src/connect-src), X-Content-Type-Options, X-Frame-Options, Referrer-Policy.
- robots.txt allows all major search and AI crawlers explicitly, points to `/sitemap.xml`, blocks `_scrape/` and `_kr_scrape/`.
- Vercel `cleanUrls: true` and `trailingSlash: false` are enforced consistently.

### Issues by priority

**High**
- **`/services/pharmaceutical-cold-storage` not linked from homepage.** The hero scrubber and product cards link to: cold-stores, pir-sandwich-panels, refrigeration-systems, ca-stores. The two city pages are linked. Pharma — the #1 GSC opportunity — is not. Add it to the products grid and to the rotating scrubber set.
- **`tools/project.html` is on disk but lacks an `og:` block matching its noindex status.** Low risk but if the noindex is ever lifted it will share OG metadata with the tools index. Cosmetic.

**Medium**
- **No image sitemap or video sitemap entries.** Homepage embeds the YouTube facility tour; service pages have ~117 production images with WebP srcsets. Adding `<image:image>` for the 6 core service pages and a `<video:video>` block for the YouTube tour is a free Google Image / Google Video discovery uplift.
- **Bulk `lastmod` date** (`2026-05-01` on 57 of 59 sitemap entries) — factually accurate but mechanical. Wire to `git log -1 --format='%ad' --date=short` per file. Low urgency at <100 URLs.

**Low**
- **`_scrape_coldstore/` HTML files lack `<meta name="robots" content="noindex,nofollow">`.** They are excluded by `.vercelignore` today; if that file ever changes, those pages would deploy unprotected. Add the meta as belt-and-braces.

---

## Content Quality — 76/100

**Source:** specialist agent. Score replaces prior 67.

### What's correct
- All 13 service pages exceed the 600-word floor. 11 of 13 are 1,200-2,500 words.
- All 14 project case studies are individually written (3,191-4,074 words; no template duplication).
- Both city pages pass the doorway-page swap test (Lahore: ~2,800-3,200 words; Karachi: ~2,600-3,000 words; each anchored on city-specific climate, utility, industry, and client narrative).
- Pharmaceutical page is competitively positioned vs US/EU benchmarks on depth (2,476 words, 8 FAQs, DQ/IQ/OQ/PQ workflow, DRAP regulatory section, temperature-class table).
- Engineering provenance is cited inline on technical pages (BS EN 14509, IEC 60335-2-89:2019, ASHRAE Ch. 24, NIST REFPROP).

### E-E-A-T breakdown
- **Experience: 17/20** — strong first-hand signals (named clients, founder photo, Pakistan-specific grid data: LESCO/K-Electric tariffs, ASHRAE city DBs). Gap: zero client testimonials.
- **Expertise: 21/25** — λ value, ASHRAE derate factors, HAC Agri PSA nitrogen explanation all show genuine domain depth. Gap: blog posts authored by `Organization`, not named engineers.
- **Authority: 17/25** — weakest pillar. Zero external press citations. No Wikipedia. No PEC registry URL in `sameAs`.
- **Trust: 26/30** — named leadership with direct contact, three offices, certifications page exists. Gap: certifications page names "Accredited third-party registrar" without naming SGS — looks evasive on the page that procurement teams use to verify.

### Issues by priority

**Critical**
- **Anonymous reference projects on the pharma page.** "GMP Pharmaceutical Cold Room — Karachi" and "Vaccine Distribution Cold Chain — Multan" are unnamed. On the page that most needs trust signals, this reads as invented. Name them or remove them.

**High**
- **Two blog posts under the 1,500-word floor:** `insulated-doors-energy-efficiency-cold-storage.html` (1,340 w) and `green-refrigeration-energy-carbon-footprint.html` (1,429 w). Expand by 200-400 words each.
- **Pharma page missing MKT explanation.** "MKT excursion analysis" is mentioned in meta and llms.txt but no body section explains it. A 100-word section with the Haynes equation is directly cite-able for "mean kinetic temperature cold storage" queries.
- **Pharma page missing WHO PQS reference** (relevant for EPI/UNICEF programs) and a documented excursion-response protocol (DRAP GSDP compliance).

**Medium**
- `prefabricated-structures.html` is 801 words / 6 headings — acceptable given GROWTH-PLAN deprioritisation but won't rank meaningfully.
- llms.txt: add the 5 vertical industry sub-pages (dairy, meat/poultry, fruit/veg, potato/onion, banana ripening) to citation URLs; add a "Last verified: 2026-05-02" freshness line; add a flagship case-study block.
- Certifications page: name SGS (or whichever registrar) explicitly. Procurement teams verify on this page.

---

## On-Page SEO — 80/100

### What's correct
- Every audited page has a unique `<title>` and meta description.
- H1 → H2 → H3 hierarchy is clean across services, blog, projects, city pages.
- BreadcrumbList JSON-LD on every page.
- All canonical URLs resolve to the apex clean URL.

### Issues by priority

**High**
- **Pharma page internal-link starvation** (already flagged under Technical). The page exists, ranks at pos 59, has 16,740 monthly impressions, and isn't linked from the homepage hero or products grid. Expected position uplift from internal-link equity alone: 5-10 places.

**Medium**
- **Homepage meta description was shortened** (recent commit). Verify the current 24-word version is the intended length; AIO-extractable passage in body now matters more than meta length.
- **`refrigerated-vehicles.html` `og:image` points to the pharma room image, not a vehicle image.** The page renders the wrong preview in social shares and rich results. Use `og-default.jpg` until a real vehicle image exists.
- **No `speakable` schema** on any page. Low priority; useful for Bing Copilot voice mode on the FAQ block of the pharma + cost guide pages.

**Low**
- Two `og:image:alt` tags on `refrigerated-vehicles.html` lines 25 and 30 (one overwrites the other). Cosmetic.

---

## Schema / Structured Data — 79/100

**Source:** specialist agent.

### What's correct (verified delta from prior audit)
- **All 13 service pages now carry valid `"offers"` blocks** — this was the prior critical schema gap. Verified: `banana-ripening-rooms`, `ca-stores`, `cold-storage-dairy`, `cold-storage-fruit-vegetables`, `cold-storage-meat-poultry`, `cold-stores`, `insulated-doors`, `pharmaceutical-cold-storage`, `pir-sandwich-panels`, `potato-onion-cold-storage`, `prefabricated-structures`, `refrigerated-vehicles`, `refrigeration-systems`.
- 60+ valid JSON-LD blocks across the site.
- Organization schema on homepage with `sameAs` to LinkedIn / Facebook / Instagram / YouTube.
- VideoObject schema for the YouTube facility tour on homepage.
- BreadcrumbList consistent across services / blog / projects / tools.
- FAQPage on every service page with 6-8 valid Q&A pairs.

### Issues by priority

**High**
- **`openingHoursSpecification` missing from every LocalBusiness schema block.** This is a recommended property for local pack eligibility. Add to homepage and contact page LocalBusiness blocks.
- **All blog post `author` fields use `Organization`, not `Person`.** Convert top 3 (cost guide, demand-rising, export-growth) to named-Person schema. Person attribution is what LLMs extract for "according to" citations.

**Medium**
- **Schema subtype could be more specific.** Homepage uses `LocalBusiness`; the closer match for design-build cold-chain is `["LocalBusiness", "GeneralContractor"]`.
- **Karachi office has no schema anchor.** Visible on contact.html but no JSON-LD entity. Add an additional PostalAddress / branchOf node.
- **Karachi city page has no `geo` coordinates.** Lahore page has them. Add `~24.87660, 67.06370` for the PECHS office.
- **Project case studies use `Article`** — consider `["CaseStudy", "Article"]` or a dedicated CaseStudy block with `applicationCategory` / `industry`.

**Low**
- **No ImageObject for hero images** — minor citation signal.
- **Consider HowTo schema for the 8 calculators** — each is a procedural workflow.

---

## Performance (CWV, lab) — 65/100

**Source:** specialist agent. Lab estimate only — no CrUX field data (no Google API credentials configured).

### What's correct
- Hero image: `<picture>` + WebP srcset (800/1280/1920w) + `<link rel="preload">` + `fetchpriority="high"`.
- All JS deferred (`main.js`, `track.js`, Vercel Analytics, GA4).
- YouTube facility tour is click-to-play (no iframe injected on load — saves 400-800 ms).
- HTTP/2, Brotli, Vercel CDN with 1-year immutable cache on `/images/`.
- No `<model-viewer>` 3D component on the homepage in current state (it lives only on tool pages with explicit user invocation).

### Issues by priority

**P1 — High**
- **Render-blocking Google Fonts** stylesheet — costs 300-600 ms LCP on 3G. Convert to `<link rel="preload" as="style" onload="this.rel='stylesheet'">`. System-font fallbacks already in CSS variables; safe.
- **CSS/JS files lack long cache headers.** `style.css` (151 KB / ~28 KB Brotli), `main.js` (23 KB), `track.js` (17 KB) currently `Cache-Control: max-age=0, must-revalidate`. Add filename versioning + `max-age=31536000, immutable` in `vercel.json`. Saves 50-200 ms on repeat visits.

**P2 — Medium**
- **GA4 gtag inline block sits before `<meta charset>` and `<meta name="viewport">`.** `async` prevents blocking but execution order risks an FOUC tick. Move below the meta tags.
- **YouTube poster is `maxresdefault.jpg` (~150 KB)** from `i.ytimg.com` (extra DNS+TLS). Use `hqdefault.jpg` (already the `onerror` fallback) with explicit `width="480" height="360"` and `fetchpriority="low"`. Better: self-host once as WebP. Saves 50-120 ms + 80-150 KB.
- **`track.js` is dynamically appended on service/blog pages** (only declared as `<script defer>` on homepage). Preload scanner can't discover dynamically-injected scripts. Add `<script src="../js/track.js" defer>` directly to all service/blog `<head>` and remove the `loadTracker()` IIFE. Saves 100-300 ms on 3G on those pages.

**P3 — Low**
- **Logo carousel SVGs** (9 client logos) lack explicit `width`/`height`. CLS risk ~0.02-0.05 if SVG source files lack intrinsic dims.
- **`decoding="async"` on the LCP hero `<img>`** can defer decode past first composite. Remove on the hero image only; keep on every other image.
- **Scrubber `setActive()` runs in `setInterval` with synchronous DOM writes** (no `requestAnimationFrame` wrapper, no `IntersectionObserver` pause). Mid-range Android: 10-30 ms jank if it coincides with scroll.
- **No `<link rel="preload" as="font">`** for the two heaviest Inter weights. Becomes worth doing after the P1 Google Fonts fix.

---

## AI Search Readiness — 74/100

**Source:** specialist GEO agent. Score replaces prior 79.

### What's correct
- robots.txt explicitly allows GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, CCBot, Applebot-Extended, Bytespider, cohere-ai, Diffbot.
- llms.txt is genuinely high-quality: H2 sections, fact-density, named contacts, CC BY 4.0 license, per-engine UTM citation URLs (`?utm_source=chatgpt|perplexity|claude|copilot|gemini`).
- IndexNow key file present at root: `/36864c9bc2a84d3ab82c3601af63361e.txt`.
- All key facts (1959 founding, λ=0.022, 277,460 sqft, 2,100+ projects, U-values) are consistent across llms.txt, homepage schema, and live pages — no contradictions.
- `max-snippet:-1, max-image-preview:large` meta robots on every priority page (max-snippet is the single most important meta for AI Overviews).
- Pharma page lead paragraph is 112 words and names every required element — best-optimised single page for AI citation on the site.

### Issues by priority

**Critical**
- **No Wikipedia entity for Izhar Foster / Izhar Engineering.** Single biggest entity gap. ChatGPT, Perplexity, Google KG all use Wikipedia as the primary entity-disambiguation source. Notability is supportable from 1959 founding, named global clients, USAID delivery. 6-8 hr task with high ROI.
- **Homepage lacks a self-contained "what we do" passage in static HTML.** First extractable prose paragraph is 24 words (the meta description). Schema description is 55 words but schema isn't equivalent to body text for LLM extraction. A 74-word passage drafted by the GEO agent; insert into `.hp-hero-inner`.

**High**
- **Tool calculator pages are uncitable by non-JS crawlers.** A crawler reading `/tools/load-calculator` gets title + schema + 1 disclaimer line. Form labels and methodology panel are JS-rendered. Add a 100-150 word static `<section>` per tool: "How this calculator works" — methodology + standard reference. Highest priority: load-calculator, energy-cost, capacity-planner, ca-atmosphere.
- **Blog posts use `Organization` author schema, not `Person`** — covered under Schema. ChatGPT and Perplexity prefer human-attributed sources for "according to" citations.

**Medium**
- **`IndexNow:` directive missing from robots.txt.** Key file works on direct URL but the directive is the recommended advertisement. Add `IndexNow: https://izharfoster.com/36864c9bc2a84d3ab82c3601af63361e.txt` as the last line of robots.txt.
- **Wikipedia URL absent from `sameAs`** — add once entity exists. PEC registry URL absent (high-trust government registry for engineering firms in Pakistan).
- **`refrigerated-vehicles.html` og:image is the pharma room image**, not a vehicle image. AI tools cite with the wrong visual.
- **DRAP cited by acronym only** on the pharma page. Add document-number reference (e.g., DRAP Technical Requirements for Cold Storage, 2022) for Perplexity source-chain.
- **PUR λ value (0.024 W/m·K)** quoted in the PIR comparison FAQ has no source reference. Add "(ISO 8301 typical)" to keep an LLM from being challenged when citing.

**Low**
- llms.txt: change `λ ≈ 0.022` to `λ = 0.022` (declared aged value should not be hedged).
- No `speakable` schema (worth adding to FAQ blocks on pharma + cost guide).
- No press citations linked from the site — finding one Dawn / Express Tribune / Business Recorder mention of a named client project (USAID banana, TCCEC Coca-Cola) would meaningfully strengthen Perplexity's verification chain.

---

## Local SEO — 54/100 (sidecar score, not in 7-cat weighted)

**Source:** specialist agent. Strong on-page work; near-zero GBP signals.

### Sub-scores
| Dimension | Weight | Raw | Weighted |
|---|---|---|---|
| GBP Signals | 25% | 24 | 6.0 |
| Reviews / Reputation | 20% | 10 | 2.0 |
| Local On-Page | 20% | 82 | 16.4 |
| NAP / Citations | 15% | 70 | 10.5 |
| Local Schema | 10% | 72 | 7.2 |
| Local Authority | 10% | 50 | 5.0 |

### Issues by priority

**Critical**
- **Zero GBP signals across the entire site** — no Maps embed, no Place ID, no GBP profile URL, no review widget, no review CTA, no AggregateRating tied to a real listing. A Lahore-headquartered B2B manufacturer with a 277,460 sqft physical plant has no claim on the local pack. Verifying GBP at the HQ address is the single highest-impact local action.

**High**
- **Phone format drift across schema:** `+92-42-35383543`, `+92 42 3538 3543`, `+92-42-3538-3543` all appear. Standardise schema values to `+924235383543` (E.164); display can stay human-readable.
- **`openingHoursSpecification` absent** from all LocalBusiness blocks (already noted under Schema).
- **No review-collection CTA** on contact or footer. Even a "Review us on Google" link to the GBP short URL would start the velocity flywheel once GBP is verified.
- **Karachi city page has no `geo`** in its LocalBusiness schema; Lahore does (already noted).

**Medium**
- **Schema subtype** could upgrade to `["LocalBusiness", "GeneralContractor"]`.
- **PEC contractor registry citation** — verify NAP exactly matches schema; PEC is the highest-authority Pakistan-specific citation for an engineering firm.
- **Multan city page is the highest-value next build** (mango, dates, MEPCO, ASHRAE 0.4% DB ~50°C — the engineering story is sharper than Lahore). Faisalabad second (FESCO, dairy belt, Interloop tie-in).

---

## Images — 72/100

### What's correct
- Hero `<picture>` + WebP srcset + preload + `fetchpriority="high"` on homepage.
- All hero images carry alt text.
- Vercel CDN: 1-year immutable cache on `/images/`.

### Issues
- **Service-page hero images** lack the homepage's `<picture>` + multi-width srcset pattern. WebP is used but only at one size on most service pages.
- **YouTube poster is cross-origin `i.ytimg.com/maxresdefault.jpg`** (~150 KB) — covered under Performance.
- **No image sitemap entries** — covered under Sitemap.
- **9 client carousel SVGs lack explicit `width`/`height`** — minor CLS risk.
- **`refrigerated-vehicles.html` `og:image`** is the pharma image, not a vehicle image.

---

## Sitemap — 81/100

**Source:** specialist agent. Single sitemap, 58 URLs, well-structured.

### What's correct
- Valid XML, correct namespace, all URLs use HTTPS apex with no trailing slashes (consistent with `vercel.json`).
- All 10 sampled URLs return HTTP/2 200, including the new pages: `pharmaceutical-cold-storage`, `refrigerated-vehicles`, both city pages, `cost-calculator`, `solutions`, `industries`, `certifications`.
- `privacy.html`, `terms.html`, `tools/project.html` (all noindex) and `google95a5502f4d29f0e5.html` (verification token) correctly excluded.
- No deprecated `<priority>` or `<changefreq>` tags.
- 58 URLs is well below the 50,000 URL split threshold; single sitemap is correct.

### Issues by priority
- **Medium:** No `<video:video>` namespace entry for the YouTube facility tour. Free CTR from video thumbnails in regular SERPs.
- **Medium:** No `<image:image>` entries for the 6 core service pages. Google Image Search is a real B2B lead source on "cold storage Pakistan" queries.
- **Low:** Bulk `lastmod` dates (`2026-05-01` on 57 of 59) — wire to per-file `git log` before site reaches 100+ pages.
- **Low:** `_scrape_coldstore/` HTML files lack `noindex` meta as a `.vercelignore` safeguard.

---

## Files written by this audit

```
/Users/akif.hazarvi/projects/izharfoster/_audit/content-findings.md
/Users/akif.hazarvi/projects/izharfoster/_audit/local-findings.md
/Users/akif.hazarvi/projects/izharfoster/_audit/perf-findings.md
/Users/akif.hazarvi/projects/izharfoster/_audit/sitemap-findings.md
```

Technical, schema, and GEO specialist reports were returned inline (in agent task results) and consolidated above; the four written files contain the full deep-dive prose for the categories that wrote to disk.

## Limits of this audit

- **No Google API credentials** configured: no CrUX field CWV, no GSC indexation/clicks, no GA4 organic traffic. Performance score is lab estimate only.
- **No DataForSEO MCP** available: no live SERP positions, no backlink profile, no AI visibility / LLM-mention tracking, no business-listing audit.
- **GBP listing existence and verification status** must be confirmed manually — could not be inspected from code.
- **Off-site citation consistency** (Whitespark / BrightLocal) requires paid tools.
- **Local pack ranking** for target queries is unmeasured.
- **Wikipedia notability assessment** is qualitative; would benefit from third-party press inventory before drafting an article.

## Methodology

- 7 parallel specialist sub-agents: `seo-technical`, `seo-content`, `seo-schema`, `seo-sitemap`, `seo-performance`, `seo-geo`, `seo-local`.
- Manual technical spot-checks for canonicals, noindex headers, redirect behaviour, internal linking on 12 representative pages.
- Live HEAD/GET sample of homepage + 2 priority service pages (≤20 requests total — under rate-limit threshold).
- Local HTML inspection for everything else (62 files).
- Scoring weights: per skill spec (Technical 22%, Content 23%, On-Page 20%, Schema 10%, Performance 10%, AI 10%, Images 5%). Local kept as a sidecar pillar reflecting its asymmetric weight on B2B manufacturers vs pure local services.
