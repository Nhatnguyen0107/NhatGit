import CartRepository from '../repositories/cart.repository.js';
import db from '../models/index.js';
import sequelize from '../config/index.js';

class CheckoutService {
    constructor() {
        this.cartRepository = new CartRepository();
    }

    generateOrderNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, '0');
        return `ORD-${timestamp}-${random}`;
    }

    async checkout(userId, checkoutData) {
        const {
            shipping_address,
            payment_method = 'COD',
            notes = ''
        } = checkoutData;

        if (!shipping_address) {
            throw new Error('Shipping address is required');
        }

        const transaction = await sequelize.transaction();

        try {
            const customer = await db.Customer.findOne({
                where: { user_id: userId }
            });

            if (!customer) {
                throw new Error('Customer profile not found');
            }

            const cartItems =
                await this.cartRepository.findByUserId(userId);

            if (!cartItems || cartItems.length === 0) {
                throw new Error('Cart is empty');
            }

            let subtotal = 0;
            const orderItems = [];

            for (const item of cartItems) {
                const product = await db.Product.findByPk(
                    item.product_id,
                    {
                        transaction,
                        lock: transaction.LOCK.UPDATE
                    }
                );

                if (!product) {
                    throw new Error(
                        `Product ${item.product_id} not found`
                    );
                }

                if (product.stock < item.quantity) {
                    throw new Error(
                        `Insufficient stock for ${product.name}. ` +
                        `Only ${product.stock} available`
                    );
                }

                const price = parseFloat(product.price);
                const discount = parseFloat(
                    product.discount_percentage || 0
                );
                const finalPrice = price * (1 - discount / 100);
                const itemSubtotal = finalPrice * item.quantity;

                subtotal += itemSubtotal;

                orderItems.push({
                    product_id: product.id,
                    product_name: product.name,
                    product_price: finalPrice,
                    quantity: item.quantity,
                    discount_percentage: discount,
                    subtotal: itemSubtotal
                });

                await product.update(
                    {
                        stock: product.stock - item.quantity
                    },
                    { transaction }
                );
            }

            const shipping_cost = 0;
            const discount_amount = 0;
            const total_amount = subtotal +
                shipping_cost -
                discount_amount;

            const order = await db.Order.create(
                {
                    order_number: this.generateOrderNumber(),
                    customer_id: customer.id,
                    status: 'pending',
                    subtotal: subtotal.toFixed(2),
                    discount_amount: discount_amount.toFixed(2),
                    shipping_cost: shipping_cost.toFixed(2),
                    total_amount: total_amount.toFixed(2),
                    payment_method,
                    payment_status: 'pending',
                    shipping_address,
                    notes
                },
                { transaction }
            );

            for (const item of orderItems) {
                await db.OrderItem.create(
                    {
                        order_id: order.id,
                        ...item
                    },
                    { transaction }
                );
            }

            await this.cartRepository.deleteByUserId(userId);

            await transaction.commit();

            const createdOrder = await db.Order.findByPk(
                order.id,
                {
                    include: [
                        {
                            model: db.OrderItem,
                            as: 'items',
                            include: [
                                {
                                    model: db.Product,
                                    as: 'product',
                                    attributes: ['id', 'name',
                                        'slug', 'images']
                                }
                            ]
                        },
                        {
                            model: db.Customer,
                            as: 'customer',
                            attributes: ['id', 'first_name',
                                'last_name', 'phone']
                        }
                    ]
                }
            );

            return createdOrder;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async validateCheckout(userId) {
        const cartItems =
            await this.cartRepository.findByUserId(userId);

        if (!cartItems || cartItems.length === 0) {
            throw new Error('Cart is empty');
        }

        const validationErrors = [];

        for (const item of cartItems) {
            const product = item.product;

            if (!product) {
                validationErrors.push(
                    `Product ${item.product_id} not found`
                );
                continue;
            }

            if (product.stock < item.quantity) {
                validationErrors.push(
                    `${product.name}: Only ${product.stock} ` +
                    `available, you have ${item.quantity} in cart`
                );
            }
        }

        if (validationErrors.length > 0) {
            throw new Error(
                'Cart validation failed: ' +
                validationErrors.join('; ')
            );
        }

        return true;
    }
}

export default CheckoutService;
