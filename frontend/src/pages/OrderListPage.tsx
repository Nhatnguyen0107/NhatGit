import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CancelOrderModal from '../components/CancelOrderModal';
import { formatPrice } from '@/utils/formatPrice';

interface OrderItem {
    id: string;
    product_name: string;
    product_price: number;
    quantity: number;
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
    total_amount: number;
    created_at: string;
    order_items: OrderItem[];
}

const OrderListPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [cancelModal, setCancelModal] = useState<{
        isOpen: boolean;
        orderId: string;
        orderNumber: string;
    }>({ isOpen: false, orderId: '', orderNumber: '' });
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            const params: any = {};
            if (statusFilter) params.status = statusFilter;

            const response = await api.get('/orders/my-orders', { params });

            const ordersData = response.data?.data?.orders ||
                response.data?.data ||
                [];
            setOrders(ordersData);
        } catch (err: any) {
            console.error('Error fetching orders:', err);
            setError(
                err.response?.data?.message ||
                'Không thể tải danh sách đơn hàng'
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getImageUrl = (url: string) => {
        if (!url) return 'https://via.placeholder.com/60';
        if (url.startsWith('http')) return url;
        return `http://localhost:3000${url}`;
    };

    const handleCancelOrder = async (reason: string) => {
        try {
            setCancelling(true);
            await api.put(`/orders/${cancelModal.orderId}/cancel`, {
                reason
            });

            // Close modal
            setCancelModal({
                isOpen: false,
                orderId: '',
                orderNumber: ''
            });

            // Show success message
            alert('Đơn hàng đã được hủy thành công!');

            // Refresh orders list
            fetchOrders();
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
        const statusConfig: Record<
            string,
            { label: string; color: string }
        > = {
            pending: {
                label: 'Chờ xác nhận',
                color: 'bg-yellow-100 text-yellow-800'
            },
            processing: {
                label: 'Đang xử lý',
                color: 'bg-blue-100 text-blue-800'
            },
            shipped: {
                label: 'Đang giao',
                color: 'bg-purple-100 text-purple-800'
            },
            delivered: {
                label: 'Đã giao',
                color: 'bg-green-100 text-green-800'
            },
            cancelled: {
                label: 'Đã hủy',
                color: 'bg-red-100 text-red-800'
            }
        };

        const config = statusConfig[status] || {
            label: status,
            color: 'bg-gray-100 text-gray-800'
        };

        return (
            <span
                className={`px-3 py-1 rounded-full text-sm font-medium 
          ${config.color}`}
            >
                {config.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 
            w-12 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg 
          p-6 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchOrders}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg 
              hover:bg-red-600 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Đơn hàng của tôi
                    </h1>
                    <p className="text-gray-600">
                        Quản lý và theo dõi đơn hàng của bạn
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <label className="text-sm font-medium text-gray-700">
                            Lọc theo trạng thái:
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setStatusFilter('')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium 
                transition-colors ${statusFilter === ''
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Tất cả
                            </button>
                            <button
                                onClick={() => setStatusFilter('pending')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium 
                transition-colors ${statusFilter === 'pending'
                                        ? 'bg-yellow-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Chờ xác nhận
                            </button>
                            <button
                                onClick={() => setStatusFilter('processing')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium 
                transition-colors ${statusFilter === 'processing'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Đang xử lý
                            </button>
                            <button
                                onClick={() => setStatusFilter('shipped')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium 
                transition-colors ${statusFilter === 'shipped'
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Đang giao
                            </button>
                            <button
                                onClick={() => setStatusFilter('delivered')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium 
                transition-colors ${statusFilter === 'delivered'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Đã giao
                            </button>
                            <button
                                onClick={() => setStatusFilter('cancelled')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium 
                transition-colors ${statusFilter === 'cancelled'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Đã hủy
                            </button>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 
          text-center">
                        <div className="text-gray-400 mb-4">
                            <svg
                                className="mx-auto h-24 w-24"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 
                  012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 
                  01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Chưa có đơn hàng nào
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {statusFilter
                                ? 'Không có đơn hàng nào với trạng thái này'
                                : 'Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!'
                            }
                        </p>
                        <Link
                            to="/products"
                            className="inline-block bg-blue-500 text-white px-8 py-3 
              rounded-lg font-semibold hover:bg-blue-600 
              transition-colors"
                        >
                            Khám phá sản phẩm
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-lg shadow-sm 
                hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    {/* Order Header */}
                                    <div className="flex flex-wrap justify-between 
                  items-start mb-4 pb-4 border-b">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 
                      mb-1">
                                                Đơn hàng #{order.order_number}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Đặt lúc: {formatDate(order.created_at)}
                                            </p>
                                        </div>
                                        <div className="mt-2 sm:mt-0">
                                            {getStatusBadge(order.status)}
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="space-y-3 mb-4">
                                        {order.order_items?.slice(0, 2).map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-3 text-sm"
                                            >
                                                {/* Product Image */}
                                                <img
                                                    src={getImageUrl(
                                                        item.product?.image_url || ''
                                                    )}
                                                    alt={item.product_name}
                                                    className="w-16 h-16 object-cover rounded-lg 
                          border border-gray-200 flex-shrink-0"
                                                    onError={(e) => {
                                                        e.currentTarget.src =
                                                            'https://via.placeholder.com/60';
                                                    }}
                                                />

                                                {/* Product Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 
                          truncate">
                                                        {item.product_name}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        Số lượng: {item.quantity}
                                                    </p>
                                                </div>

                                                {/* Price */}
                                                <p className="font-semibold text-gray-900 
                        flex-shrink-0">
                                                    {formatPrice(item.product_price *
                                                        item.quantity)}
                                                </p>
                                            </div>
                                        ))}
                                        {order.order_items &&
                                            order.order_items.length > 2 && (
                                                <p className="text-sm text-gray-600">
                                                    Và {order.order_items.length - 2} sản phẩm khác
                                                </p>
                                            )}
                                    </div>

                                    {/* Order Footer */}
                                    <div className="flex flex-wrap justify-between 
                  items-center pt-4 border-t">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">
                                                Tổng cộng
                                            </p>
                                            <p className="text-xl font-bold text-red-600">
                                                {formatPrice(order.total_amount)}
                                            </p>
                                        </div>
                                        <div className="flex gap-3 mt-3 sm:mt-0">
                                            <Link
                                                to={`/orders/${order.id}`}
                                                className="px-6 py-2 bg-blue-500 text-white 
                        rounded-lg font-medium hover:bg-blue-600 
                        transition-colors"
                                            >
                                                Xem chi tiết
                                            </Link>
                                            {(order.status === 'pending' ||
                                                order.status === 'processing') && (
                                                    <button
                                                        onClick={() => {
                                                            setCancelModal({
                                                                isOpen: true,
                                                                orderId: order.id,
                                                                orderNumber: order.order_number
                                                            });
                                                        }}
                                                        className="px-6 py-2 bg-red-100 text-red-600 
                          rounded-lg font-medium hover:bg-red-200 
                          transition-colors"
                                                    >
                                                        Hủy đơn
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Cancel Order Modal */}
                <CancelOrderModal
                    isOpen={cancelModal.isOpen}
                    onClose={() =>
                        setCancelModal({
                            isOpen: false,
                            orderId: '',
                            orderNumber: ''
                        })
                    }
                    onConfirm={handleCancelOrder}
                    orderNumber={cancelModal.orderNumber}
                    loading={cancelling}
                />
            </div>
        </div>
    );
};

export default OrderListPage;
