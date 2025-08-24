# Test info

- Name: Testing Capabilities Component >> updates description based on selected capabilities
- Location: D:\Projects\playwrightFrameworkGenerator\tests\testing-capabilities.test.ts:95:3

# Error details

```
Error: locator.uncheck: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('api-testing-checkbox')

    at D:\Projects\playwrightFrameworkGenerator\tests\testing-capabilities.test.ts:103:23
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
   3 | test.describe('Testing Capabilities Component', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     await page.goto('/');
   6 |   });
   7 |
   8 |   test('renders with default state - both UI and API testing enabled', async ({ page }) => {
   9 |     // Check component is visible
   10 |     await expect(page.getByTestId('testing-capabilities')).toBeVisible();
   11 |     
   12 |     // Check title and description
   13 |     await expect(page.getByTestId('testing-capabilities-title')).toContainText('Testing Capabilities');
   14 |     
   15 |     // Check default checkboxes state - both should be checked
   16 |     await expect(page.getByTestId('ui-testing-checkbox')).toBeChecked();
   17 |     await expect(page.getByTestId('api-testing-checkbox')).toBeChecked();
   18 |     
   19 |     // Check labels are visible
   20 |     await expect(page.getByTestId('ui-testing-label')).toBeVisible();
   21 |     await expect(page.getByTestId('api-testing-label')).toBeVisible();
   22 |     
   23 |     // Check descriptions
   24 |     await expect(page.getByText('Web interface automation with browser testing, visual validation, and cross-browser compatibility')).toBeVisible();
   25 |     await expect(page.getByText('REST and GraphQL endpoint testing with request validation and response verification')).toBeVisible();
   26 |   });
   27 |
   28 |   test('shows included utilities when capabilities are selected', async ({ page }) => {
   29 |     // Should show utilities for both UI and API testing by default
   30 |     await expect(page.getByText('Included Utilities:')).toBeVisible();
   31 |     await expect(page.getByText('Playwright Browser Automation')).toBeVisible();
   32 |     await expect(page.getByText('REST API Test Helpers')).toBeVisible();
   33 |   });
   34 |
   35 |   test('can toggle UI testing capability', async ({ page }) => {
   36 |     const uiCheckbox = page.getByTestId('ui-testing-checkbox');
   37 |     
   38 |     // Should be checked by default
   39 |     await expect(uiCheckbox).toBeChecked();
   40 |     
   41 |     // Uncheck UI testing
   42 |     await uiCheckbox.uncheck();
   43 |     await expect(uiCheckbox).not.toBeChecked();
   44 |     
   45 |     // Check that API testing is still enabled
   46 |     await expect(page.getByTestId('api-testing-checkbox')).toBeChecked();
   47 |     
   48 |     // Check that only API testing utilities are shown
   49 |     await expect(page.getByText('REST API Test Helpers')).toBeVisible();
   50 |     await expect(page.getByText('Playwright Browser Automation')).not.toBeVisible();
   51 |     
   52 |     // Re-enable UI testing
   53 |     await uiCheckbox.check();
   54 |     await expect(uiCheckbox).toBeChecked();
   55 |   });
   56 |
   57 |   test('can toggle API testing capability', async ({ page }) => {
   58 |     const apiCheckbox = page.getByTestId('api-testing-checkbox');
   59 |     
   60 |     // Should be checked by default
   61 |     await expect(apiCheckbox).toBeChecked();
   62 |     
   63 |     // Uncheck API testing
   64 |     await apiCheckbox.uncheck();
   65 |     await expect(apiCheckbox).not.toBeChecked();
   66 |     
   67 |     // Check that UI testing is still enabled
   68 |     await expect(page.getByTestId('ui-testing-checkbox')).toBeChecked();
   69 |     
   70 |     // Check that only UI testing utilities are shown
   71 |     await expect(page.getByText('Playwright Browser Automation')).toBeVisible();
   72 |     await expect(page.getByText('REST API Test Helpers')).not.toBeVisible();
   73 |     
   74 |     // Re-enable API testing
   75 |     await apiCheckbox.check();
   76 |     await expect(apiCheckbox).toBeChecked();
   77 |   });
   78 |
   79 |   test('shows validation warning when no capabilities are selected', async ({ page }) => {
   80 |     const uiCheckbox = page.getByTestId('ui-testing-checkbox');
   81 |     const apiCheckbox = page.getByTestId('api-testing-checkbox');
   82 |     
   83 |     // Disable both capabilities
   84 |     await uiCheckbox.uncheck();
   85 |     await apiCheckbox.uncheck();
   86 |     
   87 |     // Check validation warning appears
   88 |     await expect(page.getByText('At least one testing capability must be selected')).toBeVisible();
   89 |     await expect(page.getByText('Required')).toBeVisible();
   90 |     
   91 |     // Check no utilities are shown
   92 |     await expect(page.getByText('Included Utilities:')).not.toBeVisible();
   93 |   });
   94 |
   95 |   test('updates description based on selected capabilities', async ({ page }) => {
   96 |     const uiCheckbox = page.getByTestId('ui-testing-checkbox');
   97 |     const apiCheckbox = page.getByTestId('api-testing-checkbox');
   98 |     
   99 |     // Default state should show both
  100 |     await expect(page.getByTestId('testing-capabilities-description')).toContainText('UI Testing and API Testing');
  101 |     
  102 |     // Disable API testing - should show only UI Testing
> 103 |     await apiCheckbox.uncheck();
      |                       ^ Error: locator.uncheck: Test timeout of 30000ms exceeded.
  104 |     await expect(page.getByTestId('testing-capabilities-description')).toContainText('UI Testing.');
  105 |     
  106 |     // Disable UI testing, enable API testing - should show only API Testing
  107 |     await uiCheckbox.uncheck();
  108 |     await apiCheckbox.check();
  109 |     await expect(page.getByTestId('testing-capabilities-description')).toContainText('API Testing.');
  110 |     
  111 |     // Disable both - should show no capabilities message
  112 |     await apiCheckbox.uncheck();
  113 |     await expect(page.getByTestId('testing-capabilities-description')).toContainText('No testing capabilities selected');
  114 |   });
  115 |
  116 |   test('maintains state when toggling capabilities multiple times', async ({ page }) => {
  117 |     const uiCheckbox = page.getByTestId('ui-testing-checkbox');
  118 |     const apiCheckbox = page.getByTestId('api-testing-checkbox');
  119 |     
  120 |     // Toggle UI testing multiple times
  121 |     await uiCheckbox.uncheck();
  122 |     await expect(uiCheckbox).not.toBeChecked();
  123 |     await uiCheckbox.check();
  124 |     await expect(uiCheckbox).toBeChecked();
  125 |     
  126 |     // Toggle API testing multiple times
  127 |     await apiCheckbox.uncheck();
  128 |     await expect(apiCheckbox).not.toBeChecked();
  129 |     await apiCheckbox.check();
  130 |     await expect(apiCheckbox).toBeChecked();
  131 |     
  132 |     // Both should remain checked
  133 |     await expect(uiCheckbox).toBeChecked();
  134 |     await expect(apiCheckbox).toBeChecked();
  135 |   });
  136 |
  137 |   test('checkboxes are properly labeled and accessible', async ({ page }) => {
  138 |     // Check that labels are associated with checkboxes
  139 |     const uiLabel = page.getByTestId('ui-testing-label');
  140 |     const apiLabel = page.getByTestId('api-testing-label');
  141 |     
  142 |     await expect(uiLabel).toBeVisible();
  143 |     await expect(apiLabel).toBeVisible();
  144 |     
  145 |     // Click on label should toggle checkbox
  146 |     await uiLabel.click();
  147 |     await expect(page.getByTestId('ui-testing-checkbox')).not.toBeChecked();
  148 |     
  149 |     await apiLabel.click();
  150 |     await expect(page.getByTestId('api-testing-checkbox')).not.toBeChecked();
  151 |   });
  152 | });
```