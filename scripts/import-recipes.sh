#!/bin/bash
set -euo pipefail

FILE="${1:?Usage: ./scripts/import-recipes.sh <recipes.ndjson>}"

if [ ! -f "$FILE" ]; then
  echo "Error: File not found: $FILE"
  exit 1
fi

LINES=$(wc -l < "$FILE" | tr -d ' ')
echo "Importing $LINES recipes from $FILE..."

echo "Validating JSON..."
while IFS= read -r line; do
  echo "$line" | python3 -c "import sys, json; json.load(sys.stdin)" 2>/dev/null || {
    echo "Invalid JSON line: $line"
    exit 1
  }
done < "$FILE"
echo "All lines valid."

echo "Importing to Sanity..."
npx sanity dataset import "$FILE" production
echo "Done! $LINES recipes imported."
echo ""
echo "Next steps:"
echo "1. Visit your Sanity Studio to review imported recipes"
echo "2. Add hero images for featured recipes"
echo "3. Add YouTube URLs using the youtube_search_query hints"
