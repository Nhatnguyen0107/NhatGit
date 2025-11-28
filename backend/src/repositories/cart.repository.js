import db from '../models/index.js';
import { Op } from 'sequelize';

class CartRepository {
    constructor() {
        this.model = db.CartItem;
    }

    async findByUserId(userId, options = {}) {
        return await this.model.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: db.Product,
                    as: 'product',
                    attributes: ['id', 'name', 'slug', 'price',
                        'stock_quantity', 'image_url', 'discount_percentage']
                }
            ],
            ...options
        });
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

    async findByUserAndProduct(userId, productId) {
        return await this.model.findOne({
            where: {
                user_id: userId,
                product_id: productId
            }
        });
    }

    async create(data) {
        return await this.model.create(data);
    }

    async update(cartItem, data) {
        return await cartItem.update(data);
    }

    async delete(cartItem) {
        return await cartItem.destroy();
    }

    async deleteByUserId(userId) {
        return await this.model.destroy({
            where: { user_id: userId }
        });
    }

    async count(where = {}) {
        return await this.model.count({ where });
    }

    async calculateCartTotal(userId) {
        const cartItems = await this.findByUserId(userId);

        let subtotal = 0;
        let totalItems = 0;

        for (const item of cartItems) {
            const product = item.product;
            const price = parseFloat(product.price);
            const discount = parseFloat(
                product.discount_percentage || 0
            );
            const finalPrice = price * (1 - discount / 100);

            subtotal += finalPrice * item.quantity;
            totalItems += item.quantity;
        }

        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            totalItems,
            items: cartItems
        };
    }
}

export default CartRepository;
