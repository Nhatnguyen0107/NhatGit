import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const PayOSMockPayment: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [countdown, setCountdown] = useState(3);
    const [message, setMessage] = useState('Đang xử lý thanh toán...');

    const orderId = searchParams.get('orderId');
    const orderCode = searchParams.get('orderCode');
    const amount = searchParams.get('amount');

    useEffect(() => {
        if (!orderId || !orderCode) {
            setStatus('error');
            setMessage('Thông tin thanh toán không hợp lệ');
            return;
        }

        // Simulate payment processing (3 seconds)
        const timer = setTimeout(async () => {
            try {
                // Call backend to confirm payment
                const response = await api.post('/payments/payos/confirm', {
                    orderId,
                    orderCode
                });

                if (response.data.success) {
                    setStatus('success');
                    setMessage('Thanh toán thành công! Đang chuyển hướng...');

                    // Countdown before redirect
                    let count = 3;
                    const countInterval = setInterval(() => {
                        count--;
                        setCountdown(count);
                        if (count === 0) {
                            clearInterval(countInterval);
                            navigate(`/payment/result?status=success&orderId=${orderId}&orderNumber=${response.data.data.order_number || orderCode}`);
                        }
                    }, 1000);
                } else {
                    setStatus('error');
                    setMessage('Thanh toán thất bại. Vui lòng thử lại.');
                }
            } catch (error: any) {
                console.error('Payment confirmation error:', error);
                setStatus('error');
                setMessage(
                    error.response?.data?.message ||
                    'Có lỗi xảy ra. Vui lòng liên hệ hỗ trợ.'
                );
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [orderId, orderCode, navigate]);

    const formatPrice = (price: string | null) => {
        if (!price) return '0';
        return new Intl.NumberFormat('vi-VN').format(parseInt(price));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 
            to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl 
                overflow-hidden">
                {/* Header */}
                <div className={`p-8 text-white text-center ${status === 'processing'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                    : status === 'success'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-red-500 to-pink-500'
                    }`}>
                    <div className="text-6xl mb-4 animate-bounce">
                        {status === 'processing' && '⏳'}
                        {status === 'success' && '✅'}
                        {status === 'error' && '❌'}
                    </div>
                    <h1 className="text-2xl font-bold">
                        {status === 'processing' && 'Đang xử lý'}
                        {status === 'success' && 'Thành công'}
                        {status === 'error' && 'Thất bại'}
                    </h1>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Processing Animation */}
                    {status === 'processing' && (
                        <div className="mb-6">
                            <div className="flex justify-center space-x-2 mb-4">
                                <div className="w-3 h-3 bg-purple-500 rounded-full 
                                    animate-pulse"></div>
                                <div className="w-3 h-3 bg-purple-500 rounded-full 
                                    animate-pulse delay-75"></div>
                                <div className="w-3 h-3 bg-purple-500 rounded-full 
                                    animate-pulse delay-150"></div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 
                                overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-500 
                                    to-blue-500 animate-loading"></div>
                            </div>
                        </div>
                    )}

                    {/* Payment Info */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Phương thức:</span>
                            <span className="font-semibold text-purple-600">
                                PayOS
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Số tiền:</span>
                            <span className="font-bold text-xl text-gray-900">
                                {formatPrice(amount)}đ
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Mã giao dịch:</span>
                            <span className="font-mono text-sm text-gray-700">
                                {orderCode}
                            </span>
                        </div>
                    </div>

                    {/* Status Message */}
                    <div className={`p-4 rounded-xl text-center ${status === 'processing'
                        ? 'bg-blue-50 text-blue-700'
                        : status === 'success'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                        <p className="font-medium">{message}</p>
                        {status === 'success' && (
                            <p className="text-sm mt-2">
                                Chuyển hướng sau {countdown} giây...
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    {status === 'error' && (
                        <div className="mt-6 space-y-3">
                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full py-3 bg-purple-600 text-white 
                                    rounded-lg hover:bg-purple-700 transition-colors 
                                    font-semibold"
                            >
                                Thử lại
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full py-3 bg-gray-200 text-gray-700 
                                    rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Về trang chủ
                            </button>
                        </div>
                    )}


                </div>
            </div>

            <style>{`
                @keyframes loading {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animate-loading {
                    animation: loading 3s ease-in-out;
                }
                .delay-75 {
                    animation-delay: 75ms;
                }
                .delay-150 {
                    animation-delay: 150ms;
                }
            `}</style>
        </div>
    );
};

export default PayOSMockPayment;
