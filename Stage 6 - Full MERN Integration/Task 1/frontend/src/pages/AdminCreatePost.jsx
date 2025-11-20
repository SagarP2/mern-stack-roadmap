import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

const AdminCreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    introduction: '',
    content: '',
    conclusion: '',
    callToAction: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/admin/posts', formData);
      setSuccess('Post created successfully!');
      setFormData({ title: '', introduction: '', content: '', conclusion: '', callToAction: '' });
      
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <Link to="/admin/dashboard" className="navbar-brand">BlogSpace Admin</Link>
            <Link to="/admin/dashboard" className="btn btn-secondary btn-sm">← Back to Dashboard</Link>
          </div>
        </div>
      </nav>

      {/* Form Content */}
      <div className="container" style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card">
            <div className="text-center mb-4">
              <h1>Create New Post (Admin)</h1>
              <p>Create a new blog post as an administrator</p>
            </div>

            {error && (
              <div className="card" style={{ backgroundColor: '#f8d7da', borderColor: '#f5c6cb', color: '#721c24', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            {success && (
              <div className="card" style={{ backgroundColor: '#d4edda', borderColor: '#c3e6cb', color: '#155724', marginBottom: '1rem' }}>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Post Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter post title..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="introduction" className="form-label">
                  Introduction
                </label>
                <textarea
                  id="introduction"
                  name="introduction"
                  value={formData.introduction}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Write a brief introduction..."
                  className="form-input form-textarea"
                />
              </div>

              <div className="form-group">
                <label htmlFor="content" className="form-label">
                  Main Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={12}
                  required
                  placeholder="Write the main content here..."
                  className="form-input form-textarea"
                />
              </div>

              <div className="form-group">
                <label htmlFor="conclusion" className="form-label">
                  Conclusion
                </label>
                <textarea
                  id="conclusion"
                  name="conclusion"
                  value={formData.conclusion}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Wrap up your thoughts..."
                  className="form-input form-textarea"
                />
              </div>

              <div className="form-group">
                <label htmlFor="callToAction" className="form-label">
                  Call to Action
                </label>
                <input
                  type="text"
                  id="callToAction"
                  name="callToAction"
                  value={formData.callToAction}
                  onChange={handleChange}
                  placeholder="e.g., Follow for more, Leave a comment..."
                  className="form-input"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/admin/dashboard')}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.title.trim() || !formData.content.trim()}
                  className="btn"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="loading"></div>
                      Creating...
                    </span>
                  ) : (
                    'Create Post'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreatePost;
