import ProductService from '../services/product.service.js';

class ProductController {
    constructor() {
        this.service = new ProductService();
    }

    async getAllProducts(req, res) {
        try {
            const result = await this.service.getAllProducts(
                req.query
            );

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('❌ Get products error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch products',
                error: error.message
            });
        }
    }

    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await this.service.getProductById(id);

            res.json({
                success: true,
                data: { product }
            });
        } catch (error) {
            console.error('❌ Get product error:', error);

            const statusCode = error.message === 'Product not found'
                ? 404
                : 500;

            res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to fetch product',
                error: error.message
            });
        }
    }

    async createProduct(req, res) {
        try {
            const product = await this.service.createProduct(
                req.body,
                req.files
            );

            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: { product }
            });
        } catch (error) {
            console.error('❌ Create product error:', error);

            this.service.rollbackUploadedFiles(req.files);

            const statusCode =
                error.message === 'Category not found'
                    ? 404
                    : error.message.includes('Missing required')
                        ? 400
                        : 500;

            res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to create product',
                error: error.message
            });
        }
    }

    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const product = await this.service.updateProduct(
                id,
                req.body,
                req.files
            );

            res.json({
                success: true,
                message: 'Product updated successfully',
                data: { product }
            });
        } catch (error) {
            console.error('❌ Update product error:', error);

            const statusCode =
                error.message === 'Product not found' ||
                    error.message === 'Category not found'
                    ? 404
                    : 500;

            res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to update product',
                error: error.message
            });
        }
    }

    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            await this.service.deleteProduct(id);

            res.json({
                success: true,
                message: 'Product deleted successfully'
            });
        } catch (error) {
            console.error('❌ Delete product error:', error);

            const statusCode = error.message === 'Product not found'
                ? 404
                : 500;

            res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to delete product',
                error: error.message
            });
        }
    }

    async getProductsByCategory(req, res) {
        try {
            const { categoryId } = req.params;
            const result =
                await this.service.getProductsByCategory(
                    categoryId,
                    req.query
                );

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('❌ Get products by category error:', error);

            const statusCode = error.message === 'Category not found'
                ? 404
                : 500;

            res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to fetch products',
                error: error.message
            });
        }
    }
}

export default ProductController;
