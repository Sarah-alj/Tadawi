document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("newpass");
    const confirmPasswordInput = document.getElementById("confpass");
    const fullnameInput = document.getElementById("fullname");
    const titleSelect = document.getElementById("title");
    const phoneInput = document.getElementById("phonenum");
    const nationalitySelect = document.getElementById("nationality");
    const birthInput = document.getElementById("birth");
  
    // Add a small message element for password feedback
    const passwordMessage = document.createElement("small");
    passwordMessage.style.color = "red";
    passwordInput.parentNode.appendChild(passwordMessage);
  
    // Function to check password strength
    const isStrongPassword = (password) => {
      const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return strongPasswordPattern.test(password);
    };
  
    // Email validation
    emailInput.addEventListener("input", () => {
      if (!emailInput.validity.valid) {
        emailInput.setCustomValidity("Please enter a valid email address.");
      } else {
        emailInput.setCustomValidity("");
      }
    });
  
    // Password strength validation
    passwordInput.addEventListener("input", () => {
      if (!isStrongPassword(passwordInput.value)) {
        passwordInput.style.borderColor = "red";
        passwordMessage.textContent =
          "Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.";
        passwordInput.setCustomValidity("Weak password.");
      } else {
        passwordInput.style.borderColor = "";
        passwordMessage.textContent = "";
        passwordInput.setCustomValidity("");
      }
    });
  
    // Confirm password validation
    confirmPasswordInput.addEventListener("input", () => {
      if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.style.borderColor = "red";
        confirmPasswordInput.setCustomValidity("Passwords do not match.");
      } else {
        confirmPasswordInput.style.borderColor = "";
        confirmPasswordInput.setCustomValidity("");
      }
    });
  
    // Full name validation
    fullnameInput.addEventListener("input", () => {
      if (!fullnameInput.value.match(/^[a-zA-Z\s]{2,20}$/)) {
        fullnameInput.style.borderColor = "red";
        fullnameInput.setCustomValidity(
          "Full Name must contain only letters and spaces (2-20 characters)."
        );
      } else {
        fullnameInput.style.borderColor = "";
        fullnameInput.setCustomValidity("");
      }
    });
  
    // Title selection validation
    titleSelect.addEventListener("change", () => {
      if (!titleSelect.value) {
        titleSelect.style.borderColor = "red";
        titleSelect.setCustomValidity("Please select a title.");
      } else {
        titleSelect.style.borderColor = "";
        titleSelect.setCustomValidity("");
      }
    });
  
    // Phone number validation
    phoneInput.addEventListener("input", () => {
      const phonePattern = /^[+]?[0-9]{10,14}$/;
      if (!phonePattern.test(phoneInput.value)) {
        phoneInput.style.borderColor = "red";
        phoneInput.setCustomValidity("Please enter a valid phone number.");
      } else {
        phoneInput.style.borderColor = "";
        phoneInput.setCustomValidity("");
      }
    });
  
    // Nationality selection validation
    nationalitySelect.addEventListener("change", () => {
      if (!nationalitySelect.value) {
        nationalitySelect.style.borderColor = "red";
        nationalitySelect.setCustomValidity("Please select your nationality.");
      } else {
        nationalitySelect.style.borderColor = "";
        nationalitySelect.setCustomValidity("");
      }
    });
  
    // Birthdate validation
    birthInput.addEventListener("input", () => {
      const today = new Date();
      const birthDate = new Date(birthInput.value);
      if (birthDate >= today) {
        birthInput.style.borderColor = "red";
        birthInput.setCustomValidity("Birthdate must be in the past.");
      } else {
        birthInput.style.borderColor = "";
        birthInput.setCustomValidity("");
      }
    });
  
    // Prevent form submission if there are validation errors
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        alert("Please fill out all fields correctly before submitting.");
      }
    });
  });
  
   