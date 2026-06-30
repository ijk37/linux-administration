# 09 — System Monitoring & Logs

**Navigation:** ← [08-04 — Functions](08-04-shell-scripting-functions.md) | [Notes Index](README.md) | Next → [10 — SSH & Remote Access](10-ssh-and-remote-access.md)
**Exercise:** [Exercise 09](../02-exercises/09-system-monitoring-exe.md)

---

## Why Monitor a System?

When a server starts slowing down or crashing, you need to be able to answer: *why?*

System monitoring gives you the tools to answer questions like:
- Is the CPU maxed out? Which process is causing it?
- Is the machine running out of RAM?
- Is the disk almost full?
- What error messages appeared in the logs around the time of the problem?

Think of monitoring tools as the gauges on a car dashboard — they tell you the health of the system at a glance.

---

## CPU — How Busy is the Processor?

### `uptime` — Quick CPU load summary

```bash
uptime
```

**Example output:**
```
14:32:01 up 3 days, load average: 0.08, 0.42, 0.31
```

The three numbers at the end are the **load average** over the last 1 minute, 5 minutes, and 15 minutes.

**What does load average mean?**
- On a 1-core machine, load `1.0` = the CPU is 100% busy. Load `2.0` = jobs are waiting in queue.
- On a 4-core machine, load `4.0` = 100% busy. Load `8.0` = twice as many jobs as the CPU can handle.

A load average consistently **higher than your number of CPU cores** means the system is overloaded.

How many cores do you have?

```bash
nproc
```

Prints the number of CPU cores.

---

### `top` — Live CPU and process monitor

```bash
top
```

The top section shows system-wide stats. The bottom is a live list of processes.

```
top - 14:32:01 up 3 days
Tasks: 152 total,   1 running, 151 sleeping
%Cpu(s):  2.1 us,  0.5 sy,  0.0 ni, 97.4 id
MiB Mem :   7832.0 total,   4200.0 free,   2100.0 used
```

Reading the CPU line `%Cpu(s): 2.1 us, 0.5 sy, 97.4 id`:
- `us` (user) — CPU used by regular programs
- `sy` (system) — CPU used by the Linux kernel itself
- `id` (idle) — CPU doing nothing (97.4% idle = very relaxed system)

Press `q` to quit, `M` to sort by memory, `P` to sort by CPU.

---

## Memory — How Much RAM is in Use?

### `free -h` — Memory summary

```bash
free -h
```

**Example output:**
```
              total    used    free   shared  buff/cache  available
Mem:          7.7G    2.1G    3.2G    120M      2.4G       5.2G
Swap:         2.0G      0B    2.0G
```

The columns:
- `total` — how much RAM the machine has
- `used` — currently used by programs
- `free` — completely unused
- `buff/cache` — used by the kernel for caching (can be freed when needed)
- **`available`** — the most useful number: how much RAM is actually available for new programs (includes reclaimable cache)

The `available` column is what matters. If it's close to 0, your system is running out of memory.

**Swap** is disk space used as emergency RAM when real RAM is full. If swap is heavily used, the system will be very slow (disk is much slower than RAM).

---

## Disk — Is the Drive Getting Full?

### `df -h` — How full are the disks?

```bash
df -h
```

`df` stands for "Disk Free". The `-h` flag makes the sizes human-readable.

**Example output:**
```
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        50G   18G   30G  38% /
/dev/sda2       200G   85G  115G  43% /home
tmpfs           3.8G     0  3.8G   0% /dev/shm
```

The `Use%` column is the one to watch. When it hits 90%+, it's time to clean up. At 100%, the system may start failing in unpredictable ways.

---

### `du -sh` — How much space does a folder use?

```bash
du -sh /var/log/
```

`du` stands for "Disk Usage". `-s` means "summarize" (one total), `-h` means human-readable.

Find the top 5 largest directories inside `/var`:

```bash
du -sh /var/*/ 2>/dev/null | sort -rh | head -5
```

Breaking this down:
- `du -sh /var/*/` — get the size of each subdirectory in `/var/`
- `2>/dev/null` — hide error messages (e.g., "permission denied")
- `sort -rh` — sort in reverse (`-r`) human-readable order (`-h`) — largest first
- `head -5` — show only the top 5 results

---

## System Logs

When something goes wrong, the first place to look is the logs. Linux writes system events, errors, and application messages to log files.

### Where are the logs?

All logs are under `/var/log/`:

| File | What it records |
|------|----------------|
| `/var/log/syslog` | General system messages (Ubuntu/Debian) |
| `/var/log/messages` | General messages (RHEL/CentOS) |
| `/var/log/auth.log` | Login attempts, sudo usage, SSH logins |
| `/var/log/kern.log` | Kernel messages (hardware issues) |
| `/var/log/dmesg` | Boot messages and hardware detection |
| `/var/log/apt/history.log` | Package install/remove history |
| `/var/log/nginx/access.log` | Every web request served by nginx |
| `/var/log/nginx/error.log` | Nginx errors |

### Reading logs with `tail` and `grep`

```bash
sudo tail -50 /var/log/syslog
```

Shows the last 50 lines of the syslog. This is where you start when something just went wrong — the most recent events are at the bottom.

```bash
sudo tail -f /var/log/syslog
```

`-f` means "follow" — the terminal keeps updating as new lines are added to the log in real-time. Press `Ctrl + C` to stop. Very useful when you're trying to catch an error as it happens.

```bash
sudo grep -i "error" /var/log/syslog | tail -20
```

Searches the syslog for lines containing "error" (case-insensitive with `-i`) and shows the last 20 matches.

---

## journalctl — The Modern Log Tool

Modern Linux uses **systemd** to manage logs. The `journalctl` command reads logs stored by systemd.

### View all logs

```bash
journalctl
```

This shows everything — usually too much at once. Scroll with arrow keys, press `G` to jump to the end, press `q` to quit.

### Follow logs in real-time

```bash
journalctl -f
```

Like `tail -f` but for all system logs.

### View logs for a specific service

```bash
journalctl -u nginx
```

`-u` means "unit" — shows logs only for the nginx service. Very useful for debugging a specific service.

```bash
journalctl -u nginx -f
```

Follow nginx logs in real-time.

### Filter by time

```bash
journalctl --since "1 hour ago"
```

Shows only logs from the last hour.

```bash
journalctl --since "2024-06-20 08:00:00" --until "2024-06-20 09:00:00"
```

Shows logs between two specific times. Very useful when investigating an incident — you know roughly when it happened, so you narrow the logs to that window.

### Filter by priority (severity)

```bash
journalctl -p err
```

Shows only error-level messages and worse. The priorities from worst to best:

| Level | Meaning |
|-------|---------|
| `emerg` | System is unusable |
| `alert` | Must fix immediately |
| `crit` | Critical condition |
| `err` | Error |
| `warning` | Warning |
| `notice` | Normal but significant |
| `info` | Informational |
| `debug` | Debug messages (very verbose) |

### Logs from the last boot

```bash
journalctl -b
```

`-b` means "this boot". Shows logs since the last time the system started. Add `-1` for the previous boot:

```bash
journalctl -b -1
```

### Check how much disk space the journal uses

```bash
journalctl --disk-usage
```

To clean up old logs:

```bash
sudo journalctl --vacuum-size=500M   # keep only 500MB of logs
sudo journalctl --vacuum-time=7d     # keep only last 7 days of logs
```

---

## `dmesg` — Kernel and Hardware Messages

```bash
dmesg
```

Shows messages from the kernel — especially useful after connecting hardware or after a crash.

```bash
dmesg | grep -i "error\|fail"
```

Searches kernel messages for errors and failures.

```bash
dmesg -T
```

`-T` adds human-readable timestamps to each line (otherwise they show seconds-since-boot, which is hard to read).

---

## Log Rotation — Preventing Logs From Filling Your Disk

Logs grow constantly. If left unchecked, they can fill your disk. **logrotate** automatically archives and compresses old logs.

Configuration is in `/etc/logrotate.conf` and service-specific files in `/etc/logrotate.d/`.

```bash
cat /etc/logrotate.d/nginx
```

A typical config looks like:

```
/var/log/nginx/*.log {
    daily          ← rotate every day
    rotate 7       ← keep 7 old copies
    compress       ← compress old logs with gzip
    missingok      ← don't error if log file is missing
    notifempty     ← don't rotate if the log is empty
}
```

You don't usually need to change this — the defaults handle it well. But if a service's logs are growing too fast, this is where you'd tighten the rotation policy.

---

**Navigation:** ← [08-04 — Functions](08-04-shell-scripting-functions.md) | [Notes Index](README.md) | Next → [10 — SSH & Remote Access](10-ssh-and-remote-access.md)
**Exercise:** [Exercise 09](../02-exercises/09-system-monitoring-exe.md)
