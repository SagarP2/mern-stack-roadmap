import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const userData = localStorage.getItem('adminUser');
      
      if (token && userData) {
        try {
          // Verify token with backend
          const response = await axiosInstance.get('/auth/me');
          
          if (response.data.user && response.data.user.role === 'admin') {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            // User is not admin, clear storage
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (apiError) {
          // API call failed, but we have local data - use it temporarily
          console.log('API verification failed, using local data');
          const parsedUser = JSON.parse(userData);
          if (parsedUser.role === 'admin') {
            setUser(parsedUser);
            setIsAuthenticated(true);
          }
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // Clear invalid data
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/auth/login', { email, password });
      
      const { token, user: userData } = response.data;
      
      // Check if user is admin
      if (userData.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        return { success: false, error: 'Access denied' };
      }
      
      // Store token and user data
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axiosInstance.put('/admin/profile', profileData);
      const updatedUser = response.data.user;
      
      setUser(updatedUser);
      localStorage.setItem('adminUser', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await axiosInstance.put('/admin/change-password', {
        currentPassword,
        newPassword
      });
      
      toast.success('Password changed successfully');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateProfile,
    changePassword,
    checkAuthStatus
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
