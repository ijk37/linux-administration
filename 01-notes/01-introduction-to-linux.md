# 01 — Introduction to Linux

**Navigation:** [Notes Index](README.md) | Next → [02 — File System](02-file-system.md)
**Exercise:** [Exercise 01](../02-exercises/01-introduction-to-linux-exe.md)

---

## What is Linux?

Linux is a free, open-source operating system. It was created by **Linus Torvalds** in 1991, and today it runs almost everything: web servers, smartphones (Android), cloud services (AWS, Google Cloud), supercomputers, and even smart TVs.

You might be used to Windows or macOS. Linux works differently — instead of clicking through menus, you often type commands into a **terminal** (a text window). This feels strange at first but becomes very powerful once you learn it.

### The Kernel vs. a Distribution

Two terms you'll hear constantly:

- **Kernel** — The core of the operating system. It talks directly to the hardware (CPU, RAM, disk). You never interact with it directly.
- **Distribution (distro)** — A complete, ready-to-use Linux system. It includes the kernel *plus* a package manager, desktop environment, and tools.

Think of it this way: the kernel is the engine, and a distribution is the whole car.

| Distro Family | Popular Examples | Commonly Used For |
|---------------|-----------------|-------------------|
| Debian/Ubuntu | Ubuntu, Linux Mint | Beginners, desktops, servers |
| Red Hat | RHEL, Fedora, CentOS | Enterprise / company servers |
| Arch | Arch Linux, Manjaro | Advanced users who want full control |
| SUSE | openSUSE | Enterprise environments |

**Recommendation for beginners:** Start with **Ubuntu** or **Linux Mint** — they have large communities and lots of beginner-friendly documentation.

---

## Why Learn Linux?

- Almost every web server on the internet runs Linux
- It is required knowledge for cloud computing (AWS, Azure, GCP), DevOps, and cybersecurity
- It is completely free — you can read and modify its source code
- It runs very well even on old or low-powered hardware

---

## How Linux is Organized (The Architecture)

```
┌──────────────────────────────────┐
│           User Space             │
│   Your apps, browser, terminal   │
├──────────────────────────────────┤
│         System Libraries         │
│   Tools that apps use (glibc)    │
├──────────────────────────────────┤
│          Linux Kernel            │
│  Controls CPU, RAM, Disk, Network│
├──────────────────────────────────┤
│            Hardware              │
│    CPU, RAM, Disk, Network card  │
└──────────────────────────────────┘
```

When you type a command, it travels down this stack. Your terminal sends the command to the kernel, which tells the hardware what to do, and the result comes back up to your screen.

---

## The Terminal and the Shell

The **terminal** is the window where you type commands. The **shell** is the program running *inside* that terminal — it reads your commands and runs them.

The most common shell is **bash** (Bourne Again Shell). When you open a terminal, you're almost certainly using bash.

You'll see a **prompt** like this:

```
jahid@mycomputer:~$
```

Breaking this down:
- `jahid` — your username
- `mycomputer` — the machine's name (hostname)
- `~` — your current location (`~` means your home folder)
- `$` — means you are a regular user (if you see `#` instead, you are root/administrator)

### Opening a Terminal

- **Ubuntu:** Press `Ctrl + Alt + T`
- **WSL on Windows:** Search "Ubuntu" or "WSL" in the Start menu
- **Remote server:** Use SSH (covered in Note 10)

---

## Your First Commands

Let's learn commands one by one. Type each one and observe the output.

---

### `whoami` — Who am I?

```bash
whoami
```

**What it does:** Prints the username of the currently logged-in user.

**Example output:**
```
jahid
```

This is useful when you've switched accounts and want to confirm who you are.

---

### `hostname` — What machine am I on?

```bash
hostname
```

**What it does:** Prints the name of the computer.

**Example output:**
```
myserver
```

---

### `uname -r` — What Linux kernel is running?

```bash
uname -r
```

**What it does:** Prints the kernel version number.

`uname` stands for "Unix name". The `-r` flag means "release" (show the kernel version).

**Example output:**
```
6.5.0-41-generic
```

To see *everything* at once (architecture, hostname, kernel version, OS):
```bash
uname -a
```

The `-a` flag means "all".

---

### `cat /etc/os-release` — What Linux distro is this?

```bash
cat /etc/os-release
```

**What it does:** `cat` prints a file's contents to the screen. `/etc/os-release` is a file that contains information about the Linux distribution.

**Example output:**
```
NAME="Ubuntu"
VERSION="22.04.3 LTS (Jammy Jellyfish)"
ID=ubuntu
...
```

---

### `date` — What is the current date and time?

```bash
date
```

**Example output:**
```
Thu Jun 20 14:32:01 UTC 2024
```

You can also format the output. For example, to get just the date in `YYYY-MM-DD` format:
```bash
date +%Y-%m-%d
```
Output: `2024-06-20`

---

### `uptime` — How long has this system been running?

```bash
uptime
```

**Example output:**
```
14:32:01 up 3 days,  4:12,  2 users,  load average: 0.08, 0.12, 0.10
```

Reading the output:
- `up 3 days, 4:12` — the system has been running for 3 days and 4 hours
- `2 users` — two people are currently logged in
- `load average: 0.08, 0.12, 0.10` — how busy the CPU is over the last 1, 5, and 15 minutes (more on this in Note 9)

---

### `echo` — Print a message to the screen

```bash
echo "Hello, Linux!"
```

**What it does:** Prints whatever text you give it. It is one of the most-used commands in scripting.

**Example output:**
```
Hello, Linux!
```

You can also use it to print the value of a variable:
```bash
echo "My username is: $USER"
```

---

### `clear` — Clean up the terminal

```bash
clear
```

**What it does:** Scrolls your terminal so it looks empty. Your history is not deleted — you can scroll up to see previous output. Keyboard shortcut: `Ctrl + L`.

---

## Getting Help

You never need to memorize everything. Linux has built-in help for every command.

### `man` — The manual

```bash
man ls
```

**What it does:** Opens the full manual page for a command. Use the arrow keys to scroll, press `/` followed by a word to search, and press `q` to quit.

`man` pages can be dense. Don't try to read every word — use them as a reference when you need a specific flag explained.

### `--help` flag

Most commands support a `--help` flag that prints a short summary:

```bash
ls --help
mkdir --help
```

This is usually faster than `man` when you just need a quick reminder.

### `whatis` — One-line description

```bash
whatis ls
whatis cp
```

**Example output:**
```
ls (1)   - list directory contents
cp (1)   - copy files and directories
```

### `apropos` — Find commands by keyword

Don't know which command to use? Search by topic:

```bash
apropos compress
apropos "disk usage"
```

This searches all man page descriptions and lists commands related to your keyword.

---

## Key Things to Remember

> **Linux is case-sensitive.**  
> `File.txt`, `file.txt`, and `FILE.TXT` are three completely different files. This trips up almost every beginner.

> **Everything is a file.**  
> In Linux, not just documents but also directories, hardware devices, and network sockets are all represented as files. This is a core design principle.

> **The root user is the administrator.**  
> The user named `root` can do anything on the system — delete system files, change any password, install software. Regular users are protected from accidents by not having this power by default. You use `sudo` to temporarily borrow root's power for a single command.

> **Configuration is stored in plain text files.**  
> Unlike Windows (which uses a Registry), Linux stores all configuration in readable text files, mostly under `/etc`. You can open and edit them with any text editor.

---

**Navigation:** [Notes Index](README.md) | Next → [02 — File System](02-file-system.md)
**Exercise:** [Exercise 01](../02-exercises/01-introduction-to-linux-exe.md)
