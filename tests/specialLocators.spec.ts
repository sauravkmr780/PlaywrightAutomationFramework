import {test,expect} from '@playwright/test'

test('Playwright Special Locators',async ({page}) =>{

    await page.goto('/angularpractice/')
    await page.getByLabel('Employed').check()
    expect(await page.getByText('Email', { exact: true }).textContent()).toBe('Email')
    await page.getByRole('checkbox').check()
    await page.getByLabel('Gender').selectOption('Female')
    await page.getByPlaceholder('Password').fill('learning')
    await page.getByRole('button', { name: 'Submit' }).click()
    const isVisible = await page.getByText('Success! The Form has been submitted successfully!.').isVisible()
    expect(isVisible).toBe(true)
    await page.getByRole('link', { name: 'Shop' }).click()
    await page.locator('app-card').filter({hasText : 'Nokia Edge'}).getByRole('button', { name: 'Add' }).click()
})