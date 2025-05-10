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
  if (!donationRow) {
    console.log('No donation row found!');
    await browser.close();
    return;
  }

  const deleteButton = await donationRow.$('.action-btn.delete-btn');
  if (!deleteButton) {
    console.error('Delete button not found!');
    await browser.close();
    return;
  }

  await deleteButton.click();

  //confirm-btn
  const confirmDeleteBtn = await page.waitForSelector('.confirm-btn', { visible: true });
  if (!confirmDeleteBtn) {
    console.error('Confirm delete button not found!');
    await browser.close();
    return;
  }

  await confirmDeleteBtn.click();

  console.log('Donation deleted successfully!');

  // Close the browser
  await browser.close();
})();
