# Source-of-truth decisions — 2026-04-30

User instruction: **the brochure is the source of truth**. When site copy conflicts with brochure, the brochure wins.

## Resolved data conflicts

| # | Topic | Brochure (canonical) | Site (current) | Action |
|---|---|---|---|---|
| 1 | PIR density | 40–45 kg/m³ (p.18) | 60 kg/m³ | Update site to 40–45 kg/m³ |
| 2 | PIR compressive strength | >100 KPa (p.18) | >300 kPa | Update site to >100 KPa |
| 3 | PIR thermal conductivity λ | ~0.020 W/m·K (back-calculated from p.18 U-values) | ≤0.028 W/m·K | Tighten site to "λ ≈ 0.020–0.022 W/m·K" |
| 4 | Group company count | 5 (p.3 founder page lists Izhar Construction, Izhar Steel, Izhar Concrete, Izhar Housing, MEP Solutions) | llms.txt: 6; about.html: 12 | **KEEP SITE AS-IS — do not reconcile (user override 2026-04-30). The 12 in `about.html` is current and correct; brochure number is outdated.** |
| 5 | Parent company | "A Division of Izhar Steel (Pvt) Ltd" (cover, p.97) | "division of Izhar Engineering" | **KEEP SITE AS-IS — "Izhar Engineering" is the current correct parent (user override 2026-04-30). Brochure framing is outdated.** |
| 6 | Installations headline | 1,500+ pre-engineered buildings (p.8); brochure does NOT support 2,100+ | "2,100+ installations" | **KEEP "2,100+ installations" (user override 2026-04-30). Brochure number is outdated; current count is higher.** Add the brochure-supported numbers (1,500+ PEBs, 277,460 sqft, 100+ engineers, 1,300 workers) ALONGSIDE 2,100+, not as a replacement. |

## Strategic decisions

| # | Decision | Direction |
|---|---|---|
| 7 | Adopt "FireSafe PIR" sub-brand | YES — adopt across PIR page, schema (Brand sub-property), and llms.txt |
| 8 | HAC Agri 3,000-ton CA store floor plans (pp.63–64) on site | YES, as ungated PDF download. Confirm publication-readiness with user before deploying the actual PDF file |

## Confirmed component / equipment partners

User-confirmed partners we can name on customer-facing pages and in Organization schema:

| Partner | Scope | Source |
|---|---|---|
| **Bitzer** (Germany) | Refrigeration compressors | User-confirmed 2026-04-30 |
| Zanotti (Italy) | Truck refrigeration units, ice cream / dairy plants | Brochure pp.29, 39, 65–72 |
| Thermo King (USA) | Truck refrigeration T-Series | Brochure pp.65–67 |
| Heatcraft (USA) | Rack systems, multi-DX cold stores | Brochure p.31 |
| LU-VE (Italy) | Evaporators | Brochure p.39 |
| Fruit Control Italiana | CA-store equipment, GAC 5000, nitrogen generators | Brochure pp.39, 56–62 |
| Hörmann (Germany) | High-speed insulated doors | Brochure p.86 |
| Songz (China) | HVAC equipment | Brochure p.39 |
| Martek (Italy) | Supermarket cooling systems | Brochure pp.87–90 |

Other partners awaiting confirmation before publishing: Copeland, Danfoss, Emerson, Bock, GEA. Do not name these until user confirms.

## Sales WhatsApp + phone

Already wired across the entire site (no further action needed on the contact-channel front):

- **WhatsApp:** +92 321 5383544 — `https://wa.me/923215383544`
- Floating WhatsApp button (`.fab-wa`) on home, contact, and other key pages
- Contact-form submit-via-WhatsApp pattern in `contact.html`
- Schema `ContactPoint` with `name: "WhatsApp"` already published

Other published numbers (from `contact.html` ContactPoint schema + `llms.txt`):
- Muhammad Anwar Inayat (GM Business Dev) — +92 337 7808147
- Kamran Anwar (Manager Sales) — +92 300 4842467
- Umair Meo (Senior Manager, South Region) — +92 300 7860941

## Case-study specs (5 new projects in Downloads/)

User has confirmed specs are **unknown** for the 5 new project folders (TCCEC Coca-Cola Lahore, Naubahar Bottling Gujranwala, Connect Logistics Karachi, Haier Lab Lahore, USAID Banana Ripening Sindh).

**Implication:** case-study pages will be **photo-led narratives** (client + city + sector + sentence-or-two engineering description + 4–8 photos), not engineering data sheets. Avoid making up capacities or setpoints. Where a fact is visible in a photo (drive-in racking, evaporator count, panel thickness signage), describe it visually rather than asserting numbers we don't have.

Where industry-standard ranges apply (e.g. "beverage cold storage typically operates at 2–4°C" or "banana ripening rooms hold 14–18°C with controlled ethylene"), state them as industry context, not as the project's spec.

## Brochure-supported atomic facts to seed across the site

These replace the unsupported "2,100+" headline and become the trust-signal band:

- **1959** founding (Engineer Izhar Ahmad Qureshi)
- **7th decade** of operation
- **1,500+** pre-engineered buildings supplied
- **277,460 sqft** Lahore manufacturing facility
- **100+** engineers
- **1,300** skilled workers
- **ISO 9001:2015** SGS-certified
- **ISO 14001**, **OHSAS 18001** (per brochure p.2 logo wall)
- **Pakistan Engineering Council** registered
- **AISC / AWS / MBMA / AISI** memberships (p.8)
- **Tekla Structures**, **STAAD.Pro V8i**, **MBS** engineering software in use

## Priority pillars (confirmed)

GROW: Cold Stores · PIR Sandwich Panels (FireSafe PIR) · Refrigeration Systems
SECONDARY: CA Stores · Insulated Doors · Refrigerated Vehicles · CEA Greenhouses
DEPRIORITIZE (keep on site, low visibility): Plant Factories · Smart Cabins · Prefabricated Steel Buildings (PEB)
