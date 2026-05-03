#!/usr/bin/env bash
# deploy.sh – provision Blackshield API on Ubuntu 24.04

set -euo pipefail

# 1. Install Node.js 18+ using apt (Ubuntu)
if ! command -v node >/dev/null 2>&1; then
  echo "Installing Node.js via apt..."
  sudo apt update
  sudo apt install -y nodejs npm
else
  echo "Node.js already installed: $(node -v)"
fi

# 2. Ensure we are in the backend directory
cd "$(dirname "$0")"

# 3. Install exact dependencies
npm ci

# 4. Copy example env if .env does not exist
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Please edit .env with your SUPABASE_URL and SUPABASE_ANON_KEY before proceeding."
fi

# 5. Install PM2 globally
sudo npm install -g pm2

# 6. Start the app with PM2 using the ecosystem file
pm2 start ecosystem.config.js

# 7. Enable PM2 startup on system reboot (Ubuntu systemd)
pm pm2 startup systemd -u $(whoami) --hp $(eval echo ~$(whoami))
pm pm2 save

# 8. Open port 8080 using ufw (required for Ubuntu firewall)
if command -v ufw >/dev/null 2>&1; then
  sudo ufw allow 8080/tcp
  sudo ufw reload
else
  echo "ufw not installed; installing..."
  sudo apt install -y ufw
  sudo ufw allow 8080/tcp
  sudo ufw reload
fi

echo "Deployment complete. API should be reachable on port 8080."

# Reminder: when SSH-ing into the Ubuntu VPS, use the Ubuntu username (e.g., 'ubuntu').
