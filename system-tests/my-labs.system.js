import puppeteer from 'puppeteer';
import { doctorLogin } from './_doctor-login.js';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 0,
  });

  const page = await browser.newPage();

  await doctorLogin(page);

  // Navigate to the "Create Lab Page" link
  const createLabPageLinkSelector = 'a[href="../MyLabsPage/MyLabsPage.html"]';
  await page.waitForSelector(createLabPageLinkSelector);
  await page.click(createLabPageLinkSelector);

  // Check if the labs table is present
  const labsTableSelector = '#labs-table-body';
  const labsTable = await page.waitForSelector(labsTableSelector, {
    visible: true,
  });

  if (!labsTable) {
    console.error('Labs table not found!');
    await browser.close();
    return;
  }

  const labRow = await labsTable.$('.lab-row');
  if (labRow) {
    console.log('Lab row found!');
  } else {
    const emptyRow = await labsTable.$('.empty-row');
    if (emptyRow) {
      console.log('Empty row found!');
    } else {
      console.error('No lab rows or empty rows found!');
    }
  }

  await browser.close();
})();
