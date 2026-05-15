# Izhar Foster — Daily Task List

**Last updated:** 2026-05-14
**Score baseline:** 78/100 (ACTION-PLAN.md, 2026-05-02)
**Canonical roadmap:** [GROWTH-PLAN.md](GROWTH-PLAN.md) | Resolved conflicts: [DECISIONS.md](DECISIONS.md)

Work top-to-bottom. Mark done with `[x]`. Each PR title must reference the GROWTH-PLAN section it implements.

---

## 2026-05-14 — GA4 + GSC review (28d 2026-04-16 → 2026-05-13)

**Headline:** clicks **+22.7%** (176 → 216), CTR **+24%** (2.34% → 2.90%), impressions flat, position flat. The CTR work (PIR title rewrite, AggregateOffer schema, pharma growth bundle, 4 legacy 301s) is converting existing rankings to clicks — exactly the GROWTH-PLAN thesis. **Press the same lever harder.**

**Pharma page reality check:** `/services/pharmaceutical-cold-storage` jumped from pos 59 → pos 17.5 (huge) but **zero clicks on commercial queries**. Google still routes `pharma cold chain`, `what is cold chain`, `cold chain` (combined 174+ imp, 0 clicks) to two legacy `/blogs/what-is-cold-chain...` and `/blogs/what-is-cold-storage...` URLs ranking pos 54–84. The 301s exist (commit d366092). Content gap is the bottleneck, not redirects — service page needed informational + manufacturer + GMP commercial sections to capture both intents.

**Top 3 data insights driving this week's task changes:**
1. CTR machine works — don't pivot to new keywords, press existing list
2. Pharma rebuild is half-done — needs commercial + informational content depth (THIS PR ships it)
3. Direct = 28% engagement → bot traffic; Vercel Singapore IP filter is single highest-value GA4 cleanup

---

---

## Legend

| Symbol | Meaning |
|--------|---------|
| `[x]` | Shipped — commit exists |
| `[ ]` | Not started |
| `[~]` | In progress |
| `AP#N` | ACTION-PLAN.md item number |
| `GP§N` | GROWTH-PLAN.md section number |

---

## Week 1 (2026-05-03 → 09) — Strike-distance + trust signals

### Day 1 — Quick wins (≤2 hr total)

- [x] `AP#4` Add 74-word AI-citation passage to homepage hero (`index.html`) — commit `a9ca809`
- [x] `AP#5` Standardise all schema `telephone` to E.164 `+924235383543` — commit `7a81618`
- [x] `AP#6` Add `IndexNow:` directive to `robots.txt` — commit `7a81618`
- [x] `AP#9` Claim GBP, add Maps embed to `contact.html` + `cold-storage-lahore.html` — commit `bc78be6`
- [x] `AP#10` Add `openingHoursSpecification` to LocalBusiness schema — commit `7a81618`
- [x] `AP#11` Long-cache CSS/JS with versioned filenames + immutable headers in `vercel.json` — commit `f5ed784`
- [x] `AP#12` Static "How this calculator works" sections on all 8 tool pages — commit `a759232`
- [x] `AP#13` MKT equation + WHO PQS E003 + excursion protocol on pharma page — commit `c4d614a`
- [x] `AP#14` Expand 2 thin blog posts above 1,500 words — commit `c4d614a`
- [x] `AP#15` Move GA4 `gtag` block below `<meta charset>` + `<meta viewport>` — commit `a9ca809`
- [x] `AP#18` Add Karachi geo coordinates + `branchOf` schema to karachi page — commit `7a81618`
- [x] **GA4 attribution fix** — rename `js/track.js` user_properties + per-event params from reserved keys (`source`/`medium`/`campaign`/`attribution_*`) to `izhar_*` so they enrich GA4 native channel grouping instead of overwriting it (was producing `direct_via_legacy_redirect`, `google_organic`, `utm:chatgpt.com` as Unassigned sessions; root cause of "why so many Unassigned" diagnosis on 2026-05-04) — commit `5f4a1ac`
- [x] **GSC indexing cleanup (GP§6)** — diagnosed via Composio GSC MCP: 58 "Crawled - currently not indexed" was mostly `.html` duplicate noise (Google had already canonicalised) and three legacy WordPress sitemaps (`sitemap_index.xml`, `post-sitemap.xml`, `page-sitemap.xml`) still submitted from 2023/Jul-2025 telling Google to re-crawl ~124 dead URLs. Added 3 `.html` → extensionless 301 rules to `vercel.json` and removed malformed `Service.offers.priceSpecification` (no `price`) from `services/ca-stores.html` schema — commit `a0e6147`. **Manual GSC UI step pending:** remove the three legacy sitemaps in Search Console > Sitemaps.

### Day 2 — Content + schema (3-4 hr)

- [x] `AP#1` Link `/services/pharmaceutical-cold-storage` from homepage products grid (added dedicated 7th product card between Cold Stores and Refrigeration Systems) — commit `abff036`

- [x] `AP#2` De-anonymise pharma page reference projects — replaced "confidential client" placeholders with named clients pulled from clients.html: Getz Pharma, Sami Pharmaceuticals, Searle Pakistan, plus USAID/EPI vaccine programmes — commit `abff036`

- [x] **GP§6/§7 #1 — pharma page growth bundle** — added Stage-2 trust band (named clients · 1959 / 277,460 sqft plant · 2,100+ installations) directly under H1 + sharpened title/meta/og to lead with the exact-match query "pharmaceutical cold storage in Pakistan" (2,729 imp at pos 68 — single biggest GSC gap query). Combined with GSC sitemap cleanup (commit a0e6147 + manual UI deletion 2026-05-05), this is the full first-pass attack on the 16,740-impression pharma opportunity — commit `abff036`

- [ ] `AP#7` Fix `refrigerated-vehicles.html` og:image — replace pharma room image with `og-default.jpg`  
  **Files:** `services/refrigerated-vehicles.html`  
  **Why:** Wrong social preview; 5-min fix.

- [ ] `AP#8` Convert blog post `author` schema from `Organization` → `Person` (Muhammad Anwar Inayat) on top-3 posts  
  **Files:**  
  - `blog/cold-storage-cost-pakistan-2026-buyers-guide.html`  
  - `blog/cold-storage-solutions-pakistan-demand-rising.html`  
  - `blog/cold-storage-pakistan-export-growth.html`  
  **Why:** LLMs prefer human-attributed sources; also add one-line in-text bio.

- [ ] `AP#3` Async-load Google Fonts (`rel="preload"` + `onload`) on all pages  
  **Files:** all `<head>` blocks (13 services, 9 blog, 5 tools, root pages)  
  **Why:** 300–600 ms LCP gain on 3G; system-font fallbacks already exist.

### Day 3 — Striking-distance page rewrites (GP§6)

- [ ] **`GP§6 #1`** Rewrite `services/ca-stores.html` H1 + add factual abstract under H1  
  Current: pos 5.6, 0.2% CTR on "controlled atmosphere storage" (2,268 imp)  
  Action: one-sentence factual abstract para immediately under H1; add 12-month storage claim above fold

- [ ] **`GP§6 #2`** Rewrite `services/cold-stores.html` title + meta + add city-tag chips  
  Current: pos 8.9, 0.7% CTR on "cold storage" (3,556 imp)  
  Action: new `<title>` + `<meta description>` targeting "cold storage Pakistan"; add 5 city chips (Lahore, Karachi, Multan, Faisalabad, Islamabad) to hero trust band

- [ ] **`GP§6 #3 + #4`** Add price band table to PIR page + rewrite `<title>`  
  Current: pos 5.8, 0.9% CTR on "sandwich panel" (2,863 imp)  
  Action: 5-row thickness/U-value/price-band table (50–150 mm); quote-driven CTA; title → "FireSafe PIR Sandwich Panels — Pakistan Manufacturer | Izhar Foster"

---

## Week 2 (2026-05-10 → 16) — Trust band + content depth

### NEW data-driven priorities (added 2026-05-14 after GA4 + GSC review)

- [x] **`GP§7 #1` — pharma page commercial + informational rebuild** — added 4 new H2 sections to `services/pharmaceutical-cold-storage.html` (524 lines, +37%) targeting zero-click GSC queries: "The pharmaceutical cold chain — what it is and why every link matters" (captures `what is cold chain`, `pharma cold chain`, `cold chain meaning`, `importance of cold chain in pharmaceutical industry` — 174 imp combined, currently routed to legacy /blogs/ URLs at pos 54–84); "Pharmaceutical cold storage manufacturer in Pakistan — what we build and how we build it" (captures `cold storage manufacturer` pos 58, `cold store manufacturers in pakistan` 43 imp pos 11, `pharmaceutical cold storage manufacturer`); "Types of pharmaceutical cold rooms we build" with 8-row class table (captures `cold room in pharmaceutical industry`, `pharma cold room`, `pharmaceutical cold room`, `vaccine cold room`); "WHO GMP and the cold-chain regulatory stack" + "WHO PQS-compliant vaccine cold storage" (captures `gmp cold storage`, `WHO TRS 961`, `WHO PQS E003`). FAQ expanded 8 → 18 items covering exact-match informational queries. Service schema upgraded with `hasOfferCatalog` (8 cold-room types) and `additionalProperty` array (18 spec PropertyValues — temperature range, redundancy, panel λ, fire class, design ambient, lead times, design life, manufacturing location, operating since, installations delivered). New `MedicalWebPage` schema overlay added for pharma-authority signal. Title + meta description rewritten to lead with "GMP Cold Room Manufacturer". All 4 JSON-LD blocks parse. — **commit pending**
- [ ] **GA4 admin UI step** (you, not me; GP§11) — create "AI Assistants" custom channel group in GA4 Admin > Channel groups matching chatgpt.com/perplexity.ai/claude.ai/copilot.microsoft.com/gemini.google.com hosts; add Vercel Singapore IP filter to drop bot traffic that is currently 28%-engagement-poisoning Direct sessions. Verification window: 7 days post-filter, re-pull `sessionDefaultChannelGroup × sessionSource` and confirm Direct engagement rate jumps above 50%. See memory `project_ga4_admin_followups.md`.
- [ ] **`GP§6 #20` — `cold store manufacturers in pakistan` content add** (43 imp, pos 11, striking distance) — add a "Cold store manufacturer in Pakistan — what to ask any supplier" H2 + factual abstract paragraph to `services/cold-stores.html`, mirroring the manufacturer section added to pharma page. Same pattern, different keyword. Use the existing 1959/277,460 sqft/2,100 installations trust facts.
- [ ] **`GP§6 PIR speed`** — promote AP#3 (Google Fonts async on `services/pir-sandwich-panels.html`). It's the #2 organic landing page (39 sessions, only 5 conversions) — page speed likely the blocker. 5 min sed across `<head>` blocks.

### Day 4 — Homepage visual hierarchy (GP§13.2)

- [ ] Move Cold Stores card to **position 1** in homepage product grid (currently position 3–4)
- [ ] Add logo strip (Coca-Cola · Pepsi · Nestlé · Engro · Pak Army · Hyperstar) **above the fold** on homepage
- [ ] Add 4-chip trust band (1959 · 277,460 sqft · ISO 9001 · 2,100+ projects) to homepage hero
- [ ] Demote prefab / cabin / plant-factory cards to "Other capabilities" section below cold-chain trio

### Day 5 — Refrigeration + PIR depth (GP§4.2, GP§4.3)

- [ ] Add named partners table to `services/refrigeration-systems.html`: Zanotti · Heatcraft · LU-VE · Bitzer  
  **Source:** DECISIONS.md confirmed partners
- [x] Add PIR vs PU vs EPS comparison table with λ values to `services/pir-sandwich-panels.html` — already on page (line 138 spec table)
- [x] Add WHO-banned PU foam differentiation callout to PIR page hero — already on page (hero + body)
- [x] Add pentane blowing-agent callout (eco-friendly; 141B replacement) — already on page (hero + spec table)
- [x] Add industrial-construction depth section to `services/pir-sandwich-panels.html` (targets GSC orphan "construction using pir panels", 475 imp pos 19.1) — d78e440

### Day 6 — CA Stores depth (GP§4.4)

- [ ] Add ULO / ILOS / Swinglos (DCA) comparison table to `services/ca-stores.html`
- [ ] Name Fruit Control Italiana as CA equipment partner
- [ ] Add named equipment: GAC 5000, Swingtherm-BS, Fighter PSA nitrogen generators
- [ ] Extend crop callouts: mango (Sindh export), pomegranate (Balochistan), citrus

---

## Week 3 (2026-05-17 → 23) — Case studies batch 1 (GP§5)

5 case studies from `~/Downloads/` project folders. Each page: `projects/<slug>.html`, 600–800 words, `Article` schema, `mentions` for equipment partners, WebP-optimised photos.

- [ ] `projects/tccec-coca-cola-lahore.html` — Coca-Cola TCCEC Lahore (6 photos)
- [ ] `projects/naubahar-bottling-gujranwala.html` — Naubahar (Pepsi) Gujranwala (11 photos)
- [ ] `projects/connect-logistics-karachi.html` — Connect Logistics multi-temp (12 photos)
- [ ] `projects/haier-lab-lahore.html` — Haier climate-chamber lab (8 photos)
- [ ] `projects/usaid-banana-ripening-sindh.html` — USAID-funded banana ripening rooms (7 photos)

**Rules (DECISIONS.md):** No invented specs. If a fact is visible in a photo, describe it visually. Industry-standard ranges stated as context, not as the project's spec.

---

## Week 4 (2026-05-24 → 30) — Case studies batch 2 (GP§5)

9 case studies from brochure. Same template as Week 3.

- [ ] `projects/sharaf-logistics-50ft.html` — Sharaf Logistics 50-ft cold store
- [ ] `projects/iceland-cold-chain-raiwand.html` — Iceland Cold Chain −28°C
- [ ] `projects/hac-agri-bhai-pheru-3000ton.html` — HAC Agri 3,000-ton CA store + ammonia-glycol (+ floor plan PDF)
- [ ] `projects/gourmet-ice-cream-plant.html` — Gourmet IQF glycol-ammonia
- [ ] `projects/emirates-logistics-lahore.html` — Emirates Logistics multi-purpose
- [ ] `projects/metro-ravi-lahore.html` — Metro Ravi retail logistics
- [ ] `projects/united-snacks.html` — United Snacks cold storage
- [ ] `projects/oye-hoye-chips.html` — Oye Hoye CO2 control storage
- [ ] `projects/engro-angro-milk-collection.html` — Engro/Angro milk collection centre

---

## Month 2 — City landing pages (GP§4.1)

Each page: 800–1,200 words. Named local project, city-specific design notes, LocalBusiness schema with correct geo.

- [x] `cold-storage-lahore.html` — exists, has geo + Maps embed (commit `bc78be6`)
- [x] `cold-storage-karachi.html` — exists, has geo + branchOf (commit `7a81618`)
- [ ] `cold-storage-multan.html` — mango / dates / ASHRAE 50°C / MEPCO / HAC Agri tie-in (`AP#20`)
- [ ] `cold-storage-faisalabad.html` — dairy belt / Interloop / FESCO (`AP#21`)

---

## 2026-05-14 — Chat widget: scripted-bot CTA on every page (FUNNEL.md §2.0.1)

User ask: "now work on conversion cta chat icon chat bot, we need to generate leads". Three modes inside one widget (the user picked "i want all of them"): quick scripted chat, WhatsApp-direct, or full wizard.

- [x] **`js/chat-widget.js`** (new, ~440 lines): self-contained chat FAB + slide-up panel + 4-step scripted conversation (sector → capacity → city → phone) → WhatsApp handoff with structured brief. Pulse animation on the FAB. Typing-dot animation on bot messages. Honest framing: "Engineering desk · Online · replies in 24h" — never claims AI. Dismiss state persists in `sessionStorage` (closing once stops nagging). GA4 events: `chat_open`, `chat_step`, `chat_submit`, `chat_dismiss`.
- [x] **Site-wide injection** — single `<script src="/js/chat-widget.js" defer></script>` added after `main.v2.js` on all 66 pages with a layout shell (root, services, projects, blog, tools, city pages). Two pages excluded by the widget's own pathname check (concept-wizard + roi-payback would loop).
- [x] **Replaces the old `.fab-wa` WhatsApp pill** — same bottom-right slot, same WhatsApp escape hatch (via the "WhatsApp now" choice), but now the default path is a structured chat that captures intent before handoff. Old pill removed at runtime by the widget itself (no markup edits needed across 66 files).
- [x] **FUNNEL.md §2.0.1** — chat widget design documented.

### Next — chat widget iteration (queue once GA4 data lands)

- [ ] Watch `chat_step` drop-off in GA4 weekly. Tune copy on whichever step has highest abandonment.
- [ ] A/B the FAB label text ("Chat with engineering · reply in 24h" vs alternatives) after 2 weeks of data.
- [ ] Add a 5th step "What's your role?" (Owner / Manager / Consultant / Procurement) once we have data showing role correlates with conversion — currently keeping it 4 steps to maximise completion rate.
- [ ] Add `?prefill_sector=pharma` URL param so a CTA on the pharma page can open the chat with sector preselected.
- [ ] Multilingual: detect `lang=ar` or `navigator.language` and translate widget copy for Saudi visitors (Phase 2).
- [ ] Optional later: handover to a real CRM (HubSpot free tier? Pipedrive?) once WhatsApp inbox volume justifies it.

---

## 2026-05-14 — Conversion funnel rebuild (FUNNEL.md)

Triggered by user instruction: "Don't bullshit, research, build logic and repeat." Full GSC + competitor research run; designed and shipped a conversion-first funnel that routes every visitor to one of two new artefacts (wizard or ROI calculator) and hands off to a human engineer on WhatsApp. **Source of truth: [FUNNEL.md](FUNNEL.md)** — read this before changing any CTA.

- [x] **Research** — GSC 28-day pull via `seo-google` subagent (used 2026-04-30 Composio data already in `_kr_scrape/GSC-ANALYSIS.md`); competitor + AI-search gap analysis via `seo-dataforseo` subagent. **DataForSEO MCP failed to connect** in this session — qualitative gap analysis from competitor HTML used instead. Re-run live DataForSEO once MCP surface is wired.
- [x] **FUNNEL.md** — one-pager diagnosis: top 5 CTR-rot pages (11k impressions / <1% CTR — biggest immediate win), pharma cluster (5.5k impressions / ~0% CTR — biggest growth lever), price-signal queries (3-4% CTR, need more visibility), competitor whitespace (zero PK competitor publishes any calculator or payback number).
- [x] **Tool 10 — Cold Store ROI &amp; Payback Calculator** at `/tools/roi-payback`. 4 inputs (commodity, throughput, selling price, city) → 3 outputs (monthly spoilage loss, capex band, payback months) + 10-yr cash chart. Math from FAO Postharvest Compendium + ASHRAE Ch. 24 + 2025-26 PK/KSA tariffs. Defensible ±25% band. WhatsApp handoff. Files: `tools/roi-payback.html`, `js/tools/roi-payback.js`, `js/tools/data-roi.json`.
- [x] **5-Question Concept Wizard** at `/tools/concept-wizard`. Sector → capacity → location → timeline → contact. Country dropdown switches PK / KSA city lists. localStorage persistence, URL prefill (`?sector=pharma`, `?country=SA`, etc), GA4 events (`wizard_start`, `wizard_step`, `wizard_submit`, `wizard_abandon`). On submit, opens WhatsApp prefilled with structured brief. Files: `tools/concept-wizard.html`, `js/tools/concept-wizard.js`.
- [x] **Site-wide CTA rewire (initial pass)** — homepage hero, homepage nav-pill, KSA hub hero CTA, services/cold-stores mid-page CTA, services/pir-sandwich-panels mid-page CTA. All point to wizard primary + ROI calculator secondary.
- [x] `tools.html` — 2 new tool cards at the top (wizard first, then ROI). Tools count updated 7 → 10.
- [x] `sitemap.xml` — `/tools/roi-payback` and `/tools/concept-wizard` added; `/tools` lastmod bumped.

### Phase 2 — Conversion funnel scaling (next 2-4 weeks)

Order by impact ÷ effort:

- [ ] **CTR-rot fix on top 5 pages** — rewrite title + meta + add wizard CTA in first scroll on: `/services/cold-stores` (cold storage / pos 8.8 / 0.70% CTR / 3,573 imp), `/services/pir-sandwich-panels` (sandwich panel / pos 5.8 / 0.87% CTR / 2,876 imp), `/services/ca-stores` (controlled atmosphere / pos 5.7 / 0.18% CTR / 2,275 imp), homepage (izhar brand query / pos 9.8 / 0.11% CTR / 1,783 imp), CA stores page for "ca store" exact-match (pos 12 / 0% CTR / 870 imp). Expected: 3-6× clicks on these queries with no rank change.
- [ ] **Pharma cluster H1 + meta rewrite** — `/services/pharmaceutical-cold-storage` is at pos 40-70 on 5,500 impressions. Title/meta currently doesn't match "pharmaceutical cold storage in Pakistan" exact query. Rewrite + add wizard CTA pre-filled with `?sector=pharma`.
- [ ] **Wire wizard + ROI calc into more pages** — projects.html cred-band, all 12 service pages bottom CTA, both city pages (Lahore + Karachi), all 9 blog post end-of-article CTAs, contact.html as the "or skip the wizard" fallback.
- [ ] **Re-run live DataForSEO research** once MCP surface is wired — pull actual KSA + PK keyword volumes, top-3 competitor traffic, AI-search citation patterns for 5 buyer prompts. Replace the qualitative gap analysis in FUNNEL.md §1.5 with hard numbers.
- [ ] **Add a "compliance pre-qualifier" wizard step for KSA** — SBC 801 (fire), SFDA-GDP (pharma temp mapping), Aramco SAES-Q-001 (oil-and-gas vendor list), MODON industrial-city flag. Inject as Q3.5 when country = SA. De-risks Izhar as a vendor before the call.
- [ ] **Tool 11 — Refrigerant Cost-per-Ton-Year Comparator** (R-449A vs R-290 vs R-744). Reuses existing Tool 3 (A2L) + Tool 4 (NIST REFPROP) + public refrigerant price feeds. Owns the "EU export F-gas phase-down" conversation. Niche but defensible moat.
- [ ] **Make every existing tool route to the wizard at exit** — every tool's CTA stack should end with "→ 5-question wizard → engineer."

### Phase 3 — Conversion measurement (after Phase 2 ships)

- [ ] GA4 funnel dashboard: `wizard_start` → `wizard_step` (each) → `wizard_submit` → `whatsapp_click`. Drop-off chart.
- [ ] Composio MCP weekly autopull: GSC CTR on top-5 rot pages, position movement on pharma cluster, Tool 10 + wizard sessions/conversions. Save as `_kr_scrape/funnel-metrics-week-{N}.md`.
- [ ] Iterate copy on whichever step has the highest abandonment.

---

## Month 2 — KSA / GCC export funnel (Phase 1 shipped 2026-05-14)

Phase 1 of the Saudi Arabia export-led SEO funnel. Honest positioning: Pakistan-engineered panels and refrigeration exported to GCC, with fly-in engineering supervision. No fabricated local presence — Google penalises fake locality and would torch the Pakistan rankings if caught.

- [x] **`services/cold-storage-saudi-arabia.html`** — KSA hub page. Service schema with `areaServed` for SA + GCC, 8-question FAQ schema, BreadcrumbList, BS EN 14509 / λ 0.022 framing, 5 KSA sectors (pharma, food import & 3PL, dates/produce, dairy & beverage, industrial), honest "what we don't have" callout, fly-in engineering scope, sea-freight transit times Karachi→Jeddah/Dammam. Embeds the Cold Map.
- [x] **Cold Map component** — SVG-based interactive map (Pakistan + KSA + UAE + Oman silhouettes), 10 solid PK pins for delivered installations (Lahore HQ, Karachi/Connect Logistics, Multan, Faisalabad, Gujranwala/Naubahar, Sialkot, Islamabad, Phool Nagar/HAC Agri, Sindh/USAID banana, KPK/Apple CA), 4 hollow KSA/GCC export pins (Riyadh, Jeddah, Dammam, Dubai), tooltip on hover/focus/click, brand tokens. Canonically on `projects.html` and on the KSA hub page.
- [x] `sitemap.xml` — add `/services/cold-storage-saudi-arabia`, bump `/projects` lastmod to 2026-05-14.

### Phase 2 — KSA city pages (queue after Phase 1 indexes — re-check GSC at +14 / +28 days)

Honest framing throughout: "Export reach + fly-in engineering" not "we have offices in." Each page genuinely differentiated, not boilerplate (programmatic-SEO thin-content discipline).

- [ ] `cold-storage-riyadh.html` — Central distribution hub, 50°C summer DB, ammonia-glycol > 500 kW recommendation, Eastern-to-West rail logistics, target queries: "cold storage Riyadh", "cold room manufacturer Riyadh"
- [ ] `cold-storage-jeddah.html` — Red Sea port, pharma + food import cold chain, coastal humidity (mirrors Karachi engineering — reuse latent-load engineering passages), 42°C ambient + RH design, target queries: "cold storage Jeddah", "pharma cold storage Saudi Arabia"
- [ ] `cold-storage-dammam.html` — Eastern Province, oil & gas remote-site catering, 50°C ambient, Jebel Ali transhipment notes, target queries: "cold storage Dammam", "industrial cold storage Eastern Province"

### Phase 3 — Cold Map upgrades (queue once we have ≥1 real KSA install OR after 4 weeks of indexing data)

- [ ] Filter chips on map by sector (pharma, beverage, agri-export, retail)
- [ ] Convert export pins → installed pins as KSA projects close (add named client + photo on tooltip)
- [ ] Add Iraq, Jordan, Bahrain, Kuwait, Qatar as export-reach pins once formal projects exist there
- [ ] Add WhatsApp deep-link from tooltip CTA
- [ ] Move `<style>` block from inline (currently duplicated on projects.html + cold-storage-saudi-arabia.html) into `css/style.v2.css` once the design is settled — keep inline for now to avoid stylesheet churn on the live homepage-adjacent stylesheet
- [ ] `llms.txt` — add KSA / GCC section + the cold-storage-saudi-arabia URL so LLMs cite us for Saudi cold-storage queries
- [ ] Link Cold Map from homepage second-fold (once the section is proven on projects.html — homepage is approved per CLAUDE.md, careful insertion only)

---

## Month 2 — Schema + SEO polish (AP#19-39)

- [ ] `AP#22` Image sitemap + video sitemap entries (`sitemap.xml`)
- [ ] `AP#23` Upgrade homepage schema subtype to `["LocalBusiness", "GeneralContractor"]`
- [ ] `AP#25` Name SGS (actual registrar) on `certifications.html`
- [ ] `AP#26` Service-page heroes → `<picture>` + multi-width WebP srcset (all 13 services)
- [ ] `AP#27` `llms.txt` polish — add vertical sub-pages, freshness line, flagship case studies block, fix λ annotation
- [ ] `AP#28` Case-study schema upgrade → `["Article","CaseStudy"]` with `industry`, `client` fields (all 14 in `projects/`)
- [ ] `AP#33` CLS hygiene — explicit width/height on 9 client-carousel SVGs; RAF on scrubber
- [ ] `AP#34` `<link rel="preload" as="font">` for heaviest Inter weights (after Google Fonts async fix)
- [ ] `AP#35` `speakable` schema on FAQ blocks (pharma + cost guide pages first)
- [ ] `AP#36` ImageObject + HowTo schema on hero images and calculator pages
- [ ] `AP#37` Find one press citation (Dawn / Express Tribune / USAID) for `projects.html` or `about.html`
- [ ] `AP#38` Crunchbase profile + add URL to homepage `sameAs`

---

## Month 3 — Cost Calculator (Tool 8) build (GP§14, DECISIONS.md §CEO)

Sequence fixed by DECISIONS.md:

1. [ ] Backend formulas + `js/tools/data-pricing.json` (PKR bands, placeholder ±20%, gitignore if sensitive)
2. [ ] Extend `energy-cost.js` with Pakistan city tariff table (LESCO / K-Electric / IESCO etc.)
3. [ ] Quick-mode UI (`tools/cost-calculator.html` skeleton, 10-second path)
4. [ ] Detailed-mode UI (3-step form at `/tools/cost-calculator`)
5. [ ] Margin slider (editable 0–50%, default 18%, persists in URL hash `#mp=18`) — DECISIONS.md CEO directive
6. [ ] PDF proposal template via existing `_shared.js` print pipeline
7. [ ] Lead-capture: 3 CTAs after result (PDF / Site Visit / WhatsApp Consultation) — NOT gated before result
8. [ ] Schema: `SoftwareApplication` + `FAQPage` + `HowTo` + `Action`
9. [ ] Homepage quick-mode embed (second fold, GP§13.2 block 3)
10. [ ] Preset deep-link URLs (`?preset=mango-multan-2000ton`) for case-study + city page CTAs

**Framing (DECISIONS.md):** Internal sales-engineer tool. Hero: "Cold store cost estimator — rough estimate · exact cost will differ." Disclaimer in yellow band on hero, result band, breakdown table, and every lead-capture summary.

---

## Backlog — do when relevant

- [ ] `AP#19` Wikipedia entity for Izhar Engineering / Izhar Foster (needs 4-6 third-party citations first)
- [ ] `AP#24` Review-collection CTA on `contact.html` footer (after GBP verified + first reviews in)
- [ ] `AP#29` PEC contractor registry citation — verify address/phone match, add URL to `sameAs`
- [ ] `AP#30` Vehicle hero photo for `services/refrigerated-vehicles.html` (once photo sourced)
- [ ] `AP#31` Wire `lastmod` to per-file git log (before site hits 100+ URLs)
- [ ] `AP#32` `noindex,nofollow` on `_scrape_coldstore/` HTML files (belt-and-braces)
- [ ] `AP#39` Industry vertical pages: beverage, dairy, agri-export, 3PL (GP§10 phase 2)
- [ ] Open Spec Sheet Library — downloadable PDFs with `DataDownload` schema (GP§10 month 3)
- [ ] HAC Agri floor-plan PDF download — confirm publication-readiness with user (DECISIONS.md #8)
- [ ] WhatsApp site-wide sticky pill (`.fab-wa`) on remaining pages not yet covered

---

## How to use this file

1. **Pick the first unchecked `[ ]` item** in the current week's section.
2. Read the referenced GROWTH-PLAN section and ACTION-PLAN item before writing code.
3. After each commit, mark the item `[x]` with the commit hash in a parenthetical.
4. Update "Last updated" at the top of this file in the same commit.
5. At the end of each week, move any incomplete items to the next week and add a note why they slipped.

**Every PR title format:** `Type: description (GROWTH-PLAN §N / ACTION-PLAN #N)`

---

## Completed log

| Date | Commit | Items |
|------|--------|-------|
| 2026-05-03 | `bc78be6` | AP#9 GBP entity link, geo coordinates, Maps embed |
| 2026-05-03 | `a9ca809` | AP#4 AI-citation passage, AP#15 GA4 head order, AP#2 (partial) pharma ref projects |
| 2026-05-03 | `f5ed784` | AP#11 long-cache versioned CSS/JS |
| 2026-05-03 | `c4d614a` | AP#13 pharma MKT+WHO PQS+excursion, AP#14 thin blog posts |
| 2026-05-03 | `a759232` | AP#12 static methodology on 8 tool pages |
| 2026-05-03 | `7a81618` | AP#5 E.164 schema, AP#6 IndexNow, AP#10 openingHours, AP#18 Karachi geo |
| 2026-05-04 | `5f4a1ac` | **GA4 attribution fix**: renamed `js/track.js` `user_properties` + per-event params from GA4-reserved keys (`source`/`medium`/`campaign`/`attribution_*`) to `izhar_*` so the custom AI-search / legacy-redirect / in-app-browser detection enriches GA4's native channel grouping instead of overwriting it. Diagnosed 2026-05-04 from a live 28d Composio GA4 pull: 19 Unassigned sessions (12% of total) all traced to this script's overrides — `direct_via_legacy_redirect`, `google_organic`, `utm:chatgpt.com`, `(not set)/(not set)` with empty `landingPage`. Native gtag('config') already runs on every page so removing the override lets GA4 attribute correctly. UI follow-ups saved to memory `project_ga4_admin_followups.md`: (1) custom channel group "AI Assistants" matching chatgpt/perplexity/claude/copilot/gemini hosts; (2) Vercel Singapore IP filter (61/89 fake-Direct sessions are bot probes). Verification window: 3-7 days post-deploy, re-pull `sessionDefaultChannelGroup × sessionSource × sessionMedium` and confirm Unassigned <5%. |
| 2026-05-04 | `0dc83ea` | **Tool 09 — Sandwich Panel Price Calculator** (`/tools/panel-price`) live. Free interactive PKR/m² + PKR/sqft estimator for FireSafe PIR sandwich panels in Pakistan. Inputs: 6 thicknesses (50–150 mm), 5 facing options (light/standard/heavy/Galvalume/food-grade), 4 length tiers (up to 50 ft), m² or sqft quantity input with auto-conversion, 4 delivery zones (Lahore/Punjab/Karachi-Islamabad/KPK-Balochistan). Outputs: live min-mid-max band per m² + per sqft, total order Rs band, visual horizontal price-band bar, full breakdown (subtotal + volume discount + freight), step-by-step show-the-math, WhatsApp/Email/quote-form CTAs with auto-filled summary. Uses same data source as `85082de` price table (research subagent 2026-05-04). Schema: SoftwareApplication + FAQPage (5 Q&As) + BreadcrumbList — eligible for SERP rich results on "sandwich panel price calculator" / "PIR panel cost pakistan" / "4×8 panel price" intents. Wired into `tools.html` (orange Tool 09 ★ NEW card), sitemap.xml, and linked from PIR services-page price table footnote. Math validated standalone (Node.js): 50mm/200m²/Lahore = Rs 1.26-1.65M; 100mm/1000m²/Karachi = Rs 10.2-12.1M. Files: `js/tools/data-panel-prices.json`, `js/tools/panel-price.js`, `tools/panel-price.html`. |
| 2026-05-04 | `85082de` | PIR price-range table + AggregateOffer schema: published an indicative PKR/m² + PKR/sqft band per thickness on `/services/pir-sandwich-panels.html` (50 mm 6,500–8,500; 80 mm 9,000–11,000; 100 mm 10,500–12,500; 60 + 150 mm flagged "Project-priced"). Bands sit at market median +15%, defensible vs +18% PU public median (Silver/Golden Steel) cross-checked against OLX Pakistan reverse-conversion and PPGI steel-coil cost build. New H2 `4×8 ft sandwich panel price in Pakistan — indicative range (Q2 2026)` matches the literal GSC striking-distance query (103 imp/mo at 0 clk pre-deploy). Schema upgraded from single Offer to AggregateOffer with lowPrice/highPrice + priceSpecification.minPrice/maxPrice + unitCode MTK (square metre) — gives Google rich-result-eligible price hints. Full market research methodology + sources logged in research subagent transcript. |
| 2026-05-04 | `d366092` | Tier 2 — pharma traffic leak fix + Service entity graph: redirected 4 legacy URLs (`/blogs/what-is-cold-chain-...-food-and-pharma-industry`, `/blogs/what-is-cold-storage-...-food-and-pharmaceutical-industry`, plus `/blog/...` no-s variants) from generic blog destinations to `/services/pharmaceutical-cold-storage` — 200 combined imp/month at pos 48-83 were dumping pharma intent on non-pharma pages; now consolidating onto the dedicated pharma page (16,740 imp/pos 59 — biggest single GSC opportunity). Also normalised `Service.provider` to `@id` reference (`#organization`) on all 12 service pages — completes the Person/Org entity graph started in `305fd2f`. **Skipped:** "what we measured" passages on pillar pages — audit found those pages already saturated with TCCEC/ASHRAE/BS EN measured data; adding more = padding. **Skipped:** pharma rebuild brief — page already excellent (366 lines, 11 H2s, 6 FAQs); bottleneck was redirect routing not content. **AIO data check:** zero AIO citations in last 28d (only 22 imp tagged TRANSLATED_RESULT) — speculative AIO passage work deprioritised until Google starts citing us. |
| 2026-05-04 | `305fd2f` | Striking-distance CTR fix: `/services/pir-sandwich-panels` title rewrite for "4×8 sandwich panel price" (pos 9.8, 63 imp, 0 clk); `/services/ca-stores` title rewrite for "controlled atmosphere storage" (pos 8.3, 27 imp, 0 clk); honest `Service.offers.priceSpecification` + `areaServed: Pakistan` on PIR + CA pages (no fake price); `Article.author.@id` → `team/{slug}#person` entity link on all 10 blog posts (Dec 2025 E-E-A-T entity-graph signal). Backed by GSC 28-day striking-distance audit + research §2/§7 |
| 2026-05-14 | _pending_ | **GP§7 #1 — pharma page commercial + informational rebuild** (data-driven; 28d GA4+GSC review on 2026-05-14). `services/pharmaceutical-cold-storage.html` grew from 382 → 524 lines (+37%, ~3,800 new words). Four new H2 sections: (1) cold-chain pillar — captures `what is cold chain`, `pharma cold chain`, `cold chain meaning`, `importance of cold chain in pharmaceutical industry` currently 174 imp / 0 clicks routed to legacy /blogs/ URLs at pos 54–84; (2) manufacturer commercial — captures `cold storage manufacturer` pos 58, `cold store manufacturers in pakistan` pos 11; (3) 8-row cold-room types table — captures `cold room in pharmaceutical industry`, `pharma cold room`, `vaccine cold room`, `pharmaceutical warehouse cold storage`, `pharmacy walk-in cold room`, `ultra-low −80 °C`, `CRT pharmaceutical warehouse`, `clinical-trial chamber`; (4) WHO GMP regulatory stack + WHO PQS E003 vaccine deep-dive — captures `gmp cold storage`, `WHO TRS 961`. FAQ 8 → 18 items covering exact-match informational queries (`what is cold chain`, `gmp cold storage`, `temperature for pharmaceutical storage`, `MKT mean kinetic temperature`, `largest pharmaceutical cold storage manufacturer in Pakistan`, etc). Service JSON-LD upgraded with `hasOfferCatalog` (8 cold-room type Offers) and `additionalProperty` array (18 spec PropertyValues — temp range, redundancy, λ 0.022, fire class B1, density 40-45 kg/m³, design ambient 46 °C, lead times, 25-year envelope design life, manufacturing location, 1959, 2,100+ installations). New `MedicalWebPage` schema overlay (`MedicalEntity`, `MedicalAudience`, `specialty`, `mainContentOfPage`) for pharma authority signal. FAQPage schema mirrors all 18 FAQs. Title + meta rewritten to lead with "GMP Cold Room Manufacturer" instead of "DRAP GMP Cold Rooms". All 4 JSON-LD blocks parse. **Target:** pharma cluster (16,740 imp baseline) clicks > 0 on commercial queries within 14 days, position move from 17.5 → < 10 within 60 days. Verification: re-pull GSC for pharma URL pattern + the 4 informational queries at 14 and 60 days. |
