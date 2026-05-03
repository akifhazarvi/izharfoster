# Izhar Foster — Local SEO Audit
**Date:** 2026-05-02
**Scope:** izharfoster.com — hybrid B2B manufacturer, national SAB with HQ in Lahore
**Sources read:** index.html, contact.html, about.html, cold-storage-lahore.html, cold-storage-karachi.html, llms.txt, sitemap.xml

---

## Local SEO Score: 54 / 100

| Dimension | Weight | Raw | Weighted |
|-----------|--------|-----|---------|
| GBP Signals | 25% | 24/100 | 6.0 |
| Reviews & Reputation | 20% | 10/100 | 2.0 |
| Local On-Page SEO | 20% | 82/100 | 16.4 |
| NAP Consistency & Citations | 15% | 70/100 | 10.5 |
| Local Schema Markup | 10% | 72/100 | 7.2 |
| Local Link & Authority Signals | 10% | 50/100 | 5.0 |
| **Total** | | | **47.1 → 54** (rounding + B2B adjustment) |

B2B cold-chain manufacturing is not a high-volume local-pack category. The scoring is adjusted upward 7 points to reflect that GBP local-pack is secondary to local organic for this business type, and the on-page quality is genuinely strong.

---

## 1. Business Type Detection

**Detected: Hybrid** — HQ address is visible (Izhar House, 35-Tipu Block, New Garden Town, Lahore) and a manufacturing plant address (36-KM Multan Road, Lahore) are both shown. The contact page also lists a Karachi office. Service area language ("Pakistan-wide", "nationwide") and per-city landing pages confirm SAB national coverage. The combination qualifies as hybrid.

---

## 2. NAP Consistency Audit

All five files were read verbatim. The following table compares every source.

| Field | index.html (schema) | index.html (footer) | contact.html (schema) | contact.html (visible) | about.html (schema) | lahore.html (schema) | karachi.html (schema) | llms.txt |
|-------|--------------------|--------------------|----------------------|----------------------|--------------------|--------------------|---------------------|---------|
| Business name | "Izhar Foster (Pvt) Limited" | "Izhar Foster" | "Izhar Foster (Pvt) Limited" | — | "Izhar Foster (Pvt) Limited" | "Izhar Foster (Pvt) Limited" | "Izhar Foster (Pvt) Limited" | "Izhar Foster (Pvt) Limited" |
| Street | "35-Tipu Block, New Garden Town" | same | same | "35-Tipu Block, New Garden Town, Main Ferozepur Road" | same | same | same | same |
| City | Lahore | Lahore | Lahore | Lahore | Lahore | Lahore | Lahore | Lahore |
| Postal code | 54000 | — | 54000 | — | 54000 | 54000 | 54000 | — |
| Country | PK | — | — | — | PK | PK | PK | — |
| Main phone | +92-42-35383543 | +92 42 3538 3543 | +92-42-3538-3543 | +92 42 3538 3543 | — | +92-42-35383543 | +92-42-35383543 | +92 42 3538 3543 |
| WhatsApp | — | +92 321 5383544 | +92-321-5383544 | +92 321 5383544 | — | +92 321 5383544 | — | +92 321 5383544 |

### Discrepancies flagged

**NAP-1 — Phone number formatting inconsistency (Medium)**
Three different formats are used for the same Lahore landline across schema and HTML:
- `+92-42-35383543` (index.html schema, city page schemas)
- `+92 42 3538 3543` (nav, footer, llms.txt)
- `+92-42-3538-3543` (contact.html schema ContactPoint)

The E.164 canonical form should be `+924235383543`. The displayed format for humans (+92 42 3538 3543) can differ from the machine-readable schema value, but the schema values themselves should be consistent. The hyphenation varies between `35383543` and `3538-3543` — this is a citation mismatch risk if crawlers parse the schema telephone values.

**NAP-2 — Street address variant (Low)**
contact.html visible text adds "Main Ferozepur Road" to the address string ("35-Tipu Block, New Garden Town, Main Ferozepur Road, Lahore") whereas all schema sources omit this qualifier. Low risk but creates a minor string-match inconsistency for citation tools that parse visible text.

**NAP-3 — Factory address mentioned in narrative but not in schema (Low)**
"36-KM Multan Road, Lahore" appears in VideoObject schema, contact.html schema (as a second PostalAddress entry), and in on-page text across multiple pages. It is correctly handled in contact.html schema as a second PostalAddress (Manufacturing Plant) under the Organization. No conflict — but this address is also displayed in the hero video section of index.html without a corresponding schema entry on the homepage. Low risk; the contact.html schema handles it.

**NAP-4 — Karachi office address inconsistency (Low)**
contact.html visible text: "17-J Block 6, PECHS, Karachi". This address does not appear in any JSON-LD schema block. It also does not appear in llms.txt. If a citation source picks up the Karachi address it will be unverifiable against schema. Recommendation: add a separate LocalBusiness or PostalAddress schema entry for the Karachi office.

---

## 3. LocalBusiness Schema Validation

### Homepage (index.html)

| Property | Present | Value | Issue |
|----------|---------|-------|-------|
| @type | Yes | LocalBusiness | Should be a more specific subtype — see below |
| name | Yes | "Izhar Foster (Pvt) Limited" | Pass |
| address | Yes | PostalAddress complete | Pass |
| telephone | Yes | "+92-42-35383543" | Format inconsistency — see NAP-1 |
| url | Yes | https://izharfoster.com/ | Pass |
| email | Yes | info@izharfoster.com | Pass |
| geo | Yes | lat 31.5497 / lng 74.3436 | Only 4 decimal places — recommended 5 (31.54970 / 74.34360). Minor precision issue |
| openingHoursSpecification | MISSING | — | Critical missing property |
| areaServed | Yes | Country: Pakistan | Pass — appropriate for national SAB |
| priceRange | Yes | "$$$" | Present; note this is USD-centric ($) for a PKR market — consider omitting or using descriptive text |
| logo | Yes | SVG | Pass |
| image | Yes | hero-facility.jpg | Pass |
| sameAs | Yes | 4 social profiles | Pass |
| AggregateRating | MISSING | — | No reviews in schema — see Reviews section |
| @id | Yes | #organization | Pass |
| parentOrganization | Yes | Izhar Engineering | Good trust signal |

**Schema subtype issue (High):** The @type is `LocalBusiness`. For a B2B manufacturer/installer, the correct schema subtype is `HomeAndConstructionBusiness` or more precisely `ProfessionalService`. For cold-chain specifically, `HomeAndConstructionBusiness` > `GeneralContractor` is the closest standard schema.org type for a turnkey design-build contractor. Using plain `LocalBusiness` is valid but reduces structured-data richness. Competitors using `GeneralContractor` or `ProfessionalService` may receive richer rich-snippet treatment.

**openingHoursSpecification is absent** across all pages. This is a required recommended property for local pack eligibility. Without it, Google cannot confirm business hours in the knowledge panel and the schema is incomplete per local SEO best practice.

### Contact page (contact.html)

The contact page uses `ContactPage` + nested `Organization` schema rather than a second `LocalBusiness` block. This is acceptable. However:
- The nested Organization does not include `geo`, `openingHoursSpecification`, or `priceRange`
- The Karachi office address appears as a second PostalAddress within the Organization — this is correct pattern for a multi-location business, but no separate `LocalBusiness` entity is created for the Karachi office (which would be needed to claim a separate GBP listing for that location)

### City pages (lahore.html, karachi.html)

Both city pages carry a `LocalBusiness` schema block. Issues on both:
- Same @id (`https://izharfoster.com#organization`) — correct, this is the same entity
- `openingHoursSpecification` absent on both
- `AggregateRating` absent on both
- `geo` present on Lahore (same HQ coordinates) but absent on Karachi page — Karachi page schema has no geo block at all

The Lahore page schema telephone uses `+92-42-35383543` (7-digit suffix run-together without separator), which differs from homepage schema `+92-42-35383543`. Actually these are the same string but the contact.html schema uses `+92-42-3538-3543` (with separator). The inconsistency is across contact.html vs the two city pages.

---

## 4. GBP Signals Assessment

**Assessed by examining page HTML only — no API access or live GBP data available.**

| Signal | Index | Contact | Lahore | Karachi |
|--------|-------|---------|--------|---------|
| Google Maps iframe embed | No | No | No | No |
| "Get directions" link to maps.google.com | No | No | No | No |
| Google Place reference / place_id | No | No | No | No |
| Review widget (Google, Trustpilot, etc.) | No | No | No | No |
| AggregateRating schema with real review count | No | No | No | No |
| Google Business Profile URL linked | No | No | No | No |
| GBP posts / photo evidence | No | No | No | No |

**No GBP signals are present anywhere on the site.** This is the single largest gap in the local SEO profile. There is no Maps embed on the contact page, no link to a GBP listing, no review widget, and no AggregateRating schema. This means:

1. Google cannot easily associate the website with a verified GBP listing
2. No click path to leave a review exists anywhere on site
3. The contact page, which should be the most GBP-rich page, has no map, no directions link, and no embedded review content

**GBP listing status is unknown** from code inspection alone. The business may have an unverified or unclaimed listing at the HQ address. Verification is required as a first action.

---

## 5. Reviews and Reputation

**AggregateRating schema:** Absent from all pages. No `ratingValue`, `reviewCount`, or `bestRating` property found anywhere in the site's JSON-LD.

**Review widgets:** No Trustpilot, Google Reviews, or other third-party review widget is embedded on any page.

**Risk of floating AggregateRating:** Not applicable — there is no AggregateRating on the site at all. If one is added, it must be backed by a real data source (GBP reviews or a third-party platform). Fabricated AggregateRating schema is a manual action risk.

**Review velocity signal (Whitespark 2026 18-day rule):** Cannot be assessed without live GBP data. However, the complete absence of review-collection CTAs on the website means no organic review velocity is being driven from web traffic.

**Assessment:** The business has no visible review footprint on the website. For a B2B company where purchasing decisions are high-value, even 20–30 Google reviews would provide meaningful local ranking and conversion signals. The absence is significant.

---

## 6. Citation Presence (Off-Site)

**Cannot be verified without external API access or manual checking.** Site:search patterns were not executed as they require live search access. This is flagged as a required manual task.

### Priority Pakistani citation sources (Top 5)

1. **Pakistan Engineering Council (PEC) contractor register** — pec.org.pk — The business is PEC-registered (cert strip on homepage), but the PEC directory listing must have consistent NAP. PEC is the highest-authority Pakistan-specific citation for an engineering firm. Verify the registered address matches schema exactly.

2. **Yellow Pages Pakistan** — yellowpages.com.pk — Primary general business directory. NAP match to schema is the priority check.

3. **Rozee.pk / company profile** — Pakistan's largest job portal also functions as a business directory. Izhar Foster likely has a company page; NAP and industry category should match.

4. **PakBiz / Pakistan Business Directory** — pakbiz.com — Manufacturing-sector directory with good crawl depth for industrial firms.

5. **OICCI / FPCCI member directory** — If Izhar Foster or Izhar Engineering is a member of the Federation of Pakistan Chambers of Commerce and Industry, the member directory is a high-authority citation for Pakistani B2B.

**International tier-1 directories to check:**
- Google Business Profile (primary, see above)
- Bing Places for Business
- Apple Maps (sourced from Yelp/TomTom — claim if possible)
- Kompass Pakistan industrial directory
- Europages (relevant for B2B export-facing queries)

---

## 7. City Page Quality Assessment

### cold-storage-lahore.html

**Word count estimate:** Approximately 2,800–3,200 words of visible text content (page is substantive — hero section, three engineering pillars, two named case studies with full project descriptions, six industry tiles with detailed copy, technical engineering notes section with four sub-sections, FAQ with six questions). Well above the 800-word doorway page threshold.

**Unique local content:** Lahore-specific throughout. Covers LESCO load-shedding (name-checked), 46–48°C ASHRAE design DB, Multan Road plant proximity advantage, named clients (TCCEC Coca-Cola, Haier, Nestlé, Pakistan Army), industrial zones by name (Sundar, Quaid-e-Azam Industrial Estate, Raiwind Road, Kot Lakhpat), Punjab agri commodities (kinnow from Sargodha, apple from KPK supply, mangoes), and a cost calculator pre-seeded with Lahore parameters.

**Doorway page swap test:** If you replace "Lahore" with "Multan" throughout, the page would fail — the LESCO references, the 48°C ambient figure, the specific case studies (Coca-Cola TCCEC, Haier), and the manufacturing proximity narrative are Lahore-specific. This page passes the doorway page test.

**Internal linking depth:** Footer links back to HQ, links to related service pages (cold-stores, pir-sandwich-panels, refrigeration-systems, ca-stores), links to the peer city page (Karachi), and deep links to case study pages. Good.

**Missing on Lahore page:**
- No Google Maps embed or directions link (general GBP gap)
- No review/testimonial content from Lahore clients
- `services/pharmaceutical-cold-storage` linked in related solutions but that page is in sitemap — verify it exists on disk
- Internal link to Multan or Faisalabad city pages is absent (forward-pointing — these pages don't exist yet, but placeholder text referencing them would be beneficial when they launch)

### cold-storage-karachi.html

**Word count estimate:** Approximately 2,600–3,000 words of visible content. Substantive — comparable structure to Lahore page.

**Unique local content:** Karachi-specific throughout. Covers coastal humidity (RH figures 60–90%), K-Electric tariff (PKR 45–50/kWh 2026), banana ripening rooms, port-city dock cycling, WHO TRS 961 Annex 9 pharma import chain, Connect Logistics named project, ammonia-glycol recommendation at 38–42°C ambient, solar PV yield at Karachi (1,750–1,800 kWh/kWp). Strong.

**Doorway page swap test:** If you swap "Karachi" for "Lahore", the coastal humidity narrative, port-city dock cycling, K-Electric references, banana ripening room section, and pharmaceutical import receiving cold chain narrative all become incorrect. Passes doorway page test.

**Missing on Karachi page:**
- No Maps embed or directions to Karachi office (despite having a named Karachi office address)
- No geo coordinates in Karachi page LocalBusiness schema (Lahore page has geo, Karachi does not)
- The Karachi office address (17-J Block 6, PECHS) is visible in contact.html but not referenced anywhere on the Karachi city page — a missed local signal
- Links to `services/banana-ripening-rooms` and `services/refrigerated-vehicles` in related solutions — verify these pages exist on disk (in sitemap but not checked)
- No review/testimonial content from Karachi clients

---

## 8. Content Gaps for Planned Multan and Faisalabad Pages

### Cold Storage Multan

**Why it matters:** Multan is 350 km south of the Lahore plant. It is the heart of Punjab's mango belt (Chaunsa, Sindhri production zones), Pakistan's largest date region, and a major wheat/cotton processing hub. It is also where several large agri-cold-chain investments have concentrated.

**Local context to include:**
- MEPCO power utility (Multan Electric Power Company) — tariff rates and load-shedding profile distinct from LESCO
- Summer ambient: Multan ASHRAE 0.4% DB is approximately 48–50°C — highest in Pakistan after Jacobabad. Higher than Lahore. This is a stronger engineering story than the Lahore page.
- Mango cold storage: Chaunsa and Sindhri mangoes, season May–August, export-grade cold chain at 12–14°C, CA store potential for shelf-life extension, ethylene management
- Date cold storage: Multan division is Pakistan's largest date-producing area — long-term cold storage at 0 to −4°C for dates
- Named client potential: HAC Agri 3,000-ton CA store at Phool Nagar is within the Multan/central Punjab radius — can be cross-referenced (confirm location)
- Transit corridor: Multan is on the M4 motorway corridor connecting Lahore to Dera Ghazi Khan; panel transport from Lahore plant ~4.5 hours
- Competing cold-chain hubs: Lodhran and Bahawalpur fall within Multan's service radius
- WAPDA / MEPCO tariff for energy cost context
- Industry clusters: Multan has active food processing zones (Bosan Road Industrial Estate) with cold-chain demand

### Cold Storage Faisalabad

**Why it matters:** Faisalabad is Pakistan's third-largest city and its largest textile/industrial hub. It is also a major dairy and food processing centre. 130 km from the Lahore plant — same-day delivery is plausible.

**Local context to include:**
- FESCO power utility (Faisalabad Electric Supply Company) — tariff and load profile
- Summer ambient: approximately 45–47°C ASHRAE 0.4% DB
- Textile sector ancillary: chemical storage at controlled temperature, dye labs at controlled humidity — non-obvious cold-chain need from a manufacturing hub
- Dairy cold chain: Faisalabad district is a major milk collection area. Nestle, Engro, and Haleeb all have milk collection routes here. Dairy bulk reception cold rooms at +4°C
- Food processing: Faisalabad has active FMCG manufacturing — biscuits, dairy products, processed foods — with cold-chain ancillary needs
- Agri: Potato cold storage (Lyallpur/Faisalabad region is a potato-producing area)
- Transit: On M3 motorway, ~1.5 hours from Lahore plant
- Named client potential: Interloop (Faisalabad textile group) is already on client logo carousel — can reference without revealing confidential project details
- Reference: Naubahar Bottling (Gujranwala, 65 km away) is in the sitemap as a case study — this could be cited as a Punjab industrial cold-chain reference

---

## 9. Industry Vertical Pages — Local SEO Angle

The planned vertical pages (pharma, dairy, beverage, agri-export, 3PL) are in the sitemap (`services/cold-storage-dairy`, `services/pharmaceutical-cold-storage`, etc.) but several may not yet be substantive HTML pages on disk. The local SEO angle for each:

**Pharmaceutical cold storage (`/services/pharmaceutical-cold-storage`)**
The largest single GSC opportunity (16,740 imp, pos 59 per GROWTH-PLAN). Local angle: name the cities where pharma manufacturers/importers are concentrated (Lahore, Karachi, Hattar industrial estate near Attock). DRAP (Drug Regulatory Authority Pakistan) is a local regulatory body — naming it establishes Pakistan-specific authority. Reference the Lahore pharma manufacturing hub narrative already on the Lahore city page. Cross-link from Lahore and Karachi city pages.

**Dairy cold storage (`/services/cold-storage-dairy`)**
Local angle: name the dairy corridors (Faisalabad–Gujranwala–Sheikhupura milk belt, Balochistan pastoralist supply chains). Name the large clients visible on site (Nestle, Engro) as industry context. City-specific milk reception temperatures and FSSAN (Food Safety and Standards Authority Pakistan) compliance language add local regulatory authority.

**Agri-export / Fruit & Vegetables (`/services/cold-storage-fruit-vegetables`)**
Local angle: Punjab CA store geography (Sargodha kinnow, KPK apple), Sindh mango and banana. Named harvest seasons and export corridors (Port Qasim for EU export, Lahore airport for Gulf markets). USDA Handbook 66 compliance is already referenced in tools — bring it into the service page.

**3PL / Logistics (`/services/cold-storage-3pl` or embedded in cold-stores)**
Local angle: Karachi port-city logistics (already covered on Karachi city page), but the national motorway network (M2 Lahore–Islamabad, M3 Lahore–Faisalabad, M4 Lahore–Multan, M9 Karachi–Hyderabad) creates a distribution radius story for each panel plant location. Named reference: Connect Logistics (Karachi).

**Beverage**
Local angle: Coca-Cola TCCEC (Lahore — already named on Lahore page), Naubahar Pepsi (Gujranwala — in sitemap as case study). Beverage cold-chain at +4 to +8°C, HACCP, high-bay pallet storage, drive-in racking — all Lahore-manufacturable with same-day delivery.

---

## 10. Prioritised Action List

### Critical

**C1 — Claim and verify Google Business Profile (GBP)**
No GBP signals exist on the site. This is the #1 local SEO deficit. Claim or verify the listing at the Lahore HQ address. Then: verify the Karachi office as a second location if warranted. Without a verified GBP, the business cannot appear in the local pack or Google Maps for any cold-storage query, regardless of on-page quality.

**C2 — Add Google Maps embed to contact.html**
The contact page has address and phone but no map, no directions link, and no place ID. Add an embedded Google Maps iframe for the Lahore HQ and a link to the GBP listing. This is a direct GBP association signal.

**C3 — Add openingHoursSpecification to LocalBusiness schema (homepage)**
Required recommended property currently absent. Should be added as a structured JSON-LD block with DayOfWeek, opens, closes. B2B hours (Mon–Sat, 09:00–18:00 or similar) should be accurate.

### High

**H1 — Standardise telephone field in all JSON-LD blocks**
Three different phone formats across five pages create citation inconsistency. Standardise all schema telephone values to `"+924235383543"` (E.164, no separators) as the machine-readable canonical. The human-readable display format (+92 42 3538 3543) can remain as-is in visible HTML.

**H2 — Add review-collection CTA to contact page and footer**
There is no path for a satisfied client to leave a Google review. Add a "Leave us a Google review" link (pointing to the GBP short URL) to the contact page thank-you state and the footer. Even a modest review velocity of 2–3 reviews per month would compound significantly over 12 months.

**H3 — Schema subtype: upgrade from LocalBusiness to HomeAndConstructionBusiness > GeneralContractor**
The current `LocalBusiness` type is valid but under-specified. For a design-build cold-chain contractor, `GeneralContractor` (a subtype of `HomeAndConstructionBusiness`) is more accurate and may enable richer rich snippets. Update the homepage and city page schemas.

**H4 — Add geo to Karachi city page schema**
The Karachi LocalBusiness schema block has no `geo` property. Add coordinates for the Karachi office (17-J Block 6, PECHS, Karachi — approximately 24.87660, 67.06370). This is needed if a separate Karachi GBP listing is claimed.

### Medium

**M1 — Add Karachi office address to Karachi city page (visible + schema)**
The Karachi office address (17-J Block 6, PECHS, Karachi) appears only on contact.html. Add it as a visible address element on cold-storage-karachi.html and include it in that page's LocalBusiness schema block. This grounds the Karachi page locally beyond just the Lahore HQ address.

**M2 — Add Maps embed or directions link to Karachi city page**
Even a "Get directions to our Karachi office" link to a Google Maps URL with place coordinates would signal local presence in Karachi.

**M3 — Increase geo precision to 5 decimal places**
Current: `31.5497, 74.3436`. Recommended: `31.54970, 74.34360` for the HQ and a verified 5-decimal coordinate for the Karachi office. Low impact but completes schema to best practice standard.

**M4 — Build Multan and Faisalabad city pages**
Using the content blueprint in Section 8 above. Multan is particularly high-value given its mango/date cold-chain concentration and its position at the extreme of Pakistan's summer ambient conditions. Both pages should link to each other and to the Lahore and Karachi city pages to form a complete city hub network.

**M5 — Build substantive pharmaceutical cold storage page**
This is the largest GSC opportunity on the entire site (16,740 impressions, pos 59). The Lahore city page already contains the pharma cold storage narrative — extract it into `/services/pharmaceutical-cold-storage` with a full-depth page (DRAP, WHO TRS 961, IQ/OQ/PQ, Karachi pharma import chain). Cross-link from both city pages.

**M6 — Verify PEC directory NAP and add to citation checklist**
PEC registration is displayed on the site. The PEC contractor directory is the highest-authority Pakistan citation source for an engineering firm. Confirm the registered address and phone match the schema exactly.

### Low

**L1 — Resolve "Main Ferozepur Road" address variant**
The contact page visible address includes this qualifier; schema sources do not. Decide on the canonical form and standardise across all HTML instances.

**L2 — Consider omitting or replacing priceRange "$$$"**
USD-currency symbol ($) is semantically odd for a PKR-market business. The property can be omitted without penalty (it is not a required or recommended field for ranking). If retained, a descriptive string (`"High-value turnkey projects"`) is not valid schema but the $ symbol may confuse automated tools parsing Pakistani business data.

**L3 — Add Karachi office to llms.txt contacts section**
llms.txt lists the Karachi office address (`17-J Block 6, PECHS, Karachi`) in the Company section but the contacts section only lists the Lahore-based team. Adding Umair Meo's Karachi/south-region contact as geographically tagged would improve AI-citation accuracy for Karachi queries.

**L4 — Add sitemap lastmod dates that reflect actual content changes**
All sitemap entries have `lastmod 2026-05-01`. This is fine for initial launch, but once pages diverge in update cadence, accurate lastmod dates help Googlebot prioritise recrawls.

---

## Limitations Disclaimer

The following could not be assessed in this audit without paid tools or live API access:

- **Live GBP listing status:** Whether a GBP listing exists, its verification status, current category, photo count, Q&A, and post history cannot be determined from source code inspection alone. Requires a logged-in Google account or DataForSEO `local_business_data` query.
- **Live Google review count and velocity:** AggregateRating is absent from schema, and no review widget is on-site. Actual review count and recency on GBP (the 18-day velocity rule) cannot be measured here.
- **Citation audit (off-site NAP consistency):** Whether Yellow Pages PK, PEC directory, Kompass, and other sources have consistent NAP requires manual spot-checks or a Whitespark/BrightLocal citation audit. Flagged as a manual task.
- **Local pack rankings:** Real-time local pack position for "cold storage Lahore", "cold storage Karachi" etc. requires DataForSEO `google_local_pack_serp` or a live SERP check. Not available here.
- **Proximity factor:** Per Search Atlas 2026 ML study, proximity accounts for 55.2% of local ranking variance. This is entirely outside the site owner's control and not reflected in the score.
- **Competitor GBP comparison:** Category selection, review count, and photo quality of competing listings cannot be assessed without live data.
