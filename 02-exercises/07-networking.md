# Exercise 07 — Networking

**Navigation:** ← [Exercise 06](06-process-management.md) | [Exercises Index](README.md) | Next → [Exercise 08](08-shell-scripting.md)
**Note:** [07 — Networking](../01-notes/07-networking.md)

---

## Objectives

- View and understand network interfaces
- Test connectivity
- Examine open ports and connections
- Configure basic firewall rules

---

## Exercise 7.1 — Network Interfaces

```bash
# 1. Show all interfaces with IP addresses
ip addr

# 2. What is your machine's IP address?
ip addr | grep "inet " | grep -v "127.0.0.1"

# 3. Show only the primary interface
ip addr show $(ip route | grep default | awk '{print $5}')

# 4. Show the routing table
ip route

# 5. What is your default gateway?
ip route | grep default
```

**Record your answers:**
- Primary interface name: ___________
- IP address: ___________
- Default gateway: ___________

---

## Exercise 7.2 — DNS

```bash
# 1. What DNS server are you using?
cat /etc/resolv.conf

# 2. Look up a domain
nslookup google.com

# 3. Use dig for a detailed lookup
dig google.com

# 4. Look up just the A records
dig google.com A +short

# 5. Look up MX records (mail servers)
dig google.com MX +short

# 6. Query a specific DNS server
dig @8.8.8.8 github.com +short

# 7. Reverse lookup (IP to hostname)
dig -x 8.8.8.8 +short
```

---

## Exercise 7.3 — Connectivity Testing

```bash
# 1. Ping a host (5 packets)
ping -c 5 8.8.8.8

# 2. Ping by hostname
ping -c 3 google.com

# 3. Trace the route to a host
traceroute google.com
# (Ctrl+C if it hangs)

# 4. Test TCP connectivity on port 80
nc -zv google.com 80

# 5. Test TCP connectivity on port 443
nc -zv google.com 443

# 6. Test a closed port (expect failure)
nc -zv google.com 23
```

---

## Exercise 7.4 — Ports & Connections

```bash
# 1. List all listening ports
ss -tulnp

# 2. How many ports is your system listening on?
ss -tulnp | grep LISTEN | wc -l

# 3. Check if port 22 (SSH) is listening
ss -tulnp | grep :22

# 4. Check if port 80 (HTTP) is open
ss -tulnp | grep :80 || echo "Port 80 not listening"

# 5. Find which process is using a port (example: 22)
ss -tulnp | grep :22
```

---

## Exercise 7.5 — Firewall (UFW)

```bash
# 1. Check if ufw is installed
which ufw || { echo "ufw not installed"; sudo apt install -y ufw; }

# 2. Check firewall status
sudo ufw status

# 3. IMPORTANT: Allow SSH before enabling! (or you may lock yourself out)
sudo ufw allow ssh

# 4. Enable the firewall
sudo ufw enable

# 5. Check status
sudo ufw status verbose

# 6. Allow HTTP
sudo ufw allow http

# 7. Allow a custom port
sudo ufw allow 8080/tcp

# 8. List all rules
sudo ufw status numbered

# 9. Delete the port 8080 rule
sudo ufw delete allow 8080/tcp

# 10. Check the result
sudo ufw status
```

---

## Exercise 7.6 — File Transfer

```bash
# 1. Download a small file with wget
wget -q https://raw.githubusercontent.com/torvalds/linux/master/README -O /tmp/linux-readme.txt
cat /tmp/linux-readme.txt | head -10

# 2. Download with curl
curl -s https://api.ipify.org
echo ""   # newline

# 3. What is your public IP?
curl -s https://api.ipify.org?format=json

# Clean up
rm -f /tmp/linux-readme.txt
```

---

## Challenge

Write a shell script called `port-check.sh` that:
1. Accepts a hostname and port as arguments: `./port-check.sh google.com 443`
2. Uses `nc` to test if the port is open
3. Prints either `"Port 443 on google.com is OPEN"` or `"Port 443 on google.com is CLOSED"`
4. Exits with code `0` if open, `1` if closed

---

**Navigation:** ← [Exercise 06](06-process-management.md) | [Exercises Index](README.md) | Next → [Exercise 08](08-shell-scripting.md)
**Note:** [07 — Networking](../01-notes/07-networking.md)
