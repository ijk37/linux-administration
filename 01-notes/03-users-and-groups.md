# 03 — Users & Groups

**Navigation:** ← [02 — File System](02-file-system.md) | [Notes Index](README.md) | Next → [04 — File Permissions](04-file-permissions.md)
**Exercise:** [Exercise 03](../02-exercises/03-users-and-groups.md)

---

## User Accounts in Linux

Every process and file in Linux is owned by a user. Users are identified by a numeric **UID (User ID)**.

| UID Range | Type |
|-----------|------|
| 0 | Root (superuser) |
| 1–999 | System/service accounts |
| 1000+ | Regular human users |

### Key Files

| File | Purpose |
|------|---------|
| `/etc/passwd` | User account information |
| `/etc/shadow` | Encrypted passwords |
| `/etc/group`  | Group definitions |
| `/etc/gshadow`| Encrypted group passwords |

### Reading `/etc/passwd`

```
username:x:UID:GID:comment:home_dir:shell
jahid   :x:1000:1000:Jahid,,,:/home/jahid:/bin/bash
```

---

## Managing Users

```bash
# Add a new user (Debian/Ubuntu)
sudo adduser alice

# Add a new user (Red Hat/CentOS — lower-level)
sudo useradd -m -s /bin/bash -c "Alice Smith" alice

# Set or change a password
sudo passwd alice

# Modify a user (change shell)
sudo usermod -s /bin/zsh alice

# Lock a user account
sudo usermod -L alice

# Unlock a user account
sudo usermod -U alice

# Delete a user (keep home directory)
sudo userdel alice

# Delete a user AND home directory
sudo userdel -r alice

# Display user info
id alice
finger alice       # may need to install
```

---

## Groups

Groups let you share permissions across multiple users. Every user belongs to a **primary group** and can belong to **supplementary groups**.

```bash
# View current user's groups
groups
id

# Add a new group
sudo groupadd developers

# Add a user to a group (supplementary)
sudo usermod -aG developers alice   # -a = append, NEVER omit!

# Remove a user from a group
sudo gpasswd -d alice developers

# Delete a group
sudo groupdel developers

# List members of a group
getent group developers
```

---

## Switching Users

```bash
# Switch to another user (interactive login)
su - alice

# Switch to root
su -

# Run a single command as another user
su - alice -c "ls /home/alice"

# Run a command as root (preferred over su)
sudo apt update

# Edit the sudoers file safely
sudo visudo
```

### Sudoers Configuration

`/etc/sudoers` controls who can use `sudo`. Always edit with `visudo` to prevent syntax errors.

```
# Give alice full sudo access
alice   ALL=(ALL:ALL) ALL

# Allow alice to run apt without a password
alice   ALL=(ALL) NOPASSWD: /usr/bin/apt
```

---

## User Environment

```bash
# Show environment variables
env
printenv PATH

# Your home directory
echo $HOME

# Current logged-in user
whoami

# All currently logged-in users
who
w

# Login history
last
lastlog
```

---

## Password Policies

```bash
# View password aging info for a user
chage -l alice

# Set password expiry to 90 days
sudo chage -M 90 alice

# Force password change on next login
sudo chage -d 0 alice

# Set minimum days between password changes
sudo chage -m 7 alice
```

---

## The `/etc/skel` Directory

Files in `/etc/skel/` are copied to every new user's home directory on creation. Use it to set default shell configs, bashrc, etc.

```bash
ls -la /etc/skel/
# .bash_logout  .bashrc  .profile
```

---

**Navigation:** ← [02 — File System](02-file-system.md) | [Notes Index](README.md) | Next → [04 — File Permissions](04-file-permissions.md)
**Exercise:** [Exercise 03](../02-exercises/03-users-and-groups.md)
