import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 5,
  });

  const page = await browser.newPage();

  // goto the new page

  await page.goto('http://localhost:5000/Login-OTP/P-Login.html');

  // LOGIN PAGE
  // variables
  const email = 'input[name="email"]';
  const password = 'input[name="password"]';

  await page.waitForSelector(email);
  await page.click(email, { clickCount: 1 });
  await page.type(email, 'patient01@gmail.com');

  await page.waitForSelector(password);
  await page.click(password, { clickCount: 1 });
  await page.type(password, 'Patient@123');

  await page.keyboard.press('Enter');

  // OTP PAGE
  // variables
  const otp = 'input[name="otp"]';

  await page.waitForSelector(otp);
  await page.click(otp, { clickCount: 1 });
  await page.type(otp, '124124');

  await page.keyboard.press('Enter');

  // FEEDBACK PAGE
  // variables
  const name = 'input[name="name"]';
  const feedbackEmail = 'input[name="email"]';
  const comments = 'textarea[name="comments"]';

  await page.waitForSelector(name);
  await page.click(name, { clickCount: 1 });
  await page.type(name, 'Patient One');

  await page.waitForSelector(feedbackEmail);
  await page.click(feedbackEmail, { clickCount: 1 });
  await page.type(feedbackEmail, 'patient01@gmail.com');

  await page.waitForSelector(comments);
  await page.click(comments, { clickCount: 1 });
  await page.type(comments, 'It is a good website for patients.');

  // Click the submit button
  const submitButton = 'button[type="submit"]';
  await page.waitForSelector(submitButton);
  await page.click(submitButton);

  console.log('done with automation');
})();
