document.addEventListener("DOMContentLoaded", () => {
    // Check session and redirect to login if not authenticated
    async function checkSession() {
        try {
            const response = await fetch('/api/check-session', {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                window.location.href = "login.html";
            }
        } catch (error) {
            console.error("Session validation failed:", error);
            window.location.href = "login.html";
        }
    }

    checkSession();

    // Handle form submission
    document.getElementById("passwordForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const oldPassword = document.getElementById("old_password").value;
        const newPassword = document.getElementById("new_password").value;
        const confirmPassword = document.getElementById("confirm_password").value;

        // Validate passwords
        if (newPassword !== confirmPassword) {
            alert("New password and confirm password do not match");
            return;
        }

        try {
            // Send a POST request to update the password
            const response = await fetch('/api/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Password updated successfully");
            } else {
                alert(result.message || "Error updating password");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            alert("An error occurred while updating the password");
        }
    });
});
