import { useState, useEffect } from 'react';
import api from '@/services/api';
import { getImageUrl } from '@/utils/imageUrl';
import Pagination from '@/components/admin/Pagination';

interface Category {
    id: string;
    name: string;
    description: string;
    image_url: string;
    created_at: string;
}

const CategoryManagement = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] =
        useState<Category | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        fetchCategories();
    }, [currentPage, searchTerm, itemsPerPage]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: itemsPerPage.toString(),
                search: searchTerm
            });
            const response = await api.get(`/categories?${params}`);
            const data = response.data?.data || {};
            setCategories(data.categories || []);
            if (data.pagination) {
                setTotalPages(data.pagination.totalPages);
                setTotal(data.pagination.total);
            }
        } catch (err: any) {
            setError('Không thể tải danh sách danh mục');
            console.error('Fetch categories error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setSelectedCategory(category);
            setFormData({
                name: category.name,
                description: category.description,
            });
        } else {
            setSelectedCategory(null);
            setFormData({
                name: '',
                description: '',
            });
        }
        setImageFile(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCategory(null);
        setImageFile(null);
        setFormData({
            name: '',
            description: '',
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('description', formData.description);

            if (imageFile) {
                submitData.append('image', imageFile);
            }

            if (selectedCategory) {
                await api.put(
                    `/categories/${selectedCategory.id}`,
                    submitData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
            } else {
                await api.post('/categories', submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            fetchCategories();
            handleCloseModal();
        } catch (err: any) {
            alert(
                err.response?.data?.message ||
                'Có lỗi xảy ra khi lưu danh mục'
            );
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa danh mục này?')) {
            return;
        }
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (err: any) {
            alert(
                err.response?.data?.message ||
                'Có lỗi xảy ra khi xóa danh mục'
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
                    Quản lý danh mục
                </h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 text-white px-4 py-2 
                          rounded-lg hover:bg-blue-700 
                          transition-colors"
                >
                    + Thêm danh mục
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <label className="block text-sm font-medium 
                      text-gray-700 mb-2">
                    Tìm kiếm
                </label>
                <input
                    type="text"
                    placeholder="Tên danh mục..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 border 
                          border-gray-300 rounded-lg 
                          focus:ring-2 focus:ring-blue-500 
                          focus:border-transparent"
                />
            </div>

            {/* Categories Table */}
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
                                    Tên danh mục
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
                                    Ngày tạo
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
                            {categories.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-8 
                                          text-center 
                                          text-gray-500"
                                    >
                                        Không tìm thấy danh mục nào
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category, index) => (
                                    <tr key={category.id}>
                                        <td className="px-6 py-4 
                                              whitespace-nowrap 
                                              text-sm 
                                              text-gray-900">
                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                        </td>
                                        <td className="px-6 py-4 
                                              whitespace-nowrap">
                                            <img
                                                src={getImageUrl(
                                                    category.image_url
                                                )}
                                                alt={category.name}
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
                                                {category.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm 
                                                  text-gray-500 
                                                  max-w-md">
                                                {category.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 
                                              whitespace-nowrap 
                                              text-sm 
                                              text-gray-900">
                                            {new Date(
                                                category.created_at
                                            ).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 
                                              whitespace-nowrap 
                                              text-sm 
                                              font-medium">
                                            <button
                                                onClick={() =>
                                                    handleOpenModal(
                                                        category
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
                                                        category.id
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

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    total={total}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    itemName="danh mục"
                />
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 
                          flex items-center justify-center 
                          z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md 
                          w-full p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {selectedCategory
                                ? 'Chỉnh sửa danh mục'
                                : 'Thêm danh mục mới'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm 
                                          font-medium mb-1">
                                        Tên danh mục *
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
                                <div>
                                    <label className="block text-sm 
                                          font-medium mb-1">
                                        Hình ảnh{' '}
                                        {selectedCategory &&
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
                                    {selectedCategory?.image_url && (
                                        <img
                                            src={getImageUrl(
                                                selectedCategory.image_url
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
                                    {selectedCategory ? 'Cập nhật' : 'Thêm'}
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
