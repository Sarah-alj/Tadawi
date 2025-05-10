import { fetchData, postData } from '../js/api.js';
import { handleFileUpload } from '../js/file-upload.js';

/**
 * type Contact = { userId: string; name: string; matchId: string, status: 'accepted' | 'chat-only' }
 * type Message = { content: string; sender: string, document: string, type: string }
 */

// GLOBAL DATA VARIABLES
let contacts = [];
let messages = [];
let activeContact = null;
let intervalId = null;
let abortController = null;

const POLLING_INTERVAL = 5 * 1000; // 5 seconds

// DOM ELEMENTS
const contactsList = document.querySelector('[data-contacts-list]');
const chatHeader = document.querySelector('[data-chat-header]');
const chatMessages = document.querySelector('[data-chat-messages]');
const chatInputContainer = document.querySelector('[data-chat-input-container]');
const chatInput = document.querySelector('[data-chat-input]');
const chatSendButton = document.querySelector('[data-chat-send-btn]');
const fileInput = document.querySelector('[data-chat-file-input]');

// FUNCTIONS TO PRODUCE HTML ELEMENTS
function createContactElement(contact) {
  const contactElement = document.createElement('div');
  contactElement.classList.add('user');
  contactElement.dataset.matchId = contact.matchId;

  contactElement.innerHTML = `
    <span class="user-name">${contact.name}</span>
    <span class="user-status">
      ${contact.status === 'accepted' ? '🔐' : '✉'}
    </span>  
  `;

  contactElement.addEventListener('click', () => {
    updateActiveContact(contact.matchId);
    openChat(contact.matchId);
  });
  return contactElement;
}

function createMessageElement(message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.classList.add(message.sender === activeContact.userId ? 'received' : 'sent');

  if (message.document) {
    if (message.type === 'image') {
      messageElement.innerHTML = `<img src="/${message.document}" style="max-width: 200px; border-radius: 5px;" alt="Sent Image">`;
    } else if (message.type === 'pdf') {
      messageElement.innerHTML = `<a href="/${message.document}" target="_blank">📄 View PDF</a>`;
    }
  } else {
    messageElement.textContent = message.content;
  }

  return messageElement;
}

// FUNCTIONS TO UPDATE DOM
function updateContacts() {
  contactsList.innerHTML = '<h2>Contacts</h2>';
  contacts.forEach((contact) => {
    const contactElement = createContactElement(contact);
    contactsList.appendChild(contactElement);
  });

  const matchId = getUrlState();
  if (matchId) {
    const contactElement = contactsList.querySelector(`[data-match-id="${matchId}"]`);
    if (contactElement) {
      contactElement.click();
    }
  }
}

function updateActiveContact(matchId) {
  const activeContactElement = contactsList.querySelector(`[data-match-id="${matchId}"]`);

  contactsList.querySelectorAll('[data-match-id]').forEach((contactElement) => {
    contactElement.classList.remove('active');
  });

  activeContactElement.classList.add('active');

  updateUrlStateWithoutReload(matchId);
}

function updateMessages() {
  chatMessages.innerHTML = '';
  messages.forEach((message) => {
    const messageElement = createMessageElement(message);
    chatMessages.appendChild(messageElement);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// FUNCTIONS TO HANDLE CHAT
async function openChat(matchId) {
  if (!activeContact) chatInputContainer.classList.remove('hidden'); // show inputs when a contact is selected

  if (activeContact && activeContact.matchId === matchId) return;

  activeContact = contacts.find((contact) => contact.matchId === matchId);
  chatHeader.textContent = activeContact.name;
  messages = [];
  updateMessages();

  const messagesData = await fetchMessages();
  if (messagesData) {
    messages = messagesData;
    updateMessages();
  }
  startListeningForNewMessages();
}

async function fetchMessages() {
  if (abortController) abortController.abort();
  abortController = new AbortController();
  const fetchResponse = await fetchData(`/api/chat/${activeContact.matchId}/messages`, abortController.signal);
  if (fetchResponse.isOk) {
    return fetchResponse.data;
  } else {
    return messages.length ? messages : [];
  }
}

function handleChatInputChange(event) {
  if (event.key === 'Enter') sendTextMessage();
}

async function sendTextMessage() {
  const message = chatInput.value;
  if (!message) return;

  const postResponse = await postData(`/api/chat/${activeContact.matchId}/messages`, {
    type: 'text',
    content: message,
    recipient: activeContact.userId,
    matchId: activeContact.matchId,
  });

  if (postResponse.isOk) {
    chatInput.value = '';
    messages.push(postResponse.data);
    updateMessages();
  }
}

async function sendDocumentMessage() {
  const file = fileInput.files[0];
  const fileUploadResult = await handleFileUpload(file, 'both');
  if (!fileUploadResult.isOk) {
    alert(fileUploadResult.error);
    return;
  }

  const postResponse = await postData(`/api/chat/${activeContact.matchId}/messages`, {
    type: fileUploadResult.type,
    document: fileUploadResult.data,
    recipient: activeContact.userId,
    matchId: activeContact.matchId,
  });

  if (postResponse.isOk) {
    messages.push(postResponse.data);
    updateMessages();
  }
}

function startListeningForNewMessages() {
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(async () => {
    const messagesData = await fetchMessages();
    if (messagesData) {
      messages = messagesData;
      updateMessages();
    }
  }, POLLING_INTERVAL);
}

// EVENT LISTENERS
chatInput.addEventListener('keydown', handleChatInputChange);
chatSendButton.addEventListener('click', sendTextMessage);
fileInput.addEventListener('change', sendDocumentMessage);
document.addEventListener('DOMContentLoaded', async () => {
  const contactsData = await fetchData('/api/chat/get-contacts');
  if (contactsData) {
    contacts = contactsData.data;
    updateContacts();
  }
});

// url state management
function updateUrlStateWithoutReload(matchId) {
  const url = new URL(window.location);
  url.searchParams.set('matchId', matchId);
  window.history.pushState({}, '', url);
}

function getUrlState() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('matchId');
}
