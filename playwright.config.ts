import { defineConfig, devices } from '@playwright/test';

// Check if running in CI environment
const isCI = typeof process !== 'undefined' && !!process.env?.CI;

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
    headless: isCI, // Run headless in CI, headed locally
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    viewport: isCI ? { width: 1280, height: 720 } : null, // Fixed viewport in CI, fullscreen locally
    launchOptions: {
      args: isCI ? [] : ['--start-maximized'] // Start maximized only locally
    },
    acceptDownloads: true, // Enable file downloads
    ignoreHTTPSErrors: true, // Ignore HTTPS errors
    permissions: ['geolocation'], // Grant geolocation permission
    video: 'retain-on-failure' // Record video only on test failure
  },

  
});
