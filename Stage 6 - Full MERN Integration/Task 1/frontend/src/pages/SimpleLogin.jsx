import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SiteLayout from '../components/SiteLayout';

const SimpleLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Check user role and redirect accordingly
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <SiteLayout>
      <div className="container-custom py-16 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-auto shadow-lg rounded-lg overflow-hidden bg-white">
          <div className="p-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-500">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg p-3 border border-red-200 bg-red-50 text-red-700 mb-4">{error}</div>
              )}
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input id="email" name="email" type="email" required placeholder="Enter your email" value={formData.email} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input id="password" name="password" type="password" required placeholder="Enter your password" value={formData.password} onChange={handleChange} className="form-input" />
              </div>
              <button type="submit" disabled={loading} className="btn w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-all duration-200" style={{ marginBottom: '1rem' }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="loading spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full"></div>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
};

export default SimpleLogin;
