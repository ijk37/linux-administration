# Exercise 08-02 — Shell Scripting: Conditionals

**Navigation:** ← [Exercise 08-01](08-01-shell-scripting-basics-exe.md) | [Exercises Index](README.md) | Next → [Exercise 08-03](08-03-shell-scripting-loops-exe.md)
**Note:** [08-02 — Conditionals](../01-notes/08-02-shell-scripting-conditionals.md)

---

## Before You Start

Read [Note 08-02](../01-notes/08-02-shell-scripting-conditionals.md) first.

All scripts go in `~/linux-practice/scripts/`.

---

## Exercise 8.4 — Check If a Path Exists

**Step 1:** Create the script:

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

**Step 2:** Test it with several paths:

```bash
~/linux-practice/scripts/check-path.sh /etc/passwd
~/linux-practice/scripts/check-path.sh /home
~/linux-practice/scripts/check-path.sh /tmp
~/linux-practice/scripts/check-path.sh /nonexistent/path
```

Expected outputs (one per run):
```
'/etc/passwd' is a regular file.
Size: 4.0K

'/home' is a directory.
It contains 1 items.

'/tmp' is a directory.
It contains 14 items.

'/nonexistent/path' does not exist.
```

**Understand the conditions:**
- `-f` = is a regular file
- `-d` = is a directory
- `-e` = exists (any type — file, directory, symlink, device, etc.)
- The `"quotes"` around `$PATH_TO_CHECK` — if the path contains spaces, an unquoted variable would split into separate words and break the test

**Reflect:** Why does the script check `-f` before `-e`? What would happen if `-e` were checked first?

---

## Exercise 8.5 — Number Comparisons

**Step 1:** Create a grade calculator:

```bash
nano ~/linux-practice/scripts/grade.sh
```

Content:

```bash
#!/bin/bash

if [ $# -ne 1 ]; then
    echo "Usage: $0 <score (0-100)>"
    exit 1
fi

SCORE=$1

# Validate: must be a number between 0 and 100
if [ $SCORE -lt 0 ] || [ $SCORE -gt 100 ]; then
    echo "Error: score must be between 0 and 100"
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

echo "Score: $SCORE/100"
```

```bash
chmod +x ~/linux-practice/scripts/grade.sh
```

**Step 2:** Test several scores:

```bash
~/linux-practice/scripts/grade.sh 95
~/linux-practice/scripts/grade.sh 82
~/linux-practice/scripts/grade.sh 55
~/linux-practice/scripts/grade.sh 101
```

Expected output for `82`:
```
Grade: B
Score: 82/100
```

Expected output for `101`:
```
Error: score must be between 0 and 100
```

**Understand the validation:**
- `[ $SCORE -lt 0 ] || [ $SCORE -gt 100 ]` — the `||` means OR: if either side is true, the whole condition is true
- The `elif` chain stops at the first true condition — once `$SCORE -ge 80` matches, it won't check the remaining conditions

---

## Exercise 8.6 — String Comparisons

**Step 1:** Create a script that reacts to a user's answer:

```bash
nano ~/linux-practice/scripts/ask.sh
```

Content:

```bash
#!/bin/bash

read -p "Do you want to continue? (yes/no): " ANSWER

if [ -z "$ANSWER" ]; then
    echo "You didn't type anything. Defaulting to 'no'."
    exit 0
fi

# Convert to lowercase so "YES", "Yes", "yes" all work
ANSWER=$(echo "$ANSWER" | tr '[:upper:]' '[:lower:]')

if [ "$ANSWER" = "yes" ] || [ "$ANSWER" = "y" ]; then
    echo "Great! Continuing..."
elif [ "$ANSWER" = "no" ] || [ "$ANSWER" = "n" ]; then
    echo "OK, stopping."
    exit 0
else
    echo "I don't understand '$ANSWER'. Please type yes or no."
    exit 1
fi
```

```bash
chmod +x ~/linux-practice/scripts/ask.sh
```

**Step 2:** Run it and try different inputs:

```bash
~/linux-practice/scripts/ask.sh
```

Try: `yes`, `YES`, `y`, `no`, `n`, `maybe`, (press Enter without typing)

**Understand the string handling:**
- `-z "$ANSWER"` — true if the string is empty (user pressed Enter without typing)
- `echo "$ANSWER" | tr '[:upper:]' '[:lower:]'` — converts the string to all lowercase so comparisons don't need to handle every capitalisation
- Always quote string variables in comparisons: `"$ANSWER"` not `$ANSWER`

---

## Challenge — System Requirement Checker

Write `~/linux-practice/scripts/check-system.sh` that checks all of the following and prints PASS or FAIL for each:

1. Is there at least 100MB of free disk space on `/`?
   - `df / | awk 'NR==2{print $4}'` gives free space in 1K blocks
2. Is there at least 256MB of free RAM?
   - `free | awk 'NR==2{print $7}'` gives available RAM in KB
3. Does the file `/etc/ssh/sshd_config` exist?
4. Is `bash` version 4 or higher? (`bash --version | awk 'NR==1{print $4}'` gives the version string)

Expected output format:
```
[PASS] Disk space: 8.2G free
[FAIL] RAM: only 120MB available (need 256MB)
[PASS] sshd_config exists
[PASS] Bash version: 5.1.16
```

---

**Navigation:** ← [Exercise 08-01](08-01-shell-scripting-basics-exe.md) | [Exercises Index](README.md) | Next → [Exercise 08-03](08-03-shell-scripting-loops-exe.md)
**Note:** [08-02 — Conditionals](../01-notes/08-02-shell-scripting-conditionals.md)
