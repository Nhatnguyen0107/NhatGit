import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentService } from '../services/payment.service';

interface PaymentResult {
    success: boolean;
    message: string;
    order_id?: string;
    payment_id?: string;
    transaction_id?: string;
    amount?: number;
}

const PaymentResultPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [result, setResult] = useState<PaymentResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        handlePaymentResult();
    }, []);

    const handlePaymentResult = async () => {
        try {
            const orderId = localStorage.getItem('pending_order_id');
            const paymentMethod = localStorage.getItem('payment_method');

            if (!orderId || !paymentMethod) {
                setError('Không tìm thấy thông tin đơn hàng');
                setLoading(false);
                return;
            }

            let paymentResult: PaymentResult;

            if (paymentMethod === 'vnpay') {
                // Xử lý VNPay return
                const params = Object.fromEntries(searchParams.entries());

                paymentResult = await paymentService.handleVNPayReturn(params);
            } else if (paymentMethod === 'paypal') {
                // Xử lý PayPal return  
                const paymentId = searchParams.get('paymentId');
                const payerId = searchParams.get('PayerID');
                const token = searchParams.get('token');

                if (!paymentId || !payerId) {
                    throw new Error('Thiếu thông tin thanh toán PayPal');
                }

                paymentResult = await paymentService.executePayPalPayment({
                    payment_id: paymentId,
                    payer_id: payerId,
                    order_id: parseInt(orderId)
                });
            } else {
                throw new Error('Phương thức thanh toán không hợp lệ');
            }

            setResult(paymentResult);

            // Xóa thông tin tạm thời
            localStorage.removeItem('pending_order_id');
            localStorage.removeItem('payment_method');
            localStorage.removeItem('paypal_payment_id');

        } catch (err: any) {
            console.error('Payment result error:', err);
            setError(
                err.response?.data?.message ||
                err.message ||
                'Có lỗi xảy ra khi xử lý kết quả thanh toán'
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center 
                           justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 
                                   border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang xử lý kết quả thanh toán...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center 
                           justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 
                               text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex 
                                   items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Có lỗi xảy ra
                    </h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-blue-600 text-white py-2 px-4 
                                     rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Thử lại thanh toán
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-gray-200 text-gray-800 py-2 px-4 
                                     rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center 
                       justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 
                           text-center">
                {result?.success ? (
                    <>
                        {/* Thanh toán thành công */}
                        <div className="w-16 h-16 bg-green-100 rounded-full flex 
                                       items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Thanh toán thành công!
                        </h1>
                        <p className="text-gray-600 mb-6">
                            {result.message}
                        </p>

                        {/* Thông tin chi tiết */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                            {result.order_id && (
                                <div className="flex justify-between py-2 
                                              border-b border-gray-200">
                                    <span className="text-gray-600">Mã đơn hàng:</span>
                                    <span className="font-semibold">#{result.order_id}</span>
                                </div>
                            )}
                            {result.transaction_id && (
                                <div className="flex justify-between py-2 
                                              border-b border-gray-200">
                                    <span className="text-gray-600">Mã giao dịch:</span>
                                    <span className="font-semibold">{result.transaction_id}</span>
                                </div>
                            )}
                            {result.amount && (
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-600">Số tiền:</span>
                                    <span className="font-semibold text-green-600">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(result.amount)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Thanh toán thất bại */}
                        <div className="w-16 h-16 bg-red-100 rounded-full flex 
                                       items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Thanh toán thất bại
                        </h1>
                        <p className="text-gray-600 mb-6">
                            {result?.message || 'Có lỗi xảy ra trong quá trình thanh toán'}
                        </p>
                    </>
                )}

                {/* Các nút hành động */}
                <div className="space-y-3">
                    {result?.success ? (
                        <>
                            <button
                                onClick={() => navigate(`/orders/${result.order_id}`)}
                                className="w-full bg-blue-600 text-white py-2 px-4 
                                         rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Xem chi tiết đơn hàng
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full bg-gray-200 text-gray-800 py-2 px-4 
                                         rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Tiếp tục mua sắm
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-blue-600 text-white py-2 px-4 
                                         rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Thử lại thanh toán
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full bg-gray-200 text-gray-800 py-2 px-4 
                                         rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Về trang chủ
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentResultPage;