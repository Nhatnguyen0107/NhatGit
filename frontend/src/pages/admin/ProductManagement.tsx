import { useState, useEffect } from 'react';
import api from '@/services/api';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    category_id: string;
    stock: number;
    images: string[];
}

interface Category {
    id: string;
    name: string;
}

interface FormData {
    name: string;
    price: string;
    description: string;
    category_id: string;
    stock: string;
    images: FileList | null;
}

const ProductManagement = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] =
        useState<Product | null>(null);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        price: '',
        description: '',
        category_id: '',
        stock: '',
        images: null,
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
            setProducts(productsRes.data.data || []);
            setCategories(categoriesRes.data.data || []);
        } catch (err: any) {
            setError('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price.toString(),
                description: product.description,
                category_id: product.category_id,
                stock: product.stock.toString(),
                images: null,
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                price: '',
                description: '',
                category_id: categories[0]?.id || '',
                stock: '',
                images: null,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category_id', formData.category_id);
            formDataToSend.append('stock', formData.stock);

            if (formData.images) {
                Array.from(formData.images).forEach((file) => {
                    formDataToSend.append('images', file);
                });
            }

            if (editingProduct) {
                await api.put(
                    `/products/${editingProduct.id}`,
                    formDataToSend,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    }
                );
            } else {
                await api.post('/products', formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            handleCloseModal();
            fetchData();
        } catch (err: any) {
            alert(
                err.response?.data?.message ||
                'Có lỗi xảy ra'
            );
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa sản phẩm này?'))
            return;

        try {
            await api.delete(`/products/${id}`);
            fetchData();
        } catch (err: any) {
            alert('Không thể xóa sản phẩm');
        }
    };

    const getCategoryName = (categoryId: string) => {
        const category = categories.find((c) => c.id === categoryId);
        return category?.name || 'N/A';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 
                        border-b-2 border-blue-600"></div>
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
                    className="bg-blue-600 hover:bg-blue-700 
                     text-white px-4 py-2 rounded-lg 
                     flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Thêm sản phẩm</span>
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-400 
                        text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs 
                             font-medium text-gray-500 
                             uppercase tracking-wider">
                                Hình ảnh
                            </th>
                            <th className="px-6 py-3 text-left text-xs 
                             font-medium text-gray-500 
                             uppercase tracking-wider">
                                Tên sản phẩm
                            </th>
                            <th className="px-6 py-3 text-left text-xs 
                             font-medium text-gray-500 
                             uppercase tracking-wider">
                                Giá
                            </th>
                            <th className="px-6 py-3 text-left text-xs 
                             font-medium text-gray-500 
                             uppercase tracking-wider">
                                Danh mục
                            </th>
                            <th className="px-6 py-3 text-left text-xs 
                             font-medium text-gray-500 
                             uppercase tracking-wider">
                                Tồn kho
                            </th>
                            <th className="px-6 py-3 text-left text-xs 
                             font-medium text-gray-500 
                             uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {product.images && product.images[0] ? (
                                        <img
                                            src={`http://localhost:3000${product.images[0]}`}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-200 
                                    rounded flex items-center 
                                    justify-center">
                                            <span className="text-gray-400 text-xs">
                                                No img
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium 
                               text-gray-900">
                                    {product.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap 
                               text-sm text-gray-500">
                                    {product.price.toLocaleString('vi-VN')}₫
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap 
                               text-sm text-gray-500">
                                    {getCategoryName(product.category_id)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap 
                               text-sm text-gray-500">
                                    {product.stock}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap 
                               text-sm font-medium">
                                    <button
                                        onClick={() => handleOpenModal(product)}
                                        className="text-blue-600 hover:text-blue-900 
                               mr-4"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 
                        flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[600px] 
                          max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {editingProduct
                                ? 'Chỉnh sửa sản phẩm'
                                : 'Thêm sản phẩm mới'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium 
                                  text-gray-700 mb-2">
                                    Tên sản phẩm
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value
                                        })
                                    }
                                    className="w-full px-3 py-2 border 
                             border-gray-300 rounded-lg 
                             focus:outline-none 
                             focus:ring-2 
                             focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium 
                                    text-gray-700 mb-2">
                                        Giá
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                price: e.target.value
                                            })
                                        }
                                        className="w-full px-3 py-2 border 
                               border-gray-300 rounded-lg 
                               focus:outline-none 
                               focus:ring-2 
                               focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium 
                                    text-gray-700 mb-2">
                                        Tồn kho
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.stock}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                stock: e.target.value
                                            })
                                        }
                                        className="w-full px-3 py-2 border 
                               border-gray-300 rounded-lg 
                               focus:outline-none 
                               focus:ring-2 
                               focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium 
                                  text-gray-700 mb-2">
                                    Danh mục
                                </label>
                                <select
                                    required
                                    value={formData.category_id}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            category_id: e.target.value
                                        })
                                    }
                                    className="w-full px-3 py-2 border 
                             border-gray-300 rounded-lg 
                             focus:outline-none 
                             focus:ring-2 
                             focus:ring-blue-500"
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium 
                                  text-gray-700 mb-2">
                                    Mô tả
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value
                                        })
                                    }
                                    className="w-full px-3 py-2 border 
                             border-gray-300 rounded-lg 
                             focus:outline-none 
                             focus:ring-2 
                             focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium 
                                  text-gray-700 mb-2">
                                    Hình ảnh (có thể chọn nhiều)
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            images: e.target.files
                                        })
                                    }
                                    className="w-full px-3 py-2 border 
                             border-gray-300 rounded-lg 
                             focus:outline-none 
                             focus:ring-2 
                             focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 border border-gray-300 
                             rounded-lg text-gray-700 
                             hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 
                             hover:bg-blue-700 text-white 
                             rounded-lg"
                                >
                                    {editingProduct ? 'Cập nhật' : 'Thêm mới'}
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
