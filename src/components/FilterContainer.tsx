
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TextFilterInput from './TextFilterInput';
import FilteredOutput from './FilteredOutput';
import FilterHeader from './FilterHeader';
import { filterProfanity } from '@/utils/profanityFilter';

const FilterContainer: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [filteredResult, setFilteredResult] = useState({
    filteredText: '',
    wasFiltered: false,
    matches: [] as string[]
  });

  useEffect(() => {
    // Filter the text whenever inputText changes
    const result = filterProfanity(inputText);
    setFilteredResult(result);
  }, [inputText]);

  return (
    <motion.div 
      className="w-full max-w-2xl mx-auto px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <FilterHeader />
      
      <motion.div 
        className="bg-white/60 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <TextFilterInput 
          value={inputText}
          onChange={setInputText}
        />
        
        <FilteredOutput 
          filteredText={filteredResult.filteredText}
          wasFiltered={filteredResult.wasFiltered}
          matches={filteredResult.matches}
        />
        
        <motion.div 
          className="mt-6 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Type text above to filter profanity and view the result
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default FilterContainer;
