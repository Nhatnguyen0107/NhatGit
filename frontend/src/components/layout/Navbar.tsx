import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-primary-600"
          >
            E-Commerce
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 
                         transition-colors duration-200"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-primary-600 
                         transition-colors duration-200"
            >
              Products
            </Link>
            <Link 
              to="/cart" 
              className="text-gray-700 hover:text-primary-600 
                         transition-colors duration-200"
            >
              Cart
            </Link>
            <Link 
              to="/orders" 
              className="text-gray-700 hover:text-primary-600 
                         transition-colors duration-200"
            >
              Orders
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/login" className="btn-secondary">
              Login
            </Link>
            <Link to="/register" className="btn-primary">
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
