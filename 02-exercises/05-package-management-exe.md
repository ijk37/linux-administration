# Exercise 05 — Package Management

**Navigation:** ← [Exercise 04](04-file-permissions-exe.md) | [Exercises Index](README.md) | Next → [Exercise 06](06-process-management-exe.md)
**Note:** [05 — Package Management](../01-notes/05-package-management.md)

---

## Before You Start

Read [Note 05](../01-notes/05-package-management.md) first.

These exercises use **APT** (Ubuntu/Debian). If you're on Fedora or RHEL, substitute `apt` with `dnf` — the concepts are identical.

You'll need internet access and sudo privileges.

---

## Exercise 5.1 — Update Your Package List

Always do this before installing anything.

**Step 1:** Update the package list:

```bash
sudo apt update
```

You'll see output like this:
```
Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
Get:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease [128 kB]
Fetched 3,456 kB in 4s (864 kB/s)
57 packages can be upgraded. Run 'apt list --upgradable' to see them.
```

This downloaded updated package information. Nothing was installed yet — it's just refreshing the catalogue.

**Step 2:** See which packages have available updates:

```bash
apt list --upgradable 2>/dev/null
```

> **What is `2>/dev/null`?** `2>` redirects error messages. `/dev/null` is a "black hole" that discards anything sent to it. This hides a harmless warning that `apt list` always prints. You'll often see this pattern when you want to suppress noise.

**Step 3:** Count how many packages can be upgraded:

```bash
apt list --upgradable 2>/dev/null | wc -l
```

**Reflect:** Why is it important to run `apt update` before `apt install`? What happens if you skip it?

---

## Exercise 5.2 — Research a Package Before Installing

It's good practice to look at what you're about to install.

**Step 1:** Search for packages related to "network scanner":

```bash
apt search "network scanner" 2>/dev/null
```

You'll see a list of packages with their names and descriptions.

**Step 2:** Get detailed information about `nmap` (a popular network scanner):

```bash
apt show nmap 2>/dev/null
```

Expected output (abbreviated):
```
Package: nmap
Version: 7.80+dfsg1-2build1
Depends: libc6, liblinux-procfs-perl, ...
Description: The Network Mapper
 Nmap is a utility for network exploration or security auditing.
 ...
```

Read the `Depends:` line — that's the list of other packages nmap needs to work. APT will install all of these automatically.

**Step 3:** Check if a package is already installed:

```bash
dpkg -s curl
```

If it's installed, you'll see `Status: install ok installed`. If not, you'll see an error.

---

## Exercise 5.3 — Install, Use, and Remove a Package

**Step 1:** Install `tree` — a handy tool that shows directories visually:

```bash
sudo apt install -y tree
```

`-y` automatically answers "yes" to the confirmation prompt. You'll see it downloading and installing.

**Step 2:** Try it out:

```bash
tree ~/linux-practice/ 2>/dev/null || tree ~ -L 2
```

Expected output (something like):
```
/home/jahid/linux-practice/
├── logs
│   └── app.log
├── notes
│   ├── day1.txt
│   └── day2-renamed.txt
└── scripts

3 directories, 3 files
```

See how much clearer this is than `ls -R`? That's the value of `tree`.

**Step 3:** Find out where `tree` was installed:

```bash
which tree
```

Expected output:
```
/usr/bin/tree
```

`which` shows the path to the executable file of a command.

**Step 4:** List every file the `tree` package installed:

```bash
dpkg -L tree
```

You'll see a list of files — the binary, man page, etc. All of these will be removed when you uninstall.

**Step 5:** Remove `tree`:

```bash
sudo apt remove tree
```

**Step 6:** Verify it's gone:

```bash
which tree
```

Expected output:
```
(nothing — no output means the command is not found)
```

Or you might see:
```
/usr/bin/which: no tree in (/usr/local/bin:/usr/bin:/bin:...)
```

**Step 7:** Remove leftover dependencies:

```bash
sudo apt autoremove -y
```

This removes any packages that were installed automatically to support `tree` but are no longer needed by anything else.

---

## Exercise 5.4 — Install a Useful Tool and Explore It

Now install something you'll actually keep and use.

**Step 1:** Install `htop` — a better version of `top`:

```bash
sudo apt install -y htop
```

**Step 2:** Open it:

```bash
htop
```

You'll see a colorful, real-time view of your processes and resources. Click on a column header to sort by it. Press `q` to quit when you're done exploring.

**Step 3:** Install `ncdu` — an interactive disk usage explorer:

```bash
sudo apt install -y ncdu
```

**Step 4:** Use it to explore your home directory:

```bash
ncdu ~
```

Navigate with arrow keys, press Enter to open a directory, press `q` to quit. This makes it easy to find what's eating up disk space.

---

## Exercise 5.5 — Investigate an Installed Package with dpkg

`dpkg` gives you low-level package information.

**Step 1:** List all installed packages (there will be many):

```bash
dpkg -l | head -30
```

Each line follows this format:
```
ii  packagename  version  architecture  description
```

The `ii` at the start means "installed, install ok". Other codes: `rc` means the package was removed but config files remain.

**Step 2:** Find all installed packages with "python" in the name:

```bash
dpkg -l | grep python
```

You'll likely see several Python-related packages — Python is used by many system tools.

**Step 3:** Find which package owns a specific file:

```bash
dpkg -S /bin/ls
```

Expected output:
```
coreutils: /bin/ls
```

This tells you `ls` comes from the `coreutils` package. Try it with other commands too:

```bash
dpkg -S /usr/bin/python3
dpkg -S /usr/bin/curl
```

**Step 4:** Check if `nginx` is installed (it probably isn't yet):

```bash
dpkg -s nginx
```

If nginx isn't installed, you'll see an error message. That's expected — we use nginx in the mini-projects later.

---

## Exercise 5.6 — Upgrade a Package

**Step 1:** Upgrade all packages with available updates:

```bash
sudo apt upgrade -y
```

This is safe to run — it only upgrades existing packages, never removes them. The output shows you exactly what's being upgraded.

**Step 2:** After upgrading, check if a reboot is needed:

```bash
cat /var/run/reboot-required 2>/dev/null && echo "Reboot is needed!" || echo "No reboot needed."
```

Some kernel updates only take effect after a reboot. This file exists only when a reboot is required.

---

## Challenge — Find, Install, Explore, Remove

Pick **one** package from this list that you find interesting:

| Package | What it does |
|---------|-------------|
| `jq` | Pretty-prints and queries JSON data |
| `net-tools` | Classic network tools (ifconfig, netstat) |
| `dstat` | Live system resource stats |
| `bat` | A better version of `cat` with syntax highlighting |
| `fzf` | Fuzzy finder — interactive search for the terminal |

1. Use `apt show` to read about it before installing
2. Install it
3. Find out where it installed its binary using `which`
4. List the files it installed with `dpkg -L`
5. Try using it with `--help` to understand basic usage
6. Remove it with `apt remove`
7. Confirm it's gone with `which`

---

**Navigation:** ← [Exercise 04](04-file-permissions-exe.md) | [Exercises Index](README.md) | Next → [Exercise 06](06-process-management-exe.md)
**Note:** [05 — Package Management](../01-notes/05-package-management.md)
