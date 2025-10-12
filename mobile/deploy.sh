#!/bin/bash

# Brush&Coin Web App Deployment Script

echo "🚀 Building Brush&Coin Web App for Production..."

# Build the Flutter web app
echo "📦 Building Flutter web app..."
flutter build web --release

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build output located at: build/web/"
    echo ""
    echo "🌐 Deployment Options:"
    echo "1. Netlify: Drag & drop build/web folder to netlify.com"
    echo "2. Vercel: cd build/web && vercel --prod"
    echo "3. Firebase: firebase deploy"
    echo "4. GitHub Pages: Push to repository with GitHub Actions"
    echo "5. Custom Server: Upload build/web contents to web server"
    echo ""
    echo "🔧 Local Testing:"
    echo "cd build/web && python -m http.server 8000"
    echo "Then visit: http://localhost:8000"
    echo ""
    echo "📊 Build Statistics:"
    echo "Total files: $(find build/web -type f | wc -l)"
    echo "Total size: $(du -sh build/web | cut -f1)"
else
    echo "❌ Build failed! Please check the error messages above."
    exit 1
fi
