import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '@/services';
import { RegisterCredentials } from '@/types';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterCredentials>({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.username.trim()) {
      setError('Tên người dùng không được để trống');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email không đúng định dạng');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Số điện thoại phải có 10 số');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu tối thiểu 6 ký tự');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register(formData);

      if (response.success) {
        setSuccess(true);
        // Chuyển đến login sau 2 giây
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Đăng ký thất bại');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Đăng ký thất bại'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center 
                    justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl 
                         font-extrabold text-gray-900">
            Đăng ký tài khoản
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 
                         hover:text-blue-500"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-400 
                          text-green-700 px-4 py-3 rounded">
            Đăng ký thành công! Vui lòng đăng nhập.
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-400 
                            text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium 
                           text-gray-700 mb-1"
              >
                Tên người dùng
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="appearance-none relative block 
                           w-full px-3 py-2 border 
                           border-gray-300 
                           placeholder-gray-500 
                           text-gray-900 rounded-md 
                           focus:outline-none 
                           focus:ring-blue-500 
                           focus:border-blue-500 sm:text-sm"
                placeholder="Nhập tên đầy đủ"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium 
                           text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block 
                           w-full px-3 py-2 border 
                           border-gray-300 
                           placeholder-gray-500 
                           text-gray-900 rounded-md 
                           focus:outline-none 
                           focus:ring-blue-500 
                           focus:border-blue-500 sm:text-sm"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium 
                           text-gray-700 mb-1"
              >
                Số điện thoại
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="appearance-none relative block 
                           w-full px-3 py-2 border 
                           border-gray-300 
                           placeholder-gray-500 
                           text-gray-900 rounded-md 
                           focus:outline-none 
                           focus:ring-blue-500 
                           focus:border-blue-500 sm:text-sm"
                placeholder="0912345678"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium 
                           text-gray-700 mb-1"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block 
                           w-full px-3 py-2 border 
                           border-gray-300 
                           placeholder-gray-500 
                           text-gray-900 rounded-md 
                           focus:outline-none 
                           focus:ring-blue-500 
                           focus:border-blue-500 sm:text-sm"
                placeholder="Ít nhất 6 ký tự"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium 
                           text-gray-700 mb-1"
              >
                Nhập lại mật khẩu
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none relative block 
                           w-full px-3 py-2 border 
                           border-gray-300 
                           placeholder-gray-500 
                           text-gray-900 rounded-md 
                           focus:outline-none 
                           focus:ring-blue-500 
                           focus:border-blue-500 sm:text-sm"
                placeholder="Nhập lại mật khẩu"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || success}
              className="group relative w-full flex 
                         justify-center py-2 px-4 border 
                         border-transparent text-sm 
                         font-medium rounded-md text-white 
                         bg-blue-600 hover:bg-blue-700 
                         focus:outline-none focus:ring-2 
                         focus:ring-offset-2 
                         focus:ring-blue-500 
                         disabled:bg-blue-300 
                         disabled:cursor-not-allowed"
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
