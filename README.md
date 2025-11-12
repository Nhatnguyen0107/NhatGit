# 🛒 E-Commerce System

Full-stack E-Commerce application với Node.js, Express, MySQL và Sequelize ORM.

## 📋 Features

### ✅ Completed
- [x] **Authentication System**
  - JWT-based authentication
  - Register, Login, Logout
  - Refresh Token
  - Role-based access control (Admin, Staff, Customer)
  - Password hashing with bcrypt
  
- [x] **Database**
  - 8 models: Role, User, Category, Product, Customer, Order, OrderItem, CartItem
  - Migrations & Seeders
  - Sample data included

### 🚧 In Progress
- [ ] Product Management APIs
- [ ] Category Management APIs
- [ ] Shopping Cart APIs
- [ ] Order Management APIs
- [ ] Customer Management APIs

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.x
- MySQL >= 8.0
- npm hoặc yarn

### Installation

1. **Clone repository:**
```bash
git clone https://github.com/your-username/ecommerce-system.git
cd ecommerce-system
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
```

3. **Configure environment:**
```bash
# Copy .env.example to .env
copy .env.example .env

# Edit .env with your settings
# DB_PASS=your_mysql_password
# JWT_ACCESS_SECRET=your_secret_key
# JWT_REFRESH_SECRET=your_refresh_secret
```

4. **Setup database:**
```bash
# Create database and run migrations
npm run db:sync

# Seed sample data
npm run seed
```

5. **Start server:**
```bash
npm run dev
```

Server chạy tại: `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Đăng ký tài khoản mới |
| POST | `/auth/login` | ❌ | Đăng nhập |
| POST | `/auth/logout` | ✅ | Đăng xuất |
| POST | `/auth/refresh` | ❌ | Refresh access token |
| GET | `/auth/profile` | ✅ | Lấy thông tin user |
| PUT | `/auth/profile` | ✅ | Cập nhật profile |
| PUT | `/auth/change-password` | ✅ | Đổi mật khẩu |

### Test Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@ecommerce.com | 123456 | Admin |
| staff@ecommerce.com | 123456 | Staff |
| customer1@example.com | 123456 | Customer |

## 🧪 Testing

### Run Tests
```bash
# Test authentication
npm run test:auth

# Or use Postman
# Import: backend/postman/E-Commerce-Authentication.postman_collection.json
```

### Manual Testing
See [TESTING.md](backend/TESTING.md) for detailed testing guide.

## 📦 Project Structure

```
ecommerce-system/
├── backend/
│   ├── src/
│   │   ├── config/          # Database config
│   │   ├── controllers/     # Business logic
│   │   ├── middlewares/     # Auth, validation
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helper functions
│   │   ├── migrations/      # Database migrations
│   │   └── seeders/         # Sample data
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/                # (Coming soon)
├── .gitignore
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MySQL 8.0
- **ORM:** Sequelize
- **Authentication:** JWT (jsonwebtoken)
- **Password:** bcrypt
- **Validation:** express-validator

### Development Tools
- **Nodemon:** Auto-reload
- **dotenv:** Environment variables
- **Sequelize CLI:** Database migrations

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start server with nodemon

# Production
npm start           # Start server

# Database
npm run db:sync     # Create tables
npm run db:check    # Check tables
npm run seed        # Run seeders
npm run seed:check  # Check seeded data
npm run db:reset    # Reset database (sync + seed)

# Testing
npm run test:auth   # Test authentication
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT access token (15 minutes expiry)
- ✅ JWT refresh token (7 days expiry)
- ✅ Role-based access control
- ✅ Input validation with express-validator
- ✅ SQL injection protection (Sequelize ORM)
- ✅ Environment variables for secrets

## 🗄️ Database Schema

See [DATABASE.md](backend/DATABASE.md) for detailed schema.

### Main Tables
- `roles` - User roles (Admin, Staff, Customer)
- `users` - User accounts
- `categories` - Product categories
- `products` - Products catalog
- `customers` - Customer profiles
- `orders` - Order records
- `order_items` - Order details
- `cart_items` - Shopping cart

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open Pull Request

## 📄 License

ISC

## 👤 Author

**iViettech - Nhật**

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

Made with ❤️ by iViettech
