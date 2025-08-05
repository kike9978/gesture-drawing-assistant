import React from 'react';

const Stack = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`flex flex-col gap-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Stack; 