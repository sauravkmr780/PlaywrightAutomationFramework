import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter : 'html',
  retries: 1, // Retry once on failure

  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://rahulshettyacademy.com',
    browserName: 'firefox',
    headless: false,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    viewport: null, // Set to null to use full screen
    launchOptions: {
      args: ['--start-maximized'] // Launch browser in maximized mode
    },
    acceptDownloads: true // Enable file downloads

  },

  
});
