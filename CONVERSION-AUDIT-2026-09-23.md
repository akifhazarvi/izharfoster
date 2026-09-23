# Izhar Foster: paid traffic, conversion and website audit

Audit date: 23 September 2026. Website: https://izharfoster.com.

The first priority is to measure received, qualified inquiries and remove friction between an estimate and a conversation. More tools, more traffic and more button clicks are not substitutes for that. A 100% click-to-customer rate is not achievable; the useful objective is more qualified pipeline per dollar, with every contact attempt accounted for.

## Evidence and limits

- **Current:** the supplied Google Ads screenshot, covering 26 Aug–22 Sep against 29 Jul–25 Aug; production browser inspection of eight pages at 390×844 and 1440×844; public production GTM container; local source inspection. All browser messaging and analytics destinations were blocked. No forms were sent, campaigns edited or budgets changed.
- **Historical:** `DAILY-TASKS.md`, including dated GSC/GA4 reviews and the 26 Aug–1 Sep Ads search-term export analysis; `GROWTH-REPORT.md`; `GSC-ANALYSIS.md`. These are saved analyses, not fresh account queries.
- **New September analysis:** `PERFORMANCE-REPORT-2026-09.md`, saved by the other agent during this audit, reports a 23 September Composio pull for 26 Aug–22 Sep against 29 Jul–25 Aug. Its aggregate GSC/GA4 numbers are incorporated below; raw exports were not independently available here. The other agent committed mobile calculator, desktop chat and header fixes as `4f83b9a`; a subsequent production hash comparison confirmed that the updated homepage and three changed shared assets are deployed.
- No direct GA4, GSC, Google Ads admin or sales-inbox connection is available in this session. Current campaign goal selection, spend by keyword, received messages, qualification rates, revenue and response times cannot be inferred from browser tags.
- Eight tested routes: `/`, `/services/cold-stores`, `/services/pir-sandwich-panels`, `/contact`, `/tools/cost-calculator`, `/tools/panel-price`, `/tools/concept-wizard`, `/tools/walkin-builder`.
- All 16 initial page/viewport checks returned HTTP 200, with no uncaught page JavaScript errors or horizontal overflow. This is functional browser coverage, not a Core Web Vitals benchmark. Lazy images initially unloaded were excluded from defect findings; the follow-up scrolled five routes and found no completed-but-broken images.
- Evidence scripts, JSON observations and screenshots: `_audit/conversion-2026-09-23/` (local, ignored research artifacts). The initial production copies of `track.js`, `chat-widget.js`, `main.v2.js` and `/contact` matched local files byte-for-byte before the other agent's edits.

## 1. What the Ads screenshot actually says

| Metric | 29 Jul–25 Aug, reconstructed | 26 Aug–22 Sep, screenshot | Change |
|---|---:|---:|---:|
| Spend | About $185 | $270 | +45.95% |
| Reported conversions, including projections | About 429.59 | 118.48 | −72.42% |
| Spend / reported conversion | About $0.43 | $2.28 | About +429%, or 5.29× |

Prior values are algebraically reconstructed from rounded screenshot percentages, not exports. Fractional conversions can reflect attribution and projections; they are not 118 individual people. The screenshot does not include clicks, impressions, CPC, conversion-action breakdown, leads or orders. Therefore it cannot establish a click conversion rate, actual qualified CPL or ROAS.

**Interpretation:** reported efficiency deteriorated substantially, but the comparison crosses a campaign/measurement regime change. Saved records describe PMax suppression in early August, its pause on 17 August, and misleading micro-event conversions still under investigation on 2 September. That makes the pre/post totals non-comparable as business outcomes. The steep visual break is a reason to align daily change history with individual conversion actions, not proof that the website suddenly stopped working.

Reconcile four series by day: spend/clicks; conversion actions; deduplicated received inquiries; qualified inquiries. Compare equivalent Search-only periods with consistent goals and allow for conversion lag. The saved account notes put Ads in Eastern time and GA4 in Pakistan time; verify those settings and align timestamps before diagnosing a particular day.

### Latest September data: what changes, and what does not

The other agent's new report supplies the following for the **same 26 Aug–22 Sep period**:

| Measure | Latest report | Audit interpretation |
|---|---:|---|
| GA4 `google / cpc` sessions | 752, versus 21,042 previously | Large acquisition-mix change after PMax stopped; not comparable cohorts |
| Paid `lead_intent` events | 117 | Close to the screenshot's 118.48, but neither count verifies message receipt; 117 is not an exact match to 118.48 |
| Paid GA4 key events | 258 | Includes overlapping event definitions; not 258 unique buyers |
| Panels campaign | 425 sessions; 76% engagement; 174 s average time | Visitors appear engaged; evaluate supplied-product fit and qualified outcomes before scaling |
| Cold-store campaign | 234 sessions; 79% engagement; 192 s average time | Similar engagement signal; no qualified CPL available |
| PMax-labelled sessions | 44; zero key events | Verify actual Ads serving/spend; this alone does not prove a paused campaign is still running |
| Organic clicks / impressions | 516 / 11,429; reported declines of 19% / 15% | Investigate both visibility and CTR, especially panels |
| WhatsApp clicks | 162 mobile, 17 desktop | Counts, not delivery or device conversion rates; device session denominators are required |
| Contact submissions | 7 mobile, 4 desktop | Eleven handoff events, not necessarily eleven received requests |
| Chat open / submit | 64 / 3 mobile; 22 / 0 desktop | Supports removing unnecessary chat steps; only 22 desktop opens is a small sample |
| `cost_estimated` / `cost_lead` | 495 / 1 | Weak observed progression; estimates can repeat or fire on defaults, so this is not a 495-person cohort |

**Important corrections to the incoming report's conclusions:**

- Its headline that the conversion decline “is not a problem” is too definitive. The old/new mix is different, but qualified lead economics remain unknown.
- “Nearly all previous conversions were bots” is not established by Cross-network volume or roughly one key event per session. The evidence establishes low-quality/over-counted engagement and a PMax timing relationship; it does not identify automated users.
- “The 118 conversions are real” should read **approximately 118 attributed intent actions**. The browser reproduction demonstrates premature and duplicate `lead_intent` emissions. The $2.28 figure is cost per reported action; calling it healthy requires sales outcomes.
- “Paid is taking organic's clicks” is a plausible hypothesis, not a proven cause. Panel-page clicks fell 224→116, impressions 3,188→2,118 and CTR about 7.03%→5.48%, while average position stayed near 5. At the old CTR, the impression decline alone accounts arithmetically for about 75 of the 108 missing clicks; the remaining 33 come from lower CTR. That decomposition is not causal, but it shows why an ad-cannibalization-only explanation is incomplete.
- Neither organic position nor aggregated GSC impressions proves market demand changed. Query mix, SERP layout, competitors, geography and visibility may contribute. Examine query×page×device before deciding.
- Do not remove PMax merely because 44 sessions retain that campaign label. Verify impressions, clicks, cost and status in Ads; retaining a pause can preserve history and control.
- Keeping only `lead_intent` and `generate_lead` as key events would simplify reporting, but still leave unverified handoffs as the outcome. `generate_lead` currently goes to dataLayer for Ads, not through the site's normal GA4 event sender; selecting it in GA4 is not itself an implementation.
- Public GTM does not expose the account's complete Primary/Secondary settings. The report's claim that Ads is unaffected by overlap cannot be independently certified here. Even one Primary action can fire on the wrong behavior.

The strongest new organic opportunities are `/services/blast-freezers` (3→32 clicks, 43→253 impressions, position 13.2→7.7), the PIR/PUF/EPS comparison article (10→29 clicks) and the cold-storage business guide (4→19 clicks). Add relevant project proof and contextual contact offers on these existing winners before commissioning more articles. Treat a blast-freezer paid pilot as an option after core tracking is repaired, not a reason to fragment the current small budget immediately.

### Other agent's completed work

Commit `4f83b9a` changes the desktop WhatsApp bubble to a direct WhatsApp action, removes the optional brief's phone-entry step, adds a context-bearing WhatsApp action to mobile calculator sheets, tightens the desktop header, hides JSON job controls on phones and versions assets to avoid stale cache. The other report records passing tracking/routing suites and viewport checks. These are its implementation/test results, not changes made by this audit.

The initial screenshots in this audit predate that commit. A final production check confirmed byte-for-byte matches for the current `index.html`, versioned `main.v2.js`, `chat-widget.js` and `style.v2.css`. The mobile sheet CTA, desktop bubble and header findings are therefore **implemented and deployed**, not new development assignments. Functional verification is reported by the other agent; this audit independently checked deployment. Removing new phone collection helps; retain a general analytics allowlist because old session state is still loaded and the generic tracker accepts arbitrary properties. Evidence: `_audit/conversion-2026-09-23/deployment-check.json`.

## 2. Conversion measurement: highest priority

### P0 — A “lead” currently means several different things

Production `contact.html` pushes `generate_lead` in `buildEnquiry()` **before** `handoff()` opens WhatsApp or a `mailto:` URL. There is no durable website lead submission in this path. A visitor still has to complete the external send. `form_submit` and `lead_submitted` are additional event names for the handoff, not independent delivered inquiries.

The chat and concept wizard also record completion before message delivery. A successful popup cannot prove receipt; a `tel:` click cannot prove a connected call. Changing the name or marking those events as key events will not fix the underlying definition.

**Action:** introduce a small server-backed callback/quote endpoint. Save the request with an opaque `lead_id`, product, city, contact preference, optional estimate/spec and attribution. Show success only after storage succeeds; notify an assigned sales owner and retain retryable delivery status. Keep WhatsApp as a convenient additional route. Direct WhatsApp leads require inbound-message confirmation through an approved integration or a sales log; do not automatically equate website taps with messages.

### P0 — The published Google Ads tag listens to intent

The public GTM container, version 6 at inspection, contains one Ads conversion tag for `AW-18369062794` with trigger regex `^(lead_intent|generate_lead)$`, USD values of 30/35/20 for WhatsApp/phone/email and default 45. Those are configured proxy values, **not revenue**. Enhanced-conversions checkbox is false in that tag. There is a Conversion Linker. No GA4 event tag was present in this container snapshot, so the dual dataLayer/gtag path alone does not prove duplicate GA4 collection.

The container proves how the direct Ads action can fire. It does **not** expose whether the action is currently Primary, which GA4 imports are active or which campaign/custom goals use it.

`js/tools/cost-calculator.js` adds an additional problem: clicking `#cta-quote`, which just opens a contact page, emits `lead_intent` with `channel=quote_form` and `cost_lead`. The current direct Ads trigger matches it before a visitor provides any details. The calculator's WhatsApp listener also emits its own `lead_intent` outside the shared two-second deduplication helper, while the global WhatsApp listener emits another. Verify actual Ads deduplication separately; two event emissions do not by themselves prove two recorded Ads conversions.

**Browser reproduction:** after opening the cost calculator's completed estimate step, a single quote click emitted `cta_quote_click`, `tool_quote_whatsapp` (misnamed for this non-WhatsApp link), `lead_intent:quote_form` and `cost_lead:quote_form`. One WhatsApp click emitted `whatsapp_click`, **two** `lead_intent:whatsapp` events and `cost_lead:whatsapp`. Messaging, navigation and analytics requests were blocked throughout. Evidence: `_audit/conversion-2026-09-23/event-checks.json`.

**Action:** remove lead/conversion semantics from quote-navigation and calculation events; use one intent emitter for a WhatsApp tap. Preserve them as diagnostic engagement events. Audit account defaults, campaign-specific goals, GA4 imports and custom goals together. Google explicitly notes that a Secondary action included in a custom goal can still be used for bidding. [Google: primary and secondary actions](https://support.google.com/google-ads/answer/11461796?hl=en).

Recommended measurement contract:

| Action | Definition | Bidding role |
|---|---|---|
| `quote_cta_clicked`, `estimate_viewed`, WhatsApp/phone/email tap | A UI interaction; deduplicate where appropriate | Secondary / diagnostic |
| `lead_received` | Durable accepted request, confirmed inbound message or logged connected inquiry | Interim Primary only after reliability and quality checks |
| `qualified_lead` | Reachable buyer, supplied product/service fit, serviceable location and credible project requirement | Preferred Primary when reliably imported with adequate volume |
| `quote_issued`, `won_project` | Sales-verified milestones linked to the same lead | Pipeline reporting; later value optimization after validation |

Do not make every funnel stage Primary and count one buyer several times as success. Use “One” where appropriate for lead actions and an idempotent lead/conversion identifier. Qualified leads and closed projects are different stages. Optimize on evidence and sufficient volume, not an arbitrary “week 4” switch or a promise that a fixed number of leads guarantees good bidding.

### P0 — Offline attribution is not complete

`track.js` stores the full click ID only in the visitor's `localStorage`; WhatsApp receives `IF-` plus its last 12 characters. The repository runbook assumes the full ID can later be recovered, but the reviewed website has no durable lookup joining that short reference to the full identifier. A shortened ref alone is not an importable GCLID, and a sales rep cannot retrieve another visitor's browser storage.

**Action:** store `lead_id → full click ID/type → campaign/landing page → sales outcome` server-side, under the applicable consent settings. Use an opaque reference in messages, not a truncated attribution ID as the only join key. Include full identifiers only in the protected attribution record. Different supported identifiers have different handling rules; do not label all of them GCLIDs. Verify the current upload route and window for the chosen method. Google's current guidance describes Data Manager API migration, so the August API/runbook assumptions need checking. [Google: offline conversion imports](https://support.google.com/google-ads/answer/2998031?hl=en).

### P0 — Analytics data hygiene

At the initial production snapshot, chat collected a phone number in `state.answers`, then passed that entire object to `track('chat_submit', state.answers)`. `IzharTrack.track()` forwards properties to ordinary GA4 events without a field allowlist. This was a code-confirmed raw phone path, although no real person's data was sent during this audit. The other agent removed new chat phone collection in deployed commit `4f83b9a`; retain the allowlist and persisted-state regression checks as defense against recurrence.

**Action:** explicitly allow only non-personal fields in ordinary analytics events; never pass a whole contact/state object. Keep contact details in the lead store and any intentionally configured, consented enhanced-conversion flow. Check email links and free-text summaries too. Add a regression test for actual chat completion and persisted old chat state, since existing contact-form coverage is insufficient. [Google: avoiding PII in Analytics](https://support.google.com/analytics/answer/6366371?hl=en).

## 3. Website and mobile conversion audit

The table records the initial production findings and recommendations. The mobile calculator action has since been implemented and deployed by the other agent as described above; remaining items are recommendations, not changes shipped by this audit.

| Priority | Finding and evidence | Recommendation | Verification |
|---|---|---|---|
| P1 | Mobile contact form begins around y=2,224 px; first name field at y=2,249 on a 390×844 viewport. The hero, channel list and location content come first. | Put the three-field form directly below a short offer; move office addresses/map lower. Point contact-page quote buttons to the form anchor instead of reloading `/contact`. | A quote click reaches a usable field in the first screen; focus, back navigation and keyboard work. |
| P1 | “Get a quote” in the homepage header goes to the five-step wizard; service headers go to `/contact`; calculator quote links may carry a summary. | Give each action an explicit promise: “Request a callback”, “Send specs on WhatsApp”, “Estimate project cost”. Use a consistent fast contact route and preserve optional tools. | Compare received leads per paid session by route, not CTA taps. |
| P1 | Contact button says “Send” but opens an external app; the explanation is below the button in small text. The wizard's “Email form” link reaches the same WhatsApp-first page. | Until a real endpoint exists, label actions “Continue in WhatsApp” / “Open email draft”. With durable capture, use “Request my callback” and an honest receipt state. | No success claim before receipt; app-not-installed and no-mail-client paths remain usable. |
| P1, now deployed | Panel calculator's collapsed mobile result showed a default total but no direct contact action. Expanded results required scrolling past the price visualization and breakdown to reach quote/email. | Keep a context-rich WhatsApp/quote action next to the visible price; preserve selected dimensions, quantity and city. Implemented and deployed in the other agent's commit `4f83b9a`. | Monitor received/qualified inquiries from tool sessions; the other agent reports narrow-screen functional checks. |
| P1 | Cost calculator computes and fires `cost_estimated` on default values before the visitor meaningfully interacts. | Separate automatic render, user-edited estimate and estimate actually viewed. Treat only the latter two as useful engagement. Keep all Secondary. | One visit with zero interaction must not count as a completed buyer brief. |
| P1 | Mobile generic WhatsApp bar copies a truncated page H1, not the calculator configuration; generic quote link lacks the calculation summary. | On tools, build every contact CTA from the same current spec; service pages should ask for product/city/capacity in plain language. | Sales receives the exact configuration without asking the buyer to repeat it. |
| P1 | Cold-store hero is five lines on mobile, preceded by generous breadcrumb/temperature decoration. Panel hero leads with a concrete insulation comparison rather than the price/spec request. | Shorten headings and move proof plus a clear next step upward. Retain engineering detail below. | Review first screen at 360, 390 and 430 px; compare matched-intent lead rate. |
| P1 | Panel-price page offers PIR, PUF and EPS estimates while the product page positions the manufacturer around PIR. Availability of non-PIR supply is not established by the calculator. | Clearly distinguish supplied products from comparison benchmarks. Use a PIR-vs-other-material comparison offer only for commercially relevant buyers. | Sales approves supply scope and incoming leads match it. |
| P1 | Public panel price table is labelled Q2 2026; cost data says last updated May 1 and includes a pre-launch instruction to replace benchmarks with current pricing; ROI data says May 14. | Obtain sales-approved current ranges with dates, assumptions and exclusions. Align calculators and page tables. | Compare several real quotes with the published band, including freight, installation and tax. |
| P1 | PIR/certification copy calls the fire classification “B1 (ASTM E84)”. | Verify the actual certificate and separate the test standard from its result. Publish the test report number, lab, tested assembly/thickness and exact classification. Do not invent a replacement rating. | Technical owner signs off both visible copy and schema. |
| P2 | Dense architecture, refrigerant and thermal terminology precedes some buyer-level answers. | Lead with what is supplied, who it is for, budget basis, delivery scope and the next step; offer technical tabs/details for specifiers. | Buyers can answer “is this for my project?” without knowing kW or refrigerant classes. |
| P2 | “24 hours”, “same-day reply” and “one working day” appear across offers. | Publish one achievable service commitment and a staffed-hours fallback. Separate acknowledgment from an engineered quote. | Compare promise with actual first-response timestamps. |
| P2 | Existing case studies and client proof are strong assets but buyers must often browse to find a relevant project. | Put one matching sector/city/scale case beside the CTA, with factual scope and a photo. Add warranty/commissioning/service scope only after sales confirms it. | Measure quote acceptance as well as initial leads. |

ASTM E84 reports flame-spread and smoke-developed indices; the site's B1 wording needs certificate-level reconciliation, not cosmetic rewriting. [ASTM E84](https://store.astm.org/e0084-22.html). DIN's published materials identify the separate DIN 4102-B1 classification. [DIN reference](https://www.dinmedia.de/resource/blob/91442/7963203d596f90285deb797176bf3b4b/technische-baubestimmungen-inhalt-data.pdf).

**Already working:** mobile WhatsApp/Call/Get-quote bar on standard pages; two required contact fields with extra mobile details collapsed; above-fold cost/WhatsApp CTAs on the cold-store service page; existing estimates and case studies; local tests showed no general overflow. Do not rebuild these from scratch. A cost-calculator CTA hidden while its result step is inactive is expected, not evidence of a missing button; test the completed result state.

## 4. What the saved GA4 and GSC records suggest

The older `GSC-ANALYSIS.md` is an April legacy-site sample, not a September baseline. Its “new pages not indexed” diagnosis should not be repeated as a current issue. Likewise older low-engagement traffic was sometimes labelled bots without independent verification; country or low engagement alone is not sufficient evidence to filter or exclude buyers.

The 2 September note for **18 Aug–1 Sep** recorded 607 mobile sessions and these event-count ratios:

| Route | Starts/opens | Completion events | Ratio |
|---|---:|---:|---:|
| Chat | 101 | 5 | 5.0% |
| Contact form | 54 | 3 | 5.6% |
| Concept wizard | 21 | 1 | 4.8% |
| Calculator route in the saved note | 186 | 3 | 1.6% |

These are historical event ratios, not deduplicated cohort conversion rates or verified received leads. They motivated fixes shipped on 2 September; use new post-fix data to judge the remaining gap. The same notes show mobile with lower bounce than desktop, so “mobile traffic is bad” is not supported.

Saved August GSC findings provide hypotheses to revisit:

- Panels generated 228 organic clicks versus 10 for the cold-store page in the referenced 28-day review. Separate product economics; panels' cheap volume should not consume all cold-store acquisition spend.
- `cold store manufacturers in pakistan` had declined to position 18.6 from a prior 4.7; the business-cost query was also weaker. Check current query×page results before another rewrite. Strengthen the commercial cold-store page and relevant case links if the decline persists.
- Pharma was at 424 impressions, position 7.1 and 2.36% CTR in that saved review. This is a promising sector experiment, not proof that a new campaign will convert. Establish sales fit and current impressions before allocating budget.
- The older organic plateau showed clicks +2.9%, impressions −8.1%, CTR improving. That calls for examining query mix and visibility, not applying the April “CTR is the only lever” diagnosis indefinitely.

GSC measures organic search visibility and clicks. It cannot explain paid campaign conversions or be joined to individual WhatsApp buyers. Use GA4 for session/landing/device funnels and Ads for paid spend; use the lead ledger for business outcomes.

## 5. Paid acquisition leaks and actions

The saved 26 Aug–1 Sep search-terms analysis reports $59.85 spend, $24.87 in itemized terms and $34.98 (58.4%) in “other search terms”. It identified $9.65 of itemized spend as irrelevant: **38.8% of visible term spend, or 16.1% of all spend**. That is a historical opportunity estimate, not a claim that the same percentage of September's $270 can be recovered. The hidden terms cannot automatically be labelled waste.

1. **Audit what actually ran.** Export campaign/day/network/device/geography, matched keyword, search term, final landing URL and conversion action. Confirm PMax remains paused, match types, auto-applied recommendations, AI Max/URL expansion and negative-list attachment. Saved notes report manually added broad keywords; do not blame automatic recommendations without change-history evidence.
2. **Tighten commercial intent.** Start with controlled exact/phrase terms for real supplied products. Review close variants too. Apply the existing negative lists only after checking current offerings: domestic fridges, display cabinets, repairs, jobs, rental-storage searches and unrelated brands are different intentions. Do not globally exclude a whole crop/sector just because some searches seek rentals.
3. **Check geography and networks.** For a Pakistan installation campaign, test Presence targeting and keep overseas investors/export expansion separate if commercially desired. Google normally also offers “presence or interest”; inspect the actual setting rather than assuming geographic spend is all local. [Google location options](https://support.google.com/google-ads/answer/1722038?hl=en).
4. **Keep two product budgets, few experiments.** At the screenshot's spend, approximately $9.64/day, five new campaigns or many concurrent A/B tests would fragment evidence. Prioritize one cold-store offer and one panels offer, using separate ad groups where appropriate. Run one major conversion experiment at a time.
5. **Do not scale on $2.28 CPA.** Until qualified outcomes are reliable, keep spending controlled and assess paid search terms against received inquiries. If campaigns use click-based bidding, bad conversion tags still corrupt reporting but are not necessarily controlling bids; confirm the bidding strategy before attributing causation.
6. **Test organic substitution instead of assuming it.** Strong organic rankings do not prove every brand/panel paid click is incremental or redundant. Review the paid/organic overlap and run a controlled holdout where practical; judge combined qualified inquiries, not paid clicks alone.
7. **Protect budget with business economics.** Set a maximum qualified CPL from expected gross profit per won project × observed qualified-lead close rate × the acceptable acquisition share. Set a review threshold before testing. Avoid arbitrary “pause every keyword after N clicks” rules on sparse, long-cycle industrial demand.

## 6. Distinctive conversion experiments

| Order | Offer | Concrete implementation | Primary success measure |
|---|---|---|---|
| 1 | **Send a photo or voice note; let an engineer do the form** | Landing CTA opens a short product/city prompt and offers a site photo, drawing or Urdu voice note through WhatsApp. Persist a callback request separately for buyers who prefer a call. Never force technical dimensions before first contact. | Qualified received inquiries per paid session; spec completeness and sales time as guardrails |
| 2 | **Your project on one page** | Turn the existing estimate into a shareable brief: buyer-selected product/capacity/city, price band, assumptions, exclusions, matching completed project and a named sales owner after assignment. Include the same brief ID in callbacks and quotes. | Brief → engineering discussion → quote rate |
| 3 | **Compare two quotes on equal scope** | Offer a scope check covering panels, floor, doors, refrigeration, backup, civil works, commissioning and service. Ask buyers to redact competitor/customer-sensitive details. Explain missing scope without unsupported competitor claims. | Qualified opportunities and accepted quotes |
| 4 | **Contractor's panel order check** | Accept a drawing/BOQ and return panel area, cut lengths, thickness options and delivery basis; reuse the panel calculator behind the scenes. Start with a manual engineer-assisted pilot rather than another large tool. | Quote requests with usable quantities; quote win rate |
| 5 | **Choose your next step** | After price is visible, offer “Need a budget”, “Ready for a site discussion”, “Already have a drawing”. Route to different short briefs and follow-up plans without hiding the estimate. | Progression to a qualified next step by intent |
| 6 | **Proof from a comparable project** | Offer a short engineering walkthrough or reference visit where the customer has authorized it. Match industry, capacity and location; keep access gated by real customer permission, not a fabricated testimonial. | Site-discussion → quote acceptance |

These are test hypotheses, not promised percentage uplifts. The first two reuse existing strengths while reducing effort. Avoid another mandatory wizard, fake scarcity, blanket discounting or promising an instant engineered quotation that the sales team cannot deliver.

Suggested cold-store landing copy, subject to sales approval:

> **Cold storage built for your product, capacity and city.**
> Tell us what you store and where. We’ll help establish the capacity, budget range and next engineering step.
> **Request an engineer callback** · **Send specs on WhatsApp**
> Have a photo, drawing or voice note? Start with that.

Suggested panel offer:

> **PIR sandwich panel pricing for your thickness, quantity and delivery city.**
> See an indicative rate, then ask us to check your specification and delivery scope.
> **Check my panel requirement** · **View price estimate**

Use a staffed response-time promise only once the team can consistently meet it.

## 7. Sales operations: the part the website cannot close by itself

- Maintain one lead ledger for both WhatsApp lines, calls and website requests. Deduplicate people/projects across channels; preserve separate legitimate projects.
- Record arrival, first human response, assigned owner, product, city, estimated project size/timeline, qualification reason, quote value and outcome. Record why a lead is disqualified: rental, residential appliance, outside supply scope, unreachable, no project, duplicate, etc.
- Two-line random assignment currently balances visits, not workload or selling performance. First compare response/qualification by `wa_line`; only then consider availability-based routing with reassignment for unanswered inquiries.
- Propose a staffed-hours first-response target, for example 10 minutes, as an internal experiment rather than a current promise. Outside hours, acknowledge and state the next real response window. Missed-call recovery and agreed follow-ups should have owners.
- Evaluate quote turnaround and quote acceptance. Low lead volume may be a traffic issue; high received-lead volume with poor qualification is an intent issue; good qualified volume with few wins needs offer/sales review.

## 8. Delivery order and decision gates

| Timing | Work | Owner | Done means |
|---|---|---|---|
| Days 1–2 | Reconcile screenshot actions with current Ads goals, GA4 definitions and sales log; demote interaction-only goals | Ads + analytics owner | One written conversion definition and an action-by-action account map |
| Days 1–2 | Remove calculator duplicate/quote-navigation lead emissions; fix chat PII handling; verify the other agent's mobile CTA work | Developer | One intended event per action; no contact data in ordinary analytics; tested mobile result CTA |
| Days 2–5 | Add durable callback capture and attribution lookup; move mobile form up; preserve calculator spec | Developer + sales | A request is saved, assigned, acknowledged and recoverable without WhatsApp completion |
| Week 1 | Attach/review negatives and controlled match types using current terms; confirm geography and campaign goals | Ads owner | Irrelevant intent is excluded without blocking valid project buyers |
| Week 1–2 | Approve current price bands, certificate wording and response promises | Sales + engineering | Pages, tools, PDFs and ads agree |
| Week 2 | Pilot photo/voice-note offer on one product landing path | Sales + growth | Received and qualified lead rates tracked against a comparable control/baseline |
| Weeks 3–4 | Import qualified outcomes and review matched cohorts; adjust budget only from reliable evidence | Ads + sales | Spend → lead → qualified → quote → won is traceable, with lag accounted for |

Scorecard: paid landing sessions; intent taps; received unique leads; qualified leads; first-response time; quotes; wins; spend/received lead; spend/qualified lead; pipeline/gross profit as it matures. Report product, device, landing page and campaign separately where volumes support it. Funnel rates must use aligned cohorts and deduplicated users/leads, not the sum of all named events.

No numerical uplift forecast is defensible until the September analysis is reconciled with received leads. The highest-confidence opportunities are the measurement corrections, the delivery gap, mobile handoff clarity and current search-intent cleanup.
