import { 
  ProjectFile, 
  ProjectStructure, 
  PreviewConfiguration, 
  GeneratedPreview 
} from './types';
import { generateConfigFiles } from './generators/config';
import { generateTestFiles } from './generators/tests';
import { generatePageObjects } from './generators/pages';
import { generateFixtureFiles } from './generators/fixtures';
import { generateUtilityFiles } from './generators/utils';
import { generateCIFiles } from './generators/ci';
import { generateDockerFiles } from './generators/docker';
import { generateDirectoryStructure } from './generators/structure';

/**
 * Generates a complete preview of the framework structure
 */
export function generateFrameworkPreview(config: PreviewConfiguration): GeneratedPreview {
  const files: ProjectFile[] = [];
  const directories: string[] = [];
  const dependencies: string[] = ['@playwright/test'];
  const devDependencies: string[] = ['@types/node'];
  const scripts: Record<string, string> = {
    'test': 'npx playwright test',
    'test:ui': 'npx playwright test --ui',
    'test:headed': 'npx playwright test --headed',
    'test:debug': 'npx playwright test --debug',
    'report': 'npx playwright show-report',
  };

  // Generate configuration files
  const configFiles = generateConfigFiles(config);
  files.push(...configFiles.files);
  dependencies.push(...configFiles.dependencies);
  devDependencies.push(...configFiles.devDependencies);
  Object.assign(scripts, configFiles.scripts);

  // Generate test files
  const testFiles = generateTestFiles(config);
  files.push(...testFiles.files);
  dependencies.push(...testFiles.dependencies);

  // Generate page objects
  const pageFiles = generatePageObjects(config);
  files.push(...pageFiles.files);

  // Generate fixture files
  const fixtureFiles = generateFixtureFiles(config);
  files.push(...fixtureFiles.files);
  dependencies.push(...fixtureFiles.dependencies);

  // Generate utility files
  const utilFiles = generateUtilityFiles(config);
  files.push(...utilFiles.files);
  dependencies.push(...utilFiles.dependencies);

  // Generate CI/CD files
  const ciFiles = generateCIFiles(config);
  files.push(...ciFiles.files);

  // Generate Docker files
  if (config.docker) {
    const dockerFiles = generateDockerFiles(config);
    files.push(...dockerFiles.files);
  }

  // Generate directory structure
  const dirStructure = generateDirectoryStructure(files);
  directories.push(...dirStructure);

  const structure: ProjectStructure = {
    name: 'playwright-framework',
    description: 'Generated Playwright testing framework',
    files,
    directories,
    dependencies: Array.from(new Set(dependencies)),
    devDependencies: Array.from(new Set(devDependencies)),
    scripts,
  };

  const highlights = {
    keyFiles: getKeyFiles(files),
    importantFeatures: getImportantFeatures(config),
    recommendations: getRecommendations(config),
  };

  const stats = {
    totalFiles: files.length,
    totalDirectories: directories.length,
    dependencies: structure.dependencies.length,
    testExamples: files.filter(f => f.category === 'test').length,
  };

  return {
    structure,
    highlights,
    stats,
  };
}

/**
 * Gets the most important files to highlight
 */
function getKeyFiles(files: ProjectFile[]): string[] {
  const keyFiles = [];
  
  // Configuration files
  const configFile = files.find(f => f.path.includes('playwright.config'));
  if (configFile) keyFiles.push(configFile.path);
  
  // Main test file
  const testFile = files.find(f => f.category === 'test');
  if (testFile) keyFiles.push(testFile.path);
  
  // Base page object
  const basePage = files.find(f => f.path.includes('BasePage'));
  if (basePage) keyFiles.push(basePage.path);
  
  // Authentication fixture
  const authFixture = files.find(f => f.path.includes('auth') && f.category === 'fixture');
  if (authFixture) keyFiles.push(authFixture.path);

  // Docker files
  const dockerfile = files.find(f => f.path === 'Dockerfile');
  if (dockerfile) keyFiles.push(dockerfile.path);

  return keyFiles;
}

/**
 * Gets important features based on configuration
 */
function getImportantFeatures(config: PreviewConfiguration): string[] {
  const features = [];

  features.push(`${config.language.charAt(0).toUpperCase() + config.language.slice(1)} support`);
  
  if (config.browsers.length > 1) {
    features.push(`Cross-browser testing (${config.browsers.length} browsers)`);
  }

  if (config.capabilities.includes('uiTesting')) {
    features.push('UI Testing capabilities');
  }

  if (config.capabilities.includes('apiTesting')) {
    features.push('API Testing capabilities');
  }

  if (config.environments.length > 1) {
    features.push(`Multi-environment support (${config.environments.length} environments)`);
  }

  if (config.integrations.length > 0) {
    features.push(`${config.integrations.length} integrations enabled`);
  }

  if (config.fixtures.length > 0) {
    features.push('Advanced fixture patterns');
  }

  if (config.docker) {
    features.push('Docker containerization');
  }

  return features;
}

/**
 * Gets recommendations based on configuration
 */
function getRecommendations(config: PreviewConfiguration): string[] {
  const recommendations = [];

  if (config.language === 'javascript') {
    recommendations.push('Consider upgrading to TypeScript for better type safety');
  }

  if (config.browsers.length === 1) {
    recommendations.push('Add more browsers for comprehensive cross-browser testing');
  }

  if (!config.capabilities.includes('apiTesting')) {
    recommendations.push('Enable API testing for full-stack test coverage');
  }

  if (config.integrations.length === 0) {
    recommendations.push('Consider adding CI/CD integration for automated testing');
  }

  if (!config.docker) {
    recommendations.push('Docker support can improve test consistency across environments');
  }

  return recommendations.slice(0, 3); // Limit to top 3
}

// Re-export types for easier importing
export type { 
  ProjectFile, 
  ProjectStructure, 
  PreviewConfiguration, 
  GeneratedPreview 
} from './types';