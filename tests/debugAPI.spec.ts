import {test, expect} from '@playwright/test'

/**
 * Debug API Test - Get fresh token and test orders endpoint
 */
test('Debug Orders API', async ({request}) => {
    const email = 'sauravkmr780@gmail.com'
    const password = '@1Infosys' // Update with your actual password
    
    // Step 1: Login to get fresh token
    console.log('Step 1: Logging in to get token...')
    const loginResponse = await request.post('https://rahulshettyacademy.com/api/ecom/auth/login', {
        data: {
            userEmail: email,
            userPassword: password
        }
    })
    
    expect(loginResponse.status()).toBe(200)
    const loginData = await loginResponse.json()
    console.log('✓ Login successful')
    console.log('User ID:', loginData.userId)
    console.log('Token:', loginData.token)
    
    const token = loginData.token
    const userId = loginData.userId
    
    // Step 2: Get orders for customer
    console.log('\nStep 2: Fetching orders...')
    const ordersResponse = await request.get(
        `https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/${userId}`,
        {
            headers: {
                'Authorization': token  
            }
        }
    )
    
    console.log('Orders Response Status:', ordersResponse.status())
    console.log('Orders Response Headers:', await ordersResponse.headersArray())
    
    if (ordersResponse.ok()) {
        const ordersData = await ordersResponse.json()
        console.log('✓ Orders fetched successfully')
        console.log('Orders Data:', ordersData)
        console.log('Total Orders:', ordersData.data?.length || 0)
    } else {
        const errorBody = await ordersResponse.text()
        console.log('✗ Orders fetch failed')
        console.log('Error Response:', errorBody)
    }
})
