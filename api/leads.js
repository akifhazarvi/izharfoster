// Browser -> same-origin Vercel function -> signed Apps Script -> private Sheet.
// Never log request bodies, contact details, attribution IDs or the shared secret.
const { createHmac } = require('node:crypto');

const LIMITS = { name: 120, phone: 40, email: 254, company: 180, notes: 3000,
  location: 180, industry: 100, product: 100, capacity: 120, temperature: 80,
  click_id: 512, click_type: 12, landing_page: 250, source: 100, medium: 60,
  campaign: 200, term: 200, wa_line: 1, source_tool: 80 };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function clean(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body) || !UUID.test(body.lead_id || '')) return null;
  const lead = { lead_id: body.lead_id };
  for (const [key, limit] of Object.entries(LIMITS)) {
    const value = body[key] == null ? '' : body[key];
    if (typeof value !== 'string' || value.length > limit || /\u0000/.test(value)) return null;
    lead[key] = value.trim();
  }
  if (body.website || lead.name.length < 2) return null;
  const digits = lead.phone.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15 || !/^[+\d\s().-]+$/.test(lead.phone)) return null;
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return null;
  if (lead.click_type && !['gclid', 'gbraid', 'wbraid', 'msclkid'].includes(lead.click_type)) return null;
  if (lead.wa_line && !['a', 'b'].includes(lead.wa_line)) return null;
  if (lead.landing_page && !/^\/(?!\/)[^?#]*$/.test(lead.landing_page)) return null;
  return lead;
}

function makeHandler({ env = process.env, fetchImpl = globalThis.fetch, now = Date.now } = {}) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const reply = (status, data) => res.status(status).json(data);
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return reply(405, { ok: false, error: 'method_not_allowed' });
    }
    const allowed = (env.LEAD_ALLOWED_ORIGINS || 'https://izharfoster.com,https://www.izharfoster.com').split(',').map(s => s.trim());
    if (!allowed.includes(req.headers.origin)) return reply(403, { ok: false, error: 'origin_not_allowed' });
    if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return reply(415, { ok: false, error: 'json_required' });
    let body;
    try {
      const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      if (!raw || Buffer.byteLength(raw) > 16000) return reply(413, { ok: false, error: 'request_too_large' });
      body = JSON.parse(raw);
    } catch (_) { return reply(400, { ok: false, error: 'invalid_request' }); }
    const lead = clean(body);
    if (!lead) return reply(400, { ok: false, error: 'invalid_fields' });
    const url = env.LEAD_SHEETS_WEBHOOK_URL || '';
    const secret = env.LEAD_SHEETS_SECRET || '';
    if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url) || secret.length < 32) {
      return reply(503, { ok: false, error: 'temporarily_unavailable' });
    }
    // Only a keyed, short-lived abuse-control identifier leaves this function;
    // no visitor IP is written to the spreadsheet. Vercel sets this header.
    const ip = String(req.headers['x-vercel-forwarded-for'] || 'unknown').split(',')[0].trim();
    const rateKey = createHmac('sha256', secret).update(new Date(now()).toISOString().slice(0, 10) + ':' + ip).digest('hex');
    const payload = JSON.stringify({ lead, rate_key: rateKey });
    const timestamp = String(now());
    const signature = createHmac('sha256', secret).update(timestamp + '.' + payload).digest('hex');
    try {
      const response = await fetchImpl(url, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp, payload, signature }),
        signal: AbortSignal.timeout(15000), redirect: 'follow'
      });
      if (!response.ok) throw new Error('upstream');
      const result = await response.json();
      if (result.error === 'rate_limited') return reply(429, { ok: false, error: 'please_try_later' });
      if (result.ok !== true || result.lead_id !== lead.lead_id || result.saved !== true) throw new Error('unconfirmed');
      return reply(200, { ok: true, saved: true, lead_id: lead.lead_id });
    } catch (_) {
      // A timed-out request may still have saved: retry the SAME lead_id.
      return reply(503, { ok: false, error: 'save_not_confirmed' });
    }
  };
}

module.exports = makeHandler();
module.exports.makeHandler = makeHandler;
