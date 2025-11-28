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
  ProfilePage,
} from '@/pages';
import SearchPage from '@/pages/SearchPage';
import PaymentResultPage from '@/pages/PaymentResultPage';
import VietQRPaymentPage from '@/pages/VietQRPaymentPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import ProductManagement from '@/pages/admin/ProductManagement';
import CategoryManagement from '@/pages/admin/CategoryManagement';
import OrderManagement from '@/pages/admin/OrderManagement';
import Statistics from '@/pages/admin/Statistics';
import ReviewManagement from '@/pages/admin/ReviewManagement';
import Settings from '@/pages/admin/Settings';

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
        path: 'search',
        element: <SearchPage />,
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
        path: 'payment/result',
        element: <PaymentResultPage />,
      },
      {
        path: 'payment/vietqr',
        element: <VietQRPaymentPage />,
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
      {
        path: 'profile',
        element: (
          <PrivateRoute>
            <ProfilePage />
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
      {
        path: 'orders',
        element: <OrderManagement />,
      },
      {
        path: 'statistics',
        element: <Statistics />,
      },
      {
        path: 'reviews',
        element: <ReviewManagement />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
