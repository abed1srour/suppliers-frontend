// lib/api.js - Centralized API configuration

import { config, getApiUrl, logConfig } from './config';

// Initialize configuration logging
logConfig();

// Base API configuration
const API_CONFIG = {
  // Base URL from centralized config
  baseURL: config.api.baseURL,
  
  // API endpoints - easily configurable
  endpoints: {
    // Product endpoints
    products: {
      getAll: '/api/products',
      getById: (id) => `/api/products/${id}`,
      create: '/api/products',
      update: (id) => `/api/products/${id}`,
      delete: (id) => `/api/products/${id}`,
      lastUpdate: '/api/products/last-update'
    },
    
    // Category endpoints
    categories: {
      getAll: '/api/categories',
      create: '/api/categories',
      delete: (id) => `/api/categories/${id}`
    },
    
    // Admin endpoints
    admin: {
      login: '/api/admin/login',
      register: '/api/admin/register',
      profile: '/api/admin/profile'
    }
  },
  
  // Default headers
  defaultHeaders: {
    'Content-Type': 'application/json'
  }
};

// Helper function to get full URL
const getFullURL = (endpoint) => {
  return `${API_CONFIG.baseURL}${endpoint}`;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Retry logic for failed requests
const retryRequest = async (requestFn, retries = config.api.retries) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, config.api.retryDelay));
    }
  }
};

// Enhanced fetch with timeout and error handling
const enhancedFetch = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.api.timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// API service functions
export const apiService = {
  // Product API calls
  products: {
    getAll: async () => {
      return retryRequest(async () => {
        const response = await enhancedFetch(getFullURL(API_CONFIG.endpoints.products.getAll));
        return response.json();
      });
    },
    
    getById: async (id) => {
      return retryRequest(async () => {
        const response = await enhancedFetch(getFullURL(API_CONFIG.endpoints.products.getById(id)));
        return response.json();
      });
    },
    
    create: async (data) => {
      return retryRequest(async () => {
        const response = await enhancedFetch(getFullURL(API_CONFIG.endpoints.products.create), {
          method: 'POST',
          headers: { ...API_CONFIG.defaultHeaders, ...getAuthHeaders() },
          body: JSON.stringify(data)
        });
        return response.json();
      });
    },
    
    update: async (id, data) => {
      return retryRequest(async () => {
        const response = await enhancedFetch(getFullURL(API_CONFIG.endpoints.products.update(id)), {
          method: 'PUT',
          headers: { ...API_CONFIG.defaultHeaders, ...getAuthHeaders() },
          body: JSON.stringify(data)
        });
        return response.json();
      });
    },
    
    delete: async (id) => {
      return retryRequest(async () => {
        const response = await enhancedFetch(getFullURL(API_CONFIG.endpoints.products.delete(id)), {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        return response.json();
      });
    },
    
    getLastUpdate: async () => {
      return retryRequest(async () => {
        const response = await enhancedFetch(getFullURL(API_CONFIG.endpoints.products.lastUpdate));
        return response.json();
      });
    }
  },
  
  // Category API calls
  categories: {
    getAll: async () => {
      return retryRequest(async () => {
        const response = await enhancedFetch(getFullURL(API_CONFIG.endpoints.categories.getAll));
        return response.json();
      });
    },
    
    create: async (data) => {
      return retryRequest(async () => {
        const response = await enhancedFetch(getFullURL(API_CONFIG.endpoints.categories.create), {
          method: 'POST',
          headers: { ...API_CONFIG.defaultHeaders, ...getAuthHeaders() },
          body: JSON.stringify(data)
        });
        return response.json();
      });
    },
    
    delete: async (id) => {
      return retryRequest(async () => {
        const response = await enhancedFetch(getFullURL(API_CONFIG.endpoints.categories.delete(id)), {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        return response.json();
      });
    }
  },
  
  // Admin API calls
  admin: {
    login: async (credentials) => {
      return retryRequest(async () => {
        const response = await enhancedFetch(getFullURL(API_CONFIG.endpoints.admin.login), {
          method: 'POST',
          headers: API_CONFIG.defaultHeaders,
          body: JSON.stringify(credentials)
        });
        return response.json();
      });
    },
    
    register: async (credentials) => {
      return retryRequest(async () => {
        const response = await enhancedFetch(getFullURL(API_CONFIG.endpoints.admin.register), {
          method: 'POST',
          headers: API_CONFIG.defaultHeaders,
          body: JSON.stringify(credentials)
        });
        return response.json();
      });
    },
    
    getProfile: async () => {
      return retryRequest(async () => {
        const response = await enhancedFetch(getFullURL(API_CONFIG.endpoints.admin.profile), {
          headers: getAuthHeaders()
        });
        return response.json();
      });
    }
  }
};

// Export configuration for debugging
export const getApiConfig = () => API_CONFIG;

// Export base URL for direct use if needed
export const getBaseURL = () => API_CONFIG.baseURL;

// Export endpoint builder for custom requests
export const buildEndpoint = (endpoint) => getFullURL(endpoint);

// Export health check function
export const checkApiHealth = async () => {
  try {
    const response = await enhancedFetch(getFullURL('/'));
    return response.ok;
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return false;
  }
}; 