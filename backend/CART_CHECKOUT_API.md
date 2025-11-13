# 🛒 Cart & Checkout API Documentation

## 🎯 Overview

Module Cart & Checkout được xây dựng theo kiến trúc 4 tầng với đầy đủ transaction handling để đảm bảo tính toàn vẹn dữ liệu khi checkout.

**Key Features:**
- ✅ CRUD operations cho giỏ hàng
- ✅ Checkout với Sequelize Transaction
- ✅ Stock validation và auto-decrease
- ✅ Order generation với unique order number
- ✅ Customer role required
- ✅ Thread-safe với database locking

---

## 📡 API Endpoints

### 🛒 Cart Management

#### 1. GET `/api/cart`
Lấy giỏ hàng hiện tại của user đang đăng nhập

**Headers:**
```
Authorization: Bearer <customer_token>
```

**Response:**
```json
{
    "success": true,
    "data": {
        "items": [
            {
                "id": "cart-item-uuid",
                "product_id": "product-uuid",
                "product": {
                    "id": "product-uuid",
                    "name": "Product Name",
                    "slug": "product-name",
                    "price": 99.99,
                    "stock": 50,
                    "images": ["url1", "url2"],
                    "discount_percentage": 10
                },
                "quantity": 2,
                "created_at": "2024-01-01T00:00:00.000Z"
            }
        ],
        "subtotal": 179.98,
        "totalItems": 2
    }
}
```

---

#### 2. POST `/api/cart`
Thêm sản phẩm vào giỏ hàng

**Headers:**
```
Authorization: Bearer <customer_token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "product_id": "product-uuid",
    "quantity": 2
}
```

**Validation:**
- `product_id` (required): ID sản phẩm
- `quantity` (optional): Số lượng, default = 1, min = 1
- Kiểm tra stock có đủ không
- Nếu sản phẩm đã có trong cart → tăng quantity

**Success Response (201):**
```json
{
    "success": true,
    "message": "Product added to cart",
    "data": {
        "cartItem": {
            "id": "cart-item-uuid",
            "user_id": "user-uuid",
            "product_id": "product-uuid",
            "quantity": 2,
            "created_at": "2024-01-01T00:00:00.000Z"
        }
    }
}
```

**Error Responses:**

400 - Missing product_id:
```json
{
    "success": false,
    "message": "Product ID is required"
}
```

404 - Product not found:
```json
{
    "success": false,
    "message": "Product not found"
}
```

400 - Insufficient stock:
```json
{
    "success": false,
    "message": "Insufficient stock. Only 5 items available"
}
```

---

#### 3. PUT `/api/cart/:id`
Cập nhật số lượng item trong giỏ hàng

**Headers:**
```
Authorization: Bearer <customer_token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "quantity": 3
}
```

**Validation:**
- `quantity` (required): Số lượng mới, min = 1
- Kiểm tra stock có đủ không
- Chỉ owner của cart item mới update được

**Success Response (200):**
```json
{
    "success": true,
    "message": "Cart item updated",
    "data": {
        "cartItem": {
            "id": "cart-item-uuid",
            "quantity": 3,
            "updated_at": "2024-01-01T00:00:00.000Z"
        }
    }
}
```

**Error Responses:**

400 - Invalid quantity:
```json
{
    "success": false,
    "message": "Valid quantity is required"
}
```

404 - Not found:
```json
{
    "success": false,
    "message": "Cart item not found"
}
```

403 - Unauthorized:
```json
{
    "success": false,
    "message": "Unauthorized to update this item"
}
```

400 - Insufficient stock:
```json
{
    "success": false,
    "message": "Insufficient stock. Only 2 items available"
}
```

---

#### 4. DELETE `/api/cart/:id`
Xóa item khỏi giỏ hàng

**Headers:**
```
Authorization: Bearer <customer_token>
```

**Success Response (200):**
```json
{
    "success": true,
    "message": "Item removed from cart"
}
```

**Error Responses:**

404 - Not found:
```json
{
    "success": false,
    "message": "Cart item not found"
}
```

403 - Unauthorized:
```json
{
    "success": false,
    "message": "Unauthorized to remove this item"
}
```

---

#### 5. DELETE `/api/cart`
Xóa toàn bộ giỏ hàng

**Headers:**
```
Authorization: Bearer <customer_token>
```

**Success Response (200):**
```json
{
    "success": true,
    "message": "Cart cleared successfully"
}
```

---

### 💳 Checkout

#### 6. POST `/api/checkout`
Thực hiện checkout - Tạo order từ giỏ hàng

**Headers:**
```
Authorization: Bearer <customer_token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "shipping_address": "123 Main St, City, Country",
    "payment_method": "COD",
    "notes": "Please deliver before 5 PM"
}
```

**Validation:**
- `shipping_address` (required): Địa chỉ giao hàng
- `payment_method` (optional): Phương thức thanh toán, default = "COD"
- `notes` (optional): Ghi chú cho đơn hàng
- Cart không được rỗng
- Customer profile phải tồn tại
- Stock phải đủ cho tất cả items

**Transaction Process:**
1. Begin transaction
2. Lock products (for update)
3. Validate stock cho tất cả items
4. Create Order với order_number unique
5. Create OrderItems với price snapshot
6. Decrease product stock
7. Delete cart items
8. Commit transaction
9. Return order với full details

**Success Response (201):**
```json
{
    "success": true,
    "message": "Order placed successfully",
    "data": {
        "order": {
            "id": "order-uuid",
            "order_number": "ORD-1704067200000-123",
            "customer_id": "customer-uuid",
            "status": "pending",
            "subtotal": "179.98",
            "discount_amount": "0.00",
            "shipping_cost": "0.00",
            "total_amount": "179.98",
            "payment_method": "COD",
            "payment_status": "pending",
            "shipping_address": "123 Main St, City, Country",
            "notes": "Please deliver before 5 PM",
            "created_at": "2024-01-01T00:00:00.000Z",
            "items": [
                {
                    "id": "order-item-uuid",
                    "order_id": "order-uuid",
                    "product_id": "product-uuid",
                    "product_name": "Product Name",
                    "product_price": "89.99",
                    "quantity": 2,
                    "discount_percentage": "10.00",
                    "subtotal": "179.98",
                    "product": {
                        "id": "product-uuid",
                        "name": "Product Name",
                        "slug": "product-name",
                        "images": ["url1", "url2"]
                    }
                }
            ],
            "customer": {
                "id": "customer-uuid",
                "first_name": "John",
                "last_name": "Doe",
                "phone": "1234567890"
            }
        }
    }
}
```

**Error Responses:**

400 - Missing shipping address:
```json
{
    "success": false,
    "message": "Shipping address is required"
}
```

400 - Empty cart:
```json
{
    "success": false,
    "message": "Cart is empty"
}
```

404 - Customer not found:
```json
{
    "success": false,
    "message": "Customer profile not found"
}
```

400 - Insufficient stock:
```json
{
    "success": false,
    "message": "Insufficient stock for Product Name. Only 5 available"
}
```

**Note:** Nếu có bất kỳ lỗi nào → Transaction sẽ rollback, không có thay đổi nào được lưu.

---

#### 7. GET `/api/checkout/validate`
Validate giỏ hàng trước khi checkout

**Headers:**
```
Authorization: Bearer <customer_token>
```

**Success Response (200):**
```json
{
    "success": true,
    "message": "Cart is valid for checkout"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Cart validation failed: Product A: Only 2 available, you have 5 in cart; Product B not found"
}
```

---

## 🔐 Authentication & Authorization

**All endpoints require:**
- Valid JWT token
- Role = "Customer"

**Example Request:**
```bash
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer YOUR_CUSTOMER_TOKEN"
```

**Error Responses:**

401 - Unauthorized:
```json
{
    "success": false,
    "message": "Authentication required"
}
```

403 - Forbidden:
```json
{
    "success": false,
    "message": "Access denied. Customer role required"
}
```

---

## 🏗️ Architecture

### Repository Layer
`cart.repository.js`

```javascript
class CartRepository {
    async findByUserId(userId) { ... }
    async findByUserAndProduct(userId, productId) { ... }
    async create(data) { ... }
    async update(cartItem, data) { ... }
    async delete(cartItem) { ... }
    async deleteByUserId(userId) { ... }
    async calculateCartTotal(userId) { ... }
}
```

### Service Layer
`cart.service.js` & `checkout.service.js`

```javascript
class CartService {
    async getCart(userId) { ... }
    async addToCart(userId, productId, quantity) { ... }
    async updateCartItem(userId, cartItemId, quantity) { ... }
    async removeFromCart(userId, cartItemId) { ... }
}

class CheckoutService {
    async checkout(userId, checkoutData) {
        const transaction = await sequelize.transaction();
        try {
            // 1. Validate cart
            // 2. Lock products
            // 3. Create order
            // 4. Create order items
            // 5. Decrease stock
            // 6. Clear cart
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
```

---

## 💡 Business Logic

### Cart Operations

1. **Add to Cart:**
   - Check product exists
   - Validate stock available
   - If item exists → increase quantity
   - If new item → create new cart item

2. **Update Quantity:**
   - Validate ownership
   - Check new quantity <= stock
   - Update cart item

3. **Remove Item:**
   - Validate ownership
   - Delete cart item

### Checkout Process

1. **Validation Phase:**
   - Cart not empty
   - Customer profile exists
   - All products exist
   - Stock sufficient

2. **Transaction Phase (ACID):**
   ```
   BEGIN TRANSACTION
   ├─ Lock all products (FOR UPDATE)
   ├─ Re-validate stock
   ├─ Create Order
   ├─ Create OrderItems with price snapshot
   ├─ Decrease product stock
   └─ Delete cart items
   COMMIT
   ```

3. **Post-Transaction:**
   - Fetch order with full details
   - Return to client

---

## 🧪 Testing Examples

### Get cart
```bash
curl http://localhost:5000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Add to cart
```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product_id":"product-uuid","quantity":2}'
```

### Update cart item
```bash
curl -X PUT http://localhost:5000/api/cart/cart-item-uuid \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity":5}'
```

### Remove from cart
```bash
curl -X DELETE http://localhost:5000/api/cart/cart-item-uuid \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Validate checkout
```bash
curl http://localhost:5000/api/checkout/validate \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Checkout
```bash
curl -X POST http://localhost:5000/api/checkout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_address":"123 Main St, City, Country",
    "payment_method":"COD",
    "notes":"Deliver before 5 PM"
  }'
```

---

## 📊 HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Success (GET, PUT, DELETE) |
| 201 | Created (POST cart, checkout) |
| 400 | Bad Request (validation errors, stock issues) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (not owner, not customer) |
| 404 | Not Found (product, cart item, customer) |
| 500 | Internal Server Error |

---

## ⚠️ Important Notes

1. **Stock Management:** Stock được giảm chỉ khi checkout thành công, không giảm khi add to cart

2. **Transaction Safety:** Checkout sử dụng database transaction với row locking để prevent race conditions

3. **Price Snapshot:** OrderItem lưu giá tại thời điểm đặt hàng (product_price), không bị ảnh hưởng bởi thay đổi giá sau này

4. **Cart Expiration:** CartItem có field `expires_at` (có thể implement background job để xóa cart cũ)

5. **Unique Constraint:** Một user chỉ có thể add một product một lần vào cart, update quantity nếu muốn thêm

6. **Order Number Format:** `ORD-{timestamp}-{random}` đảm bảo unique
