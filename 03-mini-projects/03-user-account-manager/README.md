# Mini Project 03 — User Account Manager

**Navigation:** ← [02 — Automated Backup](../02-automated-backup/README.md) | [Projects Index](../README.md) | Next → [04 — Web Server Setup](../04-web-server-setup/README.md)

---

## Overview

Build an interactive CLI tool to manage user accounts. It wraps `useradd`, `usermod`, `userdel`, and `passwd` in a clean, menu-driven interface with built-in validation.

**Skills:** Users & Groups, Permissions, Shell Scripting

---

## What You'll Build

```
╔══════════════════════════════╗
║   Linux User Account Manager ║
╚══════════════════════════════╝

1. List all users
2. Create a new user
3. Delete a user
4. Lock / Unlock a user
5. Reset a password
6. Add user to group
7. Exit

Select option:
```

---

## Files

| File | Purpose |
|------|---------|
| `user-manager.sh` | Interactive user management menu |

---

## Setup

```bash
cd ~/linux-administration/03-mini-projects/03-user-account-manager/
chmod +x user-manager.sh

# Run (requires sudo for most operations)
sudo ./user-manager.sh
```

---

## Learning Goals

- Build interactive menus with `select` and `read`
- Validate user input
- Wrap system commands safely
- Chain user, group, and permission management

---

[← 02 — Automated Backup](../02-automated-backup/README.md) | [Projects Index](../README.md) | Next → [04 — Web Server Setup](../04-web-server-setup/README.md)
