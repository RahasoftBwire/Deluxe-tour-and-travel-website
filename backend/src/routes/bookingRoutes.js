const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    checkAvailability,
    createBooking,
    getAllBookings,
    getUserBookings,
    getBooking,
    updateBookingStatus,
    cancelBooking,
    processPayment,
    getBookingStats
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

// Validation rules
const bookingValidation = [
    body('tour').notEmpty().withMessage('Tour ID is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('numberOfPeople').isInt({ min: 1 }).withMessage('Number of people must be at least 1'),
    body('contactInfo.email').isEmail().withMessage('Valid email is required'),
    body('contactInfo.phone').notEmpty().withMessage('Phone number is required')
];

// Public routes
router.post('/check-availability', checkAvailability);

// Protected routes (authenticated users)
router.post('/', protect, bookingValidation, validate, createBooking);
router.get('/my-bookings', protect, getUserBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);
router.post('/:id/payment', protect, processPayment);

// Admin routes
router.get('/', protect, authorize('admin'), getAllBookings);
router.put('/:id/status', protect, authorize('admin'), updateBookingStatus);
router.get('/stats/analytics', protect, authorize('admin'), getBookingStats);

module.exports = router;
