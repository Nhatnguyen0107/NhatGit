import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAvatar } from '@/contexts/AvatarContext';

interface ProfileData {
    id: number;
    user_id: number;
    username: string;
    email: string;
    full_name?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    shipping_address?: string;
    shipping_city?: string;
    shipping_country?: string;
    billing_address?: string;
    avatar?: string;
    created_at: string;
}

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { refreshProfile } = useAvatar();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        shipping_address: '',
        shipping_city: '',
        shipping_country: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const [editingUsername, setEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/customers/profile/me');
            const profileData = response.data?.data || response.data;

            setProfile(profileData);
            setFormData({
                first_name: profileData.first_name || '',
                last_name: profileData.last_name || '',
                phone: profileData.phone || '',
                shipping_address: profileData.shipping_address || '',
                shipping_city: profileData.shipping_city || '',
                shipping_country: profileData.shipping_country || ''
            });
        } catch (err: any) {
            console.error('Error fetching profile:', err);
            if (err.response?.status === 401) {
                alert('Phiên đăng nhập đã hết hạn');
                navigate('/login');
            } else {
                setError('Không thể tải thông tin hồ sơ');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await api.put('/customers/profile/me', formData);
            showNotification('success', 'Cập nhật hồ sơ thành công!');
            setEditing(false);
            fetchProfile();
        } catch (err: any) {
            console.error('Error updating profile:', err);
            showNotification('error', err.response?.data?.message || 'Không thể cập nhật hồ sơ');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        if (profile) {
            setFormData({
                first_name: profile.first_name || '',
                last_name: profile.last_name || '',
                phone: profile.phone || '',
                shipping_address: profile.shipping_address || '',
                shipping_city: profile.shipping_city || '',
                shipping_country: profile.shipping_country || ''
            });
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showNotification('error', 'Mật khẩu mới và xác nhận mật khẩu không khớp');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            showNotification('error', 'Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        try {
            setChangingPassword(true);
            await api.put('/customers/profile/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            showNotification('success', 'Đổi mật khẩu thành công!');
            setShowPasswordModal(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err: any) {
            console.error('Error changing password:', err);
            showNotification('error', err.response?.data?.message ||
                'Không thể đổi mật khẩu');
        } finally {
            setChangingPassword(false);
        }
    };

    const handleUsernameChange = async () => {
        if (newUsername.length < 3) {
            showNotification('error', 'Tên đăng nhập phải có ít nhất 3 ký tự');
            return;
        }

        if (newUsername === profile?.username) {
            setEditingUsername(false);
            return;
        }

        try {
            setSaving(true);
            const response = await api.put('/customers/profile/username', {
                username: newUsername
            });

            // Update successful
            showNotification('success', 'Đổi tên đăng nhập thành công!');
            setEditingUsername(false);

            // Refresh context FIRST to update Navbar immediately
            try {
                await refreshProfile();
            } catch (refreshErr) {
                console.error('Error refreshing profile context:', refreshErr);
            }

            // Update local profile state from response
            const updatedProfile = response.data?.data || response.data;
            if (updatedProfile) {
                setProfile(updatedProfile);
            }
        } catch (err: any) {
            console.error('Error updating username:', err);
            showNotification('error', err.response?.data?.message || 'Không thể đổi tên đăng nhập');
        } finally {
            setSaving(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                showNotification('error', 'Vui lòng chọn file ảnh (JPEG, PNG, GIF, WebP)');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                showNotification('error', 'Kích thước file không được vượt quá 5MB');
                return;
            }

            setAvatarFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarUpload = async () => {
        if (!avatarFile) {
            showNotification('error', 'Vui lòng chọn ảnh để tải lên');
            return;
        }

        try {
            setUploadingAvatar(true);

            const formData = new FormData();
            formData.append('avatar', avatarFile);

            const response = await api.post('/customers/profile/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            showNotification('success', 'Tải lên ảnh đại diện thành công!');
            setShowAvatarModal(false);
            setAvatarFile(null);
            setAvatarPreview('');

            // Update local profile immediately from response
            const updatedProfile = response.data?.data || response.data;
            if (updatedProfile) {
                setProfile(updatedProfile);
            }

            // Then refresh context to update Navbar
            try {
                await refreshProfile();
            } catch (refreshErr) {
                console.error('Error refreshing profile context:', refreshErr);
            }
        } catch (err: any) {
            console.error('Error uploading avatar:', err);
            showNotification('error', err.response?.data?.message ||
                'Không thể tải lên ảnh đại diện');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-lg shadow-md p-8 animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i}>
                                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                                        <div className="h-10 bg-gray-200 rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <svg className="w-16 h-16 mx-auto text-red-500 mb-4"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Không thể tải thông tin
                            </h2>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <button
                                onClick={fetchProfile}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg
                                         hover:bg-blue-700 transition-colors"
                            >
                                Thử lại
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Notification Toast */}
                {notification && (
                    <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg
                                flex items-center space-x-3 animate-fade-in
                                ${notification.type === 'success'
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}>
                        {notification.type === 'success' ? (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        <span className="font-medium">{notification.message}</span>
                        <button
                            onClick={() => setNotification(null)}
                            className="ml-4 hover:opacity-75"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        {profile.avatar ? (
                                            <img
                                                src={`http://localhost:3000${profile.avatar}`}
                                                alt="Avatar"
                                                className="w-20 h-20 rounded-full object-cover 
                                                     border-4 border-blue-500"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        <div className={`w-20 h-20 bg-gradient-to-br 
                                                  from-blue-500 to-blue-600 rounded-full 
                                                  flex items-center justify-center text-white 
                                                  text-3xl font-bold ${profile.avatar ? 'hidden' : ''
                                            }`}>
                                            {profile.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <button
                                            onClick={() => setShowAvatarModal(true)}
                                            className="absolute bottom-0 right-0 bg-white 
                                                 rounded-full p-1.5 shadow-lg 
                                                 hover:bg-gray-100 transition-colors"
                                            title="Đổi ảnh đại diện"
                                        >
                                            <svg className="w-4 h-4 text-gray-600"
                                                fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            {profile.full_name || profile.username}
                                        </h1>
                                        <p className="text-gray-600">@{profile.username}</p>
                                        <p className="text-sm text-gray-500">
                                            Tham gia từ {formatDate(profile.created_at)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-3">
                                    {!editing && (
                                        <>
                                            <button
                                                onClick={() => setShowPasswordModal(true)}
                                                className="bg-gray-100 text-gray-700 px-4 
                                                     py-2 rounded-lg hover:bg-gray-200 
                                                     transition-colors flex items-center 
                                                     space-x-2"
                                            >
                                                <svg className="w-5 h-5" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                                <span>Đổi mật khẩu</span>
                                            </button>
                                            <button
                                                onClick={() => setEditing(true)}
                                                className="bg-blue-600 text-white px-6 py-2 
                                                     rounded-lg hover:bg-blue-700 
                                                     transition-colors flex items-center 
                                                     space-x-2"
                                            >
                                                <svg className="w-5 h-5" fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor">
                                                    <path strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                <span>Chỉnh sửa</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                Thông tin cá nhân
                            </h2>

                            <div className="space-y-6">
                                {/* Username (Editable) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tên đăng nhập
                                    </label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={editingUsername ? newUsername : profile.username}
                                            onChange={(e) => setNewUsername(e.target.value)}
                                            disabled={!editingUsername}
                                            className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg
                                                 ${editingUsername
                                                    ? 'bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                                    : 'bg-gray-50 text-gray-500 cursor-not-allowed'
                                                }`}
                                        />
                                        {!editingUsername ? (
                                            <button
                                                onClick={() => {
                                                    setEditingUsername(true);
                                                    setNewUsername(profile.username);
                                                }}
                                                className="px-4 py-2 bg-gray-600 text-white rounded-lg
                                                     hover:bg-gray-700 transition-colors"
                                            >
                                                Đổi
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={handleUsernameChange}
                                                    disabled={saving}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg
                                                         hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                                                >
                                                    {saving ? 'Đang lưu...' : 'Lưu'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingUsername(false);
                                                        setNewUsername('');
                                                    }}
                                                    disabled={saving}
                                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg
                                                         hover:bg-gray-400 transition-colors disabled:bg-gray-200"
                                                >
                                                    Hủy
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Email (Read-only) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg
                                             bg-gray-50 text-gray-500 cursor-not-allowed"
                                    />
                                </div>

                                {/* First Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Họ
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        disabled={!editing}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg
                                              focus:outline-none focus:ring-2 focus:ring-blue-500
                                              ${!editing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="Nhập họ của bạn"
                                    />
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tên
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        disabled={!editing}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg
                                              focus:outline-none focus:ring-2 focus:ring-blue-500
                                              ${!editing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="Nhập tên của bạn"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={!editing}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg
                                              focus:outline-none focus:ring-2 focus:ring-blue-500
                                              ${!editing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>

                                {/* Shipping Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Địa chỉ giao hàng
                                    </label>
                                    <textarea
                                        name="shipping_address"
                                        value={formData.shipping_address}
                                        onChange={handleInputChange}
                                        disabled={!editing}
                                        rows={3}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg
                                              focus:outline-none focus:ring-2 focus:ring-blue-500
                                              ${!editing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="Nhập địa chỉ giao hàng"
                                    />
                                </div>

                                {/* Shipping City */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Thành phố
                                    </label>
                                    <input
                                        type="text"
                                        name="shipping_city"
                                        value={formData.shipping_city}
                                        onChange={handleInputChange}
                                        disabled={!editing}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg
                                              focus:outline-none focus:ring-2 focus:ring-blue-500
                                              ${!editing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="Nhập thành phố"
                                    />
                                </div>

                                {/* Shipping Country */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quốc gia
                                    </label>
                                    <input
                                        type="text"
                                        name="shipping_country"
                                        value={formData.shipping_country}
                                        onChange={handleInputChange}
                                        disabled={!editing}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg
                                              focus:outline-none focus:ring-2 focus:ring-blue-500
                                              ${!editing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="Nhập quốc gia (mặc định: Việt Nam)"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {editing && (
                                <div className="flex space-x-4 mt-6">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg
                                             font-semibold hover:bg-blue-700 
                                             disabled:bg-gray-300 disabled:cursor-not-allowed
                                             transition-colors"
                                    >
                                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={saving}
                                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg
                                             font-semibold hover:bg-gray-300
                                             disabled:cursor-not-allowed transition-colors"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Quick Links */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <button
                                onClick={() => navigate('/orders')}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg
                                     transition-shadow text-left"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg 
                                              flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 
                                                 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 
                                                 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 
                                                 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            Đơn hàng của tôi
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Xem lịch sử mua hàng
                                        </p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate('/cart')}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg
                                     transition-shadow text-left"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg 
                                              flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-600" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 
                                                 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 
                                                 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 
                                                 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            Giỏ hàng
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Xem sản phẩm đã chọn
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Change Password Modal */}
                {showPasswordModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex 
                              items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Đổi mật khẩu
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setPasswordData({
                                            currentPassword: '',
                                            newPassword: '',
                                            confirmPassword: ''
                                        });
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium 
                                                 text-gray-700 mb-2">
                                        Mật khẩu hiện tại
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData(prev => ({
                                            ...prev,
                                            currentPassword: e.target.value
                                        }))}
                                        className="w-full px-4 py-2 border border-gray-300 
                                             rounded-lg focus:ring-2 
                                             focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Nhập mật khẩu hiện tại"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium 
                                                 text-gray-700 mb-2">
                                        Mật khẩu mới
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData(prev => ({
                                            ...prev,
                                            newPassword: e.target.value
                                        }))}
                                        className="w-full px-4 py-2 border border-gray-300 
                                             rounded-lg focus:ring-2 
                                             focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium 
                                                 text-gray-700 mb-2">
                                        Xác nhận mật khẩu mới
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData(prev => ({
                                            ...prev,
                                            confirmPassword: e.target.value
                                        }))}
                                        className="w-full px-4 py-2 border border-gray-300 
                                             rounded-lg focus:ring-2 
                                             focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Nhập lại mật khẩu mới"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setPasswordData({
                                            currentPassword: '',
                                            newPassword: '',
                                            confirmPassword: ''
                                        });
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 
                                         text-gray-700 rounded-lg hover:bg-gray-50 
                                         transition-colors"
                                    disabled={changingPassword}
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handlePasswordChange}
                                    disabled={changingPassword}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white 
                                         rounded-lg hover:bg-blue-700 transition-colors
                                         disabled:bg-blue-400 disabled:cursor-not-allowed
                                         flex items-center justify-center space-x-2"
                                >
                                    {changingPassword ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12"
                                                    r="10" stroke="currentColor"
                                                    strokeWidth="4" />
                                                <path className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>Đang xử lý...</span>
                                        </>
                                    ) : (
                                        <span>Đổi mật khẩu</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Avatar Upload Modal */}
                {showAvatarModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex 
                              items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Đổi ảnh đại diện
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowAvatarModal(false);
                                        setAvatarFile(null);
                                        setAvatarPreview('');
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium 
                                                 text-gray-700 mb-2">
                                        Chọn ảnh đại diện
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center 
                                                    justify-center w-full h-48 
                                                    border-2 border-gray-300 
                                                    border-dashed rounded-lg 
                                                    cursor-pointer bg-gray-50 
                                                    hover:bg-gray-100 
                                                    transition-colors">
                                            <div className="flex flex-col items-center 
                                                      justify-center pt-5 pb-6">
                                                {avatarPreview ? (
                                                    <img
                                                        src={avatarPreview}
                                                        alt="Preview"
                                                        className="w-32 h-32 rounded-full 
                                                             object-cover mb-3 
                                                             border-4 border-blue-500"
                                                    />
                                                ) : (
                                                    <>
                                                        <svg className="w-12 h-12 mb-3 
                                                                  text-gray-400"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor">
                                                            <path strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                        <p className="mb-2 text-sm 
                                                                 text-gray-500">
                                                            <span className="font-semibold">
                                                                Click để tải lên
                                                            </span>{' '}
                                                            hoặc kéo thả ảnh
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            PNG, JPG, GIF, WEBP (MAX. 5MB)
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                                onChange={handleFileSelect}
                                            />
                                        </label>
                                    </div>
                                    {avatarFile && (
                                        <p className="text-sm text-green-600 mt-2">
                                            ✓ Đã chọn: {avatarFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex space-x-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowAvatarModal(false);
                                        setAvatarFile(null);
                                        setAvatarPreview('');
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 
                                         text-gray-700 rounded-lg hover:bg-gray-50 
                                         transition-colors"
                                    disabled={uploadingAvatar}
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleAvatarUpload}
                                    disabled={uploadingAvatar || !avatarFile}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white 
                                         rounded-lg hover:bg-blue-700 transition-colors
                                         disabled:bg-blue-400 disabled:cursor-not-allowed
                                         flex items-center justify-center space-x-2"
                                >
                                    {uploadingAvatar ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12"
                                                    r="10" stroke="currentColor"
                                                    strokeWidth="4" />
                                                <path className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>Đang tải lên...</span>
                                        </>
                                    ) : (
                                        <span>Tải lên</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
