document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("newpass");
    const confirmPasswordInput = document.getElementById("confpass");
    const phoneInput = document.getElementById("phonenum");
    const contactPointInput = document.getElementById("contact-point");
    const specializationInput = document.getElementById("specialization");
    const institutionInput = document.getElementById("institution");
    const riskLevelSelect = document.getElementById("risk-level");
    const trialStartInput = document.querySelector("input[name='trial-start']");
    const trialEndInput = document.querySelector("input[name='trial-end']");
  
    // Create a message element for password strength feedback
    const passwordMessage = document.createElement("small");
    passwordMessage.style.color = "red";
    passwordInput.parentNode.appendChild(passwordMessage);
  
    // Function to check password strength
    const isStrongPassword = (password) => {
      const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return strongPasswordPattern.test(password);
    };
  
    // Validate email format
    emailInput.addEventListener("input", () => {
      if (!emailInput.validity.valid) {
        emailInput.setCustomValidity("Please enter a valid email address.");
      } else {
        emailInput.setCustomValidity("");
      }
    });
  
    // Validate password strength
    passwordInput.addEventListener("input", () => {
      if (!isStrongPassword(passwordInput.value)) {
        passwordInput.style.borderColor = "red";
        passwordMessage.textContent =
          "Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.";
        passwordInput.setCustomValidity("Password must be strong.");
      } else {
        passwordInput.style.borderColor = ""; // Reset border color
        passwordMessage.textContent = ""; // Clear message
        passwordInput.setCustomValidity("");
      }
    });
  
    // Validate password confirmation
    confirmPasswordInput.addEventListener("input", () => {
      if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.style.borderColor = "red";
        confirmPasswordInput.setCustomValidity("Passwords do not match.");
      } else {
        confirmPasswordInput.style.borderColor = ""; // Reset border color
        confirmPasswordInput.setCustomValidity("");
      }
    });
  
    // Validate phone number format
    phoneInput.addEventListener("input", () => {
      const phonePattern = /^[+]?[0-9]{10,14}$/;
      if (!phonePattern.test(phoneInput.value)) {
        phoneInput.style.borderColor = "red";
        phoneInput.setCustomValidity("Please enter a valid phone number.");
      } else {
        phoneInput.style.borderColor = ""; // Reset border color
        phoneInput.setCustomValidity("");
      }
    });
  
    // Validate required text fields (contact point, specialization, institution)
    [contactPointInput, specializationInput, institutionInput].forEach((input) => {
      input.addEventListener("input", () => {
        if (!input.value.match(/^[a-zA-Z\s]{2,20}$/)) {
          input.style.borderColor = "red";
          input.setCustomValidity(
            "This field must contain 2 to 20 letters and spaces only."
          );
        } else {
          input.style.borderColor = ""; // Reset border color
          input.setCustomValidity("");
        }
      });
    });
  
    // Validate risk level selection
    riskLevelSelect.addEventListener("change", () => {
      if (!riskLevelSelect.value) {
        riskLevelSelect.style.borderColor = "red";
        riskLevelSelect.setCustomValidity("Please select a risk level.");
      } else {
        riskLevelSelect.style.borderColor = ""; // Reset border color
        riskLevelSelect.setCustomValidity("");
      }
    });
  
    // Validate trial dates
    trialEndInput.addEventListener("input", () => {
      if (trialEndInput.value && trialStartInput.value > trialEndInput.value) {
        trialEndInput.style.borderColor = "red";
        trialEndInput.setCustomValidity(
          "End date must be after the start date."
        );
      } else {
        trialEndInput.style.borderColor = ""; // Reset border color
        trialEndInput.setCustomValidity("");
      }
    });
  
    // Prevent form submission if there are validation errors
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        alert("Please fill out all required fields correctly.");
      }
    });
  });