import {test,expect} from '@playwright/test'

/**
 * Test Case: Dynamic Calendar Selection
 * 
 * Purpose: Demonstrates robust date selection in a React Calendar component
 * that supports any year (past or future) by dynamically navigating through decades
 * 
 * Key Features:
 * - Works with any year (e.g., 1900, 1993, 2050, 2100)
 * - Handles month-to-number conversion (October → 10)
 * - Validates selected date matches input field values
 * - Uses exact text matching to avoid ambiguity (3 vs 13 vs 23)
 * - Excludes inactive dates from neighboring months
 * 
 * Date Format: MM/DD/YYYY (e.g., 10/03/1992)
 */
test('Dynamic calendar selection',async ({page})=>{
    
    // ==========================================
    // STEP 1: SETUP - Open Calendar
    // ==========================================
    await page.goto('/seleniumPractise/#/offers')
    await page.locator('div.react-date-picker__inputGroup').click()

    // ==========================================
    // STEP 2: CONFIGURATION - Define Target Date
    // ==========================================
    const inputYear = '1992'
    const inputMonth = 'October'  // Full month name (required for clicking button)
    const inputDay = '3'          // Day as string (will be formatted with leading zero)
    
    // ==========================================
    // STEP 3: DATA TRANSFORMATION
    // ==========================================
    // Convert month name to numeric format with leading zero
    // Why: For consistent date format MM/DD/YYYY (e.g., 10/03/1992 not 10/3/1992)
    const monthMap: { [key: string]: string } = {
        'January': '01', 'February': '02', 'March': '03', 'April': '04',
        'May': '05', 'June': '06', 'July': '07', 'August': '08',
        'September': '09', 'October': '10', 'November': '11', 'December': '12'
    }
    const monthNumber = monthMap[inputMonth] || '01'              // October → "10"
    const formattedDay = inputDay.padStart(2, '0')                // 3 → "03"
    
    // ==========================================
    // STEP 4: NAVIGATE TO YEAR SELECTION VIEW
    // ==========================================
    // React Calendar has 3 levels: Day View → Month View → Decade View
    
    // FIRST CLICK: Navigate from Day View (shows dates 1-31) to Month View (shows Jan-Dec)
    await page.locator('button.react-calendar__navigation__label:visible').click()
    
    // SECOND CLICK: Navigate from Month View to Decade View (shows 12 years, e.g., 2020-2031)
    await page.locator('button.react-calendar__navigation__label:visible').click()
    
    // ==========================================
    // STEP 5: SMART YEAR NAVIGATION ALGORITHM
    // ==========================================
    // Problem: Calendar shows only 12 years at a time (one decade)
    // Solution: Loop through decades using arrow buttons until target year is visible
    
    const targetYear = parseInt(inputYear)  // Convert "1992" → 1992 for numeric comparison
    
    while (true) {
        // =====================================
        // 5a. CHECK IF TARGET YEAR IS VISIBLE
        // =====================================
        const yearButton = page.locator('button.react-calendar__decade-view__years__year')
                               .filter({ hasText: inputYear })
        
        if (await yearButton.count() > 0) {
            // Success! Year found in current decade view
            await yearButton.click()
            break  // Exit loop
        }
        
        // =====================================
        // 5b. DETERMINE NAVIGATION DIRECTION
        // =====================================
        // Get current decade range from navigation label
        // Example label text: "2020 – 2029" or "1990 – 2001"
        const decadeLabel = await page.locator('button.react-calendar__navigation__label').textContent()
        
        // Parse the start year from decade label
        // Example: "2020 – 2029" → split by '–' → ["2020 ", " 2029"] → take [0] → "2020 " → trim → "2020" → parseInt → 2020
        const startYear = parseInt(decadeLabel?.split('–')[0]?.trim() || '0')
        
        // =====================================
        // 5c. NAVIGATE TO CORRECT DECADE
        // =====================================
        if (targetYear < startYear) {
            // Target year is in the PAST (older than current decade)
            // Example: Looking for 1992, currently showing 2020-2029
            // Click PREVIOUS button (left arrow ◄) to go backwards
            // Navigation flow: 2020-2029 → 2010-2019 → 2000-2009 → 1990-1999 (found!)
            await page.locator('button.react-calendar__navigation__arrow.react-calendar__navigation__prev-button').click()
        } else {
            // Target year is in the FUTURE (newer than current decade)
            // Example: Looking for 2050, currently showing 2020-2029
            // Click NEXT button (right arrow ►) to go forwards
            // Navigation flow: 2020-2029 → 2030-2039 → 2040-2049 → 2050-2059 (found!)
            await page.locator('button.react-calendar__navigation__arrow.react-calendar__navigation__next-button').click()
        }
        
        // Loop continues: Check again if year is visible in new decade
    }
    
    // ==========================================
    // STEP 6: SELECT MONTH
    // ==========================================
    // After year selection, calendar automatically shows 12 months (Jan-Dec)
    // Filter all buttons by month name text and click the matching one
    await page.locator('button').filter({ hasText: inputMonth }).click()
    
    // ==========================================
    // STEP 7: SELECT DAY
    // ==========================================
    // After month selection, calendar shows all dates (1-31)
    
    // Challenge: Some dates from previous/next month are shown but grayed out
    // Solution: Use :not([class*="neighboringMonth"]) to exclude inactive dates
    
    // Find active date buttons only (exclude neighboring month dates)
    await page.locator('button.react-calendar__month-view__days__day:not([class*="neighboringMonth"])')
              // Use exact text match to avoid ambiguity
              // Problem: Day "3" matches "3", "13", "23" without exact match
              // Solution: exact: true ensures only "3" is selected
              .getByText(inputDay, { exact: true })
              .click()
              
    // ==========================================
    // STEP 8: VALIDATION - Verify Selected Date
    // ==========================================
    
    // Build expected date string in MM/DD/YYYY format
    const expectedDate = `${monthNumber}/${formattedDay}/${inputYear}`  // "10/03/1992"
    console.log(`✓ Expected date: ${expectedDate}`)
    
    // Retrieve actual values from calendar input fields
    // Note: React Calendar splits date into 3 separate input elements
    const monthValue = await page.locator('input[name="month"]').inputValue()  // Returns "10"
    const dayValue = await page.locator('input[name="day"]').inputValue()      // Returns "3" (not "03"!)
    const yearValue = await page.locator('input[name="year"]').inputValue()    // Returns "1992"
    
    // Build actual date string with leading zeros for consistency
    // Important: Input fields store day without leading zero (3), but we expect (03)
    // Use padStart(2, '0') to ensure 2-digit format for both month and day
    const actualDate = `${monthValue.padStart(2, '0')}/${dayValue.padStart(2, '0')}/${yearValue}`
    
    console.log(`✓ Actual date from input: ${actualDate}`)
    
    // Assert: Actual date matches expected date
    expect(actualDate).toBe(expectedDate)  // "10/03/1992" === "10/03/1992" ✓
})