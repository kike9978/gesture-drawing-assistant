import React from 'react';

const Text = ({ 
  children,
  size = 'base', // xs, sm, base, lg, xl
  color = 'default', // default, gray, error
  align = 'left', // left, center, right
  className = '',
  ...props 
}) => {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const colors = {
    default: 'text-gray-800',
    gray: 'text-gray-500',
    error: 'text-red-500'
  };

  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <p 
      className={`${sizes[size]} ${colors[color]} ${alignments[align]} ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

export default Text; 