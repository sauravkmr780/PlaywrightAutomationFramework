import { APIRequestContext, expect, Page } from '@playwright/test';

// Constants
export const BASE_URL = 'https://rahulshettyacademy.com';
export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/api/ecom/auth/login`,
  CREATE_ORDER: `${BASE_URL}/api/ecom/order/create-order`,
  CLIENT: `${BASE_URL}/client`,
  MY_ORDERS: `${BASE_URL}/client/#/dashboard/myorders`
};

// Login and get authentication token
export async function loginToken(request: APIRequestContext , email: string, password: string) {
  const loginResponse = await request.post(API_ENDPOINTS.LOGIN, {
    data: {
      userEmail: email,
      userPassword: password
    }
  });

  expect(loginResponse.status()).toBe(200);
  const responseData = await loginResponse.json();
  expect(responseData.message).toBe('Login Successfully');
  const token = responseData.token.trim();
  console.log('✓ Authentication successful');
  return token;
}

// Create order via API
export async function orderCreation(request:APIRequestContext, token:string, country: string, productOrderedId: string) {
  const orderResponse = await request.post(API_ENDPOINTS.CREATE_ORDER, {
    data: {
      orders: [{ country, productOrderedId }]
    },
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    }
  });

  expect(orderResponse.status()).toBe(201);
  const responseData = await orderResponse.json();
  const orderID = responseData.orders[0];
  console.log(`✓ Order created with ID: ${orderID}`);
  return orderID;
}

// Inject token into browser storage
export async function injectToken(page: Page, token: string) {
  await page.addInitScript((value: string) => {
    window.localStorage.setItem('token', value);
  }, token);
}

export async function clickLoginButton(page: Page , responseCode: number) {
    const [response] = await Promise.all([
        page.waitForResponse(resp => resp.url().includes('/api/ecom/auth/login') && resp.request().method() === 'POST'),
        page.locator('#login').click()
    ]);
    expect(response.status()).toBe(responseCode);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Login Successfully');    
    return response;
}

// Login via API and inject token into browser storage
export async function loginAndInjectToken(request: APIRequestContext, page: Page, email: string, password: string): Promise<string> {
    const loginResponse = await request.post(API_ENDPOINTS.LOGIN, {
        data: {
            userEmail: email,
            userPassword: password
        }
    });

    expect(loginResponse.ok()).toBeTruthy();
    const responseData = await loginResponse.json();
    expect(responseData.message).toBe('Login Successfully');
    
    const token = responseData.token.trim();
    
    // Inject token before navigation
    await page.addInitScript((tokenValue: string) => {
        window.localStorage.setItem('token', tokenValue);
    }, token);
    
    console.log('✓ Login successful and token injected');
    return token;
}