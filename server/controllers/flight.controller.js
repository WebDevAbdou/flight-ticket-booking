// Flight Controller
const { pool } = require('../config/db');

// Get all flights with optional filters
const getFlights = async (req, res) => {
    try {
        const { origin, destination, date, travelClass, passengers } = req.query;

        let query = `
            SELECT
                flight_id, flight_number, airline, origin, destination,
                departure_time, arrival_time, price,
                economy_price, business_price, first_class_price,
                available_seats, status
            FROM flights
            WHERE status = 'scheduled' AND available_seats > 0
        `;

        const params = [];

        // Apply filters
        if (origin) {
            query += ' AND origin LIKE ?';
            params.push(`%${origin}%`);
        }

        if (destination) {
            query += ' AND destination LIKE ?';
            params.push(`%${destination}%`);
        }

        // More flexible date search - show flights on or after the selected date
        // This makes it work like real flight booking systems
        if (date) {
            query += ' AND DATE(departure_time) >= ?';
            params.push(date);
        } else {
            // If no date specified, show only future flights
            query += ' AND departure_time >= NOW()';
        }

        // Filter by available seats based on number of passengers
        if (passengers) {
            query += ' AND available_seats >= ?';
            params.push(parseInt(passengers));
        }

        query += ' ORDER BY departure_time ASC LIMIT 50';

        const [flights] = await pool.query(query, params);

        res.status(200).json({
            success: true,
            count: flights.length,
            flights: flights
        });

    } catch (error) {
        console.error('Get flights error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching flights'
        });
    }
};

// Get single flight by ID
const getFlightById = async (req, res) => {
    try {
        const { id } = req.params;

        const [flights] = await pool.query(
            `SELECT
                flight_id, flight_number, airline, origin, destination,
                departure_time, arrival_time, price,
                economy_price, business_price, first_class_price,
                total_seats, available_seats, status
            FROM flights
            WHERE flight_id = ?`,
            [id]
        );

        if (flights.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Flight not found'
            });
        }

        res.status(200).json({
            success: true,
            flight: flights[0]
        });

    } catch (error) {
        console.error('Get flight by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching flight'
        });
    }
};

// Get unique origins for search filter
const getOrigins = async (req, res) => {
    try {
        const [origins] = await pool.query(
            'SELECT DISTINCT origin FROM flights WHERE status = "scheduled" ORDER BY origin'
        );

        res.status(200).json({
            success: true,
            origins: origins.map(row => row.origin)
        });

    } catch (error) {
        console.error('Get origins error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get unique destinations for search filter
const getDestinations = async (req, res) => {
    try {
        const [destinations] = await pool.query(
            'SELECT DISTINCT destination FROM flights WHERE status = "scheduled" ORDER BY destination'
        );

        res.status(200).json({
            success: true,
            destinations: destinations.map(row => row.destination)
        });

    } catch (error) {
        console.error('Get destinations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = { 
    getFlights, 
    getFlightById, 
    getOrigins, 
    getDestinations 
};

