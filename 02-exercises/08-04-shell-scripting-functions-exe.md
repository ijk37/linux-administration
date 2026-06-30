# Exercise 08-04 — Shell Scripting: Functions & Best Practices

**Navigation:** ← [Exercise 08-03](08-03-shell-scripting-loops-exe.md) | [Exercises Index](README.md) | Next → [Exercise 09](09-system-monitoring-exe.md)
**Note:** [08-04 — Shell Scripting: Functions](../01-notes/08-04-shell-scripting-functions.md)

---

## Before You Start

Read [Note 08-04](../01-notes/08-04-shell-scripting-functions.md) first.

All scripts go in `~/linux-practice/scripts/`.

---

## Exercise 8.13 — Your First Function

**Step 1:** Create a script with a simple function:

```bash
nano ~/linux-practice/scripts/functions-demo.sh
```

Content:

```bash
#!/bin/bash

# Define the function BEFORE calling it
print_section() {
    local TITLE=$1
    local WIDTH=40
    echo ""
    printf '=%.0s' $(seq 1 $WIDTH)
    echo ""
    echo "  $TITLE"
    printf '=%.0s' $(seq 1 $WIDTH)
    echo ""
}

# Now call the function
print_section "System Information"
echo "  Hostname: $(hostname)"
echo "  User:     $USER"

print_section "Disk Usage"
df -h / | tail -1

print_section "Memory"
free -h | grep Mem
```

```bash
chmod +x ~/linux-practice/scripts/functions-demo.sh
~/linux-practice/scripts/functions-demo.sh
```

Expected output:
```
========================================
  System Information
========================================
  Hostname: myserver
  User:     jahid

========================================
  Disk Usage
========================================
/dev/sda1        50G   18G   30G  38% /

========================================
  Memory
========================================
Mem:          7.7G    2.1G    3.2G    120M      2.4G       5.2G
```

**Understand:**
- Functions must be **defined before they are called** — bash reads top to bottom
- `local TITLE=$1` — the argument passed to the function lands in `$1` inside the function
- `local` keeps `TITLE` and `WIDTH` private — they won't clash with any variables outside the function

---

## Exercise 8.14 — Functions That Return Values

**Step 1:** Create a script where functions compute and return results:

```bash
nano ~/linux-practice/scripts/math-functions.sh
```

Content:

```bash
#!/bin/bash

# Returns the larger of two numbers
max() {
    if [ $1 -ge $2 ]; then
        echo $1
    else
        echo $2
    fi
}

# Returns the absolute value of a number
abs() {
    if [ $1 -lt 0 ]; then
        echo $(( -$1 ))
    else
        echo $1
    fi
}

# Returns 0 (true) if number is even, 1 (false) if odd
is_even() {
    [ $(( $1 % 2 )) -eq 0 ]
}

# ── Main ──────────────────────────────────────────────────────────────────────

BIGGEST=$(max 42 17)
echo "The larger of 42 and 17 is: $BIGGEST"

DIFF=$(( 42 - 17 ))
echo "Absolute value of -$DIFF is: $(abs -$DIFF)"

for n in 1 2 3 4 5 6; do
    if is_even $n; then
        echo "$n is even"
    else
        echo "$n is odd"
    fi
done
```

```bash
chmod +x ~/linux-practice/scripts/math-functions.sh
~/linux-practice/scripts/math-functions.sh
```

Expected output:
```
The larger of 42 and 17 is: 42
Absolute value of -25 is: 25
1 is odd
2 is even
3 is odd
4 is even
5 is odd
6 is even
```

**Understand the two ways to return from a function:**
- `echo $1` then `RESULT=$(max 42 17)` — returns a string/number by printing it
- `[ $(( $1 % 2 )) -eq 0 ]` — returns an exit code (0=true, 1=false); used directly in `if`

---

## Exercise 8.15 — `local` vs Global Variables

**Step 1:** See the difference in action:

```bash
nano ~/linux-practice/scripts/scope.sh
```

Content:

```bash
#!/bin/bash

COLOUR="blue"    # global variable

change_with_local() {
    local COLOUR="red"    # local — only changes inside this function
    echo "Inside function (local):  COLOUR = $COLOUR"
}

change_without_local() {
    COLOUR="green"        # no local — changes the global variable!
    echo "Inside function (global): COLOUR = $COLOUR"
}

echo "Before any function:       COLOUR = $COLOUR"
change_with_local
echo "After change_with_local:   COLOUR = $COLOUR"
change_without_local
echo "After change_without_local: COLOUR = $COLOUR"
```

```bash
chmod +x ~/linux-practice/scripts/scope.sh
~/linux-practice/scripts/scope.sh
```

Expected output:
```
Before any function:       COLOUR = blue
Inside function (local):  COLOUR = red
After change_with_local:   COLOUR = blue
Inside function (global): COLOUR = green
After change_without_local: COLOUR = green
```

**Key takeaway:** Always use `local` inside functions. Without it, a function can silently change a variable that the rest of your script depends on — a hard-to-find bug.

---

## Exercise 8.16 — `set -euo pipefail` in Action

**Step 1:** First, see what happens WITHOUT safe mode:

```bash
nano ~/linux-practice/scripts/unsafe.sh
```

Content:

```bash
#!/bin/bash
# NO set -euo pipefail

echo "Step 1: Starting..."
ls /this/does/not/exist     # this will fail
echo "Step 2: Still running after the error!"
echo "Step 3: Done."
```

```bash
chmod +x ~/linux-practice/scripts/unsafe.sh
~/linux-practice/scripts/unsafe.sh
```

Expected output:
```
Step 1: Starting...
ls: cannot access '/this/does/not/exist': No such file or directory
Step 2: Still running after the error!
Step 3: Done.
```

The script kept going even though a command failed. In a real backup or deploy script, this could cause serious damage.

**Step 2:** Now add safe mode:

```bash
nano ~/linux-practice/scripts/safe.sh
```

Content:

```bash
#!/bin/bash
set -euo pipefail

echo "Step 1: Starting..."
ls /this/does/not/exist     # this will fail
echo "Step 2: This will NOT run."
echo "Step 3: This will NOT run either."
```

```bash
chmod +x ~/linux-practice/scripts/safe.sh
~/linux-practice/scripts/safe.sh
```

Expected output:
```
Step 1: Starting...
ls: cannot access '/this/does/not/exist': No such file or directory
```

The script stopped immediately at the first failure. Step 2 and Step 3 never ran.

**Step 3:** Check the exit code:

```bash
~/linux-practice/scripts/safe.sh
echo "Exit code: $?"
```

A non-zero exit code tells the caller (or a CI system) that something went wrong.

---

## Exercise 8.17 — A Complete Script with Functions

**Step 1:** Create a full system-info script:

```bash
nano ~/linux-practice/scripts/system-info.sh
```

Content:

```bash
#!/bin/bash
set -euo pipefail

# ── Helper functions ──────────────────────────────────────────────────────────

print_header() {
    local TITLE=$1
    echo ""
    echo "=== $TITLE ==="
}

check_command() {
    local CMD=$1
    if command -v "$CMD" &>/dev/null; then
        echo "  [FOUND]   $CMD  →  $(which $CMD)"
    else
        echo "  [MISSING] $CMD"
    fi
}

info_line() {
    printf "  %-20s %s\n" "$1:" "$2"
}

# ── Main ──────────────────────────────────────────────────────────────────────

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
  Hostname:            myserver
  OS:                  Ubuntu 22.04.3 LTS
  Kernel:              6.5.0-41-generic
  Uptime:              up 3 days, 4 hours
  Current user:        jahid

=== Hardware ===
  CPU cores:           4
  RAM total:           7.7G
  Disk (root):         50G total, 32G free

=== Installed Tools ===
  [FOUND]   bash  →  /usr/bin/bash
  [FOUND]   python3  →  /usr/bin/python3
  [MISSING] docker
```

**Understand the functions:**
- `command -v "$CMD"` — the correct way to check if a command exists
- `&>/dev/null` — discards both stdout and stderr (we only care about the exit code)
- `printf "%-20s %s\n"` — `%-20s` = left-aligned, 20 characters wide; keeps all values in a tidy column

---

## Challenge — A Useful Script From Scratch

Write `~/linux-practice/scripts/user-report.sh` that:

1. Defines a function `check_user()` that accepts a username and prints:
   - Username
   - Home directory path
   - Whether the home directory exists (`[EXISTS]` or `[MISSING]`)
2. Reads `/etc/passwd`, finds real users (UID ≥ 1000), and calls `check_user()` for each
3. At the end, prints the total count

Expected output:
```
=== Real User Accounts ===
  jahid        /home/jahid     [EXISTS]
  alice        /home/alice     [MISSING]
===========================
Total: 2 real user(s)
```

**Hints:**
- `awk -F: '$3 >= 1000 {print $1, $6}' /etc/passwd` prints `username homedir` for real users
- Use `while read USERNAME HOMEDIR; do ... done` to process each line
- Call `check_user "$USERNAME" "$HOMEDIR"` inside the loop

---

**Navigation:** ← [Exercise 08-03](08-03-shell-scripting-loops-exe.md) | [Exercises Index](README.md) | Next → [Exercise 09](09-system-monitoring-exe.md)
**Note:** [08-04 — Shell Scripting: Functions](../01-notes/08-04-shell-scripting-functions.md)
