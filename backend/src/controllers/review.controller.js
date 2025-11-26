import ReviewService from '../services/review.service.js';

class ReviewController {
    constructor() {
        this.service = new ReviewService();
    }

    async getAllReviews(req, res) {
        try {
            const result = await this.service.getAllReviews(
                req.query
            );
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('❌ Get reviews error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to get reviews',
                error: error.message
            });
        }
    }

    async getReviewById(req, res) {
        try {
            const { id } = req.params;
            const review = await this.service.getReviewById(id);
            res.json({
                success: true,
                data: { review }
            });
        } catch (error) {
            console.error('❌ Get review error:', error);
            const statusCode = error.message === 'Review not found'
                ? 404
                : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to get review',
                error: error.message
            });
        }
    }

    async createReview(req, res) {
        try {
            const review = await this.service.createReview(req.body);
            res.status(201).json({
                success: true,
                message: 'Review created successfully',
                data: { review }
            });
        } catch (error) {
            console.error('❌ Create review error:', error);
            const statusCode =
                error.message.includes('not found')
                    ? 404
                    : error.message.includes('required') ||
                        error.message.includes('already reviewed')
                        ? 400
                        : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to create review',
                error: error.message
            });
        }
    }

    async updateReview(req, res) {
        try {
            const { id } = req.params;
            const review = await this.service.updateReview(
                id,
                req.body
            );
            res.json({
                success: true,
                message: 'Review updated successfully',
                data: { review }
            });
        } catch (error) {
            console.error('❌ Update review error:', error);
            const statusCode = error.message === 'Review not found'
                ? 404
                : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to update review',
                error: error.message
            });
        }
    }

    async deleteReview(req, res) {
        try {
            const { id } = req.params;
            await this.service.deleteReview(id);
            res.json({
                success: true,
                message: 'Review deleted successfully'
            });
        } catch (error) {
            console.error('❌ Delete review error:', error);
            const statusCode = error.message === 'Review not found'
                ? 404
                : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to delete review',
                error: error.message
            });
        }
    }

    async toggleVisibility(req, res) {
        try {
            const { id } = req.params;
            const review = await this.service.toggleVisibility(id);
            res.json({
                success: true,
                message: 'Review visibility toggled successfully',
                data: { review }
            });
        } catch (error) {
            console.error('❌ Toggle visibility error:', error);
            const statusCode = error.message === 'Review not found'
                ? 404
                : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message ||
                    'Failed to toggle visibility',
                error: error.message
            });
        }
    }

    async getProductReviews(req, res) {
        try {
            const { productId } = req.params;
            const result = await this.service.getProductReviews(
                productId
            );
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('❌ Get product reviews error:', error);
            res.status(500).json({
                success: false,
                message: error.message ||
                    'Failed to get product reviews',
                error: error.message
            });
        }
    }

    async getCustomerReviews(req, res) {
        try {
            const { customerId } = req.params;
            const reviews = await this.service.getCustomerReviews(
                customerId
            );
            res.json({
                success: true,
                data: { reviews }
            });
        } catch (error) {
            console.error('❌ Get customer reviews error:', error);
            res.status(500).json({
                success: false,
                message: error.message ||
                    'Failed to get customer reviews',
                error: error.message
            });
        }
    }
}

export default ReviewController;
