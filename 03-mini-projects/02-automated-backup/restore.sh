#!/bin/bash
# restore.sh — Restore from a backup archive
#
# Usage:
#   ./restore.sh --latest <dest_dir>
#   ./restore.sh <archive.tar.gz> <dest_dir>

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"

usage() {
    echo "Usage:"
    echo "  $0 --latest <destination_dir>"
    echo "  $0 <backup_archive.tar.gz> <destination_dir>"
    exit 1
}

[ $# -lt 2 ] && usage

DEST_DIR="${*: -1}"   # last argument is always the destination

if [ "$1" == "--latest" ]; then
    ARCHIVE=$(ls -t "$BACKUP_DEST"/*.tar.gz 2>/dev/null | head -1)
    if [ -z "$ARCHIVE" ]; then
        echo "Error: No backups found in $BACKUP_DEST"
        exit 1
    fi
    echo "Latest backup: $ARCHIVE"
else
    ARCHIVE=$1
fi

if [ ! -f "$ARCHIVE" ]; then
    echo "Error: Archive '$ARCHIVE' not found."
    exit 1
fi

mkdir -p "$DEST_DIR"

echo "Restoring from: $ARCHIVE"
echo "Destination:    $DEST_DIR"
echo ""

# Preview contents
echo "Archive contents (top 20 entries):"
tar -tzf "$ARCHIVE" | head -20
echo ""

read -r -p "Proceed with restore? [y/N] " CONFIRM
[[ "$CONFIRM" =~ ^[Yy]$ ]] || { echo "Cancelled."; exit 0; }

tar -xzf "$ARCHIVE" -C "$DEST_DIR"
echo ""
echo "Restore complete → $DEST_DIR"
