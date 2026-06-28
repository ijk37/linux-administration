# Exercise 01 — Introduction to Linux

**Navigation:** [Exercises Index](README.md) | Next → [Exercise 02](02-file-system.md)
**Note:** [01 — Introduction to Linux](../01-notes/01-introduction-to-linux.md)

---

## Before You Start

Read [Note 01](../01-notes/01-introduction-to-linux.md) first, then come back here.

These exercises are about exploration, not memorization. The goal is to get comfortable typing commands and reading output. Every command here is safe — nothing you do in this exercise can break anything.

Open a terminal and let's begin.

---

## Exercise 1.1 — Find Out Who and Where You Are

These are the first commands any Linux user runs on a new machine.

**Step 1:** Type this and press Enter:

```bash
whoami
```

You should see your username printed. Something like:
```
jahid
```

**Step 2:** Now find out the machine's name:

```bash
hostname
```

Expected output (yours will differ):
```
mycomputer
```

**Step 3:** Find out which Linux distro you're running:

```bash
cat /etc/os-release
```

This prints the contents of a file. Look for the `NAME` and `VERSION` lines. Expected output (example):
```
NAME="Ubuntu"
VERSION="22.04.3 LTS (Jammy Jellyfish)"
ID=ubuntu
...
```

> **What is `cat`?** `cat` reads a file and prints it to the screen. You'll use it constantly. `/etc/os-release` is a plain text file that your distro fills in with its own details.

**Step 4:** Check the kernel version:

```bash
uname -r
```

Example output:
```
6.5.0-41-generic
```

**Step 5:** See everything at once:

```bash
uname -a
```

Example output:
```
Linux mycomputer 6.5.0-41-generic #41-Ubuntu SMP x86_64 GNU/Linux
```

This shows: OS name, hostname, kernel version, build date, architecture, and OS type — all in one line.

**Reflect:** Write down your answers:
- Distro name and version: ___________
- Kernel version: ___________
- Hostname: ___________

---

## Exercise 1.2 — Check System Time and Uptime

**Step 1:** Check the current date and time:

```bash
date
```

Example output:
```
Thu Jun 20 14:32:01 UTC 2024
```

**Step 2:** Format the date as YYYY-MM-DD:

```bash
date +%Y-%m-%d
```

The `+%Y-%m-%d` part is a *format string*. `%Y` = 4-digit year, `%m` = month, `%d` = day.

Expected output:
```
2024-06-20
```

**Step 3:** See how long the system has been running:

```bash
uptime
```

Example output:
```
14:32:01 up 3 days, 4:12,  1 user,  load average: 0.08, 0.12, 0.10
```

**Questions to answer:**
- How long has your system been running?
- What is the load average for the last 1 minute?
- How many users are currently logged in?

---

## Exercise 1.3 — Getting Help Without Google

One of the most important skills in Linux is knowing how to get help from the terminal itself.

**Step 1:** Open the manual for `ls`:

```bash
man ls
```

The manual page opens. Use the **arrow keys** to scroll. Press `q` to quit.

While you're in the man page, find the answer to: *What does the `-a` flag do?*

**Step 2:** Get a quick one-line summary of a command:

```bash
whatis ls
whatis cp
whatis rm
```

Expected output:
```
ls (1)  - list directory contents
cp (1)  - copy files and directories
rm (1)  - remove files or directories
```

**Step 3:** Search for commands by keyword:

```bash
apropos "disk usage"
```

This searches all man page descriptions. It lists every command related to "disk usage".

Example output:
```
df (1)  - report file system disk space usage
du (1)  - estimate file space usage
...
```

**Step 4:** Use the quick `--help` flag:

```bash
mkdir --help
```

This prints a short summary without opening the full man page. Look for the `-p` flag description.

**Questions:**
- What does `mkdir -p` do? (hint: you just found it)
- What is the difference between `man` and `--help`?

---

## Exercise 1.4 — Explore Your Environment

Linux stores settings in **environment variables** — named values that programs can read.

**Step 1:** See what shell you're using:

```bash
echo $SHELL
```

`$SHELL` is an environment variable. The `$` prefix tells bash "give me the value of this variable". Expected output:
```
/bin/bash
```

**Step 2:** See your home directory:

```bash
echo $HOME
```

Expected output:
```
/home/jahid
```

**Step 3:** See the PATH:

```bash
echo $PATH
```

Example output:
```
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

PATH is a list of directories (separated by `:`) where Linux looks for programs when you type a command. When you type `ls`, Linux searches each directory in PATH until it finds a program called `ls`.

**Step 4:** List all environment variables:

```bash
env
```

This prints a long list. Don't worry about understanding all of them — just notice that they're all in the format `NAME=value`.

---

## Exercise 1.5 — Basic Terminal Skills

**Step 1:** Print a message:

```bash
echo "Hello, Linux!"
```

**Step 2:** Use command substitution — run a command *inside* another command:

```bash
echo "Today is $(date +%A)"
```

The `$(...)` part runs `date +%A` first (which prints the day of the week), then `echo` prints the result. Expected output:
```
Today is Thursday
```

**Step 3:** Run two commands on one line with `&&`:

```bash
whoami && hostname
```

`&&` means "run the second command only if the first one succeeded". Expected output:
```
jahid
mycomputer
```

**Step 4:** View your command history:

```bash
history
```

Linux remembers every command you've typed. This is very useful for recalling a long command you ran earlier. To re-run a command from history, type `!` followed by the line number. For example, `!42` runs command number 42 again.

**Step 5:** Clear the terminal:

```bash
clear
```

Or press `Ctrl + L`. Your previous commands are not deleted — scroll up to see them.

---

## Challenge — Test Yourself

Try to answer these *without* looking at the notes. Then check your answers.

1. What is the difference between the Linux **kernel** and a **distribution**?
2. What does `uname -r` print?
3. You want to find commands related to the word "network". What command would you run?
4. What does the `$` at the end of your prompt mean? What does `#` mean?
5. What does `exit code 0` mean?

> **Answers:**
> 1. The kernel is the core OS that talks to hardware. A distribution bundles the kernel with software, a package manager, and tools into a usable system.
> 2. The current Linux kernel version number.
> 3. `apropos network`
> 4. `$` = regular user, `#` = root (administrator)
> 5. The command succeeded (zero means success in Linux).

---

**Navigation:** [Exercises Index](README.md) | Next → [Exercise 02](02-file-system.md)
**Note:** [01 — Introduction to Linux](../01-notes/01-introduction-to-linux.md)
