import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';

const navItems = [{ label: 'Stories', href: '#blog-posts-section' }];

export default function SiteHeader() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleNavClick = () => setOpen(false);

  const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
  const onUserDashboard = location.pathname === '/dashboard';

  const renderAuthButtons = (isMobile = false) =>
    !isAuthenticated ? (
      <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center gap-2 sm:gap-3'}`}>
        <Button
          variant="ghost"
          className={isMobile ? 'w-full justify-center border border-ink-700' : 'text-xs sm:text-sm px-3 sm:px-4'}
          onClick={() => handleNavClick()}
          as={Link}
          to="/login"
        >
          Log in
        </Button>
        <Button
          className={isMobile ? 'w-full justify-center' : 'text-xs sm:text-sm px-3 sm:px-4'}
          onClick={() => handleNavClick()}
          as={Link}
          to="/register"
        >
          Join free
        </Button>
      </div>
    ) : (
      <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center gap-2 sm:gap-3'}`}>
        <Button
          variant="ghost"
          className={isMobile ? 'w-full justify-center' : 'text-xs sm:text-sm px-3 sm:px-4'}
          as={Link}
          to={onUserDashboard && user?.role !== 'admin' ? '/' : dashboardPath}
          onClick={handleNavClick}
        >
          {onUserDashboard && user?.role !== 'admin' ? 'View Site' : 'Dashboard'}
        </Button>
        <Button
          variant="secondary"
          className={isMobile ? 'w-full justify-center' : 'text-xs sm:text-sm px-3 sm:px-4'}
          onClick={() => {
            logout();
            handleNavClick();
          }}
        >
          Logout
        </Button>
      </div>
    );

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-900/80 backdrop-blur overflow-x-hidden">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-4 lg:px-8 gap-2 sm:gap-4">
        {/* Logo - Responsive */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink-0">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-400/20 text-base sm:text-xl shadow-glow flex-shrink-0">
            ✦
          </div>
          <div className="hidden min-[375px]:block min-w-0">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-400 truncate">
              BlogSpace
            </p>
            <p className="text-sm sm:text-base font-semibold text-slate-100 truncate">
              Stories that glow
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm text-slate-300">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={handleNavClick}
              className={`transition hover:text-blue-200 whitespace-nowrap ${
                location.hash === item.href ? 'text-blue-200 border-b-2 border-blue-300 pb-1' : ''
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex flex-shrink-0">{renderAuthButtons()}</div>

        {/* Mobile Hamburger Menu */}
        <button
          type="button"
          className="lg:hidden rounded-lg sm:rounded-xl border border-ink-700 p-2 text-slate-100 flex-shrink-0 hover:bg-ink-800 transition-colors"
          aria-label="Toggle menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className="lg:hidden border-t border-ink-800 bg-ink-900/95 px-3 sm:px-4 pb-4 sm:pb-6 pt-3 sm:pt-4 text-sm text-slate-200 max-h-[calc(100vh-3.5rem)] overflow-y-auto overflow-x-hidden">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={handleNavClick}
                className="block rounded-lg sm:rounded-xl px-3 py-2 text-slate-200 transition hover:bg-ink-800 active:bg-ink-700"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 sm:mt-6">{renderAuthButtons(true)}</div>
        </div>
      )}
    </header>
  );
}
