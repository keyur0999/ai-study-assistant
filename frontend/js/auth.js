/**
 * AI Study Assistant - Authentication & Common Utilities Module
 */

// 1. Session & Auth State Management
function isUserLoggedIn() {
    return localStorage.getItem('ai_study_session') === 'true' && Boolean(localStorage.getItem('ai_study_user_email'));
}

function readRegisteredUsers() {
    try {
        const value = JSON.parse(localStorage.getItem('ai_study_registered_users') || '[]');
        return Array.isArray(value) ? value : [];
    } catch (error) {
        console.warn('Stored local accounts could not be read.', error);
        return [];
    }
}

async function hashLocalPassword(password, saltHex = null) {
    if (!window.crypto?.subtle || !window.TextEncoder) {
        throw new Error('Local account mode requires a secure browser context. Run the frontend on localhost or connect the backend.');
    }
    const salt = saltHex
        ? Uint8Array.from(saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
        : crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' }, keyMaterial, 256);
    const hash = Array.from(new Uint8Array(bits), byte => byte.toString(16).padStart(2, '0')).join('');
    const saltValue = Array.from(salt, byte => byte.toString(16).padStart(2, '0')).join('');
    return { hash, salt: saltValue };
}

function isNetworkError(error) {
    const message = String(error?.message || '').toLowerCase();
    return error instanceof TypeError || message.includes('failed to fetch') || message.includes('networkerror') || message.includes('load failed');
}

function getCurrentUser() {
    return {
        name: localStorage.getItem('ai_study_user_name') || 'Student',
        email: localStorage.getItem('ai_study_user_email') || 'student@example.com'
    };
}

function logoutUser() {
    localStorage.removeItem('ai_study_session');
    localStorage.removeItem('ai_study_token');
    const inPagesDirectory = /\/pages\//i.test(window.location.pathname);
    window.location.href = inPagesDirectory ? '../index.html' : 'index.html';
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
    const iconEl = document.createElement('span');
    const messageEl = document.createElement('span');
    iconEl.textContent = icon;
    messageEl.textContent = String(message);
    toast.append(iconEl, messageEl);
    
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
        if (btn.dataset.themeListenerAttached === 'true') return;
        btn.dataset.themeListenerAttached = 'true';
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
        loginForm.addEventListener('submit', async (e) => {
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

            const normalizedEmail = email.toLowerCase();
            const submitBtn = document.getElementById('submitLoginBtn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Signing in...';
            }

            // Try Backend API Login first
            let loginSuccess = false;
            let userName = 'Student';

            if (window.api && typeof window.api.auth?.login === 'function') {
                try {
                    const res = await window.api.auth.login(normalizedEmail, password);
                    if (res && (res.success || res.token || res.access_token)) {
                        loginSuccess = true;
                        userName = res.user?.name || 'Student';
                    } else {
                        showError(res?.message || 'Sign-in was rejected by the server. Check your credentials.');
                        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Sign In'; }
                        return;
                    }
                } catch (err) {
                    console.warn('Backend login attempt failed, checking local state:', err.message);
                    // If error is invalid credentials, show error directly
                    if (!isNetworkError(err)) {
                        showError(err.message);
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.textContent = 'Sign In';
                        }
                        return;
                    }
                }
            }

            // Fallback to local credential verification if backend is offline
            if (!loginSuccess) {
                const registeredUsers = readRegisteredUsers();
                const customUser = registeredUsers.find(user => String(user.email || '').toLowerCase() === normalizedEmail);
                let passwordMatches = false;
                if (customUser?.passwordHash && customUser?.passwordSalt) {
                    try {
                        const record = await hashLocalPassword(password, customUser.passwordSalt);
                        passwordMatches = record.hash === customUser.passwordHash;
                    } catch (hashError) {
                        showError(hashError.message);
                        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Sign In'; }
                        return;
                    }
                } else if (typeof customUser?.password === 'string') {
                    // Migrate old prototype accounts after a successful legacy-password check.
                    passwordMatches = customUser.password === password;
                    if (passwordMatches) {
                        try {
                            const record = await hashLocalPassword(password);
                            customUser.passwordHash = record.hash;
                            customUser.passwordSalt = record.salt;
                            delete customUser.password;
                            localStorage.setItem('ai_study_registered_users', JSON.stringify(registeredUsers));
                        } catch (hashError) { /* preserve legacy access if the browser cannot hash */ }
                    }
                }
                if ((normalizedEmail === 'student@example.com' && password === '123456') || (customUser && passwordMatches)) {
                    loginSuccess = true;
                    userName = customUser ? customUser.name : 'Student';
                }
            }

            if (loginSuccess) {
                localStorage.setItem('ai_study_session', 'true');
                localStorage.setItem('ai_study_user_email', normalizedEmail);
                localStorage.setItem('ai_study_user_name', userName);

                if (rememberCheckbox && rememberCheckbox.checked) {
                    localStorage.setItem('ai_study_saved_email', normalizedEmail);
                } else {
                    localStorage.removeItem('ai_study_saved_email');
                }

                showToast('Signed in successfully! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'pages/dashboard.html';
                }, 350);
            } else {
                showError("Invalid email or password. Use demo account or create one.");
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Sign In';
                }
            }
        });
    }

    function showError(message) {
        if (errorBox) {
            errorBox.replaceChildren();
            const icon = document.createElement('span');
            const text = document.createElement('span');
            icon.textContent = '⚠️';
            text.textContent = String(message);
            errorBox.append(icon, text);
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
            sendResetBtn.addEventListener('click', async () => {
                const rEmail = (resetEmailInput.value || '').trim();
                if (!rEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rEmail)) {
                    showToast('Please enter a valid email address.', 'error');
                    return;
                }

                if (window.api && typeof window.api.auth?.forgotPassword === 'function') {
                    try {
                        await window.api.auth.forgotPassword(rEmail);
                    } catch (e) {}
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
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('regName').value.trim();
                const email = document.getElementById('regEmail').value.trim().toLowerCase();
                const password = document.getElementById('regPassword').value;

                if (!name || !email || !password) {
                    showToast('Please fill all fields', 'error');
                    return;
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    showToast('Please enter a valid email address.', 'error');
                    return;
                }
                if (password.length < 6) {
                    showToast('Password must be at least 6 characters', 'error');
                    return;
                }

                let registered = false;

                if (window.api && typeof window.api.auth?.register === 'function') {
                    try {
                        const res = await window.api.auth.register(name, email, password);
                        if (res && (res.success || res.token || res.access_token)) {
                            registered = true;
                        } else {
                            showToast(res?.message || 'Registration was rejected by the server.', 'error');
                            return;
                        }
                    } catch (err) {
                        console.warn('Backend register error, fallback to local:', err.message);
                        if (!isNetworkError(err)) {
                            showToast(err.message || 'Registration failed. Please try again.', 'error');
                            return;
                        }
                    }
                }

                if (!registered) {
                    const users = readRegisteredUsers();
                    if (users.some(user => String(user.email || '').toLowerCase() === email)) {
                        showToast('An account with this email already exists. Please sign in.', 'error');
                        return;
                    }
                    try {
                        const passwordRecord = await hashLocalPassword(password);
                        users.push({ name, email, passwordHash: passwordRecord.hash, passwordSalt: passwordRecord.salt, createdAt: new Date().toISOString() });
                        localStorage.setItem('ai_study_registered_users', JSON.stringify(users));
                    } catch (hashError) {
                        showToast(hashError.message || 'Could not create a local account.', 'error');
                        return;
                    }
                }

                // Log in
                localStorage.setItem('ai_study_session', 'true');
                localStorage.setItem('ai_study_user_name', name);
                localStorage.setItem('ai_study_user_email', email);

                closeSignup();
                showToast(`Welcome, ${name}! Redirecting to your dashboard...`, 'success');
                setTimeout(() => {
                    window.location.href = 'pages/dashboard.html';
                }, 400);
            });
        }
    }
});