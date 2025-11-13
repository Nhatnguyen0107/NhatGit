import { 
  createBrowserRouter, 
  RouterProvider 
} from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { 
  HomePage, 
  ProductsPage, 
  LoginPage, 
  RegisterPage 
} from '@/pages';

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
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
