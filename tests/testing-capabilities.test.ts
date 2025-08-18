import { test, expect } from '@playwright/test';

test.describe('Testing Capabilities Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders with default state - both UI and API testing enabled', async ({ page }) => {
    // Check component is visible
    await expect(page.getByTestId('testing-capabilities')).toBeVisible();
    
    // Check title and description
    await expect(page.getByTestId('testing-capabilities-title')).toContainText('Testing Capabilities');
    
    // Check default checkboxes state - both should be checked
    await expect(page.getByTestId('ui-testing-checkbox')).toBeChecked();
    await expect(page.getByTestId('api-testing-checkbox')).toBeChecked();
    
    // Check labels are visible
    await expect(page.getByTestId('ui-testing-label')).toBeVisible();
    await expect(page.getByTestId('api-testing-label')).toBeVisible();
    
    // Check descriptions
    await expect(page.getByText('Web interface automation with browser testing, visual validation, and cross-browser compatibility')).toBeVisible();
    await expect(page.getByText('REST and GraphQL endpoint testing with request validation and response verification')).toBeVisible();
  });

  test('shows included utilities when capabilities are selected', async ({ page }) => {
    // Should show utilities for both UI and API testing by default
    await expect(page.getByText('Included Utilities:')).toBeVisible();
    await expect(page.getByText('Playwright Browser Automation')).toBeVisible();
    await expect(page.getByText('REST API Test Helpers')).toBeVisible();
  });

  test('can toggle UI testing capability', async ({ page }) => {
    const uiCheckbox = page.getByTestId('ui-testing-checkbox');
    
    // Should be checked by default
    await expect(uiCheckbox).toBeChecked();
    
    // Uncheck UI testing
    await uiCheckbox.uncheck();
    await expect(uiCheckbox).not.toBeChecked();
    
    // Check that API testing is still enabled
    await expect(page.getByTestId('api-testing-checkbox')).toBeChecked();
    
    // Check that only API testing utilities are shown
    await expect(page.getByText('REST API Test Helpers')).toBeVisible();
    await expect(page.getByText('Playwright Browser Automation')).not.toBeVisible();
    
    // Re-enable UI testing
    await uiCheckbox.check();
    await expect(uiCheckbox).toBeChecked();
  });

  test('can toggle API testing capability', async ({ page }) => {
    const apiCheckbox = page.getByTestId('api-testing-checkbox');
    
    // Should be checked by default
    await expect(apiCheckbox).toBeChecked();
    
    // Uncheck API testing
    await apiCheckbox.uncheck();
    await expect(apiCheckbox).not.toBeChecked();
    
    // Check that UI testing is still enabled
    await expect(page.getByTestId('ui-testing-checkbox')).toBeChecked();
    
    // Check that only UI testing utilities are shown
    await expect(page.getByText('Playwright Browser Automation')).toBeVisible();
    await expect(page.getByText('REST API Test Helpers')).not.toBeVisible();
    
    // Re-enable API testing
    await apiCheckbox.check();
    await expect(apiCheckbox).toBeChecked();
  });

  test('shows validation warning when no capabilities are selected', async ({ page }) => {
    const uiCheckbox = page.getByTestId('ui-testing-checkbox');
    const apiCheckbox = page.getByTestId('api-testing-checkbox');
    
    // Disable both capabilities
    await uiCheckbox.uncheck();
    await apiCheckbox.uncheck();
    
    // Check validation warning appears
    await expect(page.getByText('At least one testing capability must be selected')).toBeVisible();
    await expect(page.getByText('Required')).toBeVisible();
    
    // Check no utilities are shown
    await expect(page.getByText('Included Utilities:')).not.toBeVisible();
  });

  test('updates description based on selected capabilities', async ({ page }) => {
    const uiCheckbox = page.getByTestId('ui-testing-checkbox');
    const apiCheckbox = page.getByTestId('api-testing-checkbox');
    
    // Default state should show both
    await expect(page.getByTestId('testing-capabilities-description')).toContainText('UI Testing and API Testing');
    
    // Disable API testing - should show only UI Testing
    await apiCheckbox.uncheck();
    await expect(page.getByTestId('testing-capabilities-description')).toContainText('UI Testing.');
    
    // Disable UI testing, enable API testing - should show only API Testing
    await uiCheckbox.uncheck();
    await apiCheckbox.check();
    await expect(page.getByTestId('testing-capabilities-description')).toContainText('API Testing.');
    
    // Disable both - should show no capabilities message
    await apiCheckbox.uncheck();
    await expect(page.getByTestId('testing-capabilities-description')).toContainText('No testing capabilities selected');
  });

  test('maintains state when toggling capabilities multiple times', async ({ page }) => {
    const uiCheckbox = page.getByTestId('ui-testing-checkbox');
    const apiCheckbox = page.getByTestId('api-testing-checkbox');
    
    // Toggle UI testing multiple times
    await uiCheckbox.uncheck();
    await expect(uiCheckbox).not.toBeChecked();
    await uiCheckbox.check();
    await expect(uiCheckbox).toBeChecked();
    
    // Toggle API testing multiple times
    await apiCheckbox.uncheck();
    await expect(apiCheckbox).not.toBeChecked();
    await apiCheckbox.check();
    await expect(apiCheckbox).toBeChecked();
    
    // Both should remain checked
    await expect(uiCheckbox).toBeChecked();
    await expect(apiCheckbox).toBeChecked();
  });

  test('checkboxes are properly labeled and accessible', async ({ page }) => {
    // Check that labels are associated with checkboxes
    const uiLabel = page.getByTestId('ui-testing-label');
    const apiLabel = page.getByTestId('api-testing-label');
    
    await expect(uiLabel).toBeVisible();
    await expect(apiLabel).toBeVisible();
    
    // Click on label should toggle checkbox
    await uiLabel.click();
    await expect(page.getByTestId('ui-testing-checkbox')).not.toBeChecked();
    
    await apiLabel.click();
    await expect(page.getByTestId('api-testing-checkbox')).not.toBeChecked();
  });
});