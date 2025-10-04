# Deluxe Tour & Travel - Quick Start Script
# This script starts both backend and frontend servers automatically

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Deluxe Tour & Travel - Starting Servers..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Get the script's directory (project root)
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "📁 Project Root: $projectRoot" -ForegroundColor Yellow
Write-Host ""

# Start Backend Server in new window
Write-Host "🚀 Starting Backend Server..." -ForegroundColor Green
$backendPath = Join-Path $projectRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '🔧 Backend Server Starting...' -ForegroundColor Green; node server.js"

# Wait for backend to initialize
Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Start Frontend Server in new window
Write-Host "🌐 Starting Frontend Server..." -ForegroundColor Green
$frontendPath = Join-Path $projectRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '🎨 Frontend Server Starting...' -ForegroundColor Green; python -m http.server 3000 --bind 127.0.0.1"

# Wait for frontend to initialize
Write-Host "⏳ Waiting for frontend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  ✅ SERVERS STARTED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend URLs:" -ForegroundColor Cyan
Write-Host "   Homepage:        http://localhost:3000/index.html" -ForegroundColor White
Write-Host "   Tours:           http://localhost:3000/pages/tours.html" -ForegroundColor White
Write-Host "   Tour Detail:     http://localhost:3000/pages/tour-detail.html?tour=maldives-beach-paradise" -ForegroundColor White
Write-Host "   Booking:         http://localhost:3000/pages/booking.html" -ForegroundColor White
Write-Host "   Admin Dashboard: http://localhost:3000/admin/bookings.html" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Backend URL:" -ForegroundColor Cyan
Write-Host "   API:             http://localhost:5000/" -ForegroundColor White
Write-Host ""
Write-Host "📝 To stop servers: Close the PowerShell windows or press Ctrl+C in each" -ForegroundColor Yellow
Write-Host ""

# Ask if user wants to open browser
$openBrowser = Read-Host "Open homepage in browser? (Y/N)"
if ($openBrowser -eq "Y" -or $openBrowser -eq "y") {
    Write-Host "🌐 Opening browser..." -ForegroundColor Green
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:3000/index.html"
}

Write-Host ""
Write-Host "✨ Happy coding!" -ForegroundColor Magenta
Write-Host ""
