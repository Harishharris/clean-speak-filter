
import * as tf from '@tensorflow/tfjs';
import * as toxicity from '@tensorflow-models/toxicity';

// Model threshold for prediction confidence
const THRESHOLD = 0.8;

// We'll use this to store the loaded model to avoid reloading it every time
let toxicityModel: toxicity.ToxicityClassifier | null = null;

/**
 * Loads the toxicity model (if not already loaded)
 */
export const loadToxicityModel = async (): Promise<toxicity.ToxicityClassifier> => {
  if (toxicityModel) return toxicityModel;
  
  // Log the loading process
  console.log("Loading TensorFlow.js toxicity model...");
  
  // Load the model with the toxicity labels we care about
  toxicityModel = await toxicity.load(THRESHOLD, ['toxicity', 'identity_attack', 'insult', 'obscene', 'severe_toxicity', 'sexual_explicit', 'threat']);
  
  console.log("TensorFlow.js toxicity model loaded");
  return toxicityModel;
};

/**
 * Detects profanity using the TensorFlow.js toxicity model
 */
export const detectProfanity = async (text: string): Promise<{
  isProfane: boolean;
  categories: {
    label: string;
    match: boolean;
    probability: number;
  }[];
}> => {
  if (!text.trim()) {
    return { 
      isProfane: false, 
      categories: [] 
    };
  }
  
  try {
    // Load the model if not already loaded
    const model = await loadToxicityModel();
    
    // Classify the text
    const predictions = await model.classify(text);
    
    // Transform the results
    const categories = predictions.map(prediction => ({
      label: prediction.label,
      match: prediction.results[0].match,
      probability: prediction.results[0].probabilities[1] // Index 1 is the probability of being toxic
    }));
    
    // Text is considered profane if any category is matched
    const isProfane = categories.some(category => category.match);
    
    return {
      isProfane,
      categories
    };
  } catch (error) {
    console.error("Error using TensorFlow.js for profanity detection:", error);
    return {
      isProfane: false,
      categories: []
    };
  }
};

/**
 * Extract potential profane words from a sentence using AI detection
 * This uses sentence segmentation and identification of high-probability toxic segments
 */
export const extractProfaneWordsWithAI = async (text: string): Promise<string[]> => {
  if (!text.trim()) {
    return [];
  }
  
  try {
    // Break the text into words and short phrases to analyze
    const words = text.split(/\s+/);
    const segments: string[] = [];
    
    // Create overlapping segments of 1-3 words to catch multi-word profanity
    for (let i = 0; i < words.length; i++) {
      segments.push(words[i]);
      if (i < words.length - 1) segments.push(`${words[i]} ${words[i+1]}`);
      if (i < words.length - 2) segments.push(`${words[i]} ${words[i+1]} ${words[i+2]}`);
    }
    
    // Load the model
    const model = await loadToxicityModel();
    
    // Get classifications for each segment
    const segmentResults = await Promise.all(
      segments.map(async (segment) => {
        const predictions = await model.classify(segment);
        const toxicityScore = predictions.find(p => p.label === 'toxicity')?.results[0].probabilities[1] || 0;
        const obscenityScore = predictions.find(p => p.label === 'obscene')?.results[0].probabilities[1] || 0;
        
        // Get the maximum score among relevant categories
        const maxScore = Math.max(toxicityScore, obscenityScore);
        return {
          segment,
          isProfane: maxScore > THRESHOLD,
          score: maxScore
        };
      })
    );
    
    // Filter segments with high probability of being profane
    const profaneSegments = segmentResults
      .filter(result => result.isProfane)
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .map(result => result.segment);
      
    return [...new Set(profaneSegments)]; // Remove duplicates
  } catch (error) {
    console.error("Error extracting profane words with AI:", error);
    return [];
  }
};

/**
 * Clean text by replacing AI-detected profanity with asterisks
 */
export const cleanTextWithAI = async (text: string): Promise<{
  cleanedText: string;
  replacedWords: string[];
}> => {
  if (!text.trim()) {
    return { 
      cleanedText: '', 
      replacedWords: [] 
    };
  }
  
  try {
    // Get potential profane words/phrases
    const profaneSegments = await extractProfaneWordsWithAI(text);
    let cleanedText = text;
    
    // Sort segments by length (descending) to handle longer phrases first
    const sortedSegments = [...profaneSegments].sort((a, b) => b.length - a.length);
    
    // Replace each profane segment with asterisks
    sortedSegments.forEach(segment => {
      const replacement = '*'.repeat(segment.length);
      // Use a global replace with word boundaries when possible
      const regex = new RegExp(segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      cleanedText = cleanedText.replace(regex, replacement);
    });
    
    return {
      cleanedText,
      replacedWords: profaneSegments
    };
  } catch (error) {
    console.error("Error cleaning text with AI:", error);
    return {
      cleanedText: text,
      replacedWords: []
    };
  }
};
