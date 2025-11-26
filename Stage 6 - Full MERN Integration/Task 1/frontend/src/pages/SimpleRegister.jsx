import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SiteLayout from '../components/SiteLayout';
import Button from '../components/ui/Button';

const FIELD =
  'w-full rounded-2xl border border-ink-700 bg-ink-900/40 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300/50';

const SimpleRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, isAuthenticated } = useAuth();
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <SiteLayout>
      <div className="flex min-h-[70vh] xs:min-h-[75vh] sm:min-h-[80vh] items-center justify-center py-6 xs:py-8 sm:py-10">
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl rounded-2xl sm:rounded-3xl border border-ink-800 bg-ink-900/70 p-5 xs:p-6 sm:p-8 shadow-card">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] xs:tracking-[0.4em] text-slate-500">Join the community</p>
            <h1 className="mt-2 text-2xl xs:text-3xl font-semibold text-white px-2">Create your BlogSpace account</h1>
            <p className="mt-2 text-xs xs:text-sm text-slate-400 px-2">
              Publish premium stories, manage followers, and collaborate with editors.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 xs:mt-8 grid gap-4 xs:gap-5 sm:grid-cols-2">
            {error && (
              <div className="sm:col-span-2 rounded-xl sm:rounded-2xl border border-red-500/40 bg-red-500/10 px-3 xs:px-4 py-2.5 xs:py-3 text-xs xs:text-sm text-red-200">
                {error}
              </div>
            )}

            <label className="text-xs xs:text-sm text-slate-300 sm:col-span-2">
              Full name
              <input
                type="text"
                name="name"
                required
                placeholder="Ada Lovelace"
                value={formData.name}
                onChange={handleChange}
                className={`${FIELD} mt-2`}
              />
            </label>

            <label className="text-xs xs:text-sm text-slate-300 sm:col-span-2">
              Email address
              <input
                type="email"
                name="email"
                required
                placeholder="you@email.com"
                value={formData.email}
                onChange={handleChange}
                className={`${FIELD} mt-2`}
              />
            </label>

            <label className="text-xs xs:text-sm text-slate-300">
              Password
              <input
                type="password"
                name="password"
                required
                placeholder="•••••••"
                value={formData.password}
                onChange={handleChange}
                className={`${FIELD} mt-2`}
              />
            </label>

            <label className="text-xs xs:text-sm text-slate-300">
              Confirm password
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`${FIELD} mt-2`}
              />
            </label>

            <Button type="submit" className="sm:col-span-2 w-full justify-center" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-300 border-t-transparent" />
                  Creating account…
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <p className="mt-5 xs:mt-6 text-center text-xs xs:text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-300 hover:text-blue-200 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </SiteLayout>
  );
};

export default SimpleRegister;
