// Dashboard Page JavaScript
// API_URL is already defined in auth.js

// Require authentication
if (!requireAuth()) {
    throw new Error('Authentication required');
}

// Show alert message
const showAlert = (message, type = 'error') => {
    const alertDiv = document.getElementById('alertMessage');
    alertDiv.innerHTML = `
        <div class="alert alert-${type}">
            ${message}
        </div>
    `;
    setTimeout(() => {
        alertDiv.innerHTML = '';
    }, 5000);
};

// Load user profile
const loadProfile = async () => {
    const user = getUser();
    if (user) {
        document.getElementById('welcomeMessage').textContent = `Welcome back, ${user.fullName}!`;
    }
};

// Load user bookings
const loadBookings = async () => {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const bookingsList = document.getElementById('bookingsList');
    const noBookings = document.getElementById('noBookings');

    try {
        const response = await authFetch(`${API_URL}/bookings`);
        const data = await response.json();

        loadingSpinner.classList.add('hidden');

        if (data.success && data.bookings.length > 0) {
            displayBookings(data.bookings);
            noBookings.classList.add('hidden');
        } else {
            bookingsList.innerHTML = '';
            noBookings.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        loadingSpinner.classList.add('hidden');
        showAlert('Failed to load bookings');
    }
};

// Display bookings
const displayBookings = (bookings) => {
    const bookingsList = document.getElementById('bookingsList');
    bookingsList.innerHTML = '';

    bookings.forEach(booking => {
        const bookingCard = createBookingCard(booking);
        bookingsList.appendChild(bookingCard);
    });
};

// Create booking card
const createBookingCard = (booking) => {
    const card = document.createElement('div');
    card.className = 'card';
    
    const departureTime = new Date(booking.departure_time);
    const bookingDate = new Date(booking.booking_date);
    
    const statusClass = `status-${booking.status}`;
    
    const originCode = booking.origin.match(/\(([^)]+)\)/)?.[1] || booking.origin.substring(0, 3).toUpperCase();
    const destCode = booking.destination.match(/\(([^)]+)\)/)?.[1] || booking.destination.substring(0, 3).toUpperCase();

    card.innerHTML = `
        <div class="card-header">
            <div>
                <h3 class="card-title">Booking Reference: ${booking.booking_reference}</h3>
                <span class="booking-status ${statusClass}">${booking.status.toUpperCase()}</span>
            </div>
            <div class="price-amount">$${parseFloat(booking.price).toFixed(2)}</div>
        </div>
        <div class="card-body">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div>
                    <h4>Flight Details</h4>
                    <p><strong>Flight:</strong> ${booking.flight_number}</p>
                    <p><strong>Airline:</strong> ${booking.airline}</p>
                    <p><strong>Route:</strong> ${originCode} → ${destCode}</p>
                    <p><strong>Departure:</strong> ${departureTime.toLocaleString()}</p>
                    <p><strong>Seat:</strong> ${booking.seat_number}</p>
                </div>
                <div>
                    <h4>Passenger Details</h4>
                    <p><strong>Name:</strong> ${booking.passenger_name}</p>
                    <p><strong>Email:</strong> ${booking.passenger_email}</p>
                    <p><strong>Booked On:</strong> ${bookingDate.toLocaleDateString()}</p>
                </div>
            </div>
        </div>
        ${booking.status === 'confirmed' ? `
            <div style="text-align: right;">
                <a href="/receipt?bookingId=${booking.booking_id}" class="btn btn-primary">View Receipt</a>
            </div>
        ` : ''}
    `;

    return card;
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadBookings();
});

