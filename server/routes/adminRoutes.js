const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getAlertsByArea,
  getRecentAlerts,
} = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');

// All admin routes require auth (ideally also role check)
router.use(protect);

router.get('/analytics', getAnalytics);
router.get('/alerts-by-area', getAlertsByArea);
router.get('/recent-alerts', getRecentAlerts);

module.exports = router;