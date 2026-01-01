# ⚡ Quick Vercel Deployment Guide

## 🚀 Deploy in 5 Minutes

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js - click **"Deploy"**

### Step 3: Add Environment Variables

**Before the build completes**, go to **Settings** → **Environment Variables** and add:

#### Required Variables:
```
DATABASE_URL=your_postgresql_connection_string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
GEMINI_API_KEY=your_gemini_key
YOUTUBE_API_KEY=your_youtube_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 4: Redeploy

After adding environment variables:
1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**

### Step 5: Configure Services

#### Clerk:
- Go to [Clerk Dashboard](https://dashboard.clerk.com)
- Settings → Domains → Add your Vercel domain

#### Firebase:
- Go to [Firebase Console](https://console.firebase.google.com)
- Authentication → Settings → Authorized domains → Add your Vercel domain

### ✅ Done!

Your app is live at: `https://your-project.vercel.app`

---

**Need more details?** See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for comprehensive guide.

