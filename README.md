# Playwright Automation Framework

A comprehensive test automation framework built with Playwright and TypeScript for end-to-end testing of web applications.

## 📋 Table of Contents

- [Why Playwright?](#why-playwright)
- [Advanced Features](#advanced-features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Debugging](#debugging)
- [Reporting](#reporting)
- [Best Practices](#best-practices)
- [CI/CD Setup](#cicd-setup)

## 🎯 Why Playwright?

### Reliable End-to-End Testing
- **Auto-wait functionality**: Automatically waits for elements to be visible, stable, enabled, and ready to receive events before performing actions
- Eliminates flaky tests caused by timing issues

### Cross-Browser Compatibility
- ✅ Chrome
- ✅ Firefox
- ✅ Edge
- ✅ Opera
- ✅ Safari (WebKit)

### Multi-Platform Support
- 🪟 Windows
- 🐧 Linux
- 🍎 macOS
- 📱 Native mobile simulation (Chrome on Android & Safari on iOS)

### Multi-Language Flexibility
- JavaScript
- **TypeScript** ⭐ (Recommended)
- Python
- Java
- C#/.NET

## 🚀 Advanced Features

### Tracing and Debugging
- Test runner records each step with source code, screenshots, and videos
- Playwright Inspector for step-by-step debugging
- Trace viewer at [trace.playwright.dev](https://trace.playwright.dev/)

### Network Interception
- Mock API network calls
- Test edge case scenarios
- Modify requests and responses

### Browser Context Management
- Inject cookies and storage state
- Bypass login for faster test execution
- Reduce test execution time

### Codegen Tool
- Record and playback for quick smoke testing
- Auto-generate Playwright code

## 📊 Why TypeScript over JavaScript?

| Feature                          | JavaScript             | TypeScript           |
| -------------------------------- | ---------------------- | -------------------- |
| Typing                           | ❌ Dynamic              | ✅ Static             |
| Error detection                  | Runtime                | Compile time         |
| IDE autocomplete                 | Basic                  | Excellent            |
| Refactoring safety               | ❌ Risky                | ✅ Safe               |
| Code readability                 | Medium                 | High                 |
| Scalability                      | ❌ Poor for large teams | ✅ Designed for teams |
| Learning curve                   | Easy                   | Slightly higher      |
| Bugs in large projects           | More                   | Fewer                |
| Self-documenting                 | ❌ No                   | ✅ Yes                |
| Industry adoption (new projects) | Declining              | 🚀 Standard          |
| Playwright support               | Supported              | ⭐ Best experience    |

## 🛠️ Prerequisites

### Node.js Installation

After installing Node.js, add to system PATH:
```
NODE_HOME = C:\Program Files\node-v24.11.1-win-x64\node-v24.11.1-win-x64\node.exe
```

Verify installation:
```bash
where.exe node
where.exe npm
node -v
npm -v
```

## 📦 Installation

Initialize Playwright project:
```bash
npm init playwright@latest
```

During initialization:
- Select language: **TypeScript**
- Browser selection: Chromium, Firefox, WebKit

Install dependencies:
```bash
npm install
```

## 📁 Project Structure

```
PlaywrightAutomationFramework/
├── tests/
│   ├── UIBasicstest.spec.ts           # Basic UI interaction tests
│   ├── UIcontrols.spec.ts             # Dropdown, radio, checkbox tests
│   ├── UIActions.spec.ts              # Mouse hover, frames, popups
│   ├── specialLocators.spec.ts        # Playwright special locators
│   ├── dynamicCalendar.spec.ts        # Dynamic calendar handling
│   ├── assignment1.spec.ts            # Practice assignments
│   ├── E2EAssignment.spec.ts          # End-to-end test flow
│   ├── NetworkIntecept.spec.ts        # API mocking & interception
│   ├── sessionStorage.spec.ts         # Session management
│   ├── apiTest.spec.ts                # API testing
│   ├── upload-download.spec.ts        # File upload/download
│   ├── utils/
│   │   ├── apiHelpers.ts              # API utility functions
│   │   └── excel-upload-download.ts   # Excel handling utilities
│   └── objectRepository/
│       └── login.json                 # Page object selectors
├── downloads/                          # Downloaded files
├── allure-results/                     # Allure test results
├── allure-report/                      # Generated Allure reports
├── playwright-report/                  # HTML test reports
├── test-results/                       # Test execution artifacts
├── playwright.config.ts                # Default Playwright config
├── playwright.config1.ts               # Alternative config (Firefox)
├── tsconfig.json                       # TypeScript configuration
├── package.json                        # Dependencies & scripts
└── .gitignore                          # Git ignore rules
```

## 🧪 Playwright Fixtures

Default fixtures available in Playwright:

| Fixture       | Purpose                            |
| ------------- | ---------------------------------- |
| `page`        | Browser tab                        |
| `browser`     | Browser instance                   |
| `context`     | Browser context (cookies, storage) |
| `request`     | API testing                        |
| `browserName` | chromium / firefox / webkit        |
| `baseURL`     | Configured base URL                |

## 🏃 Running Tests

### Using Test Runner (UI Mode)
```bash
npx playwright test --ui
```

### Command Line
```bash
# Run all tests
npm run test

# Run with headed browser
npm run test:headed

# Run in debug mode
npm run test:debug

# Run smoke tests only
npm run test:smoke

# Run specific test file
npx playwright test upload-download.spec.ts

# Run with specific config
npx playwright test --ui -c playwright.config1.ts

# Run by tag
npx playwright test --grep "@smoke"
```

### Package.json Scripts
```json
{
  "test": "npx playwright test",
  "test:watch": "npx playwright test --ui",
  "test:headed": "npx playwright test --headed",
  "test:debug": "npx playwright test --debug",
  "test:smoke": "npx playwright test --grep \"@smoke\"",
  "test:smoke:report": "npm run test:smoke && npm run report:allure:generate && npm run report:allure:open",
  "report:html": "npx playwright show-report",
  "report:allure": "npx allure generate allure-results -o allure-report && npx allure open allure-report",
  "report:allure:generate": "npx allure generate allure-results -o allure-report",
  "report:allure:open": "npx allure open allure-report",
  "report:clean": "Remove-Item -Recurse -Force allure-report,allure-results,playwright-report,test-results -ErrorAction SilentlyContinue"
}
```

## 🐛 Debugging

### Playwright Inspector
```bash
npx playwright test --debug
npx playwright test UIcontrols.spec.ts --debug
```

**What You Can Do:**
- ✔ Step-by-step execution (play, pause, step over, step into)
- ✔ Live selectors with auto-generated code
- ✔ Codegen integration for recording actions

### Codegen (Record & Playback)
```bash
npx playwright codegen
npx playwright codegen https://rahulshettyacademy.com
```

### Debug API Tests
- Set breakpoint in VS Code
- Search "Debug npm script" in VS Code command palette
- Use trace viewer for API debugging

## 📊 Reporting

### HTML Report (Built-in)
```bash
# Generate report automatically after test run
npx playwright test

# Open last HTML report
npm run report:html
```

### Allure Reports

**Installation:**
```bash
npm install -D allure-playwright
```

**Configuration in `playwright.config.ts`:**
```typescript
reporter: [
  ['line'],
  ['allure-playwright', {
    detail: true,
    outputFolder: 'allure-results',
    suiteTitle: false
  }],
  ['html']
]
```

**Generate & View Reports:**
```bash
# Run tests
npm run test:smoke

# Generate Allure report
npm run report:allure:generate

# Open Allure report
npm run report:allure:open

# All in one
npm run test:smoke:report
```

**PowerShell One-liner:**
```powershell
npx playwright test --grep "@smoke" ; Remove-Item -Recurse -Force allure-report -ErrorAction SilentlyContinue ; npx allure generate allure-results -o allure-report ; npx allure open allure-report
```

### Trace Viewer
View detailed traces at: [trace.playwright.dev](https://trace.playwright.dev/)

Upload the trace file from `test-results/` folder.

## ✅ Best Practices

### Modern QA Testing Strategy

#### 1. UI Automation

| Action Type              | Validation      | Approach                                                 |
| ------------------------ | --------------- | -------------------------------------------------------- |
| Read-only / View         | UI ↔ API        | Verify displayed data matches API; no DB check needed    |
| Write / Create / Update  | UI ↔ API + DB   | Ensure UI triggers correct API and data persists in DB   |

#### 2. API Automation

| Action Type   | Validation | Approach                                                |
| ------------- | ---------- | ------------------------------------------------------- |
| All API calls | API ↔ DB   | Always validate response against DB as source of truth  |

**Key Principles:**
- UI tests focus on **behavior**
- For read-only flows, validate against API
- For data-changing flows, add DB validation selectively
- API tests are the single source of truth for backend correctness
- Avoid querying DB for every UI read operation (causes flakiness)

### Playwright Concepts

#### Auto-Wait
- ✅ `textContent()` has auto-wait
- ❌ `allTextContents()` does NOT have auto-wait

#### Wait Strategies
```typescript
// ❌ Avoid this (unless you know your app becomes fully silent)
await page.waitForLoadState('networkidle')

// ✅ Prefer waiting for specific elements
await page.locator('.product-list').waitFor()

// ✅ Or wait for specific API calls
await page.waitForResponse(resp => resp.url().includes('/api/products'))
```

#### Network Operations Cheat Sheet

**`page.route()` - Mock/Modify Responses**
```typescript
await page.route('**/api/orders/**', async route => {
  await route.fulfill({
    status: 200,
    body: JSON.stringify({ data: [], message: 'No Orders' })
  })
})
```
**Use when:** Testing edge cases, avoiding API dependencies, controlling browser responses

**`page.waitForResponse()` - Capture Real Responses**
```typescript
const response = await page.waitForResponse(res => 
  res.url().includes('/api/orders')
)
const data = await response.json()
```
**Use when:** Logging/inspecting real responses, extracting data, validation

**`request.get()` - Direct API Calls**
```typescript
const response = await request.get('/api/orders', {
  headers: { 'Authorization': token }
})
```
**Use when:** API login, setup test data, cleanup, bypassing UI

**`route.fulfill()` vs `route.continue()`**
- `fulfill()` - Modify response
- `continue()` - Modify request

#### Selectors Best Practices
```typescript
// ✅ Prefer role-based selectors
await page.getByRole('button', { name: 'Submit' })

// ✅ Text content
await page.getByText('Login')

// ✅ Label
await page.getByLabel('Email')

// CSS selectors (last resort)
await page.locator('div[id="row-0"]')
```

#### Element Content Retrieval
- `textContent()` → For `<div>`, `<p>`, `<span>` (text between tags)
- `inputValue()` → For `<input>`, `<textarea>` (form field values)

#### Dropdown Selection
```typescript
// By value
await page.locator('#dropdown').selectOption('consult')

// By label (visible text)
await page.locator('#dropdown').selectOption({ label: 'Consultant' })

// By index
await page.locator('#dropdown').selectOption({ index: 2 })
```

#### File Operations
```typescript
// Upload
await page.setInputFiles('#uploadExcel', 'tests/data/users.xlsx')

// Download
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.click('#exportExcel')
])
await download.saveAs('downloads/export.xlsx')
```

#### Keyboard Actions
```typescript
// Hit Enter
await page.getByText('Submit').press('Enter')

// Keyboard shortcuts
await page.getByRole('textbox').press('Control+ArrowRight')

// Type sequentially
await page.locator('#area').pressSequentially('Hello World!')
```

#### Screenshots
```typescript
await page.screenshot({ path: 'google_homepage.png' })
```

### Configuration Options

#### playwright.config.ts
```typescript
export default defineConfig({
  testDir: './tests',
  timeout: 30000,           // Default: 30 seconds per test
  expect: { timeout: 5000 }, // Default: 5 seconds for assertions
  retries: 1,               // Retry failed tests once
  workers: 3,               // Run 3 test files in parallel
  
  use: {
    baseURL: 'https://rahulshettyacademy.com',
    browserName: 'chromium',
    headless: false,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    viewport: null,         // Fullscreen
    launchOptions: {
      args: ['--start-maximized']
    },
    acceptDownloads: true,
    ignoreHTTPSErrors: true,
    permissions: ['geolocation'],
  }
})
```

#### Mobile Simulation
```typescript
import { devices } from '@playwright/test'

use: {
  ...devices['iPhone 11']
}
```

### Parallel & Serial Execution

**Default:** Playwright runs tests in parallel (5 workers)

**Test Suite Level:**
```typescript
// Parallel execution
test.describe.configure({ mode: 'parallel' })

// Serial execution (if one fails, rest skip)
test.describe.configure({ mode: 'serial' })
```

### Session Management (Bypass Login)
```typescript
// Login once and save session
const context = await browser.newContext()
await context.storageState({ path: 'sessionStorage.json' })

// Reuse session in other tests
const context = await browser.newContext({ 
  storageState: 'sessionStorage.json' 
})
```

## 📝 E2E Test Example Flow

1. Register user
2. Login with registered email
3. Select 2 products dynamically and add to cart
4. Click Cart
5. Validate selected items in cart
6. Click Checkout
7. Verify items on checkout page
8. Enter credit card details
9. Validate email used during login
10. Select country (India) dynamically
11. Apply coupon `rahulshettyacademy`
12. Validate coupon applied
13. Click Place Order
14. Validate "THANKYOUFORTHEORDER" message
15. Capture order ID
16. Navigate to Order History
17. Click View
18. Validate email, order ID, country, product name

## 🔧 CI/CD Setup

### Jenkins Configuration

**Installation:**
```bash
java -jar jenkins.war --httpPort=8080 --enable-future-java
```

**Access:** http://localhost:8080/

**Credentials:**
- Username: `sauravkmr780`
- Password: `@1Infosys`

**Jenkins Job Setup:**
1. Click "New Item" → Enter name: `PlaywrightFramework`
2. Choose "Freestyle project"
3. Configure:
   - **Custom Workspace:** `C:/Users/Saura/Desktop/PlaywrightAutomation/PlaywrightAutomationFramework`
   - **Build Step:** Execute shell
   ```bash
   npm run test:smoke
   ```
4. Click "Save"
5. Click "Build Now"

**Parameterized Build:**
Add parameter `Script` with values:
- `smoke`
- `sanity`
- `regression`

Build command:
```bash
npm run "$Script"
```

## 🎓 Additional Notes

### Version Control
- Always commit `package-lock.json` when `package.json` changes
- Use `.gitignore` to exclude `node_modules/`, `test-results/`, `downloads/`, etc.

### TypeScript
- Use optional chaining with fallback values: `user?.name ?? 'Unknown'`
- Leverage TypeScript's compile-time error detection

### Async/Await
- `async` and `await` work together
- If one is missing, code becomes asynchronous unexpectedly

### CSS Selectors
- Playwright supports **only CSS selectors**
- No XPath support (by design)

### Browser Names
- Safari in Playwright = `webkit`

### Monitoring Network
```typescript
page.on('request', request => console.log(request.url()))
page.on('response', response => console.log(response.url(), response.status()))
```

### Block Images (Performance)
```typescript
await page.route('**/*.{png,jpg,jpeg,svg,gif}', route => route.abort())
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Saurav Kumar**
- GitHub: [@sauravkmr780](https://github.com/sauravkmr780)
- Repository: [PlaywrightAutomationFramework](https://github.com/sauravkmr780/PlaywrightAutomationFramework)

## 🙏 Acknowledgments

- [Playwright Documentation](https://playwright.dev/)
- [Rahul Shetty Academy](https://rahulshettyacademy.com/)

---

**Happy Testing! 🚀**

### UIcontrols.spec.ts
- Dropdown selection
- Radio button interaction
- Alert/popup handling

## ⚙️ Configuration

The framework is configured in `playwright.config.ts`:
- **Test Directory**: `./tests`
- **Browser**: Chromium
- **Headless Mode**: Disabled (visible browser)
- **Reporter**: HTML report

## 🏃 Running Tests

Run all tests:
```bash
npx playwright test
```

Run specific test file:
```bash
npx playwright test tests/UIBasicstest.spec.ts
```

Run tests in headed mode:
```bash
npx playwright test --headed
```

Run only tests with `.only`:
```bash
npx playwright test
```

## 📊 View Test Reports

After test execution, view the HTML report:
```bash
npx playwright show-report
```

## 🔍 Key Features

- **TypeScript Support**: Strongly typed test scripts
- **Multiple Locator Strategies**: CSS, XPath, text-based selectors
- **Assertions**: Built-in expect assertions
- **Error Handling**: Validation of error messages and UI states
- **Element Interactions**: Click, fill, select, clear operations
- **Dynamic Content**: Handling of dynamically displayed elements
- **HTML Reporting**: Detailed test execution reports

## 📝 Test Scenarios Covered

1. **Authentication**
   - Invalid login validation
   - Successful login flow
   
2. **Form Controls**
   - Dropdown selection
   - Radio button selection
   - Text input clearing and filling

3. **Element Handling**
   - Finding elements by various selectors
   - Dynamic element visibility
   - List iteration and validation

## 🛠️ Technologies Used

- **Playwright**: ^1.57.0
- **TypeScript**: Type definitions via @types/node
- **Node.js**: Runtime environment

## 👤 Author

Saurav Kumar

## 🔗 Repository

[GitHub Repository](https://github.com/sauravkmr780/PlaywrightAutomationFramework)


