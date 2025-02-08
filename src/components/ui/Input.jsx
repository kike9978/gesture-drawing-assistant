import React from 'react';

const Input = ({ 
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  className = '',
  ...props 
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`
        px-4 py-2 border rounded-lg 
        focus:ring-2 focus:ring-blue-500 focus:border-transparent 
        outline-none transition-all
        ${error ? 'border-red-500' : 'border-gray-300'}
        ${className}
      `}
      {...props}
    />
  );
};

export default Input; 