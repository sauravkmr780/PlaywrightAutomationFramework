import { defineConfig, devices } from '@playwright/test';

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
    headless: true, // Always run headless for consistency
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    viewport: { width: 1280, height: 720 }, // Standard viewport
    acceptDownloads: true, // Enable file downloads
    ignoreHTTPSErrors: true, // Ignore HTTPS errors
    permissions: ['geolocation'], // Grant geolocation permission
    video: 'retain-on-failure' // Record video only on test failure
  },

  
});
