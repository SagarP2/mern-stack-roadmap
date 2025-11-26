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
    <div className={`space-y-3 xs:space-y-4 ${className}`}>
      <div className="table-container overflow-x-auto -mx-3 xs:-mx-4 sm:mx-0 px-3 xs:px-4 sm:px-0">
        <table className="table min-w-full">
          <thead>
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={`${column.sortable ? 'cursor-pointer select-none' : ''} whitespace-nowrap`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span className="text-xs xs:text-sm">{column.title}</span>
                    {column.sortable && (
                      <span className="text-gray-400">
                        {getSortIcon(column.key) || <ChevronUp className="w-3 h-3 xs:w-4 xs:h-4 opacity-30" />}
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
                <td colSpan={columns.length} className="text-center py-6 xs:py-8">
                  <div className="text-gray-500 dark:text-gray-400">
                    <p className="text-base xs:text-lg font-medium mb-2">No data found</p>
                    <p className="text-xs xs:text-sm">There are no items to display at the moment.</p>
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
                    <td key={column.key} className="whitespace-nowrap text-xs xs:text-sm">
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
        <div className="flex flex-col xs:flex-row items-center justify-between gap-3 xs:gap-4 px-3 xs:px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center space-x-2 text-xs xs:text-sm text-gray-700 dark:text-gray-300 order-2 xs:order-1">
            <span className="hidden sm:inline">
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </span>
            <span className="sm:hidden">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
          </div>
          
          <div className="flex items-center space-x-1 order-1 xs:order-2">
            <button
              onClick={() => onPageChange(1)}
              disabled={pagination.currentPage === 1}
              className="p-1.5 xs:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hidden sm:block"
              aria-label="First page"
            >
              <ChevronsLeft className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
            </button>
            
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="p-1.5 xs:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
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
                      px-2 xs:px-3 py-1.5 xs:py-2 rounded-lg text-xs xs:text-sm font-medium transition-colors
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
              className="p-1.5 xs:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
            </button>
            
            <button
              onClick={() => onPageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-1.5 xs:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hidden sm:block"
              aria-label="Last page"
            >
              <ChevronsRight className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
