import CustomerRepository from '../repositories/customer.repository.js';
import db from '../models/index.js';

class CustomerService {
    constructor() {
        this.repository = new CustomerRepository();
    }

    async getAllCustomers(queryParams) {
        const {
            page = 1,
            limit = 10,
            search = '',
            phone,
            sort = 'newest',
            includeOrders = false
        } = queryParams;

        const offset = (page - 1) * limit;

        const where = this.repository.buildWhereCondition({
            search,
            phone
        });

        const order = this.repository.buildOrder(sort);
        const include = this.repository.buildInclude(
            true,
            includeOrders === 'true'
        );

        const { rows: customers, count } =
            await this.repository.findAndCountAll({
                where,
                include,
                order,
                offset: parseInt(offset),
                limit: parseInt(limit),
                distinct: true
            });

        return {
            customers,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        };
    }

    async getCustomerById(id, includeOrders = false) {
        const include = this.repository.buildInclude(
            true,
            includeOrders
        );

        const customer = await this.repository.findById(id, {
            include
        });

        if (!customer) {
            throw new Error('Customer not found');
        }

        return customer;
    }

    async updateCustomer(id, updateData) {
        const customer = await this.repository.findById(id);
        if (!customer) {
            throw new Error('Customer not found');
        }

        const allowedFields = ['phone', 'address'];
        const filteredData = {};

        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                filteredData[field] = updateData[field];
            }
        }

        if (updateData.phone && updateData.phone !== customer.phone) {
            const existingCustomer =
                await this.repository.findOne({
                    where: { phone: updateData.phone }
                });

            if (existingCustomer) {
                throw new Error('Phone number already in use');
            }
        }

        if (Object.keys(filteredData).length === 0) {
            throw new Error('No valid fields to update');
        }

        const updatedCustomer =
            await this.repository.update(
                customer,
                filteredData
            );

        const include = this.repository.buildInclude(true, false);
        return await this.repository.findById(
            updatedCustomer.id,
            { include }
        );
    }

    async getCustomerStatistics() {
        return await this.repository.getCustomerStatistics();
    }

    async getCustomerByUserId(userId) {
        const customer = await this.repository.findByUserId(
            userId,
            {
                include: this.repository.buildInclude(true, false)
            }
        );

        if (!customer) {
            throw new Error('Customer not found');
        }

        return customer;
    }

    async searchCustomersByUser(searchQuery) {
        const { search = '', page = 1, limit = 10 } = searchQuery;
        const offset = (page - 1) * limit;

        const include = [{
            model: db.User,
            as: 'user',
            where: {
                [db.Sequelize.Op.or]: [
                    { username: { [db.Sequelize.Op.like]: `%${search}%` } },
                    { email: { [db.Sequelize.Op.like]: `%${search}%` } },
                    { full_name: { [db.Sequelize.Op.like]: `%${search}%` } }
                ]
            },
            attributes: ['id', 'username', 'email', 'full_name']
        }];

        const { rows: customers, count } =
            await this.repository.findAndCountAll({
                include,
                offset: parseInt(offset),
                limit: parseInt(limit),
                distinct: true
            });

        return {
            customers,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        };
    }
}

export default CustomerService;
