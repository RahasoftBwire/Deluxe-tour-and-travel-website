# Deluxe Tour & Travel - Complete Setup & Test Script
# Author: Khalid Abdikarim

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  DELUXE TOUR & TRAVEL - SETUP SCRIPT   " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is NOT installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js first:" -ForegroundColor Yellow
    Write-Host "1. Visit: https://nodejs.org/" -ForegroundColor White
    Write-Host "2. Download the LTS version" -ForegroundColor White
    Write-Host "3. Run the installer" -ForegroundColor White
    Write-Host "4. Restart PowerShell and run this script again" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  STEP 1: Installing Backend Dependencies" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Set-Location "c:\Users\Afronic\Desktop\Deluxe tour and travel website\backend"
Write-Host "Installing backend packages..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Backend installation failed!" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  STEP 2: Installing Frontend Dependencies" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Set-Location "c:\Users\Afronic\Desktop\Deluxe tour and travel website\frontend"
Write-Host "Installing http-server for frontend..." -ForegroundColor Yellow
npm install -g http-server

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend server installed successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend installation failed!" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  INSTALLATION COMPLETE!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the servers, you need 2 terminals:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Terminal 1 - Backend Server:" -ForegroundColor Cyan
Write-Host '  cd "c:\Users\Afronic\Desktop\Deluxe tour and travel website\backend"' -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host "  Backend will run on: http://localhost:5000" -ForegroundColor Green
Write-Host ""
Write-Host "Terminal 2 - Frontend Server:" -ForegroundColor Cyan
Write-Host '  cd "c:\Users\Afronic\Desktop\Deluxe tour and travel website\frontend"' -ForegroundColor White
Write-Host "  npm start" -ForegroundColor White
Write-Host "  Frontend will run on: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
$response = Read-Host "Do you want to start the servers now? (Y/N)"

if ($response -eq "Y" -or $response -eq "y") {
    Write-Host ""
    Write-Host "Starting Backend Server..." -ForegroundColor Yellow
    Set-Location "c:\Users\Afronic\Desktop\Deluxe tour and travel website\backend"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\Afronic\Desktop\Deluxe tour and travel website\backend'; npm run dev"
    
    Start-Sleep -Seconds 3
    
    Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
    Set-Location "c:\Users\Afronic\Desktop\Deluxe tour and travel website\frontend"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\Afronic\Desktop\Deluxe tour and travel website\frontend'; npm start"
    
    Write-Host ""
    Write-Host "✓ Both servers are starting in separate windows!" -ForegroundColor Green
    Write-Host "✓ Your browser should open automatically" -ForegroundColor Green
    Write-Host "✓ Frontend: http://localhost:3000" -ForegroundColor Green
    Write-Host "✓ Backend API: http://localhost:5000" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Setup complete! Run the servers manually when ready." -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to exit"
