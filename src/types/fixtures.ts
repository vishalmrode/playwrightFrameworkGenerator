export interface FixtureOption {
  id: string;
  name: string;
  description: string;
  category: 'page-objects' | 'test-data' | 'setup-teardown' | 'authentication' | 'utilities';
  enabled: boolean;
  dependencies?: string[];
  conflictsWith?: string[];
  advanced?: boolean;
}

export interface PageObjectPattern {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface TestDataStrategy {
  strategy: 'isolated' | 'shared' | 'persistent' | 'factory';
  description: string;
  fileFormat: 'json' | 'csv' | 'yaml' | 'javascript';
  enabled: boolean;
}

export interface SetupTeardownPattern {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  scope: 'global' | 'describe' | 'test';
}

export interface AuthenticationFixture {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  method: 'session' | 'cookie' | 'token' | 'basic-auth';
}

export interface FixturesConfiguration {
  pageObjectPatterns: PageObjectPattern[];
  testDataStrategy: TestDataStrategy;
  setupTeardownPatterns: SetupTeardownPattern[];
  authenticationFixtures: AuthenticationFixture[];
  customFixtures: FixtureOption[];
  reusableComponents: boolean;
  globalFixtures: boolean;
  fixtureTimeout: number;
  parallelSafe: boolean;
}

export interface FixturesState extends FixturesConfiguration {}

// Default configurations
export const DEFAULT_PAGE_OBJECT_PATTERNS: PageObjectPattern[] = [
  {
    id: 'base-page',
    name: 'Base Page Class',
    description: 'Abstract base class with common page functionality',
    enabled: true,
  },
  {
    id: 'component-page',
    name: 'Component Page Objects',
    description: 'Modular page objects for reusable UI components',
    enabled: true,
  },
  {
    id: 'fluent-interface',
    name: 'Fluent Interface Pattern',
    description: 'Chainable methods for readable test flows',
    enabled: false,
  },
  {
    id: 'page-factory',
    name: 'Page Factory Pattern',
    description: 'Automatic page object instantiation and injection',
    enabled: false,
  },
];

export const DEFAULT_SETUP_TEARDOWN_PATTERNS: SetupTeardownPattern[] = [
  {
    id: 'global-setup',
    name: 'Global Setup/Teardown',
    description: 'One-time setup before all tests and cleanup after',
    enabled: true,
    scope: 'global',
  },
  {
    id: 'test-isolation',
    name: 'Test Isolation',
    description: 'Clean browser state between each test',
    enabled: true,
    scope: 'test',
  },
  {
    id: 'data-cleanup',
    name: 'Data Cleanup',
    description: 'Automatic cleanup of test-created data',
    enabled: true,
    scope: 'test',
  },
  {
    id: 'browser-reset',
    name: 'Browser State Reset',
    description: 'Clear cookies, storage, and cache between tests',
    enabled: false,
    scope: 'test',
  },
  {
    id: 'parallel-hooks',
    name: 'Parallel-Safe Hooks',
    description: 'Setup/teardown patterns that work with parallel execution',
    enabled: false,
    scope: 'describe',
  },
];

export const DEFAULT_AUTHENTICATION_FIXTURES: AuthenticationFixture[] = [
  {
    id: 'login-fixture',
    name: 'User Login Fixture',
    description: 'Automatic user authentication for tests',
    enabled: true,
    method: 'session',
  },
  {
    id: 'role-fixtures',
    name: 'User Role Fixtures',
    description: 'Pre-authenticated users with different roles/permissions',
    enabled: false,
    method: 'session',
  },
  {
    id: 'api-token',
    name: 'API Token Authentication',
    description: 'Bearer token authentication for API tests',
    enabled: false,
    method: 'token',
  },
  {
    id: 'session-storage',
    name: 'Session Storage Auth',
    description: 'Authentication via browser session storage',
    enabled: false,
    method: 'session',
  },
];

export const DEFAULT_CUSTOM_FIXTURES: FixtureOption[] = [
  {
    id: 'database-fixture',
    name: 'Database Connection',
    description: 'Direct database access for data validation',
    category: 'utilities',
    enabled: false,
    advanced: true,
  },
  {
    id: 'email-fixture',
    name: 'Email Testing',
    description: 'Email capture and validation utilities',
    category: 'utilities',
    enabled: false,
  },
  {
    id: 'file-upload',
    name: 'File Upload Helpers',
    description: 'Utilities for testing file upload functionality',
    category: 'utilities',
    enabled: false,
  },
  {
    id: 'mobile-fixture',
    name: 'Mobile Device Simulation',
    description: 'Mobile device and touch interaction fixtures',
    category: 'utilities',
    enabled: false,
  },
  {
    id: 'performance-fixture',
    name: 'Performance Monitoring',
    description: 'Web vitals and performance measurement fixtures',
    category: 'utilities',
    enabled: false,
    advanced: true,
  },
  {
    id: 'visual-fixture',
    name: 'Visual Testing Helpers',
    description: 'Screenshot comparison and visual regression fixtures',
    category: 'utilities',
    enabled: false,
  },
];

export const DEFAULT_TEST_DATA_STRATEGY: TestDataStrategy = {
  strategy: 'isolated',
  description: 'Each test gets its own isolated copy of test data',
  fileFormat: 'json',
  enabled: true,
};