import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import BannerSlider from '@/components/BannerSlider';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  stock_quantity: number;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  image_url?: string;
}

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<string | number>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
      ]);

      // Parse products
      let productsData = productsRes.data?.data?.products ||
        productsRes.data?.data ||
        productsRes.data || [];

      // Parse categories  
      let categoriesData = categoriesRes.data?.data?.categories ||
        categoriesRes.data?.data ||
        categoriesRes.data || [];

      console.log('Products loaded:', productsData);
      console.log('Categories loaded:', categoriesData);

      setProducts(Array.isArray(productsData)
        ? productsData : []);
      setCategories(Array.isArray(categoriesData)
        ? categoriesData : []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(
      (p) => p.category_id === selectedCategory
    );

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(
      (c) => c.id === categoryId
    );
    return category?.name;
  };

  return (
    <div className="space-y-8">
      {/* Banner Slider */}
      <BannerSlider />

      {/* Categories Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Danh mục sản phẩm
        </h2>
        <div className="flex overflow-x-auto space-x-4 pb-4 
                        scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex-shrink-0 px-6 py-3 
                       rounded-lg font-semibold 
                       transition-colors ${selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Tất cả
          </button>
          {Array.isArray(categories) &&
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-6 py-3 
                         rounded-lg font-semibold 
                         transition-colors ${selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {category.name}
              </button>
            ))}
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Khám phá danh mục
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 
                        lg:grid-cols-4 gap-4">
          {Array.isArray(categories) &&
            categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="relative rounded-lg overflow-hidden 
                         shadow-md hover:shadow-xl 
                         transition-shadow group h-40"
              >
                <img
                  src={
                    category.image_url
                      ? `http://localhost:3000${category.image_url}`
                      : 'https://via.placeholder.com/300x200?text=Category'
                  }
                  alt={category.name}
                  className="w-full h-full object-cover 
                           group-hover:scale-110 
                           transition-transform duration-300"
                />
                <div className="absolute inset-0 
                              bg-gradient-to-t 
                              from-black/70 to-transparent 
                              flex items-end">
                  <h3 className="text-white font-bold 
                               text-lg p-4">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* Products Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedCategory === 'all'
              ? 'Tất cả sản phẩm'
              : getCategoryName(Number(selectedCategory))}
          </h2>
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-700 
                       font-semibold flex items-center 
                       space-x-2"
          >
            <span>Xem tất cả</span>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center 
                          justify-center h-64">
            <div className="animate-spin rounded-full 
                            h-12 w-12 border-b-2 
                            border-blue-600"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 
                          md:grid-cols-3 lg:grid-cols-4 
                          gap-6">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={Number(product.price)}
                image={product.image_url}
                stock={product.stock_quantity}
                category={getCategoryName(product.category_id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Không có sản phẩm nào trong danh mục này
            </p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 
                          gap-6 mt-12">
        <div className="bg-blue-50 rounded-lg p-6 
                        text-center">
          <div className="bg-blue-600 w-16 h-16 
                          rounded-full flex items-center 
                          justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">
            Giá tốt nhất
          </h3>
          <p className="text-gray-600 text-sm">
            Cam kết giá cạnh tranh nhất thị trường
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-6 
                        text-center">
          <div className="bg-green-600 w-16 h-16 
                          rounded-full flex items-center 
                          justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          </div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">
            Miễn phí vận chuyển
          </h3>
          <p className="text-gray-600 text-sm">
            Giao hàng miễn phí cho đơn hàng trên 500k
          </p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 
                        text-center">
          <div className="bg-yellow-600 w-16 h-16 
                          rounded-full flex items-center 
                          justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">
            Bảo hành chính hãng
          </h3>
          <p className="text-gray-600 text-sm">
            Đổi trả trong 30 ngày nếu có lỗi
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
