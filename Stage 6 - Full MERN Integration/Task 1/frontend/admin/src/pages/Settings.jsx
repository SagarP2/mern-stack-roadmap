import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Palette,
  Save,
  Eye,
  EyeOff,
  Moon,
  Sun
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminData } from '../context/AdminDataContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateProfile, changePassword } = useAdminAuth();
  const { theme, toggleTheme } = useAdminData();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    securityAlerts: true
  });

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationChange = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await updateProfile(profileData);
    
    if (result.success) {
      toast.success('Profile updated successfully');
    }
    
    setLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
    
    if (result.success) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    
    setLoading(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors
                    ${activeTab === tab.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-r-2 border-primary-600'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="card">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Profile Information
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Update your account profile information and email address.
                  </p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">
                        {profileData.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn-secondary text-sm"
                      >
                        Change Avatar
                      </button>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        JPG, GIF or PNG. 1MB max.
                      </p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      rows={4}
                      className="input-field resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Security Settings
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Update your password and security preferences.
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="input-field pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="input-field pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="input-field pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{loading ? 'Updating...' : 'Update Password'}</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Notification Preferences
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose how you want to be notified about activity.
                  </p>
                </div>

                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {key === 'emailNotifications' && 'Receive email notifications for important updates'}
                          {key === 'pushNotifications' && 'Get push notifications in your browser'}
                          {key === 'weeklyDigest' && 'Weekly summary of your blog activity'}
                          {key === 'securityAlerts' && 'Important security and login alerts'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange(key)}
                        className={`
                          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                          ${value ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}
                        `}
                      >
                        <span
                          className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                            ${value ? 'translate-x-6' : 'translate-x-1'}
                          `}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => toast.success('Notification preferences saved')}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Preferences</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Appearance Settings
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Customize the look and feel of your admin panel.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Theme Selection */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Theme
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => theme === 'dark' && toggleTheme()}
                        className={`
                          p-4 rounded-lg border-2 transition-colors
                          ${theme === 'light'
                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <Sun className="w-6 h-6 text-yellow-500" />
                          <div className="text-left">
                            <p className="font-medium text-gray-900 dark:text-white">Light</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Clean and bright</p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => theme === 'light' && toggleTheme()}
                        className={`
                          p-4 rounded-lg border-2 transition-colors
                          ${theme === 'dark'
                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <Moon className="w-6 h-6 text-blue-500" />
                          <div className="text-left">
                            <p className="font-medium text-gray-900 dark:text-white">Dark</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Easy on the eyes</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Color Scheme Preview */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Color Preview
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                      {['bg-primary-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'].map((color, index) => (
                        <div key={index} className={`h-12 rounded-lg ${color}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
