import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 shadow-sm',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500 border border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-sm',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500 shadow-sm',
    ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-500 dark:hover:bg-gray-800 dark:text-gray-300',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500'
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const handleClick = (e) => {
    if (loading || disabled) return;
    onClick?.(e);
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading && (
        <Loader2 className={`${iconSizes[size]} animate-spin ${children ? 'mr-2' : ''}`} />
      )}
      
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className={`${iconSizes[size]} ${children ? 'mr-2' : ''}`} />
      )}
      
      {children}
      
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className={`${iconSizes[size]} ${children ? 'ml-2' : ''}`} />
      )}
    </motion.button>
  );
};

export default Button;
