import express from 'express';
import CartController from '../controllers/cart.controller.js';
import { authenticate, authorize } from
    '../middlewares/auth.middleware.js';

const router = express.Router();
const controller = new CartController();

router.use(authenticate);

router.get('/', controller.getCart.bind(controller));

router.post('/', controller.addToCart.bind(controller));

router.put('/:id', controller.updateCartItem.bind(controller));

router.delete('/:id', controller.removeFromCart.bind(controller));

router.delete('/', controller.clearCart.bind(controller));

export default router;
