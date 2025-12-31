// Booking Page JavaScript
// API_URL is already defined in auth.js

// Require authentication
if (!requireAuth()) {
    throw new Error('Authentication required');
}

let currentFlight = null;

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

// Get flight ID from URL
const getFlightId = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('flightId');
};

// Load flight details
const loadFlightDetails = async () => {
    const flightId = getFlightId();
    
    if (!flightId) {
        showAlert('No flight selected');
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/flights/${flightId}`);
        const data = await response.json();

        if (data.success) {
            currentFlight = data.flight;
            displayFlightDetails(data.flight);
            
            // Pre-fill passenger info with user data
            const user = getUser();
            if (user) {
                document.getElementById('passengerName').value = user.fullName;
                document.getElementById('passengerEmail').value = user.email;
            }
        } else {
            showAlert('Flight not found');
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        }
    } catch (error) {
        console.error('Error loading flight:', error);
        showAlert('Failed to load flight details');
    }
};

// Display flight details
const displayFlightDetails = (flight) => {
    const flightDetails = document.getElementById('flightDetails');
    
    const departureTime = new Date(flight.departure_time);
    const arrivalTime = new Date(flight.arrival_time);
    
    const originCode = flight.origin.match(/\(([^)]+)\)/)?.[1] || flight.origin.substring(0, 3).toUpperCase();
    const destCode = flight.destination.match(/\(([^)]+)\)/)?.[1] || flight.destination.substring(0, 3).toUpperCase();

    flightDetails.innerHTML = `
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
            <div>
                <div style="display: flex; align-items: center; gap: 2rem; margin-bottom: 1rem;">
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--primary-color);">${originCode}</div>
                        <div>${flight.origin}</div>
                        <div>${departureTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div style="font-size: 2rem; color: var(--secondary-color);">→</div>
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--primary-color);">${destCode}</div>
                        <div>${flight.destination}</div>
                        <div>${arrivalTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                </div>
                <p><strong>Airline:</strong> ${flight.airline}</p>
                <p><strong>Flight Number:</strong> ${flight.flight_number}</p>
                <p><strong>Date:</strong> ${departureTime.toLocaleDateString()}</p>
                <p><strong>Available Seats:</strong> ${flight.available_seats}</p>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 2.5rem; font-weight: bold; color: var(--primary-color);">
                    $${parseFloat(flight.price).toFixed(2)}
                </div>
                <div style="color: var(--secondary-color);">per person</div>
            </div>
        </div>
    `;
};

// Handle booking form submission
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const flightId = getFlightId();
    const passengerName = document.getElementById('passengerName').value;
    const passengerEmail = document.getElementById('passengerEmail').value;
    const passengerPhone = document.getElementById('passengerPhone').value;

    try {
        const response = await authFetch(`${API_URL}/bookings`, {
            method: 'POST',
            body: JSON.stringify({
                flightId,
                passengerName,
                passengerEmail,
                passengerPhone
            })
        });

        const data = await response.json();

        if (data.success) {
            // Redirect to payment page
            window.location.href = `/payment?bookingId=${data.booking.bookingId}`;
        } else {
            showAlert(data.message || 'Booking failed. Please try again.');
        }
    } catch (error) {
        console.error('Booking error:', error);
        showAlert('An error occurred. Please try again.');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFlightDetails();
});

