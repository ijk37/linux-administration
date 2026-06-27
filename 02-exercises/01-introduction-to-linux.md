# Exercise 01 — Introduction to Linux

**Navigation:** [Exercises Index](README.md) | Next → [Exercise 02](02-file-system.md)
**Note:** [01 — Introduction to Linux](../01-notes/01-introduction-to-linux.md)

---

## Objectives

By the end of these exercises you should be able to:
- Identify your Linux distribution and kernel version
- Use basic commands to explore the system
- Get help from man pages

---

## Exercise 1.1 — System Identification

Run each command and write down the output.

```bash
# 1. Who are you?
whoami

# 2. What is the machine's hostname?
hostname

# 3. What distro is installed? Find the NAME and VERSION fields.
cat /etc/os-release

# 4. What kernel version is running?
uname -r

# 5. What is the full kernel and OS info?
uname -a
```

**Questions:**
- What distro and version are you running?
- Is the kernel 5.x, 6.x, or older?

---

## Exercise 1.2 — Uptime & Date

```bash
# 1. How long has the system been running?
uptime

# 2. What is today's date and time?
date

# 3. Print the date in ISO format (YYYY-MM-DD)
date +%Y-%m-%d
```

---

## Exercise 1.3 — Getting Help

```bash
# 1. Open the manual for the 'ls' command
man ls
# (Press q to quit)

# 2. Get a one-line description of 'cp'
whatis cp

# 3. Find commands related to "compress"
apropos compress | head -10

# 4. Use the --help flag on 'mkdir'
mkdir --help
```

**Questions:**
- What does the `-p` flag do for `mkdir`?
- What does the `-R` flag do for `ls`?

---

## Exercise 1.4 — Environment Info

```bash
# 1. What shell are you using?
echo $SHELL

# 2. Print your home directory
echo $HOME

# 3. Display your PATH variable
echo $PATH

# 4. List environment variables (first 20)
env | head -20
```

---

## Exercise 1.5 — Shell Exploration

```bash
# 1. Clear the terminal
clear

# 2. Print a message
echo "Linux is fun!"

# 3. Use command substitution to show the date inline
echo "Today is $(date +%A), $(date +%B\ %d)"

# 4. Chain two commands on one line
whoami && hostname

# 5. Show the last 5 commands you ran
history | tail -5
```

---

## Challenge

Write answers to these questions (no peeking at the notes!):

1. What is the difference between the Linux kernel and a Linux distribution?
2. What does `uname -r` print?
3. Name three Linux distributions and their use cases.
4. How do you search for commands related to a keyword using the terminal?
5. What does exit code `0` mean?

---

**Navigation:** [Exercises Index](README.md) | Next → [Exercise 02](02-file-system.md)
**Note:** [01 — Introduction to Linux](../01-notes/01-introduction-to-linux.md)
