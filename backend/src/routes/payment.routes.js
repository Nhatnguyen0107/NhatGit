import express from 'express';
import PaymentController from '../controllers/payment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();
const controller = new PaymentController();

// PayOS routes
router.post('/payos/create',
    authenticate,
    controller.createPayOSPayment.bind(controller)
);

router.post('/payos/confirm',
    authenticate,
    controller.confirmPayOSPayment.bind(controller)
);

router.post('/payos/webhook',
    controller.handlePayOSWebhook.bind(controller)
);

router.get('/payos/info/:orderCode',
    authenticate,
    controller.getPayOSPaymentInfo.bind(controller)
);

// VNPay routes
router.post('/vnpay/create',
    authenticate,
    controller.createVNPayPayment.bind(controller)
);

router.post('/vnpay/confirm',
    authenticate,
    controller.confirmVNPayPayment.bind(controller)
);

// General payment routes
router.get('/status/:orderId',
    authenticate,
    controller.getPaymentStatus.bind(controller)
);

export default router;