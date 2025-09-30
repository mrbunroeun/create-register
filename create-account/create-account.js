import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";


// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCK40fYaHvxnSEdqrvXqaZqwWO4ZXOwGZg",
  authDomain: "create-account-tutorial-63bbf.firebaseapp.com",
  projectId: "create-account-tutorial-63bbf",
  storageBucket: "create-account-tutorial-63bbf.appspot.com",
  messagingSenderId: "887008800901",
  appId: "1:887008800901:web:8d244669054f91b46339ec",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Form references
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const forgotPasswordForm = document.getElementById("forgot-password-form");

// Utility to hide all forms
function hideAllForms() {
  loginForm.style.display = "none";
  registerForm.style.display = "none";
  forgotPasswordForm.style.display = "none";
}

// Navigation event handlers
document.getElementById("show-register").addEventListener("click", (e) => {
  e.preventDefault();
  hideAllForms();
  registerForm.style.display = "block";
});

document.getElementById("show-login").addEventListener("click", (e) => {
  e.preventDefault();
  hideAllForms();
  loginForm.style.display = "block";
});

document
  .getElementById("show-forgot-password")
  .addEventListener("click", (e) => {
    e.preventDefault();
    hideAllForms();
    forgotPasswordForm.style.display = "block";
  });

document
  .getElementById("back-to-login-from-reset")
  .addEventListener("click", (e) => {
    e.preventDefault();
    hideAllForms();
    loginForm.style.display = "block";
  });

// Login handler
document.getElementById("login-btn").addEventListener("click", (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "profile.html"; // Success login
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});

// Register handler
document.getElementById("register-btn").addEventListener("click", (e) => {
  e.preventDefault();

  // Clear old errors
  document.getElementById("firstName-error").textContent = "";
  document.getElementById("lastName-error").textContent = "";

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();

  let valid = true;
  if (!firstName) {
    document.getElementById("firstName-error").textContent =
      "You have to enter your first name";
    valid = false;
  }
  if (!lastName) {
    document.getElementById("lastName-error").textContent =
      "You have to enter your last name";
    valid = false;
  }
  if (!email || !password) {
    alert("Please fill in all fields.");
    valid = false;
  }
  if (!valid) return;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        firstName,
        lastName,
      });
    })
    .then(() => {
      window.location.href = "profile.html"; // Redirect after success
    })
    .catch((error) => {
      alert("Registration failed: " + error.message);
    });
});

// Password reset handler
document.getElementById("reset-password-btn").addEventListener("click", (e) => {
  e.preventDefault();

  const email = document.getElementById("reset-email").value.trim();
  if (!email) {
    alert("Please enter your email address.");
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset link sent! Check your email.");
      hideAllForms();
      loginForm.style.display = "block";
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
});
