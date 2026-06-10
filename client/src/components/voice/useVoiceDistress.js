import { useRef, useCallback } from 'react';
import useSpeechRecognition from './useSpeechRecognition';

// Extend with backend API call for audio tone analysis
const distressKeywords = {
  en: ['help', 'save me', 'stop', 'police', 'emergency'],
  hi: ['बचाओ', 'मदद', 'पुलिस', 'रोको'],
  ta: ['காப்பாத்து', 'உதவி', 'போலீஸ்', 'நிறுத்து'],
};

const useVoiceDistress = (onDistress) => {
  const languageRef = useRef('en'); // could be dynamic from user pref

  const handleResult = useCallback(
    (transcript) => {
      const lower = transcript.toLowerCase();
      const langKeywords = distressKeywords[languageRef.current] || distressKeywords.en;
      const matched = langKeywords.some((word) => lower.includes(word));
      if (matched) {
        onDistress && onDistress(transcript, 0.95);
      }
      // In production: also send transcript to /api/detect-distress-text for advanced NLP
    },
    [onDistress]
  );

  const { startListening, stopListening } = useSpeechRecognition({
    language: 'en-IN', // default; will be overridden if needed
    onResult: handleResult,
  });

  // Wrap to set language dynamically
  const startWithLang = (lang = 'en') => {
    languageRef.current = lang;
    startListening();
  };

  return { startListening: startWithLang, stopListening };
};
export { useVoiceDistress };