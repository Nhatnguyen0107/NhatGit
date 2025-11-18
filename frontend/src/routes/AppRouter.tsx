import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import AdminLayout from '@/layouts/AdminLayout';
import PrivateRoute from '@/components/PrivateRoute';
import AdminRoute from '@/components/AdminRoute';
import {
  HomePage,
  ProductsPage,
  ProductDetailPage,
  CartPage,
  CheckoutPage,
  OrderListPage,
  OrderDetailPage,
  LoginPage,
  RegisterPage,
} from '@/pages';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import ProductManagement from '@/pages/admin/ProductManagement';
import CategoryManagement from '@/pages/admin/CategoryManagement';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'products/:id',
        element: <ProductDetailPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'cart',
        element: (
          <PrivateRoute>
            <CartPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'checkout',
        element: (
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'orders/:id',
        element: (
          <PrivateRoute>
            <OrderDetailPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <PrivateRoute>
            <OrderListPage />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'users',
        element: <UserManagement />,
      },
      {
        path: 'products',
        element: <ProductManagement />,
      },
      {
        path: 'categories',
        element: <CategoryManagement />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
