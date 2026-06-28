# 04 — File Permissions

**Navigation:** ← [03 — Users & Groups](03-users-and-groups.md) | [Notes Index](README.md) | Next → [05 — Package Management](05-package-management.md)
**Exercise:** [Exercise 04](../02-exercises/04-file-permissions.md)

---

## Why Do Permissions Exist?

Permissions are Linux's way of controlling who can do what with a file or folder. Without them, any user on the system could read your private files, modify system configuration, or run dangerous programs.

Every file and directory has three pieces of information attached to it:
1. **Who owns it** (the owner)
2. **Which group it belongs to** (the group)
3. **What each category of user is allowed to do** (the permissions)

---

## The Three Permission Categories

| Category | Symbol | Who it applies to |
|----------|--------|------------------|
| Owner | `u` (user) | The person who owns the file |
| Group | `g` | Anyone in the file's associated group |
| Others | `o` | Everyone else on the system |

And the three things each category can be allowed to do:

| Permission | Symbol | On a File | On a Directory |
|------------|--------|-----------|----------------|
| Read | `r` | View the file's content | List files inside the folder |
| Write | `w` | Edit or delete the file | Create or delete files inside |
| Execute | `x` | Run the file as a program | Enter the directory with `cd` |

---

## Reading Permissions with `ls -l`

Run this:

```bash
ls -l
```

You'll see something like:

```
-rwxr-xr-- 1 jahid developers 1234 Jun 20 12:00 script.sh
drwxr-x--- 2 jahid developers 4096 Jun 19 09:00 projects/
```

Let's decode the first column character by character:

```
- r w x r - x r - -
│ │ │ │ │ │ │ │ │ │
│ └─┴─┴─┘ └─┴─┴─┘ └─┴─┴─┘
│  owner   group   others
│
└── File type: - = regular file, d = directory, l = symlink
```

For `script.sh` with `-rwxr-xr--`:
- `-` → it is a regular file
- `rwx` → the owner (`jahid`) can read, write, and execute
- `r-x` → the group (`developers`) can read and execute, but NOT write
- `r--` → everyone else can only read

---

## Changing Permissions with `chmod`

`chmod` stands for "change mode". There are two ways to use it.

### Method 1 — Symbolic (easier to read)

The format is: `chmod WHO OPERATION PERMISSION filename`

- **WHO:** `u` (owner), `g` (group), `o` (others), `a` (all three)
- **OPERATION:** `+` (add), `-` (remove), `=` (set exactly)
- **PERMISSION:** `r`, `w`, `x`

**Examples:**

```bash
chmod u+x script.sh
```

Add (`+`) execute (`x`) permission for the owner (`u`). Now the owner can run this script.

```bash
chmod g-w file.txt
```

Remove (`-`) write (`w`) permission from the group (`g`). The group can no longer edit this file.

```bash
chmod o=r file.txt
```

Set (`=`) others' permissions to exactly read (`r`) only. The `=` replaces whatever they had before.

```bash
chmod a+r file.txt
```

Add read permission for all (`a`) — owner, group, and others.

```bash
chmod u+x,g-w file.txt
```

Multiple changes at once, separated by commas.

---

### Method 2 — Numeric/Octal (faster once you learn it)

Each permission has a number:
- `r` = **4**
- `w` = **2**
- `x` = **1**
- none = **0**

Add up the numbers for each category (owner, group, others) to get a 3-digit code.

**Example — `755`:**
- `7` = 4+2+1 = `rwx` for owner
- `5` = 4+0+1 = `r-x` for group
- `5` = 4+0+1 = `r-x` for others

Result: `rwxr-xr-x` — very common for scripts and programs.

| Number | Permissions | What it means |
|--------|-------------|--------------|
| `7` | `rwx` | Full access |
| `6` | `rw-` | Read and write, not execute |
| `5` | `r-x` | Read and execute, not write |
| `4` | `r--` | Read only |
| `0` | `---` | No access at all |

**Most common combinations:**

```bash
chmod 755 script.sh
```

`rwxr-xr-x` — owner has full access, everyone else can read and run it. Standard for scripts.

```bash
chmod 644 document.txt
```

`rw-r--r--` — owner can read and write, everyone else can only read. Standard for regular files.

```bash
chmod 600 private.txt
```

`rw-------` — only the owner can read and write. Nobody else has any access. Good for sensitive files like SSH keys.

```bash
chmod 700 my-private-folder/
```

`rwx------` — only the owner can enter, list, or create files in this directory.

### Applying to an entire directory (recursive)

```bash
chmod -R 755 /var/www/html/
```

The `-R` flag means "recursive" — applies the permission change to the folder and everything inside it.

---

## Changing Ownership with `chown`

`chown` stands for "change owner". Only root (or sudo) can change who owns a file.

```bash
sudo chown alice file.txt
```

Changes the owner of `file.txt` to alice. The group stays the same.

```bash
sudo chown alice:developers file.txt
```

Changes the owner to alice **and** the group to developers at the same time. The format is `owner:group`.

```bash
sudo chgrp developers file.txt
```

`chgrp` changes only the group, not the owner.

```bash
sudo chown -R www-data:www-data /var/www/
```

`-R` is recursive. This sets the owner and group to `www-data` (the web server user) for the entire `/var/www/` directory. This is a very common command when setting up a web server.

---

## Special Permission Bits

Beyond the basic `rwx`, there are three special bits. These are more advanced but important to recognize.

### SUID — Run as the File's Owner

Normally when you run a program, it runs with *your* permissions. SUID (Set User ID) makes the program run with the *owner's* permissions instead.

**Real example:** The `passwd` command (used to change your password) needs to write to `/etc/shadow`, which only root can modify. But regular users can run `passwd`. How? Because `passwd` has SUID set — it temporarily runs as root.

```bash
ls -l /usr/bin/passwd
```

**Output:**
```
-rwsr-xr-x 1 root root 59976 Mar 22  2023 /usr/bin/passwd
```

Notice the `s` in the owner's execute position (`rws`). That `s` is the SUID bit.

---

### SGID — New Files Inherit the Group

When set on a **directory**, any new file created inside that directory automatically inherits the directory's group (instead of the creator's primary group).

This is very useful for shared team directories:

```bash
sudo chmod g+s /shared/teamwork/
```

Now everyone in the group who creates a file inside `/shared/teamwork/` will have that file automatically owned by the team's group.

You can spot SGID in `ls -l` — the group execute position shows `s` instead of `x`.

---

### Sticky Bit — Only Owners Can Delete

When set on a **directory**, only the file's owner can delete it — even if others have write access to the directory.

The most important example is `/tmp`. Everyone can write to `/tmp`, but you can only delete *your own* files there:

```bash
ls -ld /tmp
```

**Output:**
```
drwxrwxrwt 20 root root 4096 Jun 20 14:00 /tmp
```

The `t` at the end is the sticky bit. Without it, anyone with write access to a directory could delete anyone else's files.

```bash
chmod +t /shared/public/
```

---

## Default Permissions — `umask`

When you create a new file or directory, Linux doesn't give it random permissions. It starts with a maximum and then subtracts some permissions based on the **umask**.

The default maximum for files is `666` (rw-rw-rw-) and for directories it's `777` (rwxrwxrwx).

The default umask is usually `022`, which subtracts write permission from group and others:

```
666 - 022 = 644  (files get rw-r--r--)
777 - 022 = 755  (directories get rwxr-xr-x)
```

Check your current umask:

```bash
umask
```

**Output:**
```
0022
```

Change the umask for the current session (more restrictive — others get no permissions):

```bash
umask 027
```

Now new files will be `640` and new directories will be `750`.

To make the change permanent, add it to `~/.bashrc`.

---

## Quick Permissions Reference

| Permission String | Octal | Typical Use |
|-------------------|-------|------------|
| `rw-r--r--` | 644 | Regular files (documents, config) |
| `rwxr-xr-x` | 755 | Scripts, programs, directories |
| `rw-------` | 600 | Private files, SSH private keys |
| `rwx------` | 700 | Private directories |
| `rwxrwxr-x` | 775 | Shared team directory |

---

**Navigation:** ← [03 — Users & Groups](03-users-and-groups.md) | [Notes Index](README.md) | Next → [05 — Package Management](05-package-management.md)
**Exercise:** [Exercise 04](../02-exercises/04-file-permissions.md)
