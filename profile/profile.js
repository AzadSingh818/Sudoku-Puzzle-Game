// Simulated User Data (In a real-world app, fetch this from your backend or API)
const userData = {
  name: "XXXXXX",
  profileImage: "XX", // Replace with the URL of the user's profile image
  gamesPlayed: 15,
  wins: 10,
};

// Function to calculate win rate
function calculateWinRate(gamesPlayed, wins) {
  return gamesPlayed > 0 ? ((wins / gamesPlayed) * 100).toFixed(2) + "%" : "0%";
}

// Function to load user data dynamically
function loadUserData() {
  // Set user profile name and image
  const profileNameElement = document.getElementById("profile-name");
  const profileImgElement = document.getElementById("profile-img");

  if (profileNameElement) profileNameElement.textContent = userData.name;
  if (profileImgElement) profileImgElement.src = userData.profileImage;

  // Set user stats
  const gamesPlayedElement = document.getElementById("games-played");
  const winRateElement = document.getElementById("win-rate");
  const matchesWonElement = document.getElementById("matches-won");

  if (gamesPlayedElement)
    gamesPlayedElement.textContent = userData.gamesPlayed;
  if (winRateElement)
    winRateElement.textContent = calculateWinRate(
      userData.gamesPlayed,
      userData.wins
    );
  if (matchesWonElement) matchesWonElement.textContent = userData.wins;
}

// Function to simulate game redirection
function playGame() {
  alert("Redirecting to the game...");
  window.location.href = "../index.html"; // Replace with your game page URL
}

// Function to simulate logout
function logout() {
  alert("Logging out...");
  window.location.href = "../home/home.html"; // Redirect to login/home page
}

// Call the loadUserData function on page load
window.onload = loadUserData;
