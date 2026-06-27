# Exercise 03 — Users & Groups

**Navigation:** ← [Exercise 02](02-file-system.md) | [Exercises Index](README.md) | Next → [Exercise 04](04-file-permissions.md)
**Note:** [03 — Users & Groups](../01-notes/03-users-and-groups.md)

---

## Objectives

- Create and manage user accounts
- Create and manage groups
- Understand the sudoers file

> **Note:** Exercises marked with `[sudo]` require root/sudo access. Run on a test system or VM.

---

## Exercise 3.1 — Inspecting Users

```bash
# 1. Who are you?
whoami
id

# 2. View the first 5 lines of /etc/passwd
head -5 /etc/passwd

# 3. Find your own entry in /etc/passwd
grep "^$(whoami):" /etc/passwd

# 4. What shell does root use?
grep "^root:" /etc/passwd

# 5. How many user accounts exist with a real shell?
grep -v "nologin\|false" /etc/passwd | wc -l
```

**Question:** What is your UID and GID? What groups do you belong to?

---

## Exercise 3.2 — Inspecting Groups

```bash
# 1. List your groups
groups

# 2. View group file
cat /etc/group | head -20

# 3. Find which groups you're in (detailed)
id

# 4. Find all members of the sudo group (Ubuntu) or wheel group (RHEL)
getent group sudo
getent group wheel
```

---

## Exercise 3.3 — Create and Manage Users [sudo]

```bash
# 1. Create a new user named 'testuser'
sudo useradd -m -s /bin/bash -c "Test User" testuser

# 2. Set a password for testuser
sudo passwd testuser

# 3. Verify the user was created
id testuser
ls /home/testuser/

# 4. Switch to testuser
su - testuser

# 5. While as testuser, check who you are and then exit
whoami
exit

# 6. Lock testuser's account
sudo usermod -L testuser

# 7. Try to su - testuser now (should fail with "Authentication failure")
su - testuser

# 8. Unlock the account
sudo usermod -U testuser
```

---

## Exercise 3.4 — Create and Manage Groups [sudo]

```bash
# 1. Create a group called 'developers'
sudo groupadd developers

# 2. Add testuser to the developers group
sudo usermod -aG developers testuser

# 3. Verify
id testuser
getent group developers

# 4. Create a second user
sudo useradd -m -s /bin/bash alice

# 5. Add alice to developers
sudo usermod -aG developers alice

# 6. List all members of developers
getent group developers
```

---

## Exercise 3.5 — Password Policies [sudo]

```bash
# 1. View password aging info for testuser
sudo chage -l testuser

# 2. Set password to expire in 30 days
sudo chage -M 30 testuser

# 3. Force password change on next login
sudo chage -d 0 testuser

# 4. Verify the change
sudo chage -l testuser
```

---

## Exercise 3.6 — Sudo Access [sudo]

```bash
# 1. View current sudoers
sudo cat /etc/sudoers | grep -v "^#" | grep -v "^$"

# 2. Check if testuser can sudo
sudo -l -U testuser

# 3. Grant testuser sudo access (use visudo, edit safely)
# Add this line: testuser ALL=(ALL:ALL) ALL
sudo visudo

# 4. Test it
su - testuser
sudo whoami     # should print "root"
exit

# 5. Clean up — remove the line you added via visudo
sudo visudo
```

---

## Cleanup

```bash
# Remove users and their home directories
sudo userdel -r testuser
sudo userdel -r alice

# Remove the group
sudo groupdel developers
```

---

## Challenge

1. Create a user `deploy` with no home directory, no login shell (`/usr/sbin/nologin`), and add them to a group `webteam`.
2. Confirm the user cannot log in interactively.
3. Verify `deploy` is in `webteam` using `getent`.
4. Clean up both the user and the group.

---

**Navigation:** ← [Exercise 02](02-file-system.md) | [Exercises Index](README.md) | Next → [Exercise 04](04-file-permissions.md)
**Note:** [03 — Users & Groups](../01-notes/03-users-and-groups.md)
