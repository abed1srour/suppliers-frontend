'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Settings, LogOut } from 'lucide-react';
import { apiService } from '../lib/api';

function DashboardContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for category in URL params
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      const data = await apiService.products.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category?.name === selectedCategory);

  const handleLogout = () => {
    // Handle logout logic here if needed
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c]">
      {/* Header with Admin Link - only show if user is admin */}
      {user?.role === 'admin' && (
        <header className="bg-[#1a1f2e] border-b border-blue-900 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-white">Solar Products</h1>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                <Settings size={16} />
                <span>Admin Panel</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>
      )}

      
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'} p-6`}>
        {/* Products Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 mt-10">
            {selectedCategory === 'All' ? 'Solar Products' : `${selectedCategory} Products`}
          </h2>
          <p className="text-blue-300">
            {selectedCategory === 'All' 
              ? `Showing all ${products.length} products` 
              : `Showing ${filteredProducts.length} products in ${selectedCategory}`
            }
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-xl">Loading products...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">
              {selectedCategory === 'All' ? 'No products found' : `No products in ${selectedCategory}`}
            </div>
            <p className="text-gray-500">Add some products to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
