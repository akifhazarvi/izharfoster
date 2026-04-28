# Deploy to Vercel

Static site — no build step. Pure HTML/CSS/JS. Vercel detects this automatically.

## What Vercel will do

1. Detect "Other / Static" framework (no `next.config.js`, `vite.config.js`, etc.)
2. Skip the build step (none needed)
3. Serve files from project root
4. Honour `vercel.json` for headers, caching, redirects
5. Honour `.vercelignore` to keep `_scrape/`, `_kr_scrape/`, `node_modules/`, internal `.md` docs out of the deployment

## First deployment

### Option A — Vercel CLI (fastest)

```bash
npm install -g vercel
cd ~/projects/izharfoster
vercel
```

Answers:
- Set up and deploy? **Y**
- Scope? (your team)
- Link to existing project? **N** (first time)
- Project name? **izharfoster** (or whatever)
- Directory? `./` (just press Enter)
- Override settings? **N**

You'll get a `*.vercel.app` preview URL. Open it, click through the calculators, verify everything works.

When happy:
```bash
vercel --prod
```

### Option B — Vercel Dashboard (Git-connected)

1. Push this repo to GitHub
2. Go to https://vercel.com/new
3. Import the repo
4. Framework Preset: **Other**
5. Build Command: leave empty
6. Output Directory: leave empty (project root)
7. Install Command: leave empty
8. Click Deploy

Every `git push` to `main` redeploys automatically.

## Custom domain (izharfoster.com)

1. Vercel dashboard → your project → Settings → Domains
2. Add `izharfoster.com` and `www.izharfoster.com`
3. Vercel will show DNS records (an A record + CNAME for www)
4. Update DNS at your registrar to point to Vercel
5. SSL auto-provisions in ~5 min

## What's deployed vs ignored

**Deployed:**
- All `*.html` at root + in `services/`, `tools/`, `blog/`
- `css/style.css`
- `js/main.js`, `js/consultant.js`, `js/tools/*.js`, `js/tools/*.json`
- `images/` (incl. `images/applications/` for the 22 tile photos)
- `sitemap.xml`, `robots.txt`, `llms.txt`
- `package.json`, `vercel.json`

**Ignored (per `.vercelignore`):**
- `_scrape/` — original site scrape (39 MB)
- `_kr_scrape/` — K-RP scrape + research docs + node_modules + Playwright captures
- `node_modules/`
- `*.log`, `.DS_Store`
- `_*.mjs`, `_*.html` (any file starting with `_`)
- `.claude/`, `CLAUDE.md`, `DESIGN.md` (project-internal)

## Caching strategy (set in `vercel.json`)

| Path | Cache-Control |
|---|---|
| `/css/*` | `public, max-age=31536000, immutable` (1 year — content-hashed if you add hashing) |
| `/js/*` | `public, max-age=31536000, immutable` |
| `/images/*` | `public, max-age=31536000, immutable` |
| `*.html` | `public, max-age=0, s-maxage=86400, stale-while-revalidate=604800` (CDN caches 1 day, serves stale up to 1 week while refreshing) |
| `/sitemap.xml` | `public, max-age=3600` |

If you change `style.css` or `js/tools/*.js`, edit-cache-bust by either:
- Adding a `?v=2` query param to the asset link in HTML, or
- Renaming the file (`style.v2.css`)

For now, the immutable cache is fine; visitors get fresh on hard reload, and Vercel auto-invalidates per deploy on the HTML files (which load assets fresh on each session start anyway).

## Headers set

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` (calculator doesn't need any)

If you later add Google Analytics / GTM / Hotjar, you may need to relax `X-Frame-Options` to allow embedded preview frames.

## Redirects

- `/index` → `/` (301)
- `/index.html` → `/` (301)

## Rewrites

- `/tools` → `/tools.html` (lets users type the short URL)

## Post-deploy checklist

- [ ] Visit deployed URL, check all 5 tools render
- [ ] Test on mobile (real device, not just desktop devtools)
- [ ] Verify 3D `<model-viewer>` loads (it pulls from `unpkg.com` CDN — first-time fetch ~150 KB)
- [ ] Verify AR button shows on iOS Safari + Chrome Android
- [ ] Test "Get a quote" CTAs — should open `contact.html?tool=...&summary=...`
- [ ] Test WhatsApp CTAs — should open `wa.me` with prefilled message
- [ ] Confirm sitemap accessible: `https://izharfoster.com/sitemap.xml`
- [ ] Confirm `llms.txt` accessible: `https://izharfoster.com/llms.txt`
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools

## Performance budget

The calculator page weight should be under 500 KB:
- HTML ~25 KB
- CSS (style.css) ~70 KB minified by Vercel auto-Brotli
- JS (`_shared.js + visualiser.js + load-calculator.js`) ~30 KB
- model-viewer from CDN ~150 KB (cached after first visit, shared across whole site)
- 22 application JPGs lazy-loaded (each ~6–13 KB, only visible ones load)

Lighthouse target: ≥ 90 Performance, ≥ 95 Accessibility, 100 Best Practices, 100 SEO.

## Rolling back a bad deploy

```bash
vercel rollback           # interactive list of recent deploys
```

Or in dashboard: Deployments → pick the previous one → "Promote to Production".

## Environment variables

None needed. Site is fully static. If you later add an analytics ID or contact-form backend, set them in Vercel dashboard → Settings → Environment Variables.
