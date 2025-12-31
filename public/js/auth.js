// Authentication Helper Functions
const API_URL = 'http://localhost:3000/api';

// Get token from localStorage
const getToken = () => {
    return localStorage.getItem('token');
};

// Get user from localStorage
const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Save auth data
const saveAuth = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
};

// Clear auth data
const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Check if user is logged in
const isLoggedIn = () => {
    return !!getToken();
};

// Logout function
const logout = () => {
    clearAuth();
    window.location.href = '/';
};

// Update navigation based on auth status
const updateNavigation = () => {
    const navAuth = document.getElementById('navAuth');
    if (navAuth) {
        if (isLoggedIn()) {
            const user = getUser();
            navAuth.innerHTML = `
                <a href="/dashboard">Dashboard</a>
                <button id="logoutBtn" class="btn btn-danger">Logout</button>
            `;
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', logout);
            }
        } else {
            navAuth.innerHTML = '<a href="/login" class="btn btn-primary">Login</a>';
        }
    }

    // Handle logout button on other pages
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
};

// Protect page (redirect to login if not authenticated)
const requireAuth = () => {
    if (!isLoggedIn()) {
        window.location.href = '/login';
        return false;
    }
    return true;
};

// Make authenticated API request
const authFetch = async (url, options = {}) => {
    const token = getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    // If unauthorized, clear auth and redirect to login
    if (response.status === 401 || response.status === 403) {
        clearAuth();
        window.location.href = '/login';
        throw new Error('Unauthorized');
    }

    return response;
};

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
});

