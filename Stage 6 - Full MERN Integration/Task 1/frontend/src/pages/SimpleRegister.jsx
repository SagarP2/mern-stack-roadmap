import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SiteLayout from '../components/SiteLayout';

const SimpleRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
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
      <div className="container-custom py-16">
        <div className="max-w-md mx-auto">
          <div className="card">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold">Create Account</h2>
              <p className="text-gray-600">Start your blogging journey</p>
            </div>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg p-3 border border-red-200 bg-red-50 text-red-700 mb-4">{error}</div>
              )}
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input id="name" name="name" type="text" required placeholder="Enter your name" value={formData.name} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input id="email" name="email" type="email" required placeholder="Enter your email" value={formData.email} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input id="password" name="password" type="password" required placeholder="Create a password" value={formData.password} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" required placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} className="form-input" />
              </div>
              <button type="submit" disabled={loading} className="btn w-full" style={{ marginBottom: '1rem' }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="loading"></div>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
            <div className="text-center">
              <p>
                Already have an account? <Link to="/login" className="navbar-link" style={{ color: 'var(--primary)' }}>Sign in here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
};

export default SimpleRegister;
