import crypto from 'crypto';
import querystring from 'querystring';
import PaymentRepository from '../repositories/payment.repository.js';
import OrderRepository from '../repositories/order.repository.js';
import { VNPayUtil } from '../utils/vnpay.util.js';
import { PayPalUtil } from '../utils/paypal.util.js';
import VietQRUtil from '../utils/vietqr.util.js';
import PayOSUtil from '../utils/payos.util.js';
import EmailUtil from '../utils/email.util.js';

class PaymentService {
    constructor() {
        this.paymentRepository = new PaymentRepository();
        this.orderRepository = new OrderRepository();
        this.vnpayUtil = new VNPayUtil();
        this.paypalUtil = new PayPalUtil();
        this.vietqrUtil = new VietQRUtil();
        this.payosUtil = new PayOSUtil();
        this.emailUtil = new EmailUtil();
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

    // PayOS payment methods
    async createPayOSPayment(orderId, amount, description) {
        try {
            // Check if order exists
            const order = await this.orderRepository.findById(orderId);
            if (!order) {
                throw new Error('Order not found');
            }

            // Generate unique order code for mock payment
            const orderCode = Date.now();

            // Save payment record
            const payment = await this.paymentRepository.create({
                order_id: orderId,
                provider: 'payos',
                amount: amount,
                status: 'pending',
                transaction_id: orderCode.toString(),
                provider_response: { mock: true, orderCode }
            });

            // Create mock checkout URL
            const checkoutUrl = `${process.env.FRONTEND_URL}/payment/payos-mock?orderId=${orderId}&orderCode=${orderCode}&amount=${amount}`;

            return {
                success: true,
                payment_id: payment.id,
                checkoutUrl: checkoutUrl,
                orderCode: orderCode
            };
        } catch (error) {
            console.error('❌ Create PayOS payment error:', error);
            throw new Error(`PayOS payment creation failed: ${error.message}`);
        }
    }

    async confirmPayOSPayment(orderId, orderCode) {
        try {
            console.log('🔍 Finding payment for order:', orderId, 'code:', orderCode);

            // Find payment by order_id
            const payment = await this.paymentRepository.findByOrderId(orderId);

            if (!payment) {
                throw new Error('Payment not found');
            }

            console.log('✅ Payment found:', payment.id);

            // Get order details with items
            const order = await this.orderRepository.findById(orderId);
            if (!order) {
                throw new Error('Order not found');
            }

            console.log('✅ Order found:', order.order_number);

            // Update payment status using payment object
            await this.paymentRepository.update(payment, {
                status: 'completed',
                provider_response: {
                    mock: true,
                    confirmed_at: new Date().toISOString()
                }
            });

            console.log('✅ Payment status updated');

            // Update order status
            await this.orderRepository.updateStatus(
                orderId,
                'confirmed',
                'paid'
            );

            console.log('✅ Order status updated');

            // Update order payment_method
            await this.orderRepository.update(order, {
                payment_method: 'payos'
            });

            console.log('✅ Order payment method updated');

            // Send email notification
            try {
                console.log('📧 Starting email notification process...');

                // Import models
                const models = (await import('../models/index.js')).default;

                // Get customer info
                const customer = await models.User.findByPk(order.customer_id);
                console.log('📧 Customer found:', customer ? customer.email : 'No customer');

                // Get order items with product details
                const orderItems = await models.OrderItem.findAll({
                    where: { order_id: orderId },
                    include: [{ model: models.Product, as: 'product' }]
                });
                console.log('📧 Order items found:', orderItems.length);

                const emailData = {
                    order_number: order.order_number,
                    total_amount: order.total_amount,
                    customer_email: customer?.email || process.env.EMAIL_USER,
                    items: orderItems.map(item => ({
                        product_name: item.product?.name || 'Unknown Product',
                        quantity: item.quantity,
                        price: item.unit_price
                    }))
                };

                console.log('📧 Email data prepared:', {
                    to: emailData.customer_email,
                    items_count: emailData.items.length
                });

                console.log('📧 Calling sendPaymentSuccessEmail...');
                await this.emailUtil.sendPaymentSuccessEmail(emailData);
                console.log('✅ Email notification sent successfully!');
            } catch (emailError) {
                console.error('⚠️ Email sending failed:', emailError);
                console.error('⚠️ Error stack:', emailError.stack);
                // Don't throw error, payment still successful
            }

            return {
                success: true,
                message: 'Payment confirmed successfully',
                order_id: orderId,
                order_number: order.order_number
            };
        } catch (error) {
            console.error('❌ Confirm PayOS payment error:', error);
            throw new Error(`Payment confirmation failed: ${error.message}`);
        }
    }

    // VNPay mock payment methods (same as PayOS)
    async createVNPayPayment(orderId, amount, description) {
        try {
            // Check if order exists
            const order = await this.orderRepository.findById(orderId);
            if (!order) {
                throw new Error('Order not found');
            }

            // Generate unique order code for mock payment
            const orderCode = Date.now();

            // Save payment record
            const payment = await this.paymentRepository.create({
                order_id: orderId,
                provider: 'vnpay',
                amount: amount,
                status: 'pending',
                transaction_id: orderCode.toString(),
                provider_response: { mock: true, orderCode }
            });

            // Create mock checkout URL
            const checkoutUrl = `${process.env.FRONTEND_URL}/payment/vnpay-mock?orderId=${orderId}&orderCode=${orderCode}&amount=${amount}`;

            return {
                success: true,
                payment_id: payment.id,
                checkoutUrl: checkoutUrl,
                orderCode: orderCode
            };
        } catch (error) {
            console.error('❌ Create VNPay payment error:', error);
            throw new Error(`VNPay payment creation failed: ${error.message}`);
        }
    }

    async confirmVNPayPayment(orderId, orderCode) {
        try {
            console.log('🔍 Finding VNPay payment for order:', orderId, 'code:', orderCode);

            // Find payment by order_id
            const payment = await this.paymentRepository.findByOrderId(orderId);

            if (!payment) {
                throw new Error('Payment not found');
            }

            console.log('✅ VNPay payment found:', payment.id);

            // Get order details with items
            const order = await this.orderRepository.findById(orderId);
            if (!order) {
                throw new Error('Order not found');
            }

            console.log('✅ Order found:', order.order_number);

            // Update payment status
            await this.paymentRepository.update(payment, {
                status: 'completed',
                provider_response: {
                    mock: true,
                    confirmed_at: new Date().toISOString()
                }
            });

            console.log('✅ VNPay payment status updated');

            // Update order status
            await this.orderRepository.updateStatus(
                orderId,
                'confirmed',
                'paid'
            );

            console.log('✅ Order status updated');

            // Update order payment_method
            await this.orderRepository.update(order, {
                payment_method: 'vnpay'
            });

            console.log('✅ Order payment method updated to vnpay');

            // Send email notification
            try {
                console.log('📧 Starting VNPay email notification...');

                // Import models
                const models = (await import('../models/index.js')).default;

                // Get customer info
                const customer = await models.User.findByPk(order.customer_id);
                console.log('📧 Customer found:', customer ? customer.email : 'No customer');

                if (!customer || !customer.email) {
                    console.log('⚠️ Customer email not found, skipping email');
                } else {
                    // Get order items
                    const orderItems = await models.OrderItem.findAll({
                        where: { order_id: orderId },
                        include: [{
                            model: models.Product,
                            as: 'product'
                        }]
                    });

                    console.log('📧 Order items found:', orderItems.length);

                    // Prepare order data for email
                    const orderData = {
                        order_number: order.order_number,
                        customer_name: customer.full_name || customer.username,
                        customer_email: customer.email,
                        total_amount: order.total_amount,
                        payment_method: 'VNPay',
                        items: orderItems.map(item => ({
                            name: item.product?.name || 'Unknown Product',
                            quantity: item.quantity,
                            price: item.price,
                            subtotal: item.quantity * item.price
                        })),
                        shipping_address: order.shipping_address,
                        created_at: order.created_at
                    };

                    console.log('📧 Sending email to:', customer.email);

                    // Send email
                    const emailResult = await this.emailUtil.sendPaymentSuccessEmail(orderData);

                    if (emailResult.success) {
                        console.log('✅ Email sent successfully');
                    } else {
                        console.log('❌ Email failed:', emailResult.message);
                    }
                }
            } catch (emailError) {
                console.error('❌ Email error:', emailError);
                // Don't throw error, continue with payment confirmation
            }

            return {
                success: true,
                message: 'Payment confirmed successfully',
                order_id: orderId,
                order_number: order.order_number
            };
        } catch (error) {
            console.error('❌ Confirm VNPay payment error:', error);
            throw new Error(`Payment confirmation failed: ${error.message}`);
        }
    }

    async handlePayOSWebhook(webhookData) {
        try {
            // Verify webhook signature
            const isValid = this.payosUtil.verifyWebhookSignature(webhookData);
            if (!isValid) {
                throw new Error('Invalid webhook signature');
            }

            const { orderCode, code, desc, data } = webhookData;

            // Find payment by order code
            const payment = await this.paymentRepository.findOne({
                where: { transaction_id: orderCode.toString() }
            });

            if (!payment) {
                throw new Error('Payment not found');
            }

            // Update payment status based on webhook
            if (code === '00') {
                // Payment successful
                await this.paymentRepository.update(payment.id, {
                    status: 'completed',
                    provider_response: data
                });

                // Update order status
                await this.orderRepository.updateStatus(
                    payment.order_id,
                    'confirmed',
                    'paid'
                );

                return {
                    success: true,
                    message: 'Payment confirmed',
                    order_id: payment.order_id
                };
            } else {
                // Payment failed or cancelled
                await this.paymentRepository.update(payment.id, {
                    status: code === '01' ? 'cancelled' : 'failed',
                    provider_response: { code, desc, data }
                });

                return {
                    success: false,
                    message: desc || 'Payment failed',
                    order_id: payment.order_id
                };
            }
        } catch (error) {
            console.error('❌ Handle PayOS webhook error:', error);
            throw new Error(`Webhook handling failed: ${error.message}`);
        }
    }

    async getPayOSPaymentInfo(orderCode) {
        try {
            const paymentInfo = await this.payosUtil.getPaymentInfo(orderCode);
            return paymentInfo;
        } catch (error) {
            console.error('❌ Get PayOS payment info error:', error);
            throw new Error(`Get payment info failed: ${error.message}`);
        }
    }
}

export default PaymentService;