import React from 'react';

const ScrollArea = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`h-full overflow-y-auto ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default ScrollArea; 