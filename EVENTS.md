# Izhar Foster — Event Catalogue

**Last updated:** 2026-05-14
**Source of truth:** this file. If an event is fired but not documented here, it's a bug.
**Destinations:** every event fires to **GA4** (`G-PLY0DZWNEM`) + **Vercel Analytics** + `dataLayer` (GTM-ready) — see `js/track.js` for the unified `track()` function.

## How the tracking works

Every event flows through `window.IzharTrack.track(eventName, props)` in [js/track.js](js/track.js). It:

1. Enriches the payload with `page`, `page_type`, `ts`, plus session attribution (`izhar_source`, `izhar_medium`, `izhar_campaign`).
2. Pushes to **Vercel Analytics** via `window.va('event', ...)`.
3. Pushes to **`dataLayer`** for any future GTM integration.
4. Fires to **GA4** via `gtag('event', ...)`.
5. Logs to console if URL has `?debug_track=1` (smoke-test mode).

**Tool-specific JS** (`chat-widget.js`, `concept-wizard.js`, `roi-payback.js`) routes through `IzharTrack.track()` so they inherit attribution. If `IzharTrack` isn't loaded yet (race condition), they fall back to raw `gtag('event')`.

**Each event payload includes:**
- `page` — `location.pathname`
- `page_type` — `home` / `service` / `tool` / `blog` / `projects` / `clients` / `about` / `contact` / `faqs` / `tools-index` / `other`
- `ts` — `Date.now()`
- `izhar_source` / `izhar_medium` / `izhar_campaign` — session attribution (see `detectSource()` in track.js)
- `source_tool` — populated by the tool-specific trackers (`chat_widget`, `concept_wizard`, `roi_calculator`)

Plus event-specific params listed below.

## Quick reference — the lead funnel

| Stage | Primary event | Source | Goal % |
|---|---|---|---|
| **Acquisition** | `session_start` | track.js | — |
| **Engagement** | `engaged_session` (30s OR 50% scroll) | track.js | ≥35% of sessions |
| **Top-of-funnel intent** | `cta_quote_click` / `cta_wizard_click` / `cta_roi_click` | track.js (auto) | ≥8% of engaged |
| **Tool engagement** | `chat_open` / `wizard_start` / `roi_open` | per-tool | ≥30% of CTA clicks |
| **Mid-funnel** | `chat_step` / `wizard_step` / `roi_result_view` | per-tool | ≥60% completion |
| **Lead submitted** | `chat_submit` / `wizard_submit` / `form_submit` | per-tool | ≥40% of starters |
| **Lead intent (any channel)** | `lead_intent` (whatsapp/phone/email) | track.js (auto) | tied to above |
| **Lead delivered** | `whatsapp_click` (with `lead_submitted` mirror) | track.js (auto) | = lead count |

If completion <25% on any stage, that's the next iteration target.

---

## Full event catalogue

### 1. Session + attribution

| Event | Trigger | Params | Owner |
|---|---|---|---|
| `session_start` | First page of session — fires once via `sessionStorage` guard | `izhar_source`, `izhar_medium`, `izhar_campaign`, `referrer_host`, `first_landing`, `redirect_count`, `via_legacy_redirect` | track.js |

**`izhar_source` values:** `google_organic`, `bing_organic`, `duckduckgo_organic`, `yandex_organic`, `yahoo_organic`, `ai_chatgpt`, `ai_perplexity`, `ai_claude`, `ai_copilot`, `ai_gemini`, `ai_you`, `ai_phind`, `ai_kagi`, `social_facebook`, `social_instagram`, `social_whatsapp`, `social_linkedin`, `social_twitter`, `social_youtube`, `social_tiktok`, `utm:<source>`, `referral:<host>`, `direct`, `direct_via_legacy_redirect`.

### 2. Engagement signals

| Event | Trigger | Params | Owner |
|---|---|---|---|
| `engaged_session` | First of: 30s on page OR 50% scroll | `reason: '30s' \| 'scroll-50'` | track.js |
| `scroll_depth` | Scroll passes 25 / 50 / 75 / 95% (each fires once) | `depth: 25 \| 50 \| 75 \| 95` | track.js |
| `time_on_page` | Tab visible at 60s / 120s / 300s | `seconds: 60 \| 120 \| 300` | track.js |
| `case_study_read` | 75% scroll on `/projects/<slug>` (not the index) | `slug`, `depth: '75'` | track.js |
| `page_exit` | `pagehide` event (bounce or close tab) | `depth_pct`, `dwell_ms` | track.js |

### 3. Lead-intent links (auto-tracked site-wide)

Delegated click handler — fires for every WhatsApp / phone / email link, anywhere on any page. The `location` param identifies where on the page the click happened.

| Event | Trigger | Params | Owner |
|---|---|---|---|
| `whatsapp_click` | Click on any `wa.me` / `whatsapp.com` link | `href`, `label`, `location` | track.js |
| `phone_click` | Click on any `tel:` link | `href`, `label`, `location` | track.js |
| `email_click` | Click on any `mailto:` link | `href`, `label`, `location` | track.js |
| `lead_intent` | Fires alongside each of the above | `channel: 'whatsapp'\|'phone'\|'email'`, `location` | track.js |
| `external_link_click` | Click on any external `https://` link (not WhatsApp) | `host`, `href`, `label` | track.js |

**`location` values:** `header`, `footer`, `form`, `fab` (old WhatsApp pill), `live-chat-fab` (new chat widget), `body`, `[data-track-section]` value if set.

### 4. CTA click intent

Top-of-funnel — recognises clicks heading to a conversion artefact even before the artefact opens.

| Event | Trigger | Params | Owner |
|---|---|---|---|
| `cta_quote_click` | Click on link to `/contact` or label matching "quote/contact/get in touch/talk to/consult" | `href`, `label`, `location`, `destination: 'contact'\|'wizard'\|'roi'` | track.js |
| `cta_wizard_click` | Click on `/tools/concept-wizard` link or "wizard / 5-question / sized concept" label | `href`, `label`, `location` | track.js |
| `cta_roi_click` | Click on `/tools/roi-payback` link or "roi / payback / money calculator / spoilage" label | `href`, `label`, `location` | track.js |

### 5. Chat widget

The persistent bottom-right chat FAB on every page (except `/tools/concept-wizard` and `/tools/roi-payback`).

| Event | Trigger | Params | Owner |
|---|---|---|---|
| `chat_open` | User opens the chat panel | `from: location.pathname`, `source_tool: 'chat_widget'` | chat-widget.js |
| `chat_step` | User makes a choice on each step | `step: 'sector'\|'capacity'\|'city'\|'phone'\|'wa_direct'\|'to_wizard'`, plus the answer from previous step | chat-widget.js |
| `chat_submit` | User submits phone (the lead) | all 4 answers: `sector`, `sectorLabel`, `capacity`, `capacityLabel`, `city`, `phone` | chat-widget.js |
| `chat_dismiss` | User closes the panel (X or Esc) | `step: 'choice'\|'sector'\|...\|'done'` | chat-widget.js |

### 6. Concept wizard (`/tools/concept-wizard`)

5-question lead-capture wizard.

| Event | Trigger | Params | Owner |
|---|---|---|---|
| `wizard_start` | First time the wizard renders in a session (sessionStorage-guarded) | `entry: location.search \|\| '(direct)'` | concept-wizard.js |
| `wizard_step` | User clicks Next on a step | `step: 1\|2\|3\|4\|5`, `sector` (from step 1 onwards) | concept-wizard.js |
| `wizard_submit` | User submits the form (lead) | `sector`, `capacity_tier`, `country`, `timeline` | concept-wizard.js |
| `wizard_abandon` | `pagehide` while wizard step > 1 and step ≠ 'done' | `step` | concept-wizard.js |

### 7. ROI calculator (`/tools/roi-payback`)

Tool 10 — Cold Store Money Calculator.

| Event | Trigger | Params | Owner |
|---|---|---|---|
| `roi_open` | Tool loads + first render complete | `commodity`, `city`, `currency`, `from_url_param: bool` | roi-payback.js |
| `roi_commodity_change` | User changes commodity dropdown | `commodity` | roi-payback.js |
| `roi_city_change` | User changes city dropdown | `city`, `currency_auto_switched`, `new_currency` | roi-payback.js |
| `roi_currency_change` | User clicks a currency tab | `from`, `to`, `user_override: true` | roi-payback.js |
| `roi_throughput_change` | Debounced 700ms after user stops typing throughput | `value`, `unit: 'tonnes'\|'m3'` | roi-payback.js |
| `roi_result_view` | First time a finite payback is rendered (highest-intent moment short of WhatsApp) | `commodity`, `city`, `currency`, `payback_months`, `capex_pkr_mid`, `loss_monthly_pkr` | roi-payback.js |
| `roi_whatsapp_click` | User clicks "WhatsApp this result" CTA | `commodity`, `city`, `currency`, `payback_months`, `capex_pkr_mid`, `loss_monthly_pkr`, `lead_intent: 'whatsapp_roi_handoff'` | roi-payback.js |

Also fires the **standard** events from track.js: `tool_open` (immediate), `cta_quote_click` (when relevant), `whatsapp_click` + `lead_intent` (from the global click handler on the WhatsApp CTA).

### 8. Other engineering tools (`/tools/<n>`)

The 9 engineering calculators inherit auto-tracking from track.js:

| Event | Trigger | Params | Owner |
|---|---|---|---|
| `tool_open` | Page load on any `/tools/*` URL | `tool: <toolId>` | track.js |
| `tool_calculated` | First time a result number appears in `.calc-result` (MutationObserver) | `tool` | track.js |
| `tool_save_json` | Click `#job-save` | `tool` | track.js |
| `tool_open_json` | Click `#job-open` | `tool` | track.js |
| `tool_print_pdf` | Click `#job-print` | `tool` | track.js |
| `tool_email_quote` | Click `#cta-email` | `tool` | track.js |
| `tool_quote_whatsapp` | Click `#cta-quote` | `tool` | track.js |
| `tool_attach_to_project` | Click `#proj-sess-attach` | `tool` | track.js |

### 8.1 Cost calculator (Tool 8 — `/tools/cost-calculator`)

Pre-existing tool with bespoke events on top of the generic `tool_*` set above:

| Event | Trigger | Params | Owner |
|---|---|---|---|
| `cost_estimated` | First cost band rendered (impression-marker for the result) | tool-specific cost payload | cost-calculator.js |
| `cost_lead` | User submits the cost-quote handoff | tool-specific lead payload | cost-calculator.js |

### 9. Contact form (`/contact`)

| Event | Trigger | Params | Owner |
|---|---|---|---|
| `form_start` | First field focus on `#quote-form` | `form: 'quote'` | track.js |
| `form_submit` | Successful submit (validation passed) | `form: 'quote'`, `industry`, `product`, `location` | track.js |
| `form_submit_invalid` | Submit attempted but validation failed | `form: 'quote'` | track.js |
| `lead_submitted` | Mirrors `form_submit` — unified lead signal | `channel: 'whatsapp_form'`, plus form data | track.js |

---

## Debugging

**Live debug mode:** append `?debug_track=1` to any URL. Every event logs to console with `[track]` prefix.

**Spot-check in DevTools:**
- Network tab → filter `collect` → you'll see GA4 measurement protocol calls.
- Network tab → filter `vercel/analytics` → Vercel Analytics calls.
- Console → `window.IzharTrack.track('test', { foo: 'bar' })` fires a manual event.

**Common bugs to watch for:**
- Double-firing: events that hook the same UI element from two paths. Search `track.js` and per-tool JS for the same event name — if both fire, that's a duplicate.
- Race condition on `IzharTrack`: tool-specific JS may load before track.js. The fallback to raw `gtag('event')` covers this, but the event will lack attribution enrichment. To verify, check console for events with no `izhar_source` in `?debug_track=1` mode.
- Form events: only fire on `#quote-form` (contact page). Other forms aren't tracked.

---

## GA4 dashboard recommendations

In GA4 admin, mark these as **conversion events** (lead-quality endpoints):

1. `wizard_submit`
2. `chat_submit`
3. `form_submit`
4. `lead_submitted`
5. `roi_whatsapp_click`
6. `whatsapp_click` (with `location != 'fab'` to filter out the always-on FAB — high volume, low quality on its own)

**Custom audiences worth building:**

- **High-intent visitors**: any of `roi_result_view`, `wizard_step ≥ 3`, `chat_step ≥ 3`. Retarget these in Google Ads.
- **Dropped wizard**: `wizard_start` AND NOT `wizard_submit` within 24 h. Email or WhatsApp follow-up.
- **AI-search arrivals**: `izhar_source IN ('ai_chatgpt', 'ai_perplexity', 'ai_claude', 'ai_copilot', 'ai_gemini')`. Watch CTR + engagement vs Google organic.
- **KSA visitors**: `country = 'SA'` OR `roi_currency_change.to = 'SAR'`. Funnel quality benchmark for the KSA expansion.

**Funnels worth building:**

1. Session → engaged_session → cta_*_click → wizard/chat/roi open → step ≥ 3 → submit → whatsapp_click. Watch drop-off at each stage; the leakiest is the next iteration target.
2. tool_open → tool_calculated → cta_quote_click / whatsapp_click. Validates the engineering tools are converting.

---

## Owners

| File | Events owned | Test page |
|---|---|---|
| [js/track.js](js/track.js) | All session, engagement, lead-intent, CTA, tool, form events | any page with `?debug_track=1` |
| [js/chat-widget.js](js/chat-widget.js) | `chat_open` / `chat_step` / `chat_submit` / `chat_dismiss` | any page (except wizard + ROI) |
| [js/tools/concept-wizard.js](js/tools/concept-wizard.js) | `wizard_start` / `wizard_step` / `wizard_submit` / `wizard_abandon` | `/tools/concept-wizard` |
| [js/tools/roi-payback.js](js/tools/roi-payback.js) | All `roi_*` events | `/tools/roi-payback` |

When adding a new event, update this file in the same commit. If a future commit fires an event not documented here, that's a code-review blocker.
