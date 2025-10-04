# 🔄 Booking System Architecture & Data Flow

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     DELUXE TOUR & TRAVEL                     │
│                      BOOKING SYSTEM                          │
└─────────────────────────────────────────────────────────────┘

┌───────────────┐         ┌───────────────┐         ┌──────────────┐
│   CUSTOMER    │         │     ADMIN     │         │   DATABASE   │
│   INTERFACE   │         │   DASHBOARD   │         │   MongoDB    │
└───────┬───────┘         └───────┬───────┘         └──────┬───────┘
        │                         │                        │
        │                         │                        │
        └─────────┬───────────────┘                        │
                  │                                        │
                  ▼                                        │
        ┌─────────────────┐                               │
        │   BACKEND API   │◄──────────────────────────────┘
        │  Express Server │
        │   Port: 5000    │
        └─────────────────┘
```

---

## Customer Booking Flow

```
START: User Browses Website
  │
  ├─► Homepage (index.html)
  │     │
  │     └─► Featured Tours Section
  │           │
  │           └─► "View Details" Button
  │                 │
  ▼                 ▼
Tours Page ──────► Tour Detail Page (tour-detail.html?tour=maldives-beach-paradise)
  │                   │
  │                   └─► Tour Information Displayed
  │                         - Title, Destination, Duration
  │                         - Price, Rating, Category
  │                         - Gallery, Itinerary, Highlights
  │                         │
  │                         ▼
  │                   [BOOK NOW BUTTON CLICKED]
  │                         │
  │                         ├─► bookNow() function
  │                         │     - Get tour ID from URL
  │                         │     - Validate tour exists
  │                         │     - Create tour data object
  │                         │     - Store in localStorage
  │                         │
  │                         ▼
  └─────────────────► Booking Form (booking.html?tour={json})
                            │
                            ├─► Load tour data from URL/localStorage
                            │     - Display in sidebar
                            │     - Show price breakdown
                            │
                            ▼
                      ┌─────────────────────┐
                      │   STEP 1: TOUR      │
                      │   Date Selection    │
                      │   Traveler Counts   │
                      │   (Adults/Children/ │
                      │    Infants)         │
                      │   Special Requests  │
                      └──────────┬──────────┘
                                 │
                                 ├─► updateCounter()
                                 ├─► updatePriceSummary()
                                 │     - Adults: count × price
                                 │     - Children: count × (price × 0.7)
                                 │     - Infants: count × (price × 0.5)
                                 │     - Subtotal + Tax (16%)
                                 │
                                 ├─► Validation: Date must be future
                                 │               Adults must be ≥ 1
                                 │
                                 ▼
                      ┌─────────────────────┐
                      │   STEP 2: CONTACT   │
                      │   Full Name         │
                      │   Email             │
                      │   Phone Number      │
                      │   Nationality       │
                      │   Address           │
                      │   Emergency Contact │
                      └──────────┬──────────┘
                                 │
                                 ├─► Validation: All fields required
                                 │               Email format check
                                 │               Phone format check
                                 │
                                 ▼
                      ┌─────────────────────┐
                      │   STEP 3: PAYMENT   │
                      │   Select Method:    │
                      │   □ M-Pesa          │
                      │   □ Credit Card     │
                      │   □ Bank Transfer   │
                      │   □ PayPal          │
                      │   Note: 30% deposit │
                      └──────────┬──────────┘
                                 │
                                 ├─► Validation: One method selected
                                 │
                                 ▼
                      ┌─────────────────────┐
                      │   STEP 4: REVIEW    │
                      │   Summary of All    │
                      │   Information       │
                      │   ☑ Accept Terms    │
                      │   [CONFIRM BOOKING] │
                      └──────────┬──────────┘
                                 │
                                 ├─► Validation: Terms accepted
                                 │
                                 ▼
                         [SUBMIT TO API]
                                 │
                                 ├─► POST /api/bookings
                                 │     Headers: Content-Type: application/json
                                 │     Body: {tourDetails, contactInfo, 
                                 │            numberOfTravelers, payment, 
                                 │            bookingDate, specialRequests}
                                 │
                                 ▼
                      ┌─────────────────────┐
                      │   BACKEND API       │
                      │   bookingController │
                      │   .createBooking()  │
                      └──────────┬──────────┘
                                 │
                                 ├─► Calculate pricing
                                 ├─► Generate reference (DLX-XXXXXX)
                                 ├─► Create guest user if needed
                                 ├─► Save to MongoDB
                                 │
                                 ▼
                      ┌─────────────────────┐
                      │   DATABASE          │
                      │   Booking Created   │
                      │   Status: pending   │
                      │   Payment: pending  │
                      └──────────┬──────────┘
                                 │
                                 ▼
                      ┌─────────────────────┐
                      │   SUCCESS SCREEN    │
                      │   Reference: DLX... │
                      │   "Booking          │
                      │    Confirmed!"      │
                      │   Email sent notice │
                      └─────────────────────┘
                                 │
                                 END: User receives reference number
```

---

## Admin Dashboard Flow

```
START: Admin Opens Dashboard
  │
  ▼
Admin Dashboard (admin/bookings.html)
  │
  ├─► Page Load
  │     │
  │     ├─► loadStats()
  │     │     └─► GET /api/bookings/stats/overview
  │     │           └─► Display: Total, Pending, Confirmed, Revenue
  │     │
  │     ├─► loadBookings(page=1)
  │     │     └─► GET /api/bookings?page=1&limit=20
  │     │           └─► Display: Bookings table with 20 rows
  │     │
  │     └─► If API fails → loadSampleData()
  │                          └─► Display 3 demo bookings
  │
  ▼
┌─────────────────────────────────────────────────────┐
│                  ADMIN DASHBOARD                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────┐│
│  │  TOTAL   │  │ PENDING  │  │CONFIRMED │  │ REV ││
│  │    45    │  │    12    │  │    18    │  │$125K││
│  └──────────┘  └──────────┘  └──────────┘  └─────┘│
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ FILTERS                                       │  │
│  │ Status: [All ▼]  Payment: [All ▼]           │  │
│  │ Search: [________________]  [Apply Filters]  │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ BOOKINGS TABLE                                │  │
│  ├──────┬─────────┬──────┬──────┬────┬────┬────┤  │
│  │ REF  │CUSTOMER │ TOUR │ DATE │ T  │ $  │ACT │  │
│  ├──────┼─────────┼──────┼──────┼────┼────┼────┤  │
│  │DLX-  │John     │Maldi-│12/15 │ 3  │$3K │👁️ │  │
│  │ABC123│Smith    │ves   │      │    │    │🗑️ │  │
│  ├──────┼─────────┼──────┼──────┼────┼────┼────┤  │
│  │DLX-  │Sarah    │Dubai │12/20 │ 2  │$2K │👁️ │  │
│  │XYZ456│Johnson  │      │      │    │    │🗑️ │  │
│  └──────┴─────────┴──────┴──────┴────┴────┴────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ PAGINATION: ◄ 1 2 3 ... 10 ►                 │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
  │
  ├─► [VIEW BUTTON CLICKED] (👁️)
  │     │
  │     ├─► viewBooking(id)
  │     │     └─► GET /api/bookings/:id
  │     │           │
  │     │           ▼
  │     │    ┌─────────────────────────────┐
  │     │    │   BOOKING DETAIL MODAL      │
  │     │    ├─────────────────────────────┤
  │     │    │ Reference: DLX-ABC123       │
  │     │    │ Status: Pending             │
  │     │    │ ─────────────────────────── │
  │     │    │ Tour: Maldives Beach        │
  │     │    │ Destination: Maldives       │
  │     │    │ Date: 2025-12-15            │
  │     │    │ Duration: 7D/6N             │
  │     │    │ ─────────────────────────── │
  │     │    │ Customer: John Smith        │
  │     │    │ Email: john@example.com     │
  │     │    │ Phone: +254725442618        │
  │     │    │ ─────────────────────────── │
  │     │    │ Travelers:                  │
  │     │    │   Adults: 2                 │
  │     │    │   Children: 1               │
  │     │    │ ─────────────────────────── │
  │     │    │ Payment: M-Pesa             │
  │     │    │ Total: $3,758.40            │
  │     │    │ ─────────────────────────── │
  │     │    │ [✅ Confirm] [✓ Complete]  │
  │     │    │ [❌ Cancel]                 │
  │     │    └─────────────────────────────┘
  │     │
  │     └─► [CONFIRM BUTTON CLICKED]
  │           │
  │           ├─► Confirmation: "Are you sure?"
  │           │     └─► User clicks OK
  │           │
  │           ├─► updateBookingStatus(id, 'confirmed')
  │           │     └─► PATCH /api/bookings/:id/status
  │           │           Body: {status: 'confirmed'}
  │           │
  │           ▼
  │        ┌──────────────────┐
  │        │   DATABASE       │
  │        │   Status updated │
  │        │   pending →      │
  │        │   confirmed      │
  │        └────────┬─────────┘
  │                 │
  │                 ▼
  │        ┌──────────────────┐
  │        │   UI UPDATES     │
  │        │   - Modal closes │
  │        │   - Table badge  │
  │        │     changes color│
  │        │   - Stats refresh│
  │        └──────────────────┘
  │
  ├─► [DELETE BUTTON CLICKED] (🗑️)
  │     │
  │     ├─► Confirmation: "Are you sure you want to delete?"
  │     │     └─► User clicks OK
  │     │
  │     ├─► deleteBooking(id)
  │     │     └─► DELETE /api/bookings/:id
  │     │
  │     ▼
  │  ┌──────────────────┐
  │  │   DATABASE       │
  │  │   Booking removed│
  │  └────────┬─────────┘
  │           │
  │           ▼
  │  ┌──────────────────┐
  │  │   UI UPDATES     │
  │  │   - Row removed  │
  │  │   - Stats refresh│
  │  │   - Success msg  │
  │  └──────────────────┘
  │
  ├─► [FILTER APPLIED]
  │     │
  │     ├─► Get filter values
  │     │     - Status: "pending"
  │     │     - Payment: "completed"
  │     │     - Search: "john"
  │     │
  │     ├─► loadBookings(1, filters)
  │     │     └─► GET /api/bookings?status=pending&search=john
  │     │
  │     ▼
  │  ┌──────────────────┐
  │  │   FILTERED DATA  │
  │  │   Only matching  │
  │  │   bookings shown │
  │  └──────────────────┘
  │
  └─► [REFRESH CLICKED]
        │
        ├─► Clear all filters
        ├─► loadStats()
        ├─► loadBookings(1)
        │
        ▼
     ┌──────────────────┐
     │   FRESH DATA     │
     │   All bookings   │
     │   displayed      │
     └──────────────────┘
        │
        END: Admin manages bookings
```

---

## Backend API Architecture

```
CLIENT REQUEST
    │
    ▼
┌─────────────────────────────────────────┐
│   Express Server (server.js)            │
│   Port: 5000                             │
├─────────────────────────────────────────┤
│   Middleware Stack:                      │
│   1. Helmet (Security Headers)           │
│   2. CORS (Cross-Origin)                 │
│   3. Body Parser (JSON)                  │
│   4. Morgan (Logging)                    │
│   5. Rate Limiter (100 req/15min)        │
└──────────────┬──────────────────────────┘
               │
               ▼
     ┌─────────────────┐
     │   ROUTES        │
     │  /api/bookings  │
     └────────┬────────┘
              │
              ├─► POST /bookings
              │     │
              │     ├─► Validation Middleware
              │     │     └─► Check required fields
              │     │
              │     ├─► bookingController.createBooking()
              │     │     │
              │     │     ├─► Extract data from req.body
              │     │     ├─► Calculate pricing
              │     │     │     - Adults: count × price
              │     │     │     - Children: count × price × 0.7
              │     │     │     - Infants: count × price × 0.5
              │     │     │     - Tax: subtotal × 0.16
              │     │     │
              │     │     ├─► Generate reference (DLX-XXXXXX)
              │     │     ├─► Create guest user if no auth
              │     │     ├─► Create Booking document
              │     │     │
              │     │     └─► Save to MongoDB
              │     │           │
              │     │           ▼
              │     │      ┌───────────────┐
              │     │      │   MongoDB     │
              │     │      │   Bookings    │
              │     │      │   Collection  │
              │     │      └───────────────┘
              │     │
              │     └─► Response: 201 Created
              │           {success: true, booking: {...}}
              │
              ├─► GET /bookings
              │     │
              │     ├─► Authentication Middleware
              │     │     └─► Verify JWT token
              │     │
              │     ├─► Admin Check Middleware
              │     │     └─► Verify admin role
              │     │
              │     ├─► bookingController.getAllBookings()
              │     │     │
              │     │     ├─► Parse query params
              │     │     │     - status
              │     │     │     - paymentStatus
              │     │     │     - search
              │     │     │     - page, limit
              │     │     │
              │     │     ├─► Build MongoDB query
              │     │     ├─► Execute with pagination
              │     │     ├─► Calculate stats
              │     │     │
              │     │     └─► Return filtered bookings
              │     │
              │     └─► Response: 200 OK
              │           {success: true, data: {bookings, stats}}
              │
              ├─► GET /bookings/:id
              │     │
              │     ├─► Authentication Middleware
              │     ├─► bookingController.getBooking()
              │     │     │
              │     │     ├─► Find by ID
              │     │     ├─► Populate tour and user
              │     │     │
              │     │     └─► Return booking
              │     │
              │     └─► Response: 200 OK
              │
              ├─► GET /bookings/reference/:ref
              │     │
              │     ├─► bookingController.getBookingByReference()
              │     │     │
              │     │     ├─► Find by reference
              │     │     │
              │     │     └─► Return booking (public data only)
              │     │
              │     └─► Response: 200 OK
              │
              ├─► GET /bookings/stats/overview
              │     │
              │     ├─► Authentication + Admin Middleware
              │     ├─► bookingController.getBookingStats()
              │     │     │
              │     │     ├─► Aggregate pipeline
              │     │     │     - Count by status
              │     │     │     - Sum revenue
              │     │     │
              │     │     └─► Return statistics
              │     │
              │     └─► Response: 200 OK
              │
              ├─► PATCH /bookings/:id/status
              │     │
              │     ├─► Authentication + Admin Middleware
              │     ├─► Validation Middleware
              │     ├─► bookingController.updateBookingStatus()
              │     │     │
              │     │     ├─► Find booking by ID
              │     │     ├─► Update status field
              │     │     ├─► Add to history
              │     │     │
              │     │     └─► Save changes
              │     │
              │     └─► Response: 200 OK
              │
              └─► DELETE /bookings/:id
                    │
                    ├─► Authentication + Admin Middleware
                    ├─► bookingController.deleteBooking()
                    │     │
                    │     ├─► Find booking by ID
                    │     ├─► Remove from database
                    │     │
                    │     └─► Confirm deletion
                    │
                    └─► Response: 200 OK
```

---

## Database Schema

```
┌─────────────────────────────────────────────────────────┐
│                    Booking Collection                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  _id: ObjectId                (Auto-generated)          │
│  bookingReference: String     (DLX-XXXXXX)              │
│                                                          │
│  tour: ObjectId               (Optional ref to Tour)    │
│  tourDetails: {               (Embedded document)       │
│    title: String                                        │
│    destination: String                                  │
│    duration: String                                     │
│    price: Number                                        │
│    category: String                                     │
│  }                                                       │
│                                                          │
│  user: ObjectId               (Optional ref to User)    │
│                                                          │
│  contactInfo: {               (Embedded document)       │
│    fullName: String                                     │
│    email: String                                        │
│    phone: String                                        │
│    nationality: String                                  │
│    address: String                                      │
│    emergencyContact: {                                  │
│      name: String                                       │
│      phone: String                                      │
│    }                                                     │
│  }                                                       │
│                                                          │
│  bookingDate: Date            (Tour departure date)     │
│                                                          │
│  numberOfTravelers: {         (Embedded document)       │
│    adults: Number             (Min: 1)                  │
│    children: Number           (Min: 0)                  │
│    infants: Number            (Min: 0)                  │
│  }                                                       │
│                                                          │
│  pricing: {                   (Embedded document)       │
│    subtotal: Number           (Before tax)              │
│    tax: Number                (16% of subtotal)         │
│    total: Number              (subtotal + tax)          │
│    deposit: Number            (30% of total)            │
│  }                                                       │
│                                                          │
│  payment: {                   (Embedded document)       │
│    method: String             (m-pesa/card/bank/paypal) │
│    status: String             (pending/completed/failed)│
│    transactionId: String      (Optional)                │
│    paidAmount: Number         (Optional)                │
│    paidAt: Date               (Optional)                │
│  }                                                       │
│                                                          │
│  status: String               (pending/confirmed/       │
│                                completed/cancelled)      │
│                                                          │
│  specialRequests: String      (Optional notes)          │
│                                                          │
│  notes: [                     (Admin notes array)       │
│    {                                                     │
│      note: String                                       │
│      addedBy: ObjectId                                  │
│      createdAt: Date                                    │
│    }                                                     │
│  ]                                                       │
│                                                          │
│  createdAt: Date              (Auto timestamp)          │
│  updatedAt: Date              (Auto timestamp)          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## File Structure & Relationships

```
PROJECT ROOT
│
├── backend/
│   ├── server.js ────────────────┐
│   │                              │
│   └── src/                       │
│       ├── config/                │
│       │   └── database.js        │ MongoDB Connection
│       │                          │
│       ├── models/                │
│       │   └── Booking.js ────────┤ Schema Definition
│       │                          │
│       ├── controllers/           │
│       │   └── bookingControllerNew.js ─┤ Business Logic
│       │                          │      │
│       ├── routes/                │      │
│       │   └── bookingRoutesNew.js ──────┤ API Endpoints
│       │                          │      │
│       └── middleware/            │      │
│           ├── auth.js ───────────┤      │ JWT Verification
│           └── validator.js ──────┘      │ Input Validation
│                                         │
├── frontend/                             │
│   ├── pages/                            │
│   │   ├── tour-detail.html             │
│   │   ├── booking.html ────────────────┤
│   │   └── admin/                       │
│   │       └── bookings.html ───────────┤
│   │                                    │
│   └── js/                              │
│       ├── tour-detail.js               │
│       │   └── bookNow() ───────────────┤ Redirect to booking
│       │                                │
│       ├── booking.js ───────────────────┤ Form logic + API calls
│       │   ├── loadTourDetails()        │
│       │   ├── updatePriceSummary()     │
│       │   ├── validateStep()           │
│       │   └── handleSubmit() ──────────┤─┐
│       │                                │ │
│       └── admin-bookings.js ────────────┤ │ Admin CRUD + API calls
│           ├── loadBookings()           │ │
│           ├── viewBooking()            │ │
│           ├── updateBookingStatus()    │ │
│           └── deleteBooking() ─────────┤─┤
│                                        │ │
└── Documentation/                       │ │
    ├── BOOKING-SYSTEM-TESTING-GUIDE.md │ │
    ├── BOOKING-QUICK-START.md          │ │
    ├── BOOKING-SYSTEM-COMPLETE-SUMMARY.md
    ├── BOOKING-QUICK-REFERENCE.md      │ │
    └── BOOKING-IMPLEMENTATION-CHECKLIST.md
                                         │ │
                          ┌──────────────┘ │
                          │                │
                          ▼                ▼
                    ┌─────────────────────────────┐
                    │     BACKEND API SERVER      │
                    │     http://localhost:5000   │
                    │     /api/bookings/*         │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │   MongoDB       │
                          │   Database      │
                          │   Bookings      │
                          │   Collection    │
                          └─────────────────┘
```

---

## Component Communication

```
┌──────────────────────────────────────────────────────────┐
│                  COMPONENT INTERACTIONS                   │
└──────────────────────────────────────────────────────────┘

1. Tour Selection Flow:
   tour-detail.js → booking.js → backend API → MongoDB
   
2. Booking Creation Flow:
   booking.js → POST /api/bookings → bookingController → MongoDB
   
3. Admin View Flow:
   admin-bookings.js → GET /api/bookings → bookingController → MongoDB
   
4. Status Update Flow:
   admin-bookings.js → PATCH /api/bookings/:id/status → 
   bookingController → MongoDB → Response → UI Update

5. Data Validation:
   Client (booking.js) → Server (validator.js) → Controller
   ├─► Both client and server validate
   └─► Server is the source of truth

6. Authentication Flow:
   Client sends JWT → auth.js middleware → Verify token → 
   Allow/Deny request

7. Error Handling:
   Error occurs → Controller catches → Sends error response → 
   Client displays user-friendly message

8. Sample Data Flow (No Backend):
   Admin dashboard loads → API fails → loadSampleData() → 
   Display 3 demo bookings
```

---

## Key Integration Points

### 1. Tour Detail → Booking Form
**File:** `tour-detail.js`  
**Function:** `bookNow()`  
**Method:** URL parameter + localStorage  
**Data:** `{id, title, category, destination, duration, price, image, rating}`

### 2. Booking Form → Backend API
**File:** `booking.js`  
**Function:** `handleSubmit()`  
**Endpoint:** `POST /api/bookings`  
**Data:** Complete booking object with all form data

### 3. Backend API → Database
**File:** `bookingControllerNew.js`  
**Function:** `createBooking()`  
**Method:** Mongoose model save  
**Data:** Validated and calculated booking document

### 4. Admin Dashboard → Backend API
**File:** `admin-bookings.js`  
**Functions:** Multiple (load, view, update, delete)  
**Endpoints:** Various GET/PATCH/DELETE requests  
**Data:** Booking queries, updates, deletions

### 5. Backend API → Admin Dashboard
**File:** `bookingControllerNew.js`  
**Functions:** Various controller methods  
**Method:** JSON responses  
**Data:** Bookings array, statistics, single booking

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND                             │
├─────────────────────────────────────────────────────────┤
│  • HTML5 (Semantic markup)                              │
│  • CSS3 (Responsive design, animations)                 │
│  • Vanilla JavaScript (No frameworks)                   │
│  • Font Awesome (Icons)                                 │
│  • http-server (Development server)                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                     BACKEND                              │
├─────────────────────────────────────────────────────────┤
│  • Node.js (Runtime)                                     │
│  • Express.js (Web framework)                           │
│  • Mongoose (MongoDB ODM)                               │
│  • JWT (JSON Web Tokens for auth)                       │
│  • bcrypt (Password hashing)                            │
│  • express-validator (Input validation)                 │
│  • helmet (Security headers)                            │
│  • cors (Cross-origin requests)                         │
│  • morgan (HTTP logging)                                │
│  • express-rate-limit (API rate limiting)               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                     DATABASE                             │
├─────────────────────────────────────────────────────────┤
│  • MongoDB (NoSQL document database)                    │
│  • Mongoose Schemas (Data modeling)                     │
│  • Indexes (Performance optimization)                   │
└─────────────────────────────────────────────────────────┘
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                       │
└─────────────────────────────────────────────────────────┘

Layer 1: Network Security
  ├─► HTTPS (SSL/TLS encryption)
  ├─► CORS (Controlled origins)
  └─► Rate Limiting (100 req/15min)

Layer 2: Authentication
  ├─► JWT Tokens (Signed, expiring)
  ├─► Password Hashing (bcrypt)
  └─► Token Verification (middleware)

Layer 3: Authorization
  ├─► Role-Based Access Control
  ├─► Admin-only routes
  └─► User-owned resource checks

Layer 4: Input Validation
  ├─► Client-side validation (booking.js)
  ├─► Server-side validation (validator.js)
  ├─► Express-validator sanitization
  └─► Mongoose schema validation

Layer 5: Data Protection
  ├─► SQL Injection Prevention (Mongoose)
  ├─► XSS Protection (helmet)
  ├─► CSRF Protection (SameSite cookies)
  └─► Data Encryption (MongoDB encryption)

Layer 6: Error Handling
  ├─► User-friendly error messages
  ├─► No sensitive data in errors
  ├─► Proper error logging
  └─► Graceful degradation
```

---

**Architecture Document Version:** 1.0  
**Created:** December 2024  
**For:** Deluxe Tour & Travel Booking System
