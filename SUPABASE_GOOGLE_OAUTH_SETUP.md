# Supabase Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your Himalayan Flavours Hub admin panel using Supabase.

## 🚀 **What This Gives You:**

✅ **Google Sign-In button** instead of email/password  
✅ **No password management** - users sign in with their Google account  
✅ **Automatic user creation** when they first sign in  
✅ **Secure authentication** handled by Google and Supabase  
✅ **Professional appearance** with Google's official branding  

## 📋 **Prerequisites:**

1. **Google Cloud Console account** (free)
2. **Supabase project** (already set up)
3. **Domain verification** for your production URL

## 🔧 **Step 1: Set Up Google OAuth**

### **1.1 Create Google Cloud Project:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Name it: `Himalayan Flavours Hub`
4. Click **"Create"**

### **1.2 Enable Google+ API:**

1. Go to **APIs & Services** → **Library**
2. Search for **"Google+ API"** or **"Google Identity"**
3. Click **"Enable"**

### **1.3 Create OAuth 2.0 Credentials:**

1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"OAuth 2.0 Client IDs"**
3. Choose **"Web application"**
4. Fill in the details:

```
Name: Himalayan Flavours Hub Admin
Authorized JavaScript origins:
- http://localhost:3000 (for development)
- https://your-domain.vercel.app (for production)

Authorized redirect URIs:
- http://localhost:3000/admin (for development)
- https://your-domain.vercel.app/admin (for production)
```

5. Click **"Create"**
6. **Copy the Client ID and Client Secret** (you'll need these)

## 🔐 **Step 2: Configure Supabase**

### **2.1 Add Google Provider:**

1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click **"Enable"**
4. Fill in the credentials:

```
Client ID: [Your Google Client ID]
Client Secret: [Your Google Client Secret]
```

5. Click **"Save"**

### **2.2 Configure Redirect URLs:**

In the same Google provider settings, add these redirect URLs:

```
Redirect URLs:
- http://localhost:3000/admin
- https://your-domain.vercel.app/admin
```

## 🎯 **Step 3: Test Your Setup**

### **3.1 Development Testing:**

1. Start your React app: `npm start`
2. Go to: `http://localhost:3000/login`
3. Click **"Sign in with Google"**
4. Complete Google OAuth flow
5. You should be redirected to `/admin`

### **3.2 Production Testing:**

1. Deploy to Vercel
2. Test the Google Sign-In on your live domain
3. Verify redirects work properly

## 🔍 **How It Works:**

1. **User clicks** "Sign in with Google"
2. **Supabase redirects** to Google OAuth
3. **User authenticates** with Google
4. **Google redirects back** to your app
5. **Supabase creates/updates** user in `auth.users`
6. **User is automatically logged in** and redirected to admin panel

## 🛠 **Code Changes Made:**

### **Updated Files:**

1. **`src/supabase.js`** - Added Google OAuth sign-in method
2. **`src/components/Login.js`** - Replaced form with Google Sign-In button
3. **`src/components/Login.css`** - Added Google button styling
4. **`src/App.js`** - Added OAuth callback handling

### **Key Features:**

- **Google Sign-In button** with official Google branding
- **Automatic redirect** after successful authentication
- **Session management** handled by Supabase
- **Responsive design** that matches your theme

## 🔒 **Security Benefits:**

✅ **No password storage** in your database  
✅ **Google handles security** (2FA, password policies, etc.)  
✅ **Automatic session management**  
✅ **Professional authentication flow**  
✅ **Easy user management** through Supabase dashboard  

## 📱 **User Experience:**

1. **Admin visits** `/login`
2. **Clicks** "Sign in with Google"
3. **Chooses Google account** (if multiple)
4. **Grants permissions** (email, profile)
5. **Automatically redirected** to admin panel
6. **Stays logged in** until they sign out

## 🚨 **Troubleshooting:**

### **Common Issues:**

1. **"Invalid redirect URI"**
   - Check that your redirect URLs match exactly in both Google and Supabase
   - Include both development and production URLs

2. **"OAuth consent screen not configured"**
   - Complete the OAuth consent screen setup in Google Cloud Console
   - Add your domain to authorized domains

3. **"Client ID not found"**
   - Verify the Client ID and Secret are correct in Supabase
   - Check that the Google Cloud project is active

### **Debug Commands:**

```javascript
// Check authentication status
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)

// Check current user
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user)
```

## 🎉 **Next Steps:**

After setup:

1. **Test the complete flow** in development
2. **Deploy to production** and test there
3. **Monitor authentication logs** in Supabase
4. **Add more admin users** by having them sign in with Google
5. **Customize the admin interface** as needed

## 🔗 **Useful Links:**

- [Google Cloud Console](https://console.cloud.google.com/)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)

---

Your Google OAuth authentication is now fully integrated! 🎯

**Admin users can now sign in with their Google accounts instead of managing passwords.**
