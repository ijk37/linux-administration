# 06 — Process Management

**Navigation:** ← [05 — Package Management](05-package-management.md) | [Notes Index](README.md) | Next → [07 — Networking](07-networking.md)
**Exercise:** [Exercise 06](../02-exercises/06-process-management.md)

---

## What is a Process?

A **process** is a running instance of a program. Every process has:
- A unique **PID** (Process ID)
- A **PPID** (Parent Process ID)
- An owner (UID)
- A state (running, sleeping, zombie, stopped)

### Process States

| State | Symbol | Meaning |
|-------|--------|---------|
| Running | R | Actively using CPU |
| Sleeping | S | Waiting for I/O or event |
| Disk Sleep | D | Uninterruptible sleep |
| Stopped | T | Paused by signal |
| Zombie | Z | Finished but not reaped by parent |

---

## Viewing Processes

```bash
# Snapshot of running processes
ps

# All processes, full format
ps aux

# Process tree (shows parent-child relationships)
ps auxf
pstree

# Find processes by name
ps aux | grep nginx
pgrep nginx

# Get PID of a process by name
pidof nginx
```

### `top` — Real-time Process Viewer

```bash
top
```

Key shortcuts inside `top`:
- `q` — quit
- `k` — kill a process (enter PID)
- `r` — renice (change priority)
- `M` — sort by memory
- `P` — sort by CPU
- `1` — toggle per-CPU view

### `htop` — Enhanced top

```bash
sudo apt install htop
htop
```

More visual, supports mouse clicks, easier to use than `top`.

---

## Signals

Signals are messages sent to processes.

| Signal | Number | Action |
|--------|--------|--------|
| SIGHUP | 1 | Hangup / reload config |
| SIGINT | 2 | Interrupt (Ctrl+C) |
| SIGKILL | 9 | Force kill (cannot be ignored) |
| SIGTERM | 15 | Graceful termination (default) |
| SIGSTOP | 19 | Pause process |
| SIGCONT | 18 | Resume paused process |

```bash
# Send SIGTERM to PID 1234
kill 1234

# Force kill
kill -9 1234
kill -SIGKILL 1234

# Kill all processes named nginx
killall nginx

# Kill by pattern
pkill -f "python script.py"

# Send SIGHUP (reload config) to nginx
kill -1 $(pidof nginx)
```

---

## Foreground & Background Jobs

```bash
# Run a command in the background
long-running-command &

# List background jobs
jobs

# Bring a background job to foreground
fg %1          # %1 is job number from 'jobs'

# Send foreground job to background
Ctrl + Z       # suspend it first
bg %1          # then resume in background

# Disconnect a background job from the terminal (keep running after logout)
nohup long-command &

# Or use disown after backgrounding
long-command &
disown
```

---

## Process Priority (Nice)

Priority ranges from **-20** (highest) to **19** (lowest). Default is 0.

```bash
# Start a command with a specific nice value
nice -n 10 tar -czf backup.tar.gz /home/

# Change priority of a running process
renice -n 5 -p 1234

# Lower priority of all processes of a user
renice -n 10 -u alice
```

---

## systemd & Services

Modern Linux uses **systemd** as the init system. It manages services (daemons) via `systemctl`.

```bash
# Start a service
sudo systemctl start nginx

# Stop a service
sudo systemctl stop nginx

# Restart a service
sudo systemctl restart nginx

# Reload config without restarting
sudo systemctl reload nginx

# Enable to start on boot
sudo systemctl enable nginx

# Disable from starting on boot
sudo systemctl disable nginx

# Check status
systemctl status nginx

# View logs for a service
journalctl -u nginx

# Follow logs in real-time
journalctl -u nginx -f

# Logs since last boot
journalctl -u nginx -b
```

### Service States

```bash
# List all active services
systemctl list-units --type=service

# List all services (active + inactive)
systemctl list-units --type=service --all

# Check if a service is enabled
systemctl is-enabled nginx

# Check if a service is active
systemctl is-active nginx
```

---

## Scheduling with cron

`cron` runs commands on a schedule.

```bash
# Edit your crontab
crontab -e

# List your crontab
crontab -l

# Remove your crontab
crontab -r
```

### Crontab Syntax

```
MIN  HOUR  DOM  MON  DOW  COMMAND
*    *     *    *    *    /path/to/command

# ┌───────── minute (0-59)
# │ ┌─────── hour (0-23)
# │ │ ┌───── day of month (1-31)
# │ │ │ ┌─── month (1-12)
# │ │ │ │ ┌─ day of week (0-7, 0=Sun)
# │ │ │ │ │
# * * * * *  command
```

Examples:

```
# Every day at 2:30 AM
30 2 * * * /usr/bin/backup.sh

# Every hour
0 * * * * /usr/bin/check.sh

# Every Sunday at midnight
0 0 * * 0 /usr/bin/weekly.sh

# Every 5 minutes
*/5 * * * * /usr/bin/monitor.sh
```

---

**Navigation:** ← [05 — Package Management](05-package-management.md) | [Notes Index](README.md) | Next → [07 — Networking](07-networking.md)
**Exercise:** [Exercise 06](../02-exercises/06-process-management.md)
