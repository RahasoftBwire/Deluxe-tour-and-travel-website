const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const tourRoutes = require('./src/routes/tourRoutes');
const bookingRoutes = require('./src/routes/bookingRoutesNew'); // Updated to new booking routes
const contactRoutes = require('./src/routes/contactRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/deluxe_tour_travel', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Basic route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to Deluxe Tour & Travel API',
        version: '1.0.0',
        status: 'Server is running'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
