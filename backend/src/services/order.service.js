import OrderRepository from '../repositories/order.repository.js';

class OrderService {
    constructor() {
        this.repository = new OrderRepository();
    }

    async getAllOrders(queryParams) {
        const {
            page = 1,
            limit = 10,
            search = '',
            status,
            payment_status,
            customer_id,
            date_from,
            date_to,
            sort = 'newest'
        } = queryParams;

        const offset = (page - 1) * limit;

        const where = this.repository.buildWhereCondition({
            search,
            status,
            payment_status,
            customer_id,
            date_from,
            date_to
        });

        const order = this.repository.buildOrder(sort);
        const include = this.repository.buildInclude();

        const { rows: orders, count } =
            await this.repository.findAndCountAll({
                where,
                include,
                order,
                offset: parseInt(offset),
                limit: parseInt(limit),
                distinct: true
            });

        return {
            orders,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        };
    }

    async getOrderById(id) {
        const include = this.repository.buildInclude();

        const order = await this.repository.findById(id, {
            include
        });

        if (!order) {
            throw new Error('Order not found');
        }

        return order;
    }

    async updateOrderStatus(id, status) {
        const validStatuses = [
            'pending',
            'processing',
            'shipped',
            'delivered',
            'cancelled'
        ];

        if (!validStatuses.includes(status)) {
            throw new Error(
                `Invalid status. Must be one of: ` +
                `${validStatuses.join(', ')}`
            );
        }

        const order = await this.repository.findById(id);
        if (!order) {
            throw new Error('Order not found');
        }

        const currentStatus = order.status;

        if (currentStatus === 'cancelled') {
            throw new Error(
                'Cannot update status of cancelled order'
            );
        }

        if (currentStatus === 'delivered' &&
            status !== 'delivered') {
            throw new Error(
                'Cannot change status of delivered order'
            );
        }

        const updateData = { status };

        if (status === 'shipped' && !order.shipped_at) {
            updateData.shipped_at = new Date();
        }

        if (status === 'delivered' && !order.delivered_at) {
            updateData.delivered_at = new Date();
        }

        const updatedOrder = await this.repository.update(
            order,
            updateData
        );

        const include = this.repository.buildInclude();
        return await this.repository.findById(
            updatedOrder.id,
            { include }
        );
    }

    async updatePaymentStatus(id, paymentStatus) {
        const validPaymentStatuses = [
            'pending',
            'paid',
            'failed',
            'refunded'
        ];

        if (!validPaymentStatuses.includes(paymentStatus)) {
            throw new Error(
                `Invalid payment status. Must be one of: ` +
                `${validPaymentStatuses.join(', ')}`
            );
        }

        const order = await this.repository.findById(id);
        if (!order) {
            throw new Error('Order not found');
        }

        const updatedOrder = await this.repository.update(
            order,
            { payment_status: paymentStatus }
        );

        const include = this.repository.buildInclude();
        return await this.repository.findById(
            updatedOrder.id,
            { include }
        );
    }

    async getOrderStatistics() {
        return await this.repository.getOrderStatistics();
    }

    async getCustomerOrders(customerId, queryParams) {
        const {
            page = 1,
            limit = 10,
            status
        } = queryParams;

        const offset = (page - 1) * limit;
        const where = { customer_id: customerId };

        if (status) {
            where.status = status;
        }

        const include = this.repository.buildInclude();
        const order = this.repository.buildOrder('newest');

        const { rows: orders, count } =
            await this.repository.findAndCountAll({
                where,
                include,
                order,
                offset: parseInt(offset),
                limit: parseInt(limit),
                distinct: true
            });

        return {
            orders,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        };
    }
}

export default OrderService;
