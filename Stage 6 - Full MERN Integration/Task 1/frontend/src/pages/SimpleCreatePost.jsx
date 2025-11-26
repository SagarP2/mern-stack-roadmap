import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import SiteLayout from '../components/SiteLayout';
import Button from '../components/ui/Button';

const FIELD =
  'w-full rounded-2xl border border-ink-800 bg-ink-900/50 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300/50';

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
      <div className="mx-auto max-w-4xl space-y-5 xs:space-y-6 rounded-2xl sm:rounded-3xl border border-ink-800 bg-ink-900/60 p-4 xs:p-6 sm:p-8 shadow-card">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] xs:tracking-[0.4em] text-slate-500">
            {id ? 'Edit post' : 'Create post'}
          </p>
          <h1 className="mt-2 text-2xl xs:text-3xl font-semibold text-white px-2">
            {id ? 'Update your story' : 'Share a new story'}
          </h1>
          <p className="mt-2 text-xs xs:text-sm text-slate-400 px-2">
            Use the structured sections to keep long-form content readable.
          </p>
        </div>

        {error && (
          <div className="rounded-xl sm:rounded-2xl border border-red-500/40 bg-red-500/10 px-3 xs:px-4 py-2.5 xs:py-3 text-xs xs:text-sm text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl sm:rounded-2xl border border-success/40 bg-success/10 px-3 xs:px-4 py-2.5 xs:py-3 text-xs xs:text-sm text-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 xs:space-y-6">
          <div>
            <label htmlFor="title" className="text-xs xs:text-sm text-slate-300">
              Post title<span className="text-danger">*</span>
            </label>
            <input
              id="title"
              name="title"
              required
              placeholder="Designing for dark mode in 2025"
              value={formData.title}
              onChange={handleChange}
              className={`${FIELD} mt-2`}
            />
          </div>

          <div>
            <label htmlFor="introduction" className="text-xs xs:text-sm text-slate-300">
              Introduction
            </label>
            <textarea
              id="introduction"
              name="introduction"
              rows={3}
              placeholder="Set the tone for your article..."
              value={formData.introduction}
              onChange={handleChange}
              className={`${FIELD} mt-2 min-h-[80px] xs:min-h-[100px]`}
            />
          </div>

          <div>
            <label htmlFor="content" className="text-xs xs:text-sm text-slate-300">
              Main content<span className="text-danger">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              rows={10}
              required
              placeholder="Write your long-form content here..."
              value={formData.content}
              onChange={handleChange}
              className={`${FIELD} mt-2 min-h-[200px] xs:min-h-[240px] sm:min-h-[280px]`}
            />
          </div>

          <div className="grid gap-4 xs:gap-5 sm:gap-6 grid-cols-1 md:grid-cols-2">
            <div>
              <label htmlFor="conclusion" className="text-xs xs:text-sm text-slate-300">
                Conclusion
              </label>
              <textarea
                id="conclusion"
                name="conclusion"
                rows={4}
                placeholder="Summarize the big takeaways..."
                value={formData.conclusion}
                onChange={handleChange}
                className={`${FIELD} mt-2 min-h-[100px] xs:min-h-[120px]`}
              />
            </div>
            <div>
              <label htmlFor="callToAction" className="text-xs xs:text-sm text-slate-300">
                Call to action
              </label>
              <textarea
                id="callToAction"
                name="callToAction"
                rows={4}
                placeholder="Invite readers to subscribe, comment, etc."
                value={formData.callToAction}
                onChange={handleChange}
                className={`${FIELD} mt-2 min-h-[100px] xs:min-h-[120px]`}
              />
            </div>
          </div>

          <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
            <Button as={Link} to="/" variant="ghost" className="justify-center w-full xs:w-auto">
              Cancel
            </Button>
            <Button
              type="submit"
              className="justify-center w-full xs:w-auto"
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
            >
              {loading ? (id ? 'Updating…' : 'Publishing…') : id ? 'Update Post' : 'Publish Post'}
            </Button>
          </div>
        </form>
      </div>
    </SiteLayout>
  );
};

export default SimpleCreatePost;
