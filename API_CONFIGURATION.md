# 🔧 Dynamic API Configuration Guide

## Overview

This application now uses a centralized, dynamic API configuration system that makes it easy to change backend URLs and manage API calls from environment variables.

## 🚀 Quick Setup

### 1. Environment Variables

#### For Development (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5001
```

#### For Production (Vercel)
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### 2. Configuration Files

- **`lib/config.js`** - Centralized configuration management
- **`lib/api.js`** - API service with retry logic and error handling

## 🔄 How to Change API URLs

### Option 1: Environment Variables (Recommended)
Simply change the `NEXT_PUBLIC_API_URL` in your environment variables:

```bash
# Development
NEXT_PUBLIC_API_URL=http://localhost:5001

# Production
NEXT_PUBLIC_API_URL=https://suppliers-backend-f6w4.onrender.com

# Staging
NEXT_PUBLIC_API_URL=https://staging-backend.example.com
```

### Option 2: Direct Configuration
Edit `lib/config.js`:

```javascript
export const config = {
  api: {
    baseURL: 'https://your-new-backend-url.com',
    // ... other settings
  },
  // ... rest of config
};
```

## 📡 API Service Usage

### Before (Old Way)
```javascript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
const data = await response.json();
```

### After (New Way)
```javascript
import { apiService } from '../lib/api';

const data = await apiService.products.getAll();
```

## 🛠️ Available API Methods

### Products
```javascript
// Get all products
const products = await apiService.products.getAll();

// Get product by ID
const product = await apiService.products.getById('product-id');

// Create product
const newProduct = await apiService.products.create(productData);

// Update product
const updatedProduct = await apiService.products.update('product-id', productData);

// Delete product
await apiService.products.delete('product-id');

// Get last update
const lastUpdate = await apiService.products.getLastUpdate();
```

### Categories
```javascript
// Get all categories
const categories = await apiService.categories.getAll();

// Create category
const newCategory = await apiService.categories.create(categoryData);

// Delete category
await apiService.categories.delete('category-id');
```

### Admin
```javascript
// Login
const loginResult = await apiService.admin.login({ username, password });

// Register
const registerResult = await apiService.admin.register({ username, password });

// Get profile
const profile = await apiService.admin.getProfile();
```

## 🔧 Advanced Configuration

### Custom Timeout and Retry Settings
Edit `lib/config.js`:

```javascript
export const config = {
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
    timeout: 15000,        // 15 seconds
    retries: 5,           // 5 retry attempts
    retryDelay: 2000,     // 2 seconds between retries
  },
  // ... rest of config
};
```

### Feature Flags
```javascript
export const config = {
  features: {
    enableSearch: true,
    enableCategories: true,
    enableAdminPanel: true,
    enableRealTimeUpdates: false,
  },
  // ... rest of config
};
```

## 🐛 Debugging

### Check API Configuration
```javascript
import { getApiConfig, logConfig } from '../lib/api';

// Log current configuration (development only)
logConfig();

// Get current API config
const apiConfig = getApiConfig();
console.log('Current API URL:', apiConfig.baseURL);
```

### Health Check
```javascript
import { checkApiHealth } from '../lib/api';

const isHealthy = await checkApiHealth();
console.log('API Health:', isHealthy);
```

## 🔄 Migration Guide

### Step 1: Update Import Statements
Replace direct fetch calls with API service:

```javascript
// Old
import { useState, useEffect } from 'react';

// New
import { useState, useEffect } from 'react';
import { apiService } from '../lib/api';
```

### Step 2: Replace Fetch Calls
```javascript
// Old
const fetchProducts = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
  const data = await response.json();
  setProducts(data);
};

// New
const fetchProducts = async () => {
  try {
    const data = await apiService.products.getAll();
    setProducts(data);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
```

## ✅ Benefits

1. **Centralized Configuration** - All API settings in one place
2. **Environment Flexibility** - Easy switching between dev/staging/prod
3. **Automatic Retry Logic** - Built-in retry mechanism for failed requests
4. **Timeout Handling** - Prevents hanging requests
5. **Better Error Handling** - Consistent error management
6. **Type Safety** - Structured API calls
7. **Debugging Support** - Built-in logging and health checks

## 🚨 Important Notes

- Always use `NEXT_PUBLIC_` prefix for client-side environment variables
- The API service automatically handles authentication headers
- Retry logic is enabled by default (3 retries with 1-second delays)
- Timeout is set to 10 seconds by default
- Configuration logging only works in development mode 