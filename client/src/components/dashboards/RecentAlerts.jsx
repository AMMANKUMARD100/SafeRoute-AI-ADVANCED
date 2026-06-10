import { motion, AnimatePresence } from 'framer-motion';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

const alerts = [
  {
    id: 1,
    type: 'sos',
    title: 'SOS Triggered',
    location: 'Andheri West, Mumbai',
    time: '10 mins ago',
    status: 'active',
  },
  {
    id: 2,
    type: 'deviation',
    title: 'Route Deviation',
    location: 'Bandra East',
    time: '2 hrs ago',
    status: 'resolved',
  },
  {
    id: 3,
    type: 'distress_voice',
    title: 'Distress Voice Detected',
    location: 'Juhu Beach',
    time: '5 hrs ago',
    status: 'active',
  },
];

const StatusIcon = ({ status }) =>
  status === 'active' ? (
    <ExclamationTriangleIcon className="h-5 w-5 text-amber-400" />
  ) : (
    <CheckCircleIcon className="h-5 w-5 text-emerald-400" />
  );

const RecentAlerts = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Recent Alerts</h3>
      <div className="space-y-3">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-3 hover:border-pink-500/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <StatusIcon status={alert.status} />
                <div>
                  <p className="text-sm font-medium text-white">{alert.title}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPinIcon className="h-3 w-3" />
                    {alert.location} · {alert.time}
                  </div>
                </div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  alert.status === 'active'
                    ? 'bg-amber-400/20 text-amber-300'
                    : 'bg-emerald-400/20 text-emerald-300'
                }`}
              >
                {alert.status}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RecentAlerts;