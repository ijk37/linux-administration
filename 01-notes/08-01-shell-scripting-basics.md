# 08-01 — Shell Scripting: Basics

**Navigation:** ← [07 — Networking](07-networking.md) | [Notes Index](README.md) | Next → [08-02 — Shell Scripting: Conditionals](08-02-shell-scripting-conditionals.md)
**Exercise:** [Exercise 08-01](../02-exercises/08-01-shell-scripting-basics-exe.md)

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

**Navigation:** ← [07 — Networking](07-networking.md) | [Notes Index](README.md) | Next → [08-02 — Shell Scripting: Conditionals](08-02-shell-scripting-conditionals.md)
**Exercise:** [Exercise 08-01](../02-exercises/08-01-shell-scripting-basics-exe.md)
