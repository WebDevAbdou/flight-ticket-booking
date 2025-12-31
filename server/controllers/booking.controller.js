// Booking Controller
const { pool } = require('../config/db');

// Generate unique booking reference
const generateBookingReference = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let reference = 'BK';
    for (let i = 0; i < 8; i++) {
        reference += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return reference;
};

// Generate seat number
const generateSeatNumber = (totalSeats, availableSeats) => {
    const seatNumber = totalSeats - availableSeats + 1;
    const row = Math.ceil(seatNumber / 6);
    const seatLetter = String.fromCharCode(65 + ((seatNumber - 1) % 6)); // A-F
    return `${row}${seatLetter}`;
};

// Create booking
const createBooking = async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        const { flightId, passengerName, passengerEmail, passengerPhone } = req.body;
        const userId = req.user.userId;

        // Validation
        if (!flightId || !passengerName || !passengerEmail || !passengerPhone) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Start transaction
        await connection.beginTransaction();

        // Check flight availability
        const [flights] = await connection.query(
            'SELECT flight_id, available_seats, total_seats, price FROM flights WHERE flight_id = ? AND status = "scheduled" FOR UPDATE',
            [flightId]
        );

        if (flights.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Flight not found or not available'
            });
        }

        const flight = flights[0];

        if (flight.available_seats <= 0) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'No seats available on this flight'
            });
        }

        // Generate booking reference and seat number
        const bookingReference = generateBookingReference();
        const seatNumber = generateSeatNumber(flight.total_seats, flight.available_seats);

        // Create booking
        const [bookingResult] = await connection.query(
            `INSERT INTO bookings 
            (booking_reference, user_id, flight_id, passenger_name, passenger_email, passenger_phone, seat_number, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [bookingReference, userId, flightId, passengerName, passengerEmail, passengerPhone, seatNumber]
        );

        // Update available seats
        await connection.query(
            'UPDATE flights SET available_seats = available_seats - 1 WHERE flight_id = ?',
            [flightId]
        );

        // Commit transaction
        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking: {
                bookingId: bookingResult.insertId,
                bookingReference: bookingReference,
                seatNumber: seatNumber,
                amount: flight.price
            }
        });

    } catch (error) {
        await connection.rollback();
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating booking'
        });
    } finally {
        connection.release();
    }
};

// Get user bookings
const getUserBookings = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [bookings] = await pool.query(
            `SELECT 
                b.booking_id, b.booking_reference, b.passenger_name, 
                b.passenger_email, b.seat_number, b.booking_date, b.status,
                f.flight_number, f.airline, f.origin, f.destination,
                f.departure_time, f.arrival_time, f.price
            FROM bookings b
            JOIN flights f ON b.flight_id = f.flight_id
            WHERE b.user_id = ?
            ORDER BY b.booking_date DESC`,
            [userId]
        );

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings: bookings
        });

    } catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching bookings'
        });
    }
};

// Get booking by ID
const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const [bookings] = await pool.query(
            `SELECT 
                b.booking_id, b.booking_reference, b.passenger_name, 
                b.passenger_email, b.passenger_phone, b.seat_number, 
                b.booking_date, b.status,
                f.flight_id, f.flight_number, f.airline, f.origin, f.destination,
                f.departure_time, f.arrival_time, f.price
            FROM bookings b
            JOIN flights f ON b.flight_id = f.flight_id
            WHERE b.booking_id = ? AND b.user_id = ?`,
            [id, userId]
        );

        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            booking: bookings[0]
        });

    } catch (error) {
        console.error('Get booking by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = { 
    createBooking, 
    getUserBookings, 
    getBookingById 
};

