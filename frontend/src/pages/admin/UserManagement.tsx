import { useState, useEffect } from 'react';
import api from '@/services/api';

interface User {
    id: string;
    username: string;
    email: string;
    role_id: number;
    status: string;
    created_at: string;
    customer?: {
        first_name?: string;
        last_name?: string;
        phone?: string;
        billing_address?: string;
    };
}

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role_id: 3,
        status: 'active',
        phone: '',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // Fetch all users (both customers and admins)
            const response = await api.get('/auth/users');
            const data = response.data?.data || [];
            setUsers(Array.isArray(data) ? data : []);
        } catch (err: any) {
            // Fallback to customers if users endpoint doesn't exist
            try {
                const response = await api.get('/customers');
                const data = response.data?.data || [];
                setUsers(Array.isArray(data) ? data : []);
            } catch {
                setError('Không thể tải danh sách người dùng');
            }
            console.error('Fetch users error:', err);
        } finally {
            setLoading(false);
        }
    }; const getRoleName = (roleId: number) => {
        const roles: Record<number, string> = {
            1: 'Admin',
            2: 'Staff',
            3: 'Customer',
        };
        return roles[roleId] || 'Unknown';
    };

    const getRoleBadgeColor = (roleId: number) => {
        const colors: Record<number, string> = {
            1: 'bg-red-100 text-red-800',
            2: 'bg-blue-100 text-blue-800',
            3: 'bg-green-100 text-green-800',
        };
        return colors[roleId] || 'bg-gray-100 text-gray-800';
    };

    const getStatusBadgeColor = (status: string) => {
        return status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status: string) => {
        return status === 'active' ? 'Hoạt động' : 'Không hoạt động';
    };

    const filteredUsers = users.filter((user) => {
        const fullName = user.customer
            ? `${user.customer.first_name || ''} ${user.customer.last_name || ''}`.trim()
            : '';
        const matchesSearch =
            user.username?.toLowerCase().includes(
                searchTerm.toLowerCase()
            ) ||
            user.email?.toLowerCase().includes(
                searchTerm.toLowerCase()
            ) ||
            fullName.toLowerCase().includes(
                searchTerm.toLowerCase()
            );

        const matchesRole = roleFilter
            ? user.role_id === parseInt(roleFilter)
            : true;

        return matchesSearch && matchesRole;
    });

    const handleOpenModal = (user?: User) => {
        if (user) {
            setSelectedUser(user);
            setFormData({
                username: user.username,
                email: user.email,
                password: '',
                role_id: user.role_id,
                status: user.status,
                phone: user.customer?.phone || '',
            });
        } else {
            setSelectedUser(null);
            setFormData({
                username: '',
                email: '',
                password: '',
                role_id: 3,
                status: 'active',
                phone: '',
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
        setFormData({
            username: '',
            email: '',
            password: '',
            role_id: 3,
            status: 'active',
            phone: '',
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedUser) {
                // Update user
                const updateData: any = {
                    username: formData.username,
                    email: formData.email,
                    role_id: formData.role_id,
                    status: formData.status,
                };
                if (formData.password) {
                    updateData.password = formData.password;
                }
                // For customers, include customer data
                if (formData.role_id === 3) {
                    updateData.customer = {
                        phone: formData.phone,
                    };
                }
                await api.put(`/auth/users/${selectedUser.id}`, updateData);
            } else {
                // Create new user
                const userData = {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role_id: formData.role_id,
                    status: formData.status,
                };

                if (formData.role_id === 1) {
                    // Admin user
                    await api.post('/auth/register-admin', userData);
                } else if (formData.role_id === 3) {
                    // Customer user with phone
                    const customerData = {
                        ...userData,
                        phone: formData.phone,
                    };
                    await api.post('/auth/register', customerData);
                } else {
                    // Staff user
                    await api.post('/auth/register-staff', userData);
                }
            }
            fetchUsers();
            handleCloseModal();
            alert(selectedUser ? 'Cập nhật thành công!' : 'Thêm người dùng thành công!');
        } catch (err: any) {
            alert(
                err.response?.data?.message ||
                'Có lỗi xảy ra khi lưu người dùng'
            );
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa người dùng này?')) {
            return;
        }
        try {
            await api.delete(`/auth/users/${id}`);
            fetchUsers();
            alert('Xóa người dùng thành công!');
        } catch (err: any) {
            alert(
                err.response?.data?.message ||
                'Có lỗi xảy ra khi xóa người dùng'
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
                    Quản lý người dùng
                </h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 text-white px-4 py-2 
                          rounded-lg hover:bg-blue-700 
                          transition-colors"
                >
                    + Thêm người dùng
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
                            placeholder="Tên, email, số điện thoại..."
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
                            Vai trò
                        </label>
                        <select
                            value={roleFilter}
                            onChange={(e) =>
                                setRoleFilter(e.target.value)
                            }
                            className="w-full px-4 py-2 border 
                                  border-gray-300 rounded-lg 
                                  focus:ring-2 focus:ring-blue-500 
                                  focus:border-transparent"
                        >
                            <option value="">Tất cả vai trò</option>
                            <option value="1">Admin</option>
                            <option value="2">Staff</option>
                            <option value="3">Customer</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[40px]">
                                    STT
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                    Tên đăng nhập
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                                    Email
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                    SĐT
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                                    Vai trò
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                    Trạng thái
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                    Ngày tạo
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                        Không tìm thấy người dùng nào
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            {user.username}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 break-all">
                                            {user.email}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.customer?.phone || 'Chưa cập nhật'}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getRoleBadgeColor(user.role_id)}`}>
                                                {getRoleName(user.role_id)}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadgeColor(user.status)}`}>
                                                {getStatusLabel(user.status)}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(user.created_at).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm space-x-2">
                                            <button
                                                onClick={() => handleOpenModal(user)}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-600 hover:text-red-800 font-medium"
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
                          z-50 p-4">
                    <div className="bg-white rounded-lg 
                          max-w-md w-full p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {selectedUser
                                ? 'Chỉnh sửa người dùng'
                                : 'Thêm người dùng mới'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm 
                                          font-medium mb-1">
                                        Tên đăng nhập *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                username:
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
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 
                                              border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm 
                                          font-medium mb-1">
                                        Mật khẩu{' '}
                                        {selectedUser &&
                                            '(Để trống nếu không đổi)'}
                                    </label>
                                    <input
                                        type="password"
                                        required={!selectedUser}
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                password:
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
                                        Vai trò *
                                    </label>
                                    <select
                                        required
                                        value={formData.role_id}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                role_id: parseInt(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="w-full px-3 py-2 
                                              border rounded-lg"
                                    >
                                        <option value={1}>Admin</option>
                                        <option value={2}>Staff</option>
                                        <option value={3}>
                                            Customer
                                        </option>
                                    </select>
                                </div>
                                {formData.role_id === 3 && (
                                    <div>
                                        <label className="block text-sm 
                                              font-medium mb-1">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    phone: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 
                                                  border rounded-lg"
                                            placeholder="0123456789"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm 
                                          font-medium mb-1">
                                        Trạng thái *
                                    </label>
                                    <select
                                        required
                                        value={formData.status}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                status: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 
                                              border rounded-lg"
                                    >
                                        <option value="active">
                                            Hoạt động
                                        </option>
                                        <option value="inactive">
                                            Không hoạt động
                                        </option>
                                    </select>
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
                                    {selectedUser ? 'Cập nhật' : 'Thêm'}
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
