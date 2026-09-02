/* Izhar Foster — walk-in cold room 3D configurator.

   Deliberately CSS 3D transforms, not WebGL. A walk-in is six flat rectangles
   and a door; that is exactly what CSS 3D is good at, and it buys us things a
   glTF pipeline does not:

     - It updates in the same frame as the input. The existing IzharViz
       re-encodes a glTF to base64 and swaps a Blob URL on every change, which
       stutters on the mid-range Androids most of this site's traffic is on.
     - No dependency. model-viewer + three.js is ~300 KB before a pixel is
       drawn; this file is a few KB and needs nothing.
     - Labels stay DOM text, so dimension callouts are crisp at any zoom and
       are readable by a screen reader instead of being baked into a canvas.
     - The assembly sequence is just a class toggle plus a CSS transition.

   Coordinates. The room is centred on the origin. CSS +Y points DOWN, so the
   floor sits at y = +h/2 and the ceiling at y = -h/2.

   The one idea that keeps this file small: every wall-mounted thing is placed
   in a WALL-LOCAL frame (see wallBase). In that frame local +x runs along the
   wall's span, local +y is vertical, and local +z points out of the room. So
   the door, its jambs, its thickness reveals and both skins are authored once
   in 2D and work identically on all four walls — no per-side special cases.

   Cutaway falls out of backface-visibility rather than per-frame maths: with
   the outer skins hidden, each wall's remaining inner face points into the
   room, so the two walls nearest the camera drop out on their own as you orbit.

   Public API:
     IzharRoom3D.mount(el)
     IzharRoom3D.update(state)     // partial; re-lays out
     IzharRoom3D.setMode('assembled'|'cutaway'|'exploded')
     IzharRoom3D.setStep(n) / .play() / .stop()
*/
(function () {
  'use strict';

  /* Build sequence. `step` on a part is the index at which it first appears;
     parts are cumulative, so step N shows everything with step <= N. The copy
     is the actual erection order for a cam-lock panel box. */
  var STEPS = [
    { key: 'slab',  name: 'Site & slab',     note: 'Level slab, power and drainage set out. The slab wants to be flat to about ±3 mm per metre — panel joints will not pull tight on a wavy floor, and every gap you leave is a permanent heat leak.' },
    { key: 'floor', name: 'Floor panels',    note: 'Insulated floor panels laid on the slab with joints staggered and sealed. On grade the floor sees an 18 °C soil boundary rather than ambient, which is why a floor panel matters far more on a freezer than on a chiller.' },
    { key: 'wall',  name: 'Wall panels',     note: 'Wall panels stood on the floor perimeter and drawn together on cam-locks. FireSafe PIR core, λ 0.022 W/m·K aged to BS EN 14509. Corners go up first so the box is square before the runs close.' },
    { key: 'ceil',  name: 'Ceiling panels',  note: 'Ceiling panels dropped in and locked to the wall heads. Past roughly 4 m of clear span they are hung from the building steel instead of self-spanning.' },
    { key: 'door',  name: 'Door & hardware', note: 'Door frame, leaf, hinges and inside safety release fitted. Any freezer door needs heater tape in the frame, or the gasket freezes to the jamb and the leaf tears on opening.' },
    { key: 'evap',  name: 'Evaporator',      note: 'Evaporator mounted clear of the door throw so its air pattern is not fighting the infiltration it is meant to handle. Condensate drain trapped, and trace-heated on low temp.' },
    { key: 'cdu',   name: 'Condensing unit', note: 'Condensing unit sited in free, shaded air, then pipework, electrics and controls run back. In a Pakistani summer a unit in direct sun loses capacity exactly when you need it most.' },
    { key: 'done',  name: 'Commissioned',    note: 'Pressure test, evacuate, charge, set superheat, then pull the room down and hold it. Handover with the temperature log already running.' }
  ];

  var SUPPORTED = typeof CSS !== 'undefined' && CSS.supports &&
                  CSS.supports('transform-style', 'preserve-3d');

  var root = null, stage = null, world = null, room = null;
  var elStepName = null, elStepNote = null, elStepBar = null, elStepIdx = null;
  var chips = {};
  var parts = [];
  var timer = null;
  var reduceMotion = false;

  var st = {
    w: 2.4, l: 3.0, h: 2.4,
    panel: 0.100, module: 1.15,
    doorPos: 'front', doorType: 'hinged', doorW: 0.9, doorH: 2.0,
    temp: 'chiller', loc: 'indoor', ref: 'split', floor: 'insulated'
  };

  var view = { yaw: -34, pitch: 16, mode: 'assembled', step: STEPS.length - 1 };

  /* ---------- helpers ---------- */

  function mk(parent, cls, tag) {
    var d = document.createElement(tag || 'div');
    if (cls) d.className = cls;
    (parent || room).appendChild(d);
    return d;
  }

  function part(el, step, explode, kind) {
    var p = { el: el, step: step, explode: explode || [0, 0, 0], kind: kind, base: '' };
    parts.push(p);
    return p;
  }

  function roomC() {
    return st.temp === 'chiller' ? 4 : st.temp === 'freezer' ? -22 : -18;
  }

  function panelsAcross(span) {
    return Math.max(1, Math.ceil(span / st.module));
  }

  /* Outward normal direction per wall, used for the exploded view. */
  var NORMAL = { back: [0, 0, -1], front: [0, 0, 1], left: [-1, 0, 0], right: [1, 0, 0] };

  /* ---------- build the DOM once ---------- */

  function build() {
    room.innerHTML = '';
    parts = [];

    var doorOn = st.doorPos;

    part(mk(room, 'r3d-face r3d-slab'), 0, [0, 0, 0], 'slab');

    part(mk(room, 'r3d-face r3d-floor r3d-floor-out'), 1, [0, 0.5, 0], 'floor-out');
    part(mk(room, 'r3d-face r3d-floor r3d-floor-in'), 1, [0, 0.5, 0], 'floor-in');

    part(mk(room, 'r3d-face r3d-ceil r3d-ceil-in'), 3, [0, -0.9, 0], 'ceil-in');
    part(mk(room, 'r3d-face r3d-ceil r3d-ceil-out'), 3, [0, -0.9, 0], 'ceil-out');

    ['back', 'front', 'left', 'right'].forEach(function (side) {
      var hasDoor = (side === doorOn);
      var ex = NORMAL[side];

      ['out', 'in'].forEach(function (skin) {
        var strips = hasDoor ? ['top', 'jambL', 'jambR'] : ['full'];
        strips.forEach(function (strip) {
          var f = mk(room, 'r3d-face r3d-wall r3d-w-' + side + ' r3d-' + skin);
          part(f, 2, ex, 'wall|' + side + '|' + skin + '|' + strip);
        });
      });

      /* The three faces inside the opening that expose panel thickness. This
         is the detail that makes the box read as 100 mm PIR, not cardboard. */
      if (hasDoor) {
        ['revL', 'revR', 'revT'].forEach(function (r) {
          part(mk(room, 'r3d-face r3d-reveal'), 2, ex, 'rev|' + side + '|' + r);
        });
      }
    });

    part(mk(room, 'r3d-face r3d-doorframe'), 4, NORMAL[doorOn], 'doorframe');

    var leafWrap = mk(room, 'r3d-leafwrap');
    var leaf = mk(leafWrap, 'r3d-leaf r3d-leaf-' + st.doorType);
    mk(leaf, 'r3d-leaf-handle');
    var lp = part(leafWrap, 4, NORMAL[doorOn], 'leaf');
    lp.leaf = leaf;

    boxPart('evap', 5, [0, -0.6, 0]);
    boxPart('cdu', 6, [0, 0, 1.4]);
    part(mk(room, 'r3d-face r3d-pipe'), 6, [0, 0, 1.4], 'pipe');
  }

  function boxPart(name, step, explode) {
    ['t', 'b', 'n', 'f', 'l', 'r'].forEach(function (side) {
      var el = mk(room, 'r3d-face r3d-' + name + ' r3d-' + name + '-' + side);
      part(el, step, explode, name + '|' + side);
    });
  }

  /* ---------- transforms ---------- */

  /* Maps a wall-local frame onto one of the four walls. In the returned frame
     local +x runs along the wall span, +y is vertical, +z points OUT of the
     room, and the origin sits at the centre of the wall's INNER surface. */
  function wallBase(side, w, l) {
    if (side === 'front') return 'translate3d(0,0,' + (l / 2) + 'px)';
    if (side === 'back')  return 'translate3d(0,0,' + (-l / 2) + 'px) rotateY(180deg)';
    if (side === 'left')  return 'translate3d(' + (-w / 2) + 'px,0,0) rotateY(-90deg)';
    return 'translate3d(' + (w / 2) + 'px,0,0) rotateY(90deg)';
  }

  function wallSpan(side, w, l) {
    return (side === 'left' || side === 'right') ? l : w;
  }

  function opposite(side) {
    return { front: 'back', back: 'front', left: 'right', right: 'left' }[side];
  }

  /* Which wall the condensing unit sits on. Never the door wall — on site it
     keeps the unit out of the traffic and away from the warm air the door
     dumps. Of the two walls the default camera can see (front and right at
     yaw −34°), pick whichever is not carrying the door, so the unit is
     actually in shot rather than hidden round the back. */
  function cduSide() {
    return (st.doorPos === 'right') ? 'front' : 'right';
  }

  function cduBox(w, l, h, tp, S) {
    var side = cduSide();
    var n = NORMAL[side];
    var onSideWall = (side === 'left' || side === 'right');
    var mono = (st.ref === 'mono');

    var cw = Math.min(wallSpan(side, w, l) * 0.42, 1.0 * S);
    var ch = Math.min(h * 0.30, 0.7 * S);
    var cd = Math.min(0.5 * S, 0.5 * S);
    /* A monoblock hangs on the wall head; a split/remote unit stands off it. */
    var gap = mono ? 0 : 0.8 * S;
    var dist = tp + gap + cd / 2;

    return {
      x: n[0] * ((w / 2) + (n[0] ? dist : 0)),
      y: mono ? (-h / 2 + ch / 2 + tp) : (h / 2 - ch / 2),
      z: n[2] * ((l / 2) + (n[2] ? dist : 0)),
      /* Depth follows the wall normal, width runs along the wall. */
      sx: onSideWall ? cd : cw,
      sy: ch,
      sz: onSideWall ? cw : cd,
      gap: gap
    };
  }

  /* Centre a face on its own middle, then place it. */
  function place(p, transform, wpx, hpx) {
    p.base = transform;
    p.el.style.width = Math.max(0, wpx) + 'px';
    p.el.style.height = Math.max(0, hpx) + 'px';
    p.el.style.marginLeft = (-Math.max(0, wpx) / 2) + 'px';
    p.el.style.marginTop = (-Math.max(0, hpx) / 2) + 'px';
  }

  /* One face of an axis-aligned box centred at (cx,cy,cz). */
  function placeBoxFace(p, side, cx, cy, cz, sx, sy, sz) {
    var hx = sx / 2, hy = sy / 2, hz = sz / 2;
    var b = 'translate3d(' + cx + 'px,' + cy + 'px,' + cz + 'px) ';
    if (side === 'n')      place(p, b + 'translate3d(0,0,' + hz + 'px)', sx, sy);
    else if (side === 'f') place(p, b + 'translate3d(0,0,' + (-hz) + 'px) rotateY(180deg)', sx, sy);
    else if (side === 'l') place(p, b + 'translate3d(' + (-hx) + 'px,0,0) rotateY(-90deg)', sz, sy);
    else if (side === 'r') place(p, b + 'translate3d(' + hx + 'px,0,0) rotateY(90deg)', sz, sy);
    else if (side === 't') place(p, b + 'translate3d(0,' + (-hy) + 'px,0) rotateX(90deg)', sx, sz);
    else                   place(p, b + 'translate3d(0,' + hy + 'px,0) rotateX(90deg)', sx, sz);
  }

  /* ---------- layout: metres -> pixels ---------- */

  function layout() {
    if (!room || !SUPPORTED) return;

    var box = stage.getBoundingClientRect();
    var availW = Math.max(160, box.width - 24);
    var availH = Math.max(140, box.height - 24);

    var W = st.w, L = st.l, H = st.h, t = st.panel;
    var yaw = view.yaw * Math.PI / 180, pitch = view.pitch * Math.PI / 180;

    /* Fit the projected bounding box into the stage. The CDU sits outside the
       shell on a split system, so pad the footprint before solving for scale. */
    var padZ = (st.ref === 'mono') ? 0.4 : 1.6;
    var fw = W + 2 * t, fl = L + 2 * t + padZ;
    var projW = Math.abs(fw * Math.cos(yaw)) + Math.abs(fl * Math.sin(yaw));
    var projH = (Math.abs(fw * Math.sin(yaw)) + Math.abs(fl * Math.cos(yaw))) * Math.abs(Math.sin(pitch)) +
                (H + 2 * t) * Math.abs(Math.cos(pitch));

    var S = Math.min(availW / Math.max(projW, 0.1), availH / Math.max(projH, 0.1));
    S *= (view.mode === 'exploded') ? 0.60 : 0.86;
    S = Math.max(6, S);

    var w = W * S, l = L * S, h = H * S, tp = Math.max(2, t * S);
    var modPx = Math.max(6, st.module * S);
    var expl = (view.mode === 'exploded') ? Math.max(26, Math.min(0.85 * S, 84)) : 0;

    room.style.setProperty('--mod', modPx + 'px');

    /* Door opening, clamped so it always fits the wall it is cut into. */
    var span = wallSpan(st.doorPos, W, L);
    var dW = Math.max(0.5, Math.min(st.doorW, span - 0.25)) * S;
    var dH = Math.max(0.8, Math.min(st.doorH, H - 0.12)) * S;

    parts.forEach(function (p) {
      var k = p.kind, m;

      if (k === 'slab') {
        place(p, 'translate3d(0,' + (h / 2 + tp) + 'px,0) rotateX(90deg)',
              w + tp * 2 + 46, l + tp * 2 + 46);

      } else if (k === 'floor-in') {
        place(p, 'translate3d(0,' + (h / 2) + 'px,0) rotateX(90deg)', w, l);
      } else if (k === 'floor-out') {
        place(p, 'translate3d(0,' + (h / 2 + tp) + 'px,0) rotateX(90deg)', w + tp * 2, l + tp * 2);

      } else if (k === 'ceil-in') {
        place(p, 'translate3d(0,' + (-h / 2) + 'px,0) rotateX(90deg)', w, l);
      } else if (k === 'ceil-out') {
        place(p, 'translate3d(0,' + (-h / 2 - tp) + 'px,0) rotateX(90deg)', w + tp * 2, l + tp * 2);

      } else if (k.indexOf('wall|') === 0) {
        m = k.split('|');
        placeWall(p, m[1], m[2], m[3], { w: w, l: l, h: h, tp: tp, dW: dW, dH: dH });

      } else if (k.indexOf('rev|') === 0) {
        m = k.split('|');
        placeReveal(p, m[1], m[2], { w: w, l: l, h: h, tp: tp, dW: dW, dH: dH });

      } else if (k === 'doorframe') {
        /* Sits just proud of the outer skin, framing the opening. */
        place(p, wallBase(st.doorPos, w, l) +
                 ' translate3d(0,' + (h / 2 - dH / 2) + 'px,' + (tp + 0.6) + 'px)',
              dW + tp * 1.4, dH + tp * 0.7);

      } else if (k === 'leaf') {
        /* Wrapper is centred on the opening; the leaf inside hangs from its
           own left edge so the swing pivots on the hinge, not the centre. */
        place(p, wallBase(st.doorPos, w, l) +
                 ' translate3d(0,' + (h / 2 - dH / 2) + 'px,' + (tp + 1.4) + 'px)', dW, dH);
        p.leaf.style.width = dW + 'px';
        p.leaf.style.height = dH + 'px';

      } else if (k.indexOf('evap|') === 0) {
        var ew = Math.min(w * 0.5, 1.2 * S), eh = Math.min(h * 0.22, 0.42 * S), ed = Math.min(l * 0.16, 0.45 * S);
        /* Hang it on the wall opposite the door so it is never in the throw. */
        var ez = (st.doorPos === 'back') ? (l / 2 - ed / 2 - 2) : (-l / 2 + ed / 2 + 2);
        var ex2 = 0;
        if (st.doorPos === 'left')  { ex2 = w / 2 - ew / 2 - 2; ez = 0; }
        if (st.doorPos === 'right') { ex2 = -w / 2 + ew / 2 + 2; ez = 0; }
        placeBoxFace(p, k.split('|')[1], ex2, -h / 2 + eh / 2 + 3, ez, ew, eh, ed);

      } else if (k.indexOf('cdu|') === 0) {
        var c = cduBox(w, l, h, tp, S);
        placeBoxFace(p, k.split('|')[1], c.x, c.y, c.z, c.sx, c.sy, c.sz);

      } else if (k === 'pipe') {
        /* Runs along the outside of the CDU wall, at high level, from the
           shell out to the unit — so the two read as one system. */
        var c2 = cduBox(w, l, h, tp, S);
        var n = NORMAL[cduSide()];
        var gap = Math.max(4, c2.gap);
        place(p, 'translate3d(' + (n[0] * (w / 2 + tp + gap / 2)) + 'px,' +
                 (-h / 2 + 0.4 * S) + 'px,' + (n[2] * (l / 2 + tp + gap / 2)) + 'px)' +
                 (n[0] ? ' rotateY(90deg)' : '') + ' rotateX(90deg)',
             Math.max(4, tp * 0.6), gap);
      }
    });

    applyVisibility(expl, S);
    applyWorld();
    paintChips();
  }

  /* Wall skins. Everything is authored in the wall-local frame, so the same
     four lines of maths are correct on all four sides. */
  function placeWall(p, side, skin, strip, d) {
    var span = wallSpan(side, d.w, d.l);
    /* Front and back outer skins run past the side walls by one panel
       thickness so the corners lap instead of leaving a gap that shows the
       cold interior colour as a sliver. Side walls butt into them, as panels
       actually do. */
    var out = (skin === 'out');
    if (out && (side === 'front' || side === 'back')) span += 2 * d.tp;
    var z = out ? d.tp : 0;
    /* The inner skin must face into the room, hence the flip. */
    var facing = out ? '' : ' rotateY(180deg)';
    var base = wallBase(side, d.w, d.l);

    /* Outer skins also run one thickness past the wall head and the floor, so
       they lap the ceiling and floor panels. Without this the gap between the
       wall top and the ceiling plane shows the cold interior colour as a thin
       blue line along every top edge. Inner skins stay at the true clear
       height, because that is the volume the numbers are calculated on. */
    var ext = out ? d.tp : 0;
    var hFull = d.h + 2 * ext;

    if (strip === 'full') {
      place(p, base + ' translate3d(0,0,' + z + 'px)' + facing, span, hFull);
      return;
    }
    if (strip === 'top') {
      /* Above the opening: from the wall head down to the lintel. */
      var ht = d.h + ext - d.dH;
      place(p, base + ' translate3d(0,' + (-(ext + d.dH) / 2) + 'px,' + z + 'px)' + facing,
            span, ht);
      return;
    }
    /* Side jambs, floor to lintel, one each side of the opening. */
    var jw = (span - d.dW) / 2;
    var sgn = (strip === 'jambL') ? -1 : 1;
    var x = sgn * (d.dW + span) / 4;
    place(p, base + ' translate3d(' + x + 'px,' +
             (d.h / 2 - d.dH / 2 + ext / 2) + 'px,' + z + 'px)' + facing,
          jw, d.dH + ext);
  }

  /* The three surfaces inside the opening, which is where panel thickness
     becomes visible. Authored in the same wall-local frame. */
  function placeReveal(p, side, which, d) {
    var base = wallBase(side, d.w, d.l);
    var zc = d.tp / 2;
    if (which === 'revT') {
      place(p, base + ' translate3d(0,' + (d.h / 2 - d.dH) + 'px,' + zc + 'px) rotateX(90deg)',
            d.dW, d.tp);
    } else {
      var sgn = (which === 'revL') ? -1 : 1;
      place(p, base + ' translate3d(' + (sgn * d.dW / 2) + 'px,' +
               (d.h / 2 - d.dH / 2) + 'px,' + zc + 'px) rotateY(90deg)', d.tp, d.dH);
    }
  }

  /* Reveal state + exploded offsets, folded into the same transform string so
     the CSS transition interpolates dimension changes and build steps alike. */
  function applyVisibility(expl, S) {
    var cut = (view.mode === 'cutaway');

    /* In cutaway the door only makes sense while its wall is still standing.
       A wall is "near" — and therefore culled by backface-visibility — when its
       outward normal turns to face the camera, which for the four vertical
       walls depends on yaw alone. */
    var yr = view.yaw * Math.PI / 180;
    var doorN = NORMAL[st.doorPos];
    var doorWallNear = (-doorN[0] * Math.sin(yr) + doorN[2] * Math.cos(yr)) > 0;

    parts.forEach(function (p) {
      var shown = view.step >= p.step;
      var outerSkin = /\|out\|/.test(p.kind) || p.kind === 'ceil-out' || p.kind === 'floor-out';
      /* Cutaway drops the outer skins and the ceiling; each remaining wall then
         faces inward, so backface-visibility hides the near ones by itself. */
      if (cut && (outerSkin || p.kind === 'ceil-in')) shown = false;
      if (cut && doorWallNear && (p.kind === 'doorframe' || p.kind === 'leaf')) shown = false;

      var tr = p.base;
      if (shown && expl) {
        tr += ' translate3d(' + (p.explode[0] * expl) + 'px,' +
              (p.explode[1] * expl) + 'px,' + (p.explode[2] * expl) + 'px)';
      }
      if (!shown) tr += ' translate3d(0,' + (0.55 * S) + 'px,0)';

      p.el.style.transform = tr;
      p.el.style.opacity = shown ? '' : '0';

      if (p.leaf) {
        var open = (view.step === 4) || view.mode === 'exploded';
        p.leaf.style.transform = open
          ? (st.doorType === 'sliding' ? 'translate3d(96%,0,0)' : 'rotateY(-64deg)')
          : 'none';
      }
    });

    root.classList.toggle('is-cutaway', cut);
    root.classList.toggle('is-exploded', view.mode === 'exploded');
  }

  function applyWorld() {
    world.style.transform = 'rotateX(' + view.pitch + 'deg) rotateY(' + view.yaw + 'deg)';
  }

  /* ---------- HUD ---------- */

  function paintChips() {
    var ft = function (m) { return (m * 3.28084).toFixed(1); };
    var c = roomC();
    if (chips.temp) chips.temp.textContent = (c > 0 ? '+' : '') + c + ' °C';
    if (chips.dims) chips.dims.textContent = st.w + ' × ' + st.l + ' × ' + st.h + ' m';
    if (chips.dimsFt) chips.dimsFt.textContent = ft(st.w) + ' × ' + ft(st.l) + ' × ' + ft(st.h) + ' ft';
    if (chips.panel) chips.panel.textContent = Math.round(st.panel * 1000) + ' mm PIR';
    if (chips.count) chips.count.textContent = totalWallPanels() + ' wall panels';

    if (stage) {
      stage.setAttribute('aria-label',
        'Three-dimensional preview: a ' + st.w + ' by ' + st.l + ' by ' + st.h +
        ' metre walk-in ' + (st.temp === 'freezer' ? 'freezer' : st.temp === 'dual' ? 'dual-zone room' : 'chiller') +
        ' in ' + Math.round(st.panel * 1000) + ' millimetre PIR panels, door on the ' +
        st.doorPos + ' wall. Build stage ' + (view.step + 1) + ' of ' + STEPS.length +
        ': ' + STEPS[view.step].name + '. Drag sideways to rotate.');
    }
  }

  function totalWallPanels() {
    return 2 * panelsAcross(st.w) + 2 * panelsAcross(st.l);
  }

  function paintStep() {
    var s = STEPS[view.step];
    if (elStepName) elStepName.textContent = s.name;
    if (elStepNote) elStepNote.textContent = s.note;
    if (elStepIdx) elStepIdx.textContent = (view.step + 1) + ' / ' + STEPS.length;
    if (elStepBar) elStepBar.style.width = ((view.step + 1) / STEPS.length * 100) + '%';
    if (root) {
      [].forEach.call(root.querySelectorAll('[data-r3d-step]'), function (b) {
        b.setAttribute('aria-current', String(+b.dataset.r3dStep === view.step));
      });
    }
    /* The text step list outside the viewer mirrors the same state. */
    [].forEach.call(document.querySelectorAll('.wib-steps li'), function (li, i) {
      li.setAttribute('aria-current', String(i === view.step));
    });
  }

  /* ---------- interaction ---------- */

  /* Drag to orbit. On touch we claim the gesture only once it is clearly more
     horizontal than vertical — a vertical swipe has to keep scrolling the page,
     or a sticky viewer becomes a scroll trap on a phone. */
  function wireDrag() {
    var down = false, claimed = false, sx = 0, sy = 0, y0 = 0, p0 = 0, touch = false;

    stage.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.r3d-ui')) return;
      down = true; claimed = false;
      touch = (e.pointerType === 'touch');
      sx = e.clientX; sy = e.clientY; y0 = view.yaw; p0 = view.pitch;
      if (!touch) {
        claimed = true;
        try { stage.setPointerCapture(e.pointerId); } catch (err) {}
        world.style.transition = 'none';
      }
    });

    stage.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;

      if (!claimed) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (Math.abs(dx) <= Math.abs(dy)) { down = false; return; }   // let the page scroll
        claimed = true;
        try { stage.setPointerCapture(e.pointerId); } catch (err) {}
        world.style.transition = 'none';
      }

      e.preventDefault();
      view.yaw = y0 + dx * 0.5;
      view.pitch = Math.max(-6, Math.min(72, p0 - dy * 0.32));
      applyWorld();
    }, { passive: false });

    var end = function () {
      if (!down) return;
      down = false; claimed = false;
      world.style.transition = '';
      layout();                                  // refit now the angle changed
    };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);

    stage.addEventListener('keydown', function (e) {
      var k = e.key, d = e.shiftKey ? 15 : 5;
      if (k === 'ArrowLeft') view.yaw -= d;
      else if (k === 'ArrowRight') view.yaw += d;
      else if (k === 'ArrowUp') view.pitch = Math.min(72, view.pitch + d);
      else if (k === 'ArrowDown') view.pitch = Math.max(-6, view.pitch - d);
      else return;
      e.preventDefault();
      layout();
    });
  }

  /* ---------- public ---------- */

  function setMode(m) {
    view.mode = m;
    if (m !== 'assembled') view.step = STEPS.length - 1;
    stop();
    if (root) {
      [].forEach.call(root.querySelectorAll('[data-r3d-mode]'), function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.r3dMode === m));
      });
    }
    layout(); paintStep();
  }

  function setStep(n) {
    view.step = Math.max(0, Math.min(STEPS.length - 1, n));
    layout(); paintStep();
  }

  function play() {
    stop();
    if (view.mode !== 'assembled') { view.mode = 'assembled'; }
    view.step = 0; layout(); paintStep();
    if (reduceMotion) { setStep(STEPS.length - 1); return; }
    root.classList.add('is-playing');
    timer = setInterval(function () {
      if (view.step >= STEPS.length - 1) { stop(); return; }
      setStep(view.step + 1);
    }, 1400);
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
    if (root) root.classList.remove('is-playing');
  }

  function update(next) {
    var rebuild = false;
    if (next) {
      ['doorPos', 'doorType', 'ref'].forEach(function (k) {
        if (next[k] !== undefined && next[k] !== st[k]) rebuild = true;
      });
      Object.keys(next).forEach(function (k) { if (next[k] !== undefined) st[k] = next[k]; });
    }
    if (!SUPPORTED) return;
    if (rebuild) build();
    layout();
  }

  function mount(el) {
    root = el;
    stage = el.querySelector('.r3d-stage');
    if (!stage) return;

    if (!SUPPORTED) { root.classList.add('is-unsupported'); return; }

    reduceMotion = !!(window.matchMedia &&
                      window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (reduceMotion) root.classList.add('is-reduced');

    world = mk(stage, 'r3d-world');
    room = mk(world, 'r3d-room');

    ['temp', 'dims', 'dimsft', 'panel', 'count'].forEach(function (n) {
      chips[n === 'dimsft' ? 'dimsFt' : n] = el.querySelector('[data-r3d="' + n + '"]');
    });
    elStepName = el.querySelector('[data-r3d="stepname"]');
    elStepNote = el.querySelector('[data-r3d="stepnote"]');
    elStepBar = el.querySelector('[data-r3d="stepbar"]');
    elStepIdx = el.querySelector('[data-r3d="stepidx"]');

    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-r3d-mode],[data-r3d-act],[data-r3d-step]');
      if (!b) return;
      e.preventDefault();
      if (b.dataset.r3dMode) return setMode(b.dataset.r3dMode);
      if (b.dataset.r3dStep !== undefined && !b.dataset.r3dAct) {
        stop();
        return setStep(+b.dataset.r3dStep);
      }
      var a = b.dataset.r3dAct;
      if (a === 'play') return (timer ? stop() : play());
      if (a === 'next') { stop(); return setStep(view.step + 1); }
      if (a === 'prev') { stop(); return setStep(view.step - 1); }
      if (a === 'reset') {
        view.yaw = -34; view.pitch = 16; stop();
        return setStep(STEPS.length - 1);
      }
      if (a === 'collapse') {
        var c = root.classList.toggle('is-collapsed');
        b.setAttribute('aria-expanded', String(!c));
        b.textContent = c ? 'Show 3D' : 'Hide 3D';
        if (!c) layout();
      }
    });

    build();
    wireDrag();
    layout();
    paintStep();

    var raf;
    window.addEventListener('resize', function () {
      if (raf) return;
      raf = requestAnimationFrame(function () { raf = null; layout(); });
    }, { passive: true });
  }

  window.IzharRoom3D = {
    mount: mount, update: update, setMode: setMode, setStep: setStep,
    play: play, stop: stop, steps: STEPS,
    panelsAcross: panelsAcross,
    totalWallPanels: totalWallPanels,
    supported: function () { return SUPPORTED; }
  };
})();
