import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminDataProvider } from './context/AdminDataContext';
import AdminProtectedRoute from './routes/AdminProtectedRoute';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import BlogManagement from './pages/BlogManagement';
import BlogEditor from './pages/BlogEditor';
import UserManagement from './pages/UserManagement';
import Feedback from './pages/Feedback';
import ActivityLogs from './pages/ActivityLogs';
import Settings from './pages/Settings';
// Layout component for admin pages
const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        isMobile={mobileMenuOpen}
        setIsMobileOpen={setMobileMenuOpen}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      }`}>
        {/* Topbar */}
        <Topbar setIsMobileOpen={setMobileMenuOpen} />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// App Routes Component - This needs to be inside the AuthProvider
const AppRoutes = () => {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* No separate admin login route; unauthenticated redirects to public login */}

      {/* Protected Admin Routes */}
      <Route path="/admin/dashboard" element={
        <AdminProtectedRoute>
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        </AdminProtectedRoute>
      } />

      <Route path="/admin/blogs" element={
        <AdminProtectedRoute>
          <AdminLayout>
            <BlogManagement />
          </AdminLayout>
        </AdminProtectedRoute>
      } />

      <Route path="/admin/blogs/create" element={
        <AdminProtectedRoute>
          <AdminLayout>
            <BlogEditor />
          </AdminLayout>
        </AdminProtectedRoute>
      } />

      <Route path="/admin/blogs/:id/edit" element={
        <AdminProtectedRoute>
          <AdminLayout>
            <BlogEditor />
          </AdminLayout>
        </AdminProtectedRoute>
      } />

      <Route path="/admin/users" element={
        <AdminProtectedRoute>
          <AdminLayout>
            <UserManagement />
          </AdminLayout>
        </AdminProtectedRoute>
      } />

      <Route path="/admin/feedback" element={
        <AdminProtectedRoute>
          <AdminLayout>
            <Feedback />
          </AdminLayout>
        </AdminProtectedRoute>
      } />

      <Route path="/admin/activity" element={
        <AdminProtectedRoute>
          <AdminLayout>
            <ActivityLogs />
          </AdminLayout>
        </AdminProtectedRoute>
      } />

      <Route path="/admin/settings" element={
        <AdminProtectedRoute>
          <AdminLayout>
            <Settings />
          </AdminLayout>
        </AdminProtectedRoute>
      } />

      {/* Test Route */}
      <Route path="/test" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel Test</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">If you can see this, the app is working!</p>
            <p className="text-sm text-gray-500 mt-4">
              Auth Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </p>
          </div>
        </div>
      } />

      {/* Redirects */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AdminAuthProvider>
        <AdminDataProvider>
          <Router>
            <div className="App">
              <AppRoutes />
              
              {/* Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                    border: '1px solid var(--toast-border)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#ffffff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#ffffff',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </AdminDataProvider>
      </AdminAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
