import { DockerConfigurationGroup, DockerOption } from './types';

export const DOCKER_OPTIONS: DockerOption[] = [
  {
    id: 'dockerfile',
    name: 'Dockerfile Generation',
    description: 'Generate optimized Dockerfile for test execution',
    icon: 'FileText',
    category: 'base',
    recommended: true,
  },
  {
    id: 'docker-compose',
    name: 'Docker Compose',
    description: 'Container orchestration with docker-compose.yml',
    icon: 'Layers',
    category: 'orchestration',
    recommended: true,
  },
  {
    id: 'multi-stage',
    name: 'Multi-stage Build',
    description: 'Optimized multi-stage Dockerfile for smaller images',
    icon: 'GitBranch',
    category: 'build',
    advanced: true,
  },
  {
    id: 'health-checks',
    name: 'Health Checks',
    description: 'Container health monitoring and readiness checks',
    icon: 'Heart',
    category: 'runtime',
  },
  {
    id: 'volume-mounts',
    name: 'Volume Mounts',
    description: 'Persistent data and shared volumes',
    icon: 'HardDrive',
    category: 'runtime',
  },
  {
    id: 'network-config',
    name: 'Network Configuration',
    description: 'Custom Docker networks for service communication',
    icon: 'Wifi',
    category: 'orchestration',
    advanced: true,
  },
];

export const DOCKER_CONFIGURATION: DockerConfigurationGroup[] = [
  {
    title: 'Base Configuration',
    description: 'Essential Docker setup options',
    options: [
      {
        key: 'baseImage',
        label: 'Base Docker Image',
        description: 'Choose the foundation for your Docker container',
        type: 'select',
        defaultValue: 'playwright',
        options: [
          {
            value: 'playwright',
            label: 'Microsoft Playwright (mcr.microsoft.com/playwright)',
            description: 'Pre-configured with all browsers and dependencies',
          },
          {
            value: 'node-playwright',
            label: 'Node.js + Playwright (node:18-alpine)',
            description: 'Lightweight Node.js image with Playwright installation',
          },
          {
            value: 'custom',
            label: 'Custom Base Image',
            description: 'Specify your own Docker base image',
          },
        ],
      },
      {
        key: 'customImage',
        label: 'Custom Image Name',
        description: 'Specify the custom Docker image (required when using custom base)',
        type: 'string',
        defaultValue: '',
        dependency: 'baseImage=custom',
        validation: (value: string) => value.length > 0 || 'Custom image name is required',
      },
    ],
  },
  {
    title: 'Build Options',
    description: 'Configure Docker build process',
    options: [
      {
        key: 'multiStage',
        label: 'Multi-stage Build',
        description: 'Use multi-stage build to optimize image size',
        type: 'boolean',
        defaultValue: false,
      },
      {
        key: 'installPlaywright',
        label: 'Install Playwright',
        description: 'Install Playwright and browsers during build',
        type: 'boolean',
        defaultValue: true,
        dependency: 'baseImage!=playwright',
      },
      {
        key: 'cacheNodeModules',
        label: 'Cache Node Modules',
        description: 'Optimize build caching for faster rebuilds',
        type: 'boolean',
        defaultValue: true,
      },
    ],
  },
  {
    title: 'Runtime Configuration',
    description: 'Container runtime settings',
    options: [
      {
        key: 'memoryLimit',
        label: 'Memory Limit',
        description: 'Maximum memory allocation for the container',
        type: 'select',
        defaultValue: '2g',
        options: [
          { value: '1g', label: '1GB', description: 'Minimal memory for basic tests' },
          { value: '2g', label: '2GB', description: 'Recommended for most scenarios' },
          { value: '4g', label: '4GB', description: 'For complex test suites' },
          { value: '8g', label: '8GB', description: 'High-memory intensive testing' },
        ],
      },
      {
        key: 'cpuLimit',
        label: 'CPU Limit',
        description: 'Maximum CPU cores for the container',
        type: 'select',
        defaultValue: '2',
        options: [
          { value: '1', label: '1 CPU', description: 'Single-threaded execution' },
          { value: '2', label: '2 CPUs', description: 'Parallel test execution' },
          { value: '4', label: '4 CPUs', description: 'High parallelism' },
          { value: '8', label: '8 CPUs', description: 'Maximum performance' },
        ],
      },
      {
        key: 'healthCheck',
        label: 'Health Check',
        description: 'Enable container health monitoring',
        type: 'boolean',
        defaultValue: false,
      },
    ],
  },
  {
    title: 'Docker Compose Features',
    description: 'Container orchestration options',
    options: [
      {
        key: 'dockerCompose',
        label: 'Generate docker-compose.yml',
        description: 'Create Docker Compose configuration',
        type: 'boolean',
        defaultValue: true,
      },
      {
        key: 'includeDatabase',
        label: 'Include Database Service',
        description: 'Add PostgreSQL database service',
        type: 'boolean',
        defaultValue: false,
        dependency: 'dockerCompose=true',
      },
      {
        key: 'includeRedis',
        label: 'Include Redis Service',
        description: 'Add Redis cache service',
        type: 'boolean',
        defaultValue: false,
        dependency: 'dockerCompose=true',
      },
      {
        key: 'exposeTestResults',
        label: 'Expose Test Results',
        description: 'Mount test results directory as volume',
        type: 'boolean',
        defaultValue: true,
        dependency: 'dockerCompose=true',
      },
    ],
  },
  {
    title: 'CI/CD Integration',
    description: 'Integration with continuous integration',
    options: [
      {
        key: 'generateCIConfig',
        label: 'Generate CI Configuration',
        description: 'Create Docker-based CI workflow files',
        type: 'boolean',
        defaultValue: false,
      },
      {
        key: 'publishImages',
        label: 'Publish Docker Images',
        description: 'Configure image publishing to registry',
        type: 'boolean',
        defaultValue: false,
        dependency: 'generateCIConfig=true',
      },
      {
        key: 'registryUrl',
        label: 'Container Registry',
        description: 'Docker registry URL for publishing images',
        type: 'string',
        defaultValue: 'ghcr.io',
        dependency: 'publishImages=true',
      },
    ],
  },
];

export const DOCKERFILE_TEMPLATES = {
  basic: `FROM {{baseImage}}

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy test files
COPY . .

{{#if installPlaywright}}
# Install Playwright browsers
RUN npx playwright install --with-deps
{{/if}}

# Run tests
CMD ["npm", "test"]`,

  multiStage: `# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Production stage
FROM {{baseImage}} as runner

WORKDIR /app

# Copy only production dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/playwright.config.ts ./
COPY --from=builder /app/tests ./tests

{{#if installPlaywright}}
# Install Playwright browsers
RUN npx playwright install --with-deps
{{/if}}

{{#if healthCheck}}
# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1
{{/if}}

# Run tests
CMD ["npm", "test"]`,

  custom: `FROM {{customImage}}

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Install Playwright and browsers
RUN npm install @playwright/test
RUN npx playwright install --with-deps

# Set environment variables
ENV NODE_ENV=test

# Run tests
CMD ["npx", "playwright", "test"]`,
};

export const DOCKER_COMPOSE_TEMPLATE = `version: '3.8'

services:
  playwright-tests:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - ./test-results:/app/test-results
      - ./playwright-report:/app/playwright-report
    environment:
      - NODE_ENV=test
    {{#if memoryLimit}}
    mem_limit: {{memoryLimit}}
    {{/if}}
    {{#if cpuLimit}}
    cpus: '{{cpuLimit}}'
    {{/if}}
    {{#if healthCheck}}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    {{/if}}
    {{#if includeDatabase}}
    depends_on:
      - postgres
    {{/if}}
    {{#if includeRedis}}
      - redis
    {{/if}}

{{#if includeDatabase}}
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: testdb
      POSTGRES_USER: testuser
      POSTGRES_PASSWORD: testpass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
{{/if}}

{{#if includeRedis}}
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
{{/if}}

{{#if includeDatabase}}
volumes:
  postgres_data:
{{/if}}`;

export const DOCKER_IGNORE_TEMPLATE = `# Dependencies
node_modules
npm-debug.log*

# Test results
test-results
playwright-report

# Environment files
.env
.env.local

# IDE files
.vscode
.idea

# OS files
.DS_Store
Thumbs.db

# Git
.git
.gitignore

# Docker
Dockerfile
.dockerignore
docker-compose.yml

# Documentation
README.md
*.md`;