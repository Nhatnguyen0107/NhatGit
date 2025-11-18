import ProductRepository from '../repositories/product.repository.js';
import db from '../models/index.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductService {
    constructor() {
        this.repository = new ProductRepository();
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

    /**
     * Lấy danh sách sản phẩm với filter, search, pagination
     * @param {Object} queryParams - Query parameters từ request
     * @returns {Promise<Object>}
     */
    async getAllProducts(queryParams) {
        const {
            page = 1,
            limit = 10,
            search = '',
            category_id,
            min_price,
            max_price,
            sort = 'newest'
        } = queryParams;

        const offset = (page - 1) * limit;

        const where = this.repository.buildWhereCondition({
            search,
            category_id,
            min_price,
            max_price
        });

        const order = this.repository.buildOrder(sort);
        const include = this.repository.buildInclude();

        const { rows: products, count } =
            await this.repository.findAndCountAll({
                where,
                include,
                offset: parseInt(offset),
                limit: parseInt(limit),
                order,
                distinct: true
            });

        return {
            products,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        };
    }

    async getProductById(id) {
        const include = this.repository.buildDetailInclude();

        const product = await this.repository.findById(id, {
            include
        });

        if (!product) {
            throw new Error('Product not found');
        }

        return product;
    }

    async createProduct(data, files = []) {
        const {
            name,
            description,
            price,
            stock,
            category_id,
            brand,
            discount_percentage
        } = data;

        // Validate required fields
        if (!name || !price || !stock || !category_id) {
            throw new Error(
                'Missing required fields: name, price, stock, ' +
                'category_id'
            );
        }

        // Kiểm tra category tồn tại
        const category = await db.Category.findByPk(category_id);
        if (!category) {
            throw new Error('Category not found');
        }

        // Xử lý upload ảnh
        let images = [];
        if (files && files.length > 0) {
            images = files.map(file =>
                `/uploads/products/${file.filename}`
            );
        }

        const slug = this.generateSlug(name);

        const product = await this.repository.create({
            name,
            slug,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            category_id,
            brand,
            discount_percentage: discount_percentage
                ? parseFloat(discount_percentage)
                : 0,
            images: images.length > 0
                ? JSON.stringify(images)
                : null
        });

        const include = this.repository.buildInclude();
        return await this.repository.findById(product.id, {
            include
        });
    }

    async updateProduct(id, data, files = []) {
        const {
            name,
            description,
            price,
            stock,
            category_id,
            brand,
            discount_percentage
        } = data;

        const product = await this.repository.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }

        if (category_id && category_id !== product.category_id) {
            const category = await db.Category.findByPk(
                category_id
            );
            if (!category) {
                throw new Error('Category not found');
            }
        }

        let images = product.images
            ? JSON.parse(product.images)
            : [];

        if (files && files.length > 0) {
            this.deleteProductImages(images);
            images = files.map(file =>
                `/uploads/products/${file.filename}`
            );
        }

        const slug = name
            ? this.generateSlug(name)
            : product.slug;

        const updatedProduct = await this.repository.update(
            product,
            {
                name: name || product.name,
                slug,
                description: description || product.description,
                price: price
                    ? parseFloat(price)
                    : product.price,
                stock: stock
                    ? parseInt(stock)
                    : product.stock,
                category_id: category_id ||
                    product.category_id,
                brand: brand || product.brand,
                discount_percentage: discount_percentage
                    ? parseFloat(discount_percentage)
                    : product.discount_percentage,
                images: JSON.stringify(images)
            }
        );

        const include = this.repository.buildInclude();
        return await this.repository.findById(
            updatedProduct.id,
            { include }
        );
    }

    async deleteProduct(id) {
        const product = await this.repository.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }

        if (product.images) {
            const images = JSON.parse(product.images);
            this.deleteProductImages(images);
        }

        await this.repository.delete(product);
    }

    async getProductsByCategory(categoryId, queryParams) {
        const { page = 1, limit = 10 } = queryParams;
        const offset = (page - 1) * limit;

        const category = await db.Category.findByPk(categoryId);
        if (!category) {
            throw new Error('Category not found');
        }

        const include = this.repository.buildInclude();

        const { rows: products, count } =
            await this.repository.findAndCountAll({
                where: { category_id: categoryId },
                include,
                offset: parseInt(offset),
                limit: parseInt(limit),
                order: [['created_at', 'DESC']]
            });

        return {
            category: {
                id: category.id,
                name: category.name,
                slug: category.slug
            },
            products,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        };
    }

    deleteProductImages(images) {
        images.forEach(imagePath => {
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
        });
    }

    rollbackUploadedFiles(files) {
        if (files && files.length > 0) {
            files.forEach(file => {
                const filePath = file.path;
                if (fs.existsSync(filePath)) {
                    try {
                        fs.unlinkSync(filePath);
                    } catch (error) {
                        console.error(
                            `Failed to delete file: ${filePath}`,
                            error
                        );
                    }
                }
            });
        }
    }
}

export default ProductService;
