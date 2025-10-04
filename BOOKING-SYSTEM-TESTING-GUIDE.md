# 🎯 Booking System Testing Guide

## ✅ Overview
Complete testing guide for the new booking system implementation. Follow this guide to verify all functionality works correctly.

---

## 📋 Pre-Testing Checklist

### Backend Setup
- [ ] MongoDB running (check with `mongod` or MongoDB Compass)
- [ ] `.env` file configured with:
  ```
  MONGODB_URI=mongodb://localhost:27017/deluxe_tour_travel
  JWT_SECRET=your_secret_key_here
  PORT=5000
  FRONTEND_URL=http://127.0.0.1:3000
  ```
- [ ] Dependencies installed (`cd backend && npm install`)
- [ ] Backend server running (`cd backend && node server.js`)
- [ ] Verify backend is running: Open http://localhost:5000/ in browser

### Frontend Setup
- [ ] Frontend server running (`cd frontend && npx http-server -p 3000 -c-1`)
- [ ] Verify frontend is running: Open http://127.0.0.1:3000 in browser

---

## 🧪 Test Suite

### Test 1: Book Now Button Integration ✅

**Objective:** Verify Book Now button redirects to booking form with tour data

**Steps:**
1. Open http://127.0.0.1:3000/pages/tour-detail.html?tour=maldives-beach-paradise
2. Scroll down to the "Book Now" button
3. Click "Book Now"
4. **Expected Result:**
   - Redirects to `booking.html` page
   - Tour details appear in the sidebar (title, image, destination, duration, price)
   - URL contains tour data parameter
   - Form displays "Step 1: Tour Details"

**Pass Criteria:** ✅ Redirects to booking page with tour info displayed

---

### Test 2: Booking Form - Step 1 (Tour Details) ✅

**Objective:** Validate tour details step works correctly

**Steps:**
1. On booking page, verify tour summary is displayed in sidebar
2. Select a departure date (minimum tomorrow's date)
3. Increase adult count to 2 using + button
4. Increase children count to 1
5. Increase infant count to 1
6. Add special request: "Vegetarian meals preferred"
7. **Expected Result:**
   - Date picker allows only future dates
   - Adult count minimum is 1 (- button disabled at 1)
   - Children/infant counts start at 0
   - Price summary updates automatically:
     * Adults: 2 × $1,200 = $2,400
     * Children (70%): 1 × $840 = $840
     * Infants (50%): 1 × $600 = $600
     * Subtotal: $3,840
     * Tax (16%): $614.40
     * Total: $4,454.40
   - Next button enabled
8. Click "Next Step"

**Pass Criteria:** ✅ Proceeds to Step 2, price calculates correctly

---

### Test 3: Booking Form - Step 2 (Contact Information) ✅

**Objective:** Validate contact information collection

**Steps:**
1. Fill in the contact form:
   - Full Name: "John Doe"
   - Email: "john.doe@example.com"
   - Phone: "+254 725 442 618"
   - Nationality: "Kenyan"
   - Address: "123 Nairobi Street"
   - Emergency Contact Name: "Jane Doe"
   - Emergency Contact Phone: "+254 700 000 000"
2. Try clicking "Next Step" without filling all fields
3. **Expected Result:**
   - Validation errors appear for empty required fields
   - Form doesn't proceed until all fields are filled
4. Fill all required fields and click "Next Step"

**Pass Criteria:** ✅ Validation works, proceeds to Step 3 when valid

---

### Test 4: Booking Form - Step 3 (Payment Method) ✅

**Objective:** Validate payment method selection

**Steps:**
1. View available payment methods:
   - M-Pesa (with icon)
   - Credit/Debit Card (with icon)
   - Bank Transfer (with icon)
   - PayPal (with icon)
2. Select "M-Pesa"
3. Note the deposit information message
4. **Expected Result:**
   - Only one payment method can be selected at a time
   - Deposit message shows: "A 30% deposit is required..."
5. Click "Next Step"

**Pass Criteria:** ✅ Payment method selected, proceeds to Step 4

---

### Test 5: Booking Form - Step 4 (Review & Confirm) ✅

**Objective:** Validate booking review and submission

**Steps:**
1. Review all information displayed:
   - Tour Details (title, destination, date, duration, price)
   - Contact Information (all 7 fields)
   - Number of Travelers (adults, children, infants)
   - Payment Method (M-Pesa selected)
   - Total Amount ($4,454.40)
2. Try clicking "Confirm Booking" without accepting terms
3. **Expected Result:**
   - Alert: "Please accept the terms and conditions"
4. Check "I agree to the terms and conditions"
5. Click "Confirm Booking"
6. **Expected Result:**
   - Loading state on button ("Processing...")
   - Success message appears with booking reference (e.g., "DLX-ABC123")
   - Confirmation text: "Your booking has been confirmed!"
   - Email notification message shown

**Pass Criteria:** ✅ Booking created successfully, reference number displayed

---

### Test 6: Admin Dashboard - Access ✅

**Objective:** Verify admin dashboard loads correctly

**Steps:**
1. Open http://127.0.0.1:3000/admin/bookings.html
2. **Expected Result:**
   - Dashboard loads with sidebar navigation
   - 4 stats cards displayed:
     * Total Bookings
     * Pending
     * Confirmed
     * Total Revenue
   - Bookings table visible (may show sample data if backend not connected)
   - Filters section visible (Status, Payment Status, Search)
   - Pagination controls at bottom

**Pass Criteria:** ✅ Dashboard displays all UI elements correctly

---

### Test 7: Admin Dashboard - View Bookings ✅

**Objective:** Verify booking list displays correctly

**Steps:**
1. On admin dashboard, view the bookings table
2. **Expected Result:**
   - Table columns: Reference, Customer, Tour, Date, Travelers, Amount, Status, Payment, Actions
   - If backend connected: Shows real bookings
   - If backend not connected: Shows 3 sample bookings:
     * DLX-ABC123 - Masai Mara Safari - $6,264.00
     * DLX-XYZ456 - Maldives Beach Paradise - $2,956.80
     * DLX-PQR789 - Dubai Luxury Experience - $1,740.00
   - Status badges color-coded (Pending=yellow, Confirmed=blue, Completed=green, Cancelled=red)
   - Payment badges color-coded

**Pass Criteria:** ✅ Bookings display in table format with all details

---

### Test 8: Admin Dashboard - View Details ✅

**Objective:** Verify booking detail modal works

**Steps:**
1. Click "View" button (eye icon) on any booking
2. **Expected Result:**
   - Modal opens with detailed booking information
   - 6 sections displayed:
     * Booking Information (reference, status, payment status, created date)
     * Tour Details (title, destination, duration, date, price per person)
     * Customer Information (name, email, phone, nationality, address)
     * Number of Travelers (adults, children, infants)
     * Payment Information (method, subtotal, tax, total, deposit)
     * Special Requests (if any)
   - Action buttons at bottom:
     * Confirm Booking (green)
     * Mark as Completed (blue)
     * Cancel Booking (red)
3. Click "×" or outside modal to close
4. **Expected Result:**
   - Modal closes smoothly

**Pass Criteria:** ✅ Modal displays complete booking details

---

### Test 9: Admin Dashboard - Filter Bookings ✅

**Objective:** Verify filtering functionality

**Steps:**
1. **Filter by Status:**
   - Select "Pending" from Status dropdown
   - Click "Apply Filters"
   - **Expected:** Only pending bookings shown
   
2. **Filter by Payment Status:**
   - Select "Completed" from Payment dropdown
   - Click "Apply Filters"
   - **Expected:** Only bookings with completed payment shown
   
3. **Search Bookings:**
   - Enter booking reference (e.g., "DLX-ABC123") in search box
   - Click "Apply Filters"
   - **Expected:** Only matching booking shown
   
4. **Refresh:**
   - Click "Refresh" button
   - **Expected:** Filters reset, all bookings shown

**Pass Criteria:** ✅ Filters work correctly, search finds bookings

---

### Test 10: Admin Dashboard - Update Status ✅

**Objective:** Verify status update functionality

**Steps:**
1. Click "View" on a pending booking
2. Click "Confirm Booking" button
3. **Expected Result:**
   - Confirmation dialog: "Are you sure you want to confirm this booking?"
4. Click "OK"
5. **Expected Result:**
   - Success message: "Booking status updated successfully"
   - Modal closes
   - Booking status badge changes to "Confirmed" (blue)
   - Stats cards update (Pending -1, Confirmed +1)
6. Repeat with "Mark as Completed" and "Cancel Booking" buttons

**Pass Criteria:** ✅ Status updates correctly, UI reflects changes

---

### Test 11: Admin Dashboard - Delete Booking ✅

**Objective:** Verify booking deletion

**Steps:**
1. Click "Delete" button (trash icon) on any booking
2. **Expected Result:**
   - Confirmation dialog: "Are you sure you want to delete this booking?"
3. Click "Cancel"
4. **Expected Result:**
   - No action taken, booking remains
5. Click "Delete" again, then click "OK"
6. **Expected Result:**
   - Success message: "Booking deleted successfully"
   - Booking removed from table
   - Stats update accordingly

**Pass Criteria:** ✅ Deletion works with confirmation

---

### Test 12: Admin Dashboard - Pagination ✅

**Objective:** Verify pagination works correctly

**Steps:**
1. If more than 20 bookings exist:
   - View page numbers at bottom
   - Click "Next" button
   - **Expected:** Page 2 loads with next 20 bookings
   - Click "Previous" button
   - **Expected:** Returns to page 1
   - Click specific page number
   - **Expected:** Loads that page
2. If fewer than 20 bookings:
   - **Expected:** No pagination controls shown

**Pass Criteria:** ✅ Pagination navigates correctly

---

## 🔌 Backend API Testing (with Postman/Insomnia)

### Test API 1: Create Booking (POST)

**Endpoint:** `POST http://localhost:5000/api/bookings`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "tourDetails": {
    "title": "Maldives Beach Paradise",
    "destination": "Maldives",
    "duration": "7 Days / 6 Nights",
    "price": 1200,
    "category": "Beach Holiday"
  },
  "bookingDate": "2025-12-15",
  "contactInfo": {
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+254725442618",
    "nationality": "Kenyan",
    "address": "123 Nairobi Street",
    "emergencyContact": {
      "name": "Jane Doe",
      "phone": "+254700000000"
    }
  },
  "numberOfTravelers": {
    "adults": 2,
    "children": 1,
    "infants": 1
  },
  "payment": {
    "method": "m-pesa"
  },
  "specialRequests": "Vegetarian meals preferred"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking": {
      "_id": "...",
      "bookingReference": "DLX-ABC123",
      "status": "pending",
      "paymentStatus": "pending",
      "tourDetails": { ... },
      "contactInfo": { ... },
      "pricing": {
        "subtotal": 3840,
        "tax": 614.4,
        "total": 4454.4
      }
    }
  }
}
```

---

### Test API 2: Get All Bookings (GET)

**Endpoint:** `GET http://localhost:5000/api/bookings`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Query Parameters (optional):**
- `status=pending` (filter by status)
- `paymentStatus=completed` (filter by payment)
- `search=john` (search by name/email/phone)
- `page=1&limit=20` (pagination)

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "bookings": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalBookings": 45,
      "limit": 20
    },
    "stats": {
      "total": 45,
      "pending": 12,
      "confirmed": 18,
      "completed": 10,
      "cancelled": 5,
      "revenue": 125678.50
    }
  }
}
```

---

### Test API 3: Get Booking by Reference (GET)

**Endpoint:** `GET http://localhost:5000/api/bookings/reference/DLX-ABC123`

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "booking": {
      "bookingReference": "DLX-ABC123",
      "status": "confirmed",
      "tourDetails": { ... },
      "contactInfo": { ... },
      "pricing": { ... }
    }
  }
}
```

---

### Test API 4: Update Booking Status (PATCH)

**Endpoint:** `PATCH http://localhost:5000/api/bookings/:id/status`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "status": "confirmed"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Booking status updated successfully",
  "data": {
    "booking": { ... }
  }
}
```

---

### Test API 5: Delete Booking (DELETE)

**Endpoint:** `DELETE http://localhost:5000/api/bookings/:id`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Booking deleted successfully"
}
```

---

## 🐛 Troubleshooting

### Issue: Booking form doesn't load tour data
**Solution:** 
- Check URL contains `?tour=` parameter
- Verify localStorage has `selectedTour` data
- Check browser console for errors
- Ensure tour ID matches toursData in tour-detail.js

### Issue: Backend connection failed
**Solution:**
- Verify backend is running: `http://localhost:5000/`
- Check MongoDB is running
- Check `.env` file configuration
- View backend console for error messages

### Issue: Admin dashboard shows empty
**Solution:**
- Sample data should load automatically if backend fails
- Check browser console for errors
- Verify API_URL in admin-bookings.js: `http://localhost:5000/api`
- Test with sample data first (refreshes page to trigger loadSampleData)

### Issue: Price calculation wrong
**Solution:**
- Adults: 100% of tour price
- Children: 70% of tour price
- Infants: 50% of tour price
- Tax: 16% of subtotal
- Formula: (adults × price) + (children × 0.7 × price) + (infants × 0.5 × price) × 1.16

### Issue: Can't update booking status
**Solution:**
- Ensure JWT token is valid (admin authentication)
- Check authorization header format
- Verify user has admin role
- Test with sample data first (frontend-only)

---

## ✅ Test Results Checklist

After completing all tests, verify:

- [ ] Book Now button redirects to booking form
- [ ] Tour data displays in booking form sidebar
- [ ] Step 1: Date picker and traveler counters work
- [ ] Price calculation is accurate (adults, children, infants, tax)
- [ ] Step 2: Contact form validation works
- [ ] Step 3: Payment method selection works
- [ ] Step 4: Review displays all data correctly
- [ ] Booking submission creates booking with reference number
- [ ] Admin dashboard loads and displays stats
- [ ] Booking list displays in table format
- [ ] View details modal shows complete booking info
- [ ] Filter by status/payment works
- [ ] Search functionality works
- [ ] Status update buttons work (Confirm, Complete, Cancel)
- [ ] Delete booking works with confirmation
- [ ] Pagination works (if applicable)
- [ ] Backend API endpoints respond correctly

---

## 📊 Sample Test Data

### Sample Bookings for Testing:

**Booking 1:**
- Tour: Maldives Beach Paradise
- Adults: 2, Children: 1, Infants: 0
- Total: $2,956.80
- Payment: Credit Card
- Status: Pending

**Booking 2:**
- Tour: Dubai Luxury Experience
- Adults: 1, Children: 0, Infants: 0
- Total: $1,740.00
- Payment: M-Pesa
- Status: Confirmed

**Booking 3:**
- Tour: Masai Mara Safari
- Adults: 4, Children: 2, Infants: 1
- Total: $6,264.00
- Payment: Bank Transfer
- Status: Completed

---

## 🎓 Quick Test Script

Run this quick 5-minute test to verify basic functionality:

1. **Backend Check:** Open http://localhost:5000/ - Should see API welcome message
2. **Frontend Check:** Open http://127.0.0.1:3000 - Homepage loads
3. **Tour Detail:** Open any tour detail page, click "Book Now"
4. **Booking Flow:** Fill all 4 steps, submit booking
5. **Admin Dashboard:** Open /admin/bookings.html, view bookings table
6. **View Details:** Click "View" on any booking, modal opens
7. **Update Status:** Click "Confirm Booking" in modal

**All passed?** ✅ Booking system is working correctly!

---

## 📝 Notes

- **Sample Data:** Admin dashboard loads with 3 sample bookings if backend connection fails
- **Authentication:** Some endpoints require JWT token (admin routes)
- **Price Formula:** Includes 16% tax on all bookings
- **Reference Format:** Auto-generated as DLX-XXXXXX (6 random chars)
- **Deposit:** 30% deposit required, mentioned in payment step

---

## 🚀 Next Steps After Testing

1. **If all tests pass:**
   - Deploy backend to production (Render/Heroku)
   - Update API_URL in booking.js and admin-bookings.js
   - Test production deployment
   - Enable email notifications
   - Integrate payment gateways (M-Pesa API, Stripe)

2. **If tests fail:**
   - Check this troubleshooting guide
   - Review browser console errors
   - Check backend logs
   - Verify database connection
   - Contact support: info@deluxetour.co.ke

---

**Testing Guide Version:** 1.0  
**Last Updated:** December 2024  
**Author:** Deluxe Tour & Travel Development Team
