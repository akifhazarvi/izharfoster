# Google Ads — keyword cleanup + negative lists

**Built from:** `Search terms report.csv`, account 326-413-6797, 26 Aug – 1 Sep 2026 (7 days, 322 itemised terms).
**Companion to:** [ADS-PLAN.md](ADS-PLAN.md) · [GTM-SETUP.md](GTM-SETUP.md)
**Status:** ready to apply. Nothing here is inferred — every negative below is a term that actually served an ad in the last 7 days.

---

## The situation

| | |
|---|---|
| Account spend, 7 days | **$59.85** (100% Search — PMax is $0.00, the pause held) |
| CTR | **11.30%** at **$0.27** avg CPC — the ads are fine |
| Itemised search terms | $24.88 / 94 clicks |
| **"Other search terms" (not itemised)** | **$34.98 / 128 clicks — 58% of spend you cannot see** |
| Broad match | 137 terms, $8.06, **32% of itemised spend, 1 conversion** |
| Negatives applied | **14 of 322 terms** |

**Recoverable from the itemised half alone: $9.65 = 39% of spend, 288 impressions.**
The invisible 58% follows the same pattern, so the true recovery is larger — and match-type
tightening is the *only* lever that reaches it, because you cannot negate what Google won't name.

---

## Step 1 — Keywords (do this first, before any negative)

The broad-match keywords came from applying Google's recommendations. They are not salvageable by
negatives alone: broad match will keep finding new junk faster than you can list it. Six negatives
per week against 137 broad terms is a losing race.

1. **Campaigns → the campaign → Keywords → Search keywords.**
2. Add a filter: **Match type = Broad**.
3. Select all → **Remove**. (Remove, not pause — a paused broad keyword still shows in
   recommendations and invites re-adding.)
4. Repeat for both `PIR & PUF Panels` and `Izhar foster Ad group Cold store`.
5. **Tools → Recommendations → ⚙ (top right) → Auto-apply → turn every toggle off.** This does not
   undo what was applied manually, but it stops Google re-adding broad keywords on its own later.
6. When a recommendation says *"Add broad match keywords"* or *"Remove non-serving keywords"* —
   **dismiss it**. Google's recommendations optimise for its revenue, not your lead quality.

Keep only **phrase** and **exact**. That was the original spec and it is still right.

> Close variants still apply to phrase and exact — that is where `sandwich panel sheet` and
> `puf sheets` came from. The lists below handle those.

---

## Step 2 — Negative keyword lists

Create these as **shared negative lists** (Tools → Shared library → Negative keyword lists), then
**attach each one to both campaigns**. Creating them is not enough — 308 of 322 terms showed no
negative applied, which suggests the seven lists from 17 Aug exist but are not attached.

Match type matters below. Phrase negatives block any query containing that word order. Exact
negatives block only that precise query — use them for generic single words that would otherwise
kill your real keywords.

### List A — Roofing & cladding sheet
*63 terms · $1.86 · 92 impressions. Izhar makes insulated sandwich panels, not roofing sheet.*

```
"roof sheet"
"roofing sheet"
"cladding sheet"
"cladding"
"cement sheet"
"cement board"
"fibre sheet"
"fiber sheet"
"fibre sheets"
"fiber sheets"
"upvc"
"pvc"
"polycarbonate"
"corrugated"
"alucobond"
"composite panel"
"dadex"
"aluzinc"
"standing seam"
"plastic sheet"
"plastic roof"
"gi sheet"
"steel sheet"
"steel roof"
"tr garder"
"jumbo lawn"
"jumbo loan"
"heat protection roof"
"heat resistant sheet"
"solar chips"
"waterproof"
"waterproofing"
```

### List B — Commodity / loose-fill insulation
*32 terms · $2.93 · 61 impressions. Highest-cost junk cluster. These are competitors' commodity
products, not panels.*

```
"thermopore"
"thermocol"
"jumbolon"
"glasswool"
"glass wool"
"xps"
"penoplex"
"nbr"
"insulation board"
"insulation hard foam"
"membrane"
"dpc"
"roofgrip"
"fiber glass"
"fibre glass"
"fiberglass"
"fibreglass"
"mhk"
```

> `dpc membrane sheet` alone took **$1.06** — the second-largest term in the entire account.

### List C — Display & retail refrigeration
*21 terms · $1.24 · 69 impressions. **This is the one to read carefully.** These people want a
display fridge or bottle cooler, not a walk-in cold room. Varioline, Caravell and AHT are retail
cabinet brands.*

```
"varioline"
"veroline"
"caravell"
"intercool"
"aht"
"pepsi chiller"
"commercial chiller"
"door chiller"
"3 door"
"2 door"
"single door"
"display chiller"
"deep freezer"
"iqf"
"haier"
```

### List D — Competitors & own brand
*10 terms · $1.77 · 25 impressions.*

```
"united insulation"
"gondal"
"dubond"
"dlx bond"
"speed panel"
"pakistan insulation"
"eps solutions"
```

**Own brand — a decision, not an automatic negative.** `izhar roof` ($0.63), `izhar engineering
lahore`, `izhar steel`, `izhar engineering pvt ltd` are people searching for *you*. You rank #1
organically for all of them, so paid clicks here are buying traffic you already own. On a
$15/day budget I would negative them:

```
"izhar"
```

Reverse this only if a competitor starts bidding on your name.

### List E — Resale / second-hand
*9 terms · $1.39 · 27 impressions.*

```
"olx"
"second hand"
"reefer container"
"container for sale"
```

**`"for sale"` — judgement call.** It catches `cold storage for sale in pakistan` (someone buying
an existing *facility*, per the 17 Aug rental-intent finding) but would also block
`walk in freezer for sale`, which could be a genuine buyer. **Recommendation:** negative
`"cold storage for sale"` and `"cold store for sale"` specifically rather than the bare phrase.

### List F — Generic / not a buyer
*8 terms · $0.46 · 14 impressions.*

```
"construction companies"
"construction company"
"types of modular"
"how to make"
"wall panel online"
"kitchen"
"acoustic"
"carbon fiber"
"partition"
```

**Exact-match negatives** — single generic words that pulled impressions. These MUST be exact, or
they will kill your real keywords:

```
[panel]
[panels]
[roof]
[building]
[construction]
[sheet]
```

---

## Step 3 — One decision to make: EPS

**17 terms · $1.07 · 65 impressions** — `eps sandwich panel price in pakistan` was the 5th-largest
spender in the account at $0.69.

Izhar's positioning is **FireSafe PIR** (λ 0.022, fire class B1), and the site's own blog post
`puf-vs-eps-vs-pir-sandwich-panels-pakistan` argues *against* EPS on fire performance.

- **If you do not manufacture EPS panels:** add `"eps"` as a phrase negative. Recovers $1.07 and
  65 impressions, and stops paying to argue with people who want the cheap product.
- **If you do sell EPS:** leave it, and make sure the landing page actually mentions EPS — right
  now the PIR page positions against it, which is why these clicks don't convert.

I have not put this in a list above because it is a commercial decision, not a data one.

---

## Step 4 — What this does not fix

**The conversion signal is still inverted.** The export shows 22 conversions at $2.76, which looks
excellent and is not real — it is counting `cta_quote_click` and `tool_calculated`. GA4 records
roughly 3 completed form submissions per fortnight.

Until GA4 → Admin → Events → Key events is corrected (mark `form_submit`, `lead_submitted`,
`chat_submit`, `wizard_submit`, `cost_lead`, `tool_email_quote`, `tool_quote_whatsapp`; unmark
`cta_quote_click`, `tool_calculated`), **every conversion number in the Ads UI is a tap count** and
Smart Bidding has nothing trustworthy to optimise toward.

**Expect reported conversions to fall sharply after that change.** That is the fix working, not a
regression — you move from counting 22 taps to counting real leads.

---

## Step 5 — Budget

Delivery is still the reverse of the plan:

| Campaign | Spend | Share | Planned |
|---|---|---|---|
| PIR & PUF Panels | $18.12 | 73% | $5/day |
| Izhar foster Ad group Cold store | $6.76 | 27% | $10/day |

Panels already rank **1–3 organically** (`pir sandwich panel` 1.6, `puf panel price in pakistan`
1.6, `4x8 sandwich panel price in pakistan` 1.4). Paid is the only channel reaching the cold-store
buyer — `/services/cold-stores` earns 10 organic clicks per 28 days against the panel page's 199.
Set the daily budgets explicitly rather than letting delivery decide.

---

## Review cadence

- **Daily, this week:** Insights → Search terms → sort by cost → negate anything irrelevant.
  After the broad-match removal this should drop to a handful per day, not 20–40.
- **Weekly:** re-export the search-terms report and re-run this analysis.
- **Do not switch to Maximise conversions** until Step 4 is done and clean `form_submit` /
  `whatsapp_click` conversions have been recording for at least 14 days.

---

# Appendix — GA4 → Google Ads conversion import

When importing GA4 key events as Google Ads conversion actions
(Goals → Conversions → New conversion action → Google Analytics 4 → Select events),
set the **category** on each. Category is not cosmetic: Google groups Sales vs Leads
categories differently in reporting and in Smart Bidding's value model.

| GA4 key event | Category | Primary / Secondary | Count | 28-day vol |
|---|---|---|---|---|
| `whatsapp_click` | **Contact** | **PRIMARY** | One | 68 |
| `phone_click` | **Contact** | Secondary | One | 11 |
| `chat_submit` | **Contact** | Secondary | One | 73 |
| `form_submit` | **Submit lead form** | Secondary | One | 11 |
| `lead_submitted` | **Submit lead form** | Secondary | One | 10 |
| `tool_quote_whatsapp` | **Request quote** | Secondary | One | 20 |
| `tool_email_quote` | **Request quote** | Secondary | One | 21 |
| `cost_lead` | **Request quote** | Secondary | One | 17 |
| `wizard_submit` | **Request quote** | Secondary | One | 17 |

**Do NOT import `lead_intent`.** It is an umbrella event — `js/track.js` fires it via
`emitLead()` alongside every `whatsapp_click`, `phone_click` and `email_click`
(80 ≈ 68 + 11 + 3). Importing it double-counts every contact tap. Best practice is to
also unmark it as a key event in GA4; not importing it is sufficient to keep it out of
bidding.

**Do NOT import `email_click`** (3 in 28 days) — same double-count, negligible volume.

## Why only one Primary

Smart Bidding optimises toward **Primary** actions only; Secondary actions are recorded
for reporting but not bid on. `whatsapp_click` is the right single primary:

- **Volume.** ~130/month. Smart Bidding needs roughly 30/month minimum to learn, ideally 50+.
  No completion event on its own clears that bar — `form_submit` is 11 per 28 days.
- **It is a real lead in this market.** On mobile it outperforms `form_submit` 19:1.
- **The site is now built around it** — the mobile action bar (GP§13, `1bf2ebe`) makes
  one-tap WhatsApp the primary path on every page below 720 px.

The eight Secondary actions still report, so you can see which routes produce
qualified conversations without letting the low-volume ones destabilise bidding.

## Count setting: "One", not "Every"

Lead actions should count **one conversion per ad click**. A visitor who taps WhatsApp,
comes back, and taps again is one lead, not two. "Every" is for e-commerce purchases.

## Before switching to Maximise conversions

Wait until **whatsapp_click has 14 days of clean data** as Primary — roughly 60+ recorded
conversions. Switching earlier hands Smart Bidding a signal it cannot yet model.

Expect reported conversions to **fall sharply** the day this goes live: you move from
counting ~22 taps/week (`cta_quote_click`, `tool_calculated`) to counting real contacts.
That is the fix working. Tell Faisal before he sees the chart.
