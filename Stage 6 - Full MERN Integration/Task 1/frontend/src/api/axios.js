import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  createAdmin: (adminData) => api.post('/auth/admin/create', adminData),
};

export const postsAPI = {
  getPosts: (params) => api.get('/posts', { params }),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (postData) => api.post('/posts', postData),
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/posts/${id}`),
  getUserPosts: (params) => api.get('/posts/my-posts', { params }),
};

export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
};

export const adminAPI = {
  // Stats
  getDashboardStats: () => api.get('/admin/stats/dashboard'),
  getUserStats: () => api.get('/admin/stats/users'),
  getPostStats: () => api.get('/admin/stats/posts'),
  
  // Users
  getAllUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Posts
  getAllPosts: (params) => api.get('/admin/posts', { params }),
  createPost: (postData) => api.post('/admin/posts', postData),
  updatePost: (id, postData) => api.put(`/admin/posts/${id}`, postData),
  updatePostStatus: (id, status) => api.put(`/admin/posts/${id}/status`, { status }),
  deletePost: (id) => api.delete(`/admin/posts/${id}`),
  
  // Profile
  getProfile: () => api.get('/admin/profile'),
  updateProfile: (profileData) => api.put('/admin/profile', profileData),
  changePassword: (passwordData) => api.put('/admin/change-password', passwordData),
  
  // Feedback
  getFeedback: (params) => api.get('/admin/feedback', { params }),
  deleteFeedback: (id) => api.delete(`/admin/feedback/${id}`),
  
  // Activity
  getActivityLogs: (params) => api.get('/admin/activity', { params }),
};

export const testAPI = {
  getEndpoints: () => api.get('/test/endpoints'),
  testDatabase: () => api.get('/test/database'),
  seedData: () => api.post('/test/seed'),
};

export default api;
