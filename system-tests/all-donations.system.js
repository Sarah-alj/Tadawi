import puppeteer from 'puppeteer';
import { donorLogin } from './_donor-login.js';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 0,
  });

  const page = await browser.newPage();

  await donorLogin(page);

  // navigate to my donations page
  const donationsPage = 'a[href="../DonationsPgae/DonationsPage.html"]';
  await page.waitForSelector(donationsPage);
  await page.click(donationsPage);

  const donationsContainer = await page.waitForSelector('#donations-container', {
    visible: true,
  });

  if (!donationsContainer) {
    console.log('No donations available');
    await browser.close();
    return;
  }

  // wait for either the card elements or the no donations message to appear
  const cardElements = await donationsContainer.$$('.card');

  if (cardElements.length > 0) {
    // select first card, click on contact button
    const firstCard = cardElements[0];
    const contactButton = await firstCard.$('.contact');
    if (!contactButton) {
      console.log('Contact button not found');
      await browser.close();
      return;
    }
    await contactButton.click();

    const successContainer = await page.waitForSelector('.success-container');
    if (!successContainer) {
      console.log('Success container not found');
      await browser.close();
      return;
    }

    console.log('Success container found');
    await browser.close();
  } else {
    console.log('No donations available');
    const noDonationsMessage = await donationsContainer.$('p');
    if (noDonationsMessage) {
      const messageText = await page.evaluate((el) => el.textContent, noDonationsMessage);
      console.log(messageText); // No donations available
    } else {
      console.log('No donations message not found');
    }
    await browser.close();
  }
})();
