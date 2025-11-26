import CartRepository from '../repositories/cart.repository.js';
import db from '../models/index.js';

class CartService {
    constructor() {
        this.repository = new CartRepository();
    }

    async getCart(userId) {
        const cartData = await this.repository.calculateCartTotal(
            userId
        );

        return {
            items: cartData.items.map(item => ({
                id: item.id,
                product_id: item.product_id,
                product: {
                    id: item.product.id,
                    name: item.product.name,
                    slug: item.product.slug,
                    price: parseFloat(item.product.price),
                    stock_quantity: item.product.stock_quantity,
                    image_url: item.product.image_url,
                    discount_percentage: parseFloat(
                        item.product.discount_percentage || 0
                    )
                },
                quantity: item.quantity,
                created_at: item.created_at
            })),
            subtotal: cartData.subtotal,
            totalItems: cartData.totalItems
        };
    }

    async addToCart(userId, productId, quantity = 1) {
        if (quantity < 1) {
            throw new Error('Quantity must be at least 1');
        }

        // Kiểm tra user tồn tại
        const user = await db.User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const product = await db.Product.findByPk(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        if (product.stock < quantity) {
            throw new Error(
                `Insufficient stock. Only ${product.stock} ` +
                `items available`
            );
        }

        const existingItem =
            await this.repository.findByUserAndProduct(
                userId,
                productId
            );

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;

            if (product.stock < newQuantity) {
                throw new Error(
                    `Cannot add ${quantity} more. ` +
                    `Only ${product.stock - existingItem.quantity} ` +
                    `available`
                );
            }

            return await this.repository.update(existingItem, {
                quantity: newQuantity
            });
        }

        return await this.repository.create({
            user_id: userId,
            product_id: productId,
            quantity
        });
    }

    async updateCartItem(userId, cartItemId, quantity) {
        if (quantity < 1) {
            throw new Error('Quantity must be at least 1');
        }

        const cartItem = await this.repository.findById(
            cartItemId,
            {
                include: [
                    {
                        model: db.Product,
                        as: 'product'
                    }
                ]
            }
        );

        if (!cartItem) {
            throw new Error('Cart item not found');
        }

        if (cartItem.user_id !== userId) {
            throw new Error('Unauthorized to update this item');
        }

        if (cartItem.product.stock < quantity) {
            throw new Error(
                `Insufficient stock. Only ` +
                `${cartItem.product.stock} items available`
            );
        }

        return await this.repository.update(cartItem, {
            quantity
        });
    }

    async removeFromCart(userId, cartItemId) {
        const cartItem = await this.repository.findById(
            cartItemId
        );

        if (!cartItem) {
            throw new Error('Cart item not found');
        }

        if (cartItem.user_id !== userId) {
            throw new Error('Unauthorized to remove this item');
        }

        await this.repository.delete(cartItem);
    }

    async clearCart(userId) {
        await this.repository.deleteByUserId(userId);
    }

    async getCartItemCount(userId) {
        return await this.repository.count({
            user_id: userId
        });
    }
}

export default CartService;
