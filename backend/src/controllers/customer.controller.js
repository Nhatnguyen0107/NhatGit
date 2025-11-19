import CustomerService from '../services/customer.service.js';

class CustomerController {
    constructor() {
        this.service = new CustomerService();
    }

    async getAllCustomers(req, res) {
        try {
            const result = await this.service.getAllCustomers(
                req.query
            );
            res.status(200).json({
                success: true,
                data: result.customers,
                pagination: result.pagination
            });
        } catch (error) {
            console.error('❌ Error in getAllCustomers:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get customers',
                error: error.message
            });
        }
    }

    async getCustomerById(req, res) {
        try {
            const includeOrders = req.query.includeOrders === 'true';
            const customer = await this.service.getCustomerById(
                req.params.id,
                includeOrders
            );
            res.status(200).json({
                success: true,
                data: customer
            });
        } catch (error) {
            console.error('❌ Error in getCustomerById:', error);
            if (error.message === 'Customer not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: 'Failed to get customer',
                error: error.message
            });
        }
    }

    async updateCustomer(req, res) {
        try {
            const customer = await this.service.updateCustomer(
                req.params.id,
                req.body
            );

            res.status(200).json({
                success: true,
                message: 'Customer updated successfully',
                data: customer
            });
        } catch (error) {
            console.error('❌ Error in updateCustomer:', error);

            if (error.message === 'Customer not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (
                error.message === 'Phone number already in use' ||
                error.message === 'No valid fields to update'
            ) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Failed to update customer',
                error: error.message
            });
        }
    }

    async getCustomerStatistics(req, res) {
        try {
            const stats =
                await this.service.getCustomerStatistics();
            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error(
                '❌ Error in getCustomerStatistics:',
                error
            );
            res.status(500).json({
                success: false,
                message: 'Failed to get customer statistics',
                error: error.message
            });
        }
    }

    async getCustomerByUserId(req, res) {
        try {
            const customer =
                await this.service.getCustomerByUserId(
                    req.params.userId
                );
            res.status(200).json({
                success: true,
                data: customer
            });
        } catch (error) {
            console.error(
                '❌ Error in getCustomerByUserId:',
                error
            );
            if (error.message === 'Customer not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: 'Failed to get customer',
                error: error.message
            });
        }
    }

    async searchCustomersByUser(req, res) {
        try {
            const result =
                await this.service.searchCustomersByUser(
                    req.query
                );
            res.status(200).json({
                success: true,
                data: result.customers,
                pagination: result.pagination
            });
        } catch (error) {
            console.error(
                '❌ Error in searchCustomersByUser:',
                error
            );
            res.status(500).json({
                success: false,
                message: 'Failed to search customers',
                error: error.message
            });
        }
    }

    async getMyProfile(req, res) {
        try {
            const userId = req.user.id;
            const profile = await this.service.getMyProfile(userId);

            res.status(200).json({
                success: true,
                data: profile
            });
        } catch (error) {
            console.error('❌ Error in getMyProfile:', error);
            if (error.message === 'Customer profile not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: 'Failed to get profile',
                error: error.message
            });
        }
    }

    async updateMyProfile(req, res) {
        try {
            const userId = req.user.id;
            const profile = await this.service.updateMyProfile(
                userId,
                req.body
            );

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: profile
            });
        } catch (error) {
            console.error('❌ Error in updateMyProfile:', error);

            if (error.message === 'Customer profile not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message === 'Phone number already in use') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Failed to update profile',
                error: error.message
            });
        }
    }

    async changePassword(req, res) {
        try {
            const userId = req.user.id;
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password and new password are required'
                });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'New password must be at least 6 characters'
                });
            }

            const result = await this.service.changePassword(
                userId,
                currentPassword,
                newPassword
            );

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            console.error('❌ Error in changePassword:', error);

            if (error.message === 'User not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message === 'Current password is incorrect') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Failed to change password',
                error: error.message
            });
        }
    }

    async uploadAvatar(req, res) {
        try {
            const userId = req.user.id;

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }

            // Generate avatar URL path
            const avatarUrl = `/uploads/avatars/${req.file.filename}`;

            const profile = await this.service.updateAvatar(
                userId,
                avatarUrl
            );

            res.status(200).json({
                success: true,
                message: 'Avatar uploaded successfully',
                data: profile
            });
        } catch (error) {
            console.error('❌ Error in uploadAvatar:', error);

            if (error.message === 'User not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Failed to update avatar',
                error: error.message
            });
        }
    }

    async updateUsername(req, res) {
        try {
            const userId = req.user.id;
            const { username } = req.body;

            if (!username || !username.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Username is required'
                });
            }

            if (username.length < 3) {
                return res.status(400).json({
                    success: false,
                    message: 'Username must be at least 3 characters'
                });
            }

            const profile = await this.service.updateUsername(
                userId,
                username.trim()
            );

            res.status(200).json({
                success: true,
                message: 'Username updated successfully',
                data: profile
            });
        } catch (error) {
            console.error('❌ Error in updateUsername:', error);

            if (error.message === 'User not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message === 'Username already taken') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Failed to update username',
                error: error.message
            });
        }
    }
}

export default CustomerController;
