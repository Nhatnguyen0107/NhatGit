import OrderService from '../services/order.service.js';
import CheckoutService from '../services/checkout.service.js';

class OrderController {
    constructor() {
        this.service = new OrderService();
        this.checkoutService = new CheckoutService();
    }

    async createOrder(req, res) {
        try {
            const userId = req.user.id;
            const orderData = req.body;

            console.log('📦 Creating order for user:', userId);
            console.log('📦 Order data:', orderData);

            const order = await this.checkoutService.checkout(
                userId,
                orderData
            );

            res.status(201).json({
                success: true,
                message: 'Order placed successfully',
                data: { order }
            });
        } catch (error) {
            console.error('❌ Create order error:', error);

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
                message: error.message || 'Order creation failed',
                error: error.message
            });
        }
    }

    async getMyOrders(req, res) {
        try {
            const userId = req.user.id;
            const result = await this.service.getMyOrders(
                userId,
                req.query
            );

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('❌ Error in getMyOrders:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get orders',
                error: error.message
            });
        }
    }

    async cancelOrder(req, res) {
        try {
            const userId = req.user.id;
            const orderId = req.params.id;

            const order = await this.service.cancelOrder(
                userId,
                orderId,
                req.body.reason
            );

            res.status(200).json({
                success: true,
                message: 'Order cancelled successfully',
                data: order
            });
        } catch (error) {
            console.error('❌ Error in cancelOrder:', error);

            if (
                error.message === 'Order not found' ||
                error.message === 'Customer profile not found' ||
                error.message === 'Unauthorized'
            ) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (
                error.message.includes('Cannot cancel') ||
                error.message.includes('can only be cancelled')
            ) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Failed to cancel order',
                error: error.message
            });
        }
    }

    async getAllOrders(req, res) {
        try {
            const result = await this.service.getAllOrders(
                req.query
            );
            res.status(200).json({
                success: true,
                data: result.orders,
                pagination: result.pagination
            });
        } catch (error) {
            console.error('❌ Error in getAllOrders:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get orders',
                error: error.message
            });
        }
    }

    async getOrderById(req, res) {
        try {
            const order = await this.service.getOrderById(
                req.params.id
            );
            res.status(200).json({
                success: true,
                data: order
            });
        } catch (error) {
            console.error('❌ Error in getOrderById:', error);
            if (error.message === 'Order not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: 'Failed to get order',
                error: error.message
            });
        }
    }

    async updateOrderStatus(req, res) {
        try {
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Status is required'
                });
            }

            const order = await this.service.updateOrderStatus(
                req.params.id,
                status
            );

            res.status(200).json({
                success: true,
                message: 'Order status updated successfully',
                data: order
            });
        } catch (error) {
            console.error(
                '❌ Error in updateOrderStatus:',
                error
            );

            if (error.message === 'Order not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (
                error.message.includes('Invalid status') ||
                error.message.includes('Cannot update') ||
                error.message.includes('Cannot change')
            ) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Failed to update order status',
                error: error.message
            });
        }
    }

    async updatePaymentStatus(req, res) {
        try {
            const { payment_status } = req.body;

            if (!payment_status) {
                return res.status(400).json({
                    success: false,
                    message: 'Payment status is required'
                });
            }

            const order =
                await this.service.updatePaymentStatus(
                    req.params.id,
                    payment_status
                );

            res.status(200).json({
                success: true,
                message: 'Payment status updated successfully',
                data: order
            });
        } catch (error) {
            console.error(
                '❌ Error in updatePaymentStatus:',
                error
            );

            if (error.message === 'Order not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (
                error.message.includes(
                    'Invalid payment status'
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Failed to update payment status',
                error: error.message
            });
        }
    }

    async getOrderStatistics(req, res) {
        try {
            const stats =
                await this.service.getOrderStatistics();
            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error(
                '❌ Error in getOrderStatistics:',
                error
            );
            res.status(500).json({
                success: false,
                message: 'Failed to get order statistics',
                error: error.message
            });
        }
    }

    async getCustomerOrders(req, res) {
        try {
            const customerId = req.params.customerId;
            const result =
                await this.service.getCustomerOrders(
                    customerId,
                    req.query
                );

            res.status(200).json({
                success: true,
                data: result.orders,
                pagination: result.pagination
            });
        } catch (error) {
            console.error(
                '❌ Error in getCustomerOrders:',
                error
            );
            res.status(500).json({
                success: false,
                message: 'Failed to get customer orders',
                error: error.message
            });
        }
    }
}

export default OrderController;
