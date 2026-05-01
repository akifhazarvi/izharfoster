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

## Cost Calculator (Tool 8) — CEO direction 2026-05-01

The CEO has researched the global landscape and concluded **no competitor offers a fully-integrated turnkey cold-store cost calculator**. Bitzer / Danfoss Coolselector / Güntner are technical-only (engineering, no cost). Coldbox Builders / Cold Storage Construction / KPS Global / U.S. Cooler are marketing-only (lead capture, no engineering depth). Izhar Foster's tool will combine both — and is therefore positioned as **"World's First Intelligent Cold Store Cost Calculator."**

### Differentiation directives (CEO 2026-05-01)

1. **Dual-mode output** — Quick estimate (10 seconds) AND detailed engineering estimate (full form). Same backend, two UX paths.
2. **Pakistan-specific intelligence layer** — load-shedding impact on operating cost · diesel vs solar comparison · PEB vs RCC building economics. None of these exist in any global tool today.
3. **Commercial metrics that buyers actually want**:
   - **Cost per ton** (storage capacity)
   - **Cost per pallet position**
   - **Cost per cubic foot / cubic metre**
   - **Payback period** (optional upgrade)
4. **Lead-capture handoff** — at the result step, NOT as a gate before showing the cost band. Three CTAs: "Download Detailed Proposal (PDF)", "Request Site Visit", "WhatsApp Consultation". This pattern matches global best-practice (lead capture > exact-quote disclosure).
5. **Backend logic borrows from**:
   - Bitzer Software (compressor selection + power)
   - Danfoss Coolselector®2 (load calculation)
   - Güntner (evaporator/condenser sizing)
   - FAO cold-storage planning guidelines (commodity density, RH, temperature)
   - RSMeans-style civil cost data (Pakistan-localised: Rs/sqft, Rs/m³)
6. **Engineering + Financial + Commercial + UX** all in one tool — that is the moat.

### Inputs (CEO-derived spec)

**Quick mode (10 seconds):**
- Capacity (tons OR pallets OR m³)
- Temperature setpoint preset (chiller / cold store / freezer / blast / CA)
- City (12 Pakistan cities — already in our calculator dataset)
- → Output: PKR cost band (low / mid / high), kW refrigeration, m² panel area

**Detailed mode (3 steps):**
- Step 1: Project basics — city, commodity preset (24 PK crops + beverage / pharma / meat / dairy / 3PL), capacity, temperature, lead time horizon
- Step 2: Building & envelope — panel thickness preset (80 / 100 / 125 / 150 mm), site class (greenfield / inside existing shed / multi-zone), PEB vs RCC envelope choice
- Step 3: Refrigeration & power — architecture (CDU / multi-CDU rack / glycol-ammonia / NH3 DX), refrigerant choice, generator backup yes/no, solar option yes/no, load-shedding hours/day

### Outputs (full set)

- **PKR cost band** with low / mid / high (±20%)
- **Heat load (kW)** — from existing `load-calculator.js` engine
- **Refrigerant charge (kg)** — from `refrigerant-charge.js`
- **Recommended condenser kW** — from `condenser-sizing.js` with Pakistan ambient derate
- **Annual energy cost (PKR/year)** — per-city tariff (LESCO / K-Electric / IESCO / GEPCO / FESCO / MEPCO / PESCO / HESCO / QESCO / SEPCO)
- **Cost per ton / pallet / cubic metre** — three commercial metrics
- **Recommended Izhar Foster scope** — PIR thickness, panel m², door count, refrigeration HP
- **Diesel vs Solar comparison** — annual operating cost under each
- **PEB vs RCC envelope comparison** — capex + lead-time delta
- **Payback period** — optional advanced output
- **3 named comparable projects** from our case-study library

### Lead-capture (CEO directive)

After the result is shown:

```
[Download Detailed Proposal PDF]   [Request Site Visit]   [WhatsApp Consultation]
```

NOT a gate before the result. The buyer sees the cost band first, then chooses to engage.

### Build sequence (revised per CEO)

1. **Backend formulas** — TR/kW/cost logic, Pakistan tariff data, civil-cost database (Rs/sqft localised), PEB-vs-RCC delta, load-shedding penalty
2. **Quick-mode UI** (homepage embed candidate)
3. **Detailed-mode UI** (full 3-step form at `/tools/cost-calculator`)
4. **PDF generation** — leverage existing `_shared.js` Print PDF capability, extend with a branded proposal template
5. **Lead-capture form** with JSON snapshot of the calculator state
6. **Schema markup** — `Action` schema for the calculator, FAQ, "show your math" passage-citable explainer

The CEO's final positioning line goes on the page hero:

> **"World's First Intelligent Cold Store Cost Calculator"**

Sub-headline:

> *Engineering + Financial + Commercial — all in one tool. Pakistan-tuned. By Izhar Foster, since 1959.*

### Linking the CEO's spec to existing site assets (2026-05-01)

We do NOT build a new engineering engine. The 7 existing calculators in `js/tools/` already cover ASHRAE Ch.24 heat load, NIST REFPROP charge, ASHRAE Ch.35 condenser sizing with Pakistan derate, IEC 60335 A2L safety, capacity planning across 24 PK crops, energy cost A vs B, and CA-atmosphere recipes. Tool 8 is a **cost layer on top** that calls them.

**Plumbing map (existing → new):**

| CEO requirement | Existing asset | New work |
|---|---|---|
| Heat load kW | `load-calculator.js` (ASHRAE Ch.24) | Call as dependency |
| Capacity m³/tons/pallets | `capacity-planner.js` (24 PK crops) | Call as dependency |
| Refrigerant charge kg | `refrigerant-charge.js` (NIST) | Call as dependency |
| Condenser kW + Pakistan derate | `condenser-sizing.js` (MT 2.0%/K, LT 2.7%/K) | Call as dependency |
| A2L safety | `a2l-room-area.js` | Conditional call for A2L refrigerants |
| CA atmosphere extra equipment | `ca-atmosphere.js` | Conditional call when commodity is CA |
| Annual energy cost | `energy-cost.js` | Extend with PK city tariff table |
| Project session save / PDF export | `_shared.js` (Izhar global) | Already wired; extend with proposal template |
| PIR panel cost / m² | NEW `data-pricing.json` | New file |
| Civil cost / m² | NEW `data-pricing.json` | Per site class (greenfield / shed / multi-zone) |
| PEB vs RCC delta | NEW `data-pricing.json` | Capex + lead-time |
| Refrigeration cost / HP | NEW `data-pricing.json` | Per architecture (CDU / rack / NH3-glycol) |
| Door cost | NEW `data-pricing.json` | Per size + thickness |
| Solar vs diesel OPEX | NEW logic + JSON | City tariff + diesel rate + load-shed hours |
| Cost per ton / pallet / m³ | DERIVED | Division on totals |

**Touchpoints across existing site (where calculator gets surfaced):**
- `/` homepage — Quick-mode widget on the second fold (GROWTH-PLAN §13.2 block 3)
- `/services/cold-stores` — embedded with cold-store preset
- `/services/pir-sandwich-panels` — Energy A-vs-B widget links to full Cost Calc
- `/services/refrigeration-systems` — embedded with refrigeration-architecture preset
- `/services/ca-stores` — embedded with CA preset
- `/services/pharmaceutical-cold-storage` — embedded with pharma preset
- All 5 case studies (TCCEC / Naubahar / Connect / Haier / USAID) — "How much would your version cost?" deep-link with the case-study preset pre-loaded
- `/tools` — index entry as Tool 8
- Quote form on `/contact` — "I started with the calculator" checkbox attaches the JSON snapshot

**Build order (CEO advice integrated):**
1. Backend formulas + `data-pricing.json` (placeholder values, clearly flagged)
2. Quick-mode UI (homepage embed candidate)
3. Detailed-mode UI (full form at `/tools/cost-calculator`)
4. PDF proposal template via existing `_shared.js` print pipeline
5. Lead-capture: 3 CTAs at the result step (PDF / Site Visit / WhatsApp Consultation)
6. Schema (`SoftwareApplication` + `FAQPage` + `HowTo`)
7. GSC + GA4 dataLayer events for funnel measurement
8. Pre-loaded preset URLs (`?preset=mango-multan-2000ton` etc.) so case studies and city pages deep-link with state

**Pricing data status:** Calculator ships with **Pakistan-realistic indicative bands ±20%** estimated from public benchmarks (LESCO / K-Electric tariffs, OGRA diesel rates, regional cold-store buildouts adjusted for Pakistan). Each cost cell is **inline-editable in the UI** — user (sales engineer or buyer) can override any number on the spot, with a "reset to default" link. Saved per session in `localStorage`. PR3 build adds editable-bands directive as core UX (CEO 2026-05-01).
