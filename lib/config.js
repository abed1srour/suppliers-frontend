// lib/config.js - Centralized configuration management

// Environment configuration
export const config = {
  // API Configuration
  api: {
    // Base URL - can be changed from .env.local or Vercel environment variables
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
    
    // API version (for future use)
    version: 'v1',
    
    // Timeout settings
    timeout: 10000,
    
    // Retry settings
    retries: 3,
    retryDelay: 1000,
  },
  
  // App Configuration
  app: {
    name: 'Solar Products',
    version: '1.0.0',
    description: 'Solar Power Product Display System',
  },
  
  // Feature flags - easily toggle features
  features: {
    enableSearch: true,
    enableCategories: true,
    enableAdminPanel: true,
    enableRealTimeUpdates: false, // For future WebSocket implementation
  },
  
  // UI Configuration
  ui: {
    theme: {
      primary: '#3B82F6', // blue-600
      secondary: '#1E40AF', // blue-800
      background: '#0A0F1C',
      surface: '#1A1F2E',
    },
    pagination: {
      itemsPerPage: 12,
    },
  },
  
  // Development settings
  development: {
    enableDebugLogs: process.env.NODE_ENV === 'development',
    enableMockData: false,
  }
};

// Helper functions for configuration
export const getApiUrl = (endpoint = '') => {
  return `${config.api.baseURL}${endpoint}`;
};

export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

// Debug function to log configuration (only in development)
export const logConfig = () => {
  if (config.development.enableDebugLogs) {
    console.log('🔧 App Configuration:', {
      api: config.api,
      app: config.app,
      features: config.features,
      environment: process.env.NODE_ENV,
    });
  }
};

// Export default configuration
export default config; 