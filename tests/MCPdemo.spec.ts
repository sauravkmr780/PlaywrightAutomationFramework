import { test, expect } from '@playwright/test';

// Test to navigate to facebook.com and enter dummy credentials
// Follows current framework standards

test.describe('Facebook Login Demo - MCP', () => {
  test('should navigate to facebook.com and enter dummy credentials', async ({ page }) => {
    // Navigate to Facebook
    await page.goto('https://www.facebook.com/');

    // Enter dummy username
    await page.fill('input[name="email"]', 'dummyuser@example.com');

    // Enter dummy password
    await page.fill('input[name="pass"]', 'dummyPassword123');

    // Optionally, you can click the login button but do not actually log in
    // await page.click('button[name="login"]');

    // Assert that the fields contain the entered values
    await expect(page.locator('input[name="email"]')).toHaveValue('dummyuser@example.com');
    await expect(page.locator('input[name="pass"]')).toHaveValue('dummyPassword123');
  });
});
