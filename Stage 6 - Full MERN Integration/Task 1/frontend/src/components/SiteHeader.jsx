import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SiteHeader = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return (
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 text-gray-900 font-bold text-xl hover:opacity-80 transition-opacity">
              <span className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-md text-lg">📝</span>
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">BlogSpace</span>
            </Link>
            <Link to="/" className="btn btn-ghost btn-sm">← Back</Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 text-gray-900 font-bold text-xl hover:opacity-80 transition-opacity">
            <span className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-md text-lg">
              📝
            </span>
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">BlogSpace</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#blog-posts-section" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors relative group">
              Browse
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <Link to="/create-post" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors relative group">
              Write
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Log in
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Get started free
                </Link>
              </>
            ) : (
              <>
                {user?.role === 'user' && (
                  <Link to="/dashboard" className="btn btn-ghost btn-sm">
                    Dashboard
                  </Link>
                )}
                <button onClick={logout} className="btn btn-ghost btn-sm text-error-600 hover:bg-error-50">
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 animate-slide-down">
              <nav className="flex flex-col space-y-1">
              <a 
                href="#blog-posts-section" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Browse Articles
              </a>
              <Link 
                to="/create-post" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Write Post
              </Link>
              
              
              <div className="pt-4 mt-2 border-t border-gray-200 space-y-1">
                {!isAuthenticated ? (
                  <>
                    <Link 
                      to="/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Log in
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-lg transition-all text-center shadow-sm"
                    >
                      Get started free
                    </Link>
                  </>
                ) : (
                  <>
                    {user?.role === 'user' && (
                      <Link 
                        to="/dashboard" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }} 
                      className="w-full text-left px-4 py-3 text-sm font-medium text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default SiteHeader;
