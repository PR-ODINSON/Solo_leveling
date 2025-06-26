# 🚀 Netlify Deployment Guide for AscendOS

## Pre-Deployment Checklist

### ✅ 1. Environment Variables Setup
Before deploying, ensure you have the following environment variables configured in your Netlify dashboard:

**Required Variables:**
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Optional Variables:**
```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=https://your-domain.netlify.app
```

### ✅ 2. Build Configuration
The project is configured with:
- **Output**: Static export (`output: 'export'`)
- **Publish Directory**: `out`
- **Build Command**: `npm install && npm run build`
- **Node Version**: 20

### ✅ 3. Route Structure
The app uses Next.js 15 App Router with the following routes:
- `/` - Home (redirects to dashboard)
- `/dashboard` - Main dashboard with stats and quests
- `/quests` - Quest management page
- `/rewards` - Rewards and achievements
- `/inventory` - Artifact and badge collection
- `/settings` - User settings and preferences

All routes are wrapped in the `(site)` layout with consistent sidebar navigation.

## 🔧 Deployment Steps

### Method 1: Netlify CLI (Recommended)
```bash
# 1. Install Netlify CLI (if not installed)
npm install -g netlify-cli

# 2. Login to Netlify
netlify login

# 3. Build and deploy to preview
npm run deploy:preview

# 4. Deploy to production
npm run deploy
```

### Method 2: Git Integration
1. Push your code to GitHub/GitLab
2. Connect repository in Netlify dashboard
3. Configure build settings:
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `out`
   - **Node version**: 20
4. Add environment variables in Netlify dashboard
5. Deploy

### Method 3: Manual Upload
```bash
# 1. Build the project
npm run build

# 2. Upload the 'out' folder to Netlify
# (Use Netlify dashboard drag & drop)
```

## 🔧 Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Clean build artifacts
npm run clean

# Build with bundle analysis
npm run build:analyze

# Preview deployment
npm run deploy:preview

# Production deployment
npm run deploy
```

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails - Module Resolution**
   - Ensure all dependencies are in `package.json`
   - Clear node_modules: `rm -rf node_modules package-lock.json && npm install`

2. **Routes Not Working**
   - Verify `netlify.toml` redirects are configured
   - Check that `output: 'export'` is set in `next.config.js`

3. **Supabase Connection Issues**
   - Verify environment variables are set in Netlify dashboard
   - Check Supabase project URL and keys are correct
   - Ensure RLS policies allow public access for demo data

4. **Styling Issues**
   - Verify Tailwind CSS is building correctly
   - Check for any missing CSS imports
   - Ensure PostCSS is configured properly

5. **Animation/Motion Issues**
   - Framer Motion should work with static export
   - Check for any server-side rendering dependencies

## 🔒 Security Notes

- Environment variables are properly prefixed with `NEXT_PUBLIC_`
- Supabase keys are configured for client-side use only
- Security headers are configured in `netlify.toml`
- No sensitive server-side operations in static build

## 📊 Performance Optimization

The build includes:
- Static export for fast loading
- Image optimization disabled (required for static export)
- CSS/JS minification
- Bundle splitting
- Proper caching headers

## 🌐 Custom Domain Setup

1. In Netlify dashboard, go to Domain settings
2. Add your custom domain
3. Configure DNS records as instructed
4. Enable HTTPS (automatic with Netlify)
5. Update `NEXT_PUBLIC_SITE_URL` environment variable

## 📱 Testing Deployment

After deployment, test:
- [ ] All routes load correctly (`/`, `/dashboard`, `/quests`, `/rewards`, `/inventory`, `/settings`)
- [ ] Sidebar navigation works
- [ ] Animations and transitions work
- [ ] Responsive design on mobile
- [ ] Supabase connection (if configured)
- [ ] Settings page functionality
- [ ] Inventory modal interactions

## 🚀 Go Live!

Your AscendOS app should now be live with:
- ✅ RPG-style sidebar layout
- ✅ All 5 main pages functional
- ✅ Smooth animations and transitions
- ✅ Mobile responsive design
- ✅ Solo Leveling inspired theming

---

**Need Help?** Check the [Netlify Documentation](https://docs.netlify.com) or [Next.js Deployment Guide](https://nextjs.org/docs/deployment). 