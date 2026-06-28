# Exercise 07 — Networking

**Navigation:** ← [Exercise 06](06-process-management.md) | [Exercises Index](README.md) | Next → [Exercise 08](08-shell-scripting.md)
**Note:** [07 — Networking](../01-notes/07-networking.md)

---

## Before You Start

Read [Note 07](../01-notes/07-networking.md) first.

You'll need internet access for most of these exercises. The firewall exercises need sudo.

---

## Exercise 7.1 — Understand Your Network Setup

**Step 1:** View all network interfaces and their IP addresses:

```bash
ip addr
```

Expected output (simplified):
```
1: lo: <LOOPBACK,UP>
    inet 127.0.0.1/8

2: eth0: <BROADCAST,MULTICAST,UP>
    inet 192.168.1.10/24
```

Identify:
- `lo` is the loopback interface. `127.0.0.1` always means "this machine itself".
- `eth0` (or `ens33`, `enp0s3`, etc.) is your real network interface. The name varies by system.

**Step 2:** Find just your IP address (without all the extra output):

```bash
hostname -I
```

Expected output:
```
192.168.1.10
```

**Step 3:** See your default gateway (the router):

```bash
ip route
```

Expected output:
```
default via 192.168.1.1 dev eth0
192.168.1.0/24 dev eth0 proto kernel scope link
```

The `default via 192.168.1.1` line is your gateway — all traffic that doesn't match another route is sent to `192.168.1.1` (your router).

**Record your network info:**
- Your IP address: ___________
- Your interface name (eth0, ens33, etc.): ___________
- Your default gateway: ___________

---

## Exercise 7.2 — Test Connectivity

**Step 1:** Ping Google to verify internet access:

```bash
ping -c 4 8.8.8.8
```

`-c 4` sends exactly 4 packets. `8.8.8.8` is Google's public DNS server — a reliable target.

Expected output:
```
PING 8.8.8.8 (8.8.8.8): 56 data bytes
64 bytes from 8.8.8.8: icmp_seq=0 ttl=118 time=12.4 ms
64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=11.8 ms
...
--- 8.8.8.8 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss
```

Look at `time=` — that's the round-trip time in milliseconds. Under 50ms is excellent, under 100ms is normal for internet connections.

**Step 2:** Ping by hostname (tests DNS too):

```bash
ping -c 3 google.com
```

If this works, you have both internet access AND working DNS. If ping by IP works but ping by hostname fails, DNS is broken.

**Step 3:** Test if a specific port is open on a remote host:

```bash
nc -zv google.com 80
```

Expected output:
```
Connection to google.com 80 port [tcp/http] succeeded!
```

`-z` = just check, don't send data. `-v` = verbose (show the result).

```bash
nc -zv google.com 443
```

Both port 80 (HTTP) and 443 (HTTPS) should succeed for google.com.

**Step 4:** Test a port that should be closed:

```bash
nc -zv google.com 23 2>&1
```

Expected output:
```
nc: connect to google.com port 23 (tcp) failed: Connection refused
```

Port 23 is Telnet — Google correctly blocks it.

---

## Exercise 7.3 — DNS Lookups

**Step 1:** Check which DNS server your machine uses:

```bash
cat /etc/resolv.conf
```

Expected output:
```
nameserver 8.8.8.8
nameserver 8.8.4.4
```

Or it might show a local address like `127.0.0.53` (systemd-resolved acting as a local DNS proxy).

**Step 2:** Look up a domain:

```bash
nslookup google.com
```

Expected output:
```
Server:    8.8.8.8
Address:   8.8.8.8#53

Non-authoritative answer:
Name:   google.com
Address: 142.250.185.78
```

`8.8.8.8#53` — port 53 is the standard DNS port.

**Step 3:** Get just the IP address with dig:

```bash
dig google.com A +short
```

Expected output:
```
142.250.185.78
```

`A` means "A record" (IPv4 address). `+short` removes all the extra information.

**Step 4:** Look up who handles email for a domain:

```bash
dig gmail.com MX +short
```

`MX` means "Mail Exchange record". Expected output:
```
10 alt1.gmail-smtp-in.l.google.com.
20 alt2.gmail-smtp-in.l.google.com.
...
```

The number before each server is the priority (lower = higher priority).

**Step 5:** Test the `/etc/hosts` file:

```bash
cat /etc/hosts
```

Try adding a test entry (you'll need sudo):

```bash
echo "127.0.0.1 mytest.local" | sudo tee -a /etc/hosts
```

`tee -a` appends to the file and also prints to the screen. Now test it:

```bash
ping -c 1 mytest.local
```

Expected output:
```
PING mytest.local (127.0.0.1)
```

It resolves to `127.0.0.1` because we put that in `/etc/hosts`. Clean up:

```bash
sudo sed -i '/mytest.local/d' /etc/hosts
```

---

## Exercise 7.4 — See What's Listening on Your Machine

**Step 1:** Show all listening ports:

```bash
ss -tulnp
```

Recall the flags: `-t` TCP, `-u` UDP, `-l` listening, `-n` numeric, `-p` process.

Expected output:
```
Netid  State   Local Address:Port  Process
tcp    LISTEN  0.0.0.0:22          sshd
tcp    LISTEN  0.0.0.0:80          nginx
tcp    LISTEN  127.0.0.1:5432      postgres
```

**Step 2:** Answer these questions from the output:
- Is SSH (port 22) listening? On what address?
- Is nginx (port 80) listening?
- Is anything listening on `127.0.0.1` only? What does that mean? (Hint: `127.0.0.1` = only accessible from the machine itself, not from the network)

**Step 3:** Check a specific port:

```bash
ss -tulnp | grep :22
```

If SSH is running, you'll see a line with `:22` in it. If nothing is there, SSH is not listening.

**Step 4:** Find out what process is using port 80:

```bash
ss -tulnp | grep :80
```

The `Process` column shows which program owns the port. It looks like `users:(("nginx",pid=1234,...))`.

---

## Exercise 7.5 — Configure the Firewall with UFW

> **Needs sudo.** Read each step carefully before running — firewall mistakes on a remote server can lock you out.

**Step 1:** Check the current firewall status:

```bash
sudo ufw status
```

If UFW is inactive, you'll see:
```
Status: inactive
```

**Step 2:** BEFORE enabling the firewall, allow SSH — this is critical:

```bash
sudo ufw allow ssh
```

Expected output:
```
Rules updated
Rules updated (v6)
```

This allows connections on port 22 (SSH). **Always do this before enabling UFW** or you could lose access to a remote server.

**Step 3:** Allow HTTP and HTTPS:

```bash
sudo ufw allow http
sudo ufw allow https
```

**Step 4:** Enable the firewall:

```bash
sudo ufw enable
```

You'll be asked to confirm. Type `y` and press Enter.

**Step 5:** Check the rules:

```bash
sudo ufw status verbose
```

Expected output:
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW IN    Anywhere
80/tcp                     ALLOW IN    Anywhere
443/tcp                    ALLOW IN    Anywhere
```

**Step 6:** Allow a custom port and then remove it:

```bash
sudo ufw allow 8080/tcp
sudo ufw status numbered
```

The `numbered` option shows a number next to each rule.

```bash
sudo ufw delete allow 8080/tcp
sudo ufw status
```

The rule is gone.

**Reflect:** What would happen if you ran `sudo ufw enable` before running `sudo ufw allow ssh` on a remote server?

---

## Exercise 7.6 — Download Files

**Step 1:** Check your public IP address:

```bash
curl -s https://api.ipify.org
echo ""
```

`-s` means "silent" (no progress output). This returns your public IP address.

**Step 2:** Download a file with wget:

```bash
wget -q https://raw.githubusercontent.com/torvalds/linux/master/CREDITS -O /tmp/linux-credits.txt
```

- `-q` = quiet (no progress output)
- `-O /tmp/linux-credits.txt` = save as this filename

**Step 3:** View the first 10 lines of what you downloaded:

```bash
head -10 /tmp/linux-credits.txt
```

**Step 4:** Clean up:

```bash
rm /tmp/linux-credits.txt
```

---

## Challenge — Port Checker Script

Write a short script called `~/linux-practice/scripts/port-check.sh` that:

1. Takes a hostname and port as arguments: `./port-check.sh google.com 443`
2. Uses `nc -zv` to test if the port is open
3. Prints one of these messages:
   - `Port 443 on google.com is OPEN`
   - `Port 443 on google.com is CLOSED`
4. Exits with code `0` if open, code `1` if closed

**Hints:**
- Check the number of arguments with `$#`
- `nc -zv host port 2>/dev/null` returns exit code 0 if open, non-zero if closed
- Use `$?` to check the exit code of the last command
- Use `$1` and `$2` for the hostname and port arguments

Once you've written it:
```bash
chmod +x ~/linux-practice/scripts/port-check.sh
~/linux-practice/scripts/port-check.sh google.com 443
~/linux-practice/scripts/port-check.sh google.com 23
```

---

**Navigation:** ← [Exercise 06](06-process-management.md) | [Exercises Index](README.md) | Next → [Exercise 08](08-shell-scripting.md)
**Note:** [07 — Networking](../01-notes/07-networking.md)
