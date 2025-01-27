import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

window.onload = () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();

                    // Update profile elements
                    document.getElementById('profile-name').textContent = userData.name || "Anonymous";
                    document.getElementById('profile-img').src = userData.photoURL || "default-profile.png";
                } else {
                    console.error("No user data found in Firestore.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        } else {
            window.location.href = 'home.html'; // Redirect if not logged in
        }
    });

    // Logout functionality
    document.getElementById('logout').addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                window.location.href = 'home.html';
            })
            .catch((error) => console.error("Logout Error:", error));
    });
};
