# Authentication Testing Guide

## Thông tin Server
- Base URL: `http://localhost:5000/api`
- Port: 5000

## Test Accounts

### Admin Account
```json
{
  "email": "admin@ecommerce.com",
  "password": "123456"
}
```

### Staff Account
```json
{
  "email": "staff@ecommerce.com",
  "password": "123456"
}
```

### Customer Accounts
```json
{
  "email": "customer1@example.com",
  "password": "123456"
}
```

## API Endpoints

### 1. Register New User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "YourPassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-1234"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "newuser@example.com",
      "role": {
        "id": 3,
        "name": "Customer"
      },
      "customer": {
        "first_name": "John",
        "last_name": "Doe"
      }
    },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

---

### 2. Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "customer1@example.com",
  "password": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "customer1@example.com",
      "role": {
        "name": "Customer"
      }
    },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

---

### 3. Get Profile
**GET** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "customer1@example.com",
      "role": {
        "name": "Customer"
      },
      "customer": {
        "first_name": "John",
        "last_name": "Doe",
        "phone": "+1-555-1234"
      }
    }
  }
}
```

---

### 4. Update Profile
**PUT** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1-555-5678"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": { ... }
  }
}
```

---

### 5. Change Password
**PUT** `/api/auth/change-password`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "currentPassword": "123456",
  "newPassword": "NewPassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 6. Refresh Token
**POST** `/api/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGci..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

---

### 7. Logout
**POST** `/api/auth/logout`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Protected Routes (Test)

### Public Route (No Auth Required)
**GET** `/api/test/public`

**Success Response (200):**
```json
{
  "success": true,
  "message": "This is a public route - no authentication required"
}
```

---

### Protected Route (Auth Required)
**GET** `/api/test/protected`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "This is a protected route",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    }
  }
}
```

---

### Admin Only Route
**GET** `/api/test/admin`

**Headers:**
```
Authorization: Bearer <adminAccessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Welcome Admin!"
}
```

**Error Response (403) - Non-admin:**
```json
{
  "success": false,
  "message": "Access denied. Required roles: Admin"
}
```

---

### Staff Only Route
**GET** `/api/test/staff`

**Headers:**
```
Authorization: Bearer <staffAccessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Welcome Staff!"
}
```

---

### Customer Only Route
**GET** `/api/test/customer`

**Headers:**
```
Authorization: Bearer <customerAccessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Welcome Customer!"
}
```

---

## Testing with PowerShell

### Test Login
```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:5000/api/auth/login" `
  -Body (@{
    email="customer1@example.com"
    password="123456"
  } | ConvertTo-Json) `
  -ContentType "application/json"
```

### Test Get Profile (with token)
```powershell
$token = "your_access_token_here"
Invoke-RestMethod -Method Get `
  -Uri "http://localhost:5000/api/auth/profile" `
  -Headers @{Authorization="Bearer $token"} `
  -ContentType "application/json"
```

### Test Register
```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:5000/api/auth/register" `
  -Body (@{
    email="testuser@example.com"
    password="Test123456"
    firstName="Test"
    lastName="User"
    phone="+1-555-1234"
  } | ConvertTo-Json) `
  -ContentType "application/json"
```

---

## Testing with cURL

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"customer1@example.com\",\"password\":\"123456\"}"
```

### Test Get Profile
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test Admin Route
```bash
curl -X GET http://localhost:5000/api/test/admin \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Common Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Required roles: Admin"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Testing Workflow

1. **Start Server:**
   ```
   npm run dev
   ```

2. **Test Public Route (No Auth):**
   - GET `/api/test/public`
   - Should work without token

3. **Register New User:**
   - POST `/api/auth/register`
   - Save the returned `accessToken` and `refreshToken`

4. **Login:**
   - POST `/api/auth/login`
   - Save tokens

5. **Access Protected Route:**
   - GET `/api/test/protected`
   - Use `Authorization: Bearer <token>` header

6. **Test Role-Based Access:**
   - Login as Customer → Try `/api/test/admin` (should fail)
   - Login as Admin → Try `/api/test/admin` (should succeed)

7. **Update Profile:**
   - PUT `/api/auth/profile`
   - Change name/phone

8. **Change Password:**
   - PUT `/api/auth/change-password`

9. **Refresh Token:**
   - POST `/api/auth/refresh`
   - Get new access token

10. **Logout:**
    - POST `/api/auth/logout`

---

## Notes

- Access tokens expire in **15 minutes**
- Refresh tokens expire in **7 days**
- All passwords are hashed with bcrypt
- Default role for new users is **Customer**
- Admin and Staff accounts must be seeded manually
