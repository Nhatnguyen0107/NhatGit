import express from 'express';
import OrderController from '../controllers/order.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();
const controller = new OrderController();

// Protect all routes - require authentication
router.use(authenticate);

// Admin & Staff only routes
router.use(authorize('Admin', 'Staff'));

// GET /api/orders - Get all orders with filtering
router.get(
    '/',
    controller.getAllOrders.bind(controller)
);

// GET /api/orders/statistics - Get order statistics
router.get(
    '/statistics',
    controller.getOrderStatistics.bind(controller)
);

// GET /api/orders/customer/:customerId - Get customer orders
router.get(
    '/customer/:customerId',
    controller.getCustomerOrders.bind(controller)
);

// GET /api/orders/:id - Get order details by ID
router.get(
    '/:id',
    controller.getOrderById.bind(controller)
);

// PUT /api/orders/:id/status - Update order status
router.put(
    '/:id/status',
    controller.updateOrderStatus.bind(controller)
);

// PUT /api/orders/:id/payment - Update payment status
router.put(
    '/:id/payment',
    controller.updatePaymentStatus.bind(controller)
);

export default router;
