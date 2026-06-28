# Exercise 02 — File System & Navigation

**Navigation:** ← [Exercise 01](01-introduction-to-linux.md) | [Exercises Index](README.md) | Next → [Exercise 03](03-users-and-groups.md)
**Note:** [02 — File System & Navigation](../01-notes/02-file-system.md)

---

## Before You Start

Read [Note 02](../01-notes/02-file-system.md) first.

By the end of this exercise you will be comfortable moving around the file system, creating and deleting files and folders, and reading file contents. All practice files will go into a folder called `~/linux-practice` — a safe sandbox you can delete at any time.

---

## Exercise 2.1 — Where Am I? Navigation Basics

**Step 1:** Find out your current location:

```bash
pwd
```

`pwd` stands for "Print Working Directory". It answers "where am I right now?"

Expected output (yours will differ):
```
/home/jahid
```

**Step 2:** Go to the root of the entire file system:

```bash
cd /
```

**Step 3:** List what's there:

```bash
ls
```

Expected output (you'll see the top-level Linux directories):
```
bin  boot  dev  etc  home  lib  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
```

**Step 4:** Go to the `/etc` folder and list it:

```bash
cd /etc
ls
```

`/etc` holds configuration files. You'll see a lot of files — this is completely normal.

**Step 5:** Go back to your home directory two different ways:

```bash
cd ~      # ~ always means your home directory
pwd       # confirm you're home
```

Then:

```bash
cd -      # go back to /etc (your previous location)
pwd       # should show /etc
cd -      # go back home again
```

`cd -` is a very handy shortcut that jumps between your two most recent locations.

**Reflect:** What did `cd -` print? Why is it printing that?

---

## Exercise 2.2 — Set Up Your Practice Workspace

You'll create a folder structure to use throughout all exercises.

**Step 1:** Create the folder structure:

```bash
mkdir -p ~/linux-practice/notes
mkdir -p ~/linux-practice/scripts
mkdir -p ~/linux-practice/logs
```

The `-p` flag creates all folders in the path at once, including parents. Without it, you'd have to create `linux-practice` first, then `notes` inside it, then `scripts`, etc.

**Step 2:** Verify the structure was created:

```bash
ls ~/linux-practice/
```

Expected output:
```
logs  notes  scripts
```

**Step 3:** Create some empty files:

```bash
touch ~/linux-practice/notes/day1.txt
touch ~/linux-practice/notes/day2.txt
touch ~/linux-practice/logs/app.log
```

`touch` creates an empty file if it doesn't exist. If the file already exists, it just updates the "last modified" time without changing the content.

**Step 4:** Write something into `day1.txt`:

```bash
echo "My first Linux note" > ~/linux-practice/notes/day1.txt
```

`>` is the **redirect** operator. Instead of printing to the screen, the output of `echo` is written into the file. **Warning:** `>` overwrites the file if it already has content.

Now add a second line without erasing the first:

```bash
echo "Learning the file system" >> ~/linux-practice/notes/day1.txt
```

`>>` means **append** — adds to the end of the file without erasing what's already there.

**Step 5:** Read the file to confirm it worked:

```bash
cat ~/linux-practice/notes/day1.txt
```

Expected output:
```
My first Linux note
Learning the file system
```

---

## Exercise 2.3 — Copy, Move, and Delete

**Step 1:** Copy a file:

```bash
cp ~/linux-practice/notes/day1.txt ~/linux-practice/notes/day1-backup.txt
```

This creates a copy. The original `day1.txt` is untouched.

**Step 2:** Confirm both files exist:

```bash
ls ~/linux-practice/notes/
```

Expected output:
```
day1-backup.txt  day1.txt  day2.txt
```

**Step 3:** Rename a file using `mv`:

```bash
mv ~/linux-practice/notes/day2.txt ~/linux-practice/notes/day2-renamed.txt
```

`mv` moves files, but when the destination is just a new name in the same folder, it's a rename. There is no separate "rename" command in Linux.

**Step 4:** Copy an entire directory:

```bash
cp -r ~/linux-practice/notes/ ~/linux-practice/notes-backup/
```

The `-r` flag is required for directories — it means "recursive" (copy the folder and everything inside it). Without `-r`, the command fails.

**Step 5:** Delete a file:

```bash
rm ~/linux-practice/notes/day1-backup.txt
```

> **Warning:** There is no Recycle Bin. Deleted files are gone immediately. Always double-check your path before running `rm`.

**Step 6:** Verify the final state:

```bash
ls ~/linux-practice/notes/
```

Expected output:
```
day1.txt  day2-renamed.txt
```

---

## Exercise 2.4 — Reading File Contents

**Step 1:** First, create a file with 20 lines so you have something to work with:

```bash
for i in {1..20}; do echo "This is line number $i"; done > ~/linux-practice/logs/app.log
```

> **What's this?** This is a simple loop. `{1..20}` generates numbers 1 through 20. For each number, it runs `echo "This is line number $i"`. The `>` sends all that output into `app.log`. Don't worry about the loop syntax yet — that's covered in Note 08.

**Step 2:** View the whole file:

```bash
cat ~/linux-practice/logs/app.log
```

All 20 lines scroll past. That's fine for a small file.

**Step 3:** View just the first 5 lines:

```bash
head -n 5 ~/linux-practice/logs/app.log
```

Expected output:
```
This is line number 1
This is line number 2
This is line number 3
This is line number 4
This is line number 5
```

**Step 4:** View just the last 5 lines:

```bash
tail -n 5 ~/linux-practice/logs/app.log
```

Expected output:
```
This is line number 16
This is line number 17
This is line number 18
This is line number 19
This is line number 20
```

**Step 5:** Page through it interactively:

```bash
less ~/linux-practice/logs/app.log
```

Use arrow keys to scroll. Press `q` to quit. `less` is better than `cat` for large files because it doesn't flood your terminal.

**Step 6:** Count the lines:

```bash
wc -l ~/linux-practice/logs/app.log
```

`wc` stands for "word count". The `-l` flag makes it count lines instead.

Expected output:
```
20 /home/jahid/linux-practice/logs/app.log
```

---

## Exercise 2.5 — Finding Files

**Step 1:** Find all `.txt` files in your home directory:

```bash
find ~ -name "*.txt"
```

`find` searches recursively. `~` is the starting point (your home). `-name "*.txt"` matches any file name ending in `.txt`. The `*` is a wildcard.

**Step 2:** Find only files modified in the last 1 day:

```bash
find ~/linux-practice -mtime -1
```

`-mtime -1` means "modified less than 1 day ago". All the files you just created should appear.

**Step 3:** Search for text *inside* a file:

```bash
grep "line number 1" ~/linux-practice/logs/app.log
```

`grep` finds lines containing the search text. Notice it finds "line number 1", "line number 10", "line number 11", etc. — because they all contain the pattern "line number 1".

**Step 4:** Search more precisely with a pattern:

```bash
grep "line number 1$" ~/linux-practice/logs/app.log
```

The `$` means "end of line". Now it only finds the exact line "This is line number 1".

**Step 5:** Search all files in a directory for a word:

```bash
grep -r "Linux" ~/linux-practice/
```

`-r` means recursive — it searches every file in `linux-practice/` and its subfolders. The output shows both the filename and the matching line.

---

## Exercise 2.6 — Disk Usage

**Step 1:** Check how much disk space is left on the system:

```bash
df -h
```

`-h` makes sizes human-readable. Look at the `Use%` column — that's how full each filesystem is.

**Step 2:** Check the size of your practice folder:

```bash
du -sh ~/linux-practice/
```

`-s` = summary (one total line), `-h` = human-readable.

Expected output (approximately):
```
12K    /home/jahid/linux-practice/
```

**Step 3:** See the size of each subfolder:

```bash
du -sh ~/linux-practice/*/
```

The `*/` means "all immediate subdirectories".

**Step 4:** Get detailed information about a specific file:

```bash
stat ~/linux-practice/notes/day1.txt
```

Expected output:
```
  File: /home/jahid/linux-practice/notes/day1.txt
  Size: 42         Blocks: 8     IO Block: 4096   regular file
Device: 803h/2051d Inode: 123456    Links: 1
Access: (0644/-rw-r--r--)  Uid: (1000/jahid)   Gid: (1000/jahid)
Access: 2024-06-20 14:32:01.000000000
Modify: 2024-06-20 14:30:00.000000000
```

This shows the file size, permissions, owner, and three timestamps: last access, last modification, and last status change.

---

## Challenge — Build and Destroy a Project

Build this directory structure from scratch using only the commands you've learned:

```
~/linux-practice/project/
├── src/
│   ├── main.sh          (contains: "echo Hello")
│   └── utils.sh         (contains: "# utility functions")
├── docs/
│   └── readme.txt       (contains: "Project documentation")
└── config.txt           (contains: "version=1.0")
```

Requirements:
1. Create all folders with a **single** `mkdir -p` command
2. Write content into each file using `echo`
3. Verify the structure with `find ~/linux-practice/project`
4. Confirm the content of `readme.txt` with `cat`
5. Delete the entire `project/` folder with a **single** `rm -r` command
6. Verify it's gone with `ls ~/linux-practice/`

> **Tip for step 1:** `mkdir -p` can take multiple paths. Think about which paths share a parent.

---

## Cleanup

When you're done with all exercises in this series, delete the practice folder:

```bash
rm -r ~/linux-practice/
```

But don't do this yet — later exercises build on it!

---

**Navigation:** ← [Exercise 01](01-introduction-to-linux.md) | [Exercises Index](README.md) | Next → [Exercise 03](03-users-and-groups.md)
**Note:** [02 — File System & Navigation](../01-notes/02-file-system.md)
