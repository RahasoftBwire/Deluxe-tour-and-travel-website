const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: [true, 'Review must be associated with a booking']
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    title: {
        type: String,
        required: [true, 'Please provide a review title'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    comment: {
        type: String,
        required: [true, 'Please provide a review comment'],
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    ratings: {
        valueForMoney: {
            type: Number,
            min: 1,
            max: 5
        },
        service: {
            type: Number,
            min: 1,
            max: 5
        },
        cleanliness: {
            type: Number,
            min: 1,
            max: 5
        },
        location: {
            type: Number,
            min: 1,
            max: 5
        }
    },
    images: [{
        url: String,
        public_id: String
    }],
    helpful: {
        type: Number,
        default: 0
    },
    helpfulBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isVerified: {
        type: Boolean,
        default: true // Verified because linked to booking
    },
    isApproved: {
        type: Boolean,
        default: false // Needs admin approval
    },
    response: {
        message: String,
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        respondedAt: Date
    }
}, {
    timestamps: true
});

// Prevent duplicate reviews
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Populate user details
reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name avatar'
    });
    next();
});

// Update tour rating after review is saved
reviewSchema.statics.calculateAverageRating = async function(tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId, isApproved: true }
        },
        {
            $group: {
                _id: '$tour',
                averageRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await mongoose.model('Tour').findByIdAndUpdate(tourId, {
            'rating.average': Math.round(stats[0].averageRating * 10) / 10,
            'rating.count': stats[0].reviewCount
        });
    } else {
        await mongoose.model('Tour').findByIdAndUpdate(tourId, {
            'rating.average': 0,
            'rating.count': 0
        });
    }
};

// Call calculateAverageRating after save
reviewSchema.post('save', function() {
    this.constructor.calculateAverageRating(this.tour);
});

// Call calculateAverageRating after delete
reviewSchema.post('remove', function() {
    this.constructor.calculateAverageRating(this.tour);
});

module.exports = mongoose.model('Review', reviewSchema);
