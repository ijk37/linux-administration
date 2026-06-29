# Exercise 03 — Users & Groups

**Navigation:** ← [Exercise 02](02-file-system-exe.md) | [Exercises Index](README.md) | Next → [Exercise 04](04-file-permissions-exe.md)
**Note:** [03 — Users & Groups](../01-notes/03-users-and-groups.md)

---

## Before You Start

Read [Note 03](../01-notes/03-users-and-groups.md) first.

Exercises marked **[needs sudo]** require administrator access. If you are on a personal Linux machine or VM, your account likely has sudo access. If you're on a shared or work machine, you may need to skip those steps.

---

## Exercise 3.1 — Inspect Your Own Account

Start by understanding your own user account before managing others.

**Step 1:** Check who you are:

```bash
whoami
```

**Step 2:** Get your full identity — UID, GID, and all groups:

```bash
id
```

Expected output (yours will differ):
```
uid=1000(jahid) gid=1000(jahid) groups=1000(jahid),4(adm),27(sudo)
```

Read this carefully:
- `uid=1000(jahid)` — your User ID is 1000, username is jahid
- `gid=1000(jahid)` — your primary Group ID is 1000
- `groups=...` — all groups you belong to

**Step 3:** Find your entry in the `/etc/passwd` file:

```bash
grep "^$(whoami):" /etc/passwd
```

`grep "^$(whoami):"` searches for a line starting with your username followed by `:`. The `^` means "start of line".

Expected output:
```
jahid:x:1000:1000:Jahid Khan:/home/jahid:/bin/bash
```

Now decode each field — they are separated by `:`:

| Field | Value (example) | Meaning |
|-------|----------------|---------|
| 1 | `jahid` | Username |
| 2 | `x` | Password is in `/etc/shadow` |
| 3 | `1000` | UID |
| 4 | `1000` | Primary GID |
| 5 | `Jahid Khan` | Full name / comment |
| 6 | `/home/jahid` | Home directory |
| 7 | `/bin/bash` | Default shell |

**Step 4:** List all groups you belong to:

```bash
groups
```

Expected output (something like):
```
jahid adm cdrom sudo dip plugdev lpadmin
```

**Question:** Are you in the `sudo` group? If yes, it means you can run commands as root.

---

## Exercise 3.2 — Explore Users and Groups on the System

**Step 1:** See the first 10 lines of `/etc/passwd`:

```bash
head -10 /etc/passwd
```

Notice the first entry is `root` with UID 0. The others below it are system accounts (UID 1–999) for services like `daemon`, `syslog`, `www-data`. These are not real people — they exist so services can run as a non-root user.

**Step 2:** Count how many user accounts exist:

```bash
wc -l /etc/passwd
```

You'll probably see 30–50 entries, but most are system accounts.

**Step 3:** Show only "real" user accounts (UID 1000 and above):

```bash
awk -F: '$3 >= 1000 {print $1, $3, $6}' /etc/passwd
```

> **What is this?** `awk` is a text processing tool. `-F:` tells it the fields are separated by `:`. `$3 >= 1000` filters for rows where field 3 (UID) is 1000 or more. `{print $1, $3, $6}` prints the username, UID, and home directory.

**Step 4:** Look at the group file:

```bash
cat /etc/group | head -20
```

Each line follows the format: `groupname:x:GID:members`

**Step 5:** Find a specific group:

```bash
getent group sudo
```

`getent` queries the system's database. This shows all members of the `sudo` group.

Expected output:
```
sudo:x:27:jahid
```

---

## Exercise 3.3 — Create and Manage a User [needs sudo]

> **Note:** You'll create a user named `testuser` for practice. You'll delete them at the end.

**Step 1:** Create a new user:

```bash
sudo adduser testuser
```

`adduser` (the friendly version) will ask you:
- Password (type one twice)
- Full name, phone, etc. (you can press Enter to skip these)

At the end it says "Is the information correct? [Y/n]" — type `Y`.

**Step 2:** Verify the user was created:

```bash
id testuser
```

Expected output:
```
uid=1001(testuser) gid=1001(testuser) groups=1001(testuser)
```

**Step 3:** Verify the home directory was created:

```bash
ls /home/
```

You should see both your home folder and `testuser/` listed.

**Step 4:** Switch to testuser:

```bash
su - testuser
```

`su -` switches to a full login session as testuser. You'll be asked for testuser's password (the one you set in Step 1).

**Step 5:** While you are testuser, run a few commands:

```bash
whoami
pwd
id
```

Notice: `whoami` now shows `testuser`, and `pwd` shows `/home/testuser`. You are in a completely different user's environment.

**Step 6:** Go back to your original account:

```bash
exit
```

**Step 7:** Lock the testuser account so they can't log in:

```bash
sudo usermod -L testuser
```

`-L` stands for "Lock".

**Step 8:** Try to switch to testuser again:

```bash
su - testuser
```

You should see `Authentication failure` — the account is locked.

**Step 9:** Unlock the account:

```bash
sudo usermod -U testuser
```

`-U` stands for "Unlock". Try `su - testuser` again — it should work now. Exit when done.

---

## Exercise 3.4 — Create and Manage Groups [needs sudo]

**Step 1:** Create a new group:

```bash
sudo groupadd developers
```

**Step 2:** Verify it exists:

```bash
getent group developers
```

Expected output:
```
developers:x:1002:
```

The last field (after the final `:`) is empty because no one is in the group yet.

**Step 3:** Add testuser to the developers group:

```bash
sudo usermod -aG developers testuser
```

- `-a` means "append" — add to existing groups without removing any
- `-G` specifies the group name

> **Common mistake:** If you forget `-a` and just use `-G`, it *replaces* all of testuser's groups with only `developers`. That would remove them from their primary group and cause problems. Always use `-aG`.

**Step 4:** Verify testuser is now in the group:

```bash
getent group developers
```

Expected output:
```
developers:x:1002:testuser
```

Also check with `id`:

```bash
id testuser
```

You should see `developers` listed in the groups.

**Step 5:** Add yourself to the group too:

```bash
sudo usermod -aG developers $(whoami)
```

`$(whoami)` is replaced with your username automatically.

**Step 6:** Verify:

```bash
getent group developers
```

Both you and testuser should be listed.

> **Note:** Group changes take effect on your *next login*. To apply them in the current session without logging out, run: `newgrp developers`

---

## Exercise 3.5 — Using sudo

**Step 1:** Try running a command that requires root:

```bash
cat /etc/shadow
```

Expected output:
```
cat: /etc/shadow: Permission denied
```

Only root can read `/etc/shadow` (it stores encrypted passwords).

**Step 2:** Run the same command with sudo:

```bash
sudo cat /etc/shadow
```

You'll be asked for *your own* password. After that, you'll see the encrypted password entries. The passwords are hashed — you can't read them, but you can see they exist.

**Step 3:** Check what commands testuser is allowed to run with sudo:

```bash
sudo -l -U testuser
```

Expected output:
```
User testuser is not allowed to run sudo on this host.
```

testuser has no sudo privileges — which is correct for a new user.

---

## Exercise 3.6 — Cleanup

Always clean up test accounts when you're done:

```bash
sudo userdel -r testuser
```

`-r` removes the user *and* their home directory. Without `-r`, the home directory stays on disk.

**Verify the user is gone:**

```bash
id testuser
```

Expected output:
```
id: 'testuser': no such user
```

Remove the group:

```bash
sudo groupdel developers
```

**Verify:**

```bash
getent group developers
```

No output = the group no longer exists.

---

## Challenge — Do It From Memory

Without looking at the notes:

1. Create a user called `alice` with a home directory and bash as her shell
2. Create a group called `webteam`
3. Add `alice` to `webteam`
4. Confirm she is in the group using `getent` and `id`
5. Lock alice's account
6. Confirm the lock worked by trying to switch to her
7. Clean up: delete alice and the webteam group

Write the commands in order before running them, then check your work.

---

**Navigation:** ← [Exercise 02](02-file-system-exe.md) | [Exercises Index](README.md) | Next → [Exercise 04](04-file-permissions-exe.md)
**Note:** [03 — Users & Groups](../01-notes/03-users-and-groups.md)
