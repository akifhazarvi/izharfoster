# Google Ads + GTM Tracking — Setup Guide (Phase A)

Companion doc: **[ADS-PLAN.md](ADS-PLAN.md)** (Phase B — campaigns, keywords, copy, budget).
Event taxonomy reference: **[EVENTS.md](EVENTS.md)**.

Do Phase A **completely** before spending a rupee on Phase B. Ads without working
conversion tracking is just buying traffic — Smart Bidding has nothing to optimise
toward and you cannot tell a good campaign from a bad one.

---

## 0. What is already done in code (shipped, no action needed)

| Shipped | Where | What it does |
|---|---|---|
| GTM container `GTM-WBNZLVC7` | all 77 pages: loader in `<head>`, `<noscript>` after `<body>` | Live. Loads before `gtag.js`, after the consent defaults |
| Consent Mode v2 defaults | all 77 pages, before every Google tag | EEA/UK/CH denied, all other regions (incl. PK) granted |
| `charset` hoisted to first-in-head | all 77 pages | Was ~450 bytes deep behind the gtag snippet; adding tags above it would have pushed it past the 1024-byte sniffing window and broken `−18°C` / `m³` glyphs |
| Paid-click attribution | `js/track.js` | A `gclid` visit is now `google_ads / cpc`. **It used to be filed as `google_organic`** because auto-tagged ad clicks arrive with `referrer: google.com` |
| Click-ID capture + 90-day persistence | `js/track.js` | Stores `gclid` / `gbraid` / `wbraid` / `msclkid` in `localStorage` |
| `Ref:` stamping on every WhatsApp hand-off | `js/track.js` | Appends `IF-<last12ofgclid>` to the prefilled message — anchors *and* programmatic `window.open()` |
| All 4 lead channels logged | `js/track.js` | Form, WhatsApp, phone, email → one de-duplicated `lead_intent` / `generate_lead` event |
| Enhanced Conversions payload | `contact.html` | `generate_lead` carries email / E.164 phone / first+last name for GTM to hash |
| PII kept off analytics | `js/track.js` | `?text=` is stripped from tracked `wa.me` URLs — that body is the visitor's full contact record |

Regression test: `node _kr_scrape/verify-ads-tracking.mjs` (34 checks, needs
`python3 -m http.server 8090` running from the repo root). Run it after any
change to `js/track.js` or the contact form.

---

## The gtag vs GTM question — answered once

**You do not hand-code a second gtag snippet for Google Ads. GTM *is* gtag.**
When GTM fires a Google Ads Conversion tag it loads the same underlying Google
tag library itself.

Three things actually carry data between Ads and the site, and only one is code:

| Piece | Where it lives | Without it |
|---|---|---|
| **Auto-tagging** ON | Google Ads UI (Step A2) | No `gclid` → no click-to-conversion join at all |
| **Conversion Linker tag** | GTM, fires All Pages (Step A7) | Conversions fire but **attribute to nothing** — the single most common broken setup |
| **Ads ↔ GA4 link** | GA4 Admin → Product links (Step A11) | No remarketing audiences, no GA4 conversion import |

Your existing `gtag.js` (`G-PLY0DZWNEM`) stays exactly as it is and remains
**GA4-only**. It does not need your `AW-` ID.

> **The alternative (Option B), and why it is not enough on its own:** the site's
> Google tag is **`GT-5N5NWQZH`** (destination `G-PLY0DZWNEM`). You could add
> `AW-XXXXXXXXX` to it as a second destination in the UI — Google tag → Admin →
> *Add destination* — with no code change at all.
>
> That handles the *tag*, but not the *trigger*. Every conversion on this site is
> an **event**, not a page load: there is no `/thank-you` URL to measure, because
> the form hands off to WhatsApp and the other three channels are link clicks. So
> Option B would still need a hand-written `gtag('event','conversion',…)` call at
> each of those call sites — including inside `concept-wizard.js` and
> `chat-widget.js`, which is exactly the scattered instrumentation that let those
> leads go unlogged in the first place.
>
> GTM wins here because it can listen to the `dataLayer` events `js/track.js`
> already fires, in one place. **Never run both** for the same conversion — that
> double-counts.

---

## Step A1 — Izhar Foster needs its OWN Ads account

**Revised 2026-08-03 after inspecting the account.** The first read of this
document said "keep the existing account" — correct advice for an existing
*Izhar Foster* account, wrong for the one actually available.

The account reachable from here is **`643-450-3242`** (`6434503242`), and it is
not an Izhar Foster account:

| Property | Value | Verdict |
|---|---|---|
| Currency | **USD** | **Locked forever.** You would budget Izhar Foster in USD, not PKR |
| Time zone | **America/Phoenix** | ~12h off Pakistan. Changeable **once**, and the reporting "day" would break mid-afternoon PKT — wrecking ad scheduling and daily budget pacing |
| Conversion actions | `London School Waris Mir Campus (web) …` | Another business's |
| Conversion tracking ID | `AW-18119617331` | Belongs to that business — **do not use it for Izhar** |
| Linked GA4 | *London Education* `G-S3PMR30G31` | Wrong property (Izhar is `G-PLY0DZWNEM`) |
| Structure | Standalone, level 0, no manager, no sub-accounts | Cannot host a second advertiser cleanly |

**Why not just share it.** Beyond the currency and time zone being effectively
permanent, Smart Bidding would be learning from a *school's enrolment*
conversions while bidding on cold-storage keywords. Conversion actions, audience
lists and negative keyword lists are all account-scoped, so the two advertisers
would contaminate each other's signal — and that is not cleanly reversible.

### What to do

1. **First confirm no Izhar account already exists.** Open your
   `ads.google.com/aw/overview?ocid=8195548459` link and read the account name
   and 10-digit ID at the **top right**. If it shows Izhar Foster on a PKR /
   Pakistan-time account, use that one and skip to Step A2.
2. **If it shows `643-450-3242`** (likely — that is what you sent), then no Izhar
   Foster Ads account exists yet. Create one:
   **Google Ads → click the account picker → Create new account.**
   Set these at creation, because they cannot be undone later:
   - **Billing country / currency: Pakistan / PKR**
   - **Time zone: (GMT+05:00) Pakistan Time**
   - Account name: `Izhar Foster`
   - Choose **Expert Mode** ("Switch to Expert Mode" on the goal screen) — Smart
     mode cannot run the structure in ADS-PLAN.md
3. Consider putting both accounts under a **manager (MCC)** account if you want
   one login across Izhar Foster and the school — that keeps billing, currency
   and conversion tracking properly separated per account while giving you a
   single pane of glass.
4. Then authorise the Composio `googleads` connection for the new account so it
   can be audited from here — it currently reaches only `6434503242`.

Once the account exists, verify before spending:
- **Billing** set up and not suspended (Billing → Summary).
- **No stale conversion actions** (Goals → Conversions). A new account will be
  clean; set anything unwanted to *Removed*.
- **Access and security** — no leftover agency/MCC admins you do not recognise.

### Account created — 2026-08-03

| | |
|---|---|
| Customer ID | **`326-413-6797`** (`3264136797`) |
| Conversion tracking ID | **`AW-18369062794`** |
| Currency | ⚠️ **UNVERIFIED — confirm manually** (must be PKR) |
| Time zone | ⚠️ **UNVERIFIED — confirm manually** (must be GMT+05:00 Pakistan) |

**Not auditable via API yet.** Two blockers:
1. **403 `USER_PERMISSION_DENIED`** — the Composio `googleads` connection has no
   access to `3264136797`; it reaches only `6434503242`. Fix: in Google Ads →
   **Admin → Access and security → `+`**, invite the *same* Google user that has
   access to `643-450-3242` as **Admin** on the new account. (If the new account
   sits under a manager, the API also needs that manager's `login-customer-id`.)
2. **429 `RESOURCE_EXHAUSTED`**, rate scope `DEVELOPER` — Composio's shared Google
   Ads developer token has hit its daily basic-access operation cap. Retry after
   ~19 hours. Not fixable from our side.

**Retried after granting Ads access — still 403 (no 429, so quota is not the
blocker here).** Most likely cause: the Composio connection is *pinned* to
customer `6434503242` — its stored `user_info` lists that single resource name —
and passes it as `login-customer-id`, which fails for an account that is not its
child. If so, no amount of granting access inside the Ads UI will fix it; the
`googleads` connection has to be **re-authorised** so it re-reads the accessible
customer list. That needs an interactive session.

**Do not spend more time on this.** API access is a convenience. The four checks
below take a minute in the UI and settle the only irreversible question.

## Step A2 — Turn on auto-tagging (60 seconds, do it first)

Google Ads → **Admin → Account settings → Auto-tagging** → tick
*"Tag the URL that people click through from my ad"* → Save.

This appends `?gclid=...` to every ad click. `js/track.js` already reads it,
files the session as `google_ads / cpc`, and persists it for 90 days.

Verify: load `https://izharfoster.com/?gclid=TEST123456789` and run in console:

```js
IzharTrack.clickId()   // → {type:"gclid", id:"TEST123456789", …}
IzharTrack.clickRef()  // → "IF-EST123456789"
```

---

## Step A3 — GTM container — ✅ DONE

Container **`GTM-WBNZLVC7`** is installed on all 77 pages:

- **Loader** in `<head>`, immediately after `<meta charset>` and the Consent
  Mode v2 defaults, and *before* `gtag.js`.
- **`<noscript>` fallback** immediately after `<body>`.

Verify at any time:

```bash
# expect 77 / 77 / 0
grep -rlc "'GTM-WBNZLVC7'"          --include='*.html' . | wc -l
grep -rlc 'ns.html?id=GTM-WBNZLVC7' --include='*.html' . | wc -l
grep -rl  'GTM-XXXXXXX'             --include='*.html' . | wc -l
```

Then commit and push — Vercel auto-deploys from `main`.

> **If you ever change the container ID, do not blind find-and-replace.** The
> loader originally carried a self-guard containing the placeholder a second
> time (`i==='GTM-XXXXXXX'`), so replacing every occurrence would have made the
> guard reject the new ID and leave GTM silently inert. The guard is now gone —
> but the ID does appear twice per page (loader + noscript), and both must change
> together.

**On the `<noscript>` iframe.** It is installed because you asked for the full
canonical snippet. Be aware it measures nothing on this site: a visitor with
JavaScript disabled cannot submit the form, tap a tracked WhatsApp link, or run
any calculator, so no conversion can occur down that path. It is harmless and
complete — just don't expect data from it.

---

## Step A4 — Create the conversion actions in Google Ads

Google Ads → **Goals → Conversions → Summary → + New conversion action → Website
→** skip the URL scan **→ Add a conversion action manually**.

Create these. The **name must match exactly** — Phase A7 wires GTM to them by name.

| # | Conversion action name | Category | Count | Value (PKR) | Primary? | Click window |
|---|---|---|---|---|---|---|
| 1 | `IF – Lead (All Channels)` | Submit lead form | **One** | 9,000 | **Primary** | 90 days |
| 2 | `IF – Lead · Form` | Submit lead form | One | 12,000 | Secondary | 90 days |
| 3 | `IF – Lead · WhatsApp` | Contact | One | 9,000 | Secondary | 90 days |
| 4 | `IF – Lead · Phone` | Phone call lead | One | 10,000 | Secondary | 90 days |
| 5 | `IF – Lead · Email` | Contact | One | 6,000 | Secondary | 90 days |
| 6 | `IF – Micro · Tool Result` | Other | One | 400 | Secondary | 30 days |
| 7 | `IF – Micro · Deep Engagement` | Other | One | 200 | Secondary | 30 days |
| 8 | `IF – Qualified Lead (Offline)` | Qualified lead | One | 60,000 | Secondary → Primary in Phase 4 | 90 days |

**Why exactly one Primary.** Smart Bidding optimises to the Primary set only.
Action #1 fires on *any* lead channel, so all your signal lands in one bucket —
critical at low volume, where splitting 20 leads across four actions gives the
algorithm four useless datasets instead of one usable one. Actions #2–#5 are
**Secondary**, so they appear in the "All conv." column for reporting (which
channel actually converts) without diluting bidding.

**Why Count = One.** A cold-store buyer will click WhatsApp, then call, then
submit the form. That is one lead, not three. `Count: One` collapses repeats
inside the window. (`js/track.js` also de-duplicates within 2 seconds so a
double-tap never logs twice.)

**Why a 90-day click window.** Cold-store procurement runs weeks to months
between first search and signed order. The 30-day default would silently
discard your best conversions.

**On the values:** these are deliberate *relative* placeholders so bidding can
learn that a form fill beats an email click. Replace them with real economics as
soon as you know your close rate — the formula is in ADS-PLAN.md §B9.

After saving each one, note its **Conversion ID** and **Conversion Label**
(Conversions → click the action → *Tag setup → Use Google Tag Manager*). You
need both for Step A7.

---

## Step A5 — GTM: create the variables

GTM → **Variables → User-Defined Variables → New**.

### A5.1 Data Layer variables

For each row: type **Data Layer Variable**, Version 2, leave default value empty.

| Variable name | Data Layer Variable Name |
|---|---|
| `dlv.lead_channel` | `channel` |
| `dlv.lead_product` | `lead_product` |
| `dlv.lead_industry` | `lead_industry` |
| `dlv.lead_city` | `lead_city` |
| `dlv.click_ref` | `click_ref` |
| `dlv.tool` | `tool` |
| `dlv.user_data.email` | `user_data.email_address` |
| `dlv.user_data.phone` | `user_data.phone_number` |
| `dlv.user_data.first_name` | `user_data.address.first_name` |
| `dlv.user_data.last_name` | `user_data.address.last_name` |

`js/track.js` uses `channel` (not `lead_channel`) on `lead_intent` events — that
is why row 1 maps that way. Don't "fix" it; EVENTS.md and the GA4 dashboards
depend on the existing name.

### A5.2 Built-in variables

**Variables → Configure** → enable at minimum: `Page URL`, `Page Path`,
`Page Hostname`, `Referrer`, `Click URL`, `Click Text`, `Event`.

### A5.2b Lookup Table — per-channel conversion value

**New → Variable type: Lookup Table.** Name it `Lookup – Lead Value`.

- Input Variable: `{{dlv.lead_channel}}`

| Input | Output |
|---|---|
| `whatsapp` | `9000` |
| `phone` | `10000` |
| `email` | `6000` |
| *Set Default Value* | `12000` |

Use `{{Lookup – Lead Value}}` as the Conversion Value on the primary tag instead
of a hard-coded `9000`. It works because `generate_lead` (the form) carries no
`channel` key at all, so it falls through to the default — the highest value,
which is correct: the form is the only channel that hands you a full contact
record. One variable, and bidding learns which channel is worth more.

### A5.3 User-Provided Data variable (Enhanced Conversions)

**New → Variable type: User-Provided Data → Manual configuration:**

| Field | Value |
|---|---|
| Email | `{{dlv.user_data.email}}` |
| Phone Number | `{{dlv.user_data.phone}}` |
| First Name | `{{dlv.user_data.first_name}}` |
| Last Name | `{{dlv.user_data.last_name}}` |

Name it `UPD – Lead`.

GTM SHA-256 hashes these **in the browser** before anything leaves the page.
Google never receives raw contact details. `contact.html` already normalises the
phone to E.164 (`0333-9876543` → `+923339876543`) — without that normalisation
the match rate collapses, because Google cannot match a locally-formatted number.

---

## Step A6 — GTM: create the triggers

**Triggers → New → Custom Event** for each.

| Trigger name | Event name | Condition | Fires on |
|---|---|---|---|
| `CE – Lead Any` | `.*` **Use regex matching** → `^(lead_intent\|generate_lead)$` | — | Any of the 4 lead channels |
| `CE – Lead Form` | `generate_lead` | — | Contact form only |
| `CE – Lead WhatsApp` | `lead_intent` | `dlv.lead_channel` equals `whatsapp` | WhatsApp button/FAB/link |
| `CE – Lead Phone` | `lead_intent` | `dlv.lead_channel` equals `phone` | Any `tel:` tap |
| `CE – Lead Email` | `lead_intent` | `dlv.lead_channel` equals `email` | Any `mailto:` click |
| `CE – Tool Result` | `.*` regex → `^(tool_calculated\|cost_estimated\|roi_result_view)$` | — | Any calculator produced a number |
| `CE – Deep Engagement` | `.*` regex → `^(wizard_step\|chat_step\|case_study_read)$` | — | Mid-funnel intent |

Plus one **Initialization – All Pages** trigger (built-in) for the Conversion Linker.

**Why `lead_intent` covers three channels in one event:** `js/track.js` fires a
channel-specific event (`whatsapp_click` / `phone_click` / `email_click`) *and*
a unified `lead_intent` carrying `channel`. Trigger on `lead_intent` only — if
you also trigger on `whatsapp_click` you will double-fire.

**Why the form uses `generate_lead`, not `form_submit`:** `form_submit` fires
from `track.js` on the capture phase, *before* `contact.html` has assembled the
hashed contact details. `generate_lead` fires after, and carries them. Trigger
Ads on `generate_lead`; leave `form_submit` to GA4.

---

## Step A7 — GTM: create the tags

### A7.1 Conversion Linker — DO THIS FIRST

**Tags → New → Google Ads Conversion Linker**
- Trigger: **Initialization – All Pages**
- Name: `Ads – Conversion Linker`

Without this tag, every conversion below will fire and attribute to nothing.
It reads the `gclid` from the landing URL and writes the first-party `_gcl_*`
cookies that later conversions are matched against.

### A7.2 The primary conversion

**Tags → New → Google Ads Conversion Tracking**

> **Conversion ID for this account: `18369062794`** (Google shows it as
> `AW-18369062794`). Enter it **without** the `AW-` prefix in GTM. It is the same
> for every conversion action; only the **Label** differs per action.
>
> **The `AW-` destination IS installed on-page** (at the owner's direction,
> 2026-08-03). Rather than pasting Google's snippet verbatim — which loads
> `gtag.js` a second time on every page — the Ads ID was added as a second
> destination on the existing Google tag:
>
> ```js
> gtag('config', 'G-PLY0DZWNEM');
> gtag('config', 'AW-18369062794');   // one library load, two destinations
> ```
>
> ⚠️ **The one rule this creates.** There are now two technically viable paths to
> fire an Ads conversion: on-page `gtag('event','conversion',…)` and GTM's
> conversion tags. **Conversions fire from GTM only.** Never add a gtag
> conversion event in `js/track.js`, `contact.html` or any tool JS — every lead
> would then count twice, and Smart Bidding would optimise against doubled data.
> The regression suite asserts this (`NO gtag-fired conversions`).
>
> Two knock-on effects, both fine:
> - The on-page `AW-` config sets the `_gcl_*` cookies itself, so GTM's
>   Conversion Linker is now belt-and-braces. **Keep it** — the GTM conversion
>   tags are built to depend on it, and it costs nothing.
> - It also collects remarketing data, so the GTM **Remarketing tag (§A7.4) is
>   now redundant — skip it.**

| Field | Value |
|---|---|
| Conversion ID | `18369062794` |
| Conversion Label | *(from Step A4, action #1)* |
| Conversion Value | `9000` |
| Currency Code | `PKR` *(or your account currency)* |
| Transaction ID | `{{dlv.click_ref}}` |
| **Advanced → Include user-provided data** | `UPD – Lead` |
| Trigger | `CE – Lead Any` |

Name: `Ads – Conv – Lead (All Channels)`.

`Transaction ID` is what makes de-duplication work server-side: two events
carrying the same ref collapse into one conversion.

### A7.3 The reporting conversions

Duplicate A7.2 four times, changing only the ID/Label, name and trigger:

| Tag name | Conversion action | Trigger | User-provided data |
|---|---|---|---|
| `Ads – Conv – Lead Form` | #2 | `CE – Lead Form` | `UPD – Lead` |
| `Ads – Conv – Lead WhatsApp` | #3 | `CE – Lead WhatsApp` | — |
| `Ads – Conv – Lead Phone` | #4 | `CE – Lead Phone` | — |
| `Ads – Conv – Lead Email` | #5 | `CE – Lead Email` | — |
| `Ads – Conv – Tool Result` | #6 | `CE – Tool Result` | — |
| `Ads – Conv – Deep Engagement` | #7 | `CE – Deep Engagement` | — |

Only the form has hashable contact details — a WhatsApp or phone tap gives us
nothing to hash, which is expected and fine.

### A7.4 Remarketing tag

**Tags → New → Google Ads Remarketing**
- Conversion ID: your account's ID
- Trigger: **Initialization – All Pages**
- Name: `Ads – Remarketing`

Needed for the RLSA layer in ADS-PLAN.md §B10 Phase 3.

### A7.5 Consent settings on every tag

On each Ads tag: **Advanced Settings → Consent Settings → Require additional
consent for tag to fire** → add `ad_storage` and `ad_user_data`.

The page already sets Consent Mode v2 defaults (EEA/UK/CH denied, PK granted),
so this is belt-and-braces for the day you advertise into Europe.

---

## Step A8 — Enable Enhanced Conversions in Google Ads

Google Ads → **Goals → Conversions → Settings → Enhanced conversions for leads**
→ Turn on → **Google Tag Manager** as the method → accept the terms.

Then per action (#1 and #2, the two that carry user data): open the action →
*Enhanced conversions* → confirm it reads **"Recording enhanced conversions"**
once traffic flows.

Expect roughly **+10% measured conversions** and materially better Smart Bidding
in cookie-degraded conditions.

---

## Step A9 — Preview and verify before publishing

In GTM click **Preview** and enter `https://izharfoster.com`. In the Tag
Assistant window, walk the site and confirm:

| Action | Expected in Tag Assistant | Expected in the site console |
|---|---|---|
| Land with `?gclid=TEST123456789` | `Ads – Conversion Linker` fired | `IzharTrack.clickRef()` → `"IF-EST123456789"` |
| Tap the green WhatsApp FAB | `CE – Lead WhatsApp` → 2 conv. tags fired | WhatsApp message ends with `Ref: IF-…` |
| Tap the header phone number | `CE – Lead Phone` → 2 conv. tags fired | — |
| Click a `mailto:` in the footer | `CE – Lead Email` → 2 conv. tags fired | — |
| Submit the contact form | `CE – Lead Form` → 2 conv. tags fired, `UPD – Lead` populated | one `Ref:` line in the message, not two |
| Run any calculator | `CE – Tool Result` fired | — |

Add `?debug_track=1` to any URL to see every event logged in the browser console.

Also run the local regression suite:

```bash
python3 -m http.server 8090          # from repo root, in one terminal
node _kr_scrape/verify-ads-tracking.mjs   # in another
```

When all of that is green: GTM → **Submit → Publish**. Name the version
`Ads conversion tracking v1`.

Within 24h, Google Ads → Conversions should show status **"Recording
conversions"** (not "Inactive" / "Unverified"). Do not launch campaigns until it
does.

---

## Step A10 — Sanity-check for double counting

Goals → Conversions → Summary. Confirm:
- Exactly **one** action is marked *Primary* (`IF – Lead (All Channels)`).
- No leftover/legacy actions are *Enabled*. Set stale ones to **Removed**.
- GA4-imported conversions are **not** also Primary. Import GA4 goals for
  *observation only* — Ads-native tracking is real-time and is what bids.

---

## Step A11 — Link GA4 and Google Ads

**GA4** (`G-PLY0DZWNEM`) → Admin → **Product links → Google Ads links** → Link →
select the account → enable *Personalised advertising* and *Auto-tagging*.

This gives you:
- GA4 audiences usable as Ads remarketing lists (needed for §B10 Phase 3)
- Paid traffic correctly separated from organic in GA4 Acquisition reports
- The `google_ads / cpc` source that `track.js` now sets, cross-checkable
  against GA4's own channel grouping

Two follow-ups already on the list in memory: add an **AI Assistants** custom
channel group, and a **Vercel Singapore bot filter** — both are GA4 UI work and
matter more once paid traffic starts inflating the numbers.

---

## Step A12 — Offline conversion import (the real B2B unlock)

This is the highest-value item in the whole document, and it is what the `Ref:`
line exists for. A cold store is a multi-million-rupee, multi-week sale. Google
optimising toward *form fills* is optimising toward the wrong thing — some
channels produce tyre-kickers, some produce signed orders, and only you know
which is which.

**The flow, already wired end-to-end in code:**

1. Buyer clicks your ad → `gclid` captured and stored for 90 days.
2. Buyer sends the WhatsApp enquiry → message arrives ending in `Ref: IF-a1b2c3d4e5f6`.
3. Sales logs that ref against the enquiry (spreadsheet is fine to start).
4. Quote turns into an order → you upload the conversion back to Google Ads.

**To upload:** Goals → Conversions → **Uploads → + → Upload from Google Sheets/CSV.**
The sheet needs these columns:

```
Google Click ID, Conversion Name, Conversion Time, Conversion Value, Conversion Currency
```

- `Google Click ID` — the **full** `gclid`, not the shortened `IF-…` ref.
  The ref's last 12 characters locate the click; recover the full value from
  GA4 or from the sales log. **Better: have sales paste the whole ref line and
  keep a lookup sheet** — or add the full `gclid` to the WhatsApp message if you
  are willing to accept a longer message.
- `Conversion Name` — `IF – Qualified Lead (Offline)` (action #8)
- `Conversion Time` — e.g. `2026-08-14 15:30:00+05:00`
- Must be uploaded **within 90 days** of the click, which is why every action
  above uses a 90-day window.

Once ~30 offline conversions have accumulated, promote action #8 to **Primary**
and demote #1 to Secondary. From that point Google bids toward *orders*, not
form fills. This is the single biggest performance step change available to
this account.

> **Improvement worth considering:** the current ref is the last 12 characters
> of the `gclid`, chosen to keep the WhatsApp message readable. If you want
> fully automatic offline import with no lookup sheet, change `clickRef()` in
> `js/track.js` to emit the full `gclid`. Say the word and I'll switch it.

---

## Step A13 — What to check in week one

| Day | Check | Red flag |
|---|---|---|
| 1 | Conversions status = "Recording conversions" | Still "Inactive" after 24h → Linker tag missing or not published |
| 2 | Conversions arriving with values | Value `0` → currency/value fields empty on the tag |
| 3 | GA4 `google_ads / cpc` sessions ≈ Ads clicks (±15%) | Big gap → auto-tagging off, or a redirect stripping `gclid` |
| 5 | Enhanced conversions = "Recording" | "No data" → `UPD – Lead` not attached to the tag |
| 7 | `IF – Lead (All Channels)` count ≈ sum of the 4 channel actions | Wildly higher → you triggered on `whatsapp_click` as well as `lead_intent` |

---

## Appendix — event → conversion map

Full definitions in [EVENTS.md](EVENTS.md).

| dataLayer event | Source | Carries | Google Ads action |
|---|---|---|---|
| `generate_lead` | `contact.html` | hashed email/phone/name, product, industry, city, ref | #1 + #2 |
| `lead_intent` `channel=whatsapp` | `track.js` (anchor + `window.open`) | location, ref | #1 + #3 |
| `lead_intent` `channel=phone` | `track.js` | location | #1 + #4 |
| `lead_intent` `channel=email` | `track.js` | location | #1 + #5 |
| `tool_calculated` / `cost_estimated` / `roi_result_view` | tool JS | tool id | #6 |
| `wizard_step` / `chat_step` / `case_study_read` | tool JS | step / slug | #7 |
| `form_submit`, `whatsapp_click`, `phone_click`, `email_click` | `track.js` | — | **none — GA4 only.** Do not attach Ads tags or you will double count |

## Appendix — troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| "Unverified" conversion action | Tag never fired on a real visit | Publish the GTM container; check the trigger's regex |
| Conversions recorded but 0 attributed to campaigns | Missing Conversion Linker | Step A7.1 |
| Paid traffic showing as organic in GA4 | Auto-tagging off | Step A2 |
| Enhanced conversions "No data" | `UPD – Lead` not on the tag, or phone not E.164 | Steps A5.3 / A7.2 |
| Conversion counts ~2× reality | Triggered on both `lead_intent` and `whatsapp_click` | Use `lead_intent` only |
| Mojibake (`â` where `−18°C` should be) | Something inserted above `<meta charset>` | Keep charset first in `<head>` — see §0 |
| `gclid` lost between landing and form | Legacy WP 308 redirect stripping params | `track.js` persists it in `localStorage`; confirm with `IzharTrack.clickId()` |
