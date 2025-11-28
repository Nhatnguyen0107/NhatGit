import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '@/services/api';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  stock_quantity: number;
  category_id: number;
  brand: string;
  discount_percentage: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [selectedCategory, setSelectedCategory] =
    useState<string>(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] =
    useState<string>(searchParams.get('sort') || 'newest');
  const [priceRange, setPriceRange] =
    useState<string>(searchParams.get('price') || 'all');
  const [searchQuery, setSearchQuery] =
    useState<string>(searchParams.get('q') || '');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, priceRange, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      const data = response.data?.data?.categories ||
        response.data?.data ||
        response.data || [];
      setCategories(Array.isArray(data) ? data : []);
      console.log('Categories loaded:', data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const params: any = {};

      if (selectedCategory !== 'all') {
        params.category_id = selectedCategory;
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await api.get('/products', { params });
      let data = response.data?.data?.products ||
        response.data?.data ||
        response.data || [];

      if (!Array.isArray(data)) {
        data = [];
      }

      console.log('Products loaded:', data);

      // Apply filters
      let filtered = [...data];

      // Price range filter
      if (priceRange !== 'all') {
        filtered = filtered.filter(product => {
          const price = product.price;
          switch (priceRange) {
            case 'under-5m':
              return price < 5000000;
            case '5m-10m':
              return price >= 5000000 && price < 10000000;
            case '10m-20m':
              return price >= 10000000 && price < 20000000;
            case 'over-20m':
              return price >= 20000000;
            default:
              return true;
          }
        });
      }

      // Sorting
      switch (sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'name-asc':
          filtered.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          break;
        case 'name-desc':
          filtered.sort((a, b) =>
            b.name.localeCompare(a.name)
          );
          break;
        default: // newest
          // Keep default order from API
          break;
      }

      setProducts(filtered);
    } catch (err: any) {
      setError(err.response?.data?.message ||
        'Không thể tải danh sách sản phẩm');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    updateSearchParams({ category: categoryId });
  };

  const handleSortChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setSortBy(value);
    updateSearchParams({ sort: value });
  };

  const handlePriceRangeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setPriceRange(value);
    updateSearchParams({ price: value });
  };

  const handleSearchSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    updateSearchParams({ q: searchQuery });
  };

  const updateSearchParams = (
    updates: Record<string, string>
  ) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all') {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSortBy('newest');
    setPriceRange('all');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Danh sách sản phẩm
          </h1>
          <p className="text-gray-600">
            Khám phá các sản phẩm điện tử chất lượng cao
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="flex-1 px-4 py-2 border border-gray-300 
                       rounded-lg focus:outline-none 
                       focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 
                       text-white px-6 py-2 rounded-lg 
                       font-semibold transition-colors"
            >
              Tìm kiếm
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 
                          sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Bộ lọc</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 
                           hover:underline"
                >
                  Xóa lọc
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Danh mục</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`w-full text-left px-3 py-2 
                             rounded-lg transition-colors ${selectedCategory === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100'
                      }`}
                  >
                    Tất cả
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() =>
                        handleCategoryChange(category.id.toString())
                      }
                      className={`w-full text-left px-3 py-2 
                               rounded-lg transition-colors ${selectedCategory ===
                          category.id.toString()
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-100'
                        }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Khoảng giá</h3>
                <select
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  className="w-full px-3 py-2 border 
                           border-gray-300 rounded-lg 
                           focus:outline-none 
                           focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả</option>
                  <option value="under-5m">Dưới 5 triệu</option>
                  <option value="5m-10m">5 - 10 triệu</option>
                  <option value="10m-20m">10 - 20 triệu</option>
                  <option value="over-20m">Trên 20 triệu</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <h3 className="font-semibold mb-3">Sắp xếp</h3>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="w-full px-3 py-2 border 
                           border-gray-300 rounded-lg 
                           focus:outline-none 
                           focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá: Thấp → Cao</option>
                  <option value="price-desc">Giá: Cao → Thấp</option>
                  <option value="name-asc">Tên: A → Z</option>
                  <option value="name-desc">Tên: Z → A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Tìm thấy <span className="font-semibold">
                  {products.length}
                </span> sản phẩm
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center 
                            py-12">
                <div className="animate-spin rounded-full 
                              h-12 w-12 border-b-2 
                              border-blue-600"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 
                            text-red-700 px-4 py-3 rounded 
                            mb-6">
                {error}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && products.length === 0 && (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="text-lg font-semibold 
                             text-gray-900 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-600 mb-4">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:underline 
                           font-semibold"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 
                            lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image_url}
                    stock={product.stock_quantity}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
