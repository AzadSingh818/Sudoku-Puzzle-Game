// Select the "Sign Up" button by its ID
const signUpButton = document.getElementById('signUpButton');

// Select the "Sign In" button by its ID
const signInButton = document.getElementById('signInButton');

// Select the "Sign In" form by its ID
const signInForm = document.getElementById('signIn');

// Select the "Sign Up" form by its ID
const signUpForm = document.getElementById('signup');

// Add a click event listener to the "Sign Up" button
signUpButton.addEventListener('click', function() {
    // Hide the "Sign In" form by setting its display style to "none"
    signInForm.style.display = "none";

    // Show the "Sign Up" form by setting its display style to "block"
    signUpForm.style.display = "block";
});

// Add a click event listener to the "Sign In" button
signInButton.addEventListener('click', function() {
    // Show the "Sign In" form by setting its display style to "block"
    signInForm.style.display = "block";

    // Hide the "Sign Up" form by setting its display style to "none"
    signUpForm.style.display = "none";
});
