document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("newpass");
    const confirmPasswordInput = document.getElementById("confpass");
    const phoneInput = document.getElementById("phonenum");
  
    // Create a message element for password feedback
    const passwordMessage = document.createElement("div");
    passwordMessage.style.color = "red";
    passwordMessage.style.fontSize = "0.9rem";
    passwordMessage.style.marginTop = "5px";
    passwordMessage.style.display = "none";
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
        passwordInput.setCustomValidity(
          "Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character."
        );
        passwordMessage.textContent =
          "Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.";
        passwordMessage.style.display = "block";
      } else {
        passwordInput.style.borderColor = ""; // Reset to default
        passwordInput.setCustomValidity("");
        passwordMessage.style.display = "none";
      }
    });
  
    // Validate password match
    confirmPasswordInput.addEventListener("input", () => {
      if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.style.borderColor = "red";
        confirmPasswordInput.setCustomValidity("Passwords do not match.");
      } else {
        confirmPasswordInput.style.borderColor = ""; // Reset to default
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
        phoneInput.style.borderColor = ""; // Reset to default
        phoneInput.setCustomValidity("");
      }
    });
  
    // Submit form with validation
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        alert("Please fill out the form correctly.");
      }
    });
  });
  
    