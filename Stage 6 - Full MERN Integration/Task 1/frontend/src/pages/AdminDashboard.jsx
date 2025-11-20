import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, postsRes] = await Promise.all([
        api.get('/admin/stats/dashboard'),
        api.get('/admin/users'),
        api.get('/admin/posts')
      ]);
      
      setStats(statsRes.data);
      setUsers(usersRes.data.users || []);
      setPosts(postsRes.data.posts || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will also delete all their posts.')) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await api.delete(`/admin/posts/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
      alert('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => 
        u._id === userId ? { ...u, role: newRole } : u
      ));
      alert('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div className="loading"></div>
        <p className="mt-2">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <Link to="/" className="navbar-brand">BlogSpace Admin</Link>
            <div className="flex gap-2 items-center">
              <span style={{ color: '#666', fontSize: '14px' }}>Welcome, {user?.name}</span>
              <Link to="/" className="btn btn-secondary btn-sm">View Site</Link>
              <button onClick={logout} className="btn btn-danger btn-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Dashboard Content */}
      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="mb-4">
          <h1>Admin Dashboard</h1>
          <p>Manage users, posts, and site content</p>
        </div>

        {/* Tab Navigation */}
        <div className="card mb-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`btn ${activeTab === 'overview' ? '' : 'btn-secondary'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`btn ${activeTab === 'users' ? '' : 'btn-secondary'}`}
              >
                Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={`btn ${activeTab === 'posts' ? '' : 'btn-secondary'}`}
              >
                Posts ({posts.length})
              </button>
            </div>
            <Link to="/admin/create-post" className="btn">
              + Create Post
            </Link>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-3">
            <div className="card">
              <h3 style={{ color: '#007bff', marginBottom: '10px' }}>Total Users</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '5px' }}>
                {stats.totalUsers || 0}
              </div>
              <p style={{ color: '#666', fontSize: '14px' }}>Registered users</p>
            </div>
            
            <div className="card">
              <h3 style={{ color: '#28a745', marginBottom: '10px' }}>Total Posts</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '5px' }}>
                {stats.totalPosts || 0}
              </div>
              <p style={{ color: '#666', fontSize: '14px' }}>Published posts</p>
            </div>
            
            <div className="card">
              <h3 style={{ color: '#ffc107', marginBottom: '10px' }}>Published</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '5px' }}>
                {stats.publishedPosts || 0}
              </div>
              <p style={{ color: '#666', fontSize: '14px' }}>Live posts</p>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card">
            <div className="flex justify-between items-center mb-3">
              <h3>User Management</h3>
              <div style={{ fontSize: '14px', color: '#666' }}>
                Total: {users.length} users
              </div>
            </div>
            {users.length === 0 ? (
              <div className="text-center" style={{ padding: '40px 20px' }}>
                <p>No users found.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Joined</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((tableUser) => (
                      <tr key={tableUser._id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                        <td style={{ padding: '12px' }}>{tableUser.name}</td>
                        <td style={{ padding: '12px' }}>{tableUser.email}</td>
                        <td style={{ padding: '12px' }}>
                          <div className="flex items-center gap-2">
                            <span 
                              style={{ 
                                padding: '2px 8px', 
                                borderRadius: '12px', 
                                fontSize: '12px', 
                                fontWeight: '500',
                                backgroundColor: tableUser.role === 'admin' ? '#dc3545' : '#007bff',
                                color: 'white'
                              }}
                            >
                              {tableUser.role.toUpperCase()}
                            </span>
                            <select
                              value={tableUser.role}
                              onChange={(e) => handleUpdateUserRole(tableUser._id, e.target.value)}
                              style={{ padding: '4px 8px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '12px' }}
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>
                        </td>
                        <td style={{ padding: '12px' }}>{formatDate(tableUser.createdAt)}</td>
                        <td style={{ padding: '12px' }}>
                          <button
                            onClick={() => handleDeleteUser(tableUser._id)}
                            className="btn btn-danger btn-sm"
                            disabled={tableUser._id === user?._id} // Prevent self-deletion
                            title={tableUser._id === user?._id ? "Cannot delete your own account" : "Delete user"}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="card">
            <h3 className="mb-3">Post Management</h3>
            {posts.length === 0 ? (
              <p>No posts found.</p>
            ) : (
              <div className="grid grid-1" style={{ gap: '1rem' }}>
                {posts.map((post) => (
                  <div key={post._id} className="card" style={{ padding: '16px' }}>
                    <div className="flex justify-between items-start">
                      <div style={{ flex: 1 }}>
                        <h4 style={{ marginBottom: '8px' }}>
                          <Link 
                            to={`/post/${post._id}`} 
                            style={{ color: '#333', textDecoration: 'none' }}
                          >
                            {post.title || post.heading}
                          </Link>
                        </h4>
                        <p style={{ color: '#666', marginBottom: '8px', fontSize: '14px' }}>
                          By {post.author?.name || 'Unknown'} • {formatDate(post.createdAt)}
                        </p>
                        <p style={{ color: '#888', fontSize: '12px' }}>
                          {post.introduction || (post.content?.length > 100 
                            ? `${post.content.substring(0, 100)}...` 
                            : post.content)}
                        </p>
                      </div>
                      <div className="flex gap-1" style={{ marginLeft: '16px' }}>
                        <Link 
                          to={`/post/${post._id}`} 
                          className="btn btn-sm btn-secondary"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
