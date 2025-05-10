/*const signupForm = document.getElementById('signupForm');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const errorMessage = document.getElementById('error-message');

signupForm.addEventListener('submit', function (e) {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const specialCharRegex = /[@#$%^&*!]/;

    // Check password criteria
    if (!uppercaseRegex.test(password)) {
        errorMessage.textContent = 'Password must include at least one uppercase letter.';
        e.preventDefault();
    } else if (!lowercaseRegex.test(password)) {
        errorMessage.textContent = 'Password must include at least one lowercase letter.';
        e.preventDefault();
    } else if (!specialCharRegex.test(password)) {
        errorMessage.textContent = 'Password must include at least one special character.';
        e.preventDefault();
    } else if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match.';
        e.preventDefault();
    } else {
        errorMessage.textContent = ''; // Clear error message
    }
});

const patientForm = document.getElementById('patientForm');
const phoneInput = document.getElementById('emergency-phone');
const phoneError = document.getElementById('phone-error');

patientForm.addEventListener('submit', function (e) {
    const phoneValue = phoneInput.value.trim();
    const phoneRegex = /^\+966\d{9}$/; // +966 followed by exactly 9 digits

    // Validate phone number
    if (!phoneRegex.test(phoneValue)) {
        phoneError.textContent = 'Phone number must start with +966 and contain 9 digits after it.';
        e.preventDefault(); // Prevent form submission
    } else {
        phoneError.textContent = ''; // Clear error message if valid
    }
});*/