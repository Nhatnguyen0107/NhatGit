import CategoryService from '../services/category.service.js';

class CategoryController {
    constructor() {
        this.service = new CategoryService();
    }

    async getAllCategories(req, res) {
        try {
            const result = await this.service.getAllCategories(
                req.query
            );

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('❌ Get categories error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch categories',
                error: error.message
            });
        }
    }

    async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            const includeProducts = req.query.include_products
                === 'true';

            const category = await this.service.getCategoryById(
                id,
                includeProducts
            );

            res.json({
                success: true,
                data: { category }
            });
        } catch (error) {
            console.error('❌ Get category error:', error);

            const statusCode =
                error.message === 'Category not found'
                    ? 404
                    : 500;

            res.status(statusCode).json({
                success: false,
                message: error.message ||
                    'Failed to fetch category',
                error: error.message
            });
        }
    }

    async createCategory(req, res) {
        try {
            const category = await this.service.createCategory(
                req.body
            );

            res.status(201).json({
                success: true,
                message: 'Category created successfully',
                data: { category }
            });
        } catch (error) {
            console.error('❌ Create category error:', error);

            const statusCode =
                error.message === 'Category name is required'
                    ? 400
                    : error.message.includes('already exists')
                        ? 409
                        : 500;

            res.status(statusCode).json({
                success: false,
                message: error.message ||
                    'Failed to create category',
                error: error.message
            });
        }
    }

    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const category = await this.service.updateCategory(
                id,
                req.body
            );

            res.json({
                success: true,
                message: 'Category updated successfully',
                data: { category }
            });
        } catch (error) {
            console.error('❌ Update category error:', error);

            const statusCode =
                error.message === 'Category not found'
                    ? 404
                    : error.message.includes('already exists')
                        ? 409
                        : 500;

            res.status(statusCode).json({
                success: false,
                message: error.message ||
                    'Failed to update category',
                error: error.message
            });
        }
    }

    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            await this.service.deleteCategory(id);

            res.json({
                success: true,
                message: 'Category deleted successfully'
            });
        } catch (error) {
            console.error('❌ Delete category error:', error);

            const statusCode =
                error.message === 'Category not found'
                    ? 404
                    : error.message.includes('existing products')
                        ? 409
                        : 500;

            res.status(statusCode).json({
                success: false,
                message: error.message ||
                    'Failed to delete category',
                error: error.message
            });
        }
    }
}

export default CategoryController;
