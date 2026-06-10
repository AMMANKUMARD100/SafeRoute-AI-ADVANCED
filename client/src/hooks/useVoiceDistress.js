import { useCallback, useRef } from 'react';
import useSpeechRecognition from './useSpeechRecognition';

// Distress keywords in supported languages
const KEYWORDS = {
  en: ['help', 'save me', 'stop', 'police', 'emergency'],
  hi: ['बचाओ', 'मदद', 'पुलिस', 'रोको'],
  ta: ['காப்பாத்து', 'உதவி', 'போலீஸ்', 'நிறுத்து'],
};

const useVoiceDistress = (onDistress, language = 'en') => {
  const langRef = useRef(language);
  const onDistressRef = useRef(onDistress);
  onDistressRef.current = onDistress;

  const handleResult = useCallback(
    (transcript) => {
      const lower = transcript.toLowerCase();
      const keywords = KEYWORDS[langRef.current] || KEYWORDS.en;
      const matched = keywords.some((word) => lower.includes(word));
      if (matched) {
        onDistressRef.current && onDistressRef.current(transcript, 0.95);
      }
      // In production: also send to /api/detect-distress-text for NLP analysis
    },
    []
  );

  const { startListening, stopListening, listening } = useSpeechRecognition({
    language: langRef.current === 'hi' ? 'hi-IN' : langRef.current === 'ta' ? 'ta-IN' : 'en-IN',
    continuous: true, // keep listening in background
    onResult: handleResult,
  });

  // Expose a way to change language dynamically
  const setLanguage = useCallback((lang) => {
    langRef.current = lang;
  }, []);

  return { startListening, stopListening, listening, setLanguage };
};
export { useVoiceDistress };