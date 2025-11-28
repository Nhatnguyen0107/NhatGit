import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Review {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    is_verified_purchase: boolean;
    user: string;
    avatar?: string;
}

interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    ratingCounts: { [key: number]: number };
}

const ProductReviews = ({ productId }: { productId: string }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<ReviewStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    useEffect(() => {
        const fetchReviewsAndCheckUser = async () => {
            try {
                setLoading(true);
                setHasReviewed(false);
                setIsAuthenticated(false);
                setError('');

                // Clear previous data to avoid showing wrong reviews
                setReviews([]);
                setStats(null);

                console.log(`Fetching reviews for product: ${productId}`);

                // Use the new API endpoint from document specification
                const res = await api.get(`/products/${productId}/reviews`);
                const data = res.data.data;

                console.log('Reviews data received:', data);

                setReviews(data.reviews || []);
                setStats({
                    averageRating: data.averageRating || 0,
                    totalReviews: data.totalReviews || 0,
                    ratingCounts: data.ratingCounts || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                });

                // Check authentication and user review status
                const token = localStorage.getItem('token');
                if (token) {
                    setIsAuthenticated(true);
                    try {
                        // Use dedicated API to check if user has reviewed this product
                        const checkRes = await api.get(`/reviews/check/${productId}`);
                        setHasReviewed(checkRes.data.data.hasReviewed);
                        console.log(`User review status for product ${productId}:`, checkRes.data.data.hasReviewed);
                    } catch (checkErr: any) {
                        // If check fails (e.g., user not found), assume not reviewed
                        console.warn('Could not check review status:', checkErr);
                        setHasReviewed(false);
                    }
                }
            } catch (err: any) {
                console.error('Error fetching reviews:', err);
                setError('Không thể tải đánh giá');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchReviewsAndCheckUser();
        }
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            alert('Bạn cần đăng nhập để đánh giá sản phẩm');
            return;
        }
        if (hasReviewed) {
            alert('Bạn đã đánh giá sản phẩm này!');
            return;
        }
        if (rating < 1 || rating > 5) {
            alert('Số sao phải từ 1 đến 5');
            return;
        }
        if (!comment.trim()) {
            alert('Nội dung đánh giá không được để trống');
            return;
        }
        if (comment.trim().length < 10) {
            alert('Nội dung đánh giá phải có ít nhất 10 ký tự');
            return;
        }
        if (comment.trim().length > 1000) {
            alert('Nội dung đánh giá không được vượt quá 1000 ký tự');
            return;
        }

        setSubmitting(true);
        try {
            // Only send product_id, rating, and comment - backend will handle customer_id
            await api.post('/reviews', {
                product_id: productId,
                rating,
                comment
            });

            setComment('');
            setRating(5);
            setHasReviewed(true);
            setShowReviewForm(false);

            // Reload reviews for current product only
            console.log(`Reloading reviews for product: ${productId}`);
            const res = await api.get(`/products/${productId}/reviews`);
            const data = res.data.data;

            console.log('Updated reviews data:', data);
            setReviews(data.reviews || []);
            setStats({
                averageRating: data.averageRating || 0,
                totalReviews: data.totalReviews || 0,
                ratingCounts: data.ratingCounts || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            });

            alert('Đánh giá của bạn đã được gửi thành công!');
        } catch (err: any) {
            console.error('Error submitting review:', err);
            alert(err.response?.data?.message || 'Không thể gửi đánh giá');
        } finally {
            setSubmitting(false);
        }
    };

    const StarRating = ({ rating: starRating, size = 'text-base', interactive = false, onRatingChange }: {
        rating: number;
        size?: string;
        interactive?: boolean;
        onRatingChange?: (rating: number) => void;
    }) => {
        return (
            <div className={`flex items-center ${size}`}>
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        type="button"
                        className={`${star <= starRating ? 'text-yellow-400' : 'text-gray-300'} 
                            ${interactive ? 'hover:text-yellow-400 cursor-pointer' : 'cursor-default'}
                            transition-colors duration-150`}
                        onClick={() => interactive && onRatingChange && onRatingChange(star)}
                        disabled={!interactive}
                    >
                        ★
                    </button>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="text-red-500 text-center">{error}</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Đánh giá sản phẩm</h3>

            {/* Review Stats */}
            {stats && (
                <div className="border-b border-gray-200 pb-6 mb-6">
                    <div className="flex items-start gap-8">
                        {/* Average Rating */}
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900 mb-1">
                                {stats.averageRating.toFixed(1)}
                            </div>
                            <StarRating rating={stats.averageRating} size="text-lg" />
                            <div className="text-sm text-gray-600 mt-1">
                                {stats.totalReviews} đánh giá
                            </div>
                        </div>

                        {/* Rating Distribution */}
                        <div className="flex-1 max-w-md">
                            {[5, 4, 3, 2, 1].map(star => {
                                const count = stats.ratingCounts[star] || 0;
                                const percentage = stats.totalReviews > 0
                                    ? (count / stats.totalReviews * 100)
                                    : 0;

                                return (
                                    <div key={star} className="flex items-center gap-3 mb-2">
                                        <span className="text-sm font-medium text-gray-700 w-8">
                                            {star} ⭐
                                        </span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-yellow-400 h-2.5 rounded-full transition-all duration-300"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 w-12 text-right">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Write Review Button/Form */}
            {isAuthenticated && !hasReviewed && (
                <div className="mb-6">
                    {!showReviewForm ? (
                        <button
                            onClick={() => setShowReviewForm(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-150 shadow-sm"
                        >
                            Viết đánh giá
                        </button>
                    ) : (
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h4 className="font-semibold text-gray-900 mb-4">Viết đánh giá của bạn</h4>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Đánh giá của bạn
                                    </label>
                                    <StarRating
                                        rating={rating}
                                        size="text-2xl"
                                        interactive
                                        onRatingChange={setRating}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nhận xét
                                    </label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        rows={4}
                                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-150"
                                    >
                                        {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowReviewForm(false);
                                            setComment('');
                                            setRating(5);
                                        }}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-150"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}

            {/* Status Messages */}
            {!isAuthenticated && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800">
                        <span className="font-medium">Đăng nhập</span> để viết đánh giá sản phẩm
                    </p>
                </div>
            )}

            {hasReviewed && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800">
                        ✓ Bạn đã đánh giá sản phẩm này
                    </p>
                </div>
            )}

            {/* Reviews List */}
            <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                    Tất cả đánh giá ({stats?.totalReviews || 0})
                </h4>

                {reviews.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <div className="mb-4">
                            <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.003-4.034c-.106-.169-.106-.361 0-.53A8.001 8.001 0 0113 4c4.418 0 8 3.582 8 8z" />
                            </svg>
                        </div>
                        <p>Chưa có đánh giá nào cho sản phẩm này</p>
                        <p className="text-sm">Hãy là người đầu tiên đánh giá!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                            {review.avatar ? (
                                                <img
                                                    src={
                                                        review.avatar.startsWith('http')
                                                            ? review.avatar
                                                            : `${import.meta.env.VITE_API_URL}${review.avatar}`
                                                    }
                                                    alt={`Avatar của ${review.user}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.currentTarget;
                                                        target.style.display = 'none';
                                                        target.parentElement!.innerHTML = `
                                                            <div class="w-full h-full bg-blue-500 text-white font-medium text-sm flex items-center justify-center">
                                                                ${review.user.charAt(0).toUpperCase()}
                                                            </div>
                                                        `;
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-blue-500 text-white font-medium text-sm flex items-center justify-center">
                                                    {review.user.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Review Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-medium text-gray-900">{review.user}</span>
                                            {review.is_verified_purchase && (
                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                    ✓ Đã mua hàng
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 mb-3">
                                            <StarRating rating={review.rating} size="text-sm" />
                                            <span className="text-sm text-gray-500">
                                                {new Date(review.created_at).toLocaleDateString('vi-VN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
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

export default ProductReviews;
