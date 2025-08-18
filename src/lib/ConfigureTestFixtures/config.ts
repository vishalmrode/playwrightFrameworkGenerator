/**
 * ConfigureTestFixtures/config.ts
 * Purpose: Static configuration maps used by fixture generation. Contains
 * dependency lists, conflict maps, complexity ratings and recommended strategies
 * for different fixture types. These are static data structures used by the
 * fixture generator and validators.
 */
import type { TestDataStrategy } from '@/types/fixtures';
import { FixtureDependency } from './types';

// Package dependencies for different fixture types
export const FIXTURE_DEPENDENCIES: Record<string, FixtureDependency[]> = {
  'database-fixture': [
    { packageName: 'pg', version: '^8.11.3', devDependency: true, optional: false },
    { packageName: '@types/pg', version: '^8.10.9', devDependency: true, optional: false },
  ],
  'email-fixture': [
    { packageName: 'nodemailer', version: '^6.9.7', devDependency: true, optional: false },
    { packageName: '@types/nodemailer', version: '^6.4.14', devDependency: true, optional: false },
    { packageName: 'mailhog', version: '^1.0.0', devDependency: true, optional: true },
  ],
  'performance-fixture': [
    { packageName: 'web-vitals', version: '^3.5.0', devDependency: true, optional: false },
    { packageName: 'lighthouse', version: '^11.4.0', devDependency: true, optional: true },
  ],
  'visual-fixture': [
    { packageName: '@playwright/test', version: '^1.40.0', devDependency: true, optional: false },
    { packageName: 'pixelmatch', version: '^5.3.0', devDependency: true, optional: true },
  ],
  'mobile-fixture': [
    { packageName: '@playwright/test', version: '^1.40.0', devDependency: true, optional: false },
  ],
  'file-upload': [
    { packageName: '@playwright/test', version: '^1.40.0', devDependency: true, optional: false },
    { packageName: 'tmp', version: '^0.2.1', devDependency: true, optional: false },
  ],
};

// Fixture conflicts - fixtures that shouldn't be enabled together
export const FIXTURE_CONFLICTS: Record<string, string[]> = {
  'isolated': ['shared', 'persistent'],
  'shared': ['isolated', 'persistent'],
  'persistent': ['isolated', 'shared'],
  'fluent-interface': ['page-factory'], // Different architectural patterns
  'page-factory': ['fluent-interface'],
};

// Compatible combinations
export const FIXTURE_SYNERGIES: Record<string, string[]> = {
  'base-page': ['component-page', 'fluent-interface'],
  'component-page': ['base-page', 'reusable-components'],
  'login-fixture': ['role-fixtures', 'session-storage'],
  'database-fixture': ['data-cleanup', 'test-isolation'],
  'performance-fixture': ['global-setup', 'browser-reset'],
  'visual-fixture': ['browser-reset', 'test-isolation'],
};

// Fixture complexity ratings
export const FIXTURE_COMPLEXITY: Record<string, 'simple' | 'moderate' | 'advanced'> = {
  'base-page': 'simple',
  'component-page': 'moderate',
  'fluent-interface': 'advanced',
  'page-factory': 'advanced',
  'test-isolation': 'simple',
  'global-setup': 'simple',
  'data-cleanup': 'moderate',
  'browser-reset': 'moderate',
  'parallel-hooks': 'advanced',
  'login-fixture': 'simple',
  'role-fixtures': 'moderate',
  'api-token': 'moderate',
  'session-storage': 'moderate',
  'database-fixture': 'advanced',
  'email-fixture': 'moderate',
  'file-upload': 'simple',
  'mobile-fixture': 'moderate',
  'performance-fixture': 'advanced',
  'visual-fixture': 'moderate',
};

// ensure types are retained for consumers
void FIXTURE_COMPLEXITY;

// Default configurations for test data strategies
export const TEST_DATA_STRATEGY_CONFIG: Record<TestDataStrategy['strategy'], {
  description: string;
  benefits: string[];
  drawbacks: string[];
  recommended: boolean;
}> = {
  isolated: {
    description: 'Each test gets its own isolated copy of test data',
    benefits: [
      'Tests are completely independent',
      'No data pollution between tests',
      'Easy to debug and maintain',
    ],
    drawbacks: [
      'Higher memory usage',
      'Slower test execution',
      'More setup overhead',
    ],
    recommended: true,
  },
  shared: {
    description: 'Multiple tests share the same test data set',
    benefits: [
      'Faster test execution',
      'Lower memory usage',
      'Simpler data management',
    ],
    drawbacks: [
      'Tests may interfere with each other',
      'Harder to debug failures',
      'Order dependency issues',
    ],
    recommended: false,
  },
  persistent: {
    description: 'Test data persists across test runs',
    benefits: [
      'Very fast test startup',
      'Consistent test environment',
      'Good for integration testing',
    ],
    drawbacks: [
      'Data consistency issues',
      'Complex cleanup requirements',
      'Hard to isolate test failures',
    ],
    recommended: false,
  },
  factory: {
    description: 'Dynamic test data generation using factories',
    benefits: [
      'Flexible data creation',
      'Realistic test scenarios',
      'Good for edge case testing',
    ],
    drawbacks: [
      'More complex implementation',
      'Harder to reproduce failures',
      'Potential for random failures',
    ],
    recommended: true,
  },
};