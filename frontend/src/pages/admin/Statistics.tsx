import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import api from '@/services/api';
import { getImageUrl } from '@/utils/imageUrl';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface RevenueData {
    date: string;
    orderCount: number;
    revenue: number;
}

interface TopProduct {
    product_id: string;
    name: string;
    category: string;
    price: number;
    image_url: string;
    stock_quantity: number;
    totalSold: number;
    totalRevenue: number;
}

interface LowStockProduct {
    id: string;
    name: string;
    price: number;
    stock_quantity: number;
    image_url: string;
    category: {
        name: string;
    };
}

interface CategoryStat {
    id: string;
    name: string;
    productCount: number;
    revenue: number;
}

interface OrderStatusStat {
    status: string;
    count: number;
    totalAmount: number;
}

interface TopCustomer {
    id: string;
    name: string;
    email: string;
    phone: string;
    orderCount: number;
    totalSpent: number;
}

const Statistics = () => {
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('month');
    const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [lowStockProducts, setLowStockProducts] =
        useState<LowStockProduct[]>([]);
    const [categoryStats, setCategoryStats] =
        useState<CategoryStat[]>([]);
    const [orderStatusStats, setOrderStatusStats] =
        useState<OrderStatusStat[]>([]);
    const [topCustomers, setTopCustomers] =
        useState<TopCustomer[]>([]);

    useEffect(() => {
        fetchAllStats();
    }, [period]);

    const fetchAllStats = async () => {
        try {
            setLoading(true);

            // Fetch individually to catch errors better
            const revenueRes = await api.get(
                `/statistics/revenue?period=${period}`
            ).catch(err => {
                console.error('Revenue API error:', err);
                return { data: { data: { data: [] } } };
            });

            const topProductsRes = await api.get(
                '/statistics/top-products?limit=10'
            ).catch(err => {
                console.error('Top products API error:', err);
                return { data: { data: [] } };
            });

            const lowStockRes = await api.get(
                '/statistics/low-stock?threshold=10'
            ).catch(err => {
                console.error('Low stock API error:', err);
                return { data: { data: [] } };
            });

            const categoryRes = await api.get(
                '/statistics/categories'
            ).catch(err => {
                console.error('Category API error:', err);
                return { data: { data: [] } };
            });

            const orderStatusRes = await api.get(
                '/statistics/orders/status'
            ).catch(err => {
                console.error('Order status API error:', err);
                return { data: { data: [] } };
            });

            const topCustomersRes = await api.get(
                '/statistics/top-customers?limit=10'
            ).catch(err => {
                console.error('Top customers API error:', err);
                return { data: { data: [] } };
            });

            console.log('Revenue data:', revenueRes.data);
            console.log('Top products:', topProductsRes.data);
            console.log('Category stats:', categoryRes.data);

            setRevenueData(revenueRes.data.data?.data || []);
            setTopProducts(topProductsRes.data.data || []);
            setLowStockProducts(lowStockRes.data.data || []);
            setCategoryStats(categoryRes.data.data || []);
            setOrderStatusStats(orderStatusRes.data.data || []);
            setTopCustomers(topCustomersRes.data.data || []);
        } catch (err) {
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

    // Revenue Line Chart
    const revenueChartData = {
        labels: revenueData.map(d => d.date),
        datasets: [
            {
                label: 'Doanh thu',
                data: revenueData.map(d => d.revenue),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const revenueChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const
            },
            title: {
                display: true,
                text: 'Biểu đồ doanh thu'
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        return `Doanh thu: ${formatPrice(
                            context.parsed.y
                        )}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value: any) => {
                        return formatPrice(value);
                    }
                }
            }
        }
    };

    // Category Bar Chart
    const categoryChartData = {
        labels: categoryStats.map(c => c.name),
        datasets: [
            {
                label: 'Doanh thu',
                data: categoryStats.map(c => c.revenue),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(236, 72, 153, 0.7)'
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(16, 185, 129)',
                    'rgb(245, 158, 11)',
                    'rgb(239, 68, 68)',
                    'rgb(139, 92, 246)',
                    'rgb(236, 72, 153)'
                ],
                borderWidth: 1
            }
        ]
    };

    const categoryChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Doanh thu theo danh mục'
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        return `Doanh thu: ${formatPrice(
                            context.parsed.y
                        )}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value: any) => {
                        return formatPrice(value);
                    }
                }
            }
        }
    };

    // Order Status Pie Chart
    const orderStatusChartData = {
        labels: orderStatusStats.map(s => {
            const statusMap: Record<string, string> = {
                pending: 'Chờ xử lý',
                processing: 'Đang xử lý',
                shipping: 'Đang giao',
                delivered: 'Đã giao',
                cancelled: 'Đã hủy'
            };
            return statusMap[s.status] || s.status;
        }),
        datasets: [
            {
                data: orderStatusStats.map(s => s.count),
                backgroundColor: [
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(239, 68, 68, 0.7)'
                ],
                borderColor: [
                    'rgb(245, 158, 11)',
                    'rgb(59, 130, 246)',
                    'rgb(139, 92, 246)',
                    'rgb(16, 185, 129)',
                    'rgb(239, 68, 68)'
                ],
                borderWidth: 2
            }
        ]
    };

    const orderStatusChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const
            },
            title: {
                display: true,
                text: 'Trạng thái đơn hàng'
            }
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">
                    Thống kê & Báo cáo
                </h1>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="px-4 py-2 border border-gray-300 
                            rounded-lg focus:ring-2 
                            focus:ring-blue-500"
                >
                    <option value="day">Hôm nay</option>
                    <option value="month">Tháng này</option>
                    <option value="year">Năm này</option>
                </select>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div style={{ height: '400px' }}>
                    <Line
                        data={revenueChartData}
                        options={revenueChartOptions}
                    />
                </div>
            </div>

            {/* Category & Order Status Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div style={{ height: '350px' }}>
                        <Bar
                            data={categoryChartData}
                            options={categoryChartOptions}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div style={{ height: '350px' }}>
                        <Pie
                            data={orderStatusChartData}
                            options={orderStatusChartOptions}
                        />
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Sản phẩm bán chạy nhất
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs 
                                        font-medium text-gray-500 
                                        uppercase tracking-wider">
                                    STT
                                </th>
                                <th className="px-6 py-3 text-left text-xs 
                                        font-medium text-gray-500 
                                        uppercase tracking-wider">
                                    Sản phẩm
                                </th>
                                <th className="px-6 py-3 text-left text-xs 
                                        font-medium text-gray-500 
                                        uppercase tracking-wider">
                                    Danh mục
                                </th>
                                <th className="px-6 py-3 text-left text-xs 
                                        font-medium text-gray-500 
                                        uppercase tracking-wider">
                                    Đã bán
                                </th>
                                <th className="px-6 py-3 text-left text-xs 
                                        font-medium text-gray-500 
                                        uppercase tracking-wider">
                                    Doanh thu
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y 
                                divide-gray-200">
                            {topProducts.map((product, index) => (
                                <tr key={product.product_id}>
                                    <td className="px-6 py-4 
                                            whitespace-nowrap text-sm 
                                            text-gray-900">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 
                                            whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img
                                                src={getImageUrl(
                                                    product.image_url
                                                )}
                                                alt={product.name}
                                                className="w-10 h-10 
                                                    rounded object-cover 
                                                    mr-3"
                                            />
                                            <div className="text-sm 
                                                    font-medium 
                                                    text-gray-900">
                                                {product.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 
                                            whitespace-nowrap text-sm 
                                            text-gray-500">
                                        {product.category}
                                    </td>
                                    <td className="px-6 py-4 
                                            whitespace-nowrap text-sm 
                                            text-gray-900">
                                        {product.totalSold}
                                    </td>
                                    <td className="px-6 py-4 
                                            whitespace-nowrap text-sm 
                                            text-gray-900 font-semibold">
                                        {formatPrice(
                                            product.totalRevenue
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Low Stock & Top Customers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Products */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold 
                                text-gray-800">
                            Sản phẩm tồn kho thấp
                        </h2>
                    </div>
                    <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
                        {lowStockProducts.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between 
                                    p-3 bg-red-50 rounded-lg"
                            >
                                <div className="flex items-center">
                                    <img
                                        src={getImageUrl(product.image_url)}
                                        alt={product.name}
                                        className="w-12 h-12 rounded 
                                            object-cover mr-3"
                                    />
                                    <div>
                                        <div className="text-sm font-medium 
                                                text-gray-900">
                                            {product.name}
                                        </div>
                                        <div className="text-xs 
                                                text-gray-500">
                                            {product.category.name}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold 
                                            text-red-600">
                                        {product.stock_quantity}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        còn lại
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Customers */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold 
                                text-gray-800">
                            Khách hàng VIP
                        </h2>
                    </div>
                    <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
                        {topCustomers.map((customer, index) => (
                            <div
                                key={customer.id}
                                className="flex items-center justify-between 
                                    p-3 bg-green-50 rounded-lg"
                            >
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full 
                                            bg-green-500 text-white 
                                            flex items-center 
                                            justify-center 
                                            font-bold mr-3">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium 
                                                text-gray-900">
                                            {customer.name}
                                        </div>
                                        <div className="text-xs 
                                                text-gray-500">
                                            {customer.email}
                                        </div>
                                        <div className="text-xs 
                                                text-gray-500">
                                            {customer.orderCount} đơn hàng
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold 
                                            text-green-600">
                                        {formatPrice(customer.totalSpent)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
