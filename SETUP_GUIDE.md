# Quick Setup Guide - Fix Registration Issue

## The Problem
The "Register as Hunter" option is not working because the Supabase environment variables are not configured.

## The Solution

### Step 1: Create Environment File
Create a file named `.env.local` in your project root (same directory as `package.json`) with the following content:

```env
# Replace with your actual Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Step 2: Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project or select your existing project
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** (use for `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### Step 3: Set Up Database (if not done already)

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `database_schema.sql` from your project
3. Paste and run it in the SQL Editor
4. This will create all the necessary tables and functions

### Step 4: Test Registration

1. Restart your development server: `npm run dev`
2. Go to the auth page
3. Click "Register as Hunter"
4. Fill in the form and submit

## Debugging

If you're still having issues:

1. Open browser developer tools (F12)
2. Check the Console tab for errors
3. Look for Supabase connection errors or configuration warnings

The updated AuthForm component now shows a helpful error message if the environment variables are not configured properly.

## What Changed

I've updated the `AuthForm.tsx` component to:
- Check for proper Supabase configuration on load
- Show a clear error message if environment variables are missing
- Add better debugging with console logs
- Validate form fields before submission
- Clear form fields when switching between login/signup modes

The registration functionality itself was working correctly - it just needed proper Supabase configuration! 