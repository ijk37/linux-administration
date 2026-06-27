# 09 — System Monitoring & Logs

**Navigation:** ← [08 — Shell Scripting](08-shell-scripting.md) | [Notes Index](README.md) | Next → [10 — SSH & Remote Access](10-ssh-and-remote-access.md)
**Exercise:** [Exercise 09](../02-exercises/09-system-monitoring.md)

---

## Why Monitor a System?

Monitoring helps you:
- Detect resource exhaustion before it causes outages
- Identify slow or runaway processes
- Investigate incidents using logs
- Establish performance baselines

---

## CPU Monitoring

```bash
# Real-time CPU usage
top
htop

# CPU info
lscpu
cat /proc/cpuinfo

# Average load over 1, 5, 15 minutes
uptime
cat /proc/loadavg

# Per-CPU usage (press '1' in top)
mpstat 1          # install: apt install sysstat
mpstat -P ALL 1   # all CPUs, 1-second intervals
```

**Interpreting load average:**  
A load of `1.0` on a 1-core system = 100% utilization.  
On a 4-core system, `4.0` = 100%. Values above the CPU count mean the system is overloaded.

---

## Memory Monitoring

```bash
# Memory overview (human-readable)
free -h

# Detailed memory info
cat /proc/meminfo

# Virtual memory statistics
vmstat 1 5       # 5 samples, 1-second intervals

# Memory usage by process
ps aux --sort=-%mem | head -10
```

### Understanding `free -h` Output

```
              total   used    free   shared  buff/cache  available
Mem:          7.7G    2.1G    3.2G    120M     2.4G        5.2G
Swap:         2.0G    0B      2.0G
```

- **used**: actively used memory
- **buff/cache**: used by kernel for caching (can be reclaimed)
- **available**: memory actually available for new processes

---

## Disk Monitoring

```bash
# Disk space usage
df -h

# Directory size
du -sh /var/log/
du -sh /home/*     # each user's home size

# Top 10 largest directories
du -h /var | sort -rh | head -10

# Disk I/O statistics
iostat 1          # install: apt install sysstat
iostat -x 1       # extended stats

# Real-time I/O per process
iotop             # install: apt install iotop
```

---

## System Logs

Linux logs are primarily in `/var/log/` and managed by **systemd journal**.

### Important Log Files

| File | Contents |
|------|---------|
| `/var/log/syslog` | General system messages (Debian/Ubuntu) |
| `/var/log/messages` | General messages (RHEL/CentOS) |
| `/var/log/auth.log` | Authentication events |
| `/var/log/kern.log` | Kernel messages |
| `/var/log/dmesg` | Boot and hardware messages |
| `/var/log/apt/` | APT package manager history |
| `/var/log/nginx/` | Nginx web server logs |
| `/var/log/mysql/` | MySQL logs |

### Viewing Logs

```bash
# Tail the syslog in real-time
tail -f /var/log/syslog

# View authentication log
sudo tail -100 /var/log/auth.log

# View kernel ring buffer (hardware/boot messages)
dmesg
dmesg | grep -i error
dmesg -T    # human-readable timestamps

# Grep for errors
grep -i "error\|fail\|critical" /var/log/syslog
```

---

## journalctl — systemd Journal

```bash
# All logs (most recent last)
journalctl

# Follow in real-time
journalctl -f

# Logs since last boot
journalctl -b

# Logs from previous boot
journalctl -b -1

# Logs for a specific service
journalctl -u nginx
journalctl -u nginx -f

# Logs from the last hour
journalctl --since "1 hour ago"

# Logs in a time range
journalctl --since "2024-06-01 00:00:00" --until "2024-06-01 23:59:59"

# Filter by priority
journalctl -p err          # errors only
journalctl -p warning      # warnings and above

# Show disk usage of journal
journalctl --disk-usage

# Limit journal size
sudo journalctl --vacuum-size=500M
sudo journalctl --vacuum-time=7d
```

---

## Network Monitoring

```bash
# Live network traffic per interface
ifstat             # install: apt install ifstat
nethogs            # per-process bandwidth

# Packet-level monitoring
sudo tcpdump -i eth0
sudo tcpdump -i eth0 port 80
sudo tcpdump -i eth0 -w capture.pcap    # save to file
sudo tcpdump -r capture.pcap            # read from file

# Connection states
ss -s
ss -tulnp

# Bandwidth test
iperf3 -s                  # server
iperf3 -c 192.168.1.10     # client
```

---

## System Resource Summary Tools

```bash
# All-in-one overview
glances              # install: apt install glances
nmon                 # install: apt install nmon

# System info overview
neofetch             # install: apt install neofetch
inxi -Fxz            # install: apt install inxi
```

---

## Log Rotation

`logrotate` prevents logs from filling up the disk. Config is in `/etc/logrotate.conf` and `/etc/logrotate.d/`.

```bash
# View logrotate config for nginx
cat /etc/logrotate.d/nginx

# Manual run (test mode)
sudo logrotate -d /etc/logrotate.conf

# Force rotation now
sudo logrotate -f /etc/logrotate.conf
```

Example logrotate config:

```
/var/log/myapp/*.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
    create 640 www-data adm
    postrotate
        systemctl reload myapp
    endscript
}
```

---

## Writing a Simple Monitor Script

```bash
#!/bin/bash
# system-check.sh — Quick health check

echo "=== System Health Report: $(date) ==="

echo ""
echo "--- Uptime ---"
uptime

echo ""
echo "--- Memory ---"
free -h

echo ""
echo "--- Disk ---"
df -h | grep -v tmpfs

echo ""
echo "--- Top 5 CPU Processes ---"
ps aux --sort=-%cpu | head -6

echo ""
echo "--- Top 5 Memory Processes ---"
ps aux --sort=-%mem | head -6

echo ""
echo "--- Recent Errors ---"
sudo journalctl -p err --since "1 hour ago" --no-pager | tail -10
```

---

**Navigation:** ← [08 — Shell Scripting](08-shell-scripting.md) | [Notes Index](README.md) | Next → [10 — SSH & Remote Access](10-ssh-and-remote-access.md)
**Exercise:** [Exercise 09](../02-exercises/09-system-monitoring.md)
