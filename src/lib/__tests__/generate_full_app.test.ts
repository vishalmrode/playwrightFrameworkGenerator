import JSZip from "jszip";
import { generateFramework } from "../generateFramework";

describe('generateFramework full-featured generation', () => {
  it('generates all expected files when all options are enabled', async () => {
    const state = {
      language: { selectedLanguage: 'typescript' },
      browser: {
        selectedBrowsers: { chromium: true, firefox: true, webkit: true },
        configurations: { viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 }
      },
      testingCapabilities: {
        uiTesting: true,
        apiTesting: true,
        visualTesting: true,
        accessibilityTesting: true,
        performanceTesting: true
      },
      environment: {
        baseUrl: 'https://example.local',
        apiUrl: 'https://example.local/api',
        selectedEnvNames: ['dev', 'staging'],
        projects: [
          { name: 'dev', baseUrl: 'https://dev.example.local', apiUrl: 'https://dev.example.local/api' },
          { name: 'staging', baseUrl: 'https://staging.example.local', apiUrl: 'https://staging.example.local/api' }
        ]
      },
      ciPipeline: {
        enabled: true,
        workflows: [
          { name: 'pr-checks', triggers: ['pull_request'], strategy: 'parallel' },
          { name: 'nightly', triggers: ['schedule'], strategy: 'sequential' }
        ],
        selectedWorkflowIndex: 0,
        globalSettings: {}
      },
      docker: { enabled: true, baseImage: 'mcr.microsoft.com/playwright:v1.41.2-jammy', customCommands: ['RUN echo hi'] },
      integrations: {
        'allure-reporter': { enabled: true },
        'github-actions': { enabled: true },
        cucumber: { enabled: true },
        faker: { enabled: true },
        junit: { enabled: true }
      },
      fixtures: { pageObjectPatterns: [{ enabled: true, id: 'p1', name: 'default' }] },
      ui: { theme: 'light' }
    };

    const progressUpdates = [];
    const buf = await generateFramework(state as any, (p: any) => progressUpdates.push(p));
    const zip = await JSZip.loadAsync(buf as any);
    const files = Object.keys(zip.files).sort();

    const expected = [
      'package.json',
      'playwright.config.ts',
      '.env.example',
      'README.md',
      'Dockerfile',
      '.github/workflows/playwright.yml',
      '.github/workflows/pr-checks.yml',
      '.github/workflows/nightly.yml',
      'tests/example.spec.ts',
      'tests/pages/example.page.ts',
      'tests/utils/test-base.ts',
      'tests/api/example.api.spec.ts'
    ];

    expected.forEach(e => expect(files).toContain(e));
    expect(progressUpdates.length).toBeGreaterThan(0);
    expect(progressUpdates[progressUpdates.length-1].progress).toBe(100);
  }, 20000);
});
