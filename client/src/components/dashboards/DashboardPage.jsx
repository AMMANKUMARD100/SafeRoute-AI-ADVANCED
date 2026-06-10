import { motion } from 'framer-motion';
import StatsCards from './StatsCards';
import SafetyScoreChart from './SafetyScoreChart';
import RecentAlerts from './RecentAlerts';
import UpcomingTrips from './UpcomingTrips';
import LiveHeatmapMini from './LiveHeatmapMini';

const DashboardPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl sm:text-4xl font-bold text-white mb-2"
      >
        Dashboard
      </motion.h1>
      <p className="text-gray-400 mb-8">Your safety, at a glance.</p>

      {/* Statistics Cards */}
      <StatsCards />

      {/* Charts & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SafetyScoreChart />
        <RecentAlerts />
      </div>

      {/* Upcoming Trips & Mini Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingTrips />
        <LiveHeatmapMini />
      </div>
    </motion.div>
  );
};

export default DashboardPage;