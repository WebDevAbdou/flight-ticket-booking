// Booking Routes
const express = require('express');
const router = express.Router();
const { 
    createBooking, 
    getUserBookings, 
    getBookingById 
} = require('../controllers/booking.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All booking routes require authentication
router.post('/', authenticateToken, createBooking);
router.get('/', authenticateToken, getUserBookings);
router.get('/:id', authenticateToken, getBookingById);

module.exports = router;

