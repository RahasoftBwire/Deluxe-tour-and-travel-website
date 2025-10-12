# 🔧 URGENT FIX - Login & Registration Issues

## ❌ Problem Identified

**Issue**: Login and Registration showing "An error occurred. Try again later"

**Root Cause**: **MongoDB is not installed/running**

The backend server is running on port 5000, but it cannot connect to MongoDB at `localhost:27017`.

---

## ✅ Solution Options

### Option 1: Install MongoDB (Recommended for Full Features)

#### Quick Install (Windows):

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Click "Download" (Windows, MSI installer)
   - Run the installer

2. **During Installation**:
   - Choose "Complete" installation
   - ✅ Check "Install MongoDB as a Service"
   - ✅ Check "Install MongoDB Compass" (GUI tool)

3. **Start MongoDB**:
   ```powershell
   # MongoDB should auto-start as a service
   # To verify it's running:
   Get-Service -Name MongoDB
   ```

4. **Restart Backend**:
   ```powershell
   cd backend
   node server.js
   ```

   You should see:
   ```
   🚀 Server running on port 5000
   📍 Environment: development
   ✅ MongoDB Connected Successfully
   ```

---

### Option 2: Use MongoDB Atlas (Cloud Database - Free)

If you don't want to install MongoDB locally:

1. **Create Free Account**:
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free tier

2. **Create Cluster**:
   - Click "Build a Database"
   - Choose "Free" tier (M0)
   - Select region (closest to you)
   - Click "Create"

3. **Set Up Access**:
   - Create database user (username/password)
   - Add IP address: Click "Add My Current IP Address"
   - Or allow all: `0.0.0.0/0` (for development only!)

4. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/deluxe_tour_travel
   ```

5. **Update .env**:
   ```env
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/deluxe_tour_travel?retryWrites=true&w=majority
   ```

6. **Restart Backend**:
   ```powershell
   cd backend
   node server.js
   ```

---

### Option 3: Quick Fix for Testing (No MongoDB - Limited Features)

If you just want to test the frontend UI without database:

**Modify backend/server.js** to skip MongoDB connection:

```javascript
// Comment out MongoDB connection
/*
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/deluxe_tour_travel', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));
*/

console.log('⚠️ Running without MongoDB (TEST MODE)');
```

**Note**: This will make the site work BUT:
- ❌ Registration won't save users
- ❌ Login won't work
- ❌ Bookings won't save
- ✅ Frontend UI will load

---

## 🚀 Recommended Steps (RIGHT NOW)

### Step 1: Install MongoDB (10 minutes)

```powershell
# 1. Download from: https://www.mongodb.com/try/download/community
# 2. Run installer (choose Complete + Install as Service)
# 3. Wait for installation to complete
```

### Step 2: Verify MongoDB is Running

```powershell
# Check MongoDB service
Get-Service -Name MongoDB

# Should show:
# Status   : Running
# Name     : MongoDB
```

### Step 3: Restart Backend

```powershell
# Stop current backend (Ctrl+C in backend terminal)
cd backend
node server.js

# You should now see:
# 🚀 Server running on port 5000
# 📍 Environment: development
# ✅ MongoDB Connected Successfully  <-- This line is KEY!
```

### Step 4: Test Registration

1. Open: `http://127.0.0.1:3000/pages/register.html`
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123!
3. Click "Create Account"
4. ✅ Should redirect to homepage with success message

### Step 5: Test Login

1. Open: `http://127.0.0.1:3000/pages/login.html`
2. Email: test@example.com
3. Password: Test123!
4. ✅ Should login successfully

---

## 🔍 How to Verify Everything is Working

### Check 1: Backend Logs
When you start backend, you should see:
```
🚀 Server running on port 5000
📍 Environment: development
✅ MongoDB Connected Successfully   <-- MUST SEE THIS!
```

### Check 2: Test API in Browser
Open: `http://localhost:5000/`

Should return:
```json
{
  "message": "Welcome to Deluxe Tour & Travel API",
  "version": "1.0.0",
  "status": "Server is running"
}
```

### Check 3: Browser Console
Open browser console (F12) when testing:
- ❌ If you see "Failed to fetch" - Backend not running
- ❌ If you see "Network error" - MongoDB not connected
- ✅ Should see no errors

---

## 🐛 Troubleshooting

### Issue: "MongoDB service not starting"

**Solution**:
```powershell
# Try starting manually
net start MongoDB

# Or run MongoDB without service:
mongod --dbpath C:\data\db
```

### Issue: "Port 27017 already in use"

**Solution**:
```powershell
# Find process using port
Get-Process -Name mongod -ErrorAction SilentlyContinue

# Kill it if needed
Stop-Process -Name mongod -Force

# Restart MongoDB service
Restart-Service MongoDB
```

### Issue: "Still getting connection errors"

**Check .env file**:
```env
# Make sure this line exists:
MONGODB_URI=mongodb://localhost:27017/deluxe_tour_travel

# NOT:
# MONGODB_URI=mongodb://127.0.0.1:27017/deluxe_tour_travel
```

---

## 📊 Status After Fix

### What Will Work:
✅ User Registration
✅ User Login  
✅ JWT Authentication
✅ Booking Creation
✅ Admin Dashboard
✅ All Database Operations

### What Still Needs Work:
⏳ Payment UI on booking page (separate task)
⏳ Payment API keys configuration

---

## ⚡ Quick Commands Reference

```powershell
# Check if MongoDB is running
Get-Service -Name MongoDB

# Start MongoDB service
Start-Service MongoDB

# Stop MongoDB service
Stop-Service MongoDB

# Restart MongoDB service
Restart-Service MongoDB

# Start backend
cd backend
node server.js

# Start frontend
cd frontend
python -m http.server 3000 --bind 127.0.0.1
```

---

## 📱 Test Complete Flow

After MongoDB is installed and running:

1. **Register**
   - http://127.0.0.1:3000/pages/register.html
   - Create account ✅

2. **Login**
   - http://127.0.0.1:3000/pages/login.html
   - Use registered credentials ✅

3. **Browse Tours**
   - http://127.0.0.1:3000/pages/tours.html
   - View tours ✅

4. **Tour Details**
   - Click any tour
   - View details ✅

5. **Book Tour**
   - Click "Book Now" button ✅
   - Fill booking form ✅
   - Create booking ✅

6. **Admin View**
   - Create admin user (see below)
   - Login as admin
   - View bookings ✅

---

## 👤 Create Admin User

After MongoDB is installed:

**Option 1: Using MongoDB Compass (GUI)**
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select database: `deluxe_tour_travel`
4. Select collection: `users`
5. Find your user
6. Edit document, change `role` from "customer" to "admin"
7. Save

**Option 2: Using Mongo Shell**
```javascript
// Connect to MongoDB
mongo

// Switch to database
use deluxe_tour_travel

// Update user role
db.users.updateOne(
  { email: "test@example.com" },
  { $set: { role: "admin" } }
)
```

---

## 🎯 Summary

**Current Issue**: MongoDB not installed = Auth not working

**Solution**: Install MongoDB (10 minutes)

**After Install**: Everything will work perfectly!

---

## 📞 Need Help?

If MongoDB installation fails:
1. Restart computer after installation
2. Try MongoDB Atlas (cloud option - no installation needed)
3. Check Windows Defender/Firewall settings
4. Make sure you have admin rights

---

**Priority**: HIGH - Install MongoDB first, then test everything!
