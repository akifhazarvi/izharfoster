# Izhar Foster — SEO Action Plan

Generated 2026-04-30 from `FULL-AUDIT-REPORT.md`. Fix items in order — each tier is a hard prerequisite for the next.

## 🔴 Critical — Fix this week (blocking indexing)

### 1. Remove `noindex` HTTP header from production
**File:** [vercel.json:13](vercel.json#L13)
**Effort:** 2 minutes + deploy
**Impact:** Unlocks indexing. Without this, nothing else matters.

```diff
  {
    "source": "/(.*)",
    "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
      { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
-     { "key": "X-Robots-Tag", "value": "noindex, nofollow" },
      { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains; preload" },
      ...
    ]
  }
```

If you intentionally want to noindex a staging environment, add it on the Vercel preview-domain catch-all only, not the production catch-all.

**Verify with:**
```bash
curl -sI https://www.izharfoster.com/ | grep -i x-robots
# (should return no x-robots-tag header — or only on preview branches)
```

### 2. Pick one canonical host (www) and align everything to it
**Files:** [sitemap.xml](sitemap.xml), [vercel.json](vercel.json), all 30 indexable HTML pages
**Effort:** ~45 min
**Impact:** Consolidates link equity; eliminates 307-hop on every sitemap fetch.

**2a.** Change apex → www redirect from 307 to 301 (Vercel does this at the project-domain level — set `www` as the primary domain in the Vercel dashboard; apex will then 308 to www, which is fine).

**2b.** Rewrite all 31 sitemap URLs from `https://izharfoster.com/...` → `https://www.izharfoster.com/...`.

**2c.** Add canonical tag to every indexable page:
```html
<link rel="canonical" href="https://www.izharfoster.com/services/cold-stores">
```
There are 30 indexable pages; this is a bulk find-replace once you template the path.

### 3. Submit sitemap to Google Search Console + Bing Webmaster
**Effort:** 15 min
**Impact:** Once the noindex header is gone, push for fast re-crawl.

Properties to verify:
- `https://www.izharfoster.com/` (URL prefix property)
- Submit `/sitemap.xml`
- Use **URL Inspection → Request Indexing** for: `/`, `/services/cold-stores`, `/services/pir-sandwich-panels`, `/tools/load-calculator`.

The site has a verification file [google95a5502f4d29f0e5.html](google95a5502f4d29f0e5.html) — confirm it still validates.

---

## 🟠 High — Fix within 2 weeks

### 4. Compress and lazy-load images
**Files:** all `*.html`, `images/*.png|jpg`
**Effort:** 3–4 hours
**Impact:** LCP / INP improvement on mobile (Pakistan 4G); page-weight halved.

**4a.** Add `loading="lazy"` to **76 below-the-fold `<img>` tags** (every `<img>` not in the first viewport). Run:
```bash
# Audit
grep -L 'loading="lazy"' images-using-files...
# Or use the script in `_kr_scrape/` if you want to automate
```
Keep the LCP image (hero on each page) **without** `loading="lazy"` — that's the one image you want to load immediately.

**4b.** Convert these 11 files to WebP (keep PNG/JPG fallback):
| File | Current | After WebP target |
|---|---:|---:|
| `images/blog-hero.png` | 1.1 MB | <250 KB |
| `images/product-doors.png` | 952 KB | <200 KB |
| `images/blog-refrigeration-systems.png` | 715 KB | <150 KB |
| `images/blog-cold-storage-solutions.png` | 710 KB | <150 KB |
| `images/product-panels.jpg` | 561 KB | <120 KB |
| `images/eco-coldstore.jpg` | 482 KB | <100 KB |
| `images/blog-pir-panels.png` | 471 KB | <100 KB |
| `images/product-prefab.jpg` | 470 KB | <100 KB |
| `images/product-panels-2.jpg` | 440 KB | <100 KB |
| `images/hero-facility.jpg` | 401 KB | <80 KB |
| `images/blog-prefab-structures.png` | 353 KB | <80 KB |

```bash
cwebp -q 80 images/blog-hero.png -o images/blog-hero.webp
# ...etc, then update references to use <picture>:
```
```html
<picture>
  <source srcset="../images/blog-hero.webp" type="image/webp">
  <img src="../images/blog-hero.png" alt="..." loading="lazy">
</picture>
```

### 5. Generate per-page Open Graph images
**Effort:** 2 hours (or use the `seo-image-gen` skill for AI-generated)
**Impact:** Massively improves social-share CTR on LinkedIn / X.

Currently every page shares `/images/hero-facility.jpg`. Generate one 1200×630 OG image per:
- 6 service pages (each shows the actual product)
- 9 blog posts (each shows the topic)
- 7 calculator pages (could share one branded "Engineering Calculators" OG)
- about, contact, projects, clients, faqs (5 distinct OGs)

= ~25 OG images. ≤200 KB each, JPG.

### 6. Beef up the 4 thin blog posts
**Effort:** 4–6 hours
**Impact:** Higher rankings for under-served queries; AI citation eligibility.

| Post | Current | Target | Add |
|---|---:|---:|---|
| `cold-storage-pakistan-export-growth` | 250 | 1200+ | SBP/USDA export data, mango/citrus case studies, halal meat export logistics, Karachi port cold-chain capacity |
| `green-refrigeration-energy-carbon-footprint` | 275 | 1000+ | R-290/R-717/R-454C comparison table, Kigali HFC phasedown timeline, Pakistan NEEP context, GWP/ODP reference table |
| `insulated-industrial-doors-types-benefits-guide` | 294 | 1200+ | Door-type comparison matrix (sliding/hinged/high-speed/strip), U-value targets, application-by-temperature, gasket maintenance schedule |
| `prefabricated-structures-smart-construction-pakistan` | 308 | 1000+ | Timeline comparison vs masonry, total-cost-of-ownership analysis, seismic + wind-load notes, Punjab building code touchpoints |

Each rewrite should include an FAQ block (3–5 Q&A) so the FAQPage schema can be added.

### 7. Trim long meta descriptions
**Files:** index.html (301 chars), 3 service pages (>200 chars)
**Effort:** 30 minutes
**Impact:** No truncated SERP snippets.

Target: 140–160 characters. Lead with the value proposition, end with a CTA verb.

Example for index.html:
```html
<meta name="description" content="Pakistan's largest PIR sandwich panel manufacturer. Cold stores, blast freezers, refrigeration, CA stores — engineered since 1959. 2,100+ installations.">
```
(155 chars)

### 8. Expand under-utilized titles
**Files:** [services/cold-stores.html](services/cold-stores.html), [tools/condenser-sizing.html](tools/condenser-sizing.html), [services/insulated-doors.html](services/insulated-doors.html)
**Effort:** 15 minutes
**Impact:** More keyword surface area in titles.

Recommended titles:
- `services/cold-stores.html` → `Cold Stores Pakistan — Walk-in Chillers, Blast Freezers | Izhar Foster`
- `tools/condenser-sizing.html` → `Air-Cooled Condenser Sizer — ASHRAE Ch. 35 + Pakistan Ambient Derate | Izhar Foster`
- `services/insulated-doors.html` → `Insulated Doors Pakistan — Sliding, Hinged, High-Speed | Izhar Foster`

---

## 🟡 Medium — Fix within 1 month

### 9. Add Person + AboutPage schema to about.html
**Effort:** 30 minutes
**Impact:** E-E-A-T uplift; Knowledge Graph eligibility for the founder.

```json
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "mainEntity": {
    "@type": "Organization",
    "name": "Izhar Foster (Pvt) Limited",
    "founder": {
      "@type": "Person",
      "name": "Engineer Izhar Ahmad Qureshi",
      "birthDate": "...",
      "deathDate": "...",
      "jobTitle": "Founder, Izhar Group"
    }
  }
}
```

### 10. Add ContactPage + multiple ContactPoint schema
**File:** [contact.html](contact.html)
**Effort:** 20 minutes

Multiple contact points (sales, support, WhatsApp) each with `availableLanguage: ["en", "ur"]` and `areaServed: "PK"`.

### 11. Surface dateModified on blog posts visibly
**Effort:** 1 hour (template touch-up)
**Impact:** Recency signal for AI Overviews / Perplexity.

Add a small "Last updated 2026-03-15" line above each blog post body. Keep the BlogPosting schema's `dateModified` in sync.

### 12. Add named-engineer authorship to blog posts
**Effort:** 1 hour (find someone willing to be the named author)
**Impact:** E-E-A-T; AI engines weight named experts.

Replace `"author": {"@type": "Organization"}` with `Person`, and surface the byline in the rendered page.

### 13. Internal linking cleanup on tool pages
**Effort:** 1 hour
**Impact:** Equity flows to service pages from high-engagement tools.

Each calculator page should explicitly link out to:
- The relevant service (load-calculator → cold-stores; condenser-sizing → refrigeration-systems; a2l → refrigeration-systems; capacity-planner → cold-stores; ca-atmosphere → ca-stores).
- 1–2 related calculators.
- The project shell (`tools/project`).
- A relevant blog post.

Currently inconsistent — some tools link out, others don't.

### 14. City landing pages (programmatic SEO)
**Effort:** 1–2 days
**Impact:** Local rankings for "cold storage Karachi", "cold storage Lahore", "cold storage Multan" etc.

12 cities with pre-existing ASHRAE design temperatures already in the calculator dataset. Build a templated page per city:
- `/cold-storage/lahore`, `/cold-storage/karachi`, etc.
- City-specific design temperature, climate notes
- Real local installations (pull from `/projects` filtered by city)
- Map embed
- LocalBusiness schema with `areaServed: City`

Watch the thin-content threshold — each page needs 600+ unique words, not just templated boilerplate.

---

## 🟢 Low — Backlog

### 15. Generate AVIF in addition to WebP for hero images
~30% smaller than WebP, full browser support since late 2024. `<picture>` with AVIF → WebP → JPG.

### 16. Add HowTo schema to calculator pages
Calculators are inherently "how to" content. HowTo schema with steps (inputs → calculation → outputs) can earn rich results.

### 17. Add aggregateRating once reviews are collected
Service pages have Product schema but no `aggregateRating`. Once you have 10+ verified reviews on Google Business Profile or Trustpilot, surface the aggregate rating in schema for SERP star eligibility.

### 18. CSS scoping audit for unused selectors
The single `style.css` is ~3,900 lines per CLAUDE.md. Run PurgeCSS or similar — likely 30–50% can be eliminated. Mostly affects Performance not SEO directly, but cleaner CSS = faster INP.

### 19. Add Breadcrumb to about/contact/clients/projects
Currently only blog and service pages have BreadcrumbList. Add to the 4 missing pages for consistency.

### 20. RSS feed for /blog
A `/blog/feed.xml` (RSS 2.0 or Atom) helps AI engines and feed readers track new content. Auto-generate from sitemap blog entries.

---

## Verification checklist

After Tier 1 (critical) ships:

- [ ] `curl -sI https://www.izharfoster.com/ | grep x-robots` — should return nothing
- [ ] `curl -sI https://izharfoster.com/` — should return 301 (not 307)
- [ ] Open homepage source, search for `<link rel="canonical"` — should be present
- [ ] Open `https://www.izharfoster.com/sitemap.xml` — all `<loc>` should be `https://www.izharfoster.com/...`
- [ ] [search.google.com/test/rich-results](https://search.google.com/test/rich-results) on `/`, `/services/cold-stores`, `/blog/cold-storage-solutions-pakistan-demand-rising` — all schema should validate
- [ ] [pagespeed.web.dev](https://pagespeed.web.dev) on `/` — note baseline, re-check after Tier 2
- [ ] GSC URL Inspection on `/` — should show "URL is on Google" within 3–7 days

After Tier 2 (image optimization):

- [ ] PageSpeed mobile LCP under 2.5s
- [ ] Total page weight under 1.5 MB on every page
- [ ] All below-fold `<img>` have `loading="lazy"`

---

## Re-audit cadence

After Tier 1 ships, re-run `/seo-audit izharfoster.com` to verify the technical score climbed from 35 → 80+ and overall from 62 → 85+. The on-page work in Tier 2/3 will compound from there.
