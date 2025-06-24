'use client';

import { useState, useEffect } from 'react';
import { apiService } from '../lib/api';
import {
  Menu,
  X,
  Sun,
  Zap,
  Battery,
  Package,
  ChevronRight,
  LogIn,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PublicSidebar({ selectedCategory, onCategoryChange }) {
  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchLastUpdate();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await apiService.categories.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchLastUpdate = async () => {
    try {
      const data = await apiService.products.getLastUpdate();
      setLastUpdate(data.updatedAt);
    } catch (error) {
      console.error('Error fetching last update:', error);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };

  const handleCategorySelect = (categoryName, path) => {
    onCategoryChange(categoryName);
    router.push(path);
  };

  const showHamburger = !isSidebarOpen;

  // Sidebar classes: fixed and h-screen always on desktop, only when open on mobile
  const sidebarClass = `
    flex flex-col justify-between
    bg-[#0a0f1c] text-white border-r border-blue-900 shadow-xl
    w-72
    ${isSidebarOpen ? 'fixed h-screen z-50 top-0 left-0' : 'hidden'}
    transform transition-transform duration-300 ease-in-out
    ${isSidebarOpen ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : ''}
    md:static md:translate-x-0 md:z-auto md:flex md:h-screen
  `;

  return (
    <>
      {/* Hamburger Button (mobile only) */}
      {showHamburger && (
        <button
          className="fixed top-4 left-4 z-50 text-white bg-[#0a0f1c] border border-blue-900 p-2.5 rounded-lg hover:border-blue-500 hover:bg-blue-950 transition-all shadow-lg backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Sidebar and Overlay: fixed, full height, overlays content, consistent color */}
      <div className="h-screen flex flex-col justify-between md:h-screen md:flex">
        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        {/* Sidebar */}
        <div className={sidebarClass}>
          <div>
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-blue-900">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 flex items-center justify-center">
                  <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-blue-300 font-semibold">Last Update</span>
                  <span className="text-white text-sm font-bold">{formatDate(lastUpdate)}</span>
                </div>
              </div>
              {/* X button only on mobile */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:text-white p-2 rounded-md hover:bg-blue-950 transition md:hidden"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main content with extra bottom padding */}
            <div className="flex flex-col h-[calc(100%-65px)] pb-20">
              {/* Categories */}
              <div className="px-3 mb-4 mt-6">
                <h3 className="text-blue-400 text-xs font-semibold uppercase px-3 mb-2 tracking-wide">Categories</h3>
                <nav className="space-y-1">
                  <button
                    onClick={() => onCategoryChange('All')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedCategory === 'All'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-blue-600/20 hover:text-white'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => onCategoryChange(category.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        selectedCategory === category.name
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-blue-600/20 hover:text-white'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
          {/* Login Button at the Bottom (always visible) */}
          <div className="p-4 bg-[#0a0f1c] border-t border-blue-900 w-full">
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
            >
              <LogIn size={18} />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
