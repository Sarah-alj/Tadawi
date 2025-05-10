import { postData } from '../js/api.js';

class AIChatBox {
  constructor() {
    this.initializeElements();
    this.initializeEventListeners();
    this.setupInitialState();
  }

  initializeElements() {
    this.inputField = document.getElementById('ai-message-input');
    this.chatMessages = document.getElementById('ai-chat-messages');
    this.sendButton = document.getElementById('ai-send-btn');
    this.messages = [];
    this.sessionStorageKey = 'AI_Chat_History';
  }

  initializeEventListeners() {
    this.sendButton.addEventListener('click', this.sendMessage.bind(this));
    this.inputField.addEventListener('keypress', this.handleKeyPress.bind(this));
  }

  setupInitialState() {
    this.inputField.focus();
    this.loadChatHistory();
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  async sendMessage() {
    const message = this.getInputMessage();
    if (!this.isValidMessage(message)) return;

    await this.processMessage(message);
  }

  getInputMessage() {
    return this.inputField.value.trim();
  }

  isValidMessage(message) {
    return message.length > 0;
  }

  async processMessage(message) {
    this.setUIStateForSending(true);
    this.addMessageToChat({ role: 'user', message });

    const response = await this.sendMessageToServer();
    this.handleServerResponse(response);
  }

  async sendMessageToServer() {
    return await postData('/api/ai-chat', { messages: this.messages });
  }

  handleServerResponse(response) {
    if (!response.isOk) {
      this.handleError();
      return;
    }

    this.setUIStateForSending(false);
    this.addMessageToChat({ role: 'assistant', message: response.data.message });
    this.resetInput();
  }

  handleError() {
    this.setUIStateForSending(false);
    this.addMessageToChat({
      role: 'assistant',
      message: 'An error occurred. Please try again later.',
    });
    this.resetInput();
  }

  setUIStateForSending(isSending) {
    this.updateButtonState(isSending);
    this.inputField.disabled = isSending;
  }

  resetInput() {
    this.inputField.value = '';
    this.inputField.focus();
  }

  updateButtonState(loading) {
    this.sendButton.disabled = loading;
    this.sendButton.innerHTML = loading ? 'Sending...' : 'Ask AI';
  }

  createMessageElement({ role, message }) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${role}-message`;
    messageDiv.textContent = message;
    return messageDiv;
  }

  addMessageToChat(messageItem) {
    this.messages.push(messageItem);
    const messageElement = this.createMessageElement(messageItem);
    this.chatMessages.appendChild(messageElement);
    this.scrollToBottom();
    this.saveChatHistory();
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  clearChat() {
    this.chatMessages.innerHTML = '';
    this.messages = [];
  }

  saveChatHistory() {
    sessionStorage.setItem(this.sessionStorageKey, JSON.stringify(this.messages));
  }

  getChatHistory() {
    const history = sessionStorage.getItem(this.sessionStorageKey);
    return history ? JSON.parse(history) : null;
  }

  loadChatHistory() {
    const chatHistory = this.getChatHistory();
    if (chatHistory) {
      this.clearChat();
      chatHistory.forEach(this.addMessageToChat.bind(this));
    } else {
      this.addMessageToChat({
        role: 'assistant',
        message: 'Hello! How can I assist you today?',
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AIChatBox();
});
