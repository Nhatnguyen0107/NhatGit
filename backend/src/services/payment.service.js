import crypto from 'crypto';
import querystring from 'querystring';
import PaymentRepository from '../repositories/payment.repository.js';
import OrderRepository from '../repositories/order.repository.js';
import { VNPayUtil } from '../utils/vnpay.util.js';
import { PayPalUtil } from '../utils/paypal.util.js';
import VietQRUtil from '../utils/vietqr.util.js';

class PaymentService {
    constructor() {
        this.paymentRepository = new PaymentRepository();
        this.orderRepository = new OrderRepository();
        this.vnpayUtil = new VNPayUtil();
        this.paypalUtil = new PayPalUtil();
        this.vietqrUtil = new VietQRUtil();
    }

    // VNPay payment creation
    async createVNPayPayment(data) {
        const { orderId, amount, orderInfo, ipAddr } = data;

        // Check if order exists
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        // Create VNPay parameters
        const vnpParams = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: process.env.VNP_TMNCODE,
            vnp_Amount: amount * 100, // VNPay expects amount in VND cents
            vnp_CreateDate: this.getVNPayDateTime(),
            vnp_CurrCode: 'VND',
            vnp_IpAddr: ipAddr,
            vnp_Locale: 'vn',
            vnp_OrderInfo: orderInfo,
            vnp_OrderType: 'other',
            vnp_ReturnUrl: process.env.VNP_RETURNURL,
            vnp_TxnRef: orderId
        };

        // Sort parameters and create query string
        const sortedParams = this.sortObject(vnpParams);
        const queryString = querystring.stringify(sortedParams);

        // Create secure hash
        const secureHash = crypto
            .createHmac('sha512', process.env.VNP_HASHSECRET)
            .update(queryString)
            .digest('hex');

        sortedParams.vnp_SecureHash = secureHash;

        const paymentUrl = process.env.VNP_URL + '?' + querystring.stringify(sortedParams);

        // Save payment record
        await this.paymentRepository.create({
            order_id: orderId,
            provider: 'vnpay',
            amount: amount,
            status: 'pending',
            response_data: vnpParams
        });

        return paymentUrl;
    }

    // Verify VNPay return
    async verifyVNPayReturn(vnpParams) {
        const secureHash = vnpParams.vnp_SecureHash;
        delete vnpParams.vnp_SecureHash;
        delete vnpParams.vnp_SecureHashType;

        const sortedParams = this.sortObject(vnpParams);
        const queryString = querystring.stringify(sortedParams);

        const calculatedHash = crypto
            .createHmac('sha512', process.env.VNP_HASHSECRET)
            .update(queryString)
            .digest('hex');

        if (secureHash !== calculatedHash) {
            throw new Error('Invalid signature');
        }

        const orderId = vnpParams.vnp_TxnRef;
        const responseCode = vnpParams.vnp_ResponseCode;
        const transactionId = vnpParams.vnp_TransactionNo;
        const amount = parseInt(vnpParams.vnp_Amount) / 100;

        let status = 'failed';
        let success = false;
        let message = 'Payment failed';

        if (responseCode === '00') {
            status = 'completed';
            success = true;
            message = 'Payment successful';

            // Update order status
            await this.orderRepository.updateStatus(orderId, 'paid');
        }

        // Update payment record
        await this.paymentRepository.updateByOrderId(orderId, {
            status: status,
            transaction_id: transactionId,
            response_data: vnpParams
        });

        return {
            success,
            orderId,
            transactionId,
            amount,
            message
        };
    }

    // PayPal payment creation
    async createPayPalPayment(data) {
        const { orderId, amount, currency } = data;

        // Check if order exists
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        const payment = await this.paypalUtil.createPayment({
            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },
            redirect_urls: {
                return_url: process.env.PAYPAL_RETURN_URL,
                cancel_url: process.env.PAYPAL_CANCEL_URL
            },
            transactions: [{
                item_list: {
                    items: [{
                        name: `Order ${orderId}`,
                        sku: orderId,
                        price: amount,
                        currency: currency,
                        quantity: 1
                    }]
                },
                amount: {
                    currency: currency,
                    total: amount
                },
                description: `Payment for order ${orderId}`
            }]
        });

        // Save payment record
        await this.paymentRepository.create({
            order_id: orderId,
            provider: 'paypal',
            amount: amount,
            status: 'pending',
            response_data: payment
        });

        // Get approval URL
        const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
        return approvalUrl;
    }

    // Execute PayPal payment
    async executePayPalPayment(data) {
        const { paymentId, payerId } = data;

        const execution = await this.paypalUtil.executePayment(paymentId, {
            payer_id: payerId
        });

        const orderId = execution.transactions[0].item_list.items[0].sku;
        let status = 'failed';
        let success = false;
        let message = 'Payment failed';

        if (execution.state === 'approved') {
            status = 'completed';
            success = true;
            message = 'Payment successful';

            // Update order status
            await this.orderRepository.updateStatus(orderId, 'paid');
        }

        // Update payment record
        await this.paymentRepository.updateByOrderId(orderId, {
            status: status,
            transaction_id: paymentId,
            response_data: execution
        });

        return {
            success,
            orderId,
            transactionId: paymentId,
            message
        };
    }

    // Get payment by order ID
    async getPaymentByOrderId(orderId) {
        return await this.paymentRepository.findByOrderId(orderId);
    }

    // Helper methods
    sortObject(obj) {
        const sorted = {};
        const str = [];
        let key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
        }
        return sorted;
    }

    getVNPayDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }

    // VietQR payment methods
    async createVietQRPayment(orderId, amount) {
        try {
            // Check if order exists
            const order = await this.orderRepository.findById(orderId);
            if (!order) {
                throw new Error('Order not found');
            }

            // Generate QR code data
            const qrData = await this.vietqrUtil.generateQRCode(amount, orderId);

            // Save payment record
            const payment = await this.paymentRepository.create({
                order_id: orderId,
                provider: 'vietqr',
                amount: amount,
                status: 'pending',
                provider_response: qrData
            });

            return {
                success: true,
                payment_id: payment.id,
                qr_code: qrData.qr_code,
                qr_image_url: this.vietqrUtil.generateQRImageUrl(amount, orderId),
                bank_info: {
                    bank_name: qrData.bank_name,
                    account_no: qrData.account_no,
                    account_name: qrData.account_name
                },
                amount: amount,
                content: qrData.content
            };
        } catch (error) {
            console.error('❌ Create VietQR payment error:', error);
            throw new Error(`VietQR payment creation failed: ${error.message}`);
        }
    }

    async checkVietQRPayment(orderId, amount) {
        try {
            const result = await this.vietqrUtil.checkPayment(orderId, amount);

            if (result.success) {
                // Update payment status
                await this.paymentRepository.updateByOrderId(orderId, {
                    status: 'completed',
                    transaction_id: result.transaction?.id,
                    provider_response: result.transaction
                });

                // Update order status
                await this.orderRepository.updateStatus(orderId, 'confirmed', 'paid');

                return {
                    success: true,
                    message: 'Payment confirmed',
                    transaction: result.transaction
                };
            }

            return {
                success: false,
                message: result.message || 'Payment not found'
            };
        } catch (error) {
            console.error('❌ Check VietQR payment error:', error);
            throw new Error(`Payment check failed: ${error.message}`);
        }
    }
}

export default PaymentService;