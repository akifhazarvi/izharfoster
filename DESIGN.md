# Izhar Foster — Design System

## The big idea: the temperature is the brand

A vertical gradient spectrum (−40°C → +25°C) is a permanent left-edge rail across every page, with a small pin that moves to each section's `data-temp` value as the user scrolls. This is the ownable visual mechanic — competitors (Lineage, Americold, NewCold, Koldkraft) all use generic warehouse photos and corporate blue.

**Emotional positioning:** "Pakistan's pantry — preserved."
**Mission line:** "Pakistan's largest sandwich panel manufacturer" (verbatim from source — stronger than "leading provider")
**Hero formula:** `Engineered cold. Since 1959.` — italic gradient on "cold", monospace year

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

`--t-warm` (ember) is the **only** accent colour. Use it only on CTAs, hover states, and temperature badges. Never use it decoratively.

## Typography (locked)

| Use | Font | Notes |
|---|---|---|
| All body + display | **Inter** | Google Fonts |
| Every numeric | **JetBrains Mono** | Temperatures, capacities, years, phone numbers, addresses |

The mono numerals are the visual signature — like Stripe's rounded sans. Every number on the site must be set in JetBrains Mono via `font-family: var(--font-mono)`.

## Spacing & layout

| Token | Value |
|---|---|
| `--rail` | `72px` — fixed left rail width |
| `--gap` | `clamp(2rem, 5vw, 4rem)` — section vertical rhythm |
| `--page-max` | `1200px` — content max-width |

## The spectrum rail

```html
<div class="rail" aria-hidden="true">
  <div class="rail-track"></div>
  <div class="pin"></div>
</div>
```

- `position: fixed; top: 0; left: 0; width: var(--rail); height: 100vh`
- Gradient: `linear-gradient(to bottom, var(--t-cold), var(--t-mid) 50%, var(--t-warm))`
- Pin moves to section's `data-temp` attribute on scroll (mapped −40..+25 → 0..1 on rail height)
- All content is offset with `padding-left: var(--rail)` on `.shell`, NOT a grid column

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

## Photography principles

Use real photography from `_scrape/images/`:
- Founder portrait (`founder.png`) — Engineer Izhar Ahmad Qureshi, transparent PNG
- Drone facility shots (`hero-facility.jpg`)
- Actual product photos (cold stores, PIR panels, doors, blast freezers)

NO stock decoration. NO icons-as-illustrations. NO placeholder gradient shapes.

## Layout language

- Asymmetric editorial grids (1.4fr / 1fr is the signature split)
- Heavy whitespace — sections breathe
- Real specs in `<table>` elements with mono numerics
- Named projects with actual capacity + temperature data
- Restrained use of dark backgrounds — only spec bands and CTA banners

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

## Competitors (context)

| Company | What they do wrong |
|---|---|
| Lineage Logistics | Generic warehouse blue, no emotional story |
| Americold | Enterprise-dull, no product character |
| NewCold | Better but still template-SaaS |
| Koldkraft (PK) | Outdated, poor hierarchy |

Izhar Foster's differentiators: oldest (1959), full vertical stack (panels → systems → structures → doors → CA stores), local engineering expertise, Pakistan-scale cold chain.

## CSS architecture

All styles live in `css/style.css` (~1600 lines). Sections in order:
1. CSS custom properties (variables)
2. Reset + base
3. Shared layout (shell, rail, header, footer)
4. Homepage sections (hero, spec-band, scrubber, counters, story, industries, CTA)
5. Interior page layout (page-hero, detail-grid, spec-table)
6. Component styles (faq-list, project-grid, client-grid, blog-grid, leader-grid, contact form)
7. Responsive breakpoints

No CSS preprocessor. No utility framework. Vanilla CSS only.
