# Website leads → Google Sheet

The contact form saves every callback request as a row in the **Website Leads**
tab of the existing sheet
[`1OfO47Ph…`](https://docs.google.com/spreadsheets/d/1OfO47Ph5vRwVs6zSqwQzgKkRpYBvY945bubxH0f6HcM/edit).
WhatsApp is always offered next to the form. If a save ever fails, the visitor
is handed to WhatsApp with their details filled in, so no lead is lost.

```
contact.html form ─► js/contact-lead.js ─► /api/leads (Vercel, api/leads.js)
                                             │  validates, HMAC-signs
                                             ▼
                         Apps Script web app (integrations/google-sheets/Code.gs)
                                             │  verifies signature, dedupes
                                             ▼
                                 Sheet tab "Website Leads" (private)
```

The sheet stays private. Visitors never talk to Google directly, and the
Apps Script refuses anything that isn't signed with the shared secret.

## One-time setup (≈10 minutes)

**Status: live since 2026-09-24.** Production web app: `https://script.google.com/macros/s/AKfycby_aOw6x2USWkW9XUXn-MFAe5Mf75ph052TURATZid2iUcg8aVO7rqB-eUeM1mmvFDr9Q/exec`.

If the connection ever breaks, the form still works: `/api/leads` answers
`503 temporarily_unavailable` and every submit falls back to WhatsApp.

1. **Open the sheet → Extensions → Apps Script.** Delete the sample code and
   paste the whole of `integrations/google-sheets/Code.gs`. Save.
2. **Create the secret.** In a terminal, run
   `openssl rand -hex 32` and copy the 64-character result.
3. **Apps Script → Project Settings (gear) → Script Properties → Add**:
   `LEAD_SHEETS_SECRET` = the secret from step 2.
4. **Run `setupWebsiteLeads` once** (select it in the toolbar → Run → approve
   the permissions). It adds the *Website Leads* tab and leaves every other
   tab alone.
5. **Deploy → New deployment → type "Web app"**:
   Execute as **Me**, Who has access **Anyone**. Copy the URL ending in `/exec`.
   ("Anyone" is required so Vercel can reach it. Unsigned requests get
   `{ok:false}` and nothing is written; `doGet` never returns data.)
6. **Vercel → Project → Settings → Environment Variables (Production):**
   - `LEAD_SHEETS_WEBHOOK_URL` = the `/exec` URL
   - `LEAD_SHEETS_SECRET` = the same secret as step 3

   Then redeploy (or push any commit).
7. **Test:** submit the form on https://izharfoster.com/contact. The button
   should read **"Request received"** and a row should appear within seconds.

**Troubleshooting:** a signed request returns a short code. `setup_secret_missing`: add the Script Property. `bad_signature`: the secret differs from Vercel's (check for stray spaces). `setup_tab_missing`: run `setupWebsiteLeads`. A plain `{"ok":false}` to a bad signature means the URL is still serving old code.

If you change `Code.gs` later: Deploy → Manage deployments → edit → **New
version**. Editing the code alone doesn't update the live web app.

## Working the sheet

Sales edits these columns: **Status** (New → Contacted → Qualified → Quote
sent → Won/Lost/Spam), **Owner**, **First response at**, **Next follow-up**,
**Qualified?**, **Quote value (PKR)**, **Outcome / sales notes**.

Each row also records the source, medium, campaign, keyword and landing page,
plus the **full Google Ads click ID** (`gclid`/`gbraid`/`wbraid`). That's what
makes offline conversion import possible later (GTM-SETUP.md, action #8
"Qualified Lead (Offline)"): export the rows marked *Qualified = Yes* and
upload them against the click ID.

## Tracking contract

| Moment | Event | Where |
|---|---|---|
| Submit pressed | `form_submit` (GA4 funnel only, not a lead) | `js/track.js` |
| Sheet confirms the row | `generate_lead` (Ads conversion, Enhanced Conversions `user_data`, transaction ID = lead UUID) + `lead_received` (GA4) | `js/contact-lead.js` |
| Save failed | `form_submit_error`, then `whatsapp_click` + `lead_intent` when WhatsApp opens | `js/contact-lead.js` |
| Green "WhatsApp now" tapped | `whatsapp_click` + `lead_intent` | `js/track.js` |

GA4 → Admin → Key events: mark **`lead_received`** as a key event, next to
`lead_intent` and `generate_lead`.

Regression: `node _kr_scrape/verify-ads-tracking.mjs` (47 checks, mocks a
confirmed save) and `node _kr_scrape/verify-wa-split.mjs` (38 checks, covers
the WhatsApp fallback).
