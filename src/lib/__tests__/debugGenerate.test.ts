import { test } from 'vitest';
import { generatePackageJson } from '../generateFramework';

test('debug package json integrations', () => {
  const state: any = {
    language: { selectedLanguage: 'typescript' },
    browser: { selectedBrowsers: { chromium: true } },
    testingCapabilities: {},
    environment: {},
    ciPipeline: { enabled: false },
    docker: { enabled: false },
    integrations: {
      'allure-reporter': { enabled: true },
      'github-actions': { enabled: true },
      'cucumber': { enabled: true },
      'faker': { enabled: true },
      'junit': { enabled: true },
    },
    ui: { theme: 'light' }
  };
  const pkg = generatePackageJson(state as any);
   
  console.log(JSON.stringify(pkg, null, 2));
});
