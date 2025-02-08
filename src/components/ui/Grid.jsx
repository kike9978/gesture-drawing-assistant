import React from 'react';

const Grid = ({ 
  children, 
  cols = 1,
  gap = 6,
  className = '',
  ...props 
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div 
      className={`grid ${gridCols[cols]} gap-${gap} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Grid; 