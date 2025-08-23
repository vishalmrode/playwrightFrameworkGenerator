/**
 * generateFramework.ts
 * Purpose: Build a ZIP containing a minimal Playwright test framework based on
 * the provided GenerateState. This file contains small string-based generators
 * for Playwright config, tests, fixtures, and helper utilities. Keep generators
 * simple and free of runtime side-effects; consumers call `generateFramework`.
 */
import { getLanguageExtension } from '@/lib/SelectProgrammingLanguage';
import type { CIPipelineState, WorkflowConfig } from '@/types/ciPipeline';

import JSZip from 'jszip';
export interface GenerationProgress {
  progress: number;
  message: string;
}

type ProgrammingLanguage = 'javascript' | 'typescript';

export interface BrowserConfig {
  viewport?: { width: number; height: number };
  deviceScaleFactor?: number;
  isMobile?: boolean;
  recordVideo?: boolean;
  recordHar?: boolean;
}

export type GenerateState = {
  language: { selectedLanguage: ProgrammingLanguage | null };
  browser: {
    selectedBrowsers: { [key: string]: boolean };
    configurations?: BrowserConfig;
  };
  testingCapabilities: { [key: string]: boolean };
  environment: { baseUrl?: string; apiUrl?: string; selectedEnvNames?: string[]; projects?: { name: string; baseUrl?: string; apiUrl?: string }[] };
  ciPipeline: CIPipelineState;
  docker: { 
    enabled: boolean;
    baseImage?: string;
    customCommands?: string[];
  };
  integrations: { [key: string]: { enabled: boolean } };
  fixtures?: { pageObjectPatterns?: { enabled: boolean; id: string; name: string; }[] };
  ui: { theme: 'light' | 'dark' };
};

export async function generateFramework(state: GenerateState, onProgress: (progress: GenerationProgress) => void): Promise<Blob | Buffer> {
  if (!state.language?.selectedLanguage) throw new Error('No programming language selected');
  if (!Object.values(state.browser.selectedBrowsers).some(Boolean)) throw new Error('No browsers selected for testing');

  const zip = new JSZip();
  try {
    onProgress({ progress: 10, message: 'Initializing...' });

    zip.file('package.json', JSON.stringify(generatePackageJson(state), null, 2));
    onProgress({ progress: 20, message: 'package.json generated' });

    const ext = getLanguageExtension(state.language.selectedLanguage || 'javascript');
    zip.file(`playwright.config.${ext}`, generatePlaywrightConfig(state));
    onProgress({ progress: 30, message: 'Playwright config generated' });

    await generateTestExamples(zip, state);
    onProgress({ progress: 50, message: 'Test examples generated' });

    if (state.ciPipeline?.enabled) {
      zip.file('.github/workflows/playwright.yml', generateGithubWorkflow(state));
      zip.file('.github/workflows/pr-checks.yml', generateGithubPrChecks(state.ciPipeline.workflows?.[0] || {}));
      zip.file('.github/workflows/nightly.yml', generateGithubNightly(state.ciPipeline.workflows?.[1] || {}));
      if (Array.isArray(state.ciPipeline.workflows)) {
        const defaultNames = ['playwright', 'pr-checks', 'nightly'];
        for (const workflow of state.ciPipeline.workflows) {
          if (workflow && workflow.name) {
            const sanitized = workflow.name.replace(/[^a-z0-9-_\\.]/gi, '-').toLowerCase();
            if (!defaultNames.includes(sanitized.replace(/\\.yml$/, ''))) {
              zip.file(`.github/workflows/${sanitized}.yml`, generateWorkflowContent(workflow));
            }
          }
        }
      }
      onProgress({ progress: 60, message: 'CI workflows generated' });
    }

    if (state.docker?.enabled) {
      zip.file('Dockerfile', generateDockerfile(state));
      zip.file('.dockerignore', generateDockerignore());
      zip.file('docker/docker-compose.dev.yml', generateDockerComposeDev());
      zip.file('docker/docker-compose.test.yml', generateDockerComposeTest());
      zip.file('docker/.env.docker', generateDockerEnv());
      onProgress({ progress: 80, message: 'Docker files generated' });
    }

    zip.file('.env.example', generateEnvExample(state));
    onProgress({ progress: 80, message: 'Environment files generated' });

    const envObj = (state.environment as any).environments;
    if (envObj && typeof envObj === 'object') {
      const names = Object.keys(envObj).filter((k) => (envObj as any)[k]);
      for (const name of names) {
        const sanitized = name.replace(/[^a-z0-9-_\.]/gi, '-').toLowerCase();
        zip.file(`.env.${sanitized}`, generateEnvExampleForName(state, name));
      }
    }

    const selectedNames = state.environment.selectedEnvNames || [];
    if (selectedNames.length > 0 && state.ciPipeline) {
      for (const name of selectedNames) {
        const sanitized = name.replace(/[^a-z0-9-_\.]/gi, '-').toLowerCase();
        zip.file(`.env.${sanitized}.example`, generateEnvExampleForName(state, name));
      }
    }

    zip.file('README.md', generateReadme(state));
    onProgress({ progress: 90, message: 'README generated' });

    const isNode = typeof process !== 'undefined' && !!(process.versions && process.versions.node);
    const outType: 'nodebuffer' | 'blob' = isNode ? 'nodebuffer' : 'blob';
    const blob = await zip.generateAsync({ type: outType as any });
    onProgress({ progress: 100, message: 'Framework generation complete!' });
    return blob;
  } catch (err) {
    console.error('generateFramework error', err);
    throw new Error('Failed to generate framework');
  }
}

function generatePackageJson(state: GenerateState) {
  const isTS = state.language.selectedLanguage === 'typescript';
  const deps: Record<string,string> = {
    '@playwright/test': '^1.41.2'
  };
  const devDeps: Record<string,string> = {};
  includeIntegrationDependencies(state, deps);
  if (isTS) {
    devDeps.typescript = '^5.3.3';
    devDeps['@types/node'] = '^20.0.0';
  }

  return {
    name: 'playwright-framework',
    version: '0.1.0',
    private: true,
    scripts: {
      test: 'playwright test',
      'test:ui': 'playwright test --ui'
    },
    dependencies: deps,
    devDependencies: devDeps
  };
}

function includeIntegrationDependencies(state: GenerateState, deps: Record<string,string>) {
  const ints = state.integrations || {};
  if (ints['allure-reporter'] && ints['allure-reporter'].enabled) deps['allure-playwright'] = '^2.0.0';
  if (ints['cucumber'] && ints['cucumber'].enabled) deps['@cucumber/cucumber'] = '^8.0.0';
  if (ints['faker'] && ints['faker'].enabled) deps['@faker-js/faker'] = '^8.0.0';
  if (ints['junit'] && ints['junit'].enabled) deps['junit-reporters'] = '^1.0.0';
}

function generatePlaywrightConfig(state: GenerateState) {
  const ext = state.language.selectedLanguage === 'typescript' ? 'ts' : 'js';
  // FIX: Use flat array of strings for simple reporters, array only for reporters with options
  const reporters: any[] = [];
  if (state.integrations && state.integrations['allure-reporter'] && state.integrations['allure-reporter'].enabled) reporters.push('allure-playwright');
  if (state.integrations && state.integrations['junit'] && state.integrations['junit'].enabled) reporters.push(['junit', { outputFile: "results.xml" }]);
  reporters.push('list');
  reporters.push(['html', { outputFolder: "playwright-report" }]);

  const projects = [];
  const selected = state.browser.selectedBrowsers || {};
  Object.keys(selected).forEach((b) => {
    if (selected[b]) {
      // Always include all browser config options in use object
      const cfg = state.browser.configurations || {};
      const use: any = {
        browserName: b,
        viewport: cfg.viewport,
        deviceScaleFactor: cfg.deviceScaleFactor,
        isMobile: cfg.isMobile,
        recordVideo: cfg.recordVideo,
        recordHar: cfg.recordHar,
      };
      projects.push({ name: b, use });
    }
  });

  // Compose config as a string with all options and comments
  let configStr = '';
  if (ext === 'ts') {
    configStr += `import { defineConfig, devices } from '@playwright/test';\n\n`;
    configStr += `/**\n * Comprehensive Playwright configuration file\n * For all options, see: https://playwright.dev/docs/test-configuration\n */\n`;
    configStr += `export default defineConfig({\n`;
  } else {
    configStr += `const { defineConfig, devices } = require('@playwright/test');\n\n`;
    configStr += `/**\n * Comprehensive Playwright configuration file\n * For all options, see: https://playwright.dev/docs/test-configuration\n */\n`;
    configStr += `module.exports = defineConfig({\n`;
  }
  configStr += `  // Directory with test files\n  testDir: './tests',\n`;
  configStr += `  // Directory with feature files (for BDD)\n  featureRoot: './features', // <-- custom, for Cucumber integration\n`;
  configStr += `  // Directory with step definitions (for BDD)\n  stepDefinitions: './tests/steps', // <-- custom, for Cucumber integration\n`;
  configStr += `  // Run tests in files in parallel\n  fullyParallel: true,\n`;
  configStr += `  // Fail the build on CI if you accidentally left test.only in the source code.\n  forbidOnly: !!process.env.CI,\n`;
  configStr += `  // Retry on CI only\n  retries: process.env.CI ? 2 : 0,\n`;
  configStr += `  // Opt out of parallel tests on CI.\n  workers: process.env.CI ? 1 : undefined,\n`;
  configStr += `  // Reporter(s) to use. See https://playwright.dev/docs/test-reporters\n  reporter: ${JSON.stringify(reporters, null, 2)},\n`;
  configStr += `  // Projects for different browsers\n  projects: ${JSON.stringify(projects, null, 2)},\n`;
  configStr += `  // Shared settings for all tests\n  use: {\n`;
  configStr += `    // Base URL for actions like page.goto()\n    baseURL: process.env.BASE_URL || '${state.environment.baseUrl || 'http://localhost:3000'}',\n`;
  configStr += `    // headless: true, // Run tests in headless mode\n`;
  configStr += `    // viewport: { width: 1280, height: 720 },\n`;
  configStr += `    // ignoreHTTPSErrors: true, // Ignore HTTPS errors\n`;
  configStr += `    // video: 'on', // Record video for each test\n`;
  configStr += `    // screenshot: 'only-on-failure', // Take screenshot only on failure\n`;
  configStr += `    // trace: 'on-first-retry', // Collect trace on first retry\n`;
  configStr += `    // actionTimeout: 0, // No limit\n`;
  configStr += `    // navigationTimeout: 30000, // ms\n`;
  configStr += `  },\n`;
  configStr += `  // Output directory for test results\n  outputDir: 'test-results/',\n`;
  configStr += `  // Global setup/teardown files\n  // globalSetup: './global-setup',\n  // globalTeardown: './global-teardown',\n`;
  configStr += `  // Hooks\n  // retries: 0,\n  // workers: 1,\n`;
  configStr += `  // Web server config (optional, for dev server)\n  webServer: {\n    command: 'npm run dev',\n    url: '${state.environment.baseUrl || 'http://localhost:3000'}',\n    reuseExistingServer: !process.env.CI,\n  },\n`;
  configStr += `});\n`;
  return configStr;
}

async function generateTestExamples(zip: JSZip, state: GenerateState) {
  const ext = getLanguageExtension(state.language.selectedLanguage || 'javascript');
  const add = (path: string, content: string) => zip.file(path.replace(/\\/g, '/'), content);
  add(`tests/api/example.api.spec.${ext}`, generateApiGetExample(ext));

  // --- Cucumber/BDD Support ---
  if (state.integrations && state.integrations['cucumber'] && state.integrations['cucumber'].enabled) {
    add('features/sample.feature', generateSampleFeatureFile());
    add(`tests/steps/sample.steps.${ext}`, generateSampleStepDefinitions(ext));
  }

  // --- Pages and Tests ---
  add(`tests/pages/example.page.${ext}`, generatePageObjectExample(state));
  add(`tests/example.spec.${ext}`, generateUITestExample());

  // --- API Sample Files ---
  if (state.testingCapabilities.apiTesting) {
    add(`tests/api/get.api.spec.${ext}`, generateApiGetExample(ext));
    add(`tests/api/post.api.spec.${ext}`, generateApiPostExample(ext));
    add(`tests/api/put.api.spec.${ext}`, generateApiPutExample(ext));
    add(`tests/api/delete.api.spec.${ext}`, generateApiDeleteExample(ext));
    add(`tests/api/client/api-client.${ext}`, generateAPIClientExample(state));
    add(`tests/api/client/endpoints.${ext}`, generateAPIEndpointsExample(state));
    if (state.language.selectedLanguage === 'typescript') {
      zip.file('tests/api/models/auth.model.ts', generateAuthModelExample());
      zip.file('tests/api/models/user.model.ts', generateUserModelExample());
      zip.file('tests/api/models/response.model.ts', generateResponseModelExample());
    }
    add(`tests/api/client/api-client.ts`, generateAPIClientExample(state));
  }

  const testBaseContent = generateTestBaseClass(state);
  if (testBaseContent !== undefined) {
    add(`tests/utils/test-base.${ext}`, testBaseContent);
  }
  add(`tests/utils/test-helpers.${ext}`, generateTestHelpersExample(state));
  add(`tests/utils/test-data.${ext}`, generateTestDataExample(state));

  zip.file('tests/fixtures/auth.fixture.ts', generateAuthFixture());
  zip.file('tests/fixtures/data.fixture.ts', generateDataFixture());

  if (state.testingCapabilities.visualTesting) {
    add(`tests/visual/layout.spec.${ext}`, generateVisualTestExample(state));
    add(`tests/visual/components.spec.${ext}`, generateComponentVisualTestExample(state));
  }

  if (state.testingCapabilities.accessibilityTesting) {
    add(`tests/accessibility/a11y.spec.${ext}`, generateA11yTestExample(state));
    add(`tests/accessibility/wcag.spec.${ext}`, generateWCAGTestExample(state));
  }

  if (state.testingCapabilities.performanceTesting) {
    add(`tests/performance/metrics.spec.${ext}`, generatePerformanceTestExample(state));
    add(`tests/performance/lighthouse.spec.${ext}`, generateLighthouseTestExample(state));
  }
}

// --- Cucumber/BDD Generators ---
function generateSampleFeatureFile() {
  return `Feature: Sample BDD Feature

  Scenario: User visits homepage
    Given the user is on the homepage
    When the user sees the welcome message
    Then the welcome message should be visible`;
}

function generateSampleStepDefinitions(ext: string) {
  if (ext === 'ts') {
    return `import { Given, When, Then } from '@cucumber/cucumber';
import { expect, Page } from '@playwright/test';

let page: Page;

Given('the user is on the homepage', async function () {
  page = await this.browser.newPage();
  await page.goto('http://localhost:3000');
});

When('the user sees the welcome message', async function () {
  // No-op, just for demonstration
});

Then('the welcome message should be visible', async function () {
  const message = await page.getByTestId('welcome-message');
  await expect(message).toBeVisible();
});
`;
  } else {
    return `const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test';

let page;

Given('the user is on the homepage', async function () {
  page = await this.browser.newPage();
  await page.goto('http://localhost:3000');
});

When('the user sees the welcome message', async function () {
  // No-op
});

Then('the welcome message should be visible', async function () {
  const message = await page.getByTestId('welcome-message');
  await expect(message).toBeVisible();
});
`;
  }
}

// --- API Sample Generators ---
function generateApiGetExample(ext: string) {
  return ext === 'ts'
    ? `import { test, expect, request } from '@playwright/test';

test('GET /api/users returns user list', async () => {
  const req = await request.newContext();
  const response = await req.get('http://localhost:3000/api/users');
  expect(response.ok()).toBeTruthy();
  const users = await response.json();
  expect(Array.isArray(users)).toBe(true);
});
`
    : `const { test, expect, request } = require('@playwright/test';

test('GET /api/users returns user list', async () => {
  const req = await request.newContext();
  const response = await req.get('http://localhost:3000/api/users');
  expect(response.ok()).toBeTruthy();
  const users = await response.json();
  expect(Array.isArray(users)).toBe(true);
});
`;
}

function generateApiPostExample(ext: string) {
  return ext === 'ts'
    ? `import { test, expect, request } from '@playwright/test';

test('POST /api/users creates a user', async () => {
  const req = await request.newContext();
  const response = await req.post('http://localhost:3000/api/users', {
    data: { email: 'newuser@example.com', password: 'password123' }
  });
  expect(response.ok()).toBeTruthy();
  const user = await response.json();
  expect(user.email).toBe('newuser@example.com');
});
`
    : `const { test, expect, request } = require('@playwright/test';

test('POST /api/users creates a user', async () => {
  const req = await request.newContext();
  const response = await req.post('http://localhost:3000/api/users', {
    data: { email: 'newuser@example.com', password: 'password123' }
  });
  expect(response.ok()).toBeTruthy();
  const user = await response.json();
  expect(user.email).toBe('newuser@example.com');
});
`;
}

function generateApiPutExample(ext: string) {
  return ext === 'ts'
    ? `import { test, expect, request } from '@playwright/test';

test('PUT /api/users/1 updates a user', async () => {
  const req = await request.newContext();
  const response = await req.put('http://localhost:3000/api/users/1', {
    data: { name: 'Updated User' }
  });
  expect(response.ok()).toBeTruthy();
  const user = await response.json();
  expect(user.name).toBe('Updated User');
});
`
    : `const { test, expect, request } = require('@playwright/test';

test('PUT /api/users/1 updates a user', async () => {
  const req = await request.newContext();
  const response = await req.put('http://localhost:3000/api/users/1', {
    data: { name: 'Updated User' }
  });
  expect(response.ok()).toBeTruthy();
  const user = await response.json();
  expect(user.name).toBe('Updated User');
});
`;
}

function generateApiDeleteExample(ext: string) {
  return ext === 'ts'
    ? `import { test, expect, request } from '@playwright/test';

test('DELETE /api/users/1 deletes a user', async () => {
  const req = await request.newContext();
  const response = await req.delete('http://localhost:3000/api/users/1');
  expect(response.ok()).toBeTruthy();
});
`
    : `const { test, expect, request } = require('@playwright/test';

test('DELETE /api/users/1 deletes a user', async () => {
  const req = await request.newContext();
  const response = await req.delete('http://localhost:3000/api/users/1');
  expect(response.ok()).toBeTruthy();
});
`;
}


// --- Add your other helper functions here (generatePageObjectExample, generateUITestExample, etc.) ---
// (Keep your other helper functions as in your current file)
function generateDockerfile(state: GenerateState) {
  const base = state.docker?.baseImage || 'mcr.microsoft.com/playwright:v1.41.2-focal';
  const custom = (state.docker?.customCommands || []).join('\n');
  return `FROM ${base}
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
${custom ? custom + '\n' : ''}CMD ["npx", "playwright", "test"]
`;
}

function generateDockerignore() {
  return `node_modules
test-results
playwright-report
*.log
*.tsbuildinfo
.env*
`;
}

function generateDockerComposeDev() {
  return `version: '3.8'
services:
  playwright:
    build: .
    command: npx playwright test --ui
    volumes:
      - .:/app
    ports:
      - 9323:9323
`;
}

function generateDockerComposeTest() {
  return `version: '3.8'
services:
  playwright:
    build: .
    command: npx playwright test
    volumes:
      - .:/app
`;
}

function generateDockerEnv() {
  return `# Docker environment variables
NODE_ENV=development
`;
}

function generatePageObjectExample(state: GenerateState) {
  const ext = getLanguageExtension(state.language.selectedLanguage || 'javascript');
  if (ext === 'ts') {
    return `import { Page } from '@playwright/test';

export class ExamplePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async getWelcomeMessage() {
    return this.page.getByTestId('welcome-message');
  }
}
`;
  } else {
    return `class ExamplePage {
  constructor(page) {
    this.page = page;
  }
  async goto() {
    await this.page.goto('/');
  }
  async getWelcomeMessage() {
    return this.page.getByTestId('welcome-message');
  }
}
module.exports = { ExamplePage };
`;
  }
}

function generateUITestExample() {
  return `import { test, expect } from '@playwright/test';
import { ExamplePage } from './pages/example.page';

test('homepage shows welcome message', async ({ page }) => {
  const home = new ExamplePage(page);
  await home.goto();
  const message = await home.getWelcomeMessage();
  await expect(message).toBeVisible();
});
`;
}

function generateAPIClientExample(state: GenerateState) {
  const ext = getLanguageExtension(state.language.selectedLanguage || 'javascript');
  if (ext === 'ts') {
    return `import { request, APIRequestContext } from '@playwright/test';

export class APIClient {
  private context: APIRequestContext;
  constructor() {}
  async init() {
    this.context = await request.newContext();
  }
  async getUsers() {
    return this.context.get('/api/users');
  }
  async createUser(data: any) {
    return this.context.post('/api/users', { data });
  }
  async updateUser(id: string, data: any) {
    return this.context.put(\`/api/users/\${id}\`, { data });
  }
  async deleteUser(id: string) {
    return this.context.delete(\`/api/users/\${id}\`);
  }
}
`;
  } else {
    return `const { request } = require('@playwright/test');
class APIClient {
  async init() {
    this.context = await request.newContext();
  }
  async getUsers() {
    return this.context.get('/api/users');
  }
  async createUser(data) {
    return this.context.post('/api/users', { data });
  }
  async updateUser(id, data) {
    return this.context.put(\`/api/users/\${id}\`, { data });
  }
  async deleteUser(id) {
    return this.context.delete(\`/api/users/\${id}\`);
  }
}
module.exports = { APIClient };
`;
  }
}

function generateAPIEndpointsExample(state: GenerateState) {
  return `export const endpoints = {
  users: '/api/users',
  user: (id) => "/api/users/" + id
};
`;
}

function generateAuthModelExample() {
  return `export interface AuthModel {
  token: string;
  refreshToken?: string;
}
`;
}

function generateUserModelExample() {
  return `export interface UserModel {
  id: string;
  email: string;
  name?: string;
}
`;
}

function generateResponseModelExample() {
  return `export interface ResponseModel<T> {
  data: T;
  error?: string;
}
`;
}

function generateTestBaseClass(state: GenerateState) {
  const ext = getLanguageExtension(state.language.selectedLanguage || 'javascript');
if (ext === 'ts') {
  return `import { test as base, type Page } from '@playwright/test';

type TestFixtures = {
  page: Page;
  // Add more fixtures here
};

export const test = base.extend<TestFixtures>({
  // Add custom fixtures here
});
`;
}
  }

function generateTestHelpersExample(state: GenerateState) {
  return `export function randomEmail() {
  return \`user_\${Math.random().toString(36).slice(2, 8)}@example.com\`;
}
`;
}

function generateTestDataExample(state: GenerateState) {
  return `export const testUser = {
  email: 'testuser@example.com',
  password: 'password123'
};
`;
}

function generateAuthFixture() {
  return `import { test as base } from '@playwright/test';

export const test = base.extend({
  authToken: async ({}, use) => {
    // Implement auth token retrieval
    await use('fake-token');
  }
});
`;
}

function generateDataFixture() {
  return `import { test as base } from '@playwright/test';

export const test = base.extend({
  testData: async ({}, use) => {
    // Provide test data
    await use({ user: { email: 'testuser@example.com' } });
  }
});
`;
}

function generateVisualTestExample(state: GenerateState) {
  return `import { test, expect } from '@playwright/test';

test('visual regression: homepage', async ({ page }) => {
  await page.goto('/');
  expect(await page.screenshot()).toMatchSnapshot('homepage.png');
});
`;
}

function generateComponentVisualTestExample(state: GenerateState) {
  return `import { test, expect } from '@playwright/test';

test('visual regression: button', async ({ page }) => {
  await page.goto('/components/button');
  expect(await page.screenshot()).toMatchSnapshot('button.png');
});
`;
}

function generateA11yTestExample(state: GenerateState) {
  return `import { test, expect } from '@playwright/test';

test('homepage is accessible', async ({ page }) => {
  await page.goto('/');
  // Add a11y checks here
  expect(true).toBe(true);
});
`;
}

function generateWCAGTestExample(state: GenerateState) {
  return `import { test, expect } from '@playwright/test';

test('homepage meets WCAG', async ({ page }) => {
  await page.goto('/');
  // Add WCAG checks here
  expect(true).toBe(true);
});
`;
}

function generatePerformanceTestExample(state: GenerateState) {
  return `import { test, expect } from '@playwright/test';

test('homepage performance', async ({ page }) => {
  await page.goto('/');
  // Add performance checks here
  expect(true).toBe(true);
});
`;
}

function generateLighthouseTestExample(state: GenerateState) {
  return `import { test, expect } from '@playwright/test';

test('homepage lighthouse', async ({ page }) => {
  await page.goto('/');
  // Add lighthouse checks here
  expect(true).toBe(true);
});
`;
}

export function generateEnvExample(state: GenerateState) {
  return `# Example environment variables
BASE_URL=${state.environment.baseUrl || 'http://localhost:3000'}
API_BASE_URL=${state.environment.apiUrl || 'http://localhost:3000/api'}
API_KEY=your-api-key-here
FEATURE_FLAGS=flag1,flag2
`;
}

export function generateEnvExampleForName(state: GenerateState, name: string) {
  let baseUrl = state.environment.baseUrl || 'http://localhost:3000';
  let apiUrl = state.environment.apiUrl || 'http://localhost:3000/api';
  if (Array.isArray(state.environment.projects)) {
    const proj = state.environment.projects.find(p => p.name === name);
    if (proj) {
      baseUrl = proj.baseUrl || baseUrl;
      apiUrl = proj.apiUrl || apiUrl;
    }
  }
  return `# Environment: ${name}
BASE_URL=${baseUrl}
API_BASE_URL=${apiUrl}
API_KEY=your-api-key-here
FEATURE_FLAGS=flag1,flag2
`;
}

function generateReadme(state: GenerateState) {
  return `# Playwright Test Framework

Generated with Playwright Framework Generator.

## Scripts

- \`npm test\` - Run all tests
- \`npm run test:ui\` - Run tests in UI mode

## Getting Started

1. Install dependencies: \`npm install\`
2. Run tests: \`npm test\`
`;
}

function generateWorkflowContent(workflow: WorkflowConfig) {
  return toYAML(workflow);
}

function generateGithubWorkflow(state: GenerateState) {
  return `name: Playwright Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20
      - name: Install dependencies
        run: npm install
      - name: Run Playwright tests
        run: npx playwright test
`;
}

function generateGithubPrChecks(workflow: WorkflowConfig) {
  return `name: PR Checks
on: [pull_request]
jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm install
      - name: Run Playwright tests
        run: npx playwright test
`;
}

function generateGithubNightly(workflow: WorkflowConfig) {
  return `name: Nightly Tests
on:
  schedule:
    - cron: '0 0 * * *'
jobs:
  nightly:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm install
      - name: Run Playwright tests
        run: npx playwright test
`;
}

function toYAML(obj: any, indent = 0): string {
  if (typeof obj !== 'object' || obj === null) return String(obj);
  const pad = '  '.repeat(indent);
  if (Array.isArray(obj)) {
    return obj.map((v) => pad + '- ' + toYAML(v, indent + 1)).join('\n');
  }
  return Object.entries(obj)
    .map(([k, v]) => {
      if (typeof v === 'object' && v !== null) {
        return pad + k + ':\n' + toYAML(v, indent + 1);
      } else {
        return pad + k + ': ' + String(v);
      }
    })
    .join('\n');
}

// Use the exported versions directly