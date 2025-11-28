import db from '../models/index.js';

class ReviewRepository {
    constructor() {
        this.model = db.Review;
    }

    async findAndCountAll(options) {
        return await this.model.findAndCountAll(options);
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

    async findAll(options) {
        return await this.model.findAll(options);
    }

    async create(data) {
        return await this.model.create(data);
    }

    async update(review, data) {
        return await review.update(data);
    }

    async delete(review) {
        return await review.destroy();
    }

    async findByProductId(productId, options = {}) {
        const { where: additionalWhere, ...otherOptions } = options;

        return await this.model.findAll({
            where: {
                product_id: productId,
                ...additionalWhere
            },
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
                }
            ],
            order: [['created_at', 'DESC']],
            ...otherOptions
        });
    }

    async findByCustomerId(customerId, options = {}) {
        return await this.model.findAll({
            where: { customer_id: customerId },
            include: [
                {
                    model: db.Product,
                    as: 'product',
                    attributes: ['id', 'name', 'image_url']
                }
            ],
            order: [['created_at', 'DESC']],
            ...options
        });
    }

    async getAverageRating(productId) {
        const result = await this.model.findOne({
            attributes: [
                [
                    db.sequelize.fn('AVG',
                        db.sequelize.col('rating')
                    ),
                    'avgRating'
                ],
                [
                    db.sequelize.fn('COUNT',
                        db.sequelize.col('id')
                    ),
                    'totalReviews'
                ]
            ],
            where: {
                product_id: productId,
                is_visible: true
            },
            raw: true
        });

        // Get rating distribution
        const ratingDistribution = await this.model.findAll({
            attributes: [
                'rating',
                [
                    db.sequelize.fn('COUNT',
                        db.sequelize.col('id')
                    ),
                    'count'
                ]
            ],
            where: {
                product_id: productId,
                is_visible: true
            },
            group: ['rating'],
            raw: true
        });

        // Format rating distribution
        const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratingDistribution.forEach(item => {
            ratingCounts[item.rating] = parseInt(item.count);
        });

        return {
            avgRating: parseFloat(result.avgRating) || 0,
            totalReviews: parseInt(result.totalReviews) || 0,
            ratingCounts
        };
    }
}

export default ReviewRepository;
