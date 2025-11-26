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
            stock_quantity,
            category_id,
            brand,
            discount_percentage,
            is_active
        } = data;

        // Validate required fields
        if (!name || !price || stock_quantity === undefined || !category_id) {
            throw new Error(
                'Missing required fields: name, price, stock_quantity, ' +
                'category_id'
            );
        }

        // Kiểm tra category tồn tại
        const category = await db.Category.findByPk(category_id);
        if (!category) {
            throw new Error('Category not found');
        }

        // Xử lý upload ảnh
        let imageUrl = null;
        let additionalImages = [];
        if (files && files.length > 0) {
            imageUrl = `/uploads/products/${files[0].filename}`;
            if (files.length > 1) {
                additionalImages = files.slice(1).map(file =>
                    `/uploads/products/${file.filename}`
                );
            }
        }

        const slug = this.generateSlug(name);

        const product = await this.repository.create({
            name,
            slug,
            description,
            price: parseFloat(price),
            stock_quantity: parseInt(stock_quantity),
            category_id,
            brand,
            discount_percentage: discount_percentage
                ? parseFloat(discount_percentage)
                : 0,
            image_url: imageUrl,
            additional_images: additionalImages.length > 0
                ? additionalImages
                : [],
            is_active: is_active === 'true' || is_active === true
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
            stock_quantity,
            category_id,
            brand,
            discount_percentage,
            is_active
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

        let imageUrl = product.image_url;
        let additionalImages = product.additional_images || [];

        if (files && files.length > 0) {
            // Delete old images
            if (imageUrl) {
                this.deleteProductImage(imageUrl);
            }
            if (additionalImages.length > 0) {
                additionalImages.forEach(img => this.deleteProductImage(img));
            }

            // Set new images
            imageUrl = `/uploads/products/${files[0].filename}`;
            additionalImages = files.length > 1
                ? files.slice(1).map(file => `/uploads/products/${file.filename}`)
                : [];
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
                stock_quantity: stock_quantity !== undefined
                    ? parseInt(stock_quantity)
                    : product.stock_quantity,
                category_id: category_id ||
                    product.category_id,
                brand: brand || product.brand,
                discount_percentage: discount_percentage
                    ? parseFloat(discount_percentage)
                    : product.discount_percentage,
                image_url: imageUrl,
                additional_images: additionalImages,
                is_active: is_active !== undefined
                    ? (is_active === 'true' || is_active === true)
                    : product.is_active
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

        // Delete main image
        if (product.image_url) {
            this.deleteProductImage(product.image_url);
        }

        // Delete additional images
        if (product.additional_images && Array.isArray(product.additional_images)) {
            this.deleteProductImages(product.additional_images);
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

    deleteProductImage(imagePath) {
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

    deleteProductImages(images) {
        if (!Array.isArray(images)) return;
        images.forEach(imagePath => this.deleteProductImage(imagePath));
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
