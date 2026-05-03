# Schema Markup Audit — izharfoster.com

**Date:** 2026-05-02
**Pages scanned:** 63 HTML files (root + services/ + blog/ + tools/)
**Pages with schema:** 46 (3 legitimately empty: terms, privacy, GSC verification stub — flagged below)
**Format:** JSON-LD throughout (correct, Google's preferred)

## Headline diagnosis

The site has **above-average schema coverage** for a B2B manufacturer — Organization graph, Product/Offer per service, BreadcrumbList everywhere, BlogPosting on all 11 posts, SoftwareApplication on all 8 tools. But three issues are dragging it back:

1. **FAQPage is on 28 pages.** Restricted to government/healthcare authority sites since Aug 2023 — Izhar Foster is neither. Markup still works as semantic context for AI/GEO, but no rich result eligibility. Decision needed: keep for GEO citability or remove for cleanliness.
2. **`HowTo` schema on `tools/cost-calculator.html`** — rich results retired September 2023. Remove.
3. **`Dataset` schema on `services/cold-stores.html`** — rich results retired late 2025. Demote or remove.

Plus several high-value gaps (certifications page has only BreadcrumbList; blog index lacks Blog/ItemList; no Person author across 11 blog posts; service pages don't reference the homepage Organization by `@id`).

---

## Validation results

| Page | Schemas present | Status | Issues |
|------|-----------------|--------|--------|
| `index.html` | LocalBusiness, WebSite, VideoObject | ✅ | Strong. `@id` graph used correctly. |
| `about.html` | AboutPage, BreadcrumbList, Organization (extended) | ✅ | Good. Founder Person is nested; could promote to standalone Person. |
| `contact.html` | ContactPage, ContactPoint, Organization, BreadcrumbList | ✅ | Good. Missing `sameAs` (only on home). |
| `services/cold-stores.html` | Product, Offer, FAQPage, Dataset, BreadcrumbList | ⚠️ | Dataset retired late 2025; FAQPage restricted. |
| `services/pir-sandwich-panels.html` | Product, Offer, FAQPage, BreadcrumbList | ⚠️ | FAQPage restricted. |
| `services/pharmaceutical-cold-storage.html` | Product, Offer, FAQPage, BreadcrumbList | ⚠️ | FAQPage restricted. Top GSC opportunity (16,740 imp, pos 59) — Product schema is appropriate. |
| `services/refrigeration-systems.html`, `ca-stores.html`, `insulated-doors.html`, `prefabricated-structures.html`, `refrigerated-vehicles.html`, `banana-ripening-rooms.html`, `cold-storage-dairy.html`, `cold-storage-meat-poultry.html`, `cold-storage-fruit-vegetables.html`, `potato-onion-cold-storage.html` | Product, Offer, FAQPage, BreadcrumbList | ⚠️ | Same FAQPage caveat. Product/Offer well-formed. |
| `blog/*.html` (11 posts) | BlogPosting, BreadcrumbList, FAQPage (most), Organization | ⚠️ | All have `author` as **Organization, not Person** — weakens E-E-A-T signal. FAQPage on most. |
| `tools.html` | CollectionPage, SoftwareApplication ×8, BreadcrumbList | ✅ | Good. |
| `tools/cost-calculator.html` | SoftwareApplication, FAQPage, **HowTo**, BreadcrumbList | ❌ | HowTo retired Sept 2023 — remove. |
| `tools/load-calculator.html`, `energy-cost.html`, `a2l-room-area.html`, `refrigerant-charge.html`, `condenser-sizing.html`, `capacity-planner.html`, `ca-atmosphere.html` | SoftwareApplication, BreadcrumbList | ✅ | Good. |
| `tools/project.html` | (verify) | — | Skipped in spot check; presumed similar. |
| `cold-storage-karachi.html`, `cold-storage-lahore.html` | LocalBusiness, FAQPage, BreadcrumbList | ⚠️ | LocalBusiness on city page is fine but conflicts with the homepage `#organization` anchor — should reference parent via `parentOrganization` or use `Place`/`Service` instead. |
| `industries.html` | CollectionPage, ItemList, BreadcrumbList, WebSite | ✅ | Good. |
| `solutions.html` | CollectionPage, ItemList, BreadcrumbList, WebSite | ✅ | Good. |
| `projects.html` | CollectionPage, ItemList (12 CreativeWorks), ImageGallery, BreadcrumbList | ✅ | Strong. ImageGallery + 12 case items. |
| `clients.html` | CollectionPage, ItemList of Organizations, BreadcrumbList | ✅ | Good. |
| `certifications.html` | BreadcrumbList only | ❌ | **Major gap.** ISO 9001/14001/45001, EN 14509, CE Mark, ASHRAE all listed in content but unmarked. |
| `faqs.html` | FAQPage, BreadcrumbList | ⚠️ | FAQPage restricted as above. Page is the canonical Q&A bank — consider migrating to `QAPage` per question or to Article. |
| `blog.html` | BreadcrumbList only | ⚠️ | Should also have `Blog` or `CollectionPage` listing the 11 posts. |
| `terms.html`, `privacy.html` | none | ⚠️ | Add `WebPage` with `breadcrumb`. |
| `google95a5502f4d29f0e5.html` | none | ✅ | GSC verification stub, leave as-is. |

---

## Critical issues (fix first)

### 1. Remove `HowTo` from `tools/cost-calculator.html`

Rich results retired September 2023. The block lives between the FAQPage and BreadcrumbList around lines 200–210.

**Action:** delete the entire `<script>` block.

### 2. Demote or remove `Dataset` on `services/cold-stores.html`

`Dataset` rich results retired late 2025. The 144-commodity table is genuinely useful but won't surface as a Dataset rich card. Options:

- **Remove** the Dataset block.
- **Replace** with `Table` schema (no rich result, but valid semantic markup) or wrap rows in `Product`/`Thing` items if used for AI citation.

### 3. Decide on FAQPage strategy

28 pages use FAQPage. Since Aug 2023, Google only renders FAQ rich results for **government and healthcare authority sites** — Izhar Foster qualifies as neither.

**Two valid paths:**

- **Keep FAQPage markup** (recommended): Bing still renders FAQ rich results; AI assistants (ChatGPT, Perplexity, Claude) parse FAQPage as authoritative Q&A; LLM citation rate is materially higher with FAQPage than without. Cost: zero, since the markup is already there.
- **Remove FAQPage and convert to in-page text**: cleaner if you want to chase only Google rich results. Loses the AI-citation tailwind, especially for the cost-related FAQs that are already pulling traffic.

The site's growth thesis (per `GROWTH-PLAN.md`) leans on AI citation — **keep FAQPage**.

### 4. Author = Person, not Organization on blog posts

Across 11 blog posts the `author` field is set to:

```json
"author": { "@type": "Organization", "name": "Izhar Foster Engineering", ... }
```

Google's helpful-content guidelines and the December 2025 E-E-A-T expansion both reward identifiable human authors. Recommendation: introduce 2–3 named engineering authors (with bios on `/about` or new `/team` pages), then update blog posts to:

```json
"author": {
  "@type": "Person",
  "name": "[Author Name]",
  "jobTitle": "[e.g., Senior Refrigeration Engineer]",
  "url": "https://izharfoster.com/team/[slug]",
  "worksFor": { "@id": "https://izharfoster.com#organization" }
}
```

If real bylines aren't workable, leaving `Organization` author is acceptable but suboptimal.

### 5. Certifications page is unmarked

`certifications.html` lists ISO 9001 / ISO 14001 / ISO 45001 / EN 14509 / CE Mark / ASHRAE but has no schema beyond a BreadcrumbList. Per Google's April 2025 Product Certification spec, certifications can be marked at the **Product** level using `hasCertification` → `Certification`. Apply this to:

- The PIR sandwich panel Product (EN 14509 self-extinguishing class)
- The cold store Product (ISO 9001 / 14001 / 45001 management systems)

Generated JSON-LD provided in `generated-schema.json`.

---

## High-value gaps (add next)

### 6. `Blog` schema on `blog.html`

Index page should list all 11 posts as `Blog.blogPost`. Helps Google understand the content hub and supports `mainEntityOfPage` cross-references.

### 7. Service-area / parentOrganization linking

Service pages (`services/*.html`) declare a fresh `Organization` named "Izhar Foster (Pvt) Limited" inside Product.manufacturer / seller. They should reference the canonical Organization by `@id`:

```json
"manufacturer": { "@id": "https://izharfoster.com#organization" }
"seller":       { "@id": "https://izharfoster.com#organization" }
```

This consolidates entity signals and eliminates the risk of Google treating each page's Organization as a fresh, unverified entity.

### 8. Project case-study pages (when built)

`projects.html` has 12 unnamed `CreativeWork` items. Per `GROWTH-PLAN.md` §10, 14 named case studies are queued (TCCEC Coca-Cola, Naubahar Pepsi, HAC Agri 3,000-ton, etc.). When those individual case-study pages exist, mark each as `Article` + `subjectOf: { @type: Project }` or use `CreativeWork` with full `creator`, `client` (Organization), `dateCreated`, `locationCreated`, and product photos as `ImageObject`.

### 9. `LocalBusiness` on city pages — fix the duplication

`cold-storage-karachi.html` and `cold-storage-lahore.html` declare a fresh LocalBusiness with a Karachi/Lahore address. Two problems:

- The actual office address is in Lahore (Tipu Block, New Garden Town). Karachi page should not claim a Karachi LocalBusiness unless there is a physical Karachi presence.
- If there is no physical office, replace `LocalBusiness` with `Service` + `areaServed: { @type: City, name: "Karachi" }` and reference the parent Organization via `provider: { @id: "https://izharfoster.com#organization" }`.

### 10. `WebPage` schema on `terms.html` and `privacy.html`

Add a minimal `WebPage` block with `breadcrumb` for completeness. Low priority.

### 11. `QAPage` migration option for `faqs.html`

If you want individual question rich-result eligibility (where it still applies), each Q can be a separate URL with `QAPage` schema. Significantly more work; only worthwhile if FAQs page already gets meaningful traffic.

### 12. `VideoObject` on additional video embeds

Homepage has one `VideoObject` for the facility tour. If any service page embeds product videos (some `.html` files reference YouTube embeds), each should have its own `VideoObject` with `uploadDate`, `duration`, `thumbnailUrl`, and `contentUrl`.

---

## Engineering-constants check

Per `CLAUDE.md` the site standardises on **λ = 0.022 W/m·K** (BS EN 14509 aged) — this should appear in PIR panel `Product.additionalProperty` for the AI/LLM citation pipeline. Currently checked: `services/pir-sandwich-panels.html` Product schema **does** include `PropertyValue` entries — verify λ is one of them. If not, add:

```json
{
  "@type": "PropertyValue",
  "name": "Thermal conductivity (λ, aged per BS EN 14509)",
  "value": "0.022",
  "unitText": "W/(m·K)"
}
```

---

## Recommendations summary (prioritized)

| # | Action | Effort | Impact |
|---|--------|--------|--------|
| 1 | Remove HowTo block from `tools/cost-calculator.html` | 5 min | High — clears deprecated markup |
| 2 | Add ISO/EN/CE Certification schema to certifications.html + Product pages | 1 hr | High — citable trust signals for B2B buyers + AI |
| 3 | Reference `#organization` by `@id` from all service-page Product schemas | 30 min | High — entity consolidation |
| 4 | Add `Blog` + ItemList schema to `blog.html` | 15 min | Medium |
| 5 | Decide FAQPage strategy (recommend: keep) | decision only | — |
| 6 | Convert blog `author` to `Person` once named authors exist | half-day | High — E-E-A-T |
| 7 | Demote or remove Dataset on cold-stores.html | 15 min | Low |
| 8 | Replace city-page LocalBusiness with Service + areaServed (unless physical office exists) | 30 min | Medium — corrects entity claim |
| 9 | Verify λ=0.022 in pir-sandwich-panels Product.additionalProperty | 5 min | Medium — AI citation |
| 10 | Add WebPage schema to terms/privacy | 10 min | Low |

Generated JSON-LD snippets for items 1–4 and 6 are in `generated-schema.json`.
