#!/bin/bash
# config.sh — Backup configuration

# Directories to back up (space-separated)
BACKUP_SOURCES="/home /etc"

# Where to store backups
BACKUP_DEST="/var/backups/mybackups"

# How many backups to keep (older ones are deleted)
RETENTION_COUNT=7

# Log file
LOG_FILE="/var/log/backup.log"

# Archive prefix
ARCHIVE_PREFIX="backup"
