# 05 — Package Management

**Navigation:** ← [04 — File Permissions](04-file-permissions.md) | [Notes Index](README.md) | Next → [06 — Process Management](06-process-management.md)
**Exercise:** [Exercise 05](../02-exercises/05-package-management.md)

---

## What is a Package?

A **package** is a bundled archive containing:
- Program binaries
- Configuration files
- Documentation
- Dependency metadata

Package managers handle installing, upgrading, configuring, and removing software — and resolve dependencies automatically.

---

## Debian/Ubuntu — APT

`apt` (Advanced Package Tool) is the high-level front-end. `dpkg` is the low-level backend.

### Updating Package Lists

```bash
# Always update before installing
sudo apt update

# Upgrade all installed packages
sudo apt upgrade

# Full upgrade (may remove conflicting packages)
sudo apt full-upgrade
```

### Installing & Removing

```bash
# Install a package
sudo apt install nginx

# Install multiple packages
sudo apt install git curl wget

# Remove (keep config files)
sudo apt remove nginx

# Remove including config files
sudo apt purge nginx

# Remove unused dependencies
sudo apt autoremove
```

### Searching & Inspecting

```bash
# Search for a package by name/description
apt search nginx

# Show package details
apt show nginx

# List installed packages
apt list --installed

# List packages that can be upgraded
apt list --upgradable
```

### dpkg — Low-Level

```bash
# Install a .deb file
sudo dpkg -i package.deb

# List all installed packages
dpkg -l

# Check if a package is installed
dpkg -s nginx

# List files installed by a package
dpkg -L nginx

# Which package owns a file?
dpkg -S /usr/bin/nginx
```

---

## Red Hat/CentOS/Fedora — DNF / YUM

`dnf` is the modern package manager for Red Hat-based systems (replaces `yum`).

```bash
# Update package list & upgrade
sudo dnf update

# Install
sudo dnf install httpd

# Remove
sudo dnf remove httpd

# Search
dnf search nginx

# Package info
dnf info nginx

# List installed
dnf list installed

# Which package provides a file?
dnf provides /usr/bin/nginx

# Clean cache
sudo dnf clean all
```

### RPM — Low-Level

```bash
# Install a .rpm file
sudo rpm -ivh package.rpm

# Upgrade
sudo rpm -Uvh package.rpm

# Remove
sudo rpm -e package-name

# List all installed
rpm -qa

# Query what files a package installed
rpm -ql nginx
```

---

## Snap Packages

Snaps are self-contained packages with bundled dependencies, distributed by Canonical.

```bash
# Install
sudo snap install vlc

# List installed snaps
snap list

# Update all snaps
sudo snap refresh

# Remove
sudo snap remove vlc
```

---

## Flatpak

Cross-distro universal package format, commonly used for desktop apps.

```bash
# Add Flathub repository
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo

# Install
flatpak install flathub org.gimp.GIMP

# Run
flatpak run org.gimp.GIMP

# Update
flatpak update

# Remove
flatpak uninstall org.gimp.GIMP
```

---

## Compiling from Source

When a package isn't in any repository:

```bash
# 1. Download and extract
wget https://example.com/software-1.0.tar.gz
tar -xzf software-1.0.tar.gz
cd software-1.0/

# 2. Install build tools
sudo apt install build-essential

# 3. Configure
./configure --prefix=/usr/local

# 4. Build
make

# 5. Install
sudo make install
```

---

## Package Repositories

Repositories are sources from which packages are downloaded.

```bash
# APT sources
cat /etc/apt/sources.list
ls /etc/apt/sources.list.d/

# Add a PPA (Ubuntu)
sudo add-apt-repository ppa:ondrej/php
sudo apt update

# Import a GPG key for a repo
curl -fsSL https://example.com/key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/example.gpg
```

---

## Quick Comparison

| Task | APT (Debian/Ubuntu) | DNF (RHEL/Fedora) |
|------|--------------------|--------------------|
| Update lists | `apt update` | `dnf check-update` |
| Upgrade all | `apt upgrade` | `dnf upgrade` |
| Install | `apt install pkg` | `dnf install pkg` |
| Remove | `apt remove pkg` | `dnf remove pkg` |
| Search | `apt search keyword` | `dnf search keyword` |
| Info | `apt show pkg` | `dnf info pkg` |
| List installed | `apt list --installed` | `dnf list installed` |

---

**Navigation:** ← [04 — File Permissions](04-file-permissions.md) | [Notes Index](README.md) | Next → [06 — Process Management](06-process-management.md)
**Exercise:** [Exercise 05](../02-exercises/05-package-management.md)
