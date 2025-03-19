
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface FilteredOutputProps {
  filteredText: string;
  wasFiltered: boolean;
  matches: string[];
}

const FilteredOutput: React.FC<FilteredOutputProps> = ({
  filteredText,
  wasFiltered,
  matches
}) => {
  const controls = useAnimation();
  
  useEffect(() => {
    if (wasFiltered) {
      controls.start({
        backgroundColor: ['rgba(255, 59, 48, 0.05)', 'transparent'],
        transition: { duration: 1.5 }
      });
    }
  }, [filteredText, wasFiltered, controls]);

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex justify-between items-center mb-2">
        <label 
          htmlFor="text-output" 
          className="block text-sm font-medium ml-1"
        >
          Filtered Output
        </label>
        
        {wasFiltered && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs font-medium px-2 py-1 bg-secondary rounded-full"
          >
            {matches.length} {matches.length === 1 ? 'word' : 'words'} filtered
          </motion.span>
        )}
      </div>
      
      <motion.div 
        className="text-output overflow-auto"
        animate={controls}
      >
        {filteredText || (
          <span className="text-muted-foreground/50 italic">
            Filtered text will appear here...
          </span>
        )}
      </motion.div>
      
      {wasFiltered && matches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-4 overflow-hidden"
        >
          <p className="text-sm font-medium mb-2 ml-1">Filtered Words:</p>
          <div className="flex flex-wrap gap-2">
            {matches.map((word, index) => (
              <motion.span
                key={index}
                className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + (index * 0.05) }}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FilteredOutput;
