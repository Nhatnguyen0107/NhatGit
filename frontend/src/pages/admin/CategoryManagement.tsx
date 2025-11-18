import { useState, useEffect } from 'react';
import api from '@/services/api';

interface Category {
    id: string;
    name: string;
    description: string;
    images: string[];
}

interface FormData {
    name: string;
    description: string;
    images: FileList | null;
}

const CategoryManagement = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] =
        useState<Category | null>(null);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        images: null,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get('/categories');
            setCategories(response.data.data || []);
        } catch (err: any) {
            setError('Không thể tải danh sách danh mục');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description || '',
                images: null,
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                description: '',
                images: null,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);

            if (formData.images) {
                Array.from(formData.images).forEach((file) => {
                    formDataToSend.append('images', file);
                });
            }

            if (editingCategory) {
                await api.put(
                    `/categories/${editingCategory.id}`,
                    formDataToSend,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    }
                );
            } else {
                await api.post('/categories', formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            handleCloseModal();
            fetchCategories();
        } catch (err: any) {
            alert(
                err.response?.data?.message ||
                'Có lỗi xảy ra'
            );
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa danh mục này?'))
            return;

        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (err: any) {
            alert('Không thể xóa danh mục');
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

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Quản lý danh mục
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
                    <span>Thêm danh mục</span>
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-400 
                        text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 
                      lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="bg-white rounded-lg shadow-md 
                       overflow-hidden hover:shadow-lg 
                       transition-shadow"
                    >
                        {category.images && category.images[0] ? (
                            <img
                                src={`http://localhost:3000${category.images[0]}`}
                                alt={category.name}
                                className="w-full h-48 object-cover"
                            />
                        ) : (
                            <div className="w-full h-48 bg-gray-200 
                              flex items-center justify-center">
                                <span className="text-gray-400">
                                    Không có hình ảnh
                                </span>
                            </div>
                        )}

                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 
                             mb-2">
                                {category.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4 
                            line-clamp-2">
                                {category.description || 'Không có mô tả'}
                            </p>

                            <div className="flex justify-between items-center 
                              pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => handleOpenModal(category)}
                                    className="text-blue-600 hover:text-blue-800 
                             text-sm font-medium"
                                >
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="text-red-600 hover:text-red-800 
                             text-sm font-medium"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {categories.length === 0 && !loading && (
                <div className="bg-white rounded-lg shadow-md p-12 
                        text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                        Chưa có danh mục nào
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Bắt đầu bằng cách tạo danh mục mới
                    </p>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 
                        flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[500px] 
                          max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {editingCategory
                                ? 'Chỉnh sửa danh mục'
                                : 'Thêm danh mục mới'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium 
                                  text-gray-700 mb-2">
                                    Tên danh mục
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

                            <div className="mb-4">
                                <label className="block text-sm font-medium 
                                  text-gray-700 mb-2">
                                    Mô tả
                                </label>
                                <textarea
                                    rows={3}
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
                                <p className="mt-1 text-xs text-gray-500">
                                    Chọn một hoặc nhiều hình ảnh cho danh mục
                                </p>
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
                                    {editingCategory ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;
