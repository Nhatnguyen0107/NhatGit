import express from 'express';
import CustomerController from '../controllers/customer.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();
const controller = new CustomerController();

// Protect all routes - require authentication
router.use(authenticate);

// Admin only routes
router.use(authorize('Admin'));

// GET /api/customers - Get all customers with filtering
router.get(
    '/',
    controller.getAllCustomers.bind(controller)
);

// GET /api/customers/statistics - Get customer statistics
router.get(
    '/statistics',
    controller.getCustomerStatistics.bind(controller)
);

// GET /api/customers/search/by-user - Search by user info
router.get(
    '/search/by-user',
    controller.searchCustomersByUser.bind(controller)
);

// GET /api/customers/user/:userId - Get customer by user ID
router.get(
    '/user/:userId',
    controller.getCustomerByUserId.bind(controller)
);

// GET /api/customers/:id - Get customer details by ID
router.get(
    '/:id',
    controller.getCustomerById.bind(controller)
);

// PUT /api/customers/:id - Update customer information
router.put(
    '/:id',
    controller.updateCustomer.bind(controller)
);

export default router;
