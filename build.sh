#!/bin/bash

# AscendOS Build Script for Netlify
echo "🚀 Starting AscendOS build process..."

# Check if package-lock.json exists
if [ ! -f "package-lock.json" ]; then
    echo "📦 No package-lock.json found, generating..."
    npm install --package-lock-only
fi

# Try npm ci first (preferred for CI/CD)
echo "📦 Installing dependencies with npm ci..."
if npm ci --prefer-offline --no-audit; then
    echo "✅ Dependencies installed successfully with npm ci"
else
    echo "⚠️ npm ci failed, falling back to npm install..."
    if npm install --prefer-offline --no-audit; then
        echo "✅ Dependencies installed successfully with npm install"
    else
        echo "❌ Both npm ci and npm install failed"
        exit 1
    fi
fi

# Build the application
echo "🔨 Building Next.js application..."
if npm run build; then
    echo "✅ Build completed successfully!"
else
    echo "❌ Build failed"
    exit 1
fi

echo "🎉 AscendOS build process completed!" 