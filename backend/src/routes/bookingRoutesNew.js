const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const { protect, authorize } = require('../middleware/auth');

// Import both controllers
const oldController = require('../controllers/bookingController');
const {
    createBooking,
    getAllBookings,
    getBooking,
    getBookingByReference,
    updateBookingStatus,
    updatePaymentStatus,
    addBookingNote,
    deleteBooking,
    getBookingStats
} = require('../controllers/bookingControllerNew');

// Validation rules
const bookingValidation = [
    body('bookingDate').notEmpty().withMessage('Booking date is required'),
    body('numberOfTravelers.adults').isInt({ min: 1 }).withMessage('At least 1 adult required'),
    body('contactInfo.name').notEmpty().withMessage('Contact name is required'),
    body('contactInfo.email').isEmail().withMessage('Valid email is required'),
    body('contactInfo.phone').notEmpty().withMessage('Phone number is required')
];

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

// Create booking (Guest or User)
router.post('/', bookingValidation, validate, createBooking);

// Get booking by reference number (for guests to check status)
router.get('/reference/:ref', getBookingByReference);

// Check tour availability (from old controller)
router.post('/check-availability', oldController.checkAvailability);

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================

// Get single booking by ID
router.get('/:id', protect, getBooking);

// Get user's own bookings (from old controller)
router.get('/my/bookings', protect, oldController.getUserBookings);

// Cancel booking (from old controller)
router.put('/:id/cancel', protect, oldController.cancelBooking);

// Process payment (from old controller)
router.post('/:id/payment', protect, oldController.processPayment);

// ============================================
// ADMIN ROUTES (Admin only)
// ============================================

// Get all bookings with filters
router.get('/', protect, authorize('admin'), getAllBookings);

// Get booking statistics
router.get('/stats/overview', protect, authorize('admin'), getBookingStats);

// Get detailed analytics (from old controller)
router.get('/stats/analytics', protect, authorize('admin'), oldController.getBookingStats);

// Update booking status
router.patch('/:id/status', protect, authorize('admin'), updateBookingStatus);

// Update payment status
router.patch('/:id/payment', protect, authorize('admin'), updatePaymentStatus);

// Add note to booking
router.post('/:id/notes', protect, authorize('admin'), addBookingNote);

// Delete booking
router.delete('/:id', protect, authorize('admin'), deleteBooking);

module.exports = router;
