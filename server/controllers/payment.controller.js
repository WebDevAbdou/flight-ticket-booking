// Payment Controller
const { pool } = require('../config/db');
const { generateReceipt } = require('../utils/receiptGenerator');

// Generate unique transaction ID
const generateTransactionId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `TXN${timestamp}${random}`;
};

// Generate receipt number
const generateReceiptNumber = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let number = 'RCP';
    for (let i = 0; i < 10; i++) {
        number += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return number;
};

// Process payment
const processPayment = async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        const { bookingId, paymentMethod, cardNumber } = req.body;
        const userId = req.user.userId;

        // Validation
        if (!bookingId || !paymentMethod || !cardNumber) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required payment details'
            });
        }

        // Start transaction
        await connection.beginTransaction();

        // Verify booking belongs to user and is pending
        const [bookings] = await connection.query(
            `SELECT b.booking_id, b.booking_reference, b.passenger_name, 
                    b.passenger_email, b.passenger_phone, b.seat_number, b.status,
                    f.flight_number, f.airline, f.origin, f.destination,
                    f.departure_time, f.arrival_time, f.price
            FROM bookings b
            JOIN flights f ON b.flight_id = f.flight_id
            WHERE b.booking_id = ? AND b.user_id = ? FOR UPDATE`,
            [bookingId, userId]
        );

        if (bookings.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        const booking = bookings[0];

        if (booking.status !== 'pending') {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'Booking is not in pending status'
            });
        }

        // Check if payment already exists
        const [existingPayments] = await connection.query(
            'SELECT payment_id FROM payments WHERE booking_id = ?',
            [bookingId]
        );

        if (existingPayments.length > 0) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'Payment already processed for this booking'
            });
        }

        // Generate transaction ID and get last 4 digits of card
        const transactionId = generateTransactionId();
        const cardLastFour = cardNumber.slice(-4);

        // Create payment record
        const [paymentResult] = await connection.query(
            `INSERT INTO payments 
            (booking_id, amount, payment_method, card_last_four, transaction_id, status) 
            VALUES (?, ?, ?, ?, ?, 'completed')`,
            [bookingId, booking.price, paymentMethod, cardLastFour, transactionId]
        );

        // Update booking status to confirmed
        await connection.query(
            'UPDATE bookings SET status = "confirmed" WHERE booking_id = ?',
            [bookingId]
        );

        // Generate receipt number
        const receiptNumber = generateReceiptNumber();

        // Create receipt record
        const [receiptResult] = await connection.query(
            'INSERT INTO receipts (booking_id, receipt_number) VALUES (?, ?)',
            [bookingId, receiptNumber]
        );

        // Commit transaction
        await connection.commit();

        // Get complete payment data for receipt generation
        const [paymentData] = await connection.query(
            `SELECT 
                r.receipt_id, r.receipt_number, r.generated_at,
                b.booking_reference, b.passenger_name, b.passenger_email, 
                b.passenger_phone, b.seat_number,
                f.flight_number, f.airline, f.origin, f.destination,
                f.departure_time, f.arrival_time,
                p.amount, p.payment_method, p.transaction_id, p.payment_date
            FROM receipts r
            JOIN bookings b ON r.booking_id = b.booking_id
            JOIN flights f ON b.flight_id = f.flight_id
            JOIN payments p ON b.booking_id = p.booking_id
            WHERE r.receipt_id = ?`,
            [receiptResult.insertId]
        );

        const receiptData = paymentData[0];

        // Generate PDF receipt asynchronously
        generateReceipt(receiptData, async (error, filepath) => {
            if (!error && filepath) {
                // Update receipt with PDF path
                await pool.query(
                    'UPDATE receipts SET pdf_path = ? WHERE receipt_id = ?',
                    [filepath, receiptResult.insertId]
                );
            }
        });

        res.status(200).json({
            success: true,
            message: 'Payment processed successfully',
            payment: {
                paymentId: paymentResult.insertId,
                transactionId: transactionId,
                amount: booking.price,
                receiptId: receiptResult.insertId,
                receiptNumber: receiptNumber
            }
        });

    } catch (error) {
        await connection.rollback();
        console.error('Process payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while processing payment'
        });
    } finally {
        connection.release();
    }
};

module.exports = { processPayment };

