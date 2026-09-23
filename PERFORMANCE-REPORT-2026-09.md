# Performance report — 28 days, 26 Aug – 22 Sep 2026

Compared with the previous 28 days (29 Jul – 25 Aug). Pulled 2026-09-23 via
Composio: GSC `https://izharfoster.com/`, GA4 `properties/535317784`. Google
Ads API is still blocked for customer `326-413-6797` (see GTM-SETUP.md §A3),
so Ads totals come from the dashboard screenshot and are cross-checked
against GA4.

---

## 1. The Google Ads "−72% conversions" is not a problem

| | Previous 28d | Last 28d |
|---|---|---|
| Ads conversions (dashboard) | ~430 | 118 |
| Ads cost (dashboard) | ~$185 | $270 |
| GA4 `google / cpc` sessions | 21,042 | 752 |
| GA4 cpc key events | 22,374 | 258 |

**Nearly all of the previous period's conversions were bots.** GA4 puts
20,798 of those sessions on **"Campaign #1", network "Cross-network"**
(Performance Max), firing 22,267 key events: every chat bubble, quote button
and WhatsApp link was clicked, at about 1 key event per session. It ran
5–7 Aug and 12–17 Aug at 1,300–3,300 sessions/day, then **stopped on
18 Aug**, the day after PMax was killed (DAILY-TASKS 2026-08-17).

The 118 conversions this period are real. They match GA4 exactly: 117 paid
`lead_intent` events, i.e. WhatsApp, call and form taps from the two Search
campaigns:

| Campaign | Sessions | Key events | Engagement | Avg time |
|---|---|---|---|---|
| PIR & PUF Panels | 425 | 163 | 76% | 174 s |
| Izhar foster Ad group Cold store | 234 | 81 | 79% | 192 s |
| Campaign #1 (PMax leftovers) | 44 | 0 | 57% | — |

**$270 → 118 lead taps ≈ $2.28 per WhatsApp/call/form tap.** That's a healthy
number. The goal from here is more volume at this quality.

## 2. Organic search (GSC)

| Device | Clicks | Impressions | CTR | Avg pos |
|---|---|---|---|---|
| Mobile | 356 (↓ from 417) | 6,620 (↓ from 7,851) | 5.4% | 5.4 |
| Desktop | 158 (↓ from 219) | 4,787 (↓ from 5,542) | 3.3% (↓ from 4.0%) | 9.1 (↑ from 10.7) |
| **Total** | **516 (↓ 19%)** | **11,429 (↓ 15%)** | 4.5% | — |

Rankings held; demand and clicks fell. **Most of the loss is one page:**

| Page | Clicks now / before | Impressions now / before | Pos |
|---|---|---|---|
| /services/pir-sandwich-panels | **116 / 224** | 2,118 / 3,188 | 4.8 (5.0) |
| /services/prefabricated-structures | 22 / 50 | 550 / 1,096 | 9.2 |
| /blog/cold-storage-cost-pakistan-2026-buyers-guide | 60 / 80 | 1,671 / 1,788 | 4.7 |
| /tools/cost-calculator | 14 / 32 | 580 / 622 | 5.2 |
| **Winners:** /services/blast-freezers | **32 / 3** | 253 / 43 | 7.7 (13.2) |
| /blog/puf-vs-eps-vs-pir-sandwich-panels-pakistan | 29 / 10 | 782 / 415 | 5.5 |
| /blog/how-to-start-cold-storage-business-… | 19 / 4 | 560 / 155 | 4.4 |

Biggest query losers: "sandwich panel price in pakistan" 41→23 clicks
(pos 2.9→3.7), "4x8 sandwich panel price in pakistan" 11→1, "puf insulated
sheet price in pakistan" 8→0.

**Probable cause: paid is taking organic's clicks.** The "PIR & PUF Panels"
Search campaign grew 100 → 425 sessions over the same window in which organic
PIR clicks fell by 108. It bids on the same price queries where you already
rank #3–4 organically, so the ad sits on top and takes the click you'd have got
free. Suggested test: for two weeks, bid down or pause the exact-match
"sandwich panel price" keywords where organic is in the top 3, and watch
whether organic clicks come back while total leads hold.

## 3. Where leads leak (GA4, last 28d)

| Event | Mobile | Desktop |
|---|---|---|
| whatsapp_click | 162 | **17** |
| phone_click | 38 | 6 |
| form_submit (contact) | 7 | 4 |
| chat_open → chat_submit | 64 → 3 | **22 → 0** |
| cost_estimated (calculator result) | 332 | 163 |
| cost_lead | 1 | 0 |

1. **The desktop WhatsApp button didn't open WhatsApp.** The green
   WhatsApp-logo bubble opened a scripted bot: a 3-way choice, then four
   questions, the last asking for the visitor's WhatsApp number (which
   WhatsApp already sends you). **22 opens → 0 briefs.** Mobile had the same
   bot until 2 Sep (5 of 101 converted) and was switched to a direct bar;
   desktop was left on the bot.
2. **The desktop header CTA was off-screen.** "Request quote" sat 317 px
   into a row that had no room for it. It was clipped at every width up to
   1440 px, and at 1024 px it was entirely invisible. 1280 and 1366 are the
   commonest laptop widths.
3. **Mobile calculators had no WhatsApp in view.** The sticky result sheet
   hides the WhatsApp/Call bar, and the calculator's own WhatsApp button sat
   below the chart and breakdown inside the expanded sheet. The first thing
   on screen was "Open job (.json) / Save (.json)". About 85 mobile price
   calculations produced 7 WhatsApp taps.
4. **Calculator results almost never become leads** (495 estimates → 1
   `cost_lead`). Fix 3 addresses the mobile half.
5. **GA4 double-counts.** Eight events are marked as key events
   (`lead_intent`, `whatsapp_click`, `phone_click`, `cta_quote_click`,
   `form_submit`, `lead_submitted`, `email_click`, `tool_calculated`). One
   WhatsApp tap counts twice. Google Ads isn't affected: it has one primary
   action.

## 4. Shipped in this change

- **Desktop green WhatsApp button → straight to WhatsApp**, pre-filled with
  the page subject (the same message format as the mobile bar). The "Get a
  sized quote" pill still opens the optional brief, now with WhatsApp listed
  first and the phone-number question removed (3 taps instead of 4 plus
  typing). `js/chat-widget.js`
- **WhatsApp button in the mobile calculator result sheet.** It sends the
  actual estimate, e.g. "100 mm PIR · 200 m² · Lahore → Rs 2,037,000 –
  2,425,000". Tapping it doesn't expand the sheet. Works on every tool that
  uses the sheet. `js/main.v2.js`, `css/style.v2.css`
- **Header fits at 1024–1440 px.** Links are tightened, and the landline
  drops out below 1400 px, so "Request quote" is always visible.
- **Open job / Save (.json)** hidden on phones (Print PDF stays).
- **Cache-busting:** `style.v2.css?v=20260923`, plus new `?v=` on
  `main.v2.js` and `chat-widget.js` across 85 pages. `vercel.json` serves
  `main.v2.js` as immutable for a year (the `.v2.` name matches the versioned
  rule), so without the query string returning visitors would never have
  received this fix.

Verified: `verify-ads-tracking.mjs` all pass; `verify-wa-split.mjs` 38/38.
Playwright end-to-end: the desktop button opens `api.whatsapp.com` and fires
`whatsapp_click` + `lead_intent` without opening the bot; the mobile sheet
button carries the estimate text and fires both events; no overlap at 360 px
and no horizontal scroll; header CTA inside the viewport at 1024, 1101, 1180,
1280, 1366, 1440 and 1536 px.

## 5. To do in the Google UIs (can't be done from the repo)

1. **Google Ads → Campaigns:** confirm "Campaign #1" (PMax) is *removed*,
   not just paused. It still recorded 44 sessions this period.
2. **Google Ads → Settings on both Search campaigns:** make sure Search
   Partners and Display Network are **off**.
3. **Google Ads → Keywords:** run the two-week organic-cannibalisation test
   from §2 on the "sandwich panel price" exact terms.
4. **GA4 → Admin → Key events:** keep `lead_intent` and `generate_lead`, and
   un-mark the other six, so GA4 lead counts match Google Ads.
5. **Grant API access** to `326-413-6797` for the Composio OAuth user, so the
   next report can pull Ads data directly.

## 6. What to watch next 28 days

- Desktop `whatsapp_click` (baseline **17**). Expect this to move most.
- `whatsapp_click` on `/tools/*` pages, mobile (baseline ~7 on panel-price).
- Organic clicks on `/services/pir-sandwich-panels` (baseline 116).
- Cost per lead in Ads (baseline $2.28).
