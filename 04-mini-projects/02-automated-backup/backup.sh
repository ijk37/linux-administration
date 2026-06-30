#!/bin/bash
# backup.sh — Automated backup with rotation
#
# Usage:
#   ./backup.sh           Run a backup
#   ./backup.sh --list    List available backups

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ARCHIVE_NAME="${ARCHIVE_PREFIX}_${TIMESTAMP}.tar.gz"
ARCHIVE_PATH="${BACKUP_DEST}/${ARCHIVE_NAME}"

log() {
    local MSG="[$(date '+%Y-%m-%d %H:%M:%S')] $*"
    echo "$MSG"
    echo "$MSG" >> "$LOG_FILE" 2>/dev/null || true
}

list_backups() {
    echo "Available backups in $BACKUP_DEST:"
    echo "--------------------------------------"
    ls -lh "$BACKUP_DEST"/*.tar.gz 2>/dev/null || echo "  (none found)"
    echo ""
    local COUNT
    COUNT=$(ls "$BACKUP_DEST"/*.tar.gz 2>/dev/null | wc -l)
    echo "Total: $COUNT backup(s)"
}

rotate_backups() {
    local COUNT
    COUNT=$(ls "$BACKUP_DEST"/*.tar.gz 2>/dev/null | wc -l)
    if [ "$COUNT" -gt "$RETENTION_COUNT" ]; then
        local DELETE_COUNT=$(( COUNT - RETENTION_COUNT ))
        log "Rotating: removing $DELETE_COUNT old backup(s) (keeping $RETENTION_COUNT)"
        ls -t "$BACKUP_DEST"/*.tar.gz | tail -"$DELETE_COUNT" | while IFS= read -r OLD; do
            rm -f "$OLD"
            log "Deleted: $OLD"
        done
    fi
}

run_backup() {
    log "=============================="
    log "Backup started"
    log "Sources: $BACKUP_SOURCES"
    log "Destination: $ARCHIVE_PATH"

    mkdir -p "$BACKUP_DEST"

    # Validate sources
    for SRC in $BACKUP_SOURCES; do
        if [ ! -e "$SRC" ]; then
            log "WARNING: Source '$SRC' does not exist — skipping"
        fi
    done

    # Create archive
    local START_TIME
    START_TIME=$(date +%s)

    # shellcheck disable=SC2086
    tar -czf "$ARCHIVE_PATH" \
        --warning=no-file-changed \
        $BACKUP_SOURCES 2>/dev/null || {
        log "ERROR: Backup failed!"
        exit 1
    }

    local END_TIME
    END_TIME=$(date +%s)
    local ELAPSED=$(( END_TIME - START_TIME ))
    local SIZE
    SIZE=$(du -sh "$ARCHIVE_PATH" | cut -f1)

    log "Archive created: $ARCHIVE_NAME ($SIZE) in ${ELAPSED}s"

    rotate_backups

    log "Backup complete"
    log "=============================="
}

# ── Main ─────────────────────────────────────────────────────────────────────
case "${1:-}" in
    --list) list_backups ;;
    "")     run_backup ;;
    *)      echo "Usage: $0 [--list]"; exit 1 ;;
esac
