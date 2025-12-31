// Receipt Controller
const { pool } = require('../config/db');
const path = require('path');
const fs = require('fs');

// Get receipt by booking ID
const getReceiptByBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user.userId;

        const [receipts] = await pool.query(
            `SELECT 
                r.receipt_id, r.receipt_number, r.generated_at, r.pdf_path,
                b.booking_reference, b.passenger_name, b.passenger_email, 
                b.passenger_phone, b.seat_number, b.status,
                f.flight_number, f.airline, f.origin, f.destination,
                f.departure_time, f.arrival_time,
                p.amount, p.payment_method, p.transaction_id, p.payment_date
            FROM receipts r
            JOIN bookings b ON r.booking_id = b.booking_id
            JOIN flights f ON b.flight_id = f.flight_id
            JOIN payments p ON b.booking_id = p.booking_id
            WHERE r.booking_id = ? AND b.user_id = ?`,
            [bookingId, userId]
        );

        if (receipts.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Receipt not found'
            });
        }

        res.status(200).json({
            success: true,
            receipt: receipts[0]
        });

    } catch (error) {
        console.error('Get receipt error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching receipt'
        });
    }
};

// Download receipt PDF
const downloadReceipt = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user.userId;

        const [receipts] = await pool.query(
            `SELECT r.pdf_path, r.receipt_number
            FROM receipts r
            JOIN bookings b ON r.booking_id = b.booking_id
            WHERE r.booking_id = ? AND b.user_id = ?`,
            [bookingId, userId]
        );

        if (receipts.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Receipt not found'
            });
        }

        const receipt = receipts[0];

        if (!receipt.pdf_path || !fs.existsSync(receipt.pdf_path)) {
            return res.status(404).json({
                success: false,
                message: 'Receipt PDF not available'
            });
        }

        // Send PDF file
        res.download(receipt.pdf_path, `receipt_${receipt.receipt_number}.pdf`, (error) => {
            if (error) {
                console.error('Download error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error downloading receipt'
                });
            }
        });

    } catch (error) {
        console.error('Download receipt error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = { 
    getReceiptByBooking, 
    downloadReceipt 
};

