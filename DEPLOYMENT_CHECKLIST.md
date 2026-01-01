# ✅ Pre-Deployment Checklist

Use this checklist before deploying to Vercel to ensure everything is ready.

## 📋 Code Checklist

- [x] All API routes created and working
- [x] Client components updated to use API routes
- [x] Database connection properly configured
- [x] No direct database imports in client components
- [x] Environment variables documented
- [x] `.env.example` file created
- [x] `.gitignore` properly configured
- [x] Build completes successfully locally

## 🔑 Environment Variables

### Required for Deployment

- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - From Clerk dashboard
- [ ] `CLERK_SECRET_KEY` - From Clerk dashboard
- [ ] `GEMINI_API_KEY` - From Google AI Studio
- [ ] `YOUTUBE_API_KEY` - From Google Cloud Console
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY` - From Firebase console
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - From Firebase console
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - From Firebase console
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - From Firebase console
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - From Firebase console
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID` - From Firebase console

### Optional

- [ ] `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` - For analytics
- [ ] `NEXT_PUBLIC_HOST_NAME` - Your Vercel URL (set after first deploy)

## 🧪 Testing Checklist

Before deploying, test locally:

- [ ] Application builds successfully (`npm run build`)
- [ ] Development server starts (`npm run dev`)
- [ ] User can sign up/sign in
- [ ] User can create a course
- [ ] AI course layout generation works
- [ ] AI chapter content generation works
- [ ] YouTube videos are fetched correctly
- [ ] Course viewing works
- [ ] Course editing works
- [ ] Course deletion works
- [ ] Images upload to Firebase correctly

## 🗄️ Database Setup

- [ ] Database created (Neon, Supabase, or other PostgreSQL)
- [ ] Connection string obtained
- [ ] Database migrations run (`npm run db:push`)
- [ ] Database accessible from external IPs (for Vercel)

## 🔐 Service Configuration

### Clerk
- [ ] Clerk account created
- [ ] Application created in Clerk
- [ ] API keys obtained
- [ ] Ready to add Vercel domain to allowed origins

### Firebase
- [ ] Firebase project created
- [ ] Storage bucket configured
- [ ] API keys obtained
- [ ] Ready to add Vercel domain to authorized domains

### Google Services
- [ ] Gemini API key obtained
- [ ] YouTube Data API v3 enabled
- [ ] YouTube API key obtained
- [ ] API quotas checked (to avoid rate limits)

## 📦 Git Repository

- [ ] Code pushed to GitHub
- [ ] `.env.local` is in `.gitignore` (not committed)
- [ ] `node_modules` is in `.gitignore`
- [ ] `.next` is in `.gitignore`
- [ ] All necessary files committed

## 🚀 Vercel Setup

- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] All environment variables added to Vercel
- [ ] Build settings configured
- [ ] Ready to deploy

## 📝 Post-Deployment

After first deployment:

- [ ] Update `NEXT_PUBLIC_HOST_NAME` with actual Vercel URL
- [ ] Add Vercel domain to Clerk allowed origins
- [ ] Add Vercel domain to Firebase authorized domains
- [ ] Test all features on production URL
- [ ] Set up custom domain (if needed)
- [ ] Configure monitoring/alerts

## 🐛 Common Issues to Check

- [ ] No hardcoded localhost URLs
- [ ] No hardcoded API keys
- [ ] All API routes return proper JSON responses
- [ ] Error handling in place
- [ ] CORS configured correctly (if needed)
- [ ] Database connection string format correct

---

**Ready to Deploy?** Follow the [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) guide!

