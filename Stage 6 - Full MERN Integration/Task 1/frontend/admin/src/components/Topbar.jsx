import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  User,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminData } from '../context/AdminDataContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Topbar = ({ setIsMobileOpen }) => {
  const { user, logout } = useAdminAuth();
  const { theme, toggleTheme } = useAdminData();
  const navigate = useNavigate();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      window.location.href = 'http://localhost:5173/login';
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to blogs page with search query
      navigate(`/admin/blogs?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
    toast.success(`Switched to ${theme === 'light' ? 'dark' : 'light'} mode`);
  };

  const profileMenuItems = [
    {
      icon: User,
      label: 'My Profile',
      onClick: () => {
        navigate('/admin/settings');
        setIsProfileOpen(false);
      }
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => {
        navigate('/admin/settings');
        setIsProfileOpen(false);
      }
    },
    {
      icon: LogOut,
      label: 'Logout',
      onClick: handleLogout,
      className: 'text-red-600 dark:text-red-400'
    }
  ];

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs, users..."
                className="pl-10 pr-4 py-2 w-64 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all duration-200"
              />
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleThemeToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </motion.button>

          {/* Notifications */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </motion.button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || 'Admin User'}
                </p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name || 'Admin User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email || 'admin@example.com'}
                    </p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400 mt-1">
                      Administrator
                    </span>
                  </div>
                  
                  <div className="py-1">
                    {profileMenuItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={index}
                          whileHover={{ x: 4 }}
                          onClick={item.onClick}
                          className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
                            item.className || 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          } ${item.label === 'Logout' ? 'hover:bg-red-50 dark:hover:bg-red-900/20' : ''}`}
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          {item.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
