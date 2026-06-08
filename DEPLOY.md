# Deploying to Vercel

## Step 1 — Push to GitHub

1. Go to https://github.com/new and create a new **public** repository (e.g. `selenium-java-training`)
2. In Terminal, inside the `selenium-training` folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/selenium-java-training.git
git push -u origin main
```

---

## Step 2 — Deploy on Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `selenium-java-training` repository
4. Settings (Vercel auto-detects these):
   - **Framework Preset**: Other
   - **Root Directory**: `selenium-training`
   - **Output Directory**: `public`
5. Click **Deploy** — your site will be live in ~60 seconds at a URL like `https://selenium-java-training.vercel.app`

---

## Step 3 — Enable AI Chat (Ollama via Tunnel)

Since Ollama runs on your local machine, you need to expose it publicly.

### Option A — Cloudflare Tunnel (recommended, free)

```bash
# Install cloudflared (macOS)
brew install cloudflare/cloudflare/cloudflared

# Start a tunnel to your local Ollama
cloudflared tunnel --url http://localhost:11434
```

Cloudflared prints a URL like `https://random-words.trycloudflare.com`

### Option B — ngrok (also free)
```bash
# Install: https://ngrok.com/download
ngrok http 11434
# Prints: https://xxxx.ngrok-free.app
```

### Set the tunnel URL in Vercel

1. In your Vercel project → **Settings → Environment Variables**
2. Add:
   | Name | Value |
   |------|-------|
   | `OLLAMA_URL` | `https://your-tunnel-url` |
   | `QWEN_MODEL` | `qwen3:latest` |
3. Click **Save** then **Redeploy**

> ⚠️ Keep `ollama serve` and the tunnel running on your machine for chat to work.
> The learning content and progress tracking work without the tunnel.

---

## Local development (unchanged)

```bash
npm install
npm start
# http://localhost:3000
```
