# Izhar Foster — Conversion Funnel

**Last updated:** 2026-05-14
**Status:** Design doc + active build queue
**Owner of design intent:** Akif + Claude (this doc is the source of truth, not the code)

This file replaces ad-hoc "build a page, hope it converts" thinking. Every page on izharfoster.com is now graded on **which funnel stage it serves** and **which conversion artefact it hands off to**. Pages that don't serve any stage are dead weight.

---

## 1. The diagnosis (research-backed, not vibes)

Pulled from `_kr_scrape/GSC-ANALYSIS.md` (Composio GSC, 2026-04-30) + competitor HTML audits (no DataForSEO numbers — that MCP failed in this research session, flagged in DAILY-TASKS.md to re-run).

### 1.1 The traffic problem isn't a traffic problem

| Signal | Value | Implication |
|---|---|---|
| 16-month clicks | 5,490 | Decent baseline volume |
| 16-month impressions | 179,453 | Site is being **seen**, not clicked |
| Avg position | 21.7 (baseline) → 13.1 (last 30d) | Rankings *improving*, not the bottleneck |
| Overall CTR | 3.06% | Below market — the leak is **on-SERP** and **on-page conversion**, not traffic acquisition |

**The 30-day window shows position is moving from 21 → 13** (post-redesign indexation working). Traffic is on its way up. So the conversion-funnel infrastructure has to be ready **before** the rank improvement lands, or we'll waste the visit.

### 1.2 The five CTR-rot pages — biggest immediate wins

These are page-1 listings (pos 5-10) getting <1% CTR. At pos 6-9 expected CTR is 3-5%. We're getting <1%. **Fixing the title + meta + adding wizard CTA in first scroll = 2-3× clicks with no rank change.**

| # | Query | Page | Impr | Clicks | CTR | Pos | Expected CTR |
|---|---|---|---|---|---|---|---|
| 1 | cold storage | `/cold-stores/` | 3,573 | 25 | 0.70% | 8.8 | ~2.5% (3.5× gap) |
| 2 | sandwich panel | `/pir-panels/` | 2,876 | 25 | 0.87% | 5.8 | ~5% (5.7× gap) |
| 3 | controlled atmosphere storage | `/ca-stores/` | 2,275 | 4 | **0.18%** | 5.7 | ~5% (28× gap) |
| 4 | izhar (brand) | `/` | 1,783 | 2 | **0.11%** | 9.8 | ~2.5% (23× gap) |
| 5 | ca store / ca storage | `/ca-stores/` | 870 | 1 | **0.11%** | 12-14 | ~1.5% (14× gap) |

Combined: **11,377 impressions, 57 clicks**. At expected CTR, this set alone yields ~340 clicks/month — a **6× lift on these 5 queries** with on-page CTR fixes.

### 1.3 The five hidden-gem queries — already converting, need more visibility

These have **good CTR** but low impressions. The pages that earn these clicks should be *the templates* for everything else.

| Query | Impr | Clicks | CTR | Why it works |
|---|---|---|---|---|
| prefabricated houses in pakistan | 893 | 246 | **27.5%** | Direct match + commercial intent |
| cold store manufacturers in pakistan | ~240 | 50 | 20.8% | Manufacturer intent — high purchase signal |
| sandwich panel manufacturers in pakistan | ~260 | 42 | 16.2% | Same |
| pu sandwich panel price in pakistan | 503 | 22 | **4.38%** | **Price-signal traffic** — highest commercial intent |
| sandwich panel price in pakistan | 2,420 | 91 | 3.76% | Same |

**Pattern:** "[product] [manufacturer/price] [in pakistan]" converts. The wizard + ROI tool must sit visibly on `/services/pir-sandwich-panels` and `/services/cold-stores` because these are the pages capturing the highest-intent queries.

### 1.4 The pharma anomaly — the biggest single growth lever

| Cluster | Combined impressions | Clicks | CTR | Avg pos |
|---|---|---|---|---|
| Pharmaceutical cold storage (7 queries) | ~5,500 | ~3 | **0.05%** | 40-70 |

**5,500 impressions, near-zero clicks.** The pharma page exists (`/services/pharmaceutical-cold-storage`), gets shown, but doesn't earn clicks. Hypothesis: pos 40-70 is too far down. But this is the largest single intent cluster on the site by impressions. **Strategy: get pharma to pos 10-15 (Phase 1: page rewrite per `DAILY-TASKS.md` Day 2/3), then funnel into the wizard with "Pharma" as the first sector option.**

### 1.5 The competitor whitespace (the offensive moat)

Verified by fetching competitor HTML directly — no DataForSEO needed:

| Capability | Silver Steel | Golden Steel | Innovo | IceMaster | Kingspan-SA | **Izhar Foster (today)** |
|---|---|---|---|---|---|---|
| **Engineering calculator** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ — 7 tools live |
| **Published PKR/SAR price** | ❌ | ❌ | ❌ | ❌ | Global only | ✅ — panel-price table on PIR page |
| **ROI / payback number** | ❌ | ❌ | ❌ | ❌ | ❌ | **Tool 10 building this PR** |
| **5-question intent wizard** | ❌ | ❌ | ❌ | ❌ | ❌ | **Building this PR** |
| **Live WhatsApp deep-link** | Partial | ❌ | ❌ | ❌ | ❌ | ✅ — site-wide |
| **Spoilage-loss calculator** | ❌ | ❌ | ❌ | ❌ | ❌ | **Tool 10 building this PR** |

**The honest finding:** zero PK competitors publish *anything* a buyer can self-serve. The conversion moat is "make the buyer's math visible." That's what Tool 10 + the wizard do.

---

## 2. The funnel shape

```
                              ┌─────────────────────────────────┐
                              │   ORGANIC SEARCH (PK + KSA)     │
                              │   GSC: 179k imp / 16 months     │
                              └──────────┬──────────────────────┘
                                         │
                  ┌──────────────────────┼──────────────────────┐
                  │                      │                      │
                  ▼                      ▼                      ▼
        ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
        │  PILLAR PAGES    │   │  CITY PAGES      │   │  BLOG / GUIDES   │
        │  /services/*     │   │  cold-storage-*  │   │  /blog/*         │
        │  (decision)      │   │  (local intent)  │   │  (research)      │
        └────────┬─────────┘   └────────┬─────────┘   └────────┬─────────┘
                 │                      │                      │
                 ▼                      ▼                      ▼
        ┌────────────────────────────────────────────────────────────┐
        │  CONVERSION ARTEFACTS (every page routes to one of these)  │
        │                                                            │
        │  ① 5-QUESTION CONCEPT WIZARD                              │
        │     "Don't know what you need? Answer 5 questions →       │
        │      Get a sized concept design from our engineers."      │
        │                                                            │
        │  ② ROI / MONEY CALCULATOR (Tool 10) — NEW THIS PR          │
        │     "What is spoilage costing you?                        │
        │      What does a cold store cost?                         │
        │      When does it pay back?"                              │
        │                                                            │
        │  ③ ENGINEERING TOOLS (existing Tools 1-9)                 │
        │     For buyers who already know the spec.                 │
        │                                                            │
        │  ④ WHATSAPP DEEP-LINK (site-wide fab + every CTA)         │
        │     Pakistan's native B2B sales channel.                  │
        └────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
                       ┌──────────────────────┐
                       │   WHATSAPP MESSAGE   │
                       │   to +92 321 5383544 │
                       │   (engineer triage)  │
                       └──────────────────────┘
```

### 2.1 Why every artefact ends on WhatsApp

The existing contact form (`contact.html`) already submits via `wa.me` deep-link with a structured message. Pakistan B2B cold-storage sales happens on WhatsApp. The wizard and Tool 10 inherit the same handoff — **no new backend, no email follow-up latency, no SaaS chat fees**. The wizard's "submit" button is "Send my spec to an engineer on WhatsApp." The ROI calculator's CTA is "WhatsApp this result to an engineer for a precise quote."

This is the chatbot the user described — **structured-form-as-chatbot, handoff to a human on WhatsApp**. Faster to ship, native to the market, no $250/mo chat SaaS, no privacy compromise.

### 2.2 Why two conversion artefacts, not one

Different buyer states require different artefacts:

| Buyer state | Question they're asking | Artefact that converts |
|---|---|---|
| "I don't know what I need" | What should I even buy? | **Wizard** — 5 questions → human |
| "I have a budget concern" | Can I afford this? Will it pay back? | **ROI calculator** → human |
| "I have a spec, I want a number" | Exact thickness / refrigerant / kW? | **Tools 1-9** → human |
| "I want to talk now" | Get me an engineer | **WhatsApp pill** (site-wide) |

A single artefact would force the buyer to either over- or under-qualify. The four-path funnel above lets each visitor self-select their depth.

---

## 3. What ships this PR (in build order)

1. **Tool 10 — Cold Store Money Calculator** (`tools/roi-payback.html`, `js/tools/roi-payback.js`, `js/tools/data-roi.json`).
2. **5-Question Concept Wizard** (`tools/concept-wizard.html`, `js/tools/concept-wizard.js`).
3. **Wire both into existing CTAs** on homepage, KSA hub, projects, services/cold-stores, services/pir-sandwich-panels, services/pharmaceutical-cold-storage, cold-storage-karachi, cold-storage-lahore.
4. **Update `tools.html`, `sitemap.xml`, `DAILY-TASKS.md`.**

### 3.1 Tool 10 — Money Calculator design

**Goal:** answer "is a cold store worth it for me?" in 30 seconds with a defensible number.

**Inputs (4, mobile-first):**
1. **Commodity** — dropdown of 12 PK/KSA-relevant: mango, dates, citrus, banana, potato, onion, tomato, dairy, meat, seafood, pharma, FMCG. Each carries a stored `% spoilage without cold chain` figure from FAO + USDA + Punjab Agri Marketing Board.
2. **Throughput** — tonnes/month.
3. **Selling price** — PKR/kg (with sensible defaults per commodity, user-editable).
4. **City** — drives electricity tariff (LESCO / K-Electric / IESCO / MEPCO / FESCO) + ambient design temp from existing `data-cities.json`.

**Outputs (the three numbers that wake up a buyer):**
1. **What you're losing right now** — PKR/month + PKR/year. Source: spoilage % × throughput × selling price. Headline number, big.
2. **What the store costs** — capex range in PKR. Source: existing `data-pricing.json` × m³ derived from throughput.
3. **Payback** — months. Plus a 10-year cash chart (loss avoided − opex − capex amortisation).

**CTAs (in priority order):**
1. **"WhatsApp this result to an engineer"** — primary. Pre-filled `wa.me` message with the 4 inputs and the 3 outputs.
2. **"Get a precise quote — 5-min wizard"** — secondary, links to the concept wizard.
3. **"Download as PDF"** — tertiary, via existing `_shared.js` print pipeline.

**Math (defensible, sources cited in-tool):**
- Spoilage % per commodity: FAO Postharvest Compendium 2011 + Punjab Agri Marketing Board surveys 2022-2024 (already in repo research).
- Capex/m³: 2026 panel-price band + existing `data-pricing.json` (PKR 18,000–26,000 per m³ all-in, validated against HAC Agri 3,000-t, Iceland Raiwand, Naubahar references).
- Opex (kWh/m³/year): ASHRAE Ch. 24 simplified rule of thumb (40-90 kWh/m³/yr depending on temp class), × city tariff PKR/kWh.
- 10-year cash: simple non-discounted; honest caveat displayed.

**What it doesn't claim:** exact pricing. Every output is a *range* with a yellow "indicative ±25%, exact quote requires engineer review" band. This is the same honesty discipline as Tool 9 (panel-price) per DECISIONS.md.

### 3.2 Concept Wizard design

**Goal:** capture intent + qualifying data from "I don't know what I need" visitors in under 60 seconds, hand off to an engineer with a complete brief.

**5 questions (one screen each, mobile-first, progress bar, no scroll-jacking):**

1. **What are you storing?**
   - Pharma & vaccines · Fresh fruit & vegetables · Frozen food / meat / seafood · Dairy & beverage · Dates & CA-stored produce · Industrial / process · Not sure yet
2. **How much?**
   - Tonnes/month or m³ — slider with sensible defaults. Show "we'll size precisely on the call."
3. **Where?**
   - PK cities + KSA cities (Riyadh/Jeddah/Dammam) + "Other GCC" + free-text.
4. **When?**
   - Within 30 days · 1-3 months · 3-6 months · 6-12 months · Exploring / researching
5. **What's your role + how to reach you?**
   - Role (Owner / CEO · Project manager · Consultant · Procurement · Engineer · Other) + Name + Phone (WhatsApp) + Email. Phone required, email optional.

**Submit handler:** builds a structured WhatsApp message and opens `wa.me/923215383544?text=...`. Same pattern as the existing `quote-form`. **No backend.** Optional: also fires a GA4 event (`wizard_submit` with sector + city + urgency as params) so we can track conversion later.

**Confirmation screen:** "Thanks. An engineer will WhatsApp you within 24 hours. Meanwhile, [open the ROI calculator] or [read the case studies for your sector]." Two follow-on CTAs so motivated buyers can keep researching.

**Anti-friction guarantees:**
- No login. No email gate. No "give us your details to see the result."
- Skippable: every question has "Not sure yet / Skip" (except phone — that's the conversion).
- Persisted in `localStorage` so the visitor can come back and finish.
- Pre-fills from URL params so a CTA on the pharma page lands on Q1 with "Pharma" pre-selected.

### 3.3 Site-wide wiring

After Tool 10 + Wizard ship, every existing CTA in this priority order:

| Existing CTA | New routing |
|---|---|
| "Request a quote" on every hero | → concept wizard (was: contact form) |
| "Send via WhatsApp" buttons | → kept, no change |
| Top nav "Request quote" pill | → concept wizard |
| Bottom-of-page "Tell us your product" CTA | → concept wizard primary, contact form secondary |
| `/services/cold-stores` mid-page | → **NEW** "What does this cost? Run the money calculator" → Tool 10 |
| `/services/pir-sandwich-panels` price-table footnote | → **NEW** "What's your 10-year saving vs PU? Run the money calculator" → Tool 10 |
| `/services/cold-storage-saudi-arabia` hero | → **NEW** wizard pre-filled with "Saudi Arabia" |
| Homepage hero | → wizard primary CTA |

---

## 4. What's deliberately not built

Tracked in `DAILY-TASKS.md`. Not built this PR because they're not the bottleneck:

- Real live chat (Drift / Intercom / Tawk.to) — costs PKR 8-25k/mo, requires staffing, redundant with WhatsApp deep-link which Pakistan B2B already uses.
- WhatsApp Business API (Meta Cloud API) — requires 1-2 days of Meta verification outside the code session; can be added on top of the wizard later without re-architecting.
- Arabic / RTL stylesheet for the KSA hub — flagged in Phase 3 of KSA funnel, after we see whether English-only ranks first.
- AI chatbot (GPT-style) — would need a backend, costs money per conversation, and Pakistan B2B doesn't ask for it yet. Revisit if WhatsApp triage becomes a bottleneck.
- Backend lead-storage CRM — `wa.me` handoff means the lead lives in WhatsApp Business, which is already the engineering team's working channel. Add a CRM (HubSpot free tier?) only if WhatsApp inbox becomes unmanageable.

---

## 5. How we know if it's working

After this ships, the metrics to watch (Composio MCP, GA4, weekly):

| Metric | Source | Target |
|---|---|---|
| Wizard starts | GA4 `wizard_start` event | Baseline week 1; growth WoW |
| Wizard completes | GA4 `wizard_submit` | Target completion rate ≥ 40% of starts |
| Tool 10 sessions | GA4 page_view `/tools/roi-payback` | Baseline week 1 |
| Tool 10 WhatsApp clicks | GA4 `whatsapp_click` w/ `source=tool10` | Target ≥ 15% of sessions |
| WhatsApp conversation count | Manual count from engineering team | +50% within 60 days |
| CTR on top-5 rot pages | GSC weekly | Each from <1% → ≥2% within 90 days |
| Pharma cluster avg position | GSC weekly | 40-70 → 15-25 within 90 days (combined with `DAILY-TASKS.md` pharma rewrite) |

If wizard completion is under 25% in week 2, the questions are too long or too friction-heavy — drop to 3 questions. If Tool 10 has high visits but low WhatsApp clicks, the result band is either not believable or not actionable — revisit copy. Honest iteration loop, not a fire-and-forget build.

---

## Appendix — research sources

- Composio GSC pull 2026-04-30 → `_kr_scrape/GSC-ANALYSIS.md` (gitignored; full 16-month dataset)
- DataForSEO MCP — **failed to connect** in 2026-05-14 research session; `seo-dataforseo` agent returned a gap-analysis based on public competitor HTML instead. Queued in DAILY-TASKS.md to re-run once MCP surface is wired.
- Competitor HTML audits — Silver Steel, Golden Steel, Innovo, IceMaster, Kingspan-SA (direct fetch, May 2026)
- ASHRAE Refrigeration Handbook Ch. 24 (heat load), Ch. 35 (condenser derate)
- FAO Postharvest Loss Compendium 2011
- Punjab Agri Marketing Board postharvest surveys 2022-2024
