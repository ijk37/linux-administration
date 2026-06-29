# Exercise 06 — Process Management

**Navigation:** ← [Exercise 05](05-package-management-exe.md) | [Exercises Index](README.md) | Next → [Exercise 07](07-networking-exe.md)
**Note:** [06 — Process Management](../01-notes/06-process-management.md)

---

## Before You Start

Read [Note 06](../01-notes/06-process-management.md) first.

Every running program on your system is a process. In this exercise you'll learn to see them, control them, and understand how services work.

---

## Exercise 6.1 — Explore Running Processes

**Step 1:** See processes in your current terminal session only:

```bash
ps
```

Expected output:
```
  PID TTY          TIME CMD
 1234 pts/0    00:00:00 bash
 5678 pts/0    00:00:00 ps
```

Only two things: your bash shell and the `ps` command itself.

**Step 2:** See ALL processes on the system:

```bash
ps aux | head -20
```

Now you'll see many processes. The `| head -20` part shows only the first 20 lines so your terminal isn't flooded.

Identify these columns: `USER`, `PID`, `%CPU`, `%MEM`, `COMMAND`.

**Step 3:** Find the PID of your bash shell:

```bash
echo $$
```

`$$` is a special variable that holds the PID of the current shell process.

**Step 4:** Find all bash processes on the system:

```bash
ps aux | grep bash
```

You'll see at least one line (your own bash). If other users are logged in, you'll see theirs too. You'll also see the `grep bash` command itself in the output — that's normal, it briefly exists while you search.

**Step 5:** Count how many processes are running right now:

```bash
ps aux | wc -l
```

Subtract 1 for the header line. You might be surprised how many processes are running even on an idle system.

---

## Exercise 6.2 — Use top for a Live View

**Step 1:** Open top:

```bash
top
```

Watch the display for 10 seconds. Notice the numbers changing — CPU and memory usage fluctuate in real-time.

**Step 2:** While in top, press these keys and observe what changes:

- Press `M` — sorts processes by memory usage (highest at top)
- Press `P` — sorts by CPU usage (highest at top)
- Press `1` — toggles between overall CPU% and per-core breakdown

**Step 3:** Press `q` to quit.

**Step 4:** Get a one-shot snapshot from top without the interactive interface:

```bash
top -bn1 | head -15
```

`-b` means "batch mode" (non-interactive), `-n1` means "one iteration". This is useful in scripts.

**Reflect:** Which process is using the most CPU on your system? Which is using the most memory?

---

## Exercise 6.3 — Background and Foreground Jobs

This exercise shows you how to manage multiple tasks in one terminal.

**Step 1:** Start a long-running command in the background:

```bash
sleep 120 &
```

`sleep 120` does nothing for 120 seconds. The `&` sends it to the background so your prompt returns immediately.

Expected output:
```
[1] 7890
```

`[1]` is the job number, `7890` is the PID.

**Step 2:** Start a second background job:

```bash
sleep 90 &
```

**Step 3:** List all your background jobs:

```bash
jobs
```

Expected output:
```
[1]   Running    sleep 120 &
[2]-  Running    sleep 90 &
```

**Step 4:** Bring job #1 to the foreground:

```bash
fg %1
```

Your terminal now shows the sleep command is running in the foreground. There's no visible activity, but the prompt is gone — sleep is running.

**Step 5:** Suspend the foreground job:

Press `Ctrl + Z`

Expected output:
```
[1]+  Stopped    sleep 120
```

`Ctrl + Z` pauses the process (it's not killed — just paused).

**Step 6:** Send it back to the background:

```bash
bg %1
```

It resumes running in the background.

**Step 7:** Kill job #2:

```bash
kill %2
```

**Step 8:** Verify both are cleaned up:

```bash
jobs
```

You should see job #1 still running and job #2 is gone (or shows `Terminated`).

**Step 9:** Kill job #1:

```bash
kill %1
jobs
```

---

## Exercise 6.4 — Sending Signals with kill

**Step 1:** Start a background sleep process and capture its PID:

```bash
sleep 300 &
MY_PID=$!
echo "The PID is: $MY_PID"
```

`$!` is a special variable that holds the PID of the last background command.

**Step 2:** Confirm it's running:

```bash
ps -p $MY_PID
```

`-p` means "show the process with this specific PID".

Expected output:
```
  PID TTY          TIME CMD
 7890 pts/0    00:00:00 sleep
```

**Step 3:** Send the graceful termination signal (SIGTERM):

```bash
kill $MY_PID
```

`kill` without a flag number sends SIGTERM — the polite "please shut down" signal.

**Step 4:** Verify it's gone:

```bash
ps -p $MY_PID
```

Expected output:
```
  PID TTY          TIME CMD
(no output — process is gone)
```

**Step 5:** Practice with a force kill:

```bash
sleep 300 &
MY_PID=$!
kill -9 $MY_PID
ps -p $MY_PID
```

`-9` is SIGKILL — the process is immediately terminated by the kernel. No clean up, no grace period. Use this only when a process is frozen and not responding to normal `kill`.

---

## Exercise 6.5 — Systemd Services

**Step 1:** See all currently running services:

```bash
systemctl list-units --type=service --state=running
```

You'll see a list of every active service on the system.

**Step 2:** Check the status of the SSH daemon:

```bash
systemctl status ssh
```

Expected output:
```
● ssh.service - OpenBSD Secure Shell server
     Loaded: loaded (/lib/systemd/system/ssh.service; enabled; vendor preset: enabled)
     Active: active (running) since Thu 2024-06-20 10:00:00 UTC; 4h 32min ago
   Main PID: 1234 (sshd)
```

Read the output:
- `active (running)` — currently working
- `enabled` — will start automatically on boot
- `Main PID: 1234` — the PID of the ssh daemon

**Step 3:** Check the cron service (the scheduler):

```bash
systemctl status cron
```

> **Note:** On some systems it's called `crond` instead of `cron`. If `cron` gives an error, try `systemctl status crond`.

**Step 4:** Install nginx and manage it with systemctl:

```bash
sudo apt install -y nginx
```

**Step 5:** Check its status after installation:

```bash
systemctl status nginx
```

It should already be running (apt starts it automatically after install).

**Step 6:** Stop it:

```bash
sudo systemctl stop nginx
systemctl status nginx
```

Notice `Active:` changes from `active (running)` to `inactive (dead)`.

**Step 7:** Start it again:

```bash
sudo systemctl start nginx
systemctl status nginx
```

**Step 8:** Check if it's set to start on boot:

```bash
systemctl is-enabled nginx
```

Expected output:
```
enabled
```

**Step 9:** Disable it from starting on boot (you can leave it running now, just won't start on reboot):

```bash
sudo systemctl disable nginx
systemctl is-enabled nginx
```

Expected output:
```
disabled
```

**Step 10:** Re-enable it:

```bash
sudo systemctl enable nginx
```

---

## Exercise 6.6 — Schedule a Task with Cron

**Step 1:** View your current crontab:

```bash
crontab -l
```

If you have no scheduled jobs, you'll see:
```
no crontab for jahid
```

**Step 2:** Add a job that writes the current time to a file every minute:

```bash
(crontab -l 2>/dev/null; echo "* * * * * date >> /tmp/cron-test.log") | crontab -
```

> **What does this do?** It reads the existing crontab (if any), adds a new line, and writes the whole thing back. The new line `* * * * * date >> /tmp/cron-test.log` runs `date` every minute and appends the output to a log file.

**Step 3:** Verify the cron job was added:

```bash
crontab -l
```

Expected output:
```
* * * * * date >> /tmp/cron-test.log
```

**Step 4:** Wait 2 minutes, then check the log:

```bash
sleep 65
cat /tmp/cron-test.log
```

Expected output (new lines are added each minute):
```
Thu Jun 20 14:33:01 UTC 2024
Thu Jun 20 14:34:01 UTC 2024
```

**Step 5:** Remove the cron job to stop it:

```bash
crontab -r
crontab -l
```

**Step 6:** Clean up the test log:

```bash
rm -f /tmp/cron-test.log
```

---

## Challenge — Process Wrangling

1. Start **three** background `sleep 500` processes
2. List them with `jobs` and note their job numbers
3. Get the PID of the second one using `jobs -p` (try `jobs -p` — it prints PIDs)
4. Kill **only** the second one by its PID
5. Kill the remaining two using `pkill sleep`
6. Verify all three are gone with `jobs`

Then write a one-line cron entry that would run a script `~/backup.sh` at 3:00 AM every Sunday.

> **Answer for the cron line:** `0 3 * * 0 ~/backup.sh`

---

**Navigation:** ← [Exercise 05](05-package-management-exe.md) | [Exercises Index](README.md) | Next → [Exercise 07](07-networking-exe.md)
**Note:** [06 — Process Management](../01-notes/06-process-management.md)
