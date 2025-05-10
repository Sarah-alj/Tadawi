import puppeteer from 'puppeteer';
import { doctorLogin } from './_doctor-login.js';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 5,
  });

  const page = await browser.newPage();

  await doctorLogin(page);

  // Navigate to the "Create Lab Page" link
  const createLabPageLinkSelector = 'a[href="../LabPage/Lab.html"]';
  await page.waitForSelector(createLabPageLinkSelector);
  await page.click(createLabPageLinkSelector);

  const labBtnsSelector = 'button.lab-btn';
  const labNameInput = 'input[id="lab-name"]';
  const appointmentDateSelector = 'input[id=appointment-date]';
  const appointmentTimeSelector = 'select[id="time-slot"]';
  const patientNameSelectInputSelector = 'select[id="patient-name"]';
  const bloodWorkSelectInputSelector = 'select[id="bloodwork"]';
  const confirmBtnSelector = 'button[id="confirm-btn"]';
  const successContainerSelector = '.success-container';

  async function selectOptionAtRandom(selector) {
    const options = await page.$$eval(`${selector} option:not(:first-child)`, (opts) => opts.map((opt) => opt.value));
    const randomOption = options[Math.floor(Math.random() * options.length)];
    await page.select(selector, randomOption);
  }

  // select a lab from the labBtns at random
  const labBtns = await page.$$(labBtnsSelector);
  const randomLabIndex = Math.floor(Math.random() * labBtns.length);
  const randomLabBtn = labBtns[randomLabIndex];
  await randomLabBtn.click();

  const labName = await randomLabBtn.evaluate((btn) => btn.getAttribute('data-lab'));

  await page.waitForSelector(labNameInput);
  await page.type(labNameInput, labName ?? 'Lab Name'); // Change this to the desired lab name

  // select a date for the appointment
  await page.waitForSelector(appointmentDateSelector);
  await page.click(appointmentDateSelector);
  await page.keyboard.press('Backspace');
  await page.keyboard.type('01/01/2026'); // Change this to the desired date

  // select a time
  await selectOptionAtRandom(appointmentTimeSelector);

  // select a patient name
  await page.waitForSelector(patientNameSelectInputSelector, { visible: true });
  await selectOptionAtRandom(patientNameSelectInputSelector);

  // select a bloodwork type
  await selectOptionAtRandom(bloodWorkSelectInputSelector);

  // click the confirm button
  await page.waitForSelector(confirmBtnSelector);
  await page.click(confirmBtnSelector);

  await page.waitForSelector(successContainerSelector);

  console.log('Done with automation');
  await browser.close();
})();
