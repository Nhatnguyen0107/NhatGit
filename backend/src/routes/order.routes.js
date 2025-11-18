import express from 'express';
import OrderController from '../controllers/order.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();
const controller = new OrderController();

// Protect all routes - require authentication
router.use(authenticate);

// Customer routes (accessible by any authenticated user)
// POST /api/orders - Create new order
router.post(
    '/',
    controller.createOrder.bind(controller)
);

// GET /api/orders/my-orders - Get current user's orders
router.get(
    '/my-orders',
    controller.getMyOrders.bind(controller)
);

// GET /api/orders/:id - Get order details by ID
router.get(
    '/:id',
    controller.getOrderById.bind(controller)
);

// PUT /api/orders/:id/cancel - Cancel order (customer only)
router.put(
    '/:id/cancel',
    controller.cancelOrder.bind(controller)
);

// Admin & Staff only routes
// GET /api/orders - Get all orders with filtering
router.get(
    '/',
    authorize('Admin', 'Staff'),
    controller.getAllOrders.bind(controller)
);

// GET /api/orders/statistics - Get order statistics
router.get(
    '/statistics',
    authorize('Admin', 'Staff'),
    controller.getOrderStatistics.bind(controller)
);

// GET /api/orders/customer/:customerId - Get customer orders
router.get(
    '/customer/:customerId',
    authorize('Admin', 'Staff'),
    controller.getCustomerOrders.bind(controller)
);

// PUT /api/orders/:id/status - Update order status
router.put(
    '/:id/status',
    authorize('Admin', 'Staff'),
    controller.updateOrderStatus.bind(controller)
);

// PUT /api/orders/:id/payment - Update payment status
router.put(
    '/:id/payment',
    authorize('Admin', 'Staff'),
    controller.updatePaymentStatus.bind(controller)
);

export default router;
