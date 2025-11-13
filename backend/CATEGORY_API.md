# 📦 Category CRUD API Documentation

## 🎯 Overview

Module Category được xây dựng theo kiến trúc 4 tầng:
- **Repository:** Tương tác database
- **Service:** Business logic & validation
- **Controller:** Xử lý HTTP request/response
- **Route:** Định nghĩa endpoints & middleware

---

## 📡 API Endpoints

### 🔓 Public Routes

#### 1. GET `/api/categories`
Lấy danh sách tất cả categories với phân trang và filter

**Query Parameters:**
```javascript
{
    page: 1,              // Trang hiện tại (default: 1)
    limit: 10,            // Số items/trang (default: 10)
    search: "",           // Tìm kiếm theo name, description
    is_active: "true",    // Filter theo trạng thái
    sort: "newest",       // newest|oldest|name_asc|name_desc
    include_products: "false" // Include danh sách products
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "categories": [
            {
                "id": 1,
                "name": "Electronics",
                "slug": "electronics",
                "description": "Electronic devices",
                "image_url": "/uploads/categories/electronics.jpg",
                "is_active": true,
                "created_at": "2024-01-01T00:00:00.000Z",
                "updated_at": "2024-01-01T00:00:00.000Z"
            }
        ],
        "pagination": {
            "total": 50,
            "page": 1,
            "limit": 10,
            "totalPages": 5
        }
    }
}
```

---

#### 2. GET `/api/categories/:id`
Lấy chi tiết một category

**Query Parameters:**
```javascript
{
    include_products: "false" // Bao gồm danh sách products
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "category": {
            "id": 1,
            "name": "Electronics",
            "slug": "electronics",
            "description": "Electronic devices",
            "image_url": "/uploads/categories/electronics.jpg",
            "is_active": true,
            "products": [...]  // Nếu include_products=true
        }
    }
}
```

**Error Response (404):**
```json
{
    "success": false,
    "message": "Category not found",
    "error": "Category not found"
}
```

---

### 🔒 Admin Only Routes

#### 3. POST `/api/categories`
Tạo category mới (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
    "name": "Electronics",
    "description": "Electronic devices and gadgets",
    "image_url": "/uploads/categories/electronics.jpg",
    "is_active": true
}
```

**Validation:**
- `name` (required): Không được trống và phải unique
- `description` (optional): Mô tả danh mục
- `image_url` (optional): URL ảnh đại diện
- `is_active` (optional): Trạng thái (default: true)

**Success Response (201):**
```json
{
    "success": true,
    "message": "Category created successfully",
    "data": {
        "category": {
            "id": 1,
            "name": "Electronics",
            "slug": "electronics",
            "description": "Electronic devices and gadgets",
            "image_url": "/uploads/categories/electronics.jpg",
            "is_active": true
        }
    }
}
```

**Error Responses:**

400 - Missing name:
```json
{
    "success": false,
    "message": "Category name is required",
    "error": "Category name is required"
}
```

409 - Duplicate name:
```json
{
    "success": false,
    "message": "Category with this name already exists",
    "error": "Category with this name already exists"
}
```

---

#### 4. PUT `/api/categories/:id`
Cập nhật category (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
    "name": "Electronics & Gadgets",
    "description": "Updated description",
    "image_url": "/uploads/categories/new-image.jpg",
    "is_active": false
}
```

**Note:** Tất cả fields đều optional. Chỉ update fields được gửi lên.

**Success Response (200):**
```json
{
    "success": true,
    "message": "Category updated successfully",
    "data": {
        "category": {
            "id": 1,
            "name": "Electronics & Gadgets",
            "slug": "electronics-gadgets",
            ...
        }
    }
}
```

**Error Responses:**

404 - Not found:
```json
{
    "success": false,
    "message": "Category not found",
    "error": "Category not found"
}
```

409 - Duplicate name:
```json
{
    "success": false,
    "message": "Category with this name already exists",
    "error": "Category with this name already exists"
}
```

---

#### 5. DELETE `/api/categories/:id`
Xóa category (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
    "success": true,
    "message": "Category deleted successfully"
}
```

**Error Responses:**

404 - Not found:
```json
{
    "success": false,
    "message": "Category not found",
    "error": "Category not found"
}
```

409 - Has products:
```json
{
    "success": false,
    "message": "Cannot delete category with existing products",
    "error": "Cannot delete category with existing products"
}
```

---

## 🔐 Authentication & Authorization

### Admin Routes
Các routes CREATE, UPDATE, DELETE yêu cầu:
1. **Authentication:** Valid JWT token
2. **Authorization:** Role = "Admin"

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Category",
    "description": "Category description"
  }'
```

**Error Response (401 - Unauthorized):**
```json
{
    "success": false,
    "message": "Authentication required"
}
```

**Error Response (403 - Forbidden):**
```json
{
    "success": false,
    "message": "Access denied. Admin role required"
}
```

---

## 🏗️ Code Architecture

### 1. Repository Layer
`src/repositories/category.repository.js`

```javascript
class CategoryRepository {
    constructor() {
        this.model = db.Category;
    }

    async findAndCountAll(options) { ... }
    async findById(id) { ... }
    async create(data) { ... }
    async update(category, data) { ... }
    async delete(category) { ... }
    buildWhereCondition(filters) { ... }
    buildOrder(sort) { ... }
}
```

### 2. Service Layer
`src/services/category.service.js`

```javascript
class CategoryService {
    constructor() {
        this.repository = new CategoryRepository();
    }

    async getAllCategories(queryParams) { ... }
    async getCategoryById(id) { ... }
    async createCategory(data) { ... }
    async updateCategory(id, data) { ... }
    async deleteCategory(id) { ... }
    generateSlug(text) { ... }
}
```

### 3. Controller Layer
`src/controllers/category.controller.js`

```javascript
class CategoryController {
    constructor() {
        this.service = new CategoryService();
    }

    async getAllCategories(req, res) { ... }
    async getCategoryById(req, res) { ... }
    async createCategory(req, res) { ... }
    async updateCategory(req, res) { ... }
    async deleteCategory(req, res) { ... }
}
```

### 4. Route Layer
`src/routes/category.routes.js`

```javascript
const router = express.Router();
const controller = new CategoryController();

router.get('/', controller.getAllCategories.bind(controller));
router.post('/', authenticate, authorize('Admin'), 
    controller.createCategory.bind(controller));
// ... more routes
```

---

## ✅ Business Rules

1. **Unique Name:** Tên category phải unique trong hệ thống
2. **Auto Slug:** Slug tự động generate từ name
3. **Prevent Delete:** Không được xóa category có products
4. **Default Active:** Category mặc định active khi tạo
5. **Optional Fields:** Description và image_url là optional

---

## 🧪 Testing Examples

### Get all categories
```bash
curl http://localhost:5000/api/categories
```

### Get with filters
```bash
curl "http://localhost:5000/api/categories?page=1&limit=5&search=electronic&is_active=true"
```

### Create category (Admin)
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Books","description":"All kinds of books"}'
```

### Update category (Admin)
```bash
curl -X PUT http://localhost:5000/api/categories/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'
```

### Delete category (Admin)
```bash
curl -X DELETE http://localhost:5000/api/categories/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success (GET, PUT, DELETE) |
| 201 | Created (POST) |
| 400 | Bad Request (validation errors) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (not admin) |
| 404 | Not Found |
| 409 | Conflict (duplicate name, has products) |
| 500 | Internal Server Error |
