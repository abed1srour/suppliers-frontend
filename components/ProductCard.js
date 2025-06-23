import React from "react";

export default function ProductCard({ product }) {
  // product = { name, description, image, price, category, quantity }
  const isLowStock = typeof product.quantity === 'number' && product.quantity <= 2;
  return (
    <div className="relative flex w-full max-w-xs flex-col overflow-hidden rounded-2xl border border-blue-900 bg-gradient-to-br from-[#181e2a] to-[#232946] shadow-xl transition-transform hover:scale-105 hover:shadow-2xl">
      {/* Product Image */}
      <div className="relative mx-4 mt-4 flex h-56 overflow-hidden rounded-xl bg-white shadow-inner">
        {/* Category badge at top right */}
        {product.category && (
          <span className="absolute top-2 right-2 z-10 inline-block w-fit rounded bg-gradient-to-r from-blue-700 to-blue-500 px-2 py-0.5 text-xs font-bold text-white shadow">
            {typeof product.category === "object" ? product.category.name : product.category}
          </span>
        )}
        {product.image ? (
          <img
            className="object-contain w-full h-full"
            src={product.image}
            alt={product.name}
          />
        ) : null}
      </div>
      <div className="mt-4 px-4 pb-4 flex flex-col flex-1">
        {/* Product Name */}
        <h5 className="text-lg font-extrabold tracking-tight text-white mb-1">{product.name}</h5>
        {/* Description */}
        <p className="mt-1 text-sm text-blue-100 line-clamp-2">{product.description}</p>
        {/* Price and Quantity */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-2xl font-extrabold text-blue-400">${product.price}</span>
          <span className={`ml-auto px-3 py-1 rounded-full shadow inline-block text-xs font-semibold ${isLowStock ? 'bg-red-600 text-white animate-pulse' : 'bg-blue-600 text-white'}`}>
            Qty: {product.quantity}
            {isLowStock && <span className="ml-2 text-xs font-bold text-red-200">Low Stock</span>}
          </span>
        </div>
      </div>
    </div>
  );
}
