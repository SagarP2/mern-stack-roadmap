import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import SiteLayout from '../components/SiteLayout';

const SimplePostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      setError('Post not found or failed to load');
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setDeleting(true);
      await api.delete(`/posts/${id}`);
      alert('Post deleted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="container-custom py-12 text-center">
          <div className="loading mx-auto"></div>
          <p className="mt-2">Loading post...</p>
        </div>
      </SiteLayout>
    );
  }

  if (error || !post) {
    return (
      <SiteLayout>
        <div className="container-custom py-12 text-center">
          <div className="card">
            <h3 className="text-lg font-semibold">Post not found</h3>
            <p className="text-gray-600">{error}</p>
            <Link to="/" className="btn mt-3">← Back to posts</Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const isAuthor = isAuthenticated && user && post.author && user._id === post.author._id;

  return (
    <SiteLayout>
      <div className="container-custom py-10">
        <article style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Post Header */}
          <div className="card mb-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                  By {post.author?.name || 'Anonymous'} • {formatDate(post.createdAt)}
                </div>
              </div>
            </div>
            
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: '1.2' }}>
              {post.title || post.heading}
            </h1>
          </div>

          {/* Post Body */}
          <div className="card">
            {post.introduction && (
              <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', marginBottom: '24px', borderLeft: '4px solid #007bff' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: '500', margin: '0' }}>
                  {post.introduction}
                </p>
              </div>
            )}
            
            <div style={{ fontSize: '1.1rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
              {post.mainBody || post.content}
            </div>
            
            {post.conclusion && (
              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e9ecef' }}>
                <h3 style={{ marginBottom: '16px' }}>Conclusion</h3>
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {post.conclusion}
                </div>
              </div>
            )}
            
            {post.callToAction && (
              <div style={{ marginTop: '32px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                <h4 style={{ marginBottom: '12px' }}>What's Next?</h4>
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {post.callToAction}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <Link to="/" className="btn btn-secondary">← Back</Link>
            {isAuthor && (
              <div className="flex gap-2">
                <Link to={`/edit-post/${post._id}`} className="btn">Edit</Link>
                <button onClick={handleDelete} disabled={deleting} className="btn btn-danger">
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        </article>
      </div>
    </SiteLayout>
  );
};

export default SimplePostDetails;
