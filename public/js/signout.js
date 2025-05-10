import { postData } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const signoutBtn = document.querySelector('#signoutBtn') || document.querySelector('[data-signoutBtn]');
  const url = '/api/auth/logout';

  if (!signoutBtn) return;

  signoutBtn.addEventListener('click', async () => {
    signoutBtn.disabled = true;
    signoutBtn.innerHTML = 'Signing out...';

    const response = await postData(url, {});

    if (response.isOk) {
      window.location.href = '/';
    } else {
      console.log(response);
      alert(response.message);
      signoutBtn.disabled = false;
      signoutBtn.innerHTML = 'Sign Out';
    }
  });
});
