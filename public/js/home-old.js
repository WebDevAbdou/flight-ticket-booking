// Home Page JavaScript
console.log('home.js loaded');

const API_URL = 'http://localhost:3000/api';
let allFlights = [];

// Load origins and destinations for filters
const loadFilters = async () => {
    console.log('loadFilters called');
    try {
        const originSelect = document.getElementById('origin');
        const destinationSelect = document.getElementById('destination');

        if (!originSelect || !destinationSelect) {
            console.error('Select elements not found!');
            return;
        }

        console.log('Fetching origins and destinations...');
        const [originsRes, destinationsRes] = await Promise.all([
            fetch(`${API_URL}/flights/origins`),
            fetch(`${API_URL}/flights/destinations`)
        ]);

        const originsData = await originsRes.json();
        const destinationsData = await destinationsRes.json();

        console.log('Origins data:', originsData);
        console.log('Destinations data:', destinationsData);

        if (originsData.success && originsData.origins) {
            originsData.origins.forEach(origin => {
                const option = document.createElement('option');
                option.value = origin;
                option.textContent = origin;
                originSelect.appendChild(option);
            });
            console.log('Origins loaded:', originsData.origins.length);
        }

        if (destinationsData.success && destinationsData.destinations) {
            destinationsData.destinations.forEach(destination => {
                const option = document.createElement('option');
                option.value = destination;
                option.textContent = destination;
                destinationSelect.appendChild(option);
            });
            console.log('Destinations loaded:', destinationsData.destinations.length);
        }
    } catch (error) {
        console.error('Error loading filters:', error);
    }
};

// Load flights
const loadFlights = async (filters = {}) => {
    console.log('Loading flights with filters:', filters);
    const loadingSpinner = document.getElementById('loadingSpinner');
    const flightsList = document.getElementById('flightsList');
    const noFlights = document.getElementById('noFlights');

    if (!loadingSpinner || !flightsList || !noFlights) {
        console.error('Required elements not found!');
        return;
    }

    loadingSpinner.classList.remove('hidden');
    flightsList.innerHTML = '';
    noFlights.classList.add('hidden');

    try {
        const queryParams = new URLSearchParams();

        if (filters.origin) queryParams.append('origin', filters.origin);
        if (filters.destination) queryParams.append('destination', filters.destination);
        if (filters.date) queryParams.append('date', filters.date);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

        const url = `${API_URL}/flights?${queryParams}`;
        console.log('Fetching from:', url);

        const response = await fetch(url);
        console.log('Response status:', response.status);

        const data = await response.json();
        console.log('Data received:', data);

        loadingSpinner.classList.add('hidden');

        if (data.success && data.flights && data.flights.length > 0) {
            console.log('Displaying', data.flights.length, 'flights');
            allFlights = data.flights;
            displayFlights(data.flights);
            noFlights.classList.add('hidden');
        } else {
            console.log('No flights found');
            flightsList.innerHTML = '';
            noFlights.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error loading flights:', error);
        loadingSpinner.classList.add('hidden');
        flightsList.innerHTML = '<p class="error">Error loading flights. Please try again.</p>';
        noFlights.classList.add('hidden');
    }
};

// Display flights
const displayFlights = (flights) => {
    console.log('displayFlights called with', flights.length, 'flights');
    const flightsList = document.getElementById('flightsList');

    if (!flightsList) {
        console.error('flightsList element not found!');
        return;
    }

    flightsList.innerHTML = '';

    flights.forEach((flight, index) => {
        console.log(`Creating card for flight ${index + 1}:`, flight.flight_number);
        const flightCard = createFlightCard(flight);
        flightsList.appendChild(flightCard);
    });

    console.log('All flight cards added to DOM');
};

// Create flight card
const createFlightCard = (flight) => {
    const card = document.createElement('div');
    card.className = 'card';

    const departureTime = new Date(flight.departure_time);
    const arrivalTime = new Date(flight.arrival_time);

    // Calculate duration
    const durationMs = arrivalTime - departureTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const duration = `${hours}h ${minutes}m`;

    // Format date nicely
    const flightDate = departureTime.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

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
                    <div class="flight-city">${flight.origin}</div>
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
                    <div class="flight-city">${flight.destination}</div>
                    <div class="flight-time">${arrivalTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
            </div>
            <div class="flight-footer">
                <div class="flight-details">
                    <span class="seats-available">
                        <strong>${flight.available_seats}</strong> seats available
                    </span>
                </div>
                <div class="flight-price">
                    <div class="price-amount">$${parseFloat(flight.price).toFixed(2)}</div>
                    <div class="price-label">per person</div>
                    <button class="btn btn-primary mt-1" onclick="bookFlight(${flight.flight_id})">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    `;

    return card;
};

// Book flight
const bookFlight = (flightId) => {
    if (!isLoggedIn()) {
        alert('Please login to book a flight');
        window.location.href = '/login';
        return;
    }
    window.location.href = `/booking?flightId=${flightId}`;
};

// Setup search form handler
const setupSearchForm = () => {
    console.log('Setting up search form...');
    const searchForm = document.getElementById('searchForm');
    const clearBtn = document.getElementById('clearBtn');

    if (!searchForm || !clearBtn) {
        console.error('Search form or clear button not found!');
        return;
    }

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Search form submitted');

        const filters = {
            origin: document.getElementById('origin').value,
            destination: document.getElementById('destination').value,
            date: document.getElementById('date').value,
            minPrice: document.getElementById('minPrice').value,
            maxPrice: document.getElementById('maxPrice').value
        };

        console.log('Filters:', filters);
        loadFlights(filters);
    });

    clearBtn.addEventListener('click', () => {
        console.log('Clear filters clicked');
        searchForm.reset();
        loadFlights();
    });

    console.log('Search form setup complete');
};

// Trip type toggle
const setupTripTypeToggle = () => {
    const tripTypeRadios = document.querySelectorAll('input[name="tripType"]');
    const returnDateGroup = document.getElementById('returnDateGroup');

    tripTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'round-trip') {
                returnDateGroup.style.display = 'block';
            } else {
                returnDateGroup.style.display = 'none';
                document.getElementById('returnDate').value = '';
            }
        });
    });
};

// Set minimum date to today
const setMinimumDates = () => {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('date');
    const returnDateInput = document.getElementById('returnDate');

    dateInput.setAttribute('min', today);
    returnDateInput.setAttribute('min', today);

    // When departure date changes, update return date minimum
    dateInput.addEventListener('change', (e) => {
        returnDateInput.setAttribute('min', e.target.value || today);
        // Clear return date if it's before departure date
        if (returnDateInput.value && returnDateInput.value < e.target.value) {
            returnDateInput.value = '';
        }
    });
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOM LOADED - INITIALIZING HOME PAGE ===');

    try {
        console.log('1. Setting up trip type toggle...');
        setupTripTypeToggle();

        console.log('2. Setting minimum dates...');
        setMinimumDates();

        console.log('3. Setting up search form...');
        setupSearchForm();

        console.log('4. Loading filters...');
        loadFilters();

        console.log('5. Loading flights...');
        loadFlights();

        console.log('=== INITIALIZATION COMPLETE ===');
    } catch (error) {
        console.error('ERROR during initialization:', error);
    }
});

