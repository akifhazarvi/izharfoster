/* Izhar Foster — Engineering Chat Widget
   Single-file, self-contained. Drops into any page with one script tag.
   Three modes inside one icon:
     1. Floating chat-bubble icon (bottom-right, pulse, "Chat with engineering" label slide-out)
     2. Slide-up panel — choice of "Quick chat (60s)" or "WhatsApp now"
     3. Scripted 4-step conversation flow → WhatsApp handoff with structured message
   Honest: never claims to be AI. Label = "Engineering desk."
   No backend. WhatsApp deep-link to +92 321 5383544.
   GA4 events: chat_open, chat_step, chat_submit, chat_dismiss.
   Dismiss state persisted in sessionStorage. */
(function(){
  'use strict';

  // Don't run on the wizard or ROI calc — both are themselves the conversion flow
  var path = location.pathname;
  if (/\/(concept-wizard|roi-payback)(\.html)?\/?$/.test(path)) return;

  var WA = '923215383544';
  var SESSION_DISMISS_KEY = 'izhar_chat_dismissed_v1';
  var STATE_KEY = 'izhar_chat_state_v1';

  // ----- state -----
  var state = {
    open: false,
    step: 'choice', // 'choice' → 'sector' → 'capacity' → 'city' → 'phone' → 'done'
    answers: {}
  };
  try {
    var saved = sessionStorage.getItem(STATE_KEY);
    if (saved){ var s = JSON.parse(saved); if (s) state = Object.assign(state, s); }
  } catch(_){}

  // ----- abort if dismissed this session -----
  try {
    if (sessionStorage.getItem(SESSION_DISMISS_KEY) === '1') return;
  } catch(_){}

  // ----- helpers -----
  function $(id){ return document.getElementById(id); }
  function track(event, params){
    if (!window.gtag) return;
    try { gtag('event', event, params || {}); } catch(_){}
  }
  function persist(){
    try { sessionStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch(_){}
  }

  // ----- styles (single inject) -----
  var css = '\
.ifc-fab{position:fixed;bottom:20px;right:20px;z-index:9998;cursor:pointer;display:flex;align-items:center;gap:10px}\
.ifc-fab-btn{width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#E36A1E 0%,#FF8847 100%);box-shadow:0 6px 24px rgba(227,106,30,.45),0 2px 8px rgba(0,0,0,.15);display:flex;align-items:center;justify-content:center;color:#fff;font-size:26px;border:0;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease;position:relative}\
.ifc-fab-btn:hover{transform:scale(1.08);box-shadow:0 8px 32px rgba(227,106,30,.6)}\
.ifc-fab-btn:focus-visible{outline:3px solid rgba(227,106,30,.4);outline-offset:3px}\
.ifc-fab-btn::before{content:"";position:absolute;inset:-6px;border-radius:50%;border:2px solid #E36A1E;opacity:0;animation:ifc-pulse 2.4s ease-out infinite}\
@keyframes ifc-pulse{0%{transform:scale(1);opacity:.7}100%{transform:scale(1.6);opacity:0}}\
.ifc-fab-dot{position:absolute;top:8px;right:8px;width:10px;height:10px;border-radius:50%;background:#22C55E;border:2px solid #fff;box-shadow:0 0 0 0 rgba(34,197,94,.6);animation:ifc-dot 2s ease-out infinite}\
@keyframes ifc-dot{0%{box-shadow:0 0 0 0 rgba(34,197,94,.6)}70%{box-shadow:0 0 0 10px rgba(34,197,94,0)}100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}}\
.ifc-fab-label{background:#0A1F3D;color:#F5F2EC;padding:10px 14px;border-radius:24px;font:600 .85rem var(--font-mono,"JetBrains Mono",ui-monospace,monospace);box-shadow:0 4px 16px rgba(10,31,61,.3);opacity:0;transform:translateX(20px);transition:opacity .3s ease,transform .3s ease;white-space:nowrap;pointer-events:none}\
.ifc-fab.is-revealed .ifc-fab-label{opacity:1;transform:translateX(0)}\
.ifc-fab-label::after{content:"";position:absolute;right:-6px;top:50%;transform:translateY(-50%);border:6px solid transparent;border-left-color:#0A1F3D}\
.ifc-fab.is-open .ifc-fab-label{display:none}\
.ifc-fab.is-open .ifc-fab-btn::before{display:none}\
\
.ifc-panel{position:fixed;bottom:90px;right:20px;width:min(380px,calc(100vw - 32px));max-height:min(620px,calc(100vh - 120px));background:#fff;border-radius:16px;box-shadow:0 20px 60px rgba(10,31,61,.28),0 6px 18px rgba(0,0,0,.1);z-index:9999;display:none;flex-direction:column;overflow:hidden;font-family:inherit;animation:ifc-slide-up .25s ease}\
.ifc-panel.is-open{display:flex}\
@keyframes ifc-slide-up{from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)}}\
@media (max-width:480px){.ifc-panel{right:8px;bottom:80px;width:calc(100vw - 16px);max-height:calc(100vh - 100px)}}\
\
.ifc-head{padding:16px 18px;background:linear-gradient(135deg,#0A1F3D 0%,#1A3A66 100%);color:#F5F2EC;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}\
.ifc-head-meta{display:flex;align-items:center;gap:12px}\
.ifc-head-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#E36A1E 0%,#FF8847 100%);display:flex;align-items:center;justify-content:center;font:700 .95rem var(--font-mono,"JetBrains Mono",ui-monospace,monospace);color:#fff;flex-shrink:0;position:relative}\
.ifc-head-avatar::after{content:"";position:absolute;bottom:0;right:0;width:10px;height:10px;border-radius:50%;background:#22C55E;border:2px solid #0A1F3D}\
.ifc-head-text strong{display:block;font-size:.95rem;font-weight:600;line-height:1.2}\
.ifc-head-text span{display:block;font:.7rem/.9 var(--font-mono,"JetBrains Mono",ui-monospace,monospace);color:rgba(245,242,236,.65);letter-spacing:.05em;margin-top:3px;text-transform:uppercase}\
.ifc-close{background:transparent;border:0;color:rgba(245,242,236,.7);font-size:24px;cursor:pointer;padding:4px 8px;line-height:1;border-radius:6px;transition:background .15s}\
.ifc-close:hover{background:rgba(255,255,255,.1);color:#fff}\
\
.ifc-body{flex:1;padding:18px;overflow-y:auto;display:flex;flex-direction:column;gap:12px;background:#FAFAF7;-webkit-overflow-scrolling:touch}\
.ifc-msg{max-width:88%;padding:10px 14px;border-radius:14px;font-size:.92rem;line-height:1.5;animation:ifc-msg-in .25s ease}\
@keyframes ifc-msg-in{from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)}}\
.ifc-msg-bot{background:#fff;color:#2A2D33;border:1px solid #ECE7DC;align-self:flex-start;border-top-left-radius:4px}\
.ifc-msg-user{background:linear-gradient(135deg,#E36A1E 0%,#FF8847 100%);color:#fff;align-self:flex-end;border-top-right-radius:4px}\
.ifc-typing{display:flex;gap:4px;padding:14px 16px;background:#fff;border:1px solid #ECE7DC;border-radius:14px;border-top-left-radius:4px;align-self:flex-start;max-width:80px}\
.ifc-typing span{width:7px;height:7px;border-radius:50%;background:#9CA3AF;animation:ifc-blink 1.4s ease-in-out infinite}\
.ifc-typing span:nth-child(2){animation-delay:.2s}\
.ifc-typing span:nth-child(3){animation-delay:.4s}\
@keyframes ifc-blink{0%,80%,100%{opacity:.3;transform:translateY(0)} 40%{opacity:1;transform:translateY(-3px)}}\
\
.ifc-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}\
.ifc-chip{padding:8px 14px;background:#fff;border:1.5px solid #ECE7DC;border-radius:20px;font:500 .82rem inherit;color:#0A1F3D;cursor:pointer;transition:all .15s}\
.ifc-chip:hover{border-color:#E36A1E;background:#FFF3EC}\
.ifc-chip.is-primary{background:#E36A1E;color:#fff;border-color:#E36A1E}\
.ifc-chip.is-primary:hover{background:#D45A0E}\
.ifc-chip.is-wa{background:#22C55E;color:#fff;border-color:#22C55E}\
.ifc-chip.is-wa:hover{background:#16A34A}\
\
.ifc-input-row{padding:12px 16px;background:#fff;border-top:1px solid #ECE7DC;display:flex;gap:8px;align-items:center;flex-shrink:0}\
.ifc-input{flex:1;padding:10px 14px;border:1.5px solid #ECE7DC;border-radius:24px;font:1rem inherit;color:#0A1F3D;background:#FAFAF7;outline:none;transition:border-color .15s}\
.ifc-input:focus{border-color:#E36A1E;background:#fff}\
.ifc-input-send{width:42px;height:42px;border-radius:50%;background:#E36A1E;border:0;color:#fff;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s}\
.ifc-input-send:hover{background:#D45A0E}\
.ifc-input-send:disabled{background:#D6D1C5;cursor:not-allowed}\
\
.ifc-foot{padding:10px 16px;background:#fff;border-top:1px solid #ECE7DC;font:.7rem/.9 var(--font-mono,"JetBrains Mono",ui-monospace,monospace);color:#6E6F73;text-align:center;letter-spacing:.04em;flex-shrink:0}\
.ifc-foot a{color:#E36A1E;text-decoration:none;font-weight:600}\
.ifc-foot a:hover{text-decoration:underline}\
';
  var styleTag = document.createElement('style');
  styleTag.setAttribute('data-ifc', '1');
  styleTag.textContent = css;

  // ----- DOM construction -----
  function createWidget(){
    // Remove any existing .fab-wa pill (replaced)
    var oldPill = document.querySelector('.fab-wa');
    if (oldPill) oldPill.remove();

    document.head.appendChild(styleTag);

    var fab = document.createElement('div');
    fab.className = 'ifc-fab';
    fab.id = 'ifc-fab';
    fab.innerHTML = '\
<span class="ifc-fab-label">Chat with engineering &middot; reply in 24h</span>\
<button class="ifc-fab-btn" id="ifc-fab-btn" aria-label="Open engineering chat" type="button">\
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>\
  <span class="ifc-fab-dot" aria-hidden="true"></span>\
</button>';

    var panel = document.createElement('div');
    panel.className = 'ifc-panel';
    panel.id = 'ifc-panel';
    panel.setAttribute('role','dialog');
    panel.setAttribute('aria-label','Engineering chat');
    panel.innerHTML = '\
<div class="ifc-head">\
  <div class="ifc-head-meta">\
    <div class="ifc-head-avatar">IF</div>\
    <div class="ifc-head-text"><strong>Engineering desk</strong><span>Online &middot; replies in 24h</span></div>\
  </div>\
  <button class="ifc-close" id="ifc-close" aria-label="Close chat" type="button">&times;</button>\
</div>\
<div class="ifc-body" id="ifc-body" role="log" aria-live="polite"></div>\
<div class="ifc-input-row" id="ifc-input-row" style="display:none">\
  <input class="ifc-input" id="ifc-input" type="text" placeholder="Type your answer..." aria-label="Your answer">\
  <button class="ifc-input-send" id="ifc-input-send" aria-label="Send" type="button">&rarr;</button>\
</div>\
<div class="ifc-foot">Real engineer &middot; not AI &middot; <a href="/tools/concept-wizard">full wizard &rarr;</a></div>';

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    wireEvents();

    // reveal label after 1.5s on first page view of session
    if (!sessionStorage.getItem('ifc_label_shown')){
      setTimeout(function(){
        fab.classList.add('is-revealed');
        try { sessionStorage.setItem('ifc_label_shown', '1'); } catch(_){}
        // auto-hide label after 8s
        setTimeout(function(){ fab.classList.remove('is-revealed'); }, 8000);
      }, 1500);
    }
  }

  // ----- script flow -----
  var sectorOptions = [
    { v:'pharma', label:'Pharma / vaccines' },
    { v:'fresh-produce', label:'Fresh produce' },
    { v:'frozen', label:'Frozen / meat / seafood' },
    { v:'dairy-beverage', label:'Dairy / beverage' },
    { v:'ca', label:'Dates / CA storage' },
    { v:'3pl', label:'3PL / multi-temp' },
    { v:'industrial', label:'Industrial' },
    { v:'unsure', label:'Not sure yet' }
  ];
  var capacityOptions = [
    { v:'micro', label:'< 25 tonnes' },
    { v:'small', label:'25–250 tonnes' },
    { v:'medium', label:'250–1,500 tonnes' },
    { v:'large', label:'1,500–5,000 tonnes' },
    { v:'mega', label:'5,000+ tonnes' },
    { v:'unsure', label:'Not sure' }
  ];
  var cityOptions = [
    { v:'Lahore', label:'Lahore' },
    { v:'Karachi', label:'Karachi' },
    { v:'Islamabad', label:'Islamabad' },
    { v:'Multan', label:'Multan' },
    { v:'Faisalabad', label:'Faisalabad' },
    { v:'Saudi Arabia', label:'Saudi Arabia' },
    { v:'UAE / GCC', label:'UAE / GCC' },
    { v:'Other', label:'Other' }
  ];

  function addBot(text, opts){
    opts = opts || {};
    var body = $('ifc-body');
    if (opts.typing){
      var t = document.createElement('div');
      t.className = 'ifc-typing';
      t.id = 'ifc-typing-tmp';
      t.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(t);
      body.scrollTop = body.scrollHeight;
      setTimeout(function(){
        var tt = $('ifc-typing-tmp');
        if (tt) tt.remove();
        var m = document.createElement('div');
        m.className = 'ifc-msg ifc-msg-bot';
        m.innerHTML = text;
        body.appendChild(m);
        body.scrollTop = body.scrollHeight;
        if (opts.then) opts.then();
      }, opts.delay || 700);
    } else {
      var m = document.createElement('div');
      m.className = 'ifc-msg ifc-msg-bot';
      m.innerHTML = text;
      body.appendChild(m);
      body.scrollTop = body.scrollHeight;
      if (opts.then) opts.then();
    }
  }
  function addUser(text){
    var body = $('ifc-body');
    var m = document.createElement('div');
    m.className = 'ifc-msg ifc-msg-user';
    m.textContent = text;
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
  }
  function addChips(options, onPick){
    var body = $('ifc-body');
    var wrap = document.createElement('div');
    wrap.className = 'ifc-chips';
    options.forEach(function(o){
      var c = document.createElement('button');
      c.className = 'ifc-chip';
      c.type = 'button';
      c.textContent = o.label;
      c.addEventListener('click', function(){
        wrap.remove();
        addUser(o.label);
        onPick(o);
      });
      wrap.appendChild(c);
    });
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }
  function showInput(placeholder, validator, onSubmit){
    var row = $('ifc-input-row');
    var input = $('ifc-input');
    var send = $('ifc-input-send');
    row.style.display = 'flex';
    input.placeholder = placeholder || 'Type your answer...';
    input.value = '';
    setTimeout(function(){ input.focus(); }, 100);
    function fire(){
      var v = input.value.trim();
      if (validator && !validator(v)){
        input.style.borderColor = '#C0392B';
        setTimeout(function(){ input.style.borderColor = ''; }, 1500);
        return;
      }
      addUser(v);
      input.value = '';
      row.style.display = 'none';
      onSubmit(v);
    }
    send.onclick = fire;
    input.onkeydown = function(e){ if (e.key === 'Enter') fire(); };
  }
  function hideInput(){
    $('ifc-input-row').style.display = 'none';
  }

  // ----- the script -----
  function startScript(){
    state.step = 'sector';
    state.answers = {};
    persist();
    track('chat_step', { step: 'sector' });
    addBot('Got it. <strong>What are you storing?</strong>', { typing: true, delay: 500, then: function(){
      addChips(sectorOptions, function(pick){
        state.answers.sector = pick.v;
        state.answers.sectorLabel = pick.label;
        persist();
        track('chat_step', { step: 'capacity', sector: pick.v });
        state.step = 'capacity';
        setTimeout(function(){
          addBot('Roughly how much per month?', { typing: true, delay: 600, then: function(){
            addChips(capacityOptions, function(pick){
              state.answers.capacity = pick.v;
              state.answers.capacityLabel = pick.label;
              persist();
              track('chat_step', { step: 'city', capacity: pick.v });
              state.step = 'city';
              setTimeout(function(){
                addBot('Where will the site be?', { typing: true, delay: 600, then: function(){
                  addChips(cityOptions, function(pick){
                    state.answers.city = pick.v;
                    persist();
                    track('chat_step', { step: 'phone', city: pick.v });
                    state.step = 'phone';
                    setTimeout(function(){
                      addBot('Last one. <strong>What\'s your WhatsApp number?</strong> An engineer will reply with a sized concept and indicative budget within 24 hours.', { typing: true, delay: 800, then: function(){
                        showInput('+92 / +966 / +971 ...', function(v){
                          return v && v.length >= 7 && /[0-9]/.test(v);
                        }, function(phone){
                          state.answers.phone = phone;
                          persist();
                          handoff();
                        });
                      }});
                    }, 200);
                  });
                }});
              }, 200);
            });
          }});
        }, 200);
      });
    }});
  }

  function handoff(){
    track('chat_submit', state.answers);
    state.step = 'done';
    persist();
    addBot('Building your brief...', { typing: true, delay: 800, then: function(){
      // Compose WhatsApp message
      var msg =
        'Hi Izhar Foster — chat widget brief.\n\n' +
        '*Project*\n' +
        '• Sector: ' + state.answers.sectorLabel + '\n' +
        '• Capacity: ' + state.answers.capacityLabel + '\n' +
        '• Location: ' + state.answers.city + '\n\n' +
        '*Contact*\n' +
        '• Phone / WhatsApp: ' + state.answers.phone + '\n\n' +
        'Please send back a sized concept and an indicative budget within 24 hours.\n' +
        '— Sent via izharfoster.com chat (' + location.pathname + ')';
      var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
      addBot('Got it. Tap below to open WhatsApp — your structured brief is pre-filled, just hit <strong>Send</strong>.', { delay: 600, then: function(){
        var body = $('ifc-body');
        var wrap = document.createElement('div');
        wrap.className = 'ifc-chips';
        wrap.innerHTML =
          '<a class="ifc-chip is-wa" href="' + url + '" target="_blank" rel="noopener" style="text-decoration:none;display:inline-block">Open WhatsApp &rarr;</a>' +
          '<a class="ifc-chip" href="/tools/roi-payback" style="text-decoration:none;display:inline-block">Play with ROI numbers</a>';
        body.appendChild(wrap);
        body.scrollTop = body.scrollHeight;
        // auto-open WhatsApp after a short delay for mobile UX
        setTimeout(function(){
          window.open(url, '_blank', 'noopener');
        }, 600);
      }});
    }});
  }

  // ----- the choice screen (first time panel opens) -----
  function renderChoice(){
    var body = $('ifc-body');
    body.innerHTML = '';
    addBot('Hi — Izhar Foster engineering desk. <strong>How can we help?</strong>', { delay: 0, then: function(){
      addChips([
        { label:'Quick chat — 60 seconds', v:'chat' },
        { label:'WhatsApp now — skip the bot', v:'wa-direct' },
        { label:'Full wizard (5 questions)', v:'wizard' }
      ], function(pick){
        if (pick.v === 'chat'){
          startScript();
        } else if (pick.v === 'wa-direct'){
          track('chat_step', { step: 'wa_direct' });
          var directMsg = 'Hi Izhar Foster — quick enquiry from your website (' + location.pathname + '). Could you call me back?';
          window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(directMsg), '_blank', 'noopener');
          addBot('Opening WhatsApp...', { delay: 300 });
        } else if (pick.v === 'wizard'){
          track('chat_step', { step: 'to_wizard' });
          window.location.href = '/tools/concept-wizard';
        }
      });
    }});
  }

  // ----- event wiring -----
  function open(){
    state.open = true;
    persist();
    $('ifc-panel').classList.add('is-open');
    $('ifc-fab').classList.add('is-open');
    track('chat_open', { from: location.pathname });
    // resume from state.step if mid-flow, otherwise start fresh
    if (state.step === 'done' || state.step === 'choice' || !state.answers.sector){
      state.step = 'choice';
      renderChoice();
    } else {
      // Light "welcome back" then continue from where left off
      $('ifc-body').innerHTML = '';
      addBot('Welcome back. Let\'s pick up where we left off.', { delay: 0, then: function(){
        // re-trigger appropriate step
        if (state.step === 'capacity'){
          addBot('Roughly how much per month?', { typing: true, then: function(){
            addChips(capacityOptions, function(pick){
              state.answers.capacity = pick.v; state.answers.capacityLabel = pick.label; persist();
              state.step = 'city';
              setTimeout(function(){ open(); }, 200);
            });
          }});
        } else {
          // simplest: restart for any other partial step
          state.step = 'choice';
          state.answers = {};
          renderChoice();
        }
      }});
    }
  }
  function close(){
    state.open = false;
    persist();
    $('ifc-panel').classList.remove('is-open');
    $('ifc-fab').classList.remove('is-open');
    hideInput();
    track('chat_dismiss', { step: state.step });
  }
  function dismissForSession(){
    try { sessionStorage.setItem(SESSION_DISMISS_KEY, '1'); } catch(_){}
    var fab = $('ifc-fab');
    var panel = $('ifc-panel');
    if (fab) fab.remove();
    if (panel) panel.remove();
  }

  function wireEvents(){
    $('ifc-fab-btn').addEventListener('click', function(){
      if (state.open) close();
      else open();
    });
    $('ifc-close').addEventListener('click', close);
    // Esc to close
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && state.open) close();
    });
  }

  // ----- init -----
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }

  // expose for potential debugging / from-CTA triggering
  window.IzharChat = {
    open: open,
    close: close,
    dismiss: dismissForSession,
    reset: function(){ try { sessionStorage.removeItem(STATE_KEY); sessionStorage.removeItem(SESSION_DISMISS_KEY); } catch(_){} location.reload(); }
  };
})();
