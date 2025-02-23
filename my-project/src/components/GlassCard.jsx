import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', glow = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative rounded-2xl 
        bg-gray-900/30 backdrop-blur-xl
        border border-gray-700/50
        ${glow ? 'shadow-lg shadow-purple-500/10' : ''}
        ${className}
      `}
    >
      {glow && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      {children}
    </motion.div>
  );
};

export default GlassCard; 