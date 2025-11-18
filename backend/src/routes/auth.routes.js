import express from 'express';
import {
    register,
    login,
    logout,
    refreshToken,
    getProfile,
    updateProfile,
    changePassword
} from '../controllers/auth.controller.js';
import {
    authenticate,
    checkUserActive
} from '../middlewares/auth.middleware.js';
import {
    validateRegister,
    validateLogin,
    validateRefreshToken,
    validateChangePassword,
    validateProfileUpdate
} from '../middlewares/validation.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', authenticate, checkUserActive, logout);
router.post('/refresh', validateRefreshToken, refreshToken);
router.get('/profile', authenticate, checkUserActive, getProfile);
router.put(
    '/profile',
    authenticate,
    checkUserActive,
    validateProfileUpdate,
    updateProfile
);
router.put(
    '/change-password',
    authenticate,
    checkUserActive,
    validateChangePassword,
    changePassword
);

export default router;
