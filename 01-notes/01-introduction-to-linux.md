# 01 — Introduction to Linux

**Navigation:** [Notes Index](README.md) | Next → [02 — File System](02-file-system.md)
**Exercise:** [Exercise 01](../02-exercises/01-introduction-to-linux.md)

---

## What is Linux?

Linux is an open-source, Unix-like operating system kernel created by **Linus Torvalds** in 1991. Combined with the GNU toolchain, it forms a complete operating system used everywhere — servers, embedded devices, smartphones (Android), supercomputers, and cloud infrastructure.

### Linux vs. a Linux Distribution

- The **kernel** is the core: manages hardware, memory, and processes.
- A **distribution (distro)** bundles the kernel with a package manager, init system, and software ecosystem.

| Distro Family | Examples | Common Use |
|---------------|----------|------------|
| Debian/Ubuntu | Ubuntu, Debian, Mint | Desktops, servers |
| Red Hat | RHEL, CentOS, Fedora | Enterprise servers |
| Arch | Arch, Manjaro | Power users |
| SUSE | openSUSE, SLES | Enterprise |

---

## Why Learn Linux?

- Powers ~96% of the world's top 1 million web servers
- Required for DevOps, cloud (AWS, GCP, Azure), and cybersecurity roles
- Free and open source — inspect and modify anything
- Extremely stable and performant for server workloads

---

## The Linux Architecture

```
┌──────────────────────────────┐
│        User Space            │
│  Applications  |  Shell      │
├──────────────────────────────┤
│       System Libraries       │
│         (glibc, etc.)        │
├──────────────────────────────┤
│         Linux Kernel         │
│  Process | Memory | File Sys │
│  Networking | Device Drivers │
├──────────────────────────────┤
│           Hardware           │
└──────────────────────────────┘
```

---

## The Shell

The **shell** is a command-line interpreter — the primary way to interact with Linux.

| Shell | Notes |
|-------|-------|
| `bash` | Bourne Again Shell — default on most distros |
| `zsh`  | Extended features, popular with developers |
| `sh`   | POSIX-compliant, minimal |
| `fish` | User-friendly, not POSIX-compatible |

### Opening a Terminal

- **Ubuntu/Debian:** `Ctrl + Alt + T`
- **WSL (Windows):** Open "Windows Subsystem for Linux" from Start
- **SSH:** `ssh user@hostname`

---

## Your First Commands

```bash
# Who am I?
whoami

# What is the hostname?
hostname

# What distro am I running?
cat /etc/os-release

# What kernel version?
uname -r

# What is the current date/time?
date

# How long has the system been running?
uptime

# Display a message
echo "Hello, Linux!"

# Clear the terminal
clear
```

---

## Getting Help

```bash
# Manual page for a command
man ls

# Short help flag (most commands)
ls --help

# Quick one-line description
whatis ls

# Find which commands relate to a keyword
apropos disk
```

> **Tip:** Inside `man`, press `q` to quit, `/` to search, `n` for next match.

---

## Key Concepts to Remember

- Linux is **case-sensitive**: `File.txt` ≠ `file.txt`
- Everything is a **file** (devices, sockets, directories)
- The **root** user (`/`) has unrestricted access — use with care
- Configuration lives in plain **text files** under `/etc`

---

**Navigation:** [Notes Index](README.md) | Next → [02 — File System](02-file-system.md)
**Exercise:** [Exercise 01](../02-exercises/01-introduction-to-linux.md)
