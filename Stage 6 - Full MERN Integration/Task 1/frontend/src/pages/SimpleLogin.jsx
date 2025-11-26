import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SiteLayout from '../components/SiteLayout';
import Button from '../components/ui/Button';

const FIELD_STYLES =
  'w-full rounded-2xl border border-ink-700 bg-ink-900/40 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300/50';

export default function SimpleLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    if (result.success) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <SiteLayout>
      <div className="flex min-h-[70vh] xs:min-h-[75vh] sm:min-h-[80vh] items-center justify-center py-6 xs:py-8 sm:py-10">
        <div className="w-full max-w-md lg:max-w-lg rounded-2xl sm:rounded-3xl border border-ink-800 bg-ink-900/70 p-5 xs:p-6 sm:p-8 shadow-card">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] xs:tracking-[0.4em] text-slate-500">Welcome back</p>
            <h1 className="mt-2 text-2xl xs:text-3xl font-semibold text-white">Sign in to BlogSpace</h1>
            <p className="mt-2 text-xs xs:text-sm text-slate-400 px-2">
              Manage your posts and connect with readers across the platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 xs:mt-8 space-y-4 xs:space-y-5">
            {error && (
              <div className="rounded-xl sm:rounded-2xl border border-red-500/40 bg-red-500/10 px-3 xs:px-4 py-2.5 xs:py-3 text-xs xs:text-sm text-red-200">
                {error}
              </div>
            )}

            <label className="block text-xs xs:text-sm text-slate-300">
              Email address
              <input
                type="email"
                name="email"
                required
                placeholder="you@email.com"
                value={formData.email}
                onChange={handleChange}
                className={`${FIELD_STYLES} mt-2`}
              />
            </label>

            <label className="block text-xs xs:text-sm text-slate-300">
              Password
              <input
                type="password"
                name="password"
                required
                placeholder="•••••••"
                value={formData.password}
                onChange={handleChange}
                className={`${FIELD_STYLES} mt-2`}
              />
            </label>

            <Button type="submit" className="w-full justify-center" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-300 border-t-transparent" />
                  Signing in…
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="mt-5 xs:mt-6 text-center text-xs xs:text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-blue-300 hover:text-blue-200 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
