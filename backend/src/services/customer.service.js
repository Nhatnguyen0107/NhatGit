import { Op } from 'sequelize';
import CustomerRepository from '../repositories/customer.repository.js';
import db from '../models/index.js';

class CustomerService {
    constructor() {
        this.repository = new CustomerRepository();
    }

    async getAllCustomers(queryParams) {
        const {
            page = 1,
            limit = 1000,
            search = '',
            sort = 'newest'
        } = queryParams;

        const offset = (page - 1) * limit;

        // Build where condition for Users
        const where = {};
        if (search) {
            where[Op.or] = [
                { username: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        // Build order
        const order = sort === 'oldest'
            ? [['created_at', 'ASC']]
            : [['created_at', 'DESC']];

        // Query Users table with optional Customer profile
        const { rows: users, count } = await db.User.findAndCountAll({
            where,
            include: [
                {
                    model: db.Customer,
                    as: 'customer',
                    required: false,
                    attributes: ['id', 'first_name', 'last_name',
                        'phone', 'billing_address']
                }
            ],
            order,
            offset: parseInt(offset),
            limit: parseInt(limit),
            distinct: true
        });

        return {
            customers: users,
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
                [Op.or]: [
                    { username: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } }
                ]
            },
            attributes: ['id', 'username', 'email']
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

    async getMyProfile(userId) {
        const customer = await this.repository.findByUserId(
            userId,
            {
                include: [{
                    model: db.User,
                    as: 'user',
                    attributes: ['id', 'username', 'email', 'avatar', 'created_at']
                }]
            }
        );

        if (!customer) {
            throw new Error('Customer profile not found');
        }

        return {
            id: customer.id,
            user_id: customer.user_id,
            username: customer.user?.username,
            email: customer.user?.email,
            avatar: customer.user?.avatar,
            first_name: customer.first_name,
            last_name: customer.last_name,
            phone: customer.phone,
            shipping_address: customer.shipping_address,
            shipping_city: customer.shipping_city,
            shipping_country: customer.shipping_country,
            billing_address: customer.billing_address,
            created_at: customer.user?.created_at
        };
    }

    async updateMyProfile(userId, updateData) {
        const customer = await this.repository.findByUserId(userId);

        if (!customer) {
            throw new Error('Customer profile not found');
        }

        const allowedFields = [
            'first_name',
            'last_name',
            'phone',
            'shipping_address',
            'shipping_city',
            'shipping_country',
            'billing_address'
        ];
        const filteredData = {};

        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                filteredData[field] = updateData[field];
            }
        }

        if (updateData.phone && updateData.phone !== customer.phone) {
            const existingCustomer = await this.repository.findOne({
                where: {
                    phone: updateData.phone,
                    id: { [Op.ne]: customer.id }
                }
            });

            if (existingCustomer) {
                throw new Error('Phone number already in use');
            }
        }

        if (Object.keys(filteredData).length === 0) {
            throw new Error('No valid fields to update');
        }

        await this.repository.update(customer, filteredData);

        return await this.getMyProfile(userId);
    }

    async changePassword(userId, currentPassword, newPassword) {
        const bcrypt = (await import('bcrypt')).default;

        const user = await db.User.findByPk(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });

        return { message: 'Password changed successfully' };
    }

    async updateAvatar(userId, avatarUrl) {
        const user = await db.User.findByPk(userId);

        if (!user) {
            throw new Error('User not found');
        }

        await user.update({ avatar: avatarUrl });

        return await this.getMyProfile(userId);
    }

    async updateUsername(userId, newUsername) {
        const user = await db.User.findByPk(userId);

        if (!user) {
            throw new Error('User not found');
        }

        // Check if username already exists
        const existingUser = await db.User.findOne({
            where: {
                username: newUsername,
                id: { [Op.ne]: userId }
            }
        });

        if (existingUser) {
            throw new Error('Username already taken');
        }

        await user.update({ username: newUsername });

        return await this.getMyProfile(userId);
    }
}

export default CustomerService;
