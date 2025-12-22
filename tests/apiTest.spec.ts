import { test, expect } from '@playwright/test';
import { loginToken, orderCreation, injectToken, API_ENDPOINTS } from './utils/apiHelpers';

test.describe('API Integration Tests', () => {
  let token: string;
  let orderID: string;
  let email: string = 'sauravkmr780@gmail.com';
  let password: string = '@1Infosys';
  let productOrderedId: string = '68a961719320a140fe1ca57c'; // Sample product ID   
  let country: string = 'Cuba';

  test.beforeAll(async ({ request }) => {
    console.log('Starting API Tests');

    // Step 1: Login and get token
    token = await loginToken(request, email ,password);
    console.log(`Token: ${token}`);

    // Step 2: Create order via API
    orderID = await orderCreation(request, token,country, productOrderedId);
    console.log(`Order ID: ${orderID}`);
  });

  test('Verify order created via API is visible in UI', async ({ page }) => {
    // Inject token into browser storage
    await injectToken(page, token);

    // Navigate to orders page
    await page.goto(API_ENDPOINTS.MY_ORDERS);
    
    // Wait for orders to load
    await page.locator('.table tbody tr').first().waitFor();
    
    // Verify order ID is visible
    await expect(page.getByText(orderID)).toBeVisible();
    console.log(`✓ Order ID: ${orderID} is visible on Orders Page`);
  });

  test('Create multiple orders with different countries', async ({ request, page }) => {
    const countries = ['India', 'Brazil', 'Australia'];
    const orderIDs: string[] = [];

    // Create orders for each country
    for (let i = 0; i < countries.length; i++) {
      const orderId = await orderCreation(request, token, countries[i], productOrderedId);
      orderIDs.push(orderId);
    }

    // Verify all orders in UI
    await injectToken(page, token);
    await page.goto(API_ENDPOINTS.MY_ORDERS);
    await page.locator('.table tbody tr').first().waitFor();

    for (let i=0; i < orderIDs.length; i++) {
      await expect(page.getByText(orderIDs[i])).toBeVisible();
      console.log(`✓ Order ${orderIDs[i]} verified in UI`);
    }
  });
});