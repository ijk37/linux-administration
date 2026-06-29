# 03 — Users & Groups

**Navigation:** ← [02 — File System](02-file-system.md) | [Notes Index](README.md) | Next → [04 — File Permissions](04-file-permissions.md)
**Exercise:** [Exercise 03](../02-exercises/03-users-and-groups-exe.md)

---

## Why Does Linux Have Users?

Linux was designed from the start to be used by many people at the same time (it's a multi-user system). Each person gets their own account with their own files, settings, and level of access. Even if only one person uses the machine, the user system still matters — it controls which programs can access which files.

Every file, folder, and running program in Linux is "owned" by a user. Ownership determines who can read, modify, or run it.

---

## The Root User (Administrator)

There is a special user called **root**. Root has unrestricted access to everything on the system — it can read any file, delete anything, install software, and change any setting.

> **Think of it like this:** regular users are employees in a building; root is the building manager who has a master key to every room.

You will see the prompt change when you are root:

```
jahid@myserver:~$   ← regular user ($ at the end)
root@myserver:~#    ← root user (# at the end)
```

Because root is so powerful, you should only use it when necessary. The `sudo` command lets you run a single command as root without fully becoming root.

---

## User IDs (UID)

Internally, Linux identifies users by a number called the **UID** (User ID), not by name.

| UID | Who it is |
|-----|----------|
| 0 | root (the administrator) |
| 1–999 | System accounts (for software like nginx, mysql) — not real people |
| 1000+ | Regular human user accounts |

When you create a new user, they automatically get the next available UID starting from 1000.

---

## Where User Information is Stored

Linux stores user information in plain text files:

| File | What it contains |
|------|-----------------|
| `/etc/passwd` | Basic info: username, UID, home folder, shell |
| `/etc/shadow` | Encrypted passwords (only root can read this) |
| `/etc/group` | Group definitions and members |

### Reading `/etc/passwd`

Run `cat /etc/passwd` and you'll see lines like this:

```
jahid:x:1000:1000:Jahid Khan:/home/jahid:/bin/bash
```

Each field is separated by `:`. Here's what each part means:

```
jahid           ← username
x               ← password placeholder (actual password is in /etc/shadow)
1000            ← UID (User ID)
1000            ← GID (primary Group ID)
Jahid Khan      ← full name / comment
/home/jahid     ← home directory
/bin/bash       ← shell this user uses
```

---

## Checking Who You Are

```bash
whoami
```

Prints your current username. Simple and useful.

```bash
id
```

Prints more detail — your UID, your primary group, and all groups you belong to.

**Example output:**
```
uid=1000(jahid) gid=1000(jahid) groups=1000(jahid),4(adm),27(sudo),1001(developers)
```

Reading this: you are user `jahid` (UID 1000), your primary group is `jahid`, and you are also a member of `adm`, `sudo`, and `developers`.

---

## Managing Users

> All the commands below require `sudo` because creating and deleting users is an administrator task.

### Create a new user

On Ubuntu/Debian, `adduser` is the friendliest way — it asks you questions:

```bash
sudo adduser alice
```

It will ask for a password, full name, and a few other things. It also creates the home directory `/home/alice` automatically.

The lower-level command `useradd` does the same thing but silently, using flags:

```bash
sudo useradd -m -s /bin/bash -c "Alice Smith" alice
```

- `-m` — create a home directory (`/home/alice`)
- `-s /bin/bash` — set the shell to bash
- `-c "Alice Smith"` — add a comment (the user's full name)
- `alice` — the username

After `useradd`, you must set the password separately:

```bash
sudo passwd alice
```

It will prompt you to type and confirm a new password.

---

### View information about a user

```bash
id alice
```

Shows alice's UID, GID, and group memberships.

---

### Modify an existing user

```bash
sudo usermod -s /bin/zsh alice
```

`usermod` changes an existing user. Here, `-s` changes alice's shell to `zsh`.

Lock an account (the user can no longer log in):

```bash
sudo usermod -L alice
```

`-L` stands for "Lock". The account still exists but the password is disabled.

Unlock it again:

```bash
sudo usermod -U alice
```

`-U` stands for "Unlock".

---

### Delete a user

```bash
sudo userdel alice
```

This removes the user account but **keeps** the home directory (`/home/alice`) on disk.

```bash
sudo userdel -r alice
```

The `-r` flag also **removes** the home directory and mail spool. Use this when you want a clean removal.

---

## Groups

A **group** is a collection of users. Groups let you give the same permissions to multiple people at once.

**Example:** You have a folder of project files. Instead of setting permissions for each person individually, you create a group called `developers`, add everyone to it, and set the folder's group to `developers`.

Every user has:
- One **primary group** (set when the user is created, usually has the same name as the username)
- Zero or more **supplementary groups** (extra groups for additional access)

### View your groups

```bash
groups
```

**Example output:**
```
jahid adm sudo developers
```

These are all the groups you belong to.

---

### Create a group

```bash
sudo groupadd developers
```

---

### Add a user to a group

```bash
sudo usermod -aG developers alice
```

- `-a` means "append" (add to, don't replace existing groups)
- `-G` specifies the group

> **Important:** Always include `-a` when adding to a group. If you forget it and just use `-G`, it will *replace* all of alice's existing groups with only `developers`, removing her from everything else.

The change takes effect the next time alice logs in.

---

### Remove a user from a group

```bash
sudo gpasswd -d alice developers
```

`gpasswd -d` removes alice from the `developers` group.

---

### See who is in a group

```bash
getent group developers
```

**Example output:**
```
developers:x:1001:alice,jahid
```

---

### Delete a group

```bash
sudo groupdel developers
```

---

## Switching Between Users

### `su` — Switch User

```bash
su - alice
```

This switches your session to alice's account. You will be prompted for alice's password.

The `-` (dash) is important — it means "simulate a full login". Without it, you switch to alice's account but keep your current environment (wrong home directory, wrong settings). Always use `su -`.

Switch to root:

```bash
su -
```

You'll need the root password.

---

### `sudo` — Run One Command as Root

`sudo` is the preferred way to do admin tasks. Instead of switching to root entirely, you run a single command with root privileges, then return to your normal user:

```bash
sudo apt update
```

You'll be asked for **your own** password (not root's). After that, `sudo` remembers you for a few minutes so you don't have to keep typing it.

> **Good habit:** Use `sudo` for individual commands rather than switching to root with `su`. This way, you cannot accidentally run something destructive while forgetting you're root.

---

### The sudoers file — Who can use sudo?

The file `/etc/sudoers` controls who is allowed to use `sudo`. **Never edit it directly** — use `visudo` instead:

```bash
sudo visudo
```

`visudo` checks for syntax errors before saving. A mistake in `/etc/sudoers` can lock you out of sudo entirely.

To give a user full sudo access, add a line like this:

```
alice   ALL=(ALL:ALL) ALL
```

Reading this: alice can run any command (`ALL`) on any host (`ALL`) as any user (`(ALL:ALL)`).

On Ubuntu, adding a user to the `sudo` group is simpler and has the same effect:

```bash
sudo usermod -aG sudo alice
```

---

## Password Policies

You can control how often users must change their password using `chage` (change age).

```bash
sudo chage -l alice
```

The `-l` flag lists alice's current password policy.

**Example output:**
```
Last password change                : Jun 01, 2024
Password expires                    : never
Minimum number of days between changes : 0
Maximum number of days between changes : 99999
```

Set the password to expire every 90 days:

```bash
sudo chage -M 90 alice
```

`-M` sets the maximum number of days a password is valid.

Force alice to change her password the next time she logs in:

```bash
sudo chage -d 0 alice
```

Setting the "last change date" to 0 (January 1, 1970) makes the password immediately expired, so alice must change it on her next login.

---

## The `/etc/skel` Directory

When you create a new user, Linux automatically populates their home directory with some starter files. These come from `/etc/skel/`:

```bash
ls -la /etc/skel/
```

**Example output:**
```
.bash_logout
.bashrc
.profile
```

These are default shell configuration files. If you want every new user to start with a custom `.bashrc` or a welcome document, put those files in `/etc/skel/` and they will be copied automatically when new users are created.

---

**Navigation:** ← [02 — File System](02-file-system.md) | [Notes Index](README.md) | Next → [04 — File Permissions](04-file-permissions.md)
**Exercise:** [Exercise 03](../02-exercises/03-users-and-groups-exe.md)
