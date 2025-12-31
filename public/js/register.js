// Register Page JavaScript
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
    console.log('=== REGISTER PAGE LOADED ===');

    // Redirect if already logged in
    if (isLoggedIn()) {
        console.log('User already logged in, redirecting to dashboard...');
        window.location.href = '/dashboard';
        return;
    }

    // Setup register form
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) {
        console.error('Register form not found!');
        return;
    }

    console.log('Setting up register form handler...');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Register form submitted');

        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        console.log('Form data:', { fullName, email, phone });

        // Validate passwords match
        if (password !== confirmPassword) {
            showAlert('Passwords do not match!');
            return;
        }

        // Validate password length
        if (password.length < 6) {
            showAlert('Password must be at least 6 characters long!');
            return;
        }

        try {
            console.log('Sending registration request...');
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fullName, email, phone, password })
            });

            const data = await response.json();
            console.log('Registration response:', data);

            if (data.success) {
                // Save token and user data
                saveAuth(data.token, data.user);

                // Show success message
                showAlert('Registration successful! Redirecting...', 'success');

                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
            } else {
                showAlert(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showAlert('An error occurred. Please try again.');
        }
    });

    console.log('Register form setup complete');
});

