
import React from 'react';
import { motion } from 'framer-motion';

interface FilterHeaderProps {
  title?: string;
  subtitle?: string;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({ 
  title = "Clean Speak",
  subtitle = "Text Filtering Application" 
}) => {
  return (
    <motion.header 
      className="text-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="inline-block px-3 py-1 mb-2 bg-secondary/80 text-xs tracking-widest uppercase rounded-full">
        {subtitle}
      </div>
      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
    </motion.header>
  );
};

export default FilterHeader;
