const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const User = require('../models/User');

// @desc    Create a new booking (Guest or User)
// @route   POST /api/bookings
// @access  Public
exports.createBooking = async (req, res) => {
    try {
        const {
            tourId,
            bookingDate,
            numberOfTravelers,
            contactInfo,
            paymentMethod,
            specialRequests,
            tourDetails // For tours not in database (custom tours)
        } = req.body;

        // Validate required fields
        if (!bookingDate || !numberOfTravelers || !contactInfo) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required booking information'
            });
        }

        let tour = null;
        let tourInfo = {};

        // Check if this is a database tour or custom tour
        if (tourId) {
            tour = await Tour.findById(tourId);
            if (!tour) {
                return res.status(404).json({
                    success: false,
                    message: 'Tour not found'
                });
            }
            tourInfo = {
                title: tour.title,
                destination: tour.destination,
                duration: tour.duration,
                price: tour.discountPrice || tour.price
            };
        } else if (tourDetails) {
            // Custom tour from tour-detail.js
            tourInfo = tourDetails;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Tour information required'
            });
        }

        // Calculate pricing
        const adults = numberOfTravelers.adults || 1;
        const children = numberOfTravelers.children || 0;
        const infants = numberOfTravelers.infants || 0;
        
        const basePrice = tourInfo.price || 0;
        const adultPrice = adults * basePrice;
        const childPrice = children * (basePrice * 0.7); // 30% discount for children
        const infantPrice = infants * (basePrice * 0.5); // 50% discount for infants
        
        const subtotal = adultPrice + childPrice + infantPrice;
        const tax = subtotal * 0.16; // 16% VAT
        const totalPrice = subtotal + tax;

        // Find or create guest user
        let user = req.user ? req.user._id : null;
        
        if (!user) {
            // Create guest user
            const existingUser = await User.findOne({ email: contactInfo.email });
            if (existingUser) {
                user = existingUser._id;
            } else {
                const guestUser = await User.create({
                    name: contactInfo.name,
                    email: contactInfo.email,
                    phone: contactInfo.phone,
                    role: 'guest'
                });
                user = guestUser._id;
            }
        }

        // Create booking
        const booking = await Booking.create({
            tour: tourId || null,
            user: user,
            bookingDate: new Date(bookingDate),
            numberOfTravelers: {
                adults,
                children,
                infants
            },
            contactInfo: {
                name: contactInfo.name,
                email: contactInfo.email,
                phone: contactInfo.phone,
                address: contactInfo.address || '',
                emergencyContact: contactInfo.emergencyContact || {}
            },
            pricing: {
                basePrice: basePrice,
                discount: 0,
                tax: tax,
                totalPrice: totalPrice
            },
            payment: {
                method: paymentMethod || 'pending',
                status: 'pending'
            },
            specialRequests: specialRequests || '',
            tourDetails: tourInfo, // Store tour info for reference
            status: 'pending'
        });

        // Populate the booking
        await booking.populate('user', 'name email phone');

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: {
                booking,
                bookingReference: booking.bookingReference
            }
        });

    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
    try {
        const {
            status,
            paymentStatus,
            search,
            startDate,
            endDate,
            page = 1,
            limit = 20,
            sort = '-createdAt'
        } = req.query;

        // Build query
        const query = {};

        if (status) {
            query.status = status;
        }

        if (paymentStatus) {
            query['payment.status'] = paymentStatus;
        }

        if (search) {
            query.$or = [
                { bookingReference: { $regex: search, $options: 'i' } },
                { 'contactInfo.name': { $regex: search, $options: 'i' } },
                { 'contactInfo.email': { $regex: search, $options: 'i' } },
                { 'contactInfo.phone': { $regex: search, $options: 'i' } }
            ];
        }

        if (startDate || endDate) {
            query.bookingDate = {};
            if (startDate) query.bookingDate.$gte = new Date(startDate);
            if (endDate) query.bookingDate.$lte = new Date(endDate);
        }

        // Execute query with pagination
        const skip = (page - 1) * limit;
        
        const bookings = await Booking.find(query)
            .populate('user', 'name email phone')
            .populate('tour', 'title destination duration price mainImage')
            .sort(sort)
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Booking.countDocuments(query);

        // Calculate statistics
        const stats = await Booking.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalRevenue: { $sum: '$pricing.totalPrice' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            count: bookings.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            stats,
            data: bookings
        });

    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
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
            .populate('tour', 'title destination duration price mainImage category includes');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });

    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching booking',
            error: error.message
        });
    }
};

// @desc    Get booking by reference
// @route   GET /api/bookings/reference/:ref
// @access  Public
exports.getBookingByReference = async (req, res) => {
    try {
        const booking = await Booking.findOne({ bookingReference: req.params.ref })
            .populate('user', 'name email phone')
            .populate('tour', 'title destination duration price mainImage');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });

    } catch (error) {
        console.error('Get booking by reference error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching booking',
            error: error.message
        });
    }
};

// @desc    Update booking status (Admin)
// @route   PATCH /api/bookings/:id/status
// @access  Private/Admin
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        booking.status = status;
        
        if (status === 'cancelled') {
            booking.cancellation.isCancelled = true;
            booking.cancellation.cancelledAt = Date.now();
            booking.cancellation.cancelledBy = req.user._id;
        }

        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking status updated successfully',
            data: booking
        });

    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating booking status',
            error: error.message
        });
    }
};

// @desc    Update payment status (Admin)
// @route   PATCH /api/bookings/:id/payment
// @access  Private/Admin
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { status, transactionId } = req.body;

        if (!['pending', 'completed', 'failed', 'refunded'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment status'
            });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        booking.payment.status = status;
        if (transactionId) {
            booking.payment.transactionId = transactionId;
        }
        if (status === 'completed') {
            booking.payment.paidAt = Date.now();
            booking.status = 'confirmed';
        }

        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Payment status updated successfully',
            data: booking
        });

    } catch (error) {
        console.error('Update payment status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating payment status',
            error: error.message
        });
    }
};

// @desc    Add note to booking (Admin)
// @route   POST /api/bookings/:id/notes
// @access  Private/Admin
exports.addBookingNote = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Note message is required'
            });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        booking.notes.push({
            message,
            createdBy: req.user._id,
            createdAt: Date.now()
        });

        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Note added successfully',
            data: booking
        });

    } catch (error) {
        console.error('Add booking note error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding note',
            error: error.message
        });
    }
};

// @desc    Delete booking (Admin)
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        await booking.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Booking deleted successfully'
        });

    } catch (error) {
        console.error('Delete booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting booking',
            error: error.message
        });
    }
};

// @desc    Get booking statistics (Admin)
// @route   GET /api/bookings/stats/overview
// @access  Private/Admin
exports.getBookingStats = async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const pendingBookings = await Booking.countDocuments({ status: 'pending' });
        const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
        const completedBookings = await Booking.countDocuments({ status: 'completed' });
        const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

        const revenueStats = await Booking.aggregate([
            {
                $match: { 'payment.status': 'completed' }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$pricing.totalPrice' },
                    averageBooking: { $avg: '$pricing.totalPrice' }
                }
            }
        ]);

        const monthlyBookings = await Booking.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: '$pricing.totalPrice' }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalBookings,
                pendingBookings,
                confirmedBookings,
                completedBookings,
                cancelledBookings,
                revenue: revenueStats[0] || { totalRevenue: 0, averageBooking: 0 },
                monthlyBookings
            }
        });

    } catch (error) {
        console.error('Get booking stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching booking statistics',
            error: error.message
        });
    }
};
