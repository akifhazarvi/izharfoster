#!/usr/bin/env python3
"""
Restore canonical-domain references to https://izharfoster.com
across all HTML pages. Run this when migrating from the Vercel
preview deploy to the real izharfoster.com domain.

For each page it:
  1. Re-inserts <link rel="canonical" href="https://izharfoster.com/<path>">
  2. Re-inserts <meta property="og:url" content="https://izharfoster.com/<path>">
  3. Restores absolute https://izharfoster.com on og:image
  4. Restores absolute prod URLs in JSON-LD blocks

The path is computed from the file location relative to project root.
Uses cleanUrls (no .html in canonical), matching vercel.json.
"""
import os, re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
EXCLUDE_DIRS = {'_scrape', '_kr_scrape', '.git', 'node_modules', '_scripts'}
PROD = 'https://izharfoster.com'

def canonical_path_for(rel_path: str) -> str:
    """Map a file path like 'services/cold-stores.html' to '/services/cold-stores'.
    index.html at root maps to '/'."""
    p = rel_path.replace(os.sep, '/')
    if p == 'index.html':
        return '/'
    if p.endswith('/index.html'):
        return '/' + p[:-len('/index.html')]
    if p.endswith('.html'):
        return '/' + p[:-len('.html')]
    return '/' + p

OG_IMAGE_REL = re.compile(r'(<meta property="og:image" content=")(/[^"]+)(")')
HEAD_OPEN = re.compile(r'(<meta property="og:type"[^>]*>\s*\n)', re.IGNORECASE)
DESC_LINE = re.compile(r'(<meta name="description"[^>]*>\s*\n)', re.IGNORECASE)

# JSON-LD: any "/path" string-value -> "https://izharfoster.com/path".
# We only rewrite values that *start* with a slash inside JSON strings, in <script type="application/ld+json"> blocks.
JSONLD_BLOCK = re.compile(
    r'(<script type="application/ld\+json"[^>]*>)(.*?)(</script>)',
    re.DOTALL,
)
RELATIVE_JSON_URL = re.compile(r'"(/[A-Za-z0-9_\-/.#?=&%]*)"')

JSONLD_KEY_FIELDS = {'"url"', '"item"', '"@id"'}

def restore_jsonld(block_text: str) -> str:
    # Conservative: only rewrite the right-hand side of url/item/@id keys when value starts with /.
    def rewrite(m):
        val = m.group(1)
        return f'"{PROD}{val}"'
    # Build a regex that matches `"url": "/path"` etc.
    pattern = re.compile(
        r'(\"(?:url|item|@id)\"\s*:\s*)\"(/[A-Za-z0-9_\-/.#?=&%]*)\"'
    )
    def k_rewrite(m):
        return f'{m.group(1)}"{PROD}{m.group(2)}"'
    return pattern.sub(k_rewrite, block_text)

def already_has_canonical(s: str) -> bool:
    return '<link rel="canonical"' in s

def already_has_og_url(s: str) -> bool:
    return '<meta property="og:url"' in s

def insert_meta(s: str, canonical_url: str) -> str:
    """Insert canonical + og:url near the existing OG tags."""
    # Prefer to place canonical right after <meta name="description"> if present
    canonical_tag = f'<link rel="canonical" href="{canonical_url}">\n'
    og_url_tag = f'<meta property="og:url" content="{canonical_url}">\n'

    if not already_has_canonical(s):
        m = DESC_LINE.search(s)
        if m:
            s = s[:m.end()] + canonical_tag + s[m.end():]
        else:
            # fallback: after first <head ...>
            s = re.sub(r'(<head[^>]*>\s*\n)', r'\1' + canonical_tag, s, count=1)

    if not already_has_og_url(s):
        # Place og:url right after og:type when present, else after canonical
        m = HEAD_OPEN.search(s)
        if m:
            s = s[:m.end()] + og_url_tag + s[m.end():]
        else:
            s = s.replace(canonical_tag, canonical_tag + og_url_tag, 1)
    return s

def restore_og_image(s: str) -> str:
    return OG_IMAGE_REL.sub(rf'\1{PROD}\2\3', s)

def restore_jsonld_blocks(s: str) -> str:
    def repl(m):
        return m.group(1) + restore_jsonld(m.group(2)) + m.group(3)
    return JSONLD_BLOCK.sub(repl, s)

changed = 0
for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
    for fn in filenames:
        if not fn.endswith('.html'):
            continue
        p = os.path.join(dirpath, fn)
        rel = os.path.relpath(p, ROOT)
        canon = PROD + canonical_path_for(rel)
        with open(p, 'r', encoding='utf-8') as fh:
            s = fh.read()
        orig = s
        s = insert_meta(s, canon)
        s = restore_og_image(s)
        s = restore_jsonld_blocks(s)
        if s != orig:
            with open(p, 'w', encoding='utf-8') as fh:
                fh.write(s)
            changed += 1
            print('restored:', rel, '->', canon)
print(f'\n{changed} file(s) restored for production deploy on izharfoster.com.')
