import {expect, test} from '@playwright/test'

/**
 * Test Suite: UI Controls Interaction
 * Purpose: Test various UI control interactions like dropdowns, radio buttons, and popups
 */
test.describe('UI Controls Test Suite', () => {
  
  /**
   * Test Case: Interact with form controls
   * Validates dropdown selection, radio button selection, and popup handling
   */
  test('UI Controls Test Case', async ({ page }) => {
    // Navigate to the login practice page
    await page.goto('/loginpagePractise/')
    
    // Select 'Consultant' option from dropdown using value attribute
    await page.locator('select.form-control').selectOption('consult')
    
    // Click the last radio button in the list using checkmark span element
    await page.locator('span.checkmark').last().click()
    // Verify that the last radio button is selected
    expect(page.locator('span.checkmark').last()).toBeChecked()
    await page.locator('span.checkmark').last().isChecked()
    // Click the 'Okay' button to accept the confirmation popup/modal
    await page.locator('#okayBtn').click()

    // Click on the 'Terms and Conditions' checkbox
    await page.locator('#terms').click()
    expect(page.locator('#terms')).toBeChecked() 
    // Uncheck the 'Terms and Conditions' checkbox
    await page.locator('#terms').uncheck()
    expect(page.locator('#terms')).not.toBeChecked()

    // Validate blinking text class present on UI
    const isBlinking = await page.locator('.blinkingText')
    await page.locator('.blinkingText').isVisible()
    console.log(await page.locator('.blinkingText').isVisible())
    expect(isBlinking).toHaveClass(/blinkingText/)
    expect(isBlinking).toHaveAttribute('class', 'blinkingText')
  })

  /**
   * Test Case: Child Window (Popup) Handling
   * Demonstrates handling of new browser windows/tabs and extracting data from them
   * 
   * BEST PRACTICE: Use page.context() to access the browser context
   * - No need for browser fixture unless managing multiple independent contexts
   * - Set up event listener BEFORE triggering action to prevent race conditions
   * 
   * HANDLING MULTIPLE LEVELS OF WINDOWS:
   * 
   * // Open child page from main page
   * const [childPage] = await Promise.all([
   *   page.context().waitForEvent('page'),
   *   page.locator('.open-child').click()
   * ])
   * 
   * // Open sub-child page from child page
   * const [subChildPage] = await Promise.all([
   *   childPage.context().waitForEvent('page'),
   *   childPage.locator('.open-subchild').click()
   * ])
   * 
   * // Extract data from sub-child
   * const data = await subChildPage.locator('.data').textContent()
   * 
   * // Use data in child page
   * await childPage.locator('#input').fill(data)
   * 
   * // Close windows in reverse order (sub-child -> child -> main)
   * await subChildPage.close()
   * await childPage.close()
   */
  test('Child windows handling', async ({ page }) => {
    await page.goto('/loginpagePractise/')
    
    // Set up listener BEFORE clicking to capture the new page
    const [childPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.locator('.blinkingText').click()
    ])
    
    // Extract email from child window using regex for cleaner extraction
    const text = await childPage.locator('p.im-para.red').textContent()
    const email = text?.match(/mentor@\S+/)?.[0] || ''
    
    console.log('✓ Extracted email:', email)
    
    // Use extracted email in parent page
    await page.locator('#username').fill(email)
    expect(await page.locator('#username').inputValue()).toBe(email)
    
    await childPage.close()
  })
}) 