# Exercise 10 — SSH & Remote Access

**Navigation:** ← [Exercise 09](09-system-monitoring.md) | [Exercises Index](README.md)
**Note:** [10 — SSH & Remote Access](../01-notes/10-ssh-and-remote-access.md)

---

## Objectives

- Generate and use SSH key pairs
- Configure the SSH client
- Harden an SSH server
- Use SCP and rsync for file transfer

> Exercises 10.3 and beyond require access to a second machine (or a local VM). If unavailable, read through and note the commands.

---

## Exercise 10.1 — Inspect SSH Configuration

```bash
# 1. Is the SSH client available?
which ssh

# 2. Is the SSH server running?
systemctl status ssh 2>/dev/null || systemctl status sshd

# 3. What port is SSH listening on?
ss -tulnp | grep :22

# 4. View the SSH server config
sudo grep -v "^#" /etc/ssh/sshd_config | grep -v "^$"

# 5. View your SSH client config (if it exists)
cat ~/.ssh/config 2>/dev/null || echo "No SSH config yet"

# 6. List any existing keys
ls -la ~/.ssh/ 2>/dev/null || echo "No .ssh directory yet"
```

---

## Exercise 10.2 — Generate SSH Keys

```bash
# 1. Create .ssh directory if needed
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 2. Generate an Ed25519 key pair
ssh-keygen -t ed25519 -C "$(whoami)@$(hostname)-$(date +%Y%m%d)" -f ~/.ssh/id_ed25519

# 3. View the public key
cat ~/.ssh/id_ed25519.pub

# 4. View the key fingerprint
ssh-keygen -lf ~/.ssh/id_ed25519.pub

# 5. List your keys
ls -la ~/.ssh/
```

**Note the public key format:**  
`ssh-ed25519 AAAA... user@host`  
This is what goes into `~/.ssh/authorized_keys` on a server.

---

## Exercise 10.3 — SSH Client Config [Requires Remote Server]

Create `~/.ssh/config` with a named host entry:

```bash
cat > ~/.ssh/config << 'EOF'
# Replace with your actual server details
Host myvm
    HostName 192.168.1.10
    User your-username
    Port 22
    IdentityFile ~/.ssh/id_ed25519

Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    AddKeysToAgent yes
EOF

chmod 600 ~/.ssh/config

# Now connect using the alias (update HostName and User first!)
# ssh myvm
```

---

## Exercise 10.4 — Copy Key to Remote Server [Requires Remote Server]

```bash
# Method 1: ssh-copy-id (recommended)
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@192.168.1.10

# Method 2: Manual
cat ~/.ssh/id_ed25519.pub | ssh user@192.168.1.10 \
  "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

# Test key-based login
ssh user@192.168.1.10

# Confirm no password was asked
```

---

## Exercise 10.5 — Harden SSH Server [sudo required]

```bash
# 1. Backup original config
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak

# 2. View current dangerous settings
sudo grep -E "PermitRootLogin|PasswordAuthentication|PermitEmptyPasswords" /etc/ssh/sshd_config

# 3. Make hardening changes (edit carefully)
sudo nano /etc/ssh/sshd_config
# Set:
#   PermitRootLogin no
#   MaxAuthTries 3
#   ClientAliveInterval 300

# 4. Test config syntax before restarting!
sudo sshd -t && echo "Config OK" || echo "Config has errors!"

# 5. If config is OK, restart SSH
sudo systemctl restart ssh 2>/dev/null || sudo systemctl restart sshd

# 6. Verify changes
sudo grep -E "PermitRootLogin|MaxAuthTries|ClientAliveInterval" /etc/ssh/sshd_config
```

> **Warning:** If you disable `PasswordAuthentication`, make sure key-based login works FIRST or you may lock yourself out.

---

## Exercise 10.6 — File Transfers [Requires Remote Server]

```bash
# SCP — upload a file
scp ~/scripts/health-check.sh user@192.168.1.10:/tmp/

# SCP — download a file
scp user@192.168.1.10:/etc/hostname /tmp/remote-hostname.txt
cat /tmp/remote-hostname.txt

# rsync — sync a directory
rsync -avz ~/scripts/ user@192.168.1.10:/home/user/scripts/

# rsync — dry run first
rsync -avzn ~/scripts/ user@192.168.1.10:/home/user/scripts/
```

---

## Exercise 10.7 — SSH Tunnels [Requires Remote Server]

```bash
# Local port forwarding: access remote port 8080 locally on 9090
# (On remote, start a web server first: python3 -m http.server 8080)
ssh -L 9090:localhost:8080 user@192.168.1.10 -N &
TUNNEL_PID=$!

# Test it
curl http://localhost:9090

# Kill the tunnel
kill $TUNNEL_PID
```

---

## Challenge

Write a script `~/scripts/ssh-audit.sh` that:
1. Checks if the SSH server is running
2. Reports the current port
3. Checks if `PermitRootLogin` is disabled
4. Checks if `PasswordAuthentication` is disabled
5. Lists the contents of `authorized_keys` (masked — show only fingerprints)
6. Prints PASS/FAIL for each check

Expected output:
```
=== SSH Security Audit ===
[PASS] SSH daemon is running
[PASS] SSH port: 22
[PASS] Root login disabled
[FAIL] Password authentication is still enabled
[INFO] 1 authorized key(s) found
```

---

**Navigation:** ← [Exercise 09](09-system-monitoring.md) | [Exercises Index](README.md)
**Note:** [10 — SSH & Remote Access](../01-notes/10-ssh-and-remote-access.md)
