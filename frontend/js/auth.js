/**
 * AI Study Assistant - Authentication & Common Utilities Module
 */

// 1. Session & Auth State Management
function isUserLoggedIn() {
    return localStorage.getItem('ai_study_session') === 'true';
}

function getCurrentUser() {
    return {
        name: localStorage.getItem('ai_study_user_name') || 'Student',
        email: localStorage.getItem('ai_study_user_email') || 'student@example.com'
    };
}

function logoutUser() {
    localStorage.removeItem('ai_study_session');
    
    // Redirect logic depending on where the user currently is
    if (window.location.pathname.includes('dashboard.html') || window.location.pathname.endsWith('/pages/')) {
        window.location.href = '../index.html';
    } else {
        window.location.href = 'index.html';
    }
}

// 2. Toast Notification Utility
function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 250);
    }, 3500);
}

// 3. Theme Toggle Support (Global)
function initThemeToggle() {
    const savedTheme = localStorage.getItem('ai_study_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    const themeToggleBtns = document.querySelectorAll('#themeToggleBtn, .theme-toggle-btn');
    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('ai_study_theme', newTheme);
            updateThemeIcon(newTheme);
            showToast(`Switched to ${newTheme} mode`, 'info');
        });
    });
}

function updateThemeIcon(theme) {
    const icons = document.querySelectorAll('#themeIcon, .theme-icon');
    icons.forEach(el => {
        el.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
}

// Eye Icons SVG
const EYE_OPEN_SVG = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />`;
const EYE_CLOSED_SVG = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />`;

// DOM Setup on Load
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();

    const loginForm = document.getElementById('loginForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email');
    const rememberCheckbox = document.getElementById('remember');
    const errorBox = document.getElementById('errorMessage');
    const autoFillBtn = document.getElementById('autoFillDemo');

    // If on login page and already logged in, redirect to dashboard
    if (loginForm && isUserLoggedIn()) {
        window.location.href = 'pages/dashboard.html';
        return;
    }

    // Restore Remembered Email
    if (emailInput && rememberCheckbox) {
        const savedEmail = localStorage.getItem('ai_study_saved_email');
        if (savedEmail) {
            emailInput.value = savedEmail;
            rememberCheckbox.checked = true;
        }
    }

    // Auto-clear error when user types
    if (emailInput && passwordInput && errorBox) {
        const clearErr = () => {
            if (errorBox.style.display !== 'none') {
                errorBox.style.display = 'none';
                errorBox.textContent = '';
            }
        };
        emailInput.addEventListener('input', clearErr);
        passwordInput.addEventListener('input', clearErr);
    }

    // Auto-fill Demo Credentials
    if (autoFillBtn && emailInput && passwordInput) {
        autoFillBtn.addEventListener('click', () => {
            emailInput.value = 'student@example.com';
            passwordInput.value = '123456';
            showToast('Demo credentials filled!', 'info');
            if (errorBox) errorBox.style.display = 'none';
        });
    }

    // Toggle Password Visibility with SVG icon update
    if (togglePasswordBtn && passwordInput) {
        const eyeIcon = document.getElementById('eyeIcon');
        togglePasswordBtn.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                if (eyeIcon) eyeIcon.innerHTML = EYE_CLOSED_SVG;
                togglePasswordBtn.setAttribute('aria-label', 'Hide password');
            } else {
                passwordInput.type = 'password';
                if (eyeIcon) eyeIcon.innerHTML = EYE_OPEN_SVG;
                togglePasswordBtn.setAttribute('aria-label', 'Show password');
            }
        });
    }

    // Handle Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = (emailInput.value || '').trim();
            const password = passwordInput.value || '';

            // Reset error box
            if (errorBox) {
                errorBox.style.display = 'none';
                errorBox.textContent = '';
            }

            // 1. Validation
            if (!email || !password) {
                showError("Please fill in both email and password.");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError("Please enter a valid email address.");
                return;
            }

            // 2. Authentication Check (Case-insensitive email check)
            const normalizedEmail = email.toLowerCase();
            const registeredUsers = JSON.parse(localStorage.getItem('ai_study_registered_users') || '[]');
            const customUser = registeredUsers.find(u => u.email.toLowerCase() === normalizedEmail && u.password === password);

            if ((normalizedEmail === 'student@example.com' && password === '123456') || customUser) {
                // Success
                localStorage.setItem('ai_study_session', 'true');
                localStorage.setItem('ai_study_user_email', normalizedEmail);
                localStorage.setItem('ai_study_user_name', customUser ? customUser.name : 'Student');

                // Handle Remember Me
                if (rememberCheckbox && rememberCheckbox.checked) {
                    localStorage.setItem('ai_study_saved_email', normalizedEmail);
                } else {
                    localStorage.removeItem('ai_study_saved_email');
                }

                showToast('Signed in successfully! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'pages/dashboard.html';
                }, 400);
            } else {
                showError("Invalid email or password. Use demo account or create one.");
            }
        });
    }

    function showError(message) {
        if (errorBox) {
            errorBox.innerHTML = `<span>⚠️</span> <span>${message}</span>`;
            errorBox.style.display = 'flex';
        }
    }

    // Forgot Password Modal Handlers
    const forgotLink = document.getElementById('forgotPasswordLink');
    const forgotModal = document.getElementById('forgotModal');
    const closeForgotModal = document.getElementById('closeForgotModal');
    const cancelForgotModal = document.getElementById('cancelForgotModal');
    const sendResetBtn = document.getElementById('sendResetBtn');
    const resetEmailInput = document.getElementById('resetEmail');

    if (forgotLink && forgotModal) {
        forgotLink.addEventListener('click', () => {
            if (emailInput && emailInput.value) {
                resetEmailInput.value = emailInput.value;
            }
            forgotModal.classList.add('active');
        });

        const closeForgot = () => forgotModal.classList.remove('active');
        if (closeForgotModal) closeForgotModal.addEventListener('click', closeForgot);
        if (cancelForgotModal) cancelForgotModal.addEventListener('click', closeForgot);
        
        forgotModal.addEventListener('click', (e) => {
            if (e.target === forgotModal) closeForgot();
        });

        if (sendResetBtn) {
            sendResetBtn.addEventListener('click', () => {
                const rEmail = (resetEmailInput.value || '').trim();
                if (!rEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rEmail)) {
                    showToast('Please enter a valid email address.', 'error');
                    return;
                }
                closeForgot();
                showToast(`Password reset link sent to ${rEmail}`, 'success');
            });
        }
    }

    // Sign Up Modal Handlers
    const signupLink = document.getElementById('signupLink');
    const signupModal = document.getElementById('signupModal');
    const closeSignupModal = document.getElementById('closeSignupModal');
    const signupForm = document.getElementById('signupForm');

    if (signupLink && signupModal) {
        signupLink.addEventListener('click', () => {
            signupModal.classList.add('active');
        });

        const closeSignup = () => signupModal.classList.remove('active');
        if (closeSignupModal) closeSignupModal.addEventListener('click', closeSignup);

        signupModal.addEventListener('click', (e) => {
            if (e.target === signupModal) closeSignup();
        });

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('regName').value.trim();
                const email = document.getElementById('regEmail').value.trim().toLowerCase();
                const password = document.getElementById('regPassword').value;

                if (!name || !email || !password) {
                    showToast('Please fill all fields', 'error');
                    return;
                }

                if (password.length < 6) {
                    showToast('Password must be at least 6 characters', 'error');
                    return;
                }

                // Save user
                const users = JSON.parse(localStorage.getItem('ai_study_registered_users') || '[]');
                users.push({ name, email, password });
                localStorage.setItem('ai_study_registered_users', JSON.stringify(users));

                // Log in
                localStorage.setItem('ai_study_session', 'true');
                localStorage.setItem('ai_study_user_name', name);
                localStorage.setItem('ai_study_user_email', email);

                closeSignup();
                showToast(`Welcome, ${name}! Redirecting to your dashboard...`, 'success');
                setTimeout(() => {
                    window.location.href = 'pages/dashboard.html';
                }, 500);
            });
        }
    }
});
