// Flight Routes
const express = require('express');
const router = express.Router();
const { 
    getFlights, 
    getFlightById, 
    getOrigins, 
    getDestinations 
} = require('../controllers/flight.controller');

// Public routes - anyone can view flights
router.get('/', getFlights);
router.get('/origins', getOrigins);
router.get('/destinations', getDestinations);
router.get('/:id', getFlightById);

module.exports = router;

