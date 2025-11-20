import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

const Table = ({ 
  columns, 
  data, 
  loading = false,
  pagination = null,
  onPageChange = () => {},
  onSort = () => {},
  sortConfig = null,
  className = ''
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleSort = (key) => {
    if (onSort) {
      const direction = sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc';
      onSort({ key, direction });
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((_, colIndex) => (
                  <td key={colIndex}>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={column.sortable ? 'cursor-pointer select-none' : ''}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <span className="text-gray-400">
                        {getSortIcon(column.key) || <ChevronUp className="w-4 h-4 opacity-30" />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8">
                  <div className="text-gray-500 dark:text-gray-400">
                    <p className="text-lg font-medium mb-2">No data found</p>
                    <p className="text-sm">There are no items to display at the moment.</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <motion.tr
                  key={row.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`
                    ${hoveredRow === index ? 'bg-gray-50 dark:bg-gray-800' : ''}
                    transition-colors duration-150
                  `}
                >
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render ? column.render(row[column.key], row, index) : row[column.key]}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
            <span>
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPageChange(1)}
              disabled={pagination.currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const page = i + Math.max(1, pagination.currentPage - 2);
                if (page > pagination.totalPages) return null;
                
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${page === pagination.currentPage
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }
                    `}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => onPageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
