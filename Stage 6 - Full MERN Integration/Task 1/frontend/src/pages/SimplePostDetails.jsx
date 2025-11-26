import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import SiteLayout from '../components/SiteLayout';
import Button from '../components/ui/Button';

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

  const renderLoading = (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <span className="h-10 w-10 animate-spin rounded-full border-2 border-blue-300 border-t-transparent" />
      <p className="text-slate-400">Loading post…</p>
    </div>
  );

  const renderError = (
    <div className="rounded-3xl border border-red-500/40 bg-red-500/10 p-10 text-center text-red-100">
      <h3 className="text-2xl font-semibold">Post not found</h3>
      <p className="mt-2 text-sm">{error}</p>
      <Button as={Link} to="/" className="mt-6 justify-center">
        ← Back to posts
      </Button>
    </div>
  );

  if (loading) {
    return (
      <SiteLayout>
        {renderLoading}
      </SiteLayout>
    );
  }

  if (error || !post) {
    return (
      <SiteLayout>
        {renderError}
      </SiteLayout>
    );
  }

  const isAuthor = isAuthenticated && user && post.author && user._id === post.author._id;

  return (
    <SiteLayout>
      <article className="mx-auto max-w-4xl space-y-8">
        <header className="rounded-3xl border border-ink-800 bg-ink-900/70 p-8 shadow-card">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            By {post.author?.name || 'Anonymous'} • {formatDate(post.createdAt)}
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-white">{post.title || post.heading}</h1>
        </header>

        <section className="rounded-3xl border border-ink-800 bg-ink-900/70 p-8 shadow-card space-y-8">
          {post.introduction && (
            <div className="rounded-2xl border border-blue-400/30 bg-blue-400/10 p-5 text-base text-blue-200">
              {post.introduction}
            </div>
          )}
          <div className="prose prose-invert max-w-none text-slate-200">
            {(post.mainBody || post.content || '').split('\n').map((paragraph, idx) => (
              <p key={`${paragraph}-${idx}`}>{paragraph}</p>
            ))}
          </div>
          {post.conclusion && (
            <div className="border-t border-ink-800 pt-6">
              <h3 className="text-xl font-semibold text-white">Conclusion</h3>
              <p className="mt-3 text-slate-300 whitespace-pre-wrap">{post.conclusion}</p>
            </div>
          )}
          {post.callToAction && (
            <div className="rounded-2xl border border-ink-700 bg-ink-800/70 p-5">
              <h4 className="text-sm uppercase tracking-[0.3em] text-slate-400">What&apos;s next?</h4>
              <p className="mt-3 text-slate-200 whitespace-pre-wrap">{post.callToAction}</p>
            </div>
          )}
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button as={Link} to="/" variant="ghost" className="justify-center" onClick={() => navigate(-1)}>
            ← Back
          </Button>
          {isAuthor && (
            <div className="flex gap-3">
              <Button as={Link} to={`/edit-post/${post._id}`} variant="secondary">
                Edit
              </Button>
              <Button
                variant="ghost"
                className="border border-danger/60 text-danger hover:bg-danger/10"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          )}
        </div>
      </article>
    </SiteLayout>
  );
};

export default SimplePostDetails;
