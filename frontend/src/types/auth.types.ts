// Base types
export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role_id: string;
  role?: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: 'Admin' | 'Customer' | 'Staff';
  description: string;
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
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
}
