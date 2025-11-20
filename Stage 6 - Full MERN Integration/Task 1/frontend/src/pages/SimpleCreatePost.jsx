import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import SiteLayout from '../components/SiteLayout';

const SimpleCreatePost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/posts/${id}`);
      const post = response.data;
      setFormData({
        title: post.title || '',
        introduction: post.introduction || '',
        content: post.content || '',
        conclusion: post.conclusion || '',
        callToAction: post.callToAction || ''
      });
    } catch (err) {
      setError('Failed to load post for editing');
    } finally {
      setLoading(false);
    }
  };

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
      const payload = {
        title: formData.title,
        content: formData.content,
        introduction: formData.introduction,
        conclusion: formData.conclusion,
        callToAction: formData.callToAction
      };

      let response;
      if (id) {
        response = await api.put(`/posts/${id}`, payload);
        setSuccess('Post updated successfully!');
      } else {
        response = await api.post('/posts', payload);
        setSuccess('Post created successfully!');
        setFormData({ title: '', introduction: '', content: '', conclusion: '', callToAction: '' });
      }

      setTimeout(() => {
        navigate(id ? `/post/${id}` : '/');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || (id ? 'Error updating post' : 'Error creating post'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <div className="container-custom py-10">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card">
            <div className="text-center mb-4">
              <h1>{id ? 'Edit Post' : 'Create New Post'}</h1>
              <p>Share your story with the world</p>
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
                  placeholder="Enter your post title..."
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
                  placeholder="Write your main content here..."
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
                <Link to="/" className="btn btn-secondary">Cancel</Link>
                <button
                  type="submit"
                  disabled={loading || !formData.title.trim() || !formData.content.trim()}
                  className="btn"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="loading"></div>
                      {id ? 'Updating...' : 'Publishing...'}
                    </span>
                  ) : (
                    id ? 'Update Post' : 'Publish Post'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
};

export default SimpleCreatePost;
