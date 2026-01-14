# 🚀 Seoul Accessible Transit - Production Deployment Guide

This guide covers multiple deployment options for both backend API and frontend web app.

---

## 📋 Table of Contents

1. [Quick Deploy (Recommended)](#quick-deploy-recommended)
2. [Manual Deployment Options](#manual-deployment-options)
3. [Environment Configuration](#environment-configuration)
4. [Post-Deployment Checklist](#post-deployment-checklist)
5. [Monitoring & Maintenance](#monitoring--maintenance)

---

## 🎯 Quick Deploy (Recommended)

### Option 1: Deploy to Render (FREE)

**Render offers free tier with:**
- ✅ Free HTTPS
- ✅ Automatic deployments from GitHub
- ✅ 750 hours/month free (enough for 24/7)
- ✅ No credit card required

#### Step 1: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repository

#### Step 2: Deploy Backend API

1. **New Web Service**
   - Click "New +" → "Web Service"
   - Connect repository: `seoul-transit2`
   - Name: `seoul-transit-api`
   - Runtime: `Node`
   - Branch: `main`
   - Build Command: `cd server && npm install && npm run build`
   - Start Command: `cd server && npm start`

2. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=8080
   ```

3. **Click "Create Web Service"**
   - Wait 3-5 minutes for build
   - You'll get a URL like: `https://seoul-transit-api.onrender.com`

#### Step 3: Deploy Frontend Web App

1. **New Static Site**
   - Click "New +" → "Static Site"
   - Connect repository: `seoul-transit2`
   - Name: `seoul-transit-web`
   - Branch: `main`
   - Build Command: `cd mobile && npm install && npm run build:web`
   - Publish Directory: `mobile/web-build`

2. **Environment Variables**
   ```
   API_BASE_URL=https://seoul-transit-api.onrender.com
   ```

3. **Click "Create Static Site"**
   - Wait 5-10 minutes for build
   - You'll get a URL like: `https://seoul-transit-web.onrender.com`

**✅ Done! Your app is live!**

---

### Option 2: Deploy to Railway (FREE)

Railway offers $5/month free credit.

#### Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign in with GitHub
3. Create new project

#### Step 2: Deploy Backend

1. Click "New Project" → "Deploy from GitHub repo"
2. Select `seoul-transit2`
3. Add service: `server`
   - Root Directory: `server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Add environment variables:
   ```
   NODE_ENV=production
   PORT=8080
   ```
5. Generate domain (Settings → Public Networking)

#### Step 3: Deploy Frontend

1. Add new service: `mobile`
   - Root Directory: `mobile`
   - Build Command: `npm install && npm run build:web`
   - Start Command: `npx serve web-build`
2. Add environment variable:
   ```
   API_BASE_URL=https://your-backend.railway.app
   ```
3. Generate domain

**✅ Done!**

---

### Option 3: Deploy to Vercel (Frontend) + Render (Backend)

**Best for:** Production-grade hosting with edge CDN

#### Backend on Render (Same as Option 1)

Follow Option 1 steps for backend deployment.

#### Frontend on Vercel

1. Go to https://vercel.com
2. Import from GitHub: `seoul-transit2`
3. Configure:
   - Framework Preset: `Other`
   - Root Directory: `mobile`
   - Build Command: `npm run build:web`
   - Output Directory: `web-build`
4. Environment Variables:
   ```
   API_BASE_URL=https://seoul-transit-api.onrender.com
   ```
5. Deploy

**✅ Frontend on Vercel CDN, Backend on Render!**

---

## 🛠️ Manual Deployment Options

### Option 4: Docker Deployment

#### Build and Run Locally

```bash
# Build backend image
cd server
docker build -t seoul-transit-api .

# Run backend container
docker run -d -p 8080:8080 \
  -e NODE_ENV=production \
  --name seoul-transit-api \
  seoul-transit-api

# Test
curl http://localhost:8080/v1/health
```

#### Deploy to Cloud with Docker

**AWS ECS, Google Cloud Run, Azure Container Instances:**

1. Build and push to container registry:
   ```bash
   docker tag seoul-transit-api your-registry/seoul-transit-api
   docker push your-registry/seoul-transit-api
   ```

2. Deploy to cloud platform using their UI/CLI

---

### Option 5: Traditional VPS (DigitalOcean, AWS EC2, etc.)

#### Prerequisites
- Ubuntu 22.04 LTS
- Node.js 18+
- Nginx
- PM2

#### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

#### Step 2: Deploy Backend

```bash
# Clone repository
git clone https://github.com/iam10chung-cloud/seoul-transit2.git
cd seoul-transit2/server

# Install dependencies
npm install

# Build
npm run build

# Create .env
cat > .env << EOF
NODE_ENV=production
PORT=8080
EOF

# Start with PM2
pm2 start dist/index.js --name seoul-transit-api
pm2 save
pm2 startup
```

#### Step 3: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/seoul-transit
```

Add:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /var/www/seoul-transit-web;
        try_files $uri $uri/ /index.html;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/seoul-transit /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 4: Deploy Frontend

```bash
cd ../mobile
npm install
npm run build:web

# Copy to nginx
sudo mkdir -p /var/www/seoul-transit-web
sudo cp -r web-build/* /var/www/seoul-transit-web/
```

#### Step 5: Setup SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

**✅ Deployed on VPS with HTTPS!**

---

## 🔧 Environment Configuration

### Backend (.env)

```bash
NODE_ENV=production
PORT=8080

# CORS - Set to your frontend domain
CORS_ORIGIN=https://your-frontend.com

# Logging
LOG_LEVEL=info

# Optional: Database
# DATABASE_URL=postgresql://user:pass@host:5432/db

# Optional: Redis
# REDIS_URL=redis://host:6379
```

### Frontend (.env)

```bash
# Backend API URL
API_BASE_URL=https://your-backend-api.com
```

---

## ✅ Post-Deployment Checklist

### 1. Test API Endpoints

```bash
# Health check
curl https://your-backend.com/v1/health

# Routes endpoint
curl -X POST https://your-backend.com/v1/routes \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {"lat": 37.498095, "lng": 127.027610},
    "destination": {"lat": 37.554648, "lng": 126.970730}
  }'

# Accessibility endpoint
curl https://your-backend.com/v1/accessibility/stations/2_gangnam
```

### 2. Test Frontend

1. Open `https://your-frontend.com`
2. Navigate to Accessibility Settings
3. Create a profile
4. Search for routes
5. Verify accessibility badges appear
6. Test voice guidance

### 3. Performance Check

- **Backend Response Time:** Should be <200ms
- **Frontend Load Time:** Should be <3s
- **Lighthouse Score:** Aim for 90+

### 4. Security Headers

Verify headers are set:

```bash
curl -I https://your-backend.com/v1/health
```

Should include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security` (if HTTPS)

---

## 📊 Monitoring & Maintenance

### Setup Monitoring

#### Option 1: UptimeRobot (Free)

1. Go to https://uptimerobot.com
2. Add monitor:
   - Type: HTTP(s)
   - URL: `https://your-backend.com/v1/health`
   - Interval: 5 minutes
3. Add email alerts

#### Option 2: Render Built-in Monitoring

- Render provides automatic monitoring
- View logs in dashboard
- Set up email notifications

#### Option 3: Self-hosted (Uptime Kuma)

```bash
docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1
```

### Logging

#### View Logs on Render

```bash
# Via dashboard or CLI
render logs seoul-transit-api
```

#### View Logs on Railway

```bash
railway logs
```

#### View Logs on VPS (PM2)

```bash
pm2 logs seoul-transit-api
pm2 monit
```

### Automated Deployments

**GitHub Actions** (included in repo):

Every push to `main` branch automatically deploys to:
- Render
- Railway
- Vercel

### Backup Strategy

1. **Code:** Always in GitHub
2. **Data:** No persistent data yet (stateless API)
3. **Configuration:** Stored in environment variables

---

## 🔄 Update Deployment

### Render/Railway/Vercel

Simply push to GitHub:

```bash
git push origin main
```

Auto-deploys in 3-5 minutes.

### VPS Manual Update

```bash
cd seoul-transit2
git pull origin main

# Backend
cd server
npm install
npm run build
pm2 restart seoul-transit-api

# Frontend
cd ../mobile
npm install
npm run build:web
sudo cp -r web-build/* /var/www/seoul-transit-web/
```

---

## 🆘 Troubleshooting

### Backend Not Starting

```bash
# Check logs
pm2 logs seoul-transit-api

# Restart
pm2 restart seoul-transit-api

# Check port
netstat -tulpn | grep 8080
```

### CORS Errors

Update backend `.env`:

```bash
CORS_ORIGIN=https://your-frontend-domain.com
```

Restart backend.

### Build Failures

```bash
# Clear cache
npm cache clean --force
rm -rf node_modules
npm install
```

### Database Connection Issues

Check connection string format:
```
postgresql://user:password@host:5432/database
```

---

## 📚 Additional Resources

- **Render Docs:** https://render.com/docs
- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **PM2 Docs:** https://pm2.keymetrics.io/docs

---

## 🎉 Deployment Complete!

Your Seoul Accessible Transit app is now live and accessible to users worldwide!

**Next Steps:**
1. Share your URLs with users
2. Set up monitoring
3. Collect feedback
4. Plan Phase 2 features

**Questions?** Check GitHub Issues or contact the maintainer.

---

**🦽 Making Seoul's transit accessible for everyone!** 🚇✨
