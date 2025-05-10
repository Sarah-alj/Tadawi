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

  // Click the Edit button
  const editButton = 'a[href="../EditProfile/EditProfile-Patient.html"]';
  await page.waitForSelector(editButton);
  await page.click(editButton);

  // FEEDBACK PAGE
  // variables
  const editPassword = 'input[name="password"]';
  const confirmPassword = 'input[name="confirmPassword"]';
  const editName = 'input[name="name"]';

  await page.waitForSelector(editPassword);
  await page.click(editPassword, { clickCount: 1 });
  await page.type(editPassword, 'Patient@123');

  await page.waitForSelector(confirmPassword);
  await page.click(confirmPassword, { clickCount: 1 });
  await page.type(confirmPassword, 'Patient@123');

  await page.waitForSelector(editName);
  await page.click(editName, { clickCount: 1 });
  await page.type(editName, 'Patient 01 Edited');

  // Click the submit button
  const submitButton = 'button[type="submit"]';
  await page.waitForSelector(submitButton);
  await page.click(submitButton);

  console.log('done with automation');
})();
