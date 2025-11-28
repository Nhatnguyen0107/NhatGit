import CategoryRepository from '../repositories/category.repository.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CategoryService {
    constructor() {
        this.repository = new CategoryRepository();
    }

    generateSlug(text) {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    async getAllCategories(queryParams) {
        const {
            page = 1,
            limit = 10,
            search = '',
            is_active,
            sort = 'newest',
            include_products = false
        } = queryParams;

        const offset = (page - 1) * limit;

        const where = this.repository.buildWhereCondition({
            search,
            is_active
        });

        const order = this.repository.buildOrder(sort);

        const options = {
            where,
            order,
            offset: parseInt(offset),
            limit: parseInt(limit),
            distinct: true
        };

        if (include_products === 'true') {
            options.include =
                this.repository.buildIncludeWithProducts();
        }

        const { rows: categories, count } =
            await this.repository.findAndCountAll(options);

        return {
            categories,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        };
    }

    async getCategoryById(id, includeProducts = false) {
        const options = {};

        if (includeProducts) {
            options.include =
                this.repository.buildIncludeWithProducts();
        }

        const category = await this.repository.findById(
            id,
            options
        );

        if (!category) {
            throw new Error('Category not found');
        }

        return category;
    }

    async createCategory(data, file) {
        const { name, description, is_active } = data;

        if (!name) {
            throw new Error('Category name is required');
        }

        const existingCategory = await this.repository.findOne({
            name
        });

        if (existingCategory) {
            throw new Error(
                'Category with this name already exists'
            );
        }

        const slug = this.generateSlug(name);

        const image_url = file ? `/uploads/categories/${file.filename}` : null;

        const category = await this.repository.create({
            name,
            slug,
            description,
            image_url,
            is_active: is_active !== undefined
                ? is_active
                : true
        });

        return category;
    }

    async updateCategory(id, data, file) {
        const { name, description, is_active } = data;

        const category = await this.repository.findById(id);
        if (!category) {
            throw new Error('Category not found');
        }

        if (name && name !== category.name) {
            const existingCategory =
                await this.repository.findOne({
                    name,
                    id: { [require('sequelize').Op.ne]: id }
                });

            if (existingCategory) {
                throw new Error(
                    'Category with this name already exists'
                );
            }
        }

        const slug = name
            ? this.generateSlug(name)
            : category.slug;

        let image_url = category.image_url;
        if (file) {
            // Delete old image if exists
            if (category.image_url) {
                this.deleteImage(category.image_url);
            }
            image_url = `/uploads/categories/${file.filename}`;
        }

        const updatedCategory = await this.repository.update(
            category,
            {
                name: name || category.name,
                slug,
                description: description !== undefined
                    ? description
                    : category.description,
                image_url,
                is_active: is_active !== undefined
                    ? is_active
                    : category.is_active
            }
        );

        return updatedCategory;
    }

    async deleteCategory(id) {
        const category = await this.repository.findById(id);
        if (!category) {
            throw new Error('Category not found');
        }

        // Check if any products are using this category
        const productCount = await this.repository.model.sequelize
            .models.Product.count({
                where: { category_id: id }
            });

        if (productCount > 0) {
            throw new Error(
                'Cannot delete category with existing products'
            );
        }

        // Delete image if exists
        if (category.image_url) {
            this.deleteImage(category.image_url);
        }

        await this.repository.delete(category);
    }

    async checkCategoryExists(id) {
        return await this.repository.exists(id);
    }

    deleteImage(imagePath) {
        if (!imagePath) return;
        const fullPath = path.join(
            __dirname,
            '../../',
            imagePath
        );
        if (fs.existsSync(fullPath)) {
            try {
                fs.unlinkSync(fullPath);
            } catch (error) {
                console.error(
                    `Failed to delete image: ${fullPath}`,
                    error
                );
            }
        }
    }
}

export default CategoryService;
