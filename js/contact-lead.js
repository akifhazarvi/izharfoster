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
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (sending || saved) return;
    phoneValid();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var data = fields(), fingerprint = JSON.stringify(data);
    // A retry after an ambiguous timeout reuses the same ID and contents.
    if (!pending || pending.fingerprint !== fingerprint) pending = { id: crypto.randomUUID(), fingerprint: fingerprint };
    data.lead_id = pending.id;
    sending = true;
    button.disabled = true;
    button.textContent = 'Saving your request…';
    form.setAttribute('aria-busy', 'true');
    message('Saving your request. Please keep this page open.');
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, 20000);
    try {
      var response = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), signal: controller.signal });
      var result = await response.json();
      if (!response.ok || result.ok !== true || result.saved !== true || result.lead_id !== pending.id) throw new Error('unconfirmed');
      saved = true;
      button.textContent = 'Request received';
      message('Request saved — an engineer will call you within one working day. Want a faster reply? Send it on WhatsApp too. Ref: ' + pending.id.slice(0, 8));
      setWhatsApp(pending.id);
      whatsapp.innerHTML = 'Also send on WhatsApp <small>faster</small>';
      // Only allowlisted, non-personal fields go to analytics. The existing
      // Ads tag uses click_ref as transaction ID; use the durable lead UUID.
      // user_data is for Enhanced Conversions: GTM hashes it in the browser
      // before it reaches Google. It rides only on this plain dataLayer push,
      // never on track(), so GA4 never sees raw contact details.
      var nameParts = val('name').split(/\s+/);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'generate_lead', lead_id: pending.id, click_ref: pending.id, lead_channel: 'website_form',
        lead_product: val('product'), lead_industry: val('industry'), lead_city: val('location'), lead_capacity: val('capacity'),
        user_data: { email_address: val('email'), phone_number: toE164(val('phone')),
          address: { first_name: nameParts[0] || '', last_name: nameParts.slice(1).join(' ') } } });
      if (window.IzharTrack && window.IzharTrack.markLead) window.IzharTrack.markLead();
      track('lead_received', { form: 'quote', lead_id: pending.id, channel: 'website_form' });
      Array.from(form.elements).forEach(function (el) { el.disabled = true; });
    } catch (_) {
      // Never strand a buyer who has already typed their details: hand the
      // same details to WhatsApp. window.open can be blocked after an await,
      // so the green button is promoted as the visible route either way.
      setWhatsApp('');
      whatsapp.classList.add('is-primary');
      whatsapp.innerHTML = 'Send on WhatsApp <small>details filled in</small>';
      button.textContent = 'Retry callback request';
      button.disabled = false;
      track('form_submit_error', { form: 'quote', reason: 'save_not_confirmed' });
      try { window.open(whatsapp.href, '_blank', 'noopener'); } catch (_) {}
      message('We couldn\'t save the callback request, so WhatsApp is opening with your details — tap Send there. If it didn\'t open, tap the green button.');
    } finally {
      clearTimeout(timer);
      sending = false;
      form.removeAttribute('aria-busy');
    }
  });
})();
