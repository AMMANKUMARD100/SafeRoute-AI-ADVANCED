import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { StatsCards, SafetyScoreChart, RecentAlerts, UpcomingTrips, LiveHeatmapMini } from '../components/dashboards';
import { useNavigate } from 'react-router-dom';
import GlowButton from '../components/common/GlowButton';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const userName = user.name ? user.name.split(' ')[0] : 'User';

  return (
    <div className="min-h-screen bg-gray-950 pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
      {/* Header with CTA */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
          Welcome back, <span className="bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">{userName}</span>
        </h1>
        <p className="text-gray-400 text-lg mb-6">Your personalized safety dashboard</p>
        
        {/* Quick Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          <Link to="/route-analysis">
            <GlowButton color="pink" size="md">Plan Route</GlowButton>
          </Link>
          <Link to="/live-tracking">
            <GlowButton color="purple" size="md">Live Tracking</GlowButton>
          </Link>
          <Link to="/emergency">
            <GlowButton color="red" size="md">Emergency</GlowButton>
          </Link>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <StatsCards />
      </motion.div>

      {/* Charts & Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SafetyScoreChart />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <RecentAlerts />
        </motion.div>
      </div>

      {/* Trips & Heatmap Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <UpcomingTrips />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <LiveHeatmapMini />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;