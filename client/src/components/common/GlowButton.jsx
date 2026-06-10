import { motion } from 'framer-motion';

const GlowButton = ({
  children,
  color = 'pink',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  pulse = false,
}) => {
  const colorMap = {
    pink: 'from-pink-600 to-rose-600 shadow-pink-500/50',
    purple: 'from-purple-600 to-indigo-600 shadow-purple-500/50',
    red: 'from-red-600 to-rose-700 shadow-red-500/50',
    green: 'from-emerald-500 to-teal-600 shadow-emerald-500/50',
  };

  const sizeMap = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`relative inline-flex items-center justify-center rounded-full font-semibold text-white bg-gradient-to-r ${
        colorMap[color]
      } ${sizeMap[size]} shadow-lg transition-opacity ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'
      } ${className}`}
      onClick={onClick}
    >
      {children}
      {pulse && (
        <span className="absolute inset-0 rounded-full bg-white/10 animate-ping" />
      )}
    </motion.button>
  );
};

export default GlowButton;