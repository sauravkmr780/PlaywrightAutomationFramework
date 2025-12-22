import {test,expect} from '@playwright/test'

test('End to End Automation of e-commerce web application',async ({page})=>{

    const email = 'saurav.kumar@example.com'
    const password = 'Saurav@123'
    const productsToAdd = ['ADIDAS ORIGINAL','iphone 13 pro']
    
    // Login
    await page.goto('/client/#/auth/login')
    await page.getByPlaceholder('email@example.com').fill(email)
    await page.getByPlaceholder('enter your passsword').fill(password)
    await page.getByRole('button').click()
    await expect(page).toHaveURL(/.*dashboard\/dash/)
    console.log('✓ User Login Successful')
    
    // Add Products to Cart
    await page.locator('.card-body').first().waitFor()
    const productCards = page.locator('.card-body')
    
    for(let i =0; i < productsToAdd.length; i++){
        await productCards.filter({hasText: productsToAdd[i]}).getByRole('button', { name: ' Add To Cart ' }).click()
        console.log(`✓ Added ${productsToAdd[i]} to cart`)
    }
    
    // Validate Cart
    await page.getByRole('listitem').getByRole('button',{name:'Cart'}).click()
    await page.locator('.cartSection h3').first().waitFor()
    expect(await page.locator('.cartSection h3').count()).toEqual(productsToAdd.length)
    console.log('✓ Cart validated')
    
    // Checkout
    await page.getByRole('button', { name: 'Checkout' }).click()
    expect(await page.getByText('Credit Card', { exact: true }).isVisible()).toBe(true)
    await page.locator("(//input[@type='text'])[2]").fill('478')
    await page.locator("(//input[@type='text'])[3]").fill('Saurav Kumar')
    
    // Apply Coupon
    await page.locator("input[name='coupon']").fill('rahulshettyacademy')
    await page.getByRole('button', {name : 'Apply Coupon'}).click()
    await expect(page.getByText('* Coupon Applied', { exact: true })).toHaveText('* Coupon Applied')
    
    // Select Country
    await page.getByPlaceholder('Select Country').pressSequentially('Ind', { delay: 100 })
    await page.locator('section button.list-group-item').first().waitFor()
    await page.getByText('India', { exact: true }).click()
    
    // Place Order
    await page.getByText('Place Order').click()
    await expect(page.getByRole('heading', { name: 'Thankyou for the order.' })).toContainText('Thankyou for the order.')
    console.log('✓ Order placed successfully')
    
    // Capture Order IDs
    const orderIds: string[] = []
    const orderIdElements = await page.locator('.em-spacer-1 .ng-star-inserted').all()
    
    for(const element of orderIdElements){
        const text = await element.textContent()
        if(text){
            const orderId = text.split('|')[1]?.trim()
            if(orderId) {
                orderIds.push(orderId)
                console.log(`✓ Captured Order ID: ${orderId}`)
            }
        }
    }
    
    // Verify Orders
    await page.locator("button[routerlink*='myorders']").click()
    await page.locator("tbody").waitFor()
    
    for(const orderId of orderIds){
        console.log(`\n🔍 Verifying Order: ${orderId}`)
        const rows = page.locator("tbody tr")
        const rowCount = await rows.count()
        
        for(let i = 0; i < rowCount; i++){
            const rowOrderId = await rows.nth(i).locator("th").textContent()
            
            if(orderId === rowOrderId?.trim()){
                await rows.nth(i).locator('text=View').click()
                await page.locator('.col-text').waitFor()
                
                const detailsOrderId = await page.locator('.col-text').textContent()
                expect(detailsOrderId?.trim()).toBe(orderId)
                console.log(`✓ Order ${orderId} verified`)
                
                await page.goBack()
                await page.locator("tbody").waitFor()
                break
            }
        }
    }
    
    console.log('\n✅ All orders verified successfully!')
})