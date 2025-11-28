import axios from 'axios';

class VietQRUtil {
    constructor() {
        // Cấu hình VietQR - có thể lấy từ env
        this.accountNo = process.env.VIETQR_ACCOUNT || "0123456789";
        this.accountName = process.env.VIETQR_ACCOUNT_NAME || "NGUYEN QUOC NHAT";
        this.acqId = parseInt(process.env.VIETQR_BANK_ID) || 970422; // MB Bank
        this.apiUrl = 'https://api.vietqr.io/v2/generate';
    }

    /**
     * Tạo QR Code thanh toán
     * @param {number} amount - Số tiền
     * @param {string} orderId - Mã đơn hàng 
     * @param {string} template - Template QR (compact, compact2, print, etc)
     * @returns {Promise<Object>} QR Code data
     */
    async generateQRCode(amount, orderId, template = 'compact2') {
        try {
            const requestData = {
                accountNo: this.accountNo,
                accountName: this.accountName,
                acqId: this.acqId,
                amount: amount,
                addInfo: `DONHANG_${orderId}`,
                format: 'text',
                template: template
            };

            const response = await axios.post(this.apiUrl, requestData);

            if (response.data && response.data.code === '00') {
                return {
                    success: true,
                    qr_code: response.data.data.qrCode,
                    qr_data_url: response.data.data.qrDataURL,
                    bank_name: this.getBankName(this.acqId),
                    account_no: this.accountNo,
                    account_name: this.accountName,
                    amount: amount,
                    content: `DONHANG_${orderId}`
                };
            } else {
                throw new Error(response.data.desc || 'Failed to generate QR code');
            }
        } catch (error) {
            console.error('❌ VietQR generate error:', error);
            throw new Error(`VietQR generation failed: ${error.message}`);
        }
    }

    /**
     * Tạo URL hình ảnh QR trực tiếp
     * @param {number} amount - Số tiền
     * @param {string} orderId - Mã đơn hàng
     * @param {string} template - Template
     * @returns {string} URL hình ảnh QR
     */
    generateQRImageUrl(amount, orderId, template = 'compact2') {
        const bankCode = this.getBankCode(this.acqId);
        const content = encodeURIComponent(`DONHANG_${orderId}`);

        return `https://img.vietqr.io/image/${bankCode}-${this.accountNo}-${template}.png?amount=${amount}&addInfo=${content}`;
    }

    /**
     * Kiểm tra giao dịch từ Web2M API (hoặc bank API khác)
     * @param {string} orderId - Mã đơn hàng
     * @param {number} amount - Số tiền cần kiểm tra
     * @param {Date} fromDate - Từ ngày (optional)
     * @returns {Promise<Object>} Kết quả kiểm tra
     */
    async checkPayment(orderId, amount, fromDate = null) {
        try {
            // Thay thế bằng API bank thực tế
            const apiKey = process.env.WEB2M_API_KEY;
            const apiUrl = `https://api.web2m.com/historyapiv3/mb/${this.accountNo}/${apiKey}`;

            if (!apiKey) {
                // Mock response cho development
                return this.mockCheckPayment(orderId, amount);
            }

            const response = await axios.get(apiUrl);

            if (response.data && response.data.transactions) {
                const searchContent = `DONHANG_${orderId}`;
                const transaction = response.data.transactions.find(t =>
                    t.amount === amount &&
                    t.description.includes(searchContent) &&
                    t.type === 'IN' // Tiền vào
                );

                return {
                    success: !!transaction,
                    transaction: transaction || null,
                    message: transaction ? 'Payment found' : 'Payment not found'
                };
            }

            return { success: false, message: 'No transactions data' };
        } catch (error) {
            console.error('❌ Check payment error:', error);
            return {
                success: false,
                message: `Check payment failed: ${error.message}`
            };
        }
    }

    /**
     * Mock check payment cho development/testing
     */
    mockCheckPayment(orderId, amount) {
        // Simulate 30% chance of payment found
        const isFound = Math.random() < 0.3;

        return {
            success: isFound,
            transaction: isFound ? {
                id: `TXN_${Date.now()}`,
                amount: amount,
                description: `DONHANG_${orderId}`,
                type: 'IN',
                date: new Date().toISOString()
            } : null,
            message: isFound ? 'Payment found (mock)' : 'Payment not found (mock)'
        };
    }

    /**
     * Lấy tên ngân hàng từ acqId
     */
    getBankName(acqId) {
        const banks = {
            970422: 'MB Bank',
            970407: 'Techcombank',
            970415: 'Vietinbank',
            970418: 'BIDV',
            970405: 'Agribank',
            970432: 'VPBank'
        };
        return banks[acqId] || 'Unknown Bank';
    }

    /**
     * Lấy mã ngân hàng từ acqId  
     */
    getBankCode(acqId) {
        const codes = {
            970422: 'MB',
            970407: 'TCB',
            970415: 'CTG',
            970418: 'BIDV',
            970405: 'AGR',
            970432: 'VPB'
        };
        return codes[acqId] || 'MB';
    }
}

export default VietQRUtil;