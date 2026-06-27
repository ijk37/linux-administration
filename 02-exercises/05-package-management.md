# Exercise 05 — Package Management

**Navigation:** ← [Exercise 04](04-file-permissions.md) | [Exercises Index](README.md) | Next → [Exercise 06](06-process-management.md)
**Note:** [05 — Package Management](../01-notes/05-package-management.md)

---

## Objectives

- Update system packages
- Install, inspect, and remove packages
- Search for and investigate packages

> These exercises use **APT** (Debian/Ubuntu). For RHEL/Fedora, substitute `apt` commands with `dnf` equivalents from the notes.

---

## Exercise 5.1 — Update the System

```bash
# 1. Update the package list
sudo apt update

# 2. How many packages can be upgraded?
apt list --upgradable 2>/dev/null | wc -l

# 3. Upgrade all packages
sudo apt upgrade -y

# 4. Check if a reboot is needed
cat /var/run/reboot-required 2>/dev/null && echo "Reboot needed" || echo "No reboot needed"
```

---

## Exercise 5.2 — Search & Inspect

```bash
# 1. Search for packages related to "web server"
apt search "web server" 2>/dev/null | head -20

# 2. Get details about the nginx package
apt show nginx 2>/dev/null

# 3. List files that the curl package will install (before installing)
apt-file list curl 2>/dev/null || echo "apt-file not installed — skip"

# 4. What package provides the 'dig' command?
apt-file search bin/dig 2>/dev/null | head -5
# Or use: dpkg -S /usr/bin/dig (if already installed)
```

---

## Exercise 5.3 — Install & Remove

```bash
# 1. Install tree (shows directory structure visually)
sudo apt install -y tree

# 2. Test it
tree ~/linux-practice/ 2>/dev/null || tree ~/ -L 2

# 3. Install htop
sudo apt install -y htop

# 4. Launch htop briefly, then press q
htop

# 5. Check which files htop installed
dpkg -L htop

# 6. Remove htop (keep config files)
sudo apt remove htop

# 7. Is it still listed?
dpkg -l | grep htop

# 8. Purge htop completely
sudo apt purge htop

# 9. Remove unused dependencies
sudo apt autoremove -y
```

---

## Exercise 5.4 — dpkg Inspection

```bash
# 1. List all installed packages (count them)
dpkg -l | grep "^ii" | wc -l

# 2. Find all installed packages with "python" in the name
dpkg -l | grep python | head -10

# 3. Check if openssh-server is installed
dpkg -s openssh-server

# 4. Which package owns /bin/ls?
dpkg -S /bin/ls

# 5. Which package owns /etc/passwd?
dpkg -S /etc/passwd
```

---

## Exercise 5.5 — Install from Source (Simulation)

This exercise walks through the steps without actually compiling (to save time). Review the process:

```bash
# 1. Install build tools
sudo apt install -y build-essential

# 2. These are the typical steps when building from source:
# wget https://example.com/software.tar.gz
# tar -xzf software.tar.gz
# cd software/
# ./configure --prefix=/usr/local
# make
# sudo make install

# 3. Check if build-essential installed the compilers
gcc --version
make --version

# 4. Write a simple C program and compile it
cat > /tmp/hello.c << 'EOF'
#include <stdio.h>
int main() {
    printf("Hello from compiled C!\n");
    return 0;
}
EOF

gcc /tmp/hello.c -o /tmp/hello
/tmp/hello
```

---

## Challenge

1. Find any package not currently installed that would be useful to a sysadmin (e.g., `nmap`, `ncdu`, `dstat`, `jq`).
2. Look up what it does with `apt show`.
3. Install it, try it out, then remove it cleanly.
4. Verify it's completely gone with `dpkg -l`.

---

**Navigation:** ← [Exercise 04](04-file-permissions.md) | [Exercises Index](README.md) | Next → [Exercise 06](06-process-management.md)
**Note:** [05 — Package Management](../01-notes/05-package-management.md)
