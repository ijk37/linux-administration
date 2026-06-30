# Exercise 08-03 — Shell Scripting: Loops

**Navigation:** ← [Exercise 08-02](08-02-shell-scripting-conditionals-exe.md) | [Exercises Index](README.md) | Next → [Exercise 08-04](08-04-shell-scripting-functions-exe.md)
**Note:** [08-03 — Shell Scripting: Loops](../01-notes/08-03-shell-scripting-loops.md)

---

## Before You Start

Read [Note 08-03](../01-notes/08-03-shell-scripting-loops.md) first.

All scripts go in `~/linux-practice/scripts/`.

---

## Exercise 8.7 — `for` Loop Over a List

**Step 1:** Create a script that processes a list of names:

```bash
nano ~/linux-practice/scripts/greet-all.sh
```

Content:

```bash
#!/bin/bash

NAMES="Alice Bob Charlie Diana"

for NAME in $NAMES; do
    echo "Hello, $NAME!"
done

echo "---"
echo "Total greeted: $#... wait, that's not right."
echo "The list had $(echo $NAMES | wc -w) names."
```

```bash
chmod +x ~/linux-practice/scripts/greet-all.sh
~/linux-practice/scripts/greet-all.sh
```

Expected output:
```
Hello, Alice!
Hello, Bob!
Hello, Charlie!
Hello, Diana!
---
Total greeted: 0... wait, that's not right.
The list had 4 names.
```

**Understand:** `$#` counts arguments passed to the *script*, not items in a variable. To count words in a variable, pipe to `wc -w`.

---

## Exercise 8.8 — `for` Loop Over a Number Range

**Step 1:** Create a multiplication table script:

```bash
nano ~/linux-practice/scripts/times-table.sh
```

Content:

```bash
#!/bin/bash

if [ $# -ne 1 ]; then
    echo "Usage: $0 <number>"
    exit 1
fi

N=$1
echo "=== Multiplication table for $N ==="

for i in {1..10}; do
    RESULT=$((N * i))
    printf "%2d x %2d = %3d\n" $N $i $RESULT
done
```

```bash
chmod +x ~/linux-practice/scripts/times-table.sh
~/linux-practice/scripts/times-table.sh 7
```

Expected output:
```
=== Multiplication table for 7 ===
 7 x  1 =   7
 7 x  2 =  14
 7 x  3 =  21
 7 x  4 =  28
 7 x  5 =  35
 7 x  6 =  42
 7 x  7 =  49
 7 x  8 =  56
 7 x  9 =  63
 7 x 10 =  70
```

**Understand `printf`:**
- `printf "%2d x %2d = %3d\n"` — formatted output, like in C
- `%2d` — print an integer in a field 2 characters wide (padded with spaces on the left)
- `%3d` — same but 3 characters wide
- This makes columns align neatly

---

## Exercise 8.9 — `for` Loop Over Files

**Step 1:** First create some test files:

```bash
mkdir -p ~/linux-practice/test-files
for i in {1..5}; do
    echo "This is file $i" > ~/linux-practice/test-files/file$i.txt
done
echo "binary data" > ~/linux-practice/test-files/data.bin
```

**Step 2:** Create a script that reports on `.txt` files only:

```bash
nano ~/linux-practice/scripts/txt-report.sh
```

Content:

```bash
#!/bin/bash

DIR=${1:-~/linux-practice/test-files}
COUNT=0

echo "Text files in: $DIR"
echo "-------------------"

for FILE in "$DIR"/*.txt; do
    [ -e "$FILE" ] || { echo "No .txt files found."; exit 0; }

    LINES=$(wc -l < "$FILE")
    SIZE=$(wc -c < "$FILE")
    echo "$(basename "$FILE"):  $LINES line(s), $SIZE bytes"
    ((COUNT++))
done

echo "-------------------"
echo "Total: $COUNT file(s)"
```

```bash
chmod +x ~/linux-practice/scripts/txt-report.sh
~/linux-practice/scripts/txt-report.sh
```

Expected output:
```
Text files in: /home/jahid/linux-practice/test-files
-------------------
file1.txt:  1 line(s), 16 bytes
file2.txt:  1 line(s), 16 bytes
file3.txt:  1 line(s), 16 bytes
file4.txt:  1 line(s), 16 bytes
file5.txt:  1 line(s), 16 bytes
-------------------
Total: 5 file(s)
```

Notice `data.bin` was skipped — the glob `*.txt` only matches `.txt` files.

---

## Exercise 8.10 — `while` Loop

**Step 1:** Create a countdown timer:

```bash
nano ~/linux-practice/scripts/countdown.sh
```

Content:

```bash
#!/bin/bash

if [ $# -ne 1 ]; then
    echo "Usage: $0 <seconds>"
    exit 1
fi

COUNT=$1

while [ $COUNT -gt 0 ]; do
    echo "T-minus $COUNT..."
    sleep 1
    ((COUNT--))
done

echo "Liftoff!"
```

```bash
chmod +x ~/linux-practice/scripts/countdown.sh
~/linux-practice/scripts/countdown.sh 5
```

Expected output (one line per second):
```
T-minus 5...
T-minus 4...
T-minus 3...
T-minus 2...
T-minus 1...
Liftoff!
```

**Understand `((COUNT--))`:** Subtracts 1 from COUNT each iteration. Without this, COUNT never changes and the loop runs forever. Press `Ctrl + C` to stop a runaway loop.

---

## Exercise 8.11 — Read a File Line by Line

**Step 1:** Create a script that reads `/etc/passwd` and shows only real users (UID ≥ 1000):

```bash
nano ~/linux-practice/scripts/list-users.sh
```

Content:

```bash
#!/bin/bash

echo "Real user accounts on this system:"
echo "==================================="

while IFS=: read USERNAME PASSWORD UID GID COMMENT HOME SHELL; do
    if [ "$UID" -ge 1000 ] && [ "$UID" -ne 65534 ]; then
        printf "  %-15s  home: %s\n" "$USERNAME" "$HOME"
    fi
done < /etc/passwd
```

```bash
chmod +x ~/linux-practice/scripts/list-users.sh
~/linux-practice/scripts/list-users.sh
```

Expected output (your users will differ):
```
Real user accounts on this system:
===================================
  jahid            home: /home/jahid
```

**Understand `IFS=: read`:**
- `IFS=:` — sets the field separator to `:` for this `read` command
- Each field of the `/etc/passwd` line goes into a separate variable
- `/etc/passwd` format: `username:password:UID:GID:comment:home:shell`
- UID 65534 is the `nobody` user — excluded because it's a special system account

---

## Exercise 8.12 — `break` and `continue`

**Step 1:** Create a script that demonstrates both:

```bash
nano ~/linux-practice/scripts/skip-stop.sh
```

Content:

```bash
#!/bin/bash

echo "--- Skipping multiples of 3 (continue) ---"
for i in {1..10}; do
    if [ $((i % 3)) -eq 0 ]; then
        echo "  Skipping $i (multiple of 3)"
        continue
    fi
    echo "  Processing $i"
done

echo ""
echo "--- Stopping at first multiple of 7 (break) ---"
for i in {1..20}; do
    if [ $((i % 7)) -eq 0 ]; then
        echo "  Found multiple of 7: $i — stopping."
        break
    fi
    echo "  $i is not a multiple of 7"
done
```

```bash
chmod +x ~/linux-practice/scripts/skip-stop.sh
~/linux-practice/scripts/skip-stop.sh
```

**Predict before running:** Which numbers will be skipped in the first loop? Where will the second loop stop?

---

## Challenge — File Organizer

Write `~/linux-practice/scripts/organize.sh` that:

1. Accepts a directory as argument (default: current directory)
2. Loops over all files in that directory
3. Sorts each file into a subfolder based on its extension:
   - `.txt` → `text/`
   - `.sh` → `scripts/`
   - `.log` → `logs/`
   - anything else → `other/`
4. Prints each move: `Moved: filename.txt → text/`
5. At the end, prints a summary: how many files went into each folder

Test it on `~/linux-practice/test-files/` (add a few extra files with different extensions first).

**Hint:** `${FILE##*.}` extracts the extension from a filename.

---

**Navigation:** ← [Exercise 08-02](08-02-shell-scripting-conditionals-exe.md) | [Exercises Index](README.md) | Next → [Exercise 08-04](08-04-shell-scripting-functions-exe.md)
**Note:** [08-03 — Shell Scripting: Loops](../01-notes/08-03-shell-scripting-loops.md)
