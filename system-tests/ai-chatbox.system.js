import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 10,
  });

  const page = await browser.newPage();

  await page.goto('http://localhost:5000/AIchatBox/AIchatBox.html');

  const inputField = '#ai-message-input';
  const sendButton = '#ai-send-btn';
  const chatMessages = '#ai-chat-messages';

  // assert that the chatMessages must have at least one message (the welcome message)
  await page.waitForSelector(chatMessages);
  const chatMessagesContent = await page.$eval(chatMessages, (el) => el.innerHTML);
  if (!chatMessagesContent.includes('Hello! How can I assist you today?')) {
    console.error('Welcome message not found in chat messages.');
    await browser.close();
    return;
  }

  // Type a message in the input field
  await page.waitForSelector(inputField);
  await page.click(inputField, { clickCount: 1 });
  await page.type(inputField, 'Hello, AI! How are you?');

  await page.click(sendButton);

  // check number of messages in chatMessages
  const messagesAfterSend = await page.$eval(chatMessages, (el) => el.childElementCount);
  if (messagesAfterSend < 2) {
    console.error('Message not sent successfully.');
    await browser.close();
    return;
  }

  // Check if the AI responded with a message
  await page.waitForNetworkIdle();

  const messagesAfterResponse = await page.$eval(chatMessages, (el) => el.childElementCount);
  if (messagesAfterResponse <= messagesAfterSend) {
    console.error('AI did not respond to the message.');
    await browser.close();
    return;
  }

  console.log('AI responded successfully to the message.');
  await browser.close();
})();
