const SafetyScore = require('../models/SafetyScore');
const axios = require('axios');
const config = require('../config/config');

// @desc    Get safety score for a specific point
// @route   GET /api/safety/score?lat=19.076&lng=72.877
exports.getScore = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ message: 'lat and lng required' });
    }

    // Find nearest grid point (real app: geospatial query)
    const point = await SafetyScore.findOne({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 500, // 500m radius
        },
      },
    });

    if (!point) {
      // Fallback: call AI service or return mock
      return res.json({
        overallScore: 75,
        crimeScore: 25,
        lightingScore: 70,
        crowdScore: 60,
        emergencyAccessScore: 80,
      });
    }

    res.json(point);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get heatmap data (aggregated danger zones)
// @route   GET /api/safety/heatmap
exports.getHeatmap = async (req, res) => {
  try {
    // Return all points with low safety scores (danger zones)
    const points = await SafetyScore.find({ overallScore: { $lt: 50 } }).limit(500);
    const heatmapData = points.map((p) => ({
      lat: p.location.coordinates[1],
      lng: p.location.coordinates[0],
      weight: 1 - p.overallScore / 100, // higher weight for lower scores
    }));
    res.json({ points: heatmapData });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};