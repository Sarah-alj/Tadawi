import puppeteer from 'puppeteer';
import { donorLogin } from './_donor-login.js';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 5,
  });

  const page = await browser.newPage();

  await donorLogin(page);

  const editButton = 'button#edit-btn';
  await page.waitForSelector(editButton);
  await page.evaluate((btn) => btn?.click(), await page.$(editButton));

  // FEEDBACK PAGE
  // variables
  const editPassword = 'input[id="password"]';
  const confirmPassword = 'input[id="confirm-password"]';
  const editName = 'input[id="full-name"]';

  await page.waitForSelector(editPassword);
  await page.click(editPassword, { clickCount: 1 });
  await page.type(editPassword, '123456789');

  await page.waitForSelector(confirmPassword);
  await page.click(confirmPassword, { clickCount: 1 });
  await page.type(confirmPassword, '123456789');

  await page.waitForSelector(editName);
  await page.click(editName, { clickCount: 1 });
  await page.evaluate((input) => {
    if (input) {
      input.value = 'Donor Edit Test';
    }
  }, await page.$(editName));

  // Click the submit button
  const submitButton = 'button[type="submit"]';
  await page.waitForSelector(submitButton);
  await page.click(submitButton);

  console.log('done with automation');
})();
