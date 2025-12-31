// Payment Page JavaScript
// API_URL is already defined in auth.js

// Require authentication
if (!requireAuth()) {
    throw new Error('Authentication required');
}

let currentBooking = null;

// Show alert message
const showAlert = (message, type = 'error') => {
    const alertDiv = document.getElementById('alertMessage');
    alertDiv.innerHTML = `
        <div class="alert alert-${type}">
            ${message}
        </div>
    `;
    window.scrollTo(0, 0);
};

// Get booking ID from URL
const getBookingId = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('bookingId');
};

// Load booking details
const loadBookingDetails = async () => {
    const bookingId = getBookingId();
    
    if (!bookingId) {
        showAlert('No booking selected');
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 2000);
        return;
    }

    try {
        const response = await authFetch(`${API_URL}/bookings/${bookingId}`);
        const data = await response.json();

        if (data.success) {
            currentBooking = data.booking;
            displayBookingSummary(data.booking);
        } else {
            showAlert('Booking not found');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
        }
    } catch (error) {
        console.error('Error loading booking:', error);
        showAlert('Failed to load booking details');
    }
};

// Display booking summary
const displayBookingSummary = (booking) => {
    const bookingSummary = document.getElementById('bookingSummary');
    
    const departureTime = new Date(booking.departure_time);
    const arrivalTime = new Date(booking.arrival_time);
    
    const originCode = booking.origin.match(/\(([^)]+)\)/)?.[1] || booking.origin.substring(0, 3).toUpperCase();
    const destCode = booking.destination.match(/\(([^)]+)\)/)?.[1] || booking.destination.substring(0, 3).toUpperCase();

    bookingSummary.innerHTML = `
        <div class="receipt-section">
            <h3>Flight Information</h3>
            <div class="receipt-row">
                <span class="receipt-label">Booking Reference:</span>
                <span class="receipt-value">${booking.booking_reference}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Flight:</span>
                <span class="receipt-value">${booking.flight_number}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Airline:</span>
                <span class="receipt-value">${booking.airline}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Route:</span>
                <span class="receipt-value">${originCode} → ${destCode}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Departure:</span>
                <span class="receipt-value">${departureTime.toLocaleString()}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Arrival:</span>
                <span class="receipt-value">${arrivalTime.toLocaleString()}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Seat:</span>
                <span class="receipt-value">${booking.seat_number}</span>
            </div>
        </div>
        
        <div class="receipt-section">
            <h3>Passenger Information</h3>
            <div class="receipt-row">
                <span class="receipt-label">Name:</span>
                <span class="receipt-value">${booking.passenger_name}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Email:</span>
                <span class="receipt-value">${booking.passenger_email}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Phone:</span>
                <span class="receipt-value">${booking.passenger_phone}</span>
            </div>
        </div>
        
        <div class="receipt-section">
            <div class="receipt-row" style="font-size: 1.5rem;">
                <span class="receipt-label">Total Amount:</span>
                <span class="receipt-value" style="color: var(--primary-color); font-weight: bold;">
                    $${parseFloat(booking.price).toFixed(2)}
                </span>
            </div>
        </div>
    `;
};

// Format card number input
document.getElementById('cardNumber').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
});

// Format expiry date input
document.getElementById('expiryDate').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
});

// Format CVV input
document.getElementById('cvv').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
});

// Handle payment form submission
document.getElementById('paymentForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const bookingId = getBookingId();
    const paymentMethod = document.getElementById('paymentMethod').value;
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');

    // Basic validation
    if (cardNumber.length < 13 || cardNumber.length > 19) {
        showAlert('Please enter a valid card number');
        return;
    }

    try {
        const response = await authFetch(`${API_URL}/payments`, {
            method: 'POST',
            body: JSON.stringify({
                bookingId,
                paymentMethod,
                cardNumber
            })
        });

        const data = await response.json();

        if (data.success) {
            // Redirect to receipt page
            window.location.href = `/receipt?bookingId=${bookingId}`;
        } else {
            showAlert(data.message || 'Payment failed. Please try again.');
        }
    } catch (error) {
        console.error('Payment error:', error);
        showAlert('An error occurred. Please try again.');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadBookingDetails();
});

