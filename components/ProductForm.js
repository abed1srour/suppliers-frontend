'use client';

import { useState, useEffect } from 'react';
import { apiService } from '../lib/api';
import { Package, Save, Image as ImageIcon } from 'lucide-react';

export default function ProductForm({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  submitButtonText = 'Create Product',
  loading = false 
}) {
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    quantity: ''
  });

  useEffect(() => {
    fetchCategories();
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price?.toString() || '',
        category: initialData.category?._id || initialData.category || '',
        image: initialData.image || '',
        quantity: initialData.quantity?.toString() || ''
      });
      setImagePreview(initialData.image || '');
    }
  }, [initialData]);

  const fetchCategories = async () => {
    try {
      const data = await apiService.categories.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requestBody = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image,
      quantity: parseInt(formData.quantity)
    };

    await onSubmit(requestBody);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update image preview when image URL changes
    if (name === 'image') {
      setImagePreview(value);
    }
  };

  return (
    <div className="bg-[#1a1f2e] p-4 sm:p-6 lg:p-8 rounded-xl border border-blue-900">
      <div className="flex items-center space-x-3 mb-6">
        <Package className="h-6 w-6 text-blue-500" />
        <h1 className="text-base sm:text-lg lg:text-2xl font-bold text-white">
          {initialData ? 'Edit Product' : 'Create New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-[#1a1f2e] border border-blue-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 bg-[#1a1f2e] border border-blue-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 bg-[#1a1f2e] border border-blue-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-[#1a1f2e] border border-blue-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Image URL
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#1a1f2e] border border-blue-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-3 py-2 bg-[#1a1f2e] border border-blue-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            placeholder="Enter product description"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save size={20} />
            )}
            <span>{loading ? 'Saving...' : submitButtonText}</span>
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Right Column - Image Preview */}
      <div className="space-y-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-blue-300 mb-2">
            Image Preview
          </label>
          <div className="bg-white border border-blue-800 rounded-lg p-4 min-h-[200px] sm:min-h-[300px] flex items-center justify-center">
            {imagePreview ? (
              <div className="w-full">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-full h-auto max-h-[300px] sm:max-h-[400px] object-contain rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden flex-col items-center justify-center text-gray-400 mt-4">
                  <ImageIcon size={48} />
                  <p className="mt-2 text-sm">Invalid image URL</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <ImageIcon size={48} />
                <p className="mt-2 text-sm">Enter an image URL to see preview</p>
              </div>
            )}
          </div>
        </div>

        {/* Product Summary */}
        <div className="bg-[#0a0f1c] border border-blue-800 rounded-lg p-4">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3">Product Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-300">Name:</span>
              <span className="text-white">{formData.name || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-300">Price:</span>
              <span className="text-white">${formData.price || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-300">Quantity:</span>
              <span className="text-white">{formData.quantity || '0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-300">Category:</span>
              <span className="text-white">
                {categories.find(cat => cat._id === formData.category)?.name || 'Not selected'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 