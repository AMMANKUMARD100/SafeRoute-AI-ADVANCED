import { useEffect, useState } from 'react';
import { useVoiceDistress } from './useVoiceDistress';
import { motion } from 'framer-motion';

const DistressDetector = () => {
  const [enabled, setEnabled] = useState(false);
  const [lastAlert, setLastAlert] = useState(null);
  const { startListening, stopListening } = useVoiceDistress((transcript, confidence) => {
    setLastAlert({ transcript, confidence, time: new Date() });
    // In real app, trigger emergency alert via API
  });

  useEffect(() => {
    if (enabled) startListening();
    else stopListening();
    return () => stopListening();
  }, [enabled, startListening, stopListening]);

  return (
    <div className="flex items-center gap-3">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setEnabled(!enabled)}
        className={`px-4 py-2 rounded-full text-sm font-medium ${
          enabled
            ? 'bg-red-600/30 border border-red-500/30 text-red-300'
            : 'bg-white/10 border border-white/10 text-gray-400'
        }`}
      >
        {enabled ? 'Auto Distress Detection ON' : 'Enable Voice Monitoring'}
      </motion.button>
      {lastAlert && (
        <p className="text-xs text-red-400">
          Distress detected: "{lastAlert.transcript}" (conf: {lastAlert.confidence}%)
        </p>
      )}
    </div>
  );
};

export default DistressDetector;