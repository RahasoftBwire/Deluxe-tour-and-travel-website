# Quick Start Script for Deluxe Tour & Travel
# Run this after initial setup is complete

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  STARTING DELUXE TOUR & TRAVEL" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Start Backend Server
Write-Host "Starting Backend Server on port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\Afronic\Desktop\Deluxe tour and travel website\backend'; Write-Host '===========================================' -ForegroundColor Green; Write-Host '   BACKEND SERVER - http://localhost:5000' -ForegroundColor Green; Write-Host '===========================================' -ForegroundColor Green; npm run dev"

Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "Starting Frontend Server on port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\Afronic\Desktop\Deluxe tour and travel website\frontend'; Write-Host '===========================================' -ForegroundColor Cyan; Write-Host '  FRONTEND SERVER - http://localhost:3000' -ForegroundColor Cyan; Write-Host '===========================================' -ForegroundColor Cyan; npm start"

Write-Host ""
Write-Host "✓ Servers are starting!" -ForegroundColor Green
Write-Host "✓ Backend API: http://localhost:5000" -ForegroundColor Green
Write-Host "✓ Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C in each server window to stop them" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to close this window"
