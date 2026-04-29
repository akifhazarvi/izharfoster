#!/usr/bin/env python3
"""
Strip canonical-domain references so a Vercel preview deploy
shows the *.vercel.app URL when pasted into WhatsApp / Slack /
LinkedIn etc., instead of redirecting to izharfoster.com.

Idempotent: safe to run multiple times.
Reverse with restore-canonical.py.
"""
import os, re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
EXCLUDE_DIRS = {'_scrape', '_kr_scrape', '.git', 'node_modules', '_scripts'}
EXTS = ('.html',)

# Patterns that point to the prod canonical domain in <head> meta or JSON-LD
# We comment them out (keep them removable later) using HTML / JSON-LD-safe markers.

PATTERNS_REMOVE = [
    # Canonical link
    re.compile(r'^\s*<link rel="canonical"[^>]*>\s*\n', re.MULTILINE),
    # OG URL
    re.compile(r'^\s*<meta property="og:url"[^>]*>\s*\n', re.MULTILINE),
]

# OG image: switch absolute -> relative so it resolves against whatever domain serves the page
OG_IMAGE_PROD = re.compile(r'(<meta property="og:image" content=")https://izharfoster\.com(/[^"]+)(")')

# JSON-LD URLs: replace the absolute izharfoster.com origin with empty so URLs become relative paths.
# This keeps schema valid (paths) while not leaking the prod hostname.
JSONLD_URL = re.compile(r'"https://izharfoster\.com')

changed = 0
for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
    for fn in filenames:
        if not fn.endswith(EXTS):
            continue
        p = os.path.join(dirpath, fn)
        with open(p, 'r', encoding='utf-8') as fh:
            s = fh.read()
        orig = s
        for pat in PATTERNS_REMOVE:
            s = pat.sub('', s)
        s = OG_IMAGE_PROD.sub(r'\1\2\3', s)
        s = JSONLD_URL.sub('"', s)
        if s != orig:
            with open(p, 'w', encoding='utf-8') as fh:
                fh.write(s)
            changed += 1
            print('preview-prepped:', os.path.relpath(p, ROOT))
print(f'\n{changed} file(s) updated for Vercel preview deploy.')
print('Run restore-canonical.py before going to production on izharfoster.com.')
