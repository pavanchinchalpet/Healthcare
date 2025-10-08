#!/bin/bash

echo "🏥 Healthcare SPA Setup Script"
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Setup Backend
echo ""
echo "🔧 Setting up Backend..."
cd backend

if [ ! -f "package.json" ]; then
    echo "❌ Backend package.json not found. Please ensure you're in the correct directory."
    exit 1
fi

echo "📦 Installing backend dependencies..."
npm install

if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please update the .env file with your Neon database credentials"
fi

echo "✅ Backend setup complete!"

# Setup Frontend
echo ""
echo "🔧 Setting up Frontend..."
cd ../frontend

if [ ! -f "package.json" ]; then
    echo "❌ Frontend package.json not found. Please ensure you're in the correct directory."
    exit 1
fi

echo "📦 Installing frontend dependencies..."
npm install

if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file from template..."
    cp env.local.example .env.local
fi

echo "✅ Frontend setup complete!"

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your Neon database URL"
echo "2. Start backend: cd backend && npm run start:dev"
echo "3. Start frontend: cd frontend && npm run dev"
echo ""
echo "Backend will run on: http://localhost:3001/graphql"
echo "Frontend will run on: http://localhost:3000"
