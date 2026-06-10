import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const stats = [
  {
    label: 'Overall Safety Score',
    value: 86,
    change: '+4%',
    icon: ShieldCheckIcon,
    color: 'from-emerald-400 to-green-600',
    bg: 'bg-emerald-400/10',
  },
  {
    label: 'Trips Completed Safely',
    value: 42,
    change: 'this month',
    icon: MapPinIcon,
    color: 'from-blue-400 to-indigo-600',
    bg: 'bg-blue-400/10',
  },
  {
    label: 'Active Alerts',
    value: 2,
    change: 'nearby',
    icon: ExclamationTriangleIcon,
    color: 'from-amber-400 to-orange-600',
    bg: 'bg-amber-400/10',
  },
  {
    label: 'Night Trips',
    value: 12,
    change: 'protected',
    icon: ClockIcon,
    color: 'from-purple-400 to-fuchsia-600',
    bg: 'bg-purple-400/10',
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const StatsCards = () => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          variants={item}
          className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden"
        >
          <div
            className={`absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20 bg-gradient-to-br ${stat.color} blur-xl`}
          />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </div>
            <div className={`p-2 rounded-xl ${stat.bg}`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsCards;