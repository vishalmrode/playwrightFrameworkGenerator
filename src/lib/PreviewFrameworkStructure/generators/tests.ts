import { ProjectFile, PreviewConfiguration } from '../types';

interface TestGenerationResult {
  files: ProjectFile[];
  dependencies: string[];
}

/**
 * Generates test files
 */
export function generateTestFiles(config: PreviewConfiguration): TestGenerationResult {
  const files: ProjectFile[] = [];
  const dependencies: string[] = [];

  // Main example test
  const exampleTest = generateExampleTest(config);
  files.push(exampleTest);

  // API test if API testing is enabled
  if (config.capabilities.includes('apiTesting')) {
    const apiTest = generateApiTest(config);
    files.push(apiTest);
  }

  // Visual test if visual testing is enabled
  if (config.capabilities.includes('visualTesting')) {
    const visualTest = generateVisualTest(config);
    files.push(visualTest);
  }

  // Performance test if performance testing is enabled
  if (config.capabilities.includes('performanceTesting')) {
    const perfTest = generatePerformanceTest(config);
    files.push(perfTest);
  }

  // Mobile test if mobile testing is enabled
  if (config.capabilities.includes('mobileTesting')) {
    const mobileTest = generateMobileTest(config);
    files.push(mobileTest);
  }

  // Browser-specific tests
  config.browsers.forEach(browser => {
    if (browser === 'webkit') {
      const safariTest = generateSafariSpecificTest(config);
      files.push(safariTest);
    }
  });

  return {
    files,
    dependencies,
  };
}

function generateExampleTest(config: PreviewConfiguration): ProjectFile {
  const ext = config.language === 'typescript' ? 'ts' : 'js';
  const importStatement = config.language === 'typescript'
    ? "import { test, expect } from '@playwright/test';"
    : "const { test, expect } = require('@playwright/test');";

  const content = `${importStatement}

test.describe('Example Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/.*Homepage.*/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to about page', async ({ page }) => {
    await page.click('a[href="/about"]');
    await expect(page).toHaveURL(/.*about.*/);
    await expect(page.locator('h1')).toContainText('About');
  });

  test('cross-browser compatibility test', async ({ page, browserName }) => {
    console.log(\`Running on: \${browserName}\`);
    
    // Browser-specific logic
    if (browserName === 'webkit') {
      // Safari-specific handling
      await page.waitForLoadState('networkidle');
    }
    
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  ${config.fixtures.includes('authenticated') ? `
  test('authenticated user test', async ({ page, authenticatedUser }) => {
    // This test uses the authenticated user fixture
    await page.goto('/dashboard');
    await expect(page.locator('[data-testid="user-welcome"]')).toBeVisible();
  });
  ` : ''}

  ${config.environments.length > 1 ? `
  test('environment-specific test', async ({ page }) => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    console.log(\`Testing against: \${baseUrl}\`);
    
    await page.goto('/');
    await expect(page).toHaveTitle(/.*/);
  });
  ` : ''}
});`;

  return {
    path: `tests/example.spec.${ext}`,
    content,
    description: 'Main example test demonstrating basic functionality',
    category: 'test',
    language: config.language,
  };
}

function generateApiTest(config: PreviewConfiguration): ProjectFile {
  const ext = config.language === 'typescript' ? 'ts' : 'js';
  const importStatement = config.language === 'typescript'
    ? "import { test, expect } from '@playwright/test';"
    : "const { test, expect } = require('@playwright/test');";

  const content = `${importStatement}

test.describe('API Tests', () => {
  const baseURL = process.env.API_BASE_URL || 'http://localhost:3001/api';

  test('should fetch users list', async ({ request }) => {
    const response = await request.get(\`\${baseURL}/users\`);
    expect(response.status()).toBe(200);
    
    const users = await response.json();
    expect(Array.isArray(users)).toBe(true);
  });

  test('should create new user', async ({ request }) => {
    const newUser = {
      name: 'Test User',
      email: 'test@example.com',
      role: 'user'
    };

    const response = await request.post(\`\${baseURL}/users\`, {
      data: newUser
    });
    
    expect(response.status()).toBe(201);
    const created = await response.json();
    expect(created.name).toBe(newUser.name);
    expect(created.email).toBe(newUser.email);
  });

  test('should handle authentication', async ({ request }) => {
    const loginData = {
      email: 'admin@example.com',
      password: 'password123'
    };

    const response = await request.post(\`\${baseURL}/auth/login\`, {
      data: loginData
    });
    
    expect(response.status()).toBe(200);
    const auth = await response.json();
    expect(auth.token).toBeDefined();
  });

  test('should validate API error responses', async ({ request }) => {
    const response = await request.get(\`\${baseURL}/users/999999\`);
    expect(response.status()).toBe(404);
    
    const error = await response.json();
    expect(error.message).toContain('not found');
  });
});`;

  return {
    path: `tests/api/api.spec.${ext}`,
    content,
    description: 'API testing examples',
    category: 'test',
    language: config.language,
  };
}

function generateVisualTest(config: PreviewConfiguration): ProjectFile {
  const ext = config.language === 'typescript' ? 'ts' : 'js';
  const importStatement = config.language === 'typescript'
    ? "import { test, expect } from '@playwright/test';"
    : "const { test, expect } = require('@playwright/test');";

  const content = `${importStatement}

test.describe('Visual Tests', () => {
  test('should match homepage screenshot', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('should match component screenshots', async ({ page }) => {
    await page.goto('/');
    
    // Test individual components
    const header = page.locator('header');
    await expect(header).toHaveScreenshot('header-component.png');
    
    const navigation = page.locator('nav');
    await expect(navigation).toHaveScreenshot('navigation-component.png');
  });

  test('responsive design screenshots', async ({ page }) => {
    await page.goto('/');
    
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page).toHaveScreenshot('desktop-view.png');
    
    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page).toHaveScreenshot('tablet-view.png');
    
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot('mobile-view.png');
  });

  test('dark mode visual test', async ({ page }) => {
    await page.goto('/');
    
    // Switch to dark mode
    await page.click('[data-testid="theme-toggle"]');
    await page.waitForTimeout(500); // Wait for theme transition
    
    await expect(page).toHaveScreenshot('dark-mode.png');
  });
});`;

  return {
    path: `tests/visual/visual.spec.${ext}`,
    content,
    description: 'Visual regression testing examples',
    category: 'test',
    language: config.language,
  };
}

function generatePerformanceTest(config: PreviewConfiguration): ProjectFile {
  const ext = config.language === 'typescript' ? 'ts' : 'js';
  const importStatement = config.language === 'typescript'
    ? "import { test, expect } from '@playwright/test';"
    : "const { test, expect } = require('@playwright/test');";

  const content = `${importStatement}

test.describe('Performance Tests', () => {
  test('should load page within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // 3 seconds max
  });

  test('should have acceptable First Contentful Paint', async ({ page }) => {
    await page.goto('/');
    
    const performanceTiming = await page.evaluate(() => {
      return JSON.parse(JSON.stringify(performance.timing));
    });
    
    const fcp = performanceTiming.responseStart - performanceTiming.navigationStart;
    expect(fcp).toBeLessThan(1500); // 1.5 seconds max
  });

  test('should handle large datasets efficiently', async ({ page }) => {
    await page.goto('/data-table');
    
    const startTime = Date.now();
    await page.locator('[data-testid="load-1000-rows"]').click();
    await page.waitForSelector('[data-testid="row-999"]');
    
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(2000); // 2 seconds max for 1000 rows
  });

  test('should have good Lighthouse scores', async ({ page }) => {
    await page.goto('/');
    
    // Run Lighthouse audit (requires lighthouse integration)
    const metrics = await page.evaluate(() => {
      return {
        lcp: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime,
        fid: performance.getEntriesByType('first-input')[0]?.processingStart,
        cls: performance.getEntriesByType('layout-shift')
          .reduce((sum, entry) => sum + entry.value, 0)
      };
    });
    
    if (metrics.lcp) expect(metrics.lcp).toBeLessThan(2500);
    if (metrics.fid) expect(metrics.fid).toBeLessThan(100);
    if (metrics.cls) expect(metrics.cls).toBeLessThan(0.1);
  });
});`;

  return {
    path: `tests/performance/performance.spec.${ext}`,
    content,
    description: 'Performance testing examples',
    category: 'test',
    language: config.language,
  };
}

function generateMobileTest(config: PreviewConfiguration): ProjectFile {
  const ext = config.language === 'typescript' ? 'ts' : 'js';
  const importStatement = config.language === 'typescript'
    ? "import { test, expect, devices } from '@playwright/test';"
    : "const { test, expect, devices } = require('@playwright/test');";

  const content = `${importStatement}

test.describe('Mobile Tests', () => {
  test('should work on iPhone', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();
    
    await page.goto('/');
    await expect(page.locator('[data-testid="mobile-menu-toggle"]')).toBeVisible();
    
    await context.close();
  });

  test('should work on Android', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['Pixel 5'],
    });
    const page = await context.newPage();
    
    await page.goto('/');
    await expect(page).toHaveTitle(/.*Homepage.*/);
    
    // Test touch interactions
    await page.locator('[data-testid="mobile-menu-toggle"]').tap();
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    await context.close();
  });

  test('should handle touch gestures', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPad Pro'],
    });
    const page = await context.newPage();
    
    await page.goto('/gallery');
    
    // Test swipe gesture
    const gallery = page.locator('[data-testid="image-gallery"]');
    await gallery.swipeLeft();
    
    // Verify image changed
    await expect(page.locator('[data-testid="active-image"]')).toHaveAttribute('src', /image-2/);
    
    await context.close();
  });

  test('responsive navigation', async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667 }, // iPhone SE
      { width: 414, height: 896 }, // iPhone 11
      { width: 768, height: 1024 }, // iPad
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      
      if (viewport.width < 768) {
        await expect(page.locator('[data-testid="desktop-menu"]')).toBeHidden();
        await expect(page.locator('[data-testid="mobile-menu-toggle"]')).toBeVisible();
      } else {
        await expect(page.locator('[data-testid="desktop-menu"]')).toBeVisible();
        await expect(page.locator('[data-testid="mobile-menu-toggle"]')).toBeHidden();
      }
    }
  });
});`;

  return {
    path: `tests/mobile/mobile.spec.${ext}`,
    content,
    description: 'Mobile-specific testing examples',
    category: 'test',
    language: config.language,
  };
}

function generateSafariSpecificTest(config: PreviewConfiguration): ProjectFile {
  const ext = config.language === 'typescript' ? 'ts' : 'js';
  const importStatement = config.language === 'typescript'
    ? "import { test, expect } from '@playwright/test';"
    : "const { test, expect } = require('@playwright/test');";

  const content = `${importStatement}

test.describe('Safari/WebKit Specific Tests', () => {
  test.skip(({ browserName }) => browserName !== 'webkit');

  test('should handle Safari-specific date picker', async ({ page }) => {
    await page.goto('/forms');
    
    // Safari has different date picker behavior
    const dateInput = page.locator('input[type="date"]');
    await dateInput.click();
    
    // Wait for Safari's native date picker
    await page.waitForTimeout(500);
    
    await dateInput.fill('2024-12-25');
    await expect(dateInput).toHaveValue('2024-12-25');
  });

  test('should handle Safari scrolling behavior', async ({ page }) => {
    await page.goto('/long-page');
    
    // Safari has different momentum scrolling
    await page.evaluate(() => {
      window.scrollTo({ 
        top: document.body.scrollHeight / 2, 
        behavior: 'smooth' 
      });
    });
    
    await page.waitForTimeout(1000); // Wait for smooth scroll to complete
    
    const scrollPosition = await page.evaluate(() => window.pageYOffset);
    expect(scrollPosition).toBeGreaterThan(100);
  });

  test('should handle Safari video playback', async ({ page }) => {
    await page.goto('/media');
    
    const video = page.locator('video');
    await video.click(); // Safari requires user interaction for autoplay
    
    await page.waitForTimeout(1000);
    
    const isPlaying = await video.evaluate((v) => 
      !v.paused && !v.ended && v.currentTime > 0 && v.readyState > 2
    );
    expect(isPlaying).toBe(true);
  });

  test('should handle Safari cookie behavior', async ({ page, context }) => {
    // Safari has stricter cookie policies
    await page.goto('/');
    
    await context.addCookies([{
      name: 'test-cookie',
      value: 'test-value',
      domain: new URL(page.url()).hostname,
      path: '/',
      sameSite: 'Lax' // Safari requires explicit SameSite
    }]);
    
    await page.reload();
    
    const cookies = await context.cookies();
    const testCookie = cookies.find(c => c.name === 'test-cookie');
    expect(testCookie).toBeDefined();
  });
});`;

  return {
    path: `tests/browser-specific/webkit-specific.spec.${ext}`,
    content,
    description: 'Safari/WebKit-specific test cases',
    category: 'test',
    language: config.language,
  };
}