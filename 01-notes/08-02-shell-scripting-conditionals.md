# 08-02 — Shell Scripting: Conditionals

**Navigation:** ← [08-01 — Shell Scripting: Basics](08-01-shell-scripting-basics.md) | [Notes Index](README.md) | Next → [08-03 — Shell Scripting: Loops](08-03-shell-scripting-loops.md)
**Exercise:** [Exercise 08-02](../02-exercises/08-02-shell-scripting-conditionals-exe.md)

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

---

## Comparison Operators

### For numbers

| Operator | Meaning |
|----------|---------|
| `-eq` | equal to |
| `-ne` | not equal to |
| `-lt` | less than |
| `-le` | less than or equal to |
| `-gt` | greater than |
| `-ge` | greater than or equal to |

```bash
if [ $AGE -ge 18 ]; then
    echo "Adult"
fi
```

### For strings

| Operator | Meaning |
|----------|---------|
| `=` | strings are equal |
| `!=` | strings are not equal |
| `-z "$var"` | string is empty |
| `-n "$var"` | string is not empty |

```bash
if [ "$NAME" = "root" ]; then
    echo "You are root"
fi

if [ -z "$INPUT" ]; then
    echo "Nothing was entered"
fi
```

Always quote string variables: `"$NAME"` not `$NAME`. If the variable is empty or contains spaces, an unquoted variable will break the condition.

### For files

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

## Combining Conditions

Use `&&` (AND) and `||` (OR) to combine conditions:

```bash
if [ $AGE -ge 18 ] && [ $AGE -le 65 ]; then
    echo "Working age"
fi

if [ ! -f "$FILE" ]; then
    echo "File does not exist"
fi
```

`!` negates a condition — `[ ! -f "$FILE" ]` means "file does NOT exist".

---

## Practical Example — Script That Validates Input

```bash
#!/bin/bash

if [ $# -ne 1 ]; then
    echo "Usage: $0 <filename>"
    exit 1
fi

FILE=$1

if [ ! -e "$FILE" ]; then
    echo "Error: '$FILE' does not exist."
    exit 1
fi

if [ -f "$FILE" ]; then
    echo "'$FILE' is a regular file."
    echo "Size: $(du -sh "$FILE" | cut -f1)"
elif [ -d "$FILE" ]; then
    echo "'$FILE' is a directory."
    echo "Contains: $(ls "$FILE" | wc -l) items"
fi
```

---

**Navigation:** ← [08-01 — Shell Scripting: Basics](08-01-shell-scripting-basics.md) | [Notes Index](README.md) | Next → [08-03 — Shell Scripting: Loops](08-03-shell-scripting-loops.md)
**Exercise:** [Exercise 08-02](../02-exercises/08-02-shell-scripting-conditionals-exe.md)
