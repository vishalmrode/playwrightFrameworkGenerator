import { ProjectFile, PreviewConfiguration } from '../types';

interface FixtureGenerationResult {
  files: ProjectFile[];
  dependencies: string[];
}

/**
 * Generates fixture files
 */
export function generateFixtureFiles(config: PreviewConfiguration): FixtureGenerationResult {
  const files: ProjectFile[] = [];
  const dependencies: string[] = [];

  // Base fixture
  const baseFixture = generateBaseFixture(config);
  files.push(baseFixture);

  // Authentication fixtures
  if (config.fixtures.includes('authenticated')) {
    const authFixture = generateAuthFixture(config);
    files.push(authFixture);
  }

  // Database fixtures
  if (config.fixtures.includes('database')) {
    const dbFixture = generateDatabaseFixture(config);
    files.push(dbFixture);
  }

  // API fixtures
  if (config.fixtures.includes('api')) {
    const apiFixture = generateApiFixture(config);
    files.push(apiFixture);
  }

  // Browser fixtures
  if (config.fixtures.includes('browser')) {
    const browserFixture = generateBrowserFixture(config);
    files.push(browserFixture);
  }

  // Test data fixtures
  const testDataFixture = generateTestDataFixture(config);
  files.push(testDataFixture);

  return {
    files,
    dependencies,
  };
}

function generateBaseFixture(config: PreviewConfiguration): ProjectFile {
  const ext = config.language === 'typescript' ? 'ts' : 'js';
  const typeImports = config.language === 'typescript' 
    ? "import { test as baseTest, Page } from '@playwright/test';"
    : "";
  const jsImports = config.language === 'javascript'
    ? "const { test: baseTest } = require('@playwright/test');"
    : "";

  const content = `${typeImports}${jsImports}

${config.language === 'typescript' ? `
export interface BaseFixtures {
  // Add your base fixture types here
}

export interface BaseWorkerFixtures {
  // Add your worker fixture types here
}
` : ''}

/**
 * Base test fixture with common setup
 */
export const test = baseTest.extend${config.language === 'typescript' ? '<BaseFixtures, BaseWorkerFixtures>' : ''}({
  // Add your base fixtures here
});

export { expect } from '@playwright/test';`;

  return {
    path: `tests/fixtures/base.${ext}`,
    content,
    description: 'Base test fixture configuration',
    category: 'fixture',
    language: config.language,
  };
}

function generateAuthFixture(config: PreviewConfiguration): ProjectFile {
  const ext = config.language === 'typescript' ? 'ts' : 'js';
  const typeImports = config.language === 'typescript' 
    ? "import { test as baseTest, Page, BrowserContext } from '@playwright/test';\nimport { LoginPage } from '../pages/LoginPage';"
    : "";
  const jsImports = config.language === 'javascript'
    ? "const { test: baseTest } = require('@playwright/test');\nconst { LoginPage } = require('../pages/LoginPage');"
    : "";

  const content = `${typeImports}${jsImports}

${config.language === 'typescript' ? `
export interface AuthFixtures {
  authenticatedPage: Page;
  authenticatedContext: BrowserContext;
  loginPage: LoginPage;
}
` : ''}

/**
 * Authentication fixtures for logged-in user tests
 */
export const test = baseTest.extend${config.language === 'typescript' ? '<AuthFixtures>' : ''}({
  authenticatedContext: async ({ browser }, use) => {
    // Create a new browser context
    const context = await browser.newContext();
    
    // Set up authentication state
    await context.addCookies([
      {
        name: 'auth-token',
        value: process.env.TEST_AUTH_TOKEN || 'mock-auth-token',
        domain: new URL(process.env.BASE_URL || 'http://localhost:3000').hostname,
        path: '/',
      }
    ]);

    // Optionally, you can also set localStorage
    const page = await context.newPage();
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user'
      }));
    });
    await page.close();

    await use(context);
    await context.close();
  },

  authenticatedPage: async ({ authenticatedContext }, use) => {
    const page = await authenticatedContext.newPage();
    await use(page);
    await page.close();
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

/**
 * Helper function to perform login flow
 */
export async function performLogin(page${config.language === 'typescript' ? ': Page' : ''}) {
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLogin();
  await loginPage.loginWithValidCredentials();
  
  // Wait for successful login redirect
  await page.waitForURL(/.*dashboard.*/);
}

/**
 * Helper function to logout
 */
export async function performLogout(page${config.language === 'typescript' ? ': Page' : ''}) {
  await page.locator('[data-testid="user-menu"]').click();
  await page.locator('[data-testid="logout-button"]').click();
  await page.waitForURL(/.*login.*/);
}

export { expect } from '@playwright/test';`;

  return {
    path: `tests/fixtures/auth.${ext}`,
    content,
    description: 'Authentication fixtures for user login/logout',
    category: 'fixture',
    language: config.language,
  };
}

function generateDatabaseFixture(config: PreviewConfiguration): ProjectFile {
  const ext = config.language === 'typescript' ? 'ts' : 'js';
  const typeImports = config.language === 'typescript' 
    ? "import { test as baseTest } from '@playwright/test';"
    : "";
  const jsImports = config.language === 'javascript'
    ? "const { test: baseTest } = require('@playwright/test');"
    : "";

  const content = `${typeImports}${jsImports}

${config.language === 'typescript' ? `
export interface DatabaseFixtures {
  cleanDatabase: void;
  seedDatabase: void;
  testUser: TestUser;
}

interface TestUser {
  id: string;
  email: string;
  name: string;
  password: string;
}
` : ''}

/**
 * Database fixtures for test data management
 */
export const test = baseTest.extend${config.language === 'typescript' ? '<DatabaseFixtures>' : ''}({
  cleanDatabase: [async ({}, use) => {
    // Clean database before test
    await cleanTestDatabase();
    
    await use();
    
    // Clean database after test
    await cleanTestDatabase();
  }, { auto: true }],

  seedDatabase: [async ({}, use) => {
    // Seed database with test data
    await seedTestData();
    
    await use();
  }, { auto: true }],

  testUser: async ({}, use) => {
    // Create a test user
    const testUser = await createTestUser();
    
    await use(testUser);
    
    // Clean up test user
    await deleteTestUser(testUser.id);
  },
});

/**
 * Clean the test database
 */
async function cleanTestDatabase() {
  // Implementation depends on your database
  // This is a mock implementation
  console.log('Cleaning test database...');
  
  try {
    // Example API call to clean database
    const response = await fetch(\`\${process.env.API_BASE_URL}/test/clean\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.TEST_API_KEY}\`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(\`Failed to clean database: \${response.statusText}\`);
    }
  } catch (error) {
    console.warn('Database cleanup failed:', error);
  }
}

/**
 * Seed test data
 */
async function seedTestData() {
  console.log('Seeding test database...');
  
  const testData = {
    users: [
      {
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin'
      },
      {
        email: 'user@example.com',
        name: 'Regular User',
        role: 'user'
      }
    ],
    products: [
      {
        name: 'Test Product 1',
        price: 99.99,
        category: 'electronics'
      },
      {
        name: 'Test Product 2',
        price: 149.99,
        category: 'books'
      }
    ]
  };
  
  try {
    const response = await fetch(\`\${process.env.API_BASE_URL}/test/seed\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.TEST_API_KEY}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    if (!response.ok) {
      throw new Error(\`Failed to seed database: \${response.statusText}\`);
    }
  } catch (error) {
    console.warn('Database seeding failed:', error);
  }
}

/**
 * Create a test user
 */
async function createTestUser()${config.language === 'typescript' ? ': Promise<TestUser>' : ''} {
  const userData = {
    email: \`test-\${Date.now()}@example.com\`,
    name: 'Test User',
    password: 'testpass123',
    role: 'user'
  };
  
  try {
    const response = await fetch(\`\${process.env.API_BASE_URL}/users\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.TEST_API_KEY}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error(\`Failed to create test user: \${response.statusText}\`);
    }
    
    const user = await response.json();
    return { ...userData, id: user.id };
  } catch (error) {
    console.warn('Test user creation failed:', error);
    // Return mock user for testing
    return {
      id: 'mock-user-id',
      ...userData
    };
  }
}

/**
 * Delete a test user
 */
async function deleteTestUser(userId${config.language === 'typescript' ? ': string' : ''}) {
  try {
    const response = await fetch(\`\${process.env.API_BASE_URL}/users/\${userId}\`, {
      method: 'DELETE',
      headers: {
        'Authorization': \`Bearer \${process.env.TEST_API_KEY}\`,
      }
    });
    
    if (!response.ok) {
      console.warn(\`Failed to delete test user \${userId}: \${response.statusText}\`);
    }
  } catch (error) {
    console.warn('Test user deletion failed:', error);
  }
}

export { expect } from '@playwright/test';`;

  return {
    path: `tests/fixtures/database.${ext}`,
    content,
    description: 'Database fixtures for test data management',
    category: 'fixture',
    language: config.language,
  };
}

function generateApiFixture(config: PreviewConfiguration): ProjectFile {
  const ext = config.language === 'typescript' ? 'ts' : 'js';
  const typeImports = config.language === 'typescript' 
    ? "import { test as baseTest, APIRequestContext } from '@playwright/test';"
    : "";
  const jsImports = config.language === 'javascript'
    ? "const { test: baseTest } = require('@playwright/test');"
    : "";

  const content = `${typeImports}${jsImports}

${config.language === 'typescript' ? `
export interface ApiFixtures {
  apiContext: APIRequestContext;
  authenticatedApiContext: APIRequestContext;
}
` : ''}

/**
 * API fixtures for API testing
 */
export const test = baseTest.extend${config.language === 'typescript' ? '<ApiFixtures>' : ''}({
  apiContext: async ({ playwright }, use) => {
    const apiContext = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL || 'http://localhost:3001/api',
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    await use(apiContext);
    await apiContext.dispose();
  },

  authenticatedApiContext: async ({ playwright }, use) => {
    // First, authenticate to get token
    const authContext = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL || 'http://localhost:3001/api',
    });
    
    const loginResponse = await authContext.post('/auth/login', {
      data: {
        email: process.env.TEST_EMAIL || 'admin@example.com',
        password: process.env.TEST_PASSWORD || 'password123'
      }
    });
    
    const { token } = await loginResponse.json();
    await authContext.dispose();
    
    // Create authenticated context
    const apiContext = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL || 'http://localhost:3001/api',
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${token}\`,
      },
    });
    
    await use(apiContext);
    await apiContext.dispose();
  },
});

/**
 * Helper function to create test data via API
 */
export async function createTestData(apiContext${config.language === 'typescript' ? ': APIRequestContext' : ''}, endpoint${config.language === 'typescript' ? ': string' : ''}, data${config.language === 'typescript' ? ': any' : ''}) {
  const response = await apiContext.post(endpoint, { data });
  
  if (!response.ok()) {
    throw new Error(\`Failed to create test data: \${response.statusText()}\`);
  }
  
  return await response.json();
}

/**
 * Helper function to cleanup test data via API
 */
export async function cleanupTestData(apiContext${config.language === 'typescript' ? ': APIRequestContext' : ''}, endpoint${config.language === 'typescript' ? ': string' : ''}, id${config.language === 'typescript' ? ': string' : ''}) {
  const response = await apiContext.delete(\`\${endpoint}/\${id}\`);
  
  if (!response.ok()) {
    console.warn(\`Failed to cleanup test data: \${response.statusText()}\`);
  }
}

/**
 * Helper function to validate API response
 */
export function validateApiResponse(response${config.language === 'typescript' ? ': any' : ''}, expectedSchema${config.language === 'typescript' ? ': any' : ''}) {
  // Basic validation - you can extend this with JSON schema validation
  const requiredFields = Object.keys(expectedSchema);
  
  for (const field of requiredFields) {
    if (!(field in response)) {
      throw new Error(\`Missing required field: \${field}\`);
    }
    
    const expectedType = expectedSchema[field];
    const actualType = typeof response[field];
    
    if (actualType !== expectedType) {
      throw new Error(\`Field \${field} should be \${expectedType}, got \${actualType}\`);
    }
  }
}

export { expect } from '@playwright/test';`;

  return {
    path: `tests/fixtures/api.${ext}`,
    content,
    description: 'API fixtures for API testing and data management',
    category: 'fixture',
    language: config.language,
  };
}

function generateBrowserFixture(config: PreviewConfiguration): ProjectFile {
  const ext = config.language === 'typescript' ? 'ts' : 'js';
  const typeImports = config.language === 'typescript' 
    ? "import { test as baseTest, Page, BrowserContext, devices } from '@playwright/test';"
    : "";
  const jsImports = config.language === 'javascript'
    ? "const { test: baseTest, devices } = require('@playwright/test');"
    : "";

  const content = `${typeImports}${jsImports}

${config.language === 'typescript' ? `
export interface BrowserFixtures {
  mobilePage: Page;
  tabletPage: Page;
  desktopPage: Page;
  slowNetworkPage: Page;
}
` : ''}

/**
 * Browser-specific fixtures for different device types
 */
export const test = baseTest.extend${config.language === 'typescript' ? '<BrowserFixtures>' : ''}({
  mobilePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();
    
    await use(page);
    
    await page.close();
    await context.close();
  },

  tabletPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      ...devices['iPad Pro'],
    });
    const page = await context.newPage();
    
    await use(page);
    
    await page.close();
    await context.close();
  },

  desktopPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    
    await use(page);
    
    await page.close();
    await context.close();
  },

  slowNetworkPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Simulate slow 3G network
    await page.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Add delay
      await route.continue();
    });
    
    await use(page);
    
    await page.close();
    await context.close();
  },
});

/**
 * Helper function to create custom browser context
 */
export async function createCustomContext(browser${config.language === 'typescript' ? ': any' : ''}, options${config.language === 'typescript' ? ': any' : ''} = {}) {
  const defaultOptions = {
    viewport: { width: 1280, height: 720 },
    userAgent: 'Playwright Test Agent',
    permissions: ['geolocation'],
    geolocation: { latitude: 37.7749, longitude: -122.4194 }, // San Francisco
  };
  
  return await browser.newContext({ ...defaultOptions, ...options });
}

/**
 * Helper function to simulate different network conditions
 */
export async function simulateNetworkCondition(page${config.language === 'typescript' ? ': Page' : ''}, condition${config.language === 'typescript' ? ': string' : ''}) {
  const conditions = {
    'slow-3g': { delay: 500, downloadThroughput: 500 * 1024 / 8, uploadThroughput: 500 * 1024 / 8 },
    'fast-3g': { delay: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 },
    'offline': { delay: 0, downloadThroughput: 0, uploadThroughput: 0 },
  };
  
  const networkCondition = conditions[condition];
  
  if (networkCondition) {
    await page.route('**/*', async (route) => {
      if (networkCondition.downloadThroughput === 0) {
        await route.abort('internetdisconnected');
      } else {
        await new Promise(resolve => setTimeout(resolve, networkCondition.delay));
        await route.continue();
      }
    });
  }
}

/**
 * Helper function to capture browser performance metrics
 */
export async function capturePerformanceMetrics(page${config.language === 'typescript' ? ': Page' : ''}) {
  return await page.evaluate(() => {
    const perfData = performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
      loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
      firstPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-paint')?.startTime,
      firstContentfulPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime,
    };
  });
}

export { expect } from '@playwright/test';`;

  return {
    path: `tests/fixtures/browser.${ext}`,
    content,
    description: 'Browser-specific fixtures for device and network testing',
    category: 'fixture',
    language: config.language,
  };
}

function generateTestDataFixture(config: PreviewConfiguration): ProjectFile {
  const ext = config.language === 'typescript' ? 'ts' : 'js';

  const content = `/**
 * Test data for automated tests
 */

// User test data
export const testUsers = {
  admin: {
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  },
  regularUser: {
    email: 'user@example.com',
    password: 'user123',
    name: 'Regular User',
    role: 'user'
  },
  testUser: {
    email: process.env.TEST_EMAIL || 'test@example.com',
    password: process.env.TEST_PASSWORD || 'testpass123',
    name: 'Test User',
    role: 'user'
  }
};

// Product test data
export const testProducts = [
  {
    id: 'prod-1',
    name: 'Test Product 1',
    price: 99.99,
    description: 'This is a test product for automation testing',
    category: 'electronics',
    inStock: true,
    images: ['/images/product1-1.jpg', '/images/product1-2.jpg']
  },
  {
    id: 'prod-2',
    name: 'Test Product 2',
    price: 149.99,
    description: 'Another test product for e-commerce testing',
    category: 'books',
    inStock: false,
    images: ['/images/product2-1.jpg']
  }
];

// Form test data
export const testFormData = {
  contact: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    message: 'This is a test message for contact form automation'
  },
  registration: {
    username: 'testuser123',
    email: 'testuser@example.com',
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!',
    firstName: 'Test',
    lastName: 'User',
    dateOfBirth: '1990-01-01',
    agreeToTerms: true
  }
};

// API test data
export const apiTestData = {
  validUser: {
    name: 'API Test User',
    email: 'apitest@example.com',
    role: 'user'
  },
  invalidUser: {
    name: '', // Invalid: empty name
    email: 'invalid-email', // Invalid: not a proper email
    role: 'invalid-role' // Invalid: not a valid role
  },
  updateUser: {
    name: 'Updated User Name',
    email: 'updated@example.com'
  }
};

// Test environment URLs
export const testUrls = {
  local: 'http://localhost:3000',
  dev: 'https://dev.example.com',
  staging: 'https://staging.example.com',
  production: 'https://example.com'
};

// Browser-specific test data
export const browserTestData = {
  userAgents: {
    chrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    firefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    safari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15'
  },
  viewports: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 }
  }
};

// Test timeouts
export const testTimeouts = {
  short: 5000,
  medium: 10000,
  long: 30000,
  api: 5000,
  pageLoad: 10000
};

// Test selectors
export const testSelectors = {
  common: {
    header: 'header',
    navigation: 'nav',
    footer: 'footer',
    loadingSpinner: '[data-testid="loading-spinner"]',
    errorMessage: '[data-testid="error-message"]',
    successMessage: '[data-testid="success-message"]'
  },
  forms: {
    submitButton: '[type="submit"]',
    cancelButton: '[data-testid="cancel-button"]',
    requiredField: '[required]',
    emailInput: 'input[type="email"]',
    passwordInput: 'input[type="password"]'
  },
  ecommerce: {
    productCard: '[data-testid="product-card"]',
    addToCartButton: '[data-testid="add-to-cart"]',
    cartIcon: '[data-testid="cart-icon"]',
    checkoutButton: '[data-testid="checkout-button"]',
    priceElement: '[data-testid="price"]'
  }
};

// Helper function to get random test data
export function getRandomTestData(type${config.language === 'typescript' ? ': string' : ''}) {
  const generators = {
    email: () => \`test\${Date.now()}@example.com\`,
    username: () => \`user\${Date.now()}\`,
    phone: () => \`+1\${Math.floor(Math.random() * 9000000000) + 1000000000}\`,
    name: () => {
      const names = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana'];
      return names[Math.floor(Math.random() * names.length)];
    },
    password: () => \`Pass\${Math.floor(Math.random() * 10000)}!\`,
  };
  
  return generators[type] ? generators[type]() : null;
}

// Helper function to get test data for specific environment
export function getEnvironmentData(env${config.language === 'typescript' ? ': string' : ''}) {
  const envData = {
    local: {
      baseUrl: testUrls.local,
      apiUrl: 'http://localhost:3001/api',
      timeout: testTimeouts.medium
    },
    dev: {
      baseUrl: testUrls.dev,
      apiUrl: 'https://api-dev.example.com',
      timeout: testTimeouts.long
    },
    staging: {
      baseUrl: testUrls.staging,
      apiUrl: 'https://api-staging.example.com',
      timeout: testTimeouts.long
    },
    production: {
      baseUrl: testUrls.production,
      apiUrl: 'https://api.example.com',
      timeout: testTimeouts.short
    }
  };
  
  return envData[env] || envData.local;
}`;

  return {
    path: `test-data/testData.${ext}`,
    content,
    description: 'Test data constants and helpers',
    category: 'fixture',
    language: config.language,
  };
}