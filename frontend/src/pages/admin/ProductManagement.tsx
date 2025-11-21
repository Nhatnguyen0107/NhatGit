import { useState, useEffect } from 'react';
import api from '@/services/api';
import { getImageUrl } from '@/utils/imageUrl';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    category_id: string;
    image_url: string;
    is_active: boolean;
    created_at: string;
    category?: {
        name: string;
    };
}

interface Category {
    id: string;
    name: string;
}

const ProductManagement = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] =
        useState<Product | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        stock_quantity: 0,
        category_id: '',
        is_active: true,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsRes, categoriesRes] = await Promise.all([
                api.get('/products'),
                api.get('/categories'),
            ]);

            // Backend trả về: { data: { products: [], pagination: {} } }
            const productsData = productsRes.data?.data?.products || [];
            // Backend trả về: { data: { categories: [], pagination: {} } }
            const categoriesData = categoriesRes.data?.data?.categories || [];

            setProducts(
                Array.isArray(productsData) ? productsData : []
            );
            setCategories(
                Array.isArray(categoriesData) ? categoriesData : []
            );
        } catch (err: any) {
            setError('Không thể tải dữ liệu');
            console.error('Fetch data error:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const getStatusBadgeColor = (product: Product) => {
        if (!product.is_active) return 'bg-gray-100 text-gray-800';
        return product.stock_quantity > 0
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    const getStatusLabel = (product: Product) => {
        if (!product.is_active) return 'Ngừng bán';
        return product.stock_quantity > 0 ? 'Còn hàng' : 'Hết hàng';
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter
            ? product.category_id === categoryFilter
            : true;
        return matchesSearch && matchesCategory;
    });

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setSelectedProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                stock_quantity: product.stock_quantity,
                category_id: product.category_id,
                is_active: product.is_active,
            });
        } else {
            setSelectedProduct(null);
            setFormData({
                name: '',
                description: '',
                price: 0,
                stock_quantity: 0,
                category_id: categories[0]?.id || '',
                is_active: true,
            });
        }
        setImageFile(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
        setImageFile(null);
        setFormData({
            name: '',
            description: '',
            price: 0,
            stock_quantity: 0,
            category_id: '',
            is_active: true,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('description', formData.description);
            submitData.append('price', formData.price.toString());
            submitData.append(
                'stock_quantity',
                formData.stock_quantity.toString()
            );
            submitData.append('category_id', formData.category_id);
            submitData.append('is_active', formData.is_active.toString());

            if (imageFile) {
                submitData.append('image', imageFile);
            }

            if (selectedProduct) {
                await api.put(
                    `/products/${selectedProduct.id}`,
                    submitData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
            } else {
                await api.post('/products', submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            fetchData();
            handleCloseModal();
        } catch (err: any) {
            alert(
                err.response?.data?.message ||
                'Có lỗi xảy ra khi lưu sản phẩm'
            );
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            return;
        }
        try {
            await api.delete(`/products/${id}`);
            fetchData();
        } catch (err: any) {
            alert(
                err.response?.data?.message ||
                'Có lỗi xảy ra khi xóa sản phẩm'
            );
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Quản lý sản phẩm
                </h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 text-white px-4 py-2 
                          rounded-lg hover:bg-blue-700 
                          transition-colors"
                >
                    + Thêm sản phẩm
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 
                          gap-4">
                    <div>
                        <label className="block text-sm font-medium 
                              text-gray-700 mb-2">
                            Tìm kiếm
                        </label>
                        <input
                            type="text"
                            placeholder="Tên sản phẩm..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                            className="w-full px-4 py-2 border 
                                  border-gray-300 rounded-lg 
                                  focus:ring-2 focus:ring-blue-500 
                                  focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium 
                              text-gray-700 mb-2">
                            Danh mục
                        </label>
                        <select
                            value={categoryFilter}
                            onChange={(e) =>
                                setCategoryFilter(e.target.value)
                            }
                            className="w-full px-4 py-2 border 
                                  border-gray-300 rounded-lg 
                                  focus:ring-2 focus:ring-blue-500 
                                  focus:border-transparent"
                        >
                            <option value="">Tất cả danh mục</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-md 
                      overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y 
                          divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left 
                                      text-xs font-medium 
                                      text-gray-500 uppercase 
                                      tracking-wider">
                                    STT
                                </th>
                                <th className="px-6 py-3 text-left 
                                      text-xs font-medium 
                                      text-gray-500 uppercase 
                                      tracking-wider">
                                    Hình ảnh
                                </th>
                                <th className="px-6 py-3 text-left 
                                      text-xs font-medium 
                                      text-gray-500 uppercase 
                                      tracking-wider">
                                    Tên sản phẩm
                                </th>
                                <th className="px-6 py-3 text-left 
                                      text-xs font-medium 
                                      text-gray-500 uppercase 
                                      tracking-wider">
                                    Mô tả
                                </th>
                                <th className="px-6 py-3 text-left 
                                      text-xs font-medium 
                                      text-gray-500 uppercase 
                                      tracking-wider">
                                    Danh mục
                                </th>
                                <th className="px-6 py-3 text-left 
                                      text-xs font-medium 
                                      text-gray-500 uppercase 
                                      tracking-wider">
                                    Giá
                                </th>
                                <th className="px-6 py-3 text-left 
                                      text-xs font-medium 
                                      text-gray-500 uppercase 
                                      tracking-wider">
                                    Tồn kho
                                </th>
                                <th className="px-6 py-3 text-left 
                                      text-xs font-medium 
                                      text-gray-500 uppercase 
                                      tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left 
                                      text-xs font-medium 
                                      text-gray-500 uppercase 
                                      tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y 
                              divide-gray-200">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="px-6 py-8 
                                          text-center 
                                          text-gray-500"
                                    >
                                        Không tìm thấy sản phẩm nào
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product, index) => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 
                                              whitespace-nowrap 
                                              text-sm 
                                              text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 
                                              whitespace-nowrap">
                                            <img
                                                src={getImageUrl(
                                                    product.image_url
                                                )}
                                                alt={product.name}
                                                className="w-16 h-16 
                                                  object-cover 
                                                  rounded-lg"
                                            />
                                        </td>
                                        <td className="px-6 py-4 
                                              whitespace-nowrap">
                                            <div className="text-sm 
                                                  text-gray-900 
                                                  font-medium">
                                                {product.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm 
                                                  text-gray-500 
                                                  max-w-md">
                                                {product.description || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 
                                              whitespace-nowrap 
                                              text-sm 
                                              text-gray-900">
                                            {product.category?.name ||
                                                'N/A'}
                                        </td>
                                        <td className="px-6 py-4 
                                              whitespace-nowrap 
                                              text-sm 
                                              text-gray-900 
                                              font-semibold">
                                            {formatPrice(product.price)}
                                        </td>
                                        <td className="px-6 py-4 
                                              whitespace-nowrap 
                                              text-sm 
                                              text-gray-900">
                                            {product.stock_quantity}
                                        </td>
                                        <td className="px-6 py-4 
                                              whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 
                                                  text-xs rounded-full 
                                                  font-medium 
                                                  ${getStatusBadgeColor(
                                                    product
                                                )}`}
                                            >
                                                {getStatusLabel(product)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 
                                              whitespace-nowrap 
                                              text-sm 
                                              font-medium">
                                            <button
                                                onClick={() =>
                                                    handleOpenModal(
                                                        product
                                                    )
                                                }
                                                className="text-blue-600 
                                                  hover:text-blue-900 
                                                  mr-3"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        product.id
                                                    )
                                                }
                                                className="text-red-600 
                                                  hover:text-red-900"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 
                          flex items-center justify-center 
                          z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-lg max-w-2xl 
                          w-full p-6 my-8">
                        <h2 className="text-xl font-semibold mb-4">
                            {selectedProduct
                                ? 'Chỉnh sửa sản phẩm'
                                : 'Thêm sản phẩm mới'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm 
                                          font-medium mb-1">
                                        Tên sản phẩm *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 
                                              border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm 
                                          font-medium mb-1">
                                        Mô tả *
                                    </label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description:
                                                    e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 
                                              border rounded-lg"
                                    />
                                </div>
                                <div className="grid grid-cols-2 
                                      gap-4">
                                    <div>
                                        <label className="block text-sm 
                                              font-medium mb-1">
                                            Giá *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={formData.price}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    price: parseFloat(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            className="w-full px-3 py-2 
                                                  border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm 
                                              font-medium mb-1">
                                            Số lượng *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={
                                                formData.stock_quantity
                                            }
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    stock_quantity:
                                                        parseInt(
                                                            e.target
                                                                .value
                                                        ),
                                                })
                                            }
                                            className="w-full px-3 py-2 
                                                  border rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm 
                                          font-medium mb-1">
                                        Danh mục *
                                    </label>
                                    <select
                                        required
                                        value={formData.category_id}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                category_id:
                                                    e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 
                                              border rounded-lg"
                                    >
                                        <option value="">
                                            Chọn danh mục
                                        </option>
                                        {categories.map((cat) => (
                                            <option
                                                key={cat.id}
                                                value={cat.id}
                                            >
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="flex items-center 
                                          space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    is_active: e.target.checked,
                                                })
                                            }
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-sm font-medium">
                                            Đang bán (Trạng thái hiển thị dựa trên 'Đang bán' và 'Số lượng tồn')
                                        </span>
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm 
                                          font-medium mb-1">
                                        Hình ảnh{' '}
                                        {selectedProduct &&
                                            '(Để trống nếu không đổi)'}
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setImageFile(
                                                e.target.files?.[0] ||
                                                null
                                            )
                                        }
                                        className="w-full px-3 py-2 
                                              border rounded-lg"
                                    />
                                    {selectedProduct?.image_url && (
                                        <img
                                            src={getImageUrl(
                                                selectedProduct.image_url
                                            )}
                                            alt="Current"
                                            className="mt-2 w-32 h-32 
                                              object-cover rounded"
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 
                                  mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 border 
                                          rounded-lg 
                                          hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 
                                          text-white rounded-lg 
                                          hover:bg-blue-700"
                                >
                                    {selectedProduct ? 'Cập nhật' : 'Thêm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
