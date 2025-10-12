const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');

/**
 * Stripe Payment Service
 * Handles credit/debit card payments via Stripe
 * 
 * Setup Instructions:
 * 1. Create account at https://stripe.com/
 * 2. Get API keys from Dashboard > Developers > API keys
 * 3. Add these to your .env file:
 *    STRIPE_SECRET_KEY=sk_test_xxx (or sk_live_xxx for production)
 *    STRIPE_PUBLISHABLE_KEY=pk_test_xxx (or pk_live_xxx for production)
 *    STRIPE_WEBHOOK_SECRET=whsec_xxx (from Webhooks page)
 *    FRONTEND_URL=http://localhost:3000
 */

class StripeService {
    constructor() {
        this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    }

    /**
     * Create a payment intent for a booking
     * 
     * @param {Object} paymentData - Payment details
     * @param {string} paymentData.bookingId - Booking ID
     * @param {number} paymentData.amount - Amount in currency's smallest unit (e.g., cents for USD)
     * @param {string} paymentData.currency - Currency code (e.g., 'usd', 'kes')
     * @param {string} paymentData.customerEmail - Customer email
     * @param {Object} paymentData.metadata - Additional metadata
     * @returns {Object} Payment intent
     */
    async createPaymentIntent(paymentData) {
        try {
            const {
                bookingId,
                amount,
                currency = 'usd',
                customerEmail,
                metadata = {}
            } = paymentData;

            // Validate required fields
            if (!bookingId || !amount) {
                throw new Error('Missing required payment data');
            }

            // Get booking details
            const booking = await Booking.findById(bookingId);
            if (!booking) {
                throw new Error('Booking not found');
            }

            if (booking.payment.status === 'completed') {
                throw new Error('Booking already paid');
            }

            // Create payment intent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency: currency.toLowerCase(),
                receipt_email: customerEmail,
                metadata: {
                    bookingId: bookingId,
                    bookingReference: booking.bookingReference,
                    tourTitle: booking.tourDetails?.title || 'Tour Package',
                    ...metadata
                },
                automatic_payment_methods: {
                    enabled: true
                },
                description: `Tour Booking: ${booking.bookingReference}`
            });

            // Update booking with payment intent ID
            booking.payment.transactionId = paymentIntent.id;
            booking.payment.method = 'stripe';
            booking.payment.status = 'processing';
            await booking.save();

            return {
                success: true,
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                bookingReference: booking.bookingReference
            };

        } catch (error) {
            console.error('Create payment intent error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Create a checkout session for hosted checkout
     * This redirects users to Stripe's hosted payment page
     * 
     * @param {Object} sessionData - Checkout session details
     * @returns {Object} Checkout session
     */
    async createCheckoutSession(sessionData) {
        try {
            const {
                bookingId,
                amount,
                currency = 'usd',
                customerEmail,
                successUrl,
                cancelUrl
            } = sessionData;

            // Get booking details
            const booking = await Booking.findById(bookingId);
            if (!booking) {
                throw new Error('Booking not found');
            }

            if (booking.payment.status === 'completed') {
                throw new Error('Booking already paid');
            }

            // Create checkout session
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: currency.toLowerCase(),
                            product_data: {
                                name: booking.tourDetails?.title || 'Tour Package',
                                description: `Booking Reference: ${booking.bookingReference}`,
                                images: [booking.tourDetails?.image || '']
                            },
                            unit_amount: Math.round(amount * 100) // Convert to cents
                        },
                        quantity: 1
                    }
                ],
                mode: 'payment',
                customer_email: customerEmail,
                client_reference_id: bookingId,
                metadata: {
                    bookingId: bookingId,
                    bookingReference: booking.bookingReference
                },
                success_url: successUrl || `${this.frontendUrl}/pages/booking-success.html?ref=${booking.bookingReference}`,
                cancel_url: cancelUrl || `${this.frontendUrl}/pages/booking.html?bookingId=${bookingId}`
            });

            // Update booking with session ID
            booking.payment.transactionId = session.id;
            booking.payment.method = 'stripe';
            booking.payment.status = 'processing';
            await booking.save();

            return {
                success: true,
                sessionId: session.id,
                sessionUrl: session.url,
                bookingReference: booking.bookingReference
            };

        } catch (error) {
            console.error('Create checkout session error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Retrieve payment intent status
     * 
     * @param {string} paymentIntentId - Payment Intent ID
     * @returns {Object} Payment intent details
     */
    async retrievePaymentIntent(paymentIntentId) {
        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            return {
                success: true,
                status: paymentIntent.status,
                amount: paymentIntent.amount / 100, // Convert from cents
                currency: paymentIntent.currency,
                metadata: paymentIntent.metadata
            };

        } catch (error) {
            console.error('Retrieve payment intent error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Handle Stripe webhook events
     * Webhooks notify your server about events (successful payments, failed payments, etc.)
     * 
     * @param {Object} rawBody - Raw webhook body
     * @param {string} signature - Stripe signature header
     * @returns {Object} Event handling result
     */
    async handleWebhook(rawBody, signature) {
        try {
            // Verify webhook signature
            const event = stripe.webhooks.constructEvent(
                rawBody,
                signature,
                this.webhookSecret
            );

            // Handle the event
            switch (event.type) {
                case 'payment_intent.succeeded':
                    await this.handlePaymentSuccess(event.data.object);
                    break;

                case 'payment_intent.payment_failed':
                    await this.handlePaymentFailure(event.data.object);
                    break;

                case 'checkout.session.completed':
                    await this.handleCheckoutSuccess(event.data.object);
                    break;

                case 'payment_intent.canceled':
                    await this.handlePaymentCanceled(event.data.object);
                    break;

                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }

            return {
                success: true,
                received: true
            };

        } catch (error) {
            console.error('Webhook handling error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Handle successful payment
     * @private
     */
    async handlePaymentSuccess(paymentIntent) {
        try {
            const bookingId = paymentIntent.metadata.bookingId;
            
            const booking = await Booking.findById(bookingId);
            if (!booking) {
                console.error('Booking not found:', bookingId);
                return;
            }

            // Update booking payment status
            booking.payment.status = 'completed';
            booking.payment.paidAt = new Date();
            booking.payment.stripePaymentId = paymentIntent.id;
            booking.payment.amount = paymentIntent.amount / 100;
            booking.status = 'confirmed';

            await booking.save();

            console.log('✅ Payment successful for booking:', booking.bookingReference);

            // TODO: Send confirmation email to customer
            // TODO: Send notification to admin

        } catch (error) {
            console.error('Handle payment success error:', error);
        }
    }

    /**
     * Handle failed payment
     * @private
     */
    async handlePaymentFailure(paymentIntent) {
        try {
            const bookingId = paymentIntent.metadata.bookingId;
            
            const booking = await Booking.findById(bookingId);
            if (!booking) {
                console.error('Booking not found:', bookingId);
                return;
            }

            // Update booking payment status
            booking.payment.status = 'failed';
            booking.payment.failureReason = paymentIntent.last_payment_error?.message || 'Payment failed';

            await booking.save();

            console.log('❌ Payment failed for booking:', booking.bookingReference);

            // TODO: Send payment failure email to customer

        } catch (error) {
            console.error('Handle payment failure error:', error);
        }
    }

    /**
     * Handle successful checkout session
     * @private
     */
    async handleCheckoutSuccess(session) {
        try {
            const bookingId = session.metadata.bookingId;
            
            const booking = await Booking.findById(bookingId);
            if (!booking) {
                console.error('Booking not found:', bookingId);
                return;
            }

            // Update booking payment status
            booking.payment.status = 'completed';
            booking.payment.paidAt = new Date();
            booking.payment.stripeSessionId = session.id;
            booking.payment.amount = session.amount_total / 100;
            booking.status = 'confirmed';

            await booking.save();

            console.log('✅ Checkout completed for booking:', booking.bookingReference);

            // TODO: Send confirmation email to customer

        } catch (error) {
            console.error('Handle checkout success error:', error);
        }
    }

    /**
     * Handle canceled payment
     * @private
     */
    async handlePaymentCanceled(paymentIntent) {
        try {
            const bookingId = paymentIntent.metadata.bookingId;
            
            const booking = await Booking.findById(bookingId);
            if (!booking) {
                console.error('Booking not found:', bookingId);
                return;
            }

            // Update booking payment status
            booking.payment.status = 'canceled';

            await booking.save();

            console.log('⚠️ Payment canceled for booking:', booking.bookingReference);

        } catch (error) {
            console.error('Handle payment canceled error:', error);
        }
    }

    /**
     * Process booking payment with Stripe
     * 
     * @param {string} bookingId - Booking ID
     * @param {string} paymentMethod - 'payment_intent' or 'checkout_session'
     * @param {Object} options - Additional options
     * @returns {Object} Payment initiation result
     */
    async processBookingPayment(bookingId, paymentMethod = 'payment_intent', options = {}) {
        try {
            const booking = await Booking.findById(bookingId);
            
            if (!booking) {
                throw new Error('Booking not found');
            }

            if (booking.payment.status === 'completed') {
                throw new Error('Booking already paid');
            }

            const paymentData = {
                bookingId: bookingId,
                amount: booking.pricing.totalPrice,
                currency: options.currency || 'usd',
                customerEmail: booking.contactInfo.email,
                metadata: {
                    customerName: booking.contactInfo.name,
                    customerPhone: booking.contactInfo.phone
                }
            };

            if (paymentMethod === 'checkout_session') {
                // Use hosted checkout page
                return await this.createCheckoutSession({
                    ...paymentData,
                    successUrl: options.successUrl,
                    cancelUrl: options.cancelUrl
                });
            } else {
                // Use payment intent (custom checkout)
                return await this.createPaymentIntent(paymentData);
            }

        } catch (error) {
            console.error('Process booking payment error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Create a refund for a payment
     * 
     * @param {string} paymentIntentId - Payment Intent ID
     * @param {number} amount - Amount to refund (optional, defaults to full refund)
     * @param {string} reason - Reason for refund
     * @returns {Object} Refund result
     */
    async createRefund(paymentIntentId, amount = null, reason = 'requested_by_customer') {
        try {
            const refundData = {
                payment_intent: paymentIntentId,
                reason: reason
            };

            if (amount) {
                refundData.amount = Math.round(amount * 100); // Convert to cents
            }

            const refund = await stripe.refunds.create(refundData);

            return {
                success: true,
                refundId: refund.id,
                status: refund.status,
                amount: refund.amount / 100
            };

        } catch (error) {
            console.error('Create refund error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }
}

module.exports = new StripeService();
