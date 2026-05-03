# izharfoster.com — Performance / CWV Audit
**Date:** 2026-05-02  
**Method:** Static source analysis (no Lighthouse run — lab-only, no field data available)  
**Estimated lab Performance score: 62–68 / 100**

---

## Executive summary

The homepage is well-structured for performance with the most critical patterns already in place: WebP hero image with `<picture>` + `srcset`, `fetchpriority="high"` on the LCP element, `<link rel="preload">` for the hero WebP, and `defer` on all JS. The main drag on score is (a) a render-blocking Google Fonts request in the critical path, (b) a 147 KB unversioned CSS file with no long-term browser cache, (c) cross-origin YouTube thumbnail loaded from `i.ytimg.com` at full `maxresdefault` size without a `fetchpriority="low"` hint, and (d) a track.js dynamic injection pattern that fires a synchronous script-find loop at parse time. No `<model-viewer>` was found in the homepage or any scanned service page — that concern can be closed.

---

## Estimated CWV status (lab, no CrUX)

| Metric | Estimate | Status |
|--------|----------|--------|
| LCP | ~2.2–3.0 s (slow connections) | Needs improvement on 3G / mobile Pakistan ISP |
| INP | ~80–120 ms | Good — no heavy sync handlers |
| CLS | ~0.05 | Good — hero image has explicit `width`/`height` |

75th-percentile pass/fail cannot be confirmed without CrUX field data. Recommend running `python scripts/crux_history.py https://izharfoster.com --json` once Google API is configured.

---

## Issues by priority

---

### P1 — Render-blocking Google Fonts (LCP impact: ~300–600 ms)

**Location:** `index.html` line 43; same pattern on every service/blog page.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

The `<link rel="stylesheet">` to `fonts.googleapis.com` is **synchronous**. The browser must fetch and parse the Google Fonts CSS before it can complete CSSOM and paint. On a slow connection this is a direct LCP blocker.

**Fix — add `media="print" onload` trick or convert to `rel="preload"`:**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style"
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
      onload="this.rel='stylesheet'">
<noscript>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap">
</noscript>
```

The CSS already defines `--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif` — the system fallbacks mean text is readable before web fonts arrive.  
**Estimated gain: 300–600 ms LCP reduction on 3G; 80–150 ms on fast 4G.**

---

### P2 — Full CSS file not cache-versioned (repeat-visit LCP + bandwidth)

**Location:** `vercel.json` lines 18–21 + `css/style.css` (151 KB uncompressed).

```json
{ "source": "/css/(.*)",
  "headers": [{ "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }] }
```

`max-age=0, must-revalidate` forces a conditional request on every page view, even if the file hasn't changed. At 151 KB, Brotli will compress it to ~25–30 KB, but the round-trip to validate cache still costs ~50–200 ms RTT on Pakistan mobile networks.

**Fix — add a content hash to the filename or use `s-maxage` for the CDN edge:**

Option A (preferred — no build step needed): rename `style.css` to `style.v2.css` (or any date suffix) after each breaking change, and update the `<link>` tag. Set:
```json
{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
```

Option B (simpler but less aggressive): keep filename, add a query string `?v=20260501` to every `<link href="css/style.css?v=...">`, and set `s-maxage=86400` so Vercel CDN edges cache it for 24 hours without browser needing to revalidate.

Same applies to `/js/main.js` and `/js/track.js`.  
**Estimated gain: ~50–200 ms on repeat visits; CDN edge cache miss reduction on all pages.**

---

### P3 — GA4 gtag.js loads synchronously before `<meta charset>` (LCP blocker risk)

**Location:** `index.html` lines 4–11 (same on every page including `services/cold-stores.html`).

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-PLY0DZWNEM"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  ...
</script>
```

The `async` attribute is correct — gtag.js will not block HTML parsing once the network response arrives. However it appears **before** `<meta charset="UTF-8">` and `<meta name="viewport">`. While modern browsers handle this, Chrome's pre-parser may request the GA4 bundle before the viewport meta is processed, and the inline `<script>` block following it is a synchronous execution point. This is a minor issue but worth fixing.

**Fix:** Move the GA4 snippet to after `<meta charset>` and `<meta name="viewport">`, keeping the `async` attribute. This matches Google's own updated Tag Setup guidance.

**Estimated gain: negligible in isolation, but eliminates any early-parser blocking risk.**

---

### P4 — YouTube thumbnail cross-origin fetch without priority hint (LCP / bandwidth)

**Location:** `index.html` lines 397–402.

```html
<img class="hp-video-poster"
     src="https://i.ytimg.com/vi/o9kuFWVYY5w/maxresdefault.jpg"
     loading="lazy"
     decoding="async">
```

This is a cross-origin request to `i.ytimg.com`. Two problems:

1. `maxresdefault.jpg` is typically 1280×720 at 100–200 KB. For a decorative poster that is only visible at `padding-bottom: 42.85%` (21:9 container, max-width 1240 px), `hqdefault.jpg` (480×360, ~20–30 KB) or `sddefault.jpg` is sufficient. The `onerror` fallback already references `hqdefault` — use it as the primary source.

2. No explicit `width`/`height` attributes are present on this `<img>`. The container uses `padding-bottom: 42.85%` to set aspect ratio, so the image is absolutely positioned and CLS is fine — but the browser cannot prioritise it correctly without intrinsic dimensions.

**Fix:**

```html
<img class="hp-video-poster"
     src="https://i.ytimg.com/vi/o9kuFWVYY5w/hqdefault.jpg"
     width="480" height="360"
     loading="lazy"
     decoding="async"
     fetchpriority="low"
     alt="">
```

Self-host the thumbnail as a WebP for zero cross-origin DNS lookup overhead (saves ~50–120 ms on first visit). Download once via CI and store in `images/`.

**Estimated gain: 50–120 ms (DNS + connection to i.ytimg.com); 80–150 KB weight saving per page load.**

---

### P5 — track.js dynamic injection: synchronous script-scan loop at parse time (INP risk)

**Location:** `js/main.js` lines 9–24 (`loadTracker` IIFE).

```js
(function loadTracker() {
  if (window.IzharTrack) return;
  var scripts = document.getElementsByTagName('script');
  var prefix = 'js/';
  for (var i = 0; i < scripts.length; i++) {
    var src = scripts[i].getAttribute('src') || '';
    if (/(^|\/)main\.js(\?|$)/.test(src)) { ... }
  }
  var s = document.createElement('script');
  s.src = prefix + 'track.js';
  s.defer = true;
  (document.head || document.documentElement).appendChild(s);
})();
```

This loop runs **inside main.js which is loaded with `defer`** — so it fires after HTML parse, which is acceptable. However it dynamically injects `track.js` as a second deferred script. This means:

- track.js is not discoverable by the browser's preload scanner (no `<link rel="preload">`)
- The inject-then-defer chain means track.js starts loading after main.js finishes executing, adding a serial waterfall

The homepage HTML (line 549) **already has `<script src="js/track.js" defer>`** as a direct tag. The `loadTracker()` call inside main.js checks `window.IzharTrack` and returns early if already present — so on the homepage it is a no-op. On other pages (service pages, blog pages), the `<script src="../js/main.js" defer>` tag dynamically injects `../js/track.js`.

**Potential issue:** On service/blog pages, track.js is not declared in HTML — only dynamically injected. The preload scanner cannot discover it. On a slow connection this adds a serial latency of one full RTT after main.js parses.

**Fix:** Add `<script src="../js/track.js" defer>` directly to every service/blog page `<head>` (or to a shared include pattern). Remove the `loadTracker()` dynamic injection — it becomes dead code once all pages declare track.js directly.  
**Estimated gain: ~100–300 ms on service pages on 3G (removes one serial script round-trip).**

---

### P6 — CSS `Cache-Control: max-age=0` on JS files (same as P2 — called out separately)

**Location:** `vercel.json` lines 24–27.

```json
{ "source": "/js/(.*)",
  "headers": [{ "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }] }
```

`main.js` (23 KB) and `track.js` (17 KB) revalidate on every page load. As traffic grows and users navigate between pages, these round-trips accumulate.

**Fix:** Same as P2 — append a version query string to the `<script src>` tags (`main.js?v=20260501`) and change the Cache-Control to `public, max-age=31536000, immutable` for the `/js/` route. Bump the version string on each deploy.

---

### P7 — CLS risk: cert-strip and logo-carousel images without explicit dimensions on some badges

**Location:** `index.html` lines 237–267 (cert badges), lines 182–201 (logo carousel).

Cert badges (ISO, ASTM, HACCP, WHO) have `width="110" height="38"` — good. The logo-carousel `<img>` tags (client-nestle.svg, client-engro.svg, etc.) have no explicit `width`/`height` attributes. SVG images loaded cross-origin (here they're local) don't carry intrinsic dimensions from the `<img>` element.

```html
<img src="images/client-nestle.svg" alt="Nestlé Pakistan" decoding="async" loading="lazy">
```

If the SVG has a `viewBox` but no `width`/`height` on the root SVG element, the browser cannot compute the aspect ratio and reserves 0×0 until load — causing a layout shift when the carousel snaps to size.

**Fix:** Add explicit `width` and `height` to each carousel `<img>`:
```html
<img src="images/client-nestle.svg" alt="Nestlé Pakistan"
     width="120" height="40" decoding="async" loading="lazy">
```
Apply the same to all 9 logo-slide images.  
**Estimated CLS reduction: 0.02–0.05 (avoids carousel reflow).**

---

### P8 — Hero image: `decoding="async"` on LCP element may delay paint

**Location:** `index.html` line 156.

```html
<img src="images/hero-facility-1280.jpg" alt="..."
     width="2048" height="1152"
     fetchpriority="high"
     decoding="async">
```

`fetchpriority="high"` is correct. However `decoding="async"` tells the browser to decode the image off the main thread asynchronously, which on some Chrome versions can delay the LCP paint signal because the image may not be composited into the first frame. For the LCP candidate, `decoding="sync"` (or omitting `decoding` entirely) is preferred so the browser paints it in the same frame as decode.

**Fix:** Remove `decoding="async"` from the hero `<img>`. Keep it on all other non-LCP images.  
**Estimated gain: 50–150 ms LCP reduction (prevents async decode delaying first paint).**

---

### P9 — `main.js` scrubber auto-cycle uses `setInterval` with image preloading on main thread

**Location:** `js/main.js` lines 284–288.

```js
const cycle = setInterval(() => {
  if (userInteracted) { clearInterval(cycle); return; }
  idx = (idx + 1) % stops.length;
  setActive(idx);
}, 4500);
```

`setActive()` creates a `new Image()` to preload the next scrubber image and does DOM manipulation synchronously inside the interval. This runs on the main thread every 4.5 seconds.

The `setActive` function performs: DOM reads (`.querySelector`), DOM writes (`img.src`, `badge.innerHTML`, `specs.innerHTML`, `link.href`, `pin.style.top`), and `requestAnimationFrame` scheduling — all triggered from a `setInterval`.

On a mid-range Android phone (which is the dominant Pakistan device), `setInterval` callbacks can cause jank if they coincide with a user scroll or click. The `requestAnimationFrame` wrapper inside `setActive` partially mitigates this, but the initial DOM writes before `rAF` are still synchronous.

**Fix:** Wrap the entire `setActive` body in `requestAnimationFrame` rather than just the `img.classList.add('shown')` call. Also, if the scrubber section is not visible (`IntersectionObserver` check), skip the tick entirely to save CPU.  
**Estimated INP improvement: 10–30 ms on mid-range Android.**

---

### P10 — No resource hints for Google Fonts font files (after P1 fix)

Once Google Fonts loads asynchronously, the browser still needs to fetch the actual `.woff2` files from `fonts.gstatic.com`. The `preconnect` to `fonts.gstatic.com` helps but doesn't preload the specific font files.

**Optional enhancement:** If the font URL is stable (it is for Inter 400/500/600/700), add `<link rel="preload">` for the two most critical weights:

```html
<link rel="preload" as="font" type="font/woff2" crossorigin
      href="https://fonts.gstatic.com/s/inter/v19/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2">
```

Note: the exact hash changes with Google Fonts CDN updates. A more stable approach is to self-host Inter (add it to `css/` and serve with `max-age=31536000, immutable`).  
**Estimated gain: 100–200 ms FOUT reduction (Inter loads in same round-trip as CSS).**

---

## What is already good — do not regress

| Item | Status |
|------|--------|
| Hero `<picture>` with WebP + JPEG srcset + 3 widths (800/1280/1920w) | Correct |
| `<link rel="preload" as="image">` for hero WebP in `<head>` with `imagesrcset` | Correct |
| `fetchpriority="high"` on hero `<img>` | Correct |
| All product card images have `loading="lazy"` + `decoding="async"` + explicit `width`/`height` | Correct |
| `<script src="js/main.js" defer>` and `<script src="js/track.js" defer>` on homepage | Correct |
| Vercel Speed Insights (`/_vercel/speed-insights/script.js`) and Web Analytics (`/_vercel/insights/script.js`) both `defer` | Correct |
| YouTube iframe **not** embedded on page load — click-to-play pattern via JS | Correct (avoids 400–800 ms YouTube script load on every homepage visit) |
| `images/` cache: `max-age=31536000, immutable` | Correct |
| HTML pages: `s-maxage=86400, stale-while-revalidate=604800` | Correct |
| No `<model-viewer>` on homepage or any service page scanned | Confirmed absent — not a performance risk |
| `overflow-x: clip` on `html` and `body` | Correct (no phantom horizontal scroll) |
| `img, video, iframe, svg { max-width: 100%; height: auto }` reset | Correct |
| track.js scroll listener uses `{ passive: true }` | Correct (no INP penalty) |
| Counter animation uses `IntersectionObserver` + `requestAnimationFrame` | Correct |
| Rail pin uses `IntersectionObserver` | Correct |

---

## Vercel CDN status

- HTTP/2: yes (Vercel serves HTTP/2 by default on all deployments)
- Brotli: yes (Vercel auto-compresses JS/CSS/HTML with Brotli level 11)
- CDN cache: images `immutable` (correct); CSS/JS `max-age=0` (needs versioning — see P2/P6)
- HSTS: present (`max-age=31536000; includeSubDomains; preload`)
- No explicit `Vary: Accept-Encoding` header set — Vercel handles this at the edge automatically

---

## Mobile-specific risks (post recent "Mobile UX" commit)

- No `<model-viewer>` found on any page — no WebGL/battery risk on mobile
- `menu-toggle` DOM teleport to `<body>` on ≤720px is correct and doesn't cause CLS (element is removed from document flow before repaint via `document.createComment` anchor)
- `body { position: fixed }` scroll-lock pattern for mobile drawer is correct but fires synchronous style writes — acceptable since it's a user-initiated interaction (INP does not count drawer-open latency beyond the tap)
- Cert scroller and logo carousel both use CSS `animation` (GPU-composited `transform`) — no layout thrash on scroll

**One risk:** The `syncTeleport` function runs on `window.matchMedia change` which fires synchronously during orientation change. If the navigation drawer is open during a rotate event, the teleport + `window.scrollTo` could cause a compound layout shift. Low probability, low impact.

---

## Quick-win checklist (prioritised)

1. Make Google Fonts non-blocking (P1) — affects every page, biggest single LCP gain
2. Remove `decoding="async"` from hero `<img>` (P8) — 1-line fix, ~50–150 ms LCP
3. Swap YouTube poster to `hqdefault.jpg` + add explicit dimensions (P4) — weight saving + CLS hygiene
4. Version-stamp `style.css`, `main.js`, `track.js` and set `immutable` cache (P2/P6) — repeat-visit performance
5. Add `<script src="../js/track.js" defer>` directly to all service/blog pages (P5) — removes serial script chain
6. Add explicit `width`/`height` to logo-carousel SVG `<img>` tags (P7) — CLS insurance
7. Move GA4 snippet below viewport meta (P3) — parser hygiene
8. Wrap scrubber `setActive` in `requestAnimationFrame` (P9) — mid-range Android INP
