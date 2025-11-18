export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
  image: string;
  images: string[];
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  product?: Product;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  total_amount: number;
  status: 
    'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string;
  shipping_address: string;
  shipped_at: string | null;
  delivered_at: string | null;
  order_items?: OrderItem[];
  customer?: Customer;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Customer {
  id: string;
  user_id: string;
  phone: string;
  address: string;
  user?: {
    id: string;
    username: string;
    email: string;
    full_name: string;
  };
  createdAt: string;
  updatedAt: string;
}
