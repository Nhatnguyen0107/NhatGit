import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/utils/formatPrice';

interface ProductInfoProps {
    product: {
        id: string;
        name: string;
        price: number;
        discount_percentage: number;
        description: string;
        brand?: string;
        category_id: number;
        stock_quantity: number;
    };
    onAddToCart: (quantity: number) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
    product,
    onAddToCart
}) => {
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);

    const finalPrice = product.discount_percentage > 0
        ? product.price * (1 - product.discount_percentage / 100)
        : product.price;

    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= product.stock_quantity) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        onAddToCart(quantity);
    };

    const handleBuyNow = () => {
        onAddToCart(quantity);
        navigate('/cart');
    };

    return (
        <div className="space-y-6">
            {/* Product Name */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                </h1>
                {product.brand && (
                    <p className="text-sm text-gray-600">
                        Thương hiệu: <span className="font-medium">{product.brand}</span>
                    </p>
                )}
            </div>

            {/* Price */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-red-600">
                        {formatPrice(finalPrice)}
                    </span>
                    {product.discount_percentage > 0 && (
                        <>
                            <span className="text-xl text-gray-400 line-through">
                                {formatPrice(product.price)}
                            </span>
                            <span className="bg-red-100 text-red-600 px-3 py-1 
                rounded-full text-sm font-semibold">
                                -{product.discount_percentage}%
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Description */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h3>
                <p className="text-gray-700 leading-relaxed">
                    {product.description}
                </p>
            </div>

            {/* Stock Status */}
            <div>
                <h3 className="text-sm font-medium mb-2">Tình trạng</h3>
                {product.stock_quantity > 0 ? (
                    <span className="inline-flex items-center px-3 py-1 
              rounded-full text-sm font-medium bg-green-100 
              text-green-700">
                        <svg className="w-4 h-4 mr-1" fill="currentColor"
                            viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 
                  000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 
                  7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 
                  0l4-4z" clipRule="evenodd" />
                        </svg>
                        Còn hàng
                    </span>
                ) : (
                    <span className="inline-flex items-center px-3 py-1 
            rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <svg className="w-4 h-4 mr-1" fill="currentColor"
                            viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 
                000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 
                1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 
                001.414-1.414L11.414 10l1.293-1.293a1 1 0 
                00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Hết hàng
                    </span>
                )}
            </div>

            {/* Quantity Selector */}
            <div>
                <h3 className="text-sm font-medium mb-2">Số lượng</h3>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1 || product.stock_quantity === 0}
                        className="w-10 h-10 rounded-lg border-2 border-gray-300 
              flex items-center justify-center hover:bg-gray-100 
              disabled:opacity-50 disabled:cursor-not-allowed 
              transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2} d="M20 12H4" />
                        </svg>
                    </button>

                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            if (val >= 1 && val <= product.stock_quantity) {
                                setQuantity(val);
                            }
                        }}
                        className="w-20 h-10 text-center border-2 border-gray-300 
              rounded-lg font-semibold focus:outline-none 
              focus:border-blue-500"
                        min="1"
                        max={product.stock_quantity}
                        disabled={product.stock_quantity === 0}
                    />

                    <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock_quantity ||
                            product.stock_quantity === 0}
                        className="w-10 h-10 rounded-lg border-2 border-gray-300 
              flex items-center justify-center hover:bg-gray-100 
              disabled:opacity-50 disabled:cursor-not-allowed 
              transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity === 0}
                    className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg 
            font-semibold hover:bg-blue-600 disabled:bg-gray-300 
            disabled:cursor-not-allowed transition-colors shadow-md 
            hover:shadow-lg"
                >
                    Thêm vào giỏ
                </button>

                <button
                    onClick={handleBuyNow}
                    disabled={product.stock_quantity === 0}
                    className="flex-1 bg-orange-500 text-white py-3 px-6 
            rounded-lg font-semibold hover:bg-orange-600 
            disabled:bg-gray-300 disabled:cursor-not-allowed 
            transition-colors shadow-md hover:shadow-lg"
                >
                    Mua ngay
                </button>
            </div>
        </div>
    );
};

export default ProductInfo;
