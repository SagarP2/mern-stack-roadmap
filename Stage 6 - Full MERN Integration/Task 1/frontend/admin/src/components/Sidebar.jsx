import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Activity,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import toast from 'react-hot-toast';

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobile, setIsMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: FileText, label: 'Blogs', path: '/admin/blogs' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: MessageSquare, label: 'Feedback', path: '/admin/feedback' },
    { icon: Activity, label: 'Activity Logs', path: '/admin/activity' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

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
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path || 
           (path === '/admin/blogs' && location.pathname.startsWith('/admin/blogs'));
  };

  const sidebarVariants = {
    expanded: { width: '256px' },
    collapsed: { width: '80px' }
  };

  const mobileSidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={isMobile ? mobileSidebarVariants : sidebarVariants}
        animate={isMobile ? (isMobile ? 'open' : 'closed') : (isCollapsed ? 'collapsed' : 'expanded')}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50
          ${isMobile ? 'w-64' : ''}
          ${!isMobile ? 'lg:relative' : ''}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <AnimatePresence>
            {(!isCollapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">BA</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">Blog Admin</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Toggle Button */}
          {isMobile ? (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          ) : (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
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
                  w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-r-2 border-primary-600' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                
                <AnimatePresence>
                  {(!isCollapsed || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-3 font-medium text-left"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip for collapsed state */}
                {isCollapsed && !isMobile && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            
            <AnimatePresence>
              {(!isCollapsed || isMobile) && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-3 font-medium text-left"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>

            {/* Tooltip for collapsed state */}
            {isCollapsed && !isMobile && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
