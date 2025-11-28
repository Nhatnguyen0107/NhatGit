import express from 'express';
import CheckoutController from '../controllers/checkout.controller.js';
import { authenticate, authorize } from
    '../middlewares/auth.middleware.js';

const router = express.Router();
const controller = new CheckoutController();

router.use(authenticate);
router.use(authorize('Customer'));

router.post('/', controller.checkout.bind(controller));

router.get('/validate',
    controller.validateCheckout.bind(controller));

export default router;
