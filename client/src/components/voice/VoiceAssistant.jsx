import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MicrophoneIcon, XMarkIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';
import useSpeechRecognition from './useSpeechRecognition';
import GlassCard from '../common/GlassCard';

const languages = {
  en: { label: 'English', code: 'en-IN' },
  hi: { label: 'हिन्दी', code: 'hi-IN' },
  ta: { label: 'தமிழ்', code: 'ta-IN' },
};

const VoiceAssistant = () => {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [listening, setListening] = useState(false);
  const synthRef = useRef(window.speechSynthesis);

  const handleResult = (text) => {
    setTranscript(text);
    // Mock AI response (in production, send to /api/voice-assistant)
    const lower = text.toLowerCase();
    let reply = '';
    if (lower.includes('police') || lower.includes('पुलिस') || lower.includes('போலீஸ்')) {
      reply = language === 'en' ? 'Nearest police station is 500m away, at Andheri West.' :
              language === 'hi' ? 'निकटतम पुलिस स्टेशन 500 मीटर दूर, अंधेरी वेस्ट में है।' :
              'அருகிலுள்ள காவல் நிலையம் 500மீ தொலைவில், அந்தேரி வெஸ்டில் உள்ளது.';
    } else if (lower.includes('hospital') || lower.includes('अस्पताल') || lower.includes('மருத்துவமனை')) {
      reply = language === 'en' ? 'Nearest hospital is 1.2 km away, at Cooper Hospital.' :
              language === 'hi' ? 'निकटतम अस्पताल 1.2 किमी दूर, कूपर अस्पताल है।' :
              'அருகிலுள்ள மருத்துவமனை 1.2 கிமீ தொலைவில், கூப்பர் மருத்துவமனை.';
    } else if (lower.includes('safe spot') || lower.includes('सुरक्षित स्थान') || lower.includes('பாதுகாப்பான இடம்')) {
      reply = language === 'en' ? 'Safe waiting spot: Juhu Circle, well lit area.' :
              language === 'hi' ? 'सुरक्षित प्रतीक्षा स्थान: जुहू सर्कल, अच्छी रोशनी वाला क्षेत्र।' :
              'பாதுகாப்பான காத்திருக்கும் இடம்: ஜுஹூ சர்க்கிள்.';
    } else {
      reply = language === 'en' ? 'I am listening. How can I help you travel safer?' :
              language === 'hi' ? 'मैं सुन रही हूँ। सुरक्षित यात्रा के लिए कैसे मदद करूँ?' :
              'நான் கேட்கிறேன். பாதுகாப்பான பயணத்திற்கு எப்படி உதவ முடியும்?';
    }
    setResponse(reply);
    speak(reply);
  };

  const speak = (text) => {
    if (synthRef.current.speaking) synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languages[language].code;
    utterance.rate = 0.9;
    synthRef.current.speak(utterance);
  };

  const { startListening, stopListening } = useSpeechRecognition({
    language: languages[language].code,
    onResult: handleResult,
    onListeningChange: setListening,
  });

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 flex items-center justify-center"
      >
        <MicrophoneIcon className="h-6 w-6" />
      </motion.button>

      {/* Assistant Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 max-w-[90vw]"
          >
            <GlassCard className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <SpeakerWaveIcon className="h-4 w-4 text-pink-400" />
                  SafeRoute Assistant
                </h3>
                <button onClick={() => setOpen(false)}>
                  <XMarkIcon className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Language selector */}
              <div className="flex gap-1 mb-3">
                {Object.entries(languages).map(([key, lang]) => (
                  <button
                    key={key}
                    onClick={() => setLanguage(key)}
                    className={`px-2 py-1 text-xs rounded-full ${
                      language === key
                        ? 'bg-pink-600 text-white'
                        : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* Transcript & Response */}
              <div className="bg-white/5 rounded-xl p-3 mb-3 min-h-[60px]">
                {transcript && (
                  <p className="text-gray-400 text-xs mb-2">You: "{transcript}"</p>
                )}
                {response && (
                  <p className="text-white text-sm">{response}</p>
                )}
                {!transcript && !response && (
                  <p className="text-gray-500 text-xs">Tap mic and speak a command...</p>
                )}
              </div>

              {/* Mic button */}
              <button
                onClick={() => (listening ? stopListening() : startListening())}
                className={`w-full py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium ${
                  listening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-white/10 text-white hover:bg-pink-600/20'
                }`}
              >
                <MicrophoneIcon className="h-4 w-4" />
                {listening ? 'Listening...' : 'Tap to Speak'}
              </button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceAssistant;