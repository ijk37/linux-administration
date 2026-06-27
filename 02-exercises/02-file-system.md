# Exercise 02 — File System & Navigation

**Navigation:** ← [Exercise 01](01-introduction-to-linux.md) | [Exercises Index](README.md) | Next → [Exercise 03](03-users-and-groups.md)
**Note:** [02 — File System & Navigation](../01-notes/02-file-system.md)

---

## Objectives

- Navigate the Linux file system confidently
- Create, move, copy, and delete files and directories
- Search for files and content

---

## Exercise 2.1 — Navigation

```bash
# 1. Print your current directory
pwd

# 2. Go to root
cd /

# 3. List the contents
ls -l

# 4. Go to /etc and list all files including hidden ones
cd /etc
ls -la

# 5. Go back to your home in one command
cd ~

# 6. Go back to previous directory
cd -
```

**Question:** What was the output of `cd -`? Why?

---

## Exercise 2.2 — Create and Organize

```bash
# 1. In your home directory, create this structure:
mkdir -p ~/linux-practice/notes
mkdir -p ~/linux-practice/scripts
mkdir -p ~/linux-practice/logs

# 2. Verify the structure
ls -R ~/linux-practice/

# 3. Create some files
touch ~/linux-practice/notes/day1.txt
touch ~/linux-practice/notes/day2.txt
touch ~/linux-practice/logs/app.log

# 4. Add content to a file
echo "My first Linux note" > ~/linux-practice/notes/day1.txt
echo "Learning file navigation" >> ~/linux-practice/notes/day1.txt

# 5. View the file
cat ~/linux-practice/notes/day1.txt
```

---

## Exercise 2.3 — Copy, Move, Delete

```bash
# 1. Copy day1.txt to day1-backup.txt
cp ~/linux-practice/notes/day1.txt ~/linux-practice/notes/day1-backup.txt

# 2. Move (rename) day2.txt to day2-renamed.txt
mv ~/linux-practice/notes/day2.txt ~/linux-practice/notes/day2-renamed.txt

# 3. Copy the entire notes directory
cp -r ~/linux-practice/notes/ ~/linux-practice/notes-backup/

# 4. Delete day1-backup.txt
rm ~/linux-practice/notes/day1-backup.txt

# 5. Verify the final state
ls -la ~/linux-practice/notes/
```

---

## Exercise 2.4 — Viewing Files

```bash
# 1. Add 30 lines to a test file
for i in {1..30}; do echo "Line $i: $(date)"; done > ~/linux-practice/logs/app.log

# 2. View the first 5 lines
head -n 5 ~/linux-practice/logs/app.log

# 3. View the last 5 lines
tail -n 5 ~/linux-practice/logs/app.log

# 4. Page through the file
less ~/linux-practice/logs/app.log

# 5. Count the lines
wc -l ~/linux-practice/logs/app.log
```

---

## Exercise 2.5 — Finding Files

```bash
# 1. Find all .txt files in your home directory
find ~ -name "*.txt"

# 2. Find all .log files modified in the last 1 day
find ~/linux-practice -mtime -1 -name "*.log"

# 3. Find files larger than 1KB in /etc
find /etc -size +1k -type f 2>/dev/null | head -10

# 4. Search inside a file for a word
grep "Line 1" ~/linux-practice/logs/app.log

# 5. Recursive grep — find all files containing "Linux"
grep -r "Linux" ~/linux-practice/
```

---

## Exercise 2.6 — Disk Usage

```bash
# 1. Check free disk space
df -h

# 2. Check size of your practice directory
du -sh ~/linux-practice/

# 3. List sizes of each subdirectory
du -sh ~/linux-practice/*/

# 4. Find the file type of /bin/bash
file /bin/bash

# 5. Get detailed stats on a file
stat ~/linux-practice/notes/day1.txt
```

---

## Challenge

Build a directory tree like this and then remove the entire `project/` directory with a single command:

```
~/linux-practice/project/
├── src/
│   ├── main.sh
│   └── utils.sh
├── docs/
│   └── readme.txt
└── config.txt
```

Create each file with at least one line of content. Then verify the structure with `find`. Finally, delete the whole `project/` directory.

---

**Navigation:** ← [Exercise 01](01-introduction-to-linux.md) | [Exercises Index](README.md) | Next → [Exercise 03](03-users-and-groups.md)
**Note:** [02 — File System & Navigation](../01-notes/02-file-system.md)
