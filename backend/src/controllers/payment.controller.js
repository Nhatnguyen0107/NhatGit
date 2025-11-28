import PaymentService from '../services/payment.service.js';

class PaymentController {
    constructor() {
        this.paymentService = new PaymentService();
    }

    // VNPay create payment URL
    async createVNPayPayment(req, res) {
        try {
            const { orderId, amount, orderInfo } = req.body;

            if (!orderId || !amount) {
                return res.status(400).json({
                    success: false,
                    message: 'orderId and amount are required'
                });
            }

            const paymentUrl = await this.paymentService.createVNPayPayment({
                orderId,
                amount,
                orderInfo: orderInfo || `Thanh toan don hang ${orderId}`,
                ipAddr: req.ip
            });

            res.json({
                success: true,
                data: { paymentUrl }
            });
        } catch (error) {
            console.error('❌ Create VNPay payment error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create VNPay payment',
                error: error.message
            });
        }
    }

    // VNPay return handler
    async handleVNPayReturn(req, res) {
        try {
            const vnpParams = req.query;
            const result = await this.paymentService.verifyVNPayReturn(vnpParams);

            if (result.success) {
                // Redirect to success page
                res.redirect(`${process.env.FRONTEND_URL}/payment-success?orderId=${result.orderId}&transactionId=${result.transactionId}`);
            } else {
                // Redirect to failure page
                res.redirect(`${process.env.FRONTEND_URL}/payment-failed?orderId=${result.orderId}&message=${result.message}`);
            }
        } catch (error) {
            console.error('❌ VNPay return error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/payment-failed?message=Payment verification failed`);
        }
    }

    // PayPal create payment
    async createPayPalPayment(req, res) {
        try {
            const { orderId, amount, currency = 'USD' } = req.body;

            if (!orderId || !amount) {
                return res.status(400).json({
                    success: false,
                    message: 'orderId and amount are required'
                });
            }

            const approvalUrl = await this.paymentService.createPayPalPayment({
                orderId,
                amount,
                currency
            });

            res.json({
                success: true,
                data: { approvalUrl }
            });
        } catch (error) {
            console.error('❌ Create PayPal payment error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create PayPal payment',
                error: error.message
            });
        }
    }

    // PayPal success handler
    async handlePayPalSuccess(req, res) {
        try {
            const { paymentId, token, PayerID } = req.query;

            const result = await this.paymentService.executePayPalPayment({
                paymentId,
                payerId: PayerID
            });

            if (result.success) {
                res.redirect(`${process.env.FRONTEND_URL}/payment-success?orderId=${result.orderId}&transactionId=${result.transactionId}`);
            } else {
                res.redirect(`${process.env.FRONTEND_URL}/payment-failed?message=${result.message}`);
            }
        } catch (error) {
            console.error('❌ PayPal success error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/payment-failed?message=Payment execution failed`);
        }
    }

    // PayPal cancel handler
    async handlePayPalCancel(req, res) {
        try {
            const { token } = req.query;
            // Log the cancellation if needed
            console.log('PayPal payment cancelled:', token);

            res.redirect(`${process.env.FRONTEND_URL}/payment-cancelled`);
        } catch (error) {
            console.error('❌ PayPal cancel error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/payment-failed?message=Payment cancelled`);
        }
    }

    // Get payment status
    async getPaymentStatus(req, res) {
        try {
            const { orderId } = req.params;
            const payment = await this.paymentService.getPaymentByOrderId(orderId);

            res.json({
                success: true,
                data: payment
            });
        } catch (error) {
            console.error('❌ Get payment status error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get payment status',
                error: error.message
            });
        }
    }

    // VietQR create payment
    async createVietQRPayment(req, res) {
        try {
            const { orderId, amount } = req.body;

            if (!orderId || !amount) {
                return res.status(400).json({
                    success: false,
                    message: 'orderId and amount are required'
                });
            }

            const qrPayment = await this.paymentService.createVietQRPayment(orderId, amount);

            res.json({
                success: true,
                data: qrPayment
            });
        } catch (error) {
            console.error('❌ Create VietQR payment error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create VietQR payment',
                error: error.message
            });
        }
    }

    // VietQR check payment status
    async checkVietQRPayment(req, res) {
        try {
            const { orderId, amount } = req.body;

            if (!orderId || !amount) {
                return res.status(400).json({
                    success: false,
                    message: 'orderId and amount are required'
                });
            }

            const result = await this.paymentService.checkVietQRPayment(orderId, amount);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('❌ Check VietQR payment error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to check payment status',
                error: error.message
            });
        }
    }
}

export default PaymentController;