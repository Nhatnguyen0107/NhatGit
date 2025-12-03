import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatPrice } from '@/utils/formatPrice';
import { paymentService } from '../services/payment.service';

interface CartItem {
    id: string;
    product_id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
        image_url: string;
        discount_percentage: number;
    };
}

interface CheckoutFormData {
    shipping_address: string;
    phone: string;
    notes?: string;
    payment_method: 'cod' | 'payos' | 'vnpay';
}

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<CheckoutFormData>({
        shipping_address: '',
        phone: '',
        notes: '',
        payment_method: 'cod'
    });

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await api.get('/cart');
            const items = response.data?.data?.items ||
                response.data?.items ||
                [];

            if (items.length === 0) {
                alert('Giỏ hàng trống!');
                navigate('/cart');
                return;
            }

            setCartItems(items);
        } catch (err: any) {
            console.error('Error fetching cart:', err);
            if (err.response?.status === 401) {
                navigate('/login');
            } else {
                alert('Không thể tải giỏ hàng');
                navigate('/cart');
            }
        } finally {
            setLoading(false);
        }
    };

    const calculateSubtotal = () => {
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

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.shipping_address.trim()) {
            alert('Vui lòng nhập địa chỉ giao hàng');
            return;
        }

        if (!formData.phone.trim()) {
            alert('Vui lòng nhập số điện thoại');
            return;
        }

        try {
            setSubmitting(true);

            // Tạo order
            const orderData = {
                shipping_address: formData.shipping_address,
                phone: formData.phone,
                notes: formData.notes || undefined,
                items: cartItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.product.discount_percentage > 0
                        ? item.product.price *
                        (1 - item.product.discount_percentage / 100)
                        : item.product.price
                }))
            };

            console.log('Creating order:', orderData);

            const response = await api.post('/orders', orderData);
            const orderId = response.data?.data?.order?.id ||
                response.data?.data?.id;
            const orderAmount = response.data?.data?.order?.total_amount ||
                response.data?.data?.total_amount ||
                0;

            console.log('Order created:', response.data);

            // Xử lý thanh toán theo phương thức đã chọn
            if (formData.payment_method === 'cod') {
                // COD - chỉ cần xóa giỏ hàng và chuyển đến order
                await api.delete('/cart');
                alert('Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.');
                navigate(`/orders/${orderId}`);
            } else if (formData.payment_method === 'payos') {
                // PayOS - tạo payment và chuyển hướng
                try {
                    const paymentData = await paymentService.createPayOSPayment({
                        orderId: orderId,
                        amount: orderAmount,
                        description: `Thanh toan don hang ${orderId}`
                    });

                    if (paymentData.checkoutUrl) {
                        // Xóa giỏ hàng trước khi chuyển
                        await api.delete('/cart');
                        // Chuyển hướng đến PayOS
                        window.location.href = paymentData.checkoutUrl;
                    } else {
                        throw new Error('Không nhận được URL thanh toán từ PayOS');
                    }
                } catch (paymentError: any) {
                    console.error('PayOS payment error:', paymentError);
                    alert('Không thể tạo thanh toán PayOS. Vui lòng thử lại.');
                }
            } else if (formData.payment_method === 'vnpay') {
                // VNPay - tạo payment và chuyển hướng
                try {
                    const paymentData = await paymentService.createVNPayPayment({
                        orderId: orderId,
                        amount: orderAmount,
                        description: `Thanh toan don hang ${orderId}`
                    });

                    if (paymentData.checkoutUrl) {
                        // Xóa giỏ hàng trước khi chuyển
                        await api.delete('/cart');
                        // Chuyển hướng đến VNPay
                        window.location.href = paymentData.checkoutUrl;
                    } else {
                        throw new Error('Không nhận được URL thanh toán từ VNPay');
                    }
                } catch (paymentError: any) {
                    console.error('VNPay payment error:', paymentError);
                    alert('Không thể tạo thanh toán VNPay. Vui lòng thử lại.');
                }
            }

        } catch (err: any) {
            console.error('Checkout error:', err);
            alert(
                err.response?.data?.message ||
                'Không thể tạo đơn hàng. Vui lòng thử lại!'
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="h-64 bg-gray-200 rounded" />
                        </div>
                        <div className="h-96 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    const subtotal = calculateSubtotal();
    const shippingFee = 0; // Miễn phí ship
    const total = subtotal + shippingFee;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Thanh toán
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping Information */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-4">
                                    Thông tin giao hàng
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium 
                      text-gray-700 mb-2">
                                            Địa chỉ giao hàng
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="shipping_address"
                                            value={formData.shipping_address}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, 
                        tỉnh/thành phố"
                                            className="w-full px-4 py-2 border border-gray-300 
                        rounded-lg focus:outline-none focus:ring-2 
                        focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium 
                      text-gray-700 mb-2">
                                            Số điện thoại
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Nhập số điện thoại"
                                            className="w-full px-4 py-2 border border-gray-300 
                        rounded-lg focus:outline-none focus:ring-2 
                        focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium 
                      text-gray-700 mb-2">
                                            Ghi chú (tùy chọn)
                                        </label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            rows={3}
                                            placeholder="Ghi chú về đơn hàng, ví dụ: thời gian 
                        hay chỉ dẫn địa điểm giao hàng chi tiết hơn"
                                            className="w-full px-4 py-2 border border-gray-300 
                        rounded-lg focus:outline-none focus:ring-2 
                        focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-4">
                                    Phương thức thanh toán
                                </h2>

                                <div className="space-y-3">
                                    <label className={`flex items-center p-4 border-2 
                                        rounded-lg cursor-pointer transition-colors ${formData.payment_method === 'cod'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="cod"
                                            checked={formData.payment_method === 'cod'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <div className="ml-3">
                                            <div className="font-semibold text-gray-900">
                                                💵 Thanh toán khi nhận hàng (COD)
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Thanh toán bằng tiền mặt khi nhận hàng
                                            </div>
                                        </div>
                                    </label>

                                    <label className={`flex items-center p-4 border-2 
                                        rounded-lg cursor-pointer transition-colors ${formData.payment_method === 'payos'
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="payos"
                                            checked={formData.payment_method === 'payos'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-purple-600"
                                        />
                                        <div className="ml-3">
                                            <div className="font-semibold text-gray-900">
                                                🏦 Thanh toán PayOS
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Thanh toán online qua Ngân hàng
                                                {formData.payment_method === 'payos' && (
                                                    <div className="text-xs text-purple-600 mt-1">
                                                        Nhanh chóng, an toàn và tiện lợi
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </label>

                                    <label className={`flex items-center p-4 border-2 
                                        rounded-lg cursor-pointer transition-colors ${formData.payment_method === 'vnpay'
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="vnpay"
                                            checked={formData.payment_method === 'vnpay'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-red-600"
                                        />
                                        <div className="ml-3">
                                            <div className="font-semibold text-gray-900">
                                                💳 Thanh toán VNPay
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Thanh toán qua ví điện tử VNPay
                                                {formData.payment_method === 'vnpay' && (
                                                    <div className="text-xs text-red-600 mt-1">
                                                        Hỗ trợ thẻ ATM, QR Code
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky 
                top-4">
                                <h2 className="text-xl font-bold mb-4">
                                    Đơn hàng ({cartItems.length} sản phẩm)
                                </h2>

                                {/* Cart Items */}
                                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                    {cartItems.map(item => {
                                        const finalPrice = item.product.discount_percentage > 0
                                            ? item.product.price *
                                            (1 - item.product.discount_percentage / 100)
                                            : item.product.price;

                                        return (
                                            <div key={item.id} className="flex gap-3">
                                                <img
                                                    src={getImageUrl(item.product.image_url)}
                                                    alt={item.product.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                    onError={(e) => {
                                                        e.currentTarget.src =
                                                            'https://via.placeholder.com/64';
                                                    }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 
                            line-clamp-2">
                                                        {item.product.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {formatPrice(finalPrice)} x {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="text-sm font-semibold 
                          text-gray-900">
                                                    {formatPrice(finalPrice * item.quantity)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Price Summary */}
                                <div className="border-t pt-4 space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tạm tính</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Phí vận chuyển</span>
                                        <span className="text-green-600">Miễn phí</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between 
                    text-lg font-bold">
                                        <span>Tổng cộng</span>
                                        <span className="text-red-600">
                                            {formatPrice(total)}
                                        </span>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full mt-6 bg-orange-500 text-white py-3 
                    rounded-lg font-semibold hover:bg-orange-600 
                    disabled:bg-gray-300 disabled:cursor-not-allowed 
                    transition-colors shadow-md hover:shadow-lg"
                                >
                                    {submitting ? 'Đang xử lý...' : 'Đặt hàng'}
                                </button>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    Bằng việc tiến hành đặt hàng, bạn đồng ý với{' '}
                                    <a href="#" className="text-blue-600 hover:underline">
                                        Điều khoản dịch vụ
                                    </a>
                                    {' '}của chúng tôi
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
