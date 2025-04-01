document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const newPasswordInput = document.getElementById("newpass");
    const confirmPasswordInput = document.getElementById("confpass");
  
    // Create a message element for password strength feedback
    const passwordMessage = document.createElement("p");
    passwordMessage.style.color = "red";
    passwordMessage.style.fontSize = "12px";
    passwordMessage.style.marginTop = "5px";
    passwordMessage.style.display = "none";
    newPasswordInput.parentNode.appendChild(passwordMessage);
  
    const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    newPasswordInput.addEventListener("input", () => {
      const newPassword = newPasswordInput.value;
      if (!passwordStrengthRegex.test(newPassword)) {
        newPasswordInput.style.borderColor = "red";
        passwordMessage.style.display = "block";
        passwordMessage.textContent = "Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character.";
      } else {
        newPasswordInput.style.borderColor = "green";
        passwordMessage.style.display = "none";
      }
    });
  
    form.addEventListener("submit", (e) => {
      const newPassword = newPasswordInput.value;
      const confirmPassword = confirmPasswordInput.value;
  
      // Prevent submission if passwords don't match
      if (newPassword !== confirmPassword) {
        e.preventDefault();
        confirmPasswordInput.style.borderColor = "red";
        alert("Passwords do not match. Please try again.");
        return;
      }
  
      // Ensure strong password before submission
      if (!passwordStrengthRegex.test(newPassword)) {
        e.preventDefault();
        newPasswordInput.style.borderColor = "red";
        passwordMessage.style.display = "block";
        passwordMessage.textContent = "Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character.";
        return;
      }
  
      // Redirect to success page if validation passes
      e.preventDefault(); // Prevent the default form submission
      window.location.href = "success.html";
    });
  });