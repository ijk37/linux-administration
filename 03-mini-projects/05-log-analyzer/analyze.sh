#!/bin/bash
# analyze.sh — Nginx Access Log Analyzer
#
# Usage: ./analyze.sh <logfile>

set -euo pipefail

LOG_FILE="${1:-}"
TOP_N=10

if [ -z "$LOG_FILE" ]; then
    echo "Usage: $0 <nginx-access-log>"
    echo "Example: $0 sample.log"
    exit 1
fi

if [ ! -f "$LOG_FILE" ]; then
    echo "Error: File '$LOG_FILE' not found."
    exit 1
fi

# ── Colors ───────────────────────────────────────────────────────────────────
BOLD='\033[1m'; CYAN='\033[0;36m'; GREEN='\033[0;32m'
YELLOW='\033[1;33m'; RED='\033[0;31m'; RESET='\033[0m'

section() { echo -e "\n${BOLD}[${1}]${RESET}"; }

# ── Bar chart helper ──────────────────────────────────────────────────────────
bar_chart() {
    local VALUE=$1
    local MAX=$2
    local WIDTH=20
    local FILLED=0
    [ "$MAX" -gt 0 ] && FILLED=$(( VALUE * WIDTH / MAX ))
    local BAR=""
    for ((i=0; i<WIDTH; i++)); do
        [ $i -lt $FILLED ] && BAR+="█" || BAR+="░"
    done
    echo "$BAR"
}

# ── Parse log ────────────────────────────────────────────────────────────────
TOTAL=$(wc -l < "$LOG_FILE")
FIRST_TS=$(awk 'NR==1{print $4}' "$LOG_FILE" | tr -d '[')
LAST_TS=$( awk 'END{print $4}' "$LOG_FILE"   | tr -d '[')

# ── Header ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${CYAN}╔═════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}${CYAN}║       Nginx Access Log Report           ║${RESET}"
echo -e "${BOLD}${CYAN}╚═════════════════════════════════════════╝${RESET}"
echo ""
echo "  Log file:       $LOG_FILE"
echo "  First entry:    $FIRST_TS"
echo "  Last entry:     $LAST_TS"
echo "  Total requests: $TOTAL"

# ── Top IPs ──────────────────────────────────────────────────────────────────
section "Top $TOP_N IP Addresses"
MAX_IP=$(awk '{print $1}' "$LOG_FILE" | sort | uniq -c | sort -rn | head -1 | awk '{print $1}')
awk '{print $1}' "$LOG_FILE" | sort | uniq -c | sort -rn | head -"$TOP_N" | \
while read -r COUNT IP; do
    CHART=$(bar_chart "$COUNT" "$MAX_IP")
    printf "  %-18s %s %4d requests\n" "$IP" "$CHART" "$COUNT"
done

# ── Top Pages ────────────────────────────────────────────────────────────────
section "Top $TOP_N Requested Pages"
MAX_PAGE=$(awk '{print $7}' "$LOG_FILE" | sort | uniq -c | sort -rn | head -1 | awk '{print $1}')
awk '{print $7}' "$LOG_FILE" | sort | uniq -c | sort -rn | head -"$TOP_N" | \
while read -r COUNT PAGE; do
    CHART=$(bar_chart "$COUNT" "$MAX_PAGE")
    printf "  %-25s %s %4d requests\n" "$PAGE" "$CHART" "$COUNT"
done

# ── HTTP Status Codes ─────────────────────────────────────────────────────────
section "HTTP Status Codes"
awk '{print $9}' "$LOG_FILE" | sort | uniq -c | sort -rn | \
while read -r COUNT CODE; do
    PCT=$(( COUNT * 100 / TOTAL ))
    case $CODE in
        2*) COLOR=$GREEN ;;
        3*) COLOR=$CYAN ;;
        4*) COLOR=$YELLOW ;;
        5*) COLOR=$RED ;;
        *)  COLOR=$RESET ;;
    esac
    printf "  ${COLOR}%3s${RESET}  %4d requests  (%d%%)\n" "$CODE" "$COUNT" "$PCT"
done

# ── Requests by Hour ─────────────────────────────────────────────────────────
section "Requests by Hour"
MAX_HOUR=$(awk '{print $4}' "$LOG_FILE" | grep -oP ':\d{2}:' | tr -d ':' | \
    awk '{h=$1+0; count[h]++} END{m=0; for(k in count) if(count[k]>m) m=count[k]; print m}')

awk '{print $4}' "$LOG_FILE" | grep -oP ':\d{2}:' | tr -d ':' | \
    awk '{h=$1+0; count[h]++} END{for(h=0;h<24;h++) printf "%02d %d\n", h, count[h]+0}' | \
while read -r HOUR COUNT; do
    CHART=$(bar_chart "$COUNT" "$MAX_HOUR")
    printf "  %02d:xx  %s  %3d\n" "$HOUR" "$CHART" "$COUNT"
done

# ── Error Rate ────────────────────────────────────────────────────────────────
section "Error Summary"
ERR4=$(awk '$9 ~ /^4/' "$LOG_FILE" | wc -l)
ERR5=$(awk '$9 ~ /^5/' "$LOG_FILE" | wc -l)
PCT4=$(( ERR4 * 100 / TOTAL ))
PCT5=$(( ERR5 * 100 / TOTAL ))

echo -e "  4xx errors: ${YELLOW}$ERR4${RESET} (${PCT4}%)"
echo -e "  5xx errors: ${RED}$ERR5${RESET} (${PCT5}%)"

TOTAL_ERR=$(( ERR4 + ERR5 ))
if [ "$TOTAL_ERR" -eq 0 ]; then
    echo -e "  ${GREEN}No errors detected!${RESET}"
elif [ "$(( TOTAL_ERR * 100 / TOTAL ))" -ge 10 ]; then
    echo -e "  ${RED}WARNING: Error rate is $(( TOTAL_ERR * 100 / TOTAL ))% — investigate!${RESET}"
fi

echo ""
