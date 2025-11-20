import axios from 'axios';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    import { getCookie } from './cookieUtils';

const token = getCookie('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const refreshToken = getCookie('refreshToken');
        const response = await axios.post('/auth/refresh-token', { token: refreshToken });
        const { token, refreshToken: newRefreshToken } = response.data;
        setCookie('adminToken', token);
        setCookie('refreshToken', newRefreshToken);
        error.config.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(error.config);
      } catch (refreshError) {
        removeCookie('adminToken');
        removeCookie('refreshToken');
        window.location.href = '/admin/login';
        toast.error('Session expired. Please login again.');
      }
    }
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and renew tokens
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      removeCookie('adminToken');
      removeCookie('adminUser');
      window.location.href = '/admin/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('Access denied. Admin privileges required.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
