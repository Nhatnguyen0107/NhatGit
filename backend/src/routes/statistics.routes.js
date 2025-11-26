import express from 'express';
import StatisticsController from
    '../controllers/statistics.controller.js';
import { authenticate, authorize } from
    '../middlewares/auth.middleware.js';

const router = express.Router();
const controller = new StatisticsController();

// Tất cả routes đều yêu cầu Admin
router.use(authenticate, authorize('Admin'));

// Dashboard stats
router.get(
    '/dashboard',
    controller.getDashboardStats.bind(controller)
);

// Revenue stats
router.get(
    '/revenue',
    controller.getRevenueStats.bind(controller)
);

// Top selling products
router.get(
    '/top-products',
    controller.getTopProducts.bind(controller)
);

// Low stock products
router.get(
    '/low-stock',
    controller.getLowStockProducts.bind(controller)
);

// Category statistics
router.get(
    '/categories',
    controller.getCategoryStats.bind(controller)
);

// Order status statistics
router.get(
    '/orders/status',
    controller.getOrderStatusStats.bind(controller)
);

// Top customers
router.get(
    '/top-customers',
    controller.getTopCustomers.bind(controller)
);

export default router;
