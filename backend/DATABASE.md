# 🗄️ Database Models & Migrations Guide

## 📋 Models đã tạo

### 1. **Role** - Quản lý phân quyền
- `id`: INTEGER (Primary Key, Auto Increment)
- `name`: STRING(50) - Tên role (Admin, Staff, Customer)
- `description`: STRING(255)

### 2. **User** - Tài khoản người dùng
- `id`: UUID (Primary Key)
- `email`: STRING(100) - Unique, validated
- `password`: STRING(255) - Hashed password
- `role_id`: INTEGER (Foreign Key → roles)
- `is_active`: BOOLEAN
- `last_login`: DATE

### 3. **Category** - Danh mục sản phẩm
- `id`: INTEGER (Primary Key)
- `name`: STRING(100) - Unique
- `slug`: STRING(100) - Unique, URL-friendly
- `description`: TEXT
- `image_url`: STRING(255)
- `is_active`: BOOLEAN

### 4. **Product** - Sản phẩm
- `id`: UUID (Primary Key)
- `name`: STRING(200)
- `slug`: STRING(200) - Unique
- `description`: TEXT
- `price`: DECIMAL(10,2)
- `stock_quantity`: INTEGER
- `category_id`: INTEGER (Foreign Key → categories)
- `brand`: STRING(100)
- `image_url`: STRING(255)
- `is_active`: BOOLEAN
- `discount_percentage`: DECIMAL(5,2)

### 5. **Customer** - Thông tin khách hàng
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key → users, Unique)
- `first_name`, `last_name`: STRING(50)
- `phone`: STRING(20)
- `billing_address`, `billing_city`, `billing_country`, 
  `billing_postal_code`
- `shipping_address`, `shipping_city`, `shipping_country`, 
  `shipping_postal_code`
- `discount_percentage`: DECIMAL(5,2)

### 6. **Order** - Đơn hàng
- `id`: UUID (Primary Key)
- `order_number`: STRING(50) - Unique
- `customer_id`: UUID (Foreign Key → customers)
- `status`: ENUM (pending, processing, shipped, delivered, 
  cancelled)
- `subtotal`, `discount_amount`, `shipping_cost`, 
  `total_amount`: DECIMAL(10,2)
- `payment_method`: STRING(50)
- `payment_status`: ENUM (pending, paid, failed, refunded)
- `shipping_address`: TEXT
- `notes`: TEXT
- `shipped_at`, `delivered_at`: DATE

### 7. **OrderItem** - Chi tiết đơn hàng
- `id`: UUID (Primary Key)
- `order_id`: UUID (Foreign Key → orders)
- `product_id`: UUID (Foreign Key → products)
- `product_name`: STRING(200) - Snapshot
- `product_price`: DECIMAL(10,2) - Snapshot
- `quantity`: INTEGER
- `discount_percentage`: DECIMAL(5,2)
- `subtotal`: DECIMAL(10,2)

### 8. **CartItem** - Giỏ hàng
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key → users)
- `product_id`: UUID (Foreign Key → products)
- `quantity`: INTEGER
- `expires_at`: DATE - Cart expires after 1 hour
- **Unique Constraint**: (user_id, product_id)

---

## 🔗 Relationships (Associations)

```
Role (1) ──── (N) User
User (1) ──── (1) Customer
User (1) ──── (N) CartItem
Category (1) ──── (N) Product
Product (1) ──── (N) OrderItem
Product (1) ──── (N) CartItem
Customer (1) ──── (N) Order
Order (1) ──── (N) OrderItem
```

---

## 🚀 Cách chạy Migrations

### Option 1: Sử dụng `sync-db.js` (Recommended cho development)

```bash
# Tạo/Xóa tất cả bảng và tạo lại từ đầu
node src/sync-db.js
```

**⚠️ Lưu ý**: Script này sử dụng `sequelize.sync({ force: true })` 
sẽ **XÓA** tất cả dữ liệu hiện có!

### Option 2: Sử dụng Sequelize CLI Migrations

```bash
# Chạy tất cả migrations chưa thực thi
npx sequelize-cli db:migrate

# Rollback migration gần nhất
npx sequelize-cli db:migrate:undo

# Rollback tất cả migrations
npx sequelize-cli db:migrate:undo:all

# Tạo migration mới
npx sequelize-cli migration:generate --name your-migration-name
```

---

## ✅ Kiểm tra bảng đã tạo

```bash
# Kiểm tra tất cả bảng và structure
node src/check-tables.js
```

Hoặc sử dụng MySQL CLI:

```bash
mysql -u root -p ecommerce_db -e "SHOW TABLES;"
mysql -u root -p ecommerce_db -e "DESCRIBE users;"
```

---

## 📦 Import Models vào code

```javascript
// Import tất cả models và associations
import db from './models/index.js';

const { User, Role, Product, Category, Order, 
        OrderItem, Customer, CartItem } = db;

// Sử dụng với associations
const user = await User.findOne({
  where: { email: 'test@example.com' },
  include: [
    { model: Role, as: 'role' },
    { model: Customer, as: 'customer' }
  ]
});
```

---

## 🛠️ Scripts có sẵn

| Script | Command | Mô tả |
|--------|---------|-------|
| **Sync Database** | `node src/sync-db.js` | Tạo lại toàn bộ bảng |
| **Check Tables** | `node src/check-tables.js` | Xem danh sách bảng |
| **Run Migrations** | `npx sequelize-cli db:migrate` | Chạy migrations |
| **Rollback** | `npx sequelize-cli db:migrate:undo` | Rollback 1 migration |

---

## 📝 Lưu ý quan trọng

1. **Foreign Keys**: Tất cả khóa ngoại đều có `onUpdate: CASCADE`
2. **Soft Delete**: Chưa implement, có thể thêm `paranoid: true` nếu cần
3. **Timestamps**: Mọi bảng đều có `created_at` và `updated_at`
4. **UUIDs**: User, Product, Customer, Order, OrderItem, CartItem 
   dùng UUID
5. **ENUMs**: Order status và payment status dùng ENUM
6. **Indexes**: Đã tạo indexes cho các trường thường query (email, 
   foreign keys, slug)

---

## 🔄 Thứ tự tạo bảng (Dependencies)

1. `roles` (không phụ thuộc)
2. `users` (phụ thuộc roles)
3. `categories` (không phụ thuộc)
4. `products` (phụ thuộc categories)
5. `customers` (phụ thuộc users)
6. `orders` (phụ thuộc customers)
7. `order_items` (phụ thuộc orders, products)
8. `cart_items` (phụ thuộc users, products)

---

**✅ Task 2 hoàn thành!**  
Bây giờ bạn có thể chuyển sang **Task 3: Seeders** để tạo dữ liệu mẫu.
