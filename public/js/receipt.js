// Receipt Page JavaScript
// API_URL is already defined in auth.js

// Require authentication
if (!requireAuth()) {
    throw new Error('Authentication required');
}

// Get booking ID from URL
const getBookingId = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('bookingId');
};

// Load receipt details
const loadReceipt = async () => {
    const bookingId = getBookingId();
    
    if (!bookingId) {
        alert('No booking selected');
        window.location.href = '/dashboard';
        return;
    }

    try {
        const response = await authFetch(`${API_URL}/receipts/${bookingId}`);
        const data = await response.json();

        if (data.success) {
            displayReceipt(data.receipt);
        } else {
            alert('Receipt not found');
            window.location.href = '/dashboard';
        }
    } catch (error) {
        console.error('Error loading receipt:', error);
        alert('Failed to load receipt');
        window.location.href = '/dashboard';
    }
};

// Display receipt
const displayReceipt = (receipt) => {
    const receiptContent = document.getElementById('receiptContent');
    
    const departureTime = new Date(receipt.departure_time);
    const arrivalTime = new Date(receipt.arrival_time);
    const paymentDate = new Date(receipt.payment_date);
    const generatedAt = new Date(receipt.generated_at);
    
    const originCode = receipt.origin.match(/\(([^)]+)\)/)?.[1] || receipt.origin.substring(0, 3).toUpperCase();
    const destCode = receipt.destination.match(/\(([^)]+)\)/)?.[1] || receipt.destination.substring(0, 3).toUpperCase();

    receiptContent.innerHTML = `
        <div class="receipt-section">
            <div class="receipt-row">
                <span class="receipt-label">Receipt Number:</span>
                <span class="receipt-value">${receipt.receipt_number}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Generated:</span>
                <span class="receipt-value">${generatedAt.toLocaleString()}</span>
            </div>
        </div>

        <div class="receipt-section">
            <h3>Passenger Information</h3>
            <div class="receipt-row">
                <span class="receipt-label">Name:</span>
                <span class="receipt-value">${receipt.passenger_name}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Email:</span>
                <span class="receipt-value">${receipt.passenger_email}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Phone:</span>
                <span class="receipt-value">${receipt.passenger_phone}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Booking Reference:</span>
                <span class="receipt-value">${receipt.booking_reference}</span>
            </div>
        </div>

        <div class="receipt-section">
            <h3>Flight Information</h3>
            <div class="receipt-row">
                <span class="receipt-label">Flight Number:</span>
                <span class="receipt-value">${receipt.flight_number}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Airline:</span>
                <span class="receipt-value">${receipt.airline}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Route:</span>
                <span class="receipt-value">${originCode} (${receipt.origin}) → ${destCode} (${receipt.destination})</span>
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
                <span class="receipt-label">Seat Number:</span>
                <span class="receipt-value">${receipt.seat_number || 'To be assigned'}</span>
            </div>
        </div>

        <div class="receipt-section">
            <h3>Payment Information</h3>
            <div class="receipt-row">
                <span class="receipt-label">Amount Paid:</span>
                <span class="receipt-value" style="font-size: 1.5rem; color: var(--primary-color); font-weight: bold;">
                    $${parseFloat(receipt.amount).toFixed(2)}
                </span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Payment Method:</span>
                <span class="receipt-value">${receipt.payment_method.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Transaction ID:</span>
                <span class="receipt-value">${receipt.transaction_id}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Payment Date:</span>
                <span class="receipt-value">${paymentDate.toLocaleString()}</span>
            </div>
        </div>

        <div style="text-align: center; padding: 1rem; background-color: var(--light-bg); border-radius: 0.5rem;">
            <p style="margin: 0; font-style: italic;">Thank you for booking with FlightBook!</p>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: var(--secondary-color);">
                Please arrive at the airport at least 2 hours before departure.
            </p>
        </div>
    `;
};

// Handle download button
document.getElementById('downloadBtn').addEventListener('click', async () => {
    const bookingId = getBookingId();
    
    try {
        const response = await authFetch(`${API_URL}/receipts/${bookingId}/download`);
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `receipt_${bookingId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            alert('Failed to download receipt. Please try again.');
        }
    } catch (error) {
        console.error('Download error:', error);
        alert('Failed to download receipt. Please try again.');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadReceipt();
});

