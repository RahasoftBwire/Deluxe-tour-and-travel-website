const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password in queries by default
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[\d\s\-\+\(\)]+$/, 'Please provide a valid phone number']
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'hotel_manager'],
        default: 'customer'
    },
    avatar: {
        type: String,
        default: 'default-avatar.png'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return next();
    }
    
    // Hash password with cost of 10
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate reset password token
userSchema.methods.getResetPasswordToken = function() {
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    return resetToken;
};

module.exports = mongoose.model('User', userSchema);
