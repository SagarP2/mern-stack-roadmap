import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'increase', 
  icon: Icon, 
  color = 'primary',
  loading = false 
}) => {
  const colorClasses = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    success: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    danger: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  };

  const iconBgClasses = {
    primary: 'bg-primary-100 dark:bg-primary-800',
    success: 'bg-green-100 dark:bg-green-800',
    warning: 'bg-yellow-100 dark:bg-yellow-800',
    danger: 'bg-red-100 dark:bg-red-800',
    info: 'bg-blue-100 dark:bg-blue-800',
  };

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          </div>
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="card hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2"
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </motion.p>
          
          {change !== undefined && (
            <div className="flex items-center space-x-1">
              {changeType === 'increase' ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  changeType === 'increase' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {change}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                vs last month
              </span>
            </div>
          )}
        </div>
        
        {Icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className={`
              w-12 h-12 rounded-lg flex items-center justify-center
              ${iconBgClasses[color]}
            `}
          >
            <Icon className={`w-6 h-6 ${colorClasses[color].split(' ')[2]} ${colorClasses[color].split(' ')[3]}`} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;
