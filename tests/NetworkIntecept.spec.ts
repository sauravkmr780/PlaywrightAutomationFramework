import { test, expect } from '@playwright/test'
import { loginAndInjectToken } from './utils/apiHelpers';

// Test data constants
const TEST_USER = {
    email: 'sauravkmr780@gmail.com',
    password: '@1Infosys'
} as const;

const FAKE_ORDERS_PAYLOAD = {
    data: [],
    message: 'No Orders'
} as const;

const ORDERS_API_PATTERN = '**/api/ecom/order/get-orders-for-customer/**';

test.describe('Network Interception Tests', () => {

    test('should display "No Orders" message when API returns empty orders', async ({ page, request }) => {
        // Arrange: Login and inject token
        await loginAndInjectToken(request, page, TEST_USER.email, TEST_USER.password);

        // Act: Navigate to dashboard and click orders
        await page.goto('/client/dashboard/dash');
        await page.waitForLoadState('domcontentloaded');

        // Setup route interception BEFORE navigation
        await page.route(ORDERS_API_PATTERN, async route => {
            if (route.request().method() === 'GET') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(FAKE_ORDERS_PAYLOAD)
                });
            } else {
                await route.continue();
            }
        });


        // setup fake reposne before orders button click
        await page.getByText('ORDERS').click();
        await page.waitForLoadState('domcontentloaded');

        // Assert: Verify "No Orders" message is displayed
        const noOrdersMessage = page.locator('div.mt-4.ng-star-inserted');
        await expect(noOrdersMessage).toBeVisible();
        await expect(noOrdersMessage).toContainText('You have No Orders to show at this time');
    });

    test('Security test request intercept', async ({ page,request }) => {

        // Arrange: Login and inject token
        await loginAndInjectToken(request, page, TEST_USER.email, TEST_USER.password);

        // Act: Navigate to dashboard and click orders
        await page.goto('/client/dashboard/dash');
        await page.waitForLoadState('domcontentloaded');

        await page.locator("button[routerlink*='myorders']").click();
        await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
            route => route.continue({ url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6' }))
        await page.locator("button:has-text('View')").first().click();
        await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");
    })

    test('should capture and log real API response for orders', async ({ page, request }) => {
        // Arrange: Login and inject token
        await loginAndInjectToken(request, page, TEST_USER.email, TEST_USER.password);

        // Navigate to dashboard
        await page.goto('/client/dashboard/dash');
        await page.waitForLoadState('domcontentloaded');

        // Act: Click ORDERS and capture the response
        const [response] = await Promise.all([
            page.waitForResponse(response =>
                response.url().includes('/api/ecom/order/get-orders-for-customer/') &&
                response.request().method() === 'GET'
            ),
            page.getByText('ORDERS').click()
        ]);

        // Assert: Verify response is successful
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        // Log for debugging
        console.log('Orders API Response:', {
            status: response.status(),
            url: response.url(),
            body: responseBody
        });

        // Verify response structure
        expect(responseBody).toHaveProperty('data');
        expect(responseBody).toHaveProperty('message');
    });


});
