document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const passwordInput = document.getElementById('newpass');
  const confirmPasswordInput = document.getElementById('confpass');

  // Add a small message element for password feedback
  const passwordMessage = document.createElement('small');
  passwordMessage.style.color = 'red';
  passwordInput.parentNode.appendChild(passwordMessage);

  // Function to check password strength
  const isStrongPassword = (password) => {
    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordPattern.test(password);
  };

  // Password strength validation
  passwordInput.addEventListener('input', () => {
    if (!isStrongPassword(passwordInput.value)) {
      passwordInput.style.borderColor = 'red';
      passwordMessage.textContent =
        'Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.';
      passwordInput.setCustomValidity('Weak password.');
    } else {
      passwordInput.style.borderColor = '';
      passwordMessage.textContent = '';
      passwordInput.setCustomValidity('');
    }
  });

  // Confirm password validation
  confirmPasswordInput.addEventListener('input', () => {
    if (passwordInput.value !== confirmPasswordInput.value) {
      confirmPasswordInput.style.borderColor = 'red';
      confirmPasswordInput.setCustomValidity('Passwords do not match.');
    } else {
      confirmPasswordInput.style.borderColor = '';
      confirmPasswordInput.setCustomValidity('');
    }
  });

  // Prevent form submission if there are validation errors
  form.addEventListener('submit', (event) => {
    if (!form.checkValidity()) {
      event.preventDefault();
      alert('Please fill out all fields correctly before submitting.');
    }
  });
});
