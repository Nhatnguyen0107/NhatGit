import api from './api';
import {
  LoginCredentials,
  RegisterCredentials,
  ApiResponse,
  User
} from '@/types';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<ApiResponse<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }>>('/auth/login', credentials);

    if (response.data.success && response.data.data) {
      const { user, accessToken, refreshToken } = response.data.data;

      // Lưu vào localStorage
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('role', user.role?.name || 'Customer');
      localStorage.setItem('userId', user.id);
      localStorage.setItem('username', user.username);
      localStorage.setItem('user', JSON.stringify(user));
    }

    return response.data;
  },

  register: async (credentials: RegisterCredentials) => {
    // Remove confirmPassword trước khi gửi
    const { confirmPassword, ...registerData } = credentials;

    const response = await api.post<ApiResponse<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }>>('/auth/register', registerData);

    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  isAdmin: (): boolean => {
    const role = localStorage.getItem('role');
    return role?.toLowerCase() === 'admin';
  },

  getRole: (): string | null => {
    return localStorage.getItem('role');
  },

  getUsername: (): string | null => {
    return localStorage.getItem('username');
  },
};
