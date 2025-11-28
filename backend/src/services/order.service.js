import OrderRepository from '../repositories/order.repository.js';
import { v4 as uuidv4 } from 'uuid';

class OrderService {
    constructor() {
        this.repository = new OrderRepository();
    }

    async createOrderFromForm(userId, orderData) {
        const { shipping_address, phone, notes, items } = orderData;

        // Validate required fields
        if (!shipping_address || !shipping_address.trim()) {
            throw new Error('Shipping address is required');
        }

        if (!phone || !phone.trim()) {
            throw new Error('Phone number is required');
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new Error('Order items are required');
        }

        // Find customer by user_id
        const customer = await this.repository.model.sequelize
            .models.Customer.findOne({ where: { user_id: userId } });

        if (!customer) {
            throw new Error('Customer profile not found');
        }

        // Calculate total amount and prepare order items
        let subtotal = 0;
        const validatedItems = [];

        for (const item of items) {
            const product = await this.repository.model.sequelize
                .models.Product.findByPk(item.product_id);

            if (!product) {
                throw new Error(`Product not found: ${item.product_id}`);
            }

            if (product.stock_quantity < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}`);
            }

            const discount = product.discount_percentage || 0;
            const finalPrice = item.price * (1 - discount / 100);
            const itemSubtotal = finalPrice * item.quantity;
            subtotal += itemSubtotal;

            validatedItems.push({
                id: uuidv4(),
                product_id: item.product_id,
                product_name: product.name,
                product_price: item.price,
                quantity: item.quantity,
                discount_percentage: discount,
                subtotal: itemSubtotal
            });
        }

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

        console.log('🔢 Generated order number:', orderNumber);
        console.log('💰 Calculated subtotal:', subtotal);

        // Create order
        const orderCreateData = {
            id: uuidv4(),
            order_number: orderNumber,
            customer_id: customer.id,
            subtotal: subtotal,
            total_amount: subtotal, // For now, no shipping or additional costs
            shipping_address: shipping_address.trim(),
            shipping_phone: phone.trim(),
            notes: notes ? notes.trim() : null,
            status: 'pending',
            payment_status: 'pending',
            payment_method: 'pending'
        };

        console.log('📝 Order data to create:', orderCreateData);

        const order = await this.repository.create(orderCreateData);

        // Create order items
        await this.repository.model.sequelize.models.OrderItem.bulkCreate(
            validatedItems.map(item => ({
                ...item,
                order_id: order.id
            }))
        );

        // Update product stock
        for (const item of validatedItems) {
            await this.repository.model.sequelize.models.Product.decrement(
                'stock_quantity',
                {
                    by: item.quantity,
                    where: { id: item.product_id }
                }
            );
        }

        // Return order with items
        return await this.repository.findById(order.id, {
            include: this.repository.buildInclude()
        });
    }

    async getMyOrders(userId, queryParams) {
        const {
            page = 1,
            limit = 10,
            status,
            sort = 'newest'
        } = queryParams;

        const offset = (page - 1) * limit;

        // Find customer by user_id
        const customer = await this.repository.model.sequelize
            .models.Customer.findOne({ where: { user_id: userId } });

        if (!customer) {
            throw new Error('Customer profile not found');
        }

        const where = { customer_id: customer.id };
        if (status) where.status = status;

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

    async cancelOrder(userId, orderId, reason = '') {
        // Find customer by user_id
        const customer = await this.repository.model.sequelize
            .models.Customer.findOne({ where: { user_id: userId } });

        if (!customer) {
            throw new Error('Customer profile not found');
        }

        // Get order with items
        const order = await this.repository.findById(orderId, {
            include: this.repository.buildInclude()
        });

        if (!order) {
            throw new Error('Order not found');
        }

        // Check if order belongs to customer
        if (order.customer_id !== customer.id) {
            throw new Error('Unauthorized');
        }

        // Check if order can be cancelled
        if (order.status === 'cancelled') {
            throw new Error('Order is already cancelled');
        }

        if (order.status === 'delivered') {
            throw new Error(
                'Cannot cancel order that has been delivered'
            );
        }

        if (order.status === 'shipped') {
            throw new Error(
                'Cannot cancel order that is being shipped. ' +
                'Please contact support.'
            );
        }

        // Update order status
        const updatedOrder = await this.repository.update(
            order,
            {
                status: 'cancelled',
                notes: reason
                    ? `${order.notes ? order.notes + ' | ' : ''}` +
                    `Cancelled by customer: ${reason}`
                    : order.notes
            }
        );

        // Return order in stock (restore inventory)
        const db = this.repository.model.sequelize.models;
        for (const item of order.order_items) {
            const product = await db.Product.findByPk(
                item.product_id
            );
            if (product) {
                await product.update({
                    stock_quantity:
                        product.stock_quantity + item.quantity
                });
            }
        }

        return updatedOrder;
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
