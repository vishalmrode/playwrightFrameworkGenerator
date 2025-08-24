// --- Types ---
export type GenerateState = {
  language: { selectedLanguage: string };
  browser: { selectedBrowsers: Record<string, boolean> };
  testingCapabilities: Record<string, boolean>;
  environment: { baseUrl: string; apiUrl?: string; environments?: any[] };
  ciPipeline: any;
  docker: any;
  integrations: any;
  fixtures: any;
  ui: { theme: string };
};

// --- Main generator function ---
import JSZip from 'jszip';
export async function generateFramework(state: GenerateState, onProgress: (progress: GenerationProgress) => void): Promise<Blob | Buffer> {
  // Placeholder implementation: create a zip with a README
  const zip = new JSZip();
  zip.file('README.md', '# Playwright Test Framework\nGenerated with Playwright Framework Generator.');
  onProgress({ progress: 100, message: 'Framework generated.' });
  // Return as Blob (browser) or Buffer (Node)
  if (typeof window !== 'undefined' && window.Blob) {
    return await zip.generateAsync({ type: 'blob' });
  } else {
    return await zip.generateAsync({ type: 'nodebuffer' });
  }
}
/**
 * generateFramework.ts
 * Purpose: Build a ZIP containing a minimal Playwright test framework based on
 * the provided GenerateState. This file contains small string-based generators
 * for Playwright config, tests, fixtures, and helper utilities. Keep generators
 * simple and free of runtime side-effects; consumers call `generateFramework`.
 */

import { getLanguageExtension } from '@/lib/SelectProgrammingLanguage';
import type JSZip from 'jszip';
import type { GenerationProgress } from './generateFramework';
import type { CIPipelineState } from '@/types/ci';
import type { WorkflowConfig } from '@/types/ci';
import type { BrowserConfig } from '@/types/browser';
import type { RootState } from '@/types/state';

// removed stray C# and Java BDD code fragments


// removed stray Java BDD code fragment

// Suppress unused function warnings for generator utilities (these are used dynamically)
// eslint-disable-next-line @typescript-eslint/no-unused-vars

// --- API Sample Generators ---
function generateApiGetExample(ext: string) {
  if (ext === 'ts') {
    return `import { test, expect, request } from '@playwright/test';

test('GET /api/users returns user list', async () => {
  const req = await request.newContext();
  const response = await req.get('http://localhost:3000/api/users');
  expect(response.ok()).toBeTruthy();
  const users = await response.json();
  expect(Array.isArray(users)).toBe(true);
});
`;
  } else if (ext === 'js') {
    return `const { test, expect, request } = require('@playwright/test');

test('GET /api/users returns user list', async () => {
  const req = await request.newContext();
  const response = await req.get('http://localhost:3000/api/users');
  expect(response.ok()).toBeTruthy();
  const users = await response.json();
  expect(Array.isArray(users)).toBe(true);
});
`;
  } else if (ext === 'py') {
    return `import pytest
from playwright.sync_api import sync_playwright

def test_get_users():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        response = page.request.get('http://localhost:3000/api/users')
        assert response.ok
        users = response.json()
        assert isinstance(users, list)
        browser.close()
`;
  } else if (ext === 'cs') {
    return `using NUnit.Framework;
using Microsoft.Playwright;
using System.Threading.Tasks;

[TestFixture]
public class ApiTests {
    [Test]
    public async Task GetUsers_ReturnsUserList() {
        using var playwright = await Playwright.CreateAsync();
        var browser = await playwright.Chromium.LaunchAsync();
        var context = await browser.NewContextAsync();
        var response = await context.Request.GetAsync("http://localhost:3000/api/users");
        Assert.IsTrue(response.Ok);
        // Add JSON parsing/assertion as needed
        await browser.CloseAsync();
    }
}
`;
  } else if (ext === 'java') {
    return `import com.microsoft.playwright.*;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

public class ApiTests {
    @Test
    void getUsersReturnsUserList() {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch();
            BrowserContext context = browser.newContext();
            APIResponse response = context.request().get("http://localhost:3000/api/users");
            assertTrue(response.ok());
            // Add JSON parsing/assertion as needed
            browser.close();
        }
    }
}
`;
  } else {
    return '// Language not supported yet.';
  }
}


// --- Add your other helper functions here (generatePageObjectExample, generateUITestExample, etc.) ---
// (Keep your other helper functions as in your current file)
function generateDockerfile(state: RootState) {
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

function generatePageObjectExample(state: RootState) {
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
  } else if (ext === 'js') {
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
  } else if (ext === 'py') {
    return `class ExamplePage:
    def __init__(self, page):
        self.page = page

    def goto(self):
        self.page.goto('/')

    def get_welcome_message(self):
        return self.page.locator('[data-testid="welcome-message"]')
`;
  } else if (ext === 'cs') {
    return `public class ExamplePage {
    private IPage page;
    public ExamplePage(IPage page) {
        this.page = page;
    }
    public async Task Goto() {
        await page.GotoAsync("/");
    }
    public ILocator GetWelcomeMessage() {
        return page.Locator("[data-testid=welcome-message]");
    }
}
`;
  } else if (ext === 'java') {
    return `public class ExamplePage {
    private Page page;
    public ExamplePage(Page page) {
        this.page = page;
    }
    public void gotoPage() {
        page.navigate("/");
    }
    public Locator getWelcomeMessage() {
        return page.locator("[data-testid=welcome-message]");
    }
}
`;
  } else {
    return '# Language not supported yet.';
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

function generateAPIClientExample(state: RootState) {
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

function generateAPIEndpointsExample(state: RootState) {
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

function generateTestBaseClass(state: RootState) {
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

function generateTestHelpersExample(state: RootState) {
  return `export function randomEmail() {
  return \`user_\${Math.random().toString(36).slice(2, 8)}@example.com\`;
}
`;
}

function generateTestDataExample(state: RootState) {
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

function generateVisualTestExample(state: RootState) {
  return `import { test, expect } from '@playwright/test';

test('visual regression: homepage', async ({ page }) => {
  await page.goto('/');
  expect(await page.screenshot()).toMatchSnapshot('homepage.png');
});
`;
}

function generateComponentVisualTestExample(state: RootState) {
  return `import { test, expect } from '@playwright/test';

test('visual regression: button', async ({ page }) => {
  await page.goto('/components/button');
  expect(await page.screenshot()).toMatchSnapshot('button.png');
});
`;
}

function generateA11yTestExample(state: RootState) {
  return `import { test, expect } from '@playwright/test';

test('homepage is accessible', async ({ page }) => {
  await page.goto('/');
  // Add a11y checks here
  expect(true).toBe(true);
});
`;
}

function generateWCAGTestExample(state: RootState) {
  return `import { test, expect } from '@playwright/test';

test('homepage meets WCAG', async ({ page }) => {
  await page.goto('/');
  // Add WCAG checks here
  expect(true).toBe(true);
});
`;
}

function generatePerformanceTestExample(state: RootState) {
  return `import { test, expect } from '@playwright/test';

test('homepage performance', async ({ page }) => {
  await page.goto('/');
  // Add performance checks here
  expect(true).toBe(true);
});
`;
}

function generateLighthouseTestExample(state: RootState) {
  return `import { test, expect } from '@playwright/test';

test('homepage lighthouse', async ({ page }) => {
  await page.goto('/');
  // Add lighthouse checks here
  expect(true).toBe(true);
});
`;
}

export function generateEnvExample(state: RootState) {
  return `# Example environment variables
BASE_URL=${state.environment.baseUrl || 'http://localhost:3000'}
API_BASE_URL=${state.environment.apiUrl || 'http://localhost:3000/api'}
API_KEY=your-api-key-here
FEATURE_FLAGS=flag1,flag2
`;
}

export function generateEnvExampleForName(state: RootState, name: string) {
  let baseUrl = state.environment.baseUrl || 'http://localhost:3000';
  let apiUrl = state.environment.apiUrl || 'http://localhost:3000/api';
  if (Array.isArray(state.environment.environments)) {
    const env = state.environment.environments.find(e => e.name === name);
    if (env) {
      baseUrl = env.baseUrl || baseUrl;
      // If you have apiUrl per environment, add it here. Otherwise, keep as is.
    }
  }
  return `# Environment: ${name}
BASE_URL=${baseUrl}
API_BASE_URL=${apiUrl}
API_KEY=your-api-key-here
FEATURE_FLAGS=flag1,flag2
`;
}

function generateReadme(state: RootState) {
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

function generateGithubWorkflow(state: RootState) {
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

// Export main generator and types for consumers
export type { GenerationProgress };
export type { CIPipelineState, WorkflowConfig, BrowserConfig, RootState };
// If generateFramework is defined elsewhere, export it here. If not, define and export it.
// Example placeholder (replace with actual implementation if needed):
// export function generateFramework(state: RootState, progress?: (p: GenerationProgress) => void) { /* ... */ }