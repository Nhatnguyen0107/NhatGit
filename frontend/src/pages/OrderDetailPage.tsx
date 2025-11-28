import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import CancelOrderModal from '../components/CancelOrderModal';
import { formatPrice } from '@/utils/formatPrice';

interface OrderItem {
    id: number;
    product_name: string;
    product_price: number;
    quantity: number;
    discount_percentage: number;
    product?: {
        id: string;
        name: string;
        image_url: string;
    };
}

interface Order {
    id: string;
    order_number: string;
    status: string;
    subtotal: number;
    shipping_cost: number;
    discount_amount: number;
    total_amount: number;
    shipping_address: string;
    shipping_phone?: string;
    notes?: string;
    created_at: string;
    order_items: OrderItem[];
}

const OrderDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/orders/${id}`);
            console.log('Order data:', response.data);

            const orderData = response.data?.data?.order ||
                response.data?.data ||
                response.data;
            setOrder(orderData);
        } catch (err: any) {
            console.error('Error fetching order:', err);
            if (err.response?.status === 401) {
                navigate('/login');
            } else {
                setError('Không thể tải thông tin đơn hàng');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getImageUrl = (url: string) => {
        if (!url) return 'https://via.placeholder.com/80';
        if (url.startsWith('http')) return url;
        return `http://localhost:3000${url}`;
    };

    const handleCancelOrder = async (reason: string) => {
        try {
            setCancelling(true);
            await api.put(`/orders/${id}/cancel`, { reason });

            setShowCancelModal(false);
            alert('Đơn hàng đã được hủy thành công!');

            // Refresh order data
            fetchOrder();
        } catch (err: any) {
            console.error('Error cancelling order:', err);
            alert(
                err.response?.data?.message ||
                'Không thể hủy đơn hàng. Vui lòng thử lại!'
            );
        } finally {
            setCancelling(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, {
            label: string;
            color: string
        }> = {
            pending: {
                label: 'Chờ xác nhận',
                color: 'bg-yellow-100 text-yellow-700'
            },
            confirmed: {
                label: 'Đã xác nhận',
                color: 'bg-blue-100 text-blue-700'
            },
            shipping: {
                label: 'Đang giao hàng',
                color: 'bg-purple-100 text-purple-700'
            },
            delivered: {
                label: 'Đã giao hàng',
                color: 'bg-green-100 text-green-700'
            },
            cancelled: {
                label: 'Đã hủy',
                color: 'bg-red-100 text-red-700'
            }
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`px-4 py-2 rounded-full text-sm font-semibold 
        ${config.color}`}>
                {config.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-64" />
                    <div className="h-64 bg-gray-200 rounded" />
                    <div className="h-48 bg-gray-200 rounded" />
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="text-red-500 mb-4">
                    {error || 'Không tìm thấy đơn hàng'}
                </div>
                <Link
                    to="/orders"
                    className="text-blue-600 hover:underline"
                >
                    Quay lại danh sách đơn hàng
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Success Message */}
                <div className="bg-green-50 border-2 border-green-200 
          rounded-lg p-6 mb-6 text-center">
                    <div className="flex justify-center mb-4">
                        <svg
                            className="w-16 h-16 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Đặt hàng thành công!
                    </h1>
                    <p className="text-gray-600">
                        Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng
                        của bạn sớm nhất.
                    </p>
                </div>

                {/* Order Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row 
            md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1">
                                Đơn hàng #{order.order_number}
                            </h2>
                            <p className="text-sm text-gray-600">
                                Đặt lúc: {formatDate(order.created_at)}
                            </p>
                        </div>
                        {getStatusBadge(order.status)}
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-bold mb-4">Chi tiết sản phẩm</h3>
                    <div className="space-y-4">
                        {order.order_items?.map((item) => {
                            const finalPrice = item.discount_percentage > 0
                                ? item.product_price *
                                (1 - item.discount_percentage / 100)
                                : item.product_price;

                            return (
                                <div
                                    key={item.id}
                                    className="flex items-start gap-4 pb-4 
                    border-b last:border-b-0"
                                >
                                    {/* Product Image */}
                                    <img
                                        src={getImageUrl(item.product?.image_url || '')}
                                        alt={item.product_name}
                                        className="w-20 h-20 object-cover rounded-lg 
                      border border-gray-200 flex-shrink-0"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                'https://via.placeholder.com/80';
                                        }}
                                    />

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900 mb-1">
                                            {item.product_name}
                                        </h4>
                                        <div className="text-sm text-gray-600">
                                            {formatPrice(finalPrice)} x {item.quantity}
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="font-semibold text-gray-900 
                    flex-shrink-0">
                                        {formatPrice(finalPrice * item.quantity)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Price Summary */}
                    <div className="border-t mt-4 pt-4 space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Tạm tính</span>
                            <span>{formatPrice(order.subtotal)}</span>
                        </div>
                        {order.discount_amount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Giảm giá</span>
                                <span>-{formatPrice(order.discount_amount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-gray-600">
                            <span>Phí vận chuyển</span>
                            <span>
                                {order.shipping_cost === 0
                                    ? 'Miễn phí'
                                    : formatPrice(order.shipping_cost)}
                            </span>
                        </div>
                        <div className="border-t pt-2 flex justify-between 
              text-lg font-bold">
                            <span>Tổng cộng</span>
                            <span className="text-red-600">
                                {formatPrice(order.total_amount)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-bold mb-4">
                        Thông tin giao hàng
                    </h3>
                    <div className="space-y-2 text-gray-700">
                        <div>
                            <span className="font-medium">Địa chỉ:</span>{' '}
                            {order.shipping_address}
                        </div>
                        {order.shipping_phone && (
                            <div>
                                <span className="font-medium">Số điện thoại:</span>{' '}
                                {order.shipping_phone}
                            </div>
                        )}
                        {order.notes && (
                            <div>
                                <span className="font-medium">Ghi chú:</span>{' '}
                                {order.notes}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        to="/products"
                        className="flex-1 text-center bg-blue-500 text-white 
              py-3 rounded-lg font-semibold hover:bg-blue-600 
              transition-colors"
                    >
                        Tiếp tục mua sắm
                    </Link>
                    <Link
                        to="/orders"
                        className="flex-1 text-center bg-gray-200 text-gray-700 
              py-3 rounded-lg font-semibold hover:bg-gray-300 
              transition-colors"
                    >
                        Xem đơn hàng của tôi
                    </Link>
                    {(order.status === 'pending' ||
                        order.status === 'processing') && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="flex-1 text-center bg-red-100 text-red-600 
                py-3 rounded-lg font-semibold hover:bg-red-200 
                transition-colors"
                            >
                                Hủy đơn hàng
                            </button>
                        )}
                </div>
            </div>

            {/* Cancel Order Modal */}
            <CancelOrderModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleCancelOrder}
                orderNumber={order.order_number}
                loading={cancelling}
            />
        </div>
    );
};

export default OrderDetailPage;
