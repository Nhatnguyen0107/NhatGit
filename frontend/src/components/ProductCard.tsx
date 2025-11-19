import { Link, useNavigate } from 'react-router-dom';
import { authService } from '@/services';
import { formatPrice } from '@/utils/formatPrice';
import api from '@/services/api';
import { useState } from 'react';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image?: string;
    stock: number;
    category?: string;
}

const ProductCard = ({
    id,
    name,
    price,
    image,
    stock,
    category
}: ProductCardProps) => {
    const navigate = useNavigate();
    const isAuthenticated = authService.isAuthenticated();
    const [adding, setAdding] = useState(false);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
            navigate('/login');
            return;
        }

        try {
            setAdding(true);
            await api.post('/cart', {
                product_id: id,
                quantity: 1
            });
            alert('Đã thêm vào giỏ hàng thành công!');
        } catch (err: any) {
            console.error('Error adding to cart:', err);
            if (err.response?.status === 401) {
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
                navigate('/login');
            } else {
                alert(err.response?.data?.message || 'Không thể thêm vào giỏ hàng');
            }
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md 
                    overflow-hidden hover:shadow-xl 
                    transition-shadow duration-300 
                    flex flex-col h-full">
            {/* Image */}
            <Link to={`/products/${id}`} className="relative block">
                {stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 
                          flex items-center justify-center 
                          z-10">
                        <span className="bg-red-600 text-white 
                           px-4 py-2 rounded-lg 
                           font-semibold">
                            Hết hàng
                        </span>
                    </div>
                )}
                <img
                    src={
                        image
                            ? `http://localhost:3000${image}`
                            : 'https://via.placeholder.com/300x300?text=No+Image'
                    }
                    alt={name}
                    className="w-full h-64 object-contain bg-gray-50 
                     hover:scale-105 transition-transform 
                     duration-300"
                />
                {category && (
                    <span className="absolute top-2 left-2 
                         bg-blue-600 text-white 
                         px-3 py-1 rounded-full 
                         text-xs font-semibold">
                        {category}
                    </span>
                )}
            </Link>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
                <Link
                    to={`/products/${id}`}
                    className="hover:text-blue-600 transition-colors"
                >
                    <h3 className="text-lg font-semibold text-gray-800 
                         mb-2 line-clamp-2 h-14">
                        {name}
                    </h3>
                </Link>

                {/* Price */}
                <div className="mt-auto">
                    <div className="flex items-baseline space-x-2 mb-3">
                        <span className="text-2xl font-bold text-red-600">
                            {formatPrice(price)}
                        </span>
                    </div>

                    {/* Stock Info */}
                    <div className="flex items-center justify-between 
                          mb-3">
                        <span className={`text-sm font-semibold ${stock > 0
                            ? 'text-green-600'
                            : 'text-red-600'
                            }`}>
                            {stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                        <button
                            onClick={handleAddToCart}
                            disabled={stock === 0 || adding}
                            className="flex-1 bg-blue-600 
                         hover:bg-blue-700 
                         disabled:bg-gray-300 
                         disabled:cursor-not-allowed 
                         text-white px-4 py-2 rounded-lg 
                         font-semibold transition-colors 
                         flex items-center justify-center 
                         space-x-2"
                        >
                            {adding ? (
                                <>
                                    <svg className="animate-spin h-5 w-5"
                                        fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25"
                                            cx="12" cy="12" r="10"
                                            stroke="currentColor"
                                            strokeWidth="4" />
                                        <path className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Đang thêm...</span>
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                    <span>Thêm vào giỏ</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
