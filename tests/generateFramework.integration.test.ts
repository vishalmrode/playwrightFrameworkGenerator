import { describe, test, expect, vi } from 'vitest';
import JSZip from 'jszip';
import { generateFramework } from '../src/lib/generateFramework';

const mockProgress = vi.fn();

describe('generateFramework integration', () => {
  test('creates a real zip and contains structural files', async () => {
    const state = {
      language: { selectedLanguage: 'typescript' },
      browser: { selectedBrowsers: { chromium: true, firefox: true, webkit: true } },
      testingCapabilities: { uiTesting: true, apiTesting: true, visualTesting: true, accessibilityTesting: true, performanceTesting: true, crossBrowserTesting: true },
      environment: { baseUrl: 'https://example.com', apiUrl: 'https://api.example.com', environments: { dev: true, staging: true, prod: true }, variables: { API_KEY: 'abc', FEATURE_FLAGS: 'x' } },
      ciPipeline: { enabled: true, workflows: [], selectedWorkflowIndex: 0, globalSettings: { defaultTimeout: 30, concurrencyGroup: 'ci', cancelInProgress: true, workflowPermissions: 'restricted', enableDebugLogging: false } },
      docker: { enabled: true, baseImage: 'mcr.microsoft.com/playwright:v1.41.2-jammy', customCommands: ['apt-get update'] },
      integrations: { 'allure-reporter': { enabled: true }, 'junit': { enabled: true } },
      fixtures: {},
      ui: { theme: 'light' }
    } as any;

    const blob = await generateFramework(state, mockProgress as any);
    const zip = await JSZip.loadAsync(blob);

    // Check essential files
    expect(zip.file('package.json')).toBeTruthy();
    expect(zip.file('playwright.config.ts')).toBeTruthy();
    expect(zip.file('.env.example')).toBeTruthy();
    expect(zip.file('Dockerfile')).toBeTruthy();

    const pkg = JSON.parse(await zip.file('package.json')!.async('string'));
    expect(pkg.dependencies['allure-playwright']).toBeTruthy();

    const config = await zip.file('playwright.config.ts')!.async('string');
    expect(config).toContain('reporter');
    // Extract reporters if possible
  const m = /reporter\s*:\s*\[([^\]]*)\]/.exec(config);
    if (m && m[1]) {
      const reporters = m[1].split(',').map(s => s.replace(/['"\s]/g, '').trim());
      expect(reporters).toContain('allure-playwright');
      // Accept junit via reporters, package.json dependency, or literal config mention
      const hasJUnit = reporters.includes('junit') || Boolean(pkg.dependencies['junit-reporters']) || config.includes('junit');
      expect(hasJUnit).toBeTruthy();
    } else {
      // fallback: check package.json for dependencies that indicate reporters
      expect(pkg.dependencies['allure-playwright']).toBeTruthy();
      expect(pkg.dependencies['junit-reporters'] || config.includes('junit')).toBeTruthy();
    }
  });
});
