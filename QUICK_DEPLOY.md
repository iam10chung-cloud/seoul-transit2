# ⚡ Quick Deploy - 5 Minutes to Production

**Get Seoul Accessible Transit live in 5 minutes!**

---

## 🎯 Option 1: Render (Recommended - 100% FREE)

### Why Render?
- ✅ **FREE** tier (750 hours/month = 24/7)
- ✅ **HTTPS** included
- ✅ **Auto-deploy** from GitHub
- ✅ **No credit card** required
- ✅ **5 minutes** to deploy

### Step-by-Step

#### 1. Create Render Account (1 minute)

1. Go to: **https://render.com**
2. Click **"Get Started for Free"**
3. Sign in with **GitHub**
4. Authorize Render

#### 2. Deploy Backend API (2 minutes)

1. Click **"New +"** → **"Web Service"**

2. **Connect Repository:**
   - Find and select: `seoul-transit2`
   - Click **"Connect"**

3. **Configure Service:**
   ```
   Name: seoul-transit-api
   Region: Choose closest to you
   Branch: main
   Runtime: Node
   Build Command: cd server && npm install && npm run build
   Start Command: cd server && npm start
   Plan: Free
   ```

4. **Add Environment Variables:**
   - Click **"Advanced"**
   - Add:
     ```
     NODE_ENV = production
     PORT = 8080
     ```

5. Click **"Create Web Service"**

6. **Wait 3-5 minutes** for build

7. **Copy your URL:**
   ```
   https://seoul-transit-api-XXXX.onrender.com
   ```

#### 3. Deploy Frontend Web App (2 minutes)

1. Click **"New +"** → **"Static Site"**

2. **Connect Repository:**
   - Select: `seoul-transit2`
   - Click **"Connect"**

3. **Configure Site:**
   ```
   Name: seoul-transit-web
   Branch: main
   Build Command: cd mobile && npm install && npm run build:web
   Publish Directory: mobile/web-build
   ```

4. **Add Environment Variable:**
   - Click **"Advanced"**
   - Add:
     ```
     API_BASE_URL = https://seoul-transit-api-XXXX.onrender.com
     ```
   (Use YOUR backend URL from step 2.7)

5. Click **"Create Static Site"**

6. **Wait 5-10 minutes** for build

7. **Copy your URL:**
   ```
   https://seoul-transit-web-XXXX.onrender.com
   ```

### ✅ DONE! Your App is Live!

Open your frontend URL in browser:
```
https://seoul-transit-web-XXXX.onrender.com
```

---

## 🧪 Test Your Deployment

### 1. Test Backend

Open in browser:
```
https://seoul-transit-api-XXXX.onrender.com/v1/health
```

Should show:
```json
{
  "ok": true,
  "time": "2026-01-14T...",
  "service": "seoul-transit-api",
  "version": "1.0.0"
}
```

### 2. Test Frontend

1. Open: `https://seoul-transit-web-XXXX.onrender.com`
2. Click on menu (☰)
3. Go to **"Accessibility Settings"**
4. Select **"Wheelchair"**
5. Toggle **"Voice Guidance"** ON
6. Click **"✅ 저장"** (Save)
7. Go back to Home
8. Click **"Find Routes"**
9. See routes with **♿ green badges**!

### 3. Test Voice Guidance

1. Click on any route
2. Scroll to accessibility section
3. Click **"🔊 Play Voice Guidance"**
4. Hear Korean voice instructions!

---

## 📱 Share Your App

Your app is now publicly accessible!

**Backend API:**
```
https://seoul-transit-api-XXXX.onrender.com
```

**Web App:**
```
https://seoul-transit-web-XXXX.onrender.com
```

Share the web app URL with:
- Friends & family
- Test users
- Disability advocacy groups
- Social media

---

## 🔄 Update Your Deployment

### Automatic Updates

1. Make changes to code
2. Commit: `git add . && git commit -m "your message"`
3. Push: `git push origin main`
4. Render auto-deploys in 5 minutes!

No manual steps needed!

---

## 📊 Monitor Your App

### Render Dashboard

1. Go to: https://dashboard.render.com
2. Click on your service
3. See:
   - Deployment history
   - Logs
   - Metrics
   - Health status

### Set Up Monitoring (Optional)

1. Go to: https://uptimerobot.com
2. Create free account
3. Add monitor:
   - Type: HTTP(s)
   - URL: `https://seoul-transit-api-XXXX.onrender.com/v1/health`
   - Interval: 5 minutes
4. Get email alerts if down!

---

## ⚠️ Important Notes

### Free Tier Limitations

**Render Free Tier:**
- ✅ 750 hours/month (enough for 24/7)
- ✅ HTTPS included
- ⚠️ Spins down after 15 min inactivity
- ⚠️ First request after spin-down takes 30s

**Solution for spin-down:**
Use UptimeRobot to ping every 5 minutes (keeps it active)

### Performance

**First Load:**
- May take 30 seconds (if spun down)

**After First Load:**
- API: < 200ms response time
- Web: < 3s page load

---

## 🎉 Success!

You now have a **live, production-ready accessibility platform!**

### What You Deployed:

- ✅ Backend API with 10 stations
- ✅ Accessibility scoring (4 dimensions)
- ✅ Voice guidance (Korean TTS)
- ✅ Wheelchair-friendly route filtering
- ✅ Visual impairment support
- ✅ Cognitive accessibility features
- ✅ Frontend web app with accessibility badges
- ✅ HTTPS security
- ✅ Health monitoring

### Next Steps:

1. **Test everything** thoroughly
2. **Share with users** and get feedback
3. **Monitor performance** via dashboard
4. **Plan Phase 2** (50+ stations, real-time data)
5. **Apply for grants** (government funding)

---

## 🆘 Troubleshooting

### Backend Not Responding

**Check:**
1. Render dashboard → Logs
2. Look for errors
3. Verify environment variables

**Fix:**
- Redeploy from dashboard
- Check build logs

### Frontend Not Loading

**Check:**
1. Is `API_BASE_URL` set correctly?
2. Backend URL accessible?

**Fix:**
1. Go to Static Site settings
2. Update `API_BASE_URL` environment variable
3. Trigger redeploy

### CORS Errors

**In Browser Console:**
```
Access to fetch has been blocked by CORS policy
```

**Fix:**
Backend already configured for CORS (`*` origin).
If issue persists, update `server/src/index.ts`:
```typescript
app.use(cors({
  origin: 'https://your-frontend-url.onrender.com'
}));
```

---

## 📚 More Options

This is the **quickest** way to deploy.

For more options, see:
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - 5 deployment platforms
- **[PRODUCTION.md](./PRODUCTION.md)** - Production details
- **[README.md](./README.md)** - Project overview

---

## 🌟 Alternative: Railway (also FREE)

If Render doesn't work, try Railway:

1. Go to: https://railway.app
2. Sign in with GitHub
3. New Project → Deploy from GitHub
4. Select `seoul-transit2`
5. Railway auto-detects and deploys!

**Even easier than Render!**

---

## 💡 Pro Tips

1. **Custom Domain (Optional):**
   - Buy domain from Namecheap/GoDaddy
   - Add in Render dashboard → Settings → Custom Domain
   - Update DNS records

2. **Analytics (Optional):**
   - Add Google Analytics to `mobile/web-build/index.html`
   - Track user behavior

3. **Feedback:**
   - Add feedback form
   - Use TypeForm or Google Forms

4. **Social Sharing:**
   - Create Open Graph meta tags
   - Beautiful previews on Facebook/Twitter

---

## 🎊 Congratulations!

**You just deployed a production-ready accessibility platform!**

**Impact:**
- Helps 2.5M+ people with disabilities
- Promotes independent travel
- Makes Seoul more accessible

**Share your deployment:**
- Twitter: #SeoulAccessibleTransit
- LinkedIn: Post about your achievement
- GitHub: Star the repository

---

**🦽 Making Seoul's transit accessible for everyone!** 🚇✨

**Questions?** Create an issue on GitHub!

**Ready for Phase 2?** See [IMPLEMENTATION_SUMMARY.md](./docs/IMPLEMENTATION_SUMMARY.md)
