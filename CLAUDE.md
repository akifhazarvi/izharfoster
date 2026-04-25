# Izhar Foster — Claude Code Instructions

## Project overview
Premium redesign of izharfoster.com — Pakistan's largest sandwich panel manufacturer and cold-chain provider since 1959 (division of Izhar Group). Static HTML + CSS + vanilla JS. No build step. Served via `python3 -m http.server 8090` from `~/projects/izharfoster/`. Port 8080 is taken by a separate project — always use 8090.

## File structure

```
izharfoster/
├── index.html                  # Homepage (approved — do not regress)
├── about.html
├── contact.html
├── faqs.html
├── clients.html
├── projects.html
├── blog.html
├── sitemap.xml
├── robots.txt
├── llms.txt
├── services/
│   ├── cold-stores.html
│   ├── pir-sandwich-panels.html
│   ├── refrigeration-systems.html
│   ├── prefabricated-structures.html
│   ├── ca-stores.html
│   └── insulated-doors.html
├── blog/
│   ├── cold-storage-solutions-pakistan-demand-rising.html
│   ├── pir-panels-thermal-efficiency-smart-building.html
│   ├── refrigeration-systems-cold-chain-pakistan.html
│   ├── ca-stores-game-changer-pakistan-agriculture.html
│   ├── insulated-doors-energy-efficiency-cold-storage.html
│   ├── prefabricated-structures-smart-construction-pakistan.html
│   ├── green-refrigeration-energy-carbon-footprint.html
│   ├── cold-storage-pakistan-export-growth.html
│   └── insulated-industrial-doors-types-benefits-guide.html
├── css/
│   └── style.css               # Full design system (~1600 lines)
├── js/
│   └── main.js                 # Scrubber + counters + rail pin
└── images/
    └── *.jpg / *.png / *.webp  # 18 curated production images
```

`_scrape/` (39MB, gitignored) — full scrape of live site: 79 HTML pages, 79 text files, 333 raw images. Source of truth for remaining copy and imagery.

## Critical rules for any code change

### CSS grid — always use minmax
All grid columns must use `minmax(0, Nfr)` not bare `Nfr`. Without it, flex/grid children with long text collapse at mid-viewport widths.

```css
/* correct */
grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
/* wrong — will break */
grid-template-columns: 1.4fr 1fr;
```

### Rail is position:fixed — never double-account for it
The spectrum rail is `position: fixed; left: 0; width: var(--rail)`. The shell offsets content with `padding-left: var(--rail)` only — NOT a grid column. Never put the rail inside a grid.

### Italic gradient text needs padding-right
`-webkit-background-clip: text` clips the italic tail of letters like 'd'. Always apply:
```css
.em { display: inline-block; padding-right: .14em; -webkit-box-decoration-break: clone; }
```
Without this, "cold" renders as "cola".

### Header flex children — white-space: nowrap
Phone numbers and the brand tag must never wrap. Always set `white-space: nowrap; flex-shrink: 0` on `.nav-phone` and `.nav-cta`.

### Path depth for assets
- Root pages (`about.html` etc.): assets at `css/style.css`, `js/main.js`, `images/`
- Subdirectory pages (`services/`, `blog/`): assets at `../css/style.css`, `../js/main.js`, `../images/`

## Brand system (locked — do not change without explicit instruction)
See DESIGN.md for the full specification.

## Page builder
`/tmp/izhar-build2.py` — Python script that generated all interior pages from a shared header/footer template. Re-run it to regenerate any page or add new ones. It writes directly to `~/projects/izharfoster/`.

## What's not built yet
- Energy cost calculator (live kWh/PKR tool, planned for product pages)
- Open Spec Sheet Library (downloadable PDFs, no email gate)
- Cold Map of Pakistan (filterable interactive project map)
- Additional client testimonials / case studies
