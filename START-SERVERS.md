# 🚀 How to Start the Servers

## Method 1: Using Python HTTP Server (Your Current Setup)

### Start Backend Server
Open PowerShell Terminal 1:
```powershell
cd "c:\Users\Afronic\Desktop\Deluxe tour and travel website\backend"
node server.js
```

Expected output:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📍 Environment: development
```

### Start Frontend Server
Open PowerShell Terminal 2:
```powershell
cd "c:\Users\Afronic\Desktop\Deluxe tour and travel website\frontend"
python -m http.server 3000
```

Expected output:
```
Serving HTTP on :: port 3000 (http://[::]:3000/) ...
```

### Access the Website
- **Homepage:** http://localhost:3000/index.html
- **Tours Page:** http://localhost:3000/pages/tours.html
- **Tour Detail:** http://localhost:3000/pages/tour-detail.html?tour=maldives-beach-paradise
- **Booking Page:** http://localhost:3000/pages/booking.html
- **Admin Dashboard:** http://localhost:3000/admin/bookings.html
- **Contact Page:** http://localhost:3000/pages/contact.html

**IMPORTANT:** Notice the URLs start with `http://localhost:3000/` NOT `http://127.0.0.1:3000/`. Both should work, but if one doesn't, try the other.

---

## Method 2: Using Node.js http-server (Alternative)

### Install http-server globally (one time only)
```powershell
npm install -g http-server
```

### Start Frontend Server
```powershell
cd "c:\Users\Afronic\Desktop\Deluxe tour and travel website\frontend"
http-server -p 3000 -c-1
```

Expected output:
```
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:3000
  http://192.168.x.x:3000
```

---

## Quick Start Script (PowerShell)

Save this as `start-all.ps1` in the project root and run it:

```powershell
# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\Afronic\Desktop\Deluxe tour and travel website\backend'; node server.js"

# Wait 2 seconds for backend to start
Start-Sleep -Seconds 2

# Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\Afronic\Desktop\Deluxe tour and travel website\frontend'; python -m http.server 3000"

# Wait 2 seconds for frontend to start
Start-Sleep -Seconds 2

# Open browser
Start-Process "http://localhost:3000/index.html"

Write-Host "✅ Both servers started!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000/index.html" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
```

---

## Troubleshooting

### Issue: "Site not found" when accessing http://localhost:3000

**Problem:** You're running the server from the wrong directory.

**Solution:** 
```powershell
# Make sure you're in the frontend directory
cd "c:\Users\Afronic\Desktop\Deluxe tour and travel website\frontend"
python -m http.server 3000
```

Then access: http://localhost:3000/index.html (notice the `/index.html` at the end)

### Issue: Port already in use

**Solution:**
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Or use a different port
python -m http.server 3001
```

### Issue: Python not found

**Solution:**
```powershell
# Check if Python is installed
python --version

# If not installed, use http-server instead
npm install -g http-server
http-server -p 3000 -c-1
```

### Issue: Node not found

**Solution:**
```powershell
# Install Node.js from https://nodejs.org/
# Then restart PowerShell and try again
node --version
```

---

## File Structure Reminder

```
Your Project/
├── frontend/          ← YOU MUST BE HERE for frontend server
│   ├── index.html     ← Homepage
│   ├── pages/
│   │   ├── tours.html
│   │   ├── tour-detail.html
│   │   ├── booking.html
│   │   └── contact.html
│   ├── admin/
│   │   └── bookings.html
│   └── js/
│
└── backend/           ← YOU MUST BE HERE for backend server
    └── server.js
```

---

## Quick Test

After starting both servers, test these URLs:

1. **Homepage:** http://localhost:3000/index.html
2. **API:** http://localhost:5000/
3. **Admin:** http://localhost:3000/admin/bookings.html

If all three load, you're good to go! ✅

---

**Note:** Always start from the `frontend` or `backend` directory, NOT from the project root!
