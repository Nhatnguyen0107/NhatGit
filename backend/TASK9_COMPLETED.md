# Task 9: Customer Management - COMPLETED ✅

## Objective
Tạo module quản lý khách hàng cho Admin với đầy đủ chức năng xem danh sách, chi tiết, và cập nhật thông tin.

---

## Completed Features

### ✅ Customer Repository (`customer.repository.js`)
- **CRUD Operations:** findAndCountAll, findAll, findById, findOne, create, update, delete, count
- **Query Builder:**
  - `buildWhereCondition()`: Filter by search (phone/address), phone, user_id
  - `buildOrder()`: Sort by newest, oldest, phone
  - `buildInclude()`: Join with User (optional), Orders (optional with limit 5)
- **Special Methods:**
  - `getCustomerStatistics()`: Count total, with orders, without orders
  - `findByUserId()`: Find customer by user_id

### ✅ Customer Service (`customer.service.js`)
- **getAllCustomers()**: Pagination, filtering, sorting, optional order inclusion
- **getCustomerById()**: Get customer with full details, optional orders
- **updateCustomer()**: 
  - Field filtering (only phone & address allowed)
  - Phone uniqueness validation
  - Prevent empty updates
- **getCustomerStatistics()**: Get customer counts
- **getCustomerByUserId()**: Find customer by user ID
- **searchCustomersByUser()**: Search by username/email/full_name

### ✅ Customer Controller (`customer.controller.js`)
- **getAllCustomers**: Handle GET /customers with query params
- **getCustomerById**: Handle GET /customers/:id
- **updateCustomer**: Handle PUT /customers/:id
- **getCustomerStatistics**: Handle GET /customers/statistics
- **getCustomerByUserId**: Handle GET /customers/user/:userId
- **searchCustomersByUser**: Handle GET /customers/search/by-user
- **Error Handling**: Proper status codes (400, 404, 500)

### ✅ Customer Routes (`customer.routes.js`)
- **Authentication**: All routes require JWT token
- **Authorization**: Admin only
- **Endpoints:**
  - `GET /api/customers` - List all customers
  - `GET /api/customers/statistics` - Customer statistics
  - `GET /api/customers/search/by-user` - Search by user info
  - `GET /api/customers/user/:userId` - Get by user ID
  - `GET /api/customers/:id` - Customer details
  - `PUT /api/customers/:id` - Update customer info

### ✅ Server Integration
- Import customerRoutes in `server.js`
- Register route: `app.use('/api/customers', customerRoutes)`
- Add to endpoints list in health check

---

## Architecture Pattern
Tuân theo kiến trúc 4 layer đã thiết lập:

```
customer.routes.js (Routing + Auth)
    ↓
customer.controller.js (HTTP Handling)
    ↓
customer.service.js (Business Logic)
    ↓
customer.repository.js (Database Operations)
    ↓
Customer Model (Sequelize)
```

---

## Key Features

### 1. Advanced Search & Filtering
- **Customer Table Search**: phone, address
- **User Table Search**: username, email, full_name
- **Filtering**: By phone, user_id
- **Sorting**: newest, oldest, by phone

### 2. Data Relationships
Customers include:
- **User**: Username, email, full_name (always included)
- **Orders**: Recent 5 orders (optional via includeOrders query param)

### 3. Update Restrictions
**Allowed Fields:**
- `phone` - Must be unique
- `address` - Free text

**Business Rules:**
- Cannot update `user_id` or `id`
- Phone must be unique across all customers
- Empty updates rejected

### 4. Statistics
Track customer metrics:
- Total customers
- Customers with orders (active)
- Customers without orders (inactive)

### 5. Authorization
- **Admin**: Full access to all endpoints
- **Staff**: No access (not in spec)
- **Customer**: No access (separate Customer API in Checkout)

---

## API Usage Examples

### Get All Customers with Pagination
```bash
curl -X GET "http://localhost:5000/api/customers?page=1&limit=10&sort=newest" \
  -H "Authorization: Bearer <admin_token>"
```

### Search by Phone
```bash
curl -X GET "http://localhost:5000/api/customers?search=0123" \
  -H "Authorization: Bearer <admin_token>"
```

### Get Customer with Orders
```bash
curl -X GET "http://localhost:5000/api/customers/<id>?includeOrders=true" \
  -H "Authorization: Bearer <admin_token>"
```

### Update Customer Info
```bash
curl -X PUT "http://localhost:5000/api/customers/<id>" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"phone": "0987654321", "address": "New Address"}'
```

### Search by User Info
```bash
curl -X GET "http://localhost:5000/api/customers/search/by-user?search=john" \
  -H "Authorization: Bearer <admin_token>"
```

### Get Statistics
```bash
curl -X GET "http://localhost:5000/api/customers/statistics" \
  -H "Authorization: Bearer <admin_token>"
```

---

## Files Created
1. ✅ `src/repositories/customer.repository.js`
2. ✅ `src/services/customer.service.js`
3. ✅ `src/controllers/customer.controller.js`
4. ✅ `src/routes/customer.routes.js`

## Files Modified
1. ✅ `src/server.js` - Added customer routes

## Documentation
1. ✅ `CUSTOMER_API.md` - Complete API documentation

---

## Testing Checklist

### Basic Operations
- [ ] GET /api/customers - List all customers
- [ ] GET /api/customers/:id - Get customer details
- [ ] GET /api/customers/statistics - Get statistics
- [ ] PUT /api/customers/:id - Update customer info

### Search & Filter
- [ ] Search by phone in customer table
- [ ] Search by address in customer table
- [ ] Search by username in user table
- [ ] Search by email in user table
- [ ] Search by full_name in user table
- [ ] Filter by phone
- [ ] Sort by newest/oldest/phone

### Related Data
- [ ] GET customer with user info (default)
- [ ] GET customer with orders (includeOrders=true)
- [ ] GET customer by user ID

### Update Validations
- [ ] Update phone successfully
- [ ] Update address successfully
- [ ] Update both fields
- [ ] Phone uniqueness validation (400)
- [ ] Empty update rejected (400)
- [ ] Invalid fields filtered out

### Authorization
- [ ] Admin can access all endpoints
- [ ] Staff cannot access (403)
- [ ] Customer cannot access (403)
- [ ] Unauthenticated request rejected (401)

### Error Handling
- [ ] Customer not found (404)
- [ ] Phone already in use (400)
- [ ] No valid fields (400)
- [ ] Database error (500)

---

## Related Documentation
- `TASK-CRUD-GUIDE.md` - Architecture pattern reference
- `ARCHITECTURE.md` - 4-layer architecture guide
- `ORDER_API.md` - Order management
- `CART_CHECKOUT_API.md` - Customer checkout flow
- `PRODUCT_API.md` - Product management

---

## Important Notes

### No Delete Functionality
- Customer records are NOT deleted
- This preserves order history and data integrity
- Consider adding `is_active` flag for soft delete if needed in future

### Phone Uniqueness
- Phone numbers must be unique across all customers
- Validation happens before update
- Error returned if phone already exists

### User Relationship
- Customer always includes User info by default
- One-to-One relationship with User
- User info shows username, email, full_name

### Order History
- Optional inclusion of recent orders
- Limited to 5 most recent orders
- Sorted by creation date DESC
- Useful for admin to see customer activity

---

## Status: ✅ COMPLETED
Date: 2024-01-15
Developer: GitHub Copilot

**Next Task:** Task 10 - Frontend Setup
