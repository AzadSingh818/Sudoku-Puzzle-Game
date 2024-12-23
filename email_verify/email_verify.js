document.addEventListener("DOMContentLoaded", async () => {
    // Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        try {
            // Send token to the server for verification
            const response = await fetch('/api/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Email verified successfully.");
                window.location.href = "../login_page/login.html";
            } else {
                alert(result.message || "Invalid token.");
                window.location.href = "../resend_email_verification/resend_email_verification.html";
            }
        } catch (error) {
            console.error("Error verifying email:", error);
            alert("An error occurred. Please try again later.");
            window.location.href = "../resend_email_verification/resend_email_verification.html";
        }
    } else {
        alert("Token not found.");
        window.location.href = "../resend_email_verification/resend_email_verification.html";
    }
});
