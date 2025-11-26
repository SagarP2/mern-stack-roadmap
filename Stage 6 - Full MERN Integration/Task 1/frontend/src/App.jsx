import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import SimpleLanding from './pages/SimpleLanding';
import SimpleLogin from './pages/SimpleLogin';
import SimpleRegister from './pages/SimpleRegister';
import SimplePostDetails from './pages/SimplePostDetails';
import SimpleCreatePost from './pages/SimpleCreatePost';
import AdminDashboard from './pages/AdminDashboard';
import AdminPostsManagement from './pages/AdminPostsManagement';
import AdminUsersManagement from './pages/AdminUsersManagement';
import AdminCreatePost from './pages/AdminCreatePost';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SimpleLanding />} />
          <Route path="/login" element={<SimpleLogin />} />
          <Route path="/register" element={<SimpleRegister />} />
          <Route path="/post/:id" element={<SimplePostDetails />} />
          <Route path="/create-post" element={
            <ProtectedRoute>
              <SimpleCreatePost />
            </ProtectedRoute>
          } />
          <Route path="/edit-post/:id" element={
            <ProtectedRoute>
              <SimpleCreatePost />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/posts" element={
            <ProtectedRoute>
              <AdminPostsManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute>
              <AdminUsersManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/create-post" element={
            <ProtectedRoute>
              <AdminCreatePost />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;