import { IntegrationsState, GitHubActionsConfig, AllureReporterConfig, CucumberIntegrationConfig, FakerLibraryConfig } from '@/types/integrations';

/**
 * Validates GitHub Actions configuration
 */
export const validateGitHubActionsConfig = (config: GitHubActionsConfig): boolean => {
  if (!config.enabled) return true;
  
  return (
    config.workflowName.length > 0 &&
    config.nodeVersions.length > 0 &&
    config.operatingSystems.length > 0 &&
    (config.triggers.push || config.triggers.pullRequest || config.triggers.schedule)
  );
};

/**
 * Validates Allure Reporter configuration
 */
export const validateAllureReporterConfig = (config: AllureReporterConfig): boolean => {
  if (!config.enabled) return true;
  
  return config.retainReports > 0;
};

/**
 * Validates Cucumber Integration configuration
 */
export const validateCucumberIntegrationConfig = (config: CucumberIntegrationConfig): boolean => {
  if (!config.enabled) return true;
  
  return (
    config.featuresPath.length > 0 &&
    config.stepsPath.length > 0 &&
    config.supportPath.length > 0
  );
};

/**
 * Validates Faker Library configuration
 */
export const validateFakerLibraryConfig = (config: FakerLibraryConfig): boolean => {
  if (!config.enabled) return true;
  
  return config.locale.length > 0;
};

/**
 * Validates the entire integrations configuration
 */
export const validateIntegrationsConfig = (integrations: IntegrationsState): boolean => {
  return (
    validateGitHubActionsConfig(integrations.githubActions) &&
    validateAllureReporterConfig(integrations.allureReporter) &&
    validateCucumberIntegrationConfig(integrations.cucumberIntegration) &&
    validateFakerLibraryConfig(integrations.fakerLibrary)
  );
};

/**
 * Gets a description of the enabled integrations
 */
export const getEnabledIntegrationsDescription = (integrations: IntegrationsState): string => {
  const enabled = [];
  
  if (integrations.githubActions.enabled) {
    enabled.push('GitHub Actions CI/CD');
  }
  
  if (integrations.allureReporter.enabled) {
    enabled.push('Allure Reporter');
  }
  
  if (integrations.cucumberIntegration.enabled) {
    enabled.push('Cucumber BDD');
  }
  
  if (integrations.fakerLibrary.enabled) {
    enabled.push('Faker Library');
  }
  
  if (enabled.length === 0) {
    return 'No integrations enabled';
  }
  
  if (enabled.length === 1) {
    return enabled[0];
  }
  
  if (enabled.length === 2) {
    return enabled.join(' and ');
  }
  
  return enabled.slice(0, -1).join(', ') + ', and ' + enabled[enabled.length - 1];
};

/**
 * Gets the packages that will be installed based on enabled integrations
 */
export const getRequiredPackages = (integrations: IntegrationsState): string[] => {
  const packages = [];
  
  if (integrations.allureReporter.enabled) {
    packages.push(
      'allure-playwright',
      'allure-commandline'
    );
  }
  
  if (integrations.cucumberIntegration.enabled) {
    packages.push(
      '@cucumber/cucumber',
      '@cucumber/playwright'
    );
  }
  
  if (integrations.fakerLibrary.enabled) {
    packages.push(
      '@faker-js/faker'
    );
  }
  
  return packages;
};

/**
 * Gets the configuration files that will be generated based on enabled integrations
 */
export const getGeneratedFiles = (integrations: IntegrationsState): string[] => {
  const files = [];
  
  if (integrations.githubActions.enabled) {
    files.push('.github/workflows/' + integrations.githubActions.workflowName + '.yml');
  }
  
  if (integrations.allureReporter.enabled) {
    files.push('allure.config.js');
  }
  
  if (integrations.cucumberIntegration.enabled) {
    files.push(
      'cucumber.config.js',
      `${integrations.cucumberIntegration.featuresPath}/example.feature`,
      `${integrations.cucumberIntegration.stepsPath}/example.steps.ts`,
      `${integrations.cucumberIntegration.supportPath}/hooks.ts`
    );
  }
  
  if (integrations.fakerLibrary.enabled && integrations.fakerLibrary.generateHelpers) {
    files.push('helpers/faker-helpers.ts');
  }
  
  return files;
};

/**
 * Gets example usage snippets for enabled integrations
 */
export const getIntegrationExamples = (integrations: IntegrationsState): { [key: string]: string[] } => {
  const examples: { [key: string]: string[] } = {};
  
  if (integrations.allureReporter.enabled) {
    examples['Allure Reporter'] = [
      'import { test } from "@playwright/test";',
      'test("example with allure", async ({ page }) => {',
      '  await test.step("Navigate to page", async () => {',
      '    await page.goto("/");',
      '  });',
      '});'
    ];
  }
  
  if (integrations.cucumberIntegration.enabled) {
    examples['Cucumber BDD'] = [
      'Feature: User Authentication',
      '  Scenario: Successful login',
      '    Given I am on the login page',
      '    When I enter valid credentials',
      '    Then I should be redirected to dashboard'
    ];
  }
  
  if (integrations.fakerLibrary.enabled) {
    const types = Object.entries(integrations.fakerLibrary.includeTypes)
      .filter(([, enabled]) => enabled)
      .map(([type]) => type);
    
    examples['Faker Library'] = [
      'import { faker } from "@faker-js/faker";',
      '',
      ...types.map(type => {
        switch (type) {
          case 'personal':
            return 'const name = faker.person.fullName();';
          case 'internet':
            return 'const email = faker.internet.email();';
          case 'company':
            return 'const company = faker.company.name();';
          default:
            return `const ${type} = faker.${type}.sample();`;
        }
      })
    ];
  }
  
  return examples;
};