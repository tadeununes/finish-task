#!/usr/bin/env bash
# Installs the finish-task Claude Code skill.
#
# Usage:
#   ./install.sh              # personal scope — available in every project (~/.claude/skills/finish-task)
#   ./install.sh --project    # project scope — this repo only (./.claude/skills/finish-task)

set -euo pipefail

SKILL_NAME="finish-task"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$SCRIPT_DIR/$SKILL_NAME"

SCOPE="personal"
if [ "${1:-}" = "--project" ]; then
  SCOPE="project"
fi

if [ ! -d "$SOURCE_DIR" ]; then
  echo "Error: $SOURCE_DIR not found. Run this script from the repository root." >&2
  exit 1
fi

if [ "$SCOPE" = "project" ]; then
  TARGET_DIR="$(pwd)/.claude/skills/$SKILL_NAME"
else
  TARGET_DIR="$HOME/.claude/skills/$SKILL_NAME"
fi

mkdir -p "$(dirname "$TARGET_DIR")"

if [ -e "$TARGET_DIR" ]; then
  BACKUP="${TARGET_DIR}.bak.$(date +%s)"
  echo "Existing $TARGET_DIR found — backing it up to $BACKUP"
  mv "$TARGET_DIR" "$BACKUP"
fi

cp -r "$SOURCE_DIR" "$TARGET_DIR"

echo ""
echo "Installed finish-task ($SCOPE scope) to:"
echo "  $TARGET_DIR"
echo ""
echo "Next steps:"
echo "  1. Restart any running Claude Code session (a brand-new top-level skills"
echo "     directory is only picked up on start, not mid-session)."
echo "  2. Run /doctor, or ask \"What skills are available?\", to confirm it loaded."
echo "  3. Invoke it explicitly with /finish-task — it will not trigger on its"
echo "     own (disable-model-invocation is on by design)."
