# 📦 Product API Documentation

## Base URL
```
http://localhost:5000/api/products
```

---

## 🔓 Public Endpoints

### 1. Get All Products (với phân trang, tìm kiếm, lọc)

**GET** `/api/products`

**Query Parameters:**
```
page=1               // Trang hiện tại (default: 1)
limit=10             // Số sản phẩm mỗi trang (default: 10)
search=laptop        // Tìm kiếm theo tên/mô tả/brand
category_id=1        // Lọc theo danh mục
min_price=1000       // Giá tối thiểu
max_price=50000      // Giá tối đa
sort=newest          // Sắp xếp: newest, price_asc, 
                     // price_desc, name
```

**Example Request:**
```powershell
# PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/api/products?page=1&limit=5" -Method Get

# cURL
curl "http://localhost:5000/api/products?page=1&limit=5"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Dell XPS 15",
        "slug": "dell-xps-15",
        "description": "Premium laptop",
        "price": 45000,
        "stock": 10,
        "category_id": 1,
        "brand": "Dell",
        "discount_percentage": 10,
        "images": "[\"/uploads/products/img1.jpg\"]",
        "created_at": "2024-01-15T...",
        "category": {
          "id": 1,
          "name": "Laptops",
          "slug": "laptops"
        }
      }
    ],
    "pagination": {
      "total": 30,
      "page": 1,
      "limit": 5,
      "totalPages": 6
    }
  }
}
```

---

### 2. Get Product by ID

**GET** `/api/products/:id`

**Example Request:**
```powershell
# PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/api/products/1" -Method Get
```

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": 1,
      "name": "Dell XPS 15",
      "slug": "dell-xps-15",
      "description": "Premium laptop with Intel i7",
      "price": 45000,
      "stock": 10,
      "images": "[\"/uploads/products/img1.jpg\"]",
      "category": {
        "id": 1,
        "name": "Laptops",
        "description": "Laptop computers"
      }
    }
  }
}
```

---

### 3. Get Products by Category

**GET** `/api/products/category/:categoryId`

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Example Request:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/products/category/1?page=1&limit=5" -Method Get
```

---

## 🔒 Protected Endpoints (Admin Only)

### 4. Create Product

**POST** `/api/products`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data
```

**Body (form-data):**
```
name: Dell XPS 15
description: Premium laptop with Intel Core i7
price: 45000
stock: 10
category_id: 1
brand: Dell
discount_percentage: 10
images: [File1, File2, File3]  // Max 5 files, 5MB each
```

**Example in Postman:**
1. Chọn method **POST**
2. URL: `http://localhost:5000/api/products`
3. **Headers tab:**
   - Add: `Authorization: Bearer YOUR_TOKEN`
4. **Body tab:**
   - Chọn **form-data**
   - Add fields:
     ```
     name → Text → "Dell XPS 15"
     description → Text → "Premium laptop..."
     price → Text → "45000"
     stock → Text → "10"
     category_id → Text → "1"
     brand → Text → "Dell"
     discount_percentage → Text → "10"
     images → File → [Chọn file ảnh 1]
     images → File → [Chọn file ảnh 2]
     ```
   - ⚠️ **Quan trọng:** Chọn type **File** cho images!

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": {
      "id": 31,
      "name": "Dell XPS 15",
      "slug": "dell-xps-15",
      "price": 45000,
      "images": "[\"/uploads/products/images-1234567890.jpg\"]"
    }
  }
}
```

---

### 5. Update Product

**PUT** `/api/products/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data
```

**Body (form-data):** Giống như Create, nhưng các field là optional

**Example:**
```powershell
# Update giá và stock
# (Dùng Postman với form-data thay vì PowerShell)
```

---

### 6. Delete Product

**DELETE** `/api/products/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example Request:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/products/31" `
  -Method Delete `
  -Headers @{ Authorization = "Bearer YOUR_TOKEN" }
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 📝 Complete Testing Flow

### Step 1: Login as Admin
```powershell
$loginBody = @{
    email = "admin@ecommerce.com"
    password = "123456"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method Post `
  -Body $loginBody `
  -ContentType "application/json"

$token = $response.data.token
Write-Host "Token: $token"
```

### Step 2: Test GET (Public)
```powershell
# Lấy danh sách products
Invoke-RestMethod -Uri "http://localhost:5000/api/products?page=1&limit=3" -Method Get

# Tìm kiếm
Invoke-RestMethod -Uri "http://localhost:5000/api/products?search=laptop" -Method Get

# Lọc theo giá
Invoke-RestMethod -Uri "http://localhost:5000/api/products?min_price=1000&max_price=5000" -Method Get
```

### Step 3: Create Product (Admin) - Use Postman!

**⚠️ Không thể dùng PowerShell cho upload file!**

Sử dụng **Postman**:
1. Method: **POST**
2. URL: `http://localhost:5000/api/products`
3. **Headers:**
   ```
   Authorization: Bearer YOUR_TOKEN
   ```
4. **Body → form-data:**
   ```
   name → Text → "Test Product"
   description → Text → "Test description"
   price → Text → "1000"
   stock → Text → "50"
   category_id → Text → "1"
   brand → Text → "Test Brand"
   images → File → [Select image 1]
   images → File → [Select image 2]
   ```

### Step 4: Update Product
- Giống Create, nhưng method **PUT** và URL có `:id`

### Step 5: Delete Product
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/products/31" `
  -Method Delete `
  -Headers @{ Authorization = "Bearer $token" }
```

---

## 🐛 Common Errors

### 1. 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided"
}
```
**Fix:** Thêm `Authorization: Bearer YOUR_TOKEN` vào Headers

---

### 2. 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Admin role required"
}
```
**Fix:** Đăng nhập bằng tài khoản Admin

---

### 3. 500 slug cannot be null
```json
{
  "success": false,
  "error": "notNull Violation: Product.slug cannot be null"
}
```
**Fix:** ✅ Đã fix! Controller tự động tạo slug từ name

---

### 4. Images null trong database
```json
{
  "images": null
}
```
**Nguyên nhân:**
- Dùng **raw JSON** thay vì **form-data**
- Chọn type **Text** thay vì **File** cho images field

**Fix:**
1. Body tab → Chọn **form-data** (không phải raw)
2. Add field `images`, chọn type **File** (không phải Text)
3. Click "Select Files" để chọn ảnh

---

### 5. File too large
```json
{
  "success": false,
  "message": "File too large"
}
```
**Fix:** Mỗi ảnh tối đa 5MB, kiểm tra kích thước file

---

### 6. Invalid file type
```json
{
  "success": false,
  "message": "Only image files are allowed"
}
```
**Fix:** Chỉ chấp nhận: jpg, jpeg, png, gif, webp

---

## ✅ Testing Checklist

- [ ] GET /products - Lấy danh sách (có phân trang)
- [ ] GET /products?search=laptop - Tìm kiếm
- [ ] GET /products?category_id=1 - Lọc theo category
- [ ] GET /products?min_price=1000&max_price=5000 - Lọc giá
- [ ] GET /products?sort=price_asc - Sắp xếp
- [ ] GET /products/:id - Chi tiết sản phẩm
- [ ] GET /products/category/:categoryId - Products theo category
- [ ] POST /products - Tạo mới (với ảnh)
- [ ] PUT /products/:id - Cập nhật
- [ ] DELETE /products/:id - Xóa sản phẩm

---

## 📸 Image Upload Notes

### Multer Configuration:
```javascript
- Max files: 5
- Max size per file: 5MB
- Allowed types: jpeg, jpg, png, gif, webp
- Storage: uploads/products/
- Filename format: images-{timestamp}-{random}.{ext}
```

### Database Storage:
```json
// Images lưu dạng JSON string
"images": "[\"/uploads/products/images-1234567890.jpg\", 
           \"/uploads/products/images-0987654321.jpg\"]"
```

### Access Images:
```
http://localhost:5000/uploads/products/images-1234567890.jpg
```

---

## 🎯 Test Accounts

```javascript
// Admin (có quyền tạo/sửa/xóa)
Email: admin@ecommerce.com
Password: 123456

// Customer (chỉ xem)
Email: customer1@example.com
Password: 123456
```

---

**🚀 Happy Testing!**
