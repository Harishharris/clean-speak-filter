
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface FilteredOutputProps {
  filteredText: string;
  wasFiltered: boolean;
  matches: string[];
  aiDetection?: {
    isProfane: boolean;
    categories: {
      label: string;
      match: boolean;
      probability: number;
    }[];
  };
}

const FilteredOutput: React.FC<FilteredOutputProps> = ({
  filteredText,
  wasFiltered,
  matches,
  aiDetection
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

  const showAiResults = aiDetection && (aiDetection.isProfane || aiDetection.categories.length > 0);

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

      {showAiResults && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-6 p-4 bg-primary/5 rounded-lg overflow-hidden"
        >
          <p className="text-sm font-medium mb-3">AI Detection Results:</p>
          
          <div className="grid gap-2">
            {aiDetection.categories.map((category, index) => (
              <motion.div 
                key={index}
                className={`p-2 rounded-md flex justify-between items-center ${
                  category.match ? 'bg-destructive/10' : 'bg-muted/50'
                }`}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + (index * 0.05) }}
              >
                <span className="font-medium capitalize text-sm">
                  {category.label.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${category.match ? 'bg-destructive' : 'bg-primary/50'}`} 
                      style={{ width: `${category.probability * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono">
                    {Math.round(category.probability * 100)}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {aiDetection.isProfane && (
            <motion.p 
              className="mt-3 text-sm text-destructive font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              AI detected potentially inappropriate content
            </motion.p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default FilteredOutput;
