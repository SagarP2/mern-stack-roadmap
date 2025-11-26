import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  Calendar,
  Clock,
  Eye,
  Edit
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { LineChartComponent, BarChartComponent, PieChartComponent } from '../components/Chart';
import { useAdminData } from '../context/AdminDataContext';

const Dashboard = () => {
  const { 
    dashboardStats, 
    fetchDashboardStats, 
    loading 
  } = useAdminData();

  const [recentActivity] = useState([
    { id: 1, action: 'New blog post created', user: 'John Doe', time: '2 minutes ago', type: 'create' },
    { id: 2, action: 'User registered', user: 'Jane Smith', time: '15 minutes ago', type: 'user' },
    { id: 3, action: 'Blog post updated', user: 'Admin', time: '1 hour ago', type: 'update' },
    { id: 4, action: 'Comment posted', user: 'Mike Johnson', time: '2 hours ago', type: 'comment' },
    { id: 5, action: 'User role updated', user: 'Admin', time: '3 hours ago', type: 'role' },
  ]);

  // Sample chart data
  const blogStatsData = [
    { month: 'Jan', blogs: 12, views: 1200 },
    { month: 'Feb', blogs: 19, views: 1900 },
    { month: 'Mar', blogs: 15, views: 1500 },
    { month: 'Apr', blogs: 22, views: 2200 },
    { month: 'May', blogs: 28, views: 2800 },
    { month: 'Jun', blogs: 35, views: 3500 },
  ];

  const userRoleData = [
    { name: 'Users', value: dashboardStats.totalUsers - 1 || 45 },
    { name: 'Admins', value: 1 },
  ];

  const topBlogsData = [
    { title: 'Getting Started with React', views: 1250 },
    { title: 'Advanced JavaScript Tips', views: 980 },
    { title: 'CSS Grid Layout Guide', views: 750 },
    { title: 'Node.js Best Practices', views: 650 },
  ];

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'create': return <FileText className="w-4 h-4" />;
      case 'update': return <Edit className="w-4 h-4" />;
      case 'user': return <Users className="w-4 h-4" />;
      case 'comment': return <MessageSquare className="w-4 h-4" />;
      case 'role': return <Users className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'create': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'update': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'user': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'comment': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'role': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-4 xs:space-y-5 sm:space-y-6">
      {/* Mobile Search Bar - Only visible on mobile/tablet */}
      <div className="md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search blogs, users..."
            className="pl-10 pr-4 py-2.5 w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all duration-200"
          />
        </div>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl xs:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs xs:text-sm">
            Welcome back! Here&apos;s what&apos;s happening with your blog.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs xs:text-sm text-gray-500 dark:text-gray-400 w-full sm:w-auto">
          <Calendar className="w-3.5 h-3.5 xs:w-4 xs:h-4 flex-shrink-0" />
          <span className="truncate">{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Top Blogs - Uploaded Posts Section (Shown First) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h3 className="text-base xs:text-lg font-semibold text-gray-900 dark:text-white mb-3 xs:mb-4">
          Top Performing Blogs
        </h3>
        <div className="space-y-3 xs:space-y-4">
          {topBlogsData.map((blog, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center justify-between p-2 xs:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors gap-2 xs:gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white truncate">
                  {blog.title}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <Eye className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {blog.views.toLocaleString()} views
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <div className="w-12 xs:w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(blog.views / 1250) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
        <StatsCard
          title="Total Blogs"
          value={dashboardStats.totalPosts || 0}
          change={12.5}
          changeType="increase"
          icon={FileText}
          color="primary"
          loading={loading}
        />
        <StatsCard
          title="Total Users"
          value={dashboardStats.totalUsers || 0}
          change={8.2}
          changeType="increase"
          icon={Users}
          color="success"
          loading={loading}
        />
        <StatsCard
          title="Published Posts"
          value={dashboardStats.publishedPosts || 0}
          change={5.1}
          changeType="increase"
          icon={Eye}
          color="info"
          loading={loading}
        />
        <StatsCard
          title="Total Views"
          value="12.5K"
          change={15.3}
          changeType="increase"
          icon={TrendingUp}
          color="warning"
          loading={loading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-5 sm:gap-6">
        {/* Blog Stats Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <LineChartComponent
            data={blogStatsData}
            xKey="month"
            yKey="blogs"
            title="Blog Posts Over Time"
            color="#3b82f6"
            height={300}
          />
        </motion.div>

        {/* User Roles Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <PieChartComponent
            data={userRoleData}
            dataKey="value"
            nameKey="name"
            title="User Roles Distribution"
            height={300}
          />
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h3 className="text-base xs:text-lg font-semibold text-gray-900 dark:text-white mb-3 xs:mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3 xs:space-y-4">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center space-x-2 xs:space-x-3 p-2 xs:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className={`p-1.5 xs:p-2 rounded-full ${getActivityColor(activity.type)} flex-shrink-0`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white truncate">
                  {activity.action}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  by {activity.user}
                </p>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                {activity.time}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Monthly Overview Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <BarChartComponent
          data={blogStatsData}
          xKey="month"
          yKey="views"
          title="Monthly Blog Views"
          color="#10b981"
          height={350}
        />
      </motion.div>
    </div>
  );
};

export default Dashboard;
