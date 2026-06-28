# Exercise 08 — Shell Scripting

**Navigation:** ← [Exercise 07](07-networking.md) | [Exercises Index](README.md) | Next → [Exercise 09](09-system-monitoring.md)
**Note:** [08 — Shell Scripting](../01-notes/08-shell-scripting.md)

---

## Before You Start

Read [Note 08](../01-notes/08-shell-scripting.md) first.

Shell scripting is where everything comes together. You'll write real scripts that do useful things. Create all your scripts in `~/linux-practice/scripts/`.

```bash
mkdir -p ~/linux-practice/scripts
```

---

## Exercise 8.1 — Your First Script

**Step 1:** Create the script file:

```bash
nano ~/linux-practice/scripts/hello.sh
```

Type this content exactly (or copy it):

```bash
#!/bin/bash
echo "Hello, World!"
echo "Today is: $(date)"
echo "I am logged in as: $(whoami)"
echo "My home directory is: $HOME"
```

Save and exit nano: press `Ctrl + O`, then Enter, then `Ctrl + X`.

**Step 2:** Try running it directly:

```bash
~/linux-practice/scripts/hello.sh
```

Expected error:
```
-bash: /home/jahid/linux-practice/scripts/hello.sh: Permission denied
```

The file exists but is not executable yet.

**Step 3:** Make it executable:

```bash
chmod +x ~/linux-practice/scripts/hello.sh
```

**Step 4:** Run it again:

```bash
~/linux-practice/scripts/hello.sh
```

Expected output:
```
Hello, World!
Today is: Thu Jun 20 14:32:01 UTC 2024
I am logged in as: jahid
My home directory is: /home/jahid
```

**Reflect:** What does `$(date)` do? What does `$HOME` do? What's the difference?

---

## Exercise 8.2 — Variables and Arguments

**Step 1:** Create a script that accepts arguments:

```bash
nano ~/linux-practice/scripts/greet.sh
```

Content:

```bash
#!/bin/bash

# Check that exactly one argument was provided
if [ $# -ne 1 ]; then
    echo "Usage: $0 <name>"
    echo "Example: $0 Alice"
    exit 1
fi

NAME=$1
echo "Hello, $NAME!"
echo "You were greeted at: $(date)"
```

Save, exit, make executable:

```bash
chmod +x ~/linux-practice/scripts/greet.sh
```

**Step 2:** Test it correctly:

```bash
~/linux-practice/scripts/greet.sh Jahid
```

Expected output:
```
Hello, Jahid!
You were greeted at: Thu Jun 20 14:32:01 UTC 2024
```

**Step 3:** Test the error handling by providing no argument:

```bash
~/linux-practice/scripts/greet.sh
```

Expected output:
```
Usage: /home/jahid/linux-practice/scripts/greet.sh <name>
Example: /home/jahid/linux-practice/scripts/greet.sh Alice
```

**Understand the script:**
- `$#` holds the number of arguments
- `-ne 1` means "not equal to 1"
- `$0` is the script's own name
- `$1` is the first argument
- `exit 1` quits the script with an error code (non-zero = failure)

---

## Exercise 8.3 — Arithmetic

**Step 1:** Create a calculator script:

```bash
nano ~/linux-practice/scripts/calc.sh
```

Content:

```bash
#!/bin/bash

if [ $# -ne 2 ]; then
    echo "Usage: $0 <number1> <number2>"
    exit 1
fi

A=$1
B=$2

echo "Numbers: $A and $B"
echo "Addition:       $A + $B = $((A + B))"
echo "Subtraction:    $A - $B = $((A - B))"
echo "Multiplication: $A x $B = $((A * B))"

# Avoid division by zero
if [ $B -eq 0 ]; then
    echo "Division: cannot divide by zero"
else
    echo "Division:       $A / $B = $((A / B))"
    echo "Remainder:      $A % $B = $((A % B))"
fi
```

```bash
chmod +x ~/linux-practice/scripts/calc.sh
```

**Step 2:** Test it:

```bash
~/linux-practice/scripts/calc.sh 15 4
```

Expected output:
```
Numbers: 15 and 4
Addition:       15 + 4 = 19
Subtraction:    15 - 4 = 11
Multiplication: 15 x 4 = 60
Division:       15 / 4 = 3
Remainder:      15 % 4 = 3
```

Notice division gives `3` not `3.75` — bash only does integer math.

**Step 3:** Test the division-by-zero protection:

```bash
~/linux-practice/scripts/calc.sh 10 0
```

---

## Exercise 8.4 — Conditionals

**Step 1:** Create a script that checks if a file or directory exists:

```bash
nano ~/linux-practice/scripts/check-path.sh
```

Content:

```bash
#!/bin/bash

if [ $# -ne 1 ]; then
    echo "Usage: $0 <path>"
    exit 1
fi

PATH_TO_CHECK=$1

if [ -f "$PATH_TO_CHECK" ]; then
    echo "'$PATH_TO_CHECK' is a regular file."
    echo "Size: $(du -sh "$PATH_TO_CHECK" | cut -f1)"

elif [ -d "$PATH_TO_CHECK" ]; then
    echo "'$PATH_TO_CHECK' is a directory."
    FILE_COUNT=$(ls "$PATH_TO_CHECK" | wc -l)
    echo "It contains $FILE_COUNT items."

elif [ -e "$PATH_TO_CHECK" ]; then
    echo "'$PATH_TO_CHECK' exists but is neither a file nor a directory."

else
    echo "'$PATH_TO_CHECK' does not exist."
    exit 1
fi
```

```bash
chmod +x ~/linux-practice/scripts/check-path.sh
```

**Step 2:** Test it with several different paths:

```bash
~/linux-practice/scripts/check-path.sh /etc/passwd
~/linux-practice/scripts/check-path.sh /home
~/linux-practice/scripts/check-path.sh /tmp
~/linux-practice/scripts/check-path.sh /nonexistent/path
```

**Understand the conditions:**
- `-f` = is a regular file
- `-d` = is a directory
- `-e` = exists (any type)
- The `"quotes"` around `$PATH_TO_CHECK` are important — if the path has spaces, unquoted variables would break the command

---

## Exercise 8.5 — Loops

**Step 1:** Create a script that processes multiple files:

```bash
nano ~/linux-practice/scripts/file-report.sh
```

Content:

```bash
#!/bin/bash

# Use the provided directory, or default to current directory
DIRECTORY=${1:-.}

echo "============================="
echo "File Report for: $DIRECTORY"
echo "============================="

if [ ! -d "$DIRECTORY" ]; then
    echo "Error: '$DIRECTORY' is not a directory."
    exit 1
fi

COUNT=0
TOTAL_SIZE=0

for FILE in "$DIRECTORY"/*; do
    # Skip if no files match (empty directory)
    [ -e "$FILE" ] || continue

    if [ -f "$FILE" ]; then
        SIZE=$(wc -c < "$FILE")       # size in bytes
        echo "  FILE: $(basename "$FILE")  ($SIZE bytes)"
        COUNT=$((COUNT + 1))
        TOTAL_SIZE=$((TOTAL_SIZE + SIZE))
    elif [ -d "$FILE" ]; then
        echo "  DIR:  $(basename "$FILE")/"
    fi
done

echo "-----------------------------"
echo "Total files: $COUNT"
echo "Total size: $TOTAL_SIZE bytes"
```

```bash
chmod +x ~/linux-practice/scripts/file-report.sh
```

**Step 2:** Run it on your practice directory:

```bash
~/linux-practice/scripts/file-report.sh ~/linux-practice/notes/
```

**Step 3:** Run it without an argument (uses current directory):

```bash
cd ~/linux-practice/scripts/
~/linux-practice/scripts/file-report.sh
```

**Understand the loop:**
- `${1:-.}` means "use argument $1, but if it's empty, use `.` (current directory)"
- `for FILE in "$DIRECTORY"/*` loops over every item in the directory
- `[ -e "$FILE" ] || continue` — if the glob finds nothing, skip gracefully
- `basename "$FILE"` strips the directory prefix, leaving just the filename

---

## Exercise 8.6 — Functions

**Step 1:** Create a script with reusable functions:

```bash
nano ~/linux-practice/scripts/system-info.sh
```

Content:

```bash
#!/bin/bash

# A function that prints a formatted section header
print_header() {
    local TITLE=$1
    echo ""
    echo "=== $TITLE ==="
}

# A function that checks if a command exists
check_command() {
    local CMD=$1
    if command -v "$CMD" &>/dev/null; then
        echo "  [FOUND]   $CMD  →  $(which $CMD)"
    else
        echo "  [MISSING] $CMD"
    fi
}

# A function that prints a key=value pair
info_line() {
    printf "  %-20s %s\n" "$1:" "$2"
}

# ── Main script ──────────────────────────────────────────────────────────────

print_header "System"
info_line "Hostname"     "$(hostname)"
info_line "OS"           "$(grep PRETTY_NAME /etc/os-release | cut -d= -f2 | tr -d '"')"
info_line "Kernel"       "$(uname -r)"
info_line "Uptime"       "$(uptime -p)"
info_line "Current user" "$(whoami)"

print_header "Hardware"
info_line "CPU cores"    "$(nproc)"
info_line "RAM total"    "$(free -h | awk 'NR==2{print $2}')"
info_line "Disk (root)"  "$(df -h / | awk 'NR==2{print $2 " total, " $4 " free"}')"

print_header "Installed Tools"
check_command bash
check_command python3
check_command git
check_command curl
check_command docker
check_command nginx

echo ""
```

```bash
chmod +x ~/linux-practice/scripts/system-info.sh
~/linux-practice/scripts/system-info.sh
```

Expected output (example):
```
=== System ===
  Hostname:            mycomputer
  OS:                  Ubuntu 22.04.3 LTS
  Kernel:              6.5.0-41-generic
  Uptime:              up 3 days, 4 hours, 12 minutes
  Current user:        jahid

=== Hardware ===
  CPU cores:           4
  RAM total:           7.7G
  Disk (root):         50G total, 32G free

=== Installed Tools ===
  [FOUND]   bash  →  /usr/bin/bash
  [FOUND]   python3  →  /usr/bin/python3
  [MISSING] docker
  ...
```

**Understand the functions:**
- `local TITLE=$1` — `local` makes the variable private to the function
- `command -v "$CMD"` — checks if a command exists (better than `which` for this)
- `&>/dev/null` — discards both standard output and error output
- `printf "%-20s %s\n"` — formatted printing: `%-20s` = left-aligned, 20 chars wide

---

## Challenge — A Useful Script From Scratch

Write a script called `~/linux-practice/scripts/user-report.sh` that:

1. Reads `/etc/passwd` and lists only "real" users (UID 1000 or above)
2. For each user, prints:
   - Username
   - Their home directory
   - Whether the home directory exists (`[EXISTS]` or `[MISSING]`)
3. At the end, prints the total number of real users

**Expected output format:**
```
=== Real User Accounts ===
  jahid        /home/jahid     [EXISTS]
  alice        /home/alice     [MISSING]
=========================
Total: 2 real user(s)
```

**Hints:**
- `awk -F: '$3 >= 1000 {print $1, $6}' /etc/passwd` prints username and home directory for real users
- Use a `while read` loop to process each line
- Use `[ -d "$HOME_DIR" ]` to check if the directory exists

---

**Navigation:** ← [Exercise 07](07-networking.md) | [Exercises Index](README.md) | Next → [Exercise 09](09-system-monitoring.md)
**Note:** [08 — Shell Scripting](../01-notes/08-shell-scripting.md)
