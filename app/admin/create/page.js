'use client';

import { useRouter } from 'next/navigation';
import ProductForm from '../../../components/ProductForm';

export default function CreateProduct() {
  const router = useRouter();
  const handleCreate = async (requestBody) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        alert('Product created successfully!');
        router.push('/admin');
      } else {
        const data = await response.json();
        alert(data.error || 'Error creating product');
      }
    } catch (error) {
      alert('Error creating product');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProductForm onSubmit={handleCreate} submitButtonText="Create Product" />
      </div>
    </div>
  );
}