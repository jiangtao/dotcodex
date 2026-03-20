#!/bin/sh

set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
SOURCE_DIR="/Users/jt/places/personal/dotclaude/superpowers"
TARGET_DIR="$ROOT_DIR/references/dotclaude-superpowers"

if [ ! -d "$SOURCE_DIR" ]; then
  echo "Source not found: $SOURCE_DIR" >&2
  exit 1
fi

rm -rf "$TARGET_DIR"
mkdir -p "$ROOT_DIR/references"
cp -R "$SOURCE_DIR" "$TARGET_DIR"

echo "Synced superpowers into $TARGET_DIR"
