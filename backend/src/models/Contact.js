const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[\d\s\-\+\(\)]+$/, 'Please provide a valid phone number']
    },
    subject: {
        type: String,
        required: [true, 'Please provide a subject'],
        trim: true,
        maxlength: [100, 'Subject cannot exceed 100 characters']
    },
    message: {
        type: String,
        required: [true, 'Please provide a message'],
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    type: {
        type: String,
        enum: ['inquiry', 'complaint', 'feedback', 'booking_help', 'other'],
        default: 'inquiry'
    },
    status: {
        type: String,
        enum: ['new', 'in_progress', 'resolved', 'closed'],
        default: 'new'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    responses: [{
        message: String,
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        respondedAt: {
            type: Date,
            default: Date.now
        }
    }],
    ipAddress: String,
    userAgent: String,
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: Date,
    readBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Index for faster queries
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });

module.exports = mongoose.model('Contact', contactSchema);
