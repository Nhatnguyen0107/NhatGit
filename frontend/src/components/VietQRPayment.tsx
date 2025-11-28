import React, { useState, useEffect } from 'react';
import { paymentService } from '../services/payment.service';

interface VietQRPaymentProps {
    orderId: string | number;
    amount: number;
    onPaymentSuccess: (result: any) => void;
    onPaymentCancel: () => void;
}

interface QRPaymentData {
    payment_id: string;
    qr_image_url: string;
    bank_info: {
        bank_name: string;
        account_no: string;
        account_name: string;
    };
    amount: number;
    content: string;
}

const VietQRPayment: React.FC<VietQRPaymentProps> = ({
    orderId,
    amount,
    onPaymentSuccess,
    onPaymentCancel
}) => {
    const [qrData, setQrData] = useState<QRPaymentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [checking, setChecking] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes

    useEffect(() => {
        createQRPayment();
    }, []);

    useEffect(() => {
        if (qrData && !checking) {
            // Bắt đầu kiểm tra thanh toán mỗi 5 giây
            const checkInterval = setInterval(() => {
                checkPaymentStatus();
            }, 5000);

            // Countdown timer
            const countdownInterval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(checkInterval);
                        clearInterval(countdownInterval);
                        setError('Thời gian thanh toán đã hết. Vui lòng thử lại.');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => {
                clearInterval(checkInterval);
                clearInterval(countdownInterval);
            };
        }
    }, [qrData, checking]);

    const createQRPayment = async () => {
        try {
            setLoading(true);
            const result = await paymentService.createVietQRPayment({
                orderId: orderId,
                amount: amount
            });

            setQrData(result);
            setError('');
        } catch (err: any) {
            setError(err.message || 'Không thể tạo mã QR thanh toán');
        } finally {
            setLoading(false);
        }
    };

    const checkPaymentStatus = async () => {
        if (checking) return;

        try {
            setChecking(true);
            const result = await paymentService.checkVietQRPayment({
                orderId: orderId,
                amount: amount
            });

            if (result.success) {
                onPaymentSuccess(result);
            }
        } catch (err) {
            console.error('Check payment error:', err);
        } finally {
            setChecking(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Đang tạo mã QR thanh toán...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8">
                <div className="text-red-600 mb-4">❌ {error}</div>
                <button
                    onClick={createQRPayment}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4"
                >
                    Thử lại
                </button>
                <button
                    onClick={onPaymentCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Hủy
                </button>
            </div>
        );
    }

    if (!qrData) return null;

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 text-center">
                <h2 className="text-xl font-bold mb-2">Thanh toán QR Code</h2>
                <div className="text-lg font-semibold">{formatCurrency(qrData.amount)}</div>
                <div className="text-sm opacity-90">
                    Thời gian còn lại: <span className="font-mono">{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* QR Code */}
            <div className="p-6 text-center">
                <div className="bg-white p-4 rounded-lg shadow-inner mb-4">
                    <img
                        src={qrData.qr_image_url}
                        alt="QR Code Thanh toán"
                        className="w-64 h-64 mx-auto"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="%23f3f4f6"/><text x="128" y="128" text-anchor="middle" font-family="Arial" font-size="14" fill="%236b7280">QR Code không khả dụng</text></svg>`;
                        }}
                    />
                </div>

                <p className="text-sm text-gray-600 mb-4">
                    Quét mã QR bằng app ngân hàng để thanh toán
                </p>

                {checking && (
                    <div className="flex items-center justify-center text-blue-600 mb-4">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        <span className="text-sm">Đang kiểm tra thanh toán...</span>
                    </div>
                )}
            </div>

            {/* Bank Info */}
            <div className="bg-gray-50 p-6">
                <h3 className="font-semibold text-gray-800 mb-3">Thông tin chuyển khoản</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Ngân hàng:</span>
                        <span className="font-semibold">{qrData.bank_info.bank_name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Số tài khoản:</span>
                        <span className="font-mono">{qrData.bank_info.account_no}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Tên tài khoản:</span>
                        <span className="font-semibold">{qrData.bank_info.account_name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Số tiền:</span>
                        <span className="font-semibold text-red-600">{formatCurrency(qrData.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Nội dung:</span>
                        <span className="font-mono text-xs">{qrData.content}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="p-6 flex space-x-3">
                <button
                    onClick={checkPaymentStatus}
                    disabled={checking}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {checking ? 'Đang kiểm tra...' : 'Kiểm tra thanh toán'}
                </button>
                <button
                    onClick={onPaymentCancel}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                    Hủy thanh toán
                </button>
            </div>
        </div>
    );
};

export default VietQRPayment;