#!/bin/bash

echo "🏥 Healthcare SPA - Quick Test Script"
echo "====================================="

# Test Backend
echo ""
echo "🔧 Testing Backend..."
cd backend

if [ ! -f "node_modules/.bin/nest" ]; then
    echo "❌ Backend dependencies not installed. Run: npm install"
    exit 1
fi

echo "✅ Backend dependencies found"

# Test Frontend
echo ""
echo "🔧 Testing Frontend..."
cd ../frontend

if [ ! -f "node_modules/.bin/next" ]; then
    echo "❌ Frontend dependencies not installed. Run: npm install"
    exit 1
fi

echo "✅ Frontend dependencies found"

echo ""
echo "🎉 All dependencies are installed!"
echo ""
echo "To start the application:"
echo "1. Backend: cd backend && npm run start:dev"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "Make sure to update your .env files with actual database credentials!"
