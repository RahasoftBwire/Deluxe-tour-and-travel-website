# 🚨 TROUBLESHOOTING: Site Not Loading

## Problem: ERR_ADDRESS_INVALID or Site Can't Be Reached

### Solution 1: Use Correct Python Command (RECOMMENDED)

Stop any running servers (Ctrl+C in terminal), then:

```powershell
# Navigate to frontend folder
cd "c:\Users\Afronic\Desktop\Deluxe tour and travel website\frontend"

# Start server with explicit bind address
python -m http.server 3000 --bind 127.0.0.1
```

Then access: **http://127.0.0.1:3000/index.html**

---

### Solution 2: Use Alternative Port

If port 3000 is problematic:

```powershell
cd "c:\Users\Afronic\Desktop\Deluxe tour and travel website\frontend"
python -m http.server 8000 --bind 127.0.0.1
```

Then access: **http://127.0.0.1:8000/index.html**

---

### Solution 3: Use Node.js http-server Instead

If Python continues to have issues:

```powershell
# Install http-server (one time only)
npm install -g http-server

# Navigate to frontend
cd "c:\Users\Afronic\Desktop\Deluxe tour and travel website\frontend"

# Start server
http-server -p 3000 -a 127.0.0.1 -c-1
```

Then access: **http://127.0.0.1:3000/index.html**

---

## Step-by-Step: Manual Server Start

### Step 1: Start Backend

Open PowerShell Terminal 1:
```powershell
cd "c:\Users\Afronic\Desktop\Deluxe tour and travel website\backend"
node server.js
```

**Expected output:**
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

Leave this terminal running!

---

### Step 2: Start Frontend

Open PowerShell Terminal 2:
```powershell
cd "c:\Users\Afronic\Desktop\Deluxe tour and travel website\frontend"
python -m http.server 3000 --bind 127.0.0.1
```

**Expected output:**
```
Serving HTTP on 127.0.0.1 port 3000 (http://127.0.0.1:3000/) ...
```

**IMPORTANT:** Make sure it says `127.0.0.1` NOT `[::]`!

Leave this terminal running!

---

### Step 3: Open Browser

Use these URLs (try both if one doesn't work):

**Try First:**
- http://127.0.0.1:3000/index.html
- http://127.0.0.1:3000/pages/tours.html

**Alternative:**
- http://localhost:3000/index.html
- http://localhost:3000/pages/tours.html

---

## Common Issues & Fixes

### Issue 1: "ERR_ADDRESS_INVALID"
**Cause:** Server binding to IPv6 instead of IPv4
**Fix:** Add `--bind 127.0.0.1` to Python command
```powershell
python -m http.server 3000 --bind 127.0.0.1
```

### Issue 2: "Port already in use"
**Fix:** Kill the process or use different port
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill it (replace <PID> with the number from above)
taskkill /PID <PID> /F

# Or use different port
python -m http.server 8000 --bind 127.0.0.1
```

### Issue 3: "Python not recognized"
**Fix:** Use full Python path or check installation
```powershell
# Try these variations
py -m http.server 3000 --bind 127.0.0.1
python3 -m http.server 3000 --bind 127.0.0.1

# Or check Python installation
python --version
py --version
```

### Issue 4: "No such file or directory"
**Cause:** Wrong directory
**Fix:** Make sure you're in the frontend folder
```powershell
# Check current directory
pwd

# Should show: ...Deluxe tour and travel website\frontend
# If not, navigate to it:
cd "c:\Users\Afronic\Desktop\Deluxe tour and travel website\frontend"
```

### Issue 5: 404 Not Found
**Cause:** Missing file in URL
**Fix:** Always include the HTML file
```
❌ Wrong: http://127.0.0.1:3000/
✅ Right: http://127.0.0.1:3000/index.html
```

---

## Quick Verification Checklist

Before accessing the site, verify:

- [ ] Are you in the **frontend** folder? (`pwd` should show `...frontend`)
- [ ] Did the server start successfully? (should show `127.0.0.1`)
- [ ] Is the URL correct? (include `/index.html`)
- [ ] Is backend running? (check Terminal 1)
- [ ] Any firewall blocking? (allow Python/Node in firewall)

---

## Working Configuration

Here's a confirmed working setup:

**Terminal 1 (Backend):**
```powershell
PS C:\Users\Afronic\Desktop\Deluxe tour and travel website\backend> node server.js
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

**Terminal 2 (Frontend):**
```powershell
PS C:\Users\Afronic\Desktop\Deluxe tour and travel website\frontend> python -m http.server 3000 --bind 127.0.0.1
Serving HTTP on 127.0.0.1 port 3000 (http://127.0.0.1:3000/) ...
```

**Browser:**
```
✅ http://127.0.0.1:3000/index.html
✅ http://127.0.0.1:3000/pages/tours.html
✅ http://127.0.0.1:3000/admin/bookings.html
```

---

## Alternative: Use Live Server Extension

If you have VS Code:

1. Install "Live Server" extension
2. Right-click on `frontend/index.html`
3. Select "Open with Live Server"
4. Site opens automatically at http://127.0.0.1:5500

---

## Still Not Working?

Try the absolute simplest method:

```powershell
# 1. Stop all servers
# Press Ctrl+C in all terminals

# 2. Navigate to frontend
cd "c:\Users\Afronic\Desktop\Deluxe tour and travel website\frontend"

# 3. Start with explicit settings
python -m http.server 8080 --bind localhost

# 4. Open this exact URL
http://localhost:8080/index.html
```

If this works, your issue was with port 3000 or the IPv6 binding.

---

## Contact for Help

If nothing works, provide this info:
- Python version: `python --version`
- Current directory: `pwd`
- Server output: (copy the text from terminal)
- URL you're trying: (exact URL)
- Error message: (exact error)

**Email:** info@deluxetour.co.ke  
**Phone:** +254 725 442 618

---

**Last Updated:** December 2024
