# Supabase Setup Guide

## 🚨 **Error: "Failed to create business profile"**

This error occurs because the Supabase database schema hasn't been set up yet. Follow these steps:

## 📋 **Step 1: Get Your Supabase Credentials**

1. **Go to your Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Sign in and select your project

2. **Get your Project URL and API Key**
   - Go to **Settings** → **API**
   - Copy your **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - Copy your **anon/public key** (starts with `eyJ...`)

## 📝 **Step 2: Create .env File**

Create a `.env` file in your project root with:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Replace the values with your actual Supabase credentials.**

## 🗄️ **Step 3: Set Up Database Schema**

### **3.1 Run Main Schema**
1. Go to **SQL Editor** in your Supabase dashboard
2. Click **"New Query"**
3. Copy the entire content from `supabase-schema.sql`
4. Paste and run the query

### **3.2 Run Onboarding Schema**
1. Create another **"New Query"**
2. Copy the entire content from `onboarding-schema.sql`
3. Paste and run the query

## 🔍 **Step 4: Verify Setup**

1. **Check Tables Created**
   - Go to **Table Editor** in Supabase
   - You should see these tables:
     - `profiles`
     - `business_profiles`
     - `websites`
     - `ai_insights`
     - `email_campaigns`
     - `user_settings`
     - `user_activity`
     - `onboarding_progress`
     - `business_preferences`
     - `business_templates`

2. **Test Connection**
   - Go to your app
   - Click **"Test Supabase Connection"** on the login page
   - Should show "✅ Connection successful!"

## 🚀 **Step 5: Test the Flow**

1. **Restart your development server**
   ```bash
   npm run dev
   ```

2. **Test the complete flow:**
   - Click "Start for Free" → Should go to signup
   - Sign up → Should go to onboarding
   - Complete onboarding → Should go to dashboard

## 🔧 **Common Issues & Solutions**

### **Issue 1: "Invalid API key"**
- Make sure you're using the **anon/public key**, not the service role key
- Check that your `.env` file is in the project root
- Restart your dev server after adding `.env`

### **Issue 2: "Table doesn't exist"**
- Make sure you ran both SQL schema files
- Check that all tables were created in Table Editor
- Verify RLS policies were created

### **Issue 3: "Permission denied"**
- Make sure Row Level Security (RLS) policies were created
- Check that the `handle_new_user()` function was created

## 📞 **Need Help?**

If you're still getting errors:

1. **Check the browser console** for detailed error messages
2. **Check Supabase logs** in the dashboard
3. **Verify your credentials** are correct
4. **Make sure all SQL was executed** successfully

## ✅ **Expected Flow After Setup**

1. **User clicks "Start for Free"** → `/signup`
2. **User signs up** → `/onboarding` (protected)
3. **User completes onboarding** → `/dashboard` (protected + onboarding check)
4. **User logs in later** → Checks onboarding status → Redirects accordingly

The error should be resolved once you complete these setup steps! 