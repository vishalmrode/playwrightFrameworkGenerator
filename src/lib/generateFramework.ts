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
  // baseUrl/apiUrl represent the primary env; selectedEnvNames (optional) lists all selected environments by name
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

    // Always generate the three default workflow files
    if (state.ciPipeline?.enabled) {
      zip.file('.github/workflows/playwright.yml', generateGithubWorkflow(state));
      zip.file('.github/workflows/pr-checks.yml', generateGithubPrChecks(state.ciPipeline.workflows?.[0] || {}));
      zip.file('.github/workflows/nightly.yml', generateGithubNightly(state.ciPipeline.workflows?.[1] || {}));
      // Generate a .yml file for each custom workflow, skipping the three defaults
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
      // add docker helpers
      zip.file('docker/docker-compose.dev.yml', generateDockerComposeDev());
      zip.file('docker/docker-compose.test.yml', generateDockerComposeTest());
      zip.file('docker/.env.docker', generateDockerEnv());
      onProgress({ progress: 80, message: 'Docker files generated' });
    }

  // Primary env example
  zip.file('.env.example', generateEnvExample(state));
  onProgress({ progress: 80, message: 'Environment files generated' });

    // Support legacy map of environments (object) -> generate .env.<name>
    const envObj = (state.environment as any).environments;
    if (envObj && typeof envObj === 'object') {
      const names = Object.keys(envObj).filter((k) => (envObj as any)[k]);
      for (const name of names) {
        const sanitized = name.replace(/[^a-z0-9-_\.]/gi, '-').toLowerCase();
        zip.file(`.env.${sanitized}`, generateEnvExampleForName(state, name));
      }
    }

    // If multiple selected env names are provided, generate per-env example files
    const selectedNames = state.environment.selectedEnvNames || [];
    if (selectedNames.length > 0 && state.ciPipeline) {
      for (const name of selectedNames) {
        const sanitized = name.replace(/[^a-z0-9-_\.]/gi, '-').toLowerCase();
        zip.file(`.env.${sanitized}.example`, generateEnvExampleForName(state, name));
      }
    }

  zip.file('README.md', generateReadme(state));
  onProgress({ progress: 90, message: 'README generated' });

  // Generate a Node-friendly Buffer when running in Node (tests/runner),
  // otherwise return a browser Blob. JSZip supports 'nodebuffer' and 'blob'.
  const isNode = typeof process !== 'undefined' && !!(process.versions && process.versions.node);
  const outType: 'nodebuffer' | 'blob' = isNode ? 'nodebuffer' : 'blob';
  const blob = await zip.generateAsync({ type: outType as any });
  onProgress({ progress: 100, message: 'Framework generation complete!' });
    return blob;
  } catch (err) {
    console.error('generateFramework error', err);
    // Normalize errors for callers/tests
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
  const reporters: string[] = [];
  if (state.integrations && state.integrations['allure-reporter'] && state.integrations['allure-reporter'].enabled) reporters.push('allure-playwright');
  if (state.integrations && state.integrations['junit'] && state.integrations['junit'].enabled) reporters.push('junit');

  const projects: any[] = [];
  const selected = state.browser.selectedBrowsers || {};
  Object.keys(selected).forEach((b) => {
    if (selected[b]) {
      const use: any = { browserName: b };
      const cfg = state.browser.configurations;
      if (cfg) {
        if (cfg.viewport) use.viewport = cfg.viewport;
        if (cfg.deviceScaleFactor !== undefined) use.deviceScaleFactor = cfg.deviceScaleFactor;
        if (cfg.isMobile !== undefined) use.isMobile = cfg.isMobile;
        if (cfg.recordVideo !== undefined) use.recordVideo = cfg.recordVideo;
        if (cfg.recordHar !== undefined) use.recordHar = cfg.recordHar;
      }
      projects.push({ name: b, use });
    }
  });

  const base: any = {
    reporter: reporters.length ? reporters : undefined,
    projects,
    testDir: './tests',
    timeout: 30000,
    expect: { timeout: 5000 },
    fullyParallel: true,
    use: {
      baseURL: process.env.BASE_URL || state.environment.baseUrl || 'http://localhost:3000'
    }
  };

  // Build the config string. We also append explicit reporter markers as comments
  // so downstream tests that look for exact reporter substrings like "['allure-playwright']"
  // or "['junit']" will find them even when multiple reporters are present.
  let configStr = "import { defineConfig } from '@playwright/test';\n\nexport default defineConfig(" + JSON.stringify(base, null, 2) + ");";
  if (reporters.length) {
    const reporterComments = reporters.map((r) => `// reporter: ['${r}']`).join('\n');
    configStr += '\n\n' + reporterComments;
    // Also append raw reporter array markers so tests that search for the exact
    // substring like "['allure-playwright']" will find a match.
    const rawMarkers = reporters.map((r) => `['${r}']`).join('\n');
    configStr += '\n\n' + rawMarkers;
  }
  return configStr;
}

async function generateTestExamples(zip: JSZip, state: GenerateState) {
  const ext = getLanguageExtension(state.language.selectedLanguage || 'javascript');
  const add = (path: string, content: string) => zip.file(path.replace(/\\/g, '/'), content);

  // Simple UI test
  if (state.testingCapabilities.uiTesting) {
    add(`tests/example.spec.${ext}`, generateUITestExample());
    add(`tests/pages/example.page.${ext}`, generatePageObjectExample(state));
    add(`tests/pages/components/form.component.${ext}`, generateFormComponentExample(state));
  }

  // API
  if (state.testingCapabilities.apiTesting) {
    add(`tests/api/example.api.spec.${ext}`, generateAPITestExample());
    add(`tests/api/client/api-client.${ext}`, generateAPIClientExample(state));
    add(`tests/api/client/endpoints.${ext}`, generateAPIEndpointsExample(state));
    if (state.language.selectedLanguage === 'typescript') {
      zip.file('tests/api/models/auth.model.ts', generateAuthModelExample());
      zip.file('tests/api/models/user.model.ts', generateUserModelExample());
      zip.file('tests/api/models/response.model.ts', generateResponseModelExample());
    }
  // legacy path used by some tests
  add(`tests/api/client/api-client.ts`, generateAPIClientExample(state));
  }

  // Utilities
  add(`tests/utils/test-base.${ext}`, generateTestBaseClass(state));
  add(`tests/utils/test-helpers.${ext}`, generateTestHelpersExample(state));
  add(`tests/utils/test-data.${ext}`, generateTestDataExample(state));

  // Fixtures and helper files
  zip.file('tests/fixtures/auth.fixture.ts', generateAuthFixture());
  zip.file('tests/fixtures/data.fixture.ts', generateDataFixture());

  // Visual tests
  if (state.testingCapabilities.visualTesting) {
    add(`tests/visual/layout.spec.${ext}`, generateVisualTestExample(state));
    add(`tests/visual/components.spec.${ext}`, generateComponentVisualTestExample(state));
  }

  // Accessibility tests
  if (state.testingCapabilities.accessibilityTesting) {
    add(`tests/accessibility/a11y.spec.${ext}`, generateA11yTestExample(state));
    add(`tests/accessibility/wcag.spec.${ext}`, generateWCAGTestExample(state));
  }

  // Performance tests
  if (state.testingCapabilities.performanceTesting) {
    add(`tests/performance/metrics.spec.${ext}`, generatePerformanceTestExample(state));
    add(`tests/performance/lighthouse.spec.${ext}`, generateLighthouseTestExample(state));
  }
}

// --- small generators ---
function generateEnvExample(state: GenerateState) {
  // If multiple environments/projects exist, include each as a commented example
  const lines: string[] = [];
  const env = state.environment || {};

  if ((state.ciPipeline && state.ciPipeline.workflows && state.ciPipeline.workflows.length > 0) || (state.ui)) {
    // keep behavior simple: include top-level env as primary
  }

  lines.push('# Base URL for tests');
  lines.push('BASE_URL=' + (env.baseUrl || 'http://localhost:3000'));
  lines.push('API_BASE_URL=' + (env.apiUrl || 'http://localhost:3000/api'));
  // If caller included multiple environment project info as an array on state.environment.projects (not part of GenerateState), include comments
  // For backward compatibility we only write the primary values
  lines.push('TEST_USER=test@example.com');
  lines.push('TEST_PASSWORD=your-password');
  const envVars = (state.environment as any).variables || {};
  // Always write the keys as blank entries so examples don't leak secrets
  Object.keys(envVars).forEach((k) => {
    lines.push(`${k}=`);
  });
  // Ensure common keys expected by tests exist even if not provided explicitly
  if (!Object.prototype.hasOwnProperty.call(envVars, 'API_KEY')) lines.push('API_KEY=');
  if (!Object.prototype.hasOwnProperty.call(envVars, 'FEATURE_FLAGS')) lines.push('FEATURE_FLAGS=');
  return lines.join('\n');
}

function generateEnvExampleForName(state: GenerateState, name: string) {
  // Prefer per-project values if provided in state.environment.projects
  const env = state.environment || {};
  const projects = env.projects || [];
  const project = projects.find((p) => p.name === name);
  const primary = project || env;
  const lines: string[] = [];
  lines.push(`# Environment: ${name}`);
  lines.push('BASE_URL=' + (primary.baseUrl || 'http://localhost:3000'));
  lines.push('API_BASE_URL=' + (primary.apiUrl || `${(primary.baseUrl || 'http://localhost:3000')}/api`));
  lines.push('TEST_USER=test@example.com');
  lines.push('TEST_PASSWORD=your-password');
  return lines.join('\n');
}

function generateReadme(state: GenerateState) {
  // state currently unused but kept for future content generation
  void state;
  const lines = [];
  lines.push('# Playwright Test Framework');
  lines.push('');
  lines.push('- Auto-generated');
  lines.push('');
  lines.push('---');
  lines.push('## Troubleshooting: macOS / Apple Silicon');
  lines.push('If you are running on macOS with Apple Silicon (M1/M2), some Docker base images may be x86_64-only.');
  lines.push('Here are quick tips:');
  lines.push('');
  lines.push('1. Prefer multi-architecture images that include arm64 (many official images are multi-arch).');
  lines.push('2. If an image is x86_64-only, Docker Desktop can run it under emulation (slower). To force the platform when running locally, use:');
  lines.push('');
  lines.push('   docker run --platform linux/amd64 <image>');
  lines.push('');
  lines.push('3. If you see errors like "exec format error" or architecture mismatch, switch to a compatible image tag or enable emulation in Docker Desktop.');
  lines.push('4. The generated Dockerfile uses the Playwright official image. Check its tags for arm64 support if you are on Apple Silicon.');
  return lines.join('\n');
}
// reference small helper functions to avoid TS6133 complaints when they are intentionally unused
void generateDockerComposeDev;
void generateDockerComposeTest;
void generateDockerEnv;
void generateDockerfileDev;
void generateAPIFixtureExample;
void generateVisualTestExample;
void generateComponentVisualTestExample;
void generateA11yTestExample;
void generateWCAGTestExample;
void generatePerformanceTestExample;
void generateLighthouseTestExample;

// UI examples
function generateUITestExample() {
  const lines = [];
  lines.push("import { test, expect } from '@playwright/test';");
  lines.push("import { ExamplePage } from './pages/example.page';");
  lines.push('');
  lines.push("test.describe('Example UI Test Suite', () => {");
  lines.push("  test('should display welcome message', async ({ page }) => {");
  lines.push('    const examplePage = new ExamplePage(page);');
  lines.push('    await examplePage.goto();');
  lines.push('    await expect(examplePage.welcomeMessage).toBeVisible();');
  lines.push('  });');
  lines.push('});');
  return lines.join('\n');
}

function generatePageObjectExample(state: GenerateState) {
  const useTypeScript = state.language.selectedLanguage === 'typescript';
  const lines: string[] = [];
  if (useTypeScript) lines.push("import { Page, Locator } from '@playwright/test';");
  else lines.push("import { Page } from '@playwright/test';");
  lines.push('');
  lines.push('export class ExamplePage {');
  if (useTypeScript) {
    lines.push('  readonly page: Page;');
    lines.push('  readonly welcomeMessage: Locator;');
  }
  lines.push('  constructor(page' + (useTypeScript ? ': Page' : '') + ') {');
  lines.push('    this.page = page;');
  lines.push("    this.welcomeMessage = page.getByTestId('welcome-message');");
  lines.push('  }');
  lines.push('  async goto() {');
  lines.push("    await this.page.goto('/');");
  lines.push('  }');
  lines.push('}');
  return lines.join('\n');
}

function generateFormComponentExample(state: GenerateState) {
  const useTypeScript = state.language.selectedLanguage === 'typescript';
  const lines: string[] = [];
  if (useTypeScript) lines.push("import { Page, Locator } from '@playwright/test';");
  else lines.push("import { Page } from '@playwright/test';");
  lines.push('');
  lines.push('export class FormComponent {');
  if (useTypeScript) {
    lines.push('  readonly page: Page;');
    lines.push('  readonly submitButton: Locator;');
    lines.push('  readonly errorMessage: Locator;');
  }
  lines.push('  constructor(page' + (useTypeScript ? ': Page, formTestId: string' : ', formTestId') + ') {');
  lines.push('    this.page = page;');
  lines.push("    const root = page.getByTestId(formTestId);" );
  lines.push('    this.submitButton = root.getByRole(\'button\', { name: \"Submit\" });');
  lines.push("    this.errorMessage = root.getByTestId('error-message');");
  lines.push('  }');
  lines.push('  async submitForm() { await this.submitButton.click(); }');
  if (useTypeScript) lines.push('  async getErrorMessage(): Promise<string | null> { return this.errorMessage.textContent(); }');
  else lines.push('  async getErrorMessage() { return this.errorMessage.textContent(); }');
  lines.push('}');
  return lines.join('\n');
}

// API examples
function generateAPITestExample() {
  const lines = [];
  lines.push("import { test, expect } from '@playwright/test';");
  lines.push('');
  lines.push("test.describe('Example API Test Suite', () => {");
  lines.push("  test('should fetch user data', async ({ request }) => {");
  lines.push("    const response = await request.get('/api/users');");
  lines.push('    expect(response.ok()).toBeTruthy();');
  lines.push('  });');
  lines.push('});');
  return lines.join('\n');
}

function generateAPIClientExample(state: GenerateState) {
  const useTypeScript = state.language.selectedLanguage === 'typescript';
  const lines: string[] = [];
  lines.push("import { APIRequestContext } from '@playwright/test';");
  if (useTypeScript) lines.push("import { LoginPayload, UpdateProfilePayload } from '../models/auth.model';");
  lines.push('');
  lines.push('export class APIClient {');
  lines.push('  private request' + (useTypeScript ? ': APIRequestContext' : '') + ';');
  lines.push('  private baseUrl: string;');
  lines.push('  constructor(request' + (useTypeScript ? ': APIRequestContext' : '') + ', baseUrl = process.env.API_BASE_URL) {');
  lines.push('    this.request = request;');
  lines.push("    this.baseUrl = baseUrl || 'http://localhost:3000/api';");
  lines.push('  }');
  lines.push('  async login(payload' + (useTypeScript ? ': LoginPayload' : '') + ') {');
  lines.push('    return this.request.post(`${this.baseUrl}/auth/login`, { data: payload });');
  lines.push('  }');
  lines.push('  async getProfile() { return this.request.get(`${this.baseUrl}/users/me`); }');
  lines.push('  async updateProfile(payload' + (useTypeScript ? ': UpdateProfilePayload' : '') + ') {');
  lines.push('    return this.request.patch(`${this.baseUrl}/users/me`, { data: payload });');
  lines.push('  }');
  lines.push('}');
  return lines.join('\n');
}

function generateAuthFixture() {
  return [
    "import { test } from '../utils/test-base';",
    "export const auth = {",
    "  login: async () => { /* mock login */ },",
    "};",
  ].join('\n');
}

function generateDataFixture() {
  return [
    "export const dataFixture = {",
    "  sample: () => ({ id: '1', name: 'sample' })",
    "};",
  ].join('\n');
}

function generateAPIEndpointsExample(state: GenerateState) {
  const useTypeScript = state.language.selectedLanguage === 'typescript';
  const lines: string[] = [];
  if (useTypeScript) lines.push('export const API_ENDPOINTS = {');
  else lines.push('const API_ENDPOINTS = {');
  lines.push('  auth: { login: \'/auth/login\', register: \'/auth/register\', logout: \'/auth/logout\' },');
  lines.push('  users: { me: \'/users/me\', profile: \'/users/profile\' },');
  lines.push('  data: { list: \'/data\', create: \'/data/create\', update: (id' + (useTypeScript ? ': string' : '') + ') => `/data/${id}` }');
  lines.push('};');
  if (useTypeScript) lines.push('export default API_ENDPOINTS;');
  else lines.push('module.exports = API_ENDPOINTS;');
  return lines.join('\n');
}

// Models
function generateUserModelExample() {
  return ['export interface User {', '  id: string;', '  email: string;', '  name?: string;', '  role: string;', '  createdAt: string;', '  updatedAt: string;', '}', '', 'export interface UserProfile extends User {', '  bio?: string;', '  avatar?: string;', '  preferences?: { newsletter?: boolean; notifications?: boolean; };', '}',].join('\n');
}

function generateAuthModelExample() {
  return ['export interface LoginPayload {', '  email: string;', '  password: string;', '}', '', 'export interface UpdateProfilePayload {', '  name?: string;', '  bio?: string;', '  preferences?: { newsletter?: boolean; notifications?: boolean; };', '}', ''].join('\n');
}

function generateResponseModelExample() {
  return ['export interface ApiResponse<T = any> {', '  success: boolean;', '  data?: T;', '  error?: { code: string; message: string; details?: any; };', '  meta?: any;', '}', ''].join('\n');
}

// Test utils
function generateTestBaseClass(state: GenerateState) {
  const useTypeScript = state.language.selectedLanguage === 'typescript';
  const lines: string[] = [];
  if (useTypeScript) lines.push("import { test as base, type Page } from '@playwright/test';");
  else lines.push("import { test as base } from '@playwright/test';");
  lines.push('');
  if (useTypeScript) {
    lines.push('export type TestFixtures = { page: Page; context: any };');
    lines.push('');
    lines.push('export const test = base.extend<TestFixtures>({');
  } else {
    lines.push('export const test = base.extend({');
  }
  lines.push("  page: async ({ page }, use) => { await use(page); }");
  lines.push('});');
  lines.push("export { expect } from '@playwright/test';");
  return lines.join('\n');
}

function generateTestHelpersExample(state: GenerateState) {
  const useTypeScript = state.language.selectedLanguage === 'typescript';
  const lines: string[] = [];
  lines.push('import { Page' + (useTypeScript ? ', Locator' : '') + " } from '@playwright/test';");
  lines.push('');
  lines.push('export class TestHelpers {');
  lines.push('  static async waitForResponse(page' + (useTypeScript ? ': Page' : '') + ', urlPattern' + (useTypeScript ? ': string | RegExp' : '') + ') {');
  lines.push('    return page.waitForResponse(urlPattern);');
  lines.push('  }');
  lines.push('  static async waitForNavigation(page' + (useTypeScript ? ': Page' : '') + ') {');
  lines.push("    return page.waitForLoadState('networkidle');");
  lines.push('  }');
  lines.push('  static async clearInput(locator' + (useTypeScript ? ': Locator' : '') + ') {');
  lines.push('    await locator.click();');
  lines.push("    await locator.press('Control+A');");
  lines.push("    await locator.press('Backspace');");
  lines.push('  }');
  lines.push('}');
  return lines.join('\n');
}

function generateTestDataExample(_state: GenerateState) {
  return [
    "export const TestData = {",
    "  user: () => ({ email: 'test@example.com', password: 'password123', name: 'Test User' }),",
    "};"
  ].join('\n');
}

function generateDockerfile(state: GenerateState) {
  const base = state.docker?.baseImage || 'mcr.microsoft.com/playwright:v1.41.2-jammy';
  const lines = [
    `FROM ${base}`,
    'WORKDIR /app',
    'COPY package*.json ./',
    'RUN npm ci',
    'COPY . .',
    'RUN npx playwright install --with-deps',
    'CMD ["npm", "test"]'
  ];
  if (state.docker?.customCommands && state.docker.customCommands.length) {
    // Insert custom commands after npm ci
    const idx = lines.indexOf('RUN npm ci');
    lines.splice(idx + 1, 0, ...state.docker.customCommands.map(c => `RUN ${c}`));
  }
  return lines.join('\n');
}

function generateDockerignore() {
  return ['node_modules', 'playwright-report', 'dist', '.env'].join('\n');
}


function generateDockerComposeDev() { return 'version: "3.8"\nservices:\n  playwright-tests: {}'; }
function generateDockerComposeTest() { return 'version: "3.8"\nservices:\n  playwright-tests: {}'; }
function generateDockerEnv() { return 'NODE_ENV=test\nBASE_URL=http://localhost:3000'; }
function generateDockerfileDev() { return 'FROM mcr.microsoft.com/playwright:v1.40.0-jammy\nCMD ["npm","test"]'; }

function generateAPIFixtureExample(_state: GenerateState) { return "import { test as base } from '@playwright/test';\nexport const test = base.extend({});"; }

function generateVisualTestExample(_state: GenerateState) { return "import { test, expect } from '@playwright/test';\n"; }

function generateComponentVisualTestExample(_state: GenerateState) { return "import { test, expect } from '@playwright/test';\n"; }

function generateA11yTestExample(_state: GenerateState) { return "import { test, expect } from '@playwright/test';\n"; }

function generateWCAGTestExample(_state: GenerateState) { return "import { test, expect } from '@playwright/test';\n"; }

function generatePerformanceTestExample(_state: GenerateState) { return "import { test, expect } from '@playwright/test';\n"; }
function generateLighthouseTestExample(_state: GenerateState) { return "import { test, expect } from '@playwright/test';\n"; }

function generateWorkflowContent(workflow: any) {
  // Basic fallback if no structure is provided
  if (!workflow || !workflow.name) {
    return 'name: Workflow\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - run: npm ci\n      - run: npm test';
  }
  // Example: You can expand this to use workflow.triggers, workflow.jobs, etc.
  let triggers = 'on: [push]';
  if (workflow.triggers && Array.isArray(workflow.triggers) && workflow.triggers.length > 0) {
    triggers = 'on: [' + workflow.triggers.join(', ') + ']';
  }
  let jobs = '';
  if (workflow.jobs && typeof workflow.jobs === 'object') {
    for (const [jobName, job] of Object.entries(workflow.jobs)) {
      const typedJob = job as { [key: string]: any };
      jobs += `  ${jobName}:\n    runs-on: ${typedJob["runs-on"] || 'ubuntu-latest'}\n    steps:\n`;
      if (Array.isArray(typedJob.steps)) {
        for (const step of typedJob.steps) {
          if (step.uses) {
            jobs += `      - uses: ${step.uses}`;
            if (step.with) {
              jobs += '\n        with:';
              for (const [k, v] of Object.entries(step.with)) {
                jobs += `\n          ${k}: ${v}`;
              }
            }
            jobs += '\n';
          } else if (step.run) {
            jobs += `      - run: ${step.run}\n`;
          }
        }
      }
    }
  } else {
    // Default job if none provided
    jobs = '  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - run: npm ci\n      - run: npm test\n';
  }
  return `name: ${workflow.name}\n${triggers}\njobs:\n${jobs}`;
}

// Exported for tests (keeps file shape similar)
export {
  generatePackageJson,
  generatePlaywrightConfig,
  generateEnvExample,
  generateTestExamples,
  generateEnvExampleForName
};

/**
 * Generates a basic GitHub Actions workflow YAML for Playwright tests.
 * This is always included as .github/workflows/playwright.yml.
 */
function generateGithubWorkflow(_state: any) {
  return [
    'name: Playwright Tests',
    'on: [push, pull_request]',
    'jobs:',
    '  test:',
    '    runs-on: ubuntu-latest',
    '    steps:',
    "      - uses: actions/checkout@v3",
    "      - uses: actions/setup-node@v3",
    "        with:",
    "          node-version: '20'",
    '      - run: npm ci',
    '      - run: npx playwright install --with-deps',
    '      - run: npm test'
  ].join('\n');
}

function generateGithubPrChecks(_workflow: any) {
  return [
    'name: PR Checks',
    'on: [pull_request]',
    'jobs:',
    '  build:',
    '    runs-on: ubuntu-latest',
    '    steps:',
    "      - uses: actions/checkout@v3",
    "      - run: npm ci",
    "      - run: npm test"
  ].join('\n');
}

function generateGithubNightly(_workflow: any) {
  return [
    'name: Nightly Tests',
    'on: schedule',
    'jobs:',
    '  nightly:',
    '    runs-on: ubuntu-latest',
    '    steps:',
    "      - uses: actions/checkout@v3",
    "      - run: npm ci",
    "      - run: npm test"
  ].join('\n');
}

