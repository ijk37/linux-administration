# Exercise 04 — File Permissions

**Navigation:** ← [Exercise 03](03-users-and-groups-exe.md) | [Exercises Index](README.md) | Next → [Exercise 05](05-package-management-exe.md)
**Note:** [04 — File Permissions](../01-notes/04-file-permissions.md)

---

## Before You Start

Read [Note 04](../01-notes/04-file-permissions.md) first.

Permissions are one of the most important concepts in Linux security. In this exercise you'll learn to read permission strings, change them, and understand why certain permissions are set the way they are.

---

## Exercise 4.1 — Reading Permission Strings

Before changing anything, practice reading permissions.

**Step 1:** Run this and look carefully at the output:

```bash
ls -l /bin/ls /etc/passwd /tmp
```

Expected output (something like):
```
-rwxr-xr-x 1 root root  147424 Sep  5  2019 /bin/ls
-rw-r--r-- 1 root root    2423 Jun 20 10:00 /etc/passwd
drwxrwxrwt 9 root root    4096 Jun 20 14:00 /tmp
```

**Step 2:** Decode each permission string using this template:

```
Position:  1   234   567   890
           d   rwx   r-x   r-x
           ^   ^^^   ^^^   ^^^
           |   |     |     |
           |   |     |     └── Others permissions
           |   |     └──────── Group permissions
           |   └────────────── Owner permissions
           └────────────────── File type (d=dir, -=file, l=link)
```

Fill in this table:

| File | Type | Owner can | Group can | Others can |
|------|------|-----------|-----------|------------|
| `/bin/ls` | ? | ? | ? | ? |
| `/etc/passwd` | ? | ? | ? | ? |
| `/tmp` | ? | ? | ? | ? |

**Step 3:** Check a sensitive file:

```bash
ls -l /etc/shadow
```

Expected output:
```
-rw-r----- 1 root shadow 1234 Jun 20 10:00 /etc/shadow
```

**Questions to think about:**
- Why does `/etc/shadow` have stricter permissions than `/etc/passwd`?
- What does the `t` at the end of `/tmp`'s permissions mean? (Hint: see Note 04 — sticky bit)
- Who can write to `/tmp`? Who can delete files from it?

---

## Exercise 4.2 — Set Up Practice Files

**Step 1:** Create a directory for this exercise:

```bash
mkdir ~/perm-practice
cd ~/perm-practice
```

**Step 2:** Create three files:

```bash
touch document.txt script.sh private.txt
```

**Step 3:** Check their current permissions:

```bash
ls -l
```

Expected output:
```
-rw-r--r-- 1 jahid jahid 0 Jun 20 14:00 document.txt
-rw-r--r-- 1 jahid jahid 0 Jun 20 14:00 private.txt
-rw-r--r-- 1 jahid jahid 0 Jun 20 14:00 script.sh
```

All three start with `rw-r--r--` (644). This is the default — the owner can read/write, everyone else can only read. Notice none of them are executable yet.

---

## Exercise 4.3 — Change Permissions with chmod (Symbolic)

**Step 1:** Make `script.sh` executable for the owner:

```bash
chmod u+x script.sh
ls -l script.sh
```

Expected output:
```
-rwxr--r-- 1 jahid jahid 0 Jun 20 14:00 script.sh
```

See how `rw-` became `rwx` for the owner position? The `x` was added.

**Step 2:** Remove read permission from others on `private.txt`:

```bash
chmod o-r private.txt
ls -l private.txt
```

Expected output:
```
-rw-r----- 1 jahid jahid 0 Jun 20 14:00 private.txt
```

Others went from `r--` to `---`. Now only the owner and group can read this file.

**Step 3:** Set the group to have no permissions at all on `private.txt`:

```bash
chmod g-r private.txt
ls -l private.txt
```

Expected output:
```
-rw------- 1 jahid jahid 0 Jun 20 14:00 private.txt
```

Now only the owner can read or write it. This is how you protect sensitive files.

**Step 4:** Use `=` to set permissions exactly:

```bash
chmod o=r document.txt
ls -l document.txt
```

`o=r` means "set others' permissions to exactly read-only". The `=` replaces whatever was there. This is different from `+` (which adds) or `-` (which removes).

---

## Exercise 4.4 — Change Permissions with chmod (Numeric/Octal)

Numeric mode is faster once you understand it. Each digit represents owner, group, and others.

**The key to remember:**
- `r` = 4
- `w` = 2
- `x` = 1
- Add them up: `rw-` = 4+2+0 = **6**, `r-x` = 4+0+1 = **5**, `rwx` = 4+2+1 = **7**

**Before running each command below, predict the permission string:**

```bash
chmod 755 script.sh
ls -l script.sh
```

Did you get `rwxr-xr-x`? (7=rwx, 5=r-x, 5=r-x) ✓

```bash
chmod 644 document.txt
ls -l document.txt
```

Did you get `rw-r--r--`? (6=rw-, 4=r--, 4=r--) ✓

```bash
chmod 600 private.txt
ls -l private.txt
```

Did you get `rw-------`? (6=rw-, 0=---, 0=---) ✓

**Practice:** Before running each command, predict the result:

| Command | Predicted result |
|---------|-----------------|
| `chmod 777 script.sh` | ? |
| `chmod 400 private.txt` | ? |
| `chmod 750 document.txt` | ? |

Run them, then check:
- 777 → `rwxrwxrwx` (full access for everyone — rarely a good idea)
- 400 → `r--------` (read-only for owner, no access for anyone else)
- 750 → `rwxr-x---` (owner full, group read+execute, others nothing)

---

## Exercise 4.5 — Changing Ownership with chown

> **Needs sudo** for the first part.

**Step 1:** View the current owner and group of your practice files:

```bash
ls -l ~/perm-practice/
```

Everything should show your username as both owner and group.

**Step 2:** Create a test file as root:

```bash
sudo touch ~/perm-practice/rootfile.txt
ls -l ~/perm-practice/rootfile.txt
```

Expected output:
```
-rw-r--r-- 1 root root 0 Jun 20 14:00 rootfile.txt
```

The owner is `root` and the group is `root`. You (as `jahid`) cannot modify this file even though it's in your directory.

**Step 3:** Try to write to it without sudo:

```bash
echo "test" > ~/perm-practice/rootfile.txt
```

Expected error:
```
-bash: /home/jahid/perm-practice/rootfile.txt: Permission denied
```

You're blocked because you don't own the file and don't have write permission as "others".

**Step 4:** Transfer ownership to yourself:

```bash
sudo chown $(whoami) ~/perm-practice/rootfile.txt
ls -l ~/perm-practice/rootfile.txt
```

Expected output:
```
-rw-r--r-- 1 jahid root 0 Jun 20 14:00 rootfile.txt
```

Now you own it. Try writing to it again:

```bash
echo "test" > ~/perm-practice/rootfile.txt
cat ~/perm-practice/rootfile.txt
```

It works now.

**Step 5:** Change both owner and group at once:

```bash
sudo chown $(whoami):$(whoami) ~/perm-practice/rootfile.txt
ls -l ~/perm-practice/rootfile.txt
```

Expected output:
```
-rw-r--r-- 1 jahid jahid 0 Jun 20 14:00 rootfile.txt
```

---

## Exercise 4.6 — Understand the Sticky Bit on /tmp

The sticky bit is already in action on your system. Let's see it.

**Step 1:** Inspect `/tmp`:

```bash
ls -ld /tmp
```

Expected output:
```
drwxrwxrwt 9 root root 4096 Jun 20 14:00 /tmp
```

`drwxrwxrwt` — the `t` at the end is the sticky bit. The permissions `rwxrwxrwx` would normally mean *anyone can delete any file*. The sticky bit changes that: you can only delete files you own.

**Step 2:** Create two files in `/tmp` — one as yourself, one as root:

```bash
touch /tmp/my-file.txt
sudo touch /tmp/root-file.txt
ls -l /tmp/my-file.txt /tmp/root-file.txt
```

**Step 3:** Try to delete root's file without sudo:

```bash
rm /tmp/root-file.txt
```

Expected error:
```
rm: cannot remove '/tmp/root-file.txt': Operation not permitted
```

The sticky bit is preventing you from deleting a file you don't own.

**Step 4:** Delete your own file (this works fine):

```bash
rm /tmp/my-file.txt
```

No error — you own it.

**Step 5:** Clean up root's test file:

```bash
sudo rm /tmp/root-file.txt
```

---

## Exercise 4.7 — umask — Where Do Default Permissions Come From?

**Step 1:** Check the current umask:

```bash
umask
```

Expected output:
```
0022
```

**Step 2:** Create a file and directory and observe the defaults:

```bash
touch ~/perm-practice/default-file.txt
mkdir ~/perm-practice/default-dir
ls -l ~/perm-practice/default-file.txt
ls -ld ~/perm-practice/default-dir
```

Expected output:
```
-rw-r--r-- 1 jahid jahid 0 Jun 20 14:00 default-file.txt
drwxr-xr-x 2 jahid jahid 4096 Jun 20 14:00 default-dir/
```

Verify the math: File default is `666`, minus umask `022` = `644` (`rw-r--r--`). Directory default is `777`, minus `022` = `755` (`rwxr-xr-x`). ✓

**Step 3:** Change the umask and see the effect:

```bash
umask 077
touch ~/perm-practice/private-default.txt
ls -l ~/perm-practice/private-default.txt
```

Expected output:
```
-rw------- 1 jahid jahid 0 Jun 20 14:00 private-default.txt
```

With umask `077`: `666 - 077 = 600` (`rw-------`). Only the owner can read/write. Nobody else has any access at all.

**Step 4:** Restore the normal umask:

```bash
umask 022
```

> **Important:** Changing `umask` only lasts for the current session. Once you close the terminal, it resets. To make it permanent, add `umask 022` to your `~/.bashrc` file.

---

## Cleanup

```bash
rm -rf ~/perm-practice/
```

---

## Challenge — Permission Puzzle

Without running any commands first, predict the permission string for each octal:

| Octal | Permission string |
|-------|-----------------|
| `755` | ? |
| `644` | ? |
| `600` | ? |
| `777` | ? |
| `444` | ? |
| `711` | ? |

Then run this to check your answers:

```bash
touch /tmp/permtest
for perm in 755 644 600 777 444 711; do
    chmod $perm /tmp/permtest
    echo -n "$perm → "
    ls -l /tmp/permtest | awk '{print $1}'
done
rm /tmp/permtest
```

How many did you get right?

---

**Navigation:** ← [Exercise 03](03-users-and-groups-exe.md) | [Exercises Index](README.md) | Next → [Exercise 05](05-package-management-exe.md)
**Note:** [04 — File Permissions](../01-notes/04-file-permissions.md)
