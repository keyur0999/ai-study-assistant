/**
 * AI Study Assistant - Dashboard Module
 * Handles UI interactions, protection, and placeholder actions for the dashboard.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Protect Dashboard Route (Relies on auth.js being loaded first)
    // If auth.js isn't loaded or user isn't logged in, kick them back to login.
    if (typeof isUserLoggedIn !== 'function' || !isUserLoggedIn()) {
        window.location.href = '../index.html';
        return; // Stop execution
    }

    // 2. Handle Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof logoutUser === 'function') {
                logoutUser();
            }
        });
    }

    // 3. Mobile Sidebar Toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // 4. Handle "Coming Soon" Placeholders
    // Select all buttons inside the main dashboard sections that aren't hooked up yet
    const placeholderButtons = document.querySelectorAll('.action-btn');
    
    placeholderButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Provide a clear alert indicating backend/API integration is pending
            alert("This feature is currently in development! It will be connected to the FastAPI backend soon.");
        });
    });
});