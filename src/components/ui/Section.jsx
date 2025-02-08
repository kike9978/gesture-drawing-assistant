import React from 'react';

const Section = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <section 
      className={`bg-white rounded-lg shadow-lg p-6 ${className}`}
      {...props}
    >
      {children}
    </section>
  );
};

export default Section; 