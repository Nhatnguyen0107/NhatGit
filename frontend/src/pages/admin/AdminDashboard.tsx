import { useState, useEffect } from 'react';
import api from '@/services/api';

interface Stats {
    totalUsers: number;
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
}

interface RecentOrder {
    id: string;
    customer_name: string;
    total_amount: number;
    status: string;
    createdAt: string;
}

const AdminDashboard = () => {
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalProducts: 0,
        totalCategories: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0,
    });
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const [
                usersRes,
                productsRes,
                categoriesRes,
                ordersRes
            ] = await Promise.all([
                api.get('/customers'),
                api.get('/products'),
                api.get('/categories'),
                api.get('/orders'),
            ]);

            const users = usersRes.data?.data || [];
            const products = productsRes.data?.data || [];
            const categories = categoriesRes.data?.data || [];
            const orders = ordersRes.data?.data || [];

            const totalRevenue = orders.reduce(
                (sum: number, order: any) =>
                    sum + (order.total_amount || 0),
                0
            );
            const pendingOrders = orders.filter(
                (order: any) =>
                    order.status === 'pending' ||
                    order.status === 'processing'
            ).length;
            const completedOrders = orders.filter(
                (order: any) => order.status === 'delivered'
            ).length;

            const sortedOrders = [...orders]
                .sort((a: any, b: any) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .slice(0, 5);
            setRecentOrders(sortedOrders);

            setStats({
                totalUsers: users.length,
                totalProducts: products.length,
                totalCategories: categories.length,
                totalOrders: orders.length,
                totalRevenue,
                pendingOrders,
                completedOrders,
            });
        } catch (err: any) {
            setError('Không thể tải thống kê');
            console.error('Fetch stats error:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getStatusBadgeColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipping: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const statCards = [
        {
            title: 'Tổng doanh thu',
            value: formatPrice(stats.totalRevenue),
            icon: '💰',
            bgColor: 'bg-green-500',
            textColor: 'text-white',
        },
        {
            title: 'Tổng đơn hàng',
            value: stats.totalOrders,
            icon: '📦',
            bgColor: 'bg-blue-500',
            textColor: 'text-white',
        },
        {
            title: 'Đơn chờ xử lý',
            value: stats.pendingOrders,
            icon: '⏳',
            bgColor: 'bg-yellow-500',
            textColor: 'text-white',
        },
        {
            title: 'Đơn hoàn thành',
            value: stats.completedOrders,
            icon: '✅',
            bgColor: 'bg-purple-500',
            textColor: 'text-white',
        },
        {
            title: 'Tổng người dùng',
            value: stats.totalUsers,
            icon: '👥',
            bgColor: 'bg-indigo-500',
            textColor: 'text-white',
        },
        {
            title: 'Tổng sản phẩm',
            value: stats.totalProducts,
            icon: '📱',
            bgColor: 'bg-pink-500',
            textColor: 'text-white',
        },
    ];

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
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Dashboard
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 
                      lg:grid-cols-3 gap-6">
                {statCards.map((card, index) => (
                    <div
                        key={index}
                        className={`${card.bgColor} ${card.textColor} 
                       rounded-lg shadow-md p-6 hover:shadow-lg 
                       transition-shadow`}
                    >
                        <div className="flex items-center 
                            justify-between">
                            <div>
                                <p className="text-sm mb-1 opacity-90">
                                    {card.title}
                                </p>
                                <p className="text-3xl font-bold">
                                    {card.value}
                                </p>
                            </div>
                            <div className="text-4xl opacity-80">
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders & System Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 
                      gap-6 mt-8">
                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold 
                          text-gray-800 mb-4">
                        Đơn hàng gần đây
                    </h2>
                    {recentOrders.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            Chưa có đơn hàng nào
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center 
                                      justify-between p-3 
                                      bg-gray-50 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium 
                                              text-gray-800">
                                            {order.customer_name ||
                                                'N/A'}
                                        </p>
                                        <p className="text-sm 
                                              text-gray-500">
                                            #{order.id.slice(0, 8)} •{' '}
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    <div className="flex items-center 
                                          space-x-3">
                                        <p className="font-semibold 
                                              text-gray-800">
                                            {formatPrice(
                                                order.total_amount
                                            )}
                                        </p>
                                        <span
                                            className={`px-2 py-1 
                                              text-xs rounded-full 
                                              font-medium 
                                              ${getStatusBadgeColor(
                                                order.status
                                            )}`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* System Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold 
                          text-gray-800 mb-4">
                        Thông tin hệ thống
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center 
                              justify-between p-3 
                              bg-gray-50 rounded-lg">
                            <span className="text-gray-600">
                                Danh mục sản phẩm
                            </span>
                            <span className="text-2xl font-bold 
                                  text-blue-600">
                                {stats.totalCategories}
                            </span>
                        </div>
                        <div className="flex items-center 
                              justify-between p-3 
                              bg-gray-50 rounded-lg">
                            <span className="text-gray-600">
                                Tỷ lệ hoàn thành
                            </span>
                            <span className="text-2xl font-bold 
                                  text-green-600">
                                {stats.totalOrders > 0
                                    ? (
                                        (stats.completedOrders /
                                            stats.totalOrders) *
                                        100
                                    ).toFixed(1)
                                    : 0}
                                %
                            </span>
                        </div>
                        <div className="flex items-center 
                              justify-between p-3 
                              bg-gray-50 rounded-lg">
                            <span className="text-gray-600">
                                Giá trị đơn TB
                            </span>
                            <span className="text-2xl font-bold 
                                  text-purple-600">
                                {stats.totalOrders > 0
                                    ? formatPrice(
                                        Math.round(
                                            stats.totalRevenue /
                                            stats.totalOrders
                                        )
                                    )
                                    : formatPrice(0)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
