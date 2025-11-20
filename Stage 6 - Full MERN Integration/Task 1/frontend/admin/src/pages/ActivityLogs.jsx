import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  Calendar,
  User,
  FileText,
  Edit,
  Trash2,
  UserPlus,
  Settings,
  Clock
} from 'lucide-react';
import Table from '../components/Table';
import { useAdminData } from '../context/AdminDataContext';

const ActivityLogs = () => {
  const { loading } = useAdminData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [pagination, setPagination] = useState({});

  // Sample activity logs data (replace with actual API data)
  const logsData = useMemo(() => ([
    {
      _id: '1',
      action: 'create_blog',
      description: 'Created new blog post "Getting Started with React"',
      user: { name: 'John Doe', email: 'john@example.com' },
      targetType: 'blog',
      targetId: 'blog_123',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      createdAt: new Date().toISOString(),
      severity: 'info'
    },
    {
      _id: '2',
      action: 'update_user_role',
      description: 'Updated user role from "user" to "admin" for Jane Smith',
      user: { name: 'Admin User', email: 'admin@example.com' },
      targetType: 'user',
      targetId: 'user_456',
      ipAddress: '192.168.1.2',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      severity: 'warning'
    },
    {
      _id: '3',
      action: 'delete_blog',
      description: 'Deleted blog post "Old Tutorial"',
      user: { name: 'Admin User', email: 'admin@example.com' },
      targetType: 'blog',
      targetId: 'blog_789',
      ipAddress: '192.168.1.2',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      severity: 'high'
    },
    {
      _id: '4',
      action: 'login',
      description: 'User logged into admin panel',
      user: { name: 'Jane Smith', email: 'jane@example.com' },
      targetType: 'auth',
      targetId: null,
      ipAddress: '192.168.1.3',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      createdAt: new Date(Date.now() - 10800000).toISOString(),
      severity: 'info'
    },
    {
      _id: '5',
      action: 'update_blog',
      description: 'Updated blog post "Advanced JavaScript Tips"',
      user: { name: 'Mike Johnson', email: 'mike@example.com' },
      targetType: 'blog',
      targetId: 'blog_101',
      ipAddress: '192.168.1.4',
      userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36',
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      severity: 'info'
    }
  ]), []);

  const filteredLogs = useMemo(() => (
    logsData.filter(log => {
      const matchesSearch = 
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAction = filterAction === 'all' || log.action === filterAction;
      const matchesUser = filterUser === 'all' || log.user.name === filterUser;
      let matchesDate = true;
      if (dateRange !== 'all') {
        const logDate = new Date(log.createdAt);
        const now = new Date();
        switch (dateRange) {
          case 'today':
            matchesDate = logDate.toDateString() === now.toDateString();
            break;
          case 'week': {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = logDate >= weekAgo;
            break;
          }
          case 'month': {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = logDate >= monthAgo;
            break;
          }
          default:
            break;
        }
      }
      return matchesSearch && matchesAction && matchesUser && matchesDate;
    })
  ), [logsData, searchTerm, filterAction, filterUser, dateRange]);

  useEffect(() => {
    setPagination({
      currentPage: 1,
      totalPages: Math.ceil(filteredLogs.length / 10),
      total: filteredLogs.length,
      limit: 10
    });
  }, [filteredLogs]);

  const handleSort = (sortData) => {
    setSortConfig(sortData);
  };

  

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'create_blog':
        return <FileText className="w-4 h-4" />;
      case 'update_blog':
        return <Edit className="w-4 h-4" />;
      case 'delete_blog':
        return <Trash2 className="w-4 h-4" />;
      case 'update_user_role':
        return <UserPlus className="w-4 h-4" />;
      case 'login':
        return <User className="w-4 h-4" />;
      case 'settings':
        return <Settings className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'create_blog':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'update_blog':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'delete_blog':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'update_user_role':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'login':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[severity]}`}>
        {severity}
      </span>
    );
  };

  const uniqueUsers = [...new Set(logsData.map(log => log.user.name))];
  const uniqueActions = [...new Set(logsData.map(log => log.action))];

  const columns = [
    {
      key: 'action',
      title: 'Action',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${getActionColor(value)}`}>
            {getActionIcon(value)}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </p>
            {getSeverityBadge(row.severity)}
          </div>
        </div>
      )
    },
    {
      key: 'description',
      title: 'Description',
      render: (value) => (
        <p className="text-sm text-gray-900 dark:text-white max-w-md truncate">
          {value}
        </p>
      )
    },
    {
      key: 'user',
      title: 'User',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-xs">
              {value.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {value.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {value.email}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'createdAt',
      title: 'Date & Time',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900 dark:text-white">
            {formatDate(value)}
          </span>
        </div>
      )
    },
    {
      key: 'ipAddress',
      title: 'IP Address',
      render: (value) => (
        <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
          {value}
        </span>
      )
    }
  ];

  

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Activity Logs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor all admin actions and system activities
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={handleSearch}
              className="input-field pl-10"
            />
          </div>

          {/* Action Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="input-field"
            >
              <option value="all">All Actions</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>
                  {action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* User Filter */}
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="input-field"
          >
            <option value="all">All Users</option>
            {uniqueUsers.map(userName => (
              <option key={userName} value={userName}>
                {userName}
              </option>
            ))}
          </select>

          {/* Date Range Filter */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input-field"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Total Activities
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
            {filteredLogs.length}
          </p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-900 dark:text-green-100">
              Blog Actions
            </span>
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
            {filteredLogs.filter(log => log.targetType === 'blog').length}
          </p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
              User Actions
            </span>
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
            {filteredLogs.filter(log => log.targetType === 'user').length}
          </p>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-red-900 dark:text-red-100">
              High Priority
            </span>
          </div>
          <p className="text-2xl font-bold text-red-900 dark:text-red-100 mt-1">
            {filteredLogs.filter(log => log.severity === 'high').length}
          </p>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="card p-0">
        <Table
          columns={columns}
          data={filteredLogs}
          loading={loading}
          pagination={pagination}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      </div>
    </div>
  );
};

export default ActivityLogs;
