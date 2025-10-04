# 🚀 Quick Start - Booking System Test

## ⚡ 5-Minute Setup & Test

### Step 1: Start Backend Server (1 minute)
```powershell
cd backend
node server.js
```
**Expected:** Console shows:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📍 Environment: development
```

### Step 2: Start Frontend Server (1 minute)
Open new terminal:
```powershell
cd frontend
npx http-server -p 3000 -c-1
```
**Expected:** Console shows:
```
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:3000
```

### Step 3: Test Booking Flow (3 minutes)

#### A. Open Tour Detail Page
1. Open browser: http://127.0.0.1:3000/pages/tour-detail.html?tour=maldives-beach-paradise
2. Scroll down, click **"Book Now"** button
3. ✅ **Expected:** Redirects to booking.html with tour info in sidebar

#### B. Fill Booking Form
**Step 1 - Tour Details:**
- Date: Select tomorrow or any future date
- Adults: 2 (click + button once)
- Children: 1
- Special Requests: "Vegetarian meals"
- Click **"Next Step"**

**Step 2 - Contact Info:**
- Full Name: `John Doe`
- Email: `john.doe@example.com`
- Phone: `+254 725 442 618`
- Nationality: `Kenyan`
- Address: `123 Nairobi Street`
- Emergency Contact: `Jane Doe`
- Emergency Phone: `+254 700 000 000`
- Click **"Next Step"**

**Step 3 - Payment:**
- Select: **M-Pesa**
- Click **"Next Step"**

**Step 4 - Review & Confirm:**
- Review all details
- Check: ☑️ **I agree to terms and conditions**
- Click **"Confirm Booking"**
- ✅ **Expected:** Success message with booking reference (e.g., DLX-ABC123)

#### C. View in Admin Dashboard
1. Open: http://127.0.0.1:3000/admin/bookings.html
2. ✅ **Expected:** Dashboard shows booking in table
3. Click **"View"** button on your booking
4. ✅ **Expected:** Modal opens with full booking details
5. Click **"Confirm Booking"** button
6. ✅ **Expected:** Status changes to "Confirmed"

---

## ✅ Success Indicators

All these should work:
- [ ] Book Now button redirects to booking form
- [ ] Tour details appear in sidebar
- [ ] Price updates when changing traveler counts
- [ ] Form validation works (try skipping required fields)
- [ ] Booking submission shows reference number
- [ ] Admin dashboard displays bookings
- [ ] View details modal opens
- [ ] Status update buttons work

---

## 🐛 Quick Fixes

**Backend won't start?**
```powershell
cd backend
npm install
node server.js
```

**Frontend 404 errors?**
```powershell
cd frontend
npm install -g http-server
npx http-server -p 3000 -c-1
```

**MongoDB not connected?**
- Start MongoDB service
- Or use MongoDB Atlas connection string in `.env`

**Admin dashboard empty?**
- Refresh page (sample data should load)
- Check browser console for errors

---

## 🎯 Key Features to Test

1. **Price Calculation:**
   - Adults: 100% of price ($1,200)
   - Children: 70% of price ($840)
   - Infants: 50% of price ($600)
   - Tax: 16% added automatically

2. **Admin Actions:**
   - View booking details
   - Update status (Pending → Confirmed → Completed)
   - Filter by status/payment
   - Search by name/email/reference
   - Delete bookings

3. **Sample Data:**
   - Dashboard shows 3 demo bookings if backend fails
   - Test filtering and viewing before backend integration

---

## 📞 Need Help?

- **Full Testing Guide:** See `BOOKING-SYSTEM-TESTING-GUIDE.md`
- **Email:** info@deluxetour.co.ke
- **Phone:** +254 725 442 618

---

**Quick Start Version:** 1.0  
**For:** Deluxe Tour & Travel - Booking System Testing
