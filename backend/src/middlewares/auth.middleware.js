import { verifyAccessToken } from '../utils/jwt.js';
import db from '../models/index.js';

const { User, Role } = db;

/**
 * Authenticate user by verifying JWT token
 * Attaches user data to req.user
 */
export const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Authorization denied.'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = verifyAccessToken(token);

        // Attach user info to request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role_id: decoded.role_id
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token. Authorization denied.',
            error: error.message
        });
    }
};

/**
 * Authorize user based on roles
 * @param {Array<String>} allowedRoles - Array of role names 
 * (e.g., ['Admin', 'Staff'])
 * @returns {Function} Middleware function
 */
export const authorize = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            // Get user with role
            const user = await User.findByPk(req.user.id, {
                include: [{ model: Role, as: 'role', attributes: ['name'] }]
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Check if user's role is in allowed roles
            const userRole = user.role.name;

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Required roles: 
                    ${allowedRoles.join(', ')}`
                });
            }

            // Attach full user data to request
            req.user.role = userRole;
            next();
        } catch (error) {
            console.error('Authorization error:', error);
            return res.status(500).json({
                success: false,
                message: 'Authorization failed',
                error: error.message
            });
        }
    };
};

/**
 * Check if user is active
 */
export const checkUserActive = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['is_active']
        });

        if (!user || !user.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated. Contact support.'
            });
        }

        next();
    } catch (error) {
        console.error('Check user active error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to verify user status',
            error: error.message
        });
    }
};

/**
 * Optional authentication - attaches user if token exists, 
 * but doesn't fail if no token
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = verifyAccessToken(token);

            req.user = {
                id: decoded.id,
                email: decoded.email,
                role_id: decoded.role_id
            };
        }

        next();
    } catch (error) {
        // Token is invalid but we don't fail - just continue without user
        next();
    }
};
