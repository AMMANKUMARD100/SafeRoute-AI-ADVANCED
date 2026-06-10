const Alert = require('../models/Alert');
const Trip = require('../models/Trip');

// @desc    Get overall analytics
// @route   GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const totalAlerts = await Alert.countDocuments();
    const activeAlerts = await Alert.countDocuments({ status: 'active' });
    const totalTrips = await Trip.countDocuments();
    const emergencyTrips = await Trip.countDocuments({ status: 'emergency' });

    res.json({
      totalAlerts,
      activeAlerts,
      totalTrips,
      emergencyTrips,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get alerts aggregated by area
// @route   GET /api/admin/alerts-by-area
exports.getAlertsByArea = async (req, res) => {
  try {
    // Simplified: group by a static map (in production, geo aggregation)
    const alerts = await Alert.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get recent alerts
// @route   GET /api/admin/recent-alerts
exports.getRecentAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 }).limit(20).populate('userId', 'name email');
    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};