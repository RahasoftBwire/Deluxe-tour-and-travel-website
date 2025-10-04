const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    register,
    login,
    getMe,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

// Validation rules
const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number')
];

const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

const updatePasswordValidation = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters')
];

const forgotPasswordValidation = [
    body('email').isEmail().withMessage('Please provide a valid email')
];

const resetPasswordValidation = [
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
];

// Routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePasswordValidation, validate, updatePassword);
router.post('/forgot-password', forgotPasswordValidation, validate, forgotPassword);
router.put('/reset-password/:resetToken', resetPasswordValidation, validate, resetPassword);

module.exports = router;
