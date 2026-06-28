# 07 — Networking

**Navigation:** ← [06 — Process Management](06-process-management.md) | [Notes Index](README.md) | Next → [08 — Shell Scripting](08-shell-scripting.md)
**Exercise:** [Exercise 07](../02-exercises/07-networking.md)

---

## Basic Networking Concepts

Before diving into commands, here are the key terms you need to understand:

| Term | What it means |
|------|--------------|
| **IP Address** | A unique number that identifies a device on a network. Like a home address, but for computers. Example: `192.168.1.10` |
| **Subnet Mask** | Defines which part of the IP address is the network and which part is the device. Example: `/24` or `255.255.255.0` |
| **Gateway** | The router that connects your local network to the wider internet. Usually ends in `.1`, e.g., `192.168.1.1` |
| **DNS** | Translates human-friendly names (like `google.com`) into IP addresses. Like a phone book for the internet. |
| **Port** | A number that identifies a specific service on a computer. SSH uses port 22, web servers use port 80 (HTTP) or 443 (HTTPS). |
| **Network Interface** | The hardware or virtual component that connects your machine to a network (e.g., `eth0` = ethernet, `wlan0` = WiFi). |

---

## Viewing Your Network Configuration

### `ip addr` — What are my IP addresses?

```bash
ip addr
```

Or the short form:

```bash
ip a
```

**Example output:**
```
1: lo: <LOOPBACK,UP> mtu 65536
    link/loopback 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo

2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    link/ether 52:54:00:ab:cd:ef brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.10/24 brd 192.168.1.255 scope global eth0
```

Reading the output:
- `lo` is the **loopback** interface — a virtual interface that loops back to the same machine. IP `127.0.0.1` always means "this computer itself".
- `eth0` is your actual ethernet network interface.
- `inet 192.168.1.10/24` is the IP address. The `/24` is the subnet mask.

---

### `ip route` — What is my default gateway?

```bash
ip route
```

**Example output:**
```
default via 192.168.1.1 dev eth0
192.168.1.0/24 dev eth0 proto kernel scope link
```

The line starting with `default via` tells you the default gateway (`192.168.1.1` here). All traffic that doesn't match another route goes through this gateway to reach the internet.

---

## Testing Connectivity

### `ping` — Is this host reachable?

```bash
ping google.com
```

`ping` sends small packets to the target and measures how long it takes to get a response. It's the first tool to use when troubleshooting network problems.

**Example output:**
```
PING google.com (142.250.185.78): 56 data bytes
64 bytes from 142.250.185.78: icmp_seq=0 ttl=118 time=12.4 ms
64 bytes from 142.250.185.78: icmp_seq=1 ttl=118 time=11.8 ms
```

- `time=12.4 ms` — how long the round trip took. Lower is better.
- Press `Ctrl + C` to stop.

```bash
ping -c 4 google.com
```

`-c 4` means "send exactly 4 packets, then stop". Without `-c`, ping runs forever until you press Ctrl+C.

**What if ping fails?**
- No response → the host might be down, or ICMP is blocked by a firewall
- "Name or service not known" → DNS is broken (your computer can't resolve the hostname to an IP)

---

### `traceroute` — How does traffic get there?

```bash
traceroute google.com
```

Shows each "hop" (router) that your traffic passes through on its way to the destination. Useful for diagnosing where a connection is being slow or dropped.

**Example output:**
```
1  192.168.1.1 (gateway)        0.5 ms
2  10.0.0.1    (ISP router)     5.2 ms
3  ...
15 142.250.185.78 (google.com)  12.4 ms
```

If you see `* * *` on a line, that router is not responding to traceroute (often normal — many routers block these probes).

---

### `nc` (netcat) — Test if a port is open

```bash
nc -zv google.com 80
```

Breaking this down:
- `nc` — netcat, the "Swiss Army knife" of networking
- `-z` — "zero-I/O mode": just check if the port is open, don't send data
- `-v` — verbose: print what's happening
- `google.com` — the host
- `80` — the port to test

**Example output:**
```
Connection to google.com 80 port [tcp/http] succeeded!
```

If you see this, the host is accepting connections on that port. If it says "connection refused" or times out, the port is closed or blocked.

---

## DNS — Translating Names to IPs

### `nslookup` — Simple DNS lookup

```bash
nslookup google.com
```

**Example output:**
```
Server:     8.8.8.8          ← which DNS server answered
Address:    8.8.8.8#53

Non-authoritative answer:
Name:       google.com
Address:    142.250.185.78   ← the IP address for google.com
```

---

### `dig` — Detailed DNS query

```bash
dig google.com
```

Gives much more detailed DNS information than `nslookup`. Useful for troubleshooting DNS problems.

```bash
dig google.com A +short
```

- `A` — look up A records (IPv4 addresses only)
- `+short` — print only the result, no extra info

**Output:**
```
142.250.185.78
```

```bash
dig google.com MX +short
```

Look up MX records — which mail servers handle email for `google.com`.

---

### DNS configuration files

```bash
cat /etc/resolv.conf
```

Shows which DNS server your machine uses. You'll see lines like:

```
nameserver 8.8.8.8
nameserver 8.8.4.4
```

These are Google's public DNS servers.

```bash
cat /etc/hosts
```

This file is checked *before* DNS. You can add entries here to override DNS for specific names — useful for development:

```
127.0.0.1   localhost
192.168.1.50  mydevserver.local
```

After adding an entry here, you can use `mydevserver.local` instead of the IP address.

---

## Viewing Open Ports and Connections

### `ss` — What ports is this machine listening on?

```bash
ss -tulnp
```

Each flag has a meaning:
- `-t` — show TCP connections
- `-u` — show UDP connections
- `-l` — show only listening ports (servers waiting for connections)
- `-n` — show numbers instead of names (e.g., show `80` instead of `http`)
- `-p` — show which process is using each port

**Example output:**
```
Netid  State   Recv-Q  Send-Q  Local Address:Port
tcp    LISTEN  0       128     0.0.0.0:22          → SSH (port 22)
tcp    LISTEN  0       511     0.0.0.0:80          → nginx (port 80)
tcp    LISTEN  0       128     127.0.0.1:5432      → PostgreSQL (port 5432, local only)
```

This tells you exactly which services are accepting connections and on which ports. This is very useful for security auditing.

---

## The Firewall — UFW

A firewall controls which network connections are allowed into and out of your machine. **UFW** (Uncomplicated Firewall) is the beginner-friendly firewall tool on Ubuntu.

> **Important:** Before enabling the firewall, always allow SSH first, or you will lock yourself out of a remote server.

### Check firewall status

```bash
sudo ufw status
```

Shows whether the firewall is active and lists all the current rules.

### Allow SSH (do this FIRST if remote)

```bash
sudo ufw allow ssh
```

This adds a rule to allow SSH connections (port 22). This is equivalent to:

```bash
sudo ufw allow 22/tcp
```

### Enable the firewall

```bash
sudo ufw enable
```

Activates the firewall with the rules you've set.

### Allow web traffic

```bash
sudo ufw allow http      # allows port 80
sudo ufw allow https     # allows port 443
```

### Allow a custom port

```bash
sudo ufw allow 8080/tcp
```

Allows incoming TCP connections on port 8080.

### Block a port

```bash
sudo ufw deny 23/tcp
```

Blocks Telnet (port 23) — it should never be exposed anyway.

### Allow from a specific IP only

```bash
sudo ufw allow from 192.168.1.0/24 to any port 22
```

Allows SSH connections **only** from the `192.168.1.x` network. Nobody outside that network can SSH in.

### View rules with numbers

```bash
sudo ufw status numbered
```

Shows rules with numbers so you can delete them by number:

```bash
sudo ufw delete 3
```

---

## Downloading Files

### `wget` — Download a file from the internet

```bash
wget https://example.com/file.zip
```

Downloads `file.zip` to your current directory. You'll see a progress bar.

```bash
wget -O custom-name.zip https://example.com/file.zip
```

`-O` (capital O) specifies the output filename.

### `curl` — Transfer data with a URL

`curl` is more flexible than `wget`. It can also send data, not just receive it.

```bash
curl -O https://example.com/file.zip
```

Download a file (capital `-O` saves with the original filename).

```bash
curl https://api.example.com/data
```

Fetch and print the response of an API to the terminal. Very useful for testing web services.

```bash
curl -s https://api.ipify.org
```

`-s` means "silent" — no progress output. This particular URL returns your public IP address.

---

## Copying Files Between Machines — SCP

`scp` (Secure Copy) copies files over SSH. It uses the same authentication as SSH.

```bash
scp file.txt jahid@192.168.1.10:/home/jahid/
```

Breaking this down:
- `scp` — the command
- `file.txt` — the file to copy (local)
- `jahid@192.168.1.10` — username and IP of the remote machine
- `:/home/jahid/` — where to put it on the remote machine

```bash
scp jahid@192.168.1.10:/home/jahid/notes.txt ./
```

Copy *from* a remote machine *to* the current local directory (`./`).

```bash
scp -r mydir/ jahid@192.168.1.10:/home/jahid/
```

`-r` copies a directory recursively.

---

**Navigation:** ← [06 — Process Management](06-process-management.md) | [Notes Index](README.md) | Next → [08 — Shell Scripting](08-shell-scripting.md)
**Exercise:** [Exercise 07](../02-exercises/07-networking.md)
