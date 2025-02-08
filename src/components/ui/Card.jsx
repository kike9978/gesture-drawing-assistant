import React from 'react';

const Card = ({ 
  children, 
  className = '',
  onClick,
  hover = false,
  ...props 
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg shadow-md overflow-hidden
        ${hover ? 'hover:shadow-xl hover:transform hover:scale-105 transition-all duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card; 