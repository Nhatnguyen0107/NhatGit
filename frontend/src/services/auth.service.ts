import api from './api';
import { 
  LoginCredentials, 
  RegisterCredentials, 
  ApiResponse, 
  User 
} from '@/types';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = 
      await api.post<ApiResponse<{ user: User; token: string }>>(
        '/auth/login', 
        credentials
      );
    return response.data;
  },

  register: async (credentials: RegisterCredentials) => {
    const response = 
      await api.post<ApiResponse<{ user: User; token: string }>>(
        '/auth/register', 
        credentials
      );
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = 
      await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },
};
