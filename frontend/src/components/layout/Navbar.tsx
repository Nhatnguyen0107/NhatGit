import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '@/services';
import { useAvatar } from '@/contexts/AvatarContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const { avatar, username: contextUsername } = useAvatar();
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();
  const username = contextUsername || authService.getUsername();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
      setSearchKeyword('');
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-primary-600"
          >
            E-Commerce
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-2 pl-10 pr-4 
                           border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 
                           focus:ring-blue-500 
                           focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 
                           transform -translate-y-1/2"
              >
                <svg
                  className="w-5 h-5 text-gray-400 
                             hover:text-blue-600 
                             transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 
                         transition-colors duration-200"
            >
              Trang chủ
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-primary-600 
                         transition-colors duration-200"
            >
              Sản phẩm
            </Link>            {/* Chỉ hiển thị khi đã đăng nhập */}
            {isAuthenticated && (
              <>
                <Link
                  to="/cart"
                  className="text-gray-700 
                             hover:text-primary-600 
                             transition-colors duration-200"
                >
                  Giỏ hàng
                </Link>
                <Link
                  to="/orders"
                  className="text-gray-700 
                             hover:text-primary-600 
                             transition-colors duration-200"
                >
                  Đơn hàng
                </Link>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 
                             focus:outline-none"
                >
                  {avatar ? (
                    <img
                      src={`http://localhost:3000${avatar}`}
                      alt="Avatar"
                      className="w-9 h-9 rounded-full object-cover 
                               border-2 border-blue-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const fallback = (e.target as HTMLImageElement).nextElementSibling;
                        if (fallback) {
                          (fallback as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div className={`w-9 h-9 bg-blue-500 
                                  rounded-full flex 
                                  items-center justify-center 
                                  text-white font-semibold ${avatar ? 'hidden' : ''
                    }`}>
                    {username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium">
                    {username}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-600 
                               transition-transform 
                               ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 
                                  bg-white rounded-lg shadow-lg 
                                  py-2 z-50 border 
                                  border-gray-200">
                    <div className="px-4 py-3 border-b 
                                    border-gray-200">
                      <p className="text-sm text-gray-500">
                        Đăng nhập với
                      </p>
                      <p className="text-sm font-medium 
                                    text-gray-900 truncate">
                        {username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {isAdmin ? 'Quản trị viên' : 'Khách hàng'}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm 
                                 text-gray-700 
                                 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 
                               018 0zM12 14a7 7 0 00-7 7h14a7 
                               7 0 00-7-7z"
                          />
                        </svg>
                        Hồ sơ của tôi
                      </div>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm 
                                 text-gray-700 
                                 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 
                               002 2h10a2 2 0 002-2V7a2 2 0 
                               00-2-2h-2M9 5a2 2 0 002 2h2a2 
                               2 0 002-2M9 5a2 2 0 012-2h2a2 
                               2 0 012 2"
                          />
                        </svg>
                        Đơn hàng của tôi
                      </div>
                    </Link>

                    {/* Admin Section */}
                    {isAdmin && (
                      <>
                        <div className="border-t border-gray-200 
                                        my-2"></div>
                        <div className="px-4 py-2">
                          <p className="text-xs font-semibold 
                                        text-gray-400 uppercase">
                            Quản trị
                          </p>
                        </div>
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 text-sm 
                                     text-red-600 font-medium 
                                     hover:bg-red-50"
                        >
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 
                                   11.955 0 0112 2.944a11.955 
                                   11.955 0 01-8.618 3.04A12.02 
                                   12.02 0 003 9c0 5.591 3.824 
                                   10.29 9 11.622 5.176-1.332 
                                   9-6.03 9-11.622 
                                   0-1.042-.133-2.052-.382-3.016z"
                              />
                            </svg>
                            Admin Panel
                          </div>
                        </Link>
                        <Link
                          to="/admin/products"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 text-sm 
                                     text-gray-700 
                                     hover:bg-gray-100 pl-11"
                        >
                          Quản lý sản phẩm
                        </Link>
                        <Link
                          to="/admin/users"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 text-sm 
                                     text-gray-700 
                                     hover:bg-gray-100 pl-11"
                        >
                          Quản lý người dùng
                        </Link>
                        <Link
                          to="/admin/orders"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 text-sm 
                                     text-gray-700 
                                     hover:bg-gray-100 pl-11"
                        >
                          Quản lý đơn hàng
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-200 
                                    my-2"></div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 
                                 text-sm text-red-600 
                                 hover:bg-red-50"
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 
                               3 0 01-3 3H6a3 3 0 01-3-3V7a3 
                               3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Đăng xuất
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn-primary">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
