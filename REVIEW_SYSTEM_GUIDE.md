# 🌟 Hệ thống Đánh giá Sản phẩm - Product Review System

## 📝 Tổng quan

Hệ thống đánh giá sản phẩm đầy đủ tính năng cho phép khách hàng 
đánh giá và nhận xét về sản phẩm đã mua, giúp tăng độ tin cậy 
và tương tác với website thương mại điện tử.

---

## ✨ Tính năng chính

### 1. **Cho khách hàng:**
- ⭐ Đánh giá sản phẩm với hệ thống 5 sao
- 💬 Viết nhận xét chi tiết
- 🔍 Xem đánh giá từ khách hàng khác
- 📊 Xem thống kê đánh giá (điểm trung bình, phân bố số sao)
- 🎯 Lọc đánh giá theo mức điểm
- 🔐 Chỉ khách hàng đăng nhập mới được đánh giá

### 2. **Cho Admin:**
- 📋 Xem danh sách tất cả đánh giá
- 🔍 Tìm kiếm theo sản phẩm, khách hàng, nội dung
- 🎚️ Lọc theo điểm đánh giá (1-5 sao)
- 👁️ Ẩn/Hiện đánh giá
- 🗑️ Xóa đánh giá không phù hợp
- 📄 Phân trang với 10 đánh giá/trang
- ✅ Hiển thị trạng thái "Đã mua hàng"

---

## 🏗️ Cấu trúc Database

### Bảng: `reviews`

```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL,
    customer_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

**Các trường quan trọng:**
- `rating`: Điểm đánh giá từ 1-5 sao
- `is_verified_purchase`: Đánh dấu khách hàng đã mua sản phẩm
- `is_visible`: Admin có thể ẩn đánh giá không phù hợp
- `helpful_count`: Số người thấy đánh giá hữu ích

---

## 🔌 API Endpoints

### 1. **Public Routes** (Không cần đăng nhập)

#### GET `/api/reviews/product/:productId`
Lấy danh sách đánh giá của một sản phẩm

**Query Parameters:**
- `sortBy`: `newest` | `oldest` | `highest` | `lowest`

**Response:**
```json
{
    "success": true,
    "data": {
        "reviews": [
            {
                "id": "uuid",
                "rating": 5,
                "comment": "Sản phẩm rất tốt!",
                "is_verified_purchase": true,
                "helpful_count": 12,
                "created_at": "2025-11-25T10:00:00Z",
                "customer": {
                    "first_name": "Nguyen",
                    "last_name": "Van A",
                    "user": {
                        "username": "vana",
                        "avatar": "/uploads/avatar.jpg"
                    }
                }
            }
        ],
        "total": 25,
        "averageRating": 4.5
    }
}
```

---

### 2. **Protected Routes** (Cần đăng nhập)

#### POST `/api/reviews`
Tạo đánh giá mới

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "product_id": "uuid-of-product",
    "rating": 5,
    "comment": "Sản phẩm tuyệt vời, rất hài lòng!"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Đánh giá đã được tạo thành công",
    "data": {
        "review": { /* review object */ }
    }
}
```

**Validation:**
- `rating`: Bắt buộc, từ 1-5
- `comment`: Tối thiểu 10 ký tự
- Mỗi khách hàng chỉ được đánh giá 1 lần cho mỗi sản phẩm

---

#### GET `/api/reviews/customer/:customerId`
Lấy tất cả đánh giá của một khách hàng

**Response:**
```json
{
    "success": true,
    "data": {
        "reviews": [ /* array of reviews with product info */ ]
    }
}
```

---

### 3. **Admin Routes** (Chỉ Admin)

#### GET `/api/reviews`
Lấy tất cả đánh giá (Admin)

**Query Parameters:**
- `page`: Số trang (mặc định: 1)
- `limit`: Số lượng/trang (mặc định: 20)
- `rating`: Filter theo số sao
- `is_visible`: Filter theo trạng thái hiển thị

---

#### PUT `/api/reviews/:id`
Cập nhật đánh giá (Admin)

**Request Body:**
```json
{
    "is_visible": false,
    "comment": "Updated comment"
}
```

---

#### DELETE `/api/reviews/:id`
Xóa đánh giá (Admin)

**Response:**
```json
{
    "success": true,
    "message": "Đánh giá đã được xóa"
}
```

---

## 🎨 Frontend Components

### 1. **StarRating Component**

Component hiển thị và tương tác với hệ thống đánh giá sao.

**Props:**
```typescript
interface StarRatingProps {
    rating: number;              // Điểm hiện tại (0-5)
    maxStars?: number;          // Số sao tối đa (default: 5)
    size?: 'sm' | 'md' | 'lg';  // Kích thước
    showNumber?: boolean;        // Hiển thị số điểm
    interactive?: boolean;       // Cho phép click chọn
    onRatingChange?: (rating: number) => void; // Callback
}
```

**Usage:**
```tsx
// Read-only display
<StarRating rating={4.5} size="md" showNumber={true} />

// Interactive (for form)
<StarRating 
    rating={selectedRating} 
    interactive={true}
    size="lg"
    onRatingChange={(newRating) => setSelectedRating(newRating)}
/>
```

---

### 2. **ReviewList Component**

Component hiển thị danh sách đánh giá với summary và filtering.

**Props:**
```typescript
interface ReviewListProps {
    productId: string;
    averageRating?: number;
    totalReviews?: number;
}
```

**Features:**
- 📊 Summary box với điểm trung bình và phân bố sao
- 🎚️ Sort options: Newest, Oldest, Highest, Lowest
- 👤 Hiển thị thông tin khách hàng với avatar
- ✅ Badge "Đã mua hàng" cho verified purchases
- 👍 Số lượng người thấy hữu ích
- 📅 Định dạng ngày giờ theo locale VN

**Usage:**
```tsx
<ReviewList
    productId={product.id}
    averageRating={product.average_rating}
    totalReviews={product.review_count}
/>
```

---

### 3. **ReviewForm Component**

Component form để khách hàng viết đánh giá mới.

**Props:**
```typescript
interface ReviewFormProps {
    productId: string;
    onReviewSubmitted?: () => void; // Callback sau khi submit
}
```

**Features:**
- ⭐ Interactive star rating selector
- 📝 Textarea với validation (min 10 chars)
- 🔒 Tự động redirect nếu chưa đăng nhập
- ✅ Success message sau khi submit
- 🚨 Error handling với thông báo rõ ràng
- 📋 Review guidelines (hướng dẫn viết đánh giá)
- ⏳ Loading state khi đang submit

**Usage:**
```tsx
<ReviewForm
    productId={product.id}
    onReviewSubmitted={() => {
        // Refresh reviews list
        fetchReviews();
    }}
/>
```

---

## 📄 Tích hợp vào ProductDetailPage

### Code mẫu:

```tsx
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import StarRating from '@/components/reviews/StarRating';

const ProductDetailPage = () => {
    const [activeTab, setActiveTab] = useState<'description' | 
                                                'reviews'>
                                                ('description');
    const [reviewsKey, setReviewsKey] = useState(0);

    const handleReviewSubmitted = () => {
        setReviewsKey(prev => prev + 1); // Force refresh
        fetchProduct(); // Update average rating
    };

    return (
        <div>
            {/* Tabs Navigation */}
            <div className="flex border-b">
                <button onClick={() => setActiveTab('description')}>
                    Mô tả sản phẩm
                </button>
                <button onClick={() => setActiveTab('reviews')}>
                    Đánh giá ({product.review_count})
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'reviews' && (
                <>
                    {/* Rating Summary */}
                    <StarRating
                        rating={product.average_rating}
                        size="md"
                        showNumber={true}
                    />

                    {/* Review Form */}
                    <ReviewForm
                        productId={product.id}
                        onReviewSubmitted={handleReviewSubmitted}
                    />

                    {/* Reviews List */}
                    <ReviewList
                        key={reviewsKey}
                        productId={product.id}
                        averageRating={product.average_rating}
                        totalReviews={product.review_count}
                    />
                </>
            )}
        </div>
    );
};
```

---

## 👨‍💼 Admin Management Page

### ReviewManagement Component

Trang quản lý đánh giá cho admin với đầy đủ tính năng CRUD.

**Route:** `/admin/reviews`

**Features:**
- 🔍 **Search**: Tìm theo sản phẩm, khách hàng, email, nội dung
- 🎚️ **Filter by Rating**: 1-5 sao hoặc tất cả
- 👁️ **Filter by Visibility**: Hiển thị, Ẩn, hoặc tất cả
- 📄 **Pagination**: 10 đánh giá/trang
- ⭐ **Star Display**: Sử dụng StarRating component
- 👁️ **Toggle Visibility**: Ẩn/Hiện đánh giá
- 🗑️ **Delete**: Xóa đánh giá với confirmation
- ✅ **Verified Badge**: Hiển thị badge "Đã mua hàng"
- 🖼️ **Product Image**: Hiển thị ảnh sản phẩm
- 📊 **Statistics**: Tổng số đánh giá

**Usage:**
```tsx
import ReviewManagement from '@/pages/admin/ReviewManagement';

// In routes
<Route path="/admin/reviews" element={<ReviewManagement />} />
```

---

## 🎨 UI/UX Design Principles

### 1. **Color Coding:**
- ⭐ Yellow (`#FBBF24`): Rating stars
- 🟢 Green: Verified purchase, visible reviews
- 🔴 Red: Delete actions, hidden reviews
- 🔵 Blue: Primary actions, links
- ⚫ Gray: Neutral elements, disabled states

### 2. **Responsive Design:**
- Mobile: Stack elements vertically
- Tablet: 2-column layout for filters
- Desktop: Full horizontal layout with sidebar

### 3. **Loading States:**
- Skeleton loaders cho reviews
- Spinner animation khi submit form
- Disable buttons khi đang xử lý

### 4. **Empty States:**
- Icon + message khi chưa có đánh giá
- Call-to-action để khuyến khích đánh giá đầu tiên

---

## 🔒 Security & Validation

### Backend Validation:
1. ✅ Rating phải từ 1-5
2. ✅ Comment tối thiểu 10 ký tự
3. ✅ Mỗi user chỉ đánh giá 1 lần/sản phẩm
4. ✅ Chỉ admin có thể ẩn/xóa đánh giá
5. ✅ JWT authentication cho protected routes

### Frontend Validation:
1. ✅ Form validation trước khi submit
2. ✅ Disable submit button khi invalid
3. ✅ Real-time character count
4. ✅ Visual feedback cho rating selection

---

## 📊 Best Practices

### 1. **Performance:**
- Lazy load reviews khi scroll
- Pagination để giảm data load
- Cache API responses
- Optimize images với lazy loading

### 2. **User Experience:**
- Auto-scroll to review form sau khi click
- Show success message 3 seconds
- Preserve filter state khi navigate back
- Keyboard navigation cho rating stars

### 3. **SEO:**
- Rich snippets cho review ratings
- Schema.org markup cho reviews
- Meta tags với average rating

---

## 🧪 Testing

### Unit Tests:
```typescript
// StarRating component
test('renders correct number of stars', () => {
    render(<StarRating rating={3} />);
    expect(screen.getAllByRole('img')).toHaveLength(5);
});

// ReviewForm validation
test('prevents submission with rating < 1', () => {
    // Test validation logic
});
```

### Integration Tests:
```typescript
// API endpoint testing
test('POST /api/reviews creates new review', async () => {
    const response = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({
            product_id: 'test-id',
            rating: 5,
            comment: 'Great product!'
        });
    
    expect(response.status).toBe(201);
});
```

---

## 🚀 Future Enhancements

1. **Review Images**: Cho phép upload ảnh trong đánh giá
2. **Helpful Voting**: User có thể vote "hữu ích" cho đánh giá
3. **Reply to Reviews**: Admin/Shop owner reply đánh giá
4. **Review Incentives**: Tặng points cho đánh giá
5. **Advanced Filters**: Filter theo verified purchase, với ảnh
6. **Review Moderation**: AI-powered content moderation
7. **Email Notifications**: Thông báo khi có đánh giá mới
8. **Review Analytics**: Dashboard với charts và insights

---

## 📞 Support

Nếu gặp vấn đề hoặc có câu hỏi, vui lòng liên hệ:
- **Email**: support@ecommerce.com
- **Documentation**: /docs/reviews
- **Issue Tracker**: GitHub Issues

---

## 📝 Changelog

### Version 1.0.0 (2025-11-25)
- ✨ Initial release
- ⭐ Star rating system
- 💬 Review comments
- 👨‍💼 Admin management
- 📄 Pagination
- 🔍 Search & filters

---

**Created by:** Nguyễn Quốc Nhật  
**Date:** November 25, 2025  
**License:** MIT
