#!/bin/bash
# config.sh — Dashboard configuration

# Thresholds (percentage, triggers warning)
CPU_WARN=80
MEM_WARN=85
DISK_WARN=90

# Services to monitor (space-separated)
SERVICES="ssh cron nginx mysql postgresql"

# Log file (empty = no logging)
LOG_FILE="/var/log/health-dashboard.log"

# Number of recent errors to show from journal
RECENT_ERROR_MINUTES=60
MAX_ERRORS_SHOWN=5
