import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import Loader from '../components/Loader';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    window.location.href = 'http://localhost:5173/login';
    return null;
  }

  return children;
};

export default AdminProtectedRoute;
