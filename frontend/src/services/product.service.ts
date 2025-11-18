import api from './api';
import { 
  Product, 
  PaginatedResponse, 
  PaginationParams 
} from '@/types';

interface ProductFilters extends PaginationParams {
  search?: string;
  category_id?: string;
  min_price?: number;
  max_price?: number;
  sort?: string;
}

export const productService = {
  getAll: async (filters: ProductFilters = {}) => {
    const response = 
      await api.get<PaginatedResponse<Product>>(
        '/products', 
        { params: filters }
      );
    return response.data;
  },

  getById: async (id: string) => {
    const response = 
      await api.get<{ success: boolean; data: Product }>(
        `/products/${id}`
      );
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = 
      await api.get<{ success: boolean; data: Product }>(
        `/products/slug/${slug}`
      );
    return response.data;
  },

  create: async (formData: FormData) => {
    const response = 
      await api.post<{ success: boolean; data: Product }>(
        '/products', 
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
    return response.data;
  },

  update: async (id: string, formData: FormData) => {
    const response = 
      await api.put<{ success: boolean; data: Product }>(
        `/products/${id}`, 
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
    return response.data;
  },

  delete: async (id: string) => {
    const response = 
      await api.delete<{ success: boolean; message: string }>(
        `/products/${id}`
      );
    return response.data;
  },
};
