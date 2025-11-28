import { useState, useEffect } from 'react';
import api from '@/services/api';

interface SystemSettings {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    currency: string;
    timezone: string;
    maintenanceMode: boolean;
    allowRegistration: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
}

interface EmailSettings {
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    smtpSecure: boolean;
    fromEmail: string;
    fromName: string;
}

interface SystemInfo {
    server: {
        platform: string;
        arch: string;
        cpus: number;
        totalMemory: number;
        freeMemory: number;
        uptime: number;
    };
    node: {
        version: string;
        memoryUsage: {
            rss: number;
            heapTotal: number;
            heapUsed: number;
            external: number;
        };
        uptime: number;
    };
}

interface SecuritySettings {
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    passwordMinLength: number;
    requireSpecialChars: boolean;
    requireNumbers: boolean;
    requireUppercase: boolean;
    twoFactorAuth: boolean;
}

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);
    const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
    const [systemSettings, setSystemSettings] = useState<SystemSettings>({
        siteName: 'E-Commerce Store',
        siteDescription: 'Cửa hàng điện tử uy tín',
        contactEmail: 'contact@ecommerce.com',
        contactPhone: '0123456789',
        address: '123 Nguyễn Văn A, Q1, TP.HCM',
        currency: 'VND',
        timezone: 'Asia/Ho_Chi_Minh',
        maintenanceMode: false,
        allowRegistration: true,
        emailNotifications: true,
        smsNotifications: false,
    });

    const [emailSettings, setEmailSettings] = useState<EmailSettings>({
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUsername: '',
        smtpPassword: '',
        smtpSecure: true,
        fromEmail: 'noreply@ecommerce.com',
        fromName: 'E-Commerce Store',
    });

    const [securitySettings, setSecuritySettings] =
        useState<SecuritySettings>({
            sessionTimeout: 30,
            maxLoginAttempts: 5,
            lockoutDuration: 15,
            passwordMinLength: 8,
            requireSpecialChars: true,
            requireNumbers: true,
            requireUppercase: true,
            twoFactorAuth: false,
        });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/settings');
            const data = response.data.data;

            if (data.system) setSystemSettings(data.system);
            if (data.email) setEmailSettings(data.email);
            if (data.security) setSecuritySettings(data.security);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSystemInfo = async () => {
        try {
            const response = await api.get('/settings/system-info');
            setSystemInfo(response.data.data);
        } catch (error) {
            console.error('Error fetching system info:', error);
        }
    };

    const handleSaveSystemSettings = async () => {
        try {
            setLoading(true);
            await api.put('/settings/system', systemSettings);
            alert('Cài đặt hệ thống đã được lưu thành công!');
        } catch (error) {
            console.error('Error saving system settings:', error);
            alert('Có lỗi xảy ra khi lưu cài đặt!');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveEmailSettings = async () => {
        try {
            setLoading(true);
            await api.put('/settings/email', emailSettings);
            alert('Cài đặt email đã được lưu thành công!');
        } catch (error) {
            console.error('Error saving email settings:', error);
            alert('Có lỗi xảy ra khi lưu cài đặt email!');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSecuritySettings = async () => {
        try {
            setLoading(true);
            await api.put('/settings/security', securitySettings);
            alert('Cài đặt bảo mật đã được lưu thành công!');
        } catch (error) {
            console.error('Error saving security settings:', error);
            alert('Có lỗi xảy ra khi lưu cài đặt bảo mật!');
        } finally {
            setLoading(false);
        }
    };

    const handleTestEmail = async () => {
        try {
            setLoading(true);
            await api.post('/settings/test-email');
            alert('Email kiểm tra đã được gửi thành công!');
        } catch (error) {
            console.error('Error sending test email:', error);
            alert('Có lỗi xảy ra khi gửi email kiểm tra!');
        } finally {
            setLoading(false);
        }
    };

    const handleClearCache = async () => {
        try {
            setLoading(true);
            await api.post('/settings/clear-cache');
            alert('Cache đã được xóa thành công!');
        } catch (error) {
            console.error('Error clearing cache:', error);
            alert('Có lỗi xảy ra khi xóa cache!');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'Cài đặt chung', icon: '⚙️' },
        { id: 'email', label: 'Cài đặt Email', icon: '✉️' },
        { id: 'security', label: 'Bảo mật', icon: '🔒' },
        { id: 'maintenance', label: 'Bảo trì', icon: '🛠️' },
        { id: 'system-info', label: 'Thông tin hệ thống', icon: '📊' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Cài đặt hệ thống
                </h1>
                <p className="text-gray-600">
                    Quản lý các cài đặt và cấu hình hệ thống
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-2 px-1 border-b-2 font-medium 
                                      text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow p-6">
                {/* General Settings */}
                {activeTab === 'general' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Cài đặt chung
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium 
                                              mb-2">
                                    Tên website
                                </label>
                                <input
                                    type="text"
                                    value={systemSettings.siteName}
                                    onChange={(e) =>
                                        setSystemSettings({
                                            ...systemSettings,
                                            siteName: e.target.value,
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
                                              mb-2">
                                    Email liên hệ
                                </label>
                                <input
                                    type="email"
                                    value={systemSettings.contactEmail}
                                    onChange={(e) =>
                                        setSystemSettings({
                                            ...systemSettings,
                                            contactEmail: e.target.value,
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
                                              mb-2">
                                    Số điện thoại
                                </label>
                                <input
                                    type="tel"
                                    value={systemSettings.contactPhone}
                                    onChange={(e) =>
                                        setSystemSettings({
                                            ...systemSettings,
                                            contactPhone: e.target.value,
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
                                              mb-2">
                                    Tiền tệ
                                </label>
                                <select
                                    value={systemSettings.currency}
                                    onChange={(e) =>
                                        setSystemSettings({
                                            ...systemSettings,
                                            currency: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border 
                                             border-gray-300 rounded-lg 
                                             focus:outline-none 
                                             focus:ring-2 
                                             focus:ring-blue-500"
                                >
                                    <option value="VND">VND (₫)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-2">
                                Mô tả website
                            </label>
                            <textarea
                                value={systemSettings.siteDescription}
                                onChange={(e) =>
                                    setSystemSettings({
                                        ...systemSettings,
                                        siteDescription: e.target.value,
                                    })
                                }
                                rows={3}
                                className="w-full px-3 py-2 border 
                                         border-gray-300 rounded-lg 
                                         focus:outline-none 
                                         focus:ring-2 
                                         focus:ring-blue-500"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-2">
                                Địa chỉ
                            </label>
                            <input
                                type="text"
                                value={systemSettings.address}
                                onChange={(e) =>
                                    setSystemSettings({
                                        ...systemSettings,
                                        address: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border 
                                         border-gray-300 rounded-lg 
                                         focus:outline-none 
                                         focus:ring-2 
                                         focus:ring-blue-500"
                            />
                        </div>

                        {/* Toggle Settings */}
                        <div className="space-y-4 pt-6 border-t">
                            <h3 className="font-medium text-gray-900">
                                Cài đặt tính năng
                            </h3>

                            <div className="space-y-3">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={systemSettings.allowRegistration}
                                        onChange={(e) =>
                                            setSystemSettings({
                                                ...systemSettings,
                                                allowRegistration: e.target.checked,
                                            })
                                        }
                                        className="rounded border-gray-300 
                                                 text-blue-600 
                                                 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Cho phép đăng ký tài khoản mới
                                    </span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={systemSettings.emailNotifications}
                                        onChange={(e) =>
                                            setSystemSettings({
                                                ...systemSettings,
                                                emailNotifications: e.target.checked,
                                            })
                                        }
                                        className="rounded border-gray-300 
                                                 text-blue-600 
                                                 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Bật thông báo email
                                    </span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={systemSettings.smsNotifications}
                                        onChange={(e) =>
                                            setSystemSettings({
                                                ...systemSettings,
                                                smsNotifications: e.target.checked,
                                            })
                                        }
                                        className="rounded border-gray-300 
                                                 text-blue-600 
                                                 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Bật thông báo SMS
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t">
                            <button
                                onClick={handleSaveSystemSettings}
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white 
                                         rounded-lg hover:bg-blue-700 
                                         disabled:opacity-50 
                                         transition-colors"
                            >
                                {loading ? 'Đang lưu...' : 'Lưu cài đặt'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Email Settings */}
                {activeTab === 'email' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Cài đặt Email
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium 
                                              mb-2">
                                    SMTP Host
                                </label>
                                <input
                                    type="text"
                                    value={emailSettings.smtpHost}
                                    onChange={(e) =>
                                        setEmailSettings({
                                            ...emailSettings,
                                            smtpHost: e.target.value,
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
                                              mb-2">
                                    SMTP Port
                                </label>
                                <input
                                    type="number"
                                    value={emailSettings.smtpPort}
                                    onChange={(e) =>
                                        setEmailSettings({
                                            ...emailSettings,
                                            smtpPort: parseInt(e.target.value),
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
                                              mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={emailSettings.smtpUsername}
                                    onChange={(e) =>
                                        setEmailSettings({
                                            ...emailSettings,
                                            smtpUsername: e.target.value,
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
                                              mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={emailSettings.smtpPassword}
                                    onChange={(e) =>
                                        setEmailSettings({
                                            ...emailSettings,
                                            smtpPassword: e.target.value,
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
                                              mb-2">
                                    From Email
                                </label>
                                <input
                                    type="email"
                                    value={emailSettings.fromEmail}
                                    onChange={(e) =>
                                        setEmailSettings({
                                            ...emailSettings,
                                            fromEmail: e.target.value,
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
                                              mb-2">
                                    From Name
                                </label>
                                <input
                                    type="text"
                                    value={emailSettings.fromName}
                                    onChange={(e) =>
                                        setEmailSettings({
                                            ...emailSettings,
                                            fromName: e.target.value,
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

                        <div className="pt-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={emailSettings.smtpSecure}
                                    onChange={(e) =>
                                        setEmailSettings({
                                            ...emailSettings,
                                            smtpSecure: e.target.checked,
                                        })
                                    }
                                    className="rounded border-gray-300 
                                             text-blue-600 
                                             focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    Sử dụng kết nối bảo mật (SSL/TLS)
                                </span>
                            </label>
                        </div>

                        <div className="flex justify-between pt-6 border-t">
                            <button
                                onClick={handleTestEmail}
                                disabled={loading}
                                className="px-6 py-2 bg-green-600 text-white 
                                         rounded-lg hover:bg-green-700 
                                         disabled:opacity-50 
                                         transition-colors"
                            >
                                {loading ? 'Đang gửi...' : 'Kiểm tra email'}
                            </button>
                            <button
                                onClick={handleSaveEmailSettings}
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white 
                                         rounded-lg hover:bg-blue-700 
                                         disabled:opacity-50 
                                         transition-colors"
                            >
                                {loading ? 'Đang lưu...' : 'Lưu cài đặt'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Cài đặt bảo mật
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium 
                                              mb-2">
                                    Thời gian hết hạn phiên (phút)
                                </label>
                                <input
                                    type="number"
                                    value={securitySettings.sessionTimeout}
                                    onChange={(e) =>
                                        setSecuritySettings({
                                            ...securitySettings,
                                            sessionTimeout: parseInt(e.target.value),
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
                                              mb-2">
                                    Số lần đăng nhập tối đa
                                </label>
                                <input
                                    type="number"
                                    value={securitySettings.maxLoginAttempts}
                                    onChange={(e) =>
                                        setSecuritySettings({
                                            ...securitySettings,
                                            maxLoginAttempts: parseInt(e.target.value),
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
                                              mb-2">
                                    Thời gian khóa tài khoản (phút)
                                </label>
                                <input
                                    type="number"
                                    value={securitySettings.lockoutDuration}
                                    onChange={(e) =>
                                        setSecuritySettings({
                                            ...securitySettings,
                                            lockoutDuration: parseInt(e.target.value),
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
                                              mb-2">
                                    Độ dài mật khẩu tối thiểu
                                </label>
                                <input
                                    type="number"
                                    value={securitySettings.passwordMinLength}
                                    onChange={(e) =>
                                        setSecuritySettings({
                                            ...securitySettings,
                                            passwordMinLength: parseInt(e.target.value),
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

                        <div className="space-y-4 pt-6 border-t">
                            <h3 className="font-medium text-gray-900">
                                Yêu cầu mật khẩu
                            </h3>

                            <div className="space-y-3">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={securitySettings.requireSpecialChars}
                                        onChange={(e) =>
                                            setSecuritySettings({
                                                ...securitySettings,
                                                requireSpecialChars: e.target.checked,
                                            })
                                        }
                                        className="rounded border-gray-300 
                                                 text-blue-600 
                                                 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Yêu cầu ký tự đặc biệt
                                    </span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={securitySettings.requireNumbers}
                                        onChange={(e) =>
                                            setSecuritySettings({
                                                ...securitySettings,
                                                requireNumbers: e.target.checked,
                                            })
                                        }
                                        className="rounded border-gray-300 
                                                 text-blue-600 
                                                 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Yêu cầu số
                                    </span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={securitySettings.requireUppercase}
                                        onChange={(e) =>
                                            setSecuritySettings({
                                                ...securitySettings,
                                                requireUppercase: e.target.checked,
                                            })
                                        }
                                        className="rounded border-gray-300 
                                                 text-blue-600 
                                                 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Yêu cầu chữ hoa
                                    </span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={securitySettings.twoFactorAuth}
                                        onChange={(e) =>
                                            setSecuritySettings({
                                                ...securitySettings,
                                                twoFactorAuth: e.target.checked,
                                            })
                                        }
                                        className="rounded border-gray-300 
                                                 text-blue-600 
                                                 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Bật xác thực 2 yếu tố
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t">
                            <button
                                onClick={handleSaveSecuritySettings}
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white 
                                         rounded-lg hover:bg-blue-700 
                                         disabled:opacity-50 
                                         transition-colors"
                            >
                                {loading ? 'Đang lưu...' : 'Lưu cài đặt'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Maintenance */}
                {activeTab === 'maintenance' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Bảo trì hệ thống
                        </h2>

                        {/* Maintenance Mode */}
                        <div className="bg-yellow-50 border border-yellow-200 
                                      rounded-lg p-6">
                            <h3 className="font-medium text-yellow-900 mb-2">
                                Chế độ bảo trì
                            </h3>
                            <p className="text-yellow-700 text-sm mb-4">
                                Khi bật chế độ bảo trì, website sẽ hiển thị
                                thông báo bảo trì cho người dùng.
                            </p>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={systemSettings.maintenanceMode}
                                    onChange={(e) =>
                                        setSystemSettings({
                                            ...systemSettings,
                                            maintenanceMode: e.target.checked,
                                        })
                                    }
                                    className="rounded border-gray-300 
                                             text-yellow-600 
                                             focus:ring-yellow-500"
                                />
                                <span className="ml-2 text-sm text-yellow-900">
                                    Bật chế độ bảo trì
                                </span>
                            </label>
                        </div>

                        {/* System Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 border border-blue-200 
                                          rounded-lg p-6">
                                <h3 className="font-medium text-blue-900 mb-2">
                                    Xóa Cache
                                </h3>
                                <p className="text-blue-700 text-sm mb-4">
                                    Xóa tất cả dữ liệu cache để cải thiện hiệu suất.
                                </p>
                                <button
                                    onClick={handleClearCache}
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white 
                                             rounded-lg hover:bg-blue-700 
                                             disabled:opacity-50 
                                             transition-colors text-sm"
                                >
                                    {loading ? 'Đang xóa...' : 'Xóa Cache'}
                                </button>
                            </div>

                            <div className="bg-green-50 border border-green-200 
                                          rounded-lg p-6">
                                <h3 className="font-medium text-green-900 mb-2">
                                    Backup Database
                                </h3>
                                <p className="text-green-700 text-sm mb-4">
                                    Tạo bản sao lưu dữ liệu để đảm bảo an toàn.
                                </p>
                                <button
                                    onClick={async () => {
                                        try {
                                            setLoading(true);
                                            await api.post('/settings/backup');
                                            alert('Backup database thành công!');
                                        } catch (error) {
                                            console.error('Error backing up database:', error);
                                            alert('Có lỗi xảy ra khi backup!');
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    disabled={loading}
                                    className="px-4 py-2 bg-green-600 text-white 
                                             rounded-lg hover:bg-green-700 
                                             disabled:opacity-50 
                                             transition-colors text-sm"
                                >
                                    {loading ? 'Đang backup...' : 'Backup Database'}
                                </button>
                            </div>

                            <div className="bg-purple-50 border border-purple-200 
                                          rounded-lg p-6">
                                <h3 className="font-medium text-purple-900 mb-2">
                                    Optimze Database
                                </h3>
                                <p className="text-purple-700 text-sm mb-4">
                                    Tối ưu hóa cơ sở dữ liệu để tăng tốc độ.
                                </p>
                                <button
                                    onClick={async () => {
                                        try {
                                            setLoading(true);
                                            await api.post('/settings/optimize');
                                            alert('Tối ưu hóa database thành công!');
                                        } catch (error) {
                                            console.error('Error optimizing database:', error);
                                            alert('Có lỗi xảy ra khi tối ưu hóa!');
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    disabled={loading}
                                    className="px-4 py-2 bg-purple-600 text-white 
                                             rounded-lg hover:bg-purple-700 
                                             disabled:opacity-50 
                                             transition-colors text-sm"
                                >
                                    {loading ? 'Đang tối ưu...' : 'Optimize'}
                                </button>
                            </div>

                            <div className="bg-red-50 border border-red-200 
                                          rounded-lg p-6">
                                <h3 className="font-medium text-red-900 mb-2">
                                    Restart System
                                </h3>
                                <p className="text-red-700 text-sm mb-4">
                                    Khởi động lại hệ thống (sử dụng thận trọng).
                                </p>
                                <button
                                    onClick={async () => {
                                        if (!confirm('Bạn có chắc muốn khởi động lại hệ thống? Hành động này có thể gây gián đoạn dịch vụ!')) {
                                            return;
                                        }
                                        try {
                                            setLoading(true);
                                            // await api.post('/settings/restart');
                                            alert('Lệnh restart đã được gửi!');
                                        } catch (error) {
                                            console.error('Error restarting system:', error);
                                            alert('Có lỗi xảy ra khi restart!');
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    disabled={loading}
                                    className="px-4 py-2 bg-red-600 text-white 
                                             rounded-lg hover:bg-red-700 
                                             disabled:opacity-50 
                                             transition-colors text-sm"
                                >
                                    {loading ? 'Đang restart...' : 'Restart System'}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t">
                            <button
                                onClick={handleSaveSystemSettings}
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white 
                                         rounded-lg hover:bg-blue-700 
                                         disabled:opacity-50 
                                         transition-colors"
                            >
                                {loading ? 'Đang lưu...' : 'Lưu cài đặt'}
                            </button>
                        </div>
                    </div>
                )}

                {/* System Info */}
                {activeTab === 'system-info' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">
                                Thông tin hệ thống
                            </h2>
                            <button
                                onClick={() => {
                                    fetchSystemInfo();
                                    if (activeTab === 'system-info') {
                                        // Refresh current tab
                                        setTimeout(() => setActiveTab('system-info'), 0);
                                    }
                                }}
                                className="px-4 py-2 bg-blue-600 text-white 
                                         rounded-lg hover:bg-blue-700 
                                         transition-colors text-sm"
                            >
                                🔄 Làm mới
                            </button>
                        </div>

                        {systemInfo ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Server Info */}
                                <div className="bg-gray-50 border border-gray-200 
                                              rounded-lg p-6">
                                    <h3 className="font-medium text-gray-900 mb-4">
                                        📡 Server Information
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Platform:</span>
                                            <span className="font-medium">
                                                {systemInfo.server.platform}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Architecture:</span>
                                            <span className="font-medium">
                                                {systemInfo.server.arch}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">CPU Cores:</span>
                                            <span className="font-medium">
                                                {systemInfo.server.cpus}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Memory:</span>
                                            <span className="font-medium">
                                                {systemInfo.server.totalMemory} MB
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Free Memory:</span>
                                            <span className="font-medium">
                                                {systemInfo.server.freeMemory} MB
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Uptime:</span>
                                            <span className="font-medium">
                                                {Math.floor(systemInfo.server.uptime / 3600)}h {Math.floor((systemInfo.server.uptime % 3600) / 60)}m
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Node.js Info */}
                                <div className="bg-green-50 border border-green-200 
                                              rounded-lg p-6">
                                    <h3 className="font-medium text-green-900 mb-4">
                                        🟢 Node.js Information
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-green-600">Version:</span>
                                            <span className="font-medium">
                                                {systemInfo.node.version}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-green-600">RSS Memory:</span>
                                            <span className="font-medium">
                                                {Math.round(systemInfo.node.memoryUsage.rss / 1024 / 1024)} MB
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-green-600">Heap Total:</span>
                                            <span className="font-medium">
                                                {Math.round(systemInfo.node.memoryUsage.heapTotal / 1024 / 1024)} MB
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-green-600">Heap Used:</span>
                                            <span className="font-medium">
                                                {Math.round(systemInfo.node.memoryUsage.heapUsed / 1024 / 1024)} MB
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-green-600">Process Uptime:</span>
                                            <span className="font-medium">
                                                {Math.floor(systemInfo.node.uptime / 3600)}h {Math.floor((systemInfo.node.uptime % 3600) / 60)}m
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Memory Usage Chart */}
                                <div className="bg-blue-50 border border-blue-200 
                                              rounded-lg p-6">
                                    <h3 className="font-medium text-blue-900 mb-4">
                                        💾 Memory Usage
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>System Memory</span>
                                                <span>
                                                    {Math.round(((systemInfo.server.totalMemory - systemInfo.server.freeMemory) / systemInfo.server.totalMemory) * 100)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${Math.round(((systemInfo.server.totalMemory - systemInfo.server.freeMemory) / systemInfo.server.totalMemory) * 100)}%`
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Node.js Heap</span>
                                                <span>
                                                    {Math.round((systemInfo.node.memoryUsage.heapUsed / systemInfo.node.memoryUsage.heapTotal) * 100)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${Math.round((systemInfo.node.memoryUsage.heapUsed / systemInfo.node.memoryUsage.heapTotal) * 100)}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="bg-yellow-50 border border-yellow-200 
                                              rounded-lg p-6">
                                    <h3 className="font-medium text-yellow-900 mb-4">
                                        ⚡ Quick Stats
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-yellow-600">
                                                {systemInfo.server.cpus}
                                            </div>
                                            <div className="text-yellow-700">CPU Cores</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-yellow-600">
                                                {Math.round(systemInfo.server.totalMemory / 1024)}
                                            </div>
                                            <div className="text-yellow-700">GB RAM</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-yellow-600">
                                                {Math.floor(systemInfo.server.uptime / 86400)}
                                            </div>
                                            <div className="text-yellow-700">Days Uptime</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-yellow-600">
                                                {Math.round(systemInfo.node.memoryUsage.heapUsed / 1024 / 1024)}
                                            </div>
                                            <div className="text-yellow-700">MB Heap</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-gray-500 mb-4">
                                    Nhấp "Làm mới" để tải thông tin hệ thống
                                </div>
                                <button
                                    onClick={fetchSystemInfo}
                                    className="px-6 py-2 bg-blue-600 text-white 
                                             rounded-lg hover:bg-blue-700 
                                             transition-colors"
                                >
                                    🔄 Tải thông tin hệ thống
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;