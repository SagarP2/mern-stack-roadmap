import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PostDetails from "./pages/user/PostDetails";
import CreateEditPost from "./pages/user/CreateEditPost";
import Dashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManagePosts from "./pages/admin/ManagePosts";
import UserProfile from "./pages/user/UserProfile";
import UserDashboard from "./pages/user/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/dashboard" element={<ProtectedRoute message="Login required"><UserDashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute message="Login required"><UserProfile /></ProtectedRoute>} />
          <Route path="/create-post" element={<ProtectedRoute message="Login required"><CreateEditPost /></ProtectedRoute>} />
          <Route path="/edit-post/:id" element={<ProtectedRoute message="Login required"><CreateEditPost /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><Navigate to="/admin/dashboard" replace /></AdminRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
          <Route path="/admin/posts" element={<AdminRoute><ManagePosts /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
