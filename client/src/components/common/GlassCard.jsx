import { motion } from 'framer-motion';

const GlassCard = ({
  children,
  className = '',
  hover = true,
  onClick,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
      className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-xl shadow-purple-900/20 p-6 transition-all ${
        hover ? 'cursor-pointer hover:border-pink-500/30' : ''
      } ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;