const express = require('express');
const router = express.Router();
const mpesaService = require('../services/mpesaService');
const stripeService = require('../services/stripeService');
const { protect, authorize } = require('../middleware/auth');

/**
 * @route   POST /api/payments/mpesa/initiate
 * @desc    Initiate M-Pesa STK Push
 * @access  Public
 */
router.post('/mpesa/initiate', async (req, res) => {
    try {
        const { bookingId, phoneNumber } = req.body;

        if (!bookingId || !phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Booking ID and phone number are required'
            });
        }

        const result = await mpesaService.processBookingPayment(bookingId, phoneNumber);

        if (result.success) {
            res.status(200).json({
                success: true,
                message: result.message,
                data: {
                    checkoutRequestID: result.checkoutRequestID,
                    bookingReference: result.bookingReference
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }

    } catch (error) {
        console.error('M-Pesa initiate error:', error);
        res.status(500).json({
            success: false,
            message: 'Error initiating M-Pesa payment',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/payments/mpesa/callback
 * @desc    M-Pesa callback endpoint (called by Safaricom)
 * @access  Public
 */
router.post('/mpesa/callback', async (req, res) => {
    try {
        console.log('M-Pesa Callback received:', JSON.stringify(req.body, null, 2));

        const result = await mpesaService.handleCallback(req.body);

        if (result.success) {
            // Update booking with payment details
            await mpesaService.updateBookingPayment(
                result.checkoutRequestID || req.body.Body?.stkCallback?.CheckoutRequestID,
                result.paymentDetails
            );

            console.log('✅ M-Pesa payment processed successfully');
        } else {
            console.log('❌ M-Pesa payment failed:', result.message);
        }

        // Always respond with 200 to Safaricom
        res.status(200).json({
            ResultCode: 0,
            ResultDesc: 'Accepted'
        });

    } catch (error) {
        console.error('M-Pesa callback error:', error);
        res.status(200).json({
            ResultCode: 0,
            ResultDesc: 'Accepted'
        });
    }
});

/**
 * @route   POST /api/payments/mpesa/query
 * @desc    Query M-Pesa transaction status
 * @access  Public
 */
router.post('/mpesa/query', async (req, res) => {
    try {
        const { checkoutRequestID } = req.body;

        if (!checkoutRequestID) {
            return res.status(400).json({
                success: false,
                message: 'Checkout Request ID is required'
            });
        }

        const result = await mpesaService.queryTransaction(checkoutRequestID);

        res.status(200).json(result);

    } catch (error) {
        console.error('M-Pesa query error:', error);
        res.status(500).json({
            success: false,
            message: 'Error querying transaction',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/payments/stripe/create-payment-intent
 * @desc    Create Stripe payment intent
 * @access  Public
 */
router.post('/stripe/create-payment-intent', async (req, res) => {
    try {
        const { bookingId, currency } = req.body;

        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: 'Booking ID is required'
            });
        }

        const result = await stripeService.processBookingPayment(
            bookingId,
            'payment_intent',
            { currency: currency || 'usd' }
        );

        if (result.success) {
            res.status(200).json({
                success: true,
                clientSecret: result.clientSecret,
                bookingReference: result.bookingReference
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }

    } catch (error) {
        console.error('Stripe payment intent error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating payment intent',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/payments/stripe/create-checkout-session
 * @desc    Create Stripe checkout session
 * @access  Public
 */
router.post('/stripe/create-checkout-session', async (req, res) => {
    try {
        const { bookingId, currency, successUrl, cancelUrl } = req.body;

        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: 'Booking ID is required'
            });
        }

        const result = await stripeService.processBookingPayment(
            bookingId,
            'checkout_session',
            { currency: currency || 'usd', successUrl, cancelUrl }
        );

        if (result.success) {
            res.status(200).json({
                success: true,
                sessionId: result.sessionId,
                sessionUrl: result.sessionUrl,
                bookingReference: result.bookingReference
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }

    } catch (error) {
        console.error('Stripe checkout session error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating checkout session',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/payments/stripe/webhook
 * @desc    Stripe webhook endpoint
 * @access  Public
 */
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const signature = req.headers['stripe-signature'];

        const result = await stripeService.handleWebhook(req.body, signature);

        if (result.success) {
            res.status(200).json({ received: true });
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }

    } catch (error) {
        console.error('Stripe webhook error:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @route   GET /api/payments/stripe/status/:paymentIntentId
 * @desc    Get Stripe payment status
 * @access  Public
 */
router.get('/stripe/status/:paymentIntentId', async (req, res) => {
    try {
        const { paymentIntentId } = req.params;

        const result = await stripeService.retrievePaymentIntent(paymentIntentId);

        res.status(200).json(result);

    } catch (error) {
        console.error('Stripe status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving payment status',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/payments/stripe/refund
 * @desc    Create Stripe refund
 * @access  Private/Admin
 */
router.post('/stripe/refund', protect, authorize('admin'), async (req, res) => {
    try {
        const { paymentIntentId, amount, reason } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({
                success: false,
                message: 'Payment Intent ID is required'
            });
        }

        const result = await stripeService.createRefund(paymentIntentId, amount, reason);

        res.status(200).json(result);

    } catch (error) {
        console.error('Stripe refund error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating refund',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/payments/config
 * @desc    Get payment configuration (Stripe publishable key, etc.)
 * @access  Public
 */
router.get('/config', (req, res) => {
    res.status(200).json({
        success: true,
        stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
});

module.exports = router;
