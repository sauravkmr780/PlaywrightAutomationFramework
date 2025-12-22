import {expect, test} from '@playwright/test'
import { clickLoginButton } from './utils/apiHelpers'
import loginPage from './objectRepository/login.json'
/**
 * Test Case: Login validation with negative and positive scenarios
 * Purpose: Verify error message on invalid login and successful login with correct credentials
 */
test('First Playwright Test',async ({page})=>{
    // Navigate to the login page
    await page.goto('/loginpagePractise/')
    
    // Enter invalid credentials
    await page.locator(loginPage.username).fill('rahulshetty')
    await page.locator(loginPage.password).fill('learning')
    
    // Click sign in button
    await page.locator(loginPage.signInButton).click()
    
    // Capture and verify error message for invalid credentials
    console.log(await page.locator("[style*='block']").textContent())
    const errorMessage = await page.locator("[style*='block']").textContent()
    expect(errorMessage).toEqual('Incorrect username/password.')
    
    // Clear username field using clear() method
    await page.locator(loginPage.username).clear()
    
    // Clear password field using fill("") method - alternative approach
    await page.locator(loginPage.password).fill("")
    
    // Enter valid credentials
    await page.locator(loginPage.username).fill('rahulshettyacademy')
    await page.locator(loginPage.password).fill('learning')
    
    // Click sign in button with valid credentials
    await page.locator(loginPage.signInButton).click()
    
    // Access product elements using different locator methods
    console.log(await page.locator('h4 a').nth(0).textContent()) // Access by index
    console.log(await page.locator('h4 a').first().textContent()) // Access first element
    console.log(await page.locator('h4 a').nth(1).textContent()) // Access second element
    
    // Verify first product name
    expect(await page.locator('h4 a').first().textContent()).toEqual('iphone X')
    
    // Method 1: Print all product names using for loop with nth()
    const count = await page.locator('h4 a').count()
    for (let i =0 ; i< count ; i++){
        let text = await page.locator('h4 a').nth(i).textContent()
        console.log(text)
    }
    
    // Method 2: Print all product names using allTextContents() - More efficient
    const elements = await page.locator('h4 a').allTextContents()
    for (const el of elements){
        console.log(el)
    }
})

/**
 * Test Case: Verify page title
 * Purpose: Navigate to Google and validate the page title
 */
test('Second Playwright Test',async ({page})=>{
    // Navigate to Google homepage
    await page.goto('https://www.google.com/')
    
    // Get page title
    const title = await page.title()
    console.log(title)
    
    // Verify page title matches expected value
    expect(title).toEqual('Google')
    // To take screenshot
    await page.screenshot({ path: 'google_homepage.png' })
})

test('Third Playwright Test',async ({page})=>{
    // Navigate to the e-commerce login page (correct page that uses the API)
    await page.goto('/client/#/auth/login')
    
    // Enter credentials
    await page.locator('#userEmail').fill('sauravkmr780@gmail.com')
    await page.locator('#userPassword').fill('@1Infosys')
    
    // Use helper function to mock API and verify response (status 200)
    const response = await clickLoginButton(page, 200);
    
    // Verify response body
    const responseBody = await response.json();
    console.log('✓ Mocked API response body:', responseBody);
})