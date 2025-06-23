'use client';

import { useState, useEffect } from 'react';
import { Package, Users, Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    categoryStats: []
  });
  const [mounted, setMounted] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setMounted(true);
    fetchDashboardStats();
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
      ]);

      const products = await productsRes.json();
      const categories = await categoriesRes.json();

      // Calculate products per category
      const categoryStats = categories.map(category => {
        const productsInCategory = products.filter(product => 
          product.category?._id === category._id || product.category === category._id
        );
        return {
          ...category,
          productCount: productsInCategory.length
        };
      });

      setStats({
        totalProducts: products.length || 0,
        totalCategories: categories.length || 0,
        categoryStats
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchCategories = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
    setCategories(await res.json());
  };

  const fetchProducts = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
    setProducts(await res.json());
  };

  // Filtering
  let filtered = products.filter(p => {
    const inCategory = selectedCategory === 'All' || (p.category?.name || p.category) === selectedCategory;
    const inSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return inCategory && inSearch;
  });

  // Sorting
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'category') return (a.category?.name || a.category).localeCompare(b.category?.name || b.category);
    if (sortBy === 'priceLow') return a.price - b.price;
    if (sortBy === 'priceHigh') return b.price - a.price;
    return 0;
  });

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-black">
      <main className="flex-1 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
              Admin Dashboard
            </h1>
            <p className="text-blue-300 text-sm sm:text-base lg:text-lg">
              Manage your solar products inventory
            </p>
          </div>

          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 sm:p-6 rounded-xl border border-blue-500 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-xs sm:text-sm font-medium">Total Products</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{stats.totalProducts}</p>
                  <p className="text-blue-200 text-xs sm:text-sm mt-1">Across all categories</p>
                </div>
                <div className="bg-blue-500/20 p-2 sm:p-3 rounded-lg">
                  <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 sm:p-6 rounded-xl border border-green-500 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-xs sm:text-sm font-medium">Categories</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{stats.totalCategories}</p>
                  <p className="text-green-200 text-xs sm:text-sm mt-1">Product categories</p>
                </div>
                <div className="bg-green-500/20 p-2 sm:p-3 rounded-lg">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown - Fixed Responsive Layout */}
          <div className="bg-[#1a1f2e] rounded-xl border border-blue-900 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Products by Category</h2>
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
            </div>
            
 
            
            {stats.categoryStats.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {stats.categoryStats.map((category) => (
                  <div 
                    key={category._id} 
                    className="bg-[#0a0f1c] border border-blue-800 rounded-lg p-3 sm:p-4 hover:border-blue-600 transition-colors min-h-[100px] sm:min-h-[120px]"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <h3 className="text-white font-semibold text-xs sm:text-sm md:text-base truncate pr-2 flex-1">
                          {category.name}
                        </h3>
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2">
                          {category.productCount}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2 mb-2 sm:mb-3 mt-auto">
                        <div 
                          className="bg-blue-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${stats.totalProducts > 0 ? (category.productCount / stats.totalProducts) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                      
                      <p className="text-gray-400 text-xs sm:text-sm mt-auto">
                        {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <Package className="h-8 w-8 sm:h-12 sm:w-12 text-gray-500 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-400 text-sm sm:text-base">No categories found</p>
                <p className="text-gray-500 text-xs sm:text-sm">Add some categories to get started</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-[#1a1f2e] rounded-xl border border-blue-900 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Link
                href="/admin/create"
                className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 sm:p-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="bg-blue-500/20 p-2 sm:p-3 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                    <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base lg:text-lg">Add New Product</h3>
                    <p className="text-blue-100 text-xs sm:text-sm">Create a new product listing</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/admin/edit"
                className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-4 sm:p-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="bg-green-500/20 p-2 sm:p-3 rounded-lg group-hover:bg-green-500/30 transition-colors">
                    <Edit className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base lg:text-lg">Edit Products</h3>
                    <p className="text-green-100 text-xs sm:text-sm">Modify existing products</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/admin/delete"
                className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-4 sm:p-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg sm:col-span-2 lg:col-span-1"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="bg-red-500/20 p-2 sm:p-3 rounded-lg group-hover:bg-red-500/30 transition-colors">
                    <Trash2 className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base lg:text-lg">Delete Products</h3>
                    <p className="text-red-100 text-xs sm:text-sm">Remove products from inventory</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
