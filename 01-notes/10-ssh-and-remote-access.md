# 10 — SSH & Remote Access

**Navigation:** ← [09 — System Monitoring](09-system-monitoring.md) | [Notes Index](README.md)
**Exercise:** [Exercise 10](../02-exercises/10-ssh-and-remote-access-exe.md)

---

## What is SSH?

**SSH** (Secure Shell) lets you control a remote Linux machine from your terminal, as if you were sitting in front of it. Everything you type is encrypted, so nobody can intercept your commands or see your password.

Before SSH, people used tools like Telnet, which sent everything in plain text. SSH replaced all of that and is now the standard way to manage remote servers.

When you rent a cloud server (on AWS, DigitalOcean, etc.), SSH is almost always how you connect to it.

- **Default port:** 22
- **Both sides need SSH:** the remote machine runs an SSH *server* (`sshd`); you run an SSH *client* to connect.

---

## Connecting to a Remote Server

```bash
ssh jahid@192.168.1.10
```

Breaking this down:
- `ssh` — the command
- `jahid` — the username on the remote machine
- `@` — separator
- `192.168.1.10` — the IP address (or hostname) of the remote machine

The first time you connect to a new server, you'll see:

```
The authenticity of host '192.168.1.10' can't be established.
ED25519 key fingerprint is SHA256:abc123...
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

Type `yes`. SSH saves the server's fingerprint so it can warn you if the server's identity changes in the future (which would indicate something suspicious).

After that, you'll be asked for the password of `jahid` on the remote machine. Once authenticated, your prompt changes to show you're on the remote machine:

```
jahid@remoteserver:~$
```

Everything you type now runs on the remote machine. Type `exit` to disconnect.

---

### Connect on a different port

Some servers move SSH off port 22 to reduce automated attacks:

```bash
ssh -p 2222 jahid@192.168.1.10
```

`-p` specifies the port number.

---

### Run a single command without an interactive session

```bash
ssh jahid@192.168.1.10 "df -h"
```

Runs `df -h` on the remote machine and prints the output locally. The SSH session ends as soon as the command finishes. Useful for quick checks or in scripts.

---

## SSH Key Authentication — Safer and More Convenient

Passwords can be guessed or leaked. **SSH keys** are a much more secure way to authenticate:

1. You generate a **key pair** — two mathematically linked files:
   - **Private key** — stays on your computer. Never share it.
   - **Public key** — you copy this to the server.

2. When you connect, SSH uses math to prove you have the private key, without actually sending it. No password is transmitted.

Think of it like a padlock: you give the server your open padlock (public key), and you keep the key (private key). The server locks a message with your padlock, and only you can unlock it.

---

### Step 1 — Generate your key pair

```bash
ssh-keygen -t ed25519 -C "jahid@mylaptop"
```

- `-t ed25519` — the key type. Ed25519 is modern and secure. RSA is the older alternative.
- `-C "jahid@mylaptop"` — a comment so you can identify the key later. Use your email or a description.

You'll be asked where to save the key (press Enter to accept the default `~/.ssh/id_ed25519`) and optionally for a **passphrase** (a password that protects the private key file). Using a passphrase adds a second layer of security.

This creates two files:
```
~/.ssh/id_ed25519      ← private key (NEVER share this)
~/.ssh/id_ed25519.pub  ← public key (copy to servers)
```

View your public key:

```bash
cat ~/.ssh/id_ed25519.pub
```

Output looks like:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA... jahid@mylaptop
```

---

### Step 2 — Copy your public key to the server

```bash
ssh-copy-id jahid@192.168.1.10
```

This command automatically appends your public key to the `~/.ssh/authorized_keys` file on the remote server. You'll be asked for the password once.

After this, you can connect without a password:

```bash
ssh jahid@192.168.1.10    # no password prompt anymore
```

If `ssh-copy-id` isn't available, do it manually:

```bash
cat ~/.ssh/id_ed25519.pub | ssh jahid@192.168.1.10"mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

---

## The SSH Config File — Create Shortcuts

If you connect to multiple servers, typing full commands gets tedious. The file `~/.ssh/config` lets you define shortcuts.

Create or edit it:

```bash
nano ~/.ssh/config
```

Add entries like this:

```
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

What these settings mean:
- `Host myserver` — the alias you'll type
- `HostName` — the actual IP or domain
- `User` — which username to use
- `Port` — which port to connect on
- `IdentityFile` — which private key to use
- `ServerAliveInterval 60` — send a "keep alive" ping every 60 seconds (prevents idle connections from being dropped)

Now you can connect with just:

```bash
ssh myserver
```

---

## Hardening the SSH Server

By default SSH is fairly secure, but there are settings you should change, especially on servers exposed to the internet.

Edit the SSH server configuration file:

```bash
sudo nano /etc/ssh/sshd_config
```

**Key settings to change:**

```
# Disable root login over SSH
# Root should never be accessible directly from the internet
PermitRootLogin no

# Disable password authentication — only allow SSH keys
# (Only do this AFTER you've set up key authentication!)
PasswordAuthentication no

# Limit who can SSH in
AllowUsers jahid deploy

# Reduce the number of password attempts allowed
MaxAuthTries 3

# Disconnect idle sessions after 10 minutes
ClientAliveInterval 600
ClientAliveCountMax 0
```

**Before restarting SSH**, test that the config has no syntax errors:

```bash
sudo sshd -t
```

If it says nothing, the config is valid. If there's a mistake, it will tell you. This step is very important — a broken SSH config on a remote server could lock you out permanently.

Restart SSH to apply the changes:

```bash
sudo systemctl restart sshd
```

> **Safety tip:** When making SSH changes on a remote server, keep your current SSH connection open and test the new settings from a *second* connection. If something goes wrong, your existing connection still works.

---

## Keeping Remote Sessions Alive — tmux

If your SSH connection drops, any running command is killed. **tmux** solves this by running your session on the server — even if you disconnect, the session keeps running.

```bash
tmux new -s mysession
```

Creates a new tmux session named `mysession`. Run your commands inside.

To disconnect without killing the session:
```
Press Ctrl + B, then D   (that's the "detach" shortcut)
```

Your session keeps running on the server. Later, reconnect:

```bash
ssh jahid@myserver
tmux attach -t mysession
```

Your session is exactly as you left it.

```bash
tmux ls
```

Lists all running tmux sessions.

```bash
tmux kill-session -t mysession
```

Kills a session and everything running in it.

---

## Transferring Files

### `scp` — Copy a single file securely

```bash
scp notes.txt jahid@192.168.1.10:/home/jahid/
```

Copies `notes.txt` from your local machine to the remote server.

```bash
scp jahid@192.168.1.10:/var/log/nginx/error.log ./
```

Copies a file *from* the remote server to the current local directory (`./`).

```bash
scp -r myproject/ jahid@192.168.1.10:/home/jahid/
```

`-r` copies an entire directory.

---

### `rsync` — Sync directories efficiently

`rsync` is smarter than `scp` — it only transfers files that have changed, making repeat syncs very fast.

```bash
rsync -avz myproject/ jahid@192.168.1.10:/home/jahid/myproject/
```

- `-a` — archive mode: preserves permissions, timestamps, symlinks, etc.
- `-v` — verbose: shows each file being transferred
- `-z` — compress data during transfer (faster on slow connections)

```bash
rsync -avzn myproject/ jahid@192.168.1.10:/home/jahid/myproject/
```

`-n` is "dry run" — shows what *would* be transferred without actually doing it. Always good to preview before a large sync.

```bash
rsync -avz --delete src/ dest/
```

`--delete` removes files from the destination that no longer exist in the source. This keeps the two locations perfectly mirrored.

---

## Troubleshooting SSH Connections

**"Connection refused"**
```bash
sudo systemctl status sshd    # is the SSH server running?
sudo ufw status               # is port 22 blocked by the firewall?
```

**"Permission denied (publickey)"**  
Your key isn't being accepted. Check:
```bash
ssh -v jahid@192.168.1.10    # verbose mode shows exactly what's being tried
```

Look for "Trying key..." lines and check which key it's using. Make sure the public key is in `~/.ssh/authorized_keys` on the server.

**"WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED"**  
The server's fingerprint changed. This happens legitimately when a server is rebuilt. If you're sure it's your server, remove the old entry:

```bash
ssh-keygen -R 192.168.1.10
```

Then reconnect and accept the new fingerprint.

**Check SSH server logs for clues:**

```bash
sudo journalctl -u sshd -f
```

Shows live SSH server logs — you can see exactly why a connection is failing.

---

**Navigation:** ← [09 — System Monitoring](09-system-monitoring.md) | [Notes Index](README.md)
**Exercise:** [Exercise 10](../02-exercises/10-ssh-and-remote-access-exe.md)
