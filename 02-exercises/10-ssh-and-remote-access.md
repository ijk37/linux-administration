# Exercise 10 — SSH & Remote Access

**Navigation:** ← [Exercise 09](09-system-monitoring.md) | [Exercises Index](README.md)
**Note:** [10 — SSH & Remote Access](../01-notes/10-ssh-and-remote-access.md)

---

## Before You Start

Read [Note 10](../01-notes/10-ssh-and-remote-access.md) first.

**What you need:**
- Exercises 10.1–10.3 work on your local machine (no remote server needed)
- Exercises 10.4–10.6 require a second machine to connect to (a VM, a cloud server, or a second computer)
- For exercises you can't complete (no second machine), read through the steps and note the commands — you'll use them when you have a server

---

## Exercise 10.1 — Inspect the SSH Setup on Your Machine

**Step 1:** Check if the SSH client is installed:

```bash
which ssh
ssh -V
```

Expected output:
```
/usr/bin/ssh
OpenSSH_8.9p1 Ubuntu-3ubuntu0.6, OpenSSL 3.0.2 ...
```

**Step 2:** Check if the SSH *server* (sshd) is installed and running:

```bash
systemctl status ssh 2>/dev/null || systemctl status sshd
```

If the SSH server is running, you'll see `Active: active (running)`. If it's not installed, install it:

```bash
sudo apt install -y openssh-server
sudo systemctl enable --now ssh
```

**Step 3:** Verify SSH is listening on port 22:

```bash
ss -tulnp | grep :22
```

Expected output:
```
tcp  LISTEN  0.0.0.0:22   sshd
```

**Step 4:** View the current SSH server configuration:

```bash
sudo grep -v "^#" /etc/ssh/sshd_config | grep -v "^$"
```

`grep -v "^#"` removes comment lines. `grep -v "^$"` removes empty lines. This shows only the active settings.

**Reflect:** Is `PermitRootLogin` set? Is `PasswordAuthentication` enabled? These settings matter for security.

---

## Exercise 10.2 — Generate an SSH Key Pair

**Step 1:** Check if you already have keys:

```bash
ls -la ~/.ssh/ 2>/dev/null || echo "No .ssh directory yet"
```

If you see `id_rsa`, `id_ed25519`, or similar files, you already have a key pair.

**Step 2:** Generate a new Ed25519 key pair:

```bash
ssh-keygen -t ed25519 -C "$(whoami)@$(hostname)-$(date +%Y%m%d)"
```

Breaking this down:
- `-t ed25519` — the key type (Ed25519 is modern and secure)
- `-C "..."` — a comment to identify the key (auto-filled with your username, hostname, and date)

You'll be asked:
- **File location:** Press Enter to accept the default (`~/.ssh/id_ed25519`)
- **Passphrase:** You can set one for extra security, or press Enter twice to skip

**Step 3:** View the generated files:

```bash
ls -la ~/.ssh/
```

You should see:
```
-rw------- 1 jahid jahid  411 Jun 20 14:00 id_ed25519       ← private key
-rw-r--r-- 1 jahid jahid   98 Jun 20 14:00 id_ed25519.pub   ← public key
```

Notice the permissions: the private key is `600` (only you can read it). If the private key's permissions are too open, SSH refuses to use it.

**Step 4:** View your public key:

```bash
cat ~/.ssh/id_ed25519.pub
```

Expected output:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA...long string... jahid@mycomputer-20240620
```

This is what you copy to a server's `~/.ssh/authorized_keys` file. The private key never leaves your machine.

**Step 5:** View the key fingerprint (a short ID for the key):

```bash
ssh-keygen -lf ~/.ssh/id_ed25519.pub
```

Expected output:
```
256 SHA256:abc123...xyz jahid@mycomputer-20240620 (ED25519)
```

The fingerprint is useful for verifying you're connecting to the right server (compare with what the server shows).

---

## Exercise 10.3 — Create an SSH Client Config

Even without a remote server, you can set up the config file. This makes connecting much faster once you have servers.

**Step 1:** Create the SSH config directory if it doesn't exist:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
```

The `700` permission is required — SSH ignores the config if permissions are too open.

**Step 2:** Create the config file:

```bash
nano ~/.ssh/config
```

Type this content:

```
# Replace these values with your actual server details when you have one

Host myserver
    HostName 192.168.1.10
    User jahid
    Port 22
    IdentityFile ~/.ssh/id_ed25519

# Settings that apply to ALL connections
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    AddKeysToAgent yes
```

Save and exit.

**Step 3:** Set correct permissions:

```bash
chmod 600 ~/.ssh/config
```

**Step 4:** Verify the file looks correct:

```bash
cat ~/.ssh/config
```

**Understand the settings:**
- `Host myserver` — the alias: you type `ssh myserver` instead of the full command
- `HostName` — the actual IP or domain
- `ServerAliveInterval 60` — sends a keepalive packet every 60 seconds to prevent idle disconnections
- `AddKeysToAgent yes` — adds your key to the SSH agent so you don't need to re-enter your passphrase every time

---

## Exercise 10.4 — Connect to a Remote Server [needs second machine]

> If you don't have a second machine yet, read through these steps and come back when you do. A free tier cloud VM (AWS EC2, DigitalOcean, Linode) works perfectly.

**Step 1:** Connect with a password:

```bash
ssh username@192.168.1.10
```

Replace `username` with the actual username on the remote machine and the IP with the actual address.

The first time you connect, you'll see:

```
The authenticity of host '192.168.1.10' cannot be established.
ED25519 key fingerprint is SHA256:abc123...
Are you sure you want to continue connecting (yes/no)?
```

Type `yes`. The server's fingerprint is saved to `~/.ssh/known_hosts`.

**Step 2:** Once logged in, explore the remote machine:

```bash
whoami
hostname
uname -r
df -h
```

Notice you're running these on the **remote** machine, even though you're typing in your local terminal.

**Step 3:** Exit the remote session:

```bash
exit
```

Your prompt returns to your local machine.

---

## Exercise 10.5 — Set Up Key-Based Authentication [needs second machine]

**Step 1:** Copy your public key to the remote server:

```bash
ssh-copy-id jahid@192.168.1.10
```

You'll be asked for the remote password once. After that, your public key is added to `~/.ssh/authorized_keys` on the server.

**Step 2:** Connect again — this time without a password prompt:

```bash
ssh jahid@192.168.1.10
```

If you set up the SSH config in Exercise 10.3, use the alias:

```bash
ssh myserver
```

No password is asked — you're authenticated via key.

**Step 3:** Verify where your key was placed on the server:

```bash
# Run this while connected to the remote machine
cat ~/.ssh/authorized_keys
```

You should see your public key. Exit the remote session.

**Step 4:** Disable password authentication on the server (only after confirming keys work!):

> **Warning:** Only do this if key authentication is confirmed to work. If you lock yourself out, you may need console access to fix it.

```bash
# Connect to the server first
ssh myserver

# Edit the SSH config
sudo nano /etc/ssh/sshd_config
# Find: PasswordAuthentication yes
# Change to: PasswordAuthentication no

# Test the config before restarting
sudo sshd -t

# If no errors, restart
sudo systemctl restart sshd

# Open a NEW terminal and try connecting
# If it works, you're safe. If not, fix it in your current session.
```

---

## Exercise 10.6 — Transfer Files [needs second machine]

**Step 1:** Copy a local file to the remote server:

```bash
scp ~/linux-practice/scripts/system-info.sh jahid@192.168.1.10:/tmp/
```

**Step 2:** Verify it arrived (connect and check):

```bash
ssh jahid@192.168.1.10 "ls -l /tmp/system-info.sh"
```

You can run a remote command without a full interactive session — just put it in quotes.

**Step 3:** Copy a file from the remote to local:

```bash
scp jahid@192.168.1.10:/etc/hostname /tmp/remote-hostname.txt
cat /tmp/remote-hostname.txt
```

**Step 4:** Use rsync for smarter syncing:

```bash
rsync -avz ~/linux-practice/scripts/ jahid@192.168.1.10:/home/jahid/scripts/
```

The output shows each file being transferred. Run it again immediately — rsync checks modification times and skips files that haven't changed, making repeat runs very fast.

---

## Exercise 10.7 — Troubleshoot an SSH Connection

These are the steps to diagnose a broken SSH connection. Try them on a connection that should work.

**Step 1:** Use verbose mode to see exactly what SSH is doing:

```bash
ssh -v jahid@192.168.1.10
```

The `-v` flag prints detailed debug output. Look for lines like:
- `Connecting to 192.168.1.10 port 22` — is it reaching the server?
- `Server host key: ...` — did the server respond?
- `Trying private key: /home/jahid/.ssh/id_ed25519` — is it trying your key?
- `Authentication succeeded` or `Permission denied` — what was the result?

Use `-vv` or `-vvv` for even more detail.

**Step 2:** Check the SSH server's log for connection attempts:

On the *remote* machine:
```bash
sudo journalctl -u sshd -n 30 --no-pager
```

Failed connections leave messages here explaining *why* they failed.

**Step 3:** Common problems and fixes:

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| `Connection refused` | sshd not running | `sudo systemctl start sshd` |
| `Connection timed out` | Firewall blocking port 22 | `sudo ufw allow ssh` |
| `Permission denied (publickey)` | Key not in authorized_keys | Re-run `ssh-copy-id` |
| `WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED` | Server was rebuilt | `ssh-keygen -R hostname` |
| `Bad permissions` on config | Config file too permissive | `chmod 600 ~/.ssh/config` |

---

## Challenge — SSH Security Audit Script

Write a script `~/linux-practice/scripts/ssh-audit.sh` that checks SSH security settings and reports PASS/FAIL:

**Checks to include:**
1. Is the SSH daemon running?
2. Is root login disabled? (`PermitRootLogin no` in sshd_config)
3. Is password authentication disabled? (`PasswordAuthentication no`)
4. Is port 22 the port being used, or a custom port?
5. How many authorized keys does the current user have?

**Expected output format:**
```
=== SSH Security Audit ===
[PASS] SSH daemon is running
[WARN] Root login is not explicitly disabled
[WARN] Password authentication is still enabled
[INFO] SSH is listening on port 22
[INFO] You have 1 authorized key(s)
==========================
```

**Hints:**
- Use `systemctl is-active sshd` to check if sshd is running
- Use `grep "^PermitRootLogin" /etc/ssh/sshd_config` to find the setting
- Use `wc -l < ~/.ssh/authorized_keys` to count keys (handle missing file with `2>/dev/null`)

---

**Navigation:** ← [Exercise 09](09-system-monitoring.md) | [Exercises Index](README.md)
**Note:** [10 — SSH & Remote Access](../01-notes/10-ssh-and-remote-access.md)
