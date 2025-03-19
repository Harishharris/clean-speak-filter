
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TextFilterInput from './TextFilterInput';
import FilteredOutput from './FilteredOutput';
import FilterHeader from './FilterHeader';
import { filterProfanity, enhancedFilterProfanity } from '@/utils/profanityFilter';
import { loadToxicityModel } from '@/utils/aiProfanityDetection';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const FilterContainer: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [filteredResult, setFilteredResult] = useState({
    filteredText: '',
    wasFiltered: false,
    matches: [] as string[],
    aiDetection: {
      isProfane: false,
      categories: [] as { label: string; match: boolean; probability: number }[]
    }
  });
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [filterMethod, setFilterMethod] = useState<'wordlist' | 'enhanced'>('wordlist');

  // Load the TensorFlow model when the component mounts
  useEffect(() => {
    const initModel = async () => {
      try {
        await loadToxicityModel();
        setIsModelLoading(false);
      } catch (error) {
        console.error("Failed to load TensorFlow model:", error);
        setIsModelLoading(false);
      }
    };
    
    initModel();
  }, []);

  useEffect(() => {
    // Filter the text whenever inputText changes
    const runFilter = async () => {
      if (filterMethod === 'wordlist' || isModelLoading) {
        // Use traditional filtering if that's selected or if the model is still loading
        const result = filterProfanity(inputText);
        setFilteredResult({
          ...result,
          aiDetection: {
            isProfane: false,
            categories: []
          }
        });
      } else {
        // Use enhanced filtering with AI
        const result = await enhancedFilterProfanity(inputText);
        setFilteredResult(result);
      }
    };
    
    runFilter();
  }, [inputText, filterMethod, isModelLoading]);

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
        <Tabs defaultValue="wordlist" className="mb-6" onValueChange={(value) => setFilterMethod(value as 'wordlist' | 'enhanced')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wordlist">Wordlist Filtering</TabsTrigger>
            <TabsTrigger value="enhanced" disabled={isModelLoading}>
              {isModelLoading ? 'Loading AI Model...' : 'AI-Enhanced Filtering'}
            </TabsTrigger>
          </TabsList>
          <div className="mt-2 text-xs text-muted-foreground">
            {filterMethod === 'enhanced' && !isModelLoading ? 
              "AI-Enhanced mode will actively replace profanity that our wordlist might miss" : 
              "Wordlist mode uses a predefined list of words to filter content"}
          </div>
        </Tabs>
        
        <TextFilterInput 
          value={inputText}
          onChange={setInputText}
        />
        
        <FilteredOutput 
          filteredText={filteredResult.filteredText}
          wasFiltered={filteredResult.wasFiltered}
          matches={filteredResult.matches}
          aiDetection={filteredResult.aiDetection}
        />
        
        <motion.div 
          className="mt-6 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {filterMethod === 'enhanced' && !isModelLoading ? 
            "Using TensorFlow.js AI model to detect and clean profanity" : 
            "Type text above to filter profanity and view the result"}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default FilterContainer;
