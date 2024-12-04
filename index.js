// Elements for sign-up and sign-in
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

// Staff and student login forms
const AdminLoginButton = document.getElementById("AdminLoginButton");
const AdminLoginForm = document.getElementById("AdminLoginForm");
const goBackIcon = document.getElementById("goBackIcon");

// Trigger panel switch on Sign Up button click
signUpButton?.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

// Trigger panel switch on Sign In button click
signInButton?.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

// Admin Login button - show form
AdminLoginButton?.addEventListener("click", function() {
    AdminLoginForm.classList.add("visible");
    AdminLoginForm.style.opacity = "1";
    AdminLoginForm.style.visibility = "visible";
});

// Go back icon in admin form
goBackIcon?.addEventListener("click", function() {
    AdminLoginForm.classList.remove("visible");
    AdminLoginForm.style.opacity = "0";
    AdminLoginForm.style.visibility = "hidden";
});

// Staff login form submission
document.querySelector('.sign-up-container form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);

    // Send login details to server
    fetch('/staff-login', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirect to smain.html on successful login
            window.location.href = './smain.html';
        } else {
            // Show an error message on failure
            const errorMessage = document.getElementById('staffErrorMessage');
            if (errorMessage) {
                errorMessage.style.display = 'block';
                errorMessage.textContent = data.message;
            }
        }
    })
    .catch(error => console.error('Error:', error));
});

// Student login form submission
document.querySelector('.sign-in-container form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    // Send login details to server
    fetch('/log-in', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (response.redirected) {
            // Redirect to HomePage with student_id on successful login
            window.location.href = response.url;
        } else {
            return response.text(); // Get error message if login fails
        }
    })
    .then(data => {
        if (data) {
            // Display the error message
            const errorMessage = document.getElementById('studentErrorMessage');
            if (errorMessage) {
                errorMessage.style.display = 'block';
                errorMessage.textContent = data;
            }
        }
    })
    .catch(error => console.error('Error:', error));
});

