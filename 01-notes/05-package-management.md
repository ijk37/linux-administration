# 05 — Package Management

**Navigation:** ← [04 — File Permissions](04-file-permissions.md) | [Notes Index](README.md) | Next → [06 — Process Management](06-process-management.md)
**Exercise:** [Exercise 05](../02-exercises/05-package-management-exe.md)

---

## What is a Package?

In Linux, software is distributed as **packages**. A package is a bundle that contains:
- The program's files (the actual software)
- Where each file should be placed on your system
- A list of other packages this software needs to work (called **dependencies**)

A **package manager** is a tool that downloads, installs, and removes packages for you. It automatically handles dependencies — so if you want to install `ffmpeg`, it also installs every other library `ffmpeg` needs, without you having to figure that out yourself.

> **Think of it like an app store**, but for the terminal — and completely free.

---

## Which Package Manager Do You Have?

This depends on your Linux distribution:

| Distro | Package Manager | Command |
|--------|----------------|---------|
| Ubuntu, Debian, Mint | APT | `apt` |
| Fedora, RHEL, CentOS | DNF (or older: YUM) | `dnf` |
| Arch Linux | Pacman | `pacman` |

This note focuses on **APT** (the most beginner-friendly). The DNF commands are listed at the end for comparison.

---

## APT — The Ubuntu/Debian Package Manager

APT keeps a local database of available packages. You need to update this database before installing anything.

---

### Step 1 — Update your package list

```bash
sudo apt update
```

**What it does:** Connects to the internet and downloads the latest list of available packages from the configured repositories (servers that host the packages). This does **not** upgrade anything — it just refreshes the list.

**Example output:**
```
Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
Get:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease [128 kB]
...
57 packages can be upgraded. Run 'apt list --upgradable' to see them.
```

> **Always run `sudo apt update` before installing anything.** If you skip this, you might install an outdated version or get "package not found" errors.

---

### Step 2 — Install software

```bash
sudo apt install nginx
```

**What it does:** Downloads and installs the `nginx` web server. APT will show you what it plans to install and ask for confirmation.

**Example output:**
```
The following NEW packages will be installed:
  nginx nginx-core nginx-common
After this operation, 5,248 kB of additional disk space will be used.
Do you want to continue? [Y/n]
```

Press `Y` and Enter to confirm, or add `-y` to skip the prompt:

```bash
sudo apt install -y nginx
```

Install multiple packages at once:

```bash
sudo apt install -y git curl wget htop
```

---

### Removing software

```bash
sudo apt remove nginx
```

Removes nginx but **keeps** its configuration files. Useful if you plan to reinstall it later with the same settings.

```bash
sudo apt purge nginx
```

Removes nginx **and** its configuration files. Use this for a clean uninstall.

```bash
sudo apt autoremove
```

Removes packages that were installed as dependencies but are no longer needed by anything. Run this after removing software to clean up.

---

### Searching for a package

Not sure what a package is called?

```bash
apt search "web server"
```

Searches package names and descriptions. The output can be long — pipe it through `less`:

```bash
apt search "web server" | less
```

---

### Getting information about a package

```bash
apt show nginx
```

**Example output:**
```
Package: nginx
Version: 1.18.0-6ubuntu14
Depends: nginx-core (<< 1.18.0-6ubuntu14.1) | nginx-full (<< ...
Description: small, powerful, scalable web/proxy server
 Nginx ("engine X") is a high-performance web and reverse proxy server
 ...
```

This tells you the version, what it depends on, and a description — all before you install it.

---

### Listing installed packages

```bash
apt list --installed
```

Shows every package currently installed. This produces a very long list, so filter it:

```bash
apt list --installed | grep python
```

---

### Upgrading all installed software

```bash
sudo apt update          # refresh the list first
sudo apt upgrade         # upgrade all packages that have updates
```

`apt upgrade` downloads and installs newer versions of everything already installed. It will ask for confirmation before making changes.

---

## dpkg — The Low-Level Tool Behind APT

`dpkg` is what APT uses under the hood. You rarely use it directly, but it's useful for:

### Installing a `.deb` file you downloaded manually

```bash
sudo dpkg -i package.deb
```

`.deb` files are Debian packages. You might download one directly from a website. The `-i` flag means "install".

### Checking if a package is installed

```bash
dpkg -s nginx
```

`-s` means "status". Shows installed version, description, and status.

### Listing all files a package installed

```bash
dpkg -L nginx
```

`-L` lists every file that the `nginx` package placed on your system.

### Finding which package owns a file

```bash
dpkg -S /usr/bin/nginx
```

`-S` means "search". Tells you which installed package put that file there.

**Example output:**
```
nginx-core: /usr/bin/nginx
```

---

## DNF — The Red Hat/Fedora Package Manager

If you are on Fedora, RHEL, or CentOS, use `dnf` instead of `apt`. The concepts are identical — only the commands differ.

| What you want to do | APT (Ubuntu) | DNF (Fedora/RHEL) |
|--------------------|-------------|-------------------|
| Update package list | `apt update` | `dnf check-update` |
| Upgrade everything | `apt upgrade` | `dnf upgrade` |
| Install a package | `apt install pkg` | `dnf install pkg` |
| Remove a package | `apt remove pkg` | `dnf remove pkg` |
| Search | `apt search keyword` | `dnf search keyword` |
| Package info | `apt show pkg` | `dnf info pkg` |
| List installed | `apt list --installed` | `dnf list installed` |

---

## Repositories — Where Do Packages Come From?

Packages are downloaded from **repositories** (repos) — servers maintained by the distro or third parties.

Your list of repos is in `/etc/apt/sources.list` (and files in `/etc/apt/sources.list.d/`).

```bash
cat /etc/apt/sources.list
```

You'll see URLs like `http://archive.ubuntu.com/ubuntu`. That's where your packages come from.

Sometimes a piece of software isn't in the official repos. For Ubuntu, you can add a **PPA** (Personal Package Archive) — a community-hosted repo:

```bash
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install php8.3
```

Always be cautious with PPAs — only use ones from trusted sources, as they can install anything.

---

## What About Snap and Flatpak?

Besides APT, you'll sometimes hear about **Snap** and **Flatpak**. These are newer packaging formats that bundle all their dependencies inside the package itself, so they work on any distro without dependency conflicts.

```bash
# Install a snap package
sudo snap install vlc

# Install a flatpak (requires flatpak to be set up first)
flatpak install flathub org.videolan.VLC
```

APT is fine for most things. Snap/Flatpak are useful when a newer version of software isn't available in the APT repos.

---

**Navigation:** ← [04 — File Permissions](04-file-permissions.md) | [Notes Index](README.md) | Next → [06 — Process Management](06-process-management.md)
**Exercise:** [Exercise 05](../02-exercises/05-package-management-exe.md)
