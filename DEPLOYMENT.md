# 🚀 Deploy Zia Nursery to Vercel

This guide will help you deploy both frontend and backend to Vercel (no Render or Railway needed!)

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas** - Your database (already set up)
3. **Git Repository** - Push your code to GitHub/GitLab/Bitbucket

## 🔧 Step 1: Prepare Your Project

### Update API URLs in Frontend

Replace all `http://localhost:5001` with environment variable:

**Create `frontend/.env.production`:**
```env
VITE_API_URL=https://your-project-name.vercel.app
```

**Update API calls to use:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
```

### Update CORS in Backend

**Edit `backend/server.js`:**
```javascript
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://localhost:3000',
        'https://your-project-name.vercel.app' // Add your Vercel domain
    ],
    credentials: true,
}));
```

## 📦 Step 2: Push to Git

```bash
git init
git add .
git commit -m "Initial commit - Zia Nursery"
git branch -M main
git remote add origin https://github.com/yourusername/zia-nursery.git
git push -u origin main
```

## 🌐 Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave as root)
   - **Build Command:** `npm run vercel-build`
   - **Output Directory:** `frontend/dist`
   - **Install Command:** `npm install`

4. Add Environment Variables:
   - `MONGO_URI` = `your_mongodb_connection_string`
   - `JWT_SECRET` = `your_secret_key_here`
   - `VITE_API_URL` = `https://your-project-name.vercel.app`

5. Click **Deploy**

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? zia-nursery
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add MONGO_URI
vercel env add JWT_SECRET
vercel env add VITE_API_URL

# Deploy to production
vercel --prod
```

## 🔐 Step 4: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `MONGO_URI` | `mongodb+srv://...` | Production |
| `JWT_SECRET` | `your_secret_key` | Production |
| `VITE_API_URL` | `https://your-project.vercel.app` | Production |
| `PORT` | `5001` | Production |

## 📁 Step 5: Handle File Uploads

⚠️ **Important:** Vercel's serverless functions have a read-only filesystem. For file uploads, you need to use a cloud storage service.

### Option 1: Cloudinary (Recommended)

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Install: `npm install cloudinary multer-storage-cloudinary`
3. Update `backend/routes/upload.js`:

```javascript
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'zia-nursery',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });
```

4. Add Cloudinary env vars to Vercel

### Option 2: AWS S3

1. Create S3 bucket
2. Install: `npm install aws-sdk multer-s3`
3. Configure multer to use S3

### Option 3: Vercel Blob Storage

1. Install: `npm install @vercel/blob`
2. Use Vercel's built-in blob storage

## 🔄 Step 6: Update Frontend API Calls

**Create `frontend/src/config.js`:**
```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
```

**Update all fetch calls:**
```javascript
// Before
fetch('http://localhost:5001/api/plants')

// After
import { API_URL } from './config';
fetch(`${API_URL}/api/plants`)
```

## ✅ Step 7: Test Your Deployment

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Test all features:
   - ✅ Browse plants
   - ✅ Add to cart
   - ✅ User registration/login
   - ✅ Checkout process
   - ✅ Admin panel
   - ✅ Contact form

## 🐛 Troubleshooting

### Issue: API calls failing

**Solution:** Check CORS settings and ensure `VITE_API_URL` is set correctly

### Issue: Images not loading

**Solution:** 
- Use Cloudinary or S3 for images
- Update `imageUrl` in database to use full URLs

### Issue: MongoDB connection timeout

**Solution:** 
- Whitelist Vercel IPs in MongoDB Atlas (or use `0.0.0.0/0` for all IPs)
- Check connection string is correct

### Issue: Build fails

**Solution:**
```bash
# Clear cache and rebuild
vercel --force

# Check build logs in Vercel dashboard
```

## 🔄 Continuous Deployment

Once set up, every push to your main branch will automatically deploy to Vercel!

```bash
git add .
git commit -m "Update feature"
git push origin main
# Vercel automatically deploys! 🎉
```

## 📊 Monitor Your App

- **Analytics:** Vercel Dashboard → Analytics
- **Logs:** Vercel Dashboard → Deployments → View Function Logs
- **Performance:** Vercel Dashboard → Speed Insights

## 🎉 You're Live!

Your Zia Nursery is now live on Vercel! Share your URL:
`https://your-project-name.vercel.app`

---

## 💡 Pro Tips

1. **Custom Domain:** Add your own domain in Vercel Dashboard → Settings → Domains
2. **Preview Deployments:** Every branch gets its own preview URL
3. **Rollback:** Instantly rollback to previous deployment if needed
4. **Environment Variables:** Use different values for preview vs production

## 📞 Need Help?

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Vercel Discord: [vercel.com/discord](https://vercel.com/discord)
