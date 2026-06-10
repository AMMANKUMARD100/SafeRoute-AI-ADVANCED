const express = require('express');
const router = express.Router();
const {
  triggerSOS,
  checkIn,
  getAlerts,
  resolveAlert,
} = require('../controllers/alertController');
const protect = require('../middleware/authMiddleware');

router.use(protect);

router.post('/sos', triggerSOS);
router.post('/checkin', checkIn);
router.get('/', getAlerts);
router.put('/:id/resolve', resolveAlert);

module.exports = router;