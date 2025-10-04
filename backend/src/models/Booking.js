const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: [true, 'Booking must belong to a tour']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a user']
    },
    bookingDate: {
        type: Date,
        required: [true, 'Please provide booking date']
    },
    numberOfTravelers: {
        adults: {
            type: Number,
            required: [true, 'Please specify number of adults'],
            min: [1, 'At least 1 adult required']
        },
        children: {
            type: Number,
            default: 0,
            min: [0, 'Children cannot be negative']
        },
        infants: {
            type: Number,
            default: 0,
            min: [0, 'Infants cannot be negative']
        }
    },
    totalTravelers: {
        type: Number,
        required: true
    },
    contactInfo: {
        name: {
            type: String,
            required: [true, 'Please provide contact name']
        },
        email: {
            type: String,
            required: [true, 'Please provide contact email'],
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
        },
        phone: {
            type: String,
            required: [true, 'Please provide contact phone'],
            match: [/^[\d\s\-\+\(\)]+$/, 'Please provide a valid phone number']
        },
        address: String,
        emergencyContact: {
            name: String,
            phone: String
        }
    },
    pricing: {
        basePrice: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            default: 0
        },
        tax: {
            type: Number,
            default: 0
        },
        totalPrice: {
            type: Number,
            required: true
        }
    },
    payment: {
        method: {
            type: String,
            enum: ['stripe', 'mpesa', 'paypal', 'cash'],
            required: [true, 'Please specify payment method']
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        transactionId: String,
        paidAt: Date
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    specialRequests: {
        type: String,
        maxlength: [500, 'Special requests cannot exceed 500 characters']
    },
    cancellation: {
        isCancelled: {
            type: Boolean,
            default: false
        },
        cancelledAt: Date,
        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reason: String,
        refundAmount: Number,
        refundStatus: {
            type: String,
            enum: ['pending', 'processed', 'rejected'],
            default: 'pending'
        }
    },
    bookingReference: {
        type: String,
        unique: true,
        required: true
    },
    notes: [{
        message: String,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Generate booking reference before saving
bookingSchema.pre('save', function(next) {
    if (!this.bookingReference) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        this.bookingReference = `DLX-${timestamp}-${random}`.toUpperCase();
    }
    
    // Calculate total travelers
    this.totalTravelers = 
        this.numberOfTravelers.adults + 
        this.numberOfTravelers.children + 
        this.numberOfTravelers.infants;
    
    next();
});

// Populate tour and user details
bookingSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'tour',
        select: 'title destination duration price mainImage'
    }).populate({
        path: 'user',
        select: 'name email phone'
    });
    next();
});

// Index for faster queries
bookingSchema.index({ user: 1, bookingDate: -1 });
bookingSchema.index({ bookingReference: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
