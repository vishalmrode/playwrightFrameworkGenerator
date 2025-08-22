import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';

// Language selectors
export const selectLanguageState = (state: RootState) => state.language;
export const selectSelectedLanguage = createSelector(
  [selectLanguageState],
  (language) => language.selectedLanguage
);

// Browser selectors
export const selectBrowserState = (state: RootState) => state.browser;
export const selectSelectedBrowsers = createSelector(
  [selectBrowserState],
  (browser) => browser?.selectedBrowsers || { chromium: false, firefox: false, webkit: false }
);

export const selectSelectedBrowsersList = createSelector(
  [selectSelectedBrowsers],
  (selectedBrowsers) => 
    Object.entries(selectedBrowsers)
      .filter(([_, selected]) => selected)
      .map(([browser, _]) => browser as keyof typeof selectedBrowsers)
);

export const selectCanGenerate = createSelector(
  [selectSelectedBrowsersList],
  (browsersList) => browsersList.length > 0
);

// Complex selectors for framework generation
export const selectGenerateState = createSelector(
  [
    (state: RootState) => state.language,
    (state: RootState) => state.browser,
    (state: RootState) => state.testingCapabilities,
    (state: RootState) => state.environment,
    (state: RootState) => state.codeQuality,
    (state: RootState) => state.integrations,
    (state: RootState) => state.fixtures,
    (state: RootState) => state.docker,
    (state: RootState) => state.ciPipeline,
    (state: RootState) => state.ui.theme === 'system' ? 'light' : state.ui.theme
  ],
  (
    language,
    browser,
    testingCapabilities,
    environment,
    codeQuality,
    integrations,
    fixtures,
    docker,
    ciPipeline,
    theme
  ) => {
    const selectedNames = environment.selectedEnvironments && environment.selectedEnvironments.length > 0
      ? environment.selectedEnvironments
      : [environment.environments[0]?.name].filter(Boolean) as string[];
    
    const selectedEnv = environment.environments.find(env => env.name === selectedNames[0]) || environment.environments[0];
    
    return {
      language: language,
      browser: browser,
      testingCapabilities: testingCapabilities as unknown as { [key: string]: boolean },
      environment: {
        baseUrl: selectedEnv?.baseUrl || 'http://localhost:3000',
        apiUrl: selectedEnv?.baseUrl ? `${selectedEnv.baseUrl}/api` : 'http://localhost:3000/api',
        selectedEnvNames: selectedNames,
        projects: environment.environments.map((e) => ({ 
          name: e.name, 
          baseUrl: e.baseUrl, 
          apiUrl: e.baseUrl ? `${e.baseUrl}/api` : undefined 
        }))
      },
      integrations: {
        'allure-reporter': { enabled: integrations.allureReporter.enabled },
        'github-actions': { enabled: integrations.githubActions.enabled },
        'cucumber': { enabled: integrations.cucumberIntegration.enabled },
        'faker': { enabled: integrations.fakerLibrary.enabled }
      },
      fixtures: {
        pageObjectPatterns: fixtures.pageObjectPatterns || []
      },
      docker: {
        enabled: docker.config.enabled || false
      },
      ciPipeline: {
        enabled: ciPipeline.enabled,
        workflows: ciPipeline.workflows,
        selectedWorkflowIndex: ciPipeline.selectedWorkflowIndex,
        globalSettings: ciPipeline.globalSettings
      },
      ui: { theme }
    };
  }
);