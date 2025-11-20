import { Link } from 'react-router-dom';

const LoginPrompt = ({ message = "You need to be logged in to access this feature" }) => {
  return (
    <div className="container-custom py-16">
      <div className="max-w-md mx-auto card text-center">
        <div className="mb-3 text-3xl">🔒</div>
        <h2 className="text-xl font-semibold mb-2">Login Required</h2>
        <p className="text-gray-600 mb-4">{message}</p>

        <div className="mb-4">
          <p className="text-sm text-gray-700">
            <strong>New to BlogSpace?</strong> Create an account to start writing and sharing your stories.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Link to="/login" className="btn btn-sm">Sign In</Link>
          <Link to="/register" className="btn btn-secondary btn-sm">Sign Up</Link>
        </div>

        <div className="mt-4">
          <Link to="/" className="navbar-link">Browse posts on homepage →</Link>
        </div>
        <div className="mt-1">
          <Link to="/" className="navbar-link">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;
