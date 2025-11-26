// Force Dark Mode Script
// Run this in the browser console to force dark mode

// Clear any existing theme preference
localStorage.removeItem('adminTheme');

// Set dark mode
localStorage.setItem('adminTheme','dark');

// Add dark class to document
document.documentElement.classList.add('dark');

// Reload the page
window.location.reload();
