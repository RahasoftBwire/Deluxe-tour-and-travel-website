# 🚀 Authentication & Payment Integration - Implementation Guide

## ✅ What's Been Implemented

### 1. User Registration & Login System ✅
- **Registration Page**: `frontend/pages/register.html`
- **Login Page**: `frontend/pages/login.html` (already existed)
- **Backend Auth**: `backend/src/controllers/authController.js` (fully functional)
- **User Model**: `backend/src/models/User.js` (with password hashing)

**Features:**
- ✅ User registration with validation
- ✅ Password strength indicator
- ✅ Email validation
- ✅ Secure password hashing (bcrypt)
- ✅ JWT token authentication
- ✅ Role-based access (customer/admin)
- ✅ Auto-redirect based on user role

---

### 2. M-Pesa Payment Integration ✅
**File**: `backend/src/services/mpesaService.js`

**Features:**
- ✅ STK Push implementation
- ✅ Payment callback handler
- ✅ Transaction status query
- ✅ Automatic booking update on payment success
- ✅ Phone number validation and formatting

**Key Functions:**
```javascript
// Initiate payment
mpesaService.initiateSTKPush({ phone, amount, accountReference })

// Handle callback
mpesaService.handleCallback(callbackData)

// Query status
mpesaService.queryTransaction(checkoutRequestID)

// Process booking payment
mpesaService.processBookingPayment(bookingId, phoneNumber)
```

---

### 3. Stripe Payment Integration ✅
**File**: `backend/src/services/stripeService.js`

**Features:**
- ✅ Payment Intent API (custom checkout)
- ✅ Checkout Session API (hosted checkout)
- ✅ Webhook handling
- ✅ Automatic booking update
- ✅ Refund support

**Key Functions:**
```javascript
// Create payment intent
stripeService.createPaymentIntent({ bookingId, amount, currency })

// Create checkout session
stripeService.createCheckoutSession({ bookingId, amount, currency })

// Handle webhooks
stripeService.handleWebhook(rawBody, signature)

// Create refund
stripeService.createRefund(paymentIntentId, amount)
```

---

### 4. Payment Routes ✅
**File**: `backend/src/routes/paymentRoutes.js`

**Endpoints:**

#### M-Pesa:
- `POST /api/payments/mpesa/initiate` - Start STK Push
- `POST /api/payments/mpesa/callback` - Receive payment confirmation
- `POST /api/payments/mpesa/query` - Check payment status

#### Stripe:
- `POST /api/payments/stripe/create-payment-intent` - Create payment intent
- `POST /api/payments/stripe/create-checkout-session` - Create checkout session
- `POST /api/payments/stripe/webhook` - Receive payment events
- `GET /api/payments/stripe/status/:paymentIntentId` - Get payment status
- `POST /api/payments/stripe/refund` - Create refund (Admin only)

#### Config:
- `GET /api/payments/config` - Get Stripe publishable key

---

## 📋 Setup Instructions

### Step 1: Install Dependencies

```powershell
cd backend
npm install
```

**New dependencies installed:**
- `axios` - For M-Pesa API calls
- `stripe` - Already installed

---

### Step 2: Configure Environment Variables

Create/update `backend/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/deluxe_tour_travel

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d

# M-Pesa Configuration (Sandbox)
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://yourdomain.com/api/payments/mpesa/callback
MPESA_ENV=sandbox

# Stripe Configuration (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

---

### Step 3: Get M-Pesa API Credentials

1. **Register at Safaricom Daraja Portal**
   - Visit: https://developer.safaricom.co.ke/
   - Click "Sign Up" and create account
   - Verify your email

2. **Create an App**
   - Go to "My Apps" > "Add a New App"
   - Select "Lipa Na M-Pesa Online" product
   - Note down:
     - Consumer Key
     - Consumer Secret

3. **Get Test Credentials (Sandbox)**
   - Business Short Code: `174379`
   - Passkey: Available in "Test Credentials" section
   - Test Phone: `254708374149`

4. **Update .env file** with your credentials

---

### Step 4: Get Stripe API Credentials

1. **Create Stripe Account**
   - Visit: https://stripe.com/
   - Click "Sign Up"
   - Complete registration

2. **Get API Keys**
   - Go to Dashboard > Developers > API keys
   - Toggle "Test mode" ON
   - Copy:
     - Publishable key (starts with `pk_test_`)
     - Secret key (starts with `sk_test_`)

3. **Set Up Webhooks** (for production)
   - Go to Developers > Webhooks
   - Click "Add endpoint"
   - URL: `https://yourdomain.com/api/payments/stripe/webhook`
   - Events to listen:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `checkout.session.completed`
   - Copy webhook signing secret

4. **Update .env file** with your keys

---

### Step 5: Start MongoDB

```powershell
# Make sure MongoDB is running
# If installed as service, it should auto-start
# To start manually:
mongod
```

---

### Step 6: Start Backend Server

```powershell
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

You should see:
```
🚀 Server running on port 5000
📍 Environment: development
✅ MongoDB Connected Successfully
```

---

### Step 7: Start Frontend Server

```powershell
cd frontend
python -m http.server 3000 --bind 127.0.0.1
```

---

## 🧪 Testing the Complete Flow

### Test 1: User Registration

1. Open browser: `http://127.0.0.1:3000/pages/register.html`
2. Fill in the form:
   - Name: John Doe
   - Email: john@example.com
   - Phone: +254712345678
   - Password: Test123!
3. Click "Create Account"
4. Should redirect to homepage with user logged in

**Check:**
- Open browser console (F12)
- Go to Application > Local Storage
- Verify `token` and `user` are stored

---

### Test 2: User Login

1. Open browser: `http://127.0.0.1:3000/pages/login.html`
2. Enter credentials:
   - Email: john@example.com
   - Password: Test123!
3. Click "Sign In"
4. Should redirect to homepage

**Check:**
- Token should be stored in localStorage
- User should be logged in

---

### Test 3: Browse Tours & Create Booking

1. Go to: `http://127.0.0.1:3000/pages/tours.html`
2. Click on any tour
3. Fill booking form:
   - Select date
   - Number of travelers
   - Contact information
4. Click "Proceed to Payment"
5. Booking should be created

**Check:**
- Note the booking ID or reference number
- Booking should be in "pending" status

---

### Test 4: M-Pesa Payment (Sandbox)

**Using Postman/Thunder Client:**

```javascript
POST http://localhost:5000/api/payments/mpesa/initiate

Headers:
Content-Type: application/json

Body:
{
  "bookingId": "your_booking_id",
  "phoneNumber": "254708374149"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Payment initiated. Please check your phone...",
  "data": {
    "checkoutRequestID": "ws_CO_12345...",
    "bookingReference": "BK-ABC123"
  }
}
```

**In Sandbox:**
- You'll see a simulated STK Push
- Use PIN: `1234` (sandbox test PIN)

---

### Test 5: Stripe Payment (Test Mode)

**Using Postman:**

```javascript
POST http://localhost:5000/api/payments/stripe/create-payment-intent

Headers:
Content-Type: application/json

Body:
{
  "bookingId": "your_booking_id",
  "currency": "usd"
}
```

**Expected Response:**
```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx",
  "bookingReference": "BK-ABC123"
}
```

**Test Cards:**
- Success: `4242 4242 4242 4242`
- 3D Secure: `4000 0025 0000 3155`
- Decline: `4000 0000 0000 0002`
- Expiry: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)

---

### Test 6: Admin Dashboard - View Bookings

1. **Create Admin User** (via MongoDB or registration with manual role update):
   ```javascript
   // In MongoDB Compass or CLI:
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

2. **Login as Admin**:
   - Go to: `http://127.0.0.1:3000/pages/login.html`
   - Email: admin@example.com
   - Password: your_password

3. **View Bookings**:
   - Should redirect to: `http://127.0.0.1:3000/admin/bookings.html`
   - Should see all bookings with:
     - Tour details
     - Customer information
     - Payment status
     - Booking dates

**Check:**
- All bookings should be visible
- Payment status should show "Pending", "Completed", or "Failed"
- Filter by status should work

---

## 🔧 Frontend Integration (Next Steps)

### Update booking.js to Add Payment Options

The frontend booking flow needs to be updated to include payment selection. Here's what needs to be added to `frontend/js/booking.js`:

```javascript
// After booking is created, show payment options
function showPaymentOptions(bookingId, totalPrice) {
    // Display payment method selection
    // Option 1: M-Pesa
    // Option 2: Credit Card (Stripe)
}

// M-Pesa Payment
async function payWithMpesa(bookingId, phoneNumber) {
    const response = await fetch(`${API_URL}/payments/mpesa/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, phoneNumber })
    });
    
    const data = await response.json();
    
    if (data.success) {
        // Show "Check your phone" message
        // Poll for payment status
        pollPaymentStatus(data.data.checkoutRequestID);
    }
}

// Stripe Payment
async function payWithStripe(bookingId) {
    // Get Stripe publishable key
    const configResponse = await fetch(`${API_URL}/payments/config`);
    const config = await configResponse.json();
    
    // Initialize Stripe
    const stripe = Stripe(config.stripePublishableKey);
    
    // Create checkout session
    const response = await fetch(`${API_URL}/payments/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, currency: 'usd' })
    });
    
    const session = await response.json();
    
    if (session.success) {
        // Redirect to Stripe Checkout
        window.location.href = session.sessionUrl;
    }
}
```

---

## 📊 Database Schema Updates

The Booking model already supports payment information:

```javascript
payment: {
    method: String,          // 'mpesa', 'stripe', 'pending'
    status: String,          // 'pending', 'processing', 'completed', 'failed'
    transactionId: String,   // CheckoutRequestID (M-Pesa) or PaymentIntentID (Stripe)
    paidAt: Date,
    mpesaReceiptNumber: String,
    stripePaymentId: String,
    amount: Number
}
```

---

## 🔒 Security Considerations

### Current Implementation:
✅ Password hashing with bcrypt
✅ JWT token authentication
✅ CORS protection
✅ Rate limiting
✅ Helmet security headers
✅ Input validation

### Recommended for Production:
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Use environment-specific configs
- [ ] Implement request signing for M-Pesa
- [ ] Add webhook signature verification
- [ ] Set up proper logging
- [ ] Add error monitoring (Sentry)

---

## 🐛 Troubleshooting

### Issue: "MongoDB Connection Error"
**Solution**: Start MongoDB service
```powershell
mongod
```

### Issue: "M-Pesa Authentication Failed"
**Solution**: 
- Check MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET
- Verify you're using sandbox credentials
- Check if API keys are correct

### Issue: "Stripe Error: No such payment_intent"
**Solution**:
- Verify STRIPE_SECRET_KEY is correct
- Make sure you're in Test Mode
- Check if booking exists

### Issue: "CORS Error"
**Solution**: Update `backend/server.js`:
```javascript
app.use(cors({
    origin: 'http://127.0.0.1:3000',
    credentials: true
}));
```

### Issue: "Token Expired"
**Solution**: Login again to get new token

---

## 📱 M-Pesa Test Flow (Sandbox)

1. Use test phone: `254708374149`
2. Use test shortcode: `174379`
3. STK Push will be simulated
4. Use PIN: `1234`
5. Payment completes automatically in sandbox

**Note**: Real M-Pesa testing requires:
- Registered business
- Live credentials
- Real phone number
- Real M-Pesa account

---

## 💳 Stripe Test Flow

### Test Cards:

| Scenario | Card Number | Result |
|----------|-------------|--------|
| Success | 4242 4242 4242 4242 | Payment succeeds |
| 3D Secure | 4000 0025 0000 3155 | Requires auth |
| Decline | 4000 0000 0000 0002 | Declined |
| Insufficient Funds | 4000 0000 0000 9995 | Insufficient funds |

All test cards:
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+254712345678",
  "password": "Test123!"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

#### Login User
```
POST /api/auth/login

Body:
{
  "email": "john@example.com",
  "password": "Test123!"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": { ... }
}
```

### Payment Endpoints

#### Initiate M-Pesa Payment
```
POST /api/payments/mpesa/initiate

Body:
{
  "bookingId": "booking_id",
  "phoneNumber": "254712345678"
}

Response:
{
  "success": true,
  "message": "Payment initiated...",
  "data": {
    "checkoutRequestID": "ws_CO_...",
    "bookingReference": "BK-ABC123"
  }
}
```

#### Create Stripe Payment Intent
```
POST /api/payments/stripe/create-payment-intent

Body:
{
  "bookingId": "booking_id",
  "currency": "usd"
}

Response:
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx",
  "bookingReference": "BK-ABC123"
}
```

---

## ✅ Checklist

- [x] Registration page created
- [x] Login page functional
- [x] User authentication working
- [x] M-Pesa service implemented
- [x] Stripe service implemented
- [x] Payment routes created
- [x] Server updated with payment routes
- [x] Dependencies installed
- [ ] Environment variables configured
- [ ] Frontend payment UI created
- [ ] Admin dashboard verified
- [ ] End-to-end testing complete

---

## 🎯 Next Steps

1. **Configure .env file** with your actual API keys
2. **Create payment UI** in booking page
3. **Add Stripe.js** to frontend
4. **Test complete flow** from registration to payment
5. **Update admin dashboard** token handling
6. **Add email notifications** (future enhancement)
7. **Deploy to production**

---

## 📞 Support

If you encounter issues:
1. Check server logs in terminal
2. Check browser console (F12)
3. Verify MongoDB is running
4. Verify API keys are correct
5. Check network tab for API responses

---

**Created**: December 2024
**Status**: ✅ Backend Complete | ⏳ Frontend Payment UI Pending
**Priority**: Complete payment UI and test end-to-end flow
