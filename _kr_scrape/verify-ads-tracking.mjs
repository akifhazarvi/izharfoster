// Verifies the Google Ads tracking layer end-to-end against the local server
// (python3 -m http.server 8090 from the repo root).
//
// Covers: gclid capture + 90-day persistence, paid-vs-organic attribution,
// wa.me ref stamping (anchor AND programmatic window.open), all four lead
// channels, lead de-duplication, Enhanced Conversions payload shape, and the
// critical negative — that no PII reaches the Vercel/GA4 track() funnel.
import { chromium } from 'playwright';

const BASE = 'http://localhost:8090';
const GCLID = 'EAIaIQobChMTESTgclid1234ABCD';
const EXPECTED_REF = 'IF-' + GCLID.slice(-12);

const fails = [];
const pass = [];
const check = (name, cond, detail = '') =>
  cond ? pass.push(name) : fails.push(`${name}${detail ? ' — ' + detail : ''}`);

const browser = await chromium.launch();
// Tests must never reach GA4: these runs fire real lead events (with a
// simulated gclid) and were showing up in reports as paid leads.
const _newContext = browser.newContext.bind(browser);
browser.newContext = async (...a) => {
  const c = await _newContext(...a);
  await c.route(/google-analytics\.com\/(g|j)\/collect|analytics\.google\.com\/g\/collect/, r => r.abort());
  return c;
};
const ctx = await browser.newContext();

// Context-scoped so EVERY page gets it. Captures window.open targets without
// opening tabs. NOTE: this used to stub window.va and read what track() sent
// on the Vercel path. Vercel Web Analytics was removed 2026-08-16, so the
// outbound funnel is dataLayer (GTM) + gtag (GA4) only — the PII negative
// below now reads window.dataLayer directly, which is what actually leaves
// the page. Do not reintroduce a window.va stub to "fix" a failing check.
await ctx.addInitScript(() => {
  window.__opened = [];
  window.open = (url) => { window.__opened.push(String(url)); return { closed: false }; };
});

const leads = (p) => p.evaluate(() =>
  (window.dataLayer || []).filter(e => e && e.event === 'lead_intent'));

// ---------------------------------------------------------------------------
// 1. Landing on a paid click
// ---------------------------------------------------------------------------
const page = await ctx.newPage();
await page.goto(`${BASE}/services/cold-stores.html?gclid=${GCLID}&utm_campaign=coldstore_pk`,
  { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => !!window.IzharTrack);

const rec = await page.evaluate(() => window.IzharTrack.clickId());
check('gclid captured from URL', rec && rec.id === GCLID, JSON.stringify(rec));
check('click type recorded as gclid', rec && rec.type === 'gclid');
check('clickRef derived correctly', await page.evaluate(() => window.IzharTrack.clickRef()) === EXPECTED_REF);

const attr = await page.evaluate(() => JSON.parse(sessionStorage.getItem('izhar_session_attribution')));
check('paid click attributed to google_ads, NOT google_organic', attr.source === 'google_ads', `got "${attr.source}"`);
check('medium is cpc', attr.medium === 'cpc', `got "${attr.medium}"`);
check('utm_campaign carried through', attr.campaign === 'coldstore_pk', `got "${attr.campaign}"`);

// ---------------------------------------------------------------------------
// 2. Anchor-based WhatsApp: ref stamped in place + lead logged
// ---------------------------------------------------------------------------
const waHref = await page.evaluate(() => {
  const a = document.querySelector('a.fab-wa') || document.querySelector('a[href*="wa.me"]');
  if (!a) return null;
  a.click();
  return a.getAttribute('href');
});
check('wa.me anchor present', waHref !== null);
check('ref stamped into wa.me anchor text', waHref && decodeURIComponent(waHref).includes(EXPECTED_REF),
  waHref ? decodeURIComponent(waHref).slice(-60) : '');
const waLeads = await leads(page);
check('WhatsApp anchor logged one lead', waLeads.length === 1, `${waLeads.length} leads`);
check('WhatsApp lead channel correct', waLeads[0]?.channel === 'whatsapp', `got "${waLeads[0]?.channel}"`);

// ---------------------------------------------------------------------------
// 3. De-duplication: a second click inside the window must not double-log
// ---------------------------------------------------------------------------
await page.evaluate(() => document.querySelector('a[href*="wa.me"]').click());
const dedupeLeads = await leads(page);
check('rapid second WhatsApp click de-duplicated', dedupeLeads.length === 1, `${dedupeLeads.length} leads`);

// ---------------------------------------------------------------------------
// 4. Phone + email lead channels (fresh page, past the dedupe window)
// ---------------------------------------------------------------------------
// The contact form saves to the private Sheet via /api/leads before it counts
// a lead. The local static server has no API, so confirm the save here.
await ctx.route('**/api/leads', async r => {
  const body = JSON.parse(r.request().postData());
  globalThis.__lastLeadPost = body;
  await r.fulfill({ status: 200, contentType: 'application/json',
    body: JSON.stringify({ ok: true, saved: true, lead_id: body.lead_id }) });
});
const p2 = await ctx.newPage();
await p2.goto(`${BASE}/contact.html`, { waitUntil: 'domcontentloaded' });
await p2.waitForFunction(() => !!window.IzharTrack);

check('click ref persists to a new page via localStorage',
  await p2.evaluate(() => window.IzharTrack.clickRef()) === EXPECTED_REF);

await p2.evaluate(() => {
  const a = document.querySelector('a[href^="tel:"]');
  if (a) { a.removeAttribute('target'); a.addEventListener('click', e => e.preventDefault()); a.click(); }
});
let ls = await leads(p2);
check('phone click logged as a lead', ls.some(l => l.channel === 'phone'),
  JSON.stringify(ls.map(l => l.channel)));

await p2.waitForTimeout(2100); // clear the dedupe window
await p2.evaluate(() => {
  const a = document.querySelector('a[href^="mailto:"]');
  if (a) { a.removeAttribute('target'); a.addEventListener('click', e => e.preventDefault()); a.click(); }
});
ls = await leads(p2);
check('email click logged as a lead', ls.some(l => l.channel === 'email'),
  JSON.stringify(ls.map(l => l.channel)));

// ---------------------------------------------------------------------------
// 5. Programmatic window.open(wa.me) — the concept-wizard / chat-widget path
// ---------------------------------------------------------------------------
await p2.waitForTimeout(2100);
const before = (await leads(p2)).length;
await p2.evaluate(() => window.open('https://wa.me/923215383544?text=Wizard%20concept%20request', '_blank'));
const after = await leads(p2);
check('programmatic window.open(wa.me) logs a lead', after.length === before + 1,
  `${before} -> ${after.length}`);
const opened = await p2.evaluate(() => window.__opened);
const wizardUrl = opened.find(u => u.includes('Wizard'));
check('programmatic wa.me URL gets the ref stamped',
  wizardUrl && decodeURIComponent(wizardUrl).includes(EXPECTED_REF),
  wizardUrl ? decodeURIComponent(wizardUrl).slice(-50) : 'not opened');

// ---------------------------------------------------------------------------
// 6. Lead form -> generate_lead with Enhanced Conversions data
// ---------------------------------------------------------------------------
await p2.waitForTimeout(2100);
const leadsBeforeForm = (await leads(p2)).length;
await p2.fill('#n', 'Asad Mehmood Khan');
// Optional details are collapsed at every width; open them like a visitor would.
await p2.click('#form-more summary');
await p2.fill('#c', 'Falcon Foods Pvt Ltd');
await p2.fill('#p', '0333-9876543'); // deliberately NOT Izhar's own number
await p2.fill('#e', 'Asad.Mehmood@FalconFoods.PK');
await p2.fill('#loc', 'Multan');
await p2.selectOption('#ind', 'Pharma');
await p2.selectOption('#prod', 'Cold Store');
await p2.fill('#cap', '1200 m3');
await p2.click('button[type="submit"]');
await p2.waitForFunction(() => (window.dataLayer || []).some(e => e && e.event === 'generate_lead'));

const gl = await p2.evaluate(() => (window.dataLayer || []).filter(e => e && e.event === 'generate_lead'));
check('generate_lead fired exactly once', gl.length === 1, `fired ${gl.length}x`);
const lead = gl[0] || {};
check('phone normalised to E.164', lead.user_data?.phone_number === '+923339876543',
  `got "${lead.user_data?.phone_number}"`);
check('email present for client-side hashing', lead.user_data?.email_address === 'Asad.Mehmood@FalconFoods.PK');
check('name split into first/last for matching',
  lead.user_data?.address?.first_name === 'Asad' && lead.user_data?.address?.last_name === 'Mehmood Khan',
  JSON.stringify(lead.user_data?.address));
check('lead_product segmented', lead.lead_product === 'Cold Store', `got "${lead.lead_product}"`);
check('lead_industry segmented', lead.lead_industry === 'Pharma', `got "${lead.lead_industry}"`);
check('lead_city segmented', lead.lead_city === 'Multan', `got "${lead.lead_city}"`);
check('transaction id (click_ref) is the saved lead id', /^[0-9a-f-]{36}$/.test(lead.click_ref || '') && lead.click_ref === lead.lead_id,
  `got "${lead.click_ref}"`);
check('full click id saved with the Sheet row', !!globalThis.__lastLeadPost?.click_id && EXPECTED_REF.endsWith(globalThis.__lastLeadPost.click_id.slice(-12)),
  `got "${globalThis.__lastLeadPost?.click_id}"`);
check('lead_received fired after the confirmed save',
  await p2.evaluate(() => (window.dataLayer || []).some(e => e && e.event === 'lead_received')));
const leadsAfterForm = (await leads(p2)).length;
check('form submit did NOT also log a duplicate lead_intent',
  leadsAfterForm === leadsBeforeForm, `${leadsBeforeForm} -> ${leadsAfterForm}`);

// ---------------------------------------------------------------------------
// 6b. Conversion-leak fixes: only name+phone required, and an email hand-off
//     exists for anyone without WhatsApp (desktop = WhatsApp Web + QR wall).
// ---------------------------------------------------------------------------
const p5 = await ctx.newPage();
await p5.goto(`${BASE}/contact.html`, { waitUntil: 'domcontentloaded' });
await p5.waitForFunction(() => !!window.IzharTrack);

const requiredCount = await p5.evaluate(() =>
  document.querySelectorAll('#quote-form input[required], #quote-form textarea[required]').length);
check('only 2 fields required (name + phone)', requiredCount === 2, `${requiredCount} required`);
// The competing "Send by email instead" button was removed on request
// (2026-08-15) — the form is now a single Send. The email escape hatch is a
// plain mailto link in the note so desktop visitors without WhatsApp still
// have a route out.
check('callback and WhatsApp offered side by side',
  await p5.locator('.form-actions button[type="submit"]').count() === 1 &&
  await p5.locator('.form-actions #form-whatsapp').count() === 1);
check('email escape hatch still reachable under the form',
  await p5.locator('#form-email[href^="mailto:"]').count() === 1);

// Minimal lead: name + phone ONLY. This used to fail validation on company+email.
await p5.fill('#n', 'Bilal Sheikh');
await p5.fill('#p', '0301-2223344');
await p5.click('button[type="submit"]');
await p5.waitForFunction(() => (window.dataLayer || []).some(e => e && e.event === 'generate_lead'));
const minimal = await p5.evaluate(() => (window.dataLayer || []).filter(e => e && e.event === 'generate_lead'));
check('form submits with name+phone only', minimal.length === 1, `${minimal.length} leads`);
check('minimal lead still normalises phone', minimal[0]?.user_data?.phone_number === '+923012223344',
  `got "${minimal[0]?.user_data?.phone_number}"`);
check('minimal lead channel is website_form', minimal[0]?.lead_channel === 'website_form',
  `got "${minimal[0]?.lead_channel}"`);

// The email hand-off path stays wired in contact.html even though no button
// calls it, so restoring the button is a one-line change. Assert the mailto
// link in the note is tracked as an email lead intent.
const p6 = await ctx.newPage();
await p6.goto(`${BASE}/contact.html`, { waitUntil: 'domcontentloaded' });
await p6.waitForFunction(() => !!window.IzharTrack);
await p6.evaluate(() => {
  const a = document.querySelector('#form-email');
  a.addEventListener('click', e => e.preventDefault(), true);
  a.click();
});
await p6.waitForTimeout(400);
const emailIntent = await p6.evaluate(() =>
  (window.dataLayer || []).filter(e => e && e.event === 'lead_intent' && e.channel === 'email'));
check('email link still logs an email lead intent', emailIntent.length === 1,
  `${emailIntent.length} intents`);

// ---------------------------------------------------------------------------
// 7. The critical negative: no PII on the analytics funnel
// ---------------------------------------------------------------------------
// track() stamps page_type on every event it emits. The Enhanced-Conversions
// push from contact.html deliberately does NOT go through track() and does
// carry raw user_data — GTM SHA-256 hashes it in-browser before Google sees
// it. So scope this negative to the track() funnel: asserting "no PII
// anywhere in dataLayer" would fail on the EC payload by design.
const dl = await p2.evaluate(() =>
  (window.dataLayer || []).map(e => { try { return JSON.parse(JSON.stringify(e)); } catch (err) { return null; } }));
const sent = JSON.stringify(dl.filter(e => e && typeof e === 'object' && e.page_type));
const leak = sent.match(/Asad|FalconFoods|9876543|Mehmood/i);
check('NO PII in the GA4/GTM track() payloads', leak === null, `leaked "${leak}"`);
check('form_submit still reaches GA4 for funnel reporting', sent.includes('form_submit'));

// ---------------------------------------------------------------------------
// 8. WhatsApp hand-off carries the ref for offline conversion import
// ---------------------------------------------------------------------------
// After a saved request the green button offers the same details on WhatsApp.
const formUrl = await p2.evaluate(() => {
  const a = document.getElementById('form-whatsapp');
  a.addEventListener('click', e => e.preventDefault());
  a.click();
  return new URL(a.href).searchParams.get('text') || '';
});
const waText = formUrl;
check('WhatsApp button carries the saved request', /Falcon/.test(waText) && /Website lead: /.test(waText));
check('WhatsApp message contains exactly one Ref line',
  formUrl && (waText.match(/Ref: /g) || []).length === 1,
  formUrl ? JSON.stringify(waText.match(/Ref: \S+/g) || []) : '');

// ---------------------------------------------------------------------------
// 9. Consent Mode v2 + GTM loader hygiene
// ---------------------------------------------------------------------------
const consents = await p2.evaluate(() =>
  (window.dataLayer || []).filter(e => e && e[0] === 'consent' && e[1] === 'default').length);
check('two consent defaults (EEA denied + rest granted)', consents === 2, `got ${consents}`);

const gtmReqs = [];
const p3 = await ctx.newPage();
p3.on('request', r => { if (r.url().includes('googletagmanager.com/gtm.js')) gtmReqs.push(r.url()); });
await p3.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded' });
await p3.waitForTimeout(600);
check('GTM container requested with the real ID (GTM-WBNZLVC7)',
  gtmReqs.some(u => u.includes('id=GTM-WBNZLVC7')),
  `requested: ${gtmReqs.join(', ') || 'nothing'}`);
// With JS enabled the browser parses <noscript> contents as TEXT, not DOM,
// so there is no iframe element to query — assert on the text instead.
const nsCount = await p3.evaluate(() =>
  [...document.querySelectorAll('noscript')]
    .filter(n => n.textContent.includes('ns.html?id=GTM-WBNZLVC7')).length);
check('exactly one GTM noscript fallback', nsCount === 1, `found ${nsCount}`);

// Google Ads destination must be configured exactly once, on the same gtag.js
// load as GA4, and must NOT fire any conversion itself — conversions come from
// GTM only. Two paths firing the same conversion is the double-count failure.
// Count in the HTML SOURCE, not the live DOM: gtag.js injects an extra
// per-destination config script for each configured ID, so the runtime DOM
// legitimately shows 3. What matters is that the page hard-codes the library
// once and adds the second destination via gtag('config', ...).
const srcHtml = await (await fetch(`${BASE}/index.html`)).text();
const hardCoded = (srcHtml.match(/googletagmanager\.com\/gtag\/js/g) || []).length;
check('library hard-coded once in HTML source (2nd destination via config)',
  hardCoded === 1, `${hardCoded} in source`);
const cfgs = await p3.evaluate(() => (window.dataLayer || [])
  .filter(e => e && e[0] === 'config').map(e => e[1]));
check('GA4 destination configured', cfgs.includes('G-PLY0DZWNEM'), JSON.stringify(cfgs));
check('Google Ads destination configured', cfgs.includes('AW-18369062794'), JSON.stringify(cfgs));
const gtagConv = await p3.evaluate(() => (window.dataLayer || [])
  .filter(e => e && e[0] === 'event' && String(e[1]).includes('conversion')).length);
check('NO gtag-fired conversions (GTM is the only path)', gtagConv === 0, `found ${gtagConv}`);

// ---------------------------------------------------------------------------
// 10. Organic traffic must NOT be mislabelled as paid
// ---------------------------------------------------------------------------
const clean = await browser.newContext();
const p4 = await clean.newPage();
await p4.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded' });
await p4.waitForFunction(() => !!window.IzharTrack);
const cleanAttr = await p4.evaluate(() => JSON.parse(sessionStorage.getItem('izhar_session_attribution')));
check('direct visit still attributed as direct', cleanAttr.source === 'direct', `got "${cleanAttr.source}"`);
check('no click ref for a non-paid visit', await p4.evaluate(() => window.IzharTrack.clickRef()) === '');

await browser.close();

console.log(`\nPASS (${pass.length}):`);
pass.forEach(p => console.log('  ✓ ' + p));
if (fails.length) {
  console.log(`\nFAIL (${fails.length}):`);
  fails.forEach(f => console.log('  ✗ ' + f));
  process.exit(1);
}
console.log('\nAll checks passed.');
