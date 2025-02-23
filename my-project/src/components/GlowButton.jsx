import React from 'react';
import { motion } from 'framer-motion';

const GlowButton = ({ 
  children, 
  onClick, 
  disabled, 
  className = '', 
  variant = 'primary',
  icon
}) => {
  const baseStyles = "relative flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white shadow-lg hover:shadow-purple-500/25",
    secondary: "bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white backdrop-blur-sm"
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
      {variant === 'primary' && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 hover:opacity-20 transition-opacity duration-200" />
      )}
    </motion.button>
  );
};

export default GlowButton; 