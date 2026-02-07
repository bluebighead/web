const express = require('express');
const { register, login, getProfile, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.get('/me', protect, getCurrentUser);

module.exports = router;