// Payment Routes
const express = require('express');
const router = express.Router();
const { processPayment } = require('../controllers/payment.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All payment routes require authentication
router.post('/', authenticateToken, processPayment);

module.exports = router;

