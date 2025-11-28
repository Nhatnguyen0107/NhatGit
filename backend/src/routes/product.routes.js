import express from 'express';
import ProductController from '../controllers/product.controller.js';
import { authenticate, authorize } from
    '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();
const controller = new ProductController();

router.get('/', controller.getAllProducts.bind(controller));

router.get('/:id', controller.getProductById.bind(controller));

// Add reviews endpoint as specified in the document
router.get('/:id/reviews', controller.getProductReviews.bind(controller));

router.get(
    '/category/:categoryId',
    controller.getProductsByCategory.bind(controller)
);

router.post(
    '/',
    authenticate,
    authorize('Admin'),
    upload.array('images', 5),
    controller.createProduct.bind(controller)
);

router.put(
    '/:id',
    authenticate,
    authorize('Admin'),
    upload.array('images', 5),
    controller.updateProduct.bind(controller)
);

router.delete(
    '/:id',
    authenticate,
    authorize('Admin'),
    controller.deleteProduct.bind(controller)
);

export default router;
