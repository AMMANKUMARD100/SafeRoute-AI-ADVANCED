const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateContacts,
} = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require JWT)
router.get('/me', protect, getMe);
router.put('/contacts', protect, updateContacts);

module.exports = router;