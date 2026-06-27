# Mini Project 01 — System Health Dashboard

**Navigation:** [Projects Index](../README.md) | Next → [02 — Automated Backup](../02-automated-backup/README.md)

---

## Overview

Build a terminal-based system health dashboard that shows key metrics at a glance. Run it manually or schedule it to generate periodic reports.

**Skills:** Shell Scripting, System Monitoring, Process Management, Cron

---

## What You'll Build

A script that outputs a formatted report like this:

```
╔══════════════════════════════════════════════╗
║     SYSTEM HEALTH DASHBOARD — 2024-06-20     ║
╚══════════════════════════════════════════════╝

HOST: myserver | UPTIME: 3 days, 4:12

[CPU]
  Load (1/5/15): 0.42 / 0.38 / 0.31
  Cores: 4 | Usage: ~10%

[MEMORY]
  Total: 7.7G | Used: 2.1G | Free: 5.2G | Used: 27%

[DISK]
  /         → 45% used (22G/50G)
  /home     → 12% used (6G/50G)

[NETWORK]
  Interface: eth0 | IP: 192.168.1.10

[SERVICES]
  [OK]   ssh
  [OK]   cron
  [DOWN] nginx

[RECENT ERRORS]
  (none in the last hour)
```

---

## Files

| File | Purpose |
|------|---------|
| `dashboard.sh` | Main dashboard script |
| `config.sh` | Configuration (thresholds, services to check) |

---

## Setup

```bash
# Clone or navigate to the project
cd ~/linux-administration/03-mini-projects/01-system-health-dashboard/

# Make scripts executable
chmod +x dashboard.sh

# Run it
./dashboard.sh

# Run with color disabled (for log files)
./dashboard.sh --no-color

# Schedule it every hour via cron
crontab -e
# Add: 0 * * * * /path/to/dashboard.sh --no-color >> /var/log/health-dashboard.log
```

---

## Learning Goals

After completing this project you will be able to:
- Extract CPU, memory, and disk metrics programmatically
- Check service status from a script
- Format terminal output with colors and borders
- Schedule a script with cron

---

[Projects Index](../README.md) | Next → [02 — Automated Backup](../02-automated-backup/README.md)
