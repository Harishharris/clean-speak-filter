
import { profanityList } from '@/data/profanityList';
import { detectProfanity, cleanTextWithAI } from './aiProfanityDetection';

/**
 * Filters profanity words from text and replaces them with asterisks
 */
export function filterProfanity(text: string): { 
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
} {
  if (!text) {
    return { 
      filteredText: '',
      wasFiltered: false,
      matches: []
    };
  }

  let filteredText = text;
  let wasFiltered = false;
  const matches: string[] = [];
  
  // Function to replace a word with asterisks of the same length
  const replaceWithAsterisks = (word: string): string => {
    return '*'.repeat(word.length);
  };

  // Build a regex pattern from the profanity list
  // - Use word boundaries to match only whole words
  // - Use case-insensitive flag
  profanityList.forEach(word => {
    // Escape special regex characters
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
    
    if (text.match(regex)) {
      filteredText = filteredText.replace(regex, replaceWithAsterisks);
      wasFiltered = true;
      matches.push(word);
    }
  });

  // Also check for multi-word profanity phrases
  profanityList.forEach(word => {
    if (word.includes(' ')) {
      // For phrases, don't use word boundaries
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedWord, 'gi');
      
      if (text.match(regex)) {
        filteredText = filteredText.replace(regex, replaceWithAsterisks);
        wasFiltered = true;
        matches.push(word);
      }
    }
  });

  return {
    filteredText,
    wasFiltered,
    matches: [...new Set(matches)] // Remove duplicates
  };
}

/**
 * Enhanced filter that combines wordlist and AI approaches
 */
export async function enhancedFilterProfanity(text: string): Promise<{
  filteredText: string;
  wasFiltered: boolean;
  matches: string[];
  aiDetection: {
    isProfane: boolean;
    categories: {
      label: string;
      match: boolean;
      probability: number;
    }[];
  };
}> {
  // First, use the traditional wordlist-based filtering
  const wordlistResult = filterProfanity(text);
  
  // Then use AI-based detection
  const aiResult = await detectProfanity(text);
  
  // If AI detected profanity but wordlist didn't catch all of it,
  // use the AI to clean the text further
  let finalFilteredText = wordlistResult.filteredText;
  let finalMatches = [...wordlistResult.matches];
  
  if (aiResult.isProfane) {
    // Apply AI cleaning to the text that's already been filtered by the wordlist
    const aiCleanResult = await cleanTextWithAI(finalFilteredText);
    
    // Update the filtered text and matches
    finalFilteredText = aiCleanResult.cleanedText;
    finalMatches = [...finalMatches, ...aiCleanResult.replacedWords];
    
    // Remove duplicates
    finalMatches = [...new Set(finalMatches)];
  }
  
  return {
    filteredText: finalFilteredText,
    wasFiltered: wordlistResult.wasFiltered || aiResult.isProfane,
    matches: finalMatches,
    aiDetection: aiResult
  };
}

/**
 * Highlights profanity words in text without filtering them
 * Used for visual indication in the UI
 */
export function highlightProfanity(text: string): {
  highlightedText: string;
  hasMatches: boolean;
  matches: string[];
} {
  if (!text) {
    return {
      highlightedText: '',
      hasMatches: false,
      matches: []
    };
  }
  
  let highlightedText = text;
  let hasMatches = false;
  const matches: string[] = [];

  // Build a regex pattern from the profanity list
  profanityList.forEach(word => {
    // Escape special regex characters
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
    
    if (text.match(regex)) {
      highlightedText = highlightedText.replace(regex, `<span class="text-destructive font-bold">$&</span>`);
      hasMatches = true;
      matches.push(word);
    }
  });

  // Also check for multi-word profanity phrases
  profanityList.forEach(word => {
    if (word.includes(' ')) {
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedWord, 'gi');
      
      if (text.match(regex)) {
        highlightedText = highlightedText.replace(regex, `<span class="text-destructive font-bold">$&</span>`);
        hasMatches = true;
        matches.push(word);
      }
    }
  });

  return {
    highlightedText,
    hasMatches,
    matches: [...new Set(matches)] // Remove duplicates
  };
}
