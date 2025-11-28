import bcrypt from 'bcrypt';
import db from '../models/index.js';
import {
    generateTokens,
    verifyRefreshToken
} from '../utils/jwt.js';

const { User, Role, Customer } = db;

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email đã được đăng ký'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with Customer role (id: 3)
        const user = await User.create({
            username,
            email,
            phone,
            password: hashedPassword,
            role_id: 3, // Customer role
            is_active: true
        });

        // Split username into firstName and lastName for customer profile
        const nameParts = username.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || firstName;

        // Create customer profile
        await Customer.create({
            user_id: user.id,
            first_name: firstName,
            last_name: lastName,
            phone: phone
        });

        // Generate tokens
        const tokens = generateTokens(user);

        // Get user with role
        const userWithRole = await User.findByPk(user.id, {
            attributes: { exclude: ['password'] },
            include: [
                { model: Role, as: 'role', attributes: ['id', 'name'] },
                {
                    model: Customer,
                    as: 'customer',
                    attributes: ['id', 'first_name', 'last_name', 'phone']
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            data: {
                user: userWithRole,
                ...tokens
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Đăng ký thất bại',
            error: error.message
        });
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user with role
        const user = await User.findOne({
            where: { email },
            include: [
                { model: Role, as: 'role', attributes: ['id', 'name'] },
                {
                    model: Customer,
                    as: 'customer',
                    attributes: ['id', 'first_name', 'last_name']
                }
            ]
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if user is active
        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated. Contact support.'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        await user.update({ last_login: new Date() });

        // Generate tokens
        const tokens = generateTokens(user);

        // Remove password from response
        const userResponse = user.toJSON();
        delete userResponse.password;

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: userResponse,
                ...tokens
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res) => {
    try {
        // In a production app, you would:
        // 1. Blacklist the refresh token in Redis/DB
        // 2. Clear any session data

        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed',
            error: error.message
        });
    }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken: token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(token);

        // Find user
        const user = await User.findByPk(decoded.id, {
            include: [{ model: Role, as: 'role', attributes: ['id', 'name'] }]
        });

        if (!user || !user.is_active) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        // Generate new tokens
        const tokens = generateTokens(user);

        res.json({
            success: true,
            message: 'Token refreshed successfully',
            data: tokens
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired refresh token',
            error: error.message
        });
    }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
            include: [
                { model: Role, as: 'role', attributes: ['id', 'name'] },
                {
                    model: Customer,
                    as: 'customer',
                    attributes: {
                        exclude: ['created_at', 'updated_at']
                    }
                }
            ]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile',
            error: error.message
        });
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, billingAddress,
            shippingAddress } = req.body;

        const user = await User.findByPk(req.user.id, {
            include: [{ model: Customer, as: 'customer' }]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update customer profile if exists
        if (user.customer) {
            await user.customer.update({
                first_name: firstName || user.customer.first_name,
                last_name: lastName || user.customer.last_name,
                phone: phone || user.customer.phone,
                billing_address: billingAddress || user.customer.billing_address,
                shipping_address: shippingAddress ||
                    user.customer.shipping_address
            });
        }

        // Fetch updated user
        const updatedUser = await User.findByPk(user.id, {
            attributes: { exclude: ['password'] },
            include: [
                { model: Role, as: 'role', attributes: ['id', 'name'] },
                { model: Customer, as: 'customer' }
            ]
        });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: { user: updatedUser }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password',
            error: error.message
        });
    }
};

// Admin user management functions
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [
                {
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'name']
                },
                {
                    model: Customer,
                    as: 'customer',
                    attributes: ['first_name', 'last_name', 'phone', 'billing_address']
                }
            ],
            attributes: { exclude: ['password'] },
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
};

export const createUser = async (req, res) => {
    try {
        const { username, email, password, role_id, phone, first_name, last_name } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email đã được đăng ký'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            email,
            phone: phone || '',
            password: hashedPassword,
            role_id: role_id || 3,
            is_active: true
        });

        // Create customer profile if role is customer
        if (role_id === 3) {
            await Customer.create({
                user_id: user.id,
                first_name: username.split(' ')[0],
                last_name: username.split(' ').slice(1).join(' ') || username.split(' ')[0],
                phone: phone || ''
            });
        }

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: { id: user.id, username, email, role_id }
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create user',
            error: error.message
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, role_id, status, customer } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update user data
        const updateData = {
            username,
            email,
            role_id,
            is_active: status === 'active'
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await user.update(updateData);

        // Update customer data if provided
        if (customer && role_id === 3) {
            const customerProfile = await Customer.findOne({ where: { user_id: id } });
            if (customerProfile) {
                await customerProfile.update({
                    phone: customer.phone
                });
            }
        }

        res.json({
            success: true,
            message: 'User updated successfully'
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user',
            error: error.message
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Delete customer profile first if exists
        await Customer.destroy({ where: { user_id: id } });

        // Delete user
        await user.destroy();

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user',
            error: error.message
        });
    }
};

export const registerAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email đã được đăng ký'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin user
        const user = await User.create({
            username,
            email,
            phone: '', // Empty phone for admin
            password: hashedPassword,
            role_id: 1, // Admin role
            is_active: true
        });

        res.status(201).json({
            success: true,
            message: 'Admin user created successfully',
            data: { id: user.id, username, email }
        });
    } catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create admin user',
            error: error.message
        });
    }
};

export const registerStaff = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email đã được đăng ký'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create staff user
        const user = await User.create({
            username,
            email,
            phone: '', // Empty phone for staff
            password: hashedPassword,
            role_id: 2, // Staff role
            is_active: true
        });

        res.status(201).json({
            success: true,
            message: 'Staff user created successfully',
            data: { id: user.id, username, email }
        });
    } catch (error) {
        console.error('Create staff error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create staff user',
            error: error.message
        });
    }
};
