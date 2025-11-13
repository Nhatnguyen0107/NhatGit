import express from 'express';
import CategoryController from '../controllers/category.controller.js';
import { authenticate, authorize } from
    '../middlewares/auth.middleware.js';

const router = express.Router();
const controller = new CategoryController();

router.get('/', controller.getAllCategories.bind(controller));

router.get('/:id', controller.getCategoryById.bind(controller));

router.post(
    '/',
    authenticate,
    authorize('Admin'),
    controller.createCategory.bind(controller)
);

router.put(
    '/:id',
    authenticate,
    authorize('Admin'),
    controller.updateCategory.bind(controller)
);

router.delete(
    '/:id',
    authenticate,
    authorize('Admin'),
    controller.deleteCategory.bind(controller)
);

export default router;
