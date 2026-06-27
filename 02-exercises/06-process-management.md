# Exercise 06 — Process Management

**Navigation:** ← [Exercise 05](05-package-management.md) | [Exercises Index](README.md) | Next → [Exercise 07](07-networking.md)
**Note:** [06 — Process Management](../01-notes/06-process-management.md)

---

## Objectives

- View and understand process output
- Send signals to processes
- Manage background jobs
- Work with systemd services
- Schedule tasks with cron

---

## Exercise 6.1 — Viewing Processes

```bash
# 1. Show all running processes
ps aux | head -20

# 2. How many processes are running?
ps aux | wc -l

# 3. Show the process tree
ps auxf | head -30

# 4. Find all bash processes
ps aux | grep bash

# 5. Get the PID of your current shell
echo $$

# 6. Find the PID of the sshd daemon
pgrep sshd || echo "sshd not running"
```

---

## Exercise 6.2 — top / htop

```bash
# 1. Open top
top
# Inside top:
# - Press M to sort by memory
# - Press P to sort by CPU
# - Press 1 to see per-CPU usage
# - Press q to quit

# 2. Get a single snapshot (no interactive mode)
top -bn1 | head -20

# 3. Show top 5 CPU-consuming processes
ps aux --sort=-%cpu | head -6

# 4. Show top 5 memory-consuming processes
ps aux --sort=-%mem | head -6
```

---

## Exercise 6.3 — Background Jobs

```bash
# 1. Start a long-running command in the background
sleep 300 &

# 2. List background jobs
jobs

# 3. Start another background job
sleep 200 &

# 4. List jobs again
jobs

# 5. Bring job #1 to foreground
fg %1

# 6. Suspend it (Ctrl+Z)
# (Press Ctrl+Z here)

# 7. Send it back to background
bg %1

# 8. Kill job #2
kill %2

# 9. Kill all sleep processes
pkill sleep

# 10. Confirm they're gone
jobs
```

---

## Exercise 6.4 — Signals

```bash
# 1. Start a sleep process
sleep 1000 &
PID=$!
echo "PID: $PID"

# 2. View it
ps -p $PID

# 3. Send SIGTERM (graceful)
kill $PID

# 4. Start another one and force kill it
sleep 1000 &
PID=$!
kill -9 $PID

# 5. Verify it's gone
ps -p $PID && echo "Still running" || echo "Killed"

# 6. Run a command that ignores SIGTERM and kill it
# (dd makes a good "hard to stop" process for testing)
dd if=/dev/zero of=/dev/null &
PID=$!
sleep 2
kill $PID
sleep 1
ps -p $PID 2>/dev/null || echo "dd stopped"
```

---

## Exercise 6.5 — systemd Services

```bash
# 1. List all running services
systemctl list-units --type=service --state=running

# 2. Check the status of cron (or crond on RHEL)
systemctl status cron 2>/dev/null || systemctl status crond

# 3. Check SSH daemon status
systemctl status ssh 2>/dev/null || systemctl status sshd

# 4. View recent logs for a service
journalctl -u ssh -n 20 2>/dev/null || journalctl -u sshd -n 20

# 5. Check if nginx is installed and start it if so
which nginx && sudo systemctl start nginx && systemctl status nginx || echo "nginx not installed"
```

---

## Exercise 6.6 — Cron

```bash
# 1. View your current crontab (likely empty)
crontab -l 2>/dev/null || echo "No crontab for this user"

# 2. Create a cron job that writes the date to a file every minute
(crontab -l 2>/dev/null; echo "* * * * * date >> /tmp/cron-test.log") | crontab -

# 3. Verify it was added
crontab -l

# 4. Wait 2 minutes, then check the log
sleep 65
cat /tmp/cron-test.log

# 5. Remove the cron job
crontab -r

# 6. Confirm it's gone
crontab -l 2>/dev/null || echo "Crontab cleared"

# 7. Clean up
rm -f /tmp/cron-test.log
```

---

## Challenge

Write a shell command (one-liner or short script) that:
1. Starts 3 `sleep 500` processes in the background
2. Lists all their PIDs using `pgrep`
3. Kills all of them with a single `pkill` command
4. Verifies they are all gone

---

**Navigation:** ← [Exercise 05](05-package-management.md) | [Exercises Index](README.md) | Next → [Exercise 07](07-networking.md)
**Note:** [06 — Process Management](../01-notes/06-process-management.md)
