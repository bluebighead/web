const express = require('express');

const router = express.Router();

router.post('/register', (req, res) => {
  res.json({ message: 'Registration endpoint - not implemented yet' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint - not implemented yet' });
});

module.exports = router;
