# 02 — File System & Navigation

**Navigation:** ← [01 — Introduction](01-introduction-to-linux.md) | [Notes Index](README.md) | Next → [03 — Users & Groups](03-users-and-groups.md)
**Exercise:** [Exercise 02](../02-exercises/02-file-system.md)

---

## The Linux File System Hierarchy (FHS)

Linux organizes everything under a single root `/`. There are no drive letters like `C:\`.

```
/
├── bin/        Core binaries (ls, cp, mv)
├── boot/       Boot loader files, kernel
├── dev/        Device files (disks, terminals)
├── etc/        System-wide configuration files
├── home/       User home directories (/home/jahid)
├── lib/        Shared libraries
├── media/      Mount point for removable media
├── mnt/        Temporary mount points
├── opt/        Optional/third-party software
├── proc/       Virtual fs: running process info
├── root/       Home directory of root user
├── run/        Runtime data (PIDs, sockets)
├── sbin/       System binaries (for root)
├── srv/        Data for services (web, ftp)
├── sys/        Virtual fs: kernel/device info
├── tmp/        Temporary files (cleared on reboot)
├── usr/        User programs and data
│   ├── bin/    User commands
│   ├── lib/    Libraries
│   └── share/  Shared data
└── var/        Variable data (logs, mail, spools)
    └── log/    System log files
```

---

## Absolute vs. Relative Paths

| Type | Example | Meaning |
|------|---------|---------|
| Absolute | `/home/jahid/docs` | From root `/` |
| Relative | `docs/report.txt` | From current directory |

Special path symbols:

| Symbol | Meaning |
|--------|---------|
| `.`    | Current directory |
| `..`   | Parent directory |
| `~`    | Your home directory |
| `-`    | Previous directory |

---

## Navigation Commands

```bash
# Print working directory (where am I?)
pwd

# List directory contents
ls
ls -l          # long format
ls -a          # include hidden files (starting with .)
ls -lh         # human-readable file sizes
ls -lt         # sort by modification time

# Change directory
cd /etc
cd ~           # go home
cd ..          # go up one level
cd -           # go to previous directory
```

---

## Working with Files and Directories

```bash
# Create a file
touch notes.txt

# Create a directory
mkdir projects
mkdir -p projects/linux/notes   # create nested dirs

# Copy
cp file.txt backup.txt
cp -r dir/ dir-backup/          # copy directory recursively

# Move / Rename
mv old.txt new.txt
mv file.txt /tmp/

# Remove
rm file.txt
rm -r directory/                # remove directory and contents
rm -rf directory/               # force (no confirmation) — be careful!

# Remove empty directory
rmdir empty-dir/
```

---

## Viewing File Contents

```bash
# Print entire file
cat file.txt

# Print with line numbers
cat -n file.txt

# Page through a file (press q to quit)
less file.txt

# First 10 lines
head file.txt
head -n 20 file.txt

# Last 10 lines
tail file.txt

# Follow a file in real-time (great for logs)
tail -f /var/log/syslog
```

---

## Finding Files

```bash
# Find by name (case-sensitive)
find /home -name "*.txt"

# Find by name (case-insensitive)
find / -iname "readme.md"

# Find files modified in the last 7 days
find /var/log -mtime -7

# Find files larger than 100MB
find / -size +100M

# Locate (uses a database — faster but may be outdated)
locate passwd
updatedb       # refresh locate database (run as root)
```

---

## Searching Inside Files

```bash
# Search for a pattern in a file
grep "error" /var/log/syslog

# Case-insensitive search
grep -i "error" /var/log/syslog

# Show line numbers
grep -n "error" /var/log/syslog

# Recursive search in directory
grep -r "TODO" ~/projects/

# Invert match (lines NOT matching)
grep -v "debug" app.log
```

---

## File Information

```bash
# Disk usage of a directory
du -sh /home/jahid/

# Disk space on all mounted filesystems
df -h

# File type
file /usr/bin/bash

# File details (permissions, size, timestamps)
stat file.txt

# Count lines, words, bytes
wc -l file.txt
wc -w file.txt
```

---

## Links

```bash
# Hard link — another name for the same file data
ln file.txt hardlink.txt

# Symbolic (soft) link — a pointer to a file/directory
ln -s /etc/nginx/nginx.conf ~/nginx.conf
```

---

**Navigation:** ← [01 — Introduction](01-introduction-to-linux.md) | [Notes Index](README.md) | Next → [03 — Users & Groups](03-users-and-groups.md)
**Exercise:** [Exercise 02](../02-exercises/02-file-system.md)
