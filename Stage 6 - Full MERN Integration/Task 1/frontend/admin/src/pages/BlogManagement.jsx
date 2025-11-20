import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  User,
  
} from 'lucide-react';
import Table from '../components/Table';
import Button from '../components/Button';
import { ConfirmModal } from '../components/Modal';
import { useAdminData } from '../context/AdminDataContext';
import toast from 'react-hot-toast';

const BlogManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { 
    blogs, 
    fetchBlogs, 
    deleteBlog, 
    loading 
  } = useAdminData();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [pagination, setPagination] = useState({});

  const loadBlogs = useCallback(async () => {
    const params = {
      page: currentPage,
      limit: 10,
      search: searchTerm,
      status: filterStatus !== 'all' ? filterStatus : undefined,
      sortBy: sortConfig.key,
      sortOrder: sortConfig.direction
    };

    const result = await fetchBlogs(params);
    setPagination({
      currentPage: result.currentPage || 1,
      totalPages: result.totalPages || 1,
      total: result.totalPosts || 0,
      limit: 10
    });
  }, [currentPage, sortConfig, searchTerm, filterStatus, fetchBlogs]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

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

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleCreateBlog = () => {
    navigate('/admin/blogs/create');
  };

  const handleEdit = (blog) => {
    navigate(`/admin/blogs/${blog._id}/edit`);
  };

  const handleView = (blog) => {
    // Open in new tab to view the blog post
    window.open(`/post/${blog._id}`, '_blank');
  };

  const handleDelete = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (blogToDelete) {
      const result = await deleteBlog(blogToDelete._id);
      if (result.success) {
        toast.success('Blog deleted successfully');
        loadBlogs();
        setShowDeleteModal(false);
        setBlogToDelete(null);
      } else {
        toast.error(result.error || 'Failed to delete blog');
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

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const columns = [
    {
      key: 'title',
      title: 'Title',
      sortable: true,
      render: (value, row) => (
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {value || row.heading}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {truncateText(row.introduction || row.content, 60)}
          </p>
        </div>
      )
    },
    {
      key: 'author',
      title: 'Author',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900 dark:text-white">
            {value?.name || 'Unknown'}
          </span>
        </div>
      )
    },
    {
      key: 'createdAt',
      title: 'Created',
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
      key: 'status',
      title: 'Status',
      render: (value) => (
        <span className={`
          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${value === 'published' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
          }
        `}>
          {value || 'draft'}
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
            icon={Eye}
            onClick={() => handleView(row)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
            title="View Post"
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={() => handleEdit(row)}
            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
            title="Edit Post"
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => handleDelete(row)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            title="Delete Post"
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
            Blog Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all blog posts and content
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={handleCreateBlog}
        >
          Create Blog
        </Button>
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
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={handleSearch}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="input-field min-w-[120px]"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="card p-0">
        <Table
          columns={columns}
          data={blogs}
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
        title="Delete Blog"
        message={`Are you sure you want to delete "${blogToDelete?.title || blogToDelete?.heading}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default BlogManagement;
