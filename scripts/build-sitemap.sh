#!/usr/bin/env bash
#
# build-sitemap.sh — regenerate sitemap.xml with per-URL <lastmod> from git.
#
# Why: Google increasingly ignores <lastmod> when every URL declares the same
# date — the field carries no signal. Per-file git mtime gives Google an honest
# crawl-prioritisation signal: pages we actually edit get re-crawled sooner.
#
# Run: bash scripts/build-sitemap.sh
# Wired into Vercel deploys via package.json "vercel-build".

set -euo pipefail

cd "$(dirname "$0")/.."

ROOT="https://izharfoster.com"
TODAY=$(date +%F)

# Manifest: file_path|url_path
# Order: core hubs → city pages → services → tools → projects → blog
# Add new pages here; this is the single source of truth.
MANIFEST=(
  "index.html|/"
  "about.html|/about"
  "contact.html|/contact"
  "clients.html|/clients"
  "projects.html|/projects"
  "faqs.html|/faqs"
  "solutions.html|/solutions"
  "industries.html|/industries"
  "blog.html|/blog"
  "certifications.html|/certifications"

  "cold-storage-lahore.html|/cold-storage-lahore"
  "cold-storage-karachi.html|/cold-storage-karachi"

  "services/cold-stores.html|/services/cold-stores"
  "services/pir-sandwich-panels.html|/services/pir-sandwich-panels"
  "services/refrigeration-systems.html|/services/refrigeration-systems"
  "services/ca-stores.html|/services/ca-stores"
  "services/insulated-doors.html|/services/insulated-doors"
  "services/prefabricated-structures.html|/services/prefabricated-structures"
  "services/refrigerated-vehicles.html|/services/refrigerated-vehicles"
  "services/pharmaceutical-cold-storage.html|/services/pharmaceutical-cold-storage"
  "services/cold-storage-meat-poultry.html|/services/cold-storage-meat-poultry"
  "services/cold-storage-fruit-vegetables.html|/services/cold-storage-fruit-vegetables"
  "services/cold-storage-dairy.html|/services/cold-storage-dairy"
  "services/banana-ripening-rooms.html|/services/banana-ripening-rooms"
  "services/potato-onion-cold-storage.html|/services/potato-onion-cold-storage"

  "tools.html|/tools"
  "tools/cost-calculator.html|/tools/cost-calculator"
  "tools/load-calculator.html|/tools/load-calculator"
  "tools/energy-cost.html|/tools/energy-cost"
  "tools/capacity-planner.html|/tools/capacity-planner"
  "tools/condenser-sizing.html|/tools/condenser-sizing"
  "tools/refrigerant-charge.html|/tools/refrigerant-charge"
  "tools/a2l-room-area.html|/tools/a2l-room-area"
  "tools/ca-atmosphere.html|/tools/ca-atmosphere"

  "projects/tccec-coca-cola-lahore.html|/projects/tccec-coca-cola-lahore"
  "projects/naubahar-bottling-gujranwala.html|/projects/naubahar-bottling-gujranwala"
  "projects/connect-logistics-karachi.html|/projects/connect-logistics-karachi"
  "projects/haier-lab-lahore.html|/projects/haier-lab-lahore"
  "projects/usaid-banana-ripening-sindh.html|/projects/usaid-banana-ripening-sindh"
  "projects/sharaf-logistics-lahore.html|/projects/sharaf-logistics-lahore"
  "projects/iceland-cold-chain-lahore.html|/projects/iceland-cold-chain-lahore"
  "projects/hac-agri-ca-store-phool-nagar.html|/projects/hac-agri-ca-store-phool-nagar"
  "projects/gourmet-ice-cream-lahore.html|/projects/gourmet-ice-cream-lahore"
  "projects/emirates-logistics-lahore.html|/projects/emirates-logistics-lahore"
  "projects/metro-ravi-lahore.html|/projects/metro-ravi-lahore"
  "projects/united-snacks-lahore.html|/projects/united-snacks-lahore"
  "projects/oye-hoye-chips-lahore.html|/projects/oye-hoye-chips-lahore"
  "projects/engro-milk-collection-centre.html|/projects/engro-milk-collection-centre"

  "blog/cold-storage-cost-pakistan-2026-buyers-guide.html|/blog/cold-storage-cost-pakistan-2026-buyers-guide"
  "blog/blast-freezer-vs-blast-chiller-pakistan-guide.html|/blog/blast-freezer-vs-blast-chiller-pakistan-guide"
  "blog/cold-storage-solutions-pakistan-demand-rising.html|/blog/cold-storage-solutions-pakistan-demand-rising"
  "blog/refrigeration-systems-cold-chain-pakistan.html|/blog/refrigeration-systems-cold-chain-pakistan"
  "blog/ca-stores-game-changer-pakistan-agriculture.html|/blog/ca-stores-game-changer-pakistan-agriculture"
  "blog/pir-panels-thermal-efficiency-smart-building.html|/blog/pir-panels-thermal-efficiency-smart-building"
  "blog/insulated-doors-energy-efficiency-cold-storage.html|/blog/insulated-doors-energy-efficiency-cold-storage"
  "blog/cold-storage-pakistan-export-growth.html|/blog/cold-storage-pakistan-export-growth"
  "blog/green-refrigeration-energy-carbon-footprint.html|/blog/green-refrigeration-energy-carbon-footprint"
  "blog/prefabricated-structures-smart-construction-pakistan.html|/blog/prefabricated-structures-smart-construction-pakistan"
  "blog/insulated-industrial-doors-types-benefits-guide.html|/blog/insulated-industrial-doors-types-benefits-guide"
)

OUT=sitemap.xml
COUNT=0

{
  printf '<?xml version="1.0" encoding="UTF-8"?>\n'
  printf '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  for entry in "${MANIFEST[@]}"; do
    file="${entry%|*}"
    url="${entry#*|}"

    # Sanity check: file must exist and not be noindex'd.
    if [ ! -f "$file" ]; then
      printf "WARN: missing file %s — skipped\n" "$file" >&2
      continue
    fi
    if grep -q 'name="robots"[^>]*noindex' "$file"; then
      printf "WARN: %s is noindex — skipped\n" "$file" >&2
      continue
    fi

    # Per-URL mtime from git; falls back to today for un-tracked files.
    lastmod=$(git log -1 --format=%cs -- "$file" 2>/dev/null || true)
    [ -z "$lastmod" ] && lastmod="$TODAY"

    printf '  <url><loc>%s%s</loc><lastmod>%s</lastmod></url>\n' "$ROOT" "$url" "$lastmod"
    COUNT=$((COUNT + 1))
  done
  printf '</urlset>\n'
} > "$OUT"

printf "Wrote %s with %d URLs\n" "$OUT" "$COUNT"
