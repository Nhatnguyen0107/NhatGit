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
}

export default CustomerController;
