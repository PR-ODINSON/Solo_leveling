# 🚀 AscendOS Deployment Guide - Netlify

This guide will help you deploy your AscendOS Solo Leveling app to Netlify.

## 📋 Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **Supabase Project**: Set up at [supabase.com](https://supabase.com)

## 🔧 Environment Variables Setup

### 1. Supabase Configuration
Go to your Supabase dashboard and get these values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. Optional Variables
```bash
NEXT_PUBLIC_APP_URL=https://your-netlify-site.netlify.app
NODE_ENV=production
```

## 🌐 Netlify Deployment Steps

### Method 1: Git Integration (Recommended)

1. **Connect Repository**:
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select your repository

2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18`

3. **Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add your Supabase keys:
     ```
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     ```

4. **Deploy**:
   - Click "Deploy site"
   - Wait for build to complete

### Method 2: Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   # Build the project
   npm run build
   
   # Deploy to Netlify
   netlify deploy --prod --dir=.next
   ```

## 🔐 Security Configuration

The `netlify.toml` file includes:
- Security headers (XSS protection, frame options)
- Static asset caching
- SPA routing redirects

## 📊 Supabase Database Setup

### Required Tables:

1. **profiles** table:
   ```sql
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users ON DELETE CASCADE,
     email TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
     PRIMARY KEY (id)
   );
   ```

2. **stats** table:
   ```sql
   CREATE TABLE stats (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users ON DELETE CASCADE,
     level INTEGER DEFAULT 1,
     xp INTEGER DEFAULT 0,
     strength INTEGER DEFAULT 10,
     agility INTEGER DEFAULT 10,
     intelligence INTEGER DEFAULT 10,
     vitality INTEGER DEFAULT 10,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
   );
   ```

3. **quests** table:
   ```sql
   CREATE TABLE quests (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users ON DELETE CASCADE,
     title TEXT NOT NULL,
     description TEXT,
     difficulty TEXT DEFAULT 'E',
     xp_reward INTEGER DEFAULT 100,
     completed BOOLEAN DEFAULT false,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
   );
   ```

### Row Level Security (RLS):

Enable RLS and add policies:

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own stats" ON stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own quests" ON quests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own quests" ON quests FOR ALL USING (auth.uid() = user_id);
```

## 🎯 Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] Authentication works
- [ ] Database connections successful
- [ ] All routes accessible
- [ ] Mobile responsive
- [ ] Performance optimized

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check Node.js version (use 18.x)
   - Verify all dependencies installed
   - Check for TypeScript errors

2. **Environment Variables Not Working**:
   - Ensure variables start with `NEXT_PUBLIC_` for client-side
   - Redeploy after adding variables

3. **Supabase Connection Issues**:
   - Verify URL and keys are correct
   - Check RLS policies
   - Ensure tables exist

4. **Routing Issues**:
   - Check `netlify.toml` redirects
   - Verify Next.js App Router setup

## 📱 Custom Domain (Optional)

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records
4. Enable HTTPS

## 🚀 Performance Tips

- Enable Netlify's Edge caching
- Use Netlify Image CDN for optimized images
- Monitor Core Web Vitals in Netlify Analytics
- Consider using Netlify Functions for API routes

---

**Need Help?** Check the [Netlify Documentation](https://docs.netlify.com) or [Next.js Deployment Guide](https://nextjs.org/docs/deployment). 