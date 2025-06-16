import puppeteer from 'puppeteer';

const childProcess = require('child_process');

jest.setTimeout(30000);

describe('Inn Form', () => {
  let browser;
  let page;
  let server = null;

  beforeAll(async () => {
    server = await childProcess.fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', () => {
        reject();
      });
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppeteer.launch({
      // headless: false,
      // slowMo: 100,
      // devtools: true,
    });

    page = await browser.newPage();
  });

  test('Form should render on page start', async () => {
    await page.goto('http://localhost:9000');

    await page.waitFor('.btn');
  });

  test('test popover', async () => {
    await page.waitForSelector('body');
    jest.setTimeout(20000);
    await page.goto('http://localhost:9000');

    await page.waitFor('.btn');

    const btn = await page.$('.btn');

    await btn.click();

    await page.waitFor('.popover');
  });
  afterAll(async () => { // перенёс со строки 36
    if (browser) {
      await browser.close();
    }
    server.kill();
  });
});
