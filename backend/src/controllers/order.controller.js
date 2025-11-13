import OrderService from '../services/order.service.js';

class OrderController {
    constructor() {
        this.service = new OrderService();
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
