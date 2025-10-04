const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    createReview,
    getReviews,
    getReview,
    updateReview,
    deleteReview,
    updateReviewStatus,
    addReply,
    markHelpful
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

// Validation rules
const reviewValidation = [
    body('tour').notEmpty().withMessage('Tour ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('title').trim().notEmpty().withMessage('Review title is required'),
    body('comment').trim().notEmpty().withMessage('Review comment is required')
];

// Public routes
router.get('/', getReviews);
router.get('/:id', getReview);

// Protected routes (authenticated users)
router.post('/', protect, reviewValidation, validate, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/helpful', protect, markHelpful);

// Admin routes
router.put('/:id/status', protect, authorize('admin'), updateReviewStatus);
router.post('/:id/reply', protect, authorize('admin', 'hotel_manager'), addReply);

module.exports = router;
