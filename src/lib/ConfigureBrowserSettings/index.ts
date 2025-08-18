/**
 * ConfigureBrowserSettings/index.ts
 * Purpose: Helpers to convert selected browser state into Playwright project
 * definitions, package scripts, and example tests. These are pure helpers used
 * by the preview and generator.
 */
import { BrowserState } from '@/store/slices/browserSlice';

export interface PlaywrightProject {
  name: string;
  use: {
    [key: string]: any;
  };
}

/**
 * Generates Playwright project configurations based on selected browsers
 */
export function generateBrowserProjects(browserState: BrowserState['selectedBrowsers']): PlaywrightProject[] {
  const projects: PlaywrightProject[] = [];

  if (browserState.chromium) {
    projects.push({
      name: 'chromium',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    });
  }

  if (browserState.firefox) {
    projects.push({
      name: 'firefox',
      use: {
        browserName: 'firefox',
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    });
  }

  if (browserState.webkit) {
    projects.push({
      name: 'webkit',
      use: {
        browserName: 'webkit',
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    });
  }

  return projects;
}

/**
 * Generates CI configuration script commands based on selected browsers
 */
export function generateCICommands(browserState: BrowserState['selectedBrowsers']): string[] {
  const commands: string[] = [];
  
  if (browserState.chromium) {
    commands.push('npx playwright test --project=chromium');
  }
  
  if (browserState.firefox) {
    commands.push('npx playwright test --project=firefox');
  }
  
  if (browserState.webkit) {
    commands.push('npx playwright test --project=webkit');
  }
  
  return commands;
}

/**
 * Generates browser-specific test examples
 */
export function generateBrowserSpecificTests(browserState: BrowserState['selectedBrowsers']): { [key: string]: string } {
  const tests: { [key: string]: string } = {};
  
  const selectedBrowsers = Object.entries(browserState)
    .filter(([_, selected]) => selected)
    .map(([browser, _]) => browser);

  if (selectedBrowsers.length === 0) {
    return tests;
  }

  // Generate a basic test that runs on all selected browsers
  const browserList = selectedBrowsers.map(browser => `'${browser}'`).join(', ');
  
  // ensure browserList is referenced in debug builds
  void browserList;
  tests['cross-browser.spec.ts'] = `import { test, expect } from '@playwright/test';

// This test will run on: ${selectedBrowsers.join(', ')}
test.describe('Cross-browser compatibility', () => {
  test('homepage loads correctly', async ({ page, browserName }) => {
    console.log(\`Running test on: \${browserName}\`);
    
    await page.goto('/');
    await expect(page).toHaveTitle(/.*/, { timeout: 10000 });
    
    // Browser-specific assertions
    ${selectedBrowsers.map(browser => `
    if (browserName === '${browser}') {
      // ${browser.charAt(0).toUpperCase() + browser.slice(1)}-specific tests
      console.log('Running ${browser}-specific checks');
    }`).join('')}
  });

  test('navigation works across browsers', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Test common navigation patterns
    const links = await page.locator('a[href]').count();
    expect(links).toBeGreaterThan(0);
    
    console.log(\`Found \${links} links in \${browserName}\`);
  });
});`;

  // Generate browser-specific performance tests if webkit is selected (as it's often mobile-focused)
  if (browserState.webkit) {
    tests['webkit-specific.spec.ts'] = `import { test, expect } from '@playwright/test';

test.describe('WebKit/Safari specific tests', () => {
  test.skip(({ browserName }) => browserName !== 'webkit');
  
  test('mobile viewport simulation', async ({ page }) => {
    // Simulate iPhone viewport for WebKit tests
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Test mobile-specific interactions
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
    }
    
    await expect(page).toHaveTitle(/.*/, { timeout: 10000 });
  });
  
  test('touch interactions', async ({ page }) => {
    await page.goto('/');
    
    // Test touch-specific interactions
    const button = page.locator('button').first();
    await button.tap();
    
    // WebKit-specific touch gestures could be tested here
  });
});`;
  }

  return tests;
}

/**
 * Generates package.json script commands based on browser selection
 */
export function generatePackageScripts(browserState: BrowserState['selectedBrowsers']): { [key: string]: string } {
  const scripts: { [key: string]: string } = {
    'test': 'npx playwright test',
    'test:ui': 'npx playwright test --ui',
    'test:headed': 'npx playwright test --headed',
    'test:debug': 'npx playwright test --debug',
    'report': 'npx playwright show-report',
  };

  // Add browser-specific scripts
  if (browserState.chromium) {
    scripts['test:chromium'] = 'npx playwright test --project=chromium';
    scripts['test:chrome'] = 'npx playwright test --project=chromium --headed';
  }

  if (browserState.firefox) {
    scripts['test:firefox'] = 'npx playwright test --project=firefox';
  }

  if (browserState.webkit) {
    scripts['test:webkit'] = 'npx playwright test --project=webkit';
    scripts['test:safari'] = 'npx playwright test --project=webkit --headed';
  }

  // Add parallel execution script if multiple browsers selected
  const selectedCount = Object.values(browserState).filter(Boolean).length;
  if (selectedCount > 1) {
    scripts['test:parallel'] = 'npx playwright test --workers=3';
  }

  return scripts;
}

/**
 * Get display names for browsers
 */
export function getBrowserDisplayName(browser: keyof BrowserState['selectedBrowsers']): string {
  const displayNames = {
    chromium: 'Chromium',
    firefox: 'Firefox',
    webkit: 'Safari (WebKit)',
  };
  
  return displayNames[browser];
}

/**
 * Get browser colors for UI display
 */
export function getBrowserColor(browser: keyof BrowserState['selectedBrowsers']): string {
  const colors = {
    chromium: 'text-blue-500',
    firefox: 'text-orange-500',
    webkit: 'text-gray-600',
  };
  
  return colors[browser];
}