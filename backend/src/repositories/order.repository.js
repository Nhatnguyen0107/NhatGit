import db from '../models/index.js';
import { Op } from 'sequelize';

class OrderRepository {
    constructor() {
        this.model = db.Order;
    }

    async findAndCountAll(options) {
        return await this.model.findAndCountAll(options);
    }

    async findAll(options = {}) {
        return await this.model.findAll(options);
    }

    async findById(id, options = {}) {
        return await this.model.findByPk(id, options);
    }

    async findOne(where, options = {}) {
        return await this.model.findOne({
            where,
            ...options
        });
    }

    async create(data) {
        return await this.model.create(data);
    }

    async update(order, data) {
        return await order.update(data);
    }

    async delete(order) {
        return await order.destroy();
    }

    async updateStatus(id, status, payment_status = null) {
        const updateData = { status };
        if (payment_status) {
            updateData.payment_status = payment_status;
        }

        return await this.model.update(updateData, {
            where: { id }
        });
    }

    async count(where = {}) {
        return await this.model.count({ where });
    }

    buildWhereCondition(filters) {
        const {
            search,
            status,
            payment_status,
            customer_id,
            date_from,
            date_to
        } = filters;
        const where = {};

        if (search) {
            where[Op.or] = [
                { order_number: { [Op.like]: `%${search}%` } },
                { shipping_address: { [Op.like]: `%${search}%` } }
            ];
        }

        if (status) {
            where.status = status;
        }

        if (payment_status) {
            where.payment_status = payment_status;
        }

        if (customer_id) {
            where.customer_id = customer_id;
        }

        if (date_from || date_to) {
            where.created_at = {};
            if (date_from) {
                where.created_at[Op.gte] = new Date(date_from);
            }
            if (date_to) {
                where.created_at[Op.lte] = new Date(date_to);
            }
        }

        return where;
    }

    buildOrder(sort = 'newest') {
        switch (sort) {
            case 'oldest':
                return [['created_at', 'ASC']];
            case 'total_asc':
                return [['total_amount', 'ASC']];
            case 'total_desc':
                return [['total_amount', 'DESC']];
            case 'newest':
            default:
                return [['created_at', 'DESC']];
        }
    }

    buildInclude() {
        return [
            {
                model: db.OrderItem,
                as: 'order_items',
                include: [
                    {
                        model: db.Product,
                        as: 'product',
                        attributes: ['id', 'name', 'slug',
                            'image_url', 'stock_quantity']
                    }
                ]
            },
            {
                model: db.Customer,
                as: 'customer',
                attributes: ['id', 'first_name', 'last_name',
                    'phone', 'billing_address'],
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['id', 'email', 'username']
                    }
                ]
            }
        ];
    }

    async getOrderStatistics() {
        const total = await this.count();
        const pending = await this.count({ status: 'pending' });
        const processing = await this.count({
            status: 'processing'
        });
        const shipped = await this.count({ status: 'shipped' });
        const delivered = await this.count({
            status: 'delivered'
        });
        const cancelled = await this.count({
            status: 'cancelled'
        });

        return {
            total,
            pending,
            processing,
            shipped,
            delivered,
            cancelled
        };
    }
}

export default OrderRepository;
