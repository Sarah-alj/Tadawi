import { fetchData, postData } from '/js/http-calls.js';

/**
 * type Contact = { userId: string; name: string; matchId: string }
 * type Message = { content: string; sender: string }
 */

// GLOBAL DATA VARIABLES
let contacts = [];
let messages = [];
let activeContact = null;
let intervalId = null;

const POLLING_INTERVAL = 5 * 1000; // 5 seconds

// DOM ELEMENTS
const contactsList = document.querySelector('[data-contacts-list]');
const chatHeader = document.querySelector('[data-chat-header]');
const chatMessages = document.querySelector('[data-chat-messages]');
const chatInput = document.querySelector('[data-chat-input]');
const chatSendButton = document.querySelector('[data-chat-send-btn]');

// FUNCTIONS TO PRODUCE HTML ELEMENTS
function createContactElement(contact) {
  const contactElement = document.createElement('div');
  contactElement.classList.add('user');
  contactElement.textContent = contact.name;

  contactElement.addEventListener('click', () => openChat(contact.matchId));

  return contactElement;
}

function createMessageElement(message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.classList.add(
    message.sender === activeContact.userId ? 'received' : 'sent'
  );
  messageElement.textContent = message.content;

  return messageElement;
}

// FUNCTIONS TO UPDATE DOM
function updateContacts() {
  contactsList.innerHTML = '<h2>Contacts</h2>';

  contacts.forEach((contact) => {
    const contactElement = createContactElement(contact);
    contactsList.appendChild(contactElement);
  });
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
  if (activeContact && activeContact.matchId === matchId) return; // already open

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
  const fetchResponse = await fetchData(
    `/api/chat/${activeContact.matchId}/messages`
  );

  if (fetchResponse.isOk) {
    return fetchResponse.data;
  } else {
    return messages.length ? messages : [];
  }
}

async function sendMessage() {
  const message = chatInput.value;
  if (!message) return;

  const postResponse = await postData(
    `/api/chat/${activeContact.matchId}/messages`,
    {
      content: message,
      recipient: activeContact.userId,
      matchId: activeContact.matchId,
    }
  );

  if (postResponse.isOk) {
    chatInput.value = '';
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
chatSendButton.addEventListener('click', sendMessage);
document.addEventListener('DOMContentLoaded', async () => {
  const contactsData = await fetchData('/api/chat/get-contacts');
  if (contactsData) {
    contacts = contactsData.data;
    updateContacts();
  }
});
