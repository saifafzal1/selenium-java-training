#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  SeleniumLab — Oracle Cloud ARM VM Setup
#  Installs Ollama + Qwen3 as a permanent AI backend
#
#  Run on your Oracle VM:
#    chmod +x oracle-setup.sh && ./oracle-setup.sh
# ═══════════════════════════════════════════════════════════════

set -e

GREEN='\033[0;32m'
ORANGE='\033[0;33m'
NC='\033[0m'

echo -e "${ORANGE}"
echo "  ██████╗ ██████╗  █████╗  ██████╗██╗     ███████╗"
echo "  ██╔══██╗██╔══██╗██╔══██╗██╔════╝██║     ██╔════╝"
echo "  ██║  ██║██████╔╝███████║██║     ██║     █████╗  "
echo "  ██║  ██║██╔══██╗██╔══██║██║     ██║     ██╔══╝  "
echo "  ╚█████╔╝██║  ██║██║  ██║╚██████╗███████╗███████╗"
echo "   ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚══════╝╚══════╝"
echo -e "${NC}"
echo "  Oracle Cloud ARM — Ollama + Qwen3 Setup"
echo ""

# ── 1. System update ────────────────────────────────────────────
echo -e "${GREEN}[1/6]${NC} Updating system packages..."
sudo apt-get update -qq && sudo apt-get upgrade -y -qq
sudo apt-get install -y -qq curl wget nginx ufw

# ── 2. Install Ollama ───────────────────────────────────────────
echo -e "${GREEN}[2/6]${NC} Installing Ollama..."
curl -fsSL https://ollama.ai/install.sh | sh

# ── 3. Configure Ollama service ─────────────────────────────────
echo -e "${GREEN}[3/6]${NC} Configuring Ollama to listen on all interfaces..."
sudo mkdir -p /etc/systemd/system/ollama.service.d/
cat << 'EOF' | sudo tee /etc/systemd/system/ollama.service.d/override.conf
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
Environment="OLLAMA_ORIGINS=*"
EOF

sudo systemctl daemon-reload
sudo systemctl enable ollama
sudo systemctl restart ollama
sleep 4

# ── 4. Pull Qwen3 model ─────────────────────────────────────────
echo -e "${GREEN}[4/6]${NC} Pulling qwen3:8b model (~5GB, this takes a few minutes)..."
ollama pull qwen3:8b

# ── 5. Configure nginx reverse proxy with secret token ──────────
echo -e "${GREEN}[5/6]${NC} Setting up nginx proxy with secret token auth..."

# Generate a random secret token
SECRET_TOKEN=$(openssl rand -hex 24)

cat << EOF | sudo tee /etc/nginx/sites-available/ollama
server {
    listen 80;
    server_name _;

    # Health check — no auth needed (for Vercel /api/debug)
    location = /health {
        return 200 'ok';
        add_header Content-Type text/plain;
    }

    # All Ollama API routes — require secret token header
    location /api/ {
        # Reject requests without the secret token
        if (\$http_x_ollama_token != "${SECRET_TOKEN}") {
            return 403 'Forbidden';
        }

        proxy_pass         http://localhost:11434;
        proxy_http_version 1.1;
        proxy_set_header   Host \$host;
        proxy_set_header   X-Real-IP \$remote_addr;
        proxy_buffering    off;
        proxy_read_timeout 120s;
        chunked_transfer_encoding on;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/ollama /etc/nginx/sites-enabled/ollama
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl enable nginx && sudo systemctl restart nginx

# ── 6. Configure firewall ───────────────────────────────────────
echo -e "${GREEN}[6/6]${NC} Configuring firewall..."
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw --force enable

# ── Done ────────────────────────────────────────────────────────
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip)

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅  Setup complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo "  Add these to Vercel → Settings → Environment Variables:"
echo ""
echo -e "  ${ORANGE}OLLAMA_URL${NC}     =  http://${PUBLIC_IP}"
echo -e "  ${ORANGE}OLLAMA_TOKEN${NC}   =  ${SECRET_TOKEN}"
echo -e "  ${ORANGE}QWEN_MODEL${NC}     =  qwen3:8b"
echo ""
echo "  Then redeploy your Vercel project."
echo ""
echo "  ℹ️  Also open port 80 in Oracle Cloud:"
echo "  VCN → Security Lists → Add Ingress Rule:"
echo "  Source: 0.0.0.0/0  Protocol: TCP  Port: 80"
echo ""
