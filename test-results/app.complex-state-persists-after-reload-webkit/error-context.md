# Test info

- Name: state persists after reload
- Location: D:\Projects\playwrightFrameworkGenerator\tests\app.complex.test.ts:81:1

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveValue(expected)

Locator: getByTestId('project-name-input')
Expected string: "PersistentProject"
Received string: ""
Call log:
  - expect.toHaveValue with timeout 5000ms
  - waiting for getByTestId('project-name-input')
    4 × locator resolved to <input type="text" id="project-name" name="project-name" data-testid="project-name-input" placeholder="Enter your project name" class="w-full border rounded px-3 py-2 text-base"/>
      - unexpected value ""

    at D:\Projects\playwrightFrameworkGenerator\tests\app.complex.test.ts:85:56
```

# Page snapshot

```yaml
- banner:
  - heading "Playwright Framework Generator" [level=1]
  - text: v1.3.0
  - link "Download Manual (PDF)":
    - /url: ./USER_MANUAL.pdf
  - paragraph: Configure and generate a complete Playwright test automation framework with modern testing practices
  - 'button "Current theme: system"'
- main:
  - text: Project Name *
  - textbox "Project Name *"
  - text: Programming Language
  - radiogroup:
    - radio "TypeScript Recommended Recommended for type safety and modern development" [checked]
    - text: TypeScript Recommended Recommended for type safety and modern development
    - radio "JavaScript Classic JavaScript for simpler setup"
    - text: JavaScript Classic JavaScript for simpler setup
  - text: Browser Selection
  - button "All" [disabled]
  - button "None"
  - text: Select which browsers to include in your Playwright configuration. This affects test execution, CI pipelines, and generated examples.
  - checkbox "Chromium Google Chrome, Microsoft Edge, and other Chromium-based browsers" [checked]
  - text: Chromium Google Chrome, Microsoft Edge, and other Chromium-based browsers
  - checkbox "Firefox Mozilla Firefox browser with Gecko engine" [checked]
  - text: Firefox Mozilla Firefox browser with Gecko engine
  - checkbox "Safari (WebKit) Safari browser and WebKit engine (mobile Safari on iOS)" [checked]
  - text: Safari (WebKit) Safari browser and WebKit engine (mobile Safari on iOS) Testing Capabilities Select the testing capabilities to include in your framework. UI Testing and API Testing.
  - checkbox "E2E Testing End-to-end browser automation and scenario testing"
  - text: E2E Testing End-to-end browser automation and scenario testing
  - checkbox "API Testing REST and GraphQL endpoint testing with request validation and response verification" [checked]
  - text: API Testing REST and GraphQL endpoint testing with request validation and response verification
  - checkbox "Visual Testing Visual regression and screenshot comparison"
  - text: Visual Testing Visual regression and screenshot comparison
  - heading "Included Utilities:" [level=4]
  - text: Playwright Browser Automation Visual Testing Utilities Page Object Model Helpers Cross-browser Test Runner REST API Test Helpers GraphQL Testing Utilities Request/Response Validators API Mocking Tools Integrations & Extensions
  - paragraph: GitHub Actions CI/CD and Faker Library
  - text: GitHub Actions CI/CD workflow automation playwright-tests
  - switch "GitHub Actions CI/CD workflow automation" [checked]
  - button "Advanced Settings"
  - text: Allure Reporter Rich test reporting and analytics
  - switch "Allure Reporter Rich test reporting and analytics"
  - text: Cucumber Integration BDD test scenarios and Gherkin support
  - switch "Cucumber Integration BDD test scenarios and Gherkin support"
  - text: Faker Library Test data generation and mocking EN
  - switch "Faker Library Test data generation and mocking" [checked]
  - button "Data Types & Locale"
  - text: Test Fixtures & Data Management Page Objects, Setup/Teardown, Authentication with each test gets its own isolated copy of test data
  - tablist:
    - tab "Patterns" [selected]
    - tab "Data"
    - tab "Auth"
    - tab "Settings"
  - text: "Quick Presets:"
  - button "Minimal"
  - button "Standard"
  - button "Comprehensive"
  - tabpanel "Patterns":
    - text: Page Object Patterns
    - button "Enable All"
    - button "Disable All"
    - checkbox "Base Page Class Abstract base class with common page functionality" [checked]
    - text: Base Page Class Abstract base class with common page functionality
    - checkbox "Component Page Objects Modular page objects for reusable UI components" [checked]
    - text: Component Page Objects Modular page objects for reusable UI components
    - checkbox "Fluent Interface Pattern Chainable methods for readable test flows"
    - text: Fluent Interface Pattern Chainable methods for readable test flows
    - checkbox "Page Factory Pattern Automatic page object instantiation and injection"
    - text: Page Factory Pattern Automatic page object instantiation and injection Setup & Teardown Patterns
    - button "Enable All"
    - button "Disable All"
    - checkbox "Global Setup/Teardown global One-time setup before all tests and cleanup after" [checked]
    - text: Global Setup/Teardown global One-time setup before all tests and cleanup after
    - checkbox "Test Isolation test Clean browser state between each test" [checked]
    - text: Test Isolation test Clean browser state between each test
    - checkbox "Data Cleanup test Automatic cleanup of test-created data" [checked]
    - text: Data Cleanup test Automatic cleanup of test-created data
    - checkbox "Browser State Reset test Clear cookies, storage, and cache between tests"
    - text: Browser State Reset test Clear cookies, storage, and cache between tests
    - checkbox "Parallel-Safe Hooks describe Setup/teardown patterns that work with parallel execution"
    - text: Parallel-Safe Hooks describe Setup/teardown patterns that work with parallel execution
  - text: Environment Settings Configure multiple testing environments with custom settings. 3 environments configured (development selected).
  - tablist:
    - tab "Environments" [selected]
    - tab "Configuration"
  - tabpanel "Environments":
    - heading "Available Environments" [level=3]
    - button "Reset"
    - button "Add Environment"
    - heading "development" [level=4]
    - text: Selected http://localhost:3000 30000ms 1 retries Headed only-on-failure retain-on-failure
    - checkbox "select-environment-development" [checked]
    - text: Select
    - button
    - button:
      - button
    - heading "staging" [level=4]
    - text: https://staging.example.com 30000ms 2 retries Headless only-on-failure retain-on-failure
    - checkbox "select-environment-staging"
    - text: Select
    - button
    - button:
      - button
    - heading "production" [level=4]
    - text: https://example.com 60000ms 3 retries Headless only-on-failure off
    - checkbox "select-environment-production"
    - text: Select
    - button
    - button:
      - button
  - text: Code Quality & Standards
  - button "Reset"
  - tablist:
    - tab "Tools" [selected]
    - tab "Prettier"
    - tab "TypeScript"
  - tabpanel "Tools":
    - text: ESLint Code linting and error detection
    - switch "ESLint Code linting and error detection" [checked]
    - text: ESLint Configuration
    - combobox: Recommended Standard ESLint rules for most projects
    - text: "Plugins: @typescript-eslint, @playwright/recommended Prettier Code formatting and styling"
    - switch "Prettier Code formatting and styling" [checked]
    - text: Prettier Configuration
    - combobox: Default Standard Prettier formatting
    - text: TypeScript Strict Mode Enhanced type checking and validation
    - switch "TypeScript Strict Mode Enhanced type checking and validation" [checked]
    - text: TypeScript Target
    - combobox: ES2022 Latest stable features (recommended)
  - text: CI/CD Pipeline Configuration
  - paragraph: 1 workflow with push, PR, manual
  - text: Enabled
  - switch [checked]
  - text: Workflows
  - paragraph: Manage your CI/CD workflow configurations
  - button
  - button
  - heading "Playwright Tests" [level=4]
  - text: "Complexity: 4/10"
  - paragraph: Main CI pipeline for running Playwright tests
  - button
  - text: Workflow Details Name
  - textbox "Name": Playwright Tests
  - text: Description
  - textbox "Description": Main CI pipeline for running Playwright tests
  - tablist:
    - tab "Triggers" [selected]
    - tab "Execution"
    - tab "Environment"
    - tab "Reporting"
    - tab "Artifacts"
    - tab "Notifications"
    - tab "Security"
    - tab "Global"
  - tabpanel "Triggers":
    - heading "Trigger Configuration" [level=3]
    - paragraph: Configure when your workflow should run
    - text: 3 triggers enabled Push Events
    - switch [checked]
    - text: Branches
    - textbox "Branches": main, master
    - paragraph: Comma-separated list of branches to trigger on
    - text: Paths (Optional)
    - textbox "Paths (Optional)"
    - paragraph: Only trigger when these paths change
    - text: Ignore Paths (Optional)
    - textbox "Ignore Paths (Optional)": "*.md, docs/**"
    - paragraph: Don't trigger when only these paths change
    - text: Pull Request Events
    - switch [checked]
    - text: Target Branches
    - textbox "Target Branches": main, master
    - paragraph: Trigger when PRs target these branches
    - text: PR Event Types
    - checkbox "Opened" [checked]
    - text: Opened
    - checkbox "Updated" [checked]
    - text: Updated
    - checkbox "Reopened" [checked]
    - text: Reopened
    - checkbox "Closed"
    - text: Closed
    - checkbox "Ready for Review"
    - text: Ready for Review Scheduled Runs
    - switch
    - text: Manual Dispatch
    - switch [checked]
    - paragraph: Allows manual triggering of the workflow from the GitHub Actions UI. Includes 1 input parameter.
    - text: Release Events
    - switch
  - text: Recommendations
  - paragraph: Consider testing on multiple operating systems for broader compatibility
  - text: Docker Configuration Enable Docker Support Containerized test execution
  - switch "Enable Docker Support Containerized test execution"
  - text: Example Tests & Usage Patterns
  - button "UI Test Examples 5 examples" [expanded]
  - heading "Login Flow Test" [level=4]
  - paragraph: Example of login form testing with assertions
  - text: tests/login.spec.ts
  - code: "test('user can login successfully', async ({ page }) => { await page.goto('/login'); await page.fill('[data-testid=\"email\"]', 'user@example.com'); await page.fill('[data-testid=\"password\"]', 'password123'); await page.click('[data-testid=\"login-button\"]'); await expect(page).toHaveURL('/dashboard'); });"
  - heading "Form Validation Test" [level=4]
  - paragraph: Testing form validation messages
  - text: tests/form-validation.spec.ts
  - code: "test('form shows validation errors', async ({ page }) => { await page.goto('/signup'); await page.click('[data-testid=\"submit\"]'); await expect(page.locator('.error-message')).toBeVisible(); });"
  - button "API Test Examples 3 examples"
  - button "Page Object Patterns 2 examples"
  - button "Custom Fixtures 4 examples"
  - text: Project Preview Chromium Firefox Safari (WebKit)
  - tablist:
    - tab "Structure" [selected]
    - tab "Config"
    - tab "Sample"
  - tabpanel "Structure": Project Structure 📁 playwright-framework/ 📄 package.json 📄 playwright.config.ts 📄 tsconfig.json 📄 .env.example 📁 tests/ 📄 example.spec.ts 📄 webkit-specific.spec.ts 📁 fixtures/ 📄 base.ts 📁 pages/ 📄 HomePage.ts 📁 test-data/ 📄 users.json 📁 utils/ 📄 helpers.ts 📁 .github/ 📁 workflows/ 📄 playwright.yml
  - heading "Ready to Generate?" [level=3]
  - paragraph: Your customized Playwright framework will be generated as a ZIP file
  - text: TypeScript Chromium Firefox Safari (WebKit) GitHub Actions Page Objects + 9 more features
  - button "Generate & Download Framework"
  - paragraph: "Estimated size: ~2.5MB • Includes all dependencies and examples"
  - paragraph: "Browser support: Chromium, Firefox, Safari (WebKit)"
  - heading "Documentation" [level=4]
  - link "Playwright Documentation":
    - /url: https://playwright.dev/docs/intro
  - link "Testing Best Practices":
    - /url: https://playwright.dev/docs/best-practices
  - heading "Framework Features" [level=4]
  - text: ✅ Cross-browser testing ✅ Page Object Model ✅ Custom fixtures & utilities ✅ CI/CD integration ✅ Comprehensive reporting ✅ TypeScript support
  - heading "Resources" [level=4]
  - link "Playwright GitHub":
    - /url: https://github.com/microsoft/playwright
  - link "Playwright MCP":
    - /url: https://github.com/microsoft/playwright-mcp
  - link "Community Forum":
    - /url: https://playwright.dev/community/welcome
  - paragraph: Built with for the testing community
  - paragraph: Generate your perfect Playwright framework in seconds • Free & Open Source
- region "Notifications alt+T"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | // 1. Full Framework Generation with all options enabled
   4 | // (Assumes test IDs for all major config options and generate button)
   5 | test('generate framework with all options enabled', async ({ page }) => {
   6 |   await page.goto('/');
   7 |
   8 |   // Ensure main content is present
   9 |   await expect(page.getByTestId('main-content')).toBeVisible({ timeout: 10000 });
   10 |
   11 |   // Enable all browsers (wait for checkboxes to be visible, longer timeout)
   12 |   await expect(page.getByTestId('chromium-checkbox')).toBeVisible({ timeout: 10000 });
   13 |   await expect(page.getByTestId('firefox-checkbox')).toBeVisible({ timeout: 10000 });
   14 |   await expect(page.getByTestId('webkit-checkbox')).toBeVisible({ timeout: 10000 });
   15 |   await page.getByTestId('chromium-checkbox').check();
   16 |   await page.getByTestId('firefox-checkbox').check();
   17 |   await page.getByTestId('webkit-checkbox').check();
   18 |
   19 |   // Enable all integrations
   20 |   await page.getByTestId('github-actions-switch').check();
   21 |   await page.getByTestId('allure-reporter-switch').check();
   22 |   await page.getByTestId('cucumber-integration-switch').check();
   23 |   await page.getByTestId('faker-library-switch').check();
   24 |
   25 |
   26 |   // Add a new environment and switch to settings tab
   27 |   await page.getByTestId('add-environment-button').click();
   28 |   // The UI should now show the environment form in the settings tab
   29 |   await page.getByTestId('env-key-input-0').fill('LONG_ENV_KEY_🚀');
   30 |   await page.getByTestId('env-value-input-0').fill('complex_value_!@#$%^&*()_+');
   31 |
   32 |   // Add a new environment variable (if supported by UI)
   33 |   await page.getByTestId('add-env-var').click();
   34 |   await page.getByTestId('env-key-input-1').fill('SECOND_KEY');
   35 |   await page.getByTestId('env-value-input-1').fill('second_value');
   36 |
   37 |   // Select all testing capabilities
   38 |   await page.getByTestId('capability-e2e').check();
   39 |   await page.getByTestId('capability-api').check();
   40 |   await page.getByTestId('capability-visual').check();
   41 |
   42 |   // Fill in custom project name with special characters
   43 |   await page.getByTestId('project-name-input').fill('My_Proj_测试_🚀!');
   44 |
   45 |   // Generate framework
   46 |   await page.getByTestId('generate-button').click();
   47 |
   48 |   // Wait for and verify success message
   49 |   await expect(page.getByTestId('generation-success')).toBeVisible();
   50 | });
   51 |
   52 | // 2. Form Validation: Empty and invalid input
   53 | // (Assumes validation messages are shown with test IDs)
   54 | test('form validation for empty and invalid input', async ({ page }) => {
   55 |   await page.goto('/');
   56 |
   57 |   // Clear required project name
   58 |   await page.getByTestId('project-name-input').fill('');
   59 |   await page.getByTestId('generate-button').click();
   60 |   await expect(page.getByTestId('project-name-error')).toBeVisible();
   61 |
   62 |   // Enter invalid project name
   63 |   await page.getByTestId('project-name-input').fill('!@#$%');
   64 |   await page.getByTestId('generate-button').click();
   65 |   await expect(page.getByTestId('project-name-error')).toBeVisible();
   66 | });
   67 |
   68 | // 3. Download Manual PDF
   69 | // (Assumes the download button has test ID 'download-manual')
   70 | test('download manual PDF is accessible', async ({ page }) => {
   71 |   await page.goto('/');
   72 |   const [ download ] = await Promise.all([
   73 |     page.waitForEvent('download'),
   74 |     page.getByTestId('download-manual').click(),
   75 |   ]);
   76 |   expect(download.suggestedFilename()).toContain('USER_MANUAL.pdf');
   77 | });
   78 |
   79 | // 4. Persistence: Save and reload state
   80 | // (Assumes state is saved to localStorage)
   81 | test('state persists after reload', async ({ page }) => {
   82 |   await page.goto('/');
   83 |   await page.getByTestId('project-name-input').fill('PersistentProject');
   84 |   await page.reload();
>  85 |   await expect(page.getByTestId('project-name-input')).toHaveValue('PersistentProject');
      |                                                        ^ Error: Timed out 5000ms waiting for expect(locator).toHaveValue(expected)
   86 | });
   87 |
   88 | // 5. Accessibility: Keyboard navigation
   89 | // (Assumes tab order and focus indicators are present)
   90 | test('keyboard navigation works for main controls', async ({ page }) => {
   91 |   await page.goto('/');
   92 |   await page.keyboard.press('Tab'); // Focus first element
   93 |   // Tab through several elements and check focus
   94 |   for (let i = 0; i < 5; i++) {
   95 |     await page.keyboard.press('Tab');
   96 |   }
   97 |   // Check that a main control is focused
   98 |   const active = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
   99 |   expect(active).toBeTruthy();
  100 | });
  101 |
```