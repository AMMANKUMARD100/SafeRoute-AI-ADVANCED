import { motion } from 'framer-motion';
import { ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';

const upcomingTrips = [
  {
    id: 1,
    from: 'CST Station',
    to: 'Juhu Beach',
    time: 'Today, 6:30 PM',
    safetyScore: 88,
  },
  {
    id: 2,
    from: 'Home (Powai)',
    to: 'BKC Office',
    time: 'Tomorrow, 9:00 AM',
    safetyScore: 92,
  },
];

const UpcomingTrips = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Upcoming Trips</h3>
      {upcomingTrips.length === 0 ? (
        <p className="text-gray-400 text-sm">No upcoming trips. Plan a safe route now.</p>
      ) : (
        <div className="space-y-3">
          {upcomingTrips.map((trip) => (
            <motion.div
              key={trip.id}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-3"
            >
              <div>
                <div className="flex items-center gap-2 text-sm text-white font-medium">
                  <MapPinIcon className="h-4 w-4 text-pink-400" />
                  {trip.from} → {trip.to}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <ClockIcon className="h-3 w-3" />
                  {trip.time}
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-emerald-400">
                  {trip.safetyScore}
                </span>
                <span className="text-xs text-gray-500 block">safety</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default UpcomingTrips;