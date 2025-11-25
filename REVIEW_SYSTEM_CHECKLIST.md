# ✅ Checklist Kiểm tra Hệ thống Đánh giá

## 🎯 Components Frontend

- [x] ✅ StarRating component
  - [x] Hiển thị 5 sao
  - [x] Half-star support
  - [x] Interactive mode
  - [x] 3 sizes (sm, md, lg)
  - [x] Show rating number

- [x] ✅ ReviewList component
  - [x] Display reviews list
  - [x] Rating summary box
  - [x] Star distribution chart
  - [x] Sort options (newest, oldest, highest, lowest)
  - [x] Customer avatar
  - [x] Verified purchase badge
  - [x] Date formatting (vi-VN)
  - [x] Empty state

- [x] ✅ ReviewForm component
  - [x] Interactive star selector
  - [x] Textarea with validation
  - [x] Min 10 characters
  - [x] Success message
  - [x] Error handling
  - [x] Login redirect
  - [x] Review guidelines
  - [x] Loading state

## 📄 Pages

- [x] ✅ ProductDetailPage
  - [x] Import review components
  - [x] Tab navigation (Description/Reviews)
  - [x] Review count badge
  - [x] Rating summary
  - [x] ReviewForm integration
  - [x] ReviewList integration
  - [x] Auto refresh after submit

- [x] ✅ ReviewManagement (Admin)
  - [x] Search functionality
  - [x] Filter by rating
  - [x] Filter by visibility
  - [x] Pagination (10 items/page)
  - [x] StarRating component
  - [x] Toggle visibility
  - [x] Delete review
  - [x] Product image display
  - [x] Verified badge
  - [x] Statistics

## 🔌 Backend (Already exists)

- [x] ✅ Model (Review.js)
- [x] ✅ Repository (review.repository.js)
- [x] ✅ Service (review.service.js)
- [x] ✅ Controller (review.controller.js)
- [x] ✅ Routes (review.routes.js)
- [x] ✅ Registered in server.js

## 🧪 Testing Checklist

### User Flow:

- [ ] 🔲 Truy cập trang chi tiết sản phẩm
- [ ] 🔲 Click tab "Đánh giá"
- [ ] 🔲 Thấy form đánh giá (nếu đã login)
- [ ] 🔲 Thấy message "Đăng nhập để đánh giá" (nếu chưa login)
- [ ] 🔲 Chọn rating từ 1-5 sao
- [ ] 🔲 Nhập comment (min 10 chars)
- [ ] 🔲 Submit thành công
- [ ] 🔲 Thấy review mới trong danh sách
- [ ] 🔲 Rating trung bình cập nhật đúng

### Admin Flow:

- [ ] 🔲 Login với account Admin
- [ ] 🔲 Truy cập /admin/reviews
- [ ] 🔲 Thấy danh sách tất cả reviews
- [ ] 🔲 Search theo tên sản phẩm hoạt động
- [ ] 🔲 Filter theo rating hoạt động
- [ ] 🔲 Filter theo visibility hoạt động
- [ ] 🔲 Pagination hiển thị đúng
- [ ] 🔲 Click "Ẩn" → review bị ẩn ở frontend
- [ ] 🔲 Click "Hiện" → review hiển thị lại
- [ ] 🔲 Click "Xóa" → confirm → review bị xóa

### Edge Cases:

- [ ] 🔲 Submit review không có rating → Error
- [ ] 🔲 Submit review comment < 10 chars → Error
- [ ] 🔲 Submit review khi chưa login → Redirect login
- [ ] 🔲 User đánh giá 2 lần cùng sản phẩm → Error từ backend
- [ ] 🔲 Xem sản phẩm chưa có review → Empty state
- [ ] 🔲 Sort reviews hoạt động đúng
- [ ] 🔲 Pagination giữ filter state

## 📱 Responsive Testing:

- [ ] 🔲 Mobile (< 640px): Layout stack vertically
- [ ] 🔲 Tablet (640-1024px): 2-column layout
- [ ] 🔲 Desktop (> 1024px): Full layout
- [ ] 🔲 Touch interactions work on mobile
- [ ] 🔲 Star rating clickable on all devices

## 🎨 UI/UX Testing:

- [ ] 🔲 Stars màu vàng (#FBBF24)
- [ ] 🔲 Half-star hiển thị đúng
- [ ] 🔲 Avatar fallback khi không có ảnh
- [ ] 🔲 Loading spinner khi submit
- [ ] 🔲 Success message tự động ẩn sau 3s
- [ ] 🔲 Error messages rõ ràng
- [ ] 🔲 Disabled button có cursor not-allowed
- [ ] 🔲 Hover effects hoạt động

## 🔒 Security Testing:

- [ ] 🔲 Không thể POST review khi chưa login
- [ ] 🔲 Không thể toggle visibility nếu không phải Admin
- [ ] 🔲 Không thể delete review nếu không phải Admin
- [ ] 🔲 SQL injection protected
- [ ] 🔲 XSS protected trong comments

## ⚡ Performance Testing:

- [ ] 🔲 Review list load < 300ms
- [ ] 🔲 Submit review < 500ms
- [ ] 🔲 Pagination không lag
- [ ] 🔲 Images lazy load
- [ ] 🔲 No memory leaks

## 📊 Database Testing:

- [ ] 🔲 Table `reviews` tồn tại
- [ ] 🔲 Foreign keys đúng (product_id, customer_id)
- [ ] 🔲 Rating constraint (1-5)
- [ ] 🔲 is_visible default = true
- [ ] 🔲 helpful_count default = 0
- [ ] 🔲 Timestamps tự động

## 🔧 Integration Testing:

- [ ] 🔲 Backend API `/api/reviews` response đúng format
- [ ] 🔲 Frontend parse response đúng
- [ ] 🔲 Error handling từ backend đến frontend
- [ ] 🔲 Auth middleware hoạt động
- [ ] 🔲 Role-based access control

---

## 📝 Notes

**Nếu có lỗi:**
1. Check console (F12)
2. Check network tab
3. Check backend logs
4. Xem file REVIEW_SYSTEM_README.md phần Troubleshooting

**Ready to deploy khi:**
- Tất cả checkboxes đã tick ✅
- Không có errors trong console
- Tất cả tests pass

---

**Status:** 🚧 Chờ testing  
**Last Updated:** 25/11/2025
