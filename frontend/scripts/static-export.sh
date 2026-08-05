#!/usr/bin/env bash
# Temporary static-deploy path: builds the marketing site as plain static
# HTML (no Node server) while the host's Node app integration is broken.
# Portal and the contact form use Server Actions / per-client dynamic
# routes, neither supported by `output: export` — both are swapped out for
# the build and restored afterward regardless of success or failure.
set -euo pipefail
cd "$(dirname "$0")/.."

CONTACT_DIR="src/app/(site)/contact"
PORTAL_DIR="src/app/portal"
PORTAL_BACKUP="/tmp/portal-backup-$$"

restore() {
  [ -f "$CONTACT_DIR/page.tsx.real" ] && mv "$CONTACT_DIR/page.tsx.real" "$CONTACT_DIR/page.tsx"
  [ -d "$PORTAL_BACKUP" ] && [ ! -d "$PORTAL_DIR" ] && mv "$PORTAL_BACKUP" "$PORTAL_DIR"
}
trap restore EXIT

mv "$CONTACT_DIR/page.tsx" "$CONTACT_DIR/page.tsx.real"
cp "$CONTACT_DIR/page.static.tsx" "$CONTACT_DIR/page.tsx"
mv "$PORTAL_DIR" "$PORTAL_BACKUP"

STATIC_EXPORT=1 npm run build

echo "Static export ready in ./out/"
