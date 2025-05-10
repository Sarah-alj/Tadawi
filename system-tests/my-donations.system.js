import puppeteer from 'puppeteer';
import { donorLogin } from './_donor-login.js';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 5,
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
  if (donationRow) {
    console.log('Donation row found!');
  } else {
    const emptyRow = await donationsTable.$('.empty-row');
    if (emptyRow) {
      console.log('Empty row found!');
    } else {
      console.error('No donation rows or empty rows found!');
    }
  }

  // done with automation
  await browser.close();
})();
