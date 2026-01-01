# 🚀 Vercel Deployment Guide

This guide will help you deploy your PathCraft application to Vercel.

## Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **All API Keys Ready** - Have all your environment variables ready

## Step-by-Step Deployment

### 1. **Push Your Code to GitHub**

If you haven't already, push your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - PathCraft ready for deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/path-craft.git

# Push to GitHub
git push -u origin main
```

### 2. **Connect to Vercel**

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Select your repository (`path-craft`)

### 3. **Configure Project Settings**

Vercel will auto-detect Next.js. Configure:

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (or `path-craft` if your repo is in a subdirectory)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 4. **Add Environment Variables**

In the Vercel project settings, add all these environment variables:

#### **Database Configuration**
```
DATABASE_URL=postgresql://user:password@host:port/database
```
OR
```
NEON_DATABASE_URL=postgresql://user:password@host:port/database
```

> **💡 Tip**: If using Neon (recommended), get your connection string from [Neon Console](https://console.neon.tech)

#### **Clerk Authentication**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_... (or pk_live_...)
CLERK_SECRET_KEY=sk_test_... (or sk_live_...)
```

> **💡 Tip**: Get these from [Clerk Dashboard](https://dashboard.clerk.com) → API Keys

#### **Gemini AI**
```
GEMINI_API_KEY=your_gemini_api_key_here
```

> **💡 Tip**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

#### **YouTube API**
```
YOUTUBE_API_KEY=your_youtube_api_key_here
```

> **💡 Tip**: Get from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

#### **Firebase Configuration**
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

> **💡 Tip**: Get from [Firebase Console](https://console.firebase.google.com) → Project Settings → General

#### **Optional: Host Name**
```
NEXT_PUBLIC_HOST_NAME=https://your-app.vercel.app
```

> **💡 Tip**: Update this after first deployment with your actual Vercel URL

### 5. **Deploy**

1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-5 minutes)
3. Your app will be live at `https://your-project.vercel.app`

### 6. **Post-Deployment Setup**

#### **Update Clerk Allowed Origins**

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **Settings** → **Domains**
3. Add your Vercel domain: `your-project.vercel.app`
4. Also add your custom domain if you have one

#### **Update Firebase Allowed Domains**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Navigate to **Authentication** → **Settings** → **Authorized domains**
3. Add your Vercel domain

#### **Update NEXT_PUBLIC_HOST_NAME**

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_HOST_NAME` to your actual Vercel URL
3. Redeploy (or it will update on next deployment)

## 🔧 Troubleshooting

### Build Fails

**Error: "DATABASE_URL is not set"**
- Make sure you added `DATABASE_URL` or `NEON_DATABASE_URL` in Vercel environment variables
- Check that the variable name matches exactly (case-sensitive)

**Error: "Clerk publishable key missing"**
- Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
- Make sure it starts with `pk_test_` or `pk_live_`

**Error: "Module not found"**
- Run `npm install` locally to ensure all dependencies are in `package.json`
- Check that `node_modules` is in `.gitignore`

### Runtime Errors

**API Routes Return 500**
- Check Vercel function logs: **Deployments** → Click deployment → **Functions** tab
- Verify all environment variables are set correctly
- Check that database connection string is correct

**Authentication Not Working**
- Verify Clerk domain is added to allowed origins
- Check that `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` match

**Database Connection Issues**
- Verify your database allows connections from Vercel's IPs
- For Neon, this should work automatically
- Check that connection string format is correct: `postgresql://user:password@host:port/database`

## 📊 Monitoring

### View Logs

1. Go to your Vercel project
2. Click on a deployment
3. Go to **Functions** tab to see API route logs
4. Go to **Logs** tab for general application logs

### Performance

- Vercel automatically provides analytics
- Check **Analytics** tab in your Vercel dashboard
- Monitor API route performance in **Functions** tab

## 🔄 Continuous Deployment

Vercel automatically deploys on every push to your main branch:

1. Make changes locally
2. Commit and push to GitHub
3. Vercel automatically builds and deploys
4. Preview deployments are created for pull requests

## 🌐 Custom Domain

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_HOST_NAME` environment variable
5. Update Clerk and Firebase allowed domains

## 📝 Environment Variables Checklist

Before deploying, ensure you have:

- [ ] `DATABASE_URL` or `NEON_DATABASE_URL`
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] `CLERK_SECRET_KEY`
- [ ] `GEMINI_API_KEY`
- [ ] `YOUTUBE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional)
- [ ] `NEXT_PUBLIC_HOST_NAME` (update after first deployment)

## 🎉 Success!

Once deployed, your app will be live at:
- **Production**: `https://your-project.vercel.app`
- **Preview Deployments**: `https://your-project-git-branch.vercel.app`

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)
- [Neon Database](https://neon.tech) - Recommended PostgreSQL hosting
- [Clerk Documentation](https://clerk.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)

---

**Need Help?** Check the troubleshooting section or review Vercel deployment logs for specific error messages.

