import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    image_url: string;
    stock_quantity: number;
    category?: {
        id: number;
        name: string;
    };
}

const SearchPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const searchProducts = async () => {
            if (!keyword) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await api.get('/products', {
                    params: {
                        search: keyword,
                        limit: 50
                    }
                });

                const result = response.data?.data?.products ||
                    response.data?.products ||
                    [];
                setProducts(result);
            } catch (err: any) {
                console.error('Search error:', err);
                setError('Không thể tìm kiếm sản phẩm');
            } finally {
                setLoading(false);
            }
        };

        searchProducts();
    }, [keyword]);

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Đang tìm kiếm...
                        </h1>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 
                                    lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i}
                                className="bg-white rounded-lg 
                                            shadow-md p-4 
                                            animate-pulse">
                                <div className="aspect-square bg-gray-200 
                                                rounded-lg mb-4" />
                                <div className="h-4 bg-gray-200 
                                                rounded mb-2" />
                                <div className="h-4 bg-gray-200 
                                                rounded w-2/3" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-16">
                        <svg className="w-16 h-16 mx-auto text-red-500 mb-4"
                            fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 
                                     11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-900 
                                       mb-2">
                            Có lỗi xảy ra
                        </h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Link
                            to="/"
                            className="bg-blue-600 text-white px-6 py-2 
                                       rounded-lg hover:bg-blue-700 
                                       transition-colors"
                        >
                            Về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Kết quả tìm kiếm cho:
                        <span className="text-blue-600"> "{keyword}"</span>
                    </h1>
                    <p className="text-gray-600">
                        Tìm thấy {products.length} sản phẩm
                    </p>
                </div>

                {/* No Results */}
                {products.length === 0 ? (
                    <div className="text-center py-16 bg-white 
                                    rounded-lg shadow-sm">
                        <svg className="w-20 h-20 mx-auto text-gray-400 
                                        mb-4"
                            fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 
                                     7 7 0 0114 0z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-900 
                                       mb-2">
                            Không tìm thấy sản phẩm
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Không có kết quả phù hợp với từ khóa
                            <span className="font-semibold">
                                "{keyword}"
                            </span>
                        </p>
                        <div className="space-y-3 text-left max-w-md 
                                        mx-auto">
                            <p className="text-sm text-gray-600">
                                Gợi ý:
                            </p>
                            <ul className="list-disc list-inside text-sm 
                                           text-gray-600 space-y-1">
                                <li>Kiểm tra lại chính tả từ khóa</li>
                                <li>Thử sử dụng từ khóa chung chung hơn</li>
                                <li>Thử sử dụng từ khóa khác</li>
                            </ul>
                        </div>
                        <Link
                            to="/products"
                            className="inline-block mt-6 bg-blue-600 
                                       text-white px-6 py-2 rounded-lg 
                                       hover:bg-blue-700 
                                       transition-colors"
                        >
                            Xem tất cả sản phẩm
                        </Link>
                    </div>
                ) : (
                    /* Product Grid */
                    <div className="grid grid-cols-2 md:grid-cols-3 
                                    lg:grid-cols-4 xl:grid-cols-5 
                                    gap-4 md:gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                image={product.image_url}
                                stock={product.stock_quantity}
                                category={product.category?.name}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
