'use client';

import { useState, useEffect } from 'react';
import { Edit, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductForm from '../../../components/ProductForm';

export default function EditProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

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

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleSave = async (requestBody) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        alert('Product updated successfully!');
        setEditingProduct(null);
        fetchProducts();
      } else {
        const data = await response.json();
        alert(data.error || 'Error updating product');
      }
    } catch (error) {
      alert('Error updating product');
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
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
          <Edit className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-white">Edit Products</h1>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-[#1a1f2e] border border-blue-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredProducts.map((product) => (
          <div key={product._id} className="bg-[#1a1f2e] p-6 rounded-xl border border-blue-900">
            {editingProduct?._id === product._id ? (
              <ProductForm
                initialData={editingProduct}
                onSubmit={handleSave}
                onCancel={handleCancel}
                submitButtonText="Save Changes"
              />
            ) : (
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
                    <p className="text-gray-400 text-sm">Category: {product.category?.name || product.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition self-start sm:self-center"
                >
                  Edit
                </button>
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