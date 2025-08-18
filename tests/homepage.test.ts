import { test, expect } from '@playwright/test';

test('homepage loads with all main components', async ({ page }) => {
  await page.goto('/');

  // Check that the main page elements are present
  await expect(page.getByTestId('app-header')).toBeVisible();
  await expect(page.getByTestId('app-title')).toContainText('Playwright Framework Generator');
  await expect(page.getByTestId('app-description')).toBeVisible();
  await expect(page.getByTestId('theme-toggle')).toBeVisible();
  
  await expect(page.getByTestId('home-page')).toBeVisible();
  await expect(page.getByTestId('main-content')).toBeVisible();
  
  // Check that all main configuration components are present
  await expect(page.getByTestId('language-selector')).toBeVisible();
  await expect(page.getByTestId('browser-configuration')).toBeVisible();
  await expect(page.getByTestId('testing-capabilities')).toBeVisible();
  await expect(page.getByTestId('integrations-panel')).toBeVisible();
  await expect(page.getByTestId('fixtures-configuration')).toBeVisible();
  await expect(page.getByTestId('environment-settings')).toBeVisible();
  await expect(page.getByTestId('code-quality-options')).toBeVisible();
  await expect(page.getByTestId('docker-options')).toBeVisible();
  await expect(page.getByTestId('preview-panel')).toBeVisible();
  await expect(page.getByTestId('generate-button-card')).toBeVisible();
  await expect(page.getByTestId('generate-button')).toBeVisible();
  await expect(page.getByTestId('footer')).toBeVisible();
});

test('browser configuration works correctly', async ({ page }) => {
  await page.goto('/');

  // Check that all browsers are selected by default
  await expect(page.getByTestId('chromium-checkbox')).toBeChecked();
  await expect(page.getByTestId('firefox-checkbox')).toBeChecked();
  await expect(page.getByTestId('webkit-checkbox')).toBeChecked();

  // Test unchecking a browser
  await page.getByTestId('firefox-checkbox').click();
  await expect(page.getByTestId('firefox-checkbox')).not.toBeChecked();

  // Check that the preview panel updates to reflect browser changes
  await expect(page.getByTestId('preview-panel')).toBeVisible();

  // Test deselect all functionality
  await page.getByTestId('deselect-all-browsers').click();
  await expect(page.getByTestId('chromium-checkbox')).not.toBeChecked();
  await expect(page.getByTestId('firefox-checkbox')).not.toBeChecked();
  await expect(page.getByTestId('webkit-checkbox')).not.toBeChecked();

  // Check that warning appears when no browsers selected
  await expect(page.getByTestId('browser-selection-warning')).toBeVisible();

  // Check generate button is disabled
  await expect(page.getByTestId('generate-button')).toBeDisabled();

  // Test select all functionality
  await page.getByTestId('select-all-browsers').click();
  await expect(page.getByTestId('chromium-checkbox')).toBeChecked();
  await expect(page.getByTestId('firefox-checkbox')).toBeChecked();
  await expect(page.getByTestId('webkit-checkbox')).toBeChecked();

  // Check generate button is enabled again
  await expect(page.getByTestId('generate-button')).not.toBeDisabled();
});

test('integrations panel toggles work correctly', async ({ page }) => {
  await page.goto('/');

  // Check that integrations panel is visible
  await expect(page.getByTestId('integrations-panel')).toBeVisible();

  // Test GitHub Actions switch (should be enabled by default)
  const githubActionsSwitch = page.getByTestId('github-actions-switch');
  await expect(githubActionsSwitch).toBeVisible();

  // Test Allure Reporter switch (should be disabled by default)
  const allureReporterSwitch = page.getByTestId('allure-reporter-switch');
  await expect(allureReporterSwitch).toBeVisible();
  
  // Toggle Allure Reporter on
  await allureReporterSwitch.click();
  
  // Test Cucumber Integration switch (should be disabled by default)
  const cucumberSwitch = page.getByTestId('cucumber-integration-switch');
  await expect(cucumberSwitch).toBeVisible();
  
  // Test Faker Library switch (should be enabled by default)
  const fakerSwitch = page.getByTestId('faker-library-switch');
  await expect(fakerSwitch).toBeVisible();
  
  // Toggle Faker Library off
  await fakerSwitch.click();
});