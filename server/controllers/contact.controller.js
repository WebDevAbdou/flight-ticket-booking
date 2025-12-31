// Contact Controller
const { pool } = require('../config/db');

// Submit contact form
const submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Insert contact message
        const [result] = await pool.query(
            'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject || null, message]
        );

        res.status(201).json({
            success: true,
            message: 'Your message has been submitted successfully. We will get back to you soon.',
            contactId: result.insertId
        });

    } catch (error) {
        console.error('Submit contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while submitting contact form'
        });
    }
};

module.exports = { submitContact };

