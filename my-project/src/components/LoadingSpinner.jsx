import React from 'react';

const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizes[size]} animate-spin`}>
      <div className="h-full w-full border-4 border-current border-t-transparent rounded-full" />
    </div>
  );
};

export default LoadingSpinner; 