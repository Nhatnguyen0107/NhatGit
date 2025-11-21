import db from '../models/index.js';
import { Op } from 'sequelize';

class ProductRepository {
    constructor() {
        this.model = db.Product;
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

    async create(data) {
        return await this.model.create(data);
    }

    async update(product, data) {
        return await product.update(data);
    }

    async delete(product) {
        return await product.destroy();
    }

    async exists(id) {
        const count = await this.model.count({
            where: { id }
        });
        return count > 0;
    }

    async count(where = {}) {
        return await this.model.count({ where });
    }

    buildWhereCondition(filters) {
        const {
            search,
            category_id,
            min_price,
            max_price
        } = filters;
        const where = {};

        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { brand: { [Op.like]: `%${search}%` } }
            ];
        }

        if (category_id) {
            where.category_id = category_id;
        }

        if (min_price || max_price) {
            where.price = {};
            if (min_price) {
                where.price[Op.gte] = parseFloat(min_price);
            }
            if (max_price) {
                where.price[Op.lte] = parseFloat(max_price);
            }
        }

        return where;
    }

    buildOrder(sort = 'newest') {
        switch (sort) {
            case 'price_asc':
                return [['price', 'ASC']];
            case 'price_desc':
                return [['price', 'DESC']];
            case 'name':
                return [['name', 'ASC']];
            case 'newest':
            default:
                return [['created_at', 'DESC']];
        }
    }

    buildInclude() {
        return [
            {
                model: db.Category,
                as: 'category',
                attributes: ['id', 'name', 'slug']
            }
        ];
    }

    buildDetailInclude() {
        return [
            {
                model: db.Category,
                as: 'category',
                attributes: ['id', 'name', 'slug', 'description']
            }
        ];
    }
}

export default ProductRepository;
