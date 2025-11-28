import express from 'express';
import ReviewController from '../controllers/review.controller.js';
import { authenticate, authorize } from
    '../middlewares/auth.middleware.js';

const router = express.Router();
const controller = new ReviewController();

// Public routes
router.get(
    '/product/:productId',
    controller.getProductReviews.bind(controller)
);

// Check if current user has reviewed a product
router.get(
    '/check/:productId',
    authenticate,
    controller.checkUserReview.bind(controller)
);

// Protected routes - Customer
router.post(
    '/',
    authenticate,
    controller.createReview.bind(controller)
);

router.get(
    '/customer/:customerId',
    authenticate,
    controller.getCustomerReviews.bind(controller)
);

// Admin routes
router.get(
    '/',
    authenticate,
    authorize('Admin'),
    controller.getAllReviews.bind(controller)
);

router.get(
    '/:id',
    authenticate,
    authorize('Admin'),
    controller.getReviewById.bind(controller)
);

router.put(
    '/:id',
    authenticate,
    authorize('Admin'),
    controller.updateReview.bind(controller)
);

router.delete(
    '/:id',
    authenticate,
    authorize('Admin'),
    controller.deleteReview.bind(controller)
);

router.patch(
    '/:id/toggle-visibility',
    authenticate,
    authorize('Admin'),
    controller.toggleVisibility.bind(controller)
);

export default router;
