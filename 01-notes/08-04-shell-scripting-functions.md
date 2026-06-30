# 08-04 — Shell Scripting: Functions & Best Practices

**Navigation:** ← [08-03 — Shell Scripting: Loops](08-03-shell-scripting-loops.md) | [Notes Index](README.md) | Next → [09 — System Monitoring](09-system-monitoring.md)
**Exercise:** [Exercise 08-04](../02-exercises/08-04-shell-scripting-functions-exe.md)

---

## Functions

Functions let you group commands and reuse them. Define once, call many times.

```bash
#!/bin/bash

# Define a function
greet() {
    local NAME=$1     # $1 is the first argument passed to the function
    echo "Hello, $NAME!"
}

# Call the function
greet "Jahid"
greet "Alice"
```

Output:
```
Hello, Jahid!
Hello, Alice!
```

Structure:
- `functionname() {` — defines the function
- `}` — ends the function
- The function does nothing until you **call** it by name
- Arguments work the same way as script arguments: `$1`, `$2`, `$#`, etc. — but they refer to what was passed to the function, not the script

---

## `local` Variables

`local` makes a variable private to the function — it only exists inside it and doesn't interfere with the rest of the script.

```bash
#!/bin/bash

GREETING="Good morning"    # global variable

say_hello() {
    local GREETING="Hi"    # local — only exists inside this function
    echo "$GREETING, $1!"
}

say_hello "Jahid"
echo "$GREETING"           # still "Good morning" — not affected by the function
```

Output:
```
Hi, Jahid!
Good morning
```

Always use `local` for variables inside functions. Without it, the function variable would overwrite the global one, which is rarely what you want.

---

## Returning Values from Functions

`return` can only return a number (0–255), used as an exit code. To pass a string back from a function, `echo` it and capture it with `$()`:

```bash
add() {
    echo $(( $1 + $2 ))
}

RESULT=$(add 5 3)
echo "5 + 3 = $RESULT"
```

Output: `5 + 3 = 8`

### Returning a status (success/failure)

```bash
is_even() {
    if [ $(( $1 % 2 )) -eq 0 ]; then
        return 0    # success = even
    else
        return 1    # failure = odd
    fi
}

if is_even 4; then
    echo "4 is even"
fi

if ! is_even 7; then
    echo "7 is odd"
fi
```

By convention: `return 0` = success/true, `return 1` (or any non-zero) = failure/false.

---

## Exit Codes

Every command exits with a number called an **exit code**:
- `0` = success
- Any non-zero = failure (different numbers mean different errors)

You can check it with `$?`:

```bash
ls /nonexistent
echo "Exit code: $?"    # prints a non-zero number (usually 2)

ls /home
echo "Exit code: $?"    # prints 0 (success)
```

In scripts, you should check exit codes to detect failures:

```bash
cp important.txt /backup/
if [ $? -ne 0 ]; then
    echo "ERROR: Backup failed!"
    exit 1
fi
echo "Backup successful."
```

Set your own exit code with `exit N` at the end of a script. By convention, `exit 0` = success, `exit 1` = general error.

---

## `set -euo pipefail` — Safe Script Mode

Add this near the top of every script:

```bash
set -euo pipefail
```

What each option does:

| Option | What it does |
|--------|-------------|
| `-e` | Exit the script immediately if any command fails (non-zero exit code) |
| `-u` | Treat unset variables as an error — catches typos like `$USERNME` instead of `$USERNAME` |
| `-o pipefail` | If any command in a pipeline (`cmd1 \| cmd2`) fails, the whole pipeline is considered failed |

Without `-e`, your script keeps running even after errors, which can cause serious problems (e.g., a failed backup command followed by deletion of the source).

---

## Practical Example — Backup Script

Here's a complete, real-world script that puts everything together:

```bash
#!/bin/bash
# backup.sh — Back up a directory with a timestamp

set -euo pipefail

# ── Functions ─────────────────────────────────────────────────────────────────

log() {
    echo "[$(date +%H:%M:%S)] $1"
}

die() {
    echo "ERROR: $1" >&2
    exit 1
}

# ── Main ──────────────────────────────────────────────────────────────────────

SOURCE=${1:-"/home/jahid"}      # use argument, or default to /home/jahid
DEST=${2:-"/backup"}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ARCHIVE="$DEST/backup_$TIMESTAMP.tar.gz"

[ -d "$SOURCE" ] || die "'$SOURCE' is not a directory."

mkdir -p "$DEST"

log "Backing up: $SOURCE"
log "Saving to:  $ARCHIVE"

tar -czf "$ARCHIVE" "$SOURCE"

log "Done! Archive size: $(du -sh "$ARCHIVE" | cut -f1)"
```

Run it:
```bash
chmod +x backup.sh
./backup.sh                           # backs up /home/jahid to /backup
./backup.sh /var/www /backups/web     # custom source and destination
```

What this script demonstrates:
- `set -euo pipefail` — safe mode at the top
- `log()` function for timestamped output
- `die()` function that prints to stderr (`>&2`) and exits with code 1
- `${1:-"/home/jahid"}` — default value if argument is missing
- `[ -d "$SOURCE" ] || die "..."` — validate input before proceeding

---

**Navigation:** ← [08-03 — Shell Scripting: Loops](08-03-shell-scripting-loops.md) | [Notes Index](README.md) | Next → [09 — System Monitoring](09-system-monitoring.md)
**Exercise:** [Exercise 08-04](../02-exercises/08-04-shell-scripting-functions-exe.md)
