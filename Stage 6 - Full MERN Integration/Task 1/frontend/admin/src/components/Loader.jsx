import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ size = 'large', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <motion.div
        className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-600 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <motion.p
        className="mt-4 text-gray-600 dark:text-gray-400 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {text}
      </motion.p>
    </div>
  );
};

// Skeleton Loader Component
export const SkeletonLoader = ({ className = '', rows = 3 }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 last:mb-0"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  );
};

// Card Skeleton
export const CardSkeleton = () => {
  return (
    <div className="card animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4" />
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
    </div>
  );
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, index) => (
              <th key={index}>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: cols }).map((_, colIndex) => (
                <td key={colIndex}>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Loader;
