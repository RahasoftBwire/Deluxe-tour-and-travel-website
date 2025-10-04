# 🎯 Booking System - Quick Reference Card

## 🚀 Quick Start Commands

### Start Backend
```powershell
cd backend
node server.js
```
Expected: `✅ MongoDB Connected Successfully` + `🚀 Server running on port 5000`

### Start Frontend
```powershell
cd frontend
npx http-server -p 3000 -c-1
```
Expected: `Available on: http://127.0.0.1:3000`

---

## 📍 Important URLs

| Page | URL |
|------|-----|
| Homepage | http://127.0.0.1:3000 |
| Tour Detail | http://127.0.0.1:3000/pages/tour-detail.html?tour=maldives-beach-paradise |
| Booking Form | http://127.0.0.1:3000/pages/booking.html |
| Admin Dashboard | http://127.0.0.1:3000/admin/bookings.html |
| Backend API | http://localhost:5000/api |

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/bookings` | Public | Create booking |
| GET | `/api/bookings` | Admin | Get all bookings |
| GET | `/api/bookings/stats/overview` | Admin | Get statistics |
| GET | `/api/bookings/:id` | Protected | Get booking details |
| GET | `/api/bookings/reference/:ref` | Public | Get by reference |
| PATCH | `/api/bookings/:id/status` | Admin | Update status |
| DELETE | `/api/bookings/:id` | Admin | Delete booking |

---

## 💰 Price Calculation

```
Adults = Count × Price
Children = Count × (Price × 0.7)
Infants = Count × (Price × 0.5)
Subtotal = Adults + Children + Infants
Tax = Subtotal × 0.16
Total = Subtotal + Tax
```

**Example:** 2 Adults + 1 Child at $1,200
- Adults: 2 × $1,200 = $2,400
- Children: 1 × $840 = $840
- Subtotal: $3,240
- Tax (16%): $518.40
- **Total: $3,758.40**

---

## 📁 Key Files

### Backend (2 files)
- `backend/src/controllers/bookingControllerNew.js` - Business logic
- `backend/src/routes/bookingRoutesNew.js` - API routes

### Frontend (4 files)
- `frontend/pages/booking.html` - Booking form UI
- `frontend/js/booking.js` - Booking form logic
- `frontend/admin/bookings.html` - Admin dashboard UI
- `frontend/js/admin-bookings.js` - Admin dashboard logic

### Documentation (3 files)
- `BOOKING-SYSTEM-TESTING-GUIDE.md` - Full testing guide
- `BOOKING-QUICK-START.md` - Quick setup guide
- `BOOKING-SYSTEM-COMPLETE-SUMMARY.md` - Complete documentation

---

## ✅ Test Flow (5 Minutes)

1. **Open Tour:** http://127.0.0.1:3000/pages/tour-detail.html?tour=maldives-beach-paradise
2. **Click:** "Book Now" button → Redirects to booking form
3. **Step 1:** Date + 2 Adults + 1 Child → Next
4. **Step 2:** Fill contact info → Next
5. **Step 3:** Select M-Pesa → Next
6. **Step 4:** Check terms → Confirm Booking
7. **Result:** Booking reference (DLX-XXXXXX)
8. **Admin:** http://127.0.0.1:3000/admin/bookings.html
9. **Verify:** Booking appears in table
10. **Action:** Click "View" → Modal opens → Click "Confirm"

---

## 🎨 Status Badge Colors

| Status | Color | Hex |
|--------|-------|-----|
| Pending | Yellow | #f39c12 |
| Confirmed | Blue | #3498db |
| Completed | Green | #2ecc71 |
| Cancelled | Red | #e74c3c |

---

## 🐛 Quick Fixes

**Backend won't start?**
```powershell
cd backend; npm install; node server.js
```

**Frontend 404?**
```powershell
cd frontend; npx http-server -p 3000 -c-1
```

**MongoDB error?**
- Start MongoDB service
- Or add MongoDB Atlas URI to `.env`

**Admin dashboard empty?**
- Refresh page (sample data loads automatically)
- Check browser console for errors

---

## 📊 Sample Bookings

### Booking 1: Masai Mara Safari
- Reference: DLX-ABC123
- Customer: John Smith (john.smith@example.com)
- Amount: $6,264.00
- Status: Confirmed | Payment: M-Pesa ✅

### Booking 2: Maldives Beach
- Reference: DLX-XYZ456
- Customer: Sarah Johnson (sarah.j@example.com)
- Amount: $2,956.80
- Status: Pending | Payment: Card ⏳

### Booking 3: Dubai Luxury
- Reference: DLX-PQR789
- Customer: Mike Wilson (mike.w@example.com)
- Amount: $1,740.00
- Status: Completed | Payment: PayPal ✅

---

## 🔐 Admin Actions

| Action | Button | Confirmation | Result |
|--------|--------|--------------|--------|
| View Details | 👁️ View | No | Opens modal |
| Confirm Booking | ✅ Confirm | Yes | Status → Confirmed |
| Mark Complete | ✓ Complete | Yes | Status → Completed |
| Cancel Booking | ❌ Cancel | Yes | Status → Cancelled |
| Delete Booking | 🗑️ Delete | Yes | Removes from table |

---

## 📞 Contact

**Email:** info@deluxetour.co.ke  
**Phone:** +254 725 442 618  
**WhatsApp:** +254 725 442 618

---

## 🎓 Features Checklist

- [x] 4-step booking wizard
- [x] Real-time price calculation
- [x] Form validation
- [x] Booking reference generation
- [x] Admin dashboard with stats
- [x] Filter by status/payment
- [x] Search bookings
- [x] View detailed booking info
- [x] Update booking status
- [x] Delete bookings
- [x] Sample data for testing
- [x] Responsive design
- [ ] Email notifications (future)
- [ ] Payment processing (future)
- [ ] User authentication (future)

---

## 🎯 Success Indicators

✅ Book Now button redirects to form  
✅ Tour details show in sidebar  
✅ Price updates when changing travelers  
✅ Form validates required fields  
✅ Booking submission works  
✅ Reference number displays  
✅ Admin dashboard loads  
✅ Bookings appear in table  
✅ View details modal opens  
✅ Status update works  

**All green?** 🎉 System is working!

---

**Quick Reference Version:** 1.0  
**For:** Deluxe Tour & Travel Booking System  
**Updated:** December 2024
