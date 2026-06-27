# Exercise 09 — System Monitoring & Logs

**Navigation:** ← [Exercise 08](08-shell-scripting.md) | [Exercises Index](README.md) | Next → [Exercise 10](10-ssh-and-remote-access.md)
**Note:** [09 — System Monitoring & Logs](../01-notes/09-system-monitoring.md)

---

## Objectives

- Read CPU, memory, and disk metrics
- Navigate system logs using both traditional files and journalctl
- Write a basic monitoring script

---

## Exercise 9.1 — CPU & Load

```bash
# 1. How many CPU cores does your system have?
nproc
lscpu | grep "^CPU(s):"

# 2. Show current CPU utilization
top -bn1 | grep "Cpu(s)"

# 3. What is the 1/5/15 minute load average?
uptime

# 4. Is the system over-loaded? (load > number of CPUs)
LOAD=$(cut -d" " -f1 /proc/loadavg)
CPUS=$(nproc)
echo "Load: $LOAD | CPUs: $CPUS"
```

---

## Exercise 9.2 — Memory

```bash
# 1. Show memory summary
free -h

# 2. What % of memory is used?
free | awk 'NR==2{printf "Memory used: %.0f%%\n", $3/$2*100}'

# 3. How much swap is in use?
free -h | grep Swap

# 4. Top 5 processes by memory
ps aux --sort=-%mem | head -6

# 5. Check if OOM killer has been triggered recently
dmesg | grep -i "out of memory" | tail -5
```

---

## Exercise 9.3 — Disk

```bash
# 1. Show disk usage for all filesystems
df -h

# 2. Which filesystem is closest to full?
df -h | sort -k5 -rh | head -5

# 3. How much space does /var/log use?
du -sh /var/log/

# 4. Find the 5 largest files in /var/log
sudo find /var/log -type f -exec du -sh {} \; 2>/dev/null | sort -rh | head -5

# 5. Find the 5 largest directories in /var
sudo du -sh /var/*/ 2>/dev/null | sort -rh | head -5
```

---

## Exercise 9.4 — Log Files

```bash
# 1. View the last 20 lines of the system log
sudo tail -20 /var/log/syslog 2>/dev/null || sudo tail -20 /var/log/messages

# 2. Follow the log in real-time (Ctrl+C to stop after a few seconds)
sudo tail -f /var/log/syslog &
TAIL_PID=$!
sleep 5
kill $TAIL_PID 2>/dev/null

# 3. Find authentication events
sudo grep "session opened" /var/log/auth.log 2>/dev/null | tail -5

# 4. Find failed login attempts
sudo grep "Failed password" /var/log/auth.log 2>/dev/null | tail -5 || echo "No failed logins found"

# 5. View kernel messages
dmesg | grep -i "error\|warn" | tail -10
```

---

## Exercise 9.5 — journalctl

```bash
# 1. Show logs from the last 30 minutes
journalctl --since "30 minutes ago" | tail -20

# 2. Show only error-level logs
journalctl -p err --since "1 hour ago" --no-pager | tail -10

# 3. Show logs for a specific service
journalctl -u cron --no-pager | tail -10

# 4. Show logs from last boot
journalctl -b --no-pager | head -20

# 5. Check journal disk usage
journalctl --disk-usage
```

---

## Exercise 9.6 — Build a Monitor Script

Create `~/scripts/health-check.sh`:

```bash
cat > ~/scripts/health-check.sh << 'EOF'
#!/bin/bash
set -euo pipefail

WARN_CPU=80
WARN_MEM=85
WARN_DISK=90

header() { echo ""; echo "=== $1 ==="; }

check_cpu() {
    header "CPU"
    local LOAD
    LOAD=$(cut -d" " -f1 /proc/loadavg)
    local CPUS
    CPUS=$(nproc)
    echo "Load average (1m): $LOAD"
    echo "CPU count: $CPUS"
    local PCT
    PCT=$(echo "$LOAD $CPUS" | awk '{printf "%.0f", ($1/$2)*100}')
    echo "CPU load: ${PCT}%"
    [ "$PCT" -ge "$WARN_CPU" ] && echo "WARNING: High CPU load!"
}

check_memory() {
    header "Memory"
    free -h
    local PCT
    PCT=$(free | awk 'NR==2{printf "%.0f", $3/$2*100}')
    echo "Used: ${PCT}%"
    [ "$PCT" -ge "$WARN_MEM" ] && echo "WARNING: High memory usage!"
}

check_disk() {
    header "Disk"
    df -h | grep -v tmpfs
    while IFS= read -r line; do
        local PCT
        PCT=$(echo "$line" | awk '{print $5}' | tr -d '%')
        local FS
        FS=$(echo "$line" | awk '{print $6}')
        [ "$PCT" -ge "$WARN_DISK" ] && echo "WARNING: $FS is ${PCT}% full!"
    done < <(df | grep -v tmpfs | grep -v "^Filesystem")
}

check_services() {
    header "Key Services"
    for SVC in ssh cron nginx mysql; do
        if systemctl is-active --quiet "$SVC" 2>/dev/null; then
            echo "  [OK]   $SVC"
        else
            echo "  [DOWN] $SVC"
        fi
    done
}

echo "Health Check Report — $(date)"
check_cpu
check_memory
check_disk
check_services
echo ""
echo "Done."
EOF

chmod +x ~/scripts/health-check.sh
~/scripts/health-check.sh
```

---

## Challenge

Modify `health-check.sh` to:
1. Accept a `--disk-threshold` argument (e.g., `--disk-threshold 95`)
2. Save the output to a log file `/tmp/health-YYYYMMDD.log` (use `date +%Y%m%d`)
3. Print "ALERT" if any warning condition is triggered

---

**Navigation:** ← [Exercise 08](08-shell-scripting.md) | [Exercises Index](README.md) | Next → [Exercise 10](10-ssh-and-remote-access.md)
**Note:** [09 — System Monitoring & Logs](../01-notes/09-system-monitoring.md)
