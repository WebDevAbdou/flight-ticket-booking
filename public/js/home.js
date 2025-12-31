// Home Page JavaScript - Clean Version
console.log('✅ home.js loaded successfully');

// API_URL is already defined in auth.js, so we don't redeclare it
let allFlights = [];

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Content Loaded');
    
    // Setup all event listeners
    setupEventListeners();
    
    // Setup date validation
    setupDateValidation();
    
    // Load initial data
    loadFilters();
    loadFlights();
});

// Setup all event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Trip type toggle
    const tripTypeRadios = document.querySelectorAll('input[name="tripType"]');
    const returnDateGroup = document.getElementById('returnDateGroup');
    
    tripTypeRadios.forEach(radio => {
        radio.addEventListener('change', function(e) {
            if (e.target.value === 'round-trip') {
                returnDateGroup.style.display = 'block';
            } else {
                returnDateGroup.style.display = 'none';
                document.getElementById('returnDate').value = '';
            }
        });
    });
    
    // Search form
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Search form submitted');

        const filters = {
            origin: document.getElementById('origin').value,
            destination: document.getElementById('destination').value,
            date: document.getElementById('date').value,
            travelClass: document.getElementById('travelClass').value,
            passengers: document.getElementById('passengers').value
        };

        loadFlights(filters);
    });
    
    // Clear button
    const clearBtn = document.getElementById('clearBtn');
    clearBtn.addEventListener('click', function() {
        searchForm.reset();
        loadFlights();
    });
    
    console.log('✅ Event listeners setup complete');
}

// Setup date validation
function setupDateValidation() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('date');
    const returnDateInput = document.getElementById('returnDate');
    
    dateInput.setAttribute('min', today);
    returnDateInput.setAttribute('min', today);
    
    dateInput.addEventListener('change', function(e) {
        returnDateInput.setAttribute('min', e.target.value || today);
        if (returnDateInput.value && returnDateInput.value < e.target.value) {
            returnDateInput.value = '';
        }
    });
}

// Load filters (origins and destinations)
async function loadFilters() {
    console.log('Loading filters...');
    
    try {
        const response1 = await fetch(`${API_URL}/flights/origins`);
        const response2 = await fetch(`${API_URL}/flights/destinations`);
        
        const originsData = await response1.json();
        const destinationsData = await response2.json();
        
        const originSelect = document.getElementById('origin');
        const destinationSelect = document.getElementById('destination');
        
        if (originsData.success) {
            originsData.origins.forEach(origin => {
                const option = document.createElement('option');
                option.value = origin;
                option.textContent = origin;
                originSelect.appendChild(option);
            });
        }
        
        if (destinationsData.success) {
            destinationsData.destinations.forEach(destination => {
                const option = document.createElement('option');
                option.value = destination;
                option.textContent = destination;
                destinationSelect.appendChild(option);
            });
        }
        
        console.log('✅ Filters loaded');
    } catch (error) {
        console.error('Error loading filters:', error);
    }
}

// Load flights
async function loadFlights(filters = {}) {
    console.log('Loading flights with filters:', filters);
    
    const loadingSpinner = document.getElementById('loadingSpinner');
    const flightsList = document.getElementById('flightsList');
    const noFlights = document.getElementById('noFlights');
    
    // Show loading
    loadingSpinner.classList.remove('hidden');
    flightsList.innerHTML = '';
    noFlights.classList.add('hidden');
    
    try {
        // Build query string
        const params = new URLSearchParams();
        if (filters.origin) params.append('origin', filters.origin);
        if (filters.destination) params.append('destination', filters.destination);
        if (filters.date) params.append('date', filters.date);
        if (filters.travelClass) params.append('travelClass', filters.travelClass);
        if (filters.passengers) params.append('passengers', filters.passengers);

        const url = `${API_URL}/flights?${params}`;
        console.log('Fetching from:', url);
        
        const response = await fetch(url);
        const data = await response.json();

        console.log('Flights data received:', data);

        // Hide loading
        loadingSpinner.classList.add('hidden');

        if (data.success && data.flights && data.flights.length > 0) {
            console.log(`✅ Displaying ${data.flights.length} flights`);
            allFlights = data.flights;

            data.flights.forEach(flight => {
                const card = createFlightCard(flight);
                flightsList.appendChild(card);
            });
        } else {
            console.log('No flights found');
            noFlights.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error loading flights:', error);
        loadingSpinner.classList.add('hidden');
        noFlights.classList.remove('hidden');
    }
}

// Create flight card
function createFlightCard(flight) {
    const card = document.createElement('div');
    card.className = 'card';

    const departureTime = new Date(flight.departure_time);
    const arrivalTime = new Date(flight.arrival_time);

    // Calculate duration
    const durationMs = arrivalTime - departureTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const duration = `${hours}h ${minutes}m`;

    // Format date
    const flightDate = departureTime.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    // Extract airport codes
    const originCode = flight.origin.match(/\(([^)]+)\)/)?.[1] || flight.origin.substring(0, 3).toUpperCase();
    const destCode = flight.destination.match(/\(([^)]+)\)/)?.[1] || flight.destination.substring(0, 3).toUpperCase();

    card.innerHTML = `
        <div class="flight-card">
            <div class="flight-header">
                <div class="airline-name">
                    <strong>${flight.airline}</strong>
                    <span class="flight-number-badge">${flight.flight_number}</span>
                </div>
                <div class="flight-date-badge">${flightDate}</div>
            </div>
            <div class="flight-route">
                <div class="flight-location">
                    <div class="flight-code">${originCode}</div>
                    <div class="flight-time">${departureTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div class="flight-duration-info">
                    <div class="flight-arrow">
                        <span class="plane-icon">✈</span>
                    </div>
                    <div class="duration-text">${duration}</div>
                </div>
                <div class="flight-location">
                    <div class="flight-code">${destCode}</div>
                    <div class="flight-time">${arrivalTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
            </div>
            <div class="flight-footer">
                <div class="flight-details">
                    <span class="seats-available">${flight.available_seats} seats</span>
                    <div class="class-prices">
                        <span class="class-price-item"><strong>Economy</strong> $${parseFloat(flight.economy_price).toFixed(2)}</span>
                        <span class="class-price-item"><strong>Business</strong> $${parseFloat(flight.business_price).toFixed(2)}</span>
                        <span class="class-price-item"><strong>First</strong> $${parseFloat(flight.first_class_price).toFixed(2)}</span>
                    </div>
                </div>
                <div class="flight-price">
                    <div class="price-label">from</div>
                    <div class="price-amount">$${parseFloat(flight.economy_price).toFixed(2)}</div>
                    <button class="btn btn-primary" onclick="bookFlight(${flight.flight_id})" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    `;

    return card;
}

// Book flight function
function bookFlight(flightId) {
    if (!isLoggedIn()) {
        alert('Please login to book a flight');
        window.location.href = '/login';
        return;
    }
    window.location.href = `/booking?flightId=${flightId}`;
}

