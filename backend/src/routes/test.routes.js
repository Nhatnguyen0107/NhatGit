import express from 'express';
import {
    authenticate,
    authorize
} from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/test/public
 * @desc    Public route - accessible to everyone
 * @access  Public
 */
router.get('/public', (req, res) => {
    res.json({
        success: true,
        message: 'This is a public route',
        data: {
            info: 'Anyone can access this endpoint without authentication'
        }
    });
});

router.get('/protected', authenticate, (req, res) => {
    res.json({
        success: true,
        message: 'This is a protected route',
        data: {
            user: req.user,
            info: 'Only authenticated users can access this'
        }
    });
});

router.get('/admin', authenticate, authorize('Admin'), (req, res) => {
    res.json({
        success: true,
        message: 'Admin only route',
        data: {
            user: req.user,
            info: 'Only Admin role can access this endpoint'
        }
    });
});

router.get(
    '/staff',
    authenticate,
    authorize('Admin', 'Staff'),
    (req, res) => {
        res.json({
            success: true,
            message: 'Staff area',
            data: {
                user: req.user,
                info: 'Admin and Staff roles can access this'
            }
        });
    }
);

router.get(
    '/customer',
    authenticate,
    authorize('Customer', 'Admin', 'Staff'),
    (req, res) => {
        res.json({
            success: true,
            message: 'Customer area',
            data: {
                user: req.user,
                info: 'All authenticated users can access this'
            }
        });
    }
);

export default router;
