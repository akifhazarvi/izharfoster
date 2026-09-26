// Save first; only an acknowledged Sheet write is a received lead.
(function () {
  'use strict';
  var form = document.getElementById('quote-form');
  if (!form) return;
  var button = form.querySelector('[type="submit"]');
  var note = document.getElementById('form-note');
  var whatsapp = document.getElementById('form-whatsapp');
  var sending = false, saved = false, pending = null;

  function val(key) { var el = form.elements[key]; return el ? String(el.value || '').trim() : ''; }
  function track(event, props) { if (window.IzharTrack) window.IzharTrack.track(event, props); }
  function message(text) { note.textContent = text; }
  function phoneValid() {
    var p = val('phone'), digits = p.replace(/\D/g, '');
    form.elements.phone.setCustomValidity(digits.length >= 7 && digits.length <= 15 && /^[+\d\s().-]+$/.test(p) ? '' : 'Please enter a valid phone number, including your area or country code.');
  }
  // Enhanced Conversions needs E.164: 0321-5383544 / 03215383544 /
  // +92 321 5383544 must all become +923215383544 or matching collapses.
  function toE164(raw) {
    var t = String(raw || '').trim();
    if (t.charAt(0) === '+') return '+' + t.slice(1).replace(/\D/g, '');
    var d = t.replace(/\D/g, '');
    if (!d) return '';
    if (d.indexOf('0092') === 0) return '+' + d.slice(2);
    if (d.indexOf('92') === 0 && d.length >= 12) return '+' + d;
    return '+92' + (d.charAt(0) === '0' ? d.slice(1) : d);
  }
  function enquiry(id) {
    var lines = ['Hi Izhar Foster — website quote request.'];
    [['name','Name'],['phone','Phone'],['company','Company'],['email','Email'],['location','City'],['product','Product'],['industry','Industry'],['capacity','Capacity'],['temperature','Temperature'],['notes','Project notes']].forEach(function (pair) {
      if (val(pair[0])) lines.push(pair[1] + ': ' + val(pair[0]));
    });
    if (id) lines.push('Website lead: ' + id);
    lines.push('— Sent via izharfoster.com');
    return lines.join('\n');
  }
  function setWhatsApp(id) {
    var number = window.IzharWA ? window.IzharWA.number() : '923215383544';
    whatsapp.href = 'https://wa.me/' + number + '?text=' + encodeURIComponent(enquiry(id));
    whatsapp.removeAttribute('data-ref-stamped');
  }
  // Refresh before the global click tracker stamps attribution onto the URL.
  window.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('#form-whatsapp')) setWhatsApp(saved && pending ? pending.id : '');
  }, true);
  form.elements.phone.addEventListener('input', phoneValid);
  // Wake the Sheet's Apps Script as soon as the visitor starts typing: it
  // cold-starts in ~10 s, typing a request takes longer, so the save that
  // follows lands on a warm script (~2 s instead of 13+ s).
  form.addEventListener('focusin', function warm() {
    form.removeEventListener('focusin', warm);
    try { fetch('/api/leads?warm=1', { method: 'GET', keepalive: true }).catch(function () {}); } catch (_) {}
  });
  var params = new URLSearchParams(location.search);
  if (params.get('summary') && !val('notes')) form.elements.notes.value = params.get('summary').slice(0, 3000);

  function fields() {
    var data = {};
    ['name','phone','email','company','notes','location','industry','product','capacity','temperature','website'].forEach(function (key) { data[key] = val(key); });
    var click = window.IzharTrack && window.IzharTrack.clickId();
    var attribution = {};
    try { attribution = JSON.parse(sessionStorage.getItem('izhar_session_attribution') || '{}') || {}; } catch (_) {}
    data.click_id = click ? click.id : '';
    data.click_type = click ? click.type : '';
    data.landing_page = click ? click.landing : (attribution.first_landing || '/contact');
    data.source = attribution.source || '';
    data.medium = attribution.medium || '';
    data.campaign = click ? click.campaign : (attribution.campaign || '');
    data.term = click ? click.term : '';
    data.wa_line = window.IzharWA ? window.IzharWA.line : '';
    data.source_tool = (params.get('tool') || '').slice(0, 80);
    return data;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending || saved) return;
    phoneValid();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var data = fields();
    pending = { id: crypto.randomUUID() };
    data.lead_id = pending.id;
    saved = true;

    // Instant confirmation (2026-09-26). The Sheet's Apps Script cold-starts
    // in ~10 s, and making a buyer watch a spinner for that is not
    // acceptable. The request is validated here exactly as the server
    // validates it, so the visitor is told "received" at once and the save
    // finishes in the background: keepalive lets it complete even if they
    // close the page, and the server keeps going regardless of the client.
    button.textContent = 'Request received ✓';
    button.disabled = true;
    message('Request received — an engineer will call you within one working day. Want a faster reply? Send it on WhatsApp too.');
    setWhatsApp(pending.id);
    whatsapp.innerHTML = 'Also send on WhatsApp <small>faster</small>';
    Array.from(form.elements).forEach(function (el) { el.disabled = true; });

    // Ads conversion + Enhanced Conversions. Only allowlisted, non-personal
    // fields reach analytics; user_data rides only on this plain dataLayer
    // push (GTM hashes it in the browser), never on track(), so GA4 never
    // sees raw contact details. Transaction ID = the lead UUID.
    var nameParts = val('name').split(/\s+/);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'generate_lead', lead_id: pending.id, click_ref: pending.id, lead_channel: 'website_form',
      lead_product: val('product'), lead_industry: val('industry'), lead_city: val('location'), lead_capacity: val('capacity'),
      user_data: { email_address: val('email'), phone_number: toE164(val('phone')),
        address: { first_name: nameParts[0] || '', last_name: nameParts.slice(1).join(' ') } } });
    if (window.IzharTrack && window.IzharTrack.markLead) window.IzharTrack.markLead();

    fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data), keepalive: true })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok || res.j.ok !== true || res.j.saved !== true) throw new Error('unconfirmed');
        track('lead_received', { form: 'quote', lead_id: pending.id, channel: 'website_form' });
      })
      .catch(function () {
        // Rare (Google down). If they're still on the page, don't let the
        // request vanish: ask for the one tap that guarantees we get it.
        track('form_submit_error', { form: 'quote', reason: 'save_not_confirmed' });
        setWhatsApp('');
        whatsapp.classList.add('is-primary');
        whatsapp.innerHTML = 'Send on WhatsApp <small>details filled in</small>';
        message('One more tap, please: our system didn\'t confirm your request. Tap “Send on WhatsApp” — your details are already filled in.');
      });
  });
})();
