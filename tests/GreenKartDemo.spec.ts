import { test, expect } from '@playwright/test';

// GreenKart Demo App Test Suite
// https://rahulshettyacademy.com/seleniumPractise/

test.describe('GreenKart Demo App', () => {
  test('Homepage loads and products are visible', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/seleniumPractise/');
    await expect(page.locator('.search-keyword')).toBeVisible();
    await expect(page.locator('.products')).toBeVisible();
    // Playwright does not have toHaveCountGreaterThan, use toHaveCount with minimum expected count
    const productCount = await page.locator('.product').count();
    expect(productCount).toBeGreaterThan(0);
  });

  test('Search for a product and validate results', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/seleniumPractise/');
    await page.fill('.search-keyword', 'Brocolli');
    await page.waitForTimeout(500); // Wait for search results to update
    await expect(page.locator('.product:visible')).toHaveCount(1);
    await expect(page.locator('.product:visible .product-name')).toContainText('Brocolli');
  });

  test('Add product to cart and verify cart count', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/seleniumPractise/');
    await page.fill('.search-keyword', 'Cucumber');
    await page.waitForTimeout(500);
    await page.click('.product:visible button:has-text("ADD TO CART")');
    // Cart count is in a table strong tag, not .cart-info span
    await expect(page.locator('table strong').first()).toHaveText('1');
  });

  test('Add multiple products and verify cart', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/seleniumPractise/');
    await page.fill('.search-keyword', '');
    await page.waitForTimeout(500);
    const addButtons = await page.$$('.product button:has-text("ADD TO CART")');
    for (let i = 0; i < 3; i++) {
      await addButtons[i].click();
    }
    // Cart count is in a table strong tag, not .cart-info span
    await expect(page.locator('table strong').first()).toHaveText('3');
  });

  test('Checkout with products in cart', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/seleniumPractise/');
    await page.fill('.search-keyword', 'Tomato');
    await page.waitForTimeout(500);
    await page.click('.product:visible button:has-text("ADD TO CART")');
    await page.click('.cart-icon');
    await page.click('text=PROCEED TO CHECKOUT');
    await expect(page.locator('.promoCode')).toBeVisible();
    await expect(page.locator('.products-wrapper')).toBeVisible();
  });

  test('Try to checkout with empty cart and validate error', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/seleniumPractise/');
    await page.click('.cart-icon');
    await page.click('text=PROCEED TO CHECKOUT');
    // Should remain on the same page or show an error
    await expect(page.locator('.promoCode')).not.toBeVisible();
  });
});
