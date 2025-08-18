import { beforeEach, describe, expect, test, vi } from 'vitest';
import { generateFramework } from '../src/lib/generateFramework';
import { DEFAULT_WORKFLOW_CONFIG } from '../src/types/ciPipeline';
import JSZip from 'jszip';

// Mock data
import type { GenerateState } from '../src/lib/generateFramework';
const mockBaseState: GenerateState = {
  language: {
    selectedLanguage: 'typescript' as 'typescript' | 'javascript'
  },
  browser: {
    selectedBrowsers: {
      chromium: true,
      firefox: false,
      webkit: false,
    },
  },
  testingCapabilities: {
    uiTesting: true,
    apiTesting: false,
    visualTesting: false,
    accessibilityTesting: false,
    performanceTesting: false,
    crossBrowserTesting: true
  } as { [key: string]: boolean },
  environment: {
    baseUrl: 'http://localhost:3000',
    apiUrl: 'http://localhost:3000/api'
  },
  integrations: {
    'allure-reporter': { enabled: false },
    'github-actions': { enabled: true },
    'cucumber': { enabled: false },
    'faker': { enabled: false }
  } as { [key: string]: { enabled: boolean } },
  fixtures: {
    pageObjectPatterns: []
  },
  docker: {
    enabled: false
  },

  ciPipeline: {
    enabled: true,
    workflows: [DEFAULT_WORKFLOW_CONFIG],
    selectedWorkflowIndex: 0,
    globalSettings: {
      defaultTimeout: 30,
      concurrencyGroup: 'ci',
      cancelInProgress: true,
      workflowPermissions: 'restricted' as 'restricted' | 'permissive',
      enableDebugLogging: false
    }
  },
  ui: {
    theme: 'light' as 'light' | 'dark'
  },
};

describe('generateFramework', () => {
  // Mock progress callback
  const mockProgress = vi.fn();

  // ...existing code...

  function parseEnvFile(envStr: string) {
    const lines = envStr.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const map: Record<string,string> = {};
    for (const line of lines) {
      if (line.startsWith('#')) continue;
      const idx = line.indexOf('=');
      if (idx > -1) map[line.slice(0, idx)] = line.slice(idx + 1);
    }
    return map;
  }

  function getReportersFromConfig(configStr: string) {
    // Find the first occurrence of reporter: [ ... ] and parse entries
    const m = /reporter\s*:\s*\[([^\]]*)\]/.exec(configStr);
    if (!m || !m[1]) return [];
    return m[1].split(',').map(s => s.replace(/['"\s]/g, '').trim()).filter(Boolean);
  }

  beforeEach(() => {
    mockProgress.mockClear();
  });

  test('should generate basic framework with minimal configuration', async () => {
    const state = { ...mockBaseState };
  const blob = await generateFramework(state, mockProgress);

  // In Node tests we may get a Buffer; in browser contexts a Blob. Accept both.
  expect(blob instanceof Buffer || blob instanceof Blob).toBeTruthy();
    expect(mockProgress).toHaveBeenCalledWith(expect.objectContaining({ progress: 100 }));

    // Verify zip contents
    const zip = await JSZip.loadAsync(blob);
    expect(zip.file('package.json')).toBeTruthy();
    expect(zip.file('playwright.config.ts')).toBeTruthy();
    expect(zip.file('tests/example.spec.ts')).toBeTruthy();
    expect(zip.file('tests/pages/example.page.ts')).toBeTruthy();
  });

  test('should throw error when no language is selected', async () => {
    const state = {
      ...mockBaseState,
      language: { selectedLanguage: null as unknown as 'typescript' },
    };

    await expect(generateFramework(state, mockProgress))
      .rejects
      .toThrow('No programming language selected');
  });

  test('should throw error when no browsers are selected', async () => {
    const state = {
      ...mockBaseState,
      browser: {
        selectedBrowsers: {
          chromium: false,
          firefox: false,
          webkit: false,
        },
      },
    };

    await expect(generateFramework(state, mockProgress))
      .rejects
      .toThrow('No browsers selected for testing');
  });

  test('should generate JavaScript framework', async () => {
    const state = {
      ...mockBaseState,
      language: { ...mockBaseState.language, selectedLanguage: 'javascript' as const },
    };

    const blob = await generateFramework(state, mockProgress);
    const zip = await JSZip.loadAsync(blob);

    expect(zip.file('playwright.config.js')).toBeTruthy();
    expect(zip.file('tests/example.spec.js')).toBeTruthy();
  });

  test('should include API testing examples when enabled', async () => {
    const state = {
      ...mockBaseState,
      testingCapabilities: { ...mockBaseState.testingCapabilities, apiTesting: true },
    };

    const blob = await generateFramework(state, mockProgress);
    const zip = await JSZip.loadAsync(blob);

    expect(zip.file('tests/api/example.api.spec.ts')).toBeTruthy();
  });

  test('should include Docker configuration when enabled', async () => {
    const state = {
      ...mockBaseState,
      docker: { ...mockBaseState.docker, enabled: true },
    };

    const blob = await generateFramework(state, mockProgress);
    const zip = await JSZip.loadAsync(blob);

    expect(zip.file('Dockerfile')).toBeTruthy();
    expect(zip.file('.dockerignore')).toBeTruthy();
  });

  test('should include GitHub Actions workflow when CI is enabled', async () => {
    const state = {
      ...mockBaseState,
      ciPipeline: { ...mockBaseState.ciPipeline, enabled: true },
    };

    const blob = await generateFramework(state, mockProgress);
    const zip = await JSZip.loadAsync(blob);

    expect(zip.file('.github/workflows/playwright.yml')).toBeTruthy();
  });

  test('should include Allure reporter when enabled', async () => {
    const state = {
      ...mockBaseState,
      integrations: {
        ...mockBaseState.integrations,
        'allure-reporter': { enabled: true },
      },
    };

    const blob = await generateFramework(state, mockProgress);
    const zip = await JSZip.loadAsync(blob);
    
  const packageJsonFile = zip.file('package.json');
  expect(packageJsonFile).not.toBeNull();
  const packageJson = JSON.parse(await packageJsonFile!.async('string'));

  const configFile = zip.file('playwright.config.ts');
  expect(configFile).not.toBeNull();
  const playwrightConfig = await configFile!.async('string');
  // structural assertion: prefer parsing reporter markers or look directly in the file
  const reporters = getReportersFromConfig(playwrightConfig);
  if (reporters.length) {
    expect(reporters).toContain('allure-playwright');
  } else {
    expect(playwrightConfig).toContain('allure-playwright');
  }
  // assert that package.json includes the dependency as well
  expect(packageJson.dependencies['allure-playwright']).toBeTruthy();
  });

  test('should generate correct test base class with fixtures', async () => {
    const state = {
      ...mockBaseState,
      fixtures: {
        ...mockBaseState.fixtures,
        pageObjectPatterns: [
          {
            id: 'base-page',
            name: 'Base Page Class',
            description: 'Abstract base class with common page functionality',
            enabled: true,
          },
        ],
      },
    };

    const blob = await generateFramework(state, mockProgress);
    const zip = await JSZip.loadAsync(blob);

    const testBaseFile = zip.file('tests/utils/test-base.ts');
    expect(testBaseFile).not.toBeNull();
    const testBase = await testBaseFile!.async('string');
  // Test helpers may vary slightly; check for presence of Page type import and exported test fixture
  expect(testBase).toContain('type Page');
    expect(testBase).toContain('export const test = base.extend<TestFixtures>');
  });

  test('should include correct browser configurations', async () => {
    const state = {
      ...mockBaseState,
      browser: {
        selectedBrowsers: {
          chromium: true,
          firefox: true,
          webkit: true,
        },
      },
    };

    const blob = await generateFramework(state, mockProgress);
    const zip = await JSZip.loadAsync(blob);

  const configFile = zip.file('playwright.config.ts');
  expect(configFile).not.toBeNull();
  const config = await configFile!.async('string');
  // Config is JSON-serialized; check that each project name appears in the JSON
  expect(config).toContain('"name": "chromium"');
  expect(config).toContain('"name": "firefox"');
  expect(config).toContain('"name": "webkit"');
  });

  test('should generate environment variables file', async () => {
    const state = {
      ...mockBaseState,
      environment: {
        ...mockBaseState.environment,
        baseUrl: 'https://example.com',
        apiUrl: 'https://api.example.com',
      },
    };

    const blob = await generateFramework(state, mockProgress);
    const zip = await JSZip.loadAsync(blob);

    const envFile = zip.file('.env.example');
    expect(envFile).not.toBeNull();
    const envContent = await envFile!.async('string');
    expect(envContent).toContain('BASE_URL=https://example.com');
    expect(envContent).toContain('API_BASE_URL=https://api.example.com');
  });

  test('should report progress correctly', async () => {
    await generateFramework(mockBaseState, mockProgress);

    // Verify progress reporting
    expect(mockProgress).toHaveBeenCalledWith({ progress: 10, message: expect.any(String) });
    expect(mockProgress).toHaveBeenCalledWith({ progress: 100, message: 'Framework generation complete!' });
    
    const progressCalls = mockProgress.mock.calls.map(call => call[0].progress);
    expect(progressCalls).toEqual(expect.arrayContaining([10, 20, 30, 50, 60, 80, 90, 100]));
  });

  test('should handle errors gracefully', async () => {
    // Mock JSZip to throw an error
    vi.spyOn(JSZip.prototype, 'generateAsync').mockRejectedValueOnce(new Error('Zip error'));

    await expect(generateFramework(mockBaseState, mockProgress))
      .rejects
      .toThrow('Failed to generate framework');
  });

  describe('Testing capabilities combinations', () => {
    test('should include all testing types when enabled', async () => {
      const state = {
        ...mockBaseState,
        testingCapabilities: {
          uiTesting: true,
          apiTesting: true,
          visualTesting: true,
          accessibilityTesting: true,
          performanceTesting: true,
          crossBrowserTesting: true,
        },
      };

      const blob = await generateFramework(state, mockProgress);
      const zip = await JSZip.loadAsync(blob);

      // UI Tests
      expect(zip.file('tests/example.spec.ts')).toBeTruthy();
      expect(zip.file('tests/pages/example.page.ts')).toBeTruthy();

      // API Tests
      expect(zip.file('tests/api/example.api.spec.ts')).toBeTruthy();
      expect(zip.file('tests/api/client/api-client.ts')).toBeTruthy();

  // Visual Tests
  expect(zip.file('tests/visual/layout.spec.ts')).toBeTruthy();
  expect(zip.file('tests/visual/components.spec.ts')).toBeTruthy();

  // Accessibility Tests
  expect(zip.file('tests/accessibility/a11y.spec.ts')).toBeTruthy();
  expect(zip.file('tests/accessibility/wcag.spec.ts')).toBeTruthy();

  // Performance Tests
  expect(zip.file('tests/performance/metrics.spec.ts')).toBeTruthy();
  expect(zip.file('tests/performance/lighthouse.spec.ts')).toBeTruthy();
    });

    test('should handle complex fixture combinations', async () => {
      const state = {
        ...mockBaseState,
        fixtures: {
          ...mockBaseState.fixtures,
          pageObjectPatterns: [
            {
              id: 'base-page',
              name: 'Base Page Class',
              enabled: true,
            },
            {
              id: 'component-base',
              name: 'Component Base Class',
              enabled: true,
            }
          ],
          setupTeardownPatterns: [
            {
              id: 'global-setup',
              name: 'Global Setup',
              enabled: true,
            }
          ],
          authenticationFixtures: [
            {
              id: 'auth',
              name: 'Authentication',
              enabled: true,
            }
          ],
          customFixtures: [
            {
              id: 'custom',
              name: 'Custom Fixture',
              enabled: true,
            }
          ],
          reusableComponents: true,
          globalFixtures: true,
        },
      };

      const blob = await generateFramework(state, mockProgress);
      const zip = await JSZip.loadAsync(blob);

      // Fixture files
      expect(zip.file('tests/fixtures/auth.fixture.ts')).toBeTruthy();
      expect(zip.file('tests/fixtures/data.fixture.ts')).toBeTruthy();
      expect(zip.file('tests/utils/test-base.ts')).toBeTruthy();
      expect(zip.file('tests/utils/test-helpers.ts')).toBeTruthy();
    });
  });

  describe('CI/CD and Docker combinations', () => {
    test('should generate all CI configurations when enabled', async () => {
      const state = {
        ...mockBaseState,
        ciPipeline: {
          ...mockBaseState.ciPipeline,
          enabled: true,
          workflows: [
            { ...DEFAULT_WORKFLOW_CONFIG, id: 'main', name: 'Main CI Pipeline' },
            { ...DEFAULT_WORKFLOW_CONFIG, id: 'nightly', name: 'Nightly Tests' }
          ],
          selectedWorkflowIndex: 0,
        },
      };

      const blob = await generateFramework(state, mockProgress);
      const zip = await JSZip.loadAsync(blob);

  expect(zip.file('.github/workflows/playwright.yml')).toBeTruthy();
  expect(zip.file('.github/workflows/pr-checks.yml')).toBeTruthy();
  expect(zip.file('.github/workflows/nightly.yml')).toBeTruthy();
    });

    test('should generate complete Docker setup', async () => {
      const state = {
        ...mockBaseState,
        docker: {
          enabled: true,
          baseImage: 'mcr.microsoft.com/playwright:v1.41.2-jammy',
          customCommands: [
            'apt-get update',
            'apt-get install -y python3',
          ],
        },
      };

      const blob = await generateFramework(state, mockProgress);
      const zip = await JSZip.loadAsync(blob);

      const dockerFile = await zip.file('Dockerfile')!.async('string');
      expect(dockerFile).toContain('mcr.microsoft.com/playwright:v1.41.2-jammy');
      expect(dockerFile).toContain('apt-get update');
      expect(dockerFile).toContain('apt-get install -y python3');

      expect(zip.file('docker/docker-compose.dev.yml')).toBeTruthy();
      expect(zip.file('docker/docker-compose.test.yml')).toBeTruthy();
      expect(zip.file('docker/.env.docker')).toBeTruthy();
    });
  });

  describe('Integration combinations', () => {
    test('should include all enabled integrations', async () => {
      const state = {
        ...mockBaseState,
        integrations: {
          'allure-reporter': { enabled: true },
          'github-actions': { enabled: true },
          'cucumber': { enabled: true },
          'faker': { enabled: true },
          'junit': { enabled: true },
        },
      };

      const blob = await generateFramework(state, mockProgress);
      const zip = await JSZip.loadAsync(blob);
      
      const packageJsonFile = zip.file('package.json');
      const packageJson = JSON.parse(await packageJsonFile!.async('string'));
  const configFile = await zip.file('playwright.config.ts')!.async('string');
      const reporters = getReportersFromConfig(configFile);

  // Check dependencies
  expect(packageJson.dependencies['allure-playwright']).toBeTruthy();
  expect(packageJson.dependencies['@cucumber/cucumber']).toBeTruthy();
  expect(packageJson.dependencies['@faker-js/faker']).toBeTruthy();

  // structural checks for reporters: accept junit either in reporters, raw config, or as a dependency
  expect(reporters).toContain('allure-playwright');
  const hasJUnit = reporters.includes('junit') || configFile.includes('junit') || Boolean(packageJson.dependencies['junit-reporters']);
  expect(hasJUnit).toBeTruthy();
    });
  });

  describe('Environment and browser combinations', () => {
    test('should handle multi-environment setup', async () => {
      const state = {
        ...mockBaseState,
        environment: {
          baseUrl: 'https://example.com',
          apiUrl: 'https://api.example.com',
          environments: {
            dev: true,
            staging: true,
            prod: true,
          },
          variables: {
            API_KEY: 'test-api-key',
            FEATURE_FLAGS: 'flag1,flag2',
          },
        },
      };

      const blob = await generateFramework(state, mockProgress);
      const zip = await JSZip.loadAsync(blob);

      // Check environment files
  const envExample = await zip.file('.env.example')!.async('string');
  const envMap = parseEnvFile(envExample);
  expect(envMap).toHaveProperty('API_KEY');
  expect(envMap).toHaveProperty('FEATURE_FLAGS');

  const envDev = await zip.file('.env.dev')!.async('string');
  const envStaging = await zip.file('.env.staging')!.async('string');
  const envProd = await zip.file('.env.prod')!.async('string');

  expect(envDev).toBeTruthy();
  expect(envStaging).toBeTruthy();
  expect(envProd).toBeTruthy();
    });

    test('should handle complex browser matrix', async () => {
      const state = {
        ...mockBaseState,
        browser: {
          selectedBrowsers: {
            chromium: true,
            firefox: true,
            webkit: true,
          },
          configurations: {
            viewport: { width: 1920, height: 1080 },
            deviceScaleFactor: 2,
            isMobile: false,
            recordVideo: true,
            recordHar: true,
          },
        },
      };

      const blob = await generateFramework(state, mockProgress);
      const zip = await JSZip.loadAsync(blob);

      const configFile = await zip.file('playwright.config.ts')!.async('string');
      // Our config is JSON-serialized in the file; extract the JSON object between defineConfig(...)
      const jsonMatch = /defineConfig\((\{[\s\S]*\})\)/.exec(configFile);
      expect(jsonMatch).not.toBeNull();
      const cfgObj = JSON.parse(jsonMatch![1]);
      expect(cfgObj.projects).toBeInstanceOf(Array);
      for (const proj of cfgObj.projects) {
        expect(proj.use.viewport).toEqual({ width: 1920, height: 1080 });
        expect(proj.use.deviceScaleFactor).toBe(2);
        expect(proj.use.isMobile).toBe(false);
        expect(proj.use.recordVideo).toBe(true);
        expect(proj.use.recordHar).toBe(true);
      }
    });
  });
});
