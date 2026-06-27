# Exercise 04 — File Permissions

**Navigation:** ← [Exercise 03](03-users-and-groups.md) | [Exercises Index](README.md) | Next → [Exercise 05](05-package-management.md)
**Note:** [04 — File Permissions](../01-notes/04-file-permissions.md)

---

## Objectives

- Read and interpret permission strings
- Modify permissions using symbolic and octal modes
- Understand special bits: SUID, SGID, sticky bit

---

## Exercise 4.1 — Reading Permissions

Run `ls -l /bin/ls` and interpret the output.

```bash
ls -l /bin/ls /etc/passwd /etc/shadow ~/.bashrc /tmp
```

For each file, fill in this table:

| File | Type | Owner perms | Group perms | Other perms | Owner | Group |
|------|------|-------------|-------------|-------------|-------|-------|
| `/bin/ls` | | | | | | |
| `/etc/passwd` | | | | | | |
| `/etc/shadow` | | | | | | |
| `~/.bashrc` | | | | | | |
| `/tmp` | | | | | | |

**Question:** Why does `/etc/shadow` have such restricted permissions?

---

## Exercise 4.2 — Modifying Permissions

```bash
# Setup
mkdir ~/perm-test
cd ~/perm-test
touch file1.txt script.sh secret.txt

# 1. Give file1.txt rw for owner, r for group, no access for others
chmod 640 file1.txt
ls -l file1.txt

# 2. Make script.sh executable by owner only
chmod 700 script.sh
ls -l script.sh

# 3. Make secret.txt readable/writable only by owner
chmod 600 secret.txt
ls -l secret.txt

# 4. Add execute permission for all on script.sh (symbolic)
chmod a+x script.sh
ls -l script.sh

# 5. Remove write permission from group on file1.txt
chmod g-w file1.txt
ls -l file1.txt
```

---

## Exercise 4.3 — Octal Permissions

Predict the permission string for each octal, then verify:

| Octal | Expected Permission String |
|-------|---------------------------|
| 777 | |
| 755 | |
| 644 | |
| 600 | |
| 444 | |
| 000 | |

```bash
# Verify your predictions:
touch testfile
for perm in 777 755 644 600 444 000; do
    chmod $perm testfile
    echo -n "$perm → "
    ls -l testfile | awk '{print $1}'
done
```

---

## Exercise 4.4 — Ownership

```bash
# Setup
sudo useradd -m alice 2>/dev/null || true
sudo useradd -m bob 2>/dev/null || true
sudo groupadd teamgroup 2>/dev/null || true

# 1. Create a file as root
sudo touch /tmp/teamfile.txt

# 2. Set owner to alice and group to teamgroup
sudo chown alice:teamgroup /tmp/teamfile.txt

# 3. Verify
ls -l /tmp/teamfile.txt

# 4. Set group read+write (664)
sudo chmod 664 /tmp/teamfile.txt
ls -l /tmp/teamfile.txt

# Cleanup
sudo userdel -r alice 2>/dev/null || true
sudo userdel -r bob 2>/dev/null || true
sudo groupdel teamgroup 2>/dev/null || true
```

---

## Exercise 4.5 — Special Bits

```bash
# 1. Find SUID binaries on your system (common examples)
ls -l /usr/bin/passwd /usr/bin/sudo

# What does 's' in the execute position mean?

# 2. Create a shared directory with SGID
mkdir ~/perm-test/shared
sudo chown :$(id -gn) ~/perm-test/shared
chmod g+s ~/perm-test/shared
ls -ld ~/perm-test/shared

# 3. Create files in the shared directory
touch ~/perm-test/shared/file_a.txt
touch ~/perm-test/shared/file_b.txt
ls -l ~/perm-test/shared/

# What group do the new files inherit?

# 4. See the sticky bit in action on /tmp
ls -ld /tmp
# Notice the 't' at the end
```

---

## Exercise 4.6 — umask

```bash
# 1. Check current umask
umask

# 2. Create a file and directory — observe default permissions
touch ~/perm-test/default-file.txt
mkdir ~/perm-test/default-dir
ls -l ~/perm-test/default-file.txt
ls -ld ~/perm-test/default-dir

# 3. Change umask to 027 and create files
umask 027
touch ~/perm-test/restricted-file.txt
mkdir ~/perm-test/restricted-dir
ls -l ~/perm-test/restricted-file.txt
ls -ld ~/perm-test/restricted-dir

# 4. What permissions did the files get?
# 5. Restore default umask
umask 022
```

---

## Cleanup

```bash
rm -rf ~/perm-test/
```

---

## Challenge

1. Create a directory `/tmp/challenge/` where:
   - The owner is your user
   - The group is your primary group
   - Any file created inside inherits the group (SGID)
   - Others can read and execute but not write
2. Create two files inside and confirm they inherit the group.
3. Remove the directory when done.

---

**Navigation:** ← [Exercise 03](03-users-and-groups.md) | [Exercises Index](README.md) | Next → [Exercise 05](05-package-management.md)
**Note:** [04 — File Permissions](../01-notes/04-file-permissions.md)
