const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    submitContact,
    getContacts,
    getContact,
    updateContactStatus,
    addResponse,
    deleteContact
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

// Validation rules
const contactValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required')
];

// Public route
router.post('/', contactValidation, validate, submitContact);

// Admin routes
router.get('/', protect, authorize('admin'), getContacts);
router.get('/:id', protect, authorize('admin'), getContact);
router.put('/:id/status', protect, authorize('admin'), updateContactStatus);
router.post('/:id/response', protect, authorize('admin'), addResponse);
router.delete('/:id', protect, authorize('admin'), deleteContact);

module.exports = router;
