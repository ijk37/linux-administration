# Exercise 09 — System Monitoring & Logs

**Navigation:** ← [Exercise 08-04](08-04-shell-scripting-functions-exe.md) | [Exercises Index](README.md) | Next → [Exercise 10](10-ssh-and-remote-access-exe.md)
**Note:** [09 — System Monitoring & Logs](../01-notes/09-system-monitoring.md)

---

## Before You Start

Read [Note 09](../01-notes/09-system-monitoring.md) first.

Monitoring is one of the core daily tasks of a Linux administrator. By the end of this exercise you'll be able to quickly assess a system's health and read log files to diagnose problems.

---

## Exercise 9.1 — Check CPU Health

**Step 1:** Check the load average:

```bash
uptime
```

Expected output:
```
14:32:01 up 3 days, 4:12, 1 user, load average: 0.08, 0.12, 0.10
```

The three load average numbers are for the last 1, 5, and 15 minutes. Find out how many CPU cores you have:

```bash
nproc
```

**Is your system overloaded?** If load average > number of cores, the CPU is overloaded. If load average is much lower than your core count (like 0.08 on a 4-core machine), the system is very relaxed.

Calculate the percentage: `load / cores × 100`

**Step 2:** See which processes are using the most CPU:

```bash
ps aux --sort=-%cpu | head -10
```

`--sort=-%cpu` sorts by CPU usage, highest first. The `-` means descending order.

**Step 3:** Open top and observe:

```bash
top
```

Look at `%Cpu(s)`. The `id` (idle) percentage tells you how much CPU is unused. 90%+ idle = very little load. Press `q` to quit.

---

## Exercise 9.2 — Check Memory Usage

**Step 1:** View the memory summary:

```bash
free -h
```

Expected output:
```
              total    used    free   shared  buff/cache  available
Mem:          7.7G    2.1G    3.2G    120M      2.4G       5.2G
Swap:         2.0G      0B    2.0G
```

**Important:** The `available` column (5.2G in this example) is what matters — not `free`. `available` includes memory that's currently used for caching but can be instantly freed for a new program.

**Step 2:** Calculate memory usage percentage:

```bash
free | awk 'NR==2{printf "Used: %.0f%% (%s of %s)\n", $3/$2*100, $3, $2}'
```

> **What is awk doing?** `NR==2` selects the second line (the Mem line). `$3/$2*100` divides used by total and multiplies by 100 to get a percentage. `printf` formats the output.

**Step 3:** Check swap usage:

```bash
free -h | grep Swap
```

If the `used` column under Swap is significant (more than a few MB), your system may be low on RAM and using disk as backup — this causes slowdowns.

**Step 4:** Find the top memory consumers:

```bash
ps aux --sort=-%mem | head -10
```

---

## Exercise 9.3 — Check Disk Space

**Step 1:** Check disk space on all filesystems:

```bash
df -h
```

Scan the `Use%` column. Anything above 80% deserves attention. Above 95% is urgent.

**Step 2:** Find the largest directories under /var (a common place for disk growth):

```bash
sudo du -sh /var/*/ 2>/dev/null | sort -rh | head -10
```

Breaking this down:
- `du -sh /var/*/` — get the size of each subdirectory in `/var/`
- `2>/dev/null` — hide "permission denied" errors
- `sort -rh` — sort in reverse (`-r`) human-readable order (`-h`) — largest first
- `head -10` — show only the top 10

**Step 3:** Find the 5 largest files in /var/log:

```bash
sudo find /var/log -type f -exec du -sh {} \; 2>/dev/null | sort -rh | head -5
```

`-type f` restricts to files only (not directories). `-exec du -sh {} \;` runs `du -sh` on each found file.

**Step 4:** Check the size of your practice folder:

```bash
du -sh ~/linux-practice/
```

---

## Exercise 9.4 — Read System Log Files

**Step 1:** View the last 20 lines of the system log:

```bash
sudo tail -20 /var/log/syslog 2>/dev/null || sudo tail -20 /var/log/messages
```

> **Why two commands?** Ubuntu/Debian use `/var/log/syslog`. RHEL/CentOS use `/var/log/messages`. The `||` means "if the first fails, try the second".

Look for timestamps, service names, and message text. Most lines are normal status messages.

**Step 2:** Follow the log in real-time:

```bash
sudo tail -f /var/log/syslog &
TAIL_PID=$!
```

The `&` puts it in the background. Now run a command that will generate a log entry:

```bash
sudo systemctl restart nginx 2>/dev/null || echo "nginx not installed"
sleep 3
```

You should see new log lines appear. Then stop the tail:

```bash
kill $TAIL_PID 2>/dev/null
echo ""
```

**Step 3:** Look for errors in the auth log:

```bash
sudo grep -i "failed\|error\|invalid" /var/log/auth.log 2>/dev/null | tail -10
```

This shows failed login attempts and authentication errors — important for security monitoring.

---

## Exercise 9.5 — Use journalctl

**Step 1:** View logs from the last 30 minutes:

```bash
journalctl --since "30 minutes ago" --no-pager | tail -20
```

`--no-pager` prints directly to the terminal instead of opening an interactive viewer. `| tail -20` shows only the last 20 lines.

**Step 2:** View only error-level messages:

```bash
journalctl -p err --since "1 hour ago" --no-pager
```

On a healthy system, this should show nothing (or very few lines). Many errors here means something needs attention.

**Step 3:** View logs for a specific service:

```bash
journalctl -u nginx --no-pager | tail -20
```

When nginx was started and stopped in the previous exercise, those events should appear here.

**Step 4:** View logs from the current boot:

```bash
journalctl -b --no-pager | head -30
```

Shows everything that happened since the last reboot. The very first lines are from the kernel as it starts up.

**Step 5:** Search for a keyword in the journal:

```bash
journalctl --no-pager | grep -i "started nginx" | tail -5
```

**Step 6:** Check how much disk space the journal is using:

```bash
journalctl --disk-usage
```

Expected output:
```
Archived and active journals take up 64.0M in the file system.
```

---

## Exercise 9.6 — Build a Health Check Script

Put everything together into a script that gives you a quick system health overview.

**Step 1:** Create the script:

```bash
nano ~/linux-practice/scripts/health-check.sh
```

Content:

```bash
#!/bin/bash

# health-check.sh — Quick system health overview

WARN_MEM=80      # warn if memory is above 80% used
WARN_DISK=85     # warn if any disk is above 85% used

# ── Helper functions ──────────────────────────────────────────────────────────
section() {
    echo ""
    echo "━━━ $1 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

ok()   { echo "  [OK]   $*"; }
warn() { echo "  [WARN] $*"; }

# ── System ────────────────────────────────────────────────────────────────────
section "System"
echo "  Host:   $(hostname)"
echo "  OS:     $(grep PRETTY_NAME /etc/os-release | cut -d= -f2 | tr -d '"')"
echo "  Kernel: $(uname -r)"
echo "  Uptime: $(uptime -p)"

# ── CPU ───────────────────────────────────────────────────────────────────────
section "CPU"
LOAD=$(cut -d" " -f1 /proc/loadavg)
CORES=$(nproc)
PCT=$(echo "$LOAD $CORES" | awk '{printf "%.0f", ($1/$2)*100}')
echo "  Cores:       $CORES"
echo "  Load (1m):   $LOAD"
echo "  Load %:      ${PCT}%"
[ "$PCT" -ge 90 ] && warn "CPU load is very high!" || ok "CPU load is normal"

# ── Memory ────────────────────────────────────────────────────────────────────
section "Memory"
free -h | awk 'NR==2{printf "  Total: %s  |  Used: %s  |  Available: %s\n", $2, $3, $7}'
MEM_PCT=$(free | awk 'NR==2{printf "%.0f", $3/$2*100}')
[ "$MEM_PCT" -ge "$WARN_MEM" ] && warn "Memory is ${MEM_PCT}% used!" || ok "Memory is ${MEM_PCT}% used"

# ── Disk ─────────────────────────────────────────────────────────────────────
section "Disk"
while IFS= read -r line; do
    PCT=$(echo "$line" | awk '{print $5}' | tr -d '%')
    MP=$(echo "$line"  | awk '{print $6}')
    [ "$PCT" -ge "$WARN_DISK" ] && warn "$MP is ${PCT}% full!" || ok "$MP is ${PCT}% full"
done < <(df -h | grep -v tmpfs | grep -v "^Filesystem")

# ── Services ─────────────────────────────────────────────────────────────────
section "Services"
for SVC in ssh cron nginx; do
    if systemctl is-active --quiet "$SVC" 2>/dev/null; then
        ok "$SVC is running"
    else
        warn "$SVC is NOT running"
    fi
done

echo ""
echo "Report generated: $(date)"
```

```bash
chmod +x ~/linux-practice/scripts/health-check.sh
```

**Step 2:** Run it:

```bash
~/linux-practice/scripts/health-check.sh
```

**Step 3:** Save the output to a file:

```bash
~/linux-practice/scripts/health-check.sh > ~/linux-practice/logs/health-$(date +%Y%m%d).log
cat ~/linux-practice/logs/health-$(date +%Y%m%d).log
```

---

## Challenge

Modify your `health-check.sh` to:

1. Accept a `--quiet` flag: when passed, only print warnings and errors (not the `[OK]` lines)
2. Check free disk space and warn if any filesystem is above **90%** (update the `WARN_DISK` variable)
3. Add a check for the last login — print who last logged in using the `last` command

**Hint for the `--quiet` flag:**
```bash
QUIET=false
[ "${1:-}" = "--quiet" ] && QUIET=true

# Then replace ok() with:
ok() {
    $QUIET || echo "  [OK]   $*"
}
```

---

**Navigation:** ← [Exercise 08-04](08-04-shell-scripting-functions-exe.md) | [Exercises Index](README.md) | Next → [Exercise 10](10-ssh-and-remote-access-exe.md)
**Note:** [09 — System Monitoring & Logs](../01-notes/09-system-monitoring.md)
