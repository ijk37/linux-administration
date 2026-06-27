# 10 — SSH & Remote Access

**Navigation:** ← [09 — System Monitoring](09-system-monitoring.md) | [Notes Index](README.md)
**Exercise:** [Exercise 10](../02-exercises/10-ssh-and-remote-access.md)

---

## What is SSH?

**SSH (Secure Shell)** is a cryptographic protocol for securely connecting to remote systems over an unsecured network. It replaces older insecure protocols like Telnet and rlogin.

- Default port: **22**
- Encrypts all traffic
- Supports password and key-based authentication

---

## Basic SSH Usage

```bash
# Connect to a remote host
ssh user@192.168.1.10
ssh jahid@myserver.com

# Connect on a non-standard port
ssh -p 2222 user@myserver.com

# Run a command on the remote host without interactive shell
ssh user@myserver.com "uptime && df -h"

# Connect with verbose output (useful for debugging)
ssh -v user@myserver.com
```

---

## SSH Key Authentication

Key-based auth is more secure and convenient than passwords.

### Generate a Key Pair

```bash
# Generate RSA key (4096-bit recommended)
ssh-keygen -t rsa -b 4096 -C "jahid@example.com"

# Generate Ed25519 key (modern, more secure)
ssh-keygen -t ed25519 -C "jahid@example.com"

# Default output:
# ~/.ssh/id_ed25519       (private key — NEVER share this)
# ~/.ssh/id_ed25519.pub   (public key — copy to servers)
```

### Copy Public Key to Remote Server

```bash
# Recommended way
ssh-copy-id user@192.168.1.10

# Manual way
cat ~/.ssh/id_ed25519.pub | ssh user@192.168.1.10 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### Permissions Required

```bash
# On the remote server
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

---

## SSH Config File

`~/.ssh/config` lets you define aliases and settings for hosts.

```
# ~/.ssh/config

Host myserver
    HostName 192.168.1.10
    User jahid
    Port 22
    IdentityFile ~/.ssh/id_ed25519

Host prod
    HostName prod.example.com
    User deploy
    Port 2222
    IdentityFile ~/.ssh/prod_key

Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

Now you can connect with: `ssh myserver`

---

## Securing the SSH Server

Edit `/etc/ssh/sshd_config`:

```bash
sudo nano /etc/ssh/sshd_config
```

Recommended settings:

```
# Disable root login over SSH
PermitRootLogin no

# Disable password authentication (use keys only)
PasswordAuthentication no

# Only allow specific users
AllowUsers jahid deploy

# Change default port (reduces scan noise)
Port 2222

# Limit authentication attempts
MaxAuthTries 3

# Disable empty passwords
PermitEmptyPasswords no

# Disconnect idle sessions after 10 minutes
ClientAliveInterval 600
ClientAliveCountMax 0
```

After editing:

```bash
# Test config before restarting!
sudo sshd -t

# Restart the SSH daemon
sudo systemctl restart sshd
```

---

## SSH Tunnels & Port Forwarding

### Local Port Forwarding

Forward a local port to a remote host/port (access remote services locally).

```bash
# Access remote MySQL (port 3306) through SSH
ssh -L 3307:localhost:3306 user@myserver.com

# Now connect locally: mysql -h 127.0.0.1 -P 3307
```

### Remote Port Forwarding

Expose a local port on the remote server (useful for sharing local services).

```bash
# Expose local port 8080 on remote port 80
ssh -R 80:localhost:8080 user@myserver.com
```

### Dynamic SOCKS Proxy

Turn SSH into a SOCKS5 proxy for all traffic.

```bash
ssh -D 1080 user@myserver.com
# Configure browser to use SOCKS5 proxy at 127.0.0.1:1080
```

---

## SCP — Secure Copy

```bash
# Copy local file to remote
scp file.txt user@myserver.com:/home/user/

# Copy remote file to local
scp user@myserver.com:/etc/nginx/nginx.conf ./

# Copy directory recursively
scp -r mydir/ user@myserver.com:/home/user/

# Using a different port
scp -P 2222 file.txt user@myserver.com:/home/user/
```

---

## rsync — Efficient File Sync

`rsync` only transfers changed parts of files — much more efficient than `scp` for large syncs.

```bash
# Sync local dir to remote
rsync -avz mydir/ user@myserver.com:/home/user/mydir/

# Sync remote dir to local
rsync -avz user@myserver.com:/var/www/ ./www-backup/

# Delete files on destination that don't exist in source
rsync -avz --delete src/ dest/

# Dry run (preview without making changes)
rsync -avzn mydir/ user@myserver.com:/home/user/mydir/

# Exclude patterns
rsync -avz --exclude='*.log' --exclude='.git/' mydir/ user@myserver.com:/home/user/
```

---

## SSH Agent

`ssh-agent` stores your decrypted private key in memory, so you don't re-enter your passphrase.

```bash
# Start agent and add key
eval $(ssh-agent)
ssh-add ~/.ssh/id_ed25519

# List keys in agent
ssh-add -l

# Remove a key
ssh-add -d ~/.ssh/id_ed25519

# Remove all keys
ssh-add -D
```

---

## Managing Remote Sessions

### tmux — Keep Sessions Alive

```bash
# Start a named session
tmux new -s mysession

# Detach from session (session keeps running)
Ctrl + B, then D

# List sessions
tmux ls

# Reattach to a session
tmux attach -t mysession

# Kill a session
tmux kill-session -t mysession
```

### screen — Classic Session Manager

```bash
# Start screen
screen

# Detach
Ctrl + A, then D

# Reattach
screen -r

# List sessions
screen -ls
```

---

## Troubleshooting SSH

```bash
# Connection refused → check if sshd is running
sudo systemctl status sshd

# Firewall blocking port 22?
sudo ufw status
sudo firewall-cmd --list-all

# Debug connection from client
ssh -vvv user@myserver.com

# Check SSH server logs
sudo journalctl -u sshd -f
sudo tail -f /var/log/auth.log

# Fix "WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED"
ssh-keygen -R 192.168.1.10
```

---

**Navigation:** ← [09 — System Monitoring](09-system-monitoring.md) | [Notes Index](README.md)
**Exercise:** [Exercise 10](../02-exercises/10-ssh-and-remote-access.md)
