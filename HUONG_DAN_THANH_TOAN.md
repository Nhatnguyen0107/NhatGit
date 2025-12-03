# 🎯 HƯỚNG DẪN CÀI ĐẶT THANH TOÁN ONLINE

## ✅ Vấn đề đã được sửa:
1. ✅ API endpoint: Đã sửa từ `/api/payment` → `/api/payments`
2. ✅ Code PayOS đã được hoàn thiện

## 📋 Checklist cần làm:

### 1️⃣ PayOS (Thanh toán QR ngân hàng - Sandbox)

**Bước 1: Lấy API Keys từ PayOS**
1. Truy cập: https://my.payos.vn/
2. Đăng nhập với email: **nhatmoi0107@gmail.com**
3. Vào **Developer** → **API Keys**
4. Copy 3 thông tin sau:

```
Client ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
API Key: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  
Checksum Key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Bước 2: Cập nhật file .env**

Mở file `backend/.env` và thay thế:

```env
# PayOS Configuration
PAYOS_CLIENT_ID=paste_client_id_o_day
PAYOS_API_KEY=paste_api_key_o_day
PAYOS_CHECKSUM_KEY=paste_checksum_key_o_day
```

**LƯU Ý:** 
- Sandbox mode KHÔNG cần xác thực CCCD
- Chỉ paste giá trị, KHÔNG thêm dấu ngoặc kép
- Nếu chưa thấy API Keys, kiểm tra email kích hoạt tài khoản

---

### 2️⃣ VNPay (Thanh toán thẻ - Sandbox)

**Bước 1: Đăng ký tài khoản sandbox**
1. Truy cập: https://sandbox.vnpayment.vn/devreg
2. Đăng ký tài khoản doanh nghiệp test
3. Sau khi đăng ký, vào Dashboard lấy thông tin:
   - **TMN Code** (mã merchant)
   - **Hash Secret** (mã bảo mật)

**Bước 2: Cập nhật .env**

```env
# VNPay Configuration
VNP_TMNCODE=your_tmn_code_here
VNP_HASHSECRET=your_hash_secret_here
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURNURL=http://localhost:3000/api/payments/vnpay/return
```

**Thẻ test VNPay:**
```
Số thẻ: 9704198526191432198
Tên chủ thẻ: NGUYEN VAN A
Ngày phát hành: 07/15
Mã OTP: 123456
```

---

### 3️⃣ PayPal (Thanh toán quốc tế - Sandbox)

**Bước 1: Tạo PayPal App**
1. Truy cập: https://developer.paypal.com/
2. Đăng nhập hoặc tạo tài khoản developer
3. Vào **Dashboard** → **My Apps & Credentials**
4. Click **Create App**
5. Copy **Client ID** và **Secret**

**Bước 2: Cập nhật .env**

```env
# PayPal Configuration
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
PAYPAL_RETURN_URL=http://localhost:3000/api/payments/paypal/success
PAYPAL_CANCEL_URL=http://localhost:3000/api/payments/paypal/cancel
```

**Tài khoản test PayPal:**
- Vào Dashboard → **Sandbox** → **Accounts**
- Sử dụng Personal Account (buyer) để test thanh toán

---

### 4️⃣ VietQR (Thanh toán QR - FREE)

VietQR **KHÔNG CẦN** đăng ký API, chỉ cần thông tin tài khoản ngân hàng:

```env
# VietQR Configuration
VIETQR_ACCOUNT=0123456789           # Số tài khoản của bạn
VIETQR_ACCOUNT_NAME=NGUYEN VAN A    # Tên chủ tài khoản
VIETQR_BANK_ID=970422               # Mã ngân hàng (MB Bank: 970422)
```

**Danh sách mã ngân hàng phổ biến:**
```
970422 - MB Bank
970436 - Vietcombank
970415 - Vietinbank
970418 - BIDV
970405 - Agribank
970407 - Techcombank
970416 - ACB
970423 - TPBank
```

VietQR sẽ tự động tạo mã QR, khách hàng quét và chuyển khoản. Hệ thống sẽ tự động check giao dịch.

---

## 🚀 Khởi động lại server

Sau khi cập nhật `.env`:

```bash
# Backend
cd backend
npm run dev

# Frontend (terminal khác)
cd frontend
npm run dev
```

---

## 🧪 Test thanh toán

### Test PayOS:
1. Vào http://localhost:5173
2. Chọn sản phẩm → Add to cart → Checkout
3. Chọn **PayOS Payment**
4. Hoàn tất đơn hàng
5. Bạn sẽ được redirect tới trang thanh toán PayOS
6. Scan QR bằng app ngân hàng (sandbox) hoặc dùng tài khoản test

### Test VietQR:
1. Chọn **VietQR Payment**
2. Hệ thống hiển thị mã QR
3. Quét QR bằng app ngân hàng và chuyển khoản
4. Hệ thống tự động check sau 5 giây

### Test VNPay:
1. Chọn **VNPay Payment**
2. Nhập thông tin thẻ test
3. Nhập OTP: 123456

### Test PayPal:
1. Chọn **PayPal Payment**
2. Đăng nhập bằng buyer account trong sandbox
3. Xác nhận thanh toán

---

## 📞 Cần hỗ trợ?

### PayOS:
- Dashboard: https://my.payos.vn/
- Docs: https://payos.vn/docs/
- Support: support@payos.vn

### VNPay:
- Sandbox: https://sandbox.vnpayment.vn/
- Docs: https://sandbox.vnpayment.vn/apis/
- Support: support@vnpay.vn

### PayPal:
- Developer: https://developer.paypal.com/
- Docs: https://developer.paypal.com/docs/
- Support: https://developer.paypal.com/support/

---

## 🔍 Troubleshooting

### Lỗi 404 Not Found
✅ **Đã sửa:** API endpoint đã được đổi từ `/api/payment` → `/api/payments`

### Lỗi "PayOS not configured"
❌ Chưa cấu hình PayOS keys trong `.env`
✅ Làm theo hướng dẫn phần 1️⃣ bên trên

### Lỗi "VNPay not configured"
❌ Chưa có TMN Code và Hash Secret
✅ Đăng ký sandbox và lấy keys

### Lỗi "PayPal not configured"
❌ Chưa có Client ID và Secret
✅ Tạo app trên PayPal Developer

### VietQR không hiển thị QR
❌ Sai thông tin tài khoản hoặc mã ngân hàng
✅ Kiểm tra lại `VIETQR_ACCOUNT`, `VIETQR_BANK_ID`

---

## 📝 Ghi chú quan trọng

1. **Tất cả đều là môi trường TEST/SANDBOX** - không phát sinh chi phí thật
2. **PayOS và VietQR** dùng QR ngân hàng Việt Nam
3. **VNPay** dùng thẻ ATM/Credit Card Việt Nam
4. **PayPal** dùng cho thanh toán quốc tế
5. **COD** (tiền mặt) không cần cấu hình gì cả

---

## ✨ Sau khi hoàn tất:

Bạn sẽ có **5 phương thức thanh toán**:
- ✅ COD (Tiền mặt khi nhận hàng)
- 🏦 VietQR (QR ngân hàng - FREE)
- 💳 VNPay (Thẻ ATM/Credit Card)
- 🌍 PayPal (Thanh toán quốc tế)
- 📱 PayOS (QR ngân hàng - Có webhook)

---

**Tạo bởi:** GitHub Copilot  
**Ngày:** 03/12/2025
