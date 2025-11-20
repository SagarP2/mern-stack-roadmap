import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Trash2, 
  CheckCircle,
  Clock,
  Mail,
  Calendar,
  Star
} from 'lucide-react';
import Table from '../components/Table';
import Button from '../components/Button';
import { ConfirmModal } from '../components/Modal';
import StatsCard from '../components/StatsCard';
import { useAdminData } from '../context/AdminDataContext';
import toast from 'react-hot-toast';

const Feedback = () => {
  const { loading } = useAdminData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbackStats, setFeedbackStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    avgRating: 0
  });

  // Sample feedback data (replace with actual API data)
  const [feedbackData, setFeedbackData] = useState([
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Great blog platform!',
      message: 'I love using this platform for my blog. The interface is clean and easy to use.',
      rating: 5,
      status: 'pending',
      createdAt: new Date().toISOString(),
      type: 'general'
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      subject: 'Feature request',
      message: 'Could you add a dark mode feature? It would be really helpful for night reading.',
      rating: 4,
      status: 'resolved',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      type: 'feature'
    },
    {
      _id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      subject: 'Bug report',
      message: 'I found a small issue with the comment system. Sometimes comments don\'t load properly.',
      rating: 3,
      status: 'pending',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      type: 'bug'
    }
  ]);

  useEffect(() => {
    loadFeedback();
  }, []);

  const calculateStats = useCallback(() => {
    const total = feedbackData.length;
    const pending = feedbackData.filter(f => f.status === 'pending').length;
    const resolved = feedbackData.filter(f => f.status === 'resolved').length;
    const avgRating = feedbackData.length > 0 
      ? (feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length).toFixed(1)
      : 0;

    setFeedbackStats({
      total,
      pending,
      resolved,
      avgRating: parseFloat(avgRating)
    });
  }, [feedbackData]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  const loadFeedback = async () => {
    // In a real app, this would fetch from the API
    // await fetchFeedback();
    // For now, we'll use the sample data
  };


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const handleResolve = (feedbackId) => {
    setFeedbackData(prev => 
      prev.map(f => 
        f._id === feedbackId 
          ? { ...f, status: 'resolved' }
          : f
      )
    );
    toast.success('Feedback marked as resolved');
    calculateStats(); // Recalculate stats after status change
  };

  const handleDelete = (feedback) => {
    setFeedbackToDelete(feedback);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (feedbackToDelete) {
      setFeedbackData(prev => 
        prev.filter(f => f._id !== feedbackToDelete._id)
      );
      toast.success('Feedback deleted successfully');
      setShowDeleteModal(false);
      setFeedbackToDelete(null);
      calculateStats(); // Recalculate stats after deletion
    }
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

  const getStatusBadgeColor = (status) => {
    return status === 'resolved'
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'bug':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'feature':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  // Filter feedback based on search and status
  const filteredFeedback = feedbackData.filter(feedback => {
    const matchesSearch = 
      feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || feedback.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'name',
      title: 'Contact',
      render: (value, row) => (
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {value}
          </p>
          <div className="flex items-center space-x-1 mt-1">
            <Mail className="w-3 h-3 text-gray-400" />
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {row.email}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'subject',
      title: 'Subject & Message',
      render: (value, row) => (
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
            {row.message.length > 60 ? `${row.message.substring(0, 60)}...` : row.message}
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <span className={`
              inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
              ${getTypeBadgeColor(row.type)}
            `}>
              {row.type}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'rating',
      title: 'Rating',
      render: (value) => (
        <div className="flex flex-col items-center space-y-1">
          {renderStars(value)}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {value}/5
          </span>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value, row) => (
        <div className="flex flex-col space-y-2">
          <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${getStatusBadgeColor(value)}
          `}>
            {value === 'resolved' ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Resolved
              </>
            ) : (
              <>
                <Clock className="w-3 h-3 mr-1" />
                Pending
              </>
            )}
          </span>
          {value === 'pending' && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => handleResolve(row._id)}
              className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
            >
              Mark Resolved
            </Button>
          )}
        </div>
      )
    },
    {
      key: 'createdAt',
      title: 'Date',
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
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            icon={MessageSquare}
            onClick={() => setSelectedFeedback(row)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
            title="View Details"
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => handleDelete(row)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            title="Delete Feedback"
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
            Feedback Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage user feedback and support requests
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Feedback"
          value={feedbackStats.total}
          icon={MessageSquare}
          color="primary"
          loading={loading}
        />
        <StatsCard
          title="Pending"
          value={feedbackStats.pending}
          icon={Clock}
          color="warning"
          loading={loading}
        />
        <StatsCard
          title="Resolved"
          value={feedbackStats.resolved}
          icon={CheckCircle}
          color="success"
          loading={loading}
        />
        <StatsCard
          title="Avg Rating"
          value={feedbackStats.avgRating}
          icon={Star}
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
                placeholder="Search feedback..."
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
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="card p-0">
        <Table
          columns={columns}
          data={filteredFeedback}
          loading={loading}
        />
      </div>

      {/* Feedback Detail Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Feedback Details
                </h3>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <p className="text-gray-900 dark:text-white">{selectedFeedback.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <p className="text-gray-900 dark:text-white">{selectedFeedback.email}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                  <p className="text-gray-900 dark:text-white">{selectedFeedback.subject}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedFeedback.message}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rating</label>
                    <div className="flex items-center space-x-2">
                      {renderStars(selectedFeedback.rating)}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ({selectedFeedback.rating}/5)
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                    <p className="text-gray-900 dark:text-white">{formatDate(selectedFeedback.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {selectedFeedback.status === 'pending' && (
                    <button
                      onClick={() => {
                        handleResolve(selectedFeedback._id);
                        setSelectedFeedback(null);
                      }}
                      className="btn-primary"
                    >
                      Mark as Resolved
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedFeedback(null)}
                    className="btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Feedback"
        message={`Are you sure you want to delete this feedback from "${feedbackToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default Feedback;
