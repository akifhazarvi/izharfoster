# Izhar Foster — Design System

> **Remodel underway.** This design system remains the visual backbone, but the homepage and priority service pages are being restructured to lead with the cold-store funnel per [GROWTH-PLAN.md](GROWTH-PLAN.md) §13. The temperature rail, palette, and type scale below stay unchanged. What changes: block ordering, hero composition, trust band placement, calculator embeds, and visual demotion of off-strategy products.

## The big idea: the temperature is the brand

A vertical gradient spectrum (−40°C → +25°C) is a permanent left-edge rail across every page, with a small pin that moves to each section's `data-temp` value as the user scrolls. This is the ownable visual mechanic — competitors (Lineage, Americold, NewCold, Koldkraft) all use generic warehouse photos and corporate blue.

**Emotional positioning:** "Pakistan's pantry — preserved."
**Mission line:** "Pakistan's largest sandwich panel manufacturer" (verbatim from source — stronger than "leading provider")
**Hero formula:** `Engineered cold. Since 1959.` — italic gradient on "cold", monospace year.

## Colour palette (locked)

| Token | Hex | Role |
|---|---|---|
| `--t-cold` | `#0A1F3D` | Glacier — blast freezer (−40°C), dark backgrounds |
| `--t-mid` | `#4FC3D9` | Signal cyan — chiller anchor (0°C), accents |
| `--t-warm` | `#E36A1E` | Ember — CTA colour (+25°C), used surgically |
| `--paper` | `#F5F2EC` | Bone canvas — primary background, never pure white |
| `--paper-2` | `#ECE7DC` | Secondary surface |
| `--paper-3` | `#E2DCCC` | Tertiary surface / borders |
| `--ink` | `#0E0F11` | Typography |
| `--ink-2` | `#2A2D33` | Secondary ink |
| `--muted` | `#6E6F73` | Tertiary text / hints |
| `--line` | `rgba(14,15,17,.10)` | Hairlines |
| `--line-2` | `rgba(14,15,17,.06)` | Secondary hairlines |

`--t-warm` (ember) is the **only** accent colour. Use it on CTAs, hover states, the largest-contributor call-out in Tool 1, the pin marker on the rail, the warmth chip in visualisers. Never decoratively.

## Typography (locked)

| Use | Font | Notes |
|---|---|---|
| All body + display | **Inter** | Google Fonts; weights 400/500/600/700 |
| Every numeric | **JetBrains Mono** | Temperatures, capacities, years, phone numbers, addresses |

The mono numerals are the visual signature — like Stripe's rounded sans. Every number on the site must be set in JetBrains Mono via `font-family: var(--font-mono)`.

## Spacing & layout

| Token | Value |
|---|---|
| `--rail` | `72px` (desktop) → `56px` (≤1100) → `0px` (≤720) |
| `--gutter` | `clamp(20px, 4vw, 56px)` |
| `--container` | `1320px` |

## The spectrum rail

```html
<aside class="rail" aria-hidden="true">
  <span class="wm">−40°C → +25°C</span>
  <div class="marks">
    <span class="mark">−40°</span><span class="mark">−25°</span><span class="mark">0°</span><span class="mark">+10°</span><span class="mark warm">+25°</span>
  </div>
  <span class="pin" style="top:50%;"></span>
</aside>
```

- `position: fixed; top: 0; left: 0; width: var(--rail); height: 100vh`
- Gradient: `linear-gradient(to bottom, var(--t-cold), var(--t-mid) 50%, var(--t-warm))`
- Pin moves to section's `data-temp` attribute on scroll (mapped −40..+25 → 0..1 on rail height)
- All content is offset with `padding-left: var(--rail)` on `.shell`, NOT a grid column

## Mobile responsiveness — non-negotiable rules

### Reset (already in `style.css`)
```css
html { overflow-x: clip; -webkit-text-size-adjust: 100%; }
body { overflow-x: clip; max-width: 100vw; }
img, video, iframe, svg { max-width: 100%; height: auto; }
```

`overflow-x: clip` (not `hidden`) is mandatory — it doesn't establish a containing block, so it stops phantom scroll from `position: fixed; transform: translateX(100%)` drawers without breaking sticky positioning.

### Header collapse pattern
- **≤720 px**: hide `.nav-center`, `.nav-phone`, `.brand-tag`. Show hamburger.
- **≤480 px**: `Request quote` button collapses to a 36×36 round ember pill with a `→` glyph. Brand logo capped at 32 px height.
- Off-screen drawers: `.cc-panel, .calc-modal { max-width: 100vw }` at mobile breakpoint.

### Tap targets — WCAG 2.5.5 Level AAA
- All interactive elements ≥44×44 px on mobile (or ≥24×24 with adequate spacing per WCAG 2.5.8 Level AA fallback).
- Footer links need `padding: 10px 0` minimum to reach 36+ px height.
- Form radios/checkboxes need a labelled wrapper with `min-height: 44px`.

### Body text sizes on mobile
- Body paragraphs: ≥14 px.
- Secondary text / hints: ≥12 px (avoid going below).
- Footer links: ≥14 px.
- The earlier audit found `<span>` text at 11–12 px and `<p>` at 11.5 px in spec tables and fine print — bump these.

## Signature interactions

### Spectrum Scrubber (homepage only)
6-stop thermometer (−40°C to +25°C) — clicking any stop swaps a single product display (image + title + description + specs panel). Replaces the typical 6-card product grid.
- Auto-cycles every 4.5s until user interaction
- Arrow-key accessible
- Image crossfade on swap

### Impact counters
`[data-count]` elements animate from 0 on IntersectionObserver entry. Quartic ease-out, 1600ms duration.

### Rail pin tracker
`[data-temp]` attributes on sections. Pin jumps to the mapped position as sections enter viewport (threshold 0.4).

### 3D visualiser (Tool 1, Tool 6)
- `<model-viewer>` web component with brand-locked palette (cold → mid → warm temperature spectrum baked into the glTF).
- Heat-flow overlay (CSS keyframes — heat-arrow-drift, cold-particle-fall, respiration-pulse, door-burst, defrost-flash).
- "ambient X°C" + "inside Y°C" chips top-right / bottom-right.
- AR mode via `ar-button` slot (`webxr scene-viewer quick-look`).

### Calculator visual decision-support (post-launch)
- **V1 — Stacked load-component bar** in Tool 1: 22 px tall, inline % labels for segments ≥6%, "Largest contributor" call-out in `--t-warm`.
- **V2 — A-vs-B comparison chart** in Tool 2: side-by-side bars with Year-1 / 25-yr toggle.
- **V3 — Visualiser stat strip** in Tool 6: 4-cell grid below the 3D box (Crop / Tonnage / Footprint / Climate).

## Photography principles

Use real photography from `_scrape/images/`:
- Founder portrait (`founder.png`) — Engineer Izhar Ahmad Qureshi, transparent PNG
- Drone facility shots (`hero-facility.jpg`)
- Actual product photos (cold stores, PIR panels, doors, blast freezers)

NO stock decoration. NO icons-as-illustrations. NO placeholder gradient shapes.

**Every `<img>` must have `alt` text.** Describe the product or the engineering content; not the photo's composition.

## Layout language

- Asymmetric editorial grids (`minmax(0, 1.4fr) minmax(0, 1fr)` is the signature split)
- Heavy whitespace — sections breathe, padding clamps from 56 px → 80 px → 120 px as viewports grow
- Real specs in `<table>` elements with mono numerics
- Named projects with actual capacity + temperature data
- Restrained use of dark backgrounds — only spec bands and CTA banners

## Premium polish principles

These are the rules that separate "shipped" from "premium".

1. **Typography rhythm.** All vertical spacing on a 4 px (or 8 px) grid. No magic numbers. Section padding = `clamp(56px, 8vw, 120px)`. Element gaps come from a token set, not ad-hoc values.
2. **Hover states everywhere they belong.** Every link, button, and tile has a transition (`.15s` for state, `.32s` for layout). Borders darken, ember accent enters, shadow lifts subtly.
3. **Focus states pass WCAG.** `outline: 2px solid var(--t-warm); outline-offset: 2px` on every interactive element.
4. **Motion respects `prefers-reduced-motion`** — already wired for the rail pin and counters; extend to any new interactions.
5. **Loading states.** Calculators that fetch JSON show a `Loading…` skeleton, not flash-of-empty.
6. **Print styles.** Every PDF report uses `@page { size: A4; margin: 18mm 16mm }` and Inter at 11pt (already implemented in `Izhar.generatePDF`).
7. **Numbers always in JetBrains Mono.** Even in CTAs ("Talk to us in **24 hours**" — `24` is mono).
8. **Dates use sentence-case month names.** `27 April 2026`, not `27/04/2026` and not `April 27, 2026`.
9. **Phone numbers in international format with non-breaking spaces.** `+92 42 3538 3543` with `&nbsp;` between groups.
10. **Lists ≤7 items** — anything longer becomes a 2-column grid or a collapsible.

## Visual decluttering rules

The site has dense spec tables and "everything visible at once" — these are the principles when rebalancing:

1. **Progressive disclosure over wall-of-content.** The first viewport on every page should answer "what is this?" with one sentence and one image. Deep specs go below or behind a `<details>`.
2. **Three-line hero limit.** Hero copy maxes at 3 lines on desktop, 5 on mobile. If you need more, add a sub-hero band.
3. **One CTA per section.** A section with 4 buttons creates choice-paralysis. The single most important action stays — others move to the footer or a deep CTA.
4. **Large numbers, small labels.** A spec like "−40°C blast freezing" is `<strong class="num">−40°C</strong> blast freezing` — the number is JetBrains Mono, larger, ember; the label is Inter, smaller, muted.
5. **No decorative icons in B2B contexts.** Engineers don't trust emoji icons — they trust photos of real equipment, real specs, and real numbers. Tools may use functional symbols (warm/cold dots, →) but never decorative icons.
6. **Cards have at most 4 elements visible.** Eyebrow / title / 2-line description / single CTA. Any extra metadata goes in hover or the linked page.
7. **Remove redundancy across sections.** "Pakistan's largest sandwich panel manufacturer" once on the page. Don't repeat the value-prop in 3 sections.
8. **One photo, full-bleed, beats 6 thumbnails.** Especially on the homepage hero and service pages.

## What this design is NOT

| Avoid | Why |
|---|---|
| Floating cards with drop shadows | Generic SaaS look |
| Emoji icons in feature lists | Unprofessional for B2B |
| Gradient buttons everywhere | Dilutes the ember accent |
| 3-column SaaS feature grids | Wrong genre — this is industrial/editorial |
| Stock imagery or generic warehouse shots | Kills credibility |
| Mega-menus or hamburger-heavy navigation | Adds friction |
| Pure white backgrounds | Off-brand — always use `--paper` |
| Any colour outside the palette | Dilutes the temperature-spectrum identity |
| Body text below 14 px on mobile | Accessibility + readability |
| Tap targets below 44×44 px | WCAG 2.5.5 fail |
| Layout-shift > 0.1 CLS | CWV fail; harms SEO + UX |

## Competitor positioning

| Company | What they do wrong |
|---|---|
| Lineage Logistics | Generic warehouse blue, no emotional story |
| Americold | Enterprise-dull, no product character |
| NewCold | Better but still template-SaaS |
| Koldkraft (PK) | Outdated, poor hierarchy |

**Izhar Foster's differentiators:**
- Oldest in Pakistan (1959 — 65+ years)
- Full vertical stack (panels → systems → structures → doors → CA stores)
- Pakistan-scale local engineering (12 cities of ASHRAE 0.4% DB temps baked in)
- The only cold-chain provider with a 7-tool engineering calculator suite
- Real products, real specs, real photography — not stock plus marketing copy

## CSS architecture

All styles live in `css/style.css` (~3900 lines). Sections in order:

1. CSS custom properties (variables)
2. Reset + base (with mobile overflow-x: clip)
3. Shared layout (shell, rail, header, footer)
4. Homepage sections (hero, spec-band, scrubber, counters, story, industries, CTA)
5. Interior page layout (page-hero, detail-grid, spec-table)
6. Component styles (faq-list, project-grid, client-grid, blog-grid, leader-grid, contact form)
7. Calculator suite (3000+ lines under `.calc-*` and `.tools-*` namespaces)
8. Visualiser + heat-flow keyframes
9. Print styles
10. Responsive breakpoints (4-tier scheme)

`css/consultant.css` — Cold Consultant drawer, isolated. Loaded lazily.

No CSS preprocessor. No utility framework. Vanilla CSS only.

## Engineering calculator visual language

(Calculator suite uses the same design tokens but extends with these rules.)

- **Form column** is the primary action surface (1.4fr). White-paper background, no decoration. Sections separated by `border-top: 1px solid var(--line-2)` and a Step number eyebrow.
- **Result aside** is sticky on desktop, single-column on mobile. The big number is `clamp(2rem, 5vw, 3.6rem)` ember. Sub-line in mono muted.
- **Equipment selector modal** has two tabs: class-typical picker (auto-recommend) and manual datasheet entry (engineer override). Per-profile expand/collapse, hinted tier highlighted in ember.
- **Methodology panel** auto-injected per tool — a `<details>` with sources list and "cross-validated within ±20%" footnote.
- **PDF reports** are A4, Inter 11pt, ember accent line under the brand wordmark, JetBrains Mono in the data tables, sources at the bottom, disclaimer in italic muted.
- **Project session banner** is a horizontal warm-gradient strip below the titlebar — orange to indicate "you're in flow", with two clear buttons: Cancel / Attach & return.

## Visual work — token-efficient algorithms

Design changes are where token budgets bleed fastest: re-reading 3,900 lines of CSS, opening 23 HTML pages "to compare", or asking a subagent to redo work the variables already define. The rules below pair with the [CLAUDE.md token discipline](CLAUDE.md#token-discipline--read-before-any-non-trivial-task) section.

### V1. Trust the design tokens — don't re-derive them

Every colour, font, spacing, breakpoint, and motion timing is in the tables above. When the user asks for "the brand orange" or "section padding", reach for the token name (`--t-warm`, `clamp(56px, 8vw, 120px)`), not the value. Re-deriving values from screenshots or other pages wastes tokens and risks drift.

| Need | Source of truth | Don't |
|---|---|---|
| Brand orange | `--t-warm: #E36A1E` | Read style.css to find it |
| Mono numerals | `font-family: var(--font-mono)` | Re-declare JetBrains Mono per component |
| Rail width | `var(--rail)` (responsive) | Hard-code 72 px |
| Section padding | `clamp(56px, 8vw, 120px)` | Pick a new clamp |
| Tap target floor | 44×44 px (WCAG 2.5.5) | Use a smaller "looks fine on my screen" |
| Body text floor (mobile) | 14 px | Decide per component |

### V2. Pattern reuse over invention

Before adding a new visual pattern, check the inventory:

```
Hero block            → index.html (.hp-hero), services/cold-stores.html
Spec table            → services/pir-sandwich-panels.html  
Project case study    → projects/<any>.html
Calculator titlebar   → tools/<any>.html (Izhar.wireToolChrome injects)
Trust band            → index.html (1959 / 277,460 sqft / ISO 9001 / 2,100+)
Dark CTA banner       → index.html (.hp-cta), services/cold-stores.html
Methodology details   → tools/<any>.html (auto-injected by _shared.js)
Project session strip → tools/<any>.html when ?project= is present
```

If a similar pattern exists, **read that one file** and clone the structure. Don't read three "for comparison" — pick the closest sibling and ship.

### V3. Image work — inspect cheap, generate dear

| Task | Cheap path | Token cost |
|---|---|---|
| Confirm an image exists | `Bash ls images/` | ~100 tok |
| Check dimensions | `Bash file images/foo.jpg` or `sips -g pixelWidth` | ~150 tok |
| Compare two images visually | `Read images/foo.jpg` (multimodal) | 1-3k tok per image |
| Find an image to reuse | `Bash ls _scrape/images/ \| grep -i pir` | ~200 tok |
| Generate a new OG image | `seo-image-gen` subagent | 15-25k tok |

**Generating an image is the most expensive design action in the toolkit.** Always check `_scrape/images/` (the legacy site has 200+ real production photos) before spawning a generator. Real photography beats generated, both for trust and for tokens.

### V4. Scrape mining — read by keyword, not by file

`_scrape/` (39 MB) and `_kr_scrape/` (research) are gitignored — they exist to be searched. The brochure facts, partner names, and project specs live there. Always:

```bash
# Find the right file first
grep -rln "HAC Agri" _scrape/ _kr_scrape/

# Then read the matched window only
# Read with offset/limit on the specific match
```

Never `Read` a 2,000-line scrape file in full — you'll burn 20k tokens to find one fact that `grep` finds in 50.

### V5. When to use a visual subagent

| Situation | Agent | Why |
|---|---|---|
| New OG / hero / case-study image | `seo-image-gen` or `visual-designer` | Generation is their job |
| Cross-page visual consistency check (5+ pages) | `seo-content` or `general-purpose` | Reading 5+ pages in main thread blows budget |
| "Does this comp match brand?" (single screenshot vs DESIGN.md) | **No agent.** Read the screenshot + the relevant DESIGN.md section. | Single-step compare |
| CLS / LCP audit | Background `Bash node _kr_scrape/cls-lcp-audit.mjs` | Existing script; not a subagent task |

**Always pass the brand tokens explicitly in the prompt** — never expect the agent to re-read DESIGN.md. Quote the hex codes, the type stack, the spacing tokens directly.

### V6. The "is this on-brand?" decision tree

Before adding any new visual element, run the check in this order. Stop at the first failure.

```
1. Is the colour in the palette?     → no: stop, use a token
2. Is the font Inter or JetBrains Mono? → no: stop
3. Is the number set in mono?         → no: fix
4. Is there a hover + focus state?    → no: add (.15s state, .32s layout)
5. Is the tap target ≥44×44 on mobile? → no: pad it
6. Does it use a stock photo or icon-as-illustration? → yes: replace
7. Are all 4 hero questions answered (right people / real engineers / what I need / where next)? → no: hero fails
```

If 1-6 pass, ship. If 7 fails on a priority page, the page fails — it's the funnel rule from GROWTH-PLAN §2.2.

---

## Performance targets (Core Web Vitals)

| Metric | Target | Current (local server) |
|---|---|---|
| CLS | <0.1 | 13/14 pages ✓; load-calculator at 0.32 ⚠ |
| LCP | <2.5s | All pages ≤2.5s on local — production target same |
| TTFB | <600ms | Local ~50ms; Vercel CDN should match |
| INP | <200ms | (not yet measured — Phase 6) |

The load-calculator CLS is from the late-mounting `<model-viewer>` pushing content. Reserve aspect-ratio + min-height on `.calc-visualiser` to prevent.
