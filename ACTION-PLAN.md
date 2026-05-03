# izharfoster.com — SEO Action Plan
**Generated:** 2026-05-01 | **Overall score: 74.7 / 100**  
Reference: `FULL-AUDIT-REPORT.md` for full findings per category.

---

## Critical — Fix Immediately

### C1. BreadcrumbList position 2 URL duplicates position 3 — all service pages
**Impact:** Rich result validation fail site-wide. All service pages ineligible for Breadcrumb rich results.  
**Fix:** In every `services/*.html` BreadcrumbList JSON-LD, change ListItem position 2 to:
```json
{ "@type": "ListItem", "position": 2, "name": "Solutions", "item": "https://izharfoster.com/solutions" }
```
Affects: cold-stores, pir-sandwich-panels, refrigeration-systems, ca-stores, insulated-doors, pharmaceutical-cold-storage, refrigerated-vehicles, banana-ripening-rooms, cold-storage-dairy, cold-storage-fruit-vegetables, cold-storage-meat-poultry, potato-onion-cold-storage, prefabricated-structures.  
**Effort:** 30 min  
**References:** GROWTH-PLAN §13, Schema audit findings

---

### C2. Add `datePublished` to tccec-coca-cola-lahore.html Article schema
**Impact:** Article rich result is impossible without `datePublished`. Critical for a named case study.  
**Fix:** Add `"datePublished": "2024-06-01"` (replace with actual delivery date) and `"dateModified": "2026-05-01"` to the Article JSON-LD block.  
**Effort:** 5 min  

---

## High — Fix Within 1 Week

### H1. Pharmaceutical cold storage — add named reference projects
**Impact:** Biggest single GSC opportunity (16,740 impressions, position 59). Anonymous projects = no social proof for pharma QA buyers.  
**Fix:** Replace "GMP Pharmaceutical Cold Room — Karachi" and "Vaccine Distribution Cold Chain — Multan" with real client names, project scale, temperature class, and year. Check Downloads/ folder for pharma project data. At minimum link to a named case study.  
**Also add:** A "What a DRAP auditor checks in your cold room" numbered list section, and a brief pharma cost table (linking to the buyer's guide for detail).  
**Effort:** 2–3 hrs

---

### H2. Fix Google Fonts render-blocking — every page
**Impact:** 200–600ms LCP reduction on Pakistan mobile connections.  
**Fix:** In all `*.html` `<head>` sections, replace:
```html
<link href="https://fonts.googleapis.com/..." rel="stylesheet">
```
with:
```html
<link rel="preload" as="style" href="https://fonts.googleapis.com/..." onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/..."></noscript>
```
Keep existing `preconnect` hints.  
**Effort:** 45 min (scripted find-and-replace across all HTML files)

---

### H3. Add `datePublished` + `dateModified` to all service page JSON-LD
**Impact:** Unlocks Google AIO freshness signals; Perplexity recency filter.  
**Fix:** Add to every service page schema block:
```json
"datePublished": "2025-XX-XX",
"dateModified": "2026-05-01"
```
Also add visible `<time datetime="2026-05">Updated May 2026</time>` near each page H1.  
**Effort:** 1 hr

---

### H4. Add VideoObject `duration` to homepage schema
**Impact:** Site is currently ineligible for Google Video rich results. One missing property.  
**Fix:** Add `"duration": "PT3M42S"` (replace with actual YouTube video duration) to the VideoObject JSON-LD on index.html.  
**Effort:** 10 min

---

### H5. Add `contactPoint` array to homepage LocalBusiness schema
**Impact:** Required for full Local Knowledge Panel eligibility.  
**Fix:** Add `contactPoint` array to the `LocalBusiness` block in index.html (see schema audit report for ready-to-use snippet).  
**Effort:** 15 min

---

### H6. Add named human author bylines to all blog posts
**Impact:** E-E-A-T improvement for YMYL-adjacent content; September 2025 QRG compliance.  
**Fix:** Add visible HTML byline to all 11 blog posts:
```html
<p class="post-author">Written by the <a href="/about">Izhar Foster Engineering Team</a></p>
```
Also update BlogPosting schema `author` from `{"@type": "Organization"}` to a Person node.  
**Effort:** 1 hr

---

### H7. Add blog links from the 4 primary service pages
**Impact:** Strengthens topical clusters; passes authority to blog content.  
**Fix:**
- cold-stores.html → link to buyer's guide + demand-rising post
- pir-sandwich-panels.html → link to PIR thermal efficiency post
- pharmaceutical-cold-storage.html → link to demand-rising pharma section
- refrigeration-systems.html → link to refrigeration systems blog post  
**Effort:** 30 min

---

### H8. Fix broken onclick tool link in cost guide
**Fix:** In `blog/cold-storage-cost-pakistan-2026-buyers-guide.html`, replace:
```html
href="#" onclick="document.querySelector('a[href*=load-calculator]').click()"
```
with:
```html
href="../tools/load-calculator"
```
**Effort:** 5 min

---

### H9. Add `BreadcrumbList` schema to all blog posts
**Impact:** Missing entirely on all 11 blog posts.  
**Fix:** Add standard BreadcrumbList JSON-LD with 3 items: Home → Blog → Post title.  
**Effort:** 1 hr (scripted)

---

### H10. Add pharmaceutical cold storage OG image (1200×630)
**Impact:** Biggest CTR lever on the site. Wrong-ratio OG = cropped/letterboxed social cards for the #1 opportunity page.  
**Fix:** Crop or commission a dedicated 1200×630 pharma cold room image. Clinical, white, GMP-signalling style. Update `og:image` content and `og:image:width`/`og:image:height` tags.  
**Effort:** 30 min (if cropping existing) or commission via visual-designer agent

---

## Medium — Fix Within 1 Month

### M1. Fix overlong meta descriptions (6 service pages)
Trim all to 150–155 chars with the primary USP in the first 140 chars.  
Worst: `ca-stores.html` (313 chars), `cold-stores.html` (265 chars).

### M2. Fix overlong title tags (3–4 service pages)
Trim to ≤65 chars. `ca-stores.html` at 98 chars is the priority.

### M3. Fix OG dimensions on all 13 service pages
Change from 1600×1066 to 1200×630. Either crop existing images or generate new ones via visual-designer agent.

### M4. Pre-render 144-commodity cold storage guide as static HTML
`data-cold-storage-guide.json` already exists. Render the table server-side (or at build time); let JS progressively enhance. This makes the richest data asset on the site visible to AI crawlers.

### M5. Add `sameAs` to AboutPage and ContactPage Organization nodes
Copy the 4 sameAs social profile URLs from the homepage LocalBusiness block to the About and Contact page Organization schema nodes.

### M6. Enumerate case study pages and blog posts individually in llms.txt
Add a `## Case studies` section with one-line descriptions per named project. Add `## Blog posts` section. Pages not listed in llms.txt are less likely to be AI-cited.

### M7. Increase CSS/JS Cache-Control from `max-age=0` to `max-age=86400`
In `vercel.json`, update the cache rules for `/css/` and `/js/`. Eliminates forced revalidation on every return visit.

### M8. Fix nav home links (`href="index"` → `href="/"`)
Every click on the logo/home nav currently triggers a 301 redirect before resolving.

### M9. Add `og:url` and `og:locale` to all non-homepage pages
Currently missing from all service, blog, and tool pages. Add `<meta property="og:url">` and `<meta property="og:locale" content="en_PK">`.

### M10. Add `frame-ancestors 'self'` to CSP in vercel.json
One-line addition to the existing Content-Security-Policy header string.

### M11. Qualify "Pakistan's only PIR manufacturer" claim on pir-sandwich-panels.html
Change to "Pakistan's largest dedicated PIR manufacturer" or add `(as of 2026)` qualifier to avoid a dated inaccuracy becoming a trustworthiness risk.

### M12. Cite the "49× more insulating than concrete" claim
Add a footnote or inline citation near the H1 on pir-sandwich-panels.html: `(concrete λ ≈ 1.08 W/m·K ÷ PIR λ 0.022 = 49×, BS EN 14509 aged value)`.

### M13. Add architecture comparison table to refrigeration-systems.html
One table: rows = DX / Pumped Circulation / Ammonia-Glycol / Freon-CDU; columns = Capacity range, Typical use, Safety class, Indicative PKR/kW.

### M14. Add at least one named project reference to refrigeration-systems.html
Even one line: "100 kW ammonia-glycol system, Karachi meat processor, 2023."

### M15. Add `Service` @type alongside `Product` on cold-stores and refrigeration-systems pages
Cold storage and refrigeration are design-build-install services, not box products. Adding a Service block alongside Product covers broader rich result pathways.

### M16. Fix `price: "0"` on all Product/Offer blocks
Remove `price: "0"` from all service page Product schema. Use only `priceSpecification` with a description, or set availability to `PreOrder` without a numeric price.

### M17. Verify and fix image paths on refrigeration-systems.html
Confirm `freon-system-diagram.jpg` and `ammonia-glycol-system-diagram.jpg` exist at `../images/projects/`. If not, either create the images or remove the broken `<figure>` elements.

### M18. Add staff photographs to about.html
Replace initials-block avatars with real photos of Muhammad Anwar Inayat, Kamran Anwar, and Umair Meo. Named people with photos is the single highest-impact E-E-A-T improvement for the about page.

### M19. Fix lowercase H2 on pir-sandwich-panels.html
Change "Where pir sandwich panels are used" → "Where PIR Sandwich Panels Are Used".

### M20. Cite the 30–40% post-harvest loss statistic in demand-rising blog
Add source: report name + year (e.g., "PHDEC Annual Report 2022" or "Ministry of National Food Security & Research").

### M21. Add Organization cross-linking via `@id`
Every Organization node across all pages should either use `{"@id": "https://izharfoster.com#organization"}` as a reference or add `"@id": "https://izharfoster.com#organization"` to be consistent with the homepage entity. Currently each page re-declares the full object independently, fragmenting the entity graph.

### M22. Add `fetchpriority="high"` to blog post hero images
Blog post heroes are above the fold but likely load lazily. Add `fetchpriority="high"` and remove any `loading="lazy"` on the hero `<img>` in each blog post.

### M23. Delete orphaned PNG originals
`/images/product-doors.png` (952KB) and `/images/product-pharma.png` (321KB) are unreferenced by any HTML. Add to `.vercelignore` or delete from repo.

### M24. Improve generic alt text on 18 content images
Priority: homepage service grid, then blog index thumbnails.  
Target format: `[what it shows] — Izhar Foster, [location], [context]`.  
Example: `Walk-in cold store interior with FireSafe PIR panels — Izhar Foster, Pakistan` rather than `Walk-in Cold Storage`.

---

## Low — Backlog

### L1. Pursue Wikipedia article for Izhar Group
The single largest missing entity signal. A 65-year-old Pakistani engineering group with ISO certs, 2,100+ installations, and named clients (Coca-Cola, Pepsi, Nestlé, Pakistan Army) qualifies under WP:CORP. Without Wikipedia, AI models lack a neutral third-party entity anchor. This is the highest-ceiling single action available but requires significant effort.

### L2. Set accurate per-file `lastmod` in sitemap.xml
Use `git log --format="%ad" --date=short -- <file>` to get real modification dates. Currently all are bulk-set to `2026-05-01` which Google ignores.

### L3. Automate IndexNow URL submissions on deploy
Create a post-deploy script (or Vercel deploy hook) that pushes changed URLs to `https://api.indexnow.org/indexnow`. The key file exists; active submission is step two.

### L4. Add `will-change: transform` to `.logo-track` in style.css
One-line CSS addition, promotes carousel to its own compositor layer.

### L5. Add `Permissions-Policy: payment=(), usb=()` to vercel.json
Minor security header completeness improvement.

### L6. Add `<link rel="preconnect">` for Google Fonts (already present — verify)
Two preconnect hints to `fonts.googleapis.com` and `fonts.gstatic.com` should be in `<head>` before the font preload. Confirm they are in the correct order.

### L7. Fix standardise nav links to root-relative paths (`href="/path"`)
Currently using bare relative slugs (`href="solutions"`) which can behave unexpectedly in edge cases. Change to `href="/solutions"` site-wide.

### L8. Add `wordCount` and `timeRequired` to HowTo schema on cost calculator
HowTo rich results are retired by Google (Sept 2023) but the schema retains GEO value. If keeping it, enrich with `totalTime` and `supply` properties.

### L9. Re-compress oversized blog images
`blog-cold-storage-solutions-1600.webp` at 477KB and 1000-wide tier at 249KB are 2–3× over threshold. Target: 150–200KB for 1600-wide WebP, 80–120KB for 1000-wide WebP. Use `cwebp -q 80`.

### L10. Add `og:image:width` and `og:image:height` to all pages
Once OG images are fixed to 1200×630, add explicit dimension meta tags to help social parsers.

---

## Priority Matrix

| Priority | Count | Estimated total effort |
|---|---|---|
| Critical | 2 | 35 min |
| High | 10 | ~8 hours |
| Medium | 24 | ~20 hours |
| Low | 10 | ~10 hours |

**Recommended sprint 1 (this week):** C1 + C2 + H1 + H2 + H4 + H5 + H8 = unblocks rich results, fixes LCP, fixes the #1 conversion opportunity. ~5 hours.

**Recommended sprint 2 (next week):** H3 + H6 + H7 + H9 + H10 + M1 + M2 = topical authority, authorship, OG fix on pharma page. ~6 hours.

---

*Action plan generated 2026-05-01 from full 7-agent SEO audit. Reference GROWTH-PLAN.md for strategic prioritisation context.*
