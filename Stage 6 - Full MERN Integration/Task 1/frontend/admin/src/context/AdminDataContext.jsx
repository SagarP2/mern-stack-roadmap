import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AdminDataContext = createContext();

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within AdminDataProvider');
  }
  return context;
};

export const AdminDataProvider = ({ children }) => {
  const [dashboardStats, setDashboardStats] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Theme management
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('adminTheme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('adminTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Dashboard Analytics
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/stats/dashboard');
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Blog Management
  const fetchBlogs = async (params = {}) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/posts', { params });
      setBlogs(response.data.posts || []);
      return response.data;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return { posts: [], totalPages: 0 };
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async (blogData) => {
    try {
      const response = await axiosInstance.post('/admin/posts', blogData);
      await fetchBlogs(); // Refresh list
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to create blog' };
    }
  };

  const getBlog = async (id) => {
    try {
      const response = await axiosInstance.get(`/admin/posts/${id}`);
      return response.data.post || response.data;
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  };

  const updateBlog = async (id, blogData) => {
    try {
      const response = await axiosInstance.put(`/admin/posts/${id}`, blogData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update blog' };
    }
  };

  const deleteBlog = async (id) => {
    try {
      await axiosInstance.delete(`/admin/posts/${id}`);
      await fetchBlogs(); // Refresh list
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete blog' };
    }
  };

  // User Management
  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/users', { params });
      setUsers(response.data.users || []);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return { users: [], totalPages: 0 };
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      await axiosInstance.put(`/admin/users/${userId}/role`, { role });
      await fetchUsers(); // Refresh list
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update user role' };
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      await fetchUsers(); // Refresh list
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete user' };
    }
  };

  // Feedback Management
  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/feedback');
      setFeedback(response.data.feedback || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedback = async (id) => {
    try {
      await axiosInstance.delete(`/admin/feedback/${id}`);
      await fetchFeedback(); // Refresh list
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete feedback' };
    }
  };

  // Activity Logs
  const fetchActivityLogs = async (params = {}) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/activity', { params });
      setActivityLogs(response.data.logs || []);
      return response.data;
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return { logs: [], totalPages: 0 };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    // Theme
    theme,
    toggleTheme,
    
    // Loading state
    loading,
    
    // Dashboard
    dashboardStats,
    fetchDashboardStats,
    
    // Blogs
    blogs,
    fetchBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    
    // Users
    users,
    fetchUsers,
    updateUserRole,
    deleteUser,
    
    // Feedback
    feedback,
    fetchFeedback,
    deleteFeedback,
    
    // Activity Logs
    activityLogs,
    fetchActivityLogs,
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};
