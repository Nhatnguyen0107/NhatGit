import CartService from '../services/cart.service.js';

class CartController {
    constructor() {
        this.service = new CartService();
    }

    async getCart(req, res) {
        try {
            const userId = req.user.id;
            const cart = await this.service.getCart(userId);

            res.json({
                success: true,
                data: cart
            });
        } catch (error) {
            console.error('❌ Get cart error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch cart',
                error: error.message
            });
        }
    }

    async addToCart(req, res) {
        try {
            const userId = req.user.id;
            const { product_id, quantity = 1 } = req.body;

            console.log('🛒 Add to cart - User ID:', userId);
            console.log('🛒 Add to cart - Product ID:', product_id);
            console.log('🛒 Add to cart - Quantity:', quantity);

            if (!product_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Product ID is required'
                });
            }

            const cartItem = await this.service.addToCart(
                userId,
                product_id,
                parseInt(quantity)
            );

            res.status(201).json({
                success: true,
                message: 'Product added to cart',
                data: { cartItem }
            });
        } catch (error) {
            console.error('❌ Add to cart error:', error);

            const statusCode =
                error.message === 'Product not found'
                    ? 404
                    : error.message.includes('Insufficient stock') ||
                        error.message.includes('Quantity must')
                        ? 400
                        : 500;

            res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to add to cart',
                error: error.message
            });
        }
    }

    async updateCartItem(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const { quantity } = req.body;

            if (!quantity || quantity < 1) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid quantity is required'
                });
            }

            const cartItem = await this.service.updateCartItem(
                userId,
                id,
                parseInt(quantity)
            );

            res.json({
                success: true,
                message: 'Cart item updated',
                data: { cartItem }
            });
        } catch (error) {
            console.error('❌ Update cart item error:', error);

            const statusCode =
                error.message === 'Cart item not found'
                    ? 404
                    : error.message ===
                        'Unauthorized to update this item'
                        ? 403
                        : error.message.includes('Insufficient stock')
                            ? 400
                            : 500;

            res.status(statusCode).json({
                success: false,
                message: error.message ||
                    'Failed to update cart item',
                error: error.message
            });
        }
    }

    async removeFromCart(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            await this.service.removeFromCart(userId, id);

            res.json({
                success: true,
                message: 'Item removed from cart'
            });
        } catch (error) {
            console.error('❌ Remove from cart error:', error);

            const statusCode =
                error.message === 'Cart item not found'
                    ? 404
                    : error.message ===
                        'Unauthorized to remove this item'
                        ? 403
                        : 500;

            res.status(statusCode).json({
                success: false,
                message: error.message ||
                    'Failed to remove from cart',
                error: error.message
            });
        }
    }

    async clearCart(req, res) {
        try {
            const userId = req.user.id;
            await this.service.clearCart(userId);

            res.json({
                success: true,
                message: 'Cart cleared successfully'
            });
        } catch (error) {
            console.error('❌ Clear cart error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to clear cart',
                error: error.message
            });
        }
    }
}

export default CartController;
