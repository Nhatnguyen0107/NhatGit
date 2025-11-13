# Order Management API Documentation

## Overview
API để quản lý đơn hàng dành cho Admin và Staff. Cho phép xem danh sách, chi tiết, và cập nhật trạng thái đơn hàng.

---

## Authentication & Authorization
- **Required:** All endpoints require JWT authentication
- **Roles:** Admin, Staff only
- **Header:** `Authorization: Bearer <token>`

---

## Endpoints

### 1. Get All Orders
Lấy danh sách tất cả đơn hàng với phân trang và lọc.

**Request:**
```http
GET /api/orders
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Số trang (default: 1) |
| limit | number | No | Số item/trang (default: 10) |
| search | string | No | Tìm theo order_number hoặc địa chỉ |
| status | string | No | Lọc theo trạng thái đơn hàng |
| payment_status | string | No | Lọc theo trạng thái thanh toán |
| customer_id | uuid | No | Lọc theo khách hàng |
| date_from | date | No | Từ ngày (YYYY-MM-DD) |
| date_to | date | No | Đến ngày (YYYY-MM-DD) |
| sort | string | No | Sắp xếp: newest, oldest, total_asc, total_desc |

**Status Values:**
- `pending` - Đơn hàng chờ xử lý
- `processing` - Đang xử lý
- `shipped` - Đã giao cho vận chuyển
- `delivered` - Đã giao thành công
- `cancelled` - Đã hủy

**Payment Status Values:**
- `pending` - Chờ thanh toán
- `paid` - Đã thanh toán
- `failed` - Thanh toán thất bại
- `refunded` - Đã hoàn tiền

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": "uuid",
            "order_number": "ORD-1234567890123-ABC",
            "customer_id": "uuid",
            "total_amount": 500000,
            "status": "processing",
            "payment_status": "paid",
            "payment_method": "vnpay",
            "shipping_address": "123 Street, City",
            "shipped_at": null,
            "delivered_at": null,
            "createdAt": "2024-01-15T10:30:00.000Z",
            "updatedAt": "2024-01-15T10:30:00.000Z",
            "OrderItems": [
                {
                    "id": "uuid",
                    "product_id": "uuid",
                    "quantity": 2,
                    "price": 250000,
                    "Product": {
                        "id": "uuid",
                        "name": "Product Name",
                        "image": "product.jpg"
                    }
                }
            ],
            "Customer": {
                "id": "uuid",
                "phone": "0123456789",
                "address": "Customer Address",
                "User": {
                    "id": "uuid",
                    "username": "customer1",
                    "email": "customer@example.com"
                }
            }
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

### 2. Get Order by ID
Lấy chi tiết đơn hàng theo ID.

**Request:**
```http
GET /api/orders/:id
```

**Response:**
```json
{
    "success": true,
    "data": {
        "id": "uuid",
        "order_number": "ORD-1234567890123-ABC",
        "customer_id": "uuid",
        "total_amount": 500000,
        "status": "processing",
        "payment_status": "paid",
        "payment_method": "vnpay",
        "shipping_address": "123 Street, City",
        "shipped_at": null,
        "delivered_at": null,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "OrderItems": [
            {
                "id": "uuid",
                "product_id": "uuid",
                "quantity": 2,
                "price": 250000,
                "Product": {
                    "id": "uuid",
                    "name": "Product Name",
                    "slug": "product-name",
                    "image": "product.jpg"
                }
            }
        ],
        "Customer": {
            "id": "uuid",
            "phone": "0123456789",
            "address": "Customer Address",
            "User": {
                "id": "uuid",
                "username": "customer1",
                "email": "customer@example.com",
                "full_name": "Customer Name"
            }
        }
    }
}
```

---

### 3. Update Order Status
Cập nhật trạng thái đơn hàng.

**Request:**
```http
PUT /api/orders/:id/status
Content-Type: application/json

{
    "status": "shipped"
}
```

**Business Rules:**
- Không thể cập nhật đơn hàng đã hủy (`cancelled`)
- Không thể thay đổi trạng thái đơn đã giao (`delivered`)
- Status transitions:
  - `pending` → `processing` → `shipped` → `delivered`
  - Có thể `cancelled` từ `pending` hoặc `processing`
- Tự động cập nhật `shipped_at` khi status = `shipped`
- Tự động cập nhật `delivered_at` khi status = `delivered`

**Response (Success):**
```json
{
    "success": true,
    "message": "Order status updated successfully",
    "data": {
        "id": "uuid",
        "order_number": "ORD-1234567890123-ABC",
        "status": "shipped",
        "shipped_at": "2024-01-16T08:00:00.000Z",
        ...
    }
}
```

**Response (Error - Invalid Status):**
```json
{
    "success": false,
    "message": "Invalid status. Must be one of: pending, processing, shipped, delivered, cancelled"
}
```

**Response (Error - Business Rule):**
```json
{
    "success": false,
    "message": "Cannot update status of cancelled order"
}
```

---

### 4. Update Payment Status
Cập nhật trạng thái thanh toán.

**Request:**
```http
PUT /api/orders/:id/payment
Content-Type: application/json

{
    "payment_status": "paid"
}
```

**Valid Payment Status:**
- `pending` - Chờ thanh toán
- `paid` - Đã thanh toán
- `failed` - Thanh toán thất bại
- `refunded` - Đã hoàn tiền

**Response:**
```json
{
    "success": true,
    "message": "Payment status updated successfully",
    "data": {
        "id": "uuid",
        "order_number": "ORD-1234567890123-ABC",
        "payment_status": "paid",
        ...
    }
}
```

---

### 5. Get Order Statistics
Lấy thống kê số lượng đơn hàng theo trạng thái.

**Request:**
```http
GET /api/orders/statistics
```

**Response:**
```json
{
    "success": true,
    "data": {
        "pending": 15,
        "processing": 25,
        "shipped": 30,
        "delivered": 100,
        "cancelled": 10,
        "total": 180
    }
}
```

---

### 6. Get Customer Orders
Lấy danh sách đơn hàng của một khách hàng cụ thể.

**Request:**
```http
GET /api/orders/customer/:customerId
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Số trang (default: 1) |
| limit | number | No | Số item/trang (default: 10) |
| status | string | No | Lọc theo trạng thái |

**Response:**
```json
{
    "success": true,
    "data": [...],
    "pagination": {
        "total": 10,
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
    "message": "Status is required"
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
    "message": "Access denied. Requires Admin or Staff role"
}
```

### 404 Not Found
```json
{
    "success": false,
    "message": "Order not found"
}
```

### 500 Internal Server Error
```json
{
    "success": false,
    "message": "Failed to update order status",
    "error": "Error details"
}
```

---

## Testing Examples

### 1. Get All Orders (Admin)
```bash
curl -X GET "http://localhost:5000/api/orders?page=1&limit=10&status=processing" \
  -H "Authorization: Bearer <admin_token>"
```

### 2. Get Order Details
```bash
curl -X GET "http://localhost:5000/api/orders/<order_id>" \
  -H "Authorization: Bearer <admin_token>"
```

### 3. Update to Shipped
```bash
curl -X PUT "http://localhost:5000/api/orders/<order_id>/status" \
  -H "Authorization: Bearer <staff_token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "shipped"}'
```

### 4. Mark as Paid
```bash
curl -X PUT "http://localhost:5000/api/orders/<order_id>/payment" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"payment_status": "paid"}'
```

### 5. Get Statistics
```bash
curl -X GET "http://localhost:5000/api/orders/statistics" \
  -H "Authorization: Bearer <admin_token>"
```

### 6. Filter by Date Range
```bash
curl -X GET "http://localhost:5000/api/orders?date_from=2024-01-01&date_to=2024-01-31&sort=newest" \
  -H "Authorization: Bearer <admin_token>"
```

### 7. Search Orders
```bash
curl -X GET "http://localhost:5000/api/orders?search=ORD-123" \
  -H "Authorization: Bearer <staff_token>"
```

---

## Architecture
Module này tuân theo kiến trúc 4 layer:

```
order.routes.js
    ↓
order.controller.js
    ↓
order.service.js
    ↓
order.repository.js
    ↓
Order Model (Sequelize)
```

- **Repository:** Database operations, query building
- **Service:** Business logic, validation, status rules
- **Controller:** HTTP handling, response formatting
- **Routes:** Endpoint definition, authentication, authorization
