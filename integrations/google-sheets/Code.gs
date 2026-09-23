// Bind this script to the existing spreadsheet. Setup adds ONLY Website Leads.
// Put LEAD_SHEETS_SECRET (>=32 random characters) in Script Properties.
var LEAD_SPREADSHEET_ID = '1OfO47Ph5vRwVs6zSqwQzgKkRpYBvY945bubxH0f6HcM';
var LEAD_TAB = 'Website Leads';
var LEAD_HEADERS = [
  'Lead ID', 'Received at (UTC)', 'Status', 'Owner', 'First response at',
  'Next follow-up', 'Qualified?', 'Quote value (PKR)', 'Outcome / sales notes',
  'Name', 'Phone / WhatsApp', 'Email', 'Company', 'Project notes', 'Project city',
  'Industry', 'Product', 'Capacity', 'Temperature', 'WhatsApp line', 'Source tool',
  'Source', 'Medium', 'Campaign', 'Keyword', 'Landing page', 'Click ID type',
  'Full click ID', 'Request fingerprint'
];

function setupWebsiteLeads() {
  var book = SpreadsheetApp.openById(LEAD_SPREADSHEET_ID);
  var sheet = book.getSheetByName(LEAD_TAB);
  if (sheet) { checkHeaders_(sheet); return; } // Never overwrite existing content.
  sheet = book.insertSheet(LEAD_TAB);
  if (sheet.getMaxColumns() < LEAD_HEADERS.length) sheet.insertColumnsAfter(sheet.getMaxColumns(), LEAD_HEADERS.length - sheet.getMaxColumns());
  sheet.getRange(1, 1, 1, LEAD_HEADERS.length).setValues([LEAD_HEADERS]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, LEAD_HEADERS.length).setBackground('#084595').setFontColor('#ffffff').setFontWeight('bold');
  sheet.getRange(2, 1, sheet.getMaxRows() - 1, LEAD_HEADERS.length).setNumberFormat('@');
  var status = SpreadsheetApp.newDataValidation().requireValueInList(['New', 'Contacted', 'Qualified', 'Quote sent', 'Won', 'Lost', 'Spam'], true).setAllowInvalid(false).build();
  sheet.getRange(2, 3, sheet.getMaxRows() - 1, 1).setDataValidation(status);
  var qualified = SpreadsheetApp.newDataValidation().requireValueInList(['Yes', 'No', 'Pending'], true).setAllowInvalid(false).build();
  sheet.getRange(2, 7, sheet.getMaxRows() - 1, 1).setDataValidation(qualified);
  sheet.getRange(1, 1, sheet.getMaxRows(), LEAD_HEADERS.length).createFilter();
  sheet.setColumnWidths(1, LEAD_HEADERS.length, 150);
  sheet.setColumnWidth(14, 320);
  sheet.hideColumns(29); // Fingerprint supports retries; no contact data in it.
}

function checkHeaders_(sheet) {
  if (!sheet || JSON.stringify(sheet.getRange(1, 1, 1, LEAD_HEADERS.length).getValues()[0]) !== JSON.stringify(LEAD_HEADERS)) {
    throw new Error('Run setupWebsiteLeads on an empty/new Website Leads tab. Existing headers must not be replaced.');
  }
}
function json_(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
function hex_(bytes) { return bytes.map(function(b) { return ('0' + ((b + 256) % 256).toString(16)).slice(-2); }).join(''); }
function equal_(a, b) {
  if (typeof a !== 'string' || a.length !== b.length) return false;
  var diff = 0; for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
function cell_(value) {
  var s = String(value == null ? '' : value);
  // Treat visitor-supplied values as text, including formula-like content.
  return /^[\s]*[=+@-]/.test(s) ? "'" + s : s;
}

function doPost(e) {
  var lock, locked = false;
  try {
    if (!e || !e.postData || e.postData.contents.length > 22000) return json_({ ok: false });
    var envelope = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty('LEAD_SHEETS_SECRET');
    // Setup diagnostics: short codes only, never submitted data or the secret.
    if (!secret || secret.length < 32) return json_({ ok: false, error: 'setup_secret_missing' });
    if (typeof envelope.payload !== 'string' || !/^\d{13}$/.test(envelope.timestamp || '')) return json_({ ok: false, error: 'bad_envelope' });
    if (Math.abs(Date.now() - Number(envelope.timestamp)) > 300000) return json_({ ok: false, error: 'stale_request' });
    var expected = hex_(Utilities.computeHmacSha256Signature(envelope.timestamp + '.' + envelope.payload, secret, Utilities.Charset.UTF_8));
    if (!equal_(envelope.signature, expected)) return json_({ ok: false, error: 'bad_signature' });
    var data = JSON.parse(envelope.payload), lead = data.lead;
    if (!lead || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(lead.lead_id || '') || !/^[0-9a-f]{64}$/.test(data.rate_key || '')) return json_({ ok: false });
    var fingerprint = hex_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, JSON.stringify(lead), Utilities.Charset.UTF_8));
    lock = LockService.getScriptLock();
    if (!lock.tryLock(5000)) return json_({ ok: false });
    locked = true;
    var sheet = SpreadsheetApp.openById(LEAD_SPREADSHEET_ID).getSheetByName(LEAD_TAB);
    if (!sheet) return json_({ ok: false, error: 'setup_tab_missing' });
    try { checkHeaders_(sheet); } catch (_) { return json_({ ok: false, error: 'setup_headers_mismatch' }); }
    var last = sheet.getLastRow();
    if (last > 1) {
      var existing = sheet.getRange(2, 1, last - 1, 1).createTextFinder(lead.lead_id).matchEntireCell(true).findNext();
      if (existing) {
        if (sheet.getRange(existing.getRow(), 29).getValue() !== fingerprint) return json_({ ok: false });
        return json_({ ok: true, saved: true, lead_id: lead.lead_id });
      }
    }
    // Supplement with Vercel Firewall rate limits; CacheService is best effort.
    var cache = CacheService.getScriptCache(), key = 'lead:' + data.rate_key;
    var count = Number(cache.get(key) || 0);
    if (count >= 10) return json_({ ok: false, error: 'rate_limited' });
    cache.put(key, String(count + 1), 600);
    var values = [lead.lead_id, new Date().toISOString(), 'New', '', '', '', 'Pending', '', '',
      lead.name, lead.phone, lead.email, lead.company, lead.notes, lead.location, lead.industry,
      lead.product, lead.capacity, lead.temperature, lead.wa_line, lead.source_tool,
      lead.source, lead.medium, lead.campaign, lead.term, lead.landing_page, lead.click_type,
      lead.click_id, fingerprint].map(cell_);
    if (last + 1 > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), 100);
    sheet.getRange(last + 1, 1, 1, values.length).setNumberFormat('@').setValues([values]);
    SpreadsheetApp.flush();
    return json_({ ok: true, saved: true, lead_id: lead.lead_id });
  } catch (_) {
    // No submitted data in logs or errors. Never return success on write failure.
    return json_({ ok: false, error: 'write_failed' });
  } finally { if (locked) lock.releaseLock(); }
}

function doGet() { return json_({ ok: false }); } // Never expose the lead table.
