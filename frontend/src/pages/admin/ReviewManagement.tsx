import { useState, useEffect } from 'react';
import api from '@/services/api';
import { getImageUrl } from '@/utils/imageUrl';

interface Review {
    id: string;
    product_id: string;
    customer_id: string;
    rating: number;
    comment: string;
    is_verified_purchase: boolean;
    is_visible: boolean;
    helpful_count: number;
    created_at: string;
    product: {
        id: string;
        name: string;
        image_url: string;
    };
    customer: {
        first_name: string;
        last_name: string;
        user: {
            username: string;
            email: string;
            avatar: string | null;
        };
    };
}

const ReviewManagement = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterRating, setFilterRating] = useState('');
    const [filterVisible, setFilterVisible] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await api.get('/reviews');
            const data = response.data.data;
            setReviews(data.reviews || []);
        } catch (err: any) {
            setError('Không thể tải danh sách đánh giá');
            console.error('Fetch reviews error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleVisibility = async (id: string) => {
        try {
            await api.patch(`/reviews/${id}/toggle-visibility`);
            fetchReviews();
        } catch (err: any) {
            alert(err.response?.data?.message ||
                'Có lỗi xảy ra khi cập nhật trạng thái');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) {
            return;
        }
        try {
            await api.delete(`/reviews/${id}`);
            fetchReviews();
        } catch (err: any) {
            alert(err.response?.data?.message ||
                'Có lỗi xảy ra khi xóa đánh giá');
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-5 h-5 ${star <= rating
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 
                                1.902 0l1.07 3.292a1 1 0 
                                00.95.69h3.462c.969 0 1.371 1.24.588 
                                1.81l-2.8 2.034a1 1 0 00-.364 
                                1.118l1.07 3.292c.3.921-.755 
                                1.688-1.54 1.118l-2.8-2.034a1 1 0 
                                00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 
                                1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 
                                1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                    ({rating}/5)
                </span>
            </div>
        );
    };

    const filteredReviews = reviews.filter((review) => {
        const matchesSearch =
            review.product.name.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            review.customer.user.username.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            review.comment?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesRating =
            !filterRating ||
            review.rating === parseInt(filterRating);

        const matchesVisible =
            filterVisible === '' ||
            (filterVisible === 'true' && review.is_visible) ||
            (filterVisible === 'false' && !review.is_visible);

        return matchesSearch && matchesRating && matchesVisible;
    });

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
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Quản lý đánh giá sản phẩm
                </h1>
                <div className="text-sm text-gray-600">
                    Tổng số: {reviews.length} đánh giá
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo sản phẩm, 
                            khách hàng, nội dung..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-300 
                            rounded-lg focus:ring-2 
                            focus:ring-blue-500 focus:border-blue-500"
                    />

                    <select
                        value={filterRating}
                        onChange={(e) => setFilterRating(e.target.value)}
                        className="px-4 py-2 border border-gray-300 
                            rounded-lg focus:ring-2 
                            focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Tất cả đánh giá</option>
                        <option value="5">5 sao</option>
                        <option value="4">4 sao</option>
                        <option value="3">3 sao</option>
                        <option value="2">2 sao</option>
                        <option value="1">1 sao</option>
                    </select>

                    <select
                        value={filterVisible}
                        onChange={(e) => setFilterVisible(e.target.value)}
                        className="px-4 py-2 border border-gray-300 
                            rounded-lg focus:ring-2 
                            focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="true">Hiển thị</option>
                        <option value="false">Ẩn</option>
                    </select>
                </div>
            </div>

            {/* Reviews List */}
            <div className="bg-white rounded-lg shadow-md">
                {filteredReviews.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            Không tìm thấy đánh giá nào
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredReviews.map((review) => (
                            <div key={review.id} className="p-6">
                                <div className="flex items-start 
                                        justify-between">
                                    <div className="flex items-start 
                                            space-x-4 flex-1">
                                        {/* Product Image */}
                                        <img
                                            src={getImageUrl(
                                                review.product.image_url
                                            )}
                                            alt={review.product.name}
                                            className="w-20 h-20 rounded 
                                                object-cover"
                                        />

                                        {/* Review Content */}
                                        <div className="flex-1">
                                            <div className="flex items-center 
                                                    space-x-2 mb-2">
                                                <h3 className="font-semibold 
                                                        text-gray-900">
                                                    {review.product.name}
                                                </h3>
                                                {review.is_verified_purchase && (
                                                    <span className="px-2 py-1 
                                                            text-xs 
                                                            bg-green-100 
                                                            text-green-800 
                                                            rounded-full">
                                                        ✓ Đã mua hàng
                                                    </span>
                                                )}
                                            </div>

                                            {renderStars(review.rating)}

                                            <div className="mt-2 
                                                    text-sm text-gray-600">
                                                <span className="font-medium">
                                                    {review.customer.user.username}
                                                </span>
                                                {' • '}
                                                <span>
                                                    {new Date(
                                                        review.created_at
                                                    ).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>

                                            {review.comment && (
                                                <p className="mt-3 
                                                        text-gray-700">
                                                    {review.comment}
                                                </p>
                                            )}

                                            <div className="mt-3 flex 
                                                    items-center space-x-4 
                                                    text-sm text-gray-500">
                                                <span>
                                                    👍 {review.helpful_count}
                                                    người thấy hữu ích
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center 
                                            space-x-2 ml-4">
                                        <button
                                            onClick={() =>
                                                handleToggleVisibility(
                                                    review.id
                                                )
                                            }
                                            className={`px-3 py-1 text-sm 
                                                rounded-lg 
                                                ${review.is_visible
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {review.is_visible
                                                ? '👁️ Hiển thị'
                                                : '🚫 Ẩn'}
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(review.id)
                                            }
                                            className="px-3 py-1 text-sm 
                                                bg-red-100 text-red-700 
                                                rounded-lg hover:bg-red-200"
                                        >
                                            🗑️ Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewManagement;
