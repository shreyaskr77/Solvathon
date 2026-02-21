#!/bin/bash

# Academic Portal - Quick Setup Script
# This script helps you set up the entire MERN application

echo "🎓 Academic Portal - Setup Script"
echo "=================================="
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check MongoDB
echo "📦 Checking MongoDB..."
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB is installed"
else
    echo "⚠️  MongoDB CLI not found in PATH"
    echo "   Make sure MongoDB service is running before starting the backend"
    echo "   - Windows: Start MongoDB from Services or run: mongod"
    echo "   - macOS: brew services start mongodb-community"
    echo "   - Linux: sudo systemctl start mongod"
fi
echo ""

# Backend Setup
echo "🔧 Setting up Backend..."
echo "========================"
cd backend

# Check if .env exists
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created .env from template"
        echo "⚠️  Please edit backend/.env with your configuration:"
        echo "   - MONGODB_URI"
        echo "   - JWT_SECRET"
    fi
else
    echo "✅ .env file already exists"
fi

# Install backend dependencies
echo "📥 Installing backend dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Backend dependencies installed"
    else
        echo "❌ Failed to install backend dependencies"
        exit 1
    fi
else
    echo "✅ Backend dependencies already installed"
fi

cd ..
echo ""

# Frontend Setup
echo "🎨 Setting up Frontend..."
echo "========================="
cd frontend

# Check if .env exists
if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "✅ Created .env.local from template"
    fi
else
    echo "✅ .env.local file already exists"
fi

# Install frontend dependencies
echo "📥 Installing frontend dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Frontend dependencies installed"
    else
        echo "❌ Failed to install frontend dependencies"
        exit 1
    fi
else
    echo "✅ Frontend dependencies already installed"
fi

cd ..
echo ""

# Summary
echo "✅ Setup Complete!"
echo "=================="
echo ""
echo "Next Steps:"
echo "1. Edit configuration files (if needed):"
echo "   - backend/.env (MongoDB URI, JWT Secret)"
echo "   - frontend/.env.local (API URL)"
echo ""
echo "2. Start MongoDB (if using local):"
echo "   - Windows: mongod"
echo "   - macOS: brew services start mongodb-community"
echo "   - Linux: sudo systemctl start mongod"
echo ""
echo "3. Start the servers:"
echo "   - Backend:  cd backend && npm run dev"
echo "   - Frontend: cd frontend && npm run dev"
echo ""
echo "4. Open browser and go to:"
echo "   http://localhost:5173 (or 3000)"
echo ""
echo "5. Login with demo credentials:"
echo "   Email: student@gmail.com"
echo "   Password: password123"
echo ""
echo "📚 For detailed documentation, see:"
echo "   - SETUP_GUIDE.md (Full setup instructions)"
echo "   - backend/README.md (Backend API docs)"
echo "   - frontend/README.md (Frontend setup)"
echo ""
echo "Happy Coding! 🚀"
