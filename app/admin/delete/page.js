'use client';

import { useState, useEffect } from 'react';
import { Trash2, Search, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function DeleteProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Product deleted successfully!');
        setDeleteConfirm(null);
        fetchProducts();
      } else {
        const data = await response.json();
        alert(data.message || 'Error deleting product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <Link
          href="/admin"
          className="flex items-center space-x-2 text-blue-300 hover:text-white transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <Trash2 className="h-6 w-6 text-red-500" />
          <h1 className="text-2xl font-bold text-white flex-shrink-0">Delete Products</h1>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1a1f2e] border border-blue-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredProducts.map((product) => (
          <div key={product._id} className="bg-[#1a1f2e] p-6 rounded-xl border border-blue-900">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate">{product.name}</h3>
                  <p className="text-blue-100 text-sm line-clamp-2 mb-1">{product.description}</p>
                  <p className="text-blue-300">${product.price}</p>
                  <p className="text-gray-400 text-sm">Quantity: {product.quantity}</p>
                </div>
              </div>
              <button
                onClick={() => setDeleteConfirm(product._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition self-start sm:self-center"
              >
                Delete
              </button>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm === product._id && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <h4 className="text-red-300 font-semibold">Confirm Deletion</h4>
                </div>
                <p className="text-red-300 mb-4">
                  Are you sure you want to delete "{product.name}"? This action cannot be undone.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No products found</p>
        </div>
      )}
    </div>
  );
}