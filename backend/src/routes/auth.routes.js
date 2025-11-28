import express from 'express';
import {
    register,
    login,
    logout,
    refreshToken,
    getProfile,
    updateProfile,
    changePassword,
    // Admin user management functions
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    registerAdmin,
    registerStaff
} from '../controllers/auth.controller.js';
import {
    authenticate,
    checkUserActive,
    authorize
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

// Admin routes for user management
router.get('/users', authenticate, authorize('Admin'), getAllUsers);
router.post('/users', authenticate, authorize('Admin'), createUser);
router.put('/users/:id', authenticate, authorize('Admin'), updateUser);
router.delete('/users/:id', authenticate, authorize('Admin'), deleteUser);
router.post('/register-admin', authenticate, authorize('Admin'), registerAdmin);
router.post('/register-staff', authenticate, authorize('Admin'), registerStaff);

export default router;
