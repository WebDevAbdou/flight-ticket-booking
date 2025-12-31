// Main Server File
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const flightRoutes = require('./routes/flight.routes');
const bookingRoutes = require('./routes/booking.routes');
const paymentRoutes = require('./routes/payment.routes');
const receiptRoutes = require('./routes/receipt.routes');
const contactRoutes = require('./routes/contact.routes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

app.get('/booking', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/booking.html'));
});

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/payment.html'));
});

app.get('/receipt', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/receipt.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/contact.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
    });
});

// Start server
const startServer = async () => {
    try {
        // Test database connection
        await testConnection();
        
        // Start listening
        app.listen(PORT, () => {
            console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`\n📄 Available pages:`);
            console.log(`   - Home: http://localhost:${PORT}/`);
            console.log(`   - Login: http://localhost:${PORT}/login`);
            console.log(`   - Register: http://localhost:${PORT}/register`);
            console.log(`   - Dashboard: http://localhost:${PORT}/dashboard`);
            console.log(`   - About: http://localhost:${PORT}/about`);
            console.log(`   - Contact: http://localhost:${PORT}/contact`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

