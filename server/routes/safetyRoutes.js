const express = require('express');
const router = express.Router();
const {
  getScore,
  getHeatmap,
} = require('../controllers/safetyController');
const protect = require('../middleware/authMiddleware');

// Both endpoints require authentication
router.use(protect);

router.get('/score', getScore);
router.get('/heatmap', getHeatmap);

module.exports = router;