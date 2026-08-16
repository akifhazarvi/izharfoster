# Domain consolidation — izharfostercoldstore.com → izharfoster.com

**Status:** ready to apply · **Prepared:** 2026-08-15 · **Owner:** Akif

## Why

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

## Redirect map

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

## The file

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

## Order of operations

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
