import axios from 'axios';
import toast from 'react-hot-toast';
import { getCookie, setCookie, removeCookie } from './cookieUtils';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors and renew tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    if (status === 401 && !error.config?._retry) {
      try {
        error.config._retry = true;
        const refreshToken = getCookie('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        const response = await axios.post(
          `${axiosInstance.defaults.baseURL}/auth/refresh-token`,
          { token: refreshToken }
        );
        const { token, refreshToken: newRefreshToken } = response.data;
        setCookie('adminToken', token);
        setCookie('refreshToken', newRefreshToken);
        error.config.headers = {
          ...(error.config.headers || {}),
          Authorization: `Bearer ${token}`
        };
        return axiosInstance(error.config);
      } catch (refreshError) {
        removeCookie('adminToken');
        removeCookie('refreshToken');
        window.location.href = '/admin/login';
        toast.error('Session expired. Please login again.');
      }
    } else if (status === 403) {
      toast.error('Access denied. Admin privileges required.');
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
