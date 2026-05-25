# 🚀 Deploy Plants.com to Vercel

Simple 3-step guide to deploy your full-stack app to Vercel.

---

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push
```

---

## Step 2: Deploy on Vercel

### 2.1 Import Project
1. Go to **[vercel.com](https://vercel.com)** and sign in
2. Click **"Add New Project"**
3. Select your GitHub repository
4. Click **"Import"**

### 2.1.5 Configure Build Settings
Click on **"Build and Output Settings"** and toggle the override switches:

| Setting | Value |
|---------|-------|
| **Build Command** | `npm run build` |
| **Output Directory** | `frontend/dist` |
| **Install Command** | `npm install` |

Leave **Root Directory** as `./` (default)

### 2.2 Add Environment Variables
Click on **"Environment Variables"** section and add these:

| Variable Name | Value | Where to Get It |
|--------------|-------|-----------------|
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/plants` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `any-random-secret-text-here` | Make up any secure random string (e.g., `mySecretKey123`) |
| `VITE_API_URL` | `https://temporary-url.vercel.app` | Put any placeholder URL for now, we'll fix it after deploy |

**Note:** For `VITE_API_URL`, just put `https://placeholder.vercel.app` - we'll update it with the real URL after deployment.

### 2.3 Click Deploy
Wait 2-3 minutes for build to complete.

---

## Step 3: Final Configuration

### 3.1 Copy Your Vercel URL
After deployment, you'll get a URL like:
```
https://plants-com-xyz123.vercel.app
```

### 3.2 Add the Missing Variable
1. Go to **Project Settings** → **Environment Variables**
2. Add new variable:
   - **Name:** `VITE_API_URL`
   - **Value:** Your Vercel URL (paste the URL from step 3.1)
3. Click **Save**

### 3.3 Redeploy
1. Go to **Deployments** tab
2. Click the **3 dots** on latest deployment
3. Click **"Redeploy"**

---

## ✅ Done!

Your website is now live! Test these features:
- ✅ Browse plants
- ✅ Login/Register
- ✅ Add to cart
- ✅ Checkout
- ✅ Admin panel

---

## 🐛 Common Issues

**Problem:** Login doesn't work  
**Fix:** Make sure `VITE_API_URL` is set correctly in Vercel environment variables

**Problem:** CORS errors  
**Fix:** Your Vercel URL is already configured in `backend/server.js` to accept `.vercel.app` domains

**Problem:** Database connection failed  
**Fix:** In MongoDB Atlas, go to Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

---

## 📌 Important Notes

- Every push to GitHub automatically redeploys
- Free tier includes unlimited deployments
- HTTPS is automatic
- Changes to environment variables require redeployment

---

**Need help?** Check [Vercel Documentation](https://vercel.com/docs)
