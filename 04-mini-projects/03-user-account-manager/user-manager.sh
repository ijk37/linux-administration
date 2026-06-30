#!/bin/bash
# user-manager.sh — Interactive Linux User Account Manager
#
# Must be run as root or with sudo.

set -euo pipefail

# ── Permission check ─────────────────────────────────────────────────────────
if [ "$EUID" -ne 0 ]; then
    echo "Error: This script must be run as root."
    echo "Try: sudo $0"
    exit 1
fi

# ── Colors ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

msg_ok()   { echo -e "${GREEN}[OK]${RESET} $*"; }
msg_err()  { echo -e "${RED}[ERROR]${RESET} $*"; }
msg_warn() { echo -e "${YELLOW}[WARN]${RESET} $*"; }
msg_info() { echo -e "${CYAN}[INFO]${RESET} $*"; }

# ── Helpers ──────────────────────────────────────────────────────────────────
print_header() {
    clear
    echo -e "${BOLD}${CYAN}"
    echo "╔══════════════════════════════════╗"
    echo "║   Linux User Account Manager     ║"
    echo "╚══════════════════════════════════╝"
    echo -e "${RESET}"
}

pause() {
    echo ""
    read -r -p "Press Enter to continue..."
}

validate_username() {
    local NAME=$1
    if [[ ! "$NAME" =~ ^[a-z_][a-z0-9_-]{0,31}$ ]]; then
        msg_err "Invalid username. Use lowercase letters, digits, hyphens, underscores (max 32 chars)."
        return 1
    fi
}

user_exists() {
    id "$1" &>/dev/null
}

# ── Actions ──────────────────────────────────────────────────────────────────
list_users() {
    echo -e "\n${BOLD}Regular Users (UID >= 1000):${RESET}"
    echo "────────────────────────────────────────────────────────────"
    printf "%-20s %-6s %-6s %-20s %s\n" "USERNAME" "UID" "GID" "HOME" "SHELL"
    echo "────────────────────────────────────────────────────────────"
    awk -F: '$3 >= 1000 && $3 != 65534 {
        printf "%-20s %-6s %-6s %-20s %s\n", $1, $3, $4, $6, $7
    }' /etc/passwd
    echo ""
    local TOTAL
    TOTAL=$(awk -F: '$3 >= 1000 && $3 != 65534' /etc/passwd | wc -l)
    msg_info "Total: $TOTAL user(s)"
}

create_user() {
    echo -e "\n${BOLD}Create New User${RESET}"
    read -r -p "Username: " USERNAME
    validate_username "$USERNAME" || return

    if user_exists "$USERNAME"; then
        msg_err "User '$USERNAME' already exists."
        return
    fi

    read -r -p "Full name (GECOS): " FULLNAME
    read -r -p "Shell [/bin/bash]: " SHELL
    SHELL=${SHELL:-/bin/bash}

    read -r -p "Create home directory? [Y/n]: " CREATE_HOME
    CREATE_HOME=${CREATE_HOME:-Y}

    local HOME_FLAG="-m"
    [[ "$CREATE_HOME" =~ ^[Nn]$ ]] && HOME_FLAG="-M"

    useradd $HOME_FLAG -s "$SHELL" -c "$FULLNAME" "$USERNAME"
    msg_ok "User '$USERNAME' created."

    read -r -p "Set password now? [Y/n]: " SET_PASS
    [[ ! "$SET_PASS" =~ ^[Nn]$ ]] && passwd "$USERNAME"

    read -r -p "Add to group (leave blank to skip): " GROUP
    if [ -n "$GROUP" ]; then
        if getent group "$GROUP" >/dev/null 2>&1; then
            usermod -aG "$GROUP" "$USERNAME"
            msg_ok "Added '$USERNAME' to group '$GROUP'."
        else
            msg_warn "Group '$GROUP' does not exist."
        fi
    fi

    msg_ok "User '$USERNAME' setup complete."
}

delete_user() {
    echo -e "\n${BOLD}Delete User${RESET}"
    read -r -p "Username to delete: " USERNAME

    if ! user_exists "$USERNAME"; then
        msg_err "User '$USERNAME' does not exist."
        return
    fi

    echo ""
    msg_warn "This will delete user '$USERNAME'."
    read -r -p "Also delete home directory? [y/N]: " DEL_HOME
    read -r -p "Confirm deletion of '$USERNAME'? [y/N]: " CONFIRM

    [[ ! "$CONFIRM" =~ ^[Yy]$ ]] && { echo "Cancelled."; return; }

    local FLAG=""
    [[ "$DEL_HOME" =~ ^[Yy]$ ]] && FLAG="-r"

    # shellcheck disable=SC2086
    userdel $FLAG "$USERNAME"
    msg_ok "User '$USERNAME' deleted."
}

lock_unlock_user() {
    echo -e "\n${BOLD}Lock / Unlock User${RESET}"
    read -r -p "Username: " USERNAME

    if ! user_exists "$USERNAME"; then
        msg_err "User '$USERNAME' does not exist."
        return
    fi

    local STATUS
    STATUS=$(passwd -S "$USERNAME" 2>/dev/null | awk '{print $2}')
    echo "Current status: $STATUS"
    echo ""
    echo "1. Lock account"
    echo "2. Unlock account"
    read -r -p "Select [1/2]: " CHOICE

    case $CHOICE in
        1) usermod -L "$USERNAME"; msg_ok "Account '$USERNAME' locked." ;;
        2) usermod -U "$USERNAME"; msg_ok "Account '$USERNAME' unlocked." ;;
        *) msg_err "Invalid choice." ;;
    esac
}

reset_password() {
    echo -e "\n${BOLD}Reset Password${RESET}"
    read -r -p "Username: " USERNAME

    if ! user_exists "$USERNAME"; then
        msg_err "User '$USERNAME' does not exist."
        return
    fi

    passwd "$USERNAME"

    read -r -p "Force password change on next login? [y/N]: " FORCE
    [[ "$FORCE" =~ ^[Yy]$ ]] && chage -d 0 "$USERNAME" && msg_info "User must change password on next login."
}

add_to_group() {
    echo -e "\n${BOLD}Add User to Group${RESET}"
    read -r -p "Username: " USERNAME

    if ! user_exists "$USERNAME"; then
        msg_err "User '$USERNAME' does not exist."
        return
    fi

    echo "Current groups: $(id -nG "$USERNAME")"
    read -r -p "Group to add: " GROUP

    if ! getent group "$GROUP" >/dev/null 2>&1; then
        read -r -p "Group '$GROUP' doesn't exist. Create it? [y/N]: " CREATE_GROUP
        [[ "$CREATE_GROUP" =~ ^[Yy]$ ]] || { echo "Cancelled."; return; }
        groupadd "$GROUP"
        msg_ok "Group '$GROUP' created."
    fi

    usermod -aG "$GROUP" "$USERNAME"
    msg_ok "Added '$USERNAME' to '$GROUP'. New groups: $(id -nG "$USERNAME")"
}

# ── Main Menu ─────────────────────────────────────────────────────────────────
while true; do
    print_header
    echo "1. List all users"
    echo "2. Create a new user"
    echo "3. Delete a user"
    echo "4. Lock / Unlock a user"
    echo "5. Reset a password"
    echo "6. Add user to group"
    echo "7. Exit"
    echo ""
    read -r -p "Select option [1-7]: " CHOICE

    case $CHOICE in
        1) list_users      ; pause ;;
        2) create_user     ; pause ;;
        3) delete_user     ; pause ;;
        4) lock_unlock_user; pause ;;
        5) reset_password  ; pause ;;
        6) add_to_group    ; pause ;;
        7) echo "Goodbye!"; exit 0 ;;
        *) msg_err "Invalid option '$CHOICE'." ; sleep 1 ;;
    esac
done
