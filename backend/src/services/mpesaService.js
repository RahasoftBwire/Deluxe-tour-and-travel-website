const axios = require('axios');
const Booking = require('../models/Booking');

/**
 * M-Pesa Payment Service
 * Integrates with Safaricom Daraja API for STK Push payments
 * 
 * Setup Instructions:
 * 1. Register for Daraja API at https://developer.safaricom.co.ke/
 * 2. Create an app to get Consumer Key and Consumer Secret
 * 3. Add these to your .env file:
 *    MPESA_CONSUMER_KEY=your_consumer_key
 *    MPESA_CONSUMER_SECRET=your_consumer_secret
 *    MPESA_SHORTCODE=174379 (or your business shortcode)
 *    MPESA_PASSKEY=your_passkey
 *    MPESA_CALLBACK_URL=https://yourdomain.com/api/payments/mpesa/callback
 *    MPESA_ENV=sandbox (or production)
 */

class MPesaService {
    constructor() {
        this.consumerKey = process.env.MPESA_CONSUMER_KEY;
        this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
        this.shortcode = process.env.MPESA_SHORTCODE || '174379';
        this.passkey = process.env.MPESA_PASSKEY;
        this.callbackUrl = process.env.MPESA_CALLBACK_URL;
        this.environment = process.env.MPESA_ENV || 'sandbox';
        
        // API URLs
        this.baseUrl = this.environment === 'production' 
            ? 'https://api.safaricom.co.ke'
            : 'https://sandbox.safaricom.co.ke';
    }

    /**
     * Get OAuth access token
     */
    async getAccessToken() {
        try {
            const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
            
            const response = await axios.get(
                `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
                {
                    headers: {
                        Authorization: `Basic ${auth}`
                    }
                }
            );

            return response.data.access_token;
        } catch (error) {
            console.error('Error getting M-Pesa access token:', error.response?.data || error.message);
            throw new Error('Failed to authenticate with M-Pesa');
        }
    }

    /**
     * Generate timestamp for M-Pesa API
     */
    getTimestamp() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}${month}${day}${hour}${minute}${second}`;
    }

    /**
     * Generate password for M-Pesa API
     */
    generatePassword(timestamp) {
        const data = `${this.shortcode}${this.passkey}${timestamp}`;
        return Buffer.from(data).toString('base64');
    }

    /**
     * Format phone number for M-Pesa (254XXXXXXXXX)
     */
    formatPhoneNumber(phone) {
        // Remove any spaces, dashes, or special characters
        let cleaned = phone.replace(/[\s\-\(\)]/g, '');
        
        // Remove leading + if present
        if (cleaned.startsWith('+')) {
            cleaned = cleaned.substring(1);
        }
        
        // If starts with 0, replace with 254
        if (cleaned.startsWith('0')) {
            cleaned = '254' + cleaned.substring(1);
        }
        
        // If doesn't start with 254, add it
        if (!cleaned.startsWith('254')) {
            cleaned = '254' + cleaned;
        }
        
        return cleaned;
    }

    /**
     * Initiate STK Push payment
     * 
     * @param {Object} paymentData - Payment details
     * @param {string} paymentData.phone - Customer phone number
     * @param {number} paymentData.amount - Amount to pay
     * @param {string} paymentData.accountReference - Booking reference
     * @param {string} paymentData.transactionDesc - Transaction description
     * @returns {Object} STK Push response
     */
    async initiateSTKPush(paymentData) {
        try {
            const { phone, amount, accountReference, transactionDesc } = paymentData;

            // Validate required fields
            if (!phone || !amount || !accountReference) {
                throw new Error('Missing required payment data');
            }

            // Get access token
            const accessToken = await this.getAccessToken();
            
            // Generate timestamp and password
            const timestamp = this.getTimestamp();
            const password = this.generatePassword(timestamp);
            
            // Format phone number
            const phoneNumber = this.formatPhoneNumber(phone);

            // Prepare STK Push request
            const stkPushData = {
                BusinessShortCode: this.shortcode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: Math.round(amount), // Amount must be whole number
                PartyA: phoneNumber,
                PartyB: this.shortcode,
                PhoneNumber: phoneNumber,
                CallBackURL: this.callbackUrl,
                AccountReference: accountReference,
                TransactionDesc: transactionDesc || `Payment for ${accountReference}`
            };

            // Send STK Push request
            const response = await axios.post(
                `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
                stkPushData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return {
                success: true,
                checkoutRequestID: response.data.CheckoutRequestID,
                merchantRequestID: response.data.MerchantRequestID,
                responseCode: response.data.ResponseCode,
                responseDescription: response.data.ResponseDescription,
                customerMessage: response.data.CustomerMessage
            };

        } catch (error) {
            console.error('STK Push error:', error.response?.data || error.message);
            
            return {
                success: false,
                error: error.response?.data?.errorMessage || error.message,
                responseCode: error.response?.data?.errorCode || 'ERROR'
            };
        }
    }

    /**
     * Query STK Push transaction status
     * 
     * @param {string} checkoutRequestID - Checkout Request ID from STK Push
     * @returns {Object} Transaction status
     */
    async queryTransaction(checkoutRequestID) {
        try {
            const accessToken = await this.getAccessToken();
            const timestamp = this.getTimestamp();
            const password = this.generatePassword(timestamp);

            const queryData = {
                BusinessShortCode: this.shortcode,
                Password: password,
                Timestamp: timestamp,
                CheckoutRequestID: checkoutRequestID
            };

            const response = await axios.post(
                `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
                queryData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return {
                success: true,
                resultCode: response.data.ResultCode,
                resultDesc: response.data.ResultDesc,
                data: response.data
            };

        } catch (error) {
            console.error('Query transaction error:', error.response?.data || error.message);
            
            return {
                success: false,
                error: error.response?.data?.errorMessage || error.message
            };
        }
    }

    /**
     * Handle M-Pesa callback
     * This is called by Safaricom when payment is complete
     * 
     * @param {Object} callbackData - Callback data from M-Pesa
     */
    async handleCallback(callbackData) {
        try {
            const { Body } = callbackData;
            const { stkCallback } = Body;

            const {
                MerchantRequestID,
                CheckoutRequestID,
                ResultCode,
                ResultDesc,
                CallbackMetadata
            } = stkCallback;

            // ResultCode 0 means success
            if (ResultCode === 0) {
                // Extract payment details from metadata
                const metadata = {};
                if (CallbackMetadata && CallbackMetadata.Item) {
                    CallbackMetadata.Item.forEach(item => {
                        metadata[item.Name] = item.Value;
                    });
                }

                const paymentDetails = {
                    amount: metadata.Amount,
                    mpesaReceiptNumber: metadata.MpesaReceiptNumber,
                    transactionDate: metadata.TransactionDate,
                    phoneNumber: metadata.PhoneNumber
                };

                // Update booking with payment details
                // The booking reference is in the metadata or we need to track it
                return {
                    success: true,
                    status: 'completed',
                    paymentDetails,
                    message: 'Payment successful'
                };

            } else {
                // Payment failed
                return {
                    success: false,
                    status: 'failed',
                    resultCode: ResultCode,
                    message: ResultDesc,
                    checkoutRequestID: CheckoutRequestID
                };
            }

        } catch (error) {
            console.error('Callback handling error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Process booking payment with M-Pesa
     * 
     * @param {string} bookingId - Booking ID
     * @param {string} phoneNumber - Customer phone number
     * @returns {Object} Payment initiation result
     */
    async processBookingPayment(bookingId, phoneNumber) {
        try {
            // Get booking details
            const booking = await Booking.findById(bookingId);
            
            if (!booking) {
                throw new Error('Booking not found');
            }

            if (booking.payment.status === 'completed') {
                throw new Error('Booking already paid');
            }

            // Initiate STK Push
            const paymentResult = await this.initiateSTKPush({
                phone: phoneNumber,
                amount: booking.pricing.totalPrice,
                accountReference: booking.bookingReference,
                transactionDesc: `Tour Booking ${booking.bookingReference}`
            });

            if (paymentResult.success) {
                // Update booking with payment transaction details
                booking.payment.transactionId = paymentResult.checkoutRequestID;
                booking.payment.method = 'mpesa';
                booking.payment.status = 'processing';
                await booking.save();

                return {
                    success: true,
                    message: 'Payment initiated. Please check your phone and enter M-Pesa PIN',
                    checkoutRequestID: paymentResult.checkoutRequestID,
                    bookingReference: booking.bookingReference
                };
            } else {
                return {
                    success: false,
                    message: paymentResult.error || 'Failed to initiate payment'
                };
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
     * Update booking after successful payment
     * 
     * @param {string} checkoutRequestID - Checkout Request ID
     * @param {Object} paymentDetails - Payment details from callback
     */
    async updateBookingPayment(checkoutRequestID, paymentDetails) {
        try {
            const booking = await Booking.findOne({
                'payment.transactionId': checkoutRequestID
            });

            if (!booking) {
                throw new Error('Booking not found for this transaction');
            }

            // Update payment details
            booking.payment.status = 'completed';
            booking.payment.paidAt = new Date();
            booking.payment.mpesaReceiptNumber = paymentDetails.mpesaReceiptNumber;
            booking.payment.phoneNumber = paymentDetails.phoneNumber;
            booking.status = 'confirmed';

            await booking.save();

            return {
                success: true,
                booking
            };

        } catch (error) {
            console.error('Update booking payment error:', error);
            throw error;
        }
    }
}

module.exports = new MPesaService();
