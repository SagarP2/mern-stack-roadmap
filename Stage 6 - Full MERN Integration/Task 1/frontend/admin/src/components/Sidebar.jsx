import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  FileText,
  LogOut,
  X
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import toast from 'react-hot-toast';

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobile, setIsMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  // Only show Manage Users and Manage Posts as requested
  const menuItems = [
    { icon: Users, label: 'Manage Users', path: '/admin/users' },
    { icon: FileText, label: 'Manage Posts', path: '/admin/blogs' },
  ];

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      window.location.href = 'http://localhost:5173/login';
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    // Close mobile sidebar when menu item is clicked
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path || 
           (path === '/admin/blogs' && location.pathname.startsWith('/admin/blogs'));
  };

  // Desktop sidebar animation variants
  const sidebarVariants = {
    expanded: { 
      width: '16rem', // 256px
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
    collapsed: { 
      width: '5rem', // 80px
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }
  };

  // Mobile sidebar slide animation variants
  const mobileSidebarVariants = {
    open: { 
      x: 0,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: { 
      x: '-100%',
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  // Overlay animation variants
  const overlayVariants = {
    open: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    closed: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const SidebarContent = ({ isMobileView = false }) => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <AnimatePresence mode="wait">
          {(!isCollapsed || isMobileView) && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 min-w-0"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">BA</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white truncate">Blog Admin</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Close button for mobile, collapse button for desktop */}
        {isMobileView ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            )}
          </motion.button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.path);
          
          return (
            <motion.button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-lg 
                transition-all duration-200 group relative
                ${isActive 
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon 
                className={`w-5 h-5 flex-shrink-0 ${
                  isActive 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-gray-500 dark:text-gray-400'
                }`} 
              />
              
              <AnimatePresence mode="wait">
                {(!isCollapsed || isMobileView) && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="font-medium text-left truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId={isMobileView ? "mobile-activeIndicator" : "desktop-activeIndicator"}
                  className="absolute right-0 top-0 bottom-0 w-1 bg-primary-600 rounded-l-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Tooltip for collapsed desktop state */}
              {isCollapsed && !isMobileView && (
                <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                  {item.label}
                </div>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          
          <AnimatePresence mode="wait">
            {(!isCollapsed || isMobileView) && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="font-medium text-left truncate"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>

          {/* Tooltip for collapsed desktop state */}
          {isCollapsed && !isMobileView && (
            <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
              Logout
            </div>
          )}
        </motion.button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Overlay - Click outside to close */}
      <AnimatePresence>
        {isMobile && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar - Only visible on mobile/tablet when open */}
      <AnimatePresence>
        {isMobile && (
          <motion.aside
            key="mobile-sidebar"
            variants={mobileSidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 flex flex-col w-[16rem] lg:hidden"
            style={{
              maxWidth: '100vw',
              overflowX: 'hidden'
            }}
          >
            <SidebarContent isMobileView={true} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Always visible on desktop */}
      <motion.aside
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        className="hidden lg:flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 relative"
        style={{
          maxWidth: '100vw',
          overflowX: 'hidden'
        }}
      >
        <SidebarContent isMobileView={false} />
      </motion.aside>
    </>
  );
};

export default Sidebar;
