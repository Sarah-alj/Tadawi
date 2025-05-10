import { deleteData, fetchData } from '/js/api.js';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  await fetchAndDisplayNotification();

  const clearNotificationsButton = document.querySelector('[data-clear-notifications-button');

  clearNotificationsButton.addEventListener('click', handleClearNotifications);
}

async function fetchAndDisplayNotification() {
  const fetchResponse = await fetchData('/api/notifications');
  const notificationsList = document.querySelector('[data-notifications-list]');

  while (notificationsList.firstChild) {
    notificationsList.removeChild(notificationsList.firstChild);
  }

  if (!fetchResponse.isOk) {
    notificationsList.appendChild(createEmptyNotificationItem());
    return;
  }

  const notifications = fetchResponse.data;

  if (notifications.length === 0) {
    notificationsList.appendChild(createEmptyNotificationItem());
    return;
  }

  notifications.forEach((notification) => {
    notificationsList.appendChild(createNotificationItem(notification));
  });
}

async function handleClearNotifications() {
  await deleteData('/api/notifications');

  await fetchAndDisplayNotification();
}

function createNotificationItem(notification) {
  const notificationItem = document.createElement('li');
  notificationItem.classList.add('notification-item');

  const date = new Date(notification.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  notificationItem.innerHTML = `
    <strong>${notification.message}</strong>
    <span>${formattedDate}</span>
  `;

  const datetimeElement = notificationItem.querySelector('time');
  if (datetimeElement) {
    const datetime = new Date(datetimeElement.getAttribute('datetime'));
    datetimeElement.textContent = datetime.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  }

  return notificationItem;
}

function createEmptyNotificationItem() {
  const notificationItem = document.createElement('li');
  notificationItem.classList.add('notification-item');
  notificationItem.textContent = 'No new notifications';

  return notificationItem;
}
