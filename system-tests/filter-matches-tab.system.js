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
  const matchesButton = 'a[href="../MatchesPage/DrMatches.html"]';
  await page.waitForSelector(matchesButton);
  await page.click(matchesButton);

  // Select Age 18-25
  const ageFilter = '#ageFilter';
  await page.waitForSelector(ageFilter);
  await page.select(ageFilter, '18-25');

  // Select Gender Male
  const genderFilter = '#genderFilter';
  await page.waitForSelector(genderFilter);
  await page.select(genderFilter, 'Male');

  // Select Disease Oncology (Cancer)
  const diseaseFilter = '#diseaseFilter';
  await page.waitForSelector(diseaseFilter);
  await page.select(diseaseFilter, 'Oncology (Cancer)');

  console.log('done with automation');
})();
