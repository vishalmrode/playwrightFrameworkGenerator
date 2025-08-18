import { DockerConfig } from '@/types/docker';
import { DOCKERFILE_TEMPLATES, DOCKER_COMPOSE_TEMPLATE, DOCKER_IGNORE_TEMPLATE } from './config';

/**
 * Validates Docker configuration
 */
export const validateDockerConfig = (config: DockerConfig): boolean => {
  if (!config.enabled) return true;
  
  // Validate custom image is provided when using custom base
  if (config.baseImage === 'custom' && (!config.customImage || config.customImage.trim() === '')) {
    return false;
  }
  
  return true;
};

/**
 * Gets validation errors for Docker configuration
 */
export const getDockerConfigErrors = (config: DockerConfig): string[] => {
  const errors: string[] = [];
  
  if (!config.enabled) return errors;
  
  if (config.baseImage === 'custom' && (!config.customImage || config.customImage.trim() === '')) {
    errors.push('Custom image name is required when using custom base image');
  }
  
  return errors;
};

/**
 * Gets a description of the Docker configuration
 */
export const getDockerConfigDescription = (config: DockerConfig): string => {
  if (!config.enabled) {
    return 'Docker support disabled';
  }
  
  const features = [];
  
  // Base description
  switch (config.baseImage) {
    case 'playwright':
      features.push('Microsoft Playwright base image');
      break;
    case 'node-playwright':
      features.push('Node.js with Playwright installation');
      break;
    case 'custom':
      features.push(`Custom base: ${config.customImage || 'not specified'}`);
      break;
  }
  
  // Add enabled features
  if (config.features.dockerCompose) {
    features.push('Docker Compose');
  }
  
  if (config.features.multiStage) {
    features.push('Multi-stage build');
  }
  
  if (config.features.healthChecks) {
    features.push('Health checks');
  }
  
  // Add resource limits
  features.push(`${config.resources.memoryLimit} memory, ${config.resources.cpuLimit} CPU`);
  
  return features.join(', ');
};

/**
 * Gets the packages that need to be installed based on Docker configuration
 */
export const getDockerRequiredPackages = (config: DockerConfig): string[] => {
  const packages: string[] = [];
  
  if (!config.enabled) return packages;
  
  // Base packages for Docker support
  if (config.baseImage === 'node-playwright' || config.baseImage === 'custom') {
    packages.push('@playwright/test');
  }
  
  return packages;
};

/**
 * Gets the files that will be generated based on Docker configuration
 */
export const getDockerGeneratedFiles = (config: DockerConfig): string[] => {
  const files: string[] = [];
  
  if (!config.enabled) return files;
  
  // Always generate Dockerfile and .dockerignore
  files.push('Dockerfile', '.dockerignore');
  
  // Docker Compose files
  if (config.features.dockerCompose) {
    files.push('docker-compose.yml');
  }
  
  return files;
};

/**
 * Generates Dockerfile content based on configuration
 */
export const generateDockerfile = (config: DockerConfig): string => {
  if (!config.enabled) return '';
  
  let template = DOCKERFILE_TEMPLATES.basic;
  
  if (config.features.multiStage) {
    template = DOCKERFILE_TEMPLATES.multiStage;
  } else if (config.baseImage === 'custom') {
    template = DOCKERFILE_TEMPLATES.custom;
  }
  
  // Simple template replacement
  let content = template
    .replace(/{{baseImage}}/g, getBaseImageName(config))
    .replace(/{{customImage}}/g, config.customImage || '');
  
  // Handle conditional blocks
  const installPlaywright = config.baseImage !== 'playwright';
  const healthCheck = config.features.healthChecks;
  
  content = content.replace(/{{#if installPlaywright}}([\s\S]*?){{\/if}}/g, 
    installPlaywright ? '$1' : '');
  
  content = content.replace(/{{#if healthCheck}}([\s\S]*?){{\/if}}/g, 
    healthCheck ? '$1' : '');
  
  return content.trim();
};

/**
 * Generates Docker Compose content based on configuration
 */
export const generateDockerCompose = (config: DockerConfig): string => {
  if (!config.enabled || !config.features.dockerCompose) return '';
  
  let content = DOCKER_COMPOSE_TEMPLATE;
  
  // Replace template variables
  const replacements = {
    memoryLimit: config.resources.memoryLimit,
    cpuLimit: config.resources.cpuLimit,
    healthCheck: config.features.healthChecks,
    includeDatabase: false, // This could be extended to support database services
    includeRedis: false,    // This could be extended to support Redis service
  };
  
  // Simple template replacement for boolean conditions
  Object.entries(replacements).forEach(([key, value]) => {
    if (typeof value === 'boolean') {
      const regex = new RegExp(`{{#if ${key}}}([\\s\\S]*?){{/if}}`, 'g');
      content = content.replace(regex, value ? '$1' : '');
    } else {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }
  });
  
  return content.trim();
};

/**
 * Generates .dockerignore content
 */
export const generateDockerIgnore = (): string => {
  return DOCKER_IGNORE_TEMPLATE;
};

/**
 * Gets Docker commands for running tests
 */
export const getDockerCommands = (config: DockerConfig): { [key: string]: string[] } => {
  const commands: { [key: string]: string[] } = {};
  
  if (!config.enabled) return commands;
  
  // Basic Docker commands
  commands['Build Image'] = [
    'docker build -t playwright-tests .'
  ];
  
  commands['Run Tests'] = [
    'docker run --rm -v $(pwd)/test-results:/app/test-results playwright-tests'
  ];
  
  // Docker Compose commands
  if (config.features.dockerCompose) {
    commands['Docker Compose'] = [
      'docker-compose up --build --abort-on-container-exit'
    ];
    
    commands['Run in Background'] = [
      'docker-compose up -d',
      'docker-compose logs -f playwright-tests'
    ];
    
    commands['Cleanup'] = [
      'docker-compose down -v'
    ];
  }
  
  return commands;
};

/**
 * Gets example usage snippets for Docker configuration
 */
export const getDockerExamples = (config: DockerConfig): { [key: string]: string[] } => {
  const examples: { [key: string]: string[] } = {};
  
  if (!config.enabled) return examples;
  
  examples['Local Development'] = [
    '# Build the Docker image',
    'docker build -t playwright-tests .',
    '',
    '# Run tests with volume mounting',
    'docker run --rm \\',
    '  -v $(pwd)/test-results:/app/test-results \\',
    '  -v $(pwd)/playwright-report:/app/playwright-report \\',
    '  playwright-tests'
  ];
  
  if (config.features.dockerCompose) {
    examples['Docker Compose'] = [
      '# Start all services and run tests',
      'docker-compose up --build',
      '',
      '# Run tests in detached mode',
      'docker-compose up -d',
      'docker-compose logs -f playwright-tests',
      '',
      '# Clean up containers and volumes',
      'docker-compose down -v'
    ];
  }
  
  examples['CI/CD Pipeline'] = [
    '# GitHub Actions example',
    'name: Playwright Tests',
    'on: [push, pull_request]',
    'jobs:',
    '  test:',
    '    runs-on: ubuntu-latest',
    '    steps:',
    '      - uses: actions/checkout@v4',
    '      - name: Run Playwright tests',
    '        run: |',
    '          docker build -t playwright-tests .',
    '          docker run --rm -v $PWD:/workspace playwright-tests'
  ];
  
  return examples;
};

/**
 * Helper function to get the actual Docker image name
 */
function getBaseImageName(config: DockerConfig): string {
  switch (config.baseImage) {
    case 'playwright':
      return 'mcr.microsoft.com/playwright:v1.40.0-jammy';
    case 'node-playwright':
      return 'node:18-alpine';
    case 'custom':
      return config.customImage || 'node:18-alpine';
    default:
      return 'mcr.microsoft.com/playwright:v1.40.0-jammy';
  }
}