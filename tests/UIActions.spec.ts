import {test,expect} from '@playwright/test'

test('UI Actions like hidden button check',async ({page})=>{
    // Log all requests and responses
    page.on('request',request => console.log(request.url()))
    page.on('response',response => console.log(response.url(), response.status()))
    await page.goto('/AutomationPractice/')
    await page.goto('https://www.google.com/')
    await page.goBack()
    await page.goForward()
    await page.goBack()
    await expect(page.getByPlaceholder('Hide/Show Example')).toBeVisible()
    await page.locator('#hide-textbox').click()
    await expect( page.getByPlaceholder('Hide/Show Example')).toBeHidden()
    await page.locator('#show-textbox').click()
    await expect( page.getByPlaceholder('Hide/Show Example')).toBeVisible()

})

test('UI Controls like alerts', async ({ page }) => {
    await page.goto('/AutomationPractice/')
    
    // Set up unified dialog handler for both Alert and Confirm dialogs
    // This handler will be triggered automatically when any dialog appears
    page.on('dialog', async (dialog) => {
        const message = dialog.message()
        const type = dialog.type() // 'alert' or 'confirm'
        
        console.log(`${type.toUpperCase()} message: ${message}`)
        
        // Validate message content
        if (type === 'alert') {
            expect(message).toContain('Hello')
            // Accept the dialog (OK button)
            await dialog.accept()
        } else if (type === 'confirm') {
            expect(message).toContain('Saurav')
            // Use dialog.dismiss() for Cancel button
            await dialog.dismiss()
        }        
    })
    
    // Test 1: Simple Alert Dialog
    await page.locator('#alertbtn').click()
    
    // Test 2: Confirm Dialog (with input)
    await page.getByPlaceholder('Enter Your Name').fill('Saurav')
    await page.locator('#confirmbtn').click()
})

test('UI Hover elements', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/')
    await page.getByRole('button', { name: 'Mouse Hover' }).scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Mouse Hover' }).hover() 
    await page.getByText('Top').click();
    const url = page.url();
    console.log(url);
    expect(url).toContain('#top');

})

test('IFrame handling', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/')
    const framesPage = page.frameLocator('iframe#courses-iframe')
    await framesPage.getByText('Practice' ).first().click()
    console.log(await framesPage.locator('h1').textContent())
    const headerText = await framesPage.locator('h1').textContent()
    expect(headerText).toBe('Master QA Testing Through Practice')
})