# 🔑 Vercel Environment Variables

Copy and paste these into your Vercel project **Settings** → **Environment Variables**.

## 📋 Complete List

### 1. Database (Required - Choose ONE)

**Option A: DATABASE_URL**
```
DATABASE_URL=postgresql://user:password@host:port/database
```

**Option B: NEON_DATABASE_URL** (Recommended for Neon)
```
NEON_DATABASE_URL=postgresql://user:password@host:port/database
```

> **💡 Get it from**: [Neon Console](https://console.neon.tech) or your PostgreSQL provider

---

### 2. Clerk Authentication (Required)

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **💡 Get it from**: [Clerk Dashboard](https://dashboard.clerk.com) → **API Keys**
> - Use `pk_live_...` and `sk_live_...` for production
> - Use `pk_test_...` and `sk_test_...` for development

---

### 3. Gemini AI (Required)

```
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

> **💡 Get it from**: [Google AI Studio](https://makersuite.google.com/app/apikey)

---

### 4. YouTube API (Required)

```
YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

> **💡 Get it from**: [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
> - Enable "YouTube Data API v3" first

---

### 5. Firebase Configuration (Required)

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

> **💡 Get it from**: [Firebase Console](https://console.firebase.google.com) → **Project Settings** → **General** → **Your apps** → **Web app**

---

### 6. Host Name (Optional - Set After First Deploy)

```
NEXT_PUBLIC_HOST_NAME=https://your-project.vercel.app
```

> **💡 Update this**: After your first deployment, replace `your-project` with your actual Vercel project name

---

## 📝 How to Add in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** (top menu)
3. Click **Environment Variables** (left sidebar)
4. For each variable:
   - Click **Add New**
   - Enter the **Key** (variable name)
   - Enter the **Value** (your actual value)
   - Select **Environment**: 
     - ✅ **Production**
     - ✅ **Preview** (for pull requests)
     - ✅ **Development** (optional)
   - Click **Save**

## ✅ Quick Copy-Paste Format

Here's the format ready to copy (replace the values):

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
GEMINI_API_KEY=...
YOUTUBE_API_KEY=...
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
NEXT_PUBLIC_HOST_NAME=https://your-project.vercel.app
```

## 🎯 Environment Selection

When adding variables, select:
- **Production** ✅ (for main branch deployments)
- **Preview** ✅ (for pull request previews)
- **Development** ⚠️ (optional, for local dev)

## ⚠️ Important Notes

1. **No spaces** around the `=` sign
2. **No quotes** needed (Vercel handles this)
3. **Case-sensitive** - variable names must match exactly
4. **Redeploy** after adding variables (Vercel will prompt you)
5. **Keep secrets safe** - never commit these to GitHub

## 🔍 Verification

After adding all variables:
1. Go to **Deployments** tab
2. Click the **"..."** menu on latest deployment
3. Click **Redeploy**
4. Check the build logs to ensure no "missing variable" errors

---

**Need help getting API keys?** Check the links in each section above!

