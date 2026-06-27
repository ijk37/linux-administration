# Exercise 08 — Shell Scripting

**Navigation:** ← [Exercise 07](07-networking.md) | [Exercises Index](README.md) | Next → [Exercise 09](09-system-monitoring.md)
**Note:** [08 — Shell Scripting](../01-notes/08-shell-scripting.md)

---

## Objectives

- Write and execute bash scripts
- Use variables, conditionals, loops, and functions
- Handle arguments and user input
- Practice error handling

---

## Exercise 8.1 — First Script

Create `~/scripts/hello.sh`:

```bash
mkdir -p ~/scripts

cat > ~/scripts/hello.sh << 'EOF'
#!/bin/bash
NAME=${1:-"World"}
echo "Hello, $NAME!"
echo "Script: $0"
echo "Date: $(date)"
EOF

chmod +x ~/scripts/hello.sh

# Run it
~/scripts/hello.sh
~/scripts/hello.sh "Jahid"
```

---

## Exercise 8.2 — Variables & Arithmetic

Create `~/scripts/calc.sh`:

```bash
cat > ~/scripts/calc.sh << 'EOF'
#!/bin/bash
A=$1
B=$2

if [ -z "$A" ] || [ -z "$B" ]; then
    echo "Usage: $0 <num1> <num2>"
    exit 1
fi

echo "A = $A, B = $B"
echo "Sum:        $((A + B))"
echo "Difference: $((A - B))"
echo "Product:    $((A * B))"
echo "Quotient:   $((A / B))"
echo "Remainder:  $((A % B))"
EOF

chmod +x ~/scripts/calc.sh
~/scripts/calc.sh 10 3
~/scripts/calc.sh 25 7
```

---

## Exercise 8.3 — Conditionals

Create `~/scripts/grade.sh` that takes a score and prints a grade:

```bash
cat > ~/scripts/grade.sh << 'EOF'
#!/bin/bash
SCORE=$1

if [ -z "$SCORE" ]; then
    echo "Usage: $0 <score 0-100>"
    exit 1
fi

if [ $SCORE -ge 90 ]; then
    echo "Grade: A"
elif [ $SCORE -ge 80 ]; then
    echo "Grade: B"
elif [ $SCORE -ge 70 ]; then
    echo "Grade: C"
elif [ $SCORE -ge 60 ]; then
    echo "Grade: D"
else
    echo "Grade: F"
fi
EOF

chmod +x ~/scripts/grade.sh
for score in 95 85 73 62 45; do
    echo -n "Score $score → "
    ~/scripts/grade.sh $score
done
```

---

## Exercise 8.4 — Loops

Create `~/scripts/file-report.sh` that loops through files in a directory:

```bash
cat > ~/scripts/file-report.sh << 'EOF'
#!/bin/bash
DIR=${1:-.}

echo "Files in $DIR:"
echo "----------------------------"

COUNT=0
for FILE in "$DIR"/*; do
    if [ -f "$FILE" ]; then
        SIZE=$(du -sh "$FILE" 2>/dev/null | cut -f1)
        echo "  $FILE ($SIZE)"
        ((COUNT++))
    fi
done

echo "----------------------------"
echo "Total files: $COUNT"
EOF

chmod +x ~/scripts/file-report.sh
~/scripts/file-report.sh ~/scripts/
~/scripts/file-report.sh /etc/
```

---

## Exercise 8.5 — Functions

Create `~/scripts/utils.sh`:

```bash
cat > ~/scripts/utils.sh << 'EOF'
#!/bin/bash

# Print a section header
header() {
    local TITLE=$1
    local LEN=${#TITLE}
    local LINE=$(printf '=%.0s' $(seq 1 $((LEN + 4))))
    echo "$LINE"
    echo "| $TITLE |"
    echo "$LINE"
}

# Check if a command exists
require() {
    local CMD=$1
    if ! command -v "$CMD" &>/dev/null; then
        echo "Error: '$CMD' is not installed."
        return 1
    fi
    echo "'$CMD' found at $(which $CMD)"
}

# Log a message with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

# Main
header "System Check"
log "Starting checks..."
require bash
require python3
require git
require docker
log "Done."
EOF

chmod +x ~/scripts/utils.sh
~/scripts/utils.sh
```

---

## Exercise 8.6 — Error Handling

Create `~/scripts/safe-copy.sh`:

```bash
cat > ~/scripts/safe-copy.sh << 'EOF'
#!/bin/bash
set -euo pipefail

SOURCE=$1
DEST=$2

# Validate arguments
if [ $# -ne 2 ]; then
    echo "Usage: $0 <source> <destination>"
    exit 1
fi

# Check source exists
if [ ! -e "$SOURCE" ]; then
    echo "Error: Source '$SOURCE' does not exist."
    exit 2
fi

# Check destination directory exists
DEST_DIR=$(dirname "$DEST")
if [ ! -d "$DEST_DIR" ]; then
    echo "Error: Destination directory '$DEST_DIR' does not exist."
    exit 3
fi

# Warn if destination exists
if [ -e "$DEST" ]; then
    echo "Warning: '$DEST' already exists. Overwriting."
fi

cp "$SOURCE" "$DEST"
echo "Copied '$SOURCE' → '$DEST'"
EOF

chmod +x ~/scripts/safe-copy.sh

# Test it
~/scripts/safe-copy.sh /etc/hostname /tmp/myhostname.txt
cat /tmp/myhostname.txt

# Test error handling
~/scripts/safe-copy.sh /nonexistent/file.txt /tmp/ || echo "Exit code: $?"
```

---

## Challenge

Write a script `~/scripts/user-report.sh` that:
1. Accepts no arguments
2. Lists all users with UID >= 1000 (regular users) from `/etc/passwd`
3. For each user, prints: username, home directory, and whether the home directory exists
4. Counts and prints the total number of regular users at the end

Example output:
```
=== Regular Users ===
jahid  /home/jahid  [EXISTS]
alice  /home/alice  [MISSING]
---
Total: 2 users
```

---

**Navigation:** ← [Exercise 07](07-networking.md) | [Exercises Index](README.md) | Next → [Exercise 09](09-system-monitoring.md)
**Note:** [08 — Shell Scripting](../01-notes/08-shell-scripting.md)
