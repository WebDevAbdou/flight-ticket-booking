// Receipt Routes
const express = require('express');
const router = express.Router();
const { 
    getReceiptByBooking, 
    downloadReceipt 
} = require('../controllers/receipt.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All receipt routes require authentication
router.get('/:bookingId', authenticateToken, getReceiptByBooking);
router.get('/:bookingId/download', authenticateToken, downloadReceipt);

module.exports = router;

