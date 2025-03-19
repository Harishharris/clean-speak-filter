
import React from 'react';
import FilterContainer from '@/components/FilterContainer';
import { motion } from 'framer-motion';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/30 px-4 py-16">
      <motion.div
        className="fixed top-0 inset-x-0 h-16 bg-white/50 backdrop-blur-apple border-b border-border/30 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      />
      
      <motion.div
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FilterContainer />
      </motion.div>
      
      <motion.footer
        className="mt-16 text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <p>Profanity Filter Application &middot; Built with precision and care</p>
      </motion.footer>
    </div>
  );
};

export default Index;
