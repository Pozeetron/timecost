const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, '..', 'gp_content', 'screenshots');
const BASE = 'http://localhost:8083';

const settings = (overrides = {}) =>
  JSON.stringify({
    currency: 'USD',
    rate: '45',
    ratePeriod: 'hour',
    minutesPerHour: '60',
    hoursPerDay: '8',
    daysPerWeek: '5',
    onboardingDone: true,
    ...overrides,
  });

async function setStorage(page, value) {
  await page.addInitScript((raw) => {
    // RN AsyncStorage on web uses this key pattern
    localStorage.setItem('@timecost/settings/v1', raw);
  }, value);
}

async function shot(page, name) {
  await page.waitForTimeout(900);
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log('saved', file);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1,
  });

  // 1) Main calculator with result
  let page = await context.newPage();
  await setStorage(page, settings());
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  // fill purchase price
  const inputs = page.locator('input');
  const count = await inputs.count();
  console.log('inputs', count);
  // find the purchase price input - usually the visible one on main
  for (let i = 0; i < count; i++) {
    const ph = await inputs.nth(i).getAttribute('placeholder');
    if (ph === '199') {
      await inputs.nth(i).fill('299');
      break;
    }
  }
  await shot(page, '01-main-result');
  await page.close();

  // 2) Settings
  page = await context.newPage();
  await setStorage(page, settings());
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.getByText('Settings', { exact: true }).first().click();
  await page.waitForTimeout(800);
  await shot(page, '02-settings');
  await page.close();

  // 3) Onboarding currency
  page = await context.newPage();
  await setStorage(
    page,
    settings({ onboardingDone: false, rate: '', currency: 'EUR' }),
  );
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await shot(page, '03-onboarding-currency');
  await page.close();

  // 4) Onboarding rate
  page = await context.newPage();
  await setStorage(
    page,
    settings({ onboardingDone: false, rate: '', currency: 'USD' }),
  );
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.getByText('Continue', { exact: true }).click();
  await page.waitForTimeout(800);
  await shot(page, '04-onboarding-rate');
  await page.close();

  // 5) Expensive purchase insight
  page = await context.newPage();
  await setStorage(page, settings({ rate: '20' }));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  for (let i = 0; i < (await page.locator('input').count()); i++) {
    const ph = await page.locator('input').nth(i).getAttribute('placeholder');
    if (ph === '199') {
      await page.locator('input').nth(i).fill('2499');
      break;
    }
  }
  await shot(page, '05-large-purchase');
  await page.close();

  await browser.close();
  console.log('done');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
