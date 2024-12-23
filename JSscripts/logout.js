// Script to handle logout and redirect logic
document.getElementById("start-btn").addEventListener("click", function () {
    // Clear user session (e.g., clear localStorage/sessionStorage or a specific key)
    localStorage.removeItem("userLoggedIn");

    // Redirect to login page or logout confirmation page
    window.location.href = "../login_page/login.html";
});

// On page load, check login state
document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = localStorage.getItem("userLoggedIn");

    if (!isLoggedIn) {
        // If not logged in, redirect to the profile page or login page
        window.location.href = "../profile/profile.html";
    }
});

// Example: Setting the userLoggedIn flag (this would typically happen after successful login)
function loginUser() {
    localStorage.setItem("userLoggedIn", "true");
}
