const express = require('express');
const router = express.Router();
const {
  planRoute,
  startTrip,
  endTrip,
  updateLocation,
  getTrip,
  getTrips,
} = require('../controllers/tripController');
const protect = require('../middleware/authMiddleware');

// All trip routes require authentication
router.use(protect);

router.post('/plan', planRoute);
router.put('/:id/start', startTrip);
router.put('/:id/end', endTrip);
router.post('/:id/location', updateLocation);
router.get('/:id', getTrip);
router.get('/', getTrips);

module.exports = router;