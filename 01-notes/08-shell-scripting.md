# 08 — Shell Scripting

**Navigation:** ← [07 — Networking](07-networking.md) | [Notes Index](README.md) | Next → [09 — System Monitoring](09-system-monitoring.md)
**Exercise:** [Exercise 08](../02-exercises/08-shell-scripting-exe.md)

---

## What is Shell Scripting?

So far you've been typing commands one at a time. A **shell script** is just a text file full of commands that run one after another automatically. Scripts let you:

- Automate repetitive tasks (backups, deployments)
- Combine multiple commands into one reusable tool
- Schedule tasks to run without you being present

If you find yourself typing the same sequence of commands more than twice, it's worth making a script.

---

## Your First Script

Create a file called `hello.sh`:

```bash
#!/bin/bash
echo "Hello, World!"
echo "Today is: $(date)"
echo "Running as: $(whoami)"
```

The very first line `#!/bin/bash` is called the **shebang**. It tells Linux which program should read and run this script (`/bin/bash` in this case). Always include this line.

Now make the script executable and run it:

```bash
chmod +x hello.sh    # make it runnable
./hello.sh           # run it
```

The `./` means "run this file from the current directory". You need it because Linux doesn't look in the current directory for programs by default (for security reasons).

**Output:**
```
Hello, World!
Today is: Thu Jun 20 14:32:01 UTC 2024
Running as: jahid
```

Notice `$(date)` — the `$()` syntax runs a command and substitutes its output inline. So `"Today is: $(date)"` becomes `"Today is: Thu Jun 20..."`.

---

## Variables

Variables store values so you can reuse them.

```bash
#!/bin/bash

NAME="Jahid"
AGE=25

echo "Hello, $NAME"
echo "You are $AGE years old"
```

**Rules for variables:**
- No spaces around the `=` sign. `NAME = "Jahid"` is wrong. `NAME="Jahid"` is correct.
- When assigning: write `NAME="Jahid"` (no dollar sign)
- When using the value: write `$NAME` (with dollar sign)

### Command substitution — capture command output into a variable

```bash
CURRENT_DATE=$(date +%Y-%m-%d)
echo "The date is: $CURRENT_DATE"
```

Whatever `date +%Y-%m-%d` prints gets stored in the variable.

### Special built-in variables

These are automatically set by bash:

| Variable | What it contains |
|----------|-----------------|
| `$0` | The name of the script itself |
| `$1`, `$2`, `$3`... | Arguments passed to the script |
| `$#` | The total number of arguments |
| `$@` | All arguments as a list |
| `$?` | The exit code of the last command (0 = success, non-zero = error) |
| `$$` | The PID of the current script |
| `$USER` | Your username |
| `$HOME` | Your home directory |

**Example using arguments:**

```bash
#!/bin/bash
echo "Script name: $0"
echo "First argument: $1"
echo "Second argument: $2"
echo "Total arguments: $#"
```

Run it with: `./myscript.sh hello world`

Output:
```
Script name: ./myscript.sh
First argument: hello
Second argument: world
Total arguments: 2
```

---

## Reading User Input

```bash
#!/bin/bash

read -p "Enter your name: " NAME
echo "Hello, $NAME!"
```

`read` waits for the user to type something and press Enter. `-p` is the "prompt" text shown to the user.

```bash
read -sp "Enter password: " PASS
echo ""    # print a blank line after (the password was hidden)
```

`-s` means "silent" — the input is hidden (like a real password prompt).

---

## Arithmetic

Bash can do basic math using `$(( ))`:

```bash
A=10
B=3

echo $((A + B))    # 13
echo $((A - B))    # 7
echo $((A * B))    # 30
echo $((A / B))    # 3  (integer division — decimal is dropped)
echo $((A % B))    # 1  (the remainder: 10 ÷ 3 = 3 with remainder 1)
```

Note: bash only does **integer math**. For decimals, use `bc`:

```bash
echo "scale=2; 10 / 3" | bc    # prints 3.33
```

---

## Conditionals — if / elif / else

An `if` statement runs code only when a condition is true.

```bash
#!/bin/bash

if [ $1 -gt 10 ]; then
    echo "Greater than 10"
elif [ $1 -eq 10 ]; then
    echo "Equal to 10"
else
    echo "Less than 10"
fi
```

Structure:
- `if [ condition ]; then` — start
- `elif [ condition ]; then` — else-if (optional, can have many)
- `else` — runs if nothing above matched (optional)
- `fi` — ends the if block (`fi` is `if` backwards)

The `[ ]` is the test command. **Always put spaces inside the brackets:** `[ $A -gt 10 ]` is correct. `[$A -gt 10]` will fail.

### Comparison operators

**For numbers:**

| Operator | Meaning |
|----------|---------|
| `-eq` | equal to |
| `-ne` | not equal to |
| `-lt` | less than |
| `-le` | less than or equal to |
| `-gt` | greater than |
| `-ge` | greater than or equal to |

**For strings:**

| Operator | Meaning |
|----------|---------|
| `=` | strings are equal |
| `!=` | strings are not equal |
| `-z "$var"` | string is empty |
| `-n "$var"` | string is not empty |

**For files:**

| Operator | Meaning |
|----------|---------|
| `-f file` | file exists and is a regular file |
| `-d file` | file exists and is a directory |
| `-e file` | file or directory exists |
| `-r file` | file exists and is readable |
| `-x file` | file exists and is executable |
| `-s file` | file exists and is not empty |

```bash
if [ -f /etc/passwd ]; then
    echo "The file exists"
fi

if [ -d /home ]; then
    echo "The directory exists"
fi
```

---

## Loops

### `for` loop — repeat for each item in a list

```bash
for FRUIT in apple banana cherry; do
    echo "I like $FRUIT"
done
```

Output:
```
I like apple
I like banana
I like cherry
```

Loop over a range of numbers:

```bash
for i in {1..5}; do
    echo "Number: $i"
done
```

Loop over files:

```bash
for FILE in /var/log/*.log; do
    echo "Found log file: $FILE"
done
```

The `*` is a wildcard — matches any filename ending in `.log`.

---

### `while` loop — repeat while a condition is true

```bash
COUNT=1
while [ $COUNT -le 5 ]; do
    echo "Count: $COUNT"
    ((COUNT++))    # add 1 to COUNT each iteration
done
```

Output:
```
Count: 1
Count: 2
Count: 3
Count: 4
Count: 5
```

A common use: wait for a service to be ready:

```bash
while ! nc -zv localhost 80 2>/dev/null; do
    echo "Waiting for web server..."
    sleep 2
done
echo "Web server is ready!"
```

---

### `break` and `continue`

- `break` — exit the loop immediately
- `continue` — skip the rest of this iteration and go to the next

```bash
for i in {1..10}; do
    [ $i -eq 5 ] && continue    # skip 5
    [ $i -eq 8 ] && break       # stop the loop at 8
    echo $i
done
```

Output: `1 2 3 4 6 7`

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

`local` means the variable only exists inside the function — it doesn't interfere with variables in the rest of the script.

### Returning values from functions

`return` can only return a number (0–255, used as an exit code). To return a string, `echo` it and capture it:

```bash
add() {
    echo $(( $1 + $2 ))
}

RESULT=$(add 5 3)
echo "5 + 3 = $RESULT"
```

Output: `5 + 3 = 8`

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

### `set -e` — Exit on error

Add this near the top of your scripts:

```bash
set -e
```

With this set, the entire script stops immediately if any command fails. Without it, the script keeps running even after errors, which can cause serious problems.

Combined with two other useful options:

```bash
set -euo pipefail
```

- `-e` — exit on error
- `-u` — treat unset variables as an error (catches typos like `$USERNME` instead of `$USERNAME`)
- `-o pipefail` — if any command in a pipeline fails, the whole pipeline is considered failed

This combination is recommended for all scripts.

---

## Practical Example — Backup Script

Here's a complete, real-world script that puts everything together:

```bash
#!/bin/bash
# backup.sh — Back up a directory with a timestamp

set -euo pipefail

# Variables
SOURCE=${1:-"/home/jahid"}      # use argument, or default to /home/jahid
DEST=${2:-"/backup"}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ARCHIVE="$DEST/backup_$TIMESTAMP.tar.gz"

# Check that the source exists
if [ ! -d "$SOURCE" ]; then
    echo "Error: '$SOURCE' is not a directory."
    exit 1
fi

# Create the destination if it doesn't exist
mkdir -p "$DEST"

echo "Backing up: $SOURCE"
echo "Saving to:  $ARCHIVE"

tar -czf "$ARCHIVE" "$SOURCE"

echo "Done! Archive size: $(du -sh "$ARCHIVE" | cut -f1)"
```

Run it:
```bash
chmod +x backup.sh
./backup.sh                           # backs up /home/jahid to /backup
./backup.sh /var/www /backups/web     # custom source and destination
```

---

**Navigation:** ← [07 — Networking](07-networking.md) | [Notes Index](README.md) | Next → [09 — System Monitoring](09-system-monitoring.md)
**Exercise:** [Exercise 08](../02-exercises/08-shell-scripting-exe.md)
