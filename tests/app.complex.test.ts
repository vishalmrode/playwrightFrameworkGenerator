import { test, expect } from '@playwright/test';

// 1. Full Framework Generation with all options enabled
// (Assumes test IDs for all major config options and generate button)
test('generate framework with all options enabled', async ({ page }) => {
  await page.goto('/');

  // Ensure main content is present
  await expect(page.getByTestId('main-content')).toBeVisible({ timeout: 10000 });

  // Enable all browsers (wait for checkboxes to be visible, longer timeout)
  await expect(page.getByTestId('chromium-checkbox')).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId('firefox-checkbox')).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId('webkit-checkbox')).toBeVisible({ timeout: 10000 });
  await page.getByTestId('chromium-checkbox').check();
  await page.getByTestId('firefox-checkbox').check();
  await page.getByTestId('webkit-checkbox').check();

  // Enable all integrations
  await page.getByTestId('github-actions-switch').check();
  await page.getByTestId('allure-reporter-switch').check();
  await page.getByTestId('cucumber-integration-switch').check();
  await page.getByTestId('faker-library-switch').check();


  // Add a new environment and switch to settings tab
  await page.getByTestId('add-environment-button').click();
  // The UI should now show the environment form in the settings tab
  await page.getByTestId('env-key-input-0').fill('LONG_ENV_KEY_🚀');
  await page.getByTestId('env-value-input-0').fill('complex_value_!@#$%^&*()_+');

  // Add a new environment variable (if supported by UI)
  await page.getByTestId('add-env-var').click();
  await page.getByTestId('env-key-input-1').fill('SECOND_KEY');
  await page.getByTestId('env-value-input-1').fill('second_value');

  // Select all testing capabilities
  await page.getByTestId('capability-e2e').check();
  await page.getByTestId('capability-api').check();
  await page.getByTestId('capability-visual').check();

  // Fill in custom project name with special characters
  await page.getByTestId('project-name-input').fill('My_Proj_测试_🚀!');

  // Generate framework
  await page.getByTestId('generate-button').click();

  // Wait for and verify success message
  await expect(page.getByTestId('generation-success')).toBeVisible();
});

// 2. Form Validation: Empty and invalid input
// (Assumes validation messages are shown with test IDs)
test('form validation for empty and invalid input', async ({ page }) => {
  await page.goto('/');

  // Clear required project name
  await page.getByTestId('project-name-input').fill('');
  await page.getByTestId('generate-button').click();
  await expect(page.getByTestId('project-name-error')).toBeVisible();

  // Enter invalid project name
  await page.getByTestId('project-name-input').fill('!@#$%');
  await page.getByTestId('generate-button').click();
  await expect(page.getByTestId('project-name-error')).toBeVisible();
});

// 3. Download Manual PDF
// (Assumes the download button has test ID 'download-manual')
test('download manual PDF is accessible', async ({ page }) => {
  await page.goto('/');
  const [ download ] = await Promise.all([
    page.waitForEvent('download'),
    page.getByTestId('download-manual').click(),
  ]);
  expect(download.suggestedFilename()).toContain('USER_MANUAL.pdf');
});

// 4. Persistence: Save and reload state
// (Assumes state is saved to localStorage)
test('state persists after reload', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('project-name-input').fill('PersistentProject');
  await page.reload();
  await expect(page.getByTestId('project-name-input')).toHaveValue('PersistentProject');
});

// 5. Accessibility: Keyboard navigation
// (Assumes tab order and focus indicators are present)
test('keyboard navigation works for main controls', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab'); // Focus first element
  // Tab through several elements and check focus
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab');
  }
  // Check that a main control is focused
  const active = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
  expect(active).toBeTruthy();
});
