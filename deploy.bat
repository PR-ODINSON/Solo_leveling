@echo off
echo 🚀 AscendOS Deployment Script
echo ==============================

REM Check if git is initialized
if not exist .git (
    echo 📁 Initializing Git repository...
    git init
)

REM Add all files
echo 📝 Adding files to Git...
git add .

REM Commit changes
echo 💾 Committing changes...
set /p commit_message="Enter commit message (or press Enter for default): "
if "%commit_message%"=="" set commit_message=Deploy AscendOS Solo Leveling App
git commit -m "%commit_message%"

REM Check if remote exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo 🔗 Setting up GitHub remote...
    set /p repo_url="Enter your GitHub repository URL (https://github.com/username/repo.git): "
    git remote add origin "%repo_url%"
)

REM Push to GitHub
echo ⬆️ Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ✅ Code pushed to GitHub successfully!
echo.
echo 🌐 Next Steps for Netlify Deployment:
echo 1. Go to https://app.netlify.com
echo 2. Click 'New site from Git'
echo 3. Choose GitHub and select your repository
echo 4. Build settings:
echo    - Build command: npm run build
echo    - Publish directory: .next
echo 5. Add environment variables in Site Settings:
echo    - NEXT_PUBLIC_SUPABASE_URL
echo    - NEXT_PUBLIC_SUPABASE_ANON_KEY
echo 6. Deploy!
echo.
echo 📖 For detailed instructions, see DEPLOYMENT.md

pause 