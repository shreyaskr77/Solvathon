@echo off
REM Academic Portal - Quick Setup Script for Windows
REM This script helps you set up the entire MERN application

echo.
echo 🎓 Academic Portal - Setup Script
echo ==================================
echo.

REM Check Node.js installation
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 14+ first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version
echo.

REM Check MongoDB
echo 📦 Checking MongoDB...
mongod --version >nul 2>&1
if %errorlevel% eq 0 (
    echo ✅ MongoDB is installed
) else (
    echo ⚠️  MongoDB not found in PATH
    echo    Make sure MongoDB service is running before starting the backend
    echo    - Windows: Start MongoDB from Services or run 'mongod' in another terminal
)
echo.

REM Backend Setup
echo 🔧 Setting up Backend...
echo ========================
cd backend

if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env
        echo ✅ Created .env from template
        echo ⚠️  Please edit backend\.env with your configuration:
        echo    - MONGODB_URI
        echo    - JWT_SECRET
    )
) else (
    echo ✅ .env file already exists
)

REM Install backend dependencies
echo 📥 Installing backend dependencies...
if not exist "node_modules" (
    call npm install
    if %errorlevel% eq 0 (
        echo ✅ Backend dependencies installed
    ) else (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
) else (
    echo ✅ Backend dependencies already installed
)

cd ..
echo.

REM Frontend Setup
echo 🎨 Setting up Frontend...
echo =========================
cd frontend

if not exist ".env.local" (
    if exist ".env.example" (
        copy .env.example .env.local
        echo ✅ Created .env.local from template
    )
) else (
    echo ✅ .env.local file already exists
)

REM Install frontend dependencies
echo 📥 Installing frontend dependencies...
if not exist "node_modules" (
    call npm install
    if %errorlevel% eq 0 (
        echo ✅ Frontend dependencies installed
    ) else (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
) else (
    echo ✅ Frontend dependencies already installed
)

cd ..
echo.

REM Summary
echo ✅ Setup Complete!
echo ==================
echo.
echo Next Steps:
echo 1. Edit configuration files (if needed):
echo    - backend\.env (MongoDB URI, JWT Secret)
echo    - frontend\.env.local (API URL)
echo.
echo 2. Start MongoDB (if using local):
echo    - Open Command Prompt and run: mongod
echo.
echo 3. Start the servers (in separate terminals):
echo    - Backend:  cd backend ^&^& npm run dev
echo    - Frontend: cd frontend ^&^& npm run dev
echo.
echo 4. Open browser and go to:
echo    http://localhost:5173 (or 3000)
echo.
echo 5. Login with demo credentials:
echo    Email: student@gmail.com
echo    Password: password123
echo.
echo 📚 For detailed documentation, see:
echo    - SETUP_GUIDE.md (Full setup instructions)
echo    - backend\README.md (Backend API docs)
echo    - frontend\README.md (Frontend setup)
echo.
echo Happy Coding! 🚀
echo.
pause
