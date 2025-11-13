# 🧩 CRUD API Structure Guide (Express + Sequelize + MVC Pattern)

**Phase:** Backend – API & Business Logic  
**Mục tiêu:** Tạo API CRUD chuẩn hóa có thể tái sử dụng cho mọi module (Product, Category, User, Order...)

---

## 🧱 Kiến trúc dự án

Cấu trúc chia làm 4 tầng:

```
src/
├── controllers/     → Xử lý request/response, gọi service
├── services/        → Xử lý nghiệp vụ, gọi repository
├── repositories/    → Giao tiếp với database qua Sequelize
├── routes/          → Định nghĩa endpoint API
└── database/models/ → Sequelize Models (đã định nghĩa sẵn)
```

---

## ⚙️ Luồng hoạt động CRUD

1. **Route** nhận request từ client (VD: `/api/v1/categories`)
2. **Controller** xử lý logic request và response
3. **Service** chứa nghiệp vụ (validate, xử lý business rule)
4. **Repository** tương tác database (ORM Sequelize)
5. **Model** lưu định nghĩa bảng



---

## 🗣️ Prompt cho Copilot

> "Tạo module CRUD mới cho `Product` dựa theo cấu trúc Category (Repository, Service, Controller, Route). Có upload ảnh tối đa 5 file, phân trang, tìm kiếm, và bảo vệ route chỉ cho Admin được thêm/sửa/xóa."

---

## ✅ Output mong muốn

* API CRUD hoạt động hoàn chỉnh  
* Có upload ảnh, phân trang, tìm kiếm  
* Code tái sử dụng được cho mọi entity khác  
* Chuẩn hóa theo mô hình **Repository → Service → Controller → Route**

