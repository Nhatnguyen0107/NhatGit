import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface Product {
    id: string;
    name: string;
    price: number;
    discount_percentage: number;
    image_url: string;
    stock_quantity: number;
}

interface RelatedProductsProps {
    categoryId: number;
    currentProductId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
    categoryId,
    currentProductId
}) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRelatedProducts();
    }, [categoryId]);

    const fetchRelatedProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get(
                `/products?category=${categoryId}&limit=4`
            );
            const allProducts = response.data?.data?.products ||
                response.data?.data ||
                response.data || [];

            // Lọc bỏ sản phẩm hiện tại
            const filtered = allProducts
                .filter((p: Product) => p.id !== currentProductId)
                .slice(0, 4);

            setProducts(filtered);
        } catch (error) {
            console.error('Error fetching related products:', error);
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

    if (loading) {
        return (
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 aspect-square rounded-lg mb-3" />
                            <div className="h-4 bg-gray-200 rounded mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return null;
    }

    const getImageUrl = (url: string) => {
        if (!url) return 'https://via.placeholder.com/300';
        if (url.startsWith('http')) return url;
        return `http://localhost:3000${url}`;
    };

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product) => {
                    const finalPrice = product.discount_percentage > 0
                        ? product.price * (1 - product.discount_percentage / 100)
                        : product.price;

                    return (
                        <Link
                            key={product.id}
                            to={`/products/${product.id}`}
                            className="group bg-white rounded-lg shadow-sm 
                hover:shadow-md transition-shadow overflow-hidden"
                        >
                            {/* Product Image */}
                            <div className="aspect-square bg-gray-100 relative 
                overflow-hidden">
                                <img
                                    src={getImageUrl(product.image_url)}
                                    alt={product.name}
                                    className="w-full h-full object-cover 
                    group-hover:scale-105 transition-transform 
                    duration-300"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            'https://via.placeholder.com/300';
                                    }}
                                />

                                {/* Discount Badge */}
                                {product.discount_percentage > 0 && (
                                    <div className="absolute top-2 right-2 bg-red-500 
                    text-white px-2 py-1 rounded-full text-xs 
                    font-bold">
                                        -{product.discount_percentage}%
                                    </div>
                                )}

                                {/* Out of Stock Overlay */}
                                {product.stock_quantity === 0 && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 
                    flex items-center justify-center">
                                        <span className="bg-white px-3 py-1 rounded text-sm 
                      font-semibold text-gray-800">
                                            Hết hàng
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-3">
                                <h3 className="font-medium text-sm text-gray-800 
                  line-clamp-2 mb-2 group-hover:text-blue-600 
                  transition-colors">
                                    {product.name}
                                </h3>

                                <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-bold text-red-600">
                                        {formatPrice(finalPrice)}
                                    </span>
                                    {product.discount_percentage > 0 && (
                                        <span className="text-xs text-gray-400 line-through">
                                            {formatPrice(product.price)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default RelatedProducts;
