import React from 'react';

const Heading = ({ 
  level = 1, 
  children, 
  className = '',
  ...props 
}) => {
  const baseStyles = "font-bold text-gray-800";
  const sizes = {
    1: "text-4xl",
    2: "text-2xl",
    3: "text-xl",
    4: "text-lg",
  };

  const Tag = `h${level}`;

  return (
    <Tag 
      className={`${baseStyles} ${sizes[level]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Heading; 