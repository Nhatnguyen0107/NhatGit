import { Op } from 'sequelize';
import db from '../models/index.js';

class CustomerRepository {
    constructor() {
        this.model = db.Customer;
    }

    async findAndCountAll(options = {}) {
        return await this.model.findAndCountAll(options);
    }

    async findAll(options = {}) {
        return await this.model.findAll(options);
    }

    async findById(id, options = {}) {
        return await this.model.findByPk(id, options);
    }

    async findOne(options = {}) {
        return await this.model.findOne(options);
    }

    async create(data) {
        return await this.model.create(data);
    }

    async update(instance, data) {
        return await instance.update(data);
    }

    async delete(instance) {
        return await instance.destroy();
    }

    async count(options = {}) {
        return await this.model.count(options);
    }

    buildWhereCondition(filters = {}) {
        const where = {};
        const { search, phone, user_id } = filters;

        if (search) {
            where[Op.or] = [
                { phone: { [Op.like]: `%${search}%` } },
                { shipping_address: { [Op.like]: `%${search}%` } },
                { billing_address: { [Op.like]: `%${search}%` } }
            ];
        }

        if (phone) {
            where.phone = { [Op.like]: `%${phone}%` };
        }

        if (user_id) {
            where.user_id = user_id;
        }

        return where;
    }

    buildOrder(sort = 'newest') {
        const sortMap = {
            newest: [['createdAt', 'DESC']],
            oldest: [['createdAt', 'ASC']],
            phone: [['phone', 'ASC']]
        };

        return sortMap[sort] || sortMap.newest;
    }

    buildInclude(includeUser = true, includeOrders = false) {
        const include = [];

        if (includeUser) {
            include.push({
                model: db.User,
                as: 'user',
                attributes: [
                    'id',
                    'username',
                    'email'
                ]
            });
        }

        if (includeOrders) {
            include.push({
                model: db.Order,
                as: 'orders',
                attributes: [
                    'id',
                    'order_number',
                    'total_amount',
                    'status',
                    'payment_status',
                    'createdAt'
                ],
                limit: 5,
                order: [['createdAt', 'DESC']]
            });
        }

        return include;
    }

    async getCustomerStatistics() {
        const total = await this.count();

        const withOrders = await this.count({
            include: [{
                model: db.Order,
                as: 'orders',
                required: true
            }]
        });

        const withoutOrders = total - withOrders;

        return {
            total,
            withOrders,
            withoutOrders
        };
    }

    async findByUserId(userId, options = {}) {
        return await this.model.findOne({
            where: { user_id: userId },
            ...options
        });
    }
}

export default CustomerRepository;
