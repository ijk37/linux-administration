# 07 — Networking

**Navigation:** ← [06 — Process Management](06-process-management.md) | [Notes Index](README.md) | Next → [08 — Shell Scripting](08-shell-scripting.md)
**Exercise:** [Exercise 07](../02-exercises/07-networking.md)

---

## Networking Fundamentals

| Concept | Description |
|---------|-------------|
| IP Address | Unique identifier for a device on a network |
| Subnet Mask | Defines the network portion of an IP |
| Gateway | Router that connects your network to others |
| DNS | Translates domain names to IP addresses |
| MAC Address | Hardware address of a network interface |
| Port | Virtual endpoint for a service (0–65535) |

---

## Viewing Network Configuration

```bash
# Show all network interfaces
ip addr
ip a                  # short form

# Show routing table
ip route
ip r

# Show specific interface
ip addr show eth0

# Legacy command (older systems)
ifconfig
ifconfig eth0

# Show network statistics
ss -s
netstat -s            # older
```

---

## Network Interfaces

```bash
# Bring interface up/down
sudo ip link set eth0 up
sudo ip link set eth0 down

# Assign an IP address (temporary)
sudo ip addr add 192.168.1.10/24 dev eth0

# Remove an IP
sudo ip addr del 192.168.1.10/24 dev eth0

# Add a default gateway
sudo ip route add default via 192.168.1.1
```

### Persistent Configuration

**Ubuntu (Netplan):** `/etc/netplan/*.yaml`

```yaml
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: true
```

Apply: `sudo netplan apply`

**RHEL/CentOS:** `/etc/sysconfig/network-scripts/ifcfg-eth0`

```
DEVICE=eth0
BOOTPROTO=static
IPADDR=192.168.1.10
NETMASK=255.255.255.0
GATEWAY=192.168.1.1
ONBOOT=yes
```

---

## DNS

```bash
# Look up a hostname
nslookup google.com

# More detailed DNS query
dig google.com
dig google.com MX        # mail records
dig @8.8.8.8 google.com  # use specific DNS server

# Resolve hostname
host google.com

# Local DNS config
cat /etc/resolv.conf
cat /etc/hosts
```

### `/etc/hosts` — Local Name Resolution

```
127.0.0.1   localhost
192.168.1.50 myserver.local myserver
```

---

## Testing Connectivity

```bash
# Ping a host (ICMP)
ping google.com
ping -c 4 8.8.8.8        # send only 4 packets

# Trace route to host
traceroute google.com
tracepath google.com     # no root required

# Test TCP connectivity
telnet google.com 80     # legacy
nc -zv google.com 80     # netcat, preferred
nc -zv google.com 443

# Measure download speed (quick check)
curl -o /dev/null https://speed.hetzner.de/100MB.bin
```

---

## Ports & Sockets

```bash
# List open ports and listening services
ss -tulnp
# -t TCP, -u UDP, -l listening, -n numeric, -p process

# Older equivalent
netstat -tulnp

# Check if a specific port is in use
ss -tulnp | grep :80
lsof -i :80
```

### Common Ports

| Port | Protocol | Service |
|------|----------|---------|
| 22 | TCP | SSH |
| 25 | TCP | SMTP (email) |
| 53 | UDP/TCP | DNS |
| 80 | TCP | HTTP |
| 443 | TCP | HTTPS |
| 3306 | TCP | MySQL |
| 5432 | TCP | PostgreSQL |
| 6379 | TCP | Redis |

---

## Firewall — UFW (Ubuntu)

`ufw` (Uncomplicated Firewall) is a front-end for iptables.

```bash
# Enable/disable firewall
sudo ufw enable
sudo ufw disable

# Check status
sudo ufw status verbose

# Allow SSH (do this BEFORE enabling!)
sudo ufw allow ssh
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow http
sudo ufw allow https

# Allow a specific port
sudo ufw allow 8080/tcp

# Deny a port
sudo ufw deny 23/tcp

# Allow from a specific IP
sudo ufw allow from 192.168.1.0/24 to any port 22

# Delete a rule
sudo ufw delete allow 8080/tcp

# Reset all rules
sudo ufw reset
```

---

## Firewall — firewalld (RHEL/CentOS)

```bash
# Check status
sudo firewall-cmd --state

# List all rules
sudo firewall-cmd --list-all

# Allow HTTP permanently
sudo firewall-cmd --permanent --add-service=http

# Allow a port
sudo firewall-cmd --permanent --add-port=8080/tcp

# Reload after changes
sudo firewall-cmd --reload

# Remove a service
sudo firewall-cmd --permanent --remove-service=ftp
```

---

## Downloading & Transferring Files

```bash
# Download a file
wget https://example.com/file.zip
curl -O https://example.com/file.zip

# Download and pipe
curl -s https://api.example.com/data | jq .

# Copy files over SSH (SCP)
scp file.txt user@192.168.1.10:/home/user/
scp -r mydir/ user@192.168.1.10:/home/user/

# Sync directories over SSH (rsync)
rsync -avz mydir/ user@192.168.1.10:/home/user/mydir/
rsync -avz --delete src/ dest/   # mirror (deletes extras in dest)
```

---

## Netcat — Swiss Army Knife of Networking

```bash
# Listen on a port
nc -l 9000

# Connect to a listener
nc 192.168.1.10 9000

# Transfer a file
# Receiver:
nc -l 9000 > received.txt
# Sender:
nc 192.168.1.10 9000 < file.txt

# Port scan (check if ports are open)
nc -zv 192.168.1.10 20-25
```

---

**Navigation:** ← [06 — Process Management](06-process-management.md) | [Notes Index](README.md) | Next → [08 — Shell Scripting](08-shell-scripting.md)
**Exercise:** [Exercise 07](../02-exercises/07-networking.md)
