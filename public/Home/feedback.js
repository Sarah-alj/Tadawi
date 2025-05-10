import { postData } from '../js/api.js';

document.addEventListener('DOMContentLoaded', initializeFeedbackForm);

function initializeFeedbackForm() {
  const feedbackForm = document.getElementById('feedbackForm');
  feedbackForm.addEventListener('submit', submitFeedback);
}

async function submitFeedback(event) {
  event.preventDefault();
  const feedbackForm = event.target;

  const name = feedbackForm.name.value;
  const email = feedbackForm.email.value;
  const comments = feedbackForm.comments.value;

  const feedbackData = {
    name,
    email,
    comments,
  };

  const response = await postData('/api/feedbacks', feedbackData);

  if (response.isOk) {
    showSuccess();
    feedbackForm.reset();
  } else {
    showError(response.message || 'Failed to submit feedback');
  }
}

function showToast(message, type = 'success') {
  const DURATION = 10 * 1000;
  const ANIMATION_DURATION = 300;

  let toast = document.getElementById('toast-container');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-container';
    const shadow = toast.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: grid;
        max-width: 250px;
        width: 100%;
        gap: 10px;
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
      }
      .toast {
        padding: 16px;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        animation: slideIn ${ANIMATION_DURATION}ms forwards, slideOut ${ANIMATION_DURATION}ms ${DURATION}ms forwards;
        opacity: 0;
      }
      .success {
        background-color: #4CAF50;
        color: white;
      }
      .error {
        background-color: #f44336;
        color: white;
      }
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;

    shadow.appendChild(style);
    document.body.appendChild(toast);
  }

  const toastMsg = document.createElement('div');
  toastMsg.className = `toast ${type}`;
  toastMsg.textContent = message;

  toast.shadowRoot.appendChild(toastMsg);

  setTimeout(() => {
    toastMsg.remove();
  }, DURATION + ANIMATION_DURATION * 2);
}

function showSuccess() {
  showToast('Feedback submitted successfully!', 'success');
}

function showError(message) {
  showToast(message || 'An error occurred', 'error');
}
