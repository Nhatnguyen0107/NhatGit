import { useState, useEffect } from 'react';
import api from '@/services/api';

interface User {
    id: string;
    username: string;
    email: string;
    phone: string;
    role_id: number;
    is_active: boolean;
}

interface FormData {
    username: string;
    email: string;
    phone: string;
    password: string;
    role_id: number;
}

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        phone: '',
        password: '',
        role_id: 3,
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/customers');
            setUsers(response.data.data || []);
        } catch (err: any) {
            setError('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                username: user.username,
                email: user.email,
                phone: user.phone,
                password: '',
                role_id: user.role_id,
            });
        } else {
            setEditingUser(null);
            setFormData({
                username: '',
                email: '',
                phone: '',
                password: '',
                role_id: 3,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({
            username: '',
            email: '',
            phone: '',
            password: '',
            role_id: 3,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingUser) {
                // Update user
                await api.put(`/customers/${editingUser.id}`, formData);
            } else {
                // Create new user
                await api.post('/auth/register', formData);
            }
            handleCloseModal();
            fetchUsers();
        } catch (err: any) {
            alert(
                err.response?.data?.message ||
                'Có lỗi xảy ra'
            );
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa người dùng này?'))
            return;

        try {
            await api.delete(`/customers/${id}`);
            fetchUsers();
        } catch (err: any) {
            alert('Không thể xóa người dùng');
        }
    };

    const getRoleName = (roleId: number) => {
        switch (roleId) {
            case 1:
                return 'Admin';
            case 2:
                return 'Staff';
            case 3:
                return 'Customer';
            default:
                return 'Unknown';
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
                    Quản lý người dùng
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
                    <span>Thêm người dùng</span>
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
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs 
                             font-medium text-gray-500 
                             uppercase tracking-wider">
                                Tên người dùng
                            </th>
                            <th className="px-6 py-3 text-left text-xs 
                             font-medium text-gray-500 
                             uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs 
                             font-medium text-gray-500 
                             uppercase tracking-wider">
                                Số điện thoại
                            </th>
                            <th className="px-6 py-3 text-left text-xs 
                             font-medium text-gray-500 
                             uppercase tracking-wider">
                                Vai trò
                            </th>
                            <th className="px-6 py-3 text-left text-xs 
                             font-medium text-gray-500 
                             uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap 
                               text-sm text-gray-900">
                                    {user.id.substring(0, 8)}...
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap 
                               text-sm font-medium text-gray-900">
                                    {user.username}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap 
                               text-sm text-gray-500">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap 
                               text-sm text-gray-500">
                                    {user.phone}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs 
                                   rounded-full 
                                   ${user.role_id === 1
                                            ? 'bg-red-100 text-red-800'
                                            : user.role_id === 2
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                        {getRoleName(user.role_id)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap 
                               text-sm font-medium">
                                    <button
                                        onClick={() => handleOpenModal(user)}
                                        className="text-blue-600 hover:text-blue-900 
                               mr-4"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
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
                    <div className="bg-white rounded-lg p-6 w-[500px] 
                          max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {editingUser
                                ? 'Chỉnh sửa người dùng'
                                : 'Thêm người dùng mới'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium 
                                  text-gray-700 mb-2">
                                    Tên người dùng
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            username: e.target.value
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
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value
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
                                    Số điện thoại
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            phone: e.target.value
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
                                    Mật khẩu {editingUser && '(để trống nếu không đổi)'}
                                </label>
                                <input
                                    type="password"
                                    required={!editingUser}
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value
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
                                    Vai trò
                                </label>
                                <select
                                    value={formData.role_id}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            role_id: parseInt(e.target.value)
                                        })
                                    }
                                    className="w-full px-3 py-2 border 
                             border-gray-300 rounded-lg 
                             focus:outline-none 
                             focus:ring-2 
                             focus:ring-blue-500"
                                >
                                    <option value={1}>Admin</option>
                                    <option value={2}>Staff</option>
                                    <option value={3}>Customer</option>
                                </select>
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
                                    {editingUser ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
