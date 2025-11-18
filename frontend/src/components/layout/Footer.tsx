import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              E-Commerce
            </h3>
            <p className="text-gray-300 text-sm">
              Your one-stop shop for quality products at 
              great prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/products" 
                  className="text-gray-300 hover:text-white 
                             transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/cart" 
                  className="text-gray-300 hover:text-white 
                             transition-colors"
                >
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link 
                  to="/orders" 
                  className="text-gray-300 hover:text-white 
                             transition-colors"
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-white 
                             transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="text-gray-300 hover:text-white 
                             transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping" 
                  className="text-gray-300 hover:text-white 
                             transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Email: support@ecommerce.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 Street, City</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div 
          className="border-t border-gray-700 mt-8 pt-6 
                     text-center text-sm text-gray-400"
        >
          <p>
            © {new Date().getFullYear()} E-Commerce. 
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
