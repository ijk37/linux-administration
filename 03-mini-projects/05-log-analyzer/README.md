# Mini Project 05 — Log Analyzer

**Navigation:** ← [04 — Web Server Setup](../04-web-server-setup/README.md) | [Projects Index](../README.md)

---

## Overview

Build a log analysis tool that parses Nginx access logs and produces a human-readable summary report: top IPs, top pages, HTTP status codes, error rate, and traffic by hour.

**Skills:** Shell Scripting, grep/awk/sed, System Logs, Networking

---

## What You'll Build

```
╔════════════════════════════════════╗
║     Nginx Access Log Report        ║
║     File: /var/log/nginx/access.log
╚════════════════════════════════════╝

Period: 2024-06-20 00:00 → 2024-06-20 23:59
Total requests: 1,482

[Top 10 IP Addresses]
  203.0.113.5      → 312 requests
  198.51.100.22    → 198 requests
  ...

[Top 10 Requested Pages]
  /                → 445 requests
  /about           → 112 requests
  ...

[HTTP Status Codes]
  200 OK           → 1,201 (81%)
  404 Not Found    → 189  (13%)
  500 Server Error → 12   (1%)

[Requests by Hour]
  00:xx  ████░░░░░░  42
  01:xx  ██░░░░░░░░  21
  ...

[Error Rate]
  4xx: 13%  |  5xx: 1%
```

---

## Files

| File | Purpose |
|------|---------|
| `analyze.sh` | Main log analysis script |
| `sample.log` | Sample Nginx log to practice with |

---

## Setup

```bash
cd ~/linux-administration/03-mini-projects/05-log-analyzer/
chmod +x analyze.sh

# Analyze the sample log
./analyze.sh sample.log

# Analyze real Nginx log (if installed)
sudo ./analyze.sh /var/log/nginx/access.log

# Save report
./analyze.sh sample.log > report.txt
```

---

## Learning Goals

- Parse structured log files with `awk`
- Count and sort occurrences with `sort | uniq -c`
- Generate ASCII bar charts in bash
- Build reusable text-processing scripts

---

[← 04 — Web Server Setup](../04-web-server-setup/README.md) | [Projects Index](../README.md)
