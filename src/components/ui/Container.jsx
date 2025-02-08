import React from 'react';

const Container = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`container mx-auto px-4 py-8 flex-1 flex flex-col ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container; 