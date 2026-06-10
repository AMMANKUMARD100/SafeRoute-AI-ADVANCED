const express = require('express');
const router = express.Router();
const {
  detectDistressText,
  detectStressAudio,
  assistant,
} = require('../controllers/voiceController');
const protect = require('../middleware/authMiddleware');

// Protect all voice endpoints (user must be logged in)
router.use(protect);

router.post('/detect-distress-text', detectDistressText);
router.post('/detect-stress-audio', detectStressAudio);
router.post('/assistant', assistant);

module.exports = router;