import React, { useState } from 'react';

interface CancelOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    orderNumber: string;
    loading?: boolean;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    orderNumber,
    loading = false
}) => {
    const [reason, setReason] = useState('');
    const [selectedReason, setSelectedReason] = useState('');

    const predefinedReasons = [
        'Đặt nhầm sản phẩm',
        'Tìm được giá tốt hơn',
        'Đổi ý không muốn mua nữa',
        'Thời gian giao hàng quá lâu',
        'Thông tin đơn hàng sai',
        'Khác'
    ];

    const handleConfirm = () => {
        const finalReason = selectedReason === 'Khác'
            ? reason
            : selectedReason;

        if (!finalReason.trim()) {
            alert('Vui lòng chọn hoặc nhập lý do hủy đơn');
            return;
        }

        onConfirm(finalReason);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 
          transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center 
        p-4">
                <div className="relative bg-white rounded-lg shadow-xl 
          max-w-md w-full p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                            Hủy đơn hàng
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 
                transition-colors"
                            disabled={loading}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <p className="text-gray-600 mb-4">
                            Bạn có chắc muốn hủy đơn hàng{' '}
                            <span className="font-semibold text-gray-900">
                                #{orderNumber}
                            </span>
                            ?
                        </p>

                        {/* Predefined Reasons */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 
                mb-2">
                                Lý do hủy đơn:
                            </label>
                            <div className="space-y-2">
                                {predefinedReasons.map((reasonOption) => (
                                    <label
                                        key={reasonOption}
                                        className="flex items-center p-3 border rounded-lg 
                      cursor-pointer hover:bg-gray-50 transition-colors"
                                    >
                                        <input
                                            type="radio"
                                            name="cancelReason"
                                            value={reasonOption}
                                            checked={selectedReason === reasonOption}
                                            onChange={(e) => {
                                                setSelectedReason(e.target.value);
                                                if (e.target.value !== 'Khác') {
                                                    setReason('');
                                                }
                                            }}
                                            className="w-4 h-4 text-blue-600 mr-3"
                                            disabled={loading}
                                        />
                                        <span className="text-sm text-gray-700">
                                            {reasonOption}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Custom Reason Input */}
                        {selectedReason === 'Khác' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 
                  mb-2">
                                    Nhập lý do khác:
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Vui lòng nhập lý do hủy đơn..."
                                    className="w-full px-4 py-2 border border-gray-300 
                    rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-blue-500 min-h-[100px]"
                                    disabled={loading}
                                />
                            </div>
                        )}

                        <div className="bg-yellow-50 border border-yellow-200 
              rounded-lg p-3 mt-4">
                            <p className="text-sm text-yellow-800">
                                <strong>Lưu ý:</strong> Sau khi hủy đơn hàng, bạn không
                                thể hoàn tác. Sản phẩm sẽ được trả lại kho.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 
                text-gray-700 rounded-lg font-medium hover:bg-gray-50 
                transition-colors"
                            disabled={loading}
                        >
                            Giữ đơn hàng
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 px-4 py-2 bg-red-500 text-white 
                rounded-lg font-medium hover:bg-red-600 
                transition-colors disabled:opacity-50 
                disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin h-5 w-5 mr-2"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 
                        12h4zm2 5.291A7.962 7.962 0 014 12H0c0 
                        3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Đang hủy...
                                </span>
                            ) : (
                                'Xác nhận hủy'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancelOrderModal;
