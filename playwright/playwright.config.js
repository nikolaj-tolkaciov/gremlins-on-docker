// @ts-check
const { devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
const config = {
  testDir: '.',
  timeout: 10* 60 * 1000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    browserName: 'firefox',
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    actionTimeout: 0,
    trace: 'on-first-retry',
    launchOptions: {
      args: ['--disable-setuid-sandbox', '--single-process', '--disable-dev-shm-usage']
    }
  }
};

module.exports = config;