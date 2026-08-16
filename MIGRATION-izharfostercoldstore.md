# Domain consolidation — izharfostercoldstore.com → izharfoster.com

**Status:** Route A pre-wired and deployed · **Prepared:** 2026-08-15 · **Owner:** Akif

> **Two routes. Route A is recommended and is already built.**
>
> **Route A — move the domain to Vercel (recommended).** Point the DNS at
> Vercel, add the domain to the izharfoster project, and the edge does the
> redirecting. The host-scoped rules are already live in `vercel.json`, so this
> becomes a DNS change and one dashboard step — no `.htaccess`, no Hostinger,
> and the WordPress install goes away entirely. That last part matters: an
> unmaintained WordPress + Elementor site with an exposed author archive is a
> security surface as well as an SEO liability.
>
> **Route B — leave it on Hostinger and redirect via `.htaccess`.** Keeps
> WordPress alive and running. Use only if the DNS cannot be moved.
>
> **Not a route:** transferring the domain *registration* to another registrar
> or account. That is billing admin. The WordPress site keeps serving and keeps
> competing for our terms. It changes nothing for Google.

## Route A — the steps

1. **Verify `izharfostercoldstore.com` in Search Console first**, while the old
   site is still live. Verification needs the live site, and Change of Address
   needs both properties verified. Skip this and the option is gone.
2. In the domain's DNS, point the apex and `www` at Vercel
   (Vercel prints the exact A / CNAME target when you add the domain).
3. **Vercel → izharfoster project → Settings → Domains → Add**
   `izharfostercoldstore.com` and `www.izharfostercoldstore.com`.
   Add them as normal domains — do **not** use Vercel's "Redirect to" option,
   because that would send every path to the homepage and throw away the
   page-by-page map below.
4. The rules in `vercel.json` take over automatically. They are scoped with a
   `has` host condition, so they can only ever fire for the old domain and
   cannot affect izharfoster.com.
5. **Test** — expect a `308` and the mapped destination:
   ```bash
   for p in / /about-us /products /contact-us /ammonia-refrigeration \
            /freon-refrigeration-systems /refrigeration-2 /hello-world; do
     curl -s -o /dev/null -w "%{http_code} $p -> %{redirect_url}\n" \
       "https://izharfostercoldstore.com$p"
   done
   ```
6. **Search Console → Settings → Change of Address**, old property →
   izharfoster.com.
7. **Keep the domain registered and renewed.** If it lapses the redirects die
   and the equity goes with them.
8. Once traffic has settled, decommission the Hostinger WordPress install.

Vercel issues `308` rather than `301`. Both are permanent and both pass ranking
signals; `308` additionally preserves the HTTP method. Google treats them the
same for consolidation.

## Route A — the exact DNS change

Checked 2026-08-15. **`izharfostercoldstore.com` has no MX records**, so there
is no email on the domain and the DNS change cannot break mail. (The lone TXT
record is a hosting verification hash, not SPF.)

| | Now (Hostinger) | Change to (Vercel) |
|---|---|---|
| Nameservers | `ns1.dns-parking.com`, `ns2.dns-parking.com` | **leave as-is** — no need to move DNS hosting |
| `@` (apex) | `A → 151.106.96.216` | `A → 76.76.21.21` |
| `www` | `A → 151.106.96.216` | **delete the A record**, add `CNAME → cname.vercel-dns.com` |

`76.76.21.21` and `cname.vercel-dns.com` are the values izharfoster.com already
uses, so they are known-good for this project — but use whatever Vercel prints
when you add the domain, in case it has changed.

**Order:**

1. **Verify the domain in Search Console first** — use the **DNS TXT** method,
   not the HTML-file method. A TXT record survives the migration; an HTML file
   stops being reachable the moment the redirects go live, and verification
   would lapse.
2. **Export/back up anything you want off the WordPress site.** Once DNS moves,
   that site is gone from this address.
3. In Hostinger → **Domains → DNS / Nameservers**, lower the TTL on the two
   records to 300 s and wait for the old TTL to expire. This makes the cutover
   minutes rather than hours. Optional but cheap.
4. **Vercel → izharfoster project → Settings → Domains → Add**
   `izharfostercoldstore.com`, then `www.izharfostercoldstore.com`.
   Vercel will show "Invalid Configuration" until DNS propagates — expected.
5. Change the two DNS records as per the table.
6. Wait for propagation, then test:
   ```bash
   dig +short izharfostercoldstore.com A          # expect 76.76.21.21
   curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" \
     https://izharfostercoldstore.com/about-us     # expect 308 -> /about
   ```
7. **Search Console → Settings → Change of Address**, old property →
   izharfoster.com.
8. Once traffic has settled, cancel the Hostinger hosting plan — but **keep the
   domain registered**. If it lapses the redirects die and the equity with it.

Vercel issues TLS certificates automatically once DNS resolves; there is
nothing to configure for HTTPS.

## Why consolidate at all


`izharfostercoldstore.com` is a 7-page WordPress/Elementor site on Hostinger
(LiteSpeed) that competes directly with the main site for the term we are
actively trying to win.

| Signal | Finding |
|---|---|
| Its H1 | **"Pakistan's #1 Cold Store Manufacturer"** — the exact phrase `/services/cold-stores` now targets |
| Homepage `<title>` | **Empty.** The strongest on-page ranking signal, blank |
| Other titles | Bare — "About Us", "Contact us"; `/products` is titled "Projects" |
| Homepage length | 965 words. Thin |
| WordPress leftovers | `/hello-world/`, `/category/uncategorized/`, `/author/redcreativeadsgmail-com/` (exposes the agency gmail) |
| Brand facts | Says **"50 years"**; the main site says since **1959** (67 years). No mention of 1959, "largest", or sandwich panels |
| NAP | Same `info@izharfoster.com`, **different phone** (+92 311 4385003). Inconsistent NAP damages local ranking — directly relevant, since GSC reports `/cold-storage-near-me` as *"URL is unknown to Google"* |

Two of our own domains bidding for one SERP slot, and the weaker one is the
one Google may pick. Consolidation is the ranking fix, not a tidy-up.

**Do not simply switch the site off.** A hard delete discards whatever links
and citations the domain holds. A 301 passes them to izharfoster.com.

## Redirect map (applies to both routes)

Every destination verified live (HTTP 200) on 2026-08-15.

| From | To |
|---|---|
| `/` | `/` |
| `/about-us` | `/about` |
| `/products` | `/solutions` |
| `/contact-us` | `/contact` |
| `/ammonia-refrigeration` | `/services/refrigeration-systems` |
| `/freon-refrigeration-systems` | `/services/refrigeration-systems` |
| `/refrigeration-2` | `/services/refrigeration-systems` |
| `/hello-world/`, `/category/*`, `/author/*`, feeds | `/` |
| anything else | `/` |

## Route B — the `.htaccess` file (only if the DNS cannot move)

Paste into `.htaccess` in the **web root of izharfostercoldstore.com**
(`public_html/`), **above** the `# BEGIN WordPress` block. LiteSpeed reads
`.htaccess` the same way Apache does.

```apache
# ── Izhar Foster domain consolidation ──────────────────────────────────────
# izharfostercoldstore.com -> izharfoster.com   (2026-08-15)
# 301 = permanent, so ranking signals transfer. Must sit ABOVE "# BEGIN WordPress".
<IfModule mod_rewrite.c>
RewriteEngine On

# Keep admin, login and robots.txt reachable so the site stays recoverable
# and crawlers can still read robots.txt during the move.
RewriteCond %{REQUEST_URI} ^/(wp-admin|wp-login\.php|wp-json|robots\.txt) [NC]
RewriteRule ^ - [L]

# Page-by-page map — a matched redirect is always better than a blanket one,
# because it lands the visitor on the equivalent page instead of the homepage.
RewriteRule ^about-us/?$                    https://izharfoster.com/about [R=301,L]
RewriteRule ^products/?$                    https://izharfoster.com/solutions [R=301,L]
RewriteRule ^contact-us/?$                  https://izharfoster.com/contact [R=301,L]
RewriteRule ^ammonia-refrigeration/?$       https://izharfoster.com/services/refrigeration-systems [R=301,L]
RewriteRule ^freon-refrigeration-systems/?$ https://izharfoster.com/services/refrigeration-systems [R=301,L]
RewriteRule ^refrigeration-2/?$             https://izharfoster.com/services/refrigeration-systems [R=301,L]

# WordPress defaults with no equivalent — send home rather than 404.
RewriteRule ^hello-world/?$                 https://izharfoster.com/ [R=301,L]
RewriteRule ^category/                      https://izharfoster.com/ [R=301,L]
RewriteRule ^author/                        https://izharfoster.com/ [R=301,L]
RewriteRule ^comments/feed/?$               https://izharfoster.com/ [R=301,L]
RewriteRule ^feed/?$                        https://izharfoster.com/ [R=301,L]

# Catch-all, including the homepage.
RewriteRule ^(.*)$                          https://izharfoster.com/ [R=301,L]
</IfModule>
# ── end consolidation ──────────────────────────────────────────────────────
```

## Route B — order of operations

1. **Back up** the WordPress site first (Hostinger → Files → Backups). The
   redirect is reversible by deleting the block, but back up anyway.
2. **Verify `izharfostercoldstore.com` in Search Console** *before* redirecting
   — verification needs the live site, and Change of Address needs both
   properties verified. Do this first or you lose the option.
3. Paste the block into `.htaccess`, above `# BEGIN WordPress`.
4. **Test** (expect `301` and the mapped destination):
   ```bash
   for p in / /about-us /products /contact-us /ammonia-refrigeration \
            /freon-refrigeration-systems /refrigeration-2 /hello-world/; do
     curl -s -o /dev/null -w "%{http_code} $p -> %{redirect_url}\n" \
       "https://izharfostercoldstore.com$p"
   done
   ```
   Confirm `https://izharfostercoldstore.com/wp-admin/` still loads.
5. **Search Console → Settings → Change of Address**, old property →
   izharfoster.com. This tells Google it is a move, not a coincidence.
6. **Keep the domain registered.** Renew it. If it lapses the redirects die and
   the equity goes with them.

## Expected outcome

Google needs weeks to reassign signals; expect movement over **4–8 weeks**, not
days. The immediate win is removing a competitor for our own core term and
ending the NAP conflict.

## Related domains — separate decisions

- **`fostercoldstoreandsandwichpanels.com`** — DNS resolves nothing, but Google
  still has it indexed. A dead end carrying the brand. Either restore DNS long
  enough to 301 it here, or let it drop out of the index.
- **`foostercooler.us`** — dead; sits unverified in the GSC account. Remove the
  property or let it go.
- **`fostercoolers.us`** — live, targets the **US** with different branding
  ("Foster Refrigerators USA"). Not cannibalising the Pakistani terms, so it is
  a legitimate separate play if deliberate. **Worth a legal check:** "Foster
  Refrigerator" is an established refrigeration brand internationally — confirm
  there is no trademark exposure before investing further in that name.

## Not yet measured

Link equity per domain is unknown — Ahrefs and Semrush are connected to the
workspace but **not authorised**, so referring-domain counts could not be
pulled. Authorising them (claude.ai connector settings) would show whether this
migration moves ~50 links or ~500, which is the difference between a tidy-up
and a priority.
