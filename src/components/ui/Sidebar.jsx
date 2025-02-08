import React from 'react';

const Sidebar = ({ 
  children, 
  isOpen, 
  className = '',
  ...props 
}) => {
  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 ${
        isOpen ? 'w-80' : 'w-12'
      } ${className}`}
      {...props}
    >
      {children}
    </aside>
  );
};

export default Sidebar; 