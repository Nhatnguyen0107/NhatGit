import { useState, useEffect } from 'react';
import api from '@/services/api';

interface Stats {
    totalUsers: number;
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
}

const AdminDashboard = () => {
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalProducts: 0,
        totalCategories: 0,
        totalOrders: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            // Gọi API để lấy thống kê
            // Tạm thời dùng dữ liệu mẫu
            const [usersRes, productsRes, categoriesRes] =
                await Promise.all([
                    api.get('/customers'),
                    api.get('/products'),
                    api.get('/categories'),
                ]);

            setStats({
                totalUsers: usersRes.data?.data?.length || 0,
                totalProducts: productsRes.data?.data?.length || 0,
                totalCategories: categoriesRes.data?.data?.length || 0,
                totalOrders: 0,
            });
        } catch (err: any) {
            setError('Không thể tải thống kê');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Tổng người dùng',
            value: stats.totalUsers,
            icon: (
                <svg className="w-8 h-8" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            bgColor: 'bg-blue-500',
        },
        {
            title: 'Tổng sản phẩm',
            value: stats.totalProducts,
            icon: (
                <svg className="w-8 h-8" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            bgColor: 'bg-green-500',
        },
        {
            title: 'Tổng danh mục',
            value: stats.totalCategories,
            icon: (
                <svg className="w-8 h-8" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            ),
            bgColor: 'bg-yellow-500',
        },
        {
            title: 'Tổng đơn hàng',
            value: stats.totalOrders,
            icon: (
                <svg className="w-8 h-8" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            bgColor: 'bg-purple-500',
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
                      lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md 
                       p-6 hover:shadow-lg 
                       transition-shadow"
                    >
                        <div className="flex items-center 
                            justify-between">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">
                                    {card.title}
                                </p>
                                <p className="text-3xl font-bold text-gray-800">
                                    {card.value}
                                </p>
                            </div>
                            <div className={`${card.bgColor} text-white 
                              p-3 rounded-lg`}>
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Hoạt động gần đây
                </h2>
                <p className="text-gray-500">
                    Chức năng theo dõi hoạt động đang được phát triển...
                </p>
            </div>
        </div>
    );
};

export default AdminDashboard;
