# Exercise 08-01 — Shell Scripting: Basics

**Navigation:** ← [Exercise 07](07-networking-exe.md) | [Exercises Index](README.md) | Next → [Exercise 08-02](08-02-shell-scripting-conditionals-exe.md)
**Note:** [08-01 — Shell Scripting: Basics](../01-notes/08-01-shell-scripting-basics.md)

---

## Before You Start

Read [Note 08-01](../01-notes/08-01-shell-scripting-basics.md) first.

Create a working directory for all your scripts:

```bash
mkdir -p ~/linux-practice/scripts
```

---

## Exercise 8.1 — Your First Script

**Step 1:** Create the script file:

```bash
nano ~/linux-practice/scripts/hello.sh
```

Type this content:

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

The file exists but is not executable yet. Every new file is created without execute permission — you must grant it explicitly.

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

**Understand the script:**
- `#!/bin/bash` — the shebang; tells Linux to run this file with bash
- `$(date)` — runs the `date` command and inserts its output here
- `$(whoami)` — runs `whoami` and inserts the result
- `$HOME` — a built-in variable that holds your home directory path

**Reflect:** What is the difference between `$(whoami)` and `$HOME`? One runs a command, the other reads a variable — can you tell which is which?

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
- `$#` — the number of arguments passed to the script
- `-ne 1` — "not equal to 1"
- `$0` — the script's own name (used to show the user exactly how to call it)
- `$1` — the first argument
- `exit 1` — quit with error code 1 (non-zero = something went wrong)

**Step 4:** Try passing multiple arguments (the script should reject this too):

```bash
~/linux-practice/scripts/greet.sh Alice Bob
```

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

Notice division gives `3` not `3.75` — bash only does integer math. The decimal is simply dropped (not rounded).

**Step 3:** Test the division-by-zero protection:

```bash
~/linux-practice/scripts/calc.sh 10 0
```

Expected output:
```
Numbers: 10 and 0
Addition:       10 + 0 = 10
Subtraction:    10 - 0 = 10
Multiplication: 10 x 0 = 0
Division: cannot divide by zero
```

**Understand `$(( ))`:**
- `$((A + B))` — evaluates the math expression and substitutes the result
- No `$` needed inside `(( ))` for variables — `A` and `B` work directly
- You can also write it as `$((A+B))` — spaces are optional inside

---

## Challenge — Personal Info Script

Write a script `~/linux-practice/scripts/about-me.sh` that:

1. Uses at least 3 built-in variables (`$USER`, `$HOME`, `$HOSTNAME`, `$$`, etc.)
2. Uses at least 1 command substitution (e.g., `$(date)`, `$(uptime)`, `$(nproc)`)
3. Accepts an optional argument: if one is given, use it as a greeting name; if none, use `$USER`

Example run with no argument:
```
Hello, jahid!
Running on: myserver
Today: Thu Jun 20 2024
Script PID: 12345
```

Example run with argument `./about-me.sh Alice`:
```
Hello, Alice!
Running on: myserver
...
```

---

**Navigation:** ← [Exercise 07](07-networking-exe.md) | [Exercises Index](README.md) | Next → [Exercise 08-02](08-02-shell-scripting-conditionals-exe.md)
**Note:** [08-01 — Shell Scripting: Basics](../01-notes/08-01-shell-scripting-basics.md)
