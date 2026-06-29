# 02 — File System & Navigation

**Navigation:** ← [01 — Introduction](01-introduction-to-linux.md) | [Notes Index](README.md) | Next → [03 — Users & Groups](03-users-and-groups.md)
**Exercise:** [Exercise 02](../02-exercises/02-file-system-exe.md)

---

## The Linux File System — One Big Tree

On Windows, files are organized under drive letters: `C:\`, `D:\`, etc. Linux is different. Everything lives under a single root directory simply called `/` (a forward slash). There are no drive letters.

Think of it as one big tree:

```
/  ← everything starts here (the "root")
├── home/       ← where your personal files live
│   └── jahid/  ← your home folder (like C:\Users\jahid on Windows)
├── etc/        ← configuration files for the whole system
├── var/        ← files that change often (like logs)
├── bin/        ← essential programs (ls, cp, cat...)
├── tmp/        ← temporary files (wiped on reboot)
└── ...
```

### Important Folders to Know

| Folder | What lives there | Example |
|--------|-----------------|---------|
| `/home/` | Personal files for each user | `/home/jahid/Documents` |
| `/etc/` | System configuration files | `/etc/hosts`, `/etc/passwd` |
| `/var/log/` | Log files (error messages, activity) | `/var/log/syslog` |
| `/bin/` and `/usr/bin/` | Programs you can run | `/usr/bin/python3` |
| `/tmp/` | Temporary scratch space | Safe to write test files here |
| `/root/` | Home folder of the root (admin) user | Only root can access this |

You don't need to memorize all of these right now. Just know that `/home/yourname` is *your* space, and the rest is system territory.

---

## Paths — How to Address a File

A **path** is the address of a file or folder. There are two types:

### Absolute Path
Starts with `/` — tells the full location from the root.

```
/home/jahid/notes/day1.txt
```

This always works no matter where you currently are.

### Relative Path
Does *not* start with `/` — location is relative to where you currently are.

```
notes/day1.txt
```

This only works if you are already inside `/home/jahid/`.

### Special Shorthand Symbols

| Symbol | Meaning | Example |
|--------|---------|---------|
| `~` | Your home directory | `~/notes` = `/home/jahid/notes` |
| `.` | The current directory you are in | `./script.sh` = run script in current folder |
| `..` | The parent (one level up) | `cd ..` goes up one folder |
| `-` | The previous directory you were in | `cd -` jumps back |

---

## Navigating the File System

### `pwd` — Where am I right now?

```bash
pwd
```

`pwd` stands for "Print Working Directory". It tells you your current location.

**Example output:**
```
/home/jahid
```

Run this whenever you feel lost and need to know where you are.

---

### `ls` — What is in this folder?

```bash
ls
```

**Example output:**
```
Desktop  Documents  Downloads  Music  Pictures
```

`ls` just lists the names. But it has useful flags:

```bash
ls -l
```

The `-l` flag means "long format" — shows details like permissions, owner, size, and date.

**Example output:**
```
drwxr-xr-x 2 jahid jahid 4096 Jun 20 10:00 Documents
-rw-r--r-- 1 jahid jahid  512 Jun 19 08:30 notes.txt
```

Reading this line: `d` means directory, `rw-r--r--` is the permissions, `jahid` is the owner, `512` is the size in bytes, and the rest is the date and name.

```bash
ls -a
```

The `-a` flag means "all" — shows hidden files too. In Linux, any file starting with `.` is hidden.

**Example output:**
```
.  ..  .bashrc  .profile  Documents  notes.txt
```

The `.bashrc` file is your shell configuration — it was always there, just hidden.

```bash
ls -lh
```

`-l` for long format, `-h` for "human-readable" sizes (shows `4.0K` instead of `4096`).

You can combine flags: `ls -lah` shows everything in long format with human-readable sizes including hidden files.

---

### `cd` — Move to a different folder

```bash
cd Documents
```

`cd` stands for "Change Directory". After running this, you are now inside `Documents`.

```bash
cd /etc
```

Jump directly to `/etc` using an absolute path.

```bash
cd ~
```

Go back to your home directory from anywhere. This is the same as `cd /home/jahid`.

```bash
cd ..
```

Go up one level. If you are in `/home/jahid/Documents`, this takes you to `/home/jahid`.

```bash
cd -
```

Go back to the previous directory. Handy when you've jumped somewhere and want to return quickly.

---

## Creating and Deleting Files & Folders

### `touch` — Create an empty file

```bash
touch notes.txt
```

**What it does:** If `notes.txt` doesn't exist, it creates an empty file. If it already exists, it just updates the "last modified" timestamp without changing the content.

---

### `mkdir` — Create a folder

```bash
mkdir projects
```

**What it does:** Creates a new directory called `projects`.

```bash
mkdir -p projects/linux/notes
```

The `-p` flag means "parents" — it creates all the folders in the path at once, even if `projects` and `linux` don't exist yet. Without `-p`, this command would fail if `projects` didn't exist.

---

### `cp` — Copy a file or folder

```bash
cp notes.txt notes-backup.txt
```

**What it does:** Copies `notes.txt` and names the copy `notes-backup.txt`. The original stays untouched.

```bash
cp notes.txt /tmp/
```

Copies `notes.txt` into the `/tmp/` folder, keeping the same filename.

```bash
cp -r projects/ projects-backup/
```

The `-r` flag means "recursive" — required when copying a directory. It copies the folder and everything inside it. Without `-r`, copying a directory fails.

---

### `mv` — Move or rename a file

```bash
mv old-name.txt new-name.txt
```

**What it does:** Renames the file. There is no separate "rename" command in Linux — `mv` handles both moving and renaming.

```bash
mv notes.txt /tmp/
```

Moves `notes.txt` into the `/tmp/` folder.

---

### `rm` — Delete a file

```bash
rm notes.txt
```

**What it does:** Deletes the file. **There is no Recycle Bin.** Once deleted, it is gone.

```bash
rm -r projects/
```

The `-r` flag (recursive) is required to delete a folder and everything inside it.

```bash
rm -rf projects/
```

`-r` (recursive) + `-f` (force, no confirmation prompts). This is a powerful and dangerous command. Double-check your path before running it — `rm -rf /` would delete everything on the entire system.

> **Beginner tip:** Before deleting something important, copy it to `/tmp/` first. If you don't need it after a reboot, then it's safe to delete.

---

### `rmdir` — Delete an *empty* folder

```bash
rmdir empty-folder/
```

Only works if the folder is completely empty. Use `rm -r` for folders with content.

---

## Viewing File Contents

### `cat` — Print a file's contents

```bash
cat notes.txt
```

**What it does:** Reads the file and prints all of it to the terminal at once. Good for short files.

```bash
cat -n notes.txt
```

The `-n` flag adds line numbers to the output. Useful when reading scripts or config files.

> If a file is very long, `cat` will flood your terminal. Use `less` instead.

---

### `less` — Read a file one page at a time

```bash
less notes.txt
```

**What it does:** Opens the file in a scrollable viewer.

| Key | Action |
|-----|--------|
| `↑` / `↓` | Scroll up / down one line |
| `Space` | Scroll down one page |
| `b` | Scroll back one page |
| `/word` | Search for "word" |
| `n` | Jump to next search match |
| `q` | Quit |

---

### `head` — Show the beginning of a file

```bash
head notes.txt
```

Shows the first **10 lines** by default.

```bash
head -n 20 notes.txt
```

The `-n 20` flag shows the first 20 lines instead.

---

### `tail` — Show the end of a file

```bash
tail notes.txt
```

Shows the last **10 lines** by default.

```bash
tail -n 20 notes.txt
```

Shows the last 20 lines.

```bash
tail -f /var/log/syslog
```

The `-f` flag means "follow" — the terminal keeps watching the file and shows new lines as they are added. This is very useful for watching log files in real-time. Press `Ctrl + C` to stop.

---

## Finding Files

### `find` — Search for files

```bash
find /home -name "*.txt"
```

**Breaking this down:**
- `find` — the command
- `/home` — where to search (the `/home` directory and everything inside it)
- `-name "*.txt"` — find files whose name matches this pattern (`*` means "anything")

```bash
find / -name "nginx.conf"
```

Search the entire system for a file named `nginx.conf`. You may see "Permission denied" errors for some system folders — that's normal for regular users.

```bash
find /var/log -mtime -7
```

`-mtime -7` means "modified in the last 7 days". The `-` before `7` means "less than 7 days ago".

```bash
find / -size +100M
```

`-size +100M` means "files larger than 100 megabytes". Useful for finding what's eating up disk space.

---

### `grep` — Search for text *inside* files

```bash
grep "error" /var/log/syslog
```

**What it does:** Reads the file and prints only the lines that contain the word "error".

```bash
grep -i "error" /var/log/syslog
```

`-i` means "ignore case" — matches "Error", "ERROR", "error", etc.

```bash
grep -n "error" /var/log/syslog
```

`-n` shows the line number alongside each match. Helpful when you need to jump to a specific line.

```bash
grep -r "TODO" ~/projects/
```

`-r` means "recursive" — searches all files inside the `projects` folder and its subfolders.

```bash
grep -v "debug" app.log
```

`-v` means "invert" — shows all lines that do **not** contain "debug". Useful for filtering out noise.

---

## Checking Disk Space

### `df -h` — How full are my disks?

```bash
df -h
```

`df` stands for "Disk Free". The `-h` flag makes sizes human-readable (GB, MB instead of bytes).

**Example output:**
```
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        50G   18G   30G  38% /
tmpfs           3.8G     0  3.8G   0% /dev/shm
```

The `Use%` column is the one to watch. If it hits 95%+, you need to free up space.

---

### `du -sh` — How much space does a folder use?

```bash
du -sh ~/Documents
```

`du` stands for "Disk Usage". 
- `-s` means "summary" (one total line instead of every subfolder)
- `-h` means "human-readable"

**Example output:**
```
4.2G    /home/jahid/Documents
```

---

## Links — Two Ways to Point to a File

### Hard Link

```bash
ln file.txt hardlink.txt
```

Creates another name for the same file. Both `file.txt` and `hardlink.txt` point to the same data on disk. Deleting one does not delete the data — it only disappears when the last link is removed.

### Symbolic (Soft) Link

```bash
ln -s /etc/nginx/nginx.conf ~/nginx.conf
```

`-s` creates a symbolic link — like a shortcut. `~/nginx.conf` is a pointer to the original file. If the original is deleted, the link breaks.

Symlinks are used constantly in Linux. For example, `/usr/bin/python` is often a symlink to `/usr/bin/python3.11`.

---

**Navigation:** ← [01 — Introduction](01-introduction-to-linux.md) | [Notes Index](README.md) | Next → [03 — Users & Groups](03-users-and-groups.md)
**Exercise:** [Exercise 02](../02-exercises/02-file-system-exe.md)
