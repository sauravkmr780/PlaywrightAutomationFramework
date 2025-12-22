import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [
    ['line'],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false
    }],
    ['html']
  ],
  retries: 1, // Retry once on failure

  use: {
    
    baseURL: 'https://rahulshettyacademy.com',
    browserName: 'chromium',
    headless: false,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    viewport: null, // Set to null to use full screen
    launchOptions: {
      args: ['--start-maximized'] // Launch browser in maximized mode
    },
    acceptDownloads: true, // Enable file downloads
    ignoreHTTPSErrors: true, // Ignore HTTPS errors
    permissions: ['geolocation'], // Grant geolocation permission
    video: 'retain-on-failure' // Record video only on test failure
  },

  
});
