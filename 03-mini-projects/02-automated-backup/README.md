# Mini Project 02 — Automated Backup System

**Navigation:** ← [01 — Health Dashboard](../01-system-health-dashboard/README.md) | [Projects Index](../README.md) | Next → [03 — User Account Manager](../03-user-account-manager/README.md)

---

## Overview

Build a configurable, automated backup system that:
- Backs up one or more directories to a destination
- Creates timestamped archives
- Retains only the last N backups (rotation)
- Logs every run
- Sends a summary on completion

**Skills:** File System, Shell Scripting, Cron, Compression

---

## What You'll Build

```
backups/
├── backup_20240620_020000.tar.gz   ← daily backup
├── backup_20240619_020000.tar.gz
├── backup_20240618_020000.tar.gz
└── backup.log
```

---

## Files

| File | Purpose |
|------|---------|
| `backup.sh` | Main backup script |
| `config.sh` | Directories to back up, retention policy |
| `restore.sh` | Restore from a backup archive |

---

## Setup

```bash
cd ~/linux-administration/03-mini-projects/02-automated-backup/
chmod +x backup.sh restore.sh

# Run a backup
./backup.sh

# List available backups
./backup.sh --list

# Restore latest backup
./restore.sh --latest /tmp/restore-test/

# Schedule daily at 2 AM
crontab -e
# Add: 0 2 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1
```

---

## Learning Goals

- Archive directories using `tar`
- Implement log rotation logic in bash
- Handle errors and report success/failure
- Use cron for scheduled automation

---

[← 01 — Health Dashboard](../01-system-health-dashboard/README.md) | [Projects Index](../README.md) | Next → [03 — User Account Manager](../03-user-account-manager/README.md)
