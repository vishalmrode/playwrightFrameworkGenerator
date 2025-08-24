# Test info

- Name: keyboard navigation works for main controls
- Location: D:\Projects\playwrightFrameworkGenerator\tests\app.complex.test.ts:90:1

# Error details

```
Error: expect(received).toBeTruthy()

Received: null
    at D:\Projects\playwrightFrameworkGenerator\tests\app.complex.test.ts:99:18
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
- region "Notifications alt+T"
- text: Toggle to light theme
- tooltip "Toggle to light theme"
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
   85 |   await expect(page.getByTestId('project-name-input')).toHaveValue('PersistentProject');
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
>  99 |   expect(active).toBeTruthy();
      |                  ^ Error: expect(received).toBeTruthy()
  100 | });
  101 |
```