const Tour = require('../models/Tour');

// @desc    Get all tours with filtering, sorting, and pagination
// @route   GET /api/tours
// @access  Public
exports.getTours = async (req, res) => {
    try {
        // Build query
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludedFields.forEach(field => delete queryObj[field]);

        // Advanced filtering (gte, gt, lte, lt)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Tour.find(JSON.parse(queryStr));

        // Search
        if (req.query.search) {
            query = query.find({
                $or: [
                    { title: { $regex: req.query.search, $options: 'i' } },
                    { description: { $regex: req.query.search, $options: 'i' } },
                    { destination: { $regex: req.query.search, $options: 'i' } }
                ]
            });
        }

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt'); // Default sort by newest
        }

        // Field limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Tour.countDocuments(JSON.parse(queryStr));

        query = query.skip(startIndex).limit(limit).populate('createdBy', 'name email');

        // Execute query
        const tours = await query;

        // Pagination result
        const pagination = {};
        if (endIndex < total) {
            pagination.next = { page: page + 1, limit };
        }
        if (startIndex > 0) {
            pagination.prev = { page: page - 1, limit };
        }

        res.status(200).json({
            success: true,
            count: tours.length,
            total,
            pagination,
            tours
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching tours',
            error: error.message
        });
    }
};

// @desc    Get single tour
// @route   GET /api/tours/:id
// @access  Public
exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate({
                path: 'reviews',
                populate: { path: 'user', select: 'name avatar' }
            });

        if (!tour) {
            return res.status(404).json({
                success: false,
                message: 'Tour not found'
            });
        }

        res.status(200).json({
            success: true,
            tour
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching tour',
            error: error.message
        });
    }
};

// @desc    Create new tour
// @route   POST /api/tours
// @access  Private (Admin only)
exports.createTour = async (req, res) => {
    try {
        // Add user to req.body
        req.body.createdBy = req.user.id;

        const tour = await Tour.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Tour created successfully',
            tour
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating tour',
            error: error.message
        });
    }
};

// @desc    Update tour
// @route   PUT /api/tours/:id
// @access  Private (Admin only)
exports.updateTour = async (req, res) => {
    try {
        let tour = await Tour.findById(req.params.id);

        if (!tour) {
            return res.status(404).json({
                success: false,
                message: 'Tour not found'
            });
        }

        tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Tour updated successfully',
            tour
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating tour',
            error: error.message
        });
    }
};

// @desc    Delete tour
// @route   DELETE /api/tours/:id
// @access  Private (Admin only)
exports.deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);

        if (!tour) {
            return res.status(404).json({
                success: false,
                message: 'Tour not found'
            });
        }

        await tour.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Tour deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting tour',
            error: error.message
        });
    }
};

// @desc    Get featured tours
// @route   GET /api/tours/featured
// @access  Public
exports.getFeaturedTours = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 6;
        
        const tours = await Tour.find({ featured: true, isActive: true })
            .limit(limit)
            .sort('-rating.average')
            .select('title destination price discount mainImage rating category badge');

        res.status(200).json({
            success: true,
            count: tours.length,
            tours
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching featured tours',
            error: error.message
        });
    }
};

// @desc    Get tours by category
// @route   GET /api/tours/category/:category
// @access  Public
exports.getToursByCategory = async (req, res) => {
    try {
        const tours = await Tour.find({ 
            category: req.params.category,
            isActive: true 
        }).sort('-rating.average');

        res.status(200).json({
            success: true,
            count: tours.length,
            tours
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching tours by category',
            error: error.message
        });
    }
};

// @desc    Get tour statistics
// @route   GET /api/tours/stats
// @access  Private (Admin)
exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { isActive: true }
            },
            {
                $group: {
                    _id: '$category',
                    numTours: { $sum: 1 },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                    avgRating: { $avg: '$rating.average' }
                }
            },
            {
                $sort: { avgPrice: 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching tour statistics',
            error: error.message
        });
    }
};
