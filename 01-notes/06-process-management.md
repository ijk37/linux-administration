# 06 — Process Management

**Navigation:** ← [05 — Package Management](05-package-management.md) | [Notes Index](README.md) | Next → [07 — Networking](07-networking.md)
**Exercise:** [Exercise 06](../02-exercises/06-process-management-exe.md)

---

## What is a Process?

Every time you run a program — open a browser, start a web server, run a script — Linux creates a **process**. A process is just a running program. The system can run hundreds or thousands of processes at the same time.

Each process is given:
- A unique **PID** (Process ID) — a number that identifies it
- A **PPID** (Parent Process ID) — the PID of the process that started it
- An owner (the user who started it)
- A current state (running, sleeping, stopped, etc.)

When you open a terminal and run `ls`, Linux creates a new process with a PID, runs the command, and then the process ends. Long-running programs like web servers are processes that keep running until you stop them.

---

## Viewing Processes

### `ps` — Snapshot of running processes

```bash
ps
```

**What it does:** Shows processes running in your *current terminal session*.

**Example output:**
```
  PID TTY          TIME CMD
 1234 pts/0    00:00:00 bash
 5678 pts/0    00:00:00 ps
```

This only shows two things: your bash shell and the `ps` command itself. Not very useful on its own.

```bash
ps aux
```

This is the version you'll actually use. The flags mean:
- `a` — show processes from **all users** (not just yours)
- `u` — show in **user-oriented format** (includes username, CPU%, memory%)
- `x` — include processes with **no terminal** (like background services)

**Example output:**
```
USER       PID  %CPU  %MEM    VSZ   RSS TTY   STAT  START   TIME COMMAND
root         1   0.0   0.1  22520  9876 ?     Ss   Jun19   0:12 /sbin/init
jahid     1234   0.0   0.1  14780  4120 pts/0 Ss   10:00   0:00 bash
nginx     2345   0.0   0.2  55232  8192 ?     S    10:05   0:01 nginx: worker
```

Key columns:
- `USER` — who owns the process
- `PID` — the process ID (you need this to kill a process)
- `%CPU` — how much CPU it's using right now
- `%MEM` — how much RAM it's using
- `COMMAND` — what is actually running
- `STAT` — process state (`S` = sleeping, `R` = running, `Z` = zombie)

---

### Finding a specific process

```bash
ps aux | grep nginx
```

Pipes (`|`) the output of `ps aux` into `grep`, which filters it to show only lines containing "nginx".

```bash
pgrep nginx
```

`pgrep` is a quicker way to get the PID of a process by name. It just prints the PID number(s).

**Example output:**
```
2345
2346
```

---

### `top` — Real-time process viewer

```bash
top
```

**What it does:** Shows a live, updating view of what's consuming your CPU and RAM. New data refreshes every few seconds.

```
top - 14:32:01 up 3 days, load average: 0.12, 0.08, 0.06
Tasks: 152 total, 1 running, 151 sleeping
%Cpu(s): 2.1 us, 0.5 sy, 97.4 id
MiB Mem:   7832.0 total,  4200.0 free,  2100.0 used
...
  PID USER     %CPU  %MEM  COMMAND
 2345 nginx     1.2   0.2  nginx
 1234 jahid     0.8   0.1  bash
```

**Useful keyboard shortcuts inside top:**
- `q` — quit top
- `k` — kill a process (it will ask for the PID)
- `M` — sort by memory usage
- `P` — sort by CPU usage
- `1` — show individual CPU cores (if you have multiple)

`htop` is a more visual, beginner-friendly version of top. Install it with `sudo apt install htop`.

---

## Stopping a Process — Signals

You communicate with processes by sending them **signals**. Think of signals as messages: "please stop", "reload your config", "die immediately".

The most important signals:

| Signal | Number | What it does |
|--------|--------|-------------|
| SIGTERM | 15 | "Please shut down gracefully." The process can finish what it's doing. This is the default. |
| SIGKILL | 9 | "Die immediately." The kernel kills the process. The process cannot ignore this. |
| SIGHUP | 1 | "Reload your configuration." Used for services like nginx. |
| SIGINT | 2 | Same as pressing `Ctrl + C` in the terminal. |

### `kill` — Send a signal to a process by PID

```bash
kill 2345
```

Sends SIGTERM (graceful shutdown) to PID 2345. This is the polite way to stop something.

```bash
kill -9 2345
```

Sends SIGKILL (force kill) to PID 2345. Use this only when the graceful shutdown doesn't work — the process is frozen or not responding.

### `killall` — Kill all processes with a given name

```bash
killall nginx
```

Sends SIGTERM to every process named `nginx`. Useful when a program has multiple worker processes.

### `pkill` — Kill by pattern

```bash
pkill -f "python my_script.py"
```

`-f` matches the full command line. This lets you be specific when multiple Python scripts are running.

---

## Foreground and Background Jobs

Normally when you run a command, your terminal waits for it to finish before giving you the prompt back. That command is running in the **foreground**.

### Running in the background with `&`

```bash
sleep 60 &
```

The `&` at the end sends the command to the **background**. Your prompt comes back immediately while `sleep 60` keeps running.

**Output:**
```
[1] 5678
```

`[1]` is the job number and `5678` is the PID.

### Listing background jobs

```bash
jobs
```

**Example output:**
```
[1]+  Running    sleep 60 &
```

### Bringing a background job to the foreground

```bash
fg %1
```

`%1` refers to job number 1 (from the `jobs` list). The process is now in the foreground again.

### Suspending and resuming

Press `Ctrl + Z` while a foreground process is running to **suspend** (pause) it. Then:

```bash
bg %1
```

Resumes the suspended job in the background.

### Running after logout with `nohup`

If you start a background job and then close your terminal, the job is killed. `nohup` (no hangup) prevents this:

```bash
nohup long-running-script.sh &
```

The output goes to a file called `nohup.out` in the current directory.

---

## systemd — Managing Services

Modern Linux uses **systemd** to manage long-running services (web servers, databases, SSH, etc.). These are called **daemons** — programs that run in the background.

You control services with the `systemctl` command.

### Checking the status of a service

```bash
systemctl status nginx
```

**Example output:**
```
● nginx.service - A high performance web server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled)
     Active: active (running) since Thu 2024-06-20 10:00:00 UTC; 4h ago
    Process: 1234 ExecStartPre=/usr/sbin/nginx -t
   Main PID: 1235 (nginx)
```

Key things to read:
- `Active: active (running)` — the service is running right now
- `enabled` — means it will start automatically when the system boots
- `Main PID: 1235` — the process ID of the main nginx process

### Starting and stopping a service

```bash
sudo systemctl start nginx     # start it now
sudo systemctl stop nginx      # stop it now
sudo systemctl restart nginx   # stop then start (picks up config changes)
sudo systemctl reload nginx    # reload config without stopping (smoother)
```

`restart` vs `reload`: `restart` fully stops and starts the service (briefly interrupts connections). `reload` tells the service to re-read its config file without stopping — use this when possible.

### Enable/disable a service on boot

```bash
sudo systemctl enable nginx    # start automatically on every boot
sudo systemctl disable nginx   # do NOT start automatically on boot
```

`enable` and `disable` do not start/stop the service right now — they only affect what happens when the machine boots.

### Viewing service logs

```bash
journalctl -u nginx
```

`journalctl` is the tool for reading systemd logs. `-u nginx` means "show logs for the nginx unit (service)".

```bash
journalctl -u nginx -f
```

`-f` means "follow" — shows new log lines as they appear in real-time, like `tail -f`.

```bash
journalctl -u nginx --since "1 hour ago"
```

Shows only the logs from the last hour.

---

## Process Priority — `nice` and `renice`

When many processes are competing for the CPU, you can give hints about which should get priority. This is called the **nice value**.

- Range: **-20** (highest priority) to **19** (lowest priority)
- Default: **0**
- Only root can set negative values (give a process *more* priority than normal)

```bash
nice -n 10 tar -czf backup.tar.gz /home/
```

Starts the `tar` command with a nice value of 10 (lower priority). Useful for resource-intensive tasks like backups that shouldn't slow down other things.

```bash
renice -n 5 -p 1234
```

Changes the priority of an already-running process with PID 1234.

---

## Scheduling Tasks with `cron`

`cron` lets you run commands on a schedule — like a task scheduler. You define jobs in a file called a **crontab**.

```bash
crontab -e
```

Opens your crontab file in a text editor. Each line is one scheduled job.

### Crontab syntax

```
MINUTE  HOUR  DAY_OF_MONTH  MONTH  DAY_OF_WEEK  COMMAND
```

Each field can be:
- A number: `5` means "at minute 5"
- `*` (asterisk): means "every" — `*` in the HOUR column means "every hour"
- `*/5`: means "every 5" (e.g., every 5 minutes)
- `1,3,5`: a list — means "at 1, 3, and 5"

**Examples:**

```
# Run at 2:30 AM every day
30 2 * * * /home/jahid/backup.sh

# Run every hour (at minute 0)
0 * * * * /home/jahid/check.sh

# Run every 5 minutes
*/5 * * * * /home/jahid/monitor.sh

# Run every Sunday at midnight
0 0 * * 0 /home/jahid/weekly-report.sh
```

View your current crontab:

```bash
crontab -l
```

Remove your crontab (careful — this deletes all your scheduled jobs):

```bash
crontab -r
```

---

**Navigation:** ← [05 — Package Management](05-package-management.md) | [Notes Index](README.md) | Next → [07 — Networking](07-networking.md)
**Exercise:** [Exercise 06](../02-exercises/06-process-management-exe.md)
