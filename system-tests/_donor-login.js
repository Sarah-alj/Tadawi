/**
 * @description This function automates the login process for a donor on the web application.
 * It uses Puppeteer to navigate to the login page, fill in the email and password fields,
 * @param {import('puppeteer').Page} page
 */
export async function donorLogin(page) {
  await page.goto('http://localhost:5000/Login-OTP/Dn-Login.html');

  // LOGIN PAGE
  // variables
  const email = 'input[name="email"]';
  const password = 'input[name="password"]';

  await page.waitForSelector(email);
  await page.click(email, { clickCount: 1 });
  await page.type(email, 'test-donor@gmail.com');

  await page.waitForSelector(password);
  await page.click(password, { clickCount: 1 });
  await page.type(password, '123456789');

  await page.keyboard.press('Enter');

  // OTP PAGE
  // variables
  const otp = 'input[name="otp"]';

  await page.waitForSelector(otp);
  await page.click(otp, { clickCount: 1 });
  await page.type(otp, '124124');

  await page.keyboard.press('Enter');
}
