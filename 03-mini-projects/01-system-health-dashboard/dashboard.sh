#!/bin/bash
# dashboard.sh — System Health Dashboard
#
# Usage: ./dashboard.sh [--no-color]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"

# ── Color support ────────────────────────────────────────────────────────────
USE_COLOR=true
[[ "${1:-}" == "--no-color" ]] && USE_COLOR=false

c() {
    $USE_COLOR && echo -e "$1" || echo -e "$2"
}

RED=$(   $USE_COLOR && printf '\033[0;31m' || true)
GREEN=$( $USE_COLOR && printf '\033[0;32m' || true)
YELLOW=$($USE_COLOR && printf '\033[0;33m' || true)
CYAN=$(  $USE_COLOR && printf '\033[0;36m' || true)
BOLD=$(  $USE_COLOR && printf '\033[1m'    || true)
RESET=$( $USE_COLOR && printf '\033[0m'    || true)

# ── Helpers ──────────────────────────────────────────────────────────────────
header() {
    local TITLE="SYSTEM HEALTH DASHBOARD — $(date '+%Y-%m-%d %H:%M')"
    local LEN=${#TITLE}
    local BORDER
    BORDER=$(printf '═%.0s' $(seq 1 $((LEN + 2))))
    echo ""
    echo "${BOLD}${CYAN}╔${BORDER}╗${RESET}"
    echo "${BOLD}${CYAN}║ ${TITLE} ║${RESET}"
    echo "${BOLD}${CYAN}╚${BORDER}╝${RESET}"
    echo ""
}

section() {
    echo "${BOLD}[${1}]${RESET}"
}

ok()   { echo "  ${GREEN}[OK]${RESET}   $*"; }
warn() { echo "  ${YELLOW}[WARN]${RESET} $*"; }
fail() { echo "  ${RED}[DOWN]${RESET} $*"; }
info() { echo "  $*"; }

# ── Metrics ──────────────────────────────────────────────────────────────────
check_host() {
    local HOST
    HOST=$(hostname)
    local UPTIME_STR
    UPTIME_STR=$(uptime -p 2>/dev/null || uptime | sed 's/.*up //' | sed 's/,.*//')
    echo "HOST: ${BOLD}$HOST${RESET} | UPTIME: $UPTIME_STR"
    echo ""
}

check_cpu() {
    section "CPU"
    local LOAD
    LOAD=$(cut -d" " -f1,2,3 /proc/loadavg)
    local LOAD1
    LOAD1=$(cut -d" " -f1 /proc/loadavg)
    local CPUS
    CPUS=$(nproc)
    local PCT
    PCT=$(echo "$LOAD1 $CPUS" | awk '{printf "%.0f", ($1/$2)*100}')
    info "Load (1/5/15): $LOAD"
    info "Cores: $CPUS | Load: ~${PCT}%"
    [ "$PCT" -ge "$CPU_WARN" ] && warn "High CPU load: ${PCT}%!"
    echo ""
}

check_memory() {
    section "MEMORY"
    local TOTAL USED FREE PCT
    read -r TOTAL USED FREE <<< "$(free -h | awk 'NR==2{print $2, $3, $4}')"
    PCT=$(free | awk 'NR==2{printf "%.0f", $3/$2*100}')
    info "Total: $TOTAL | Used: $USED | Free: $FREE | Used: ${PCT}%"
    [ "$PCT" -ge "$MEM_WARN" ] && warn "High memory usage: ${PCT}%!"

    local SWAP_USED
    SWAP_USED=$(free | awk 'NR==3{print $3}')
    [ "$SWAP_USED" -gt 0 ] && info "Swap in use: $(free -h | awk 'NR==3{print $3}')"
    echo ""
}

check_disk() {
    section "DISK"
    while IFS= read -r line; do
        local FS USED AVAIL PCT MP
        FS=$(echo "$line"    | awk '{print $1}')
        USED=$(echo "$line"  | awk '{print $3}')
        AVAIL=$(echo "$line" | awk '{print $4}')
        PCT=$(echo "$line"   | awk '{print $5}' | tr -d '%')
        MP=$(echo "$line"    | awk '{print $6}')
        local BAR=""
        local FILLED=$((PCT / 10))
        for ((i=0; i<10; i++)); do
            [ $i -lt $FILLED ] && BAR+="█" || BAR+="░"
        done
        local MSG
        MSG=$(printf "  %-12s → [%s] %3d%%  (used %s, avail %s)" "$MP" "$BAR" "$PCT" "$USED" "$AVAIL")
        if [ "$PCT" -ge "$DISK_WARN" ]; then
            echo "${RED}${MSG}  ⚠ FULL${RESET}"
        else
            echo "$MSG"
        fi
    done < <(df -h --output=source,used,avail,pcent,target | grep -v tmpfs | grep -v "^Filesystem" | grep -v "^udev")
    echo ""
}

check_network() {
    section "NETWORK"
    local IFACE IP
    IFACE=$(ip route 2>/dev/null | awk '/^default/{print $5; exit}')
    IP=$(ip addr show "$IFACE" 2>/dev/null | awk '/inet /{print $2; exit}')
    info "Interface: $IFACE | IP: $IP"
    echo ""
}

check_services() {
    section "SERVICES"
    for SVC in $SERVICES; do
        if systemctl is-active --quiet "$SVC" 2>/dev/null; then
            ok "$SVC"
        elif systemctl list-unit-files --quiet "$SVC.service" &>/dev/null; then
            fail "$SVC (stopped)"
        else
            echo "  ${YELLOW}[N/A]${RESET}  $SVC (not installed)"
        fi
    done
    echo ""
}

check_errors() {
    section "RECENT ERRORS (last ${RECENT_ERROR_MINUTES}m)"
    local ERRORS
    ERRORS=$(journalctl -p err --since "${RECENT_ERROR_MINUTES} minutes ago" \
             --no-pager -q 2>/dev/null | tail -"$MAX_ERRORS_SHOWN")
    if [ -z "$ERRORS" ]; then
        ok "No errors in the last ${RECENT_ERROR_MINUTES} minutes"
    else
        echo "$ERRORS" | while IFS= read -r line; do
            echo "  ${RED}${line}${RESET}"
        done
    fi
    echo ""
}

# ── Main ─────────────────────────────────────────────────────────────────────
main() {
    header
    check_host
    check_cpu
    check_memory
    check_disk
    check_network
    check_services
    check_errors
}

main
