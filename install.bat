@echo off
REM Automated installation script for Deluxe Tour & Travel System (Windows)
REM Run this script on a fresh Windows machine after cloning the repository

echo ===================================
echo Deluxe Tour ^& Travel - Auto Setup
echo ===================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo X Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    echo Download version 22.20.0 or higher
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo npm version:
npm --version
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo X Failed to install backend dependencies
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
cd ..
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo X Failed to install frontend dependencies
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
cd ..
echo.

REM Check if .env exists
if not exist "backend\.env" (
    echo Warning: backend\.env file not found!
    echo Creating sample .env file...
    (
        echo PORT=5000
        echo NODE_ENV=development
        echo MONGODB_URI=mongodb://localhost:27017/deluxe_tour_travel
        echo JWT_SECRET=change_this_secret_key_in_production
        echo JWT_EXPIRE=7d
    ) > backend\.env
    echo Sample .env file created. Please update with your values!
    echo.
)

echo ===================================
echo Installation Complete!
echo ===================================
echo.
echo Next Steps:
echo 1. Update backend\.env with your configuration
echo 2. Start MongoDB (if using local)
echo 3. Run backend: cd backend ^&^& npm run dev
echo 4. Run frontend: cd frontend ^&^& npx http-server -p 3000 -o
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo For detailed documentation, see REQUIREMENTS.txt
echo ===================================
pause
