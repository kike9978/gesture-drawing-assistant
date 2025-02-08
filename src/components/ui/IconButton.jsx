import React from 'react';

const IconButton = ({ 
  children, 
  onClick, 
  className = '',
  variant = 'default', // default, danger
  ...props 
}) => {
  const variants = {
    default: 'text-gray-400 hover:text-gray-600',
    danger: 'text-gray-400 hover:text-red-500'
  };

  return (
    <button
      onClick={onClick}
      className={`${variants[variant]} flex-shrink-0 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton; 