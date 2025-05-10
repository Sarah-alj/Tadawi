import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 5,
  });

  const page = await browser.newPage();

  // goto the new page

  await page.goto('http://localhost:5000/Login-OTP/Dr-Login.html');

  // LOGIN PAGE
  // variables
  const email = 'input[name="email"]';
  const password = 'input[name="password"]';

  await page.waitForSelector(email);
  await page.click(email, { clickCount: 1 });
  await page.type(email, 'test-doctor@gmail.com');

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

  // FEEDBACK PAGE
  // variables
  // Click the Matches button
  const matchesButton = 'a[href="../PatientsTabPage/PatientTabPage.html"]';
  await page.waitForSelector(matchesButton);
  await page.click(matchesButton);

  const inquireButton = 'a[href="DrInquire.html?patientId=67d819c4056085632e53b302"]';
  await page.waitForSelector(inquireButton);
  await page.click(inquireButton);

  const privateInfo = 'a[href="../PatientsTabPage/DrContactInfo.html?patientId=67d819c4056085632e53b302"]';
  await page.waitForSelector(privateInfo);
  await page.click(privateInfo);

  const backButton = 'a[href="../PatientsTabPage/PatientTabPage.html"]';
  await page.waitForSelector(backButton);
  await page.click(backButton);

  const matchButton = 'a[href="DrConfirmMatch.html?patientId=67d819c4056085632e53b302"]';
  await page.waitForSelector(matchButton);
  await page.click(matchButton);

  const noButton = 'button[id="denyBtn"]';
  await page.waitForSelector(noButton);
  await page.click(noButton);

  console.log('done with automation');
})();
