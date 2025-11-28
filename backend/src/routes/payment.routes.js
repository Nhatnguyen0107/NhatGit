import express from 'express';
import PaymentController from '../controllers/payment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();
const controller = new PaymentController();

// VNPay routes
router.post('/vnpay/create',
    authenticate,
    controller.createVNPayPayment.bind(controller)
);

router.get('/vnpay/return',
    controller.handleVNPayReturn.bind(controller)
);

// PayPal routes
router.post('/paypal/create',
    authenticate,
    controller.createPayPalPayment.bind(controller)
);

router.get('/paypal/success',
    controller.handlePayPalSuccess.bind(controller)
);

router.get('/paypal/cancel',
    controller.handlePayPalCancel.bind(controller)
);

// VietQR routes
router.post('/vietqr/create',
    authenticate,
    controller.createVietQRPayment.bind(controller)
);

router.post('/vietqr/check',
    authenticate,
    controller.checkVietQRPayment.bind(controller)
);

// General payment routes
router.get('/status/:orderId',
    authenticate,
    controller.getPaymentStatus.bind(controller)
);

export default router;