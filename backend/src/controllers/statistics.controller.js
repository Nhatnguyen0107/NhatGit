import StatisticsService from '../services/statistics.service.js';

class StatisticsController {
    constructor() {
        this.service = new StatisticsService();
    }

    async getDashboardStats(req, res) {
        try {
            const stats = await this.service.getDashboardStats();
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('❌ Get dashboard stats error:', error);
            res.status(500).json({
                success: false,
                message: error.message ||
                    'Failed to get dashboard stats',
                error: error.message
            });
        }
    }

    async getRevenueStats(req, res) {
        try {
            const { period = 'month', year, month } = req.query;
            const stats = await this.service.getRevenueStats(
                period,
                year,
                month
            );
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('❌ Get revenue stats error:', error);
            res.status(500).json({
                success: false,
                message: error.message ||
                    'Failed to get revenue stats',
                error: error.message
            });
        }
    }

    async getTopProducts(req, res) {
        try {
            const { limit = 10 } = req.query;
            const products = await this.service.getTopProducts(
                parseInt(limit)
            );
            res.json({
                success: true,
                data: products
            });
        } catch (error) {
            console.error('❌ Get top products error:', error);
            res.status(500).json({
                success: false,
                message: error.message ||
                    'Failed to get top products',
                error: error.message
            });
        }
    }

    async getLowStockProducts(req, res) {
        try {
            const { threshold = 10 } = req.query;
            const products = await this.service.getLowStockProducts(
                parseInt(threshold)
            );
            res.json({
                success: true,
                data: products
            });
        } catch (error) {
            console.error('❌ Get low stock products error:', error);
            res.status(500).json({
                success: false,
                message: error.message ||
                    'Failed to get low stock products',
                error: error.message
            });
        }
    }

    async getCategoryStats(req, res) {
        try {
            const stats = await this.service.getCategoryStats();
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('❌ Get category stats error:', error);
            res.status(500).json({
                success: false,
                message: error.message ||
                    'Failed to get category stats',
                error: error.message
            });
        }
    }

    async getOrderStatusStats(req, res) {
        try {
            const stats = await this.service.getOrderStatusStats();
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('❌ Get order status stats error:', error);
            res.status(500).json({
                success: false,
                message: error.message ||
                    'Failed to get order status stats',
                error: error.message
            });
        }
    }

    async getTopCustomers(req, res) {
        try {
            const { limit = 10 } = req.query;
            const customers = await this.service.getTopCustomers(
                parseInt(limit)
            );
            res.json({
                success: true,
                data: customers
            });
        } catch (error) {
            console.error('❌ Get top customers error:', error);
            res.status(500).json({
                success: false,
                message: error.message ||
                    'Failed to get top customers',
                error: error.message
            });
        }
    }
}

export default StatisticsController;
