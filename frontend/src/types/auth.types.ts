// Base types
export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  role_id: number;
  role?: Role;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: 'Admin' | 'Customer' | 'Staff';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}
