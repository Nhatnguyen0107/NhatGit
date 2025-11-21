import db from '../models/index.js';
import { Op } from 'sequelize';

class CategoryRepository {
    constructor() {
        this.model = db.Category;
    }

    async findAndCountAll(options) {
        return await this.model.findAndCountAll(options);
    }

    async findAll(options = {}) {
        return await this.model.findAll(options);
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

    async update(category, data) {
        return await category.update(data);
    }

    async delete(category) {
        return await category.destroy();
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
        const { search, is_active } = filters;
        const where = {};

        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        if (is_active !== undefined) {
            where.is_active = is_active === 'true';
        }

        return where;
    }

    buildOrder(sort = 'newest') {
        switch (sort) {
            case 'name_asc':
                return [['name', 'ASC']];
            case 'name_desc':
                return [['name', 'DESC']];
            case 'oldest':
                return [['created_at', 'ASC']];
            case 'newest':
            default:
                return [['created_at', 'DESC']];
        }
    }

    buildIncludeWithProducts() {
        return [
            {
                model: db.Product,
                as: 'products',
                attributes: ['id', 'name', 'slug', 'price',
                    'images']
            }
        ];
    }
}

export default CategoryRepository;
