import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('gateway_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/profile');
          setUser(res.data.data);
        } catch (error) {
          console.error('Failed to load profile', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: userToken, ...userData } = res.data.data;
      
      localStorage.setItem('gateway_token', userToken);
      setToken(userToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid email or password'
      };
    }
  };

  // Register handler
  const register = async (name, email, phone, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, phone, password });
      const { token: userToken, ...userData } = res.data.data;

      localStorage.setItem('gateway_token', userToken);
      setToken(userToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('gateway_token');
    setToken(null);
    setUser(null);
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      setUser(res.data.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed'
      };
    }
  };

  // Manage Address (Add / Edit)
  const saveAddress = async (addressData) => {
    try {
      const res = await api.post('/auth/address', addressData);
      setUser((prev) => ({ ...prev, address: res.data.data }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Address save failed'
      };
    }
  };

  // Delete Address
  const deleteAddress = async (addressId) => {
    try {
      const res = await api.delete(`/auth/address/${addressId}`);
      setUser((prev) => ({ ...prev, address: res.data.data }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Address deletion failed'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        saveAddress,
        deleteAddress,
        isAdmin: user && user.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
