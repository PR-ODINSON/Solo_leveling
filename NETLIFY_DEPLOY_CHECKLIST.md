# 🚀 Netlify Deployment Checklist for AscendOS

## ✅ Pre-Deployment Verification

### 1. Build Verification
- [ ] Run `npm run build` - should complete without errors
- [ ] Run `npm run verify` - all files should be present
- [ ] Check `out/` directory contains all HTML files:
  - [ ] `index.html` (home page)
  - [ ] `dashboard.html` (main dashboard)
  - [ ] `quests.html` (quest management)
  - [ ] `rewards.html` (rewards system)
  - [ ] `inventory.html` (artifact collection)
  - [ ] `settings.html` (user preferences)
  - [ ] `404.html` (error page)

### 2. Route Structure Verification
- [ ] All routes use the new `(site)` layout
- [ ] Sidebar navigation is consistent across all pages
- [ ] No references to old route structure
- [ ] Mobile responsive sidebar works correctly

### 3. Environment Variables Setup
**Required for Supabase (if using):**
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

**Optional:**
- [ ] `NEXT_PUBLIC_SITE_URL` - Your production domain
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - For server-side operations (if needed)

## 🚀 Deployment Options

### Option 1: Netlify CLI (Recommended)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to preview
npm run deploy:preview

# Deploy to production
npm run deploy
```

### Option 2: Windows Batch Script
```bash
# Run the deployment script
deploy.bat
```

### Option 3: Git Integration
1. Push code to GitHub/GitLab
2. Connect repository in Netlify dashboard
3. Configure build settings:
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `out`
   - **Node version**: `20`

### Option 4: Manual Upload
1. Run `npm run build`
2. Upload the `out` folder to Netlify dashboard

## 🔧 Netlify Dashboard Configuration

### Build Settings
- **Base directory**: (leave empty)
- **Build command**: `npm install && npm run build`
- **Publish directory**: `out`
- **Functions directory**: `netlify/functions` (if using)

### Environment Variables
Go to Site Settings → Environment Variables and add:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
```

### Deploy Settings
- **Node version**: 20
- **Package manager**: npm
- **Auto-deploy**: Enable for main branch

## 📱 Post-Deployment Testing

### Core Functionality
- [ ] Home page loads and redirects to dashboard
- [ ] All navigation links work correctly
- [ ] Sidebar is responsive on mobile devices
- [ ] All animations and transitions work smoothly

### Page-Specific Testing
**Dashboard (`/dashboard`)**
- [ ] Stats cards display correctly
- [ ] Quest completion animations work
- [ ] Floating XP badges appear
- [ ] Level up modals function properly

**Quests (`/quests`)**
- [ ] Quest cards render properly
- [ ] Filter categories work
- [ ] Create new quest modal opens
- [ ] Quest completion/failure actions work

**Rewards (`/rewards`)**
- [ ] Reward cards display with proper styling
- [ ] Claim reward modal works
- [ ] Confetti animation plays
- [ ] Filter and sort controls function

**Inventory (`/inventory`)**
- [ ] Item grid displays correctly
- [ ] Hover effects and animations work
- [ ] Item detail modals open and close
- [ ] Progress bars show correctly
- [ ] Locked/unlocked states display properly

**Settings (`/settings`)**
- [ ] Toggle switches work
- [ ] Display name can be updated
- [ ] Confirmation modals appear
- [ ] Logout functionality works (if Supabase configured)

### Performance Testing
- [ ] Page load times are acceptable
- [ ] Images load properly (if any)
- [ ] CSS animations are smooth
- [ ] No console errors in browser
- [ ] Mobile performance is good

### SEO & Meta Tags
- [ ] Page titles are correct
- [ ] Meta descriptions are set
- [ ] Favicon loads correctly
- [ ] Open Graph tags work (if configured)

## 🐛 Common Issues & Solutions

### Build Fails
- Check Node version (should be 20+)
- Clear node_modules and reinstall: `npm ci`
- Check for TypeScript errors: `npm run lint`

### Routes Don't Work
- Verify `netlify.toml` redirects are configured
- Check `next.config.js` has `output: 'export'`
- Ensure all pages are in `(site)` directory

### Styling Issues
- Verify Tailwind CSS builds correctly
- Check for missing imports
- Test on different screen sizes

### Animation Problems
- Framer Motion should work with static export
- Check for SSR-specific code that needs client-side guards

### Supabase Connection Issues
- Verify environment variables are set correctly
- Check Supabase project settings
- Test with browser developer tools

## 🎉 Success Criteria

Your deployment is successful when:
- [ ] All 6 routes load without errors
- [ ] Sidebar navigation works on all pages
- [ ] RPG-style theming is consistent
- [ ] Mobile responsive design works
- [ ] All interactive elements function properly
- [ ] Performance is acceptable (< 3s load time)
- [ ] No console errors in production

## 🔄 Continuous Deployment

For future updates:
1. Make changes locally
2. Test with `npm run dev`
3. Build and verify with `npm run build && npm run verify`
4. Deploy with `npm run deploy` or push to connected Git repository
5. Test the live deployment

---

**🚀 Ready to Deploy?** Run `npm run verify` one more time, then use `deploy.bat` or your preferred deployment method! 