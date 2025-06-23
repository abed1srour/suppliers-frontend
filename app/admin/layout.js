'use client';

import { useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Package, Plus, Edit, Trash2, LogOut, Home, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', icon: Home, label: 'Dashboard' },
    { href: '/admin/create', icon: Plus, label: 'Create Product' },
    { href: '/admin/edit', icon: Edit, label: 'Edit Products' },
    { href: '/admin/delete', icon: Trash2, label: 'Delete Products' }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-[#1a1f2e] border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Package className="h-8 w-8 text-blue-500" />
              <h1 className="text-lg sm:text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
            
            {/* Desktop User Info */}
            <div className="hidden sm:flex items-center space-x-4">
              <span className="text-blue-300 text-sm">Welcome, {user.username}</span>
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition text-sm"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-[#1a1f2e] border-b border-blue-900">
          <div className="px-4 py-2 space-y-2">
            {/* Mobile User Info */}
            <div className="flex items-center justify-between py-2 border-b border-blue-800">
              <span className="text-blue-300 text-sm">Welcome, {user.username}</span>
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition text-sm"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
            
            {/* Mobile Nav Items */}
            <div className="py-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 text-blue-300 hover:text-white py-3 px-2 rounded-lg hover:bg-[#0a0f1c] transition"
                >
                  <item.icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <nav className="hidden sm:block bg-[#0a0f1c] border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 text-blue-300 hover:text-white py-4 px-2 border-b-2 border-transparent hover:border-blue-500 transition"
              >
                <item.icon size={16} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
