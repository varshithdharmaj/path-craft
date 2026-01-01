# 🔥 How to Get Firebase Web App Configuration

The service account JSON file you have is for **server-side** Firebase Admin SDK. For your Next.js app, you need the **web app configuration**.

## Steps to Get Firebase Web App Config

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select your project: **path-craft-4bc59**

2. **Navigate to Project Settings**
   - Click the ⚙️ gear icon (top left)
   - Select **Project settings**

3. **Scroll to "Your apps" section**
   - Look for the **Web app** section (</> icon)
   - If you don't have a web app yet:
     - Click **Add app** → Select **Web** (</>)
     - Register your app with a nickname (e.g., "PathCraft Web")
     - Click **Register app**

4. **Copy the Configuration**
   You'll see something like:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "path-craft-4bc59.firebaseapp.com",
     projectId: "path-craft-4bc59",
     storageBucket: "path-craft-4bc59.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdefghijklmnop",
     measurementId: "G-XXXXXXXXXX"
   };
   ```

5. **Update .env.local**
   Replace these values in your `.env.local` file:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=<apiKey from above>
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<authDomain from above>
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=<projectId from above>
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<storageBucket from above>
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<messagingSenderId from above>
   NEXT_PUBLIC_FIREBASE_APP_ID=<appId from above>
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=<measurementId from above>
   ```

## Quick Reference

Based on your project ID, these should be:
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=path-craft-4bc59.firebaseapp.com` ✅ (already set)
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID=path-craft-4bc59` ✅ (already set)
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=path-craft-4bc59.appspot.com` ✅ (already set)

You still need to get:
- `NEXT_PUBLIC_FIREBASE_API_KEY` - from Firebase Console
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - from Firebase Console
- `NEXT_PUBLIC_FIREBASE_APP_ID` - from Firebase Console
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` - from Firebase Console (optional, for analytics)

---

**After updating .env.local, restart your dev server!**

