import { ProjectFile, PreviewConfiguration } from '../types';

interface ConfigGenerationResult {
  files: ProjectFile[];
  dependencies: string[];
  devDependencies: string[];
  scripts: Record<string, string>;
}

/**
 * Generates configuration files
 */
export function generateConfigFiles(config: PreviewConfiguration): ConfigGenerationResult {
  const files: ProjectFile[] = [];
  const dependencies: string[] = [];
  const devDependencies: string[] = [];
  const scripts: Record<string, string> = {};

  // Playwright configuration
  const playwrightConfig = generatePlaywrightConfig(config);
  files.push(playwrightConfig);

  // TypeScript configuration
  if (config.language === 'typescript') {
    const tsConfig = generateTsConfig();
    files.push(tsConfig);
    devDependencies.push('typescript', '@types/node');
  }

  // Package.json
  const packageJson = generatePackageJson(config);
  files.push(packageJson);

  // Environment file
  const envFile = generateEnvFile(config);
  files.push(envFile);

  // Browser-specific scripts
  config.browsers.forEach(browser => {
    scripts[`test:${browser}`] = `npx playwright test --project=${browser}`;
  });

  if (config.browsers.length > 1) {
    scripts['test:parallel'] = 'npx playwright test --workers=3';
  }

  return {
    files,
    dependencies,
    devDependencies,
    scripts,
  };
}

function generatePlaywrightConfig(config: PreviewConfiguration): ProjectFile {
  const ext = config.language === 'typescript' ? 'ts' : 'js';
  const importStatement = config.language === 'typescript' 
    ? "import { defineConfig, devices } from '@playwright/test';"
    : "const { defineConfig, devices } = require('@playwright/test');";
  
  const projects = config.browsers.map(browser => {
    const deviceMap = {
      'chromium': 'Desktop Chrome',
      'firefox': 'Desktop Firefox',
      'webkit': 'Desktop Safari',
    };
    
    return `    {
      name: '${browser}',
      use: { ...devices['${deviceMap[browser as keyof typeof deviceMap]}'] },
    }`;
  }).join(',\n');

  const environmentProjects = config.environments.length > 1 ? `
  // Environment-specific projects
  ${config.environments.map(env => `  // ${env} environment can be configured here`).join('\n')}` : '';

  const content = `${importStatement}

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export${config.language === 'javascript' ? ' =' : ''} default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like \`await page.goto('/')\`. */
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    /* Record video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
${projects}
  ],${environmentProjects}

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});`;

  return {
    path: `playwright.config.${ext}`,
    content,
    description: 'Main Playwright configuration file',
    category: 'config',
    language: config.language,
  };
}

function generateTsConfig(): ProjectFile {
  const content = `{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./tests/*"],
      "@/pages/*": ["./tests/pages/*"],
      "@/fixtures/*": ["./tests/fixtures/*"],
      "@/utils/*": ["./tests/utils/*"]
    }
  },
  "include": [
    "tests/**/*",
    "playwright.config.ts"
  ]
}`;

  return {
    path: 'tsconfig.json',
    content,
    description: 'TypeScript configuration for the test project',
    category: 'config',
    language: 'json',
  };
}

function generatePackageJson(config: PreviewConfiguration): ProjectFile {
  const dependencies = [
    '@playwright/test',
    ...(config.integrations.includes('faker') ? ['@faker-js/faker'] : []),
    ...(config.integrations.includes('allure') ? ['allure-playwright', 'allure-commandline'] : []),
  ];

  const devDependencies = [
    ...(config.language === 'typescript' ? ['typescript', '@types/node'] : []),
  ];

  const scripts: Record<string, string> = {
    'test': 'npx playwright test',
    'test:ui': 'npx playwright test --ui',
    'test:headed': 'npx playwright test --headed',
    'test:debug': 'npx playwright test --debug',
    'report': 'npx playwright show-report',
    'install-browsers': 'npx playwright install',
    'allure:generate': '',
    'allure:open': '',
    ...Object.fromEntries(config.browsers.map(browser => [`test:${browser}`, `npx playwright test --project=${browser}`])),
  };

  if (config.integrations.includes('allure')) {
    scripts['allure:generate'] = 'allure generate allure-results --clean';
    scripts['allure:open'] = 'allure open allure-report';
  }

  const content = `{
  "name": "playwright-framework",
  "version": "1.1.0",
  "description": "Generated Playwright testing framework",
  "main": "index.js",
  "scripts": {
${Object.entries(scripts).map(([key, value]) => `    "${key}": "${value}"`).join(',\n')}
  },
  "keywords": ["playwright", "testing", "e2e", "automation"],
  "author": "Generated by Playwright Framework Generator",
  "license": "MIT",
  "dependencies": {
${dependencies.map(dep => `    "${dep}": "latest"`).join(',\n')}
  },
  "devDependencies": {
${devDependencies.map(dep => `    "${dep}": "latest"`).join(',\n')}
  }
}`;

  return {
    path: 'package.json',
    content,
    description: 'Project dependencies and scripts configuration',
    category: 'config',
    language: 'json',
  };
}

function generateEnvFile(config: PreviewConfiguration): ProjectFile {
  const content = `# Environment Configuration
BASE_URL=http://localhost:3000

# Test User Credentials
TEST_USERNAME=testuser
TEST_PASSWORD=testpass123
TEST_EMAIL=test@example.com

# API Configuration
API_BASE_URL=http://localhost:3001/api
API_KEY=your_api_key_here

# Browser Configuration
HEADLESS=true
TIMEOUT=30000

# Test Environment
NODE_ENV=test

${config.environments.length > 1 ? `
# Multiple Environment URLs
${config.environments.map(env => `${env.toUpperCase()}_URL=https://${env}.example.com`).join('\n')}
` : ''}

# CI/CD Configuration
CI=false

# Debug Options
DEBUG=false
SLOW_MO=0

# Screenshot and Video Settings
TAKE_SCREENSHOTS=only-on-failure
RECORD_VIDEO=retain-on-failure`;

  return {
    path: '.env.example',
    content,
    description: 'Environment variables template',
    category: 'config',
  };
}
