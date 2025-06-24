'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import Image from 'next/image';

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [lastUpdate, setLastUpdate] = useState(null);
  const lastUpdateFetched = useRef(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    image: '',
    category: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    
    fetchProducts();
    fetchCategories();
    if (!lastUpdateFetched.current) {
      fetchLastUpdate();
      lastUpdateFetched.current = true;
    }
  }, [user, authLoading, router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchLastUpdate = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/last-update`);
      const data = await response.json();
      setLastUpdate(data.updatedAt);
    } catch (error) {
      setLastUpdate(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    
    try {
      const url = editingProduct 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/products/${editingProduct._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/products`;
      
      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowAddModal(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      description: product.description,
      image: product.image,
      category: product.category?._id || ''
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      quantity: '',
      description: '',
      image: '',
      category: ''
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date as 'YYYY-MM-DD HH:mm'
  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-row min-h-screen bg-black">
      {/* Sidebar */}

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 pt-24">
        {/* Last Update at the top */}
        <div className="mb-8">
          <span className="text-xs text-blue-300 font-semibold">Last Update</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">{formatDate(lastUpdate)}</h2>
        </div>
        {/* Search Filter Only */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-4 pr-4 py-2 bg-[#1a1f2e] border border-blue-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
          {filteredProducts.map(product => (
            <div key={product._id} className="bg-[#181e2a] p-4 rounded-xl border border-blue-900 flex flex-col items-center">
              {product.image && (
                <div className="relative w-24 h-24 mb-2 bg-white rounded-lg overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={96}
                    height={96}
                    className="object-contain w-full h-full"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <h3 className="text-base font-semibold text-white text-center truncate w-full">{product.name}</h3>
              <p className="text-blue-300 font-bold text-lg">${product.price}</p>
              <p className="text-gray-400 text-sm">Quantity: {product.quantity}</p>
              <p className="text-gray-400 text-sm">Category: {product.category?.name || product.category}</p>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-12">No products found</div>
          )}
        </div>
      </main>
      {/* Credits/Footer */}
      <footer className="mt-12 text-center text-xs text-gray-400 w-full">
        Credits: Website designed by Abedallatif Srour.<br />
        WhatsApp: <a href="https://wa.me/96176675348" className="underline hover:text-green-400">+961 76 675 348</a>
      </footer>
    </div>
  );
} 