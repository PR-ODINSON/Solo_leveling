@echo off
echo 🚀 AscendOS Netlify Deployment Script
echo =====================================

echo.
echo 🧹 Cleaning previous builds...
call npm run clean

echo.
echo 🔨 Building the application...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed! Please check the errors above.
    pause
    exit /b 1
)

echo.
echo ✅ Build successful! 
echo 📁 Static files generated in 'out' directory

echo.
echo 🌐 Choose deployment option:
echo 1. Deploy to production
echo 2. Deploy to preview
echo 3. Just build (already done)
echo.

set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo 🚀 Deploying to production...
    call netlify deploy --prod --dir=out
) else if "%choice%"=="2" (
    echo.
    echo 🚀 Deploying to preview...
    call netlify deploy --dir=out
) else if "%choice%"=="3" (
    echo.
    echo ✅ Build complete! You can manually upload the 'out' folder to Netlify.
) else (
    echo.
    echo ❌ Invalid choice. Build complete, no deployment.
)

echo.
echo 🎉 Deployment script finished!
echo.
echo 📋 Next steps:
echo - Test your deployment URL
echo - Verify all routes work correctly
echo - Check that animations and styling load properly
echo - Test the sidebar navigation
echo - Verify inventory and settings modals work
echo.
pause 