import {test,expect} from '@playwright/test'

test('End to End Automation of e-commerce web application',async ({page})=>{

    const email = 'saurav.kumar@example.com'
    const password = 'Saurav@123'
    const productsToAdd = ['ADIDAS ORIGINAL','iphone 13 pro']
    
    // Login
    await page.goto('/client/#/auth/login')
    await page.locator('#userEmail').fill(email)
    await page.locator('#userPassword').fill(password)
    await page.locator('#login').click()
    await expect(page).toHaveURL(/.*dashboard\/dash/)
    console.log('✓ User Login Successful')
    
    // Add Products to Cart
    await page.locator('.card-body').first().waitFor()
    const productCards = page.locator('.card-body')
    const productCount = await productCards.count()
    
    let addedCount = 0
    for(let i=0; i < productCount; i++){
        const productName = await productCards.nth(i).locator('h5 b').textContent()
        if(productsToAdd.includes(productName?.trim() || '')){
            await productCards.nth(i).locator('text= Add To Cart').click()
            console.log(`✓ Added ${productName} to cart`)
            addedCount++
        }
    }
    
    // Validate Cart
    await page.locator("[routerlink*='cart']").click()
    await page.locator('.cartSection h3').first().waitFor()
    expect(await page.locator('.cartSection h3').count()).toEqual(addedCount)
    console.log('✓ Cart validated')
    
    // Checkout
    await page.locator('button:has-text("Checkout")').click()
    await page.locator('div.payment__type.payment__type--cc.active:visible').click()
    await page.locator("(//input[@type='text'])[2]").fill('478')
    await page.locator("(//input[@type='text'])[3]").fill('Saurav Kumar')
    
    // Apply Coupon
    await page.locator("input[name='coupon']").fill('rahulshettyacademy')
    await page.locator("button[type='submit']").click()
    await expect(page.locator('.mt-1.ng-star-inserted')).toHaveText('* Coupon Applied')
    
    // Select Country
    await page.locator("[placeholder*='Country']").pressSequentially('Ind', { delay: 100 })
    await page.locator('section button.list-group-item').first().waitFor()
    const countries = page.locator('section button.list-group-item')
    const countryCount = await countries.count()
    
    for (let i = 0; i < countryCount; i++) {
        if (await countries.nth(i).textContent() === ' India') {
            await countries.nth(i).click()
            break
        }
    }
    
    // Place Order
    await page.getByText('Place Order').click()
    await expect(page.locator('.hero-primary')).toContainText('Thankyou for the order.')
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