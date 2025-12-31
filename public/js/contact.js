// Contact Page JavaScript
// API_URL is already defined in auth.js

// Show alert message
const showAlert = (message, type = 'error') => {
    const alertDiv = document.getElementById('alertMessage');
    alertDiv.innerHTML = `
        <div class="alert alert-${type}">
            ${message}
        </div>
    `;
    window.scrollTo(0, 0);
    setTimeout(() => {
        alertDiv.innerHTML = '';
    }, 5000);
};

// Handle contact form submission
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, subject, message })
        });

        const data = await response.json();

        if (data.success) {
            showAlert(data.message, 'success');
            document.getElementById('contactForm').reset();
        } else {
            showAlert(data.message || 'Failed to submit message. Please try again.');
        }
    } catch (error) {
        console.error('Contact form error:', error);
        showAlert('An error occurred. Please try again.');
    }
});

