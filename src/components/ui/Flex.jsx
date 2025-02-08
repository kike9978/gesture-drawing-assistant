import React from 'react';

const Flex = ({ 
  children, 
  justify = 'start', // start, end, between, around, evenly
  items = 'start', // start, end, center, baseline, stretch
  gap = 0,
  className = '',
  ...props 
}) => {
  const justifyMap = {
    start: 'justify-start',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
    center: 'justify-center'
  };

  const itemsMap = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
  };

  return (
    <div 
      className={`flex ${justifyMap[justify]} ${itemsMap[items]} gap-${gap} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Flex; 