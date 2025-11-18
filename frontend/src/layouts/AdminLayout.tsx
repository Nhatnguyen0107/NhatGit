import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '@/services';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const username = authService.getUsername();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const menuItems = [
        {
            path: '/admin/dashboard',
            label: 'Dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            path: '/admin/users',
            label: 'Quản lý người dùng',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        },
        {
            path: '/admin/products',
            label: 'Quản lý sản phẩm',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
        {
            path: '/admin/categories',
            label: 'Quản lý danh mục',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full 
                    bg-gray-800 text-white 
                    transition-all duration-300 z-40
                    ${isSidebarOpen ? 'w-64' : 'w-20'}`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between 
                        px-4 bg-gray-900">
                    {isSidebarOpen && (
                        <Link to="/" className="text-xl font-bold">
                            E-Commerce Admin
                        </Link>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-gray-300 hover:text-white 
                       focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="mt-8">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 
                         transition-colors duration-200
                         ${isActive(item.path)
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            <span className="flex-shrink-0">{item.icon}</span>
                            {isSidebarOpen && (
                                <span className="ml-3">{item.label}</span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Back to User Site */}
                <div className="absolute bottom-0 w-full p-4 
                        border-t border-gray-700">
                    <Link
                        to="/"
                        className="flex items-center px-4 py-2 
                       text-gray-300 hover:bg-gray-700 
                       hover:text-white rounded 
                       transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        {isSidebarOpen && (
                            <span className="ml-3">Về trang chủ</span>
                        )}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div
                className={`transition-all duration-300 
                    ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}
            >
                {/* Top Navbar */}
                <header className="h-16 bg-white shadow-sm 
                           flex items-center justify-between 
                           px-6">
                    <h1 className="text-xl font-semibold text-gray-800">
                        Admin Panel
                    </h1>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-blue-500 rounded-full 
                              flex items-center justify-center 
                              text-white font-semibold">
                                {username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    {username}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Quản trị viên
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm text-red-600 
                         hover:bg-red-50 rounded 
                         transition-colors"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
