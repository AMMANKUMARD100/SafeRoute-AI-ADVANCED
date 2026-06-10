import { useRef, useCallback, useState } from 'react';

const useSpeechRecognition = ({
  language = 'en-IN',
  continuous = false,
  onResult,
  onError,
} = {}) => {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError && onError(new Error('Speech recognition not supported'));
      return;
    }

    if (recognitionRef.current) recognitionRef.current.abort();

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = continuous;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      onResult && onResult(transcript);
      setListening(false);
    };

    recognition.onerror = (event) => {
      onError && onError(event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [language, continuous, onResult, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      setListening(false);
    }
  }, []);

  return { startListening, stopListening, listening };
};

export default useSpeechRecognition;