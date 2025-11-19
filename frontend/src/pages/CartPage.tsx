import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatPrice } from '@/utils/formatPrice';

interface CartItem {
    id: string;
    product_id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
        image_url: string;
        stock_quantity: number;
        discount_percentage: number;
    };
}

const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/cart');
            console.log('Cart data:', response.data);

            const items = response.data?.data?.items ||
                response.data?.items ||
                [];
            setCartItems(items);
        } catch (err: any) {
            console.error('Error fetching cart:', err);
            if (err.response?.status === 401) {
                navigate('/login');
            } else {
                setError('Không thể tải giỏ hàng');
            }
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        try {
            await api.put(`/cart/${itemId}`, { quantity: newQuantity });
            setCartItems(prev =>
                prev.map(item =>
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (err: any) {
            alert(err.response?.data?.message || 'Không thể cập nhật số lượng');
        }
    };

    const removeItem = async (itemId: string) => {
        if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

        try {
            await api.delete(`/cart/${itemId}`);
            setCartItems(prev => prev.filter(item => item.id !== itemId));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Không thể xóa sản phẩm');
        }
    };

    const clearCart = async () => {
        if (!confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) return;

        try {
            await api.delete('/cart');
            setCartItems([]);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Không thể xóa giỏ hàng');
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.product.discount_percentage > 0
                ? item.product.price * (1 - item.product.discount_percentage / 100)
                : item.product.price;
            return total + (price * item.quantity);
        }, 0);
    };

    const getImageUrl = (url: string) => {
        if (!url) return 'https://via.placeholder.com/100';
        if (url.startsWith('http')) return url;
        return `http://localhost:3000${url}`;
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-lg p-4 mb-4">
                            <div className="flex gap-4">
                                <div className="w-24 h-24 bg-gray-200 rounded" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="text-red-500 mb-4">{error}</div>
                <button
                    onClick={fetchCart}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg 
            hover:bg-blue-600"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <svg
                    className="w-24 h-24 mx-auto text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 
              2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 
              0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Giỏ hàng trống
                </h2>
                <p className="text-gray-600 mb-6">
                    Bạn chưa có sản phẩm nào trong giỏ hàng
                </p>
                <Link
                    to="/products"
                    className="inline-block bg-blue-500 text-white px-6 py-3 
            rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Giỏ hàng ({cartItems.length} sản phẩm)
                    </h1>
                    <button
                        onClick={clearCart}
                        className="text-red-500 hover:text-red-600 font-medium"
                    >
                        Xóa tất cả
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map(item => {
                            const finalPrice = item.product.discount_percentage > 0
                                ? item.product.price *
                                (1 - item.product.discount_percentage / 100)
                                : item.product.price;

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-lg shadow-sm p-4 
                    hover:shadow-md transition-shadow"
                                >
                                    <div className="flex gap-4">
                                        {/* Product Image */}
                                        <Link
                                            to={`/products/${item.product.id}`}
                                            className="flex-shrink-0"
                                        >
                                            <img
                                                src={getImageUrl(item.product.image_url)}
                                                alt={item.product.name}
                                                className="w-24 h-24 object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        'https://via.placeholder.com/100';
                                                }}
                                            />
                                        </Link>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                to={`/products/${item.product.id}`}
                                                className="font-semibold text-gray-900 
                          hover:text-blue-600 line-clamp-2"
                                            >
                                                {item.product.name}
                                            </Link>

                                            <div className="mt-2">
                                                {item.product.discount_percentage > 0 ? (
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-lg font-bold 
                              text-red-600">
                                                            {formatPrice(finalPrice)}
                                                        </span>
                                                        <span className="text-sm text-gray-400 
                              line-through">
                                                            {formatPrice(item.product.price)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-lg font-bold 
                            text-gray-900">
                                                        {formatPrice(item.product.price)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-4 mt-3">
                                                <div className="flex items-center border 
                          rounded-lg">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="px-3 py-1 hover:bg-gray-100 
                              disabled:opacity-50 
                              disabled:cursor-not-allowed"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="px-4 py-1 border-x">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(item.id, item.quantity + 1)}
                                                        disabled={
                                                            item.quantity >=
                                                            item.product.stock_quantity
                                                        }
                                                        className="px-3 py-1 hover:bg-gray-100 
                              disabled:opacity-50 
                              disabled:cursor-not-allowed"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-500 hover:text-red-600 
                            text-sm font-medium"
                                                >
                                                    Xóa
                                                </button>
                                            </div>

                                            {/* Stock Warning */}
                                            {item.quantity >= item.product.stock_quantity && (
                                                <p className="text-sm text-orange-500 mt-2">
                                                    Đã đạt số lượng tối đa trong kho
                                                </p>
                                            )}
                                        </div>

                                        {/* Subtotal */}
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-gray-900">
                                                {formatPrice(finalPrice * item.quantity)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky 
              top-4">
                            <h2 className="text-xl font-bold mb-4">
                                Tóm tắt đơn hàng
                            </h2>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính</span>
                                    <span>{formatPrice(calculateTotal())}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Phí vận chuyển</span>
                                    <span className="text-green-600">Miễn phí</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between 
                  text-lg font-bold">
                                    <span>Tổng cộng</span>
                                    <span className="text-red-600">
                                        {formatPrice(calculateTotal())}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-orange-500 text-white py-3 
                  rounded-lg font-semibold hover:bg-orange-600 
                  transition-colors shadow-md hover:shadow-lg"
                            >
                                Tiến hành thanh toán
                            </button>

                            <Link
                                to="/products"
                                className="block text-center text-blue-600 
                  hover:text-blue-700 mt-4 font-medium"
                            >
                                ← Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
