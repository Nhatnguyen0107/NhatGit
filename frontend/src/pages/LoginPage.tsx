import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '@/services';
import { LoginCredentials } from '@/types';
import { useAvatar } from '@/contexts/AvatarContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useAvatar();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      const response = await authService.login(formData);

      if (response.success) {
        // Refresh profile to get updated user info
        await refreshProfile();

        // Redirect dựa trên role
        const role = authService.getRole();
        if (role?.toLowerCase() === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(response.message || 'Đăng nhập thất bại');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Đăng nhập thất bại'
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
            Đăng nhập
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hoặc{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 
                         hover:text-blue-500"
            >
              đăng ký tài khoản mới
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-400 
                            text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-none 
                           relative block w-full px-3 py-2 
                           border border-gray-300 
                           placeholder-gray-500 text-gray-900 
                           rounded-t-md focus:outline-none 
                           focus:ring-blue-500 
                           focus:border-blue-500 
                           focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none 
                           relative block w-full px-3 py-2 
                           border border-gray-300 
                           placeholder-gray-500 text-gray-900 
                           rounded-b-md focus:outline-none 
                           focus:ring-blue-500 
                           focus:border-blue-500 
                           focus:z-10 sm:text-sm"
                placeholder="Mật khẩu"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex 
                         justify-center py-2 px-4 border 
                         border-transparent text-sm font-medium 
                         rounded-md text-white bg-blue-600 
                         hover:bg-blue-700 focus:outline-none 
                         focus:ring-2 focus:ring-offset-2 
                         focus:ring-blue-500 
                         disabled:bg-blue-300 
                         disabled:cursor-not-allowed"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
