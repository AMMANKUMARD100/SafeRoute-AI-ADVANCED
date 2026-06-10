import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const NightModeToggle = ({ onToggle }) => {
  const [nightMode, setNightMode] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    setNightMode(hour >= 20 || hour < 6);
  }, []);

  const toggle = () => {
    setNightMode(!nightMode);
    onToggle && onToggle(!nightMode);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
        nightMode
          ? 'bg-purple-600/30 border border-purple-500/30 text-purple-300'
          : 'bg-white/10 border border-white/10 text-gray-400'
      }`}
    >
      {nightMode ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
      {nightMode ? 'Night Protection ON' : 'Night Mode'}
    </motion.button>
  );
};

export default NightModeToggle;