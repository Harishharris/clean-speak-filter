
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
