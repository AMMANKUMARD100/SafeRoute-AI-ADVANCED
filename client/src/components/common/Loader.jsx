import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false, text = 'Loading...' }) => {
  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-gray-950/80 z-50'
    : 'flex flex-col items-center justify-center py-20';

  return (
    <div className={containerClass}>
      <div className="relative flex flex-col items-center gap-4">
        <motion.div
          className="w-16 h-16 border-4 border-transparent border-t-pink-500 border-r-purple-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.span
          className="text-lg font-medium text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {text}
        </motion.span>
        {/* Pulse ring */}
        <div className="absolute w-24 h-24 border border-pink-500/20 rounded-full animate-ping" />
      </div>
    </div>
  );
};

export default Loader;