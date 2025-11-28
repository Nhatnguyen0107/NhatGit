import { body, validationResult } from 'express-validator';

/**
 * Handle validation errors
 */
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }

    next();
};

/**
 * Validate registration input
 */
export const validateRegister = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Tên người dùng không được để trống')
        .isLength({ min: 2, max: 100 })
        .withMessage('Tên người dùng phải từ 2 đến 100 ký tự'),

    body('email')
        .isEmail()
        .withMessage('Email không hợp lệ')
        .normalizeEmail(),

    body('phone')
        .notEmpty()
        .withMessage('Số điện thoại không được để trống')
        .matches(/^[0-9]{10,11}$/)
        .withMessage('Số điện thoại phải có 10-11 chữ số'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),

    handleValidationErrors
];

/**
 * Validate login input
 */
export const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    handleValidationErrors
];

/**
 * Validate refresh token
 */
export const validateRefreshToken = [
    body('refreshToken')
        .notEmpty()
        .withMessage('Refresh token is required'),

    handleValidationErrors
];

/**
 * Validate change password
 */
export const validateChangePassword = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),

    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage(
            'Password must contain uppercase, lowercase, and number'
        ),

    body('newPassword')
        .custom((value, { req }) => value !== req.body.currentPassword)
        .withMessage('New password must be different from current password'),

    handleValidationErrors
];

/**
 * Validate profile update
 */
export const validateProfileUpdate = [
    body('firstName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),

    body('lastName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),

    body('phone')
        .optional()
        .matches(/^[+]?[\d\s-()]+$/)
        .withMessage('Please provide a valid phone number'),

    handleValidationErrors
];
