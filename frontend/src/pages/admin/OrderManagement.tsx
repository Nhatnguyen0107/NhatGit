import { useState, useEffect } from 'react';
import api from '@/services/api';
import Pagination from '@/components/admin/Pagination';

interface Order {
    id: string;
    customer_id: string;
    total_amount: number;
    status: string;
    payment_method: string;
    payment_status: string;
    created_at: string;
    notes?: string;
    shipping_phone?: string;
    customer?: {
        first_name: string;
        last_name: string;
        phone: string;
        billing_address: string;
        user?: {
            email: string;
        };
    };
    OrderItems?: OrderItem[];
}

interface OrderItem {
    id: string;
    product_name: string;
    quantity: number;
    price: number;
}

const OrderManagement = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOrder, setSelectedOrder] =
        useState<Order | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        fetchOrders();
    }, [currentPage, searchTerm, statusFilter, itemsPerPage]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: itemsPerPage.toString(),
            });

            if (searchTerm) {
                params.append('search', searchTerm);
            }

            if (statusFilter) {
                params.append('status', statusFilter);
            }

            const response = await api.get(`/orders?${params.toString()}`);

            console.log('📦 Orders API response:', response.data);

            // Backend trả về: { success: true, data: [...orders], pagination: {...} }
            const ordersArray = Array.isArray(response.data?.data)
                ? response.data.data
                : [];
            const paginationData = response.data?.pagination || {};

            console.log('📦 Orders array:', ordersArray);
            console.log('📦 Pagination:', paginationData);

            setOrders(ordersArray);

            if (paginationData) {
                setCurrentPage(paginationData.page || 1);
                setTotalPages(paginationData.totalPages || 1);
                setTotal(paginationData.total || 0);
            }
        } catch (err: any) {
            setError('Không thể tải danh sách đơn hàng');
            console.error('Fetch orders error:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const getStatusBadgeColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
            processing: 'bg-blue-100 text-blue-800 border border-blue-300',
            shipped: 'bg-purple-100 text-purple-800 border border-purple-300',
            delivered: 'bg-green-100 text-green-800 border border-green-300',
            cancelled: 'bg-red-100 text-red-800 border border-red-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPaymentStatusBadgeColor = (status: string) => {
        const colors: Record<string, string> = {
            paid: 'bg-green-100 text-green-800 border border-green-300',
            pending: 'bg-orange-100 text-orange-800 border border-orange-300',
            failed: 'bg-red-100 text-red-800 border border-red-300',
            refunded: 'bg-gray-100 text-gray-800 border border-gray-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            pending: 'Chờ xử lý',
            processing: 'Đang xử lý',
            shipped: 'Đang giao',
            delivered: 'Đã giao',
            cancelled: 'Đã hủy',
        };
        return labels[status] || status;
    };

    const getPaymentStatusLabel = (status: string) => {
        return status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán';
    };

    const getPaymentMethodLabel = (method: string) => {
        const labels: Record<string, string> = {
            cod: 'Tiền mặt',
            vnpay: 'VNPay',
            bank_transfer: 'Chuyển khoản',
        };
        return labels[method] || method;
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const handleViewDetail = async (order: Order) => {
        try {
            const response = await api.get(`/orders/${order.id}`);
            setSelectedOrder(response.data.data);
            setShowDetailModal(true);
        } catch (err: any) {
            alert('Không thể tải chi tiết đơn hàng');
        }
    };

    const handleUpdateStatus = async (
        orderId: string,
        newStatus: string
    ) => {
        try {
            await api.put(`/orders/${orderId}/status`, {
                status: newStatus
            });
            fetchOrders();
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder({
                    ...selectedOrder,
                    status: newStatus,
                });
            }
        } catch (err: any) {
            alert('Không thể cập nhật trạng thái đơn hàng');
            console.error('Update status error:', err);
        }
    };

    const handleUpdatePaymentStatus = async (
        orderId: string,
        newPaymentStatus: string
    ) => {
        try {
            await api.put(`/orders/${orderId}/payment`, {
                payment_status: newPaymentStatus
            });
            fetchOrders();
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder({
                    ...selectedOrder,
                    payment_status: newPaymentStatus,
                });
            }
        } catch (err: any) {
            alert('Không thể cập nhật trạng thái thanh toán');
            console.error('Update payment status error:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
            return;
        }
        try {
            await api.delete(`/orders/${id}`);
            fetchOrders();
        } catch (err: any) {
            alert('Có lỗi xảy ra khi xóa đơn hàng');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 
                        border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-400 
                      text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Quản lý đơn hàng
                </h1>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 
                          gap-4">
                    <div>
                        <label className="block text-sm font-medium 
                              text-gray-700 mb-2">
                            Tìm kiếm
                        </label>
                        <input
                            type="text"
                            placeholder="Mã đơn, tên, email khách 
                                  hàng..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 border 
                                  border-gray-300 rounded-lg 
                                  focus:ring-2 focus:ring-blue-500 
                                  focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium 
                              text-gray-700 mb-2">
                            Trạng thái
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 border 
                                  border-gray-300 rounded-lg 
                                  focus:ring-2 focus:ring-blue-500 
                                  focus:border-transparent"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="pending">Chờ xử lý</option>
                            <option value="processing">
                                Đang xử lý
                            </option>
                            <option value="shipped">Đang giao</option>
                            <option value="delivered">Đã giao</option>
                            <option value="cancelled">Đã hủy</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-md 
                      overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y 
                          divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left 
                                      text-xs font-medium 
                                      text-gray-500 uppercase">
                                    STT
                                </th>
                                <th className="px-3 py-2 text-left 
                                      text-xs font-medium 
                                      text-gray-500 uppercase">
                                    Mã đơn
                                </th>
                                <th className="px-3 py-2 text-left 
                                      text-xs font-medium 
                                      text-gray-500 uppercase">
                                    Khách hàng
                                </th>
                                <th className="px-2 py-2 text-left 
                                      text-xs font-medium 
                                      text-gray-500 uppercase">
                                    SĐT
                                </th>
                                <th className="px-3 py-2 text-left 
                                      text-xs font-medium 
                                      text-gray-500 uppercase">
                                    Tổng tiền
                                </th>
                                <th className="px-3 py-2 text-left 
                                      text-xs font-medium 
                                      text-gray-500 uppercase">
                                    Trạng thái
                                </th>
                                <th className="px-3 py-2 text-left 
                                      text-xs font-medium 
                                      text-gray-500 uppercase">
                                    Thanh toán
                                </th>
                                <th className="px-2 py-2 text-left 
                                      text-xs font-medium 
                                      text-gray-500 uppercase">
                                    Ngày
                                </th>
                                <th className="px-2 py-2 text-left 
                                      text-xs font-medium 
                                      text-gray-500 uppercase">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y 
                              divide-gray-200">
                            {orders.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="px-6 py-8 
                                          text-center 
                                          text-gray-500"
                                    >
                                        Không tìm thấy đơn hàng nào
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order, index) => (
                                    <tr key={order.id}>
                                        <td className="px-3 py-3 
                                              whitespace-nowrap 
                                              text-sm 
                                              text-gray-900">
                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                        </td>
                                        <td className="px-3 py-3 
                                              whitespace-nowrap 
                                              text-xs 
                                              text-gray-900 
                                              font-mono">
                                            #{order.id.slice(0, 6)}
                                        </td>
                                        <td className="px-3 py-3 
                                              max-w-[150px]">
                                            <div className="text-xs 
                                                  text-gray-900 
                                                  font-medium 
                                                  truncate">
                                                {order.customer
                                                    ? `${order.customer.first_name} ${order.customer.last_name}`
                                                    : 'N/A'}
                                            </div>
                                            <div className="text-xs 
                                                  text-gray-500 
                                                  truncate">
                                                {order.customer?.user?.email || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-2 py-3 
                                              whitespace-nowrap 
                                              text-xs 
                                              text-gray-900">
                                            {order.shipping_phone ||
                                                order.customer?.phone ||
                                                'N/A'}
                                        </td>
                                        <td className="px-3 py-3 
                                              whitespace-nowrap 
                                              text-xs 
                                              text-gray-900 
                                              font-semibold">
                                            {formatPrice(
                                                order.total_amount
                                            )}
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex flex-col 
                                                  gap-1 
                                                  min-w-[180px]">
                                                <div className="flex items-center 
                                                      gap-2">
                                                    <span
                                                        className={`px-2 py-1 
                                                          text-xs rounded-md 
                                                          font-medium 
                                                          ${getStatusBadgeColor(
                                                            order.status
                                                        )}`}
                                                    >
                                                        {getStatusLabel(
                                                            order.status
                                                        )}
                                                    </span>
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) =>
                                                            handleUpdateStatus(
                                                                order.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="px-2 py-1 
                                                          text-xs rounded-md 
                                                          border border-gray-300 
                                                          focus:outline-none 
                                                          focus:ring-2 
                                                      focus:ring-blue-500 
                                                      focus:border-transparent 
                                                      cursor-pointer 
                                                      bg-white"
                                                    >
                                                        <option value="pending">
                                                            Chờ xử lý
                                                        </option>
                                                        <option value="processing">
                                                            Đang xử lý
                                                        </option>
                                                        <option value="shipped">
                                                            Đang giao
                                                        </option>
                                                        <option value="delivered">
                                                            Đã giao
                                                        </option>
                                                        <option value="cancelled">
                                                            Đã hủy
                                                        </option>
                                                    </select>
                                                </div>
                                                {order.status === 'cancelled' &&
                                                    order.notes && (
                                                        <div className="text-xs 
                                                          text-red-600 
                                                          bg-red-50 
                                                          px-2 py-1 
                                                          rounded 
                                                          border 
                                                          border-red-200">
                                                            <span className="font-semibold">
                                                                Lý do:
                                                            </span> {order.notes}
                                                        </div>
                                                    )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 
                                              whitespace-nowrap">
                                            <div className="flex 
                                                  flex-col 
                                                  space-y-2">
                                                <div className="flex items-center 
                                                      gap-2">
                                                    <span
                                                        className={`px-2 
                                                          py-1 text-xs 
                                                          rounded-md 
                                                          font-medium 
                                                          inline-block 
                                                          ${getPaymentStatusBadgeColor(
                                                            order.payment_status
                                                        )}`}
                                                    >
                                                        {getPaymentStatusLabel(
                                                            order.payment_status
                                                        )}
                                                    </span>
                                                    <select
                                                        value={order.payment_status}
                                                        onChange={(e) =>
                                                            handleUpdatePaymentStatus(
                                                                order.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="px-2 py-1 
                                                          text-xs rounded-md 
                                                          border border-gray-300 
                                                          focus:outline-none 
                                                          focus:ring-2 
                                                          focus:ring-green-500 
                                                          focus:border-transparent 
                                                          cursor-pointer 
                                                          bg-white"
                                                    >
                                                        <option value="pending">
                                                            Chưa TT
                                                        </option>
                                                        <option value="paid">
                                                            Đã TT
                                                        </option>
                                                        <option value="failed">
                                                            Thất bại
                                                        </option>
                                                        <option value="refunded">
                                                            Hoàn tiền
                                                        </option>
                                                    </select>
                                                </div>
                                                <span className="text-xs 
                                                      text-gray-500">
                                                    {getPaymentMethodLabel(
                                                        order.payment_method
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-2 py-3 
                                              whitespace-nowrap 
                                              text-xs 
                                              text-gray-900">
                                            {new Date(
                                                order.created_at
                                            ).toLocaleDateString(
                                                'vi-VN'
                                            )}
                                        </td>
                                        <td className="px-2 py-3 
                                              whitespace-nowrap 
                                              text-xs space-x-1">
                                            <button
                                                onClick={() =>
                                                    handleViewDetail(
                                                        order
                                                    )
                                                }
                                                className="text-blue-600 
                                                  hover:text-blue-800 
                                                  font-medium"
                                            >
                                                Xem
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        order.id
                                                    )
                                                }
                                                className="text-red-600 
                                                  hover:text-red-800"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    total={total}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    itemName="đơn hàng"
                />
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 
                          flex items-center justify-center 
                          z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-lg max-w-3xl 
                          w-full p-6 my-8">
                        <div className="flex justify-between 
                              items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                Chi tiết đơn hàng #
                                {selectedOrder.id.slice(0, 8)}
                            </h2>
                            <button
                                onClick={() =>
                                    setShowDetailModal(false)
                                }
                                className="text-gray-500 
                                      hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Customer Info */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold mb-3">
                                    Thông tin khách hàng
                                </h3>
                                <div className="grid grid-cols-2 
                                      gap-3 text-sm">
                                    <div>
                                        <span className="text-gray-600">
                                            Họ tên:
                                        </span>
                                        <p className="font-medium">
                                            {selectedOrder.customer
                                                ? `${selectedOrder.customer.first_name} ${selectedOrder.customer.last_name}`
                                                : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">
                                            Email:
                                        </span>
                                        <p className="font-medium">
                                            {selectedOrder.customer?.user?.email || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">
                                            Số điện thoại:
                                        </span>
                                        <p className="font-medium">
                                            {selectedOrder.customer?.phone || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">
                                            Địa chỉ:
                                        </span>
                                        <p className="font-medium">
                                            {selectedOrder.customer?.billing_address || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold mb-3">
                                    Sản phẩm
                                </h3>
                                <div className="space-y-2">
                                    {selectedOrder.OrderItems?.map(
                                        (item) => (
                                            <div
                                                key={item.id}
                                                className="flex 
                                                  justify-between 
                                                  items-center 
                                                  py-2 
                                                  border-b 
                                                  last:border-b-0"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium">
                                                        {item.product_name}
                                                    </p>
                                                    <p className="text-sm 
                                                          text-gray-600">
                                                        SL: {item.quantity}{' '}
                                                        × {formatPrice(
                                                            item.price
                                                        )}
                                                    </p>
                                                </div>
                                                <p className="font-semibold">
                                                    {formatPrice(
                                                        item.quantity *
                                                        item.price
                                                    )}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                                <div className="mt-4 pt-4 
                                      border-t flex 
                                      justify-between">
                                    <span className="text-lg 
                                          font-semibold">
                                        Tổng cộng:
                                    </span>
                                    <span className="text-xl 
                                          font-bold 
                                          text-blue-600">
                                        {formatPrice(
                                            selectedOrder.total_amount
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Order Status */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold mb-3">
                                    Trạng thái đơn hàng
                                </h3>
                                <div className="grid grid-cols-2 
                                      gap-4 text-sm">
                                    <div>
                                        <label className="text-gray-600 
                                              block mb-2">
                                            Trạng thái đơn hàng:
                                        </label>
                                        <select
                                            value={selectedOrder.status}
                                            onChange={(e) =>
                                                handleUpdateStatus(
                                                    selectedOrder.id,
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 
                                              border border-gray-300 
                                              rounded-lg 
                                              focus:outline-none 
                                              focus:ring-2 
                                              focus:ring-blue-500 
                                              focus:border-transparent 
                                              cursor-pointer"
                                        >
                                            <option value="pending">
                                                Chờ xử lý
                                            </option>
                                            <option value="processing">
                                                Đang xử lý
                                            </option>
                                            <option value="shipped">
                                                Đang giao
                                            </option>
                                            <option value="delivered">
                                                Đã giao
                                            </option>
                                            <option value="cancelled">
                                                Đã hủy
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-gray-600 
                                              block mb-2">
                                            Trạng thái thanh toán:
                                        </label>
                                        <select
                                            value={selectedOrder.payment_status}
                                            onChange={(e) =>
                                                handleUpdatePaymentStatus(
                                                    selectedOrder.id,
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 
                                              border border-gray-300 
                                              rounded-lg 
                                              focus:outline-none 
                                              focus:ring-2 
                                              focus:ring-blue-500 
                                              focus:border-transparent 
                                              cursor-pointer"
                                        >
                                            <option value="pending">
                                                Chưa thanh toán
                                            </option>
                                            <option value="paid">
                                                Đã thanh toán
                                            </option>
                                            <option value="failed">
                                                Thanh toán thất bại
                                            </option>
                                            <option value="refunded">
                                                Đã hoàn tiền
                                            </option>
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Phương thức: {getPaymentMethodLabel(
                                                selectedOrder.payment_method
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">
                                            Ngày đặt:
                                        </span>
                                        <p className="font-medium mt-2">
                                            {new Date(
                                                selectedOrder.created_at
                                            ).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                </div>
                                {selectedOrder.status === 'cancelled' &&
                                    selectedOrder.notes && (
                                        <div className="mt-4 p-3 
                                          bg-red-50 
                                          border border-red-200 
                                          rounded-lg">
                                            <p className="text-sm 
                                              font-semibold 
                                              text-red-700 mb-1">
                                                Lý do hủy đơn:
                                            </p>
                                            <p className="text-sm text-red-600">
                                                {selectedOrder.notes}
                                            </p>
                                        </div>
                                    )}
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() =>
                                    setShowDetailModal(false)
                                }
                                className="px-4 py-2 bg-gray-200 
                                      text-gray-800 rounded-lg 
                                      hover:bg-gray-300"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
