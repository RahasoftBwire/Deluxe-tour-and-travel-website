const Booking = require('../models/Booking');
const Tour = require('../models/Tour');

// @desc    Check tour availability
// @route   POST /api/bookings/check-availability
// @access  Public
exports.checkAvailability = async (req, res) => {
    try {
        const { tourId, startDate, numberOfPeople } = req.body;

        const tour = await Tour.findById(tourId);

        if (!tour) {
            return res.status(404).json({
                success: false,
                message: 'Tour not found'
            });
        }

        if (!tour.isAvailable) {
            return res.status(400).json({
                success: false,
                message: 'This tour is currently not available'
            });
        }

        // Check if tour has availability on the requested date
        const requestedDate = new Date(startDate);
        const availability = tour.availability.find(
            avail => avail.date.toDateString() === requestedDate.toDateString()
        );

        if (!availability) {
            return res.status(400).json({
                success: false,
                message: 'No availability for the selected date',
                availableDates: tour.availability.filter(a => a.spotsAvailable > 0)
            });
        }

        if (availability.spotsAvailable < numberOfPeople) {
            return res.status(400).json({
                success: false,
                message: `Only ${availability.spotsAvailable} spots available for this date`,
                spotsAvailable: availability.spotsAvailable
            });
        }

        // Calculate pricing
        const basePrice = tour.discountPrice || tour.price;
        const totalPrice = basePrice * numberOfPeople;

        res.status(200).json({
            success: true,
            message: 'Tour is available for booking',
            available: true,
            spotsAvailable: availability.spotsAvailable,
            pricing: {
                pricePerPerson: basePrice,
                numberOfPeople,
                totalPrice
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error checking availability',
            error: error.message
        });
    }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
    try {
        const {
            tour,
            startDate,
            numberOfPeople,
            specialRequirements,
            contactInfo
        } = req.body;

        // Verify tour exists and is available
        const tourDoc = await Tour.findById(tour);

        if (!tourDoc) {
            return res.status(404).json({
                success: false,
                message: 'Tour not found'
            });
        }

        if (!tourDoc.isAvailable) {
            return res.status(400).json({
                success: false,
                message: 'This tour is currently not available'
            });
        }

        // Check availability
        const requestedDate = new Date(startDate);
        const availability = tourDoc.availability.find(
            avail => avail.date.toDateString() === requestedDate.toDateString()
        );

        if (!availability || availability.spotsAvailable < numberOfPeople) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient availability for the selected date'
            });
        }

        // Calculate pricing
        const pricePerPerson = tourDoc.discountPrice || tourDoc.price;
        const totalPrice = pricePerPerson * numberOfPeople;

        // Create booking
        const booking = await Booking.create({
            user: req.user.id,
            tour,
            startDate,
            endDate: new Date(requestedDate.getTime() + tourDoc.duration * 24 * 60 * 60 * 1000),
            numberOfPeople,
            pricePerPerson,
            totalPrice,
            specialRequirements,
            contactInfo
        });

        // Update tour availability
        availability.spotsAvailable -= numberOfPeople;
        await tourDoc.save();

        const populatedBooking = await Booking.findById(booking._id)
            .populate('tour', 'title destination duration price images')
            .populate('user', 'name email phone');

        res.status(201).json({
            success: true,
            message: 'Booking created successfully. Please proceed to payment.',
            booking: populatedBooking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private (Admin)
exports.getAllBookings = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const startIndex = (page - 1) * limit;

        let query = {};

        // Filter by status
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Filter by payment status
        if (req.query.paymentStatus) {
            query.paymentStatus = req.query.paymentStatus;
        }

        // Filter by date range
        if (req.query.startDate || req.query.endDate) {
            query.startDate = {};
            if (req.query.startDate) query.startDate.$gte = new Date(req.query.startDate);
            if (req.query.endDate) query.startDate.$lte = new Date(req.query.endDate);
        }

        const total = await Booking.countDocuments(query);

        const bookings = await Booking.find(query)
            .populate('user', 'name email phone')
            .populate('tour', 'title destination duration price images')
            .sort('-createdAt')
            .skip(startIndex)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: bookings.length,
            total,
            pagination: {
                page,
                pages: Math.ceil(total / limit)
            },
            bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('tour', 'title destination duration price images')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching your bookings',
            error: error.message
        });
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('tour');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if user owns this booking or is admin
        if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this booking'
            });
        }

        res.status(200).json({
            success: true,
            booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching booking',
            error: error.message
        });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        booking.status = status;

        if (status === 'confirmed') {
            booking.confirmedAt = Date.now();
        }

        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking status updated successfully',
            booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating booking status',
            error: error.message
        });
    }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
    try {
        const { cancellationReason } = req.body;

        const booking = await Booking.findById(req.params.id).populate('tour');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if user owns this booking or is admin
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this booking'
            });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled'
            });
        }

        // Check cancellation policy (e.g., can't cancel within 48 hours)
        const hoursUntilTour = (new Date(booking.startDate) - new Date()) / (1000 * 60 * 60);
        if (hoursUntilTour < 48 && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel booking within 48 hours of tour start'
            });
        }

        booking.status = 'cancelled';
        booking.cancellationReason = cancellationReason;
        booking.cancelledAt = Date.now();

        // Restore tour availability
        const tour = booking.tour;
        const availability = tour.availability.find(
            avail => avail.date.toDateString() === new Date(booking.startDate).toDateString()
        );

        if (availability) {
            availability.spotsAvailable += booking.numberOfPeople;
            await tour.save();
        }

        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking',
            error: error.message
        });
    }
};

// @desc    Process payment
// @route   POST /api/bookings/:id/payment
// @access  Private
exports.processPayment = async (req, res) => {
    try {
        const { paymentMethod, transactionId } = req.body;

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if user owns this booking
        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to pay for this booking'
            });
        }

        if (booking.paymentStatus === 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already paid'
            });
        }

        // TODO: Integrate with actual payment gateway (Stripe/Mpesa)
        // This is a placeholder

        booking.paymentStatus = 'paid';
        booking.paymentMethod = paymentMethod;
        booking.transactionId = transactionId;
        booking.paidAt = Date.now();
        booking.status = 'confirmed';
        booking.confirmedAt = Date.now();

        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Payment processed successfully',
            booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing payment',
            error: error.message
        });
    }
};

// @desc    Get booking statistics (Admin)
// @route   GET /api/bookings/stats
// @access  Private (Admin)
exports.getBookingStats = async (req, res) => {
    try {
        const stats = await Booking.aggregate([
            {
                $facet: {
                    statusCount: [
                        { $group: { _id: '$status', count: { $sum: 1 } } }
                    ],
                    paymentStatusCount: [
                        { $group: { _id: '$paymentStatus', count: { $sum: 1 } } }
                    ],
                    totalRevenue: [
                        { $match: { paymentStatus: 'paid' } },
                        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
                    ],
                    monthlyBookings: [
                        {
                            $group: {
                                _id: {
                                    year: { $year: '$createdAt' },
                                    month: { $month: '$createdAt' }
                                },
                                count: { $sum: 1 },
                                revenue: { $sum: '$totalPrice' }
                            }
                        },
                        { $sort: { '_id.year': -1, '_id.month': -1 } },
                        { $limit: 12 }
                    ]
                }
            }
        ]);

        res.status(200).json({
            success: true,
            stats: stats[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching booking statistics',
            error: error.message
        });
    }
};
