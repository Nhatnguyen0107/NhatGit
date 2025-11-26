import db from '../models/index.js';
import { Op } from 'sequelize';

class StatisticsService {
    async getDashboardStats() {
        try {
            const totalUsers = await db.Customer.count();
            const totalProducts = await db.Product.count();
            const totalCategories = await db.Category.count();
            const totalOrders = await db.Order.count();

            const orders = await db.Order.findAll({
                attributes: ['total_amount', 'status'],
                raw: true
            });

            const totalRevenue = orders.reduce(
                (sum, order) => sum + (parseFloat(order.total_amount) || 0),
                0
            );

            const pendingOrders = orders.filter(
                o => o.status === 'pending' || o.status === 'processing'
            ).length;

            const completedOrders = orders.filter(
                o => o.status === 'delivered'
            ).length;

            return {
                totalUsers,
                totalProducts,
                totalCategories,
                totalOrders,
                totalRevenue,
                pendingOrders,
                completedOrders,
                averageOrderValue: totalOrders > 0
                    ? totalRevenue / totalOrders
                    : 0
            };
        } catch (error) {
            console.error('getDashboardStats error:', error);
            return {
                totalUsers: 0,
                totalProducts: 0,
                totalCategories: 0,
                totalOrders: 0,
                totalRevenue: 0,
                pendingOrders: 0,
                completedOrders: 0,
                averageOrderValue: 0
            };
        }
    }

    async getRevenueStats(period = 'month', year, month) {
        const currentYear = year || new Date().getFullYear();
        const currentMonth = month || new Date().getMonth() + 1;

        let dateFormat, groupBy, startDate, endDate;

        if (period === 'year') {
            // Thống kê theo tháng trong năm
            dateFormat = '%Y-%m';
            startDate = new Date(currentYear, 0, 1);
            endDate = new Date(currentYear, 11, 31, 23, 59, 59);
        } else if (period === 'month') {
            // Thống kê theo ngày trong tháng
            dateFormat = '%Y-%m-%d';
            startDate = new Date(currentYear, currentMonth - 1, 1);
            endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59);
        } else {
            // Thống kê theo giờ trong ngày
            dateFormat = '%Y-%m-%d %H:00:00';
            startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date();
            endDate.setHours(23, 59, 59, 999);
        }

        const stats = await db.Order.findAll({
            attributes: [
                [
                    db.sequelize.fn(
                        'DATE_FORMAT',
                        db.sequelize.col('created_at'),
                        dateFormat
                    ),
                    'date'
                ],
                [
                    db.sequelize.fn('COUNT', db.sequelize.col('id')),
                    'orderCount'
                ],
                [
                    db.sequelize.fn(
                        'SUM',
                        db.sequelize.col('total_amount')
                    ),
                    'revenue'
                ]
            ],
            where: {
                created_at: {
                    [Op.between]: [startDate, endDate]
                },
                status: {
                    [Op.ne]: 'cancelled'
                }
            },
            group: [
                db.sequelize.fn(
                    'DATE_FORMAT',
                    db.sequelize.col('created_at'),
                    dateFormat
                )
            ],
            order: [[db.sequelize.literal('date'), 'ASC']],
            raw: true
        });

        return {
            period,
            year: currentYear,
            month: currentMonth,
            data: stats
        };
    }

    async getTopProducts(limit = 10) {
        try {
            // Use raw query for better performance
            const results = await db.sequelize.query(`
                SELECT 
                    p.id as product_id,
                    p.name,
                    p.price,
                    p.image_url,
                    p.stock_quantity,
                    c.name as category,
                    SUM(oi.quantity) as totalSold,
                    SUM(oi.subtotal) as totalRevenue
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                LEFT JOIN categories c ON p.category_id = c.id
                GROUP BY p.id
                ORDER BY totalSold DESC
                LIMIT :limit
            `, {
                replacements: { limit: parseInt(limit) },
                type: db.sequelize.QueryTypes.SELECT
            });

            return results.map(item => ({
                product_id: item.product_id,
                name: item.name,
                category: item.category,
                price: parseFloat(item.price),
                image_url: item.image_url,
                stock_quantity: parseInt(item.stock_quantity),
                totalSold: parseInt(item.totalSold),
                totalRevenue: parseFloat(item.totalRevenue)
            }));
        } catch (error) {
            console.error('getTopProducts error:', error);
            return [];
        }
    }

    async getLowStockProducts(threshold = 10) {
        const products = await db.Product.findAll({
            where: {
                stock_quantity: {
                    [Op.lte]: threshold
                },
                is_active: true
            },
            include: [
                {
                    model: db.Category,
                    as: 'category',
                    attributes: ['name']
                }
            ],
            order: [['stock_quantity', 'ASC']],
            limit: 20
        });

        return products;
    }

    async getCategoryStats() {
        try {
            // Use raw query for better performance
            const results = await db.sequelize.query(`
                SELECT 
                    c.id,
                    c.name,
                    COUNT(DISTINCT p.id) as productCount,
                    COALESCE(SUM(oi.subtotal), 0) as revenue
                FROM categories c
                LEFT JOIN products p ON c.id = p.category_id
                LEFT JOIN order_items oi ON p.id = oi.product_id
                LEFT JOIN orders o ON oi.order_id = o.id 
                    AND o.status != 'cancelled'
                GROUP BY c.id
                ORDER BY revenue DESC
            `, {
                type: db.sequelize.QueryTypes.SELECT
            });

            return results.map(stat => ({
                id: stat.id,
                name: stat.name,
                productCount: parseInt(stat.productCount),
                revenue: parseFloat(stat.revenue)
            }));
        } catch (error) {
            console.error('getCategoryStats error:', error);
            return [];
        }
    }

    async getOrderStatusStats() {
        const stats = await db.Order.findAll({
            attributes: [
                'status',
                [
                    db.sequelize.fn('COUNT', db.sequelize.col('id')),
                    'count'
                ],
                [
                    db.sequelize.fn(
                        'SUM',
                        db.sequelize.col('total_amount')
                    ),
                    'totalAmount'
                ]
            ],
            group: ['status'],
            raw: true
        });

        return stats;
    }

    async getTopCustomers(limit = 10) {
        try {
            // Use raw query to avoid complex Sequelize issues
            const results = await db.sequelize.query(`
                SELECT 
                    c.id,
                    c.first_name,
                    c.last_name,
                    c.phone,
                    u.email,
                    COUNT(o.id) as orderCount,
                    SUM(o.total_amount) as totalSpent
                FROM customers c
                LEFT JOIN users u ON c.user_id = u.id
                LEFT JOIN orders o ON c.id = o.customer_id 
                    AND o.status != 'cancelled'
                GROUP BY c.id
                HAVING orderCount > 0
                ORDER BY totalSpent DESC
                LIMIT :limit
            `, {
                replacements: { limit: parseInt(limit) },
                type: db.sequelize.QueryTypes.SELECT
            });

            return results.map(customer => ({
                id: customer.id,
                name: `${customer.first_name} ${customer.last_name}`,
                email: customer.email,
                phone: customer.phone,
                orderCount: parseInt(customer.orderCount),
                totalSpent: parseFloat(customer.totalSpent)
            }));
        } catch (error) {
            console.error('getTopCustomers error:', error);
            return [];
        }
    }
}

export default StatisticsService;
