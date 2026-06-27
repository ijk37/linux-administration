# 04 — File Permissions

**Navigation:** ← [03 — Users & Groups](03-users-and-groups.md) | [Notes Index](README.md) | Next → [05 — Package Management](05-package-management.md)
**Exercise:** [Exercise 04](../02-exercises/04-file-permissions.md)

---

## Permission Basics

Every file and directory has three permission sets:

| Who | Symbol | Meaning |
|-----|--------|---------|
| Owner (user) | `u` | The user who owns the file |
| Group | `g` | The file's associated group |
| Others | `o` | Everyone else |

Each set has three permission bits:

| Permission | Files | Directories |
|------------|-------|-------------|
| Read (`r`) | View contents | List files |
| Write (`w`) | Modify contents | Create/delete files |
| Execute (`x`) | Run as program | Enter (`cd`) directory |

---

## Reading Permission Output

```bash
ls -l file.txt
# -rwxr-xr-- 1 jahid developers 1234 Jun 20 12:00 file.txt
#  ^^^ ^^^ ^^^
#  |   |   |
#  |   |   └── Others: r-- (read only)
#  |   └────── Group:  r-x (read + execute)
#  └────────── Owner:  rwx (read + write + execute)
# ^ = file type: - (file), d (directory), l (symlink)
```

---

## Changing Permissions — `chmod`

### Symbolic Mode

```bash
# Add execute for owner
chmod u+x script.sh

# Remove write for group
chmod g-w file.txt

# Set read-only for others
chmod o=r file.txt

# Multiple changes at once
chmod u+x,g-w,o=r file.txt

# Apply to all (user, group, others)
chmod a+r file.txt
```

### Numeric (Octal) Mode

Each permission is a bit: `r=4`, `w=2`, `x=1`. Sum them for each set.

| Octal | Binary | Permissions |
|-------|--------|-------------|
| 7 | 111 | rwx |
| 6 | 110 | rw- |
| 5 | 101 | r-x |
| 4 | 100 | r-- |
| 0 | 000 | --- |

```bash
chmod 755 script.sh   # rwxr-xr-x  (common for scripts)
chmod 644 file.txt    # rw-r--r--  (common for files)
chmod 700 private/    # rwx------  (private directory)
chmod 600 ~/.ssh/id_rsa  # rw------- (SSH private key)
```

### Recursive

```bash
chmod -R 755 /var/www/html/
```

---

## Changing Ownership — `chown` & `chgrp`

```bash
# Change owner
sudo chown alice file.txt

# Change owner and group
sudo chown alice:developers file.txt

# Change group only
sudo chgrp developers file.txt

# Recursive
sudo chown -R www-data:www-data /var/www/
```

---

## Special Permission Bits

### Setuid (SUID) — `4xxx`

When set on an executable, it runs with the **owner's** privileges instead of the caller's.

```bash
# Example: passwd runs as root even when called by regular user
ls -l /usr/bin/passwd
# -rwsr-xr-x root root ...   ← 's' in owner execute slot

chmod u+s /usr/bin/myprog
chmod 4755 /usr/bin/myprog
```

### Setgid (SGID) — `2xxx`

On a file: runs with group's privileges.  
On a directory: new files inherit the directory's group.

```bash
chmod g+s /shared/teamdir/
chmod 2775 /shared/teamdir/
```

### Sticky Bit — `1xxx`

On a directory: only the owner of a file can delete it (used on `/tmp`).

```bash
ls -ld /tmp
# drwxrwxrwt  ← 't' = sticky bit

chmod +t /shared/public/
chmod 1777 /shared/public/
```

---

## Default Permissions — `umask`

`umask` subtracts permissions from the default when new files/dirs are created.

| Default | umask | Result |
|---------|-------|--------|
| 666 (file) | 022 | 644 |
| 777 (dir)  | 022 | 755 |

```bash
# View current umask
umask
# 0022

# Change for the session
umask 027

# Set permanently in ~/.bashrc
echo "umask 027" >> ~/.bashrc
```

---

## Access Control Lists (ACLs)

ACLs extend traditional permissions for fine-grained control.

```bash
# View ACLs
getfacl file.txt

# Grant alice read+write access
setfacl -m u:alice:rw file.txt

# Grant developers group execute
setfacl -m g:developers:x script.sh

# Remove an ACL entry
setfacl -x u:alice file.txt

# Remove all ACLs
setfacl -b file.txt

# Default ACL (inherited by new files in directory)
setfacl -d -m g:developers:rw /shared/
```

---

## Quick Reference

| Permission | Octal | Use Case |
|------------|-------|---------|
| `rwxr-xr-x` | 755 | Executables, directories |
| `rw-r--r--` | 644 | Regular files |
| `rw-------` | 600 | Private files, SSH keys |
| `rwxrwxr-x` | 775 | Shared group directories |
| `rwxrwxrwt` | 1777 | World-writable with sticky |

---

**Navigation:** ← [03 — Users & Groups](03-users-and-groups.md) | [Notes Index](README.md) | Next → [05 — Package Management](05-package-management.md)
**Exercise:** [Exercise 04](../02-exercises/04-file-permissions.md)
