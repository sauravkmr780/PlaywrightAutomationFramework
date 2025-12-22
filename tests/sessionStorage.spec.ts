import {test, expect, BrowserContext} from '@playwright/test'

// Constants
const STORAGE_STATE_PATH = 'sessionStorage.json'
const TEST_USER = {
    email: 'saurav.kumar@example.com',
    password: 'Saurav@123'
}
const PRODUCTS_TO_ADD = ['ADIDAS ORIGINAL', 'iphone 13 pro']

let webContext: BrowserContext

/**
 * Test Suite: Session Storage Management
 * Purpose: Demonstrate login once and reuse session across multiple tests
 */
test.describe('Session Storage Tests', () => {
    
    /**
     * Setup: Login once and save session state
     * This runs before all tests in this suite
     */
    test.beforeAll(async({browser}) => { 
        const context = await browser.newContext()
        const page = await context.newPage()
        
        // Perform login (uses baseURL from config)
        await page.goto('/client')
        await page.locator('#userEmail').fill(TEST_USER.email)
        await page.locator('#userPassword').fill(TEST_USER.password)
        await page.locator('#login').click()
        
        // Wait for login to complete - CRITICAL: Wait for dashboard to load
        await page.waitForURL('**/dashboard/dash', { timeout: 10000 })
        // Wait for products to appear (confirms page fully loaded and auth is set)
        await page.locator('.card-body').first().waitFor({ timeout: 10000 })
        
        // Save session state to file (includes localStorage and cookies)
        await context.storageState({path: STORAGE_STATE_PATH})
        console.log('✓ Session state saved successfully')
        
        // Create shared context with saved session state
        webContext = await browser.newContext({storageState: STORAGE_STATE_PATH})
        
        // Cleanup temporary context
        await context.close()
    })

    /**
     * Cleanup: Close shared context after all tests
     */
    test.afterAll(async() => {
        await webContext?.close()
    })

    /**
     * Test Case: Verify session state loads correctly
     */
    test('Verify logged in state from session storage', async() => {
        const page = await webContext.newPage()
        
        // Navigate to dashboard (should auto-login from session)
        await page.goto('/client/#/dashboard/dash')
        await page.locator('.card-body').first().waitFor()
        
        // Verify we're on dashboard (logged in)
        await expect(page).toHaveURL(/dashboard/)
        
        
        console.log('✓ Successfully logged in using session storage')
        
        await page.close()
    })  

    /**
     * Test Case: Add products to cart using saved session
     */
    test('Add products to cart with session storage', async() => {
        const page = await webContext.newPage()
        
        // Navigate to products page
        await page.goto('/client/#/dashboard/dash')
        
        // Wait for products to load
        await page.locator('.card-body').first().waitFor()
        const productCards = page.locator('.card-body')
        
        // Get initial cart count
        const cartCountBefore = await page.locator('[routerlink*="cart"]').textContent()
        const initialCount = parseInt(cartCountBefore?.trim() || '0')
        
        // Add specified products to cart
        let addedCount = 0
        const productCount = await productCards.count()
        
        for(let i = 0; i < productCount; i++) {
            const productName = await productCards.nth(i).locator('h5 b').textContent()
            
            if(PRODUCTS_TO_ADD.includes(productName?.trim() || '')) {
                await productCards.nth(i).locator('text= Add To Cart').click()
                console.log(`✓ Added ${productName} to cart`)
                addedCount++
                
                // Wait for cart to update
                await page.waitForTimeout(500)
                
                // Exit early if all products added
                if(addedCount === PRODUCTS_TO_ADD.length) break
            }
        }
        
        // Verify all products were added
        expect(addedCount).toBe(PRODUCTS_TO_ADD.length)
        
        // Verify cart count increased
        const cartCountAfter = await page.locator('[routerlink*="cart"]').textContent()
        const finalCount = parseInt(cartCountAfter?.trim() || '0')
        expect(finalCount).toBe(initialCount + addedCount)
        
        console.log(`✓ Total products added: ${addedCount}`)
        console.log(`✓ Cart updated: ${initialCount} → ${finalCount}`)
        
        await page.close()
    })



})  