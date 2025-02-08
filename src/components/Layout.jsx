import React from 'react';
import Container from './ui/Container';
import Heading from './ui/Heading';

const Layout = ({ 
  children,
  sidebar,
  isSidebarOpen,
  className = ''
}) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {sidebar}
      <div className={`transition-all duration-300 ${
        isSidebarOpen ? 'ml-80' : 'ml-12'
      } ${className}`}>
        <Container>
          <Heading level={1} className="text-center mb-8">
            YouTube Search
          </Heading>
          {children}
        </Container>
      </div>
    </div>
  );
};

export default Layout; 