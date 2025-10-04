const express = require('express');
const router = express.Router();
const {
    getTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    getFeaturedTours,
    getToursByCategory,
    getTourStats
} = require('../controllers/tourController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getTours);
router.get('/featured', getFeaturedTours);
router.get('/category/:category', getToursByCategory);
router.get('/stats', protect, authorize('admin'), getTourStats);
router.get('/:id', getTour);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin', 'hotel_manager'), createTour);
router.put('/:id', protect, authorize('admin', 'hotel_manager'), updateTour);
router.delete('/:id', protect, authorize('admin'), deleteTour);

module.exports = router;
