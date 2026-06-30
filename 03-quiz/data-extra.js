// Extra questions merged into QUESTIONS after data.js loads.
// Topic quizzes: +10 each (total 20). Mixed quizzes: +5 each (total 20).

const EXTRA_QUESTIONS = {

  "01": [
    {
      q: "What does `ls -lh` show differently from `ls -l`?",
      options: ["Hidden files", "File sizes in human-readable format (KB, MB, GB)", "Sorted by modification time", "Only directories"],
      answer: 1,
      explain: "`-h` = human-readable. Instead of showing `1048576`, it shows `1.0M`. Always combine with `-l` for a full listing.",
    },
    {
      q: "What is `/dev/null` used for?",
      options: ["Storing deleted files", "Discarding unwanted output — anything written there disappears", "A null pointer in the filesystem", "Storing device drivers"],
      answer: 1,
      explain: "`/dev/null` is the 'black hole' of Linux. Redirect output you don't care about: `command 2>/dev/null` silences error messages.",
    },
    {
      q: "What does `Ctrl+Z` do to a running process?",
      options: ["Terminates it", "Suspends (pauses) it and puts it in the background", "Zooms the terminal font", "Undoes the last command"],
      answer: 1,
      explain: "Ctrl+Z sends SIGTSTP, suspending the process. It's still alive but paused. Use `fg` to resume it in the foreground or `bg` to resume it in the background.",
    },
    {
      q: "What does `type ls` tell you?",
      options: ["The file type of ls", "Whether ls is a shell builtin, alias, or external command — and its location", "The ls manual page", "The version of ls"],
      answer: 1,
      explain: "`type` resolves what a command actually is. `type ls` might show `ls is aliased to 'ls --color=auto'`. Useful for debugging why a command behaves unexpectedly.",
    },
    {
      q: "What does `echo $SHELL` show?",
      options: ["The current command being run", "The path to the current user's default shell (e.g. /bin/bash)", "The shell version", "All installed shells"],
      answer: 1,
      explain: "`$SHELL` is an environment variable set at login time to the user's default shell. It may differ from the shell currently running (check `$0` for that).",
    },
    {
      q: "What does `history | grep ssh` do?",
      options: ["Shows all SSH config history", "Searches your command history for lines containing 'ssh'", "Connects to a previous SSH session", "Deletes SSH history"],
      answer: 1,
      explain: "`history` lists recently run commands. Piping to `grep ssh` filters to only lines containing 'ssh'. Useful for finding a command you ran before but can't remember exactly.",
    },
    {
      q: "What does `cat /etc/os-release` display?",
      options: ["Hardware release date", "Information about the installed Linux distribution (name, version, ID)", "Kernel release notes", "Package update history"],
      answer: 1,
      explain: "`/etc/os-release` is a standardised file containing distribution metadata. Used by scripts to detect which distro they're running on.",
    },
    {
      q: "What does `env` command display without arguments?",
      options: ["The current directory", "All environment variables currently set in the shell", "Installed software environments", "CPU environment information"],
      answer: 1,
      explain: "`env` prints all exported environment variables. Each line is `VAR=value`. Useful for debugging scripts that depend on the environment.",
    },
    {
      q: "What does `alias ll='ls -la'` do?",
      options: ["Creates a new command `ll` that runs `ls -la`", "Renames the `ls` command", "Permanently adds ll to the system", "Creates a script file"],
      answer: 0,
      explain: "`alias` creates a shorthand. Type `ll` and bash substitutes `ls -la`. Aliases only last the current session — add them to `~/.bashrc` to make them permanent.",
    },
    {
      q: "What does `source ~/.bashrc` (or `. ~/.bashrc`) do?",
      options: ["Opens ~/.bashrc for editing", "Runs ~/.bashrc in the current shell, applying any new aliases or exports immediately", "Backs up ~/.bashrc", "Resets ~/.bashrc to defaults"],
      answer: 1,
      explain: "`source` runs a script in the current shell context (not a subshell). Changes to variables, aliases, and functions take effect immediately without needing to log out.",
    },
  ],

  "02": [
    {
      q: "What is the key difference between a hard link and a symbolic link?",
      options: [
        "Hard links work across filesystems; symbolic links do not",
        "Hard links share the same inode (data); symbolic links store a path — deleting the target breaks the symlink",
        "Symbolic links are faster to access",
        "Hard links can only be created by root",
      ],
      answer: 1,
      explain: "Hard links are just additional directory entries pointing to the same inode. The file data only disappears when all hard links are removed. Symbolic links are pointers to a path — they break if the target moves.",
    },
    {
      q: "What does `stat file.txt` display?",
      options: ["Only the file size", "Detailed metadata: inode number, permissions, size, owner, and all three timestamps", "The file's content type", "Whether the file is locked"],
      answer: 1,
      explain: "`stat` shows everything about a file: size, blocks, inode, permissions in octal, owner UID/GID, and three timestamps — access (atime), modify (mtime), change (ctime).",
    },
    {
      q: "What does `file /bin/bash` tell you?",
      options: ["The bash version", "The file type — e.g. 'ELF 64-bit executable' or 'ASCII text'", "The file's permissions", "Whether the file is in use"],
      answer: 1,
      explain: "`file` reads file headers (magic bytes) to determine type — regardless of extension. Very useful for identifying files with missing or wrong extensions.",
    },
    {
      q: "What does `df -i` show?",
      options: ["Disk space in inodes", "Inode usage — how many inodes are used vs available on each filesystem", "Interface disk info", "Only information about /",],
      answer: 1,
      explain: "Each file and directory consumes one inode. A filesystem can run out of inodes before it runs out of space — causing 'no space left' errors even when `df -h` shows free space.",
    },
    {
      q: "What does `find . -mmin -30` find?",
      options: ["Files modified more than 30 minutes ago", "Files modified in the last 30 minutes", "Files modified at minute 30", "Files smaller than 30 minutes old in bytes"],
      answer: 1,
      explain: "`-mmin -30` = modified less than 30 minutes ago. `-mmin +30` = more than 30 minutes ago. `-mtime -1` = modified less than 1 day ago.",
    },
    {
      q: "What does `ls -lt` sort the listing by?",
      options: ["File size (largest first)", "Modification time (newest first)", "Alphabetical order reversed", "File type"],
      answer: 1,
      explain: "`-t` sorts by modification time, newest first. Combine with `-r` (`ls -ltr`) to get oldest first — useful for seeing recent changes in a busy directory.",
    },
    {
      q: "What does `cut -d: -f1 /etc/passwd` output?",
      options: ["The UID of each user", "Only the username field (first colon-delimited field) from each line", "The home directory of each user", "The full first line"],
      answer: 1,
      explain: "`-d:` sets `:` as delimiter, `-f1` selects field 1. `/etc/passwd` format: `username:x:UID:GID:comment:home:shell`. So this extracts just the usernames.",
    },
    {
      q: "What does `command1 | tee output.txt` do?",
      options: ["Saves output only to output.txt", "Writes output to both stdout (terminal) and output.txt simultaneously", "Reads from output.txt and pipes to command1", "Appends to output.txt only"],
      answer: 1,
      explain: "`tee` splits the stream: you see output on screen AND it's saved to a file. Add `-a` to append rather than overwrite.",
    },
    {
      q: "What does `diff file1.txt file2.txt` show?",
      options: ["Whether the files are identical in size", "The line-by-line differences between the two files", "Which file is newer", "The common lines between both files"],
      answer: 1,
      explain: "`diff` shows which lines differ. Lines prefixed with `<` are in file1 only, `>` in file2 only. `diff -u` gives a unified diff (the format used in git patches).",
    },
    {
      q: "What type of data does the `/var` directory store?",
      options: ["Variable configuration files", "Data that changes during normal system operation: logs, caches, mail spools, databases", "Virtual device files", "Volatile memory mappings"],
      answer: 1,
      explain: "`/var` = variable. Unlike `/etc` (config, rarely changes), `/var` grows and shrinks constantly. `/var/log` is where most logs live. Watch `/var` disk usage on busy servers.",
    },
  ],

  "03": [
    {
      q: "What command lists all groups defined on the system?",
      options: ["ls /etc/groups", "cat /etc/group", "grouplist", "id --all"],
      answer: 1,
      explain: "`/etc/group` format: `groupname:x:GID:member1,member2`. `getent group` also works and queries all name service sources (including LDAP if configured).",
    },
    {
      q: "What does `chage -l jahid` show?",
      options: ["jahid's login history", "Password aging info: last change, expiry date, warning period, account expiry", "jahid's group memberships", "jahid's sudo privileges"],
      answer: 1,
      explain: "`chage` manages password aging policy. `-l` lists current settings. `-M 90` sets maximum password age to 90 days. Essential for compliance on multi-user servers.",
    },
    {
      q: "What is the purpose of `/usr/sbin/nologin` as a user's shell?",
      options: ["Gives the user a restricted shell", "Prevents interactive login while allowing the account to exist for system processes", "Locks the account permanently", "Forwards logins to another user"],
      answer: 1,
      explain: "System accounts (nginx, www-data, etc.) need to exist but should never be logged into. Setting `/usr/sbin/nologin` as the shell prints 'This account is currently not available' and rejects login.",
    },
    {
      q: "What does `sudo -l` show for the current user?",
      options: ["A list of all users with sudo", "The sudo commands available to the current user based on /etc/sudoers", "The last time sudo was used", "sudo version information"],
      answer: 1,
      explain: "`sudo -l` lists exactly what you're allowed to do with sudo — which commands, on which hosts, as which users. Very useful for understanding your permissions on a new server.",
    },
    {
      q: "What does `/etc/skel` contain?",
      options: ["Skeleton config for the kernel", "Template files copied into every new user's home directory when the account is created", "Skeleton sudoers rules", "Sample shell scripts"],
      answer: 1,
      explain: "When `adduser` creates a home directory, it copies files from `/etc/skel`. Add a custom `.bashrc` or `.vimrc` to `/etc/skel` and every new user gets it automatically.",
    },
    {
      q: "What does `gpasswd -d jahid developers` do?",
      options: ["Adds jahid to developers", "Removes jahid from the developers group", "Changes the developers group password", "Deletes the developers group"],
      answer: 1,
      explain: "`gpasswd -d` = delete member from group. The `-a` flag adds. You can also use `usermod -G` to set groups, but `gpasswd` is simpler for single-group changes.",
    },
    {
      q: "What does the `last` command show?",
      options: ["The last error in the system log", "A history of user logins, logouts, and system reboots", "The last 10 commands run", "The last file modified"],
      answer: 1,
      explain: "`last` reads `/var/log/wtmp`. You can see who logged in, from where, and for how long. `last -n 20` shows the 20 most recent entries. `lastb` shows failed login attempts.",
    },
    {
      q: "What does `useradd -r servicename` create?",
      options: ["A regular user with restricted shell", "A system account (UID < 1000) without a home directory — for running services", "A root-level account", "A read-only account"],
      answer: 1,
      explain: "`-r` = system account. System accounts have low UIDs (typically < 1000), no home directory by default, and often use `/usr/sbin/nologin` as their shell. Used for service processes.",
    },
    {
      q: "What does `getent passwd jahid` do?",
      options: ["Edits jahid's passwd entry", "Looks up jahid's user record from all configured name service sources (local files, LDAP, etc.)", "Gets jahid's password hash", "Lists all entries in /etc/passwd"],
      answer: 1,
      explain: "`getent` queries the Name Service Switch (NSS). Unlike `cat /etc/passwd`, it works whether users are stored locally, in LDAP, or Active Directory.",
    },
    {
      q: "After `sudo visudo`, you add `jahid ALL=(ALL) NOPASSWD: /sbin/reboot`. What does this allow?",
      options: ["jahid can run any command without a password", "jahid can run only /sbin/reboot with sudo and without being asked for a password", "jahid can reboot only from localhost", "jahid becomes a full administrator"],
      answer: 1,
      explain: "The sudoers format: `user host=(runas) command`. `NOPASSWD:` skips the password prompt for that specific command only. Useful for automation and scheduled tasks.",
    },
  ],

  "04": [
    {
      q: "What does `find / -perm -4000 2>/dev/null` find?",
      options: ["Files with 4000 bytes", "All SUID files on the system — important for security audits", "Files owned by UID 4000", "Read-only files"],
      answer: 1,
      explain: "`-perm -4000` matches files with the SUID bit set. Attackers look for SUID files because they run with the owner's privileges. Running this as a security check is standard practice.",
    },
    {
      q: "What is the difference between `chmod 644` and `chmod 600` on a file?",
      options: ["644 is read-only for all; 600 allows writing", "644 allows group and others to read; 600 is owner-only (no group or others access)", "644 is for scripts; 600 is for data files", "They are identical"],
      answer: 1,
      explain: "644 = rw-r--r-- (owner rw, group r, others r). 600 = rw------- (owner rw, nobody else). Use 600 for private files like SSH keys and config files with credentials.",
    },
    {
      q: "What does `umask 077` result in for newly created files?",
      options: ["777 permissions", "700 for directories, 600 for files — completely private, no access for group or others", "644 permissions", "755 for directories"],
      answer: 1,
      explain: "Files start at 666, directories at 777. Subtract umask 077: files = 666-077 = 600, directories = 777-077 = 700. A strict umask for servers handling private data.",
    },
    {
      q: "What does `lsattr file.txt` show?",
      options: ["ACL entries", "Extended filesystem attributes like immutable (i), append-only (a), no-dump (d)", "File access log", "Linked attributes"],
      answer: 1,
      explain: "`lsattr` shows ext2/ext4 filesystem attributes. `chattr +i file` makes it immutable — not modifiable even by root. `+a` = append-only. Check with `lsattr` if a file mysteriously resists deletion.",
    },
    {
      q: "What does `setfacl -m u:alice:rw file.txt` do?",
      options: ["Changes the owner to alice", "Grants alice read+write access via ACL without touching the standard permissions", "Removes alice's access", "Makes alice the group owner"],
      answer: 1,
      explain: "ACLs extend the 3-category permission model to allow per-user and per-group rules. `getfacl file.txt` shows all ACL entries. A `+` at the end of `ls -l` output indicates ACLs are present.",
    },
    {
      q: "What does `stat -c \"%a\" file.txt` display?",
      options: ["The file's age in days", "The octal permission value of the file (e.g. 644, 755)", "The file's ACL", "The file's access time"],
      answer: 1,
      explain: "`stat -c \"%a\"` uses the format string `%a` = access rights in octal. Useful in scripts: `PERMS=$(stat -c \"%a\" file)` gives you a number you can compare.",
    },
    {
      q: "What does `chattr +i file.txt` do?",
      options: ["Makes the file invisible", "Makes the file immutable — cannot be modified, deleted, or renamed even by root", "Sets the file as indexed", "Increases the file's inode number"],
      answer: 1,
      explain: "The immutable attribute is enforced by the filesystem, below the OS. Even `sudo rm` fails. Used to protect critical config files. Remove with `chattr -i`.",
    },
    {
      q: "File permissions show `rwsr-xr-x` (note the `s` in owner execute). What does this indicate?",
      options: ["The file is a shell script", "The SUID bit is set — the file runs with the file owner's privileges", "The file is shared", "The `s` replaces `x` meaning no execute permission"],
      answer: 1,
      explain: "Lowercase `s` in owner execute = SUID bit set AND execute permission set. Uppercase `S` = SUID set but NO execute permission (unusual, often a mistake). Classic example: `/usr/bin/passwd`.",
    },
    {
      q: "What is the correct octal permission for a directory that the owner can fully access, the group can read and enter, and others have no access?",
      options: ["755", "750", "744", "700"],
      answer: 1,
      explain: "owner: rwx=7, group: r-x=5 (read+traverse but no write), others: ---=0. Result: 750. A common setup for web directories shared within a group.",
    },
    {
      q: "What does `chmod -R g+w /project` do?",
      options: ["Adds write permission for the group on /project only", "Recursively adds write permission for the group on /project and all files/directories inside", "Removes group write from /project", "Changes the group of /project"],
      answer: 1,
      explain: "`-R` = recursive. Applies the permission change to the directory and everything inside it. Be careful with `-R +x` on directories containing files — it makes all files executable too.",
    },
  ],

  "05": [
    {
      q: "What does `apt list --installed` show?",
      options: ["Packages available to install", "All currently installed packages and their versions", "Recently updated packages", "Broken package dependencies"],
      answer: 1,
      explain: "`apt list --installed` shows every package installed on the system with version and architecture. Pipe to `grep` to find a specific package: `apt list --installed | grep nginx`.",
    },
    {
      q: "What does `apt-get clean` do?",
      options: ["Removes installed packages", "Deletes downloaded .deb package files from the local cache at /var/cache/apt/archives/", "Fixes broken dependencies", "Removes orphaned packages"],
      answer: 1,
      explain: "When apt installs packages, it caches the .deb files. They're safe to delete after installation. `apt-get clean` frees that space. `apt-get autoclean` removes only outdated cached packages.",
    },
    {
      q: "What does `apt install -y` do differently from `apt install`?",
      options: ["Installs more packages", "Automatically answers 'yes' to all prompts — useful in scripts and automation", "Skips dependency checks", "Uses a faster download server"],
      answer: 1,
      explain: "`apt install` asks 'Do you want to continue? [Y/n]'. `-y` pre-answers yes, allowing unattended installation. Always use in scripts to prevent them from hanging waiting for input.",
    },
    {
      q: "What does `apt-cache depends nginx` show?",
      options: ["Packages that depend ON nginx", "The packages that nginx depends on (its dependencies)", "nginx's reverse dependencies", "nginx's optional packages"],
      answer: 1,
      explain: "`apt-cache depends` shows what a package needs. `apt-cache rdepends nginx` shows what needs nginx (reverse). Useful for understanding why removing a package might break something else.",
    },
    {
      q: "What does `sudo apt install --reinstall nginx` do?",
      options: ["Upgrades nginx", "Reinstalls nginx even if it's already installed — useful for fixing corrupted installations", "Downgrades nginx", "Reinstalls all dependencies too"],
      answer: 1,
      explain: "If an installed package has corrupted or missing files, `--reinstall` downloads and reinstalls it fresh without removing it first. Faster than uninstall+install.",
    },
    {
      q: "What is the purpose of `/etc/apt/sources.list.d/` directory?",
      options: ["Stores downloaded packages", "Contains additional repository source files — one per file, cleaner than editing sources.list directly", "Stores installed package metadata", "Contains apt configuration"],
      answer: 1,
      explain: "Instead of editing `sources.list`, tools like `add-apt-repository` drop a new `.list` file here. Each third-party source gets its own file, making it easy to remove by deleting that file.",
    },
    {
      q: "What does `dpkg --get-selections` output?",
      options: ["Package download history", "All packages and their current selection state (install, deinstall, hold, etc.)", "Only installed packages", "Packages pending update"],
      answer: 1,
      explain: "`dpkg --get-selections` is useful for backing up your package list: `dpkg --get-selections > packages.txt`. Restore on a new machine with `dpkg --set-selections < packages.txt && apt-get dselect-upgrade`.",
    },
    {
      q: "What does `snap install code --classic` mean by `--classic`?",
      options: ["Installs the classic (older) version", "Grants the snap full system access, bypassing snap's normal sandboxing", "Installs without a GUI", "Classic = stable channel"],
      answer: 1,
      explain: "Snaps are normally sandboxed. `--classic` removes the sandbox, giving the app access to the whole system like a traditional package. Required for developer tools like VS Code, Go, and rustup.",
    },
    {
      q: "What does `apt-cache search editor` do?",
      options: ["Searches installed packages for editors", "Searches available package names and descriptions for the keyword 'editor'", "Opens the apt cache in a text editor", "Finds the default editor setting"],
      answer: 1,
      explain: "`apt-cache search` searches both package names and descriptions. It's how you discover package names when you know what you want but not the exact name.",
    },
    {
      q: "What happens when you run `sudo apt upgrade` and a package has a new version that requires removing another package?",
      options: ["apt removes it automatically", "apt skips that upgrade — use `sudo apt full-upgrade` (or `dist-upgrade`) which handles such changes", "apt aborts the entire upgrade", "apt asks for confirmation for every package"],
      answer: 1,
      explain: "`apt upgrade` is conservative — it won't remove packages. `apt full-upgrade` (formerly `dist-upgrade`) allows installing/removing packages as needed to complete all upgrades.",
    },
  ],

  "06": [
    {
      q: "What does `pstree` show?",
      options: ["Disk partition tree", "Running processes in a tree showing parent-child relationships", "The filesystem directory tree", "A sorted list of processes by PID"],
      answer: 1,
      explain: "`pstree` visually shows how processes are related. You can see which processes spawned which children. `pstree -p` includes PIDs. `pstree -u` shows user names.",
    },
    {
      q: "What does `lsof -i :80` show?",
      options: ["Files in /proc/80", "Processes that have port 80 open (listening or connected)", "Network interfaces on port 80", "Log files related to port 80"],
      answer: 1,
      explain: "`lsof` = List Open Files. In Linux, network sockets are files too. `-i :80` filters to port 80. Useful to find what's using a port when `ss -tulnp` shows it occupied.",
    },
    {
      q: "What does `systemctl list-units --failed` show?",
      options: ["Units scheduled to run", "All systemd units that have failed and need attention", "Units that failed to install", "Units disabled from starting"],
      answer: 1,
      explain: "After a reboot or service crash, this shows everything that went wrong. Check logs with `journalctl -u servicename` to understand why a unit failed.",
    },
    {
      q: "What does the `jobs` command show in bash?",
      options: ["Scheduled cron jobs", "Background and suspended jobs in the current shell session", "Running system services", "Queued print jobs"],
      answer: 1,
      explain: "`jobs` lists processes you've sent to the background with `&` or suspended with Ctrl+Z. Each has a job number `[1]`, `[2]` etc. Use `fg %1` to bring job 1 back to the foreground.",
    },
    {
      q: "What does `systemctl daemon-reload` do?",
      options: ["Restarts all services", "Tells systemd to re-read all unit files from disk — required after modifying a .service file", "Reloads the kernel", "Reloads network config"],
      answer: 1,
      explain: "If you create or edit a `.service` file in `/etc/systemd/system/`, systemd doesn't know until you run `daemon-reload`. Always run it before `systemctl start/enable` on a new unit.",
    },
    {
      q: "What does `kill -HUP PID` (SIGHUP) typically do to a running daemon?",
      options: ["Hard-kills the process", "Asks the daemon to reload its configuration file without restarting", "Hangs the process", "Sends the process to the background"],
      answer: 1,
      explain: "Many daemons (nginx, sshd, apache) are written to reload config on SIGHUP. It's cleaner than a restart because active connections aren't dropped. `systemctl reload service` does this too.",
    },
    {
      q: "What is the difference between `systemctl stop nginx` and `systemctl disable nginx`?",
      options: ["They are identical", "`stop` stops nginx right now; `disable` prevents it from starting on boot (but doesn't stop it now)", "`disable` is permanent; `stop` is temporary but the same effect", "`stop` removes it; `disable` just pauses"],
      answer: 1,
      explain: "stop/start = right now. enable/disable = on boot. You can have a service stopped but enabled (will restart on next boot), or running but disabled (runs now, won't start on reboot).",
    },
    {
      q: "What does `at 14:30` allow you to do?",
      options: ["Shows jobs scheduled for 14:30", "Schedules a one-time command to run at 14:30 today", "Sets an alarm at 14:30", "Runs the last command again at 14:30"],
      answer: 1,
      explain: "`at` schedules one-off commands unlike cron (which repeats). Type commands then press Ctrl+D. `atq` lists pending jobs. `atrm <job>` cancels them.",
    },
    {
      q: "What does `top -b -n 1` do?",
      options: ["Runs top interactively once", "Runs top in batch mode for one iteration — outputs to stdout, useful in scripts", "Shows top 1 process only", "Runs top without colour"],
      answer: 1,
      explain: "Batch mode (`-b`) makes top non-interactive and outputs text. `-n 1` = one iteration. `top -b -n 1 | head -20` in a script gives you a snapshot of the top processes.",
    },
    {
      q: "What does `nice -n 19 ./heavy-script.sh` achieve?",
      options: ["Runs the script with highest priority", "Runs the script with the lowest CPU priority, yielding to all other processes", "Runs the script 19 times", "Makes the script ignore SIGKILL"],
      answer: 1,
      explain: "Nice 19 = lowest priority. The script runs only when no other process wants the CPU. Ideal for long-running backup or compression tasks that shouldn't affect users.",
    },
  ],

  "07": [
    {
      q: "What does `hostname -I` show?",
      options: ["The system's hostname", "All IP addresses assigned to all network interfaces on the machine", "The internet-facing IP only", "The hostname and IP together"],
      answer: 1,
      explain: "`hostname -I` (capital i) lists all assigned IPs, one per line. Useful in scripts to find the machine's IP without parsing `ip addr` output.",
    },
    {
      q: "What is the key difference between TCP and UDP?",
      options: [
        "TCP is faster; UDP is more reliable",
        "TCP is connection-oriented with guaranteed delivery; UDP is connectionless, faster but no delivery guarantee",
        "TCP works on local networks; UDP works over the internet",
        "UDP encrypts data; TCP does not",
      ],
      answer: 1,
      explain: "TCP: three-way handshake, ACKs, retransmission — reliable but slower. UDP: fire and forget — fast, used for streaming, DNS, gaming. SSH/HTTP use TCP. DNS queries use UDP.",
    },
    {
      q: "What does `curl -I https://example.com` show?",
      options: ["The full page content", "Only the HTTP response headers (status code, content-type, server, etc.)", "Information about the SSL certificate", "The page load time"],
      answer: 1,
      explain: "`-I` sends a HEAD request — the server sends headers only, no body. Quick way to check response codes, redirects, and server type without downloading the full page.",
    },
    {
      q: "What is a subnet mask of `/24` equivalent to in dotted decimal?",
      options: ["255.255.0.0", "255.255.255.0", "255.0.0.0", "255.255.255.255"],
      answer: 1,
      explain: "/24 = 24 bits set to 1 = `11111111.11111111.11111111.00000000` = 255.255.255.0. This gives 254 usable host addresses in the subnet.",
    },
    {
      q: "What does `ufw allow from 192.168.1.0/24` do?",
      options: ["Blocks the entire 192.168.1.x subnet", "Allows all traffic from any address in the 192.168.1.x subnet", "Allows only SSH from that subnet", "Adds a route for that subnet"],
      answer: 1,
      explain: "This UFW rule permits any protocol and port from the entire /24 subnet. More specific: `ufw allow from 192.168.1.0/24 to any port 22` limits to SSH only.",
    },
    {
      q: "What does `wget -c https://example.com/largefile.iso` do?",
      options: ["Downloads with compression", "Resumes a previously interrupted download from where it left off", "Checks the file's checksum", "Downloads quietly with no output"],
      answer: 1,
      explain: "`-c` = continue. wget checks the local file size and adds a Range header to resume from that byte offset. Very useful for large files on unreliable connections.",
    },
    {
      q: "What does `nslookup example.com` do?",
      options: ["Shows the nameservers for example.com", "Queries DNS to resolve example.com to its IP address(es)", "Tests connectivity to example.com", "Shows all DNS records for example.com"],
      answer: 1,
      explain: "`nslookup` is a basic DNS lookup tool. It shows the IP(s) returned for the hostname. For more detail, use `dig example.com` which shows full DNS response metadata.",
    },
    {
      q: "What does `iptables -L -n` show?",
      options: ["Interfaces and their IPs", "The current firewall rules (filter table chains) with numeric addresses", "Network link statistics", "Listening ports"],
      answer: 1,
      explain: "`iptables -L` lists rules. `-n` = numeric (no DNS reverse lookup, faster). Most modern systems use nftables or UFW/firewalld as a frontend, but iptables rules are what actually run.",
    },
    {
      q: "What does `ss -s` show?",
      options: ["A list of all sockets", "A summary of socket statistics: total connections, TCP states, UDP counts", "SSH session info", "Only listening sockets"],
      answer: 1,
      explain: "`ss -s` gives a quick overview: total sockets by type and TCP connection state counts (established, time-wait, close-wait, etc.). Good for spotting connection exhaustion problems.",
    },
    {
      q: "What does `ping -c 3 -W 1 192.168.1.1` do?",
      options: ["Sends 3 pings and waits forever for each", "Sends 3 pings, waiting max 1 second for each reply before timing out", "Sends pings every 3 seconds with 1 byte", "Sends 1 ping and waits 3 seconds"],
      answer: 1,
      explain: "`-c 3` = 3 packets. `-W 1` = wait 1 second for each reply. Without `-W`, ping waits several seconds per packet when a host is down — slowing diagnostic scripts.",
    },
  ],

  "08-01": [
    {
      q: "What is the difference between single quotes and double quotes in bash?",
      options: [
        "Single quotes allow variable expansion; double quotes do not",
        "Single quotes are completely literal — nothing is expanded; double quotes allow `$VAR` and `$(cmd)` expansion",
        "They are identical",
        "Double quotes prevent word splitting only",
      ],
      answer: 1,
      explain: "`echo '$HOME'` prints `$HOME` literally. `echo \"$HOME\"` prints `/home/jahid`. Use single quotes when you want no substitution at all.",
    },
    {
      q: "What does `#!/usr/bin/env bash` as a shebang do differently from `#!/bin/bash`?",
      options: [
        "They are identical",
        "Uses `env` to find bash in PATH, making the script portable across systems where bash may not be at /bin/bash",
        "Runs the script with environment variables cleared",
        "Only works on Linux, not macOS",
      ],
      answer: 1,
      explain: "On macOS and some systems, bash may be at `/usr/local/bin/bash`. `#!/usr/bin/env bash` finds whichever bash is first in PATH. Common in portable scripts.",
    },
    {
      q: "What does `source script.sh` do differently from `./script.sh`?",
      options: [
        "source runs it as root",
        "source runs the script in the CURRENT shell, so variable assignments and cd commands persist after it finishes",
        "source skips the shebang line",
        "source is faster",
      ],
      answer: 1,
      explain: "`./script.sh` runs in a subshell — variables and directory changes disappear when it exits. `source` (or `.`) runs in the current shell — changes stick. Used for `.bashrc`, `activate` in Python virtualenvs, etc.",
    },
    {
      q: "What does `printf \"%05d\\n\" 42` print?",
      options: ["42000", "00042", "42   (padded with spaces)", "Error"],
      answer: 1,
      explain: "`%05d` = integer, minimum width 5, zero-padded. `printf` is more powerful than `echo` for formatted output: `%s` for strings, `%f` for floats, `%-10s` for left-aligned.",
    },
    {
      q: "What does `read -a ITEMS <<< \"apple banana cherry\"` do?",
      options: ["Reads one item", "Reads the words into an array: ITEMS[0]=apple, ITEMS[1]=banana, ITEMS[2]=cherry", "Reads from a file called ITEMS", "Reads the entire line into ITEMS as one string"],
      answer: 1,
      explain: "`-a` = read into array, splitting on IFS (space by default). `<<<` is a here-string. Access elements with `${ITEMS[0]}`, all with `${ITEMS[@]}`, count with `${#ITEMS[@]}`.",
    },
    {
      q: "What does `declare -i NUM` do?",
      options: ["Makes NUM immutable", "Declares NUM as an integer — bash automatically converts assignments to integers", "Initialises NUM to 0", "Makes NUM an index"],
      answer: 1,
      explain: "With `declare -i`, `NUM=5+3` sets NUM to 8 (integer arithmetic). Without it, `NUM=5+3` would set it to the string `\"5+3\"`.",
    },
    {
      q: "What does `echo \"scale=4; 355/113\" | bc` output?",
      options: ["3", "3.14", "3.1415 (pi approximation to 4 decimal places)", "Error"],
      answer: 2,
      explain: "`bc` is the arbitrary precision calculator. `scale=4` sets 4 decimal places. `355/113` is a classic approximation of π. Bash can't do decimal math natively — use `bc` or `awk`.",
    },
    {
      q: "What does `VAR=${VAR^^}` do?",
      options: ["Doubles the value of VAR", "Converts VAR's value to UPPERCASE", "Escapes special characters in VAR", "Checks if VAR is non-empty"],
      answer: 1,
      explain: "`^^` = uppercase all characters (bash 4+). `,,` = lowercase. `^` = uppercase first character only. `echo ${name^}` capitalises the first letter.",
    },
    {
      q: "What is the purpose of `set -x` in a script?",
      options: ["Exits on error", "Prints each command and its expanded arguments before executing — debug mode", "Marks variables as exported", "Enables extended globbing"],
      answer: 1,
      explain: "`set -x` is your best friend for debugging. Every command prints as `+ command args` before running. Disable with `set +x`. You can wrap just a section: `set -x; ...; set +x`.",
    },
    {
      q: "After a script exits, do variables defined in it persist in the parent shell?",
      options: ["Yes, always", "No — variables in a subshell script vanish when the script exits", "Only if they were exported", "Only if the script used set -e"],
      answer: 1,
      explain: "Scripts run in a subshell. The subshell inherits the parent's environment but changes don't propagate back. Use `source script.sh` if you need changes to persist, or print values and capture with `$()`.",
    },
  ],

  "08-02": [
    {
      q: "What is the key difference between `[ ]` and `[[ ]]` in bash?",
      options: [
        "They are identical",
        "`[[ ]]` is a bash keyword: supports `=~` regex, `&&`/`||` inside, no word splitting — safer and more powerful",
        "`[ ]` supports regex; `[[ ]]` does not",
        "`[[ ]]` requires root",
      ],
      answer: 1,
      explain: "`[ ]` is the POSIX `test` command. `[[ ]]` is a bash built-in keyword with extras: `[[ $str =~ ^[0-9]+$ ]]` for regex, `[[ -f a && -f b ]]` without quoting issues.",
    },
    {
      q: "What does `if grep -q 'error' logfile; then` do?",
      options: ["Checks if the grep command exists", "Runs the if block if grep finds 'error' in logfile (uses grep's exit code directly)", "Checks if logfile contains 'error' and prints it", "Requires grep to output something"],
      answer: 1,
      explain: "`-q` = quiet (no output). `grep -q` returns exit code 0 if the pattern is found, 1 if not. Using commands directly in `if` is cleaner than `if [ $(grep ...) ]; then`.",
    },
    {
      q: "What does `-o` do inside `[ ]` brackets?",
      options: ["Outputs the result", "OR — `[ cond1 -o cond2 ]` is true if either condition is true", "Runs the command in the background", "Opens a file"],
      answer: 1,
      explain: "Inside `[ ]`: `-o` = OR, `-a` = AND. In `[[ ]]` use `||` and `&&` instead. Note: `-o` and `-a` inside `[ ]` are deprecated and can behave unexpectedly — prefer separate `[ ] || [ ]`.",
    },
    {
      q: "What does `case \"$DAY\" in Mon|Tue|Wed) echo workday;; *) echo other;; esac` do?",
      options: ["Only matches Monday", "Matches Mon, Tue, or Wed and prints 'workday'; anything else prints 'other'", "A syntax error", "Requires $DAY to be uppercase"],
      answer: 1,
      explain: "`case` is cleaner than a chain of `elif` for multiple fixed values. `|` separates patterns within one case. `*)` is the catch-all. Each case ends with `;;`.",
    },
    {
      q: "What does `[ -s \"$FILE\" ]` test?",
      options: ["Whether FILE is a system file", "Whether FILE exists AND has a size greater than 0 (non-empty)", "Whether FILE is a socket", "Whether FILE is synchronised"],
      answer: 1,
      explain: "`-s` = 'has size'. Returns true only if the file exists AND contains at least one byte. Useful to check if a log file or output file actually has content.",
    },
    {
      q: "What is the issue with `if [ $VAR = \"yes\" ]` when VAR might be unset?",
      options: ["The quotes around 'yes' cause a problem", "If VAR is unset, it expands to nothing: `[ = \"yes\" ]` — syntax error. Use `[ \"$VAR\" = \"yes\" ]`", "The = should be == for strings", "No issue at all"],
      answer: 1,
      explain: "Always quote variables in test conditions. `\"$VAR\"` expands to `\"\"` when unset, making it `[ \"\" = \"yes\" ]` — valid. Unquoted: `[ = \"yes\" ]` — bash error.",
    },
    {
      q: "What does `[[ \"$filename\" == *.txt ]]` check?",
      options: ["Regex match", "Glob pattern match — whether $filename ends with .txt", "Exact equality with '*.txt'", "Whether *.txt files exist"],
      answer: 1,
      explain: "Inside `[[ ]]`, `==` supports glob patterns on the right side. `*` matches any string. This is different from `=~` which does regex. No need to quote `*.txt` in `[[ ]]`.",
    },
    {
      q: "What does `(( A > B ))` return when A is 10 and B is 5?",
      options: ["The value 5 (the difference)", "Exit code 0 (success/true), because 10 > 5", "The string 'true'", "Exit code 1 (failure)"],
      answer: 1,
      explain: "`(( ))` is arithmetic evaluation. It returns exit code 0 if the expression is non-zero/true, 1 if zero/false. `if (( A > B )); then` is clean for numeric comparisons.",
    },
    {
      q: "What does `! command` do in a bash condition?",
      options: ["Runs command in a subshell", "Negates the exit code: the condition is true if the command FAILS, false if it succeeds", "Runs the command in the background", "Forces the command to run as root"],
      answer: 1,
      explain: "`!` inverts the exit code. `if ! grep -q 'root' /etc/passwd; then echo 'no root?'` — runs the block if grep finds nothing. Used with `[ ]` too: `[ ! -f file ]`.",
    },
    {
      q: "What does `test -f /etc/passwd` do?",
      options: ["Tests if passwd is a test file", "Is exactly equivalent to `[ -f /etc/passwd ]` — checks if the file exists and is regular", "Opens /etc/passwd for testing", "Runs passwd in test mode"],
      answer: 1,
      explain: "`test` is the original name of the `[ ]` command. They are identical: `test -f file` = `[ -f file ]`. You still see `test` in older scripts and POSIX sh scripts.",
    },
  ],

  "08-03": [
    {
      q: "What is wrong with `for FILE in $(ls /var/log/)`?",
      options: ["ls doesn't work in loops", "Word splitting breaks filenames with spaces; globbing can misbehave. Use `for FILE in /var/log/*` instead", "$(ls) is too slow", "for loops don't support ls"],
      answer: 1,
      explain: "Parsing `ls` output is a classic bash antipattern. Filenames with spaces are split into multiple words. Use glob patterns directly: `for FILE in /var/log/*` is safe and fast.",
    },
    {
      q: "What does `while IFS= read -r line; do` do differently from `while read line; do`?",
      options: ["They are identical", "`IFS=` prevents leading/trailing whitespace trimming; `-r` prevents backslash interpretation — together they read lines exactly as-is", "The IFS= makes it faster", "It reads in reverse"],
      answer: 1,
      explain: "The canonical way to read a file line by line in bash. `IFS=` preserves whitespace. `-r` = raw (no backslash escaping). Without these, indented lines get their spaces stripped.",
    },
    {
      q: "What does `seq 1 2 10` generate?",
      options: ["1 2 3 4 5 6 7 8 9 10", "1 3 5 7 9", "2 4 6 8 10", "1 10"],
      answer: 1,
      explain: "`seq start step end` generates a sequence. `seq 1 2 10` = 1, 3, 5, 7, 9. Equivalent to bash's `{1..9..2}`. `seq` also supports decimal: `seq 0.5 0.5 2.0`.",
    },
    {
      q: "What does `break 2` do inside two nested for loops?",
      options: ["Breaks the inner loop twice", "Breaks out of both loops at once (2 levels up)", "Causes a syntax error", "Breaks after 2 iterations"],
      answer: 1,
      explain: "`break N` exits N levels of nested loops. `break` alone = `break 1`. `break 2` inside a double-nested loop jumps out to the code after the outer loop.",
    },
    {
      q: "What does `for dir in */` do?",
      options: ["Loops over all files", "Loops over all subdirectories in the current directory (trailing / matches directories only)", "Loops over hidden directories", "Finds all directories recursively"],
      answer: 1,
      explain: "The glob `*/` matches only items that end with `/` — i.e. directories. A clean way to loop over directories without using `find -type d`.",
    },
    {
      q: "What does `until ping -c1 -W1 google.com &>/dev/null; do sleep 5; done` do?",
      options: ["Pings once then sleeps 5 seconds", "Keeps trying every 5 seconds until google.com responds (waits for network to come up)", "Runs forever", "Pings 5 times total"],
      answer: 1,
      explain: "`until` = repeat while condition FAILS. The loop runs as long as ping fails. Once ping succeeds, the loop exits. Classic pattern for waiting for network/service availability in startup scripts.",
    },
    {
      q: "What is the output of `for i in {a..e}; do printf \"%s \" $i; done`?",
      options: ["a..e", "a b c d e", "A B C D E", "Error — brace expansion only works with numbers"],
      answer: 1,
      explain: "Brace expansion works with letters too. `{a..e}` expands to `a b c d e`. `{A..Z}` gives uppercase alphabet. `{a..z..2}` skips every other letter: a c e g...",
    },
    {
      q: "What does `mapfile -t LINES < file.txt` do?",
      options: ["Maps a file to memory", "Reads all lines of file.txt into the LINES array (one element per line, no trailing newline)", "Creates a file mapping", "Reads only the first line"],
      answer: 1,
      explain: "`mapfile` (also `readarray`) fills an array from stdin or a file. `-t` strips trailing newlines. Access with `${LINES[0]}`, iterate with `for line in \"${LINES[@]}\"`.",
    },
    {
      q: "Why does `for i in {1..$N}` NOT work in bash?",
      options: ["It works fine", "Brace expansion happens before variable substitution — `{1..$N}` is treated literally, not expanded", "$N must be exported first", "N must be an integer"],
      answer: 1,
      explain: "Bash processes brace expansion before variable substitution. `{1..$N}` never sees the value of `$N`. Use `for ((i=1; i<=N; i++))` or `for i in $(seq 1 $N)` instead.",
    },
    {
      q: "What does `${FILE##*/}` extract from `/home/jahid/scripts/backup.sh`?",
      options: ["/home/jahid/scripts/", "backup.sh", "backup", "scripts/backup.sh"],
      answer: 1,
      explain: "`##*/` removes everything up to and including the last `/`, leaving just the filename. This is what `basename` does, but as a pure bash parameter expansion — no subprocess needed.",
    },
  ],

  "08-04": [
    {
      q: "What does `declare -f greet` do?",
      options: ["Declares greet as a float variable", "Prints the full definition of the `greet` function", "Forces greet to return a value", "Makes greet a global function"],
      answer: 1,
      explain: "`declare -f funcname` prints the function's source code. Useful for debugging: confirms a function is defined and shows its current body. `declare -F` lists all function names.",
    },
    {
      q: "Can a bash function call itself recursively?",
      options: ["No — bash doesn't support recursion", "Yes — bash supports recursion, but very deep recursion can hit limits", "Only with `declare -r`", "Only if `set -e` is off"],
      answer: 1,
      explain: "Recursion works in bash. A classic example: a recursive `factorial` function. For deep recursion (1000s of levels), bash can hit stack limits. For most practical tasks, recursion is fine.",
    },
    {
      q: "What does `set -x` do during script execution?",
      options: ["Sets a variable x", "Prints each command with its expanded values before executing it — debug trace mode", "Marks the script as executable", "Exits on the first error"],
      answer: 1,
      explain: "Debug mode: every command line prints as `+ command arg1 arg2` before running. Invaluable for finding where a script goes wrong. Turn off with `set +x`.",
    },
    {
      q: "What does `readonly PI=3.14` do?",
      options: ["Creates a read-only file", "Makes PI a constant — any attempt to reassign it causes an error", "Prevents PI from being printed", "Marks PI for deletion at script end"],
      answer: 1,
      explain: "`readonly` (or `declare -r`) makes a variable immutable. Attempting `PI=3.15` later gives: `bash: PI: readonly variable`. Good for constants that should never change.",
    },
    {
      q: "What does `trap 'rm -f /tmp/lockfile' EXIT` do?",
      options: ["Creates a lockfile on exit", "Registers a cleanup command that runs whenever the script exits — normally or due to an error", "Prevents the script from exiting", "Traps only Ctrl+C"],
      answer: 1,
      explain: "`trap` on `EXIT` is the bash equivalent of a try/finally block. It fires on any exit — normal completion, `exit` call, or error. Essential for cleaning up temp files and locks.",
    },
    {
      q: "What is the difference between `#!/bin/bash` and `#!/bin/sh` as a shebang?",
      options: ["They are identical on all systems", "`#!/bin/bash` uses bash with all its features; `#!/bin/sh` uses a POSIX shell (may be dash on Ubuntu) — bash-specific syntax like `[[` may fail", "`#!/bin/sh` is faster", "`#!/bin/bash` requires root"],
      answer: 1,
      explain: "On Ubuntu, `/bin/sh` is dash (a minimal POSIX shell). Scripts using `[[ ]]`, `(( ))`, or `local` will fail. If your script uses bash features, always use `#!/bin/bash`.",
    },
    {
      q: "What does `unset -f myfunc` do?",
      options: ["Deletes the variable myfunc", "Removes/undefines the function myfunc from the current shell", "Prevents myfunc from being exported", "Resets myfunc to its default"],
      answer: 1,
      explain: "`unset` with `-f` removes a function definition. Without `-f`, `unset myfunc` removes a variable named myfunc. Useful in scripts that redefine functions conditionally.",
    },
    {
      q: "What is a 'library' pattern in bash scripting?",
      options: ["A /usr/lib script file", "A script containing only function definitions, sourced with `source lib.sh` before use", "A read-only script", "A script run by a library service"],
      answer: 1,
      explain: "Put reusable functions in a separate file (e.g. `utils.sh`). Source it at the top of other scripts: `source ./utils.sh`. The functions are then available without duplication.",
    },
    {
      q: "What does `RESULT=$(add 5 3) 2>/dev/null` do?",
      options: ["Captures the output of add and discards errors", "Runs add silently", "Only runs if add succeeds", "Redirects RESULT to /dev/null"],
      answer: 0,
      explain: "`$(...)` captures stdout. `2>/dev/null` discards any stderr the function produces. Together: capture the return value while suppressing error messages.",
    },
    {
      q: "What does `nohup ./longscript.sh > output.log 2>&1 &` do?",
      options: ["Runs the script as root", "Runs the script in the background, immune to hangup, saving all output to output.log", "Runs the script 10 times", "Schedules the script for midnight"],
      answer: 1,
      explain: "`nohup` = immune to SIGHUP (logout signal). `> output.log` = capture stdout. `2>&1` = merge stderr into stdout. `&` = background. The script continues running after you log out.",
    },
  ],

  "09": [
    {
      q: "What does `vmstat 1 5` show?",
      options: ["Virtual machines list", "Virtual memory, CPU, and I/O statistics every 1 second for 5 iterations", "Memory in 1MB blocks, 5 times", "5 virtual memory snapshots taken 1 minute apart"],
      answer: 1,
      explain: "`vmstat` reports on processes, memory, paging, block I/O, and CPU activity. The live view (`vmstat 1`) shows trends — useful for diagnosing intermittent spikes.",
    },
    {
      q: "What does `lsof -u jahid` show?",
      options: ["Files owned by jahid", "All files and network connections currently open by processes owned by jahid", "jahid's login sessions", "jahid's disk usage"],
      answer: 1,
      explain: "`lsof` (list open files) with `-u user` shows every file the user's processes have open — including sockets, pipes, and device files. Useful for auditing and debugging.",
    },
    {
      q: "What does `grep -c 'Failed password' /var/log/auth.log` output?",
      options: ["Lines containing 'Failed password'", "A count of how many lines contain 'Failed password'", "All failed password attempts with timestamps", "The users who failed login"],
      answer: 1,
      explain: "`-c` = count matching lines only (prints a number). A quick way to gauge how many brute-force attempts have happened. Then use `-n` to see them: `grep -n 'Failed password' /var/log/auth.log`.",
    },
    {
      q: "What does `watch -n 5 'df -h'` do?",
      options: ["Watches for file changes every 5 minutes", "Runs `df -h` every 5 seconds and refreshes the display", "Shows disk history every 5 minutes", "Monitors 5 filesystems"],
      answer: 1,
      explain: "`watch` repeatedly runs a command and shows the output, highlighting changes. Default interval is 2 seconds. Useful for monitoring disk usage, process counts, or any changing state.",
    },
    {
      q: "What does `systemctl list-units --state=failed` show?",
      options: ["Units that failed to install", "All systemd units that are currently in a failed state", "Units that failed during last reboot only", "Units that have never succeeded"],
      answer: 1,
      explain: "This is the first command to run after a reboot when something seems wrong. Failed units are shown in red. Then `journalctl -u unitname` to see why it failed.",
    },
    {
      q: "What does `ss -tp` show in addition to `ss -t`?",
      options: ["Packet counts", "The process name and PID owning each TCP connection", "TLS protocol details", "Port names instead of numbers"],
      answer: 1,
      explain: "`-p` adds the process information: `users:((\"nginx\",pid=1234,fd=6))`. This tells you exactly which program owns each connection — very useful for security investigations.",
    },
    {
      q: "What does `logrotate -f /etc/logrotate.conf` do?",
      options: ["Shows logrotate configuration", "Forces logrotate to run immediately, ignoring the schedule", "Formats log files", "Deletes all logs"],
      answer: 1,
      explain: "Logrotate normally runs via cron. `-f` (force) makes it run right now, regardless of whether logs need rotation. Use after changing logrotate config to test it works.",
    },
    {
      q: "What does `awk 'NR==2{print $7}' <<< \"$(free)\"` extract?",
      options: ["The second column of the first row", "The 7th field of the second line of `free` output — the available memory", "Total memory", "Swap usage"],
      answer: 1,
      explain: "`NR==2` = second row (Mem: line). `$7` = 7th field = available. This one-liner extracts available RAM in kilobytes — used in monitoring scripts.",
    },
    {
      q: "What does `dmesg | tail -20` show?",
      options: ["Last 20 kernel modules loaded", "The 20 most recent kernel ring buffer messages", "Last 20 system reboots", "The 20 largest kernel processes"],
      answer: 1,
      explain: "`dmesg` = kernel ring buffer. `tail -20` gets the most recent entries. After plugging in hardware or after a crash, check here first for kernel-level error messages.",
    },
    {
      q: "What does `iostat -x 1 3` show?",
      options: ["Input/output statistics once", "Extended disk I/O statistics every 1 second for 3 intervals (utilisation, wait times, etc.)", "I/O for 3 specific disks", "Extended network stats"],
      answer: 1,
      explain: "`iostat -x` shows extended stats per device: `%util` (how busy the disk is), `await` (average wait time), `r/s`, `w/s` (read/write operations per second). Essential for diagnosing disk bottlenecks.",
    },
  ],

  "10": [
    {
      q: "Why does `ssh-keygen -t ed25519` produce a more modern key than `-t rsa 2048`?",
      options: ["ed25519 is longer", "ed25519 uses elliptic curve crypto — equivalent security with much shorter keys, faster operations, and simpler math", "RSA is obsolete", "ed25519 doesn't need a passphrase"],
      answer: 1,
      explain: "ed25519 keys are 256 bits but provide ~128-bit security. An RSA-3072 key is needed for equivalent security. ed25519 is also faster to generate and sign. Recommended for all new keys.",
    },
    {
      q: "What does `ssh -v user@host` help you diagnose?",
      options: ["Network speed", "Exactly what authentication methods are being attempted and why they fail — verbose debug output", "Server CPU load", "Open ports on the server"],
      answer: 1,
      explain: "`-v` = verbose. You see: which keys are being offered, whether agent forwarding is used, which auth methods the server accepts. `-vv` and `-vvv` give even more detail.",
    },
    {
      q: "What is the correct file permission for `~/.ssh/id_ed25519` (your private key)?",
      options: ["644", "755", "600 — owner read/write only", "400 — owner read-only"],
      answer: 2,
      explain: "SSH refuses to use a private key with permissions wider than 600: 'Permissions 0644 for key are too open'. 600 is the standard. Some prefer 400 (read-only), which also works.",
    },
    {
      q: "What does `AllowUsers jahid deploy` in `/etc/ssh/sshd_config` do?",
      options: ["Grants jahid and deploy sudo access", "Allows ONLY jahid and deploy to SSH in — all other users are denied", "Creates those users if they don't exist", "Allows access from those IP addresses"],
      answer: 1,
      explain: "`AllowUsers` is a whitelist. Any user not listed — even root — cannot SSH in. This is one of the most effective ways to restrict SSH access on a shared server.",
    },
    {
      q: "What does `MaxAuthTries 3` in sshd_config do?",
      options: ["Allows 3 users to connect simultaneously", "Disconnects after 3 failed authentication attempts", "Sets 3 minutes as the login timeout", "Requires 3-factor authentication"],
      answer: 1,
      explain: "Limits the number of authentication attempts per connection. After 3 failures, the connection is dropped. Reduces the effectiveness of brute-force attacks.",
    },
    {
      q: "What does `ssh-keygen -R 192.168.1.10` do?",
      options: ["Removes your key from the remote server", "Removes the server's fingerprint entry from ~/.ssh/known_hosts", "Revokes a certificate", "Resets SSH on the remote server"],
      answer: 1,
      explain: "When a server is rebuilt, its host key changes. SSH will refuse to connect with a 'WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED' error. `-R` removes the old entry so you can connect and accept the new key.",
    },
    {
      q: "What does the `IdentityFile` directive in `~/.ssh/config` specify?",
      options: ["The server's public key", "Which private key file to use when connecting to that particular host", "The identity of the SSH server", "Where to store connection logs"],
      answer: 1,
      explain: "Without `IdentityFile`, SSH tries all keys in `~/.ssh/`. With it, only that key is offered — faster and more predictable. Example: `IdentityFile ~/.ssh/prod_deploy_key`.",
    },
    {
      q: "What does `ssh -A user@jumphost` do?",
      options: ["Enables agent authentication on the server", "Forwards your SSH agent, letting you use your local keys on the jump host to connect to further machines", "Audits all commands run on the server", "Compresses the connection"],
      answer: 1,
      explain: "Agent forwarding (`-A`) is useful for jump-host setups: connect to a bastion, then SSH from there to internal servers using your local key — without copying your private key to the bastion.",
    },
    {
      q: "What does `Port 2222` in `/etc/ssh/sshd_config` do and why might you use it?",
      options: ["Limits connections to 2222 per second", "Moves SSH off the default port 22, reducing automated bot scanning and brute-force attempts", "Requires IPv6", "Sets SSH bandwidth to 2222 KB/s"],
      answer: 1,
      explain: "Bots constantly scan port 22. Moving SSH to a non-standard port dramatically reduces noise in auth.log. It's security through obscurity — not a replacement for key auth, but reduces log spam.",
    },
    {
      q: "What does `ClientAliveInterval 600` in sshd_config do?",
      options: ["Closes sessions after 600 seconds of activity", "Sends a keepalive message to the client every 600 seconds — disconnects if no response", "Limits sessions to 600 minutes", "Refreshes client keys every 600 seconds"],
      answer: 1,
      explain: "Idle SSH sessions tie up server resources. `ClientAliveInterval 600` with `ClientAliveCountMax 0` disconnects sessions that haven't responded within 600 seconds (10 minutes).",
    },
  ],

  // Mixed quizzes: +5 each ──────────────────────────────────────────────────

  "mixed-1": [
    {
      q: "What does `Ctrl+L` do in a terminal?",
      options: ["Logs out", "Clears the screen (equivalent to `clear`)", "Locks the terminal", "Lists files"],
      answer: 1,
      explain: "Ctrl+L sends a clear-screen sequence. Unlike `clear`, it keeps your scroll-back history intact — you can scroll up to see previous output.",
    },
    {
      q: "What is the purpose of the sticky bit on `/tmp`?",
      options: ["Makes /tmp read-only", "Users can create files in /tmp but can only delete their OWN files, not others'", "Prevents /tmp from being unmounted", "Makes files in /tmp permanent"],
      answer: 1,
      explain: "/tmp is world-writable. Without the sticky bit, any user could delete any file. The sticky bit (shown as `t` in `drwxrwxrwt`) limits deletion to file owners and root.",
    },
    {
      q: "What does `systemctl is-active nginx` return?",
      options: ["'yes' or 'no'", "'active' if running, 'inactive' or 'failed' otherwise — and an exit code usable in scripts", "The nginx PID", "Nginx's uptime"],
      answer: 1,
      explain: "`is-active` is script-friendly: exit code 0 if active, non-zero if not. Use in scripts: `if systemctl is-active --quiet nginx; then echo running; fi`.",
    },
    {
      q: "What does `echo \"hello\" > /dev/null` do?",
      options: ["Saves 'hello' to a file called /dev/null", "Discards 'hello' — /dev/null accepts and discards all data written to it", "Prints 'hello' to the screen", "Causes an error"],
      answer: 1,
      explain: "`/dev/null` is the discard device. Writing to it silently drops the data. Reading from it returns EOF immediately. Use it to suppress output you don't need.",
    },
    {
      q: "What does `sudo !!` do?",
      options: ["Runs the last command twice", "Re-runs the last command with sudo prepended", "Shows the last sudo command", "Opens a sudo shell"],
      answer: 1,
      explain: "`!!` is bash history expansion meaning 'the last command'. `sudo !!` is the quick fix when you forget `sudo` — instead of retyping the whole command.",
    },
  ],

  "mixed-2": [
    {
      q: "What does `tar -czf backup.tar.gz /home/jahid/` create?",
      options: ["A zip file", "A gzip-compressed tar archive of /home/jahid/", "A copy of /home/jahid/", "An encrypted archive"],
      answer: 1,
      explain: "`-c` = create, `-z` = gzip compression, `-f` = filename. Extract with `tar -xzf backup.tar.gz`. `-v` adds verbose output to see each file.",
    },
    {
      q: "What does `chmod -x script.sh` do?",
      options: ["Removes execute permission for everyone (owner, group, others)", "Adds execute permission", "Changes the script to read-only", "Makes the script hidden"],
      answer: 0,
      explain: "Without specifying a category, `+x`/`-x` applies to all three: owner, group, others. To remove execute only for others: `chmod o-x script.sh`.",
    },
    {
      q: "What does `grep -v 'pattern' file.txt` do?",
      options: ["Shows only lines matching the pattern", "Shows all lines that do NOT match the pattern (inverted match)", "Counts matching lines", "Validates the pattern syntax"],
      answer: 1,
      explain: "`-v` = invert. `grep -v '^#' config.conf` is a common idiom: show all lines that aren't comments. Very useful for filtering out noise.",
    },
    {
      q: "What does `ps aux | grep nginx | grep -v grep` do?",
      options: ["Shows nginx processes", "Shows nginx processes, excluding the grep command itself from results", "Counts nginx processes", "Kills all grep processes"],
      answer: 1,
      explain: "`ps aux | grep nginx` also shows the grep process itself (which contains 'nginx' in its command). `grep -v grep` removes that line from results.",
    },
    {
      q: "What does `crontab -e` do?",
      options: ["Executes all cron jobs immediately", "Opens your personal crontab file for editing", "Shows the error log for cron", "Enables the cron service"],
      answer: 1,
      explain: "`crontab -e` opens your personal crontab in the default editor. `crontab -l` lists it. `crontab -r` removes it entirely. System crontabs are in `/etc/cron.d/`.",
    },
  ],

  "mixed-3": [
    {
      q: "What does `df -h --total` show?",
      options: ["Only the total disk space", "Disk usage per filesystem with an extra row showing the combined total", "Disk usage in hex", "Disk fragmentation percentage"],
      answer: 1,
      explain: "`--total` adds a summary line at the bottom totalling all filesystems. Useful for a quick view of overall disk capacity across multiple mounts.",
    },
    {
      q: "What does `ssh user@host 'df -h'` do without opening an interactive session?",
      options: ["Copies df to the remote host", "Runs `df -h` on the remote host and prints the output locally, then exits", "Checks disk space locally", "Opens df on the remote host interactively"],
      answer: 1,
      explain: "Quoting a command after the SSH destination runs it non-interactively and returns the output to your local terminal. Ideal for scripted health checks across multiple servers.",
    },
    {
      q: "What does `for f in *.txt; do cp \"$f\" \"${f%.txt}.bak\"; done` do?",
      options: ["Deletes all .txt files", "Copies each .txt file to a .bak version (e.g. notes.txt → notes.bak)", "Renames .txt files to .bak", "Creates a backup directory"],
      answer: 1,
      explain: "`${f%.txt}` strips the `.txt` suffix. Appending `.bak` gives the new name. `cp` preserves the original. A clean in-place backup before editing multiple files.",
    },
    {
      q: "What does `journalctl -u nginx --since today` show?",
      options: ["All nginx logs ever", "nginx service logs from midnight today to now", "nginx logs from the last 24 hours", "nginx logs since the service was installed"],
      answer: 1,
      explain: "`--since today` means since 00:00:00 today. Other shortcuts: `--since yesterday`, `--since '1 hour ago'`, or exact: `--since '2024-06-20 08:00:00'`.",
    },
    {
      q: "What does `rsync -avz --exclude='.git' src/ dest/` do?",
      options: ["Copies everything except the dest/", "Syncs src/ to dest/ but skips any .git directories", "Excludes hidden files only", "Removes .git from both sides"],
      answer: 1,
      explain: "`--exclude` skips matching files/directories. Multiple `--exclude` flags can be used. `--exclude-from=file` reads patterns from a file. Very useful when syncing project directories.",
    },
  ],

  "mixed-4": [
    {
      q: "What does `apt-get install -f` do?",
      options: ["Force installs a broken package", "Fixes broken package dependencies — downloads and installs missing dependencies", "Installs from a file", "Formats the package cache"],
      answer: 1,
      explain: "`-f` (fix-broken) is used when packages have unresolved dependencies. After manually installing a .deb with `dpkg -i`, run `apt-get install -f` to pull in any missing dependencies.",
    },
    {
      q: "What does `ssh-add ~/.ssh/id_ed25519` do?",
      options: ["Copies the key to a server", "Adds the private key to the SSH agent so you don't need to type the passphrase again", "Creates a new key", "Adds the key to authorized_keys"],
      answer: 1,
      explain: "The SSH agent holds decrypted private keys in memory. Once added with `ssh-add`, you type the passphrase once per session. The agent presents the key automatically for all subsequent SSH connections.",
    },
    {
      q: "What does `sudo journalctl -p err --since '24 hours ago'` find?",
      options: ["All logs from 24 hours ago", "Error-level and above log entries from the last 24 hours", "Errors from the last 24 services", "The 24 most recent errors"],
      answer: 1,
      explain: "Combining `-p err` (priority filter) with `--since` gives you a focused view: serious errors only, within a recent window. Add `-u servicename` to narrow to one service.",
    },
    {
      q: "What does `chmod 4755 /usr/local/bin/myscript` do?",
      options: ["Sets standard 755 permissions", "Sets 755 permissions AND the SUID bit — the script runs as its owner, not the caller", "Gives full access to 4 users", "Sets immutable flag"],
      answer: 1,
      explain: "The leading `4` sets SUID. With `755` for the rest, the file is executable by everyone and runs with the file owner's privileges. Use carefully — SUID scripts can be a security risk.",
    },
    {
      q: "What does `while true; do echo 'tick'; sleep 1; done` do?",
      options: ["Runs once", "Loops forever, printing 'tick' every second until Ctrl+C", "Runs for 1 second total", "Runs 'true' as a command"],
      answer: 1,
      explain: "`while true` runs forever because `true` always exits 0. This is the standard way to write an infinite loop in bash. Use `break` inside to exit based on a condition.",
    },
  ],

  "mixed-5": [
    {
      q: "What does `2>&1` mean in `command > output.log 2>&1`?",
      options: ["Redirects stderr to file descriptor 1 (stdout), so both stdout and stderr go to output.log", "Runs the command twice", "Sends output to 2 files", "Duplicates stderr"],
      answer: 0,
      explain: "Order matters: `> output.log` redirects stdout to the file. `2>&1` then redirects stderr to wherever stdout currently points (the file). Result: both streams go to output.log.",
    },
    {
      q: "What does `kill -0 PID` do?",
      options: ["Kills the process with no warning", "Checks if the process exists and is killable — sends no actual signal", "Sends the gentlest possible stop signal", "Resets the process priority to 0"],
      answer: 1,
      explain: "Signal 0 doesn't actually send anything. It just checks whether the process exists and whether you have permission to signal it. Exit code 0 = process exists, non-zero = doesn't exist or no permission.",
    },
    {
      q: "What does `tee -a logfile.txt` do in a pipeline?",
      options: ["Truncates logfile.txt then writes", "Writes to stdout AND appends to logfile.txt (instead of overwriting)", "Reads from logfile.txt", "Tests file integrity"],
      answer: 1,
      explain: "`tee` by default overwrites. `-a` = append. `command | tee -a logfile.txt` shows output on screen while building a persistent log — useful for long-running scripts.",
    },
    {
      q: "What does `find /var/log -name '*.log' -mtime +30 -delete` do?",
      options: ["Lists logs older than 30 minutes", "Deletes log files in /var/log older than 30 days", "Archives logs from last month", "Finds and moves 30-day-old logs"],
      answer: 1,
      explain: "`-mtime +30` = modified more than 30 days ago. `-delete` removes them. A lightweight alternative to logrotate for simple cleanup. Always test without `-delete` first using `-print`.",
    },
    {
      q: "What does `exec > >(tee -a script.log) 2>&1` at the top of a script do?",
      options: ["Tees only stderr to the log", "Redirects all subsequent stdout AND stderr in the script to both the terminal and script.log", "Executes the script in a subshell", "Only logs errors"],
      answer: 1,
      explain: "`exec` with redirects changes the file descriptors for the rest of the script. This pattern captures all output to a log file while still displaying it — without wrapping every command in `| tee`.",
    },
  ],
};

// Merge extra questions into the main QUESTIONS object
Object.keys(EXTRA_QUESTIONS).forEach(key => {
  if (QUESTIONS[key]) {
    QUESTIONS[key] = QUESTIONS[key].concat(EXTRA_QUESTIONS[key]);
  }
});
