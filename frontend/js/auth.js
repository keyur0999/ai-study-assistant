/**
 * AI Study Assistant - Authentication Module
 * NOTE: This is a TEMPORARY demo authentication system for frontend testing.
 * Do NOT use this in production. It will later be replaced by API calls (FastAPI/PostgreSQL).
 */

// Function to check if user is currently logged in (based on localStorage)
function isUserLoggedIn() {
    return localStorage.getItem('ai_study_session') === 'true';
}

// Function to handle logging the user out
function logoutUser() {
    localStorage.removeItem('ai_study_session');
    
    // Redirect logic depending on where the user currently is
    if (window.location.pathname.includes('dashboard.html')) {
        window.location.href = '../index.html';
    } else {
        window.location.href = 'index.html';
    }
}

// DOM Setup for the Login Page ONLY
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const errorBox = document.getElementById('errorMessage');

    // If we are on the login page, check if already logged in and redirect to dashboard
    if (loginForm && isUserLoggedIn()) {
        window.location.href = 'pages/dashboard.html';
    }

    // Toggle Password Visibility
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                togglePasswordBtn.textContent = 'Hide';
            } else {
                passwordInput.type = 'password';
                togglePasswordBtn.textContent = 'Show';
            }
        });
    }

    // Handle Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            // Reset error box
            errorBox.style.display = 'none';
            errorBox.textContent = '';

            // 1. Basic HTML5/JS Validation
            if (!email || !password) {
                showError("Please fill in both email and password.");
                return;
            }

            // Basic email format check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError("Please enter a valid email address.");
                return;
            }

            // 2. Demo Authentication Check (To be replaced with POST /api/auth/login)
            if (email === 'student@example.com' && password === '123456') {
                // Success - set temporary session
                localStorage.setItem('ai_study_session', 'true');
                
                // Redirect to dashboard
                window.location.href = 'pages/dashboard.html';
            } else {
                // Failure
                showError("Invalid email or password. Try student@example.com / 123456");
            }
        });
    }

    function showError(message) {
        errorBox.textContent = message;
        errorBox.style.display = 'block';
    }
});