// Login Page JavaScript
// API_URL is already defined in auth.js

// Show alert message
const showAlert = (message, type = 'error') => {
    const alertDiv = document.getElementById('alertMessage');
    if (!alertDiv) {
        console.error('Alert div not found!');
        alert(message);
        return;
    }
    alertDiv.innerHTML = `
        <div class="alert alert-${type}">
            ${message}
        </div>
    `;
    setTimeout(() => {
        alertDiv.innerHTML = '';
    }, 5000);
};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== LOGIN PAGE LOADED ===');

    // Redirect if already logged in
    if (isLoggedIn()) {
        console.log('User already logged in, redirecting to dashboard...');
        window.location.href = '/dashboard';
        return;
    }

    // Setup login form
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) {
        console.error('Login form not found!');
        return;
    }

    console.log('Setting up login form handler...');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Login form submitted');

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log('Login attempt for:', email);

        try {
            console.log('Sending login request...');
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log('Login response:', data);

            if (data.success) {
                // Save token and user data
                saveAuth(data.token, data.user);

                // Show success message
                showAlert('Login successful! Redirecting...', 'success');

                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
            } else {
                showAlert(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            showAlert('An error occurred. Please try again.');
        }
    });

    console.log('Login form setup complete');
});

