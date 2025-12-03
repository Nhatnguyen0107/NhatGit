class PayOSUtil {
    constructor() {
        this.clientId = process.env.PAYOS_CLIENT_ID;
        this.apiKey = process.env.PAYOS_API_KEY;
        this.checksumKey = process.env.PAYOS_CHECKSUM_KEY;
        this.payos = null;
        this.initialized = false;

        if (!this.clientId || !this.apiKey || !this.checksumKey) {
            console.warn('⚠️ PayOS credentials not configured - payment features will be disabled');
        } else {
            this.initialize();
        }
    }

    async initialize() {
        try {
            const module = await import('@payos/node');
            const PayOSClass = module.PayOS;

            this.payos = new PayOSClass(
                this.clientId,
                this.apiKey,
                this.checksumKey
            );
            this.initialized = true;
            console.log('✅ PayOS initialized successfully');
        } catch (error) {
            console.error('❌ PayOS initialization error:', error.message);
            this.payos = null;
            this.initialized = false;
        }
    }

    async ensureInitialized() {
        if (!this.initialized && this.clientId && this.apiKey && this.checksumKey) {
            await this.initialize();
        }
        if (!this.payos) {
            throw new Error('PayOS not initialized. Please check credentials.');
        }
    }

    /**
     * Tạo link thanh toán PayOS
     * @param {Object} data - Thông tin thanh toán
     * @param {number} data.orderCode - Mã đơn hàng (unique)
     * @param {number} data.amount - Số tiền
     * @param {string} data.description - Mô tả
     * @param {string} data.returnUrl - URL trở về khi thành công
     * @param {string} data.cancelUrl - URL trở về khi hủy
     * @returns {Promise<Object>}
     */
    async createPaymentLink(data) {
        try {
            await this.ensureInitialized();

            const { orderCode, amount, description, returnUrl, cancelUrl } = data;

            // Validate required fields
            if (!orderCode || !amount) {
                throw new Error('orderCode and amount are required');
            }

            const paymentData = {
                orderCode: parseInt(orderCode),
                amount: parseInt(amount),
                description: description || `Thanh toan don hang ${orderCode}`,
                returnUrl: returnUrl || `${process.env.FRONTEND_URL}/payment/result`,
                cancelUrl: cancelUrl || `${process.env.FRONTEND_URL}/checkout`
            };

            console.log('📱 Creating PayOS payment link:', paymentData);

            const response = await this.payos.createPaymentLink(paymentData);

            return {
                success: true,
                checkoutUrl: response.checkoutUrl,
                paymentLinkId: response.paymentLinkId,
                orderCode: response.orderCode,
                qrCode: response.qrCode
            };
        } catch (error) {
            console.error('❌ PayOS create payment error:', error);
            throw new Error(`PayOS payment creation failed: ${error.message}`);
        }
    }

    /**
     * Lấy thông tin thanh toán
     * @param {number} orderCode - Mã đơn hàng
     * @returns {Promise<Object>}
     */
    async getPaymentInfo(orderCode) {
        try {
            await this.ensureInitialized();

            const paymentInfo = await this.payos.getPaymentLinkInformation(orderCode);

            return {
                success: true,
                data: paymentInfo
            };
        } catch (error) {
            console.error('❌ PayOS get payment info error:', error);
            throw new Error(`Get payment info failed: ${error.message}`);
        }
    }

    /**
     * Hủy link thanh toán
     * @param {number} orderCode - Mã đơn hàng
     * @param {string} cancellationReason - Lý do hủy
     * @returns {Promise<Object>}
     */
    async cancelPaymentLink(orderCode, cancellationReason = null) {
        try {
            await this.ensureInitialized();

            const response = await this.payos.cancelPaymentLink(
                orderCode,
                cancellationReason
            );

            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error('❌ PayOS cancel payment error:', error);
            throw new Error(`Cancel payment failed: ${error.message}`);
        }
    }

    /**
     * Xác thực webhook signature
     * @param {Object} webhookData - Dữ liệu webhook
     * @returns {boolean}
     */
    async verifyWebhookSignature(webhookData) {
        try {
            await this.ensureInitialized();

            return this.payos.verifyPaymentWebhookData(webhookData);
        } catch (error) {
            console.error('❌ PayOS verify webhook error:', error);
            return false;
        }
    }

    /**
     * Generate order code từ order ID
     * @param {string} orderId - UUID của order
     * @returns {number} - Order code dạng số
     */
    generateOrderCode(orderId) {
        // PayOS yêu cầu orderCode là số nguyên duy nhất
        // Sử dụng timestamp + random để tạo mã unique
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return parseInt(`${timestamp}${random}`.slice(-12)); // Giới hạn 12 chữ số
    }
}

export default PayOSUtil;