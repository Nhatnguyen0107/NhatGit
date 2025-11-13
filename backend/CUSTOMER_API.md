# Customer Management API Documentation

## Overview
API để quản lý thông tin khách hàng dành cho Admin. Cho phép xem danh sách, chi tiết, và cập nhật thông tin khách hàng.

---

## Authentication & Authorization
- **Required:** All endpoints require JWT authentication
- **Roles:** Admin only
- **Header:** `Authorization: Bearer <token>`

---

## Endpoints

### 1. Get All Customers
Lấy danh sách tất cả khách hàng với phân trang và tìm kiếm.

**Request:**
```http
GET /api/customers
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Số trang (default: 1) |
| limit | number | No | Số item/trang (default: 10) |
| search | string | No | Tìm theo phone hoặc address |
| phone | string | No | Lọc theo số điện thoại |
| sort | string | No | Sắp xếp: newest, oldest, phone |
| includeOrders | boolean | No | Include 5 recent orders |

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": "uuid",
            "user_id": "uuid",
            "phone": "0123456789",
            "address": "123 Street, City",
            "createdAt": "2024-01-15T10:30:00.000Z",
            "updatedAt": "2024-01-15T10:30:00.000Z",
            "user": {
                "id": "uuid",
                "username": "customer1",
                "email": "customer@example.com",
                "full_name": "Customer Name"
            },
            "orders": [
                {
                    "id": "uuid",
                    "order_number": "ORD-1234567890123-ABC",
                    "total_amount": 500000,
                    "status": "delivered",
                    "payment_status": "paid",
                    "createdAt": "2024-01-14T08:00:00.000Z"
                }
            ]
        }
    ],
    "pagination": {
        "total": 50,
        "page": 1,
        "limit": 10,
        "totalPages": 5
    }
}
```

---

### 2. Get Customer by ID
Lấy chi tiết khách hàng theo ID.

**Request:**
```http
GET /api/customers/:id
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| includeOrders | boolean | No | Include recent orders (default: false) |

**Response:**
```json
{
    "success": true,
    "data": {
        "id": "uuid",
        "user_id": "uuid",
        "phone": "0123456789",
        "address": "123 Street, City",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "user": {
            "id": "uuid",
            "username": "customer1",
            "email": "customer@example.com",
            "full_name": "Customer Name"
        }
    }
}
```

---

### 3. Update Customer Information
Cập nhật thông tin khách hàng.

**Request:**
```http
PUT /api/customers/:id
Content-Type: application/json

{
    "phone": "0987654321",
    "address": "456 New Street, New City"
}
```

**Allowed Fields:**
- `phone` - Số điện thoại (phải unique)
- `address` - Địa chỉ

**Business Rules:**
- Chỉ có thể cập nhật `phone` và `address`
- Số điện thoại phải unique
- Không thể update `user_id`

**Response (Success):**
```json
{
    "success": true,
    "message": "Customer updated successfully",
    "data": {
        "id": "uuid",
        "user_id": "uuid",
        "phone": "0987654321",
        "address": "456 New Street, New City",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-16T14:20:00.000Z",
        "user": {
            "id": "uuid",
            "username": "customer1",
            "email": "customer@example.com",
            "full_name": "Customer Name"
        }
    }
}
```

**Response (Error - Phone Already Exists):**
```json
{
    "success": false,
    "message": "Phone number already in use"
}
```

**Response (Error - No Valid Fields):**
```json
{
    "success": false,
    "message": "No valid fields to update"
}
```

---

### 4. Get Customer Statistics
Lấy thống kê số lượng khách hàng.

**Request:**
```http
GET /api/customers/statistics
```

**Response:**
```json
{
    "success": true,
    "data": {
        "total": 150,
        "withOrders": 120,
        "withoutOrders": 30
    }
}
```

---

### 5. Get Customer by User ID
Lấy thông tin customer theo User ID.

**Request:**
```http
GET /api/customers/user/:userId
```

**Response:**
```json
{
    "success": true,
    "data": {
        "id": "uuid",
        "user_id": "uuid",
        "phone": "0123456789",
        "address": "123 Street, City",
        "user": {
            "id": "uuid",
            "username": "customer1",
            "email": "customer@example.com",
            "full_name": "Customer Name"
        }
    }
}
```

---

### 6. Search Customers by User Info
Tìm kiếm khách hàng theo thông tin user (username, email, full_name).

**Request:**
```http
GET /api/customers/search/by-user
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | Yes | Search by username, email, or full_name |
| page | number | No | Số trang (default: 1) |
| limit | number | No | Số item/trang (default: 10) |

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": "uuid",
            "user_id": "uuid",
            "phone": "0123456789",
            "address": "123 Street, City",
            "user": {
                "id": "uuid",
                "username": "john_doe",
                "email": "john@example.com",
                "full_name": "John Doe"
            }
        }
    ],
    "pagination": {
        "total": 5,
        "page": 1,
        "limit": 10,
        "totalPages": 1
    }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
    "success": false,
    "message": "Phone number already in use"
}
```

### 401 Unauthorized
```json
{
    "success": false,
    "message": "No token provided"
}
```

### 403 Forbidden
```json
{
    "success": false,
    "message": "Access denied. Requires Admin role"
}
```

### 404 Not Found
```json
{
    "success": false,
    "message": "Customer not found"
}
```

### 500 Internal Server Error
```json
{
    "success": false,
    "message": "Failed to update customer",
    "error": "Error details"
}
```

---

## Testing Examples

### 1. Get All Customers (Admin)
```bash
curl -X GET "http://localhost:5000/api/customers?page=1&limit=10" \
  -H "Authorization: Bearer <admin_token>"
```

### 2. Search Customers
```bash
curl -X GET "http://localhost:5000/api/customers?search=0123" \
  -H "Authorization: Bearer <admin_token>"
```

### 3. Get Customer with Orders
```bash
curl -X GET "http://localhost:5000/api/customers/<customer_id>?includeOrders=true" \
  -H "Authorization: Bearer <admin_token>"
```

### 4. Update Customer Info
```bash
curl -X PUT "http://localhost:5000/api/customers/<customer_id>" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "0987654321",
    "address": "456 New Street, New City"
  }'
```

### 5. Get Statistics
```bash
curl -X GET "http://localhost:5000/api/customers/statistics" \
  -H "Authorization: Bearer <admin_token>"
```

### 6. Search by User Info
```bash
curl -X GET "http://localhost:5000/api/customers/search/by-user?search=john" \
  -H "Authorization: Bearer <admin_token>"
```

### 7. Get Customer by User ID
```bash
curl -X GET "http://localhost:5000/api/customers/user/<user_id>" \
  -H "Authorization: Bearer <admin_token>"
```

---

## Architecture
Module này tuân theo kiến trúc 4 layer:

```
customer.routes.js
    ↓
customer.controller.js
    ↓
customer.service.js
    ↓
customer.repository.js
    ↓
Customer Model (Sequelize)
```

- **Repository:** Database operations, query building
- **Service:** Business logic, validation, field filtering
- **Controller:** HTTP handling, response formatting
- **Routes:** Endpoint definition, authentication, authorization

---

## Data Model

### Customer
```javascript
{
    id: UUID (PK),
    user_id: UUID (FK -> User),
    phone: String (Unique),
    address: String,
    createdAt: DateTime,
    updatedAt: DateTime
}
```

### Relationships
- **Customer → User:** belongsTo (One-to-One)
- **Customer → Order:** hasMany (One-to-Many)

---

## Business Rules

1. **Update Restrictions:**
   - Only `phone` and `address` can be updated
   - Phone number must be unique across all customers
   - Cannot update `user_id` or `id`

2. **No Delete:**
   - Customers are NOT deleted to preserve order history
   - Consider adding `is_active` flag for soft delete if needed

3. **Search Capabilities:**
   - Search by phone or address in customer table
   - Search by username, email, or full_name in user table
   - Pagination on all list endpoints

4. **Authorization:**
   - **Admin:** Full access to all endpoints
   - **Staff:** No access (not included)
   - **Customer:** No access to these endpoints

---

## Notes

- Customer records are linked to User accounts (One-to-One)
- Orders are preserved even if customer info is updated
- Phone numbers must be unique
- Include User details by default for better UX
- Optional order inclusion for customer detail view
