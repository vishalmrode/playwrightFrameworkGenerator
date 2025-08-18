import { FixturesState } from '@/types/fixtures';
/**
 * ConfigureTestFixtures/index.ts
 * Purpose: Helpers to validate fixture configuration, compute conflicts,
 * produce recommendations and generate the list of required dependencies for
 * the chosen fixtures. Used by the Fixtures UI and generator.
 */
import type { 
  FixtureValidation, 
  GeneratedFixtureFile, 
  FixtureGenerationResult,
  FixtureConflict,
  FixtureRecommendation
} from './types';
import { 
  FIXTURE_DEPENDENCIES, 
  FIXTURE_CONFLICTS, 
  FIXTURE_SYNERGIES, 
  FIXTURE_COMPLEXITY,
  TEST_DATA_STRATEGY_CONFIG 
} from './config';

/**
 * Validates the fixtures configuration for conflicts and requirements
 */
export function validateFixturesConfiguration(state: FixturesState): FixtureValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for required fixtures
  const hasAnyPageObject = state.pageObjectPatterns.some(p => p.enabled);
  if (!hasAnyPageObject && state.reusableComponents) {
    warnings.push('Reusable components are enabled but no page object patterns are selected');
  }

  // Check for conflicting patterns
  const enabledPatterns = [
    ...state.pageObjectPatterns.filter(p => p.enabled).map(p => p.id),
    ...state.setupTeardownPatterns.filter(p => p.enabled).map(p => p.id),
    ...state.authenticationFixtures.filter(f => f.enabled).map(f => f.id),
    ...state.customFixtures.filter(f => f.enabled).map(f => f.id),
    state.testDataStrategy.strategy,
  ];

  // Check for conflicts
  for (const pattern of enabledPatterns) {
    const conflicts = FIXTURE_CONFLICTS[pattern];
    if (conflicts) {
      const conflicting = conflicts.filter(c => enabledPatterns.includes(c));
      if (conflicting.length > 0) {
        errors.push(`${pattern} conflicts with: ${conflicting.join(', ')}`);
      }
    }
  }

  // Check for advanced patterns without prerequisites
  if (state.pageObjectPatterns.find(p => p.id === 'fluent-interface' && p.enabled)) {
    const hasBasePage = state.pageObjectPatterns.find(p => p.id === 'base-page' && p.enabled);
    if (!hasBasePage) {
      warnings.push('Fluent interface pattern works best with Base Page Class enabled');
    }
  }

  // Check timeout configuration
  if (state.fixtureTimeout < 5000 || state.fixtureTimeout > 300000) {
    warnings.push('Fixture timeout should be between 5 and 300 seconds');
  }

  // Check for parallel safety
  if (state.parallelSafe) {
    const unsafePatterns = state.setupTeardownPatterns.filter(p => 
      p.enabled && p.id === 'global-setup' && p.scope === 'global'
    );
    if (unsafePatterns.length === 0) {
      warnings.push('Parallel-safe mode is enabled but no global setup patterns are configured');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Gets a description of the current fixtures configuration
 */
export function getFixturesDescription(state: FixturesState): string {
  const enabledCategories = [];
  
  if (state.pageObjectPatterns.some(p => p.enabled)) {
    enabledCategories.push('Page Objects');
  }
  
  if (state.setupTeardownPatterns.some(p => p.enabled)) {
    enabledCategories.push('Setup/Teardown');
  }
  
  if (state.authenticationFixtures.some(f => f.enabled)) {
    enabledCategories.push('Authentication');
  }
  
  if (state.customFixtures.some(f => f.enabled)) {
    enabledCategories.push('Custom Utilities');
  }

  if (enabledCategories.length === 0) {
    return 'No fixtures configured';
  }

  const strategyDescription = TEST_DATA_STRATEGY_CONFIG[state.testDataStrategy.strategy]?.description || 'Custom data strategy';
  
  return `${enabledCategories.join(', ')} with ${strategyDescription.toLowerCase()}`;
}

/**
 * Gets fixture conflicts for the current configuration
 */
export function getFixtureConflicts(state: FixturesState): FixtureConflict[] {
  const conflicts: FixtureConflict[] = [];
  
  const enabledFixtures = [
    ...state.pageObjectPatterns.filter(p => p.enabled).map(p => ({ id: p.id, name: p.name })),
    ...state.setupTeardownPatterns.filter(p => p.enabled).map(p => ({ id: p.id, name: p.name })),
    ...state.authenticationFixtures.filter(f => f.enabled).map(f => ({ id: f.id, name: f.name })),
    ...state.customFixtures.filter(f => f.enabled).map(f => ({ id: f.id, name: f.name })),
  ];

  for (const fixture of enabledFixtures) {
    const conflictIds = FIXTURE_CONFLICTS[fixture.id] || [];
    for (const conflictId of conflictIds) {
      const conflicting = enabledFixtures.find(f => f.id === conflictId);
      if (conflicting) {
        conflicts.push({
          fixtureId: fixture.id,
          conflictWith: conflicting.id,
          reason: `${fixture.name} and ${conflicting.name} use incompatible patterns`,
          resolution: `Disable either ${fixture.name} or ${conflicting.name}`,
        });
      }
    }
  }

  return conflicts;
}

/**
 * Gets recommendations for improving the fixtures configuration
 */
export function getFixtureRecommendations(state: FixturesState): FixtureRecommendation[] {
  const recommendations: FixtureRecommendation[] = [];
  
  // Recommend synergistic fixtures
  const enabledIds = [
    ...state.pageObjectPatterns.filter(p => p.enabled).map(p => p.id),
    ...state.setupTeardownPatterns.filter(p => p.enabled).map(p => p.id),
    ...state.authenticationFixtures.filter(f => f.enabled).map(f => f.id),
    ...state.customFixtures.filter(f => f.enabled).map(f => f.id),
  ];

  for (const enabledId of enabledIds) {
    const synergies = FIXTURE_SYNERGIES[enabledId] || [];
    for (const synergyId of synergies) {
      if (!enabledIds.includes(synergyId)) {
        const fixtureExists = [
          ...state.pageObjectPatterns,
          ...state.setupTeardownPatterns,
          ...state.authenticationFixtures,
          ...state.customFixtures,
        ].some(f => f.id === synergyId);

        if (fixtureExists) {
          recommendations.push({
            type: 'enable',
            fixtureId: synergyId,
            reason: `Works well with ${enabledId} for improved functionality`,
            impact: 'medium',
          });
        }
      }
    }
  }

  // Recommend test isolation for beginners
  const hasComplexPatterns = enabledIds.some(id => 
    FIXTURE_COMPLEXITY[id] === 'advanced'
  );
  
  if (hasComplexPatterns && !state.setupTeardownPatterns.find(p => p.id === 'test-isolation')?.enabled) {
    recommendations.push({
      type: 'enable',
      fixtureId: 'test-isolation',
      reason: 'Advanced fixtures work better with proper test isolation',
      impact: 'high',
    });
  }

  // Recommend factory pattern for comprehensive setups
  if (enabledIds.length > 8 && state.testDataStrategy.strategy === 'isolated') {
    recommendations.push({
      type: 'configure',
      fixtureId: 'test-data-strategy',
      reason: 'Factory pattern provides better flexibility for complex test setups',
      impact: 'medium',
    });
  }

  return recommendations.slice(0, 5); // Limit to top 5 recommendations
}

/**
 * Gets the required dependencies for the current fixtures configuration
 */
export function getRequiredDependencies(state: FixturesState): string[] {
  const dependencies = new Set<string>();
  
  const enabledFixtures = [
    ...state.pageObjectPatterns.filter(p => p.enabled).map(p => p.id),
    ...state.setupTeardownPatterns.filter(p => p.enabled).map(p => p.id),
    ...state.authenticationFixtures.filter(f => f.enabled).map(f => f.id),
    ...state.customFixtures.filter(f => f.enabled).map(f => f.id),
  ];

  for (const fixtureId of enabledFixtures) {
    const fixtureDeps = FIXTURE_DEPENDENCIES[fixtureId] || [];
    fixtureDeps.forEach(dep => {
      dependencies.add(`${dep.packageName}@${dep.version}`);
    });
  }

  return Array.from(dependencies);
}

/**
 * Generates sample fixture files based on configuration
 */
export function generateFixtureFiles(state: FixturesState, language: 'typescript' | 'javascript'): GeneratedFixtureFile[] {
  const files: GeneratedFixtureFile[] = [];
  const ext = language === 'typescript' ? 'ts' : 'js';
  
  // Generate base page if enabled
  if (state.pageObjectPatterns.find(p => p.id === 'base-page')?.enabled) {
    files.push({
      path: `tests/pages/BasePage.${ext}`,
      content: generateBasePageContent(language),
      description: 'Abstract base class with common page functionality',
    });
  }

  // Generate authentication fixture if enabled
  const loginFixture = state.authenticationFixtures.find(f => f.id === 'login-fixture');
  if (loginFixture?.enabled) {
    files.push({
      path: `tests/fixtures/auth.${ext}`,
      content: generateAuthFixtureContent(language, loginFixture.method),
      description: 'User authentication fixture for tests',
    });
  }

  // Generate test data helpers
  if (state.testDataStrategy.enabled) {
    files.push({
      path: `tests/fixtures/testData.${ext}`,
      content: generateTestDataFixtureContent(language, state.testDataStrategy),
      description: 'Test data management and loading utilities',
    });
  }

  // Generate global setup if enabled
  if (state.setupTeardownPatterns.find(p => p.id === 'global-setup')?.enabled) {
    files.push({
      path: `tests/global-setup.${ext}`,
      content: generateGlobalSetupContent(language),
      description: 'Global test setup and teardown configuration',
    });
  }

  return files;
}

// keep type referenced for external consumers
void (0 as unknown as FixtureGenerationResult);

/**
 * Helper functions for generating file content
 */
function generateBasePageContent(language: 'typescript' | 'javascript'): string {
  if (language === 'typescript') {
    return `import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  protected constructor(public readonly page: Page) {}

  abstract get url(): string;
  abstract get title(): string;

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  protected async waitForElement(selector: string): Promise<Locator> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });
    return element;
  }

  protected async clickElement(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.click();
  }

  protected async fillElement(selector: string, text: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.fill(text);
  }
}`;
  } else {
    return `const { Page } = require('@playwright/test');

class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto(this.url);
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async getTitle() {
    return await this.page.title();
  }

  async waitForElement(selector) {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });
    return element;
  }

  async clickElement(selector) {
    const element = await this.waitForElement(selector);
    await element.click();
  }

  async fillElement(selector, text) {
    const element = await this.waitForElement(selector);
    await element.fill(text);
  }
}

module.exports = { BasePage };`;
  }
}

function generateAuthFixtureContent(language: 'typescript' | 'javascript', method: string): string {
  if (language === 'typescript') {
    return `import { test as base, Page } from '@playwright/test';

interface User {
  username: string;
  password: string;
  email: string;
}

export const test = base.extend<{
  authenticatedUser: User;
  loginPage: Page;
}>({
  authenticatedUser: async ({ page }, use) => {
    const user = {
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com'
    };

    // Perform login based on method: ${method}
    await page.goto('/login');
    await page.fill('[data-testid="username"]', user.username);
    await page.fill('[data-testid="password"]', user.password);
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');

    await use(user);
  },

  loginPage: async ({ page }, use) => {
    await page.goto('/login');
    await use(page);
  },
});

export { expect } from '@playwright/test';`;
  } else {
    return `const { test: base } = require('@playwright/test');

const test = base.extend({
  authenticatedUser: async ({ page }, use) => {
    const user = {
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com'
    };

    // Perform login based on method: ${method}
    await page.goto('/login');
    await page.fill('[data-testid="username"]', user.username);
    await page.fill('[data-testid="password"]', user.password);
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');

    await use(user);
  },

  loginPage: async ({ page }, use) => {
    await page.goto('/login');
    await use(page);
  },
});

module.exports = { test, expect: require('@playwright/test').expect };`;
  }
}

function generateTestDataFixtureContent(language: 'typescript' | 'javascript', strategy: any): string {
  if (language === 'typescript') {
    return `import { readFileSync } from 'fs';
import { join } from 'path';

export interface TestData {
  users: Array<{
    id: string;
    username: string;
    email: string;
    role: string;
  }>;
  products: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

export class TestDataManager {
  private static instance: TestDataManager;
  private testData: TestData;

  private constructor() {
    this.loadTestData();
  }

  public static getInstance(): TestDataManager {
    if (!TestDataManager.instance) {
      TestDataManager.instance = new TestDataManager();
    }
    return TestDataManager.instance;
  }

  private loadTestData(): void {
    // Strategy: ${strategy.strategy}
    const dataPath = join(__dirname, '../test-data/data.json');
    const rawData = readFileSync(dataPath, 'utf8');
    this.testData = JSON.parse(rawData);
  }

  public getUsers(): TestData['users'] {
    ${strategy.strategy === 'isolated' ? 
      'return structuredClone(this.testData.users); // Isolated copy' : 
      'return this.testData.users; // Shared reference'
    }
  }

  public getProducts(): TestData['products'] {
    ${strategy.strategy === 'isolated' ? 
      'return structuredClone(this.testData.products); // Isolated copy' : 
      'return this.testData.products; // Shared reference'
    }
  }
}`;
  } else {
    return `const fs = require('fs');
const path = require('path');

class TestDataManager {
  constructor() {
    this.loadTestData();
  }

  loadTestData() {
    // Strategy: ${strategy.strategy}
    const dataPath = path.join(__dirname, '../test-data/data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    this.testData = JSON.parse(rawData);
  }

  getUsers() {
    ${strategy.strategy === 'isolated' ? 
      'return JSON.parse(JSON.stringify(this.testData.users)); // Isolated copy' : 
      'return this.testData.users; // Shared reference'
    }
  }

  getProducts() {
    ${strategy.strategy === 'isolated' ? 
      'return JSON.parse(JSON.stringify(this.testData.products)); // Isolated copy' : 
      'return this.testData.products; // Shared reference'
    }
  }
}

module.exports = { TestDataManager };`;
  }
}

function generateGlobalSetupContent(language: 'typescript' | 'javascript'): string {
  if (language === 'typescript') {
    return `import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig): Promise<void> {
  console.log('🚀 Starting global setup...');
  
  // Database setup, authentication, or other global preparations
  // This runs once before all tests
  
  console.log('✅ Global setup completed');
}

async function globalTeardown(config: FullConfig): Promise<void> {
  console.log('🧹 Starting global teardown...');
  
  // Cleanup operations
  // This runs once after all tests
  
  console.log('✅ Global teardown completed');
}

export { globalSetup, globalTeardown };`;
  } else {
    return `async function globalSetup(config) {
  console.log('🚀 Starting global setup...');
  
  // Database setup, authentication, or other global preparations
  // This runs once before all tests
  
  console.log('✅ Global setup completed');
}

async function globalTeardown(config) {
  console.log('🧹 Starting global teardown...');
  
  // Cleanup operations
  // This runs once after all tests
  
  console.log('✅ Global teardown completed');
}

module.exports = { globalSetup, globalTeardown };`;
  }
}