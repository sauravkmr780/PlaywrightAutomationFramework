import { test, expect } from '@playwright/test';
import * as path from 'path';
import { updateExcelFile, readExcelData } from './utils/excel-upload-download';

test('File Upload and Download Test', async ({ page }) => {
    // Step 1: Navigate to the upload/download page
    await page.goto('/upload-download-test/index.html');

    // Step 2: Download the Excel file
    const downloadPath = path.join(__dirname, '../downloads/export.xlsx');
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByText('Download').click()
    ]);
    await download.saveAs(downloadPath);
    console.log('✓ File downloaded successfully');

    // Step 3: Read the downloaded Excel file
    const sheetName = 'Sheet1';
    const initialData = await readExcelData(downloadPath, sheetName);
    console.log('Initial Data:', initialData);

    // Step 4: Update a specific cell (e.g., B2) with new value
    const newValue = 'Strawberry';
    await updateExcelFile(downloadPath, sheetName, 'B2', newValue);
    console.log(`✓ Updated cell B2 to "${newValue}"`);

    // Step 5: Read data again to verify the update
    const updatedData = await readExcelData(downloadPath, sheetName);
    console.log('Updated Data:', updatedData);

    // Step 6: Upload the modified file back
    await page.setInputFiles('input[type="file"]', downloadPath);
    console.log('✓ File uploaded successfully');

    // Optional: Wait for upload confirmation or verify upload success
    await page.waitForLoadState('domcontentloaded');
    // Verify the updated value in the first data row (row-0)
    const text = await page.locator("div[id='row-0'] div[id='cell-2-undefined']").textContent();
    expect(text).toBe(newValue);
})