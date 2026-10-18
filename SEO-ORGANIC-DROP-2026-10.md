# Organic drop — diagnosis and fixes (2026-10-18)

GSC `https://izharfoster.com/` + GA4 `properties/535317784`, pulled 2026-10-18.
Compared: **last 4 weeks (21 Sep – 17 Oct)** against **the peak 4 weeks
(27 Jul – 23 Aug)**.

## Headline

| | Peak 4 wks | Last 4 wks | Change |
|---|---|---|---|
| Organic clicks (GSC) | 669 | 328 | **−51%** |
| Organic impressions | 17,985 | 12,323 | −31% |
| Avg position | ~7.5 | ~7.0 | **steady** |
| Organic sessions/wk (GA4) | 188 | 76 (wk 42) | −60% |
| **Paid** sessions/wk (GA4) | 0 | 431 (wk 42) | new |
| **All** lead taps/wk (GA4 `lead_intent`) | 16 (wk 31) | **111 (wk 42)** | **~7×** |

Rankings did not collapse and nothing is de-indexed (URL inspection: home,
PIR, cost guide, cold-stores and cost calculator all *Submitted and indexed*,
Google-selected canonical = own URL, crawled 4–14 days ago). The drop has
four causes, in order of size.

## 1. Our own Google Ads are buying our organic clicks (~60% of the loss)

The "PIR & PUF Panels" Search campaign started in week 34 (17–23 Aug); the
"Cold store" ad group began landing on the cost guide in week 36.

| PIR page, sessions/wk | Organic | Paid |
|---|---|---|
| wk 31 (27 Jul) | 72 | 0 |
| wk 34 (ad starts) | 75 | 62 |
| wk 36 | 30 | 117 |
| wk 40 | 16 | 94 |
| wk 42 | 13 | 236 |

`"sandwich panel price*"` queries: CTR **14–16% → 3–4%** from the week of
24 Aug, at an unchanged position of #3.5–4.5. Queries where the site ranks
**#1–2 and now gets zero organic clicks** (ad above it):

| Query | Organic pos | Clicks peak → now |
|---|---|---|
| puf panel price in pakistan | 1.3 | 5 → 0 |
| 4x8 sandwich panel price in pakistan | 1.7 | 11 → 0 |
| sandwich panel price in pakistan | 3.6 | 43 → 10 |
| izhar foster (brand) | 1.0 | 30 → 20 |

Cost guide: organic 20 → 7 sessions/wk while paid went 0 → 62.

**This is not lost business.** Total Google visits and total lead taps are up;
they are now paid for. The open question is whether those clicks needed
buying — see the test below.

## 2. Broad terms slipped from page 1 to page 2 (~20%)

| Query | Page | Impr peak → now | Pos peak → now |
|---|---|---|---|
| cold storage | / | 150 → 25 | 9.3 → 11.0 |
| cold store | / | 49 → 21 | 5.8 → 8.3 |
| sandwich panel | PIR | 194 → 61 | 5.1 → 7.0 |
| sandwich panels | PIR | 55 → 12 | 3.7 → 5.2 |
| puf insulated sheet price in pakistan | PIR | 81 → 2 | 3.8 → 8.0 |
| cold storage manufacturers in lahore | / | 32 → 7 | 2.3 → 3.3 |

Contributing, on our side:
- **Homepage title** changed on 16 Aug from *"Cold Storage Pakistan & PIR
  Sandwich Panels"* to *"Industrial & Commercial Cold Storage · PIR Panels"*.
  "Pakistan" and "Sandwich Panels" left the title, and the drop on the two
  terms that depend on it followed.
- **PIR page H1** has never contained "sandwich panel" (unchanged since April:
  *"FireSafe PIR panels — 49× more insulating than concrete"*), and the title
  has no "PUF", the word Pakistani buyers search with.

Competitor movement may also play a part; it cannot be measured from GSC.

## 3. Brand searches fell ~35% (~10%)

`izhar foster` 49 → 35 impressions, `izhar group of companies` 46 → 17,
`izhar.com` 33 → 13. Fewer people search the company by name. This is offline
demand, not SEO.

## 4. Deprioritised prefab terms (~10%)

`prefabricated houses in pakistan` #13.8 → #24.6, `prefab` 37 → 7 impressions.
Prefab/PEB is deprioritised in GROWTH-PLAN §3; no action.

## Shipped (this commit)

- **PIR page title:** `PIR (PUF) Sandwich Panel Price in Pakistan 2026 |
  Izhar Foster` (62 chars). The page itself says PUF is the colloquial name
  and that Izhar makes PIR (PU discontinued), so "PUF" appears as the search
  term, not as a product claim.
- **PIR page meta description** (161 chars): price range kept (CTR stayed at
  13–16% with it before the ads), PUF framed as what PIR replaces.
- **PIR page H1:** "FireSafe PIR **sandwich** panels — 49× more insulating…".
- **Homepage title:** `Cold Storage & PIR Sandwich Panels in Pakistan |
  Izhar Foster` (restores the pre-16-Aug keywords). The industrial &
  commercial positioning stays in the H1, description and OG tags.

Expect 2–4 weeks for Google to recrawl and re-rank. PIR is crawled daily.

## To do in Google Ads (the API is blocked, so this is UI-only)

**Two-week holdout test** on the terms where the site already ranks #1–4.
Add these as **exact-match negatives** to the *PIR & PUF Panels* campaign:

```
[puf panel price in pakistan]
[4x8 sandwich panel price in pakistan]
[sandwich panel price in pakistan]
[sandwich panels price in lahore]
[izhar foster]
[izhar foster pakistan]
```

Then compare the PIR page's **organic + paid `lead_intent`** for the two weeks
before and after. Note the risk: a competitor's ad may take the top slot and
organic CTR may not fully recover. Keep the negatives if total leads hold and
spend falls; remove them if leads drop.

**Week-42 jump confirmed as an intended budget increase** (owner, 2026-10-18):
paid sessions ~250 → 431 a week, paid lead taps ~49 → 91 a week. Run the
holdout test on top of the new budget, so the before/after comparison uses
the same spend level.

## Re-check

Re-run this pull around **2026-11-08**: PIR organic clicks/CTR, the six head
terms above, and organic vs paid `lead_intent` by week.
