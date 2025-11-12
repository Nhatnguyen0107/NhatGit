# 🌱 Database Seeders Guide

## 📋 Overview

Seeders tạo dữ liệu mẫu cho development và testing. Project có 6 seeder files và 2 helper scripts.

---

## 📂 Seeder Files

| File | Dữ liệu | Số lượng |
|------|---------|----------|
| `20241112000001-seed-roles.js` | Roles | 3 |
| `20241112000002-seed-users.js` | Users | 5 |
| `20241112000003-seed-categories.js` | Categories | 7 |
| `20241112000004-seed-products.js` | Products | 30 |
| `20241112000005-seed-customers.js` | Customers | 3 |
| `20241112000006-seed-orders.js` | Orders + Items | 5 orders |

---

## 🚀 Cách chạy Seeders

### Option 1: Sử dụng script `seed.js` (✅ Recommended)

```bash
# Xóa dữ liệu cũ và tạo mới
node src/seed.js
```

**Ưu điểm:**
- ✅ Tự động xóa dữ liệu cũ
- ✅ Seed theo đúng thứ tự dependencies
- ✅ Hiển thị progress và summary
- ✅ Sử dụng Sequelize models (có validation)

### Option 2: Sử dụng Sequelize CLI

```bash
# Chạy tất cả seeders
npx sequelize-cli db:seed:all

# Chạy seeder cụ thể
npx sequelize-cli db:seed --seed 20241112000001-seed-roles.js

# Xóa tất cả seeded data
npx sequelize-cli db:seed:undo:all

# Undo seeder cuối cùng
npx sequelize-cli db:seed:undo
```

---

## 📊 Kiểm tra dữ liệu

```bash
# Xem thống kê và sample data
node src/check-data.js
```

Output hiển thị:
- 📋 Số lượng records mỗi bảng
- 👤 Danh sách roles và users
- 📁 Categories
- 🛍️ Top products
- 📦 Orders với customer info

---

## 🔑 Default Login Credentials

Sau khi seed, bạn có thể login với:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@ecommerce.com` | `123456` |
| **Staff** | `staff@ecommerce.com` | `123456` |
| **Customer** | `customer1@example.com` | `123456` |
| **Customer** | `customer2@example.com` | `123456` |
| **Customer** | `customer3@example.com` | `123456` |

---

## 📦 Sample Data Created

### 3 Roles
- Admin (Full access)
- Staff (Orders & customers)
- Customer (Browse & purchase)

### 5 Users
- 1 Admin
- 1 Staff
- 3 Customers

### 7 Categories
1. Laptops
2. Desktop PCs
3. Monitors
4. Keyboards & Mice
5. Storage Devices
6. Networking
7. Accessories

### 30 Products
- **Laptops**: Dell XPS 13, MacBook Pro, HP Pavilion, ThinkPad, 
  ASUS ROG
- **Desktops**: Gaming PC RTX 4070, Dell OptiPlex, HP Elite
- **Monitors**: LG UltraGear, Samsung Odyssey, Dell UltraSharp, 
  ASUS ProArt
- **Keyboards & Mice**: Logitech MX Keys, Razer BlackWidow, 
  Logitech G502, Corsair K95
- **Storage**: Samsung 980 PRO, WD Black, Seagate Barracuda, 
  SanDisk
- **Networking**: TP-Link Router, ASUS RT-AX88U, Netgear Nighthawk
- **Accessories**: USB-C Hub, Anker Charger, HDMI Cable, 
  Surge Protector, etc.

### 3 Customers
- John Doe (New York) - 5% discount
- Jane Smith (Los Angeles/San Francisco) - 10% discount
- Michael Johnson (Chicago) - 0% discount

### 5 Sample Orders
1. **ORD-2024-0001** - Delivered ✅
   - Customer: John Doe
   - Items: Dell XPS 13, Logitech MX Keys (x2)
   - Total: $1,344.99

2. **ORD-2024-0002** - Shipped 🚚
   - Customer: Jane Smith
   - Items: HP Pavilion, ThinkPad
   - Total: $2,798.98

3. **ORD-2024-0003** - Processing ⏳
   - Customer: Michael Johnson
   - Items: ASUS ROG (x3)
   - Total: $4,809.97

4. **ORD-2024-0004** - Pending 🕐
   - Customer: John Doe
   - Items: Gaming PC, LG Monitor (x2)
   - Total: $3,518.98

5. **ORD-2024-0005** - Cancelled ❌
   - Customer: Jane Smith
   - Items: Dell OptiPlex
   - Total: $909.99 (Refunded)

---

## 🔄 Reset Database với Fresh Seed

```bash
# Bước 1: Xóa và tạo lại tables
node src/sync-db.js

# Bước 2: Seed data mới
node src/seed.js

# Bước 3: Kiểm tra
node src/check-data.js
```

---

## 🛠️ Scripts có sẵn

Thêm vào `package.json`:

```json
{
  "scripts": {
    "seed": "node src/seed.js",
    "seed:check": "node src/check-data.js",
    "db:reset": "node src/sync-db.js && node src/seed.js",
    "db:fresh": "npx sequelize-cli db:drop && 
                 npx sequelize-cli db:create && 
                 node src/sync-db.js && 
                 node src/seed.js"
  }
}
```

Sử dụng:
```bash
npm run seed           # Chạy seeders
npm run seed:check     # Kiểm tra data
npm run db:reset       # Reset tables + seed
npm run db:fresh       # Drop DB + recreate + seed
```

---

## 📝 Tạo Seeder mới

### Sử dụng Sequelize CLI:

```bash
npx sequelize-cli seed:generate --name seed-table-name
```

### Template cơ bản:

```javascript
import { v4 as uuidv4 } from 'uuid';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('table_name', [
      {
        id: uuidv4(),
        name: 'Item 1',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('table_name', null, {});
  }
};
```

---

## ⚠️ Lưu ý

1. **Thứ tự quan trọng**: Seeders phải chạy theo thứ tự để đảm bảo 
   foreign keys hợp lệ
2. **Password đã hash**: Tất cả passwords sử dụng bcrypt (salt 10)
3. **UUIDs**: Products, Orders, Customers, OrderItems, CartItems 
   dùng UUID v4
4. **Timestamps**: Một số orders có timestamps trong quá khứ để 
   simulate lịch sử
5. **Pricing**: Tất cả giá dùng DECIMAL(10,2) - 2 chữ số thập phân

---

## 🧪 Testing với Seeded Data

Sau khi seed, test các APIs:

```bash
# Get all products
GET http://localhost:5000/api/products

# Login as admin
POST http://localhost:5000/api/auth/login
Body: {
  "email": "admin@ecommerce.com",
  "password": "123456"
}

# Get customer orders
GET http://localhost:5000/api/orders?customer_id=<id>
```

---

**✅ Task 3 hoàn thành!**  
Database đã có đầy đủ dữ liệu mẫu để phát triển và test APIs.

Bước tiếp theo: **Task 4 - Authentication API**
