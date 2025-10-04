const Review = require('../models/Review');
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
    try {
        const { tour, rating, title, comment } = req.body;

        // Check if user has booked this tour
        const hasBooked = await Booking.findOne({
            user: req.user.id,
            tour,
            status: { $in: ['confirmed', 'completed'] }
        });

        if (!hasBooked) {
            return res.status(403).json({
                success: false,
                message: 'You can only review tours you have booked'
            });
        }

        // Check if user has already reviewed this tour
        const existingReview = await Review.findOne({
            user: req.user.id,
            tour
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this tour'
            });
        }

        // Create review
        const review = await Review.create({
            user: req.user.id,
            tour,
            rating,
            title,
            comment
        });

        // Update tour rating
        await updateTourRating(tour);

        const populatedReview = await Review.findById(review._id)
            .populate('user', 'name avatar')
            .populate('tour', 'title');

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            review: populatedReview
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating review',
            error: error.message
        });
    }
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res) => {
    try {
        let query = {};

        // Filter by tour
        if (req.query.tour) {
            query.tour = req.query.tour;
        }

        // Filter by rating
        if (req.query.rating) {
            query.rating = req.query.rating;
        }

        // Filter by status
        if (req.query.status) {
            query.status = req.query.status;
        } else {
            // By default, only show approved reviews to public
            if (!req.user || req.user.role !== 'admin') {
                query.status = 'approved';
            }
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const total = await Review.countDocuments(query);

        const reviews = await Review.find(query)
            .populate('user', 'name avatar')
            .populate('tour', 'title images')
            .sort('-createdAt')
            .skip(startIndex)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: reviews.length,
            total,
            pagination: {
                page,
                pages: Math.ceil(total / limit)
            },
            reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message
        });
    }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate('user', 'name avatar')
            .populate('tour', 'title images')
            .populate('reply.repliedBy', 'name');

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching review',
            error: error.message
        });
    }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if user owns this review
        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this review'
            });
        }

        const { rating, title, comment } = req.body;

        review.rating = rating || review.rating;
        review.title = title || review.title;
        review.comment = comment || review.comment;

        await review.save();

        // Update tour rating
        await updateTourRating(review.tour);

        const updatedReview = await Review.findById(review._id)
            .populate('user', 'name avatar')
            .populate('tour', 'title');

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            review: updatedReview
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating review',
            error: error.message
        });
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if user owns this review or is admin
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this review'
            });
        }

        const tourId = review.tour;
        await review.deleteOne();

        // Update tour rating
        await updateTourRating(tourId);

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting review',
            error: error.message
        });
    }
};

// @desc    Update review status (approve/reject)
// @route   PUT /api/reviews/:id/status
// @access  Private (Admin)
exports.updateReviewStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        review.status = status;

        await review.save();

        res.status(200).json({
            success: true,
            message: `Review ${status} successfully`,
            review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating review status',
            error: error.message
        });
    }
};

// @desc    Add reply to review
// @route   POST /api/reviews/:id/reply
// @access  Private (Admin)
exports.addReply = async (req, res) => {
    try {
        const { message } = req.body;

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        review.reply = {
            message,
            repliedBy: req.user.id,
            repliedAt: Date.now()
        };

        await review.save();

        const updatedReview = await Review.findById(review._id)
            .populate('user', 'name avatar')
            .populate('reply.repliedBy', 'name');

        res.status(200).json({
            success: true,
            message: 'Reply added successfully',
            review: updatedReview
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding reply',
            error: error.message
        });
    }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
exports.markHelpful = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if user already marked this as helpful
        if (review.helpfulCount && review.helpfulCount.includes(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: 'You have already marked this review as helpful'
            });
        }

        review.helpfulCount.push(req.user.id);
        await review.save();

        res.status(200).json({
            success: true,
            message: 'Review marked as helpful',
            helpfulCount: review.helpfulCount.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error marking review as helpful',
            error: error.message
        });
    }
};

// Helper function to update tour rating
async function updateTourRating(tourId) {
    const reviews = await Review.find({ tour: tourId, status: 'approved' });

    if (reviews.length === 0) {
        await Tour.findByIdAndUpdate(tourId, {
            averageRating: 0,
            totalReviews: 0
        });
        return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);

    await Tour.findByIdAndUpdate(tourId, {
        averageRating,
        totalReviews: reviews.length
    });
}
