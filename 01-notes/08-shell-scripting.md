# 08 — Shell Scripting

**Navigation:** ← [07 — Networking](07-networking.md) | [Notes Index](README.md) | Next → [09 — System Monitoring](09-system-monitoring.md)
**Exercise:** [Exercise 08](../02-exercises/08-shell-scripting.md)

---

## What is Shell Scripting?

A shell script is a text file containing a sequence of shell commands. Scripts automate repetitive tasks, system administration, and deployment workflows.

---

## Your First Script

```bash
#!/bin/bash
# This is a comment

echo "Hello, World!"
echo "Today is: $(date)"
echo "Running as: $(whoami)"
```

```bash
# Save as hello.sh, then make executable
chmod +x hello.sh

# Run it
./hello.sh
bash hello.sh
```

The `#!/bin/bash` line is the **shebang** — it tells the system which interpreter to use.

---

## Variables

```bash
#!/bin/bash

# Assign (no spaces around =)
NAME="Jahid"
AGE=25
FILES=$(ls /home)       # command substitution

# Use variables with $
echo "Hello, $NAME"
echo "You are $AGE years old"
echo "Files: $FILES"

# Read-only variable
readonly PI=3.14

# Unset a variable
unset AGE
```

### Special Variables

| Variable | Meaning |
|----------|---------|
| `$0` | Script name |
| `$1`, `$2`, ... | Positional arguments |
| `$#` | Number of arguments |
| `$@` | All arguments (as separate words) |
| `$*` | All arguments (as one string) |
| `$?` | Exit status of last command |
| `$$` | PID of current script |
| `$!` | PID of last background job |

```bash
#!/bin/bash
echo "Script: $0"
echo "First arg: $1"
echo "All args: $@"
echo "Arg count: $#"
```

---

## User Input

```bash
#!/bin/bash

read -p "Enter your name: " NAME
echo "Hello, $NAME!"

# Silent input (for passwords)
read -sp "Enter password: " PASS
echo ""    # newline after hidden input

# With a timeout
read -t 10 -p "Quick! Enter something: " INPUT
```

---

## Arithmetic

```bash
#!/bin/bash

A=10
B=3

# Using $(( ))
echo $((A + B))    # 13
echo $((A - B))    # 7
echo $((A * B))    # 30
echo $((A / B))    # 3  (integer division)
echo $((A % B))    # 1  (remainder)
echo $((A ** B))   # 1000

# Increment
((A++))
((A += 5))

# Using expr (legacy)
expr $A + $B
```

---

## Conditionals

```bash
#!/bin/bash

# if / elif / else
if [ $1 -gt 10 ]; then
    echo "Greater than 10"
elif [ $1 -eq 10 ]; then
    echo "Equal to 10"
else
    echo "Less than 10"
fi

# String comparison
if [ "$NAME" = "root" ]; then
    echo "You are root"
fi

# File tests
if [ -f /etc/passwd ]; then
    echo "File exists"
fi

if [ -d /home ]; then
    echo "Directory exists"
fi
```

### Test Operators

**Numeric:**

| Operator | Meaning |
|----------|---------|
| `-eq` | Equal |
| `-ne` | Not equal |
| `-lt` | Less than |
| `-le` | Less than or equal |
| `-gt` | Greater than |
| `-ge` | Greater than or equal |

**String:**

| Operator | Meaning |
|----------|---------|
| `=` or `==` | Equal |
| `!=` | Not equal |
| `-z` | Empty string |
| `-n` | Non-empty string |

**File:**

| Operator | Meaning |
|----------|---------|
| `-f` | Is a regular file |
| `-d` | Is a directory |
| `-e` | Exists |
| `-r` | Readable |
| `-w` | Writable |
| `-x` | Executable |
| `-s` | Non-empty file |

---

## Loops

```bash
#!/bin/bash

# for loop over a list
for FRUIT in apple banana cherry; do
    echo "Fruit: $FRUIT"
done

# for loop with range
for i in {1..5}; do
    echo "Count: $i"
done

# C-style for loop
for ((i=0; i<5; i++)); do
    echo "i = $i"
done

# while loop
COUNT=0
while [ $COUNT -lt 5 ]; do
    echo "Count: $COUNT"
    ((COUNT++))
done

# until loop (opposite of while)
until [ $COUNT -ge 5 ]; do
    echo "Count: $COUNT"
    ((COUNT++))
done

# Loop over files
for FILE in /var/log/*.log; do
    echo "Log file: $FILE"
done

# break and continue
for i in {1..10}; do
    [ $i -eq 5 ] && continue    # skip 5
    [ $i -eq 8 ] && break       # stop at 8
    echo $i
done
```

---

## Functions

```bash
#!/bin/bash

# Define a function
greet() {
    local NAME=$1          # local variable
    echo "Hello, $NAME!"
    return 0
}

# Call it
greet "Jahid"
greet "Alice"

# Function with return value (use echo, not return)
add() {
    echo $(( $1 + $2 ))
}

RESULT=$(add 5 3)
echo "5 + 3 = $RESULT"
```

---

## Exit Codes & Error Handling

```bash
#!/bin/bash

# Exit codes: 0 = success, non-zero = failure
command_that_might_fail
if [ $? -ne 0 ]; then
    echo "Command failed!"
    exit 1
fi

# Exit on any error
set -e

# Exit on undefined variables
set -u

# Combine (recommended for scripts)
set -euo pipefail

# Trap errors
trap 'echo "Error on line $LINENO"; exit 1' ERR

# Run cleanup on exit
cleanup() {
    rm -f /tmp/myscript.lock
    echo "Cleaned up."
}
trap cleanup EXIT
```

---

## String Operations

```bash
#!/bin/bash

STR="Hello, World!"

# Length
echo ${#STR}              # 13

# Substring: ${var:start:length}
echo ${STR:0:5}           # Hello
echo ${STR:7}             # World!

# Replace first occurrence
echo ${STR/World/Linux}   # Hello, Linux!

# Replace all occurrences
echo ${STR//l/L}          # HeLLo, WorLd!

# Strip prefix
FILE="report_2024.txt"
echo ${FILE#report_}      # 2024.txt

# Strip suffix
echo ${FILE%.txt}         # report_2024

# Uppercase / lowercase
echo ${STR^^}             # HELLO, WORLD!
echo ${STR,,}             # hello, world!
```

---

## Practical Script Example

```bash
#!/bin/bash
# backup.sh — Back up a directory with a timestamp

set -euo pipefail

SOURCE=${1:-"/home/jahid"}
DEST=${2:-"/backup"}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ARCHIVE="$DEST/backup_$TIMESTAMP.tar.gz"

if [ ! -d "$SOURCE" ]; then
    echo "Error: Source directory '$SOURCE' does not exist."
    exit 1
fi

mkdir -p "$DEST"

echo "Backing up $SOURCE → $ARCHIVE"
tar -czf "$ARCHIVE" "$SOURCE"
echo "Backup complete: $ARCHIVE ($(du -sh "$ARCHIVE" | cut -f1))"
```

---

**Navigation:** ← [07 — Networking](07-networking.md) | [Notes Index](README.md) | Next → [09 — System Monitoring](09-system-monitoring.md)
**Exercise:** [Exercise 08](../02-exercises/08-shell-scripting.md)
