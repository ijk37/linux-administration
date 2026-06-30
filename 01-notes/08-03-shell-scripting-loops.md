# 08-03 — Shell Scripting: Loops

**Navigation:** ← [08-02 — Shell Scripting: Conditionals](08-02-shell-scripting-conditionals.md) | [Notes Index](README.md) | Next → [08-04 — Shell Scripting: Functions](08-04-shell-scripting-functions.md)
**Exercise:** [Exercise 08-03](../02-exercises/08-03-shell-scripting-loops-exe.md)

---

## `for` Loop — Repeat for Each Item in a List

A `for` loop runs the same block of commands once for each item in a list.

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

Structure:
- `for VARIABLE in LIST; do` — VARIABLE gets each value from LIST in turn
- The commands between `do` and `done` run once per item
- `done` marks the end of the loop

### Loop over a range of numbers

```bash
for i in {1..5}; do
    echo "Number: $i"
done
```

Output:
```
Number: 1
Number: 2
Number: 3
Number: 4
Number: 5
```

`{1..5}` is a **brace expansion** — it automatically generates the sequence 1 2 3 4 5.

You can also step by 2:

```bash
for i in {0..10..2}; do
    echo $i
done
```

Output: `0 2 4 6 8 10`

### Loop over files

```bash
for FILE in /var/log/*.log; do
    echo "Found log file: $FILE"
done
```

The `*` is a wildcard — matches any filename ending in `.log`. The loop runs once per matching file.

### C-style for loop (like in C or Java)

```bash
for ((i=1; i<=5; i++)); do
    echo "i = $i"
done
```

This is equivalent to the `{1..5}` version but gives you more control over the step value.

---

## `while` Loop — Repeat While a Condition is True

A `while` loop keeps running as long as the condition stays true.

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

`((COUNT++))` is shorthand for "add 1 to COUNT". The loop checks the condition at the top before each iteration — once COUNT becomes 6, `[ 6 -le 5 ]` is false and the loop stops.

### Read a file line by line

A very common pattern — process each line of a file:

```bash
while read LINE; do
    echo "Line: $LINE"
done < /etc/passwd
```

`< /etc/passwd` feeds the file into the `while read` loop. Each iteration, `read` picks up the next line and stores it in `LINE`.

### Wait for something to be ready

```bash
while ! nc -zv localhost 80 2>/dev/null; do
    echo "Waiting for web server..."
    sleep 2
done
echo "Web server is ready!"
```

`!` negates the condition — "while the web server is NOT ready, keep waiting". Once `nc` succeeds (port 80 is open), the `!` makes the condition false and the loop exits.

---

## `until` Loop — Opposite of `while`

`until` runs as long as the condition is **false** (stops when it becomes true):

```bash
COUNT=1
until [ $COUNT -gt 5 ]; do
    echo "Count: $COUNT"
    ((COUNT++))
done
```

This produces the same output as the `while` example above. `until` is less common — use whichever reads more naturally for your condition.

---

## `break` and `continue`

- `break` — exit the loop immediately
- `continue` — skip the rest of this iteration and jump to the next

```bash
for i in {1..10}; do
    [ $i -eq 5 ] && continue    # skip 5
    [ $i -eq 8 ] && break       # stop the loop at 8
    echo $i
done
```

Output: `1 2 3 4 6 7`

- When `i=5`: `continue` is triggered, so `echo` is skipped, loop moves to `i=6`
- When `i=8`: `break` is triggered, the entire loop ends

### `&&` shorthand

`[ condition ] && command` is a shortcut for a one-line if:

```bash
[ $i -eq 5 ] && continue
# is the same as:
if [ $i -eq 5 ]; then
    continue
fi
```

---

## Looping Over Command Output

```bash
for USER in $(cut -d: -f1 /etc/passwd); do
    echo "User: $USER"
done
```

`$(cut -d: -f1 /etc/passwd)` extracts the first field (usernames) from `/etc/passwd` and the loop iterates over each username.

---

## Practical Example — Batch File Renamer

```bash
#!/bin/bash

# Rename all .txt files in current directory to .bak
COUNT=0

for FILE in *.txt; do
    [ -e "$FILE" ] || continue    # skip if no .txt files exist

    NEWNAME="${FILE%.txt}.bak"    # replace .txt extension with .bak
    mv "$FILE" "$NEWNAME"
    echo "Renamed: $FILE → $NEWNAME"
    ((COUNT++))
done

echo "Done. Renamed $COUNT file(s)."
```

`${FILE%.txt}` strips the `.txt` suffix from the filename — this is called **parameter expansion**.

---

**Navigation:** ← [08-02 — Shell Scripting: Conditionals](08-02-shell-scripting-conditionals.md) | [Notes Index](README.md) | Next → [08-04 — Shell Scripting: Functions](08-04-shell-scripting-functions.md)
**Exercise:** [Exercise 08-03](../02-exercises/08-03-shell-scripting-loops-exe.md)
