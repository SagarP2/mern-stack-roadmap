import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Trash2, 
  Shield,
  User,
  Mail,
  Calendar,
  
} from 'lucide-react';
import Table from '../components/Table';
import Button from '../components/Button';
import { ConfirmModal } from '../components/Modal';
import StatsCard from '../components/StatsCard';
import { useAdminData } from '../context/AdminDataContext';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const { 
    users, 
    fetchUsers, 
    updateUserRole, 
    deleteUser, 
    loading 
  } = useAdminData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [pagination, setPagination] = useState({});
  const [userStats, setUserStats] = useState({
    total: 0,
    admins: 0,
    users: 0,
    newThisMonth: 0
  });

  const loadUsers = useCallback(async () => {
    const params = {
      page: currentPage,
      limit: 10,
      search: searchTerm,
      role: filterRole !== 'all' ? filterRole : undefined,
      sortBy: sortConfig.key,
      sortOrder: sortConfig.direction
    };

    const result = await fetchUsers(params);
    setPagination({
      currentPage: result.currentPage || 1,
      totalPages: result.totalPages || 1,
      total: result.totalUsers || 0,
      limit: 10
    });
  }, [currentPage, sortConfig, searchTerm, filterRole, fetchUsers]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const calculateStats = React.useCallback(() => {
    const total = users.length;
    const admins = users.filter(user => user.role === 'admin').length;
    const regularUsers = users.filter(user => user.role === 'user').length;
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const newThisMonth = users.filter(user => new Date(user.createdAt) >= thisMonth).length;
    setUserStats({ total, admins, users: regularUsers, newThisMonth });
  }, [users]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);



  const handleSort = (sortData) => {
    setSortConfig(sortData);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (role) => {
    setFilterRole(role);
    setCurrentPage(1);
  };

  const handleRoleChange = async (userId, newRole) => {
    const action = newRole === 'admin' ? 'promoted to Admin' : 'demoted to User';
    
    const result = await updateUserRole(userId, newRole);
    if (result.success) {
      toast.success(`User ${action} successfully`);
      loadUsers();
    } else {
      toast.error(result.error || 'Failed to update user role');
    }
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      const result = await deleteUser(userToDelete._id);
      if (result.success) {
        toast.success('User deleted successfully');
        loadUsers();
      } else {
        toast.error(result.error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role) => {
    return role === 'admin' 
      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
  };

  const columns = [
    {
      key: 'name',
      title: 'User',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {value?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {row.email}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900 dark:text-white">
            {value}
          </span>
        </div>
      )
    },
    {
      key: 'role',
      title: 'Role',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${getRoleBadgeColor(value)}
          `}>
            {value === 'admin' ? (
              <>
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </>
            ) : (
              <>
                <User className="w-3 h-3 mr-1" />
                User
              </>
            )}
          </span>
          {value === 'user' ? (
            <Button
              variant="ghost"
              size="xs"
            onClick={() => handleRoleChange(row._id, 'admin')}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
              title="Promote to Admin"
            >
              Promote
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="xs"
            onClick={() => handleRoleChange(row._id, 'user')}
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/20"
              title="Demote to User"
            >
              Demote
            </Button>
          )}
        </div>
      )
    },
    {
      key: 'createdAt',
      title: 'Joined',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900 dark:text-white">
            {formatDate(value)}
          </span>
        </div>
      )
    },
    {
      key: 'isActive',
      title: 'Status',
      render: (value) => (
        <span className={`
          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${value 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
          }
        `}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => handleDelete(row)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            title="Delete User"
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage user accounts and permissions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={userStats.total}
          icon={User}
          color="primary"
          loading={loading}
        />
        <StatsCard
          title="Administrators"
          value={userStats.admins}
          icon={Shield}
          color="danger"
          loading={loading}
        />
        <StatsCard
          title="Regular Users"
          value={userStats.users}
          icon={User}
          color="success"
          loading={loading}
        />
        <StatsCard
          title="New This Month"
          value={userStats.newThisMonth}
          change={15.3}
          changeType="increase"
          icon={UserPlus}
          color="info"
          loading={loading}
        />
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearch}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="input-field min-w-[120px]"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="user">Users</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card p-0">
        <Table
          columns={columns}
          data={users}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${userToDelete?.name}"? This will also delete all their blog posts. This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default UserManagement;
