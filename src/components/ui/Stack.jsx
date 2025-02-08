import React from 'react';

const Stack = ({ 
  children, 
  gap = 4,
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`space-y-${gap} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Stack; 