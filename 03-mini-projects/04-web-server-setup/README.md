# Mini Project 04 — Web Server Setup

**Navigation:** ← [03 — User Account Manager](../03-user-account-manager/README.md) | [Projects Index](../README.md) | Next → [05 — Log Analyzer](../05-log-analyzer/README.md)

---

## Overview

Set up a production-ready Nginx web server serving a static site, with a firewall, a custom error page, and a working HTTPS-ready virtual host config.

**Skills:** Networking, Package Management, Firewall, File Permissions, systemd

---

## What You'll Build

- Nginx installed and running as a service
- Firewall configured to allow HTTP (80) and HTTPS (443)
- A virtual host serving files from `/var/www/mysite/`
- A custom 404 page
- A setup script that automates the entire process

---

## Files

| File | Purpose |
|------|---------|
| `setup.sh` | Installs and configures Nginx |
| `nginx-vhost.conf` | Nginx virtual host configuration |
| `www/index.html` | Sample homepage |
| `www/404.html` | Custom error page |

---

## Setup

```bash
cd ~/linux-administration/03-mini-projects/04-web-server-setup/
chmod +x setup.sh

# Run setup (requires sudo)
sudo ./setup.sh

# Test it
curl http://localhost
```

After running, visit `http://your-server-ip` in a browser.

---

## Learning Goals

- Install and manage Nginx with systemd
- Write Nginx virtual host configuration
- Configure UFW firewall for web traffic
- Set correct file ownership for web content (`www-data`)

---

[← 03 — User Account Manager](../03-user-account-manager/README.md) | [Projects Index](../README.md) | Next → [05 — Log Analyzer](../05-log-analyzer/README.md)
