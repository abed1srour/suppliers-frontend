'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiService, getApiConfig } from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('authToken');
    if (token) {
      // You could verify the token here with your backend
      setUser({ username: 'admin' }); // For now, just set a default user
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const apiConfig = getApiConfig();
    console.log('🔍 API URL from env:', apiConfig.baseURL);
    console.log(' Using login URL:', apiConfig.baseURL + apiConfig.endpoints.admin.login);
    
    try {
      const data = await apiService.admin.login({ username, password });
      console.log('📥 Response data:', data);

      if (data.success) {
        localStorage.setItem('authToken', data.token);
        setUser({ username: data.admin.username });
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error details:', {
        name: error.name,
        message: error.message
      });
      return { success: false, error: `Network error: ${error.message}` };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 