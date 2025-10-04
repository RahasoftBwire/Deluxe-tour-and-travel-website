const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a tour title'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a tour description'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    shortDescription: {
        type: String,
        maxlength: [200, 'Short description cannot exceed 200 characters']
    },
    category: {
        type: String,
        required: [true, 'Please specify tour category'],
        enum: ['safari', 'beach', 'city', 'adventure', 'cultural', 'luxury', 'budget', 'family'],
        default: 'adventure'
    },
    destination: {
        type: String,
        required: [true, 'Please provide destination'],
        trim: true
    },
    country: {
        type: String,
        required: [true, 'Please provide country'],
        trim: true
    },
    location: {
        address: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    duration: {
        days: {
            type: Number,
            required: [true, 'Please specify duration in days'],
            min: [1, 'Duration must be at least 1 day']
        },
        nights: {
            type: Number,
            required: [true, 'Please specify number of nights']
        }
    },
    price: {
        type: Number,
        required: [true, 'Please provide tour price'],
        min: [0, 'Price cannot be negative']
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'Please specify maximum group size'],
        min: [1, 'Group size must be at least 1']
    },
    availability: {
        type: Number,
        required: [true, 'Please specify available slots'],
        min: [0, 'Availability cannot be negative']
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        public_id: String,
        caption: String
    }],
    mainImage: {
        type: String,
        required: [true, 'Please provide a main image']
    },
    itinerary: [{
        day: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        meals: [String],
        accommodation: String
    }],
    included: [{
        type: String
    }],
    excluded: [{
        type: String
    }],
    difficulty: {
        type: String,
        enum: ['easy', 'moderate', 'challenging', 'difficult'],
        default: 'moderate'
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: [0, 'Rating cannot be less than 0'],
            max: [5, 'Rating cannot be more than 5']
        },
        count: {
            type: Number,
            default: 0
        }
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    featured: {
        type: Boolean,
        default: false
    },
    badge: {
        type: String,
        enum: ['', 'Popular', 'Hot Deal', 'New', 'Best Seller'],
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    startDates: [{
        date: Date,
        availability: Number
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create slug from title before saving
tourSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

// Virtual for final price after discount
tourSchema.virtual('finalPrice').get(function() {
    return this.price - (this.price * this.discount / 100);
});

// Index for faster queries
tourSchema.index({ destination: 1, category: 1 });
tourSchema.index({ price: 1 });
tourSchema.index({ 'rating.average': -1 });

module.exports = mongoose.model('Tour', tourSchema);
