import { TestingCapabilities } from '@/types/testingCapabilities';

/**
 * Validates that at least one testing capability is enabled
 */
export const validateTestingCapabilities = (capabilities: TestingCapabilities): boolean => {
  return capabilities.uiTesting || capabilities.apiTesting;
};

/**
 * Gets a description of the selected testing capabilities
 */
export const getTestingCapabilitiesDescription = (capabilities: TestingCapabilities): string => {
  const enabled = [];
  
  if (capabilities.uiTesting) {
    enabled.push('UI Testing');
  }
  
  if (capabilities.apiTesting) {
    enabled.push('API Testing');
  }
  
  if (enabled.length === 0) {
    return 'No testing capabilities selected';
  }
  
  if (enabled.length === 1) {
    return enabled[0];
  }
  
  return enabled.join(' and ');
};

/**
 * Gets the utilities and frameworks that will be included based on selected capabilities
 */
export const getIncludedUtilities = (capabilities: TestingCapabilities): string[] => {
  const utilities = [];
  
  if (capabilities.uiTesting) {
    utilities.push(
      'Playwright Browser Automation',
      'Visual Testing Utilities',
      'Page Object Model Helpers',
      'Cross-browser Test Runner'
    );
  }
  
  if (capabilities.apiTesting) {
    utilities.push(
      'REST API Test Helpers',
      'GraphQL Testing Utilities',
      'Request/Response Validators',
      'API Mocking Tools'
    );
  }
  
  return utilities;
};

/**
 * Gets example test files that will be generated based on selected capabilities
 */
export const getExampleFiles = (capabilities: TestingCapabilities): string[] => {
  const files = [];
  
  if (capabilities.uiTesting) {
    files.push(
      'tests/ui/login.spec.ts',
      'tests/ui/navigation.spec.ts',
      'pages/LoginPage.ts',
      'pages/BasePage.ts'
    );
  }
  
  if (capabilities.apiTesting) {
    files.push(
      'tests/api/users.spec.ts',
      'tests/api/auth.spec.ts',
      'helpers/api-client.ts',
      'helpers/api-validators.ts'
    );
  }
  
  return files;
};