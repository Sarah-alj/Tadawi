import puppeteer from 'puppeteer';
import { donorLogin } from './_donor-login.js';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 5,
  });

  const page = await browser.newPage();

  await donorLogin(page);

  // navigate to my donations page
  const myDonationsPage = 'a[href="../DonationsPgae/MyDonations.html"]';
  await page.waitForSelector(myDonationsPage);
  await page.click(myDonationsPage);

  // navigate to new donations page
  const newDonationPage = 'a[href="NewDonation.html"]';
  await page.waitForSelector(newDonationPage);
  await page.click(newDonationPage);

  // fill out the donation form
  const equipmentNameSelect = 'select[name="equipmentName"]';
  const equipmentDescriptionInput = 'input[name="equipmentDescription"]';
  const yearsOfUseSelect = 'select[name="yearsOfUse"]';
  const warrantyDetailsInput = 'input[name="warrantyDetails"]';
  const defectsInput = 'input[name="defects"]';
  const pointOfContantInput = 'input[name="pointOfContact"]';
  const additionalDetailsInput = 'input[name="details"]';
  const submitBtn = 'button[type="submit"]';

  async function selectOptionAtRandom(selector) {
    const options = await page.$$eval(`${selector} option:not(:first-child)`, (opts) => opts.map((opt) => opt.value));
    const randomOption = options[Math.floor(Math.random() * options.length)];
    await page.waitForSelector(selector, { visible: true });
    await page.select(selector, randomOption);
  }

  await selectOptionAtRandom(equipmentNameSelect);
  await page.type(equipmentDescriptionInput, 'This is a test description.');
  await selectOptionAtRandom(yearsOfUseSelect);
  await page.type(warrantyDetailsInput, 'Warranty details go here.');
  await page.type(defectsInput, 'No defects');
  await page.type(pointOfContantInput, 'John Doe');
  await page.type(additionalDetailsInput, 'No additional details.');
  await page.click(submitBtn);

  page.on('dialog', async (dialog) => {
    if (dialog.message() !== 'Donation has been successfully published!') {
      throw new Error(`Unexpected dialog message: ${dialog.message()}`);
    }
    await dialog.accept();
    console.log('Donation has been successfully published!');
    await browser.close();
  });
})();
