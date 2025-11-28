import api from './api';

export interface PaymentRequest {
    orderId: string;
    amount: number;
    orderInfo?: string;
}

export interface PayPalPaymentRequest {
    orderId: string;
    amount: number;
    currency?: string;
}

export interface PaymentResponse {
    success: boolean;
    data: {
        paymentUrl?: string;
        approvalUrl?: string;
    };
    message?: string;
}

export interface PaymentStatus {
    id: string;
    order_id: string;
    provider: 'vnpay' | 'paypal';
    amount: number;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    transaction_id?: string;
    created_at: string;
}

export const paymentService = {
    // VNPay methods
    createVNPayPayment: async (data: {
        order_id: string | number;
        amount: number;
        return_url?: string;
        ip_address?: string;
    }) => {
        const response = await api.post('/payments/vnpay/create', {
            orderId: data.order_id,
            amount: data.amount,
            orderInfo: `Thanh toan don hang ${data.order_id}`
        });
        return { payment_url: response.data.data.paymentUrl };
    },

    // Xử lý kết quả VNPay
    handleVNPayReturn: async (params: Record<string, string>) => {
        const response = await api.post('/payments/vnpay/return', params);
        return response.data.data;
    },

    // PayPal methods
    createPayPalPayment: async (data: {
        order_id: string | number;
        amount: number;
        currency: string;
        return_url: string;
        cancel_url: string;
    }) => {
        const response = await api.post('/payments/paypal/create', {
            orderId: data.order_id,
            amount: data.amount,
            currency: data.currency
        });
        return {
            payment_url: response.data.data.approvalUrl,
            payment_id: response.data.data.paymentId
        };
    },

    // Thực hiện thanh toán PayPal
    executePayPalPayment: async (data: {
        payment_id: string;
        payer_id: string;
        order_id: number;
    }) => {
        const response = await api.post('/payments/paypal/execute', data);
        return response.data.data;
    },

    // Get payment status
    getPaymentStatus: async (orderId: string | number) => {
        const response = await api.get(`/payments/status/${orderId}`);
        return response.data;
    },

    // VietQR methods
    createVietQRPayment: async (data: {
        orderId: string | number;
        amount: number;
    }) => {
        const response = await api.post('/payments/vietqr/create', {
            orderId: data.orderId,
            amount: data.amount
        });
        return response.data.data;
    },

    checkVietQRPayment: async (data: {
        orderId: string | number;
        amount: number;
    }) => {
        const response = await api.post('/payments/vietqr/check', {
            orderId: data.orderId,
            amount: data.amount
        });
        return response.data.data;
    },

    // Utility methods
    formatCurrency: (amount: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    },

    convertVNDToUSD: (vndAmount: number, exchangeRate: number = 24000): number => {
        return Math.round((vndAmount / exchangeRate) * 100) / 100;
    }
};