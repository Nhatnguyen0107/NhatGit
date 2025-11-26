import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductImages from '../components/ProductImages';
import ProductInfo from '../components/ProductInfo';
import RelatedProducts from '../components/RelatedProducts';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discount_percentage: number;
    stock_quantity: number;
    image_url: string;
    additional_images?: string[];
    category_id: number;
    brand?: string;
}

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/products/${id}`);
            console.log('Product loaded:', response.data);

            // Backend trả về: { success, data: { product } }
            const productData = response.data?.data?.product ||
                response.data?.data ||
                response.data;

            console.log('Parsed product:', productData);
            setProduct(productData);
        } catch (err: any) {
            console.error('Error loading product:', err);
            setError(err.response?.data?.message || 'Không thể tải sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (quantity: number) => {
        try {
            await api.post('/cart', {
                product_id: product?.id,
                quantity
            });
            alert('Đã thêm vào giỏ hàng thành công!');
        } catch (err: any) {
            if (err.response?.status === 401) {
                alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
                navigate('/login');
            } else {
                alert(err.response?.data?.message || 'Không thể thêm vào giỏ hàng');
            }
        }
    };

    const handleRetry = () => {
        fetchProduct();
    };

    // Skeleton Loader Component
    const SkeletonLoader = () => (
        <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
                {/* Breadcrumb skeleton */}
                <div className="h-4 bg-gray-200 rounded w-64 mb-8" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image skeleton */}
                    <div>
                        <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                        <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-square bg-gray-200 rounded" />
                            ))}
                        </div>
                    </div>

                    {/* Info skeleton */}
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-3/4" />
                        <div className="h-6 bg-gray-200 rounded w-1/4" />
                        <div className="h-10 bg-gray-200 rounded w-1/2" />
                        <div className="h-20 bg-gray-200 rounded" />
                        <div className="h-12 bg-gray-200 rounded w-32" />
                        <div className="h-12 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );

    // Error State Component
    const ErrorState = () => (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto text-center">
                <div className="mb-6">
                    <svg className="w-20 h-20 mx-auto text-red-500" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 
                            0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Không thể tải sản phẩm
                </h2>
                <p className="text-gray-600 mb-6">
                    {error || 'Đã xảy ra lỗi khi tải thông tin sản phẩm'}
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={handleRetry}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg 
                            hover:bg-blue-600 transition-colors"
                    >
                        Thử lại
                    </button>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg 
                            hover:bg-gray-300 transition-colors"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return <SkeletonLoader />;
    }

    if (error || !product) {
        return <ErrorState />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm">
                    <ol className="flex items-center space-x-2 text-gray-600">
                        <li>
                            <a href="/" className="hover:text-blue-600">
                                Trang chủ
                            </a>
                        </li>
                        <li>/</li>
                        <li>
                            <a href="/products" className="hover:text-blue-600">
                                Sản phẩm
                            </a>
                        </li>
                        <li>/</li>
                        <li className="text-gray-900 font-medium">
                            {product.name}
                        </li>
                    </ol>
                </nav>

                {/* Main Product Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Product Images */}
                        <ProductImages
                            mainImage={product.image_url}
                            additionalImages={product.additional_images}
                            productName={product.name}
                        />

                        {/* Product Info */}
                        <ProductInfo
                            product={product}
                            onAddToCart={handleAddToCart}
                        />
                    </div>
                </div>

                {/* Related Products */}
                <RelatedProducts
                    categoryId={product.category_id}
                    currentProductId={product.id}
                />
            </div>
        </div>
    );
};

export default ProductDetailPage;