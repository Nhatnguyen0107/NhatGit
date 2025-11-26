import ReviewRepository from '../repositories/review.repository.js';
import db from '../models/index.js';

class ReviewService {
    constructor() {
        this.repository = new ReviewRepository();
    }

    async getAllReviews(queryParams) {
        const {
            page = 1,
            limit = 10,
            product_id,
            customer_id,
            rating,
            is_visible
        } = queryParams;

        const where = {};
        if (product_id) where.product_id = product_id;
        if (customer_id) where.customer_id = customer_id;
        if (rating) where.rating = rating;
        if (is_visible !== undefined) where.is_visible = is_visible;

        const offset = (page - 1) * limit;

        const { rows: reviews, count: total } =
            await this.repository.findAndCountAll({
                where,
                include: [
                    {
                        model: db.Customer,
                        as: 'customer',
                        include: [
                            {
                                model: db.User,
                                as: 'user',
                                attributes: ['username', 'avatar', 'email']
                            }
                        ]
                    },
                    {
                        model: db.Product,
                        as: 'product',
                        attributes: ['id', 'name', 'image_url']
                    }
                ],
                limit: parseInt(limit),
                offset,
                order: [['created_at', 'DESC']]
            });

        return {
            reviews,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getReviewById(id) {
        const review = await this.repository.findById(id, {
            include: [
                {
                    model: db.Customer,
                    as: 'customer',
                    include: [
                        {
                            model: db.User,
                            as: 'user',
                            attributes: ['username', 'avatar', 'email']
                        }
                    ]
                },
                {
                    model: db.Product,
                    as: 'product',
                    attributes: ['id', 'name', 'image_url', 'price']
                }
            ]
        });

        if (!review) {
            throw new Error('Review not found');
        }

        return review;
    }

    async createReview(data) {
        const {
            product_id,
            customer_id,
            rating,
            comment
        } = data;

        if (!product_id || !customer_id || !rating) {
            throw new Error(
                'Product ID, Customer ID and Rating are required'
            );
        }

        // Check if product exists
        const product = await db.Product.findByPk(product_id);
        if (!product) {
            throw new Error('Product not found');
        }

        // Check if customer exists
        const customer = await db.Customer.findByPk(customer_id);
        if (!customer) {
            throw new Error('Customer not found');
        }

        // Check if customer already reviewed this product
        const existingReview = await this.repository.findOne({
            product_id,
            customer_id
        });

        if (existingReview) {
            throw new Error(
                'You have already reviewed this product'
            );
        }

        // Check if customer purchased this product
        const order = await db.Order.findOne({
            where: { customer_id },
            include: [
                {
                    model: db.OrderItem,
                    as: 'order_items',
                    where: { product_id },
                    required: true
                }
            ]
        });

        const is_verified_purchase = !!order;

        const review = await this.repository.create({
            product_id,
            customer_id,
            rating: parseInt(rating),
            comment,
            is_verified_purchase,
            is_visible: true
        });

        return review;
    }

    async updateReview(id, data) {
        const review = await this.repository.findById(id);
        if (!review) {
            throw new Error('Review not found');
        }

        const { rating, comment, is_visible } = data;

        const updatedReview = await this.repository.update(review, {
            rating: rating !== undefined
                ? parseInt(rating)
                : review.rating,
            comment: comment !== undefined
                ? comment
                : review.comment,
            is_visible: is_visible !== undefined
                ? is_visible
                : review.is_visible
        });

        return updatedReview;
    }

    async deleteReview(id) {
        const review = await this.repository.findById(id);
        if (!review) {
            throw new Error('Review not found');
        }

        await this.repository.delete(review);
    }

    async toggleVisibility(id) {
        const review = await this.repository.findById(id);
        if (!review) {
            throw new Error('Review not found');
        }

        const updatedReview = await this.repository.update(review, {
            is_visible: !review.is_visible
        });

        return updatedReview;
    }

    async getProductReviews(productId) {
        const reviews = await this.repository.findByProductId(
            productId,
            { where: { is_visible: true } }
        );

        const stats = await this.repository.getAverageRating(
            productId
        );

        return {
            reviews,
            stats
        };
    }

    async getCustomerReviews(customerId) {
        return await this.repository.findByCustomerId(customerId);
    }
}

export default ReviewService;
