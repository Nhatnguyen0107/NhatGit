import CheckoutService from '../services/checkout.service.js';

class CheckoutController {
    constructor() {
        this.service = new CheckoutService();
    }

    async checkout(req, res) {
        try {
            const userId = req.user.id;
            const checkoutData = req.body;

            const order = await this.service.checkout(
                userId,
                checkoutData
            );

            res.status(201).json({
                success: true,
                message: 'Order placed successfully',
                data: { order }
            });
        } catch (error) {
            console.error('❌ Checkout error:', error);

            const statusCode =
                error.message === 'Shipping address is required' ||
                    error.message.includes('Insufficient stock') ||
                    error.message === 'Cart is empty'
                    ? 400
                    : error.message === 'Customer profile not found'
                        ? 404
                        : 500;

            res.status(statusCode).json({
                success: false,
                message: error.message || 'Checkout failed',
                error: error.message
            });
        }
    }

    async validateCheckout(req, res) {
        try {
            const userId = req.user.id;
            await this.service.validateCheckout(userId);

            res.json({
                success: true,
                message: 'Cart is valid for checkout'
            });
        } catch (error) {
            console.error('❌ Validate checkout error:', error);

            res.status(400).json({
                success: false,
                message: error.message ||
                    'Cart validation failed',
                error: error.message
            });
        }
    }
}

export default CheckoutController;
