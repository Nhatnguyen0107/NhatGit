# 🚀 Hướng dẫn thiết lập PayOS Sandbox

## Bước 1: Đăng nhập PayOS Dashboard

1. Truy cập: https://my.payos.vn/
2. Đăng nhập với email: **nhatmoi0107@gmail.com**

## Bước 2: Lấy thông tin API từ Dashboard

1. Sau khi đăng nhập, vào **Developer API Keys**: https://my.payos.vn/developer/api-keys

2. Bạn sẽ thấy 3 thông tin quan trọng:
   - **Client ID** (dạng: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
   - **API Key** (dạng: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
   - **Checksum Key** (dạng: chuỗi hash dài)

## Bước 3: Cấu hình .env

Mở file `.env` và thay thế:

```env
PAYOS_CLIENT_ID=paste_client_id_vao_day
PAYOS_API_KEY=paste_api_key_vao_day
PAYOS_CHECKSUM_KEY=paste_checksum_key_vao_day
```

**LƯU Ý:** 
- Sandbox mode KHÔNG cần xác thực CCCD
- Đây là môi trường test nên bạn có thể dùng ngay
- Chỉ paste đúng 3 giá trị trên, KHÔNG thêm dấu ngoặc kép

## Bước 4: Restart server

Sau khi cập nhật .env:

```bash
# Nếu server đang chạy, nhấn Ctrl+C để dừng
# Rồi chạy lại:
npm run dev
```

## Bước 5: Test PayOS

1. Vào frontend: http://localhost:5173
2. Chọn sản phẩm → Add to cart → Checkout
3. Chọn **PayOS Payment** và hoàn tất đơn hàng
4. Bạn sẽ được redirect tới trang thanh toán PayOS sandbox
5. Dùng thông tin test để thanh toán (PayOS sẽ cung cấp)

---

## 📞 Cần hỗ trợ?

Nếu không thấy API Keys trong dashboard:
1. Check xem tài khoản đã kích hoạt chưa (check email)
2. Hoặc liên hệ support PayOS: support@payos.vn
3. Hoặc vào trang tài liệu: https://payos.vn/docs/

---

## 🔍 Giải thích các Keys

- **Client ID**: Định danh duy nhất của merchant (shop của bạn)
- **API Key**: Key để xác thực API requests
- **Checksum Key**: Key để tạo và verify chữ ký webhook (bảo mật)

Tất cả 3 keys này đều BẮT BUỘC để PayOS hoạt động.
