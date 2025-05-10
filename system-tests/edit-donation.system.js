import puppeteer from 'puppeteer';
import { donorLogin } from './_donor-login.js';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 0,
  });

  const page = await browser.newPage();

  await donorLogin(page);

  // Navigate to "My Donations" page
  const myDonationsPageSelector = 'a[href="../DonationsPgae/MyDonations.html"]';
  await page.waitForSelector(myDonationsPageSelector);
  await page.click(myDonationsPageSelector);

  // Wait for table to render donations (network + DOM ready)
  const donationsTable = await page.waitForSelector('#donations-table-body', { visible: true });
  if (!donationsTable) {
    console.error('Donations table not found!');
    await browser.close();
    return;
  }

  const donationRow = await donationsTable.$('.donation-row');
  if (!donationRow) {
    console.log('No donation row found!');
    await browser.close();
    return;
  }

  const editButton = await donationRow.$('.action-btn.edit-btn');
  if (!editButton) {
    console.error('Delete button not found!');
    await browser.close();
    return;
  }

  await editButton.click();

  await page.waitForNavigation();

  const equipmentNameSelect = 'select[name="equipmentName"]';
  const equipmentDescriptionInput = 'input[name="equipmentDescription"]';
  const yearsOfUseSelect = 'select[name="yearsOfUse"]';
  const warrantyDetailsInput = 'input[name="warrantyDetails"]';
  const defectsInput = 'input[name="defects"]';
  const pointOfContantInput = 'input[name="pointOfContact"]';
  const additionalDetailsInput = 'input[name="details"]';
  //<button type="submit">Save</button>
  const submitBtn = 'button[type="submit"]';

  async function selectOptionAtRandom(selector) {
    const options = await page.$$eval(`${selector} option:not(:first-child)`, (opts) => opts.map((opt) => opt.value));
    console.log(`Options for ${selector}:`, options); // Debugging line
    const randomOption = options[Math.floor(Math.random() * options.length)];
    console.log(`Random option selected for ${selector}:`, randomOption); // Debugging line
    await page.waitForSelector(selector, { visible: true });
    await page.select(selector, randomOption);
  }

  await selectOptionAtRandom(equipmentNameSelect);
  await page.type(equipmentDescriptionInput, 'This is a test updated description.');
  await selectOptionAtRandom(yearsOfUseSelect);
  await page.type(warrantyDetailsInput, 'Warranty details go here.');
  await page.type(defectsInput, 'No defects');
  await page.type(pointOfContantInput, 'johndoe@gmail.com');
  await page.type(additionalDetailsInput, 'No additional details.');
  await page.waitForSelector(submitBtn, { visible: true });
  await page.click(submitBtn);

  page.on('dialog', async (dialog) => {
    if (dialog.message() !== 'Donation has been successfully updated!') {
      throw new Error(`Unexpected dialog message: ${dialog.message()}`);
    }
    await dialog.accept();
    console.log('Donation has been successfully updated!');
    await browser.close();
  });
})();
