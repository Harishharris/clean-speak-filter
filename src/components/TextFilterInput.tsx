
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { highlightProfanity } from '@/utils/profanityFilter';

interface TextFilterInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextFilterInput: React.FC<TextFilterInputProps> = ({
  value,
  onChange,
  placeholder = "Type your text here..."
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasMatches, setHasMatches] = useState(false);
  
  useEffect(() => {
    // Check if the input contains profanity
    const { hasMatches: detected } = highlightProfanity(value);
    setHasMatches(detected);
  }, [value]);

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <label 
        htmlFor="text-input" 
        className="block text-sm font-medium mb-2 ml-1"
      >
        Input Text
      </label>
      
      <div className={`relative rounded-lg transition-all duration-300 ${
        isFocused 
          ? 'ring-2 ring-primary/20 shadow-lg' 
          : hasMatches 
            ? 'ring-1 ring-destructive/30' 
            : ''
      }`}>
        <textarea
          id="text-input"
          className={`text-input min-h-[8rem] resize-y ${
            hasMatches ? 'border-destructive/20' : ''
          }`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-describedby="input-description"
        />
        
        {hasMatches && (
          <div className="absolute right-3 top-3">
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold text-destructive bg-destructive/10 rounded-full">
              Contains profanity
            </span>
          </div>
        )}
      </div>
      
      <p
        id="input-description"
        className="text-muted-foreground text-xs mt-2 ml-1"
      >
        Enter text to be filtered for profanity.
      </p>
    </motion.div>
  );
};

export default TextFilterInput;
