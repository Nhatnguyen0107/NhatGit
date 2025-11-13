# 🏗️ Kiến trúc 4 tầng - Product Module (Hoàn thành)

## 📂 Cấu trúc thư mục

```
src/
├── controllers/
│   └── product.controller.js    # Xử lý request/response
├── services/
│   └── product.service.js       # Business logic
├── repositories/
│   └── product.repository.js    # Tương tác database
└── routes/
    └── product.routes.js        # Định nghĩa endpoints
```

---

## 🔄 Luồng hoạt động

```
Client Request
    ↓
Route (product.routes.js)
    ↓
Controller (product.controller.js) - Xử lý request/response
    ↓
Service (product.service.js) - Business logic, validation
    ↓
Repository (product.repository.js) - Database operations
    ↓
Database (Sequelize Models)
    ↓
Response về Client
```

---

## 📝 Chi tiết từng tầng

### 1️⃣ Repository Layer (product.repository.js)

**Nhiệm vụ:** Tương tác trực tiếp với database

```javascript
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

    async create(data) {
        return await this.model.create(data);
    }

    async update(product, data) {
        return await product.update(data);
    }

    async delete(product) {
        return await product.destroy();
    }

    buildWhereCondition(filters) {
        // Build where clause cho query
    }

    buildOrder(sort) {
        // Build order clause
    }

    buildInclude() {
        // Build include (join) clause
    }
}

export default ProductRepository;
```

---

### 2️⃣ Service Layer (product.service.js)

**Nhiệm vụ:** Business logic, validation, gọi repository

```javascript
import ProductRepository from '../repositories/product.repository.js';
import db from '../models/index.js';

class ProductService {
    constructor() {
        this.repository = new ProductRepository();
    }

    async getAllProducts(queryParams) {
        const where = this.repository.buildWhereCondition({
            search: queryParams.search,
            category_id: queryParams.category_id,
            min_price: queryParams.min_price,
            max_price: queryParams.max_price
        });

        const order = this.repository.buildOrder(
            queryParams.sort
        );
        
        const { rows, count } = 
            await this.repository.findAndCountAll({
                where,
                order,
                limit: parseInt(queryParams.limit),
                offset: (queryParams.page - 1) * 
                    queryParams.limit
            });

        return {
            products: rows,
            pagination: {
                total: count,
                page: parseInt(queryParams.page),
                limit: parseInt(queryParams.limit),
                totalPages: Math.ceil(
                    count / queryParams.limit
                )
            }
        };
    }

    async createProduct(data, files) {
        // Validate
        if (!data.name || !data.price) {
            throw new Error('Missing required fields');
        }

        // Check category exists
        const category = await db.Category.findByPk(
            data.category_id
        );
        if (!category) {
            throw new Error('Category not found');
        }

        // Process files
        let images = [];
        if (files && files.length > 0) {
            images = files.map(file => 
                `/uploads/products/${file.filename}`
            );
        }

        // Create product
        return await this.repository.create({
            ...data,
            images: JSON.stringify(images)
        });
    }

    async updateProduct(id, data, files) {
        const product = await this.repository.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }

        // Update logic...
        return await this.repository.update(product, data);
    }

    async deleteProduct(id) {
        const product = await this.repository.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }

        await this.repository.delete(product);
    }
}

export default ProductService;
```

---

### 3️⃣ Controller Layer (product.controller.js)

**Nhiệm vụ:** Xử lý HTTP request/response, gọi service

```javascript
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

            const statusCode = 
                error.message === 'Category not found' ? 404
                : error.message.includes('Missing') ? 400
                : 500;

            res.status(statusCode).json({
                success: false,
                message: error.message,
                error: error.message
            });
        }
    }

    async updateProduct(req, res) {
        // Similar pattern...
    }

    async deleteProduct(req, res) {
        // Similar pattern...
    }
}

export default ProductController;
```

---

### 4️⃣ Route Layer (product.routes.js)

**Nhiệm vụ:** Định nghĩa endpoints, middleware

```javascript
import express from 'express';
import ProductController from '../controllers/product.controller.js';
import { authenticate, authorize } from 
    '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();
const controller = new ProductController();

router.get('/', controller.getAllProducts.bind(controller));

router.get('/:id', controller.getProductById.bind(controller));

router.post(
    '/',
    authenticate,
    authorize('Admin'),
    upload.array('images', 5),
    controller.createProduct.bind(controller)
);

router.put(
    '/:id',
    authenticate,
    authorize('Admin'),
    upload.array('images', 5),
    controller.updateProduct.bind(controller)
);

router.delete(
    '/:id',
    authenticate,
    authorize('Admin'),
    controller.deleteProduct.bind(controller)
);

export default router;
```

---

## ✅ Ưu điểm của kiến trúc này

1. **Separation of Concerns:** Mỗi tầng có trách nhiệm riêng biệt
2. **Dễ test:** Có thể test từng tầng độc lập
3. **Dễ maintain:** Thay đổi logic không ảnh hưởng nhiều tầng
4. **Tái sử dụng:** Service/Repository có thể dùng lại
5. **Scalable:** Dễ mở rộng thêm tính năng

---

## 🔄 Áp dụng cho module khác

Để tạo module mới (VD: Category, Order...), làm theo thứ tự:

1. **Tạo Repository**
   - Định nghĩa các method tương tác DB
   - Export class (không phải instance)

2. **Tạo Service**
   - Khởi tạo repository trong constructor
   - Viết business logic
   - Validate dữ liệu
   - Export class

3. **Tạo Controller**
   - Khởi tạo service trong constructor
   - Xử lý request/response
   - Handle errors với status code phù hợp
   - Export class

4. **Tạo Route**
   - Import Controller
   - Khởi tạo instance: `const controller = new Controller()`
   - Định nghĩa routes với `.bind(controller)`
   - Thêm middleware nếu cần

---

## 📌 Lưu ý quan trọng

- ✅ **Luôn export class**, không export instance
- ✅ **Luôn bind methods** trong routes: `.bind(controller)`
- ✅ **Error handling** ở Controller, throw Error ở Service
- ✅ **Business logic** ở Service, không ở Controller
- ✅ **Database operations** chỉ ở Repository
- ✅ **Validation** ở Service layer
- ✅ **Console log** dùng emoji ❌ ✅ để dễ nhận biết

---

## 🎯 Checklist khi tạo module mới

- [ ] Repository: Export class với constructor
- [ ] Service: Constructor khởi tạo repository
- [ ] Controller: Constructor khởi tạo service
- [ ] Route: Tạo controller instance và bind methods
- [ ] Error handling: Status code phù hợp
- [ ] Validation: Trong service layer
- [ ] No comments: Chỉ giữ comments giải thích logic
