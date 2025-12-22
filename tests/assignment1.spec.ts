import {expect, test} from '@playwright/test'

/**
 * Test Case: User Registration
 * Purpose: Verify user registration flow with all required fields
 */
test('Register user',async ({page})=>{
    // Navigate to registration page
    await page.goto('/client/#/auth/register')
    
    // Define user credentials
    const email = 'priyankakajal1157@gmail.com'
    const password = 'Priyanka@123'
    
    // Fill in registration form fields
    await page.locator('#firstName').fill('Priyanka')
    await page.locator('#lastName').fill('Singh')
    await page.locator('#userEmail').fill(email)
    await page.locator('#userMobile').fill('9876543210')
    await page.locator('#userPassword').fill(password)
    await page.locator('#confirmPassword').fill(password)
    
    // Accept terms and conditions checkbox
    await page.locator("input[type='checkbox']").click()
    
    // Submit registration form
    await page.locator('#login').click()
})

/**
 * Test Case: User Login with Network Interception
 * Purpose: Verify login flow and product listing with network route mocking
 * Tag: @smoke - Indicates this is a smoke test
 */
test('Login user', { tag: '@smoke' }, async ({page})=>{
    // Navigate to login page
    await page.goto('/client/#/auth/login')
    
    // Define user credentials
    const email = 'priyankakajal1155@gmail.com'
    const password = 'Priyanka@123'
    
    // Fill in login credentials
    await page.locator('#userEmail').fill(email)
    await page.locator('#userPassword').fill(password)
    
    // Click login button
    await page.locator('#login').click()
    
    // Intercept network call and mock the login response
    // This allows testing without actual backend authentication
    await page.route('**/auth/login', async route => {
    await route.fulfill({status: 200}) })    
    
    // Wait for page to fully load after login
    // Note: networkidle should be used cautiously - only when app becomes fully silent
    await page.waitForLoadState('networkidle')
    
    // Method 1: Print all product names at once using allTextContents()
    console.log(await page.locator('h5 b').allTextContents())
    
    // Print first product name
    console.log(await page.locator('h5 b').first().textContent())
    
    // Method 2: Print all product names individually using for loop
    const count = await page.locator('h5 b').count()
    for (let i =0 ; i< count ; i++){    
        let text = await page.locator('h5 b').nth(i).textContent()
        console.log(text)
    }
})