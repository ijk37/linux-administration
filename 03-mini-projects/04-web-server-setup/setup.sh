#!/bin/bash
# setup.sh — Automated Nginx web server setup
#
# Usage: sudo ./setup.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_DIR="/var/www/mysite"
VHOST_CONF="/etc/nginx/sites-available/mysite"
VHOST_LINK="/etc/nginx/sites-enabled/mysite"

GREEN='\033[0;32m'; CYAN='\033[0;36m'; RESET='\033[0m'
ok()   { echo -e "${GREEN}[OK]${RESET} $*"; }
step() { echo -e "\n${CYAN}>>>${RESET} $*"; }

[ "$EUID" -ne 0 ] && { echo "Run as root: sudo $0"; exit 1; }

step "Installing Nginx..."
apt-get update -qq
apt-get install -y nginx
ok "Nginx installed"

step "Configuring firewall (UFW)..."
ufw allow ssh    2>/dev/null || true
ufw allow http   2>/dev/null || true
ufw allow https  2>/dev/null || true
ufw --force enable 2>/dev/null || true
ok "Firewall configured (SSH, HTTP, HTTPS allowed)"

step "Setting up web root at $SITE_DIR..."
mkdir -p "$SITE_DIR"
cp -r "$SCRIPT_DIR/www/." "$SITE_DIR/"
chown -R www-data:www-data "$SITE_DIR"
chmod -R 755 "$SITE_DIR"
ok "Web files deployed"

step "Installing virtual host config..."
cp "$SCRIPT_DIR/nginx-vhost.conf" "$VHOST_CONF"
ln -sf "$VHOST_CONF" "$VHOST_LINK"

# Disable default site if it exists
rm -f /etc/nginx/sites-enabled/default
ok "Virtual host configured"

step "Testing Nginx config..."
nginx -t
ok "Config valid"

step "Starting / reloading Nginx..."
systemctl enable nginx
systemctl reload nginx || systemctl start nginx
ok "Nginx running"

echo ""
echo "======================================"
ok "Setup complete!"
echo "  Site root:  $SITE_DIR"
echo "  Config:     $VHOST_CONF"
echo "  Test:       curl http://localhost"
echo "======================================"
