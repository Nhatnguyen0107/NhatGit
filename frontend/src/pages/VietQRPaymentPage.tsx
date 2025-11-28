import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import VietQRPayment from '../components/VietQRPayment';

const VietQRPaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const amount = parseFloat(searchParams.get('amount') || '0');

    const handlePaymentSuccess = (result: any) => {
        // Xóa localStorage
        localStorage.removeItem('pending_order_id');
        localStorage.removeItem('payment_method');
        localStorage.removeItem('payment_amount');

        // Chuyển đến trang thành công
        navigate(`/payment/result?success=true&orderId=${orderId}&transactionId=${result.transaction?.id}`);
    };

    const handlePaymentCancel = () => {
        // Xóa localStorage
        localStorage.removeItem('pending_order_id');
        localStorage.removeItem('payment_method');
        localStorage.removeItem('payment_amount');

        // Quay về checkout
        navigate('/checkout');
    };

    if (!orderId || !amount) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Thông tin không hợp lệ</h1>
                    <p className="text-gray-600 mb-6">Không tìm thấy thông tin đơn hàng hoặc số tiền thanh toán.</p>
                    <button
                        onClick={() => navigate('/checkout')}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Quay về trang checkout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-lg mx-auto">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold text-gray-900">Thanh toán QR Code</h1>
                        <p className="text-gray-600 mt-2">Đơn hàng: #{orderId}</p>
                    </div>

                    <VietQRPayment
                        orderId={orderId}
                        amount={amount}
                        onPaymentSuccess={handlePaymentSuccess}
                        onPaymentCancel={handlePaymentCancel}
                    />

                    <div className="mt-6 text-center text-xs text-gray-500">
                        <p>⚠️ Vui lòng không đóng trang này cho đến khi thanh toán hoàn tất</p>
                        <p>Hệ thống sẽ tự động kiểm tra và xác nhận thanh toán</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VietQRPaymentPage;