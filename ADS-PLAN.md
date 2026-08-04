# Google Ads Campaign Plan (Phase B)

Prerequisite: **[GTM-SETUP.md](GTM-SETUP.md)** (Phase A) complete and showing
"Recording conversions". Strategy context: [GROWTH-PLAN.md](GROWTH-PLAN.md).
Keyword seed data: GROWTH-PLAN §6 (striking-distance list).

---

## §B1 — The strategy in one page

**What we are buying.** Izhar Foster already has demand: 179,453 impressions
over 16 months at average position 21.7, but only 5,490 clicks. The organic
diagnosis is *impressions-rich, click-poor*. Paid search solves a different
problem — it puts you in position 1 for the **transactional** slice of that
demand on day one, while the organic CTR work in GROWTH-PLAN plays out over
months.

**Why Search only, at first.** Cold-store buyers are in-market and searching
with intent (`sandwich panel price in pakistan`, `cold storage cost in
pakistan`). That is bottom-of-funnel keyword demand, which Search captures
better and far cheaper than Display, Demand Gen or PMax. No PMax until you have
30+ conversions of history — PMax with no conversion data spends your budget
teaching itself what you already know.

**The unfair advantages to lean on in ad copy:**
- Manufacturer, not a reseller — own panel plant, no middleman pricing
- 1959 heritage, division of Izhar Group
- Named blue-chip proof: Coca-Cola (TCCEC), Pepsi (Naubahar), Metro, Gourmet, USAID, Haier
- **7 free calculators, no email gate** — an unusually strong ad asset that
  competitors in this market do not have
- λ 0.022 W/m·K, BS EN 14509 aged — a spec claim that filters for serious buyers

**The one thing that will waste the most money.** "Cold storage" is a horribly
ambiguous phrase. It means crypto wallets, cloud archives, warehouse *rental*,
and university assignments far more often than it means "build me a cold store."
§B5 is not optional.

---

## §B2 — Account structure

Naming convention: `GADS_[Type]_[Theme]_[Geo]`

```
Izhar Foster · 326-413-6797 (USD — see §A1)
│
├── GADS_SEARCH_Brand_PK                    ← always on, cheap, defensive
│   └── AG: Brand Exact
│
├── GADS_SEARCH_ColdStore_PK                ← the core money campaign
│   ├── AG: Cold Store Build
│   ├── AG: Cold Store Cost
│   ├── AG: Cold Room / Walk-In
│   └── AG: Blast Freezer
│
├── GADS_SEARCH_PIRPanel_PK                 ← highest existing search demand
│   ├── AG: Sandwich Panel Price
│   ├── AG: PIR / PUF / EPS Panel
│   └── AG: Roof & Wall Panel
│
├── GADS_SEARCH_Pharma_PK                   ← biggest untapped opportunity
│   └── AG: Pharma Cold Storage
│
├── GADS_SEARCH_Refrigeration_PK
│   └── AG: Refrigeration Systems
│
├── GADS_SEARCH_CAStore_PK
│   └── AG: Controlled Atmosphere
│
├── GADS_SEARCH_City_PK                     ← geo-modified, city landing pages
│   ├── AG: Lahore
│   ├── AG: Karachi
│   └── AG: Islamabad
│
└── [Phase 3] GADS_SEARCH_RLSA_PK · GADS_PMAX_ColdChain_PK
```

**Rules that matter more than the structure itself:**

| Rule | Why |
|---|---|
| One theme per ad group, 5–15 keywords max | Ad relevance drives Quality Score, which drives CPC |
| **Phrase + Exact match only at launch. No Broad.** | Broad match with no conversion history is the fastest way to burn a budget in this vertical |
| **"Search Network only" — Display expansion OFF** | The default opt-in silently sends ~half your budget to Display placements at junk quality |
| Ad group → its own landing page (§B7) | Message match is the cheapest CVR lever available |
| Search Partners ON, but review weekly | Usually cheap incremental volume in PK; kill it if CVR is half of Google's |

---

## §B3 — Keywords by ad group

Seeded from GROWTH-PLAN §6, which is real GSC demand you already rank for —
these are proven-volume queries, not Keyword Planner guesses.

`[exact]` · `"phrase"`

### GADS_SEARCH_Brand_PK → AG: Brand Exact
```
[izhar foster]  [izhar foster cold storage]  [izhar panels]
[izhar sandwich panel]  [izhar engineering cold storage]  "izhar foster"
```
Budget it small but never pause it: it is your cheapest traffic, and it stops
competitors bidding on your name from taking a free ride on 67 years of brand.

### GADS_SEARCH_ColdStore_PK
**AG: Cold Store Build** — GSC: `cold storage` 3,556 imp · `cold store` 885 imp
```
"cold storage construction"      "cold store construction"
"cold storage manufacturer"      "cold storage company pakistan"
"cold storage installation"      "turnkey cold storage"
[cold storage pakistan]          [cold store pakistan]
"cold storage plant setup"       "cold storage solution provider"
```
**AG: Cold Store Cost** — GSC: `cold storage cost in pakistan` 242 imp, 5.8% CTR (already your best-converting query shape)
```
"cold storage cost"              "cold storage cost in pakistan"
"cold storage price"             "cold store price in pakistan"
"cold storage setup cost"        "cold storage project cost"
"cold storage investment"        [cold storage cost per ton]
```
**AG: Cold Room / Walk-In**
```
"walk in cold room"              "cold room price"
"cold room manufacturer"         "chiller room construction"
"walk in freezer"                "cold room installation pakistan"
```
**AG: Blast Freezer**
```
"blast freezer"                  "blast freezer price"
"blast chiller pakistan"         "blast freezer manufacturer"
"iqf freezer"
```

### GADS_SEARCH_PIRPanel_PK
**AG: Sandwich Panel Price** — your single strongest demand pocket: `sandwich panel price in pakistan` 2,411 imp at 3.8% CTR, `sandwich panel` 2,863 imp
```
"sandwich panel price"           "sandwich panel price in pakistan"
"sandwich panel price in lahore" "sandwich panel price in islamabad"
"sandwich panel manufacturer"    "sandwich panel pakistan"
[sandwich panel price per square foot]
"4x8 sandwich panel price"
```
**AG: PIR / PUF / EPS Panel** — `pu sandwich panel price in pakistan` 502 imp 4.4% · `puf panel price in pakistan` 258 imp · `eps panel price in pakistan` 167 imp 7.2%
```
"pir panel"          "pir sandwich panel"     "pir panel price"
"puf panel"          "puf panel price"        "pu sandwich panel"
"eps panel price"    "insulated panel price"  "thermal insulation panel"
```
**AG: Roof & Wall Panel** — `sandwich panel roof` 234 imp
```
"sandwich panel roof"    "roof sandwich panel price"
"wall cladding panel"    "insulated roof panel"
"prefab wall panel"
```

### GADS_SEARCH_Pharma_PK → AG: Pharma Cold Storage
**16,740 impressions at position 59.** You are invisible organically and the page
rebuild is still queued — which makes this the clearest case in the account for
paid to do the job now.
```
"pharmaceutical cold storage"    "pharma cold storage"
"medicine cold storage"          "vaccine cold storage"
"pharmaceutical cold room"       "temperature controlled storage pharma"
"gdp cold chain"                 "validated cold room"
"2 to 8 degree cold room"
```

### GADS_SEARCH_Refrigeration_PK → AG: Refrigeration Systems
```
"industrial refrigeration"       "refrigeration system pakistan"
"cold storage refrigeration"     "refrigeration contractor"
"ammonia refrigeration"          "condensing unit pakistan"
"refrigeration plant installation"
```

### GADS_SEARCH_CAStore_PK → AG: Controlled Atmosphere
GSC: `controlled atmosphere storage` 2,268 imp at pos 5.6 but **0.2% CTR** — you
rank and get no clicks. Paid buys the top slot while the organic rewrite lands.
```
"controlled atmosphere storage"  "ca store"
"ca storage apple"               "controlled atmosphere store"
"ca store construction"          "apple cold storage"
```

### GADS_SEARCH_City_PK
GSC: `cold storage lahore` 487 imp 3.1% · `cold storage in lahore` 295 imp
```
AG Lahore:     "cold storage lahore"  "cold store lahore"  "sandwich panel lahore"
AG Karachi:    "cold storage karachi" "cold store karachi" "sandwich panel karachi"
AG Islamabad:  "cold storage islamabad" "sandwich panel islamabad"
```

---

## §B4 — Geo, language, schedule, devices

| Setting | Value | Why |
|---|---|---|
| Locations | Pakistan. **Target by *Presence*, not "Presence or interest"** | The default setting shows your ads to anyone *interested in* Pakistan — including overseas researchers who will never buy |
| Excluded | — | Do **not** exclude Gulf states: you have `services/cold-storage-saudi-arabia.html`. Run KSA/UAE as a **separate campaign** later so its budget and CPCs can't distort the PK numbers |
| Languages | English **and** Urdu | Language targeting keys off the user's Google interface language; excluding Urdu drops real Pakistani buyers |
| Ad schedule | **All hours, all week — do not daypart** | The account is locked to **(GMT-04:00) Eastern**, so schedules are entered in ET, not PKT, and DST shifts them an hour twice a year while Pakistan has no DST. Smart Bidding already adjusts by time-of-day from conversion data, so dayparting adds risk without adding much. If you ever must: PKT = ET + 9 (summer) / +10 (winter), so 09:00–19:00 PKT = 00:00–10:00 ET in summer |
| Devices | All at launch | Mobile will dominate in PK. If mobile CVR trails badly, adjust — don't pre-emptively exclude |
| Rotation | Optimise (default) | |

---

## §B5 — Negative keywords (do this before the first click)

Create these as **shared lists** (Tools → Shared library → Negative keyword
lists) so every campaign inherits them.

### List 1: `NEG_Crypto_Tech` — apply to ALL campaigns
The biggest single waste risk in this account. "Cold storage" is the standard
term for offline crypto custody and for cloud archive tiers.
```
bitcoin  crypto  cryptocurrency  wallet  ledger  trezor  coinbase  binance
cold wallet  hardware wallet  seed phrase  ethereum  nft  blockchain
data  cloud  server  backup  archive  aws  azure  glacier  s3  tape
database  hosting  vault  digital
```

### List 2: `NEG_Jobs_Research` — apply to ALL
```
job  jobs  career  careers  salary  vacancy  vacancies  hiring  recruitment
internship  intern  resume  cv  apply  employment
meaning  definition  define  wikipedia  wiki  pdf  ppt  doc  thesis
assignment  notes  lecture  course  training  certification  exam  mcqs
project report  feasibility report  case study  research paper  journal
diagram  drawing  dwg  autocad  cad  3d model  sketchup  revit
```

### List 3: `NEG_Rental_Wrong_Intent` — apply to ALL **← read the note**
```
for rent  on rent  rental  rent  to let  lease  leasing  booking  book
storage space  space available  warehouse space  per pallet  pallet rate
storage charges  storage rates  monthly rate  3pl  third party logistics
second hand  used  olx  resale  for sale by owner  scrap
```
**Why this list exists.** Izhar Foster **builds and manufactures** cold stores.
Someone searching "cold storage rent in Lahore" wants to store 40 tons of
potatoes for a season — they are not going to commission a facility. That click
costs the same as a real buyer's and converts at zero.

> Deliberate tension to be aware of: `cold-storage-near-me.html` exists as an
> **SEO** play for exactly this rental-intent traffic. That is correct for
> organic (free impressions, some turn into buyers) and wrong for paid (you pay
> per click). Keep the page; negative the intent in Ads.

### List 4: `NEG_Consumer_Food` — apply to the PIR Panel campaign
```
sandwich recipe  sandwich maker  sandwich bread  club sandwich  subway
sandwich shop  chicken sandwich  toast  filling  panini  burger  fast food
```
"Sandwich panel" and "sandwich" collide badly on broad-ish phrase matches.

### List 5: `NEG_Other_Geos` — apply to all PK campaigns
```
india  indian  delhi  mumbai  gujarat  china  chinese  alibaba  bangladesh
sri lanka  nepal  kenya  nigeria  egypt  turkey  vietnam  indonesia
```
Do **not** add `saudi`, `ksa`, `uae`, `dubai`, `qatar` — those are a live market
for you (`services/cold-storage-saudi-arabia.html`) and belong in their own
campaign.

### List 6: `NEG_Freebie` — apply to ALL
```
free  cheap  cheapest  diy  homemade  how to make  homemade cold storage
tutorial  youtube  video  images  photos  wallpaper
```
Exception: keep `free` out of this list if you decide to advertise the
calculators as a lead magnet — "free cold storage calculator" is *good* traffic.
Start with `free` negated, and revisit in Phase 3.

### Ongoing hygiene
Weekly for the first 6 weeks: Campaign → **Insights → Search terms**, sort by
cost, add anything irrelevant as an exact negative. Expect to add 20–40 terms in
week 1 alone. This is the highest-ROI hour you will spend on the account.

---

## §B6 — Ad copy (responsive search ads)

Limits: **headlines ≤ 30 chars, descriptions ≤ 90 chars.** Every string below is
verified in range. Give each ad group 12–15 headlines and 4 descriptions; pin
nothing at launch except where noted, and let Google learn the combinations.

### AG: Cold Store Build / Cold Store Cost
**Headlines**
```
Turnkey Cold Stores Pakistan     (28)   Cold Storage Built Since 1959   (29)
Cold Store Cost in 24 Hours      (27)   Panels + Plant + Doors, 1 Firm  (30)
−25°C to +8°C Cold Rooms         (24)   Pakistan's Largest Panel Maker  (30)
Free Sized Concept + Budget      (27)   Coca-Cola, Pepsi, Metro Trust   (29)
In-House Panel Manufacturing     (28)   Free Cold Store Calculator      (26)
BS EN 14509 Certified Panels     (28)   Lahore & Karachi Engineers      (26)
Reply From Engineers in 24h      (27)   67 Years of Cold Chain Work     (27)
2,100+ Cold Chain Installs       (26)   −40°C to +25°C Capability       (25)
```
**Descriptions**
```
Design, panels, refrigeration and doors from one Pakistani maker. Since 1959.  (77)
Send temperature and capacity — get a sized concept and budget in 24 hours.    (75)
67 years in cold chain. Coca-Cola, Pepsi, Metro and USAID have built with us.  (77)
Size your own cold store free with our ASHRAE load calculator. No email gate.  (77)
```

### AG: Sandwich Panel Price / PIR–PUF–EPS
**Headlines**
```
PIR Sandwich Panel Prices        (25)   Sandwich Panels From Lahore     (27)
PIR vs PUF vs EPS — Compare      (27)   λ 0.022 W/m·K PIR Panels        (24)
BS EN 14509 Aged Lambda          (23)   Panel Price in 24 Hours         (23)
Wall, Roof & Cold Room Panels    (29)   Made in Pakistan Since 1959     (27)
Free Panel Price Calculator      (27)   FireSafe PIR Sandwich Panels    (28)
40mm to 200mm Thicknesses        (25)   Direct From the Manufacturer    (28)
No Middleman Panel Pricing       (26)   Ask for a Panel Spec Sheet      (26)
```
**Descriptions**
```
PIR, PUF and EPS panels from our own Lahore plant. BS EN 14509 aged lambda.    (75)
Tell us thickness, area and finish — indicative panel pricing within 24 hours. (78)
Free calculator prices your panel job before you speak to anyone. No sign-up.  (77)
Wall, roof, partition and cold-room panels, 40–200 mm. Manufacturer pricing.   (76)
```

### AG: Pharma Cold Storage
**Headlines** — pin `Pharma Cold Storage Rooms` to Headline 1. This ad group is
buying a distinct, high-value intent and the match must be unmistakable.
```
Pharma Cold Storage Rooms        (25)   +2°C to +8°C Validated Rooms    (28)
GDP-Ready Cold Chain Build       (26)   Vaccine & Medicine Storage      (26)
Mapping, Alarms, Redundancy      (27)   Built for Pharma Audits         (23)
Dual-Compressor Redundancy       (26)   24/7 Temperature Logging        (24)
Pharma Cold Room Quote 24h       (26)   Haier Lab Project Delivered     (27)
N+1 Refrigeration Backup         (24)   Qualification Docs Included     (27)
Free Pharma Load Calculator      (27)   Since 1959 · Izhar Foster       (25)
```
**Descriptions**
```
+2 to +8°C and −20°C rooms with N+1 redundancy, mapping and continuous logging.(78)
Built for pharmaceutical audit trails: validation docs, alarms, backup plant.  (77)
Pakistani manufacturer since 1959. Panels, refrigeration and doors, one team.  (77)
Send your volume and temperature band — sized concept and budget in 24 hours.  (77)
```

### AG: Controlled Atmosphere
**Headlines**
```
CA Stores Built in Pakistan      (27)   Controlled Atmosphere Stores    (28)
3,000-Ton CA Store Delivered     (28)   Keep Apples Firm for Months     (27)
O₂ / CO₂ Control Systems         (24)   USDA Handbook 66 Based          (22)
CA Store Cost in 24 Hours        (25)   Gas-Tight Panel Envelope        (23)
Free CA Atmosphere Calculator    (29)   Since 1959 · Izhar Foster       (25)
```
**Descriptions**
```
Gas-tight envelope, scrubbers and O₂/CO₂ control from one Pakistani builder.   (76)
HAC Agri's 3,000-ton CA store was built by us. Send your tonnage for a budget. (77)
Hold apples and pears months longer. Free CA atmosphere calculator on site.    (75)
Panels, refrigeration, doors and controls delivered as one turnkey contract.   (76)
```

### AG: City ads (Lahore shown; swap the city)
```
Cold Storage Lahore             (19)   Cold Store Builders, Lahore     (27)
Multan Road Panel Factory       (25)   Site Visit This Week            (20)
Lahore Cold Room Quote 24h      (26)   Metro Ravi Built by Us          (22)
```
```
Our factory and engineers are in Lahore. Site visit and survey within the week.(78)
Cold stores, panels and refrigeration from a Lahore manufacturer since 1959.   (76)
```

### Character safety — check these four before submitting

Every string above is within Google's limits, but four use symbols that
Google's editorial policy on non-standard characters can reject. Submit them
first; if any is disapproved, swap in the ASCII version — no length problems:

| Risky | Symbol | ASCII fallback | Chars |
|---|---|---|---|
| `−25°C to +8°C Cold Rooms` | `−` U+2212 minus | `-25°C to +8°C Cold Rooms` | 24 |
| `λ 0.022 W/m·K PIR Core` | `λ` `·` | `Lambda 0.022 W/mK Core` | 22 |
| `O₂ / CO₂ Control Systems` | `₂` subscript | `O2 / CO2 Control Systems` | 24 |
| `Gas-tight envelope, scrubbers and O₂/CO₂ control…` | `₂` | `…and O2/CO2 control…` | 76 |

`°C`, `—`, `–` and `·` are routinely accepted; the minus sign, Greek letters and
subscripts are the ones that get flagged.

### Copy rules for this account
- **Never claim a certification or client you cannot evidence.** Every name above
  is in `projects/` as a published case study.
- Lead with **manufacturer** and **24-hour quote** — the two things a trading
  house cannot match.
- Put a number in most headlines (`1959`, `24h`, `0.022`, `3,000-ton`, `−25°C`).
  Numerals earn clicks in industrial search.
- Do not write "best" or "No. 1" — unverifiable superlatives can get ads
  disapproved and mean nothing to an engineer.

---

## §B7 — Landing page map

Every one of these pages already exists. **Do not send paid traffic to the
homepage** — message match is the cheapest CVR lever you have.

| Campaign / ad group | Landing page |
|---|---|
| Brand | `index.html` |
| Cold Store Build | `services/cold-stores.html` |
| Cold Store Cost | `tools/cost-calculator.html` *(a cost query deserves the calculator, not a brochure)* |
| Cold Room / Walk-In | `services/walk-in-cold-rooms.html` |
| Blast Freezer | `services/blast-freezers.html` |
| Sandwich Panel Price | `services/pir-sandwich-panels.html` |
| PIR / PUF / EPS | `blog/puf-vs-eps-vs-pir-sandwich-panels-pakistan.html` |
| Roof & Wall Panel | `services/pir-sandwich-panels.html` |
| Pharma | `services/pharmaceutical-cold-storage.html` |
| Refrigeration | `services/refrigeration-systems.html` |
| Controlled Atmosphere | `services/ca-stores.html` |
| Lahore / Karachi / Islamabad | `cold-storage-lahore.html` · `cold-storage-karachi.html` · `cold-storage-islamabad.html` |

**Tracking template** (Settings → Account settings → Tracking, set once at
account level so you never hand-build a URL):
```
{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={adgroupid}&utm_term={keyword}&gclid={gclid}
```
`js/track.js` reads `gclid` first and files the session as `google_ads / cpc`
regardless of the UTMs, so the two cannot disagree.

**Before launch, confirm on each landing page:** a WhatsApp CTA above the fold,
the phone number tappable, and mobile LCP under ~2.5 s. Paid traffic is
overwhelmingly mobile in Pakistan.

> ### Lean on WhatsApp, not the form
>
> DAILY-TASKS (2026-07-19) recorded **82 form starts → 4 submits** — the quote
> form drops roughly 95% of the people who begin it. That is survivable on free
> organic traffic and expensive on paid: you would be buying clicks into the
> weakest step on the site.
>
> Until the form UX audit lands, **make WhatsApp the primary CTA on every paid
> landing page** and treat the form as the secondary path. It fits how Pakistani
> B2B buyers actually behave, it is one tap on mobile, and `js/track.js` already
> logs it as a lead and stamps the `Ref:` code for offline import.
>
> Trade-off to accept knowingly: a WhatsApp lead gives Google nothing to hash,
> so those conversions run without Enhanced Conversions matching. The form is
> the only path that carries hashed email/phone. Higher volume on a slightly
> weaker signal beats near-zero volume on a perfect one — revisit once the form
> converts better.

---

## §B8 — Budget and bidding

**Account currency is USD** (`326-413-6797`). PKR figures below are the planning
numbers; the USD column is what you actually type into Google Ads. Conversion at
roughly PKR 280 = USD 1 — re-check the rate before committing real budget.

### Budget tiers

| Tier | Monthly PKR | **Monthly USD** | **Daily USD** | Use when |
|---|---|---|---|---|
| **Lean** | 90,000 | **$320** | ~$10.50 | Proving the channel works before committing |
| **Standard (recommended)** | 200,000 | **$715** | ~$23.50 | Enough volume to exit learning inside a month |
| Aggressive | 450,000 | **$1,600** | ~$53 | Only after Phase 3 shows a CPA you're happy to buy at |

Below ~PKR 90,000/month across 7 campaigns each campaign is too thin to learn
anything, and you will conclude "Google Ads doesn't work" from noise.

### Standard tier allocation

| Campaign | Monthly PKR | Share | Tier (70/20/10) |
|---|---|---|---|
| `GADS_SEARCH_ColdStore_PK` | 70,000 | 35% | Proven |
| `GADS_SEARCH_PIRPanel_PK` | 50,000 | 25% | Proven |
| `GADS_SEARCH_Pharma_PK` | 24,000 | 12% | Scaling |
| `GADS_SEARCH_Refrigeration_PK` | 20,000 | 10% | Scaling |
| `GADS_SEARCH_CAStore_PK` | 14,000 | 7% | Testing |
| `GADS_SEARCH_City_PK` | 14,000 | 7% | Testing |
| `GADS_SEARCH_Brand_PK` | 8,000 | 4% | Proven (defensive) |
| **Total** | **200,000** | 100% | 64 / 22 / 14 |

Cold Stores + PIR Panels take 60% because that is where GROWTH-PLAN's evidence
of demand is strongest. Pharma is deliberately under-weighted at launch despite
being the biggest *opportunity* — 16,740 impressions is organic demand, and it
still has to be proven to convert on paid before it earns more.

### Bidding by phase

| Weeks | Strategy | Setting | Why |
|---|---|---|---|
| 1–3 | **Maximize Clicks** with a max CPC cap | Cap at PKR 60 | Zero conversion history means Smart Bidding has nothing to learn from. Buy cheap data and validate that conversions actually record |
| 4–8 | **Maximize Conversions** | No tCPA yet | Enough signal to optimise; a tCPA set too early starves delivery |
| 9+ | **Target CPA** | 0.8 × observed CPA | Only once a campaign clears ~30 conversions/month |
| Phase 4 | **tROAS** | From real close rates | Only after offline conversion import (GTM-SETUP §A12) is running |

**Validate the CPC cap on day one.** PKR 60 is a starting guardrail, not a
researched figure — open Keyword Planner (Tools → Planning → Keyword Planner),
paste the §B3 keywords, filter to Pakistan, and read the actual top-of-page bid
range. Adjust the cap to roughly the low end of that range and let the auction
teach you the rest.

---

## §B9 — What a lead is actually worth

The placeholder values in GTM-SETUP §A4 are *relative* — enough for bidding to
learn that a form fill beats an email click. Replace them with real economics as
soon as you can fill in this formula:

```
Value per lead = Average order value × Gross margin % × Lead→order close rate
```

Worked example — **substitute your own numbers**:

```
Average cold store contract        PKR 12,000,000
Gross margin                                  22%   →  PKR 2,640,000 gross profit
Web lead → signed order                        3%   →  PKR    79,200 per lead
```

At that value, a PKR 3,000 cost per lead is a 26× return, and you should be
spending far more than PKR 200,000/month. **That is exactly why offline
conversion import matters** — without it Google optimises toward form fills, and
form fills are not orders.

**Do not set these true values as conversion values until offline import is
running.** Feeding a PKR 79,200 value into every raw form fill will teach the
algorithm that all leads are equally valuable, which is the opposite of true.

---

## §B10 — 12-week roadmap

### Phase 1 — Foundation (week 1, no spend)
- [ ] GTM-SETUP Phase A complete; status "Recording conversions"
- [ ] Account currency / time zone / Expert Mode verified (§A1)
- [ ] Auto-tagging on; tracking template set (§B7)
- [ ] All 6 negative keyword lists built and applied (§B5)
- [ ] Keyword Planner run for real PK CPC ranges (§B8)
- [ ] Landing pages checked for above-fold WhatsApp CTA + mobile LCP

### Phase 2 — Launch (weeks 2–4)
- [ ] Launch **Brand + ColdStore + PIRPanel only**. Three campaigns, not seven — you cannot debug seven at once
- [ ] Maximize Clicks, CPC cap, Search-only, Display expansion OFF
- [ ] Assets on every campaign: sitelinks, callouts, structured snippets, call extension (`+92 42 3538 3543`), image extensions
- [ ] **Daily** for 7 days: search-terms report → negatives
- [ ] Day 3: confirm conversions are recording with values attached
- [ ] Day 7: confirm GA4 `google_ads / cpc` sessions ≈ Ads clicks (±15%)

### Phase 3 — Optimise (weeks 5–8)
- [ ] Add Pharma + Refrigeration + CA + City campaigns
- [ ] Switch launched campaigns to Maximize Conversions
- [ ] Apply the **3× Kill Rule**: any ad group at 3× target CPA with 100+ clicks and no conversions gets paused
- [ ] Pause keywords with 50+ clicks and zero conversions
- [ ] Add RLSA layer using the GA4 audiences from §A11 (`engaged_session`, `tool_calculated`, `wizard_step ≥ 3` are your high-intent segments — see EVENTS.md)
- [ ] First ad-copy iteration: keep the top 3 headlines by Impr., replace the "Low" rated ones
- [ ] Set ad-schedule bid adjustments from 4 weeks of hour/day data

### Phase 4 — Scale (weeks 9–12)
- [ ] Sales logging `Ref:` codes against enquiries; first offline conversion upload (§A12)
- [ ] Promote `IF – Qualified Lead (Offline)` to Primary once ~30 have accumulated
- [ ] tCPA on campaigns clearing 30 conv/month
- [ ] Scale winners by **+20% budget at a time, max weekly** — bigger jumps reset learning
- [ ] Only now consider PMax, with brand terms excluded and audience signals from your converter lists
- [ ] Consider a separate `GADS_SEARCH_Gulf_KSA` campaign for the Saudi page

---

## §B11 — Operating cadence and KPI targets

**Daily (weeks 1–2, then weekly):** spend pacing · search terms → negatives ·
conversions still recording · disapproved ads.

**Weekly:** CPA by campaign · search-terms mining · asset performance ratings ·
budget-constrained warnings · Quality Score below 5.

> **Reporting caveat — the account runs on Eastern time.** An "Ads day" spans
> 09:00 PKT → 09:00 PKT (10:00 in winter). Daily figures will never line up with
> GA4 if that property is on Pakistan time, so **compare 7-day and 28-day windows,
> not single days.** For offline conversion uploads (§A12), log Pakistani local
> time and append the offset explicitly — `2026-08-14 15:30:00+05:00` — which
> Google accepts and which sidesteps the conversion entirely.

**Monthly:** reallocate against 70/20/10 · kill/scale decisions · ad copy
refresh · landing page CVR review · reconcile Ads conversions against actual
WhatsApp enquiries received (the number that matters).

### Targets — treat month 1 as baseline, not failure

| Metric | Month 1 | Month 3 | Month 6 |
|---|---|---|---|
| CTR (Search) | 4–6% | 7%+ | 9%+ |
| Conv. rate (lead, any channel) | 2–4% | 5% | 6–8% |
| Quality Score (avg) | 5–6 | 7 | 8 |
| Impression share (core terms) | 20–30% | 45% | 60% |
| Cost per lead | baseline | −25% | −40% |
| Qualified (offline) leads | n/a | tracking live | primary bid signal |

If month 1 CTR is below 3%, the problem is copy or keyword match, not budget.
If CTR is fine but CVR is below 1%, the problem is the landing page, not the ads.

---

## §B12 — What not to do

| Don't | Why |
|---|---|
| Launch PMax first | No conversion history to learn from; it will eat the budget and cannibalise brand |
| Use Broad match at launch | With no conversion signal it matches on themes, not intent |
| Leave "Display expansion" on | Google's default opt-in; quietly diverts budget to junk placements |
| Enable auto-apply recommendations | Google will add broad keywords and "optimised" ad copy you did not approve |
| Target "Presence or interest" | Overseas researchers, zero buying intent |
| Send paid traffic to the homepage | Every rupee of message match is lost |
| Split leads across 4 Primary conversion actions | Fragments a small signal into four useless ones |
| Judge the account before 3 weeks / 100 clicks per ad group | You will be reading noise |
| Bid on the deprioritised pillars | Plant Factories / Smart Cabins / PEB are off-strategy per GROWTH-PLAN §3 — organic-only |
| Raise budgets more than 20% at once | Resets the learning phase |

---

## Assets to build once, reused everywhere

**Sitelinks** (≤25 char link text, 2× ≤35 char descriptions)
```
Cold Store Costs   → tools/cost-calculator.html
Free Calculators   → tools.html
Case Studies       → projects.html
PIR Panel Prices   → services/pir-sandwich-panels.html
Pharma Cold Rooms  → services/pharmaceutical-cold-storage.html
Talk to Engineers  → contact.html
```
**Callouts** (≤25 chars each)
```
Since 1959 · Own Panel Factory · λ 0.022 W/m·K · BS EN 14509
Lahore & Karachi · 24-Hour Quote · Turnkey Delivery · 7 Free Calculators
```
**Structured snippet** — header *Types*:
```
Cold Stores · CA Stores · PIR Panels · Blast Freezers · Insulated Doors · Refrigerated Vehicles
```
**Call extension:** `+92 42 3538 3543` (the number on 155 pages of the site).
Enable **call reporting** so calls from ads become conversions too.

**Image extensions:** 1200×1200 and 1200×628 from `images/` — panel line,
finished cold store interior, CA store. No stock photography; the real plant
photos are a differentiator.
